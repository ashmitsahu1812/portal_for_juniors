/**
 * scripts/striver/registry.js — discovers every sheet batch in official order.
 *
 * Batch files live in ./batches/ and must be zero-padded (day01.js, day02.js,
 * ... day27.js) so lexicographic order == sheet order. sheetOrder is assigned
 * globally across batches so the sheet keeps one continuous numbering.
 */

import { readdirSync } from 'fs';

const batchesDir = new URL('./batches/', import.meta.url);
const files = readdirSync(batchesDir)
  .map(file => file.replace(/\.js$/, ''))
  .filter(name => /^day\d{2}$/.test(name))
  .sort();

const batches = [];
for (const name of files) {
  const mod = await import(new URL(`./batches/${name}.js`, import.meta.url));
  if (!mod.default?.section || !Array.isArray(mod.default?.problems)) {
    throw new Error(`batch ${name}.js must default-export { section, problems }`);
  }
  batches.push(mod.default);
}

/** Flat list of problems with sheet.order assigned in sheet order. */
export function sheetProblems() {
  const problems = [];
  let order = 0;
  for (const batch of batches) {
    for (const problem of batch.problems) {
      order += 1;
      problems.push({ ...problem, section: batch.section, order });
    }
  }
  return problems;
}
