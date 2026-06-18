import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';

dotenv.config();

const removePdfs = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Update all modules EXCEPT Discrete Mathematics
  const result = await Module.updateMany(
    { title: { $not: /Discrete Mathematics/i } },
    { $set: { pdfUrls: [] } }
  );
  
  console.log(`Updated ${result.modifiedCount} modules to remove dummy PDFs.`);
  process.exit(0);
}
removePdfs();
