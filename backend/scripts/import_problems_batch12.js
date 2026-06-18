import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Chote Miyan",
    description: `Given two integers representing the heights of two individuals, identify the smaller height ("Chote Miyan") and print it. If both heights are completely equal, print either of them.`,
    difficulty: 'Easy',
    constraints: '1 <= Height1, Height2 <= 250',
    tags: ['Python if-else'],
    testCases: [
      { input: '165\n152\n', expectedOutput: '152', isHidden: false, label: 'Sample Output 1' },
      { input: '180\n180\n', expectedOutput: '180', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '120\n130\n', expectedOutput: '120', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Find The Diagonal Sum",
    description: `Given an $N \\times N$ square matrix, compute and print the total sum of elements resting on the primary (main) diagonal. The primary diagonal contains elements stretching from the top-left corner to the bottom-right corner ($matrix[i][i]$).

Input layout:
- First line: An integer $N$ representing matrix dimensions.
- Next $N$ lines: Elements making up each row.`,
    difficulty: 'Medium',
    constraints: '1 <= N <= 100\n-10^4 <= Matrix Elements <= 10^4',
    tags: ['Python Nested List', 'Matrix'],
    testCases: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9\n', expectedOutput: '15', isHidden: false, label: 'Sample Output 1' },
      { input: '1\n42\n', expectedOutput: '42', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '2\n-5 10\n20 -3\n', expectedOutput: '-8', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Find the Remainder",
    description: `Write a program that takes two integers, Dividend ($A$) and Divisor ($B$), on separate lines, and calculates the remainder left over when $A$ is divided by $B$ using the modulo (\`%\`) operator.`,
    difficulty: 'Easy',
    constraints: '1 <= A, B <= 10^9',
    tags: ['Python Arithmetic Operators'],
    testCases: [
      { input: '27\n5\n', expectedOutput: '2', isHidden: false, label: 'Sample Output 1' },
      { input: '100\n10\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '5\n12\n', expectedOutput: '5', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Print Numbers Divisible by X in Range",
    description: `Given three space-separated integers, \`Start\`, \`End\`, and \`X\`, look through the interval boundaries from \`Start\` to \`End\` inclusive and print all numbers perfectly divisible by \`X\`, each on a separate line.`,
    difficulty: 'Easy',
    constraints: '1 <= Start <= End <= 5000\n1 <= X <= 100',
    tags: ['Python Loops'],
    testCases: [
      { input: '10 30 7\n', expectedOutput: '14\n21\n28', isHidden: false, label: 'Sample Output 1' },
      { input: '1 5 10\n', expectedOutput: '\\n', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '5 5 5\n', expectedOutput: '5', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Recursive Sequence Term Finder",
    description: `A mathematical sequence is defined recursively as:
$T(n) = 2 \\times T(n-1) + 3$ for $n > 1$
With base structural value $T(1) = 1$.

Given an integer $N$, implement a clean recursive function to isolate and evaluate the value of the $N$-th sequence term.`,
    difficulty: 'Medium',
    constraints: '1 <= N <= 20',
    tags: ['Recursion'],
    testCases: [
      { input: '3\n', expectedOutput: '13', isHidden: false, label: 'Sample Output 1' },
      { input: '1\n', expectedOutput: '1', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '5\n', expectedOutput: '61', isHidden: true, label: 'Hidden Test Case 3' }
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
