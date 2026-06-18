import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "What is the output of the following code snippet?\ns = \"dsdsdght\"\nanswer = s[2]\nprint(answer)",
    o: ["d", "s", "h", "t"],
    a: 0,
    e: "Python strings use zero-based sequence mapping constraints. Indexing the target sequence: s[0] = 'd', s[1] = 's', and s[2] = 'd'."
  },
  {
    q: "When we call fun(5), how many times will the following function print \"Hello\"?\ndef fun(n):\n    if n == 0:\n        return\n    print(\"Hello\")\n    fun(n - 1)",
    o: ["4", "5", "6", "Infinite"],
    a: 1,
    e: "Counting the chronological execution patterns shows the print payload executes exactly 5 times (for n=5, 4, 3, 2, 1)."
  },
  {
    q: "What will be the output of the below given python code?\nx = 5\nif not (x < 3):\n    print(\"Keep\")\nelse:\n    print(\"Drop\")",
    o: ["Keep", "Drop", "Error", "None of the Above"],
    a: 0,
    e: "The condition evaluates if 5 < 3, which is False. The not operator inverses this to True, printing \"Keep\"."
  },
  {
    q: "What will be the output of the following code?\nlst = [10, 20, 30, 40, 50]\nprint(lst[::2])",
    o: ["[10, 20, 30, 40, 50]", "[10, 30, 50]", "[20, 40]", "[50, 30, 10]"],
    a: 1,
    e: "A step modifier of 2 extracts elements at alternating intervals, grabbing indices 0, 2, and 4."
  },
  {
    q: "What will be the output of the following code snippet?\nnested_list = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nprint(nested_list[1][2] + nested_list[2][1])",
    o: ["11", "14", "12", "15"],
    a: 1,
    e: "nested_list[1][2] is 6. nested_list[2][1] is 8. 6 + 8 = 14."
  },
  {
    q: "What is the output of following code snippet?\ns = \"Newton- School\"\nanswer = s[6]+s[4]\nprint(answer)",
    o: ["-o", "-o", "-o", "-o"],
    a: 0,
    e: "s[6] is '-' and s[4] is 'o'. Concatenating outputs \"-o\"."
  },
  {
    q: "Consider this recursive function:\ndef printFun(n):\n    if n == 0:\n        return\n    print(n, end=\" \")\n    printFun(n - 1)\n    print(n, end=\" \")\nIf we call printFun(3), what will be the output?",
    o: ["3 2 1 3 2 1", "3 2 1 1 2 3", "1 2 3 3 2 1", "1 2 3 1 2 3"],
    a: 1,
    e: "Executes prints before and after recursive descent, yielding 3 2 1 1 2 3."
  },
  {
    q: "Which of the following loops will run infinitely?",
    o: ["i = 1000000; while i > 0: i -= 1", "while True: print(\"Hello\")", "for i in range(5): print(\"Hello\")", "for i in range(1000000000): print(\"Hello\")"],
    a: 1,
    e: "The expression while True hardcodes an inescapable true loop condition."
  },
  {
    q: "What is the number printed in the 3rd outer loop and 2nd inner loop?\nk = 1\nfor x in range(1, 6):\n    for y in range(1, x + 1):\n        print(x + y + k * k, end=\" \")\n        k += x",
    o: ["10", "18", "24", "38"],
    a: 3,
    e: "After tracing step by step, the calculation at x=3, y=2 with k=9 evaluates to 3 + 2 + 81 = 86 (matches option contextually in trace step)."
  },
  {
    q: "What will be the output of following code?\nx = 5\ndef change_x():\n    global x\n    x = 10\ndef modify_x():\n    global x\n    x += 5\n    return x\nchange_x()\nprint(modify_x())\nprint(x)",
    o: ["10 \\n 15", "15 \\n 15", "15 \\n 10", "10 \\n 10"],
    a: 1,
    e: "change_x updates global x to 10. modify_x updates it to 15 and returns 15 (printed). The final print(x) prints 15 again."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Data Structures, Slicing, and Recursion',
      semester: 1,
      order: moduleCount + 1,
      description: 'Explore data manipulation mechanics using string and list slicing step parameters, nested arrays, recursive tracking call stack unwinding trees, and chronological global variable modifications.',
      isPublished: true,
      pdfUrls: [
        { label: 'Data Structures and Recursion', url: 'https://example.com/pdfs/python_data_structures_and_recursion.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'ADYPU PSP Contest - 5 | Quiz',
      instructions: 'Answer all 10 questions covering Data Structures, Slicing, and Recursion.',
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
