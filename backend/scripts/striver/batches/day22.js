/**
 * Day 22 — Binary Trees [Miscellaneous]. Original statements + reference
 * solutions for the in-portal Striver SDE Sheet. Expected outputs generated
 * by verify.
 *
 * The sheet's "median from a stream" and "kth largest in an unsorted array"
 * entries duplicate Day 12 / Day 21 content and are covered there, so this
 * batch carries the four unique problems of the section.
 */

function buildTree(serial) {
  const tokens = serial.trim().split(/\s+/);
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: tokens[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < tokens.length) {
    const node = queue.shift();
    if (i < tokens.length) {
      const t = tokens[i++];
      if (t !== 'null') { node.left = { val: t, left: null, right: null }; queue.push(node.left); }
    }
    if (i < tokens.length) {
      const t = tokens[i++];
      if (t !== 'null') { node.right = { val: t, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}

export default {
  section: 'Day 22: Binary Trees [Miscellaneous]',
  problems: [
    {
      slug: 'binary-tree-to-doubly-linked-list',
      title: 'Binary Tree to Doubly Linked List (inorder)',
      difficulty: 'Medium',
      topic: 'Binary Tree',
      description: `Convert a binary tree into a doubly linked list **in place**, following the inorder sequence: each node's \`left\` pointer becomes the previous node and its \`right\` pointer the next node.

Print the resulting list from head to tail — which is exactly the tree's inorder sequence — values separated by single spaces.

Input format: one line with the tree in level order, using \`null\` for missing children.

{{EXAMPLES}}`,
      constraints: '1 <= number of nodes <= 10^4\nNode values are distinct',
      inputs: [
        '1 2 3 null 4 5 6',
        '1',
        '1 2 null 3',
        '1 2 3 4 5 6 7',
        '7 6 5 4 3 null 2',
        '10 5 15 3 7 12 20',
        '4 2 6 1 3 5 7',
      ],
      solve(input) {
        const root = buildTree(input);
        const out = [];
        const inorder = node => {
          if (!node) return;
          inorder(node.left);
          out.push(node.val);
          inorder(node.right);
        };
        inorder(root);
        return out.join(' ');
      },
    },
    {
      slug: 'kth-largest-element-in-a-stream',
      title: 'K-th Largest Element in a Stream',
      difficulty: 'Medium',
      topic: 'Heaps',
      description: `You start with \`N\` numbers, then receive \`M\` more numbers one at a time. After **each** incoming number, print the \`K\`-th largest value among everything seen so far (1-based).

Input format:
- first line has \`N K\`;
- second line the \`N\` initial values;
- third line \`M\`;
- fourth line the \`M\` stream values.

Print \`M\` lines.

{{EXAMPLES}}`,
      constraints: '1 <= K <= N + M <= 10^4\n-10^9 <= value <= 10^9',
      inputs: [
        '4 3\n4 5 8 2\n3\n5 9 1',
        '1 1\n10\n2\n11 9',
        '3 2\n1 2 3\n4\n0 -1 5 4',
        '5 5\n5 4 3 2 1\n3\n6 7 8',
        '2 1\n100 200\n2\n150 250',
        '3 3\n7 7 7\n2\n7 1',
        '4 2\n-1 -2 -3 -4\n3\n0 -5 1',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const [, K] = lines[0].split(/\s+/).map(Number);
        const initial = lines[1].split(/\s+/).map(Number);
        const M = Number(lines[2]);
        const stream = lines[3].split(/\s+/).map(Number).slice(0, M);
        const all = [...initial];
        const out = [];
        for (const x of stream) {
          all.push(x);
          const sorted = [...all].sort((a, b) => b - a);
          out.push(String(sorted[K - 1]));
        }
        return out.join('\n');
      },
    },
    {
      slug: 'distinct-numbers-in-window',
      title: 'Distinct Numbers in Every Window of Size K',
      difficulty: 'Medium',
      topic: 'Sliding Window',
      description: `Given an array of \`N\` integers and a window size \`K\`, slide the window from left to right and print the number of **distinct** values in each window.

Input format: first line has \`N K\`, second line the \`N\` integers.

Print \`N - K + 1\` values separated by single spaces.

{{EXAMPLES}}`,
      constraints: '1 <= K <= N <= 10^5\n-10^9 <= arr[i] <= 10^9',
      inputs: [
        '7 3\n1 2 1 3 5 3 2',
        '1 1\n5',
        '5 5\n1 1 1 1 1',
        '6 2\n1 2 3 4 5 6',
        '8 4\n4 4 4 4 1 1 1 1',
        '5 3\n-1 -1 -1 2 2',
        '9 5\n1 2 3 1 2 3 1 2 3',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const [N, K] = lines[0].split(/\s+/).map(Number);
        const arr = lines[1].split(/\s+/).map(Number).slice(0, N);
        const out = [];
        const counts = new Map();
        for (let i = 0; i < arr.length; i++) {
          counts.set(arr[i], (counts.get(arr[i]) || 0) + 1);
          if (i >= K) {
            const outgoing = arr[i - K];
            const next = counts.get(outgoing) - 1;
            if (next === 0) counts.delete(outgoing);
            else counts.set(outgoing, next);
          }
          if (i >= K - 1) out.push(String(counts.size));
        }
        return out.join(' ');
      },
    },
    {
      slug: 'flood-fill',
      title: 'Flood Fill Algorithm',
      difficulty: 'Easy',
      topic: 'Graphs',
      description: `You are given an \`N x M\` grid of colors (integers). Starting from cell \`(sr, sc)\`, recolor it and every 4-directionally connected cell of the **same original color** to a new color \`newColor\`.

Input format: first line has \`N M\`, then \`N\` rows of \`M\` integers, then a line with \`sr sc newColor\` (0-based \`sr\`, \`sc\`).

Print the recolored grid: \`N\` rows of \`M\` space-separated values.

{{EXAMPLES}}`,
      constraints: '1 <= N, M <= 50\n0 <= color, newColor <= 10^6\n0 <= sr < N, 0 <= sc < M',
      inputs: [
        '3 3\n1 1 1\n1 1 0\n1 0 1\n1 1 2',
        '1 1\n5\n0 0 7',
        '2 2\n0 0\n0 0\n0 0 1',
        '4 5\n1 1 1 1 0\n1 1 0 0 0\n1 0 1 0 1\n0 0 1 1 1\n2 3 9',
        '3 4\n4 4 4 4\n4 4 0 4\n4 4 4 4\n1 2 6',
        '5 1\n3\n3\n3\n4\n3\n0 0 8',
        '3 3\n0 1 0\n1 1 1\n0 1 0\n0 0 2',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const [N, M] = lines[0].split(/\s+/).map(Number);
        const grid = [];
        for (let r = 0; r < N; r++) grid.push(lines[r + 1].split(/\s+/).map(Number));
        const [sr, sc, newColor] = lines[N + 1].split(/\s+/).map(Number);
        const target = grid[sr][sc];
        if (target !== newColor) {
          const stack = [[sr, sc]];
          while (stack.length) {
            const [r, c] = stack.pop();
            if (r < 0 || r >= N || c < 0 || c >= M) continue;
            if (grid[r][c] !== target) continue;
            grid[r][c] = newColor;
            stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
          }
        }
        return grid.map(row => row.join(' ')).join('\n');
      },
    },
  ],
};
