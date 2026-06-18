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
      title: "Switch Game",
      description: `Alice and Bob are playing a game with timing switches. 
- Alice holds her switch down continuously from second $A$ to second $B$.
- Bob holds his switch down continuously from second $C$ to second $D$.

Write a program that takes four space-separated integers ($A$, $B$, $C$, and $D$) from a single line of standard input and calculates the total duration in seconds during which both Alice and Bob were holding their switches down at the exact same time (the overlap interval). If there is no overlapping time interval, output \`0\`.`,
      difficulty: 'Hard',
      constraints: '0 <= A < B <= 100\n0 <= C < D <= 100',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Python if-else', 'Time Optimization'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '2 6 4 8\n',
          expectedOutput: '2',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '1 5 5 10\n',
          expectedOutput: '0',
          isHidden: false,
          label: 'Sample Output 2',
        },
        {
          input: '10 50 0 20\n',
          expectedOutput: '10',
          isHidden: true,
          label: 'Hidden Test Case 3',
        },
        {
          input: '0 30 40 70\n',
          expectedOutput: '0',
          isHidden: true,
          label: 'Hidden Test Case 4',
        },
        {
          input: '5 25 5 25\n',
          expectedOutput: '20',
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
