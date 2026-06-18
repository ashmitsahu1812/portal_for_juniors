import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "What will be the output of the following code?\n`print(round(4.617, 2))`",
    o: ["5.00", "4.62", "4.61", "4.60"],
    a: 1,
    e: "Rounding 4.617 to 2 decimal places looks at the third decimal digit (7), which rounds the 1 up to a 2, resulting in 4.62."
  },
  {
    q: "What will be the output of the following code?\na = 3\nb = 2\nprint(type(a / b))",
    o: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'bool'>"],
    a: 1,
    e: "The single forward slash operator / performs true division, which always returns a floating-point value. type(1.5) evaluates to <class 'float'>."
  },
  {
    q: "What will be the output of the following code?\nage = 18\nprint(age >= 18)",
    o: ["True", "False", "None of the Above", "Error"],
    a: 0,
    e: "Because age is exactly equal to 18, the conditional expression 18 >= 18 evaluates cleanly to True."
  },
  {
    q: "What will be the output of the following code?\nprint(\"Today is my first PSP contest\")",
    o: ["\"Today is my first PSP contest\"", "Today is my first PSP contest", "Today, is my first PSP contest.", "None of the above"],
    a: 1,
    e: "The print() function outputs the literal string contents without the structural outer quotes."
  },
  {
    q: "What will be the output of the below given Python code?\nstring = \"False\"\nprint(bool(string))",
    o: ["False", "True", "1", "0"],
    a: 1,
    e: "Evaluating any non-empty string via bool() returns True. The string \"False\" is not empty."
  },
  {
    q: "What will be the output of the following code?\n1st_var = 2\n2nd_var = 3\nprint(1st_var + 2nd_var)",
    o: ["5", "2+3", "3", "The code will give a Syntax Error"],
    a: 3,
    e: "Variable names cannot start with a numerical digit (0-9)."
  },
  {
    q: "What will be the output of the following code?\nx = 4\ny = x\nx = 7\nprint(y)",
    o: ["4", "7", "0", "Error"],
    a: 0,
    e: "y = x makes y point to the integer object 4. When x is re-bound to 7, y remains pointing to 4."
  },
  {
    q: "What will be the output of the following code?\na = 10\nb = \"5\"\nc = int(b)\nd = a + int(b) / c\nprint(type(d))",
    o: ["<class 'int'>", "<class 'bool'>", "<class 'float'>", "<class 'str'>"],
    a: 2,
    e: "Because a float object is introduced via the / operator (5 / 5 = 1.0), the final datatype of d is <class 'float'>."
  },
  {
    q: "What will be the output of the following code if the user enters 2.5 and 2 as the values of a and b in the code below?\na = float(input())\nb = int(input())\nprint(a * b)",
    o: ["5", "5.0", "4", "It will raise an error"],
    a: 1,
    e: "Multiplying a float (2.5) by an integer (2) evaluates to a floating-point representation 5.0."
  },
  {
    q: "What will be the output of the following code if the input string entered is exactly 02:05:59?\na, b, c = input().split(':')\na = int(a)\nb = int(b)\nc = int(c)\nprint(a*60*60 + b*60 + c)",
    o: ["7559", "7499", "7259", "7359"],
    a: 0,
    e: "(2 * 3600) + (5 * 60) + 59 = 7200 + 300 + 59 = 7559."
  },
  {
    q: "What will be the output of this program?\nx = 5.0\ny = 10\nz = 100 // x % 3 * y / 5\nprint(z)",
    o: ["0.0", "20.0", "4.0", "40.0"],
    a: 2,
    e: "100 // 5.0 = 20.0. 20.0 % 3 = 2.0. 2.0 * 10 = 20.0. 20.0 / 5 = 4.0."
  },
  {
    q: "What will be the output of the following code?\nprint(\"Ramanujan\", \"Hopper\", \"Turing\", \"Neumann\", sep=\"->\", end=\"\\n\")\nprint(\"All are batch names\")",
    o: ["Ramanujan,Hopper,Turing,Neumann \\n All are batch names", "Ramanujan->Hopper->Turing->Neumann All are batch names", "Ramanujan->Hopper->Turing->Neumann\\nAll are batch names", "Ramanujan -> Hopper -> Turing -> Neumann \\n All are batch names"],
    a: 2,
    e: "sep=\"->\" separates words with arrows, and end=\"\\n\" places the next print statement on a new line."
  },
  {
    q: "What will be the output of the given program?\na = \"NST\"\nb = \"ADYPU\"\nprint(\"NS\", a, b, 2, sep=\"_\")",
    o: ["NS_NST_ADYPU_2", "NS NST ADYPU 2", "NS_NST_ADYPU_2.0", "NST_ADYPU_2"],
    a: 0,
    e: "The custom separator sep=\"_\" joins all four parameters together."
  },
  {
    q: "What will be the output of the following Python code?\na = 8\nb = 3\nc = 2\nresult = a % b * c + a // c ** b - b - c\nprint(result)",
    o: ["0", "-1", "1", "2"],
    a: 0,
    e: "c ** b = 8. Expression is a % b * c + a // 8 - b - c. 8%3=2. 2*2=4. 8//8=1. 4+1-3-2 = 0."
  },
  {
    q: "What will be the output of the following code?\nx = 15\ny = 6\nz = 25 - y ** 2 * x % 4\nprint(z)",
    o: ["25", "21", "19", "24"],
    a: 0,
    e: "y**2 = 36. 36 * 15 % 4 -> 540 % 4 = 0. 25 - 0 = 25."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Foundations of Python Programming',
      semester: 1,
      order: moduleCount + 1,
      description: 'Introduction to Python syntax rules, variable identifier constraints, basic IO operations, typecasting dynamics, separator/end formatting parameter configurations, and complex arithmetic operator precedence logic.',
      isPublished: true,
      pdfUrls: [
        { label: 'Python Foundations Contest', url: 'https://example.com/pdfs/python_foundations_contest.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'ADYPU PSP Contest - 1 [Quiz]',
      instructions: 'Answer all 15 questions covering the Foundations of Python Programming.',
      timeLimitMinutes: 40,
      isPublished: true,
      questions: rawData.map(q => ({
        questionText: q.q,
        options: q.o,
        correctOptionIndex: q.a,
        explanation: q.e,
        marks: 1
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
