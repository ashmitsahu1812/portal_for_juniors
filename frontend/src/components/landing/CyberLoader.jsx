import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Zap, ArrowRight, FastForward } from 'lucide-react';

const BOOT_STEPS = [
  { text: 'BOOT_SEQUENCE::INIT_KICKSTART_OS_v2.4...', delay: 150 },
  { text: 'VERIFYING_CS_AIML_CORE_KERNEL... [OK]', delay: 350 },
  { text: 'MOUNTING_SEMESTER_1_AND_2_CURRICULUM_BANKS... [OK]', delay: 600 },
  { text: 'INITIALIZING_ONLINE_JUDGE_SANDBOX (C, C++, PY, JAVA)... [READY]', delay: 850 },
  { text: 'ESTABLISHING_1v1_MULTIPLAYER_SOCKET_RELAY... [ONLINE]', delay: 1100 },
  { text: 'LOADING_CURATED_LECTURE_NOTES_AND_AI_QUIZZES... [MOUNTED]', delay: 1350 },
  { text: 'SYSTEMS_NOMINAL: WELCOME CS FRESHMEN & SOPHOMORES.', delay: 1600 },
];

export default function CyberLoader({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Progress increment timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const jump = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + jump, 100);
      });
    }, 60);

    // Boot logs queue
    BOOT_STEPS.forEach((step, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step.text]);
      }, step.delay);
    });

    // Complete loader after 2.1 seconds
    const finishTimeout = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        onComplete();
      }, 400);
    }, 2100);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(finishTimeout);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#05070d',
        color: '#00e5ff',
        fontFamily: "'JetBrains Mono', monospace",
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s ease',
        overflow: 'hidden',
      }}
    >
      {/* Background Cyber Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 133, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 133, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Pulsing Scan Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)',
          boxShadow: '0 0 15px #00e5ff',
          animation: 'cyberScanLine 2s linear infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Main Terminal Window */}
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'rgba(10, 15, 26, 0.95)',
          border: '2px solid rgba(0, 229, 255, 0.4)',
          borderRadius: '12px',
          boxShadow: '0 0 40px rgba(0, 229, 255, 0.15), 0 20px 50px rgba(0,0,0,0.8)',
          padding: '1.75rem',
          position: 'relative',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
            paddingBottom: '0.85rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 26,
                height: 26,
                background: 'rgba(0, 229, 255, 0.15)',
                border: '1px solid #00e5ff',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Terminal size={14} color="#00e5ff" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
                KICK START // RESTART
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(0, 229, 255, 0.7)' }}>
                CS & AIML CORE ARCHITECTURE
              </div>
            </div>
          </div>

          <button
            onClick={handleSkip}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '0.72rem',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0, 229, 255, 0.2)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
          >
            SKIP <FastForward size={11} />
          </button>
        </div>

        {/* Live Logs Stream */}
        <div
          style={{
            minHeight: '140px',
            maxHeight: '180px',
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            fontSize: '0.78rem',
            lineHeight: 1.4,
            marginBottom: '1.5rem',
          }}
        >
          {logs.map((log, i) => (
            <div
              key={i}
              style={{
                color: i === logs.length - 1 ? '#00e5ff' : 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: '#0085ff', fontWeight: 800 }}>&gt;</span>
              <span>{log}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00e5ff' }}>
            <span style={{ animation: 'blink 0.8s infinite', fontWeight: 900 }}>_</span>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '0.5rem',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={14} color="#00e5ff" />
              SYNCHRONIZING PORTAL ASSETS
            </span>
            <span style={{ color: '#00e5ff', letterSpacing: '0.05em' }}>{progress}%</span>
          </div>

          {/* Glowing Track */}
          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(0, 229, 255, 0.2)',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0085ff, #00e5ff, #10b981)',
                boxShadow: '0 0 12px #00e5ff',
                transition: 'width 0.1s ease-out',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
