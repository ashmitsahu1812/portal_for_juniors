import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

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
