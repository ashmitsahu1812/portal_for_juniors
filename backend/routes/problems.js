/**
 * routes/problems.js — Coding Problem API routes.
 *
 * GET /api/problems/module/:moduleId  → problems for a module (NO hidden test cases)
 * GET /api/problems/:id               → single problem detail (visible test cases only)
 * POST /api/problems                  → create problem (admin)
 */

import express from 'express';
import Problem from '../models/Problem.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ── GET /api/problems/module/:moduleId ────────────────────────────────────────
router.get('/module/:moduleId', async (req, res, next) => {
  try {
    const problems = await Problem.find({
      moduleId: req.params.moduleId,
      isPublished: true,
    })
      .select('title difficulty allowedLanguages tags timeLimitSeconds memoryLimitMB')
      .sort({ difficulty: 1 });

    res.json({ success: true, count: problems.length, data: problems });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/problems/:id ─────────────────────────────────────────────────────
// Returns only the VISIBLE test cases to the student (isHidden: false)
router.get('/:id', async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id).select('-__v');
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    // Strip hidden test cases before sending to client
    const problemObj = problem.toObject();
    problemObj.testCases = problemObj.testCases.filter((tc) => !tc.isHidden);

    res.json({ success: true, data: problemObj });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/problems ────────────────────────────────────────────────────────
router.post('/', protect, async (req, res, next) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json({ success: true, data: problem });
  } catch (err) {
    next(err);
  }
});

export default router;
