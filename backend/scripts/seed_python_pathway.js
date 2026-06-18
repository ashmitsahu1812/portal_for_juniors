import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';
import Pathway from '../models/Pathway.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("Missing MONGODB_URI in environment variables.");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // Helper to get problem by title
    const getProblemId = async (title) => {
      const p = await Problem.findOne({ title });
      if (!p) {
        console.warn(`Problem not found: ${title}`);
        return null;
      }
      return p._id;
    };

    // Define the levels based on our plan
    const level1 = [
      await getProblemId("Sum of Two Numbers"),
      await getProblemId("Find Absolute Value"),
      await getProblemId("Average of Three - II"),
      await getProblemId("Simple Interest Calculator")
    ].filter(Boolean);

    const level2 = [
      await getProblemId("Age Categorisation"),
      await getProblemId("Check Vowel or Consonant"),
      await getProblemId("FizzBuzz"),
      await getProblemId("Max of two Numbers")
    ].filter(Boolean);

    const level3 = [
      await getProblemId("Print 1 to N using for Loop - II"),
      await getProblemId("Print Multiples of 3 in a Given Range"),
      await getProblemId("Factorial"),
      await getProblemId("Find Primes - II")
    ].filter(Boolean);

    const level4 = [
      await getProblemId("Print Characters of a String"),
      await getProblemId("Length of an Alphanumeric String"),
      await getProblemId("Characters at Odd Indices"),
      await getProblemId("Extract Substring")
    ].filter(Boolean);

    const level5 = [
      await getProblemId("Print All Elements of a List"),
      await getProblemId("Reverse an Array"),
      await getProblemId("Matrix Subtraction"),
      await getProblemId("Intersection of Two Sets")
    ].filter(Boolean);

    const level6 = [
      await getProblemId("Digit Sum using Recursion"),
      await getProblemId("Valid Parentheses"),
      await getProblemId("Target Value"),
      await getProblemId("Gukesh’s Winning Chessboard")
    ].filter(Boolean);

    // Delete existing pathways if any to avoid duplicates
    await Pathway.deleteMany({});

    const pythonPathway = new Pathway({
      title: "Problem Solving in Python",
      description: "A complete step-by-step roadmap to mastering Python. Solve problems at each level to unlock the next.",
      icon: "Map",
      levels: [
        {
          levelNumber: 1,
          title: "Variables, Math & I/O",
          theoryText: "Variables in Python are dynamically typed, meaning explicit type declaration is not required. Assignment is performed using the `=` operator. Standard input is handled via the `input()` function, which returns a string by default. Type casting, such as `int()`, is required for numerical operations. Standard arithmetic operators include `+`, `-`, `*`, `/`, `//` (floor division), and `%` (modulo). Output is directed to stdout using `print()`.",
          youtubeUrl: "https://www.youtube.com/embed/kqtD5dpn9C8", // Mosh Python Basics
          problems: level1
        },
        {
          levelNumber: 2,
          title: "Conditionals & Logic",
          theoryText: "Control flow is managed using `if`, `elif`, and `else` statements. Python enforces block structure through strict indentation rather than braces. Conditional logic relies on comparison operators (`==`, `!=`, `<`, `>`) and boolean operators (`and`, `or`, `not`). Accurate indentation is required to prevent syntax errors.",
          youtubeUrl: "https://www.youtube.com/embed/Zp5MuPOtsME", // Mosh If Statements
          problems: level2
        },
        {
          levelNumber: 3,
          title: "Loops & Iteration",
          theoryText: "Iteration in Python is achieved through `for` and `while` loops. The `for` loop is typically used in conjunction with the `range()` function or to iterate over iterables. The `while` loop executes as long as its condition evaluates to true. Loop execution can be modified using `break` to exit entirely, or `continue` to skip to the next iteration.",
          youtubeUrl: "https://www.youtube.com/embed/94UHCEmprCY", // Mosh For Loops
          problems: level3
        },
        {
          levelNumber: 4,
          title: "Strings & Indexing",
          theoryText: "Strings are immutable sequences of Unicode characters. Individual characters are accessed via zero-based indexing (`s[0]`), while negative indexing accesses characters from the end (`s[-1]`). Substrings can be extracted using slicing syntax (`s[start:stop:step]`). Common string methods include `.lower()`, `.upper()`, `.replace()`, and `.split()`.",
          youtubeUrl: "https://www.youtube.com/embed/k9TUPpGqYTo", // Mosh Strings
          problems: level4
        },
        {
          levelNumber: 5,
          title: "Lists, Arrays & Matrices",
          theoryText: "Lists are ordered, mutable sequences capable of storing heterogeneous data types. They are defined using square brackets. Items can be appended using `.append()`, removed using `.pop()`, and the total length is retrieved with `len()`. Multi-dimensional arrays (matrices) are implemented as nested lists and accessed via multiple indices (e.g., `matrix[row][col]`).",
          youtubeUrl: "https://www.youtube.com/embed/9OeznAkyQz4", // Mosh Lists
          problems: level5
        },
        {
          levelNumber: 6,
          title: "Recursion & Advanced Logic",
          theoryText: "Recursion is a programming technique where a function calls itself to solve smaller instances of a problem. A well-formed recursive function requires a base case to terminate the recursion and a recursive step to progress toward the base case. Failure to implement a proper base case will result in a runtime exception.",
          youtubeUrl: "https://www.youtube.com/embed/wMNrSM5RFMc", // FreeCodeCamp Recursion
          problems: level6
        }
      ]
    });

    await pythonPathway.save();
    console.log("Successfully seeded Python Pathway!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
