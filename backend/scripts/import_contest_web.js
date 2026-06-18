import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from '../models/Module.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const rawData = [
  {
    q: "Which of the following is the correct syntax to create an unordered list in HTML?",
    o: ["<ul>\\n  <li>Item1</li>\\n  <li>Item2</li>\\n</ul>", "<ol>\\n  <li>Item1</li>\\n  <li>Item2</li>\\n</ol>", "<list>\\n  <item>Item1</item>\\n</list>", "<ul>Item1, Item2</ul>"],
    a: 0,
    e: "Unordered lists use the <ul> container tag, and each list point must be wrapped inside list item <li> tags."
  },
  {
    q: "You edited a file index.html and ran `git add index.html`. What does this mean in Git?",
    o: ["The file is permanently saved in the repository.", "The file is marked to be included in the next commit.", "The file is uploaded to GitHub immediately.", "The file is deleted from the working directory."],
    a: 1,
    e: "Running `git add` moves your changes from the working directory to the Staging Area, marking them ready for the next commit."
  },
  {
    q: "Which statement correctly explains HTML tables?",
    o: ["A table is created using <table>, <row>, and <column>", "A table is created using <table>, <tr>, <th>, and <td>", "Tables in HTML can only contain numbers", "<table> can only be used inside <div>"],
    a: 1,
    e: "Standard HTML tables use structural components: <table>, <tr>, <th>, and <td>."
  },
  {
    q: "Which HTML tag is used to create an input form for user data collection?",
    o: ["<inputform>", "<form>", "<textbook>", "<formfield>"],
    a: 1,
    e: "The <form> element defines an interactive document segment tailored to collect user-provided input fields."
  },
  {
    q: "What is the key difference between <div> and <span>?",
    o: ["<div> is inline, <span> is block-level", "<div> is block-level, <span> is inline", "Both are block-level", "Both are inline"],
    a: 1,
    e: "A <div> is a structural block-level element. A <span> is an inline container element."
  },
  {
    q: "Which statement best describes the difference between a router and a switch?",
    o: ["A router connects multiple devices within the same network, while a switch connects different networks together.", "A switch directs data packets between different networks, while a router forwards data within a local network.", "A router forwards data packets between different networks, while a switch connects multiple devices within the same network.", "Both router and switch perform exactly the same function in networking."],
    a: 2,
    e: "A network Switch operates at Layer 2 (LAN). A Router operates at Layer 3 to forward packets across entirely separate networks."
  },
  {
    q: "What does packet switching mean in computer networks?",
    o: ["Sending the entire message as a single continuous signal.", "Breaking a message into small units called packets and sending them independently across the network.", "Using dedicated physical paths for each communication session.", "Switching the power supply of network devices on and off."],
    a: 1,
    e: "Packet-switching systems split large data strings into independent segments named packets, sending them independently."
  },
  {
    q: "You are developing a live video streaming application. To ensure smooth playback with minimal delay, which protocol would you choose and why?",
    o: ["TCP, because it guarantees reliable delivery of every packet, even if it increases delay.", "UDP, because it allows faster transmission with lower latency, even if some packets are lost.", "TCP, because it avoids congestion by dropping extra packets during heavy traffic.", "UDP, because it automatically reorders and retransmits lost packets to ensure reliability."],
    a: 1,
    e: "Live video streaming prioritizes real-time delivery speed over total precision. UDP drops slow error-checking to deliver lowest latency."
  },
  {
    q: "Which of the following correctly represents the sequence of steps in the TCP three-way handshake used to establish a connection?",
    o: ["ACK -> SYN -> SYN+ACK", "SYN -> SYN+ACK -> ACK", "SYN+ACK -> SYN -> ACK", "SYN -> ACK -> SYN+ACK"],
    a: 1,
    e: "1: Client sends SYN. 2: Server responds with SYN+ACK. 3: Client replies with ACK."
  },
  {
    q: "You want to visit www.example.com in your browser. Instead of remembering the server’s IP address, you rely on DNS. What role does DNS play in this process?",
    o: ["It secures the website connection using encryption.", "It translates the domain name into the correct IP address so your computer can connect to the server.", "It stores the website's data and delivers it directly to your browser.", "It stores the website's MAC address in your browser."],
    a: 1,
    e: "DNS maps human-readable hostname strings to machine-readable numeric IP addresses."
  },
  {
    q: "Given the URL `https://shop.com/products?category=shoes&color=red`, what does the part `?category=shoes&color=red` represent?",
    o: ["A fragment to jump to a section of the page.", "Query parameters that filter or customize the request to the server.", "A port number for server communication.", "The resource path that shows all products."],
    a: 1,
    e: "The portion of the URL following the ? character contains Query Parameters for dynamic configuration."
  },
  {
    q: "You are working on a branch called feature and want to bring its changes into the main branch. Your current branch is feature. Which command correctly merges the changes from feature into main?",
    o: ["git merge main feature", "git checkout feature\\ngit merge main", "git checkout main\\ngit merge feature", "git merge feature main"],
    a: 2,
    e: "First switch to the target branch (git checkout main), then pull changes in (git merge feature)."
  },
  {
    q: "Which of the following is a valid hex color code in CSS?",
    o: ["#12FG45", "#123456", "123456#", "#ZZZZZZ"],
    a: 1,
    e: "Hexadecimal colors must start with a # symbol followed by exactly 3 or 6 base-16 digits (0-9, A-F)."
  },
  {
    q: "A developer applies CSS properties to a div element: `width: 600px; height: 300px; background-image: url(\"pattern.png\"); background-repeat: repeat-y; background-position: right top;`. The image size is 50x50 pixels. How will the background image be displayed?",
    o: ["The image will repeat horizontally across the full width, starting from the left.", "The image will repeat vertically along the right edge of the div.", "The image will fill the entire div without repeating.", "The image will repeat diagonally across the div."],
    a: 1,
    e: "background-position: right top places it top-right. repeat-y repeats it along the vertical Y-axis."
  },
  {
    q: "In HTML, what is the difference between a tag and an element?",
    o: ["A tag is a keyword inside angular brackets, while an element consists of an opening tag, content, and an end tag", "A tag and element mean the same in HTML", "A tag always contains attributes, while an element never does", "An element exists only in the section"],
    a: 0,
    e: "Tags act as syntactic delimiters. An HTML Element encapsulates the entire structure (opening tag, content, closing tag)."
  },
  {
    q: "A developer creates a webpage featuring multiple overlapping style rules. The external stylesheet contains `p { color: orange; }`. An internal head block declares `p { color: green; }`. An inline attribute defines `<p style=\"color: red\">Hello World</p>`. What will be the final text color?",
    o: ["Orange", "Green", "Purple", "Red"],
    a: 3,
    e: "Inline styling attributes override both internal header rules and external CSS files."
  },
  {
    q: "Which of the following correctly describes the <head> and <body> sections in an HTML document?",
    o: ["<head> is for visible content; <body> is for metadata", "<head> is for metadata and resources; <body> is for visible content", "Both <head> and <body> are for visible content", "<head> is optional; <body> is mandatory"],
    a: 1,
    e: "The <head> block encloses background details/metadata. The <body> segment contains visible structural content."
  },
  {
    q: "Consider the CSS specificity rules provided: `#s1 p { color: yellow; }`, `section#s1 p { color: red; }`, and `section div p { color: green; }`. Which color is applied to the text wrapped within `<section id=\"s1\"><div><p>Test Text 1</p></div></section>`?",
    o: ["Blue", "Green", "Red", "It will inherit the default browser text color"],
    a: 2,
    e: "`section#s1 p` has 1 ID and 2 elements [1, 0, 2], outranking `#s1 p` [1, 0, 1] and `section div p` [0, 0, 3]."
  },
  {
    q: "Which HTML tag is primarily used to embed audio or video files?",
    o: ["<embed>", "<file>", "<media>", "<audio> or <video>"],
    a: 3,
    e: "HTML5 introduces dedicated multimedia element nodes: <audio> and <video>."
  },
  {
    q: "When creating a new Git repository locally, which command is used to initialize it?",
    o: ["git start", "git init", "git create", "git new"],
    a: 1,
    e: "git init builds a clean tracking catalog by setting up an invisible subfolder named .git."
  }
];

const seedNewData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    const moduleCount = await Module.countDocuments();

    const newModule = new Module({
      title: 'Web Foundations, Networking Basics, and Git Workflows',
      semester: 1,
      order: moduleCount + 1,
      description: 'Foundational study of HTML semantics, CSS cascades and selector specificity calculations, networking infrastructure mechanics (routing, packet switching, transport layer protocols), and local Git branch integration strategies.',
      isPublished: true,
      pdfUrls: [
        { label: 'Web and Networking Basics', url: 'https://example.com/pdfs/web_and_networking_basics.pdf' },
      ],
    });
    const savedModule = await newModule.save();
    console.log(`📚 Inserted new module: ${savedModule.title}`);

    const newQuiz = new Quiz({
      moduleId: savedModule._id,
      title: 'S&W Contest 2 Quiz',
      instructions: 'Answer all 20 questions covering HTML, CSS, Networking, and Git Basics.',
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
