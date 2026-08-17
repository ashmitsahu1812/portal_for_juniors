# 🚀 Kick Start — Portal for Juniors

> An interactive, gamified Learning Management System (LMS) and Online Coding Judge built for junior developers and students to learn programming, compete in real-time coding duels, solve algorithmic challenges, and collaborate.

🌐 **Live Web Application**: [https://frontend-xi-nine-84.vercel.app](https://frontend-xi-nine-84.vercel.app)  
⚡ **Live Backend API**: [https://portal-for-juniors.onrender.com](https://portal-for-juniors.onrender.com)

---

## 🌟 Features Overview

- 💻 **Online Coding Judge & Monaco Code Editor**
  - Integrated VS Code-like Monaco Editor with syntax highlighting, custom theme support, and code autocompletion.
  - Multi-language support (Python & JavaScript) connected to a live code execution engine (Piston API / Judge0).
  - Test case execution, custom inputs, runtime diagnostics, time limit checks, and detailed execution status output (Accepted, Wrong Answer, Time Limit Exceeded, Syntax Error).

- ⚔️ **Real-Time 1v1 Battle Arena**
  - Instant matchmaking & custom room creation powered by Socket.io WebSockets.
  - Real-time opponent progress tracking, live code sync, and victory state detection.

- 🗺️ **Learning Pathways & Structured Curriculum**
  - Interactive learning paths tailored for beginners and intermediate developers.
  - Step-by-step module breakdown, rich lecture notes (Markdown rendered), and end-of-module assessment quizzes.

- 🎮 **Gamification & Leaderboards**
  - Global Leaderboard tracking XP, problem completion rates, continuous streaks, and rank badges.
  - Mind Games Hub with logic puzzles and mini-games to boost critical thinking.
  - User profile progression with levels, streaks, and performance analytics.

- 👥 **Community & Virtual Study Rooms**
  - Discussion forums for asking questions, sharing insights, and discussing code snippets.
  - Interactive Study Rooms with integrated video/audio conferencing (Mirotalk) and study timers.

- 🔐 **Secure Authentication & Management**
  - JWT token-based authentication with bcrypt password hashing.
  - Google OAuth 2.0 Single Sign-On (SSO) integration.
  - Express rate-limiting on sensitive endpoints (e.g. max 10 code compilations/min).

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI components & state management |
| **Vite** | Fast frontend build tool and development server |
| **Tailwind CSS v4** | Utility-first styling system |
| **Monaco Editor** | Professional code editing experience (`@monaco-editor/react`) |
| **Socket.io Client** | Real-time WebSocket connection for duels & study rooms |
| **React Router v7** | Client-side Single Page Application (SPA) routing |
| **Lucide React** | Modern vector icons |

### **Backend**
| Technology | Description |
| :--- | :--- |
| **Node.js & Express** | High-performance HTTP & REST API server |
| **MongoDB & Mongoose** | Data persistence for users, problems, quizzes, pathways, and progress |
| **Socket.io** | WebSocket engine managing Battle Arenas & Study Rooms |
| **Piston / Judge0 API** | Isolated code execution engine for code evaluation |
| **Google Auth Library** | Secure Google OAuth verification |
| **Helmet & Express Rate Limit** | Production security & payload abuse prevention |

---

## 📁 Project Structure

```
portal_for_juniors/
├── backend/
│   ├── config/              # DB & server configurations
│   ├── middleware/          # JWT auth, security, & validation middleware
│   ├── models/              # Mongoose schemas (User, Problem, Quiz, Module, Pathway, etc.)
│   ├── routes/              # Express API endpoints (auth, compile, problems, games, etc.)
│   ├── scripts/             # Database seeding scripts (seed.js, import_contest1.js)
│   ├── sockets/             # Socket.io event handlers (battleManager, studyRoomManager)
│   ├── server.js            # Main Express & Socket.io server entry point
│   ├── Dockerfile           # Backend container setup
│   └── .env.example         # Template for backend environment variables
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client setup
│   │   ├── components/      # Reusable UI components (Sidebar, Topbar, etc.)
│   │   ├── context/         # Auth, Theme, & Socket React contexts
│   │   ├── pages/           # Application views (Dashboard, CodingArena, BattleArena, etc.)
│   │   ├── App.jsx          # Router & layout architecture
│   │   └── main.jsx         # React application root
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   └── vercel.json          # Deployment configuration for Vercel
├── DEPLOYMENT.md            # Comprehensive cloud deployment instructions
├── render.yaml              # Render platform blueprint file
└── README.md                # Project documentation
```

---

## ⚡ Quick Start & Local Setup

### **Prerequisites**
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` OR a MongoDB Atlas URI

---

### **1. Clone Repository & Install Dependencies**

```bash
git clone https://github.com/ashmitsahu1812/portal_for_juniors.git
cd portal_for_juniors
```

#### **Backend Setup**
```bash
cd backend
npm install
```

#### **Frontend Setup**
```bash
cd ../frontend
npm install
```

---

### **2. Configure Environment Variables**

#### **Backend (`backend/.env`)**
Create a `.env` file inside the `backend/` directory:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/lms_db
JWT_SECRET=your_super_secret_jwt_key
CLIENT_ORIGIN=http://localhost:5173
PISTON_API_URL=https://emkc.org/api/v2/piston
```

#### **Frontend (`frontend/.env`)**
Create a `.env` file inside the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

---

### **3. Seed the Database**

Populate your local or cloud database with initial learning modules, pathways, coding problems, and quizzes:

```bash
cd backend
npm run seed
```

---

### **4. Run the Development Servers**

#### **Start Backend Server**
```bash
cd backend
npm run dev
```
> The backend API server and WebSockets will start at `http://localhost:5001`.

#### **Start Frontend Dev Server**
```bash
cd frontend
npm run dev
```
> The React web application will start at `http://localhost:5173`.

Open `http://localhost:5173` in your browser.

---

## 🌐 API Routes Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Register a new user account |
| `/api/auth/login` | `POST` | Authenticate user & receive JWT token |
| `/api/modules` | `GET` | Retrieve learning modules |
| `/api/problems` | `GET` | Fetch coding problems |
| `/api/compile` | `POST` | Submit code for execution & judging |
| `/api/quizzes` | `GET` / `POST` | Retrieve and submit module quizzes |
| `/api/pathways` | `GET` | Fetch structured learning pathways |
| `/api/progress` | `GET` | Retrieve user learning analytics & progress |
| `/api/community` | `GET` / `POST` | Community forum posts & comments |
| `/api/games` | `GET` / `POST` | Mind games & high scores |
| `/api/assignments` | `GET` / `POST` | Assignment tracking & submissions |

---

## 🚀 Deployment

For a full step-by-step guide on deploying the backend to **Render / Railway**, frontend to **Vercel / Netlify**, and database to **MongoDB Atlas**, refer to [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you'd like to improve the platform, add new problems, or introduce new features.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
