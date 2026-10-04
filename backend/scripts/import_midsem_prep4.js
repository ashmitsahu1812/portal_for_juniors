import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Check for Intersection Between Two Circles with Same Radii",
    description: `You are given two circles in a 2D plane. Each circle is defined by the coordinates of its center and its radius. These two circles have the **same radius**. Determine whether the two circles intersect **along their circumferences**. Two circles are considered to intersect if they share **at least one point on their circumferences**.

If they intersect, print \`YES\`; otherwise, print \`NO\`

Input Format:
The first line contains \`x1 y1 r\`
The second line contains \`x2 y2 r\``,
    difficulty: 'Hard',
    constraints: '-10^4 <= x1, y1, x2, y2 <= 10^4\n1 <= r <= 10^4',
    tags: ['Geometry', 'Math'],
    testCases: [
      { input: '0 0 5\n10 0 5\n', expectedOutput: 'YES', isHidden: false, label: 'Sample Output 1' },
      { input: '0 0 5\n11 0 5\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 1' },
      { input: '0 0 5\n0 0 5\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 2' },
      { input: '3 4 5\n-3 -4 5\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 3' },
      { input: '0 0 1\n3 3 1\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Circle Intersection Check With Different Radii",
    description: `You are given two circles in a 2D plane. Each circle is defined by the coordinates of its center and its radius. These two circles may have **different radii**.

Determine whether the two circles intersect **along their circumferences**. Two circles are considered to intersect if they share **at least one point on their circumferences**.

If they intersect, print \`YES\`; otherwise, print \`NO\`.

Input Format:
The first line contains \`x1 y1 r1\`
The second line contains \`x2 y2 r2\``,
    difficulty: 'Hard',
    constraints: '-10^4 <= x1, y1, x2, y2 <= 10^4\n1 <= r1, r2 <= 10^4',
    tags: ['Geometry', 'Math'],
    testCases: [
      { input: '0 0 5\n10 0 5\n', expectedOutput: 'YES', isHidden: false, label: 'Sample Output 1' },
      { input: '0 0 5\n10 0 4\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 1' },
      { input: '0 0 10\n0 0 2\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 2' },
      { input: '0 0 5\n3 4 2\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 3' },
      { input: '0 0 10\n0 5 5\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Frog Game",
    description: `There are **n** lilypads arranged in a row, numbered from 1 to n.
**Alice starts** on lilypad **a** and **Bob starts** on lilypad **b** (where **a != b**).

The game begins with Alice, and **both players take turns alternately**.
On each turn, a player must move exactly one step —
- to the left if they are not already on lilypad 1, or
- to the right if they are not already on lilypad n.

**A player cannot jump onto the lilypad currently occupied by the other player.**
If a player has no valid moves, they lose immediately.

Your task is to determine **whether Alice can guarantee a win**, assuming both play optimally.
It can be shown that the game always ends in a finite number of moves.

Print \`YES\` if Alice can guarantee a win, else \`NO\`.

Input Format:
Three space-separated integers \`n a b\``,
    difficulty: 'Hard',
    constraints: '2 <= n <= 100\n1 <= a, b <= n',
    tags: ['Game Theory'],
    testCases: [
      { input: '5 2 4\n', expectedOutput: 'YES', isHidden: false, label: 'Sample Output 1' },
      { input: '5 2 3\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 1' },
      { input: '2 1 2\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 2' },
      { input: '10 1 10\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 3' },
      { input: '10 4 5\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 4' }
    ]
  },
  {
    title: "Square of Rectangles",
    description: `Aryan is an ardent lover of **squares** but dislikes **rectangles** (yes, he knows every square is a rectangle). Harshith, trying to annoy him, gives Aryan three rectangles with dimensions \`l1 x b1\`, \`l2 x b2\`, and \`l3 x b3\`, where \`l3 <= l2 <= l1\` and \`b3 <= b2 <= b1\`.

To outsmart Harshith, Aryan wants to arrange these three rectangles to form a **perfect square**, ensuring that:
- No two rectangles overlap,
- The rectangles are aligned along the edges, and
- Rotation of rectangles is **not** allowed.

Help Aryan determine whether he can succeed. Print \`YES\` if he can form a perfect square, else \`NO\`.

Input Format:
Three lines, each containing two space-separated integers \`li bi\`.`,
    difficulty: 'Hard',
    constraints: '1 <= li, bi <= 10^4',
    tags: ['Geometry', 'Logic'],
    testCases: [
      { input: '5 5\n3 2\n2 2\n', expectedOutput: 'YES', isHidden: false, label: 'Sample Output 1' },
      { input: '10 10\n5 5\n5 5\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 1' },
      { input: '6 4\n4 2\n2 2\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 2' },
      { input: '3 3\n2 2\n1 1\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 3' },
      { input: '8 4\n4 4\n4 4\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 4' }
    ]
  }
];

const starterCode = {
  'Python': '# Write your Python solution here\n',
  'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
  'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
  'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
};

const seedHardProblems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    let parentModule = await Module.findOne({ title: /End semester prep guide/i });
    if (!parentModule) {
      console.log('Module not found, creating it...');
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

seedHardProblems();
