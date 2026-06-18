import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "In a flex container with flex-direction: row, which statement is true?",
    o: ["Main axis runs vertically; cross axis horizontally", "Main axis runs horizontally; cross axis vertically", "Both axes are vertical", "Both axes are horizontal"],
    a: 1,
    e: "In CSS Flexbox, flex-direction: row sets the Main Axis to stretch horizontally from left to right, while its perpendicular Cross Axis runs vertically."
  },
  {
    q: "Which is the correct syntax to initialize an array of first five natural numbers in JavaScript?",
    o: ["let numbers = (1, 2, 3, 4, 5);", "let numbers = [1, 2, 3, 4, 5];", "let numbers = {1, 2, 3, 4, 5};", "let numbers = <1, 2, 3, 4, 5>;"],
    a: 1,
    e: "Array references in JavaScript are initialized via literal bracket notations enclosing comma-separated list tokens: `[1, 2, 3, 4, 5]`."
  },
  {
    q: "Which statement correctly differentiates IPv4 from IPv6?",
    o: ["IPv4 uses 32-bit addresses, IPv6 uses 128-bit addresses.", "IPv4 and IPv6 are both 64-bit.", "IPv6 is slower than IPv4.", "IPv4 supports more unique addresses than IPv6."],
    a: 0,
    e: "IPv4 uses a 32-bit width format. IPv6 upgrades address width parameters to a massive 128-bit structure."
  },
  {
    q: "What is an HTML tag?",
    o: ["A predefined keyword used to style a webpage", "A code element that defines how content should appear on a webpage", "A comment line that describes how content looks like on webpage using HTML", "A script to perform logical operations in HTML"],
    a: 1,
    e: "An HTML tag is a structural layout token keyword enclosed inside angle brackets (`<tagname>`) that signals to rendering engines how content must be displayed."
  },
  {
    q: "In CSS, what is a selector?",
    o: ["A CSS property used to define styling of html elements", "A part of CSS that specifies which HTML element to style", "A special keyword used inside JavaScript", "A CSS library that allows users to get styling for elements from the web."],
    a: 1,
    e: "A CSS Selector instructs rendering engines to search the DOM for specific node elements and apply paired block style declarations to them."
  },
  {
    q: "Why is branching used in Git?",
    o: ["To delete code permanently without affecting main branch", "To work on different features without affecting the main code", "To merge unrelated repositories for seamless flow", "To change Git configurations so that main branch is locked"],
    a: 1,
    e: "Branching allows developers to split from the main deployment branch into isolated tracking timelines for feature work or testing."
  },
  {
    q: "How do you select an HTML element with id=\"alpha\" in CSS?",
    o: ["alpha {}", ".alpha {}", "#alpha {}", "id.alpha {}"],
    a: 2,
    e: "CSS targets elements by unique ID attributes using the hash character identifier prefix (`#alpha`)."
  },
  {
    q: "Which statement correctly differentiates a CLI from a GUI?",
    o: ["CLI uses text commands, while GUI uses graphical icons and menus.", "A CLI changes system settings, while a GUI cannot change settings", "A CLI needs high graphics power, while a GUI needs no graphics power", "GUI cannot interact with files."],
    a: 0,
    e: "Command Line Interfaces (CLI) parse plain text command strings. Graphical User Interfaces (GUI) interact visually with users via graphical icons."
  },
  {
    q: "Which of the following selectors has the highest specificity?",
    o: ["p.c1", ".text .c1", "#main", "div.c1 p.c2"],
    a: 2,
    e: "An ID selector (`#main`) immediately claims absolute precedence because any value in the primary vector column automatically beats lower-level weights."
  },
  {
    q: "Which statement correctly distinguishes between RAM and ROM?",
    o: ["RAM is temporary storage, while ROM is permanent storage.", "RAM is permanent storage, while ROM is temporary storage.", "Both RAM and ROM are forms of permanent storage memory.", "Both RAM and ROM are forms of temporary storage memory."],
    a: 0,
    e: "Random Access Memory (RAM) acts as fast, volatile temporary storage. Read-Only Memory (ROM) is non-volatile permanent storage."
  },
  {
    q: "Which of the following HTML elements is an inline element?",
    o: ["<div>", "<section>", "<span>", "<p>"],
    a: 2,
    e: "The `<span>` element is a generic inline markup block that does not induce structural vertical line breaks."
  },
  {
    q: "In the URL \"https://www.example.com:8080/home\", what does 8080 represent?",
    o: ["Domain number", "Protocol number", "Port number", "Path number"],
    a: 2,
    e: "The explicit number token declared directly behind a semicolon separator on the hostname block specifies a dedicated network Port Number."
  },
  {
    q: "Riya is writing code on her laptop and wants to save different versions of her project even when she has no internet connection. Which tool will help her do this?",
    o: ["Git working on her local computer", "GitHub working on her local computer", "GitHub & Git cannot work without internet", "It's impossible as there is no version control system that works without internet."],
    a: 0,
    e: "Git functions as a local, decentralized version control architecture system that runs entirely on offline environments."
  },
  {
    q: "Which HTML tag displays the largest text size by default?",
    o: ["p tag", "h6 tag", "h1 tag", "span tag"],
    a: 2,
    e: "The `<h1>` tag defines the most critical document structural header tier, automatically inheriting the largest default bold font scaling parameters."
  },
  {
    q: "Option correctly matches the unit with its size?",
    o: ["A byte is eight bits in total", "A bit is eight bytes in size", "A nibble is eight bytes in size", "A byte is two bits in total"],
    a: 0,
    e: "Combining exactly eight bits together sets up 1 Byte."
  },
  {
    q: "What is the decimal value of binary number 1010?",
    o: ["8", "10", "12", "14"],
    a: 1,
    e: "1 * 2^3 + 0 * 2^2 + 1 * 2^1 + 0 * 2^0 = 8 + 0 + 2 + 0 = 10."
  },
  {
    q: "You want to add a new line \"Hello\" to an existing file notes.txt without overwriting it. Which command will you use?",
    o: ["echo \"Hello\" > notes.txt", "echo \"Hello\" >> notes.txt", "add \"Hello\" > notes.txt", "write \"Hello\" >> notes.txt"],
    a: 1,
    e: "The double right angle bracket stream redirection operator `>>` appends text lines cleanly to the bottom."
  },
  {
    q: "Which statement best describes the difference between a server and a supercomputer?",
    o: ["A server manages shared resources for multiple users, while a supercomputer performs extremely large-scale calculations.", "A server stores personal files locally, while a supercomputer controls only communication networks.", "A server is designed for entertainment tasks, while a supercomputer processes only audio-visual data.", "A server operates without networking, while a supercomputer operates without high-speed processors."],
    a: 0,
    e: "Servers manage shared resources and client-request services. Supercomputers crunch heavy mathematical models using ultra-parallel grids."
  },
  {
    q: "A student uses a laptop to run a video player, a web browser, and a text editor simultaneously smoothly without freezing. Which operating system function is primarily responsible?",
    o: ["Changing the appearance and font styles of running applications", "Managing CPU time and memory allocation among multiple processes", "Displaying application icons on the desktop", "Transferring downloaded files over the internet"],
    a: 1,
    e: "The kernel contextually rotates processing runtime windows on the CPU via scheduling threads and memory allocations."
  },
  {
    q: "When should you use an ordered list in HTML?",
    o: ["When the list items don’t have any specific order", "When numbering or ranking of items matters", "When you want bullet points", "When the word count of list items are in ascending order"],
    a: 1,
    e: "Use ordered lists (`<ol>`) when chronological sequence, ranking thresholds, or algorithmic instructional instructions matter."
  },
  {
    q: "Which of the following HTML5 code snippets correctly embeds an audio file in a webpage and provides playback controls (play, pause, volume) to the user?",
    o: ["<audio control src=\"song.mp3\"></audio>", "<audio controls src=\"song.mp3\"></audio>", "<sound src=\"song.mp3\"></sound>", "<music controls=\"true\"></music>"],
    a: 1,
    e: "To enable interface interaction triggers, you must include the explicit boolean attribute keyword `controls` inside the `<audio>` tag."
  },
  {
    q: "In JavaScript, what is an event?",
    o: ["A data type used to store strings", "A function can be detected by JavaScript and runs automatically when a page loads", "An action or occurrence that can be detected by JavaScript", "A loop that repeats multiple times when the page loads"],
    a: 2,
    e: "An event reflects a signal fired by browser windows or interactions that can be captured to trigger handling functions."
  },
  {
    q: "In Linux, what does the permission 755 mean?",
    o: ["Owner: read/write/execute; Group: read/execute; Others: read/execute", "Everyone has full access", "Owner: read/write; Group: read only; Others: no access", "Only the owner can execute"],
    a: 0,
    e: "Owner (7): 4 + 2 + 1 = read/write/execute. Group (5): 4 + 0 + 1 = read/execute. Others (5): 4 + 0 + 1 = read/execute."
  },
  {
    q: "You want to copy a folder named project (which contains many nested subfolders and files) into a new folder called backup. Which command correctly copies the entire structure?",
    o: ["cp -r project backup/", "cp project/* backup/", "cp -f project backup/", "cp -p project backup/"],
    a: 0,
    e: "Copying active folder directories requires a recursive flag invocation (`-r` or `-R`)."
  },
  {
    q: "Which of the following numbers is the largest when converted to decimal?",
    o: ["102 in base 3", "31 in base 8", "11011 in base 2", "14 in base 27"],
    a: 3,
    e: "14 in base 27 equals 1 * 27^1 + 4 * 27^0 = 27 + 4 = 31, which is the largest value among the options."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Systems and Web Comprehensive End Semester Exam',
      semester: 1,
      order: moduleCount + 1,
      description: 'Ultimate cross-disciplinary evaluation of first-semester concepts. Synthesizes CSS Flexbox axis structures, address spacing standards, git branching models, selector weight calculations, multi-process operating system orchestration, and maximum base valuation properties.',
      isPublished: true,
      pdfUrls: [
        { label: 'S&W End Semester Exam', url: 'https://example.com/pdfs/sw_end_semester_exam.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'S&W End Sem - Quiz',
      instructions: 'Answer all 25 questions comprehensively covering both Systems and Web architectures.',
      timeLimitMinutes: 60,
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
