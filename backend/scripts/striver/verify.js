/**
 * scripts/striver/verify.js — validate every batch without touching the database.
 *
 * Checks: unique slugs/titles, >= 7 test inputs, deterministic reference
 * solutions, non-empty expected outputs, {{EXAMPLES}} placeholder present.
 *
 * Run: node scripts/striver/verify.js
 */

import { sheetProblems } from './registry.js';
import { buildTestCases, buildDescription, MIN_TEST_CASES, MIN_VISIBLE, SHEET_TAG } from './helpers.js';

const problems = sheetProblems();
const errors = [];
const slugs = new Set();
const titles = new Set();
const sections = new Map();

for (const problem of problems) {
  const where = problem.slug || problem.title || '<unknown>';
  if (slugs.has(problem.slug)) errors.push(`${where}: duplicate slug`);
  slugs.add(problem.slug);
  if (titles.has(problem.title)) errors.push(`${where}: duplicate title "${problem.title}"`);
  titles.add(problem.title);
  if (!['Easy', 'Medium', 'Hard'].includes(problem.difficulty)) {
    errors.push(`${where}: invalid difficulty "${problem.difficulty}"`);
  }
  let testCases;
  try {
    testCases = buildTestCases(problem);
    if (testCases.length < MIN_TEST_CASES) throw new Error(`needs >= ${MIN_TEST_CASES} test cases`);
    const visible = testCases.filter(tc => !tc.isHidden).length;
    if (visible !== MIN_VISIBLE) throw new Error(`needs exactly ${MIN_VISIBLE} visible test cases, has ${visible}`);
    buildDescription(problem, testCases);
  } catch (err) {
    errors.push(`${where}: ${err.message}`);
    continue;
  }
  sections.set(problem.section, (sections.get(problem.section) || 0) + 1);
}

if (errors.length) {
  console.error(`❌ ${errors.length} problem(s) failed validation:`);
  errors.forEach(err => console.error(`   - ${err}`));
  process.exit(1);
}

console.log(`✅ ${problems.length} problems across ${sections.size} sections passed validation (tag: "${SHEET_TAG}").`);
for (const [section, count] of sections) {
  console.log(`   • ${section}: ${count}`);
}
