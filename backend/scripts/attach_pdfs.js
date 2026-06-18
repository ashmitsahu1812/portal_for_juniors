import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const attachPdfs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const pdfDir = path.join(process.cwd(), 'public', 'lecture_notes', 'math');
    const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
    
    // Sort files numerically based on the number in the filename (e.g., math-1.pdf)
    files.sort((a, b) => {
      const numA = parseInt(a.replace(/[^\d]/g, ''), 10);
      const numB = parseInt(b.replace(/[^\d]/g, ''), 10);
      return numA - numB;
    });

    const pdfUrls = files.map(file => ({
      label: `Lecture Notes - ${file.replace('.pdf', '')}`,
      url: `http://localhost:5001/public/lecture_notes/math/${file}`
    }));

    const result = await Module.findOneAndUpdate(
      { title: /Discrete Mathematics/i },
      { $set: { pdfUrls: pdfUrls } },
      { new: true }
    );

    if (result) {
      console.log(`Attached ${files.length} PDFs to module: ${result.title}`);
    } else {
      console.log('Discrete Mathematics module not found!');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

attachPdfs();
