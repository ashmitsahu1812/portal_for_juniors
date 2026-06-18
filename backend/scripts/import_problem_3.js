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
      title: "Rainboy's Math Test",
      description: `Write a program that takes two integers from the standard input—each provided on a completely separate line—and prints their sum.`,
      difficulty: 'Easy',
      constraints: '1 <= num1, num2 <= 100',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Basic Operations', 'Input Parsing'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '10\n5\n',
          expectedOutput: '15',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '1\n1\n',
          expectedOutput: '2',
          isHidden: true,
          label: 'Hidden Test Case 2',
        },
        {
          input: '100\n100\n',
          expectedOutput: '200',
          isHidden: true,
          label: 'Hidden Test Case 3',
        },
        {
          input: '45\n55\n',
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
