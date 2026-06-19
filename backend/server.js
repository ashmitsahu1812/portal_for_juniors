/**
 * server.js — Main entry point for the LMS + Coding Judge backend.
 *
 * Responsibilities:
 *  - Bootstrap Express with essential middleware (CORS, JSON, rate-limiter)
 *  - Connect to MongoDB via Mongoose
 *  - Mount all API route modules
 *  - Provide a global error-handling middleware
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initBattleManager } from './sockets/battleManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Route imports ────────────────────────────────────────────────────────────
import moduleRoutes from './routes/modules.js';
import quizRoutes from './routes/quizzes.js';
import problemRoutes from './routes/problems.js';
import compileRoutes from './routes/compile.js';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import pathwayRoutes from './routes/pathways.js';
import communityRoutes from './routes/community.js';

// ── Bootstrap ─────────────────────────────────────────────────────────────────
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Security Middleware ───────────────────────────────────────────────────────

// Set sensible HTTP security headers
app.use(helmet());

// Allow requests only from our frontend origin (configurable via .env)
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin)
    if (!origin) return callback(null, true);
    // Allow explicitly whitelisted origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow all vercel.app preview/production deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy does not allow origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ── WebSockets Setup ──────────────────────────────────────────────────────────
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

initBattleManager(io);

// ── General Middleware ────────────────────────────────────────────────────────

// Parse incoming JSON bodies (limit to 2 MB to prevent payload abuse)
app.use(express.json({ limit: '2mb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// ── Rate Limiting ─────────────────────────────────────────────────────────────

// Global rate-limiter: max 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});
app.use(globalLimiter);

// Stricter rate-limiter specifically for the compile endpoint (code execution)
const compileLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10,             // max 10 submissions per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many code submissions. Please wait before retrying.',
  },
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/modules', moduleRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/compile', compileLimiter, compileRoutes); // rate-limited separately
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/pathways', pathwayRoutes);
app.use('/api/community', communityRoutes);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'OK', timestamp: new Date().toISOString() });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the full error in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only expose the stack trace during development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Start Server ──────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀  LMS Backend (HTTP & WebSockets) running on http://localhost:${PORT}`);
  console.log(`    Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`    DB URI      : ${process.env.MONGO_URI ? '✓ connected' : '✗ MONGO_URI not set'}\n`);
});

export default app;
