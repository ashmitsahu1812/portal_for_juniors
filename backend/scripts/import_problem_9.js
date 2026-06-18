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
      title: "Check Arithmetic Progression of Four Non Decreasing Numbers",
      description: `Write a program that takes four space-separated integers ($x_1$, $x_2$, $x_3$, and $x_4$) given in non-decreasing order ($x_1 \\le x_2 \\le x_3 \\le x_4$) and determines if they form an Arithmetic Progression (AP).

Four numbers form an arithmetic progression if the differences between consecutive elements are entirely uniform:
$$x_2 - x_1 = x_3 - x_2 = x_4 - x_3$$

Print \`YES\` if they form an arithmetic progression, and \`NO\` otherwise.`,
      difficulty: 'Medium',
      constraints: '-10^9 <= x1 <= x2 <= x3 <= x4 <= 10^9',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Python if-else', 'Arithmetic Sequences'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '2 4 6 8\n',
          expectedOutput: 'YES',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '-3 -1 0 2\n',
          expectedOutput: 'NO',
          isHidden: false,
          label: 'Sample Output 2',
        },
        {
          input: '10 20 30 40\n',
          expectedOutput: 'YES',
          isHidden: true,
          label: 'Hidden Test Case 3',
        },
        {
          input: '1 2 3 5\n',
          expectedOutput: 'NO',
          isHidden: true,
          label: 'Hidden Test Case 4',
        },
        {
          input: '-5 -5 -5 -5\n',
          expectedOutput: 'YES',
          isHidden: true,
          label: 'Hidden Test Case 5',
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
