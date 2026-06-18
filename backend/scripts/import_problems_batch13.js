import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Find the Sum of Odd Digits",
    description: `Given a positive integer $N$, use a \`while\` loop logic path to inspect every distinct digit. Compute and return the aggregate sum of only those individual digits that are odd numbers.`,
    difficulty: 'Medium',
    constraints: '1 <= N <= 10^12',
    tags: ['While Loop'],
    testCases: [
      { input: '4572\n', expectedOutput: '12', isHidden: false, label: 'Sample Output 1' },
      { input: '2468\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '13579\n', expectedOutput: '25', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Count Multiples",
    description: `Given an array of $N$ integers, count the total number of element pairs $(i, j)$ such that $i < j$ and one element is a clean multiple of the other (meaning either $array[i] \\% array[j] == 0$ or $array[j] \\% array[i] == 0$).

- First line: Array size $N$.
- Second line: The space-separated array elements.`,
    difficulty: 'Medium',
    constraints: '2 <= N <= 1000\n1 <= Array Elements <= 10^4',
    tags: ['1-D Array', 'Nested For Loop'],
    testCases: [
      { input: '4\n2 4 3 9\n', expectedOutput: '2', isHidden: false, label: 'Sample Output 1' },
      { input: '3\n5 5 5\n', expectedOutput: '3', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '3\n2 3 5\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Digit Sum using Recursion",
    description: `Write a program that determines the sum of all digits of a non-negative integer $N$ using structural recursive tracking operations rather than loop frameworks.`,
    difficulty: 'Medium',
    constraints: '0 <= N <= 10^12',
    tags: ['Recursion'],
    testCases: [
      { input: '1234\n', expectedOutput: '10', isHidden: false, label: 'Sample Output 1' },
      { input: '0\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '999\n', expectedOutput: '27', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Print Characters of a String",
    description: `Write a program that takes a string input and uses a character iterator loop loop to output each element character on a distinct vertical console line.`,
    difficulty: 'Easy',
    constraints: '1 <= String Length <= 500',
    tags: ['Python String Iteration'],
    testCases: [
      { input: 'Code\n', expectedOutput: 'C\no\nd\ne', isHidden: false, label: 'Sample Output 1' },
      { input: 'A\n', expectedOutput: 'A', isHidden: true, label: 'Hidden Test Case 2' }
    ]
  },
  {
    title: "Walking Boy",
    description: `A boy is walking along a straight 1D track checkpoint system. He starts at position 0 at time minute 0. You are given an array of target checkpoints he must visit, listed sequentially alongside the timestamps at which he reaches them. If he ever has a continuous window of at least 120 minutes between consecutive checkpoints where he does not need to move, he can take a nap.

Determine if he can take at least 2 distinct naps throughout his complete journey. The final checkpoint ends his journey. Print \`YES\` or \`NO\`.

- First line: Number of checkpoints $N$.
- Second line: $N$ space-separated integers showing checkpoint minute markers.`,
    difficulty: 'Hard',
    constraints: '1 <= N <= 100\n0 <= Checkpoint Timestamps <= 1440',
    tags: ['Python List', 'Python Loops'],
    testCases: [
      { input: '3\n100 300 500\n', expectedOutput: 'YES', isHidden: false, label: 'Sample Output 1' },
      { input: '2\n50 100\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '4\n200 400 600 800\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Slice to Survive",
    description: `You are given an array of $N$ integers representing obstacle heights along a track. You have a laser cutter that can slice across any range of adjacent obstacles, reducing their height uniformly by 1 unit per slice activation. Find the absolute minimum number of total slice activations needed to reduce all obstacle heights down to zero.

- First line: Element count $N$.
- Second line: $N$ space-separated array integers.`,
    difficulty: 'Hard',
    constraints: '1 <= N <= 10^4\n0 <= Obstacle Height <= 10^5',
    tags: ['Python:math', 'Greedy Algorithm'],
    testCases: [
      { input: '3\n1 2 1\n', expectedOutput: '2', isHidden: false, label: 'Sample Output 1' },
      { input: '4\n4 4 4 4\n', expectedOutput: '4', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '5\n0 3 0 2 0\n', expectedOutput: '5', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Gukesh’s Winning Chessboard",
    description: `Grandmaster Gukesh is analyzing a custom $R \\times C$ chessboard layout where grid positions contain piece scoring values. He wants to find the size of the largest square sub-grid configuration where the total tracking score sum within that boundaries block is completely positive ($> 0$). Output the dimensions (side length) of that maximum qualifying square sub-grid. If no such block exists, return \`0\`.

- First line: Dimensions $R$ and $C$.
- Next $R$ lines: Matrix scoring contents.`,
    difficulty: 'Hard',
    constraints: '1 <= R, C <= 50\n-100 <= Cell Scores <= 100',
    tags: ['Python:math', 'Nested Loop'],
    testCases: [
      { input: '3 3\n 1 -2  1\n-1  3 -1\n 1 -1  1\n', expectedOutput: '3', isHidden: false, label: 'Sample Output 1' },
      { input: '2 2\n-1 -1\n-1 -1\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '2 3\n-5 2 -1\n 4 -1 3\n', expectedOutput: '1', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Print K-th Character",
    description: `Given a string on the first line and a 0-based index value $K$ on the second line, extract and print the individual character residing at index location $K$. If $K$ is out of bounds, print \`Invalid Index\`.`,
    difficulty: 'Easy',
    constraints: '0 <= K <= 5000',
    tags: ['Python String Indexing'],
    testCases: [
      { input: 'Newton\n2\n', expectedOutput: 'w', isHidden: false, label: 'Sample Output 1' },
      { input: 'A\n0\n', expectedOutput: 'A', isHidden: true, label: 'Hidden Test Case 2' },
      { input: 'Test\n10\n', expectedOutput: 'Invalid Index', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  }
];

const starterCode = {
  'Python': '# Write your Python solution here\n',
  'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
  'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
  'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
};

const seedNewProblems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // Find the appropriate module
    let parentModule = await Module.findOne({ title: /Foundations of Python Programming/i });
    if (!parentModule) {
      parentModule = await Module.findOne(); // fallback
    }

    for (const p of rawProblems) {
      const newProblem = new Problem({
        moduleId: parentModule._id,
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        constraints: p.constraints,
        allowedLanguages: ['C', 'C++', 'Python', 'Java'],
        tags: p.tags,
        timeLimitSeconds: 2,
        memoryLimitMB: 256,
        isPublished: true,
        testCases: p.testCases,
        starterCode
      });
      await newProblem.save();
      console.log(`👨‍💻 Inserted new problem: ${newProblem.title} into module "${parentModule.title}"`);
    }

    console.log('🎉 Data entry complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error inserting data:', err);
    process.exit(1);
  }
};

seedNewProblems();
