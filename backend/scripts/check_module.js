import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';

dotenv.config();

const checkModule = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const m = await Module.findOne({ title: /Discrete Mathematics/i });
  console.log(m.title, "Published:", m.isPublished, "Semester:", m.semester);
  process.exit(0);
}
checkModule();
