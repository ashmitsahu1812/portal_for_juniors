import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';

dotenv.config();

const updateTitle = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const result = await Module.updateOne(
      { title: "End semester prep guide" },
      { $set: { title: "MID SEM GUIDE", description: "Preparation guide and practice questions for Mid Semester Exams." } }
    );
    
    if (result.matchedCount > 0) {
      console.log('✅ Successfully updated title to "MID SEM GUIDE"');
    } else {
      console.log('❌ Could not find "End semester prep guide" module');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error updating data:', err);
    process.exit(1);
  }
};

updateTitle();
