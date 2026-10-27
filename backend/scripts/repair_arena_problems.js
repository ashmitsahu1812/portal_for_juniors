import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';

dotenv.config();

const repairs = [
  {
    filter: { title: 'Max of two Numbers' },
    title: 'Max of two Numbers',
    description: `Read two integers A and B from one line. Complete the provided max_of_two(a, b) function so it returns the larger value. The existing driver code calls the function and prints its return value.\n\n### Input Format\nOne line containing two space-separated integers, A and B.\n\n### Output Format\nPrint the larger of A and B.\n\n### Example\nInput: 15 42\nOutput: 42`,
    testCases: [
      { input: '15 42\n', expectedOutput: '42', isHidden: false, label: 'Sample 1' },
      { input: '-10 -5\n', expectedOutput: '-5', isHidden: false, label: 'Sample 2' },
      { input: '42 15\n', expectedOutput: '42', isHidden: true, label: 'Hidden 3' },
      { input: '0 0\n', expectedOutput: '0', isHidden: true, label: 'Hidden 4' },
      { input: '-100 50\n', expectedOutput: '50', isHidden: true, label: 'Hidden 5' },
    ],
  },
  {
    filter: { title: 'Circle Intersection Check' },
    title: 'Circle Intersection Check',
    description: `You are given the centers and radii of two circles. Determine whether the circles intersect or touch.\n\n### Input Format\nOne line containing six numbers: x1 y1 r1 x2 y2 r2, where (x1, y1) and (x2, y2) are the centers and r1 and r2 are the radii.\n\n### Output Format\nPrint YES if the circles intersect or touch; otherwise print NO.\n\n### Examples\nInput: 0 0 5 8 0 3\nOutput: YES\n\nInput: 0 0 2 10 0 2\nOutput: NO`,
    testCases: [
      { input: '0 0 5 8 0 3\n', expectedOutput: 'YES', isHidden: false, label: 'Sample 1' },
      { input: '0 0 2 10 0 2\n', expectedOutput: 'NO', isHidden: false, label: 'Sample 2' },
      { input: '0 0 5 10 0 5\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 3' },
      { input: '0 0 5 11 0 5\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 4' },
    ],
  },
  {
    filter: { title: 'Strange Fibonacci' },
    title: 'Strange Fibonacci',
    description: `A sequence starts with two integers A and B. Each later term is the sum of the previous two terms. Given a non-negative integer N, print the term at zero-based position N (term 0 is A and term 1 is B).\n\n### Input Format\nOne line containing A, B, and N.\n\n### Output Format\nPrint the term at position N.\n\n### Examples\nInput: 2 3 4\nOutput: 13\n\nInput: 5 8 0\nOutput: 5`,
    testCases: [
      { input: '2 3 4\n', expectedOutput: '13', isHidden: false, label: 'Sample 1' },
      { input: '5 8 0\n', expectedOutput: '5', isHidden: false, label: 'Sample 2' },
      { input: '1 1 1\n', expectedOutput: '1', isHidden: true, label: 'Hidden 3' },
      { input: '0 7 5\n', expectedOutput: '28', isHidden: true, label: 'Hidden 4' },
    ],
  },
  {
    filter: { title: 'Frog Game' },
    title: 'Frog Game',
    description: `Two players take turns removing 1, 2, or 3 stones from a heap containing N stones. The player who removes the last stone wins. You play first. Print YES if you can force a win with optimal play; otherwise print NO.\n\n### Input Format\nA single positive integer N, the number of stones.\n\n### Output Format\nPrint YES if the first player can force a win, otherwise print NO.\n\n### Examples\nInput: 4\nOutput: NO\n\nInput: 5\nOutput: YES`,
    testCases: [
      { input: '4\n', expectedOutput: 'NO', isHidden: false, label: 'Sample 1' },
      { input: '5\n', expectedOutput: 'YES', isHidden: false, label: 'Sample 2' },
      { input: '1\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 3' },
      { input: '8\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 4' },
    ],
  },
  {
    filter: { title: 'Enough Chocolates for Everyone' },
    title: 'Enough Chocolates for Everyone',
    description: `You have C chocolates and P people. Decide whether it is possible to give each person the same positive whole number of chocolates, using every chocolate. Print Yes if it is possible; otherwise print No.\n\n### Input Format\nOne line containing C (the number of chocolates) and P (the number of people).\n\n### Output Format\nPrint Yes or No.\n\n### Examples\nInput: 12 4\nOutput: Yes\n\nInput: 10 3\nOutput: No`,
    testCases: [
      { input: '12 4\n', expectedOutput: 'Yes', isHidden: false, label: 'Sample 1' },
      { input: '10 3\n', expectedOutput: 'No', isHidden: false, label: 'Sample 2' },
      { input: '8 4\n', expectedOutput: 'Yes', isHidden: true, label: 'Hidden 3' },
      { input: '3 5\n', expectedOutput: 'No', isHidden: true, label: 'Hidden 4' },
      { input: '999 1\n', expectedOutput: 'Yes', isHidden: true, label: 'Hidden 5' },
    ],
  },
  {
    filter: { title: 'Second Largest Divisor' },
    title: 'Second Largest Divisor',
    description: `Given an integer N, find its largest proper divisor: the largest positive divisor smaller than N. If N is 1 or prime, print 1. For example, the largest proper divisor of 12 is 6.\n\n### Input Format\nA single integer N.\n\n### Output Format\nPrint the largest proper divisor of N.\n\n### Examples\nInput: 12\nOutput: 6\n\nInput: 25\nOutput: 5`,
    testCases: [
      { input: '12\n', expectedOutput: '6', isHidden: false, label: 'Sample 1' },
      { input: '25\n', expectedOutput: '5', isHidden: false, label: 'Sample 2' },
      { input: '1\n', expectedOutput: '1', isHidden: true, label: 'Hidden 3' },
      { input: '2\n', expectedOutput: '1', isHidden: true, label: 'Hidden 4' },
      { input: '16\n', expectedOutput: '8', isHidden: true, label: 'Hidden 5' },
      { input: '999983\n', expectedOutput: '1', isHidden: true, label: 'Hidden 6' },
    ],
  },
  {
    filter: { title: 'Print Multiples of 3 in a Given Range' },
    title: 'Print Multiples of 3 in a Given Range',
    description: `Read two integers Start and End. Print every number in the inclusive range from Start to End that is divisible by 3, one number per line. If there are no such numbers, print nothing.\n\n### Input Format\nOne line containing Start and End.\n\n### Output Format\nPrint each multiple of 3 in the range on its own line.\n\n### Example\nInput: 4 12\nOutput:\n6\n9\n12`,
    testCases: [
      { input: '4 12\n', expectedOutput: '6\n9\n12', isHidden: false, label: 'Sample 1' },
      { input: '3 9\n', expectedOutput: '3\n6\n9', isHidden: false, label: 'Sample 2' },
      { input: '1 2\n', expectedOutput: '', isHidden: true, label: 'Hidden 3' },
      { input: '3 3\n', expectedOutput: '3', isHidden: true, label: 'Hidden 4' },
      { input: '6 10\n', expectedOutput: '6\n9', isHidden: true, label: 'Hidden 5' },
    ],
  },
  {
    filter: { title: 'Rainboy\'s Promise' },
    title: 'Rainboy\'s Promise',
    description: `Print the exact sentence below. No input is provided.\n\n### Output Format\nI promise myself that I will work hard and become a great coder`,
    testCases: [
      { input: '', expectedOutput: 'I promise myself that I will work hard and become a great coder', isHidden: false, label: 'Sample Output' },
      { input: '', expectedOutput: 'I promise myself that I will work hard and become a great coder', isHidden: true, label: 'Hidden 2' },
      { input: '', expectedOutput: 'I promise myself that I will work hard and become a great coder', isHidden: true, label: 'Hidden 3' },
    ],
  },
  {
    filter: { title: 'Simple Interest Calculator' },
    title: 'Simple Interest Calculator',
    description: `Calculate simple interest using the formula interest = principal * annual_rate * time / 100. The rate is a percentage.\n\n### Input Format\nThree lines containing principal, annual rate (percent), and time (years). Values can be decimal numbers.\n\n### Output Format\nPrint the simple interest with exactly two digits after the decimal point.\n\n### Example\nInput:\n1000\n5\n2\nOutput: 100.00`,
    testCases: [
      { input: '1000\n5\n2\n', expectedOutput: '100.00', isHidden: false, label: 'Sample 1' },
      { input: '500\n10\n1\n', expectedOutput: '50.00', isHidden: false, label: 'Sample 2' },
      { input: '2500\n4\n3\n', expectedOutput: '300.00', isHidden: true, label: 'Hidden 3' },
      { input: '100\n0\n5\n', expectedOutput: '0.00', isHidden: true, label: 'Hidden 4' },
    ],
  },
  {
    filter: { title: 'Odd numbers' },
    title: 'Odd numbers',
    description: `Given a positive integer N, print every odd number from 1 through N, in ascending order, with one number per line. If N is even, do not print N.\n\n### Input Format\nA single integer N.\n\n### Output Format\nPrint each odd number in the range on its own line.\n\n### Example\nInput: 7\nOutput:\n1\n3\n5\n7`,
    testCases: [
      { input: '7\n', expectedOutput: '1\n3\n5\n7', isHidden: false, label: 'Sample 1' },
      { input: '4\n', expectedOutput: '1\n3', isHidden: false, label: 'Sample 2' },
      { input: '1\n', expectedOutput: '1', isHidden: true, label: 'Hidden 3' },
      { input: '2\n', expectedOutput: '1', isHidden: true, label: 'Hidden 4' },
    ],
  },
  {
    filter: { title: 'Count the Digits' },
    title: 'Count the Digits',
    description: `Given a non-negative integer N, count how many digits it contains. The number 0 has one digit.\n\n### Input Format\nA single non-negative integer N.\n\n### Output Format\nPrint the number of digits in N.\n\n### Examples\nInput: 9843\nOutput: 4\n\nInput: 0\nOutput: 1`,
    testCases: [
      { input: '9843\n', expectedOutput: '4', isHidden: false, label: 'Sample 1' },
      { input: '0\n', expectedOutput: '1', isHidden: false, label: 'Sample 2' },
      { input: '7\n', expectedOutput: '1', isHidden: true, label: 'Hidden 3' },
      { input: '1000000000\n', expectedOutput: '10', isHidden: true, label: 'Hidden 4' },
    ],
  },
  {
    filter: { title: 'Reverse and Sum Palindrome' },
    title: 'Reverse and Sum Palindrome',
    description: `Given a positive integer N, reverse its digits and add the reversed number to N. Print YES if the sum is a palindrome, otherwise print NO. A palindrome reads the same forward and backward.\n\n### Input Format\nA single positive integer N.\n\n### Output Format\nPrint YES or NO.\n\n### Example\nInput: 56\nOutput: NO`,
    testCases: [
      { input: '56\n', expectedOutput: 'NO', isHidden: false, label: 'Sample 1' },
      { input: '12\n', expectedOutput: 'NO', isHidden: false, label: 'Sample 2' },
      { input: '1\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 3' },
      { input: '10\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 4' },
    ],
  },
  {
    filter: { title: 'Repetition Mystery' },
    title: 'Repetition Mystery',
    description: `Given a non-empty string, find the length of its longest consecutive run of the same character. For example, in aabbbcc the longest run is bbb, with length 3.\n\n### Input Format\nA single line containing a string.\n\n### Output Format\nPrint the length of the longest consecutive run.\n\n### Examples\nInput: aabbbcc\nOutput: 3\n\nInput: xyz\nOutput: 1`,
    testCases: [
      { input: 'aabbbcc\n', expectedOutput: '3', isHidden: false, label: 'Sample 1' },
      { input: 'xyz\n', expectedOutput: '1', isHidden: false, label: 'Sample 2' },
      { input: 'aaaa\n', expectedOutput: '4', isHidden: true, label: 'Hidden 3' },
      { input: 'abbbaaa\n', expectedOutput: '3', isHidden: true, label: 'Hidden 4' },
    ],
  },
  {
    filter: { title: 'The Even Number Challenge' },
    title: 'The Even Number Challenge',
    description: `Given two positive integers Low and High, print all even integers strictly between Low and High, in ascending order, with one number per line. Do not include either endpoint. If there are no such integers, print nothing.\n\n### Input Format\nOne line containing Low and High, where Low < High.\n\n### Output Format\nPrint each qualifying even integer on its own line.\n\n### Example\nInput: 1 10\nOutput:\n2\n4\n6\n8`,
    testCases: [
      { input: '1 10\n', expectedOutput: '2\n4\n6\n8', isHidden: false, label: 'Sample 1' },
      { input: '2 4\n', expectedOutput: '', isHidden: false, label: 'Sample 2' },
      { input: '1 4\n', expectedOutput: '2', isHidden: true, label: 'Hidden 3' },
      { input: '4 9\n', expectedOutput: '6\n8', isHidden: true, label: 'Hidden 4' },
    ],
  },
  {
    filter: { title: 'Print Characters of a String' },
    title: 'Print Characters of a String',
    description: `Read a string and print each character on a separate line, preserving the original order.\n\n### Input Format\nA single line containing a non-empty string.\n\n### Output Format\nPrint each character on its own line.\n\n### Example\nInput: Code\nOutput:\nC\no\nd\ne`,
    testCases: [
      { input: 'Code\n', expectedOutput: 'C\no\nd\ne', isHidden: false, label: 'Sample 1' },
      { input: 'A\n', expectedOutput: 'A', isHidden: false, label: 'Sample 2' },
      { input: 'xy\n', expectedOutput: 'x\ny', isHidden: true, label: 'Hidden 3' },
    ],
  },
  {
    filter: { title: 'Print 1 to N using while Loop' },
    title: 'Print 1 to N using while Loop',
    description: `Read a positive integer N and print every integer from 1 through N in ascending order, with one number per line.\n\n### Input Format\nA single integer N.\n\n### Output Format\nPrint the integers 1 through N, each on its own line.\n\n### Example\nInput: 3\nOutput:\n1\n2\n3`,
    testCases: [
      { input: '3\n', expectedOutput: '1\n2\n3', isHidden: false, label: 'Sample 1' },
      { input: '1\n', expectedOutput: '1', isHidden: true, label: 'Hidden 2' },
      { input: '2\n', expectedOutput: '1\n2', isHidden: true, label: 'Hidden 3' },
      { input: '5\n', expectedOutput: '1\n2\n3\n4\n5', isHidden: true, label: 'Hidden 4' },
    ],
  },
  {
    filter: { title: 'Print 1 to N using for Loop - II' },
    title: 'Print 1 to N using for Loop - II',
    description: `Read a positive integer N and print every integer from 1 through N in ascending order, with one number per line.\n\n### Input Format\nA single integer N.\n\n### Output Format\nPrint the integers 1 through N, each on its own line.\n\n### Example\nInput: 4\nOutput:\n1\n2\n3\n4`,
    testCases: [
      { input: '4\n', expectedOutput: '1\n2\n3\n4', isHidden: false, label: 'Sample 1' },
      { input: '1\n', expectedOutput: '1', isHidden: true, label: 'Hidden 2' },
      { input: '2\n', expectedOutput: '1\n2', isHidden: true, label: 'Hidden 3' },
      { input: '5\n', expectedOutput: '1\n2\n3\n4\n5', isHidden: true, label: 'Hidden 4' },
    ],
  },
  {
    filter: { title: 'Find Primes - II', $or: [{ description: /is_prime\(n\)/i }, { description: /is_prime.*prime number/i }] },
    title: 'Find Primes - II',
    description: `Implement is_prime(n) to determine whether the input integer n is prime. Print True if n is prime and False otherwise. A prime number is greater than 1 and has no positive divisors other than 1 and itself.\n\n### Input Format\nA single integer n.\n\n### Output Format\nPrint True or False.\n\n### Examples\nInput: 11\nOutput: True\n\nInput: 4\nOutput: False`,
    testCases: [
      { input: '11\n', expectedOutput: 'True', isHidden: false, label: 'Sample 1' },
      { input: '4\n', expectedOutput: 'False', isHidden: false, label: 'Sample 2' },
      { input: '1\n', expectedOutput: 'False', isHidden: true, label: 'Hidden 3' },
      { input: '2\n', expectedOutput: 'True', isHidden: true, label: 'Hidden 4' },
      { input: '97\n', expectedOutput: 'True', isHidden: true, label: 'Hidden 5' },
      { input: '100\n', expectedOutput: 'False', isHidden: true, label: 'Hidden 6' },
    ],
  },
  {
    filter: { title: 'Check for Intersection Between Intervals' },
    title: 'Check for Intersection Between Intervals',
    description: `Given two closed intervals [A, B] and [C, D], determine whether they share at least one point. The endpoints count as part of each interval, so intervals that only touch at an endpoint intersect. Print YES if they intersect and NO otherwise.\n\n### Input Format\nOne line containing A, B, C, and D, where A <= B and C <= D.\n\n### Output Format\nPrint YES or NO.\n\n### Examples\nInput: 1 5 4 8\nOutput: YES\n\nInput: 1 5 6 10\nOutput: NO`,
    testCases: [
      { input: '1 5 4 8\n', expectedOutput: 'YES', isHidden: false, label: 'Sample 1' },
      { input: '1 5 6 10\n', expectedOutput: 'NO', isHidden: false, label: 'Sample 2' },
      { input: '1 5 5 10\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 3' },
      { input: '3 3 1 3\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 4' },
      { input: '-10 -5 0 5\n', expectedOutput: 'NO', isHidden: true, label: 'Hidden 5' },
      { input: '-5 0 -2 2\n', expectedOutput: 'YES', isHidden: true, label: 'Hidden 6' },
    ],
  },
];

const apply = process.argv.includes('--apply');


async function main() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required.');
  await mongoose.connect(process.env.MONGO_URI);
  console.log(apply ? 'Applying Arena repairs…' : 'Dry run only; pass --apply to write repairs.');
  for (const repair of repairs) {
    const matches = await Problem.countDocuments(repair.filter);
    console.log(`${repair.title}: ${matches} matching problem(s)`);
    if (apply && matches) {
      const { filter, title, ...updates } = repair;
      const result = await Problem.updateMany(filter, { $set: updates });
      console.log(`  Updated ${result.modifiedCount} problem(s).`);
    }
  }
  await mongoose.disconnect();
}

main().catch(async error => {
  console.error('Arena repair failed:', error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
