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
          theoryText: "### Welcome to Python!\nIn Python, you don't need to declare types explicitly. You simply assign a value: `x = 5` or `name = 'Alice'`.\n\n**Taking Input:** Use `input()` to get text from the user. Because `input()` always returns a string, you must *cast* it if you need a number: `age = int(input())`.\n\n**Basic Math:** Python supports standard operations: `+` (add), `-` (subtract), `*` (multiply), `/` (float division), `//` (integer division), and `%` (modulo - gives the remainder). \n\n**Output:** Use `print(x)` to display results.",
          youtubeUrl: "https://www.youtube.com/embed/kqtD5dpn9C8", // Mosh Python Basics
          problems: level1
        },
        {
          levelNumber: 2,
          title: "Conditionals & Logic",
          theoryText: "### Making Decisions\nPrograms need to make choices based on data. In Python, we use `if`, `elif` (else if), and `else` statements.\n\n**Indentation is Law:** Python uses spaces (usually 4) to define code blocks instead of curly braces `{}`. If you don't indent correctly, you will get an `IndentationError`.\n\n**Operators:**\n- Comparison: `==` (equal), `!=` (not equal), `>`, `<`, `>=`, `<=`\n- Logical: `and` (both true), `or` (at least one true), `not` (reverses truth)\n\nExample:\n```python\nif score >= 90:\n    print('A')\nelif score >= 80:\n    print('B')\nelse:\n    print('C')\n```",
          youtubeUrl: "https://www.youtube.com/embed/Zp5MuPOtsME", // Mosh If Statements
          problems: level2
        },
        {
          levelNumber: 3,
          title: "Loops & Iteration",
          theoryText: "### Repeating Actions\nInstead of copy-pasting code, we use loops to iterate over data.\n\n**For Loops & Range:**\nUse `for` when you know exactly how many times to repeat. `range(start, stop, step)` generates numbers. For example, `for i in range(5):` runs 5 times (0 to 4).\n\n**While Loops:**\nUse `while` when you want to repeat code until a condition becomes false. \n\n**Loop Control:**\n- `break`: Immediately exits the entire loop.\n- `continue`: Skips the rest of the current iteration and jumps to the next one.",
          youtubeUrl: "https://www.youtube.com/embed/94UHCEmprCY", // Mosh For Loops
          problems: level3
        },
        {
          levelNumber: 4,
          title: "Strings & Indexing",
          theoryText: "### Text Manipulation\nStrings are sequences of characters. Python makes string manipulation incredibly easy.\n\n**Indexing:** Access characters using zero-based indexing. `s[0]` is the first character. Python also supports *negative indexing*: `s[-1]` is the last character!\n\n**Slicing:** Extract a substring using `s[start:stop:step]`. For example, `s[1:4]` gets characters from index 1 up to (but not including) 4.\n\n**Useful Methods:**\n- `s.lower()` / `s.upper()`: Change case.\n- `s.replace('a', 'b')`: Replace characters.\n- `s.split(' ')`: Splits a sentence into a list of words.",
          youtubeUrl: "https://www.youtube.com/embed/k9TUPpGqYTo", // Mosh Strings
          problems: level4
        },
        {
          levelNumber: 5,
          title: "Lists, Arrays & Matrices",
          theoryText: "### Storing Collections\nLists are ordered, mutable (changeable) collections of items. Define them using square brackets: `arr = [10, 20, 30]`.\n\n**Operations:**\n- Add items: `arr.append(40)`\n- Remove items: `arr.pop()` (removes last) or `arr.remove(20)`\n- Get length: `len(arr)`\n\n**Matrices (2D Lists):**\nA matrix is simply a list inside another list: `matrix = [[1, 2], [3, 4]]`. To access the number 3, you would use `matrix[1][0]` (Row 1, Column 0).",
          youtubeUrl: "https://www.youtube.com/embed/9OeznAkyQz4", // Mosh Lists
          problems: level5
        },
        {
          levelNumber: 6,
          title: "Recursion & Advanced Logic",
          theoryText: "### The Inception of Coding\nRecursion happens when a function calls *itself* to solve a smaller instance of the same problem.\n\n**The Two Rules of Recursion:**\n1. **The Base Case:** The condition that tells the function to *stop* calling itself. Without this, your program will crash with a `RecursionError`.\n2. **The Recursive Step:** The part where the function calls itself with a slightly modified (smaller) input.\n\nExample (Factorial):\n```python\ndef fact(n):\n    if n == 1: return 1 # Base case\n    return n * fact(n-1) # Recursive step\n```",
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
