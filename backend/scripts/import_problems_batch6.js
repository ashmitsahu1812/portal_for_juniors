import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Age Categorisation",
    description: `Write a program that takes an integer representing a person's age and categorizes them according to the following thresholds:
- If age is less than 13, print \`Child\`.
- If age is between 13 and 19 inclusive, print \`Teenager\`.
- If age is 20 or greater, print \`Adult\`.`,
    difficulty: 'Easy',
    constraints: '0 <= age <= 120',
    tags: ['Python if-else'],
    testCases: [
      { input: '15\n', expectedOutput: 'Teenager', isHidden: false, label: 'Sample Output 1' },
      { input: '8\n', expectedOutput: 'Child', isHidden: false, label: 'Sample Output 2' },
      { input: '25\n', expectedOutput: 'Adult', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Odd numbers",
    description: `Given a positive integer $N$, use a \`for\` loop to print all odd numbers starting from 1 up to and including $N$, each on a separate line.`,
    difficulty: 'Easy',
    constraints: '1 <= N <= 1000',
    tags: ['For Loop'],
    testCases: [
      { input: '7\n', expectedOutput: '1\n3\n5\n7', isHidden: false, label: 'Sample Output 1' },
      { input: '4\n', expectedOutput: '1\n3', isHidden: true, label: 'Hidden Test Case 2' }
    ]
  },
  {
    title: "First or Second",
    description: `Given an array/list of integers, find the position index (1-indexed) of the first occurrence of a target element $X$. If it occurs a second time, return the index of the second occurrence instead. If the element does not appear at least once, print \`-1\`.

Input format:
The first line contains $N$ (number of elements) and $X$ (the target element).
The second line contains $N$ space-separated integers.`,
    difficulty: 'Hard',
    constraints: '1 <= Number of elements <= 10^4\n-10^5 <= Elements, X <= 10^5',
    tags: ['Python Loops', 'Python Function'],
    testCases: [
      { input: '5 2\n1 2 3 2 4\n', expectedOutput: '4', isHidden: false, label: 'Sample Output 1' },
      { input: '4 7\n1 2 7 4\n', expectedOutput: '3', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '3 9\n1 2 3\n', expectedOutput: '-1', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Count the Digits",
    description: `Write a program that takes a non-negative integer $N$ and counts how many individual digits make up the number using a \`while\` loop interface.`,
    difficulty: 'Easy',
    constraints: '0 <= N <= 10^12',
    tags: ['While loop'],
    testCases: [
      { input: '9843\n', expectedOutput: '4', isHidden: false, label: 'Sample Output 1' },
      { input: '0\n', expectedOutput: '1', isHidden: true, label: 'Hidden Test Case 2' }
    ]
  },
  {
    title: "Count Prime Factors",
    description: `Given a positive integer $N$, find the total number of unique prime factors that divide $N$. For example, if $N = 12$, its prime factors are 2 and 3, so the unique count is 2.`,
    difficulty: 'Medium',
    constraints: '2 <= N <= 10^6',
    tags: ['While loop', 'Nested loop'],
    testCases: [
      { input: '12\n', expectedOutput: '2', isHidden: false, label: 'Sample Output 1' },
      { input: '17\n', expectedOutput: '1', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '30\n', expectedOutput: '3', isHidden: true, label: 'Hidden Test Case 3' }
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
