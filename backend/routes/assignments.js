import express from 'express';
import Assignment from '../models/Assignment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All assignment routes require authentication
router.use(protect);

/**
 * @desc    Get all assignments for the logged-in user
 * @route   GET /api/assignments
 */
router.get('/', async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ userId: req.user.id }).sort({ dueDate: 1 });
    res.json({ success: true, count: assignments.length, data: assignments });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Create a new assignment
 * @route   POST /api/assignments
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, description, dueDate, status } = req.body;
    
    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Please provide a title and due date' });
    }

    const assignment = await Assignment.create({
      userId: req.user.id,
      title,
      description,
      dueDate,
      status: status || 'todo'
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Update an assignment
 * @route   PUT /api/assignments/:id
 */
router.put('/:id', async (req, res, next) => {
  try {
    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Make sure user owns assignment
    if (assignment.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this assignment' });
    }

    assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Delete an assignment
 * @route   DELETE /api/assignments/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Make sure user owns assignment
    if (assignment.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this assignment' });
    }

    await assignment.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
