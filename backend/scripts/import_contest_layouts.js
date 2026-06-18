import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "What do the CSS properties grid-template-columns and grid-template-rows define in a CSS Grid layout?",
    o: ["The spacing between grid items inside each cell", "The number of grid items allowed inside div", "The structure and size of the columns and rows in the grid", "The alignment of content inside each grid cell"],
    a: 2,
    e: "The properties grid-template-columns and grid-template-rows explicitly define the track architecture of a grid container."
  },
  {
    q: "(Context: JavaScript Execution Analysis) Imagine Snippet A utilizes a function declaration (`function calc() {}`) and calls it before its definition line. Snippet B sets up a function expression (`const calc = function() {}`) and calls it before initialization. What will be the output of these snippets?",
    o: ["Both Snippet A and Snippet B print 7", "Snippet A prints 7, but Snippet B throws a TypeError", "Both Snippet A and Snippet B throw a TypeError", "Snippet A throws a TypeError, but Snippet B prints 7"],
    a: 1,
    e: "Standard JavaScript function declarations are hoisted. Function expressions assigned to variables with const/let are not initialized before execution."
  },
  {
    q: "Which CSS code correctly creates a 3x3 grid layout?",
    o: ["display: grid;\\ngrid-template-columns: repeat(3, 1fr);\\ngrid-template-rows: repeat(3, 1fr);", "display: grid;\\ngrid-columns: repeat(3, 1fr);", "display: grid;\\ngrid-columns: 3;\\ngrid-rows: 3;", "display: grid;\\ngrid-template-columns: 3 1fr\\ngrid-template-rows: 3 1fr;"],
    a: 0,
    e: "To configure a 3x3 grid, invoke `display: grid;`, then use `repeat(3, 1fr)` for both grid-template-columns and grid-template-rows."
  },
  {
    q: "What is responsive layout in web development?",
    o: ["Designing websites that respond only to user inputs like clicks and keypresses", "Creating websites that adjust layout & content automatically based on screen size", "Making websites load faster by reducing image sizes & adding optimization code.", "Using animations to make websites more interactive so that the page responds to user clicks."],
    a: 1,
    e: "Responsive layouts fluidly adapt sizing grids and hide/show content across varying user device displays."
  },
  {
    q: "What is the primary purpose of CSS Grid in web development?",
    o: ["To create animations and transitions for UI elements", "To build flexible, two-dimensional layout structures on a webpage", "To apply color and typography styles to HTML elements", "To improve website performance by reducing load time"],
    a: 1,
    e: "CSS Grid is a powerful two-dimensional layout subsystem handling both layout axes—columns and rows simultaneously."
  },
  {
    q: "Which CSS property combination is commonly used to make an image responsive?",
    o: ["img { position: absolute; top: 0; }", "img { width: auto; height: auto; }", "img { width: 100%; height: auto; }", "img { display: none; }"],
    a: 2,
    e: "width: 100%; forces the image to dynamically conform to max width. height: auto; scales proportionally."
  },
  {
    q: "In CSS Grid, what do the grid-column and grid-row properties define?",
    o: ["There are no such properties as grid-column and grid-row.", "The position and span of grid items across columns and rows", "The number of columns and rows in the grid", "The gap between grid cells between columns and rows"],
    a: 1,
    e: "grid-column and grid-row determine explicit grid-line coordinates where a child item starts, stops, or spans."
  },
  {
    q: "What is the primary purpose of JavaScript in web development?",
    o: ["To style web pages, create animations and control layout", "To structure content using semantic elements", "To add interactivity and dynamic behavior to web pages", "JavaScript is not used in Web development."],
    a: 2,
    e: "JavaScript is the client-side programming runtime enabling dynamic behavior, DOM updates, and interactivity."
  },
  {
    q: "What is the purpose of using the flex-wrap property in a flex container?",
    o: ["It makes flex items stay in one single line always.", "It allows flex items to move onto multiple lines when needed.", "It centers all flex items both horizontally and vertically.", "It changes the direction of flex items to column layout."],
    a: 1,
    e: "flex-wrap: wrap; permits child elements to roll down to secondary rows when overrunning the container's width limits."
  },
  {
    q: "(Context: HTML Flexbox Layout Tracking) Imagine an HTML structure has a wrapper box `display: flex; flex-direction: row; justify-content: space-between;` containing three standard children elements. What will be the output layout layout?",
    o: ["The items stack on top of each other vertically.", "The items line up horizontally, with the first item at the left margin, the last item at the right margin, and equal spacing in between.", "The items cluster tightly together in the exact horizontal center.", "The items are spaced equally with matching margins on both outer borders."],
    a: 1,
    e: "justify-content: space-between; aligns the first element flush left and final element flush right, distributing blank space between."
  },
  {
    q: "What does a CSS transition allow you to do?",
    o: ["Animate elements continuously without any user interaction", "Change property values smoothly over a specified duration", "Rearrange grid and flex items automatically", "Load external stylesheets dynamically"],
    a: 1,
    e: "CSS transitions define timing interpolations that change property values smoothly over a given duration."
  },
  {
    q: "Which JavaScript code correctly updates the second element from the start of an array?",
    o: ["let arr = [10, 20, 30]; arr[2] = 50;", "let arr = [10, 20, 30]; arr(1) = 50;", "let arr = [10, 20, 30]; arr[1] = 50;", "let arr = [10, 20, 30]; update(arr[1], 50);"],
    a: 2,
    e: "Arrays are zero-indexed. The second item maps to index location 1: arr[1] = 50."
  },
  {
    q: "What is the value of this expression in JavaScript: `console.log(12 - 4 * 2 + 3)`",
    o: ["7", "15", "19", "3"],
    a: 0,
    e: "12 - 8 + 3 = 4 + 3 = 7."
  },
  {
    q: "Which CSS code correctly applies a smooth hover effect using a transition?",
    o: [".box:hover { transition: all 0.3s; transform: scale(1.2); }", ".box { transition: all 0.3s; }\\n.box:hover { transform: scale(1.2); }", ".box { animation: hover 0.3s infinite; }", ".box:hover { transform: scale(1.2); display: block; }"],
    a: 1,
    e: "Transition properties must be attached to the primary element base class selector state (.box) to cycle cleanly on entry and exit."
  },
  {
    q: "What is the main difference between CSS transitions and CSS animations?",
    o: ["Transitions loop automatically, while animations need user input", "Transitions occur only when a state changes, while animations can run continuously", "Animations can be used on any property and can run continuously, transitions are for transform only", "Animations and transitions can be only be used on transform property"],
    a: 1,
    e: "Transitions require a state change trigger. CSS Animations run automatically, loop, and feature multi-step execution."
  },
  {
    q: "What is the key difference between the mobile-first and desktop-first approaches in responsive design?",
    o: ["Mobile-first uses min-width breakpoints, while desktop-first uses max-width breakpoints", "Mobile-first layouts cannot be used with CSS Grid, while desktop-first layouts can", "Desktop-first designs always load faster than mobile-first", "Mobile-first requires JavaScript, while desktop-first does not"],
    a: 0,
    e: "Mobile-first uses @media (min-width: Xpx). Desktop-first initializes with wide layouts and downsizes using @media (max-width: Ypx)."
  },
  {
    q: "Which option is the correct syntax for a JavaScript function with parameters?",
    o: ["function greet(int a, int b) { return a+b; }", "function greet(number a, number b) { return a+b; }", "function greet(a, b) { return a+b; }\\ngreet(10, 25);", "function greet(a; b) { return a+b; }"],
    a: 2,
    e: "In JS you omit explicit datatype labels. Parameters are comma-separated variables enclosed in standard parenthesis."
  },
  {
    q: "How can you apply multiple CSS transitions to different properties of the same element?",
    o: ["transition: width 1s ease, background-color 0.5s ease-in;", "transition: width 1s ease; background-color 0.5s ease-in;", "transition: width & background-color 0.5s ease-in;", "transition: width 2s;\\ntransition: background-color 0.5s ease-in;"],
    a: 0,
    e: "Combine property rules within a single shorthand property declaration statement using a comma-separated structure."
  },
  {
    q: "Which of the following is the correct CSS media query syntax?",
    o: ["@media (max-width: 600px) { /* rules */ }", "@media screen and min-width: 600px { /* rules */ }", "@media orientation: landscape { /* rules */ }", "media only screen and (max-width: 600px) { /* rules */ }"],
    a: 0,
    e: "A media query requires @media followed by screen feature conditional arguments wrapped within standard parenthesis bounds."
  },
  {
    q: "Which of the following best describes the difference between primitive and non-primitive data types in JavaScript?",
    o: ["Primitive and non-primitive both store only fixed single values", "Primitive stores multiple values together, non-primitive stores only one value", "Primitive and non-primitive both store multiple dynamic values", "Primitive stores a single fixed value, non-primitive can store multiple dynamic values"],
    a: 3,
    e: "Primitive types represent unchangeable, simple single values. Non-primitive types act as reference containers for collections of key-value properties or data items."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Advanced Layouts, Responsive Design, and JavaScript Foundations',
      semester: 1,
      order: moduleCount + 1,
      description: 'Deep dive into modern layout engines (CSS Grid, Flexbox wrappers), fluid assets, responsive media queries, state transition parameters, and fundamental JavaScript mechanics.',
      isPublished: true,
      pdfUrls: [
        { label: 'Advanced Layouts and JS Basics', url: 'https://example.com/pdfs/advanced_layouts_and_js_basics.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'S&W Contest 4 - Quiz',
      instructions: 'Answer all 20 questions covering layouts, responsive design, and JavaScript.',
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
