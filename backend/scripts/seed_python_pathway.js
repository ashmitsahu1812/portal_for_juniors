import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';
import Pathway from '../models/Pathway.js';

dotenv.config();

const MONGO_URI = "mongodb+srv://ashmitsahu181207_db_user:dbGUgyDEE6nBtbgr@cluster0.wbh1ahx.mongodb.net/lms_db?retryWrites=true&w=majority&appName=Cluster0";

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
          theoryText: "In Python, you don't need to declare types. You just write `x = 5`. To read input from the user, use `input()`. For numbers, wrap it like `int(input())`. Use `print()` to display output.",
          youtubeUrl: "https://www.youtube.com/embed/HcOc7P5BMi4", // using the user's provided link from earlier
          problems: level1
        },
        {
          levelNumber: 2,
          title: "Conditionals & Logic",
          theoryText: "Use `if`, `elif`, and `else` to make decisions in your code. Indentation (spaces) is critical in Python to define code blocks.",
          problems: level2
        },
        {
          levelNumber: 3,
          title: "Loops & Iteration",
          theoryText: "Use `for i in range(N):` to repeat code N times. Use `while` loops to repeat until a condition becomes false.",
          problems: level3
        },
        {
          levelNumber: 4,
          title: "Strings & Indexing",
          theoryText: "Strings are sequences of characters. Access them using index `s[0]`. Slice them using `s[start:end]`. Python makes string manipulation extremely easy.",
          problems: level4
        },
        {
          levelNumber: 5,
          title: "Lists, Arrays & Matrices",
          theoryText: "Lists store multiple items: `arr = [1, 2, 3]`. Add items with `arr.append()`. Matrices are just lists of lists.",
          problems: level5
        },
        {
          levelNumber: 6,
          title: "Recursion & Advanced Logic",
          theoryText: "A function can call itself! This is called recursion. You must always have a base case to stop the recursive calls from going on forever.",
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
