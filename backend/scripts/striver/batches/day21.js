/**
 * Day 21 — Binary Search Tree Part-II. Original statements + reference
 * solutions for the in-portal Striver SDE Sheet. Expected outputs generated
 * by verify.
 */

function buildTree(serial) {
  const tokens = serial.trim().split(/\s+/);
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: Number(tokens[0]), raw: tokens[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < tokens.length) {
    const node = queue.shift();
    if (i < tokens.length) {
      const t = tokens[i++];
      if (t !== 'null') { node.left = { val: Number(t), raw: t, left: null, right: null }; queue.push(node.left); }
    }
    if (i < tokens.length) {
      const t = tokens[i++];
      if (t !== 'null') { node.right = { val: Number(t), raw: t, left: null, right: null }; queue.push(node.right); }
    }
  }
  return root;
}

function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node);
  inorder(node.right, out);
  return out;
}

const BSTS = [
  '5 3 8 2 4 7 9',
  '1',
  '5 3 null 2 4',
  '8 3 10 1 6 null 14 null null 4 7 13',
  '10 5 15 3 7 12 20',
  '4 2 6 1 3 5 7',
  '9 8 7 6 5 4 3',
  '6 4 8 2 5 7 9 1 3',
  '7 4 10 2 5 8 11 1 3 6 9',
  '50 30 70 20 40 60 80',
];

