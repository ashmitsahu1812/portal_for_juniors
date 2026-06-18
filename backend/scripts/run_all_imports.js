/**
 * scripts/run_all_imports.js
 *
 * Master import runner — runs all contest + problem batch scripts
 * in the correct order against whatever MONGO_URI is set.
 *
 * Usage:
 *   MONGO_URI="mongodb+srv://..." node scripts/run_all_imports.js
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const scripts = [
  // Modules (contests/quizzes)
  'import_contest1.js',
  'import_contest2.js',
  'import_contest3.js',
  'import_contest4.js',
  'import_contest5.js',
  'import_contest_cli.js',
  'import_contest_control_flow.js',
  'import_contest_dom.js',
  'import_contest_endsem.js',
  'import_contest_layouts.js',
  'import_contest_midsem.js',
  'import_contest_python_foundations.js',
  'import_contest_systems.js',
  'import_contest_web.js',
  // Problems (coding arena)
  'import_problems_batch.js',
  'import_problems_batch2.js',
  'import_problems_batch3.js',
  'import_problems_batch4.js',
  'import_problems_batch5.js',
  'import_problems_batch6.js',
  'import_problems_batch7.js',
  'import_problems_batch8.js',
  'import_problems_batch9.js',
  'import_problems_batch10.js',
  'import_problems_batch11.js',
  'import_problems_batch12.js',
  'import_problems_batch13.js',
];

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('❌  MONGO_URI is not set!');
  process.exit(1);
}

console.log(`🚀  Running ${scripts.length} import scripts against production...\n`);

let passed = 0;
let failed = 0;

for (const script of scripts) {
  const scriptPath = path.join(__dirname, script);
  console.log(`\n▶  Running: ${script}`);
  console.log('─'.repeat(50));
  try {
    const output = execSync(`node ${scriptPath}`, {
      env: { ...process.env, MONGO_URI: uri },
      timeout: 60000,
      encoding: 'utf8',
    });
    console.log(output.trim());
    passed++;
  } catch (err) {
    console.error(`❌  FAILED: ${script}`);
    console.error(err.stdout || err.message);
    failed++;
  }
}

console.log('\n' + '═'.repeat(50));
console.log(`✅  Passed: ${passed} / ${scripts.length}`);
if (failed > 0) console.log(`❌  Failed: ${failed} / ${scripts.length}`);
console.log('═'.repeat(50));
console.log('\n🎉  All imports complete! Check your portal.');
process.exit(failed > 0 ? 1 : 0);
