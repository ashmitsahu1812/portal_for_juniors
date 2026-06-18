import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "AM_PM",
    description: `Given an integer $H$ representing the hour of the day in a 24-hour clock format (from 0 to 23), write a program to determine if the time falls in the AM or PM category.
- Print \`AM\` if the hour is between 0 and 11 inclusive.
- Print \`PM\` if the hour is between 12 and 23 inclusive.`,
    difficulty: 'Easy',
    constraints: '0 <= H <= 23',
    tags: ['Python if-else'],
    testCases: [
      { input: '9\n', expectedOutput: 'AM', isHidden: false, label: 'Sample Output 1' },
      { input: '13\n', expectedOutput: 'PM', isHidden: false, label: 'Sample Output 2' },
      { input: '0\n', expectedOutput: 'AM', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '12\n', expectedOutput: 'PM', isHidden: true, label: 'Hidden Test Case 4' }
    ],
    starterCode: {
      'Python': '# Write your Python solution here\n',
      'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
      'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
      'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
    }
  },
  {
    title: "Simple Interest Calculator",
    description: `Write a program to calculate the Simple Interest earned on a principal amount. 
The input consists of three lines containing space-separated numbers or single values representing:
1. Principal amount ($P$)
2. Rate of interest per annum ($R$)
3. Time period in years ($T$)

Calculate the Simple Interest using the formula: $SI = \\frac{P \\times R \\times T}{100}$. Print the result explicitly rounded to 1 decimal place.`,
    difficulty: 'Easy',
    constraints: '1 <= P <= 10^5\n1 <= R <= 20\n1 <= T <= 30',
    tags: ['General Maths', 'Python Arithmetic'],
    testCases: [
      { input: '1000\n5\n2\n', expectedOutput: '100.0', isHidden: false, label: 'Sample Output 1' },
      { input: '5000\n3.5\n4\n', expectedOutput: '700.0', isHidden: true, label: 'Hidden Test Case 2' }
    ],
    starterCode: {
      'Python': '# Write your Python solution here\n',
      'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
      'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
      'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
    }
  }
];

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
        starterCode: p.starterCode
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
