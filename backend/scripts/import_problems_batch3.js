import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const rawProblems = [
  {
    title: "Password Check",
    description: `Write a validation program that continuously scans characters from a single line string to check if it contains an invalid character like \`#\`. Use a loop with a \`break\` statement to stop processing immediately if \`#\` is hit and print \`Rejected\`. If the loop finishes inspecting without hitting a break, print \`Approved\`.`,
    difficulty: 'Medium',
    constraints: 'String length <= 100',
    tags: ['Break and Continue statement'],
    testCases: [
      { input: 'pass123\n', expectedOutput: 'Approved', isHidden: false, label: 'Sample Output 1' },
      { input: 'pa#ss\n', expectedOutput: 'Rejected', isHidden: false, label: 'Sample Output 2' }
    ],
    starterCode: {
      'Python': '# Write your Python solution here\n',
      'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
      'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
      'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
    }
  },
  {
    title: "Max of two Numbers",
    description: `Implement a function that accepts two integers as arguments and returns the larger value.`,
    difficulty: 'Easy',
    constraints: '-10^4 <= A, B <= 10^4',
    tags: ['Return statement'],
    testCases: [
      { input: '15 42\n', expectedOutput: '42', isHidden: false, label: 'Sample Output 1' },
      { input: '-10 -5\n', expectedOutput: '-5', isHidden: true, label: 'Hidden Test Case 2' }
    ],
    starterCode: {
      'Python': `def max_of_two(a, b):
    # Write your code here
    pass

# --- DO NOT MODIFY CODE BELOW ---
if __name__ == '__main__':
    try:
        parts = input().split()
        if len(parts) >= 2:
            a = int(parts[0])
            b = int(parts[1])
            res = max_of_two(a, b)
            print(res)
    except EOFError:
        pass
`,
      'C': `#include <stdio.h>

int max_of_two(int a, int b) {
    // Write your code here
    return 0;
}

// --- DO NOT MODIFY CODE BELOW ---
int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        int res = max_of_two(a, b);
        printf("%d\\n", res);
    }
    return 0;
}
`,
      'C++': `#include <iostream>
using namespace std;

int max_of_two(int a, int b) {
    // Write your code here
    return 0;
}

// --- DO NOT MODIFY CODE BELOW ---
int main() {
    int a, b;
    if (cin >> a >> b) {
        int res = max_of_two(a, b);
        cout << res << endl;
    }
    return 0;
}
`,
      'Java': `import java.util.Scanner;

public class Main {
    public static int max_of_two(int a, int b) {
        // Write your code here
        return 0;
    }

    // --- DO NOT MODIFY CODE BELOW ---
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            int res = max_of_two(a, b);
            System.out.println(res);
        }
    }
}
`
    }
  },
  {
    title: "Enough Chocolates for Everyone",
    description: `You have $C$ chocolates and $P$ people. Write a program to determine if the chocolates can be distributed equally among all people such that everyone gets at least one chocolate and no chocolates are left over. Print \`Yes\` or \`No\`.`,
    difficulty: 'Easy',
    constraints: '1 <= C, P <= 1000',
    tags: ['Python if-else'],
    testCases: [
      { input: '12 4\n', expectedOutput: 'Yes', isHidden: false, label: 'Sample Output 1' },
      { input: '10 3\n', expectedOutput: 'No', isHidden: false, label: 'Sample Output 2' }
    ],
    starterCode: {
      'Python': '# Write your Python solution here\n',
      'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
      'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
      'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
    }
  },
  {
    title: "Second Largest Divisor",
    description: `Given an integer $N$, find its second largest divisor (excluding the number $N$ itself). If $N$ is 1 or prime, its second largest divisor is 1.`,
    difficulty: 'Medium',
    constraints: '2 <= N <= 10^6',
    tags: ['Python:math', 'Python Loops'],
    testCases: [
      { input: '12\n', expectedOutput: '6', isHidden: false, label: 'Sample Output 1' },
      { input: '25\n', expectedOutput: '5', isHidden: true, label: 'Hidden Test Case 2' }
    ],
    starterCode: {
      'Python': '# Write your Python solution here\n',
      'C': '#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}\n',
      'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}\n',
      'Java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n    }\n}\n'
    }
  },
  {
    title: "Print Multiples of 3 in a Given Range",
    description: `Given two space-separated integers, \`Start\` and \`End\`, use a \`for\` loop to print all numbers between \`Start\` and \`End\` (inclusive) that are perfectly divisible by 3, each on a separate line.`,
    difficulty: 'Easy',
    constraints: '1 <= Start <= End <= 500',
    tags: ['The for loop'],
    testCases: [
      { input: '4 12\n', expectedOutput: '6\n9\n12', isHidden: false, label: 'Sample Output 1' }
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
    let parentModule = await Module.findOne({ title: /Foundations of Python Programming/i });
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
