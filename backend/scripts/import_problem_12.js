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
      title: "ABCD GCD",
      description: `Write a program that reads four space-separated integers ($a$, $b$, $c$, and $d$) from a single line of standard input and computes their Greatest Common Divisor (GCD).

The Greatest Common Divisor of a set of integers is the largest positive integer that divides all of them without leaving a remainder.`,
      difficulty: 'Medium',
      constraints: '1 <= a, b, c, d <= 10^9',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Python Function', 'Math'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '8 12 16 20\n',
          expectedOutput: '4',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '1 1 1 1\n',
          expectedOutput: '1',
          isHidden: true,
          label: 'Hidden Test Case 2',
        },
        {
          input: '1000000000 500000000 250000000 125000000\n',
          expectedOutput: '125000000',
          isHidden: true,
          label: 'Hidden Test Case 3',
        },
        {
          input: '24 36 60 84\n',
          expectedOutput: '12',
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
