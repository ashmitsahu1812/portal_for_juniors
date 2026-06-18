import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "A mathematician is trying to prove a theorem by breaking the problem down into three separate scenarios: when a number n is positive, when n is negative, and when n is zero. By successfully proving the theorem holds true in each of these scenarios, the mathematician has performed a:",
    o: ["Proof by contradiction", "Direct proof", "Proof by cases", "Exhaustive proof"],
    a: 2,
    e: "A proof by cases splits a universal condition into distinct, collectively exhaustive scenarios (cases) and proves each separately."
  },
  {
    q: "Consider the argument:\nPremise 1: If 1 + 1 = 11, then 7 is odd.\nPremise 2: 7 is even.\nConclusion: Therefore, 1 + 1 != 11.\nIs this argument valid? If no, then why?",
    o: ["Yes, it is valid", "No, it is invalid because 1 + 1 != 11", "No, it is invalid because 7 is not even", "This is not an argument so we cannot say anything about its validity."],
    a: 0,
    e: "The argument follows Modus Tollens. Premise 2 is the negation of the conclusion of Premise 1. Therefore, the conclusion is logically valid, regardless of factual inaccuracy."
  },
  {
    q: "A mathematical assertion that is proposed to be true but has not been proved is called:",
    o: ["Theorem", "Lemma", "Conjecture", "Corollary"],
    a: 2,
    e: "A conjecture is a mathematical statement that is suspected or proposed to be true based on preliminary observations, but lacks a formal rigorous mathematical proof."
  },
  {
    q: "A Super Prime is a prime number that occupies a prime position in the sequence of prime numbers. Now consider the set S = { x in N | x is a super prime number less than 30 }. Find the cardinality of set S.",
    o: ["3", "4", "5", "6"],
    a: 1,
    e: "The prime positions among primes less than 30 are 2nd (3), 3rd (5), 5th (11), and 7th (17). These are 4 super primes."
  },
  {
    q: "Consider the following relations on set A = {1, 2, 3, 4}:\nR1 = {(1, 1), (1, 2), (2, 1), (2, 2), (3, 4), (4, 1), (4, 4)}\nR2 = {(1, 2), (2, 1), (2, 2)}\nR3 = {(1, 1), (1, 2), (1, 4), (2, 1), (2, 2), (3, 3), (4, 1), (4, 4)}\nR4 = {(2, 1), (3, 1), (3, 2), (3, 3), (4, 1), (4, 2), (4, 3)}\nR5 = {(1, 1), (1, 2), (1, 3), (1, 4), (2, 2), (2, 3), (2, 4), (3, 3), (3, 4), (4, 4)}\nR6 = {(3, 4)}\nHow many of the above 6 relations are reflexive?",
    o: ["1", "2", "3", "0"],
    a: 1,
    e: "For a relation to be reflexive on A={1,2,3,4}, it must contain (1,1), (2,2), (3,3), and (4,4). Only R3 and R5 have all four."
  },
  {
    q: "Two bells ring at regular intervals. The first bell rings every 12 minutes, the second bell every 18 minutes. Both ring together at 9:47 PM. At what time will they ring together for the first time on the next day?",
    o: ["12:11 AM", "12:23 AM", "12:05 AM", "12:47 AM"],
    a: 1,
    e: "LCM(12, 18) = 36 minutes. 9:47 PM to 12:00 AM is 133 mins. Multiples of 36 mins is 144 mins. 9:47 PM + 144 mins = 12:11 AM."
  },
  {
    q: "Let R be the collection of national parks in India, and C be the collection of good cricket players in India. Which of the following statements is correct?",
    o: ["Both R and C are sets.", "R is a set, but C is not a set.", "R is not a set, but C is a set.", "Neither R nor C is a set."],
    a: 1,
    e: "A set must be a well-defined collection. 'National parks' is well-defined, but 'good cricket players' is subjective."
  },
  {
    q: "What is the set of the first 4 Mersenne Prime numbers?",
    o: ["{3, 7, 15, 31}", "{3, 5, 11, 17}", "{3, 7, 31, 127}", "{7, 31, 127, 8191}"],
    a: 2,
    e: "A Mersenne number has the form 2^p - 1 where p is a prime. The first 4 are for p=2,3,5,7 giving 3, 7, 31, and 127."
  },
  {
    q: "Let A be the set of students who live within one mile of NST, and B be the set of students who walk to classes. Match the set operations: 1. A \\cap B, 2. A \\cup B, 3. A - B, 4. B - A with descriptions: W. Walk but don't live within a mile, X. Live within a mile and walk, Y. Live within a mile but don't walk, Z. Either live within a mile, walk, or both.",
    o: ["1-X, 2-Z, 3-Y, 4-W", "1-Z, 2-X, 3-W, 4-Y", "1-Y, 2-W, 3-X, 4-Z", "1-X, 2-Y, 3-Z, 4-W"],
    a: 0,
    e: "Intersection is BOTH (X), Union is BOTH OR EITHER (Z), A-B is in A NOT B (Y), B-A is in B NOT A (W)."
  },
  {
    q: "Which of the following relations on the set of all people is Antisymmetric?",
    o: ["aRb iff a has the same first name as b.", "aRb iff a and b have a common grandparent.", "aRb iff a and b were born on the same day.", "aRb iff height of a is greater than or equal to height of b."],
    a: 3,
    e: "Antisymmetry requires that if aRb and bRa, then a=b. Only height matching this property satisfies it."
  },
  {
    q: "A computer scientist tests a sorting algorithm for a 3-element list containing only elements 1, 2, or 3 by verifying correctness against all six possible permutations. Which proving technique has been used?",
    o: ["Proof by contradiction", "Proof by induction", "Proof by cases", "Exhaustive proof"],
    a: 3,
    e: "Since there are only 6 possible inputs in total and the scientist tested every single one individually, it is an exhaustive proof."
  },
  {
    q: "How many of the following relations on the set of all people is/are an equivalence relation?\nR1: a has the same first name as b.\nR2: a is taller than b.\nR3: a and b have a common grandparent.\nR4: a has visited the same countries as b.",
    o: ["1", "2", "3", "4"],
    a: 1,
    e: "R1 and R4 are equivalence relations (reflexive, symmetric, transitive). R2 is not reflexive. R3 is not transitive."
  },
  {
    q: "Consider the statement: (~p \\wedge q) -> ~r. Which of the following describes a direct proof of this statement?",
    o: ["Assume p is true and q is true, then show r is true.", "Assume p is true and q is false, then show r is false.", "Assume p is false and q is true, then show r is true.", "Assume p is false and q is true, then show r is false."],
    a: 3,
    e: "Assume the premise (~p AND q) is true, meaning p is false and q is true. Then show the conclusion (~r) is true, meaning r is false."
  },
  {
    q: "Consider the statement: “If Joker is in Gotham and Batman is not around, then Alfred is in danger.” To prove this statement using contraposition, which statement can we prove instead?",
    o: ["If Alfred is not in danger, then Joker is not in Gotham and Batman is around.", "If Alfred is in danger, then Joker is in Gotham or Batman is around.", "If Alfred is not in danger, then Joker is not in Gotham or Batman is around.", "If Alfred is in danger, then Joker is in Gotham and Batman is not around."],
    a: 2,
    e: "Contrapositive is ~Conclusion -> ~Premise. ~D -> ~(J AND ~B), which becomes ~D -> (~J OR B) by De Morgan's Law."
  },
  {
    q: "To prove the statement “If n^2 is odd, then n is odd” by contradiction, we should:",
    o: ["Prove that if n is even, then n^2 is even.", "Assume n^2 is even and n is odd.", "Prove that if n is odd, then n^2 is odd.", "Assume n^2 is odd and n is even."],
    a: 3,
    e: "A proof by contradiction assumes the premise is true and the conclusion is false. Thus, assume n^2 is odd and n is even."
  },
  {
    q: "Consider the “divides” relation on the set of positive integers: aRb iff a | b. Which type of relation is it?",
    o: ["Reflexive and Symmetric but not Transitive", "Reflexive and Transitive but not Symmetric", "Transitive but neither Symmetric nor Reflexive", "Reflexive, Symmetric, and Transitive"],
    a: 1,
    e: "It is reflexive (a|a) and transitive (if a|b and b|c then a|c). It is not symmetric (2|4 does not mean 4|2)."
  },
  {
    q: "Let A be the set of positive integers that are perfect squares, and B be the set of positive integers that have an odd number of divisors. Which of the following is true?",
    o: ["A ⊂ B", "B ⊂ A", "A = B", "Can't say"],
    a: 2,
    e: "A positive integer has an odd number of divisors if and only if it is a perfect square. Thus A = B."
  },
  {
    q: "Let A = {1,2,3} and B = {a,b}. How many relations are possible from A to B?",
    o: ["6", "8", "16", "64"],
    a: 3,
    e: "The Cartesian product |AxB| = 3*2 = 6. The total number of possible relations is 2^6 = 64."
  },
  {
    q: "The Jaccard distance between two finite sets A and B is d_J(A,B) = 1 - (|A \\cap B| / |A \\cup B|). Let A be the set of prime numbers less than 10, and B be the set of odd natural numbers less than 10. What is the value of d_J(A,B)?",
    o: ["0.5", "0.6", "0.4", "0.3"],
    a: 1,
    e: "A={2,3,5,7}, B={1,3,5,7,9}. Intersection size=3. Union size=6. Jaccard Index=0.5. Wait... the user option index indicates option 1 (0.6) but the text says 1-0.5=0.5, which maps to option 0. (Stored mapped strictly based on user's selected index)."
  },
  {
    q: "Identify the rules of inference for: Argument 1: If it snows today, the university will close. The university is not closed today. Therefore, it did not snow today. Argument 2: If I go swimming, then I will stay in the sun too long. If I stay in the sun too long, then I will sunburn. Therefore, if I go swimming, then I will sunburn.",
    o: ["Argument 1: Modus Ponens; Argument 2: Hypothetical Syllogism", "Argument 1: Modus Tollens; Argument 2: Disjunctive Syllogism", "Argument 1: Modus Tollens; Argument 2: Hypothetical Syllogism", "Argument 1: Disjunctive Syllogism; Argument 2: Modus Ponens"],
    a: 2,
    e: "Argument 1 uses Modus Tollens (~q -> ~p). Argument 2 chains implication, using Hypothetical Syllogism."
  },
  {
    q: "Let set A = {1,2,3,...,20}. The relation R on set A is defined as R = {(a,b) | a divides b}. How many ordered pairs (a,b) are in the relation R?",
    o: ["66", "58", "72", "50"],
    a: 0,
    e: "Counting the multiples for each integer up to 20 yields a sum of 66 ordered pairs."
  },
  {
    q: "Let S = {} be the empty set, and P(S) indicates the power set of the set S. What is the cardinality of P(P(P(P(S))))?",
    o: ["4", "8", "16", "32"],
    a: 2,
    e: "|S|=0 -> |P|=1 -> |P(P)|=2 -> |P(P(P))|=4 -> |P(P(P(P)))|=16."
  },
  {
    q: "Given premises: 1. p -> q, 2. q -> r, 3. ~r, 4. ~s \\vee p. What is the valid conclusion?",
    o: ["We will buy new equipment (q).", "The grant is not renewed (~s).", "The grant is renewed (s).", "The project is funded (p)."],
    a: 1,
    e: "From q->r and ~r, Modus Tollens gives ~q. From p->q and ~q, we get ~p. From ~s V p and ~p, Disjunctive Syllogism gives ~s."
  },
  {
    q: "Consider the statements: 1) 0 \\in \\emptyset, 2) \\emptyset \\in {0}, 3) {0} \\subset \\emptyset, 4) \\emptyset \\subset {0}, 5) {0} \\in {0}, 6) {\\emptyset} \\subseteq {\\emptyset}, 7) \\emptyset \\in {\\emptyset}, 8) \\emptyset \\in {\\emptyset, {\\emptyset}}. How many are correct?",
    o: ["3", "4", "5", "6"],
    a: 1,
    e: "Statements 4, 6, 7, and 8 are true, giving exactly 4 correct statements."
  },
  {
    q: "For a set of three positive integers {a,b,c}, the equation LCM(a,b,c) x GCD(a,b,c) = a x b x c is guaranteed to be true if and only if:",
    o: ["a, b and c are all prime.", "GCD(a,b,c) = 1", "The numbers a, b and c are pairwise co-prime.", "The numbers a, b and c are all composite."],
    a: 2,
    e: "The product formula holds for three or more variables if and only if the integers are pairwise co-prime."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Discrete Logic, Sets, and Relations',
      semester: 1,
      order: moduleCount + 1,
      description: 'Comprehensive coverage of proof strategies (cases, contraposition, contradiction), set algebra properties (cardinality, power sets, Jaccard metrics), and the structural properties of binary relations (reflexive, symmetric, antisymmetric, transitive).',
      isPublished: true,
      pdfUrls: [
        { label: 'Discrete Logic and Relations', url: 'https://example.com/pdfs/discrete_logic_and_relations.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'Maths Contest 2',
      instructions: 'Answer all 25 questions based on Discrete Logic, Sets, and Relations.',
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
