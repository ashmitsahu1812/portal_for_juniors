import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Power of a Given Number",
    description: `Write a program that computes the power of a number. The input consists of two integers: the base ($B$) and the exponent ($E$), provided on separate lines. Calculate and print the exact value of $B^E$.`,
    difficulty: 'Medium',
    constraints: '1 <= B <= 20\n0 <= E <= 10',
    tags: ['Python Loops', 'Arithmetic Operations'],
    testCases: [
      { input: '2\n3\n', expectedOutput: '8', isHidden: false, label: 'Sample Output 1' },
      { input: '5\n0\n', expectedOutput: '1', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '3\n4\n', expectedOutput: '81', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Find the Maximum of Three Numbers",
    description: `Given three integers as input, each on a separate line, write a conditional script to identify the largest number among them and print it.`,
    difficulty: 'Easy',
    constraints: '-10^5 <= num1, num2, num3 <= 10^5',
    tags: ['Python if-else'],
    testCases: [
      { input: '12\n45\n23\n', expectedOutput: '45', isHidden: false, label: 'Sample Output 1' },
      { input: '-5\n-10\n-2\n', expectedOutput: '-2', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '7\n7\n7\n', expectedOutput: '7', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Check Vowel or Consonant",
    description: `Write a program that takes a single lowercased alphabetic character from standard input. If the character is a vowel (\`a\`, \`e\`, \`i\`, \`o\`, \`u\`), print \`Vowel\`. Otherwise, print \`Consonant\`.`,
    difficulty: 'Easy',
    constraints: "Input is a single character between 'a' and 'z'.",
    tags: ['Python if-else', 'String Parsing'],
    testCases: [
      { input: 'a\n', expectedOutput: 'Vowel', isHidden: false, label: 'Sample Output 1' },
      { input: 'b\n', expectedOutput: 'Consonant', isHidden: false, label: 'Sample Output 2' },
      { input: 'e\n', expectedOutput: 'Vowel', isHidden: true, label: 'Hidden Test Case 3' },
      { input: 'z\n', expectedOutput: 'Consonant', isHidden: true, label: 'Hidden Test Case 4' }
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
