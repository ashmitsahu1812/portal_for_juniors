/**
 * scripts/clear_pdfs.js
 * Clears pdfUrls from all modules EXCEPT:
 *   - Foundations of Python Programming (Problem Solving in Python)
 *   - Discrete Mathematics
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';

dotenv.config();

const clearPdfs = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  // Show all modules first
  const all = await Module.find({}, 'title pdfUrls').sort({ order: 1 });
  console.log('── All modules ──────────────────────────────────');
  all.forEach(m => console.log(` • "${m.title}" → ${m.pdfUrls.length} PDF(s)`));
  console.log('');

  // Clear pdfUrls for everyone EXCEPT Python & Discrete Maths
  const result = await Module.updateMany(
    {
      title: {
        $not: /Discrete Mathematics|Foundations of Python|Python Programming|Problem.Solving.in.Python/i
      }
    },
    { $set: { pdfUrls: [] } }
  );

  console.log(`🗑️  Cleared pdfUrls from ${result.modifiedCount} module(s).\n`);

  // Verify what's left
  const remaining = await Module.find({ 'pdfUrls.0': { $exists: true } }, 'title pdfUrls');
  console.log('── Modules that still have PDFs ─────────────────');
  if (remaining.length === 0) {
    console.log(' (none — check the title filter above!)');
  } else {
    remaining.forEach(m => {
      console.log(` ✅ "${m.title}" → ${m.pdfUrls.length} PDF(s)`);
      m.pdfUrls.forEach(p => console.log(`      - ${p.label}`));
    });
  }

  process.exit(0);
};

clearPdfs().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
