import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// ── GET /api/progress/leaderboard ─────────────────────────────────────────────
// Public — returns all students ranked by total score
router.get('/leaderboard', async (req, res, next) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('name email progress')
      .lean();

    const ranked = users.map(u => {
      const solvedCount = (u.progress?.solvedProblems || [])
        .filter(p => p.verdict === 'Accepted').length;

      const quizScores = u.progress?.quizScores || [];
      const totalQuizScore = quizScores.reduce((sum, q) => sum + (q.score || 0), 0);
      const totalQuizMax = quizScores.reduce((sum, q) => sum + (q.totalMarks || 0), 0);
      const quizPct = totalQuizMax > 0 ? (totalQuizScore / totalQuizMax) * 100 : 0;

      // Combined score: 50% quiz percentage + 50% problems solved (out of 76 max)
      const totalScore = Math.round((quizPct * 0.5) + (Math.min(solvedCount, 76) / 76) * 100 * 0.5);

      return {
        name: u.name,
        email: u.email,
        solvedCount,
        quizScore: totalQuizScore,
        quizMax: totalQuizMax,
        totalScore,
      };
    });

    // Sort by totalScore desc, then solvedCount desc as tiebreaker
    ranked.sort((a, b) => b.totalScore - a.totalScore || b.solvedCount - a.solvedCount);

    res.json({ success: true, count: ranked.length, data: ranked });
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

    if (existingIndex !== -1) {
      // Only update if previously wasn't Accepted and now is, or just keep latest?
      // Let's just track successful solves for simplicity, but if they want all attempts, we can update.
      // Usually we just want to know if they solved it.
      if (user.progress.solvedProblems[existingIndex].verdict !== 'Accepted' && verdict === 'Accepted') {
        user.progress.solvedProblems[existingIndex].verdict = verdict;
        user.progress.solvedProblems[existingIndex].solvedAt = Date.now();
      }
    } else {
      user.progress.solvedProblems.push({ problemId, verdict });
    }

    await user.save();
    res.json({ success: true, data: user.progress });
  } catch (err) {
    next(err);
  }
});

export default router;
