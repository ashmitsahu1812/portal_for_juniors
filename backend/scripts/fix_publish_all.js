/**
 * scripts/fix_publish_all.js
 *
 * EMERGENCY FIX: Restores isPublished = true for ALL modules and problems
 * that were accidentally set to false by restrict_modules.js.
 *
 * Run with your PRODUCTION MONGO_URI:
 *   MONGO_URI="mongodb+srv://..." node scripts/fix_publish_all.js
 *
 * Or temporarily set it in backend/.env and run:
 *   node scripts/fix_publish_all.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const fixPublishAll = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌  MONGO_URI is not set. Please set it in .env or pass it as an env variable.');
    process.exit(1);
  }

  console.log('🔌  Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅  Connected.\n');

  // ── Fix Modules ─────────────────────────────────────────────────────────────
  const modulesBefore = await Module.countDocuments({ isPublished: false });
  console.log(`📚  Found ${modulesBefore} unpublished module(s). Publishing all...`);

  const modulesResult = await Module.updateMany(
    { isPublished: false },
    { $set: { isPublished: true } }
  );
  console.log(`✅  Modules fixed: ${modulesResult.modifiedCount} updated to isPublished = true.\n`);

  // ── Fix Problems ─────────────────────────────────────────────────────────────
  const problemsBefore = await Problem.countDocuments({ isPublished: false });
  console.log(`💻  Found ${problemsBefore} unpublished problem(s). Publishing all...`);

  const problemsResult = await Problem.updateMany(
    { isPublished: false },
    { $set: { isPublished: true } }
  );
  console.log(`✅  Problems fixed: ${problemsResult.modifiedCount} updated to isPublished = true.\n`);

  // ── Verification ─────────────────────────────────────────────────────────────
  const totalModules = await Module.countDocuments({ isPublished: true });
  const totalProblems = await Problem.countDocuments({ isPublished: true });

  console.log('─────────────────────────────────────────────');
  console.log(`📦  Total published modules  : ${totalModules}`);
  console.log(`🧩  Total published problems : ${totalProblems}`);
  console.log('─────────────────────────────────────────────');
  console.log('🎉  All done! Your portal should now show all modules and problems.');

  process.exit(0);
};

fixPublishAll().catch((err) => {
  console.error('❌  Fix failed:', err);
  process.exit(1);
});
