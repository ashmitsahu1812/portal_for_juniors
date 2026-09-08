/**
 * seed_sem2_initial.js — Seed initial Semester 2 modules & starter setup
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Problem from '../models/Problem.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/junior_portal';

async function seedSem2() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if sem 2 modules already exist
    const existingSem2 = await Module.find({ semester: 2 });
    if (existingSem2.length > 0) {
      console.log(`Found ${existingSem2.length} existing Semester 2 modules:`);
      existingSem2.forEach((m) => console.log(`- [${m._id}] ${m.title}`));
    } else {
      console.log('Creating initial Semester 2 modules...');
      const sem2Modules = [
        {
          title: 'Data Structures & Algorithms',
          semester: 2,
          order: 1,
          description: 'Master core algorithmic problem solving: Arrays, Linked Lists, Stacks, Queues, Trees, Dynamic Programming, and Graph Traversals.',
          pdfUrls: [
            { label: 'DSA Lecture 1 – Linear Data Structures', url: 'https://example.com/pdfs/dsa_linear_ds.pdf' },
            { label: 'DSA Lecture 2 – Stacks, Queues & Recursion', url: 'https://example.com/pdfs/dsa_stacks_queues.pdf' },
          ],
          isPublished: true,
        },
        {
          title: 'Object-Oriented Programming (C++ / Java)',
          semester: 2,
          order: 2,
          description: 'Deep dive into OOP paradigms: Classes, Encapsulation, Polymorphism, Inheritance, Exception Handling, and Design Patterns.',
          pdfUrls: [
            { label: 'OOP Lecture 1 – Classes & Objects', url: 'https://example.com/pdfs/oop_classes.pdf' },
          ],
          isPublished: true,
        },
        {
          title: 'Database Management Systems (DBMS)',
          semester: 2,
          order: 3,
          description: 'Relational data modeling, SQL query optimization, ER Diagrams, Normalization, ACID transactions, and Indexing architectures.',
          pdfUrls: [
            { label: 'DBMS Lecture 1 – Relational Schema & SQL', url: 'https://example.com/pdfs/dbms_sql.pdf' },
          ],
          isPublished: true,
        },
        {
          title: 'Full Stack Web Development - Modern Frameworks',
          semester: 2,
          order: 4,
          description: 'Modern asynchronous JavaScript, REST APIs, frontend components, state management, and full-stack web architectures.',
          pdfUrls: [
            { label: 'Web Dev Lecture 1 – Async JavaScript & APIs', url: 'https://example.com/pdfs/web_apis.pdf' },
          ],
          isPublished: true,
        },
      ];

      const created = await Module.insertMany(sem2Modules);
      console.log(`Successfully created ${created.length} Semester 2 modules.`);
    }

    console.log('Semester 2 seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding Semester 2:', err);
    process.exit(1);
  }
}

seedSem2();
