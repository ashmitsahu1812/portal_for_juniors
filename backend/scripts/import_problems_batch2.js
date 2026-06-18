import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Find The GCD",
    description: `Write a program using a \`while\` loop that takes two positive integers $A$ and $B$ from separate lines of standard input and computes their Greatest Common Divisor (GCD) using the Euclidean subtraction or modulo method.`,
    difficulty: 'Medium',
    constraints: '1 <= A, B <= 10^6',
    tags: ['Loops', 'While loop'],
    testCases: [
      { input: '54\n24\n', expectedOutput: '6', isHidden: false, label: 'Sample Output 1' },
      { input: '17\n23\n', expectedOutput: '1', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '100\n25\n', expectedOutput: '25', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Circle Intersection Check",
    description: `You are given the coordinate centers and radii of two circles:
Circle 1: Center ($x_1, y_1$) and radius $r_1$
Circle 2: Center ($x_2, y_2$) and radius $r_2$

Input consists of a single line containing 6 space-separated integers: \`x1 y1 r1 x2 y2 r2\`.
Your program must determine their spatial relationship and print:
- \`Intersect\` if the circles intersect or touch at one or more points.
- \`Do Not Intersect\` if they are completely separate or one is entirely inside the other without touching.`,
    difficulty: 'Hard',
    constraints: '-1000 <= x1, y1, x2, y2 <= 1000\n1 <= r1, r2 <= 1000',
    tags: ['Nested if-else', 'Geometry'],
    testCases: [
      { input: '0 0 5 4 0 3\n', expectedOutput: 'Intersect', isHidden: false, label: 'Sample Output 1' },
      { input: '0 0 2 10 10 2\n', expectedOutput: 'Do Not Intersect', isHidden: true, label: 'Hidden Test Case 2' }
    ]
  },
  {
    title: "Digit Counter",
    description: `Write a program that takes a single non-negative integer $N$ from standard input and counts the total number of digits it contains using a \`while\` loop that divides the number by 10 at each iteration.`,
    difficulty: 'Easy',
    constraints: '0 <= N <= 10^12',
    tags: ['While loop'],
    testCases: [
      { input: '34521\n', expectedOutput: '5', isHidden: false, label: 'Sample Output 1' },
      { input: '0\n', expectedOutput: '1', isHidden: false, label: 'Sample Output 2' },
      { input: '100000000\n', expectedOutput: '9', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Strange Fibonacci",
    description: `A sequence is defined such that the first two terms are given by input integers $A$ and $B$. Every subsequent term is calculated as the absolute difference of the previous two terms ($|term_{i-1} - term_{i-2}|$). Given $A$, $B$, and a target term index $N$ on separate lines, find and print the $N$-th term of this sequence. (Assume 1-based indexing where term 1 = $A$ and term 2 = $B$).`,
    difficulty: 'Easy',
    constraints: '1 <= A, B <= 10^4\n1 <= N <= 20',
    tags: ['For Loop'],
    testCases: [
      { input: '5\n3\n4\n', expectedOutput: '1', isHidden: false, label: 'Sample Output 1' },
      { input: '10\n10\n5\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' }
    ]
  },
  {
    title: "Frog Game",
    description: `Two players are playing a game with a heap of $N$ stones. A player can remove either 1, 2, or 3 stones on their turn. The player who takes the last stone wins. Assuming both players play optimally and player 1 goes first, determine who wins the game. Print \`Player 1\` or \`Player 2\`.`,
    difficulty: 'Hard',
    constraints: '1 <= N <= 10^5',
    tags: ['Game theory', 'Python if-else'],
    testCases: [
      { input: '4\n', expectedOutput: 'Player 2', isHidden: false, label: 'Sample Output 1' },
      { input: '7\n', expectedOutput: 'Player 1', isHidden: true, label: 'Hidden Test Case 2' }
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
    let parentModule = await Module.findOne({ title: /Python Control Flow and Functions/i });
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
