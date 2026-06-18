import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "What is an event handler?",
    o: ["handler", "function", "event", "object"],
    a: 1,
    e: "An event handler is fundamentally a JavaScript function that is registered to run automatically whenever a specified action or event is detected."
  },
  {
    q: "Which method is used to attach an event handler to an element in JavaScript without overwriting existing event handlers?",
    o: ["element.onclick = function() {}", "element.addEventHandler('click', function(){})", "element.addEventListener('click', function(){})", "element.attachEvent('onclick', function(){})"],
    a: 2,
    e: "The modern, standard method to track events is `addEventListener`. It can attach multiple unique fallback callbacks safely."
  },
  {
    q: "What does DOM stand for?",
    o: ["Document Object Model", "Data Object Model", "Design Object Model", "Dynamic Object Model"],
    a: 0,
    e: "DOM stands for Document Object Model. It parses an HTML or XML document structurally as a tree of objects."
  },
  {
    q: "Which is the correct syntax to use addEventListener to call a function sayHello?",
    o: ["button.addEventListener(\"click\", sayHello)", "button.addEventListener(\"sayHello\", click)", "sayHello.addEventListener(\"click\", button)", "button.onClick(sayHello)"],
    a: 0,
    e: "Syntax: element.addEventListener(eventTypeString, callbackFunctionReference). Pass function reference `sayHello` without parentheses."
  },
  {
    q: "What does the addEventListener(\"click\", callback) method do?",
    o: ["Registers a function to run when the element is clicked", "Removes a previously registered event", "Triggers an event immediately", "Checks if an element is clickable"],
    a: 0,
    e: "It listens for a specific browser event condition (click), then fires the callback function asynchronously."
  },
  {
    q: "What does the following code do?\n```html\n<div id=\"container\"></div>\n<script>\n  const newPara = document.createElement(\"p\");\n  newPara.innerText = \"New Paragraph\";\n  document.getElementById(\"container\").appendChild(newPara);\n</script>\n```",
    o: ["Replaces the container with a paragraph", "Adds a paragraph inside the container", "Throws an error", "Updates an existing paragraph"],
    a: 1,
    e: "It dynamically sets up a paragraph node, assigns string data, and injects it as a child inside the container."
  },
  {
    q: "What will be displayed after clicking the button?\n```html\n<p id=\"msg\">Hello</p>\n<button onclick=\"updateText()\">Click</button>\n<script>\n  function updateText() {\n    let p = document.getElementById(\"msg\");\n    p.innerHTML = \"<strong>Updated</strong>\";\n  }\n</script>\n```",
    o: ["Updated (bold text)", "Hello", "Updated", "Nothing"],
    a: 0,
    e: "Because it uses `.innerHTML` rather than `.innerText`, the markup text tags `<strong>` are parsed cleanly, outputting a bolded word."
  },
  {
    q: "How can you remove a previously added event listener from an element?",
    o: ["element.remove(\"click\")", "element.removeEventListener(\"click\", callback)", "element.clearEvent(\"click\", callback)", "element.stopListening(\"click\")"],
    a: 1,
    e: "Invoke the `.removeEventListener()` native method block passing the string event type and the exact reference name of the registered callback function."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Document Object Model and Event Handling',
      semester: 1,
      order: moduleCount + 1,
      description: 'Study of the Document Object Model (DOM) interface, covering dynamic element creation, node tree insertion pipelines, and explicit event listener registration/removal mechanisms.',
      isPublished: true,
      pdfUrls: [
        { label: 'DOM and Event Handling', url: 'https://example.com/pdfs/dom_and_event_handling.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'S&W In Class Quiz',
      instructions: 'Answer all 8 questions covering DOM interactions and event handling.',
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
