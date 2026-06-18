import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const seedNewProblem = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // Find the appropriate module (Foundations of Python Programming or fallback)
    let parentModule = await Module.findOne({ title: /Foundations of Python Programming/i });
    if (!parentModule) {
      parentModule = await Module.findOne(); // fallback
    }

    const newProblem = new Problem({
      moduleId: parentModule._id,
      title: "Rainboy and the Thread",
      description: `Rainboy is wrapping a long thread around a circular drum. 

You are given two integers:
- \`C\`: The exact circumference of the circular drum (the length of thread required to complete one full loop).
- \`X\`: The total initial length of the thread.

Rainboy will continue to wrap the thread around the drum making as many complete full rotations as possible. Write a program to calculate and print the remaining length of the thread that is left over after completing the maximum possible full loops.`,
      difficulty: 'Medium',
      constraints: '1 <= C <= 100\n1 <= X <= 1000',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Modulo Arithmetic', 'Division Operations'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '12 29\n',
          expectedOutput: '5',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '10 100\n',
          expectedOutput: '0',
          isHidden: true,
          label: 'Hidden Test Case 2',
        },
        {
          input: '15 8\n',
          expectedOutput: '8',
          isHidden: true,
          label: 'Hidden Test Case 3',
        },
        {
          input: '50 999\n',
          expectedOutput: '49',
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
