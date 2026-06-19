import express from 'express';
import Problem from '../models/Problem.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/community/problems
// Fetch all community problems
router.get('/problems', async (req, res, next) => {
  try {
    const problems = await Problem.find({ isCommunity: true })
      .populate('authorId', 'name')
      .populate('solvedBy', 'name')
      .sort({ createdAt: -1 })
      .lean();
      
    const safeProblems = problems.map(p => ({
      ...p,
      testCases: p.testCases.filter(tc => !tc.isHidden)
    }));
      
    res.json({ success: true, problems: safeProblems });
  } catch (err) {
    next(err);
  }
});

// POST /api/community/problems
// Create a new community problem
router.post('/problems', protect, async (req, res, next) => {
  try {
    const { title, description, difficulty, testCases } = req.body;
    
    // Basic validation
    if (!title || !description || !difficulty || !testCases || testCases.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields or test cases.' });
    }

    const newProblem = new Problem({
      title,
      description,
      difficulty,
      testCases,
      isCommunity: true,
      authorId: req.user.id,
      allowedLanguages: ['C', 'C++', 'Python', 'Java'], // default allowed
      isPublished: true // Auto-publish for now
    });

    await newProblem.save();
    res.status(201).json({ success: true, problem: newProblem });
  } catch (err) {
    next(err);
  }
});

export default router;
