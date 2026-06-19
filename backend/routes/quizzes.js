/**
 * routes/quizzes.js — Quiz & auto-grading API routes.
 *
 * GET  /api/quizzes/module/:moduleId   → fetch quiz for a module (questions, NO answers)
 * POST /api/quizzes/:id/submit         → submit answers → receive instant score + explanations
 */

import express from 'express';
import Quiz from '../models/Quiz.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ── GET /api/quizzes/module/:moduleId ─────────────────────────────────────────
// Returns the quiz without exposing correctOptionIndex or explanation
router.get('/module/:moduleId', async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      moduleId: req.params.moduleId,
      isPublished: true,
    }).select('-questions.correctOptionIndex -questions.explanation -__v');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'No quiz found for this module.' });
    }

    res.json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/quizzes/:id/submit ──────────────────────────────────────────────
/**
 * Request body:
 *   { answers: [{ questionId: string, selectedOptionIndex: number }] }
 *
 * Response:
 *   { score, totalMarks, percentage, results: [{ questionId, isCorrect, explanation, correctOptionIndex }] }
 */
router.post('/:id/submit', async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: '`answers` must be an array.' });
    }

    // Build a lookup map: questionId → student's selected index
    const answerMap = new Map(
      answers.map(({ questionId, selectedOptionIndex }) => [
        questionId,
        selectedOptionIndex,
      ])
    );

    let earnedMarks = 0;
    const totalMarks = quiz.totalMarks;

    const results = quiz.questions.map((question) => {
      const studentIndex = answerMap.get(question._id.toString());
      const isCorrect = studentIndex === question.correctOptionIndex;
      if (isCorrect) earnedMarks += question.marks;

      return {
        questionId: question._id,
        questionText: question.questionText,
        selectedOptionIndex: studentIndex ?? null, // null if skipped
        correctOptionIndex: question.correctOptionIndex,
        isCorrect,
        explanation: question.explanation,
        marks: question.marks,
      };
    });

    res.json({
      success: true,
      data: {
        score: earnedMarks,
        totalMarks,
        percentage: Math.round((earnedMarks / totalMarks) * 100),
        timeTakenSeconds: req.body.timeTakenSeconds ?? null,
        results,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/quizzes ─────────────────────────────────────────────────────────
router.post('/', protect, async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
});

export default router;
