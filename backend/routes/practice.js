import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Problem from '../models/Problem.js';

const router = express.Router();
const cache = new Map();
const CACHE_MS = 5 * 60 * 1000;

const curatedProblems = [
  { id: 'lc-two-sum', platform: 'leetcode', topic: 'Arrays', title: 'Two Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/' },
  { id: 'cf-4a', platform: 'codeforces', topic: 'Implementation', title: 'Watermelon', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/4/A', codeforces: { contestId: 4, index: 'A' } },
  { id: 'lc-best-time-to-buy-and-sell-stock', platform: 'leetcode', topic: 'Arrays', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 'cf-71a', platform: 'codeforces', topic: 'Strings', title: 'Way Too Long Words', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/71/A', codeforces: { contestId: 71, index: 'A' } },
  { id: 'lc-valid-parentheses', platform: 'leetcode', topic: 'Stacks', title: 'Valid Parentheses', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 'cf-231a', platform: 'codeforces', topic: 'Implementation', title: 'Team', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/231/A', codeforces: { contestId: 231, index: 'A' } },
  { id: 'lc-binary-search', platform: 'leetcode', topic: 'Binary Search', title: 'Binary Search', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-search/' },
  { id: 'cf-486a', platform: 'codeforces', topic: 'Math', title: 'Calculating Function', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/486/A', codeforces: { contestId: 486, index: 'A' } },
  { id: 'lc-longest-substring-without-repeating-characters', platform: 'leetcode', topic: 'Sliding Window', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 'cf-158a', platform: 'codeforces', topic: 'Implementation', title: 'Next Round', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/158/A', codeforces: { contestId: 158, index: 'A' } },
  { id: 'lc-3sum', platform: 'leetcode', topic: 'Arrays', title: '3Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/' },
  { id: 'lc-coin-change', platform: 'leetcode', topic: 'Dynamic Programming', title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' },
  { id: 'lc-number-of-islands', platform: 'leetcode', topic: 'Graphs', title: 'Number of Islands', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
  { id: 'cf-580a', platform: 'codeforces', topic: 'Dynamic Programming', title: 'Kefa and First Steps', difficulty: 'Easy', url: 'https://codeforces.com/problemset/problem/580/A', codeforces: { contestId: 580, index: 'A' } },
  { id: 'lc-merge-k-sorted-lists', platform: 'leetcode', topic: 'Linked Lists', title: 'Merge k Sorted Lists', difficulty: 'Hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
];

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
    const user = await User.findById(req.user.id).select('externalPracticeDone');
    const completed = new Set(user?.externalPracticeDone || []);
    const data = curatedProblems.map(problem => ({ ...problem, completed: completed.has(problem.id) }));
    res.json({ success: true, data });
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
    if (completed.has(req.params.id)) completed.delete(req.params.id);
    else completed.add(req.params.id);
    user.externalPracticeDone = [...completed];
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
    let syncedCurated = 0;
    curatedProblems.forEach(problem => {
      if (problem.codeforces && accepted.has(`${problem.codeforces.contestId}:${problem.codeforces.index}`)) {
        completed.add(problem.id);
        syncedCurated += 1;
      }
    });
    user.externalPracticeDone = [...completed];
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

export default router;
