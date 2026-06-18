import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Books Catalog : Access Lists",
    description: `You are maintaining a list of book IDs. Given a list of integers representing book catalog identifiers and two indices, \`Start\` and \`End\`, use Python list slicing syntax to extract and print the sublist from index \`Start\` up to (but excluding) index \`End\`.`,
    difficulty: 'Easy',
    constraints: '1 <= Number of books <= 100\n0 <= Start <= End <= Number of books',
    tags: ['Python List Slicing'],
    testCases: [
      { input: '101 102 103 104 105\n1 4\n', expectedOutput: '[102, 103, 104]', isHidden: false, label: 'Sample Output 1' },
      { input: '50 60 70 80\n0 2\n', expectedOutput: '[50, 60]', isHidden: true, label: 'Hidden Test Case 2' }
    ]
  },
  {
    title: "Search by Title",
    description: `A user is searching for a book position in an alphabetical catalog list. Given a single line containing space-separated string book titles and a target title to search for on the next line, find and print the 0-based index position of the target title. If the book title is not present in the catalog list, print \`-1\`.`,
    difficulty: 'Easy',
    constraints: '1 <= Number of books <= 100\nTitles are single-word alphanumeric strings.',
    tags: ['Python List Indexing'],
    testCases: [
      { input: 'Python Physics Chemistry Math\nChemistry\n', expectedOutput: '2', isHidden: false, label: 'Sample Output 1' },
      { input: 'History Biology Arts\nGeography\n', expectedOutput: '-1', isHidden: true, label: 'Hidden Test Case 2' }
    ]
  },
  {
    title: "Print The List",
    description: `Write a program that takes an integer $N$ representing the number of entries, followed by $N$ elements on separate lines. Read these elements into a standard Python list, and print the finalized list structure directly to stdout.`,
    difficulty: 'Easy',
    constraints: '1 <= N <= 50',
    tags: ['Python List Input'],
    testCases: [
      { input: '3\nApple\nBanana\nCherry\n', expectedOutput: "['Apple', 'Banana', 'Cherry']", isHidden: false, label: 'Sample Output 1' },
      { input: '1\nSingleEntry\n', expectedOutput: "['SingleEntry']", isHidden: true, label: 'Hidden Test Case 2' }
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
    let parentModule = await Module.findOne({ title: /Python Data Structures/i });
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
