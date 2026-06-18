import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Print The k-th Element",
    description: `Given an integer $K$ on the first line and a space-separated list of elements on the second line, extract and print the element situated at the 0-indexed position $K$. If $K$ falls outside the array length bounds, print \`Index Out Of Range\`.`,
    difficulty: 'Easy',
    constraints: '0 <= K <= 2000\n1 <= Array Length <= 1000',
    tags: ['Python List', 'Python List Indexing'],
    testCases: [
      { input: '2\nAlpha Beta Gamma Delta\n', expectedOutput: 'Gamma', isHidden: false, label: 'Sample Output 1' },
      { input: '0\nSingleItem\n', expectedOutput: 'SingleItem', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '5\nA B C\n', expectedOutput: 'Index Out Of Range', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '3\n10 20 30 40\n', expectedOutput: '40', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Sum of Elements in a Given Range",
    description: `Given a space-separated array of integers on the first line, and two bounding numbers \`Low\` and \`High\` on the second line, calculate the sum of all elements in the array whose values fall within the inclusive range [\`Low\`, \`High\`].`,
    difficulty: 'Medium',
    constraints: '1 <= Array length <= 1000\n-10^4 <= Elements, Low, High <= 10^4',
    tags: ['Python List', 'The for loop'],
    testCases: [
      { input: '5 12 3 8 20\n4 15\n', expectedOutput: '13', isHidden: false, label: 'Sample Output 1' },
      { input: '1 2 3 4 5\n10 20\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '-5 0 5\n-5 5\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '10 10 10\n10 10\n', expectedOutput: '30', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Print All Elements of a List",
    description: `Write a program that takes a single line of space-separated strings, populates a list, and then loops through the list using a \`for\` loop to print each element on a new line.`,
    difficulty: 'Easy',
    constraints: '1 <= Array length <= 500',
    tags: ['For Loop', 'Python List'],
    testCases: [
      { input: 'cat dog bird\n', expectedOutput: 'cat\ndog\nbird', isHidden: false, label: 'Sample Output 1' },
      { input: 'OneItem\n', expectedOutput: 'OneItem', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '1 2 3 4\n', expectedOutput: '1\n2\n3\n4', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Length of an Alphanumeric String",
    description: `Write a program that reads a string containing alphanumeric characters from standard input and prints its total length (character count).`,
    difficulty: 'Easy',
    constraints: '0 <= String length <= 10^4',
    tags: ['Python String'],
    testCases: [
      { input: 'Python3\n', expectedOutput: '7', isHidden: false, label: 'Sample Output 1' },
      { input: '\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: 'a\n', expectedOutput: '1', isHidden: true, label: 'Hidden Test Case 3' },
      { input: 'Supercalifragilisticexpialidocious\n', expectedOutput: '34', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Characters at Odd Indices",
    description: `Write a program that reads a single string from standard input and prints out characters that reside at **odd 0-indexed positions** (i.e., index 1, 3, 5, etc.) packed continuously as a single word string.`,
    difficulty: 'Easy',
    constraints: '1 <= String length <= 10^4',
    tags: ['Python String Iteration'],
    testCases: [
      { input: 'abcdef\n', expectedOutput: 'bdf', isHidden: false, label: 'Sample Output 1' },
      { input: 'x\n', expectedOutput: '\n', isHidden: true, label: 'Hidden Test Case 2' },
      { input: 'Newton\n', expectedOutput: 'etn', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '12345678\n', expectedOutput: '2468', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Tiling the Roof",
    description: `You are tasked with covering a pitched triangular roof section of base width $B$ and perpendicular height $H$ using standard commercial rectangular tiles of length $L$ and width $W$. Write a program to compute the theoretical absolute minimum count of total whole tiles required to completely shelter the zone. If structural geometry layout orientations are completely incompatible, print \`-1\`.`,
    difficulty: 'Hard',
    constraints: '1 <= B, H, L, W <= 1000',
    tags: ['Python:math', 'Python if-else'],
    testCases: [
      { input: '10 10 2 2\n', expectedOutput: '25', isHidden: false, label: 'Sample Output 1' },
      { input: '5 5 10 10\n', expectedOutput: '-1', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '12 6 2 3\n', expectedOutput: '12', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '100 50 1 1\n', expectedOutput: '5000', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Balancing Training Sessions",
    description: `An athlete must organize multiple training sessions such that the absolute gap variation between any two successive intervals is perfectly balanced against a targeting load limit metric $M$. Given an array representing consecutive session minutes on the first line and $M$ on the second line, return \`BALANCED\` if all adjacent deltas are strictly less than or equal to $M$. Otherwise, return \`UNBALANCED\`.`,
    difficulty: 'Hard',
    constraints: '2 <= Number of sessions <= 10^4\n1 <= Session minutes, M <= 10^5',
    tags: ['Loops', 'Python:math', 'Python if-else'],
    testCases: [
      { input: '30 45 60 50\n15\n', expectedOutput: 'BALANCED', isHidden: false, label: 'Sample Output 1' },
      { input: '10 40 20\n15\n', expectedOutput: 'UNBALANCED', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '5 5 5 5\n0\n', expectedOutput: 'BALANCED', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '100 200\n50\n', expectedOutput: 'UNBALANCED', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Print the Range",
    description: `Given two space-separated integers, \`Lower\` and \`Upper\`, use a \`for\` loop to print all integers starting from \`Lower\` up to and including \`Upper\` sequentially in a single space-separated line.`,
    difficulty: 'Easy',
    constraints: '-100 <= Lower <= Upper <= 100',
    tags: ['For Loop'],
    testCases: [
      { input: '3 7\n', expectedOutput: '3 4 5 6 7', isHidden: false, label: 'Sample Output 1' },
      { input: '0 0\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '-3 1\n', expectedOutput: '-3 -2 -1 0 1', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '98 100\n', expectedOutput: '98 99 100', isHidden: true, label: 'Hidden Test Case 4' }
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
