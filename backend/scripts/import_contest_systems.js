import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "A memory address is represented as a decimal number 156. The system requires this address in binary form to process instructions. What will be the correct binary representation of this decimal number?",
    o: ["10011100", "10101100", "11001100", "10011010"],
    a: 0,
    e: "156 in binary is 10011100. Divide by 2 successively and track the remainders."
  },
  {
    q: "A developer wants to copy a file named report.txt from the current directory into a folder named backup (present inside the current directory). Which of the following CLI (Unix-like) commands has the correct syntax to perform this task?",
    o: ["copy report.txt backup/", "cp report.txt backup/", "cp -z report.txt backup/", "cp backup/ report.txt"],
    a: 1,
    e: "The cp command syntax is cp [source] [destination]. `cp report.txt backup/` is correct."
  },
  {
    q: "Which of the following best describes an Embedded System?",
    o: ["A system designed for general-purpose computing, such as desktops and laptops.", "A computer system integrated into a larger device, performing dedicated functions with real-time constraints.", "A software program that runs only on cloud servers without hardware dependency.", "A system that only uses artificial intelligence algorithms for data analysis."],
    a: 1,
    e: "An embedded system is a specialized controller platform integrated directly inside an application architecture designed to compute dedicated processing workloads."
  },
  {
    q: "You are setting up a script file deploy.sh with the following rules: Others should have only execute permission. The group should have read and execute permissions. The owner should have full permissions. What is the numeric value of the chmod command that will correctly apply these settings?",
    o: ["777", "641", "751", "755"],
    a: 2,
    e: "Owner: 4+2+1=7. Group: 4+1=5. Others: 1. Total: 751."
  },
  {
    q: "A system stores codes in base 5. One such code is 243 (in base 5). What will be its decimal equivalent?",
    o: ["73", "68", "83", "70"],
    a: 0,
    e: "2 * 5^2 + 4 * 5^1 + 3 * 5^0 = 50 + 20 + 3 = 73."
  },
  {
    q: "When starting version control on a new project folder, which Git command should you run first to create a repository in that directory?",
    o: ["git create", "git init", "git start", "github init"],
    a: 1,
    e: "The `git init` command sets up a fresh local Git environment configuration tracking tree."
  },
  {
    q: "In computer storage measurement according to the binary system, how many bytes are there in 1 kibibyte (KiB)?",
    o: ["1000", "1024", "512", "2048"],
    a: 1,
    e: "Binary IEC data systems count sizes using powers of 2. 1 Kibibyte (KiB) is 2^10 = 1024 bytes."
  },
  {
    q: "What is the purpose of application software?",
    o: ["To control how the computer's hardware works", "To help users do tasks like writing, drawing, or browsing the web", "To translate code into 0s and 1s", "To manage memory and CPU"],
    a: 1,
    e: "Application software accomplishes end-user productivity or leisure goals, separating them from foundational system software layers."
  },
  {
    q: "What is a Version Control System (VCS)?",
    o: ["A system that controls hardware devices in a computer.", "A software tool that helps manage changes to source code and track revisions.", "A programming language used for developing applications.", "A system that automatically updates operating systems."],
    a: 1,
    e: "A VCS (like Git) monitors and archives chronological source code changes."
  },
  {
    q: "In OS architecture, why is the kernel often referred to as the \"core\" of the system?",
    o: ["It only provides graphical interfaces to users", "It directly manages hardware and provides essential services to higher layers", "It stores all application programs permanently", "It eliminates the need for device drivers"],
    a: 1,
    e: "The kernel sits between high-level applications and low-level physical elements, managing execution, hardware, memory, and file systems."
  },
  {
    q: "Which of the following is an advantage of using CLI (Command Line Interface) over GUI (Graphical User Interface)?",
    o: ["CLI is slower for repetitive tasks.", "CLI requires no commands to be remembered.", "CLI allows faster automation through scripts.", "CLI always consumes more memory than GUI."],
    a: 2,
    e: "CLI allows administrators to bundle commands into reusable bash scripts, automating complex workflows."
  },
  {
    q: "Which of these operating systems is open-source?",
    o: ["Windows 11", "Ubuntu", "iOS", "macOS"],
    a: 1,
    e: "Ubuntu is distributed openly under open-source compliance standards, unlike proprietary systems."
  },
  {
    q: "Convert the binary transaction ID 1110011010111101 directly into hexadecimal (base 16).",
    o: ["E6BD", "F6AD", "E5CD", "D6BE"],
    a: 0,
    e: "1110 = E, 0110 = 6, 1011 = B, 1101 = D. Result: E6BD."
  },
  {
    q: "In terms of usage, which of the following is correct?",
    o: ["CPU is mainly used for rendering graphics, GPU for running operating systems", "CPU handles general-purpose tasks like running applications, while GPU accelerates specialized tasks like gaming, video rendering, and AI", "GPU replaces the CPU entirely in modern computers", "Both CPU and GPU are only useful in gaming"],
    a: 1,
    e: "CPU is for general-purpose computing, GPU is designed for parallel arithmetic tasks like AI and graphics."
  },
  {
    q: "Which of the following best matches memory type and purpose?",
    o: ["RAM -> Stores data/programs currently in use", "ROM -> Stores temporary data during execution", "Cache -> Stores bootloader/firmware", "All options are correctly matched"],
    a: 0,
    e: "RAM acts as volatile primary storage for running application tasks."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Computer Systems, Command Line, and Data Representations',
      semester: 1,
      order: moduleCount + 1,
      description: 'Foundational review of base-N numbering systems (binary, base-5, hexadecimal), hardware architectural roles (CPU vs. GPU, memory hierarchies), Git initialization workflows, and Unix command-line utilities.',
      isPublished: true,
      pdfUrls: [
        { label: 'Systems and Data Representation', url: 'https://example.com/pdfs/systems_and_representations.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'S&W Contest-1 MCQ',
      instructions: 'Answer all 15 questions covering Computer Systems, Git, and Data Representations.',
      timeLimitMinutes: 40,
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
