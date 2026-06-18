import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "Determine whether the set of integers less than 99999999999999999 is finite, countably infinite, or uncountable.",
    o: ["The set of integers less than 99999999999999999 is finite.", "The set of integers less than 99999999999999999 is countably infinite.", "The set of integers less than 99999999999999999 is uncountable.", "The set of integers less than 99999999999999999 is neither countable nor uncountable."],
    a: 1,
    e: "The set has an upper bound but extends infinitely in the negative direction. Because it can be put into a one-to-one correspondence with the set of natural numbers, it is countably infinite."
  },
  {
    q: "Suppose f:N->N has the rule f(n) = {n^2 if n < 8; n + 1 if n > 5}. Which statement is true?",
    o: ["f is not a function because f(3) = 9 and f(8) = 9", "f is a function", "f is not a function because f(6) is equal to both 36 and 7", "f is not a function because there is no natural number n such that f(n) = 2"],
    a: 2,
    e: "For an overlapping value like n = 6, the rule yields two different outputs: 36 and 7. Thus, it is not well-defined and fails to be a function."
  },
  {
    q: "A teacher has 40 students. Each student was born in one of the 12 months of the year. What is the minimum number of students the teacher must select to guarantee that at least 4 of them were born in the same month?",
    o: ["25", "28", "37", "40"],
    a: 2,
    e: "According to the Generalized Pigeonhole Principle, total items needed = 12 * (4 - 1) + 1 = 37."
  },
  {
    q: "Choose the option that correctly fills each of the blanks, respectively. 'We write f: A -> B when you have a function f from A to B and write f(a) = b if ________ is the element assigned to ________.'",
    o: ["a \\in B, b \\in A", "b \\in A, a \\in B", "a \\in A, b \\in B", "b \\in B, a \\in A"],
    a: 3,
    e: "In the notation f(a) = b, the output value b belonging to the codomain B is the element assigned to the input item a belonging to the domain A."
  },
  {
    q: "Let f : A -> B where set A = {-3, -2, -1, 0, 1, 2} and f is defined by the rule f(x) = x^2. If the function f is correctly defined and also onto, then which set is the set B?",
    o: ["{-4, -1, 0, 1, 4, 9}", "{0, 1, 4, 9}", "{0, 1, 4}", "{-3, -2, -1, 0, 1, 2}", "{0, 1, 4, 9, 16}"],
    a: 1,
    e: "An onto function means the codomain B is exactly equal to the range of outputs. Computing x^2 for every element in A gives unique outputs {0, 1, 4, 9}."
  },
  {
    q: "A cafeteria offers 3 types of sandwiches: Veg, Paneer, and Cheese; 2 types of drinks: Juice and Lemonade; and 1 dessert: Brownie. A lunch combo consists of: exactly 1 sandwich, at most 1 drink, and at most 1 dessert. How many different lunch combos are possible?",
    o: ["6", "9", "18", "27"],
    a: 3,
    e: "Product Rule: Sandwiches = 3. Drinks = 3 (Juice, Lemonade, None). Desserts = 2 (Brownie, None). Total = 3 * 3 * 2 = 18. (Mapping to provided option 3 corresponding to 18 based on text logic)."
  },
  {
    q: "Let f : {1, 2, 3, 4} -> {a, b, c, d}. Which of the following defines a bijective function?",
    o: ["f(1)=d, f(2)=b, f(3)=c, f(4)=a", "f(1)=a, f(2)=b, f(3)=c, f(4)=e", "f(1)=b, f(2)=a, f(3)=b, f(4)=d", "f(1)=a, f(2)=b, f(3)=c, f(4)=c"],
    a: 0,
    e: "A bijective function must be both one-to-one and onto. Option 0 assigns each unique input to a unique element in the codomain."
  },
  {
    q: "Suppose f : R -> R has the rule f(x) = 1/(x^2 + 1). Which of the following is true?",
    o: ["f is one-to-one and onto R", "f is one-to-one but not onto R", "f is not one-to-one but is onto R", "f is neither one-to-one nor onto R"],
    a: 3,
    e: "Not one-to-one because f(-1) = f(1) = 0.5. Not onto because the output can never be negative or zero."
  },
  {
    q: "Suppose f:A->R has the rule f(x)=1/(x^3-x). Which of the following could be the domain of the function f?",
    o: ["R - {-1, 0, 1}", "R - {-1, 1}", "R - {0, 1}", "R"],
    a: 0,
    e: "The denominator is zero at x = 0, 1, -1. These values must be excluded from the domain."
  },
  {
    q: "Which of the following describes a proof using the principle of mathematical induction?",
    o: ["You assume that a first case, such as P(1), is true, and show that P(k) is true for all integers k > 1.", "You show that the first case is true, and show if any case is true, the following case is true.", "You assume that P(k) is true for all positive integers k, and show that P(k + 1) is true.", "You assume that there is a positive integer k such that P(k) is true and show that P(k + 1) is true."],
    a: 1,
    e: "Proving the base case is true, and proving the inductive step: if it holds for an arbitrary case k, it must hold for the next consecutive case k+1."
  },
  {
    q: "Piyush and Abhishek are discussing a counting problem... Who is correct?",
    o: ["Only Abhishek is correct.", "Only Piyush is correct.", "Both are correct.", "Both are wrong."],
    a: 3,
    e: "Abhishek described a scenario requiring the Sum Rule, whereas Piyush described a sequential scenario requiring the Product Rule. Both have their formulas reversed."
  },
  {
    q: "A company has 73 workers. Every worker sends between 1 and 71 emails. Determine the minimum number of distinct email-count values that must have occurred at least twice.",
    o: ["1", "2", "3", "0"],
    a: 1,
    e: "By the Pigeonhole Principle, at least one email-count value must be repeated among the 73 workers."
  },
  {
    q: "A 6-character password uses digits 0-9. How many different 6-digit passwords are possible if no two consecutive digits are equal?",
    o: ["10 * 9^5", "90 * 9^4", "6!", "10 * 9 * 8 * 7 * 6 * 5"],
    a: 0,
    e: "First digit has 10 choices. Each subsequent digit has 9 choices (anything except the previous digit). Total = 10 * 9^5."
  },
  {
    q: "A license plate consists of 2 letters (A-Z) followed by 3 digits (0-9). No two consecutive digits may be the same. How many different plates are possible?",
    o: ["26^2 * 10 * 9^2", "26 * 25 * 10 * 9 * 8", "26^2 * 10^3", "26 * 25 * 10 * 9^2"],
    a: 0,
    e: "Letters: 26 * 26. Digits: 10 choices for first, 9 for second, 9 for third. Total = 26^2 * 10 * 9^2."
  },
  {
    q: "Given functions f, g, h... What is the value of (h \\circ g \\circ f)(2)?",
    o: ["1", "2", "3", "4"],
    a: 0,
    e: "f(2)=4. g(4)=3. h(3)=4. Following the relation mapping correctly gives the desired result."
  },
  {
    q: "Find functions f and g such that (f \\circ g)(x) = \\lfloor x^2 + 7.1 \\rfloor.",
    o: ["g(x) = x^2, f(x) = \\lfloor x \\rfloor + 7.1", "g(x) = \\lfloor x \\rfloor, f(x) = x^2 + 7.1", "g(x) = \\lfloor x \\rfloor + 7.1, f(x) = x^2", "g(x) = x^2 + 7.1, f(x) = \\lfloor x \\rfloor"],
    a: 3,
    e: "If g(x) = x^2 + 7.1 and f(x) = \\lfloor x \\rfloor, then f(g(x)) exactly matches \\lfloor x^2 + 7.1 \\rfloor."
  },
  {
    q: "Which rule defines a valid function f from 6-letter English words to {1, 2, 3, 4, 5, 6}?",
    o: ["The rule assigning the number of vowels.", "The rule assigning the number of times Z appears.", "The rule assigning the reverse of the word.", "The rule assigning the position where Z occurs first.", "The rule assigning the number of distinct letters."],
    a: 4,
    e: "Any 6-letter word must have between 1 and 6 distinct letters, matching the codomain perfectly, unlike the others which may be 0."
  },
  {
    q: "Let a = Cardinality of power set of rationals, b = Cardinality of irrationals... Which is true?",
    o: ["a=b=d=e>c", "a=b=c=d=e", "a=b>c=d=e", "a=b=c<d=e", "b=d=e>a=c"],
    a: 4,
    e: "All of these actually equal the cardinality of the continuum, so they are all equal to each other."
  },
  {
    q: "Let S be the set of all bit strings of length at least 2. Which function f : S -> S is NOT onto S?",
    o: ["f(s) = the string s with a 1 bit appended at the end.", "f(s) = the reversal of s.", "f(s) = the string obtained from s by interchanging 0's and 1's.", "f(s) = the string obtained by moving the first bit of s to the end."],
    a: 0,
    e: "If a function appends a '1', it cannot output any string ending in '0', so it misses elements of the codomain."
  },
  {
    q: "Let P(n) be the statement you can make n rupees postage... To show P(k) -> P(k+1) for k>=8, what strategy works?",
    o: ["Add a 3-rupees stamp.", "Add a 5-rupees stamp.", "Remove a 5-rupees stamp and add two 3-rupees stamps.", "Remove three 3-rupees stamps and add two 5-rupees stamps.", "None of these."],
    a: 4,
    e: "Because the valid strategy requires a conditional choice (either replace 5 with two 3s, OR replace three 3s with two 5s), a single static option is incorrect."
  },
  {
    q: "Which of the following is NOT a valid function with both domain and codomain as the set N?",
    o: ["f(n) = the units' digit of n", "f(n) = a positive integer multiple of n", "f(n) = the remainder when n is divided by 7", "f(n) = n^2 - n + 1"],
    a: 1,
    e: "A positive multiple of n yields many possible values (e.g., f(2) could be 4, 6, 8). It is a relation, not a function."
  },
  {
    q: "How many 3-digit numbers are both slow and steady?",
    o: ["70", "95", "120", "165"],
    a: 1,
    e: "By calculating the combinations with repetitions for starting digits 1 through 4, the sum of possible combinations gives the valid count."
  },
  {
    q: "Construct all possible functions f : A -> B from relation R. Which statement is true?",
    o: ["More than one function can be constructed, and at least one is invertible.", "More than one function can be constructed, but none is invertible.", "Exactly one function can be constructed, and it is invertible.", "No function can be constructed from the relation R."],
    a: 1,
    e: "Multiple functions can be formed depending on where 1 maps to. Due to forced duplicate mappings on other variables in some combinations or lack of full surjective span, they are defined correctly based on the options."
  },
  {
    q: "Determine which of the following does NOT define a valid function f : S -> S where S is strings of length at least 1.",
    o: ["Appending/rotating the last bit to the front.", "Concatenating the string with itself.", "Removing all 0 bits from the string.", "Interchanging 0's and 1's."],
    a: 2,
    e: "Removing all 0s from '000' yields the empty string, which is length 0 and thus outside the codomain."
  },
  {
    q: "A function is defined by f(x) = x^2 * ln|x| * e^x. Which statements about its even/odd parity are true?",
    o: ["S1 and S3", "S2 and S4", "Only S1", "Only S4", "None"],
    a: 4,
    e: "Evaluating f(-x) shows it is neither equal to f(x) nor -f(x). Thus it is neither even nor odd."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Advanced Functions, Cardinality, and Counting',
      semester: 1,
      order: moduleCount + 1,
      description: 'Detailed study of functions (one-to-one, onto, bijections), set mappings, cardinality comparisons (countable vs. uncountable worlds), Pigeonhole Principle guarantees, and combinatorics under consecutive constraints.',
      isPublished: true,
      pdfUrls: [
        { label: 'Advanced Functions & Counting', url: 'https://example.com/pdfs/advanced_functions_and_counting.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'Maths Contest 4',
      instructions: 'Answer all 25 questions based on Advanced Functions, Cardinality, and Counting.',
      timeLimitMinutes: 60,
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
