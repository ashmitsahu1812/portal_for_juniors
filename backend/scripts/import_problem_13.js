import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const seedNewProblem = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // Find the appropriate module
    let parentModule = await Module.findOne({ title: /Python Control Flow and Functions/i });
    if (!parentModule) {
      parentModule = await Module.findOne(); // fallback
    }

    const newProblem = new Problem({
      moduleId: parentModule._id,
      title: "Find Absolute Difference",
      description: `Your task is to implement a parameterised function \`find_absolute_difference(a, b)\` that takes two integers as parameters.

The function must compute and **return** the absolute difference between the two numbers ($|a - b|$). Do not print the output to the console; simply return the calculated value from your function.

Note: You do not need to parse user input from \`stdin\` or manually invoke the function. The system checker will handle input splitting and verify the returned value.`,
      difficulty: 'Easy',
      constraints: '-100 <= a, b <= 100',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Python Function', 'Parameterised'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '5 3\n',
          expectedOutput: '2',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '3 10\n',
          expectedOutput: '7',
          isHidden: false,
          label: 'Sample Output 2',
        },
        {
          input: '-4 6\n',
          expectedOutput: '10',
          isHidden: false,
          label: 'Sample Output 3',
        },
        {
          input: '0 0\n',
          expectedOutput: '0',
          isHidden: true,
          label: 'Hidden Test Case 4',
        },
        {
          input: '-50 -50\n',
          expectedOutput: '0',
          isHidden: true,
          label: 'Hidden Test Case 5',
        }
      ],
      starterCode: {
        'Python': `def find_absolute_difference(a, b):
    # Write your code here
    pass

# --- DO NOT MODIFY CODE BELOW ---
if __name__ == '__main__':
    try:
        parts = input().split()
        a = int(parts[0])
        b = int(parts[1])
        res = find_absolute_difference(a, b)
        print(res)
    except EOFError:
        pass
`,
        'C': `#include <stdio.h>

int find_absolute_difference(int a, int b) {
    // Write your code here
    return 0;
}

// --- DO NOT MODIFY CODE BELOW ---
int main() {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        int res = find_absolute_difference(a, b);
        printf("%d\\n", res);
    }
    return 0;
}
`,
        'C++': `#include <iostream>
using namespace std;

int find_absolute_difference(int a, int b) {
    // Write your code here
    return 0;
}

// --- DO NOT MODIFY CODE BELOW ---
int main() {
    int a, b;
    if (cin >> a >> b) {
        int res = find_absolute_difference(a, b);
        cout << res << endl;
    }
    return 0;
}
`,
        'Java': `import java.util.Scanner;

public class Main {
    public static int find_absolute_difference(int a, int b) {
        // Write your code here
        return 0;
    }

    // --- DO NOT MODIFY CODE BELOW ---
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            int res = find_absolute_difference(a, b);
            System.out.println(res);
        }
    }
}
`
      }
    });

    await newProblem.save();
    console.log(`👨‍💻 Inserted new problem: ${newProblem.title} into module "${parentModule.title}"`);

    console.log('🎉 Data entry complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error inserting data:', err);
    process.exit(1);
  }
};

seedNewProblem();
