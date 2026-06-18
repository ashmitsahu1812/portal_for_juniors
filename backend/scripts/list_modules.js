import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const modules = await Module.find({});
  modules.forEach(m => console.log(m.title));
  process.exit();
});
