import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Neon Number",
    description: `A Neon Number is a number where the sum of the digits of its square is equal to the number itself. 
For example, if $N = 9$:
$9^2 = 81$
Sum of digits = $8 + 1 = 9$. Since the sum matches the original number, 9 is a Neon Number.

Write a program that determines if a given integer $N$ is a Neon Number. Print \`YES\` if it is, and \`NO\` otherwise.`,
    difficulty: 'Medium',
    constraints: '1 <= N <= 10^4',
    tags: ['Range() function', 'Digit Operations'],
    testCases: [
      { input: '9\n', expectedOutput: 'YES', isHidden: false, label: 'Sample Output 1' },
      { input: '12\n', expectedOutput: 'NO', isHidden: false, label: 'Sample Output 2' },
      { input: '1\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Reverse and Sum Palindrome",
    description: `Given a positive integer $N$, reverse its digits and add the reversed number to the original number. Check if the resulting sum is a palindrome (reads the same forwards and backwards). If the sum is a palindrome, print \`YES\` along with the sum separated by a space. If not, print \`NO\` along with the calculated sum.

For example, if $N = 23$:
Reverse = 32. Sum = $23 + 32 = 55$, which is a palindrome. Output: \`YES 55\`.`,
    difficulty: 'Hard',
    constraints: '1 <= N <= 10^4',
    tags: ['While loop', 'Palindrome Verification'],
    testCases: [
      { input: '23\n', expectedOutput: 'YES 55', isHidden: false, label: 'Sample Output 1' },
      { input: '89\n', expectedOutput: 'NO 187', isHidden: false, label: 'Sample Output 2' }
    ]
  },
  {
    title: "Next Prime Number",
    description: `Write a program that takes a positive integer $N$ as input and finds the smallest prime number that is strictly greater than $N$.

For example, if $N = 14$, the next prime number is 17.`,
    difficulty: 'Hard',
    constraints: '1 <= N <= 10^5',
    tags: ['Prime numbers', 'Loops'],
    testCases: [
      { input: '14\n', expectedOutput: '17', isHidden: false, label: 'Sample Output 1' },
      { input: '11\n', expectedOutput: '13', isHidden: false, label: 'Sample Output 2' },
      { input: '1\n', expectedOutput: '2', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Repetition Mystery",
    description: `Given a string containing alphanumeric characters, your program must find the longest continuously repeating block of a single character. Print the character that repeats and the length of its longest continuous stretch, separated by a space. If multiple characters share the maximum repeating length, print the one that appeared first in the string.

For example, in \`abbbaaac\`, both \`b\` and \`a\` repeat 3 times. Since \`b\` occurs first, the output is \`b 3\`.`,
    difficulty: 'Hard',
    constraints: 'String length <= 10^4',
    tags: ['While loop', 'String Parsing'],
    testCases: [
      { input: 'abbbaaac\n', expectedOutput: 'b 3', isHidden: false, label: 'Sample Output 1' },
      { input: 'xyz\n', expectedOutput: 'x 1', isHidden: true, label: 'Hidden Test Case 2' }
    ]
  },
  {
    title: "The Even Number Challenge",
    description: `Given two positive integers, \`Low\` and \`High\`, use the \`range()\` function to find all even numbers strictly between \`Low\` and \`High\` (exclusive of the endpoints). Print the count of these even numbers first, followed by the numbers themselves on separate lines. If no even numbers exist in the range, print \`0\`.`,
    difficulty: 'Easy',
    constraints: '1 <= Low <= High <= 1000',
    tags: ['Range() function'],
    testCases: [
      { input: '3 9\n', expectedOutput: '3\n4\n6\n8', isHidden: false, label: 'Sample Output 1' },
      { input: '4 6\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' }
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
