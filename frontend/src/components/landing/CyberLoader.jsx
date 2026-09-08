import React, { useState, useEffect } from 'react';
import { Terminal, FastForward } from 'lucide-react';

const BOOT_LOGS = [
  '>> INITIALIZING KICK START v2.0...',
  '>> CONNECTING TO MONGO ATLAS DATABASE [OK]',
  '>> LOADING SYLLABUS: SEMESTER 1 & SEMESTER 2 [OK]',
  '>> MOUNTING ONLINE JUDGE (C, C++, PYTHON, JAVA) [READY]',
  '>> STARTING MULTIPLAYER 1v1 BATTLE ENGINE [ONLINE]',
  '>> READY. WELCOME JUNIORS.',
];

export default function CyberLoader({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Fast increment progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + 12, 100);
      });
    }, 80);

    // Boot logs queue
    BOOT_LOGS.forEach((log, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, (idx + 1) * 160);
    });

    // Complete loader after 1.5 seconds total
    const finishTimeout = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        onComplete();
      }, 300);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(finishTimeout);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000000',
        color: '#ffffff',
        fontFamily: "'JetBrains Mono', monospace",
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Terminal Window in pure Black & Blue Neo-Brutalist style */}
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#0a0a0a',
          border: '2px solid #0085ff',
          boxShadow: '6px 6px 0px 0px #0085ff',
          borderRadius: '0px',
          padding: '1.5rem',
          position: 'relative',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #222222',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 22,
                height: 22,
                background: '#0085ff',
                border: '1.5px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Terminal size={13} color="#fff" strokeWidth={3} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em' }}>
              KICK START // RESTART
            </span>
          </div>

          <button
            onClick={handleSkip}
            style={{
              background: '#141414',
              border: '1.5px solid #333',
              color: '#888888',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '3px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#0085ff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#888888';
              e.currentTarget.style.borderColor = '#333';
            }}
          >
            SKIP <FastForward size={10} />
          </button>
        </div>

        {/* Logs */}
        <div
          style={{
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            fontSize: '0.78rem',
            lineHeight: 1.4,
            marginBottom: '1.25rem',
          }}
        >
          {logs.map((log, i) => (
            <div
              key={i}
              style={{
                color: i === logs.length - 1 ? '#0085ff' : '#a0a0a0',
                fontWeight: i === logs.length - 1 ? 700 : 400,
              }}
            >
              {log}
            </div>
          ))}
          <div style={{ color: '#0085ff', fontWeight: 900, animation: 'blink 0.8s infinite' }}>_</div>
        </div>

        {/* Progress Bar */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#888888',
              marginBottom: '0.4rem',
              textTransform: 'uppercase',
            }}
          >
            <span>BOOTING SYSTEM</span>
            <span style={{ color: '#0085ff' }}>{progress}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: '#1a1a1a',
              border: '1px solid #333333',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#0085ff',
                transition: 'width 0.1s ease-out',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
