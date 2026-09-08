import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CyberLoader from '../components/landing/CyberLoader';
import InteractiveJudgeDemo from '../components/landing/InteractiveJudgeDemo';
import AuthModal from '../components/landing/AuthModal';
import {
  Terminal, Code2, Swords, BookOpen, Trophy,
  Zap, ArrowRight, CheckCircle, Flame, BrainCircuit, MonitorPlay
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

  const [showLoader, setShowLoader] = useState(() => {
    const hasSeen = sessionStorage.getItem('has_seen_boot_loader');
    return !hasSeen;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleLoaderComplete = () => {
    setShowLoader(false);
    sessionStorage.setItem('has_seen_boot_loader', 'true');
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  if (showLoader) {
    return <CyberLoader onComplete={handleLoaderComplete} />;
  }

  return (
    <div style={{ background: '#000000', color: '#ffffff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: '#000000',
          borderBottom: '3px solid #222222',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: '#0085ff',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px 0px #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Terminal size={16} color="#ffffff" strokeWidth={3} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
              Kick Start
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              by <span style={{ color: '#0085ff' }}>RE</span><span>start</span>
            </span>
          </div>
        </div>

        {/* Center Links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.88rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
          <a href="#who-is-this-for" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Who It's For</a>
          <a href="#coding-arena" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Online Judge</a>
          <a href="#curriculum" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Syllabus</a>
          <a href="#battles" style={{ color: '#aaaaaa', textDecoration: 'none' }}>1v1 Battles</a>
          <a href="#mission" style={{ color: '#aaaaaa', textDecoration: 'none' }}>About</a>
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
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
              boxShadow: '2px 2px 0px 0px #ffffff',
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

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '4.5rem 2rem 3.5rem',
          maxWidth: '1100px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '4px 12px',
            background: '#141414',
            border: '2px solid #0085ff',
            color: '#0085ff',
            fontSize: '0.78rem',
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: '1.5rem',
          }}
        >
          SEMESTER 1 & SEMESTER 2 · CS & AIML LEARNING PLATFORM
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
          }}
        >
          Master Real Coding.<br />
          <span style={{ color: '#0085ff' }}>Ace Your Semester Exams.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
            color: '#a0a0a0',
            maxWidth: '700px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.6,
          }}
        >
          The dedicated platform built for juniors to practice on an automated Online Coding Judge, access curated lecture notes, test knowledge with timed quizzes, and battle classmates in 1v1 duels.
        </p>

        {/* Hero Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.9rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <button
            onClick={() => openAuth('register')}
            style={{
              padding: '0.8rem 1.75rem',
              background: '#0085ff',
              color: '#ffffff',
              border: '2px solid #000000',
              boxShadow: '4px 4px 0px 0px #ffffff',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            Enter Student Portal <ArrowRight size={16} />
          </button>

          <a
            href="#coding-arena"
            style={{
              padding: '0.8rem 1.5rem',
              background: '#141414',
              border: '2px solid #333333',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            View Online Judge Demo
          </a>
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          {[
            { label: 'Coding Problems', value: '100+', desc: 'with hidden test suites' },
            { label: 'Modules & Notes', value: '18+', desc: 'lecture PDFs & slides' },
            { label: 'Languages', value: '4', desc: 'C, C++, Python, Java' },
            { label: 'Multiplayer 1v1', value: 'Real-Time', desc: 'socket-powered battles' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: '#0d0d0d',
                border: '2px solid #222222',
                boxShadow: '3px 3px 0px 0px #0085ff',
                padding: '1.25rem 1rem',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0085ff', fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#777777', marginTop: '0.1rem' }}>
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
          padding: '5rem 2rem',
          maxWidth: '1100px',
          margin: '0 auto',
          borderTop: '2px solid #1a1a1a',
        }}
      >
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0085ff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
            Target Audience
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>
            Who Is Kick Start Built For?
          </h2>
          <p style={{ color: '#888888', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Designed specifically around your actual computer science curriculum and examination structure.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {/* Card 1: Semester 1 */}
          <div
            style={{
              background: '#0d0d0d',
              border: '2px solid #222222',
              boxShadow: '4px 4px 0px 0px #0085ff',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                1st Semester Freshmen
              </div>
              <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#141414', border: '1px solid #0085ff', color: '#0085ff', fontWeight: 700 }}>
                Foundations
              </span>
            </div>
            <p style={{ color: '#a0a0a0', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>
              Learn from ground zero. Build problem-solving logic in Python, understand memory pointers & arrays in C, practice Linux CLI terminal commands, and master web layout basics.
            </p>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #222222', fontSize: '0.78rem', color: '#0085ff', fontWeight: 600 }}>
              ✓ 18 Syllabus Modules & 97+ Practice Problems
            </div>
          </div>

          {/* Card 2: Semester 2 */}
          <div
            style={{
              background: '#0d0d0d',
              border: '2px solid #222222',
              boxShadow: '4px 4px 0px 0px #0085ff',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                2nd Semester Students
              </div>
              <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#141414', border: '1px solid #0085ff', color: '#0085ff', fontWeight: 700 }}>
                Core DSA & OOP
              </span>
            </div>
            <p style={{ color: '#a0a0a0', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>
              Tackle Data Structures (Stacks, Queues, Linked Lists, Trees), Object-Oriented Programming in C++/Java, DBMS relational models with SQL queries, and full-stack API concepts.
            </p>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #222222', fontSize: '0.78rem', color: '#0085ff', fontWeight: 600 }}>
              ✓ DSA Problem Bank & OOP Design Reviews
            </div>
          </div>

          {/* Card 3: Competitive Programmers */}
          <div
            style={{
              background: '#0d0d0d',
              border: '2px solid #222222',
              boxShadow: '4px 4px 0px 0px #0085ff',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                Competitive Coders
              </div>
              <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#141414', border: '1px solid #0085ff', color: '#0085ff', fontWeight: 700 }}>
                1v1 Arena
              </span>
            </div>
            <p style={{ color: '#a0a0a0', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>
              Duel with peers in timed 1v1 battle rooms with live status sync, test your algorithms against strict execution limits, and climb the university streak leaderboard.
            </p>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #222222', fontSize: '0.78rem', color: '#0085ff', fontWeight: 600 }}>
              ✓ Real-Time Multiplayer Socket Battles
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Judge Demo ──────────────────────────────────────── */}
      <section
        id="coding-arena"
        style={{
          padding: '5rem 2rem',
          maxWidth: '1100px',
          margin: '0 auto',
          borderTop: '2px solid #1a1a1a',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0085ff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
              Online Sandbox Execution
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Sandboxed Online Judge with Automated Grading
            </h2>
            <p style={{ color: '#a0a0a0', fontSize: '0.9rem', lineHeight: 1.6, margin: '1rem 0 1.25rem' }}>
              Write code in <strong>Python</strong>, <strong>C++</strong>, <strong>C</strong>, or <strong>Java</strong>. Solutions are automatically compiled in isolated sandboxes and verified against hidden test suites.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[
                'Instant verdicts: Accepted, Wrong Answer, TLE, and Compile Error',
                'Hidden test cases to test edge cases and prevent hardcoding',
                'Precise memory and runtime telemetry metrics',
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#cccccc' }}>
                  <CheckCircle size={15} color="#0085ff" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => openAuth('register')}
              style={{
                padding: '0.65rem 1.25rem',
                background: '#0085ff',
                color: '#ffffff',
                border: '2px solid #000000',
                boxShadow: '3px 3px 0px 0px #ffffff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              Start Coding <ArrowRight size={14} />
            </button>
          </div>

          <div>
            <InteractiveJudgeDemo />
          </div>
        </div>
      </section>

      {/* ── Curriculum (Sem 1 & Sem 2) ──────────────────────────────────── */}
      <section
        id="curriculum"
        style={{
          padding: '5rem 2rem',
          maxWidth: '1100px',
          margin: '0 auto',
          borderTop: '2px solid #1a1a1a',
        }}
      >
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0085ff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
            Curriculum Structure
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>
            Semester 1 & Semester 2 Tracks
          </h2>
          <p style={{ color: '#888888', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Switch between terms at any time via the sidebar dropdown.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#0d0d0d', border: '2px solid #222222', boxShadow: '4px 4px 0px 0px #0085ff', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>
                Semester 1
              </h3>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0085ff', background: '#141414', border: '1px solid #0085ff', padding: '2px 6px' }}>
                18 Modules
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#cccccc' }}>
              <li style={{ padding: '0.4rem 0.6rem', background: '#141414', border: '1px solid #222' }}>Problem Solving in Python (Loops, Lists, Functions)</li>
              <li style={{ padding: '0.4rem 0.6rem', background: '#141414', border: '1px solid #222' }}>C Programming Fundamentals (Pointers, Memory)</li>
              <li style={{ padding: '0.4rem 0.6rem', background: '#141414', border: '1px solid #222' }}>Systems & Web Essentials (Git, Linux CLI, HTML/CSS)</li>
              <li style={{ padding: '0.4rem 0.6rem', background: '#141414', border: '1px solid #222' }}>Comprehensive Review Quizzes & Past Papers</li>
            </ul>
          </div>

          <div style={{ background: '#0d0d0d', border: '2px solid #222222', boxShadow: '4px 4px 0px 0px #0085ff', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>
                Semester 2
              </h3>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0085ff', background: '#141414', border: '1px solid #0085ff', padding: '2px 6px' }}>
                Current Term
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#cccccc' }}>
              <li style={{ padding: '0.4rem 0.6rem', background: '#141414', border: '1px solid #222' }}>Data Structures & Algorithms (Stacks, Queues, Trees)</li>
              <li style={{ padding: '0.4rem 0.6rem', background: '#141414', border: '1px solid #222' }}>Object-Oriented Programming (C++ & Java Classes)</li>
              <li style={{ padding: '0.4rem 0.6rem', background: '#141414', border: '1px solid #222' }}>Database Management Systems (SQL & Schemas)</li>
              <li style={{ padding: '0.4rem 0.6rem', background: '#141414', border: '1px solid #222' }}>Full Stack Web Architecture & Asynchronous APIs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Mission Section ─────────────────────────────────────────────── */}
      <section
        id="mission"
        style={{
          padding: '4.5rem 2rem',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          borderTop: '2px solid #1a1a1a',
        }}
      >
        <div style={{ background: '#0d0d0d', border: '2px solid #0085ff', boxShadow: '6px 6px 0px 0px #0085ff', padding: '2.5rem 2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 0.75rem', color: '#ffffff' }}>
            Built by Seniors for Juniors
          </h3>
          <p style={{ color: '#a0a0a0', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            Kick Start was built by the <strong>REstart</strong> student initiative to provide a clean, centralized learning portal. All problems, notes, and battle rooms are 100% free and open for our student community.
          </p>
          <button
            onClick={() => openAuth('register')}
            style={{
              padding: '0.7rem 1.5rem',
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
            Create Your Account Now
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '2px solid #1a1a1a',
          padding: '2rem',
          textAlign: 'center',
          color: '#666666',
          fontSize: '0.8rem',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        <div>Kick Start by REstart · CS & AIML Student Portal</div>
        <div style={{ marginTop: '0.25rem' }}>© {new Date().getFullYear()} REstart. All rights reserved.</div>
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
