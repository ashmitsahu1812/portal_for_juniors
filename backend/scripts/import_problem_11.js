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
      title: "Divisible by 3 - II",
      description: `Your task is to write a parameterised function \`check_divisibility(a, b, c)\` that takes three integers as arguments.

The function must compute the sum of the three numbers ($a + b + c$) and determine if it is divisible by 3. 
- Print \`Yes\` if the sum is perfectly divisible by 3.
- Print \`No\` otherwise.

Note: You do not need to take user input or manually call your function. The system checker will automatically parse inputs and invoke \`check_divisibility(a, b, c)\`.`,
      difficulty: 'Easy',
      constraints: '1 <= a, b, c <= 100',
      allowedLanguages: ['C', 'C++', 'Python', 'Java'],
      tags: ['Python Function', 'Parameterised'],
      timeLimitSeconds: 2,
      memoryLimitMB: 256,
      isPublished: true,
      testCases: [
        {
          input: '1\n2\n3\n',
          expectedOutput: 'Yes',
          isHidden: false,
          label: 'Sample Output 1',
        },
        {
          input: '4\n5\n7\n',
          expectedOutput: 'No',
          isHidden: false,
          label: 'Sample Output 2',
        },
        {
          input: '100\n100\n100\n',
          expectedOutput: 'Yes',
          isHidden: true,
          label: 'Hidden Test Case 3',
        },
        {
          input: '1\n1\n2\n',
          expectedOutput: 'No',
          isHidden: true,
          label: 'Hidden Test Case 4',
        }
      ],
      starterCode: {
        'Python': `def check_divisibility(a, b, c):
    # Write your code here
    pass

# --- DO NOT MODIFY CODE BELOW ---
if __name__ == '__main__':
    try:
        a = int(input())
        b = int(input())
        c = int(input())
        check_divisibility(a, b, c)
    except EOFError:
        pass
`,
        'C': `#include <stdio.h>

void check_divisibility(int a, int b, int c) {
    // Write your code here
}

// --- DO NOT MODIFY CODE BELOW ---
int main() {
    int a, b, c;
    if (scanf("%d %d %d", &a, &b, &c) == 3) {
        check_divisibility(a, b, c);
    }
    return 0;
}
`,
        'C++': `#include <iostream>
using namespace std;

void check_divisibility(int a, int b, int c) {
    // Write your code here
}

// --- DO NOT MODIFY CODE BELOW ---
int main() {
    int a, b, c;
    if (cin >> a >> b >> c) {
        check_divisibility(a, b, c);
    }
    return 0;
}
`,
        'Java': `import java.util.Scanner;

public class Main {
    public static void check_divisibility(int a, int b, int c) {
        // Write your code here
    }

    // --- DO NOT MODIFY CODE BELOW ---
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            int c = sc.nextInt();
            check_divisibility(a, b, c);
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
