/**
 * models/Quiz.js — Mongoose schema for a Module Quiz.
 *
 * Each Quiz belongs to exactly one Module and contains an ordered list of
 * multiple-choice questions. The correct option and explanation are stored
 * server-side so they cannot be read by the client before submission.
 */

import mongoose from 'mongoose';

// ── Sub-schema: a single MCQ question ────────────────────────────────────────
const QuestionSchema = new mongoose.Schema(
  {
    // The question prompt (plain text or Markdown for inline code snippets)
    questionText: {
      type: String,
      required: [true, 'Question text is required.'],
      trim: true,
    },

    // 2 to 6 answer choices stored as an array of strings
    options: {
      type: [String],
      required: [true, 'Answer options are required.'],
      validate: {
        validator: (arr) => arr.length >= 2 && arr.length <= 6,
        message: 'Each question must have between 2 and 6 options.',
      },
    },

    // Zero-based index into `options`
    correctOptionIndex: {
      type: Number,
      required: [true, 'Correct option index is required.'],
      min: [0, 'Index must be at least 0.'],
      max: [5, 'Index must be at most 5.'],
    },

    // Shown to the student after submission so they understand WHY
    explanation: {
      type: String,
      default: '',
      trim: true,
    },

    // Marks awarded for a correct answer (supports weighted scoring)
    marks: {
      type: Number,
      default: 1,
      min: [0, 'Marks cannot be negative.'],
    },
  },
  { _id: true } // keep individual question IDs for targeted feedback
);

// ── Main Quiz schema ──────────────────────────────────────────────────────────
const QuizSchema = new mongoose.Schema(
  {
    // Reference to the parent Module document
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module reference is required.'],
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Quiz title is required.'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters.'],
    },

    // Optional short description / instructions shown before the quiz starts
    instructions: {
      type: String,
      default: '',
      trim: true,
    },

    // Time allowed in minutes (null = no time limit)
    timeLimitMinutes: {
      type: Number,
      default: null,
      min: [1, 'Time limit must be at least 1 minute.'],
    },

    // Ordered list of MCQ questions
    questions: {
      type: [QuestionSchema],
      required: [true, 'Questions array is required.'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'A quiz must contain at least one question.',
      },
    },

    // Whether students can see their score immediately after submission
    showResultsImmediately: {
      type: Boolean,
      default: true,
    },

    // Publish toggle (draft quizzes are invisible to students)
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: total marks available ───────────────────────────────────────────
QuizSchema.virtual('totalMarks').get(function () {
  return this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
});

export default mongoose.model('Quiz', QuizSchema);
