import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Statistics Review",
    description: `Write a program that takes three integers as input on separate lines and calculates their mean (average) and range (the absolute difference between the maximum and minimum values). Print the mean rounded to 1 decimal place, and the range as an integer on the next line.`,
    difficulty: 'Easy',
    constraints: '-10^4 <= A, B, C <= 10^4',
    tags: ['Python Function', 'Python Operators'],
    testCases: [
      { input: '10\n20\n30\n', expectedOutput: '20.0\n20', isHidden: false, label: 'Sample Output 1' },
      { input: '5\n5\n5\n', expectedOutput: '5.0\n0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '-10\n0\n11\n', expectedOutput: '0.3\n21', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '-100\n-200\n-300\n', expectedOutput: '-200.0\n200', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Range Sum Query Contest",
    description: `Given an array of $N$ integers and $Q$ range queries, you need to find the sum of elements within the given 0-indexed intervals $[L, R]$ inclusive. Implement an efficient solution using the **Prefix Sum Technique** to ensure execution finishes within the time limit.

The input layout is:
- First line: Two space-separated integers, $N$ and $Q$.
- Second line: $N$ space-separated integers representing the array elements.
- Next $Q$ lines: Two space-separated integers, $L$ and $R$.

For each query, print the corresponding range sum on a new line.`,
    difficulty: 'Medium',
    constraints: '1 <= N, Q <= 10^5\n-10^4 <= Array Elements <= 10^4\n0 <= L <= R < N',
    tags: ['Python List', 'Prefix Sum Technique'],
    testCases: [
      { input: '5 2\n1 2 3 4 5\n0 2\n1 4\n', expectedOutput: '6\n14', isHidden: false, label: 'Sample Output 1' },
      { input: '4 1\n-3 5 2 -1\n0 3\n', expectedOutput: '3', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '3 3\n10 -5 20\n0 0\n1 2\n0 2\n', expectedOutput: '10\n15\n25', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '1 1\n42\n0 0\n', expectedOutput: '42', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Target Value",
    description: `Given a list of space-separated integers and a target value $K$, write a program to find the total count of pairs $(i, j)$ such that $i < j$ and the sum of elements at those indices is exactly equal to $K$ ($list[i] + list[j] == K$).

- First line: The space-separated array elements.
- Second line: The target integer $K$.`,
    difficulty: 'Hard',
    constraints: '2 <= Number of elements <= 1000\n-10^4 <= Element Value, K <= 10^4',
    tags: ['Lists', 'Iterating list'],
    testCases: [
      { input: '1 2 3 4 5\n5\n', expectedOutput: '2', isHidden: false, label: 'Sample Output 1' },
      { input: '1 1 1 1\n2\n', expectedOutput: '6', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '1 2 3\n10\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '-3 3 -3 3\n0\n', expectedOutput: '4', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Similar-Strings",
    description: `Two strings of equal length are considered "similar" if they differ by at most one character at the exact same index position. Given two strings on separate lines, print \`YES\` if they are similar, and \`NO\` otherwise. Note that identical strings differ by 0 characters, so they are also considered similar.`,
    difficulty: 'Medium',
    constraints: 'Strings contain lowercased English letters. Length up to 1000 characters.',
    tags: ['String', 'Complete Search'],
    testCases: [
      { input: 'apple\napply\n', expectedOutput: 'YES', isHidden: false, label: 'Sample Output 1' },
      { input: 'apple\nbanan\n', expectedOutput: 'NO', isHidden: false, label: 'Sample Output 2' },
      { input: 'same\nsame\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden Test Case 3' },
      { input: 'ab\nba\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Matrix Subtraction",
    description: `Given two 2D matrices $A$ and $B$ of identical dimensions $R \\times C$, perform matrix subtraction ($A - B$) and print the resulting matrix. 

Input layout:
- First line: Two space-separated integers, $R$ and $C$.
- Next $R$ lines: Elements of Matrix $A$.
- Following $R$ lines: Elements of Matrix $B$.`,
    difficulty: 'Medium',
    constraints: '1 <= R, C <= 50\n-100 <= Matrix Elements <= 100',
    tags: ['Matrix operations'],
    testCases: [
      { input: '2 2\n5 6\n7 8\n1 2\n3 4\n', expectedOutput: '4 4\n4 4', isHidden: false, label: 'Sample Output 1' },
      { input: '1 3\n1 2 3\n1 1 1\n', expectedOutput: '0 1 2', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '2 1\n10\n20\n5\n-5\n', expectedOutput: '5\n25', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '1 1\n0\n0\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 4' }
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
    let parentModule = await Module.findOne({ title: /Python Data Structures/i });
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
