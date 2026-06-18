import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const seedNewProblem = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // Find the appropriate module
    let parentModule = await Module.findOne({ title: /Python Control Flow and Functions/i });
    if (!parentModule) {
      parentModule = await Module.findOne(); // fallback
    }

    const newProblem = new Problem({
      moduleId: parentModule._id,
      title: "Find Absolute Value",
      description: `Write a program that takes a single integer $N$ from the standard input and prints its absolute value. 

The absolute value of a number is its distance from zero on the number line, which means it is always non-negative. If the number is negative, make it positive; if it is already positive or zero, leave it unchanged.`,
      difficulty: 'Easy',
      constraints: '-100 <= N <= 100',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Python if-else', 'Math'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '-21\n',
          expectedOutput: '21',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '10\n',
          expectedOutput: '10',
          isHidden: false,
          label: 'Sample Output 2',
        },
        {
          input: '0\n',
          expectedOutput: '0',
          isHidden: true,
          label: 'Hidden Test Case 3',
        },
        {
          input: '-100\n',
          expectedOutput: '100',
          isHidden: true,
          label: 'Hidden Test Case 4',
        }
      ],
      starterCode: {
        'Python': '# Write your Python solution here\n',
        'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
        'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
        'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
      }
    });

    await newProblem.save();
    console.log(`👨‍💻 Inserted new problem: ${newProblem.title} into module "${parentModule.title}"`);

    console.log('🎉 Data entry complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error inserting data:', err);
    process.exit(1);
  }
};

seedNewProblem();
