import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Find the remainder",
    description: `You are given two numbers a and b. Find the remainder when a is divided by b.

Input
The first line contains integer a.
The second line contains integer b.

Output
Print the remainder when a is divided by b.`,
    difficulty: 'Easy',
    constraints: '0 <= a <= 200\n1 <= b <= 200',
    tags: ['Arithmetic'],
    testCases: [
      { input: '9\n7\n', expectedOutput: '2', isHidden: false, label: 'Sample Output 1' },
      { input: '0\n5\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '10\n10\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '15\n4\n', expectedOutput: '3', isHidden: true, label: 'Hidden Test Case 4' },
      { input: '200\n1\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 5' },
      { input: '199\n200\n', expectedOutput: '199', isHidden: true, label: 'Hidden Test Case 6' },
      { input: '123\n10\n', expectedOutput: '3', isHidden: true, label: 'Hidden Test Case 7' }
    ]
  },
  {
    title: "Print K-th Character (Mid sem)",
    description: `You are given a string s and an integer k. Your task is to print the k-th character of the string s.

The string uses 0-based indexing, i.e., the first character is at position 0.

Input
The input consists of two lines:
- The first line contains the string s.
- The second line contains the integer k.

Output
Print a single character – the k-th character of the string s.`,
    difficulty: 'Easy',
    constraints: '1 <= |s| <= 10^5\n0 <= k < |s|\ns consists of lowercase English letters',
    tags: ['Strings'],
    testCases: [
      { input: 'hello\n1\n', expectedOutput: 'e', isHidden: false, label: 'Sample Output 1' },
      { input: 'a\n0\n', expectedOutput: 'a', isHidden: true, label: 'Hidden Test Case 2' },
      { input: 'programming\n4\n', expectedOutput: 'r', isHidden: true, label: 'Hidden Test Case 3' },
      { input: 'z\n0\n', expectedOutput: 'z', isHidden: true, label: 'Hidden Test Case 4' },
      { input: 'helloworld\n9\n', expectedOutput: 'd', isHidden: true, label: 'Hidden Test Case 5' },
      { input: 'test\n2\n', expectedOutput: 's', isHidden: true, label: 'Hidden Test Case 6' },
      { input: 'abcde\n4\n', expectedOutput: 'e', isHidden: true, label: 'Hidden Test Case 7' },
      { input: 'javascript\n0\n', expectedOutput: 'j', isHidden: true, label: 'Hidden Test Case 8' },
      { input: 'x\n0\n', expectedOutput: 'x', isHidden: true, label: 'Hidden Test Case 9' },
      { input: 'abcdefghijklmnopqrstuvwxyz\n25\n', expectedOutput: 'z', isHidden: true, label: 'Hidden Test Case 10' }
    ]
  },
  {
    title: "Print Characters of a String (Mid sem)",
    description: `You are given a string S. Your task is to print each character of the string on a new line, in the same order as they appear in S.

Input
The input consists of a single line containing the string S.

Output
Print each character of S on a separate line, in the order they appear in the string.`,
    difficulty: 'Easy',
    constraints: '1 <= |S| <= 10^5\nS consists of lowercase and/or uppercase English letters.',
    tags: ['Strings', 'Loops'],
    testCases: [
      { input: 'Hello\n', expectedOutput: 'H\ne\nl\nl\no', isHidden: false, label: 'Sample Output 1' },
      { input: 'A\n', expectedOutput: 'A', isHidden: true, label: 'Hidden Test Case 2' },
      { input: 'Code\n', expectedOutput: 'C\no\nd\ne', isHidden: true, label: 'Hidden Test Case 3' },
      { input: 'abc\n', expectedOutput: 'a\nb\nc', isHidden: true, label: 'Hidden Test Case 4' },
      { input: 'XYZ\n', expectedOutput: 'X\nY\nZ', isHidden: true, label: 'Hidden Test Case 5' },
      { input: 'Test\n', expectedOutput: 'T\ne\ns\nt', isHidden: true, label: 'Hidden Test Case 6' },
      { input: 'aBcD\n', expectedOutput: 'a\nB\nc\nD', isHidden: true, label: 'Hidden Test Case 7' }
    ]
  }
];

const starterCode = {
  'Python': '# Write your Python solution here\n',
  'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
  'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
  'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
};

const seedMidSemPrep2 = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // Find the module
    let parentModule = await Module.findOne({ title: "End semester prep guide" });
    if (!parentModule) {
      console.log('Module not found, creating it just in case...');
      parentModule = new Module({
        title: "End semester prep guide",
        description: "Preparation guide and practice questions for End Semester Exams.",
        semester: 1,
        isPublished: true,
        order: 10
      });
      await parentModule.save();
    }

    for (const p of rawProblems) {
      const existing = await Problem.findOne({ title: p.title, moduleId: parentModule._id });
      if (existing) {
        console.log(`Problem ${p.title} already exists. Deleting it to recreate with new testcases...`);
        await Problem.deleteOne({ _id: existing._id });
      }
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

seedMidSemPrep2();
