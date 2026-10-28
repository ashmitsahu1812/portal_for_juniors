/**
 * scripts/striver/helpers.js — shared helpers for the Striver SDE Sheet batches.
 *
 * Every batch file exports { section, problems } where each problem is:
 *   {
 *     slug: 'set-matrix-zeroes',          // unique key
 *     title: 'Set Matrix Zeroes',
 *     difficulty: 'Easy' | 'Medium' | 'Hard',
 *     topic: 'Arrays',                    // secondary tag
 *     description: '...markdown... {{EXAMPLES}} ...',
 *     constraints: '1 <= n <= 10^5',
 *     inputs: ['...', '...'],             // >= MIN_TEST_CASES entries
 *     solve(input) => string,             // deterministic reference solution
 *   }
 *
 * The build step runs solve() on every input to produce expectedOutput, so the
 * statement examples ({{EXAMPLES}}) are always generated from the same test
 * cases the judge runs — they can never drift apart.
 */

export const SHEET_TAG = 'Striver SDE Sheet';
export const MIN_TEST_CASES = 7; // 2 visible samples + 5 hidden grading cases
export const MIN_VISIBLE = 2;

export const starterCode = {
  Python: '# Read input, compute the answer, and print it.\nimport sys\n\ndata = sys.stdin.read().split()\n# TODO: solve\n',
  C: '#include <stdio.h>\n\nint main(void) {\n    // Read input, compute the answer, and print it.\n    return 0;\n}\n',
  'C++': '#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <map>\n#include <set>\nusing namespace std;\n\nint main() {\n    // Read input, compute the answer, and print it.\n    return 0;\n}\n',
  'Java': 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // Read input, compute the answer, and print it.\n    }\n}\n',
};

function fenced(lines) {
  return '```text\n' + lines + '\n```';
}

export function exampleBlock(input, expectedOutput) {
  return [
    '**Example:**',
    '',
    'Input:',
    fenced(input),
    '',
    'Output:',
    fenced(expectedOutput),
  ].join('\n');
}

/** Run a reference solution twice and make sure it is deterministic. */
export function runSolve(problem, input) {
  const first = problem.solve(input);
  const second = problem.solve(input);
  if (typeof first !== 'string') {
    throw new Error(`${problem.slug}: solve() must return a string`);
  }
  if (first !== second) {
    throw new Error(`${problem.slug}: solve() is not deterministic`);
  }
  return first.trim().replace(/\r\n/g, '\n');
}

/** Build the judge test cases (first MIN_VISIBLE visible, rest hidden). */
export function buildTestCases(problem) {
  if (!Array.isArray(problem.inputs) || problem.inputs.length < MIN_TEST_CASES) {
    throw new Error(`${problem.slug}: needs at least ${MIN_TEST_CASES} test inputs (has ${problem.inputs?.length ?? 0})`);
  }
  return problem.inputs.map((input, index) => {
    const expectedOutput = runSolve(problem, input);
    if (!expectedOutput) throw new Error(`${problem.slug}: empty expected output for test case ${index + 1}`);
    return {
      input: input.replace(/\r\n/g, '\n'),
      expectedOutput,
      isHidden: index >= MIN_VISIBLE,
      label: index < MIN_VISIBLE ? `Sample Input ${index + 1}` : `Hidden Test Case ${index + 1}`,
    };
  });
}

/** Replace {{EXAMPLES}} with the generated example built from test case 1. */
export function buildDescription(problem, testCases) {
  if (!problem.description.includes('{{EXAMPLES}}')) {
    throw new Error(`${problem.slug}: description must contain {{EXAMPLES}}`);
  }
  return problem.description.replace('{{EXAMPLES}}', exampleBlock(testCases[0].input, testCases[0].expectedOutput));
}
