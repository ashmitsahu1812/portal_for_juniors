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
      title: "Check Arithmetic Progression of Three Non Decreasing Numbers",
      description: `Write a program that takes three space-separated integers ($x_1$, $x_2$, and $x_3$) given in non-decreasing order ($x_1 \\le x_2 \\le x_3$) and determines if they form an Arithmetic Progression (AP).

Three numbers form an arithmetic progression if the difference between the second and first number is exactly equal to the difference between the third and second number:
$$x_2 - x_1 = x_3 - x_2$$

Print \`YES\` if they form an arithmetic progression, and \`NO\` otherwise.`,
      difficulty: 'Medium',
      constraints: '-10^9 <= x1 <= x2 <= x3 <= 10^9',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Python if-else', 'Arithmetic Sequences'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '2 4 6\n',
          expectedOutput: 'YES',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '3 5 10\n',
          expectedOutput: 'NO',
          isHidden: false,
          label: 'Sample Output 2',
        },
        {
          input: '5 5 5\n',
          expectedOutput: 'YES',
          isHidden: true,
          label: 'Hidden Test Case 3',
        },
        {
          input: '-10 -5 0\n',
          expectedOutput: 'YES',
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
