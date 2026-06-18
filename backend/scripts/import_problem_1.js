import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const seedNewProblem = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // Find the appropriate module (Foundations of Python Programming or Basic Arithmetic)
    let parentModule = await Module.findOne({ title: /Foundations of Python Programming/i });
    if (!parentModule) {
      parentModule = await Module.findOne(); // fallback to any module if not found
    }

    const newProblem = new Problem({
      moduleId: parentModule._id,
      title: 'Celsius to Fahrenheit Conversion',
      description: `Write a program that reads a temperature in Celsius from the standard input, converts it to Fahrenheit, and prints the result.

The formula for conversion is:
\`Fahrenheit = (Celsius * 9/5) + 32\`

Ensure that the output is explicitly rounded to 1 decimal place.`,
      difficulty: 'Easy',
      constraints: '-100.0 <= Celsius <= 100.0',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Basic Arithmetic', 'Typecasting'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '0\n',
          expectedOutput: '32.0',
          isHidden: false,
          label: 'Sample Input 1',
        },
        {
          input: '100\n',
          expectedOutput: '212.0',
          isHidden: true,
          label: 'Hidden Test Case 2',
        },
        {
          input: '-40\n',
          expectedOutput: '-40.0',
          isHidden: true,
          label: 'Hidden Test Case 3',
        },
        {
          input: '37.5\n',
          expectedOutput: '99.5',
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