export default {
  section: 'Day 21: Binary Search Tree Part-II',
  problems: [
    {
      slug: 'floor-in-a-bst',
      title: 'Floor in a Binary Search Tree',
      difficulty: 'Easy',
      topic: 'BST',
      description: `The **floor** of a key \`K\` in a BST is the largest node value that is \`<= K\`.

Print the floor value, or \`-1\` if no node value is \`<= K\`.

Input format: first line the tree in level order (\`null\` for missing children), second line \`K\`.

{{EXAMPLES}}`,
      constraints: '1 <= number of nodes <= 10^4\nAll node values distinct\n-10^9 <= value, K <= 10^9',
      inputs: [
        '5 3 8 2 4 7 9\n6',
        '5 3 8 2 4 7 9\n1',
        '1\n1',
        '10 5 15 3 7 12 20\n13',
        '4 2 6 1 3 5 7\n0',
        '8 3 10 1 6 null 14\n14',
        '5 3 8 2 4 7 9\n100',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const root = buildTree(lines[0]);
        const key = Number(lines[1].trim());
        let best = null;
        let node = root;
        while (node) {
          if (node.val <= key) { best = node.val; node = node.right; }
          else node = node.left;
        }
        return best === null ? '-1' : String(best);
      },
    },
    {
      slug: 'ceil-in-a-bst',
      title: 'Ceil in a Binary Search Tree',
      difficulty: 'Easy',
      topic: 'BST',
      description: `The **ceil** of a key \`K\` in a BST is the smallest node value that is \`>= K\`.

Print the ceil value, or \`-1\` if no node value is \`>= K\`.

Input format: first line the tree in level order (\`null\` for missing children), second line \`K\`.

{{EXAMPLES}}`,
      constraints: '1 <= number of nodes <= 10^4\nAll node values distinct\n-10^9 <= value, K <= 10^9',
      inputs: [
        '5 3 8 2 4 7 9\n6',
        '5 3 8 2 4 7 9\n10',
        '1\n1',
        '10 5 15 3 7 12 20\n13',
        '4 2 6 1 3 5 7\n0',
        '8 3 10 1 6 null 14\n9',
        '5 3 8 2 4 7 9\n-100',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const root = buildTree(lines[0]);
        const key = Number(lines[1].trim());
        let best = null;
        let node = root;
        while (node) {
          if (node.val >= key) { best = node.val; node = node.left; }
          else node = node.right;
        }
        return best === null ? '-1' : String(best);
      },
    },
    {
      slug: 'kth-smallest-in-bst',
      title: 'K-th Smallest Element in a BST',
      difficulty: 'Medium',
      topic: 'BST',
      description: `Given a BST and an integer \`K\` (1-based), print the \`K\`-th smallest value in the tree (inorder order). \`K\` is always valid.

Input format: first line the tree in level order, second line \`K\`.

{{EXAMPLES}}`,
      constraints: '1 <= K <= number of nodes <= 10^4\nAll node values distinct',
      inputs: [
        '5 3 8 2 4 7 9\n3',
        '1\n1',
        '5 3 null 2 4\n1',
        '10 5 15 3 7 12 20\n5',
        '4 2 6 1 3 5 7\n7',
        '9 8 7 6 5 4 3\n4',
        '6 4 8 2 5 7 9 1 3\n6',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const root = buildTree(lines[0]);
        const k = Number(lines[1].trim());
        const nodes = inorder(root);
        return nodes[k - 1].raw;
      },
    },
    {
      slug: 'kth-largest-in-bst',
      title: 'K-th Largest Element in a BST',
      difficulty: 'Medium',
      topic: 'BST',
      description: `Given a BST and an integer \`K\` (1-based), print the \`K\`-th largest value in the tree. \`K\` is always valid.

Input format: first line the tree in level order, second line \`K\`.

{{EXAMPLES}}`,
      constraints: '1 <= K <= number of nodes <= 10^4\nAll node values distinct',
      inputs: [
        '5 3 8 2 4 7 9\n3',
        '1\n1',
        '5 3 null 2 4\n2',
        '10 5 15 3 7 12 20\n4',
        '4 2 6 1 3 5 7\n7',
        '9 8 7 6 5 4 3\n6',
        '6 4 8 2 5 7 9 1 3\n1',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const root = buildTree(lines[0]);
        const k = Number(lines[1].trim());
        const nodes = inorder(root);
        return nodes[nodes.length - k].raw;
      },
    },
    {
      slug: 'two-sum-iv-bst',
      title: 'Two Sum IV — Input is a BST',
      difficulty: 'Easy',
      topic: 'BST',
      description: `Given a BST and a target \`T\`, determine whether **two distinct nodes** have values that add up to exactly \`T\`.

Print \`YES\` if such a pair exists, otherwise \`NO\`.

Input format: first line the tree in level order, second line \`T\`.

{{EXAMPLES}}`,
      constraints: '1 <= number of nodes <= 10^4\nAll node values distinct\n-10^6 <= value, T <= 10^6',
      inputs: [
        '5 3 8 2 4 7 9\n9',
        '5 3 8 2 4 7 9\n20',
        '1\n2',
        '2 1\n3',
        '10 5 15 3 7 12 20\n22',
        '4 2 6 1 3 5 7\n100',
        '5 3 8 2 4 7 9\n6',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const root = buildTree(lines[0]);
        const target = Number(lines[1].trim());
        const values = inorder(root).map(node => node.val);
        const seen = new Set();
        for (const v of values) {
          if (seen.has(target - v)) return 'YES';
          seen.add(v);
        }
        return 'NO';
      },
    },
    {
      slug: 'bst-iterator',
      title: 'BST Iterator (streamed inorder)',
      difficulty: 'Medium',
      topic: 'BST',
      description: `Iterate through a BST in **ascending** order without materialising the whole traversal:

- \`next\` — advance and print the next value (\`-1\` when there is none);
- \`hasNext\` — print \`YES\` if another value remains, otherwise \`NO\`.

Print one line per query.

Input format: first line the tree in level order, second line \`Q\`, third line \`Q\` queries (one per line).

{{EXAMPLES}}`,
      constraints: '1 <= number of nodes <= 10^4\n1 <= Q <= 2 * number of nodes\nAll node values distinct',
      inputs: [
        '5 3 8 2 4 7 9\n6\nnext\nnext\nhasNext\nnext\nhasNext\nnext',
        '1\n3\nhasNext\nnext\nhasNext',
        '4 2 6 1 3 5 7\n9\nhasNext\nnext\nnext\nnext\nnext\nnext\nnext\nnext\nhasNext',
        '5 3 null 2 4\n8\nnext\nnext\nnext\nnext\nhasNext\nnext\nnext\nhasNext',
        '10 5 15 3 7 12 20\n4\nnext\nnext\nhasNext\nnext',
        '8 3 10 1 6 null 14\n7\nnext\nhasNext\nnext\nnext\nnext\nhasNext\nnext',
        '2 1\n5\nnext\nnext\nnext\nhasNext\nhasNext',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const root = buildTree(lines[0]);
        const values = inorder(root).map(node => node.raw);
        const queries = lines[2].trim().split(/\s+/);
        const out = [];
        let idx = 0;
        for (const query of queries) {
          if (query === 'next') {
            out.push(idx < values.length ? values[idx] : '-1');
            if (idx < values.length) idx++;
          } else {
            out.push(idx < values.length ? 'YES' : 'NO');
          }
        }
        return out.join('\n');
      },
    },
    {
      slug: 'largest-bst-subtree',
      title: 'Largest BST in a Binary Tree',
      difficulty: 'Hard',
      topic: 'BST',
      description: `Given a binary tree (not necessarily a BST), find its largest subtree that **is** a valid BST — for every node all left-subtree values are smaller and all right-subtree values larger (strictly).

Print the number of nodes in that largest BST subtree (every single node is itself a valid BST, so the answer is at least 1).

Input format: one line with the tree in level order, using \`null\` for missing children.

{{EXAMPLES}}`,
      constraints: '1 <= number of nodes <= 10^4\nNode values distinct',
      inputs: [
        '50 30 70 20 40 60 80',
        '1',
        '5 3 8 2 4 7 9',
        '10 5 15 1 7 6 20',
        '4 2 6 1 3 5 7',
        '3 1 4 null null 2',
        '9 8 7 6 5 4 3',
        '1 2 3 4 5 6 7',
      ],
      solve(input) {
        const root = buildTree(input);
        let best = 1;
        // returns { size, min, max } for a valid BST subtree; null if not a BST
        const walk = node => {
          if (!node) return { size: 0, min: Infinity, max: -Infinity };
          const left = walk(node.left);
          const right = walk(node.right);
          if (left && right && left.max < node.val && node.val < right.min) {
            const size = 1 + left.size + right.size;
            best = Math.max(best, size);
            return { size, min: Math.min(left.min, node.val), max: Math.max(right.max, node.val) };
          }
          // mark as invalid for parents
          return null;
        };
        walk(root);
        return String(best);
      },
    },
    {
      slug: 'serialize-deserialize-binary-tree',
      title: 'Serialize and Deserialize a Binary Tree',
      difficulty: 'Hard',
      topic: 'Binary Tree',
      description: `**Serialize** a binary tree: produce a string that fully encodes the tree so it can be rebuilt later.

Use preorder with an explicit null marker: for every node print its value, then recursively serialize the left subtree, then the right subtree, writing \`#\` for each missing child. So every node and every null child becomes exactly one token.

Input format: one line with the tree in level order, using \`null\` for missing children.

Print the tokens (values and \`#\`) separated by single spaces — a tree with one node gives \`value # #\`.

{{EXAMPLES}}`,
      constraints: '1 <= number of nodes <= 10^4\nNode values distinct',
      inputs: [
        '1 2 3 null 4 5 6',
        '1',
        '1 2 null 3',
        '1 2 3 4 5 6 7',
        '2 null 3 null 4',
        '5 3 8 2 4 7 9',
        '1 2 null 3 null 4',
      ],
      solve(input) {
        const root = buildTree(input);
        const tokens = [];
        const serializeNode = node => {
          if (!node) { tokens.push('#'); return; }
          tokens.push(node.raw);
          serializeNode(node.left);
          serializeNode(node.right);
        };
        serializeNode(root);
        return tokens.join(' ');
      },
    },
  ],
};
