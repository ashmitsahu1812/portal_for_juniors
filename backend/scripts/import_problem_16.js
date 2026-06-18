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
      title: "Squares from 1 to N",
      description: `Write a program that reads a positive integer $N$ from the standard input and prints the square of every integer from 1 up to and including $N$, each on a separate line.`,
      difficulty: 'Medium',
      constraints: '1 <= N <= 100',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Python Loops'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '4\n',
          expectedOutput: '1\n4\n9\n16',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '1\n',
          expectedOutput: '1',
          isHidden: true,
          label: 'Hidden Test Case 2',
        },
        {
          input: '7\n',
          expectedOutput: '1\n4\n9\n16\n25\n36\n49',
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
