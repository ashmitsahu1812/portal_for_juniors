import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';
import User from '../models/User.js'; // Need a user to assign as author

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in environment variables.");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // Find the first user in the DB to act as the "Author"
    const author = await User.findOne();
    
    if (!author) {
      console.log("No user found in the database. Please register a user first.");
      process.exit(1);
    }

    const problem = new Problem({
      title: "Find the Missing Number",
      description: "# Missing Number\n\nYou are given an array of size `n-1` that contains distinct integers in the range of `1` to `n` (inclusive). Since there is one number missing, find the missing number.\n\n## Input Format\nThe first line contains an integer `N`.\nThe second line contains `N-1` space-separated integers.\n\n## Output Format\nPrint the missing integer.\n\n## Example:\n**Input:**\n```text\n5\n1 2 4 5\n```\n**Output:**\n```text\n3\n```",
      difficulty: "Medium",
      isCommunity: true,
      authorId: author._id,
      allowedLanguages: ['Python', 'Java', 'C++', 'C'],
      testCases: [
        { label: "Sample 1", input: "5\n1 2 4 5", expectedOutput: "3", isHidden: false },
        { label: "Sample 2", input: "10\n1 2 3 4 5 6 7 8 10", expectedOutput: "9", isHidden: false },
        { label: "Hidden 1", input: "2\n1", expectedOutput: "2", isHidden: true }
      ]
    });

    await problem.save();
    console.log(`Successfully added community problem: "${problem.title}" by ${author.name}`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
