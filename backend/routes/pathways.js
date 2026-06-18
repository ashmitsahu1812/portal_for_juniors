import express from 'express';
import { protect } from '../middleware/auth.js';
import Pathway from '../models/Pathway.js';

const router = express.Router();

// ── GET /api/pathways ─────────────────────────────────────────────────────────
// Get all pathways (basic info)
router.get('/', protect, async (req, res, next) => {
  try {
    const pathways = await Pathway.find({ isActive: true }).select('title description icon levels.levelNumber');
    res.json({ success: true, data: pathways });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/pathways/:id ─────────────────────────────────────────────────────
// Get full pathway with populated problems
router.get('/:id', protect, async (req, res, next) => {
  try {
    const pathway = await Pathway.findById(req.params.id).populate('levels.problems', 'title difficulty tags _id');
    if (!pathway) {
      return res.status(404).json({ success: false, message: 'Pathway not found' });
    }
    res.json({ success: true, data: pathway });
  } catch (err) {
    next(err);
  }
});

export default router;
