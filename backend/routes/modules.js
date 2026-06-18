/**
 * routes/modules.js — Syllabus Module API routes.
 *
 * GET  /api/modules          → list all published modules (sorted by semester/order)
 * GET  /api/modules/:id      → fetch a single module with its PDF list
 * POST /api/modules          → create a new module (admin only in future)
 */

import express from 'express';
import Module from '../models/Module.js';

const router = express.Router();

// ── GET /api/modules ──────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { semester } = req.query;
    const filter = { isPublished: true };
    if (semester) filter.semester = Number(semester);

    const modules = await Module.find(filter)
      .sort({ semester: 1, order: 1 })
      .select('-__v');

    res.json({ success: true, count: modules.length, data: modules });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/modules/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id).select('-__v');
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }
    res.json({ success: true, data: module });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/modules ─────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const module = await Module.create(req.body);
    res.status(201).json({ success: true, data: module });
  } catch (err) {
    next(err);
  }
});

export default router;
