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
      title: "Rainboy's Promise",
      description: `Write a program that simply displays a commitment message to the console. You do not need to parse any inputs from the standard input stream.

Print the exact sentence below:
\`I promise myself that I will work hard and become a great coder\``,
      difficulty: 'Easy',
      constraints: 'No input provided.',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Basic I/O', 'String Literals'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '',
          expectedOutput: 'I promise myself that I will work hard and become a great coder',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '',
          expectedOutput: 'I promise myself that I will work hard and become a great coder',
          isHidden: true,
          label: 'Hidden Test Case 2',
        }
      ],
      starterCode: {
        'Python': '# Write your Python solution here\n',
        'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
        'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
        'Java': 'public class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
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
