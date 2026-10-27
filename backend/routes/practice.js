import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Problem from '../models/Problem.js';

const router = express.Router();
const cache = new Map();
const CACHE_MS = 5 * 60 * 1000;

const topicAliases = {
  Arrays: ['array', 'list', 'sequence', 'prefix sum'],
  Implementation: ['implementation', 'basic i/o', 'control flow', 'conditional', 'loop', 'programming fundamentals'],
  Strings: ['string', 'substring'],
  Stacks: ['stack'],
  'Binary Search': ['binary search'],
  Math: ['math', 'arithmetic', 'number theory', 'discrete mathematics'],
  'Sliding Window': ['sliding window', 'substring'],
  'Dynamic Programming': ['dynamic programming', 'dp'],
  Graphs: ['graph', 'tree'],
  'Linked Lists': ['linked list', 'data structures'],
};

const curatedProblems = [
  { id: 'lc-two-sum', platform: 'leetcode', topic: 'Arrays', title: 'Two Sum', titleSlug: 'two-sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/' },
  { id: 'cf-4a', platform: 'codeforces', topic: 'Implementation', title: 'Watermelon', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/4/A', codeforces: { contestId: 4, index: 'A' } },
  { id: 'lc-best-time-to-buy-and-sell-stock', platform: 'leetcode', topic: 'Arrays', title: 'Best Time to Buy and Sell Stock', titleSlug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 'cf-71a', platform: 'codeforces', topic: 'Strings', title: 'Way Too Long Words', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/71/A', codeforces: { contestId: 71, index: 'A' } },
  { id: 'lc-valid-parentheses', platform: 'leetcode', topic: 'Stacks', title: 'Valid Parentheses', titleSlug: 'valid-parentheses', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 'cf-231a', platform: 'codeforces', topic: 'Implementation', title: 'Team', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/231/A', codeforces: { contestId: 231, index: 'A' } },
  { id: 'lc-binary-search', platform: 'leetcode', topic: 'Binary Search', title: 'Binary Search', titleSlug: 'binary-search', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-search/' },
  { id: 'cf-486a', platform: 'codeforces', topic: 'Math', title: 'Calculating Function', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/486/A', codeforces: { contestId: 486, index: 'A' } },
  { id: 'lc-longest-substring-without-repeating-characters', platform: 'leetcode', topic: 'Sliding Window', title: 'Longest Substring Without Repeating Characters', titleSlug: 'longest-substring-without-repeating-characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 'cf-158a', platform: 'codeforces', topic: 'Implementation', title: 'Next Round', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/158/A', codeforces: { contestId: 158, index: 'A' } },
  { id: 'lc-3sum', platform: 'leetcode', topic: 'Arrays', title: '3Sum', titleSlug: '3sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/' },
  { id: 'lc-coin-change', platform: 'leetcode', topic: 'Dynamic Programming', title: 'Coin Change', titleSlug: 'coin-change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' },
  { id: 'lc-number-of-islands', platform: 'leetcode', topic: 'Graphs', title: 'Number of Islands', titleSlug: 'number-of-islands', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
  { id: 'cf-580a', platform: 'codeforces', topic: 'Dynamic Programming', title: 'Kefa and First Steps', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/580/A', codeforces: { contestId: 580, index: 'A' } },
  { id: 'lc-merge-k-sorted-lists', platform: 'leetcode', topic: 'Linked Lists', title: 'Merge k Sorted Lists', titleSlug: 'merge-k-sorted-lists', difficulty: 'Hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
];

export function matchLeetCodeCuratedProblems(submissions, problems = curatedProblems) {
  const acceptedSlugs = new Set(submissions.map(item => item.titleSlug).filter(Boolean));
  return problems.filter(problem =>
    problem.platform === 'leetcode' && problem.titleSlug && acceptedSlugs.has(problem.titleSlug)
  );
}

async function cached(key, loader) {
  const existing = cache.get(key);
  if (existing && Date.now() - existing.at < CACHE_MS) return existing.data;
  const data = await loader();
  cache.set(key, { at: Date.now(), data });
  return data;
}

async function codeforces(path) {
  const response = await fetch(`https://codeforces.com/api/${path}`, {
    headers: { 'User-Agent': 'KickStartStudentPortal/1.0' },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Codeforces API returned ${response.status}`);
  const payload = await response.json();
  if (payload.status !== 'OK') throw new Error(payload.comment || 'Codeforces API request failed');
  return payload.result;
}

async function fetchCodeforcesUser(handle) {
  const users = await codeforces(`user.info?handles=${encodeURIComponent(handle)}`);
  return users[0] || null;
}

// Best-effort only: LeetCode's undocumented public GraphQL query returns recent accepted submissions, not full solve history.
async function fetchLeetCodeAcceptedSubmissions(username) {
  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'KickStartStudentPortal/1.0',
      Referer: 'https://leetcode.com/',
    },
    body: JSON.stringify({
      query: 'query recentAcSubmissionList($username: String!, $limit: Int!) { recentAcSubmissionList(username: $username, limit: $limit) { title titleSlug } }',
      variables: { username, limit: 20 },
    }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`LeetCode submissions API returned ${response.status}`);
  const payload = await response.json();
  const submissions = payload.data?.recentAcSubmissionList;
  if (payload.errors?.length || !Array.isArray(submissions)) {
    throw new Error(payload.errors?.[0]?.message || 'LeetCode accepted submissions are unavailable.');
  }
  return submissions;
}

async function fetchLeetCodeStats(username) {
  const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${encodeURIComponent(username)}`, {
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`LeetCode stats API returned ${response.status}`);
  const payload = await response.json();
  if (payload.status !== 'success') throw new Error(payload.message || 'Unable to load LeetCode stats');
  return payload;
}

router.put('/profiles', protect, async (req, res, next) => {
  try {
    const leetcode = String(req.body.leetcode || '').trim();
    const codeforcesHandle = String(req.body.codeforces || '').trim();
    if (leetcode && !/^[\w.-]{1,50}$/.test(leetcode)) {
      return res.status(400).json({ success: false, message: 'Enter a valid LeetCode username.' });
    }
    if (codeforcesHandle && !/^[A-Za-z0-9_.-]{1,24}$/.test(codeforcesHandle)) {
      return res.status(400).json({ success: false, message: 'Enter a valid Codeforces handle.' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.externalProfiles = { leetcode, codeforces: codeforcesHandle };
    await user.save();
    res.json({ success: true, data: user.externalProfiles });
  } catch (err) {
    next(err);
  }
});

router.get('/stats', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('externalProfiles');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const profiles = user.externalProfiles || {};
    const stats = { leetcode: null, codeforces: null, errors: {} };
    const requests = [];
    if (profiles.leetcode) {
      requests.push(cached(`lc:${profiles.leetcode}`, () => fetchLeetCodeStats(profiles.leetcode))
        .then(data => { stats.leetcode = data; })
        .catch(err => { stats.errors.leetcode = err.message; }));
    }
    if (profiles.codeforces) {
      requests.push(cached(`cf:${profiles.codeforces.toLowerCase()}`, () => fetchCodeforcesUser(profiles.codeforces))
        .then(data => { stats.codeforces = data; })
        .catch(err => { stats.errors.codeforces = err.message; }));
    }
    await Promise.all(requests);
    res.json({ success: true, profiles, stats });
  } catch (err) {
    next(err);
  }
});

router.get('/leaderboard', protect, async (_req, res, next) => {
  try {
    const users = await User.find({ role: 'student', 'externalProfiles.codeforces': { $nin: ['', null] } })
      .select('name externalProfiles.codeforces').lean();
    const handles = [...new Set(users.map(user => user.externalProfiles.codeforces))];
    if (!handles.length) return res.json({ success: true, data: [] });
    const rankedUsers = await cached(`cf-leaderboard:${handles.sort().join(',')}`, async () => {
      const ratings = [];
      for (let offset = 0; offset < handles.length; offset += 100) {
        const batch = handles.slice(offset, offset + 100);
        const results = await codeforces(`user.info?handles=${encodeURIComponent(batch.join(';'))}`);
        ratings.push(...results);
      }
      return ratings;
    });
    const byHandle = new Map(rankedUsers.map(entry => [entry.handle.toLowerCase(), entry]));
    const data = users.map(user => {
      const profile = byHandle.get(user.externalProfiles.codeforces.toLowerCase());
      return profile ? { _id: user._id, name: user.name, handle: profile.handle, rating: profile.rating || 0, maxRating: profile.maxRating || 0, rank: profile.rank || 'unrated', maxRank: profile.maxRank || 'unrated' } : null;
    }).filter(Boolean).sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get('/contests', async (_req, res, next) => {
  try {
    const contests = await cached('cf-contests', () => codeforces('contest.list'));
    const upcoming = contests.filter(contest => contest.phase === 'BEFORE')
      .map(contest => ({ id: contest.id, name: contest.name, startTimeSeconds: contest.startTimeSeconds, durationSeconds: contest.durationSeconds, type: contest.type }))
      .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
    res.json({ success: true, data: upcoming });
  } catch (err) {
    next(err);
  }
});

router.get('/daily', async (_req, res, next) => {
  try {
    const challenge = await cached('leetcode-daily', async () => {
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'KickStartStudentPortal/1.0' },
        body: JSON.stringify({ query: '{ activeDailyCodingChallengeQuestion { date link question { title titleSlug difficulty } } }' }),
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) throw new Error(`LeetCode daily API returned ${response.status}`);
      const payload = await response.json();
      const item = payload.data?.activeDailyCodingChallengeQuestion;
      if (!item) throw new Error('Daily challenge is unavailable.');
      return { date: item.date, title: item.question.title, slug: item.question.titleSlug, difficulty: item.question.difficulty, url: `https://leetcode.com${item.link}` };
    });
    res.json({ success: true, data: challenge });
  } catch (err) {
    next(err);
  }
});

router.get('/problems', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('externalPracticeDone externalPracticeSources');
    const completed = new Set(user?.externalPracticeDone || []);
    const sources = user?.externalPracticeSources || new Map();
    const data = curatedProblems.map(problem => ({
      ...problem,
      completed: completed.has(problem.id),
      completionSource: sources.get?.(problem.id) || (completed.has(problem.id) ? 'manual' : null),
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get('/recommendations', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('externalProfiles externalPracticeDone progress.solvedProblems progress.quizScores')
      .populate('progress.quizScores.moduleId', 'title description')
      .lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const availableProblems = await Problem.find({ isPublished: true }).select('title difficulty tags').lean();
    const acceptedIds = new Set((user.progress?.solvedProblems || [])
      .filter(item => item.verdict === 'Accepted')
      .map(item => item.problemId?.toString())
      .filter(Boolean));
    const attemptedIds = new Set((user.progress?.solvedProblems || [])
      .map(item => item.problemId?.toString())
      .filter(Boolean));
    const solvedProblems = availableProblems.filter(problem => acceptedIds.has(problem._id.toString()));
    const completed = new Set(user.externalPracticeDone || []);
    const topicInsights = Object.fromEntries(Object.entries(topicAliases).map(([topic, aliases]) => {
      const matchesTopic = value => aliases.some(alias => String(value || '').toLowerCase().includes(alias));
      const arenaProblems = availableProblems.filter(problem => (problem.tags || []).some(matchesTopic));
      const solvedTopicProblems = solvedProblems.filter(problem => (problem.tags || []).some(matchesTopic));
      const quizzes = (user.progress?.quizScores || []).filter(score => {
        const module = score.moduleId;
        return module && matchesTopic(`${module.title || ''} ${module.description || ''}`);
      });
      const quizAverage = quizzes.length
        ? Math.round(quizzes.reduce((sum, score) => sum + (score.totalMarks > 0 ? score.score / score.totalMarks * 100 : 0), 0) / quizzes.length)
        : null;
      const arenaSolved = solvedTopicProblems.length;
      const arenaTotal = arenaProblems.length;
      const reasons = [];
      if (quizAverage !== null && quizAverage < 75) {
        const moduleNames = [...new Set(quizzes.map(score => score.moduleId.title))].join(', ');
        reasons.push(`${moduleNames} quiz average is ${quizAverage}%`);
      }
      if (arenaTotal && arenaSolved / arenaTotal < 0.6) {
        reasons.push(`Solved ${arenaSolved} of ${arenaTotal} tagged Coding Arena problems`);
      }
      const quizWeakness = quizAverage === null ? 0 : (100 - quizAverage) * 0.55;
      const arenaWeakness = arenaTotal ? (1 - arenaSolved / arenaTotal) * 30 : 0;
      const hasEvidence = quizAverage !== null || arenaTotal > 0;
      const priority = hasEvidence ? quizWeakness + arenaWeakness : 5;
      return [topic, { quizAverage, arenaSolved, arenaTotal, priority, reasons }];
    }));

    const profile = user.externalProfiles || {};
    const [cfProfile, lcStats] = await Promise.all([
      profile.codeforces
        ? cached(`cf:${profile.codeforces.toLowerCase()}`, () => fetchCodeforcesUser(profile.codeforces)).catch(() => null)
        : null,
      profile.leetcode
        ? cached(`lc:${profile.leetcode}`, () => fetchLeetCodeStats(profile.leetcode)).catch(() => null)
        : null,
    ]);
    const easySolved = solvedProblems.filter(problem => problem.difficulty === 'Easy').length;
    const mediumSolved = solvedProblems.filter(problem => problem.difficulty === 'Medium').length;
    const signals = [
      (cfProfile?.rating || 0) >= 1600 || (lcStats?.mediumSolved || 0) >= 20 || mediumSolved >= 3,
      (cfProfile?.rating || 0) >= 1000 || (lcStats?.easySolved || 0) >= 20 || easySolved >= 6,
    ];
    const difficulty = signals[0] ? 'Hard' : signals[1] ? 'Medium' : 'Easy';
    const difficultyReason = cfProfile?.rating
      ? `Based on your Codeforces rating (${cfProfile.rating}) and solved-problem history.`
      : lcStats
        ? `Based on your LeetCode difficulty counts and Coding Arena history.`
        : mediumSolved >= 3 || easySolved >= 6
          ? `Based on ${easySolved} Easy and ${mediumSolved} Medium Coding Arena solves.`
          : 'Starting at Easy until more linked-profile or Coding Arena history is available.';

    const difficultyOrder = difficulty === 'Hard' ? ['Hard', 'Medium', 'Easy'] : difficulty === 'Medium' ? ['Medium', 'Easy'] : ['Easy'];
    const targetDifficulty = difficultyOrder.find(level => curatedProblems.some(problem =>
      problem.difficulty === level && !completed.has(problem.id)
    )) || difficulty;
    const recommendations = curatedProblems
      .filter(problem => problem.difficulty === targetDifficulty && !completed.has(problem.id))
      .map(problem => {
        const insight = topicInsights[problem.topic];
        return {
          ...problem,
          reason: insight.reasons.length
            ? insight.reasons.join(' · ')
            : insight.arenaTotal || insight.quizAverage !== null
              ? 'Keep building your skills in this topic.'
              : 'Try a new topic to build a stronger practice history.',
          topicPriority: insight.priority,
        };
      })
      .sort((a, b) => b.topicPriority - a.topicPriority)
      .slice(0, 4)
      .map(({ topicPriority, ...problem }) => problem);

    res.json({
      success: true,
      data: {
        difficulty: targetDifficulty,
        difficultyReason,
        recommendations,
        topicInsights,
        history: { attemptedArenaProblems: attemptedIds.size, solvedArenaProblems: acceptedIds.size, easySolved, mediumSolved },
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/problems/:id/toggle', protect, async (req, res, next) => {
  try {
    if (!curatedProblems.some(problem => problem.id === req.params.id)) {
      return res.status(404).json({ success: false, message: 'Curated problem not found.' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const completed = new Set(user.externalPracticeDone || []);
    const sources = user.externalPracticeSources || new Map();
    if (completed.has(req.params.id)) {
      completed.delete(req.params.id);
      sources.delete?.(req.params.id);
    } else {
      completed.add(req.params.id);
      sources.set?.(req.params.id, 'manual');
    }
    user.externalPracticeDone = [...completed];
    user.externalPracticeSources = sources;
    await user.save();
    res.json({ success: true, completed: completed.has(req.params.id) });
  } catch (err) {
    next(err);
  }
});

router.post('/sync-codeforces', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const handle = user?.externalProfiles?.codeforces;
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (!handle) return res.status(400).json({ success: false, message: 'Link a Codeforces handle first.' });
    const submissions = await cached(`cf-submissions:${handle.toLowerCase()}`, () => codeforces(`user.status?handle=${encodeURIComponent(handle)}`));
    const accepted = new Set(submissions.filter(item => item.verdict === 'OK' && item.problem?.contestId && item.problem?.index)
      .map(item => `${item.problem.contestId}:${item.problem.index}`));
    const completed = new Set(user.externalPracticeDone || []);
    const sources = user.externalPracticeSources || new Map();
    let syncedCurated = 0;
    curatedProblems.forEach(problem => {
      if (problem.codeforces && accepted.has(`${problem.codeforces.contestId}:${problem.codeforces.index}`)) {
        completed.add(problem.id);
        sources.set?.(problem.id, 'codeforces');
        syncedCurated += 1;
      }
    });
    user.externalPracticeDone = [...completed];
    user.externalPracticeSources = sources;
    const arenaProblems = await Problem.find({ 'externalCodeforces.contestId': { $exists: true }, 'externalCodeforces.index': { $exists: true } }).select('_id externalCodeforces');
    let newArenaSolves = 0;
    arenaProblems.forEach(problem => {
      const key = `${problem.externalCodeforces.contestId}:${problem.externalCodeforces.index}`;
      if (!accepted.has(key)) return;
      const existing = user.progress.solvedProblems.find(item => item.problemId?.toString() === problem._id.toString());
      if (existing) {
        if (existing.verdict !== 'Accepted') {
          existing.verdict = 'Accepted';
          existing.solvedAt = new Date();
          newArenaSolves += 1;
        }
      } else {
        user.progress.solvedProblems.push({ problemId: problem._id, verdict: 'Accepted' });
        newArenaSolves += 1;
      }
    });
    await user.save();
    res.json({ success: true, data: { syncedCurated, newArenaSolves, submissionsChecked: submissions.length } });
  } catch (err) {
    next(err);
  }
});

router.post('/sync-leetcode', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const username = user?.externalProfiles?.leetcode;
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (!username) return res.status(400).json({ success: false, message: 'Link a LeetCode username first.' });

    const submissions = await cached(`lc-submissions:${username.toLowerCase()}`, () => fetchLeetCodeAcceptedSubmissions(username));
    const completed = new Set(user.externalPracticeDone || []);
    const sources = user.externalPracticeSources || new Map();
    const matchedProblems = matchLeetCodeCuratedProblems(submissions);
    matchedProblems.forEach(problem => {
      completed.add(problem.id);
      sources.set?.(problem.id, 'leetcode');
    });
    const syncedCurated = matchedProblems.length;
    user.externalPracticeDone = [...completed];
    user.externalPracticeSources = sources;
    await user.save();

    res.json({
      success: true,
      data: { syncedCurated, submissionsChecked: submissions.length, submissionLimit: 20 },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
