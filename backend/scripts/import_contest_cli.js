import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "If you are currently in `/home/user/`, which command uses a relative path to access a file in the documents folder?",
    o: ["cat /home/user/documents/file.txt", "cat ~/documents/file.txt", "cat documents/file.txt", "cat /documents/file.txt"],
    a: 2,
    e: "A relative path targets a file starting from the active working directory. Since you are in `/home/user/`, you can step directly into the subfolder using `documents/file.txt`."
  },
  {
    q: "Which chmod command would you use to grant read, write, and execute permissions to the owner, and read and execute permissions to the group and others, for a file named example.txt?",
    o: ["chmod 755 example.txt", "chmod 644 example.txt", "chmod 700 example.txt", "chmod 777 example.txt"],
    a: 0,
    e: "Owner: Read(4)+Write(2)+Execute(1) = 7. Group: Read(4)+Execute(1) = 5. Others: Read(4)+Execute(1) = 5. Result: 755."
  },
  {
    q: "Which chmod command gives read and write permissions to the group?",
    o: ["chmod g+rw file.txt", "chmod g-w file.txt", "chmod g=r file.txt", "chmod g+x file.txt", "chmod g-wx file.txt"],
    a: 0,
    e: "Symbolic mode uses target modifiers (g for group) and operation flags (+ to append). To explicitly append read and write rules, use `g+rw`."
  },
  {
    q: "Can you tell the difference between the functionality of the given two commands?\n`echo \"Hello World\" > myFile.txt`\n`echo \"Hello World\" >> myFile.txt`",
    o: ["The first command appends, while the second command overwrites.", "The first command overwrites, while the second command appends.", "Both commands append, but the second command creates a backup.", "Both commands overwrite, but the second command confirms the action."],
    a: 1,
    e: "The `>` operator completely overwrites the destination file, while the `>>` operator appends data to the bottom."
  },
  {
    q: "Which of the following is an example of an absolute path?",
    o: ["../Documents/file.txt", "./file.txt", "/home/student/file.txt", "file.txt"],
    a: 2,
    e: "An absolute path explicitly maps from the root node, starting with a leading forward slash `/`."
  },
  {
    q: "What is a package manager used for?",
    o: ["Playing games", "Installing and managing software", "Creating documents", "Sending emails"],
    a: 1,
    e: "A package manager (like apt, npm, or brew) securely fetches, installs, updates, and manages software and dependencies."
  },
  {
    q: "What does “open source” mean?",
    o: ["Software you have to buy", "Software you cannot see inside", "Software with code that anyone can view and change", "Software only for professionals"],
    a: 2,
    e: "Open-source software distributes its source code publicly under permissive licenses for anyone to read, modify, and redistribute."
  },
  {
    q: "In the permissions string `-rw-r--r--`, who can write to the file?",
    o: ["Only the user", "User and group", "User and others", "Only others", "Everyone"],
    a: 0,
    e: "Index 1-3 (`rw-`): User has read and write. Index 4-6 (`r--`): Group is read-only. Index 7-9 (`r--`): Others are read-only."
  },
  {
    q: "What does the x permission allow a user to do on a file?",
    o: ["Edit the file", "Execute the file", "Export the file", "Exclude the file", "Explore the file"],
    a: 1,
    e: "The `x` bit flag marks a script or binary document as a runnable execution program."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Command Line Interface and File Permissions',
      semester: 1,
      order: moduleCount + 1,
      description: 'Master terminal navigation principles, directory traversal techniques using absolute vs. relative paths, standard output redirection mechanisms, software package management, and Linux permission string structures (symbolic and octal modes).',
      isPublished: true,
      pdfUrls: [
        { label: 'CLI and Permissions', url: 'https://example.com/pdfs/cli_and_permissions.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'Revision: In-Class Quiz - Command Line Interface',
      instructions: 'Answer all 9 questions covering the CLI and Permissions syllabus.',
      timeLimitMinutes: 20,
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
