import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Chote Miyan",
    description: `You are given two unequal integers, a and b. Your task is to write a program that prints the smaller of the two numbers because:
"Bade miyan to bade miyan Chhote miya shubhan-allah"

Note:
- Use of functions such as min(), max(), sorted(), sort() is not allowed.
- Converting a and b in list or string is also prohibited.

Input
Input consist of single line which contains two space separated integers a and b

Output
Print a single integer which will be the smaller of the two integers.`,
    difficulty: 'Easy',
    constraints: '-1000 <= a <= 1000\n-1000 <= b <= 1000\na != b',
    tags: ['Conditionals'],
    testCases: [
      { input: '10 20\n', expectedOutput: '10', isHidden: false, label: 'Sample Output 1' },
      { input: '20 10\n', expectedOutput: '10', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '-5 5\n', expectedOutput: '-5', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '5 -5\n', expectedOutput: '-5', isHidden: true, label: 'Hidden Test Case 4' },
      { input: '-10 -20\n', expectedOutput: '-20', isHidden: true, label: 'Hidden Test Case 5' },
      { input: '-20 -10\n', expectedOutput: '-20', isHidden: true, label: 'Hidden Test Case 6' },
      { input: '1000 -1000\n', expectedOutput: '-1000', isHidden: true, label: 'Hidden Test Case 7' },
      { input: '999 1000\n', expectedOutput: '999', isHidden: true, label: 'Hidden Test Case 8' },
      { input: '-999 -1000\n', expectedOutput: '-1000', isHidden: true, label: 'Hidden Test Case 9' }
    ]
  }
];

const starterCode = {
  'Python': '# Write your Python solution here\n',
  'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
  'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
  'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
};

const seedMidSemPrep = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // Find or create the module
    let parentModule = await Module.findOne({ title: "End semester prep guide" });
    if (!parentModule) {
      parentModule = new Module({
        title: "End semester prep guide",
        description: "Preparation guide and practice questions for End Semester Exams.",
        semester: 1,
        isPublished: true,
        order: 10
      });
      await parentModule.save();
      console.log('✅ Created "End semester prep guide" module.');
    }

    for (const p of rawProblems) {
      const existing = await Problem.findOne({ title: p.title, moduleId: parentModule._id });
      if (existing) {
        console.log(`Problem ${p.title} already exists.`);
        continue;
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

seedMidSemPrep();
