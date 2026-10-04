import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from './models/Module.js';
import Problem from './models/Problem.js';

dotenv.config();

const updateMidSem = async () => {
  try {
    console.log('Connecting to database...');
    // Ensure this runs against the production URI if specified
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // 1. Create or find the MID SEM GUIDE module
    let midSemModule = await Module.findOne({ title: 'MID SEM GUIDE' });
    if (!midSemModule) {
      console.log('Creating MID SEM GUIDE module...');
      midSemModule = new Module({
        title: 'MID SEM GUIDE',
        description: 'Comprehensive guide for the Mid Semester Examination covering coding problems.',
        semester: 1,
        isPublished: true,
        order: -1
      });
      await midSemModule.save();
    } else {
      midSemModule.isPublished = true;
      await midSemModule.save();
    }
    console.log('✅ MID SEM GUIDE module is ready. ID:', midSemModule._id);

    // 2. The exact 15 problems you requested
    const targetTitles = [
      "Find The GCD",
      "Circle Intersection Check With Different Radii",
      "Digit Counter",
      "Strange Fibonacci",
      "Frog Game",
      "Password Check",
      "Max of two Numbers",
      "Square of Rectangles",
      "Print 1 to N using while Loop",
      "Enough Chocolates for Everyone",
      "Second Largest Divisor",
      "Find Primes - II",
      "Print Multiples of 3 in a Given Range",
      "Check for Intersection Between Two Circles with Same Radii"
    ];

    console.log('Updating coding problems...');
    let updatedCount = 0;
    
    // Assign these exact problems to the MID SEM GUIDE module
    for (const title of targetTitles) {
      const result = await Problem.updateMany(
        { title: title },
        { $set: { moduleId: midSemModule._id, isPublished: true } }
      );
      updatedCount += result.modifiedCount;
    }

    console.log(`✅ Successfully assigned ${updatedCount} problem records to the MID SEM GUIDE module!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating database:', err);
    process.exit(1);
  }
};

updateMidSem();
