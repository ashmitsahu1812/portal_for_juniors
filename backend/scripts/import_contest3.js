import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "How would you extract \"Pyt\" from \"Python\" using slicing?",
    o: ["\"Python\"[0:2]", "\"Python\"[0:3]", "\"Python\"[1:3]", "\"Python\"[2:3]"],
    a: 1,
    e: "String slicing in Python follows the syntax string[start:stop], extracting characters starting from the start index up to, but strictly excluding, the stop index."
  },
  {
    q: "What will be the output of the following code?\nt = (1, 2, 3)\nt[1] = 4\nprint(t)",
    o: ["Error", "(1, 2, 3)", "(1, 4, 3)", "(1, 2, 3, 4)", "(4, 2, 3)"],
    a: 0,
    e: "In Python, tuples are immutable data structures. Attempting an item mutation like t[1] = 4 crashes execution, raising a TypeError."
  },
  {
    q: "What will be the output of the following code?\na = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint(a - b)",
    o: ["{1, 2, 3, 4, 5, 6}", "{1, 2}", "{3, 4}", "{5, 6}"],
    a: 1,
    e: "The subtraction operator - computes the relative difference set operation between two Python sets. Removing elements 3 and 4 from set a leaves exactly {1, 2}."
  },
  {
    q: "What will be the output of the following code snippet?\nmy_dict = {\"apple\": 3, \"banana\": 5, \"cherry\": 2}\noutput = my_dict[\"banana\"]\nprint(output)",
    o: ["3", "5", "2", "KeyError"],
    a: 1,
    e: "Accessing a dictionary by passing a valid key returns its associated paired value."
  },
  {
    q: "Predict the output of the following code:\nchoice = 5\nif choice == 1:\n    print(\"Circle\")\nelif choice == 2:\n    print(\"Square\")\nelif choice == 3:\n    print(\"Rectangle\")\nelse:\n    print(\"Invalid Choice\")",
    o: ["Square", "Circle", "Rectangle", "Invalid Choice"],
    a: 3,
    e: "Since 5 doesn't match 1, 2, or 3, the control flow shifts to the fallback default else execution block."
  },
  {
    q: "Consider the following Python code:\nn = 5\nfor i in range(n):\n    for j in range(n):\n        if i == 0 or i == n - 1 or j == 0 or j == n - 1:\n            print('*', end=' ')\n        else:\n            print(' ', end=' ')\n    print()\nWhat will be the exact output of the above code?",
    o: ["A 4x5 hollow boundary square", "A 5x5 hollow boundary square", "A solid 5x5 square", "None of the options"],
    a: 1,
    e: "This nested loop tracks a 2D matrix structure of size 5x5. The conditional statement prints an asterisk character on the boundaries, creating a hollow 5x5 boundary square."
  },
  {
    q: "What will be the output of the following code snippet?\nset1 = {1, 2, 3}\nset2 = {}\nset2.add(4)\nprint(set1.union(set2))",
    o: ["set()", "{1, 2, 3}", "Error", "{1, 2, 3, 4}"],
    a: 2,
    e: "Declaring set2 = {} initializes an empty dictionary, not a set. Dictionaries do not feature an .add() method, throwing an AttributeError."
  },
  {
    q: "What is the output of the following code?\ndata = {'x': [10, 20], 'y': [30, 40]}\nfor k in data.keys():\n    data[k] = data[k][::-1]\nprint(data)",
    o: ["{'x': [20, 10], 'y': [40, 30]}", "Error", "{'y': [10, 20], 'x': [30, 40]}", "{'x': [10, 20], 'y': [40, 30]}"],
    a: 0,
    e: "The loop iterates systematically through every key, extracting its associated array value list, and applies a reversing array slice [::-1]."
  },
  {
    q: "Consider the following Python function:\ndef mystery(n):\n    if n == 0:\n        return \"0\"\n    if n == 1:\n        return \"1\"\n    return mystery(n // 2) + str(n % 2)\nWhat will be the output of mystery(5)?",
    o: ["101", "110", "011", "1011"],
    a: 0,
    e: "This recursive structure breaks an integer down into its base-2 binary string. 5 in binary is 101."
  },
  {
    q: "What will be the output of the following code snippet?\nx = 0\ndef my_function(n):\n    global x\n    x += 1\n    if n == 0:\n        return 0\n    return my_function(n - 1) + x\nprint(my_function(3))",
    o: ["10", "16", "12", "14"],
    a: 2,
    e: "Due to the global tracker x, x reaches 4 by the time the base case returns. The deferred stack traces evaluate to 0+4=4, 4+4=8, and 8+4=12."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'PSP Comprehensive End Semester Exam',
      semester: 1,
      order: moduleCount + 1,
      description: 'Cumulative evaluation of core Python programming. Synthesizes data structure behaviors (mutability vs immutability), dictionary mappings, nested patterns, set operations, binary conversion algorithms, and recursive execution trees.',
      isPublished: true,
      pdfUrls: [
        { label: 'PSP End Semester Exam', url: 'https://example.com/pdfs/psp_end_semester_exam.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'Quiz | PSP End Semester Exam | ADYPU',
      instructions: 'Answer all 10 questions covering the entire PSP syllabus.',
      timeLimitMinutes: 45,
      isPublished: true,
      questions: rawData.map(q => ({
        questionText: q.q,
        options: q.o,
        correctOptionIndex: q.a,
        explanation: q.e,
        marks: 2
      }))
    });
    
    await newQuiz.save();
    console.log(`📝 Inserted new quiz with ${rawData.length} questions.`);

    console.log('🎉 Data entry complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error inserting data:', err);
    process.exit(1);
  }
};

seedNewData();
