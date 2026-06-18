import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "Evaluate the expression: 5 + 3 x 2",
    o: ["16", "11", "13", "10"],
    a: 1,
    e: "Using BODMAS, multiplication comes before addition. Multiply 3 x 2 = 6, then evaluate 5 + 6 = 11."
  },
  {
    q: "Evaluate the expression: 12 - 4 ÷ 2 + 3",
    o: ["7", "11", "13", "9"],
    a: 2,
    e: "Division comes first: 4 / 2 = 2. The expression becomes 12 - 2 + 3. Following left-to-right order for addition/subtraction: 10 + 3 = 13."
  },
  {
    q: "Evaluate the expression: (6 + 2) x (3 - 1)",
    o: ["16", "12", "8", "14"],
    a: 0,
    e: "Clear brackets first: (6 + 2) = 8 and (3 - 1) = 2. Multiply the results: 8 x 2 = 16."
  },
  {
    q: "Evaluate the expression: 18 ÷ (3 + 3) + 5 x 2",
    o: ["16", "13", "15", "26"],
    a: 1,
    e: "Bracket first: (3 + 3) = 6. Expression is now 18 / 6 + 5 x 2. Perform division and multiplication: 3 + 10 = 13."
  },
  {
    q: "Evaluate the expression: 20 - 3 x (2 + 1) + 4",
    o: ["55", "11", "15", "23"],
    a: 2,
    e: "Bracket first: (2 + 1) = 3. Multiply next: 3 x 3 = 9. Expression is now 20 - 9 + 4 = 15."
  },
  {
    q: "Evaluate the expression: (8 + 4) x 2 - (3 x 2)",
    o: ["18", "24", "12", "30"],
    a: 0,
    e: "Solve brackets: (8 + 4) = 12 and (3 x 2) = 6. Multiply next: 12 x 2 = 24. Finally, subtract: 24 - 6 = 18."
  },
  {
    q: "Evaluate the expression: 10 + (6 - 2) x 3 - 5",
    o: ["37", "22", "17", "27"],
    a: 2,
    e: "Bracket first: (6 - 2) = 4. Multiply next: 4 x 3 = 12. Expression is now 10 + 12 - 5 = 17."
  },
  {
    q: "Evaluate the expression: (5 + 3) x 2 + 12 ÷ (4 - 2)",
    o: ["22", "20", "19", "26"],
    a: 0,
    e: "Resolve brackets: (5 + 3) = 8 and (4 - 2) = 2. Expression becomes 8 x 2 + 12 / 2. Perform operations: 16 + 6 = 22."
  },
  {
    q: "Evaluate the expression: 24 ÷ (2 + 4) + (3 x (5 - 1))",
    o: ["16", "20", "12", "24"],
    a: 0,
    e: "Solve inside-out brackets: (5 - 1) = 4, then (3 x 4) = 12. Also solve (2 + 4) = 6. Expression simplifies to 24 / 6 + 12 = 4 + 12 = 16."
  },
  {
    q: "Evaluate the expression: (10 + 6) ÷ 2 + (4 x 3) - 3",
    o: ["20", "17", "23", "14"],
    a: 1,
    e: "Brackets first: (10 + 6) = 16 and (4 x 3) = 12. Expression is 16 / 2 + 12 - 3. Divide: 8 + 12 - 3 = 17."
  },
  {
    q: "Evaluate the expression: 50 - (6 + 4 x 3) ÷ (2 x 6 - 3)",
    o: ["42", "44", "48", "46"],
    a: 2,
    e: "First bracket order of operations: 6 + (4 x 3) = 6 + 12 = 18. Second bracket: (2 x 6) - 3 = 12 - 3 = 9. Expression is 50 - 18 / 9 = 50 - 2 = 48."
  },
  {
    q: "Evaluate the expression: (12 + 8 ÷ 2) x (5 + 2) ÷ 7 x 2",
    o: ["32", "16", "8", "24"],
    a: 0,
    e: "First bracket: 12 + (8 / 2) = 12 + 4 = 16. Second bracket: 5 + 2 = 7. Expression is 16 x 7 / 7 x 2. Working left-to-right: 112 / 7 x 2 = 16 x 2 = 32."
  },
  {
    q: "Evaluate the expression: [(15 - 3) x 2] ÷ (4 - 2) x 5 + 2",
    o: ["62", "32", "122", "52"],
    a: 0,
    e: "Inner bracket: 15 - 3 = 12. Outer nested bracket: 12 x 2 = 24. Second independent bracket: 4 - 2 = 2. Expression becomes 24 / 2 x 5 + 2. Divide and multiply left-to-right: 12 x 5 + 2 = 60 + 2 = 62."
  },
  {
    q: "Evaluate the expression: (3 + 3) x 36 ÷ (18 - 2 x 3) x 3 + 2",
    o: ["56", "44", "38", "54"],
    a: 0,
    e: "First bracket: 3 + 3 = 6. Second bracket handles multiplication first: 18 - (2 x 3) = 18 - 6 = 12. Expression is now 6 x 36 / 12 x 3 + 2. Working left-to-right: 216 / 12 x 3 + 2 = 18 x 3 + 2 = 54 + 2 = 56."
  },
  {
    q: "Evaluate the expression: (20 - 4 x 3) x [(8 + 4) ÷ 2 x 2] x [10 ÷ (5 x 4)]",
    o: ["80", "48", "96", "40"],
    a: 1,
    e: "First bracket: 20 - 12 = 8. Second bracket: 12 / 2 x 2 = 12. Third bracket: 10 / 20 = 0.5. Multiply the components: 8 x 12 x 0.5 = 96 x 0.5 = 48."
  },
  {
    q: "Find the value of: 26% of 150",
    o: ["36", "42", "39", "45"],
    a: 2,
    e: "Calculate percentage tracking: 0.26 x 150 = 39. Alternatively, 25% of 150 = 37.5, plus 1% of 150 = 1.5 => 37.5 + 1.5 = 39."
  },
  {
    q: "A shirt costs Rs. 320 and currently has a discount of 15%. Find the discounted price.",
    o: ["Rs. 280", "Rs. 272", "Rs. 268", "Rs. 288"],
    a: 1,
    e: "Discount value = 15% of 320 = 0.15 x 320 = 48. Total discounted price = 320 - 48 = 272."
  },
  {
    q: "A student scored 31 out of 50 in Maths-1 Contest-2. What percentage of marks was scored by the student?",
    o: ["58", "60", "62", "64"],
    a: 2,
    e: "Calculate standard percentage metric: (31 / 50) x 100 = 31 x 2 = 62."
  },
  {
    q: "You solved 9 out of 15 coding problems in the PSP contest. What percentage of problems did you NOT solve?",
    o: ["40", "60", "35", "45"],
    a: 0,
    e: "Unsolved problems = 15 - 9 = 6. Unsolved percentage value = (6 / 15) x 100 = (2 / 5) x 100 = 40."
  },
  {
    q: "If an exam is of 75 marks and passing marks are 40%, what are passing marks?",
    o: ["25", "35", "30", "40"],
    a: 2,
    e: "Calculate passing bounds: 40% of 75 = 0.40 x 75 = 30."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Basic Arithmetic and Percentages',
      semester: 1,
      order: moduleCount + 1,
      description: 'Foundational mastery of the order of operations (BODMAS/PEMDAS) using nested brackets, followed by practical engineering and budgeting percentage applications.',
      isPublished: true,
      pdfUrls: [
        { label: 'Basic Arithmetic Contest', url: 'https://example.com/pdfs/basic_arithmetic_contest.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'Maths Basic Contest 1',
      instructions: 'Answer all 20 questions based on Basic Arithmetic and Percentages.',
      timeLimitMinutes: 45,
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
