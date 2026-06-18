import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Insert Operators",
    description: `You are given a list of $N$ positive integers and a target value $K$. Write a program using recursion to determine if it is possible to insert either an addition operator (\`+\`) or a subtraction operator (\`-\`) between the numbers such that the expression evaluates exactly to $K$. You must evaluate the expressions strictly from left to right.

Print \`YES\` if a valid combination of operators exists, and \`NO\` otherwise.

- First line: Space-separated integers representing the list.
- Second line: The target integer $K$.`,
    difficulty: 'Hard',
    constraints: '2 <= N <= 20\n1 <= Element values <= 100\n-2000 <= K <= 2000',
    tags: ['Recursion', 'Backtracking'],
    testCases: [
      { input: '1 2 3 4\n2\n', expectedOutput: 'YES', isHidden: false, label: 'Sample Output 1' },
      { input: '10 20 30\n0\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '5 2\n10\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '1 1 1 1\n4\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Find the Digits",
    description: `Write a recursive function that targets and isolates individual digits of a large integer $N$ from left to right. Your program should print each isolated digit separated by a space. Do not use string conversion tricks; instead, solve this completely through structural numeric recursion.`,
    difficulty: 'Hard',
    constraints: '0 <= N <= 10^12',
    tags: ['Recursion', 'Complete Search'],
    testCases: [
      { input: '4018\n', expectedOutput: '4 0 1 8', isHidden: false, label: 'Sample Output 1' },
      { input: '0\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '7\n', expectedOutput: '7', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '99999\n', expectedOutput: '9 9 9 9 9', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Find the Sum of Numbers in Range",
    description: `Given two space-separated integers, \`Start\` and \`End\`, use the \`range()\` function to compute the complete sum of all integers between \`Start\` and \`End\` inclusive.`,
    difficulty: 'Easy',
    constraints: '-10^4 <= Start <= End <= 10^4',
    tags: ['Range() function'],
    testCases: [
      { input: '1 5\n', expectedOutput: '15', isHidden: false, label: 'Sample Output 1' },
      { input: '10 10\n', expectedOutput: '10', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '-3 3\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '-5 -1\n', expectedOutput: '-15', isHidden: true, label: 'Hidden Test Case 4' }
    ]
  },
  {
    title: "Find Absolute Value",
    description: `Given a single integer $N$, write an if-else conditional script that outputs its absolute magnitude ($|N|$). If the number is negative, flip its sign to positive; otherwise, output it as is.`,
    difficulty: 'Easy',
    constraints: '-10^5 <= N <= 10^5',
    tags: ['Python if-else'],
    testCases: [
      { input: '-42\n', expectedOutput: '42', isHidden: false, label: 'Sample Output 1' },
      { input: '0\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '100\n', expectedOutput: '100', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Average of Three - II",
    description: `Implement a parameterized function \`calculate_average(a, b, c)\` that takes three numerical values, computes their mathematical average, and explicitly returns the calculated result rounded to 2 decimal places.`,
    difficulty: 'Easy',
    constraints: '-1000 <= a, b, c <= 1000',
    tags: ['Return statement'],
    testCases: [
      { input: '10 15 20\n', expectedOutput: '15.00', isHidden: false, label: 'Sample Output 1' },
      { input: '1 1 2\n', expectedOutput: '1.33', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '-5 5 0\n', expectedOutput: '0.00', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Print All Odd Elements of a List",
    description: `Write a program that takes a single line of space-separated integers, loads them into a list, and applies a \`for\` loop filter to print out every odd integer encountered, each on a separate line.`,
    difficulty: 'Easy',
    constraints: '1 <= Array length <= 1000\n-10^4 <= Elements <= 10^4',
    tags: ['Python List', 'The for loop'],
    testCases: [
      { input: '2 5 8 9 11\n', expectedOutput: '5\n9\n11', isHidden: false, label: 'Sample Output 1' },
      { input: '2 4 6\n', expectedOutput: '\\n', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '-1 -3 -4\n', expectedOutput: '-1\n-3', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Co-Prime or Not?",
    description: `Two positive integers are considered co-prime (or relatively prime) if their Greatest Common Divisor (GCD) is exactly 1. Given two positive integers $A$ and $B$ on separate lines, print \`CO-PRIME\` if they share no common factor other than 1, and \`NOT CO-PRIME\` otherwise.`,
    difficulty: 'Medium',
    constraints: '1 <= A, B <= 10^9',
    tags: ['Python Loops', 'Python Function'],
    testCases: [
      { input: '8\n15\n', expectedOutput: 'CO-PRIME', isHidden: false, label: 'Sample Output 1' },
      { input: '12\n18\n', expectedOutput: 'NOT CO-PRIME', isHidden: false, label: 'Sample Output 2' },
      { input: '1\n100\n', expectedOutput: 'CO-PRIME', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '999999937\n999999937\n', expectedOutput: 'NOT CO-PRIME', isHidden: true, label: 'Hidden Test Case 4' } // Wait, GCD of X and X is X. So not co-prime. Wait, input format is on separate lines or space separated? "Given two positive integers A and B on separate lines"
    ]
  },
  {
    title: "Count Majority Digits",
    description: `Given a large positive integer $N$, count and print the total number of digits that appear more than once throughout the composition of the number. 

For example, in \`112334\`, the digits \`1\` and \`3\` repeat. The count of such repeating majority elements is 2.`,
    difficulty: 'Medium',
    constraints: '1 <= N <= 10^15',
    tags: ['Python Loops'],
    testCases: [
      { input: '112334\n', expectedOutput: '2', isHidden: false, label: 'Sample Output 1' },
      { input: '12345\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '9999\n', expectedOutput: '1', isHidden: true, label: 'Hidden Test Case 3' },
      { input: '102030\n', expectedOutput: '1', isHidden: true, label: 'Hidden Test Case 4' } // 0 repeats
    ]
  },
  {
    title: "Max of Row Minimums",
    description: `Given an $R \\times C$ grid matrix, first locate the minimum element present in each separate row. Out of those collected row minimum values, find and print the maximum value. 

Input layout:
- First line: Two space-separated integers, $R$ and $C$.
- Next $R$ lines: Matrix contents.`,
    difficulty: 'Medium',
    constraints: '1 <= R, C <= 100\n-10^4 <= Matrix Elements <= 10^4',
    tags: ['Matrix Basics', 'Problem Solving'],
    testCases: [
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9\n', expectedOutput: '7', isHidden: false, label: 'Sample Output 1' },
      { input: '2 2\n10 20\n30 5\n', expectedOutput: '10', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '1 4\n-5 -10 -2 -8\n', expectedOutput: '-10', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Extract Substring",
    description: `Write a program that takes a string on the first line, followed by two space-separated integers, \`L\` and \`R\`, on the second line. Use string slicing to extract and print the subsegment of the string starting from index \`L\` up to and including index \`R\`.`,
    difficulty: 'Easy',
    constraints: '0 <= L <= R < String Length <= 1000',
    tags: ['Python String Slicing'],
    testCases: [
      { input: 'NewtonSchool\n3 8\n', expectedOutput: 'tonSch', isHidden: false, label: 'Sample Output 1' },
      { input: 'Coding\n0 0\n', expectedOutput: 'C', isHidden: true, label: 'Hidden Test Case 2' },
      { input: 'Platform\n0 7\n', expectedOutput: 'Platform', isHidden: true, label: 'Hidden Test Case 3' }
    ]
  },
  {
    title: "Sum of Numbers in an Array (Recursion)",
    description: `Write a program that reads a space-separated sequence of numbers into an array and computes their aggregate sum strictly using a recursive strategy (dividing the problem size down sequentially). Print the final total integer sum.`,
    difficulty: 'Medium',
    constraints: '1 <= Array length <= 500\n-10^4 <= Elements <= 10^4',
    tags: ['Recursion'],
    testCases: [
      { input: '5 10 15 20\n', expectedOutput: '50', isHidden: false, label: 'Sample Output 1' },
      { input: '0\n', expectedOutput: '0', isHidden: true, label: 'Hidden Test Case 2' },
      { input: '-10 20 -30 40\n', expectedOutput: '20', isHidden: true, label: 'Hidden Test Case 3' }
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
      // Small adjustment for the Co-Prime input formatting based on the prompt description.
      // 999999937 999999937 was space separated in the hidden test case but description says "separate lines". 
      // We'll leave the test case verbatim from the user input (so space separated for test case 4, but that's fine).

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
