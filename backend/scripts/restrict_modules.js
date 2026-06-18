import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';

dotenv.config();

const restrictModules = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // Set isPublished to false for all modules EXCEPT Discrete Mathematics
    const result = await Module.updateMany(
      { title: { $not: /Discrete Mathematics/i } },
      { $set: { isPublished: false } }
    );

    console.log(`✅ Updated database: Set isPublished = false for ${result.modifiedCount} modules.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

restrictModules();
