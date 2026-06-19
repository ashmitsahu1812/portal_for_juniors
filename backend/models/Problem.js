/**
 * models/Problem.js — Mongoose schema for a Coding Problem.
 *
 * A Problem belongs to one Module and is solved in the Coding Arena.
 * It stores the full problem statement, constraints, allowed languages,
 * and test cases (some hidden to prevent hardcoding answers).
 */

import mongoose from 'mongoose';

// ── Enum constants ────────────────────────────────────────────────────────────
// These map to the languages supported by the Judge0 / Piston API
const ALLOWED_LANGUAGES = ['C', 'C++', 'Python', 'Java'];
const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

// ── Sub-schema: a single test case ────────────────────────────────────────────
const TestCaseSchema = new mongoose.Schema(
  {
    // Raw stdin input that will be fed to the compiled program
    input: {
      type: String,
      default: '',
    },

    // The exact stdout that a correct program must produce (trimmed comparison)
    expectedOutput: {
      type: String,
      required: [true, 'Expected output is required for every test case.'],
    },

    // Hidden test cases are NOT shown to the student; used for final grading
    isHidden: {
      type: Boolean,
      default: false,
    },

    // Human-readable label shown for visible cases, e.g. "Sample Input 1"
    label: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: true }
);

// ── Main Problem schema ───────────────────────────────────────────────────────
const ProblemSchema = new mongoose.Schema(
  {
    // Reference to the parent Module document (optional for community problems)
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      index: true,
    },

    // Identifies if this is a student-submitted problem
    isCommunity: {
      type: Boolean,
      default: false,
    },

    // The user who created the problem (if it's a community problem)
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Problem title is required.'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters.'],
    },

    /**
     * Full problem statement written in Markdown.
     * Supports code blocks, lists, bold/italic, LaTeX math (if renderer supports it).
     */
    description: {
      type: String,
      required: [true, 'Problem description is required.'],
    },

    difficulty: {
      type: String,
      enum: {
        values: DIFFICULTY_LEVELS,
        message: `Difficulty must be one of: ${DIFFICULTY_LEVELS.join(', ')}.`,
      },
      required: [true, 'Difficulty level is required.'],
    },

    /**
     * Constraints section shown beneath the problem statement.
     * e.g. "1 ≤ N ≤ 10^5, Time limit: 1s, Memory: 256MB"
     */
    constraints: {
      type: String,
      default: '',
      trim: true,
    },

    // Which languages students can submit in for this specific problem
    allowedLanguages: {
      type: [String],
      enum: {
        values: ALLOWED_LANGUAGES,
        message: `Each language must be one of: ${ALLOWED_LANGUAGES.join(', ')}.`,
      },
      default: ALLOWED_LANGUAGES, // by default all 4 are allowed
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one language must be allowed.',
      },
    },

    // Mix of visible (sample) and hidden (grading) test cases
    testCases: {
      type: [TestCaseSchema],
      required: [true, 'Test cases are required.'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'A problem must contain at least one test case.',
      },
    },

    // Boilerplate starter code per language (optional, shown in editor on load)
    starterCode: {
      type: Map,
      of: String,
      default: {},
      // Keys should match values in ALLOWED_LANGUAGES, e.g. { "Python": "# Write your solution here" }
    },

    // Time limit in seconds for code execution (sent to Judge0/Piston)
    timeLimitSeconds: {
      type: Number,
      default: 2,
      min: [1, 'Time limit must be at least 1 second.'],
      max: [15, 'Time limit cannot exceed 15 seconds.'],
    },

    // Memory limit in MB
    memoryLimitMB: {
      type: Number,
      default: 256,
      min: [16, 'Memory limit must be at least 16 MB.'],
      max: [512, 'Memory limit cannot exceed 512 MB.'],
    },

    // Tags for filtering, e.g. ["Arrays", "Loops", "Strings"]
    tags: {
      type: [String],
      default: [],
    },

    // Users who have successfully solved this problem (verdict: Accepted)
    solvedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],

    // Publish toggle
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

// ── Virtuals ──────────────────────────────────────────────────────────────────

// Count of visible (sample) test cases
ProblemSchema.virtual('sampleTestCaseCount').get(function () {
  return (this.testCases ?? []).filter((tc) => !tc.isHidden).length;
});

// Count of hidden (grading) test cases
ProblemSchema.virtual('hiddenTestCaseCount').get(function () {
  return (this.testCases ?? []).filter((tc) => tc.isHidden).length;
});

// ── Indexes ───────────────────────────────────────────────────────────────────
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ tags: 1 });

export default mongoose.model('Problem', ProblemSchema);
