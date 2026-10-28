/**
 * scripts/striver/import.js — import (or update) the Striver SDE Sheet
 * into MongoDB as Coding Arena problems under their own module.
 *
 * Idempotent: problems are keyed by { moduleId, sheet.slug }, so re-running
 * updates content in place without creating duplicates.
 *
 * Run from backend/:  node scripts/striver/import.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../../models/Module.js';
import Problem from '../../models/Problem.js';
import { sheetProblems } from './registry.js';
import { buildTestCases, buildDescription, starterCode, SHEET_TAG } from './helpers.js';

dotenv.config();

const MODULE_TITLE = 'Striver SDE Sheet';

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('✅ Connected to MongoDB.');

  let sheetModule = await Module.findOne({ title: MODULE_TITLE });
  if (!sheetModule) {
    sheetModule = new Module({
      title: MODULE_TITLE,
      description: 'Solve Striver’s SDE Sheet interview problems directly in the Coding Arena, judged with sample and hidden test cases.',
      semester: 1,
      isPublished: true,
      order: 5,
    });
    await sheetModule.save();
    console.log(`📁 Created module "${MODULE_TITLE}" (${sheetModule._id})`);
  } else {
    sheetModule.isPublished = true;
    await sheetModule.save();
  }

  const problems = sheetProblems();
  let created = 0;
  let updated = 0;

  for (const entry of problems) {
    const testCases = buildTestCases(entry);
    const description = buildDescription(entry, testCases);

    let doc = await Problem.findOne({ moduleId: sheetModule._id, 'sheet.slug': entry.slug });
    const isNew = !doc;
    if (!doc) doc = new Problem({ moduleId: sheetModule._id, title: entry.title });

    doc.title = entry.title;
    doc.description = description;
    doc.difficulty = entry.difficulty;
    doc.constraints = entry.constraints;
    doc.allowedLanguages = ['C', 'C++', 'Python', 'Java'];
    doc.testCases = testCases;
    doc.starterCode = starterCode;
    doc.timeLimitSeconds = 2;
    doc.memoryLimitMB = 256;
    doc.tags = [SHEET_TAG, entry.topic, entry.section];
    doc.semester = 1;
    doc.isPublished = true;
    doc.sheet = { slug: entry.slug, order: entry.order, section: entry.section };

    await doc.save();
    if (isNew) created += 1;
    else updated += 1;
  }

  console.log(`🎉 Sheet import complete: ${created} created, ${updated} updated (total ${problems.length}).`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});