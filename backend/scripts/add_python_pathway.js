import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pathway from '../models/Pathway.js';
import Problem from '../models/Problem.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  // get all problems
  const problems = await Problem.find({});
  
  if (problems.length === 0) {
    console.log('No problems found to add to pathway.');
    process.exit(0);
  }

  // Create Python Pathway
  const pathway = new Pathway({
    title: 'Problem Solving in Python',
    description: 'Master algorithmic thinking and solve coding challenges using Python.',
    icon: 'Terminal',
    levels: [
      {
        levelNumber: 1,
        title: 'Python Basics',
        theoryText: 'Learn to take inputs, print outputs, and use simple loops and variables.',
        problems: problems.filter(p => p.title === 'Sum of Two Numbers' || p.title === 'Factorial' || p.title === 'FizzBuzz').map(p => p._id)
      },
      {
        levelNumber: 2,
        title: 'Data Structures in Python',
        theoryText: 'Use lists, sets, and dictionaries to solve more complex algorithmic challenges efficiently.',
        problems: problems.filter(p => p.title === 'Reverse an Array' || p.title === 'Valid Parentheses' || p.title === 'Intersection of Two Sets').map(p => p._id)
      }
    ]
  });

  await Pathway.deleteMany({ title: 'Problem Solving in Python' });
  await pathway.save();

  console.log('Successfully added the Python pathway!');
  process.exit(0);
};

run().catch(console.error);
