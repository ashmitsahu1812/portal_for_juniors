import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Max of two Numbers",
    description: `You are given two distinct integers **a** and **b**. Your task is to complete the program that takes two parameters **a** and **b** that returns the maximum of the two numbers.

Note: It is guaranteed that **a != b**.
Note: You are not allowed to use inbuilt max function.`,
    difficulty: 'Easy',
    constraints: '-10^5 <= a, b <= 10^5',
    tags: ['Conditionals'],
    testCases: [
      { input: '10 20\n', expectedOutput: '20', isHidden: false, label: 'Sample Output 1' },
      { input: '50 10\n', expectedOutput: '50', isHidden: true, label: 'Hidden 1' },
      { input: '-5 -10\n', expectedOutput: '-5', isHidden: true, label: 'Hidden 2' },
      { input: '-20 -15\n', expectedOutput: '-15', isHidden: true, label: 'Hidden 3' },
      { input: '100 -100\n', expectedOutput: '100', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Find Primes - II",
    description: `You are required to find the count of **Prime** Numbers between **a** and **b** (Both Inclusive).

A predefined function **find_prime(a, b)** is available, which **returns** the count of Prime numbers between a and b. If no prime numbers exist between the given range, it will return -1.

Your task is simply to:
1. Take two integers **a** and **b** as input.
2. Call the function **find_prime(a, b)** with values a and b.
3. Print the result **returned** by the function.

Note: For the purpose of this platform, please implement both the find_prime logic and the input parsing in your code.`,
    difficulty: 'Easy',
    constraints: '1 <= a, b <= 1000',
    tags: ['Loops', 'Functions', 'Math'],
    testCases: [
      { input: '10 20\n', expectedOutput: '4', isHidden: false, label: 'Sample Output 1' },
      { input: '1 10\n', expectedOutput: '4', isHidden: true, label: 'Hidden 1' },
      { input: '20 30\n', expectedOutput: '2', isHidden: true, label: 'Hidden 2' },
      { input: '24 28\n', expectedOutput: '-1', isHidden: true, label: 'Hidden 3' },
      { input: '50 60\n', expectedOutput: '2', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Enough Chocolates for Everyone",
    description: `There are **N** people waiting eagerly for chocolates, and you have **R** chocolates in hand. Can you ensure that everyone gets **at least one chocolate**?

- If it is possible to give **at least one chocolate** to everyone, print "**YES**".
- Otherwise, print "**NO**".`,
    difficulty: 'Easy',
    constraints: '1 <= N <= 10^5\n0 <= R <= 10^5',
    tags: ['Conditionals'],
    testCases: [
      { input: '5 10\n', expectedOutput: 'YES', isHidden: false, label: 'Sample Output 1' },
      { input: '10 5\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 1' },
      { input: '10 10\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 2' },
      { input: '1 0\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 3' },
      { input: '5 4\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Print 1 to N using for Loop - II",
    description: `Given the integer number N. Write a Python program to print all numbers from **1 to N**. in separate line.

Note:
- Please attempt this problem using **for loop** only. Use of 'while' loop is not allowed.
- **Please don't use end, sep.**`,
    difficulty: 'Easy',
    constraints: '1 <= N <= 1000',
    tags: ['Loops'],
    testCases: [
      { input: '3\n', expectedOutput: '1\n2\n3', isHidden: false, label: 'Sample Output 1' },
      { input: '1\n', expectedOutput: '1', isHidden: true, label: 'Hidden 1' },
      { input: '5\n', expectedOutput: '1\n2\n3\n4\n5', isHidden: true, label: 'Hidden 2' },
      { input: '2\n', expectedOutput: '1\n2', isHidden: true, label: 'Hidden 3' },
      { input: '4\n', expectedOutput: '1\n2\n3\n4', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Print 1 to N using while Loop",
    description: `You are given an integer **N**. Your task is to write a Python program that prints all numbers from **1** to **N**, with each number printed on a new line.

Note: You must solve this using a **while** loop only. The use of a **for** loop is not allowed.`,
    difficulty: 'Easy',
    constraints: '1 <= N <= 1000',
    tags: ['Loops'],
    testCases: [
      { input: '3\n', expectedOutput: '1\n2\n3', isHidden: false, label: 'Sample Output 1' },
      { input: '1\n', expectedOutput: '1', isHidden: true, label: 'Hidden 1' },
      { input: '5\n', expectedOutput: '1\n2\n3\n4\n5', isHidden: true, label: 'Hidden 2' },
      { input: '2\n', expectedOutput: '1\n2', isHidden: true, label: 'Hidden 3' },
      { input: '4\n', expectedOutput: '1\n2\n3\n4', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Print Multiples of 3 in a Given Range",
    description: `You are given two integers, **L** and **R**, representing the inclusive range [L,R]. Your task is to print all the integers within this range that are divisible by 3, each on a separate line. If no such integer exists, print nothing.`,
    difficulty: 'Easy',
    constraints: '1 <= L <= R <= 1000',
    tags: ['Loops', 'Conditionals'],
    testCases: [
      { input: '3 9\n', expectedOutput: '3\n6\n9', isHidden: false, label: 'Sample Output 1' },
      { input: '1 5\n', expectedOutput: '3', isHidden: true, label: 'Hidden 1' },
      { input: '10 12\n', expectedOutput: '12', isHidden: true, label: 'Hidden 2' },
      { input: '14 16\n', expectedOutput: '15', isHidden: true, label: 'Hidden 3' },
      { input: '5 8\n', expectedOutput: '6', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Digit Counter",
    description: `You are given an integer **N** and a digit **d**. Your task is to determine how many times d appears in N.

Note:
- **Leading zeros will not appear in N**. For example, the number will never be written as \`000123\`.`,
    difficulty: 'Easy',
    constraints: '0 <= N <= 10^9\n0 <= d <= 9',
    tags: ['Math', 'Loops'],
    testCases: [
      { input: '11223 2\n', expectedOutput: '2', isHidden: false, label: 'Sample Output 1' },
      { input: '999 9\n', expectedOutput: '3', isHidden: true, label: 'Hidden 1' },
      { input: '12345 6\n', expectedOutput: '0', isHidden: true, label: 'Hidden 2' },
      { input: '1000 0\n', expectedOutput: '3', isHidden: true, label: 'Hidden 3' },
      { input: '7 7\n', expectedOutput: '1', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Find The GCD",
    description: `Write a program that takes **two** positive integers as input and calculates their **Greatest Common Divisor (GCD)**.

Note: The GCD (also known as HCF - Highest Common Factor) of two numbers is the **largest** number that divides both of them without leaving a remainder.`,
    difficulty: 'Medium',
    constraints: '1 <= a, b <= 10^9',
    tags: ['Math', 'Number Theory'],
    testCases: [
      { input: '12 15\n', expectedOutput: '3', isHidden: false, label: 'Sample Output 1' },
      { input: '10 20\n', expectedOutput: '10', isHidden: true, label: 'Hidden 1' },
      { input: '7 13\n', expectedOutput: '1', isHidden: true, label: 'Hidden 2' },
      { input: '100 25\n', expectedOutput: '25', isHidden: true, label: 'Hidden 3' },
      { input: '48 18\n', expectedOutput: '6', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Second Largest Divisor",
    description: `You are given two positive integers **a** and **b**. Your task is to find the **second largest divisor** of **a** and **b**.

Note 1: It is guaranteed that the greatest common divisor (GCD) of **a** and **b** is **not equal to 1**.

Note 2: The GCD (also known as HCF - Highest Common Factor) of two numbers is the **largest** number that divides both of them without leaving a remainder.`,
    difficulty: 'Medium',
    constraints: '2 <= a, b <= 10^9',
    tags: ['Math', 'Number Theory'],
    testCases: [
      { input: '12 18\n', expectedOutput: '3', isHidden: false, label: 'Sample Output 1' },
      { input: '100 50\n', expectedOutput: '25', isHidden: true, label: 'Hidden 1' },
      { input: '30 45\n', expectedOutput: '5', isHidden: true, label: 'Hidden 2' },
      { input: '20 30\n', expectedOutput: '5', isHidden: true, label: 'Hidden 3' },
      { input: '24 36\n', expectedOutput: '6', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Password Check",
    description: `You are required to repeatedly read numbers (password attempts) until the **correct password** is entered.

The correct password is **1999**.

- For every incorrect password attempt, print "**Wrong**".
- When the correct password **1999** is entered, first print "**Correct**" and then terminate the program immediately.`,
    difficulty: 'Medium',
    constraints: 'All attempts will be integers.',
    tags: ['Loops', 'Conditionals'],
    testCases: [
      { input: '1999\n', expectedOutput: 'Correct', isHidden: false, label: 'Sample Output 1' },
      { input: '1000\n1999\n', expectedOutput: 'Wrong\nCorrect', isHidden: true, label: 'Hidden 1' },
      { input: '0\n0\n1999\n', expectedOutput: 'Wrong\nWrong\nCorrect', isHidden: true, label: 'Hidden 2' },
      { input: '2000\n1998\n1999\n', expectedOutput: 'Wrong\nWrong\nCorrect', isHidden: true, label: 'Hidden 3' },
      { input: '1\n2\n3\n1999\n', expectedOutput: 'Wrong\nWrong\nWrong\nCorrect', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Strange Fibonacci",
    description: `You are given a sequence of numbers. The **first two** terms of the sequence are provided as input.

From the third term onward, each term is computed using the rule:
\`current_term = 2 * last_term + 3 * second_last_term\`

Your task is to find and print the value of the **n**-th term of this sequence.

Input Format:
Three space-separated integers: \`T1 T2 n\` (the first term, the second term, and the term number to find).`,
    difficulty: 'Easy',
    constraints: '1 <= T1, T2 <= 100\n1 <= n <= 20',
    tags: ['Math', 'Recursion', 'Loops'],
    testCases: [
      { input: '1 1 3\n', expectedOutput: '5', isHidden: false, label: 'Sample Output 1' },
      { input: '1 1 4\n', expectedOutput: '13', isHidden: true, label: 'Hidden 1' },
      { input: '2 3 3\n', expectedOutput: '12', isHidden: true, label: 'Hidden 2' },
      { input: '1 1 1\n', expectedOutput: '1', isHidden: true, label: 'Hidden 3' },
      { input: '1 1 2\n', expectedOutput: '1', isHidden: true, label: 'Hidden 4' }
    ]
  }
];

const starterCode = {
  'Python': '# Write your Python solution here\n',
  'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
  'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
  'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
};

const seedProblems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    let parentModule = await Module.findOne({ title: /End semester prep guide/i });
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
        console.log(`Problem ${p.title} already exists. Skipping.`);
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
      console.log(`👨‍💻 Inserted new problem: ${newProblem.title}`);
    }

    console.log('🎉 Data entry complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error inserting data:', err);
    process.exit(1);
  }
};

seedProblems();
