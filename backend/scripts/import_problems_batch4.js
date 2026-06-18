import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Square of Rectangles",
    description: `You are given the length $L$ and width $W$ of a rectangle. Write a program to determine the side length of the largest square that can completely fit inside this rectangle, and calculate how many such squares can tile the rectangle perfectly without overlapping or leaving gaps. If a perfect tiling is impossible with that square size, print \`-1\`.`,
    difficulty: 'Hard',
    constraints: '1 <= L, W <= 10^4',
    tags: ['Geometry', 'Python:math'],
    testCases: [
      { input: '6 4\n', expectedOutput: '-1', isHidden: false, label: 'Sample Output 1' },
      { input: '5 5\n', expectedOutput: '1', isHidden: true, label: 'Hidden Test Case 2' }
    ],
    starterCode: {
      'Python': '# Write your Python solution here\n',
      'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
      'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
      'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
    }
  },
  {
    title: "Print 1 to N using while Loop",
    description: `Write a program that reads a positive integer $N$ from the standard input and uses a \`while\` loop to print all integers from 1 up to $N$ in ascending order, each on a new line.`,
    difficulty: 'Easy',
    constraints: '1 <= N <= 500',
    tags: ['While loop'],
    testCases: [
      { input: '3\n', expectedOutput: '1\n2\n3', isHidden: false, label: 'Sample Output 1' }
    ],
    starterCode: {
      'Python': '# Write your Python solution here\n',
      'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
      'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
      'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
    }
  },
  {
    title: "Find Primes - II",
    description: `Write a function \`is_prime(n)\` that checks whether a given positive integer $n$ is a prime number. The function should return \`True\` if the number is prime, and \`False\` otherwise.`,
    difficulty: 'Easy',
    constraints: '1 <= n <= 10^4',
    tags: ['Return statement', 'Functions'],
    testCases: [
      { input: '11\n', expectedOutput: 'True', isHidden: false, label: 'Sample Output 1' },
      { input: '4\n', expectedOutput: 'False', isHidden: false, label: 'Sample Output 2' }
    ],
    starterCode: {
      'Python': `def is_prime(n):
    # Write your code here
    pass

# --- DO NOT MODIFY CODE BELOW ---
if __name__ == '__main__':
    try:
        n = int(input())
        res = is_prime(n)
        print("True" if res else "False")
    except EOFError:
        pass
`,
      'C': `#include <stdio.h>
#include <stdbool.h>

bool is_prime(int n) {
    // Write your code here
    return false;
}

// --- DO NOT MODIFY CODE BELOW ---
int main() {
    int n;
    if (scanf("%d", &n) == 1) {
        bool res = is_prime(n);
        if (res) printf("True\\n");
        else printf("False\\n");
    }
    return 0;
}
`,
      'C++': `#include <iostream>
using namespace std;

bool is_prime(int n) {
    // Write your code here
    return false;
}

// --- DO NOT MODIFY CODE BELOW ---
int main() {
    int n;
    if (cin >> n) {
        bool res = is_prime(n);
        if (res) cout << "True" << endl;
        else cout << "False" << endl;
    }
    return 0;
}
`,
      'Java': `import java.util.Scanner;

public class Main {
    public static boolean is_prime(int n) {
        // Write your code here
        return false;
    }

    // --- DO NOT MODIFY CODE BELOW ---
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int n = sc.nextInt();
            boolean res = is_prime(n);
            if(res) {
                System.out.println("True");
            } else {
                System.out.println("False");
            }
        }
    }
}
`
    }
  },
  {
    title: "Check for Intersection Between Intervals",
    description: `You are given two one-dimensional intervals on a number line: $[A, B]$ and $[C, D]$. Write a program to check if these two intervals intersect or overlap at any point. Print \`YES\` if they intersect, and \`NO\` if they are completely disjoint.`,
    difficulty: 'Hard',
    constraints: '-1000 <= A <= B <= 1000\n-1000 <= C <= D <= 1000',
    tags: ['Python if-else', 'Logic Tracking'],
    testCases: [
      { input: '1 5 4 8\n', expectedOutput: 'YES', isHidden: false, label: 'Sample Output 1' },
      { input: '1 5 6 10\n', expectedOutput: 'NO', isHidden: false, label: 'Sample Output 2' }
    ],
    starterCode: {
      'Python': '# Write your Python solution here\n',
      'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
      'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
      'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
    }
  },
  {
    title: "Print 1 to N using for Loop - II",
    description: `Write a program that reads a positive integer $N$ from standard input and uses a \`for\` loop along with the \`range()\` function to print all numbers from 1 to $N$ inclusive, each on a separate line.`,
    difficulty: 'Easy',
    constraints: '1 <= N <= 500',
    tags: ['The for loop'],
    testCases: [
      { input: '4\n', expectedOutput: '1\n2\n3\n4', isHidden: false, label: 'Sample Output 1' }
    ],
    starterCode: {
      'Python': '# Write your Python solution here\n',
      'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
      'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
      'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
    }
  }
];

const seedNewProblems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // Find the appropriate module
    let parentModule = await Module.findOne({ title: /Python Control Flow and Functions/i });
    if (!parentModule) {
      parentModule = await Module.findOne(); // fallback
    }

    for (const p of rawProblems) {
      const newProblem = new Problem({
        moduleId: parentModule._id,
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        constraints: p.constraints,
        allowedLanguages: ['C', 'C++', 'Python', 'Java'],
        tags: p.tags,
        timeLimitSeconds: 2,
        memoryLimitMB: 256,
        isPublished: true,
        testCases: p.testCases,
        starterCode: p.starterCode
      });
      await newProblem.save();
      console.log(`👨‍💻 Inserted new problem: ${newProblem.title} into module "${parentModule.title}"`);
    }

    console.log('🎉 Data entry complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error inserting data:', err);
    process.exit(1);
  }
};

seedNewProblems();
