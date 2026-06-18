import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "What is the output of the below code?\nstudent_self_study_hours = 4\n\nif student_self_study_hours > 5:\n    print(\"Did wonders!\")\nelif 3 <= student_self_study_hours <= 5:\n    print(\"Was average.\")\nelse:\n    print(\"Needs more effort.\")",
    o: ["Did wonders!", "Was average.", "Needs more effort.", "was average"],
    a: 1,
    e: "The compound comparison statement 3 <= 4 <= 5 evaluates to True, executing its inner logic block which prints Was average."
  },
  {
    q: "Consider the following Python code fragment:\nfor i in range(13, 25):\n    print(i, end=\" \")\nHow many times will this above loop run in total?",
    o: ["11", "12", "13", "25"],
    a: 1,
    e: "Calculating total loop execution instances: stop - start = 25 - 13 = 12."
  },
  {
    q: "What will the following code's output be if the input string entered is exactly \"2.5\"?\nx = float(input())\ny = x + 1.5\nprint(y)",
    o: ["4", "2.5", "4.0", "Error"],
    a: 2,
    e: "The literal value \"2.5\" is cast cleanly into a float object. Adding two floating-point primitives (2.5 + 1.5) evaluates to 4.0."
  },
  {
    q: "What will be the output of the following code?\nx = 5\ny = 10\nif x > 3:\n    if y < 5:\n        print(\"A\")\n    elif y > 7:\n        print(\"B\")\n    else:\n        print(\"C\")\nelse:\n    print(\"D\")",
    o: ["A", "B", "C", "D"],
    a: 1,
    e: "The primary branch check evaluates 5 > 3 (True). The nested block evaluates y > 7 (10 > 7, True), printing \"B\"."
  },
  {
    q: "What will be printed in the 3rd iteration of this loop?\nx = 2\nwhile x <= 20:\n    print(x ** 2)\n    x += 6",
    o: ["4", "64", "196", "256"],
    a: 2,
    e: "1st Iteration: x=2. 2nd Iteration: x=8. 3rd Iteration: x=14. Prints 14^2 = 196."
  },
  {
    q: "What is the output of the following code?\nprint(\"A\", \"B\", \"C\", sep=\",\", end=\".\\n\")",
    o: ["A, B, C.", "A,B,C.", "A,B,C\\n.", "A,B,C.\\n"],
    a: 1,
    e: "The sep=\",\" joins the elements as A,B,C. The end=\".\\n\" attaches a trailing full-stop followed by a newline."
  },
  {
    q: "What will be the output of following code?\nfor i in range(1, 6):\n    if i % 2 == 0:\n        print(i, end=\" \")\n    else:\n        continue\n    print(\"even\", end=\" \")",
    o: ["2 even 4 even", "1 3 5", "1 even 3 even 5 even", "2 4"],
    a: 0,
    e: "Odd values trigger continue, skipping prints. Even values (2 and 4) print the number followed by \"even\"."
  },
  {
    q: "What will be the output of following code?\ndef demo():\n    global x\n    y = 10\n    print(x, y)\n    x = x + 5\n\nx = 20\ndemo()\nprint(x)",
    o: ["25 10 25", "25 10 \\n 25", "20 10 \\n 25", "15 10 \\n 25"],
    a: 2,
    e: "Initially prints global x (20) and local y (10). Then updates global x to 25. Finally prints updated global x (25)."
  },
  {
    q: "What will be the output of the following code?\ndef func(x, y=5):\n    return x * y\n\nprint(func(3))\nprint(func(2, 10))\nprint(func(4, y=2))",
    o: ["15 \\n 20 \\n 10", "15 \\n 20 \\n 8", "10 \\n 15 \\n 20", "Error"],
    a: 1,
    e: "func(3) -> 3*5 = 15. func(2,10) -> 2*10 = 20. func(4, y=2) -> 4*2 = 8."
  },
  {
    q: "What will be the output of following code?\ncount = 0\nfor i in range(10):\n    for j in range(10):\n        if i % 2 == 0:\n            break\n        count += 1\nprint(count)",
    o: ["50", "25", "100", "0"],
    a: 0,
    e: "When i is even, the inner loop breaks instantly. When i is odd, it runs 10 times. There are 5 odd values, so 5 * 10 = 50."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Python Control Flow and Functions',
      semester: 1,
      order: moduleCount + 1,
      description: 'Master conditional statements, loops (for, while), loop control mechanics (break, continue), functional scopes, global keyword interactions, and nested loops execution metrics.',
      isPublished: true,
      pdfUrls: [
        { label: 'Python Control Flow', url: 'https://example.com/pdfs/python_control_flow_and_functions.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'ADYPU PSP Contest - 3 [Quiz]',
      instructions: 'Answer all 10 questions covering Python Control Flow and Functions.',
      timeLimitMinutes: 30,
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
