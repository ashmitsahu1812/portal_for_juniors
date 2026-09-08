import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CyberLoader from '../components/landing/CyberLoader';
import InteractiveJudgeDemo from '../components/landing/InteractiveJudgeDemo';
import AuthModal from '../components/landing/AuthModal';
import {
  Terminal, Code2, Swords, BookOpen, Trophy,
  Zap, ArrowRight, CheckCircle, Flame, BrainCircuit, MonitorPlay,
  Play, Sparkles, Layers, Cpu, Database, Laptop
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Always show loader on load / refresh so user experiences the funky boot animation
  const [showLoader, setShowLoader] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track mouse coordinates for subtle glowing spotlight behind cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div
      className="cyber-grid-bg"
      style={{
        background: '#000000',
        color: '#ffffff',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* ── Cyber Boot Sequence Overlay (0-100% Loader) ── */}
      {showLoader && <CyberLoader onComplete={handleLoaderComplete} />}

      {/* ── Interactive Cursor Glowing Spotlight ── */}
      <div
        style={{
          position: 'fixed',
          top: mousePos.y - 250,
          left: mousePos.x - 250,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 133, 255, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'top 0.08s ease-out, left 0.08s ease-out',
        }}
      />

      {/* ── Ambient Background Glow Orbs ── */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0, 133, 255, 0.16) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '45%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 133, 255, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '75%',
          left: '-5%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 133, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Ambient Floating Background Code Snippets ── */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '4%',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.78rem',
          color: 'rgba(0, 133, 255, 0.45)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatElement 6s ease-in-out infinite',
        }}
        className="hide-mobile"
      >
        <code>struct Node &#123; int data; Node* next; &#125;;</code>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '32%',
          right: '5%',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8rem',
          color: 'rgba(0, 133, 255, 0.45)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatElement 7s ease-in-out infinite alternate',
        }}
        className="hide-mobile"
      >
        <code>SELECT name, gpa FROM students ORDER BY streak DESC;</code>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '3%',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8rem',
          color: 'rgba(0, 133, 255, 0.45)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatElement 8s ease-in-out infinite',
        }}
        className="hide-mobile"
      >
        <code>def binary_search(arr, target): O(log N)</code>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '82%',
          right: '4%',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.8rem',
          color: 'rgba(0, 133, 255, 0.45)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'floatElement 6.5s ease-in-out infinite alternate',
        }}
        className="hide-mobile"
      >
        <code>class BattleRoom extends SocketEmitter &#123;&#125;</code>
      </div>

      {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '3px solid #222222',
          padding: '0.9rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: '#0085ff',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px 0px #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Terminal size={18} color="#ffffff" strokeWidth={3} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1, color: '#ffffff' }}>
              Kick Start
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px', color: '#cccccc' }}>
              by <span style={{ color: '#0085ff' }}>RE</span><span style={{ color: '#ffffff' }}>start</span>
            </span>
          </div>
        </div>

        {/* Center Links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.88rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
          <a href="#who-is-this-for" style={{ color: '#cccccc', textDecoration: 'none', transition: 'color 0.15s' }}>Who It's For</a>
          <a href="#coding-arena" style={{ color: '#cccccc', textDecoration: 'none', transition: 'color 0.15s' }}>Online Judge</a>
          <a href="#curriculum" style={{ color: '#cccccc', textDecoration: 'none', transition: 'color 0.15s' }}>Syllabus</a>
          <a href="#battles" style={{ color: '#cccccc', textDecoration: 'none', transition: 'color 0.15s' }}>1v1 Battles</a>
          <a href="#mission" style={{ color: '#cccccc', textDecoration: 'none', transition: 'color 0.15s' }}>About</a>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Replay Boot Screen Button */}
          <button
            onClick={() => setShowLoader(true)}
            style={{
              background: '#0d0d0d',
              border: '2px solid #0085ff',
              color: '#0085ff',
              padding: '0.42rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
            title="Replay Cyber Boot Sequence"
          >
            <Play size={11} fill="#0085ff" /> <span className="hide-mobile">Replay Boot</span>
          </button>

          <button
            onClick={() => openAuth('login')}
            style={{
              background: '#141414',
              border: '2px solid #333333',
              color: '#ffffff',
              padding: '0.45rem 0.9rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => openAuth('register')}
            style={{
              background: '#0085ff',
              border: '2px solid #000000',
              boxShadow: '3px 3px 0px 0px #ffffff',
              color: '#ffffff',
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Top High-Energy Scrolling Marquee Ticker ─────────────────────── */}
      <div
        className="marquee-container"
        style={{
          background: '#0085ff',
          color: '#000000',
          borderBottom: '3px solid #000000',
          padding: '0.45rem 0',
          fontSize: '0.82rem',
          fontWeight: 800,
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '0.04em',
        }}
      >
        <div className="marquee-inner-left">
          <span>⚡ SEMESTER 1 & SEMESTER 2 READY ⚡ AUTOMATED ONLINE JUDGE ⚡ 100+ PROBLEMS WITH HIDDEN TESTCASES ⚡ 1v1 MULTIPLAYER CODING DUELS ⚡ LECTURE NOTES & SLIDES ⚡ TIMED PRACTICE QUIZZES ⚡ PYTHON · C++ · C · JAVA SANDBOX ⚡ REstart INITIATIVE ⚡&nbsp;</span>
          <span>⚡ SEMESTER 1 & SEMESTER 2 READY ⚡ AUTOMATED ONLINE JUDGE ⚡ 100+ PROBLEMS WITH HIDDEN TESTCASES ⚡ 1v1 MULTIPLAYER CODING DUELS ⚡ LECTURE NOTES & SLIDES ⚡ TIMED PRACTICE QUIZZES ⚡ PYTHON · C++ · C · JAVA SANDBOX ⚡ REstart INITIATIVE ⚡&nbsp;</span>
        </div>
      </div>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '5rem 2rem 4rem',
          maxWidth: '1120px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '5px 14px',
            background: '#0a0a0a',
            border: '2px solid #0085ff',
            boxShadow: '3px 3px 0px 0px #0085ff',
            color: '#0085ff',
            fontSize: '0.8rem',
            fontWeight: 800,
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '1.75rem',
          }}
        >
          <Zap size={14} color="#0085ff" /> SEMESTER 1 & 2 · CS & AIML LEARNING PORTAL
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
            fontWeight: 900,
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            marginBottom: '1.4rem',
            color: '#ffffff',
          }}
        >
          Master Real Coding.<br />
          <span style={{ color: '#0085ff', textShadow: '0 0 30px rgba(0, 133, 255, 0.45)' }}>
            Ace Your Semester Exams.
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 1.9vw, 1.2rem)',
            color: '#cccccc',
            maxWidth: '740px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.65,
          }}
        >
          The dedicated platform built for college juniors to practice on an automated Online Coding Judge, access curated lecture notes, test knowledge with timed quizzes, and battle classmates in 1v1 duels.
        </p>

        {/* Hero Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.75rem' }}>
          <button
            onClick={() => openAuth('register')}
            style={{
              padding: '0.85rem 1.85rem',
              background: '#0085ff',
              color: '#ffffff',
              border: '2px solid #000000',
              boxShadow: '5px 5px 0px 0px #ffffff',
              fontSize: '1.05rem',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '7px 7px 0px 0px #ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '5px 5px 0px 0px #ffffff';
            }}
          >
            Enter Student Portal <ArrowRight size={17} color="#ffffff" />
          </button>

          <a
            href="#coding-arena"
            style={{
              padding: '0.85rem 1.6rem',
              background: '#0d0d0d',
              border: '2px solid #333333',
              color: '#ffffff',
              fontSize: '1.05rem',
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: "'Space Grotesk', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'border-color 0.15s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#0085ff'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#333333'; }}
          >
            <Code2 size={16} color="#0085ff" /> View Online Judge Demo
          </a>
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {[
            { label: 'Coding Problems', value: '100+', desc: 'with hidden test suites', icon: <Code2 size={20} color="#0085ff" /> },
            { label: 'Modules & Notes', value: '18+', desc: 'lecture PDFs & slides', icon: <BookOpen size={20} color="#0085ff" /> },
            { label: 'Languages', value: '4', desc: 'C, C++, Python, Java', icon: <Cpu size={20} color="#0085ff" /> },
            { label: 'Multiplayer 1v1', value: 'Real-Time', desc: 'socket-powered battles', icon: <Swords size={20} color="#0085ff" /> },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: '#0a0a0a',
                border: '2px solid #222222',
                boxShadow: '4px 4px 0px 0px #0085ff',
                padding: '1.35rem 1.15rem',
                textAlign: 'left',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>
                  {stat.value}
                </div>
                {stat.icon}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0085ff', fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#aaaaaa', marginTop: '0.15rem' }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── "WHO IS THIS FOR?" ──────────────────────────────────────────── */}
      <section
        id="who-is-this-for"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '5.5rem 2rem',
          maxWidth: '1120px',
          margin: '0 auto',
          borderTop: '2px solid #1a1a1a',
        }}
      >
        <div style={{ marginBottom: '2.75rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0085ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>
            // TARGET AUDIENCE //
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.025em', margin: 0, color: '#ffffff' }}>
            Who Is Kick Start Built For?
          </h2>
          <p style={{ color: '#aaaaaa', fontSize: '1rem', marginTop: '0.4rem' }}>
            Designed specifically around your actual computer science curriculum and university examination structure.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1: Semester 1 */}
          <div
            style={{
              background: '#0a0a0a',
              border: '2px solid #222222',
              boxShadow: '5px 5px 0px 0px #0085ff',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                1st Semester Freshmen
              </div>
              <span style={{ fontSize: '0.72rem', padding: '3px 8px', background: '#141414', border: '1px solid #0085ff', color: '#0085ff', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
                FOUNDATIONS
              </span>
            </div>
            <p style={{ color: '#cccccc', fontSize: '0.9rem', lineHeight: 1.6, flex: 1 }}>
              Learn from ground zero. Build problem-solving logic in Python, understand memory pointers & arrays in C, practice Linux CLI terminal commands, and master web layout basics.
            </p>
            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #222222', fontSize: '0.82rem', color: '#0085ff', fontWeight: 700 }}>
              ✓ 18 Syllabus Modules & 97+ Practice Problems
            </div>
          </div>

          {/* Card 2: Semester 2 */}
          <div
            style={{
              background: '#0a0a0a',
              border: '2px solid #0085ff',
              boxShadow: '6px 6px 0px 0px #0085ff',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                2nd Semester Students
              </div>
              <span style={{ fontSize: '0.72rem', padding: '3px 8px', background: '#0085ff', color: '#000000', fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>
                CURRENT TERM 🔥
              </span>
            </div>
            <p style={{ color: '#cccccc', fontSize: '0.9rem', lineHeight: 1.6, flex: 1 }}>
              Tackle Data Structures (Stacks, Queues, Linked Lists, Trees), Object-Oriented Programming in C++/Java, DBMS relational models with SQL queries, and full-stack API concepts.
            </p>
            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #222222', fontSize: '0.82rem', color: '#0085ff', fontWeight: 700 }}>
              ✓ DSA Problem Bank & OOP Design Reviews
            </div>
          </div>

          {/* Card 3: Competitive Programmers */}
          <div
            style={{
              background: '#0a0a0a',
              border: '2px solid #222222',
              boxShadow: '5px 5px 0px 0px #0085ff',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                Competitive Coders
              </div>
              <span style={{ fontSize: '0.72rem', padding: '3px 8px', background: '#141414', border: '1px solid #0085ff', color: '#0085ff', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
                1v1 ARENA
              </span>
            </div>
            <p style={{ color: '#cccccc', fontSize: '0.9rem', lineHeight: 1.6, flex: 1 }}>
              Duel with peers in timed 1v1 battle rooms with live status sync, test your algorithms against strict execution limits, and climb the university streak leaderboard.
            </p>
            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #222222', fontSize: '0.82rem', color: '#0085ff', fontWeight: 700 }}>
              ✓ Real-Time Multiplayer Socket Battles
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Judge Demo Section ──────────────────────────────── */}
      <section
        id="coding-arena"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '5.5rem 2rem',
          maxWidth: '1120px',
          margin: '0 auto',
          borderTop: '2px solid #1a1a1a',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0085ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>
              // ONLINE SANDBOX EXECUTION //
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.5rem)', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.025em', lineHeight: 1.18, color: '#ffffff' }}>
              Sandboxed Online Judge with Automated Grading
            </h2>
            <p style={{ color: '#cccccc', fontSize: '0.95rem', lineHeight: 1.65, margin: '1.2rem 0 1.5rem' }}>
              Write code in <strong style={{ color: '#ffffff' }}>Python</strong>, <strong style={{ color: '#ffffff' }}>C++</strong>, <strong style={{ color: '#ffffff' }}>C</strong>, or <strong style={{ color: '#ffffff' }}>Java</strong>. Solutions are automatically compiled in isolated sandboxes and verified against hidden test suites.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem' }}>
              {[
                'Instant verdicts: Accepted, Wrong Answer, TLE, and Compile Error',
                'Hidden test cases to test edge cases and prevent hardcoding',
                'Precise memory and runtime telemetry metrics',
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#e0e0e0' }}>
                  <CheckCircle size={16} color="#0085ff" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => openAuth('register')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#0085ff',
                color: '#ffffff',
                border: '2px solid #000000',
                boxShadow: '4px 4px 0px 0px #ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              Start Coding <ArrowRight size={15} color="#ffffff" />
            </button>
          </div>

          <div>
            <InteractiveJudgeDemo />
          </div>
        </div>
      </section>

      {/* ── Middle Divider Marquee ──────────────────────────────────────── */}
      <div
        className="marquee-container"
        style={{
          background: '#0a0a0a',
          color: '#0085ff',
          borderTop: '2px solid #222222',
          borderBottom: '2px solid #222222',
          padding: '0.55rem 0',
          fontSize: '0.85rem',
          fontWeight: 800,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.06em',
        }}
      >
        <div className="marquee-inner-right">
          <span>✦ DATA STRUCTURES & ALGORITHMS ✦ OBJECT ORIENTED PROGRAMMING IN C++ ✦ RELATIONAL DBMS & SQL ✦ ASYNC FULL STACK APIS ✦ PYTHON SCRIPTING ✦ POINTERS IN C ✦&nbsp;</span>
          <span>✦ DATA STRUCTURES & ALGORITHMS ✦ OBJECT ORIENTED PROGRAMMING IN C++ ✦ RELATIONAL DBMS & SQL ✦ ASYNC FULL STACK APIS ✦ PYTHON SCRIPTING ✦ POINTERS IN C ✦&nbsp;</span>
        </div>
      </div>

      {/* ── Curriculum (Sem 1 & Sem 2) ──────────────────────────────────── */}
      <section
        id="curriculum"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '5.5rem 2rem',
          maxWidth: '1120px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '2.75rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0085ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>
            // CURRICULUM TRACKS //
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.025em', margin: 0, color: '#ffffff' }}>
            Semester 1 & Semester 2 Tracks
          </h2>
          <p style={{ color: '#aaaaaa', fontSize: '1rem', marginTop: '0.4rem' }}>
            Switch between terms at any time via the sidebar dropdown.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.75rem' }}>
          <div style={{ background: '#0a0a0a', border: '2px solid #222222', boxShadow: '5px 5px 0px 0px #0085ff', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>
                Semester 1
              </h3>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0085ff', background: '#141414', border: '1px solid #0085ff', padding: '3px 8px', fontFamily: "'JetBrains Mono', monospace" }}>
                18 MODULES
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#cccccc' }}>
              <li style={{ padding: '0.5rem 0.75rem', background: '#111111', border: '1px solid #222', color: '#e0e0e0' }}>Problem Solving in Python (Loops, Lists, Functions)</li>
              <li style={{ padding: '0.5rem 0.75rem', background: '#111111', border: '1px solid #222', color: '#e0e0e0' }}>C Programming Fundamentals (Pointers, Memory)</li>
              <li style={{ padding: '0.5rem 0.75rem', background: '#111111', border: '1px solid #222', color: '#e0e0e0' }}>Systems & Web Essentials (Git, Linux CLI, HTML/CSS)</li>
              <li style={{ padding: '0.5rem 0.75rem', background: '#111111', border: '1px solid #222', color: '#e0e0e0' }}>Comprehensive Review Quizzes & Past Papers</li>
            </ul>
          </div>

          <div style={{ background: '#0a0a0a', border: '2px solid #0085ff', boxShadow: '6px 6px 0px 0px #0085ff', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>
                Semester 2
              </h3>
              <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#000000', background: '#0085ff', padding: '3px 8px', fontFamily: "'JetBrains Mono', monospace" }}>
                CURRENT TERM 🔥
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#cccccc' }}>
              <li style={{ padding: '0.5rem 0.75rem', background: '#111111', border: '1px solid #222', color: '#e0e0e0' }}>Data Structures & Algorithms (Stacks, Queues, Trees)</li>
              <li style={{ padding: '0.5rem 0.75rem', background: '#111111', border: '1px solid #222', color: '#e0e0e0' }}>Object-Oriented Programming (C++ & Java Classes)</li>
              <li style={{ padding: '0.5rem 0.75rem', background: '#111111', border: '1px solid #222', color: '#e0e0e0' }}>Database Management Systems (SQL & Schemas)</li>
              <li style={{ padding: '0.5rem 0.75rem', background: '#111111', border: '1px solid #222', color: '#e0e0e0' }}>Full Stack Web Architecture & Asynchronous APIs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 1v1 Battle Arena Feature Showcase ───────────────────────────── */}
      <section
        id="battles"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '5.5rem 2rem',
          maxWidth: '1120px',
          margin: '0 auto',
          borderTop: '2px solid #1a1a1a',
        }}
      >
        <div style={{ background: '#0a0a0a', border: '3px solid #0085ff', boxShadow: '8px 8px 0px 0px #0085ff', padding: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0085ff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>
                // MULTIPLAYER COMPETITIVE //
              </div>
              <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 0.85rem', color: '#ffffff' }}>
                1v1 Real-Time Multiplayer Battle Arena
              </h3>
              <p style={{ color: '#cccccc', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
                Challenge your classmates to private duel rooms. Both players receive the exact same problem statement and test suites. The first player to get all test cases green wins the match and earns streak multipliers.
              </p>
              <button
                onClick={() => openAuth('register')}
                style={{
                  padding: '0.7rem 1.4rem',
                  background: '#0085ff',
                  color: '#ffffff',
                  border: '2px solid #000000',
                  boxShadow: '3px 3px 0px 0px #ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Enter Battle Arena
              </button>
            </div>

            <div style={{ background: '#000000', border: '2px solid #222222', padding: '1.25rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: '#0085ff' }}>
                <span>ROOM #0429 // ACTIVE</span>
                <span style={{ color: '#ffffff' }}>TIME: 08:42</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '0.4rem 0.6rem', color: '#ffffff' }}>
                  <span>Player 1: you</span>
                  <span style={{ color: '#0085ff' }}>[3/4 TESTS PASSED]</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '0.4rem 0.6rem', color: '#ffffff' }}>
                  <span>Player 2: rival_dev</span>
                  <span style={{ color: '#aaaaaa' }}>[2/4 TESTS PASSED]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission Section ─────────────────────────────────────────────── */}
      <section
        id="mission"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '5rem 2rem',
          maxWidth: '850px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div style={{ background: '#0a0a0a', border: '2px solid #222222', boxShadow: '6px 6px 0px 0px #0085ff', padding: '2.75rem 2rem' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 0.85rem', color: '#ffffff' }}>
            Built by Seniors for Juniors
          </h3>
          <p style={{ color: '#cccccc', fontSize: '0.95rem', lineHeight: 1.65, margin: '0 0 1.75rem' }}>
            Kick Start was built by the <strong>REstart</strong> student initiative to provide a clean, centralized learning portal. All problems, notes, and battle rooms are 100% free and open for our student community.
          </p>
          <button
            onClick={() => openAuth('register')}
            style={{
              padding: '0.8rem 1.65rem',
              background: '#0085ff',
              color: '#ffffff',
              border: '2px solid #000000',
              boxShadow: '4px 4px 0px 0px #ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Create Your Account Now
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          position: 'relative',
          zIndex: 2,
          borderTop: '2px solid #1a1a1a',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          color: '#888888',
          fontSize: '0.82rem',
          fontFamily: "'Space Grotesk', sans-serif",
          background: '#000000',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ color: '#ffffff' }}>Kick Start by REstart</span>
          <span>·</span>
          <span>CS & AIML Student Portal</span>
          <span>·</span>
          <button
            onClick={() => setShowLoader(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0085ff',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              fontWeight: 700,
            }}
          >
            Replay Boot Sequence
          </button>
        </div>
        <div>© {new Date().getFullYear()} REstart. All rights reserved.</div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
