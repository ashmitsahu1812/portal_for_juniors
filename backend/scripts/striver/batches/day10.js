/**
 * Day 10 — Recursion and Backtracking. Original statements + reference
 * solutions for the in-portal Striver SDE Sheet. Expected outputs generated
 * by verify.
 */

function compareLines(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

export default {
  section: 'Day 10: Recursion and Backtracking',
  problems: [
    {
      slug: 'print-all-permutations',
      title: 'Print All Permutations of a String',
      difficulty: 'Medium',
      topic: 'Backtracking',
      description: `Given a string \`S\` of distinct lowercase letters, print **every permutation** of its characters — one permutation per line, in lexicographic order.

Input format: one line containing \`S\`.

{{EXAMPLES}}`,
      constraints: '1 <= |S| <= 7\nS contains distinct lowercase letters',
      inputs: ['abc', 'a', 'ab', 'xyz', 'mnop', 'abcd', 'pq'],
      solve(input) {
        const s = input.trim().split('\n')[0];
        const chars = s.split('').sort();
        const results = [];
        function backtrack(current, used) {
          if (current.length === chars.length) { results.push(current.join('')); return; }
          for (let i = 0; i < chars.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            current.push(chars[i]);
            backtrack(current, used);
            current.pop();
            used[i] = false;
          }
        }
        backtrack([], new Array(chars.length).fill(false));
        results.sort(compareLines);
        return results.join('\n');
      },
    },
    {
      slug: 'n-queens-count',
      title: 'N-Queens (count arrangements)',
      difficulty: 'Hard',
      topic: 'Backtracking',
      description: `Place \`N\` queens on an \`N x N\` chessboard so that no two queens attack each other — no two queens may share the same row, column or diagonal.

Print the **number of distinct valid arrangements**.

Input format: one line containing \`N\`.

{{EXAMPLES}}`,
      constraints: '1 <= N <= 12',
      inputs: ['1', '4', '8', '2', '3', '5', '6'],
      solve(input) {
        const N = Number(input.trim());
        const cols = new Set();
        const diag1 = new Set(); // r - c
        const diag2 = new Set(); // r + c
        let count = 0;
        function place(r) {
          if (r === N) { count++; return; }
          for (let c = 0; c < N; c++) {
            if (cols.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;
            cols.add(c); diag1.add(r - c); diag2.add(r + c);
            place(r + 1);
            cols.delete(c); diag1.delete(r - c); diag2.delete(r + c);
          }
        }
        place(0);
        return String(count);
      },
    },
    {
      slug: 'sudoku-solver',
      title: 'Sudoku Solver',
      difficulty: 'Hard',
      topic: 'Backtracking',
      description: `Given a partially filled \`9 x 9\` Sudoku grid with digits \`1\`-\`9\` and empty cells written as \`.\`, fill the grid so that every row, every column and every \`3 x 3\` box contains all digits exactly once. The puzzle is guaranteed to have exactly one solution.

Input: 9 lines of 9 characters each.

Print the 9 solved lines.

{{EXAMPLES}}`,
      constraints: 'The grid is a valid Sudoku puzzle with exactly one solution',
      inputs: [
        '53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79',
        '123456789\n456789123\n789123456\n234567891\n567891234\n891234567\n345678912\n678912345\n912345678',
        '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......',
        '..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3..',
        '...456789\n456789123\n789123456\n234567891\n567891234\n891234567\n345678912\n678912345\n912345...',
        '123...789\n456789123\n789123456\n234567891\n567891234\n891234567\n345678912\n678912345\n...345678',
        '123456789\n.........\n789123456\n234567891\n.........\n891234567\n345678912\n678912345\n912345678',
      ],
      solve(input) {
        const raw = input.trim().split('\n');
        let lines = raw.slice(0, 9);
        if (lines.length === 1 && lines[0].replace(/[^.\d]/g, '').length === 81) {
          const flat = lines[0];
          lines = [];
          for (let r = 0; r < 9; r++) lines.push(flat.slice(r * 9, r * 9 + 9));
        }
        const board = lines.map(line => line.split(''));
        const rows = Array.from({ length: 9 }, () => new Set());
        const cols = Array.from({ length: 9 }, () => new Set());
        const boxes = Array.from({ length: 9 }, () => new Set());
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            const v = board[r][c];
            if (v !== '.') { rows[r].add(v); cols[c].add(v); boxes[Math.floor(r / 3) * 3 + Math.floor(c / 3)].add(v); }
          }
        }
        function solveCell(idx) {
          if (idx === 81) return true;
          const r = Math.floor(idx / 9), c = idx % 9;
          if (board[r][c] !== '.') return solveCell(idx + 1);
          const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
          for (let d = 1; d <= 9; d++) {
            const v = String(d);
            if (rows[r].has(v) || cols[c].has(v) || boxes[box].has(v)) continue;
            board[r][c] = v;
            rows[r].add(v); cols[c].add(v); boxes[box].add(v);
            if (solveCell(idx + 1)) return true;
            board[r][c] = '.';
            rows[r].delete(v); cols[c].delete(v); boxes[box].delete(v);
          }
          return false;
        }
        solveCell(0);
        return board.map(row => row.join('')).join('\n');
      },
    },
    {
      slug: 'm-coloring',
      title: 'M Coloring Problem (count colorings)',
      difficulty: 'Hard',
      topic: 'Backtracking',
      description: `Given an undirected graph with \`N\` vertices and \`E\` edges, count how many ways its vertices can be colored with at most \`M\` colors such that no two adjacent vertices share a color. Vertices are labeled (colorings that differ on any vertex count as different).

Input format: first line has \`N M E\`, then \`E\` lines each with \`u v\` (1-based).

Print the number of valid colorings.

{{EXAMPLES}}`,
      constraints: '1 <= N <= 10\n1 <= M <= 4\n0 <= E <= N*(N-1)/2',
      inputs: [
        '4 3 3\n1 2\n2 3\n3 4',
        '1 2 0',
        '2 2 1\n1 2',
        '3 3 0',
        '4 4 6\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4',
        '3 2 3\n1 2\n2 3\n1 3',
        '5 3 4\n1 2\n2 3\n3 4\n4 5',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const [N, M, E] = lines[0].split(/\s+/).map(Number);
        const adj = Array.from({ length: N }, () => []);
        for (let i = 1; i <= E; i++) {
          const [u, v] = lines[i].split(/\s+/).map(Number);
          adj[u - 1].push(v - 1);
          adj[v - 1].push(u - 1);
        }
        const colors = new Array(N).fill(-1);
        let count = 0;
        function assign(v) {
          if (v === N) { count++; return; }
          for (let color = 0; color < M; color++) {
            if (adj[v].some(nbr => colors[nbr] === color)) continue;
            colors[v] = color;
            assign(v + 1);
            colors[v] = -1;
          }
        }
        assign(0);
        return String(count);
      },
    },
    {
      slug: 'rat-in-a-maze',
      title: 'Rat in a Maze (print all paths)',
      difficulty: 'Hard',
      topic: 'Backtracking',
      description: `An \`N x N\` maze has open cells (\`1\`) and blocked cells (\`0\`). A rat starts at the **top-left** corner and must reach the **bottom-right** corner, moving only **D**own, **L**eft, **R**ight or **U**p, and never visiting the same cell twice in one path.

Print every distinct path as a string of moves, in lexicographic order (D < L < R < U). If no path exists, print \`-1\`.

Input format: first line \`N\`, then \`N\` lines of \`N\` characters (\`0\`/\`1\`).

{{EXAMPLES}}`,
      constraints: '2 <= N <= 7\nIf the start or end cell is blocked there is no path',
      inputs: [
        '4\n1 0 0 0\n1 1 0 1\n0 1 0 0\n1 1 1 1',
        '2\n1 0\n0 0',
        '2\n1 0\n0 1',
        '3\n1 1 1\n1 1 1\n1 1 1',
        '3\n1 0 0\n1 1 0\n1 1 1',
        '2\n1 1\n1 1',
        '4\n1 1 0 1\n0 1 1 0\n0 1 1 1\n1 0 0 1',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const N = Number(lines[0]);
        const grid = lines.slice(1, 1 + N).map(line => line.split(/\s+/).map(Number));
        const paths = [];
        const visited = Array.from({ length: N }, () => new Array(N).fill(false));
        const moves = [
          ['D', 1, 0],
          ['L', 0, -1],
          ['R', 0, 1],
          ['U', -1, 0],
        ];
        function walk(r, c, current) {
          if (r === N - 1 && c === N - 1) { paths.push(current.join('')); return; }
          visited[r][c] = true;
          for (const [name, dr, dc] of moves) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
            if (grid[nr][nc] === 0 || visited[nr][nc]) continue;
            current.push(name);
            walk(nr, nc, current);
            current.pop();
          }
          visited[r][c] = false;
        }
        if (grid[0][0] === 1) walk(0, 0, []);
        paths.sort(compareLines);
        return paths.length ? paths.join('\n') : '-1';
      },
    },
    {
      slug: 'word-break-print-all',
      title: 'Word Break (print all segmentations)',
      difficulty: 'Medium',
      topic: 'Recursion',
      description: `Given a dictionary of \`N\` words and a string \`S\`, print every way to split \`S\` into a sequence of dictionary words (each character used exactly once, in order).

Write each segmentation as its words separated by single spaces, one segmentation per line, in lexicographic order. If no segmentation is possible, print \`-1\`.

Input format: first line \`N\`, second line the \`N\` dictionary words, third line the string \`S\`.

{{EXAMPLES}}`,
      constraints: '1 <= N <= 20\n1 <= |S| <= 25\nAll words and S contain lowercase letters only',
      inputs: [
        '4\ncat cats dog sand\ncatsanddog',
        '2\na b\nab',
        '3\naaa a aa\naaaa',
        '2\nab cd\nabcd',
        '1\nhello\nhello',
        '3\napple pen ape\napplepenape',
        '2\na b\nc',
      ],
      solve(input) {
        const lines = input.trim().split('\n');
        const N = Number(lines[0]);
        const dict = new Set(lines[1].split(/\s+/).slice(0, N));
        const s = lines[2].trim();
        const results = [];
        function segment(start, current) {
          if (start === s.length) { results.push(current.join(' ')); return; }
          for (let end = start + 1; end <= s.length; end++) {
            const word = s.slice(start, end);
            if (!dict.has(word)) continue;
            current.push(word);
            segment(end, current);
            current.pop();
          }
        }
        segment(0, []);
        results.sort(compareLines);
        return results.length ? results.join('\n') : '-1';
      },
    },
  ],
};
