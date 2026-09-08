import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CyberLoader from '../components/landing/CyberLoader';
import InteractiveJudgeDemo from '../components/landing/InteractiveJudgeDemo';
import AuthModal from '../components/landing/AuthModal';
import {
  Terminal, Code2, Swords, BookOpen, Milestone, Trophy,
  Gamepad2, Zap, ArrowRight, CheckCircle, ShieldCheck,
  Sparkles, Users, Cpu, Clock, Layers, Star, Play, Flame, BrainCircuit, MonitorPlay
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

  // Cyber Loader State (show on initial landing)
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
    <div className="landing-page-root" style={{ background: '#05070f', color: '#f8fafc', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ── 1. Sticky Navigation ────────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(5, 7, 15, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #0085ff, #a855f7)',
              border: '2px solid #000',
              boxShadow: '2px 2px 0px 0px #0085ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
            }}
          >
            <Terminal size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
              Kick Start
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#888', marginTop: '2px' }}>
              by <strong style={{ color: '#0085ff' }}>RE</strong>start
            </span>
          </div>
        </div>

        {/* Center Jump Links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', fontSize: '0.88rem', fontWeight: 600 }}>
          <a href="#who-is-this-for" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.15s' }}>Who It's For</a>
          <a href="#coding-arena" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.15s' }}>Online Judge</a>
          <a href="#curriculum" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.15s' }}>Sem 1 & 2 Syllabus</a>
          <a href="#battle-arena" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.15s' }}>1v1 Battles</a>
          <a href="#why-restart" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.15s' }}>Our Mission</a>
        </div>

        {/* Auth CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => openAuth('login')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = '#0085ff')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)')}
          >
            Sign In
          </button>

          <button
            onClick={() => openAuth('register')}
            style={{
              background: 'linear-gradient(135deg, #0085ff, #00e5ff)',
              border: 'none',
              color: '#000',
              padding: '0.45rem 1.1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(0, 133, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            Get Started Free <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ── 2. Hero Section ────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 2rem 4rem',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Glow Orb Background */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0, 133, 255, 0.25) 0%, rgba(168, 85, 247, 0.1) 45%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Holographic Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '6px 14px',
              borderRadius: '30px',
              background: 'rgba(0, 133, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              color: '#00e5ff',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '1.75rem',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)',
            }}
          >
            <Sparkles size={14} color="#00e5ff" />
            THE PREMIER CS & AIML ACCELERATOR · SEMESTERS 1 & 2
          </div>

          {/* Main Hero Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              maxWidth: '900px',
              margin: '0 auto 1.5rem',
            }}
          >
            Level Up Your CS Journey.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0085ff, #00e5ff, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              From Day 1 to 10x.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#94a3b8',
              maxWidth: '740px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.65,
            }}
          >
            Built by seniors to empower incoming freshmen and sophomores. Master real algorithmic coding with an instant online judge, battle peers in live 1v1 arenas, ace quizzes, access curated lecture notes, and accelerate through your degree.
          </p>

          {/* Hero CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <button
              onClick={() => openAuth('register')}
              style={{
                padding: '0.85rem 2rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0085ff, #00e5ff)',
                color: '#000',
                fontSize: '1rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(0, 133, 255, 0.5), 2px 2px 0px #000',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Zap size={18} fill="#000" />
              Launch Student Portal Free
            </button>

            <a
              href="#coding-arena"
              style={{
                padding: '0.85rem 1.75rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
            >
              <Code2 size={18} color="#00e5ff" />
              Try Interactive Judge Demo
            </a>
          </div>

          {/* Metric Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              maxWidth: '960px',
              margin: '0 auto',
            }}
          >
            {[
              { label: 'Algorithmic Problems', value: '100+', color: '#0085ff' },
              { label: 'Curated Modules & Notes', value: '18+', color: '#a855f7' },
              { label: 'Supported Compilers', value: '4 Languages', color: '#10b981' },
              { label: '1v1 Live Duels & Games', value: 'Real-Time', color: '#00e5ff' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: stat.color, fontFamily: "'JetBrains Mono', monospace" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 600 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. "WHO IS THIS FOR?" (Comprehensive Breakdown) ─────────────── */}
      <section
        id="who-is-this-for"
        style={{
          padding: '6rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#0085ff',
              marginBottom: '0.5rem',
            }}
          >
            Built Specifically For Your Degree
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Who Is Kick Start Built For?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Whether you are writing your first `print("Hello World")` or preparing for competitive coding rounds, here is how we accelerate you:
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Card 1: Semester 1 Freshmen */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(14, 21, 38, 0.8), rgba(6, 10, 19, 0.9))',
              border: '2px solid rgba(0, 133, 255, 0.3)',
              borderRadius: '16px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                background: 'rgba(0, 133, 255, 0.15)',
                border: '1px solid #0085ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Terminal size={22} color="#0085ff" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>Semester 1 Freshmen</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(0, 133, 255, 0.2)', color: '#00e5ff', fontWeight: 700 }}>
                Foundations
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, flex: 1 }}>
              Zero coding background needed. Build bulletproof intuition for variables, control flow, functions, arrays, pointers, Git commands, Linux CLI, and HTML/CSS web foundations.
            </p>
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', fontSize: '0.8rem', color: '#38bdf8' }}>
              ✦ 18 Modules · 97+ Intro Problems · Python & C
            </div>
          </div>

          {/* Card 2: Semester 2 Sophomores */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(14, 21, 38, 0.8), rgba(6, 10, 19, 0.9))',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Cpu size={22} color="#10b981" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>Semester 2 Coders</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700 }}>
                Core DSA & OOP
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, flex: 1 }}>
              Transition into serious software engineering. Master Data Structures (Linked Lists, Stacks, Queues, Trees), OOP design patterns in C++, DBMS relational modeling & full-stack web APIs.
            </p>
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', fontSize: '0.8rem', color: '#34d399' }}>
              ✦ Live DSA Arenas · OOPs & DBMS Banks · C++ & Java
            </div>
          </div>

          {/* Card 3: Competitive Coders */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(14, 21, 38, 0.8), rgba(6, 10, 19, 0.9))',
              border: '2px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '16px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid #a855f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Swords size={22} color="#a855f7" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>Competitive Duelers</h3>
              <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontWeight: 700 }}>
                1v1 Real-Time
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, flex: 1 }}>
              Sharpen your algorithmic problem solving under pressure. Create or join 1v1 battle rooms, race against peers, and submit code to see live who passes all hidden test suites first.
            </p>
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', fontSize: '0.8rem', color: '#c084fc' }}>
              ✦ Socket.io Multiplayer · Global Elo Leaderboard
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Interactive Online Judge Spotlight ────────────────────────── */}
      <section
        id="coding-arena"
        style={{
          padding: '6rem 2rem',
          background: 'linear-gradient(180deg, rgba(5, 7, 15, 0) 0%, rgba(10, 15, 30, 0.8) 50%, rgba(5, 7, 15, 0) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            {/* Left Info */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#00e5ff',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.75rem',
                }}
              >
                <Code2 size={16} color="#00e5ff" />
                Sandboxed Multi-Language Compiler
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Real-Time Online Judge with Multi-Language Compilers
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, margin: '1rem 0 1.5rem' }}>
                Stop relying on guesswork. Kick Start's sandboxed compiler runs your solutions against both visible sample test cases and comprehensive hidden edge cases in <strong>Python</strong>, <strong>C++</strong>, <strong>C</strong>, and <strong>Java</strong> with sub-second execution speeds.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  'Instant compilation verdicts (Accepted, Wrong Answer, TLE, Memory Limit)',
                  'Hidden test cases prevent hardcoded shortcuts and ensure algorithmic accuracy',
                  'Detailed time & memory telemetry per test case execution',
                  'Persistent progress tracking and problem solution streaks',
                ].map((text, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
                    <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openAuth('register')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0085ff, #00e5ff)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 0 15px rgba(0, 133, 255, 0.3)',
                }}
              >
                Enter Coding Arena <ArrowRight size={15} />
              </button>
            </div>

            {/* Right Interactive Demo */}
            <div>
              <InteractiveJudgeDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Semester 1 & 2 Curriculum Section ────────────────────────── */}
      <section
        id="curriculum"
        style={{
          padding: '6rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#0085ff', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            Structured Progression
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Complete Semester 1 & Semester 2 Tracks
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Switch seamlessly between semesters using the built-in dropdown switcher.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Semester 1 Box */}
          <div
            style={{
              background: '#0a0e1a',
              border: '2px solid rgba(0, 133, 255, 0.3)',
              borderRadius: '16px',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>Semester 1</div>
              <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 133, 255, 0.2)', color: '#00e5ff', fontWeight: 700 }}>
                18 Modules Live
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { title: 'Problem Solving in Python', sub: 'Variables, loops, conditionals & lists' },
                { title: 'C Programming Fundamentals', sub: 'Pointers, memory management & arrays' },
                { title: 'Systems & Web Essentials', sub: 'Linux CLI commands, Git & web layout basics' },
                { title: 'Mid-Sem & End-Sem Mock Quizzes', sub: 'Comprehensive review quizzes with timers' },
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>{item.title}</div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.2rem' }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Semester 2 Box */}
          <div
            style={{
              background: '#0a0e1a',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>Semester 2</div>
              <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 700 }}>
                Current Term 🚀
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { title: 'Data Structures & Algorithms', sub: 'Stacks, Queues, Linked Lists & Trees' },
                { title: 'Object-Oriented Programming (C++ / Java)', sub: 'Classes, Polymorphism, Inheritance & Design' },
                { title: 'Database Management Systems (DBMS)', sub: 'Relational schemas, SQL queries & indexing' },
                { title: 'Full Stack Web Architecture', sub: 'Async JavaScript, REST APIs & frontend frameworks' },
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>{item.title}</div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.2rem' }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. 1v1 Battle Arena & Mind Games Section ────────────────────── */}
      <section
        id="battle-arena"
        style={{
          padding: '6rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#c084fc', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Multiplayer Gamification
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              1v1 Real-Time Code Battles & Mind Games
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, margin: '1rem 0 1.5rem' }}>
              Coding doesn't have to be a lonely grind. Challenge friends in head-to-head live programming duels with real-time socket updates, solve mind puzzles, and climb the university leaderboard.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Swords size={20} color="#a855f7" />
                <div style={{ fontWeight: 700, marginTop: '0.5rem', fontSize: '0.9rem' }}>1v1 Battles</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Custom room codes & synchronized timers</div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <BrainCircuit size={20} color="#00e5ff" />
                <div style={{ fontWeight: 700, marginTop: '0.5rem', fontSize: '0.9rem' }}>Mind Games</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Memory matrix & syntax speed drills</div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <MonitorPlay size={20} color="#10b981" />
                <div style={{ fontWeight: 700, marginTop: '0.5rem', fontSize: '0.9rem' }}>Study Rooms</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Pomodoro focus timers & video rooms</div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Trophy size={20} color="#f59e0b" />
                <div style={{ fontWeight: 700, marginTop: '0.5rem', fontSize: '0.9rem' }}>Leaderboards</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>Day streaks, problem XP & global ranking</div>
              </div>
            </div>
          </div>

          {/* Battle Mock Card */}
          <div
            style={{
              background: '#090d16',
              border: '2px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>LIVE 1v1 MATCH</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#aaa', fontFamily: "'JetBrains Mono', monospace" }}>Room: #CS-DUEL-89</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', alignItems: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(0, 133, 255, 0.1)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(0, 133, 255, 0.3)' }}>
                <div style={{ fontWeight: 800, color: '#00e5ff' }}>You (Player 1)</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.3rem' }}>4 / 5 Passed</div>
              </div>
              <div style={{ fontWeight: 900, color: '#888', fontSize: '1.1rem' }}>VS</div>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ fontWeight: 800, color: '#f87171' }}>Opponent</div>
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.3rem' }}>3 / 5 Passed</div>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.78rem', color: '#aaa', fontFamily: "'JetBrains Mono', monospace" }}>
              <div>[Time Remaining: 04:32]</div>
              <div style={{ color: '#10b981', marginTop: '0.25rem' }}>&gt; Final compilation in progress...</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. The REstart Mission ─────────────────────────────────────── */}
      <section
        id="why-restart"
        style={{
          padding: '5rem 2rem',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(0, 133, 255, 0.08), rgba(168, 85, 247, 0.05))',
            border: '2px solid rgba(0, 133, 255, 0.2)',
            borderRadius: '20px',
            padding: '3rem 2rem',
            position: 'relative',
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(0, 133, 255, 0.2)', border: '1px solid var(--accent-blue)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Terminal size={24} color="#00e5ff" />
          </div>

          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Why Kick Start by REstart?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.7, maxWidth: '700px', margin: '0 auto 1.75rem' }}>
            We are senior software developers and CS alumni who walked this exact path. We saw juniors struggle with fragmented YouTube links, broken online compilers, and overwhelming curriculum changes. We built <strong>Kick Start</strong> to give every incoming junior the exact tools, practice, and confidence needed to stand out.
          </p>

          <button
            onClick={() => openAuth('register')}
            style={{
              padding: '0.85rem 2rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0085ff, #00e5ff)',
              color: '#000',
              fontWeight: 800,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 133, 255, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            Join the Community — It's 100% Free <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── 8. Footer ─────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 700, color: '#fff' }}>Kick Start</span>
          <span>·</span>
          <span>Empowering CS & AIML Freshmen & Sophomores</span>
        </div>
        <p>© {new Date().getFullYear()} REstart Initiative. All rights reserved.</p>
      </footer>

      {/* ── Auth Modal ────────────────────────────────────────────────── */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
