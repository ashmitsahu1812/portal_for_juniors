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
      title: "Check Arithmetic Progression (3 Numbers, Any Order)",
      description: `Write a program that takes three space-separated integers ($a$, $b$, and $c$) given in **any arbitrary order** and determines if they can be rearranged into a valid Arithmetic Progression (AP).

Three numbers form an arithmetic progression if, when sorted, the difference between the middle element and the smallest element equals the difference between the largest element and the middle element. 

Print \`YES\` if a valid arithmetic progression permutation can be formed, and \`NO\` otherwise.`,
      difficulty: 'Hard',
      constraints: '-10^9 <= a, b, c <= 10^9',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Python if-else', 'Time Optimization'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '6 2 4\n',
          expectedOutput: 'YES',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '5 10 3\n',
          expectedOutput: 'NO',
          isHidden: false,
          label: 'Sample Output 2',
        },
        {
          input: '12 4 -4\n',
          expectedOutput: 'YES',
          isHidden: false,
          label: 'Sample Output 3',
        },
        {
          input: '0 0 0\n',
          expectedOutput: 'YES',
          isHidden: true,
          label: 'Hidden Test Case 4',
        },
        {
          input: '100 300 200\n',
          expectedOutput: 'YES',
          isHidden: true,
          label: 'Hidden Test Case 5',
        },
        {
          input: '1 2 4\n',
          expectedOutput: 'NO',
          isHidden: true,
          label: 'Hidden Test Case 6',
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
