import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Problem from '../models/Problem.js';

const router = express.Router();

// Helper to record activity (streaks and active days)
function recordUserActivity(user) {
  if (!user.progress.activity) {
    user.progress.activity = { streak: 0, lastActiveDate: null, activeDays: [] };
  }
  const activity = user.progress.activity;
  
  const today = new Date().toISOString().split('T')[0];
  if (activity.lastActiveDate === today) return;
  
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];
  
  if (activity.lastActiveDate === yesterday) {
    activity.streak += 1;
  } else {
    activity.streak = 1;
  }
  
  activity.lastActiveDate = today;
  if (!activity.activeDays.includes(today)) {
    activity.activeDays.push(today);
  }
}

// ── GET /api/progress/leaderboard ─────────────────────────────────────────────
// Public — returns all students ranked by total score
router.get('/leaderboard', async (req, res, next) => {
  try {
    // Dynamically count total available problems (curriculum + community)
    const totalProblems = await Problem.countDocuments({ isPublished: true }) || 1;

    const users = await User.find({ role: 'student' })
      .select('_id name progress')
      .lean();

    const ranked = users.map(u => {
      const solvedCount = (u.progress?.solvedProblems || [])
        .filter(p => p.verdict === 'Accepted').length;

      const quizScores = u.progress?.quizScores || [];
      const totalQuizScore = quizScores.reduce((sum, q) => sum + (q.score || 0), 0);
      const totalQuizMax = quizScores.reduce((sum, q) => sum + (q.totalMarks || 0), 0);
      const quizPct = totalQuizMax > 0 ? (totalQuizScore / totalQuizMax) * 100 : 0;

      const battleRating = u.progress?.rating || 0;

      // Combined score: 50% quiz percentage + 50% problems solved ratio + battle rating
      const totalScore = Math.round((quizPct * 0.5) + (Math.min(solvedCount, totalProblems) / totalProblems) * 100 * 0.5) + battleRating;

      return {
        _id: u._id,
        name: u.name,
        solvedCount,
        quizScore: totalQuizScore,
        quizMax: totalQuizMax,
        battleRating,
        totalScore,
        totalProblems,
      };
    });

    // Sort by totalScore desc, then solvedCount desc as tiebreaker
    ranked.sort((a, b) => b.totalScore - a.totalScore || b.solvedCount - a.solvedCount);

    res.json({ success: true, count: ranked.length, totalProblems, data: ranked });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/progress/quiz ───────────────────────────────────────────────────
// Body: { moduleId, score, totalMarks }
router.post('/quiz', protect, async (req, res, next) => {
  try {
    const { moduleId, score, totalMarks } = req.body;
    
    if (!moduleId || score === undefined || totalMarks === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Check if score already exists for this module
    const existingScoreIndex = user.progress.quizScores.findIndex(
      qs => qs.moduleId.toString() === moduleId
    );

    if (existingScoreIndex !== -1) {
      // Update only if new score is higher
      if (score > user.progress.quizScores[existingScoreIndex].score) {
        user.progress.quizScores[existingScoreIndex].score = score;
        user.progress.quizScores[existingScoreIndex].totalMarks = totalMarks;
        user.progress.quizScores[existingScoreIndex].completedAt = Date.now();
      }
    } else {
      // Add new score
      user.progress.quizScores.push({ moduleId, score, totalMarks });
      // Add to completed modules if not there
      if (!user.progress.completedModules.includes(moduleId)) {
        user.progress.completedModules.push(moduleId);
      }
    }

    recordUserActivity(user);
    user.markModified('progress.activity');

    await user.save();
    
    res.json({ success: true, data: user.progress });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/progress/problem ────────────────────────────────────────────────
// Body: { problemId, verdict }
router.post('/problem', protect, async (req, res, next) => {
  try {
    const { problemId, verdict } = req.body;

    if (!problemId || !verdict) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const existingIndex = user.progress.solvedProblems.findIndex(
      sp => sp.problemId.toString() === problemId
    );

    let isNewAccept = false;

    if (existingIndex !== -1) {
      if (user.progress.solvedProblems[existingIndex].verdict !== 'Accepted' && verdict === 'Accepted') {
        user.progress.solvedProblems[existingIndex].verdict = verdict;
        user.progress.solvedProblems[existingIndex].solvedAt = Date.now();
        isNewAccept = true;
      }
    } else {
      user.progress.solvedProblems.push({ problemId, verdict });
      if (verdict === 'Accepted') isNewAccept = true;
    }

    if (verdict === 'Accepted') {
      recordUserActivity(user);
      user.markModified('progress.activity');
    }

    await user.save();

    // Also record the solver on the Problem document (for community solver display)
    if (isNewAccept) {
      await Problem.findByIdAndUpdate(problemId, {
        $addToSet: { solvedBy: user._id }
      });
    }

    res.json({ success: true, data: user.progress });
  } catch (err) {
    next(err);
  }
});

export default router;
