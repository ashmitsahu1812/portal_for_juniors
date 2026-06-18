import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';

dotenv.config();

const checkPdfs = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const modules = await Module.find({ 'pdfUrls.0': { $exists: true } });
  console.log("Modules with PDFs:", modules.map(m => m.title));
  process.exit(0);
}
checkPdfs();
