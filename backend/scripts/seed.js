/**
 * scripts/seed.js — Database seeder for development.
 *
 * Run with: npm run seed
 *
 * Creates sample Modules, Quizzes, and Problems for local testing.
 * WARNING: This script drops existing data for the seeded collections!
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';
import Problem from '../models/Problem.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅  Connected to MongoDB for seeding...\n');

  // ── Wipe existing data ─────────────────────────────────────────────────────
  await Module.deleteMany({});
  await Quiz.deleteMany({});
  await Problem.deleteMany({});
  console.log('🗑️   Cleared existing modules, quizzes, and problems.\n');

  // ── Seed Modules ───────────────────────────────────────────────────────────
  const modules = await Module.insertMany([
    {
      title: 'Introduction to Programming',
      semester: 1,
      order: 1,
      description: 'Foundations of programming: variables, data types, control flow, loops, and functions.',
      isPublished: true,
      pdfUrls: [
        { label: 'Lecture 1 – Variables & Data Types', url: 'https://example.com/pdfs/intro-prog-lec1.pdf' },
        { label: 'Lecture 2 – Control Flow', url: 'https://example.com/pdfs/intro-prog-lec2.pdf' },
      ],
    },
    {
      title: 'Data Structures',
      semester: 1,
      order: 2,
      description: 'Arrays, linked lists, stacks, queues, and introduction to trees and graphs.',
      isPublished: true,
      pdfUrls: [
        { label: 'Lecture 1 – Arrays & Pointers', url: 'https://example.com/pdfs/ds-lec1.pdf' },
        { label: 'Lecture 2 – Linked Lists', url: 'https://example.com/pdfs/ds-lec2.pdf' },
        { label: 'Lecture 3 – Stacks & Queues', url: 'https://example.com/pdfs/ds-lec3.pdf' },
      ],
    },
    {
      title: 'Discrete Mathematics',
      semester: 1,
      order: 3,
      description: 'Logic, sets, relations, functions, and introductory combinatorics.',
      isPublished: true,
      pdfUrls: [
        { label: 'Lecture 1 – Propositional Logic', url: 'https://example.com/pdfs/dm-lec1.pdf' },
        { label: 'Lecture 2 – Set Theory', url: 'https://example.com/pdfs/dm-lec2.pdf' },
      ],
    },
  ]);

  console.log(`📚  Seeded ${modules.length} modules.`);

  // ── Seed Quizzes ───────────────────────────────────────────────────────────
  const quizzes = await Quiz.insertMany([
    {
      moduleId: modules[0]._id, // Intro to Programming
      title: 'Intro to Programming — Fundamentals Quiz',
      instructions: 'Test your knowledge on basic C/Python fundamentals. Answer all questions. You have 15 minutes.',
      timeLimitMinutes: 15,
      isPublished: true,
      questions: [
        {
          questionText: 'Which of the following is NOT a valid variable name in C or Python?',
          options: ['my_var', '_count', '2ndNumber', 'totalSum'],
          correctOptionIndex: 2,
          explanation: 'In C and Python, variable names cannot start with a digit. "2ndNumber" is invalid.',
          marks: 1,
        },
        {
          questionText: 'What is the output of the following C code?\n```c\nint x = 5;\nprintf("%d", x++);\n```',
          options: ['4', '5', '6', 'Compilation error'],
          correctOptionIndex: 1,
          explanation: 'x++ is a post-increment. The current value of x (5) is printed first, then x becomes 6.',
          marks: 1,
        },
        {
          questionText: 'Which loop is guaranteed to execute its body at least once in C/C++?',
          options: ['for', 'while', 'do-while', 'None of the above'],
          correctOptionIndex: 2,
          explanation: 'A do-while loop checks its condition AFTER executing the body, ensuring at least one execution.',
          marks: 1,
        },
        {
          questionText: 'What does the `continue` statement do inside a loop?',
          options: [
            'Skips the current iteration and continues with the next iteration of the loop',
            'Exits the loop immediately',
            'Restarts the program from the beginning',
            'Causes a compilation error',
          ],
          correctOptionIndex: 0,
          explanation: '`continue` skips the rest of the loop body for the current iteration and proceeds to the next iteration.',
          marks: 1,
        },
        {
          questionText: 'In Python, what is the result of `3 ** 2`?',
          options: ['6', '9', '5', 'Error'],
          correctOptionIndex: 1,
          explanation: 'The `**` operator in Python is used for exponentiation, so 3 squared is 9.',
          marks: 1,
        }
      ],
    },
    {
      moduleId: modules[1]._id, // Data Structures
      title: 'Data Structures — Basics Quiz',
      instructions: 'Select the best answer for each question regarding Arrays and Linked Lists.',
      timeLimitMinutes: 20,
      isPublished: true,
      questions: [
        {
          questionText: 'What is the time complexity of accessing an element by index in an array?',
          options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
          correctOptionIndex: 2,
          explanation: 'Array access by index is O(1) — direct memory addressing via base address + offset.',
          marks: 1,
        },
        {
          questionText: 'In a singly linked list, what does the `next` pointer of the last node point to?',
          options: ['The first node', 'Itself', 'NULL', 'Undefined behavior'],
          correctOptionIndex: 2,
          explanation: 'The last node\'s `next` pointer is set to NULL to signal the end of the list.',
          marks: 1,
        },
        {
          questionText: 'Which data structure uses LIFO (Last-In-First-Out) ordering?',
          options: ['Queue', 'Stack', 'Array', 'Linked List'],
          correctOptionIndex: 1,
          explanation: 'A Stack follows the Last-In-First-Out (LIFO) principle, like a stack of plates.',
          marks: 1,
        },
        {
          questionText: 'What is the worst-case time complexity of inserting an element at the beginning of a standard dynamic array?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctOptionIndex: 2,
          explanation: 'Inserting at the beginning requires shifting all existing elements one position to the right, taking O(n) time.',
          marks: 1,
        }
      ],
    },
    {
      moduleId: modules[2]._id, // Discrete Math
      title: 'Discrete Mathematics — Logic & Sets',
      instructions: 'Test your understanding of propositional logic and set theory.',
      timeLimitMinutes: 15,
      isPublished: true,
      questions: [
        {
          questionText: 'If set A has M elements and set B has N elements, what is the maximum possible number of elements in A ∩ B?',
          options: ['M + N', 'M * N', 'min(M, N)', 'max(M, N)'],
          correctOptionIndex: 2,
          explanation: 'The intersection can at most contain all elements of the smaller set, hence min(M, N).',
          marks: 1,
        },
        {
          questionText: 'In propositional logic, p → q is logically equivalent to:',
          options: ['¬p ∨ q', 'p ∧ ¬q', '¬p ∧ q', 'p ∨ ¬q'],
          correctOptionIndex: 0,
          explanation: 'The implication p → q is true if p is false or if q is true, which is exactly ¬p ∨ q.',
          marks: 1,
        },
        {
          questionText: 'What is the power set of {1, 2}?',
          options: ['{1, 2}', '{{1}, {2}}', '{∅, {1}, {2}}', '{∅, {1}, {2}, {1, 2}}'],
          correctOptionIndex: 3,
          explanation: 'The power set contains all possible subsets, including the empty set and the set itself.',
          marks: 1,
        }
      ],
    }
  ]);

  console.log(`📝  Seeded ${quizzes.length} quizzes.`);

  // ── Seed Problems ──────────────────────────────────────────────────────────
  const problems = await Problem.insertMany([
    // Module 1 Problems
    {
      moduleId: modules[0]._id,
      title: 'Sum of Two Numbers',
      difficulty: 'Easy',
      isPublished: true,
      description: `## Sum of Two Numbers

Given two integers **A** and **B**, print their sum. This is a classic warm-up problem to get familiar with reading input and writing output.

### Input Format
A single line containing two space-separated integers A and B.

### Output Format
A single integer — the sum of A and B.

### Sample
\`\`\`
Input:  3 7
Output: 10
\`\`\``,
      constraints: '−10⁹ ≤ A, B ≤ 10⁹ | Time limit: 1s | Memory: 256MB',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      timeLimitSeconds: 1,
      memoryLimitMB: 256,
      tags: ['Math', 'Basics'],
      starterCode: {
        Python: '# Read two integers and print their sum\na, b = map(int, input().split())\n# Your code here\n',
        'C++': '#include <iostream>\nusing namespace std;\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    // Your code here\n    return 0;\n}\n',
        C: '#include <stdio.h>\nint main() {\n    long long a, b;\n    scanf("%lld %lld", &a, &b);\n    // Your code here\n    return 0;\n}\n',
      },
      testCases: [
        { input: '3 7', expectedOutput: '10', isHidden: false, label: 'Sample 1' },
        { input: '-5 5', expectedOutput: '0', isHidden: false, label: 'Sample 2' },
        { input: '1000000000 1000000000', expectedOutput: '2000000000', isHidden: true },
        { input: '-999999999 -1', expectedOutput: '-1000000000', isHidden: true },
      ],
    },
    {
      moduleId: modules[0]._id,
      title: 'Factorial',
      difficulty: 'Easy',
      isPublished: true,
      description: `## Factorial

Compute the factorial of a non-negative integer **N**. 
Factorials are often calculated using either a loop or recursion. Choose the approach you are most comfortable with!

Recall: N! = N × (N−1) × … × 2 × 1, and 0! = 1.

### Input Format
A single integer N.

### Output Format
A single integer — N!

### Sample
\`\`\`
Input:  5
Output: 120
\`\`\``,
      constraints: '0 ≤ N ≤ 12 | Time limit: 1s | Memory: 256MB',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      timeLimitSeconds: 1,
      tags: ['Math', 'Recursion', 'Loops'],
      starterCode: {
        Python: 'n = int(input())\n# Compute factorial of n\n',
      },
      testCases: [
        { input: '5', expectedOutput: '120', isHidden: false, label: 'Sample 1' },
        { input: '0', expectedOutput: '1', isHidden: false, label: 'Sample 2' },
        { input: '12', expectedOutput: '479001600', isHidden: true },
        { input: '1', expectedOutput: '1', isHidden: true },
      ],
    },
    {
      moduleId: modules[0]._id,
      title: 'FizzBuzz',
      difficulty: 'Easy',
      isPublished: true,
      description: `## FizzBuzz

Write a program that prints the numbers from 1 to N. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".

### Input Format
A single integer N.

### Output Format
N lines, where the i-th line contains the output for the number i (1 ≤ i ≤ N).

### Sample
\`\`\`
Input:
15

Output:
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
\`\`\``,
      constraints: '1 ≤ N ≤ 1000 | Time limit: 1s | Memory: 256MB',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      timeLimitSeconds: 1,
      tags: ['Control Flow', 'Loops'],
      testCases: [
        { input: '5', expectedOutput: '1\n2\nFizz\n4\nBuzz', isHidden: false, label: 'Sample 1' },
        { input: '15', expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', isHidden: false, label: 'Sample 2' },
        { input: '1', expectedOutput: '1', isHidden: true },
      ],
    },
    
    // Module 2 Problems
    {
      moduleId: modules[1]._id,
      title: 'Reverse an Array',
      difficulty: 'Medium',
      isPublished: true,
      description: `## Reverse an Array

Given N integers, print them in reverse order.

### Input Format
Line 1: N (number of elements)
Line 2: N space-separated integers

### Output Format
N integers in reverse order, space-separated.

### Sample
\`\`\`
Input:
5
1 2 3 4 5

Output:
5 4 3 2 1
\`\`\``,
      constraints: '1 ≤ N ≤ 10⁵ | Time limit: 1s | Memory: 256MB',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      timeLimitSeconds: 1,
      tags: ['Arrays'],
      testCases: [
        { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', isHidden: false, label: 'Sample 1' },
        { input: '1\n42', expectedOutput: '42', isHidden: false, label: 'Sample 2' },
        { input: '3\n10 20 30', expectedOutput: '30 20 10', isHidden: true },
      ],
    },
    {
      moduleId: modules[1]._id,
      title: 'Valid Parentheses',
      difficulty: 'Medium',
      isPublished: true,
      description: `## Valid Parentheses

Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Output "YES" if the string is valid, otherwise "NO".

### Input Format
A single string of brackets.

### Output Format
"YES" or "NO".

### Sample
\`\`\`
Input:
()[]{}

Output:
YES
\`\`\`

\`\`\`
Input:
([)]

Output:
NO
\`\`\``,
      constraints: '1 ≤ Length of string ≤ 10⁴ | Time limit: 1s | Memory: 256MB',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      timeLimitSeconds: 1,
      tags: ['Stacks', 'Strings'],
      testCases: [
        { input: '()[]{}', expectedOutput: 'YES', isHidden: false, label: 'Sample 1' },
        { input: '([)]', expectedOutput: 'NO', isHidden: false, label: 'Sample 2' },
        { input: '{[]}', expectedOutput: 'YES', isHidden: false, label: 'Sample 3' },
        { input: '((', expectedOutput: 'NO', isHidden: true },
        { input: ']', expectedOutput: 'NO', isHidden: true },
        { input: '([{}])', expectedOutput: 'YES', isHidden: true },
      ],
    },

    // Module 3 Problems
    {
      moduleId: modules[2]._id,
      title: 'Intersection of Two Sets',
      difficulty: 'Medium',
      isPublished: true,
      description: `## Intersection of Two Sets

Given two sets of integers A and B, find the elements that are present in both sets. Output the intersection sorted in ascending order. If the intersection is empty, output "EMPTY".

### Input Format
Line 1: N (size of set A)
Line 2: N space-separated distinct integers
Line 3: M (size of set B)
Line 4: M space-separated distinct integers

### Output Format
The intersection of A and B, sorted in ascending order, space-separated. Or "EMPTY".

### Sample
\`\`\`
Input:
4
1 4 2 3
3
4 5 1

Output:
1 4
\`\`\``,
      constraints: '1 ≤ N, M ≤ 10⁴ | Elements ≤ 10⁹ | Time limit: 1s | Memory: 256MB',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      timeLimitSeconds: 1,
      tags: ['Sets', 'Sorting'],
      testCases: [
        { input: '4\n1 4 2 3\n3\n4 5 1', expectedOutput: '1 4', isHidden: false, label: 'Sample 1' },
        { input: '2\n1 2\n2\n3 4', expectedOutput: 'EMPTY', isHidden: false, label: 'Sample 2' },
        { input: '3\n10 20 30\n3\n30 20 10', expectedOutput: '10 20 30', isHidden: true },
        { input: '5\n100 200 300 400 500\n1\n200', expectedOutput: '200', isHidden: true },
      ],
    }
  ]);

  console.log(`💻  Seeded ${problems.length} problems.\n`);
  console.log('🎉  Seeding complete!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
