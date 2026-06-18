/**
 * models/Module.js — Mongoose schema for a Syllabus Module.
 *
 * A Module represents one topic/chapter of the 1st-semester curriculum.
 * It holds metadata plus an array of PDF URLs (cloud-hosted, e.g. Cloudinary/S3).
 */

import mongoose from 'mongoose';

const ModuleSchema = new mongoose.Schema(
  {
    // Human-readable title, e.g. "Introduction to Programming Concepts"
    title: {
      type: String,
      required: [true, 'Module title is required.'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters.'],
    },

    // Default to semester 1 since this platform targets incoming freshmen
    semester: {
      type: Number,
      default: 1,
      min: [1, 'Semester must be at least 1.'],
      max: [8, 'Semester cannot exceed 8.'],
    },

    // Brief overview shown on the Module card in the dashboard
    description: {
      type: String,
      required: [true, 'Module description is required.'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters.'],
    },

    // Array of publicly accessible PDF URLs (lecture notes, slides, etc.)
    pdfUrls: {
      type: [
        {
          label: {
            type: String,
            required: true,
            trim: true, // e.g. "Lecture 1 – Variables & Data Types"
          },
          url: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      default: [],
    },

    // Convenience flag to hide/show modules without deleting them
    isPublished: {
      type: Boolean,
      default: false,
    },

    // Sort order for display in the sidebar (lower = appears first)
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically adds `createdAt` and `updatedAt` timestamps
    timestamps: true,
    // Expose the virtual `id` field (string version of _id) when serialised
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Index ─────────────────────────────────────────────────────────────────────
// Efficient lookup when filtering modules by semester
ModuleSchema.index({ semester: 1, order: 1 });

export default mongoose.model('Module', ModuleSchema);
