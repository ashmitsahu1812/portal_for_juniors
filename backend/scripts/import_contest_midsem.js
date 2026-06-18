import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "In HTML, which statement is correct?",
    o: ["<p> is an element, <p>content</p> is a tag", "<p> is a tag, <p>content</p> is an element", "Both <p> and <p>content</p> are elements", "Both <p> and <p>content</p> are tags"],
    a: 1,
    e: "A tag represents the programmatic delimiter enclosed in angle brackets used to declare a block boundary (e.g., `<p>`). An element encapsulates the entire markup structure."
  },
  {
    q: "You are entering your login details on a website. One site uses `http://example.com/login` and another shows `https://example.com/login`. What is the key difference relevant to your security?",
    o: ["There is no thing such as HTTP, only HTTPS URLs are valid.", "HTTPS encrypts data between your browser and the server; HTTP sends it in plain text.", "HTTP and HTTPS are identical; only the port number changes.", "HTTPS sends it in plain text, and HTTP encrypts data between your browser and the server."],
    a: 1,
    e: "HTTPS tunnels standard HTTP data requests through an encrypted transport security layer (SSL/TLS), preventing malicious network interceptors from reading data in plaintext."
  },
  {
    q: "Which of the following correctly explains the difference between inline, block, and inline-block elements in CSS?",
    o: ["There is no difference between inline, block, and inline-block.", "Block and inline-block can have independent width & height property, while inline can't.", "Block can have independent width & height property, while inline & inline-block can't", "Block element covers complete width of the screen, inline element only covers the space occupied by the content. There is nothing such as inline-block."],
    a: 1,
    e: "Block elements stretch to span container width. Inline elements ignore width and height properties. Inline-block elements follow text flow horizontally but allow custom width/height modifications."
  },
  {
    q: "What does the Git command `git add .` do?",
    o: ["Commits all changes to the repository.", "Pushes all commits to GitHub.", "Stages all new, modified, and deleted files in the current directory and its subdirectories.", "Stages only the file currently open in your editor."],
    a: 2,
    e: "The command `git add .` processes your active workspace directory recursively downwards, indexing every modification into the staging area."
  },
  {
    q: "What is the decimal equivalent of the binary number 1010?",
    o: ["8", "10", "12", "14"],
    a: 1,
    e: "Convert to base 10: 1*2^3 + 0*2^2 + 1*2^1 + 0*2^0 = 8 + 0 + 2 + 0 = 10."
  },
  {
    q: "You want to add a line to the end of an existing file without erasing its current contents. Which shell redirection operator should you use?",
    o: [">", ">>", "Both do the same thing", "Neither; use a text editor"],
    a: 1,
    e: "The double right angle bracket operator `>>` appends text lines cleanly to the bottom without wiping out pre-existing rows."
  },
  {
    q: "Which of the following is a primary function of an Operating System (OS)?",
    o: ["Designing application icons", "Managing hardware resources like CPU and memory", "Editing documents and spreadsheets", "Hosting websites on the internet"],
    a: 1,
    e: "The operating system acts as the core hardware resources coordinator, programmatically orchestrating CPU thread distribution and memory."
  },
  {
    q: "What does the command `git init` do in Git?",
    o: ["Initializes a new GitHub repository online.", "Creates a new empty Git repository in the current directory.", "Downloads an existing Git project from GitHub.", "Stages all files in the current directory for commit."],
    a: 1,
    e: "The command `git init` converts a local project folder into a tracking Git sandbox repository, generating a hidden `.git` internal subfolder."
  },
  {
    q: "Which command is commonly used in a Command Line Interface (CLI) to create a new empty file named `filename.txt`?",
    o: ["mkdir filename.txt", "touch filename.txt", "rm filename.txt", "cat filename.txt"],
    a: 1,
    e: "The `touch` command generates an empty document file under that name if it doesn't already exist. `mkdir` creates directories."
  },
  {
    q: "Which of the following is the correct order of increasing size?",
    o: ["Byte < Bit < MiB < KiB", "Bit < Byte < KiB < MiB", "KiB < Bit < Byte < MiB", "Bit < KiB < Byte < MiB"],
    a: 1,
    e: "1 Bit < 1 Byte (8 bits) < 1 KiB (1024 Bytes) < 1 MiB (1024 KiB)."
  },
  {
    q: "Which CSS rule will apply if there are conflicts?\np { color: blue; }\n#text { color: red; }\n<p id=\"text\">Hello</p>",
    o: ["Blue", "Red", "Both", "None"],
    a: 1,
    e: "The ID selector rule `#text` claims a dominant priority value of [1, 0, 0] over the element selector rule `p` [0, 0, 1]."
  },
  {
    q: "In computer networking, what does a port number represent?",
    o: ["The physical address of a computer", "An entry point to a specific process or service on a device", "A method for converting domain names into IP addresses", "The maximum size of a data packet"],
    a: 1,
    e: "A Port Number maps traffic to a specific software service execution process loop operating inside that target machine host."
  },
  {
    q: "Which statement best describes the role of different form elements in HTML?",
    o: ["<input> is only used for text, <textarea> is used for numbers, and <select> is used for buttons.", "<input> can represent multiple types of fields, <textarea> is used for multi-line text input, and <select> provides a dropdown list of options.", "<input> automatically validates all inputs without attributes, and <textarea> is only for passwords.", "<input> and <select> are both used for file uploads, while <textarea> is used for checkboxes only."],
    a: 1,
    e: "The <input> element modifies its function depending on its `type` attribute. <textarea> manages block paragraphs of multi-line user text input, and <select> compiles dropdown menus."
  },
  {
    q: "Which CSS positioning value is applied to elements by default if no position is specified?",
    o: ["relative", "absolute", "fixed", "static"],
    a: 3,
    e: "HTML layout configurations initialize tracking with `static` positioning attributes by default."
  },
  {
    q: "Which type of memory is volatile and loses its data when the power is turned off?",
    o: ["ROM (Read Only Memory)", "RAM (Random Access Memory)", "Solid State Drive", "Hard disk"],
    a: 1,
    e: "Random Access Memory (RAM) acts as volatile high-speed primary runtime storage and requires active power to maintain cell states."
  },
  {
    q: "You want to give a file read, write, and execute permissions for the owner, and read + execute permissions for group and others. Which octal code would you use with the chmod command?",
    o: ["644", "744", "755", "777"],
    a: 2,
    e: "Owner: 4+2+1=7. Group: 4+1=5. Others: 4+1=5. Octal execution code 755."
  },
  {
    q: "Given the URL: `https://store.example.co.uk/products/view.html?item=42#specs`, which of the following is the path?",
    o: ["https://", "store.example.co.uk", "/products/view.html", "?item=42#specs"],
    a: 2,
    e: "`/products/view.html` forms the resource path locating the target document on that server."
  },
  {
    q: "Convert the hexadecimal number 2AF into binary.",
    o: ["001010101111", "001010111111", "001010101110", "011010101111"],
    a: 0,
    e: "2 -> 0010. A (10) -> 1010. F (15) -> 1111. Combining these groups outputs: 001010101111."
  },
  {
    q: "You are currently inside `/home/devops/projects/`. You want to move the entire `backup/` folder directly into an existing subfolder named `data/` to produce path `data/backup/`, cleaning up the original redundant source directory completely in a single command. Which command works?",
    o: ["cp -a backup/. data/", "cp -rf backup data/", "cp backup data/", "mv backup data/"],
    a: 3,
    e: "The `mv` command transfers directory structures and contents to a new destination, cleaning up the source location immediately."
  },
  {
    q: "Consider the provided nested HTML list template code. Which statement is TRUE about the display format of \"Blueberry\"?",
    o: ["It will be numbered as ii — lowercase Roman numeral.", "It will be displayed with a circle bullet.", "It will inherit the outer list style (I, II…).", "It will be displayed as 2."],
    a: 0,
    e: "The item belongs to an ordered list component configured with `type=\"i\"` (lowercase Roman). Blueberry maps to index position two (ii)."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Foundations of Systems and Web Architecture',
      semester: 1,
      order: moduleCount + 1,
      description: 'Mid-semester review consolidating HTML semantics, basic CSS specificities and default positioning states, security protocol variables, data unit indexing, base conversion logic, and directory file movement commands.',
      isPublished: true,
      pdfUrls: [
        { label: 'S&W Mid Semester Review', url: 'https://example.com/pdfs/sw_mid_semester_review.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'S&W Mid Semester Quiz',
      instructions: 'Answer all 20 questions covering Systems and Web Architecture.',
      timeLimitMinutes: 45,
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
