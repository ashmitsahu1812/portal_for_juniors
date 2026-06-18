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
      title: "Arithmetic Sequence",
      description: `You are given two space-separated integers, $A$ and $B$. Your task is to find the total count of valid integers $x$ such that $A$, $B$, and $x$ can be rearranged to form a valid Arithmetic Progression (AP) with a non-zero common difference, where $x$ cannot equal $A$ or $B$.

Let's look at the sample cases:
For input \`6 1\`: 
- If $x = -4$, the sequence is $(-4, 1, 6)$, which is a valid AP (difference = 5).
- If $x = 11$, the sequence is $(1, 6, 11)$, which is a valid AP (difference = 5).
- (Note: While $x = 3.5$ makes $(1, 3.5, 6)$ an AP, $x$ must be an integer).
Thus, there are exactly 2 valid values for $x$.`,
      difficulty: 'Hard',
      constraints: '1 <= A, B <= 100',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Python if-else', 'Logic Tracking'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '6 1\n',
          expectedOutput: '2',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '5 7\n',
          expectedOutput: '3',
          isHidden: false,
          label: 'Sample Output 2',
        },
        {
          input: '10 10\n',
          expectedOutput: '0',
          isHidden: true,
          label: 'Hidden Test Case 3',
        },
        {
          input: '1 100\n',
          expectedOutput: '2',
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
