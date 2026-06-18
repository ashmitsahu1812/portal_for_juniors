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
    let parentModule = await Module.findOne({ title: /Foundations of Python Programming/i });
    if (!parentModule) {
      parentModule = await Module.findOne(); // fallback
    }

    const newProblem = new Problem({
      moduleId: parentModule._id,
      title: "Find Sum of Two Numbers",
      description: `Write a program that reads two numbers from separate lines of standard input, computes their total horizontal sum, and outputs the numerical result.`,
      difficulty: 'Easy',
      constraints: '-10^6 <= num1, num2 <= 10^6',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Addition', 'Number Operations'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '15\n35\n',
          expectedOutput: '50',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '-10\n20\n',
          expectedOutput: '10',
          isHidden: true,
          label: 'Hidden Test Case 2',
        },
        {
          input: '0\n0\n',
          expectedOutput: '0',
          isHidden: true,
          label: 'Hidden Test Case 3',
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
