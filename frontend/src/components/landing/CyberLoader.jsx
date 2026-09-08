import React, { useState, useEffect, useRef } from 'react';
import { Terminal, FastForward, Cpu, Radio, ShieldCheck, Zap } from 'lucide-react';

const BOOT_LOGS = [
  { at: 3, msg: '[0.012s] KERNEL_INIT // Booting isolated v8 sandbox runtime...' },
  { at: 14, msg: '[0.048s] MEMORY_POOL // Allocating isolated Docker worker processes...' },
  { at: 28, msg: '[0.092s] SYLLABUS_PACK // Loading Semester 1 (18 modules, 97 problems)...' },
  { at: 42, msg: '[0.145s] SEM2_MOUNT // Mounting DSA, OOP C++, DBMS, Web tracks...' },
  { at: 58, msg: '[0.201s] SANDBOX_ENGINE // Linking C++, Python, C, Java compilers [OK]' },
  { at: 72, msg: '[0.264s] MULTIPLAYER_NET // Initializing 1v1 Battle Arena matchmaking...' },
  { at: 84, msg: '[0.318s] LEADERBOARD_DB // Syncing global streak metrics & duels...' },
  { at: 94, msg: '[0.372s] AUTH_GATEWAY // Secure student token handshake established [OK]' },
  { at: 100, msg: '[0.420s] SYSTEM_ONLINE // All subsystems nominal. Entering Portal...' },
];

export default function CyberLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([BOOT_LOGS[0].msg]);
  const [isFading, setIsFading] = useState(false);
  const canvasRef = useRef(null);

  // Matrix Digital Rain on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01010101<>{}[]/*+=~#$_C++_PYTHON_DSA_SQL_SEM2_STACK_HEAP';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Front char is bright cyan/white, tail is signature blue
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = '#0085ff';
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 0-100% Counter & Kernel Log Progress (Cinematic ~3.8s total duration)
  useEffect(() => {
    let curr = 0;
    const interval = setInterval(() => {
      // Smooth dynamic cyber cadence: step mostly +1 or +2 with occasional brief burst
      const rand = Math.random();
      let step = 1;
      if (rand > 0.85) {
        step = Math.floor(Math.random() * 3) + 2; // small burst
      } else if (rand < 0.15) {
        step = 0; // micro pause for realistic cyber feel
      } else {
        step = Math.floor(Math.random() * 2) + 1; // standard step (+1 or +2)
      }

      curr = Math.min(curr + step, 100);
      setProgress(curr);

      // Append active logs
      const activeLogs = BOOT_LOGS.filter(l => curr >= l.at).map(l => l.msg);
      setLogs(activeLogs);

      if (curr >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            onComplete();
          }, 400);
        }, 500);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 120);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000000',
        color: '#ffffff',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? 'none' : 'auto',
        transform: isFading ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Background Matrix Rain Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      />

      {/* CRT Scanline Overlay */}
      <div className="scanline-overlay" />

      {/* Pulsing Blue Ambient Aura */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 133, 255, 0.28) 0%, transparent 68%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          animation: 'pulseSlow 3s infinite ease-in-out',
        }}
      />

      {/* Top Left HUD Tech Telemetry */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '2rem',
          fontSize: '0.75rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: '#0085ff',
          lineHeight: 1.6,
          zIndex: 10,
          pointerEvents: 'none',
        }}
        className="hide-mobile"
      >
        <div>&gt; SYS_CLK // 120 FPS NOMINAL</div>
        <div>&gt; HOST // REstart.STUDENT_OS</div>
        <div>&gt; PROTOCOL // CS_AIML_V2</div>
      </div>

      {/* Top Right Skip Button */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', zIndex: 10 }}>
        <button
          onClick={handleSkip}
          style={{
            background: '#0a0a0a',
            border: '2px solid #0085ff',
            boxShadow: '3px 3px 0px 0px #0085ff',
            color: '#ffffff',
            fontSize: '0.8rem',
            fontWeight: 800,
            padding: '0.45rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#0085ff';
            e.currentTarget.style.color = '#000000';
            e.currentTarget.style.transform = 'translate(-2px, -2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#0a0a0a';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'none';
          }}
        >
          SKIP BOOT <FastForward size={13} />
        </button>
      </div>

      {/* ── Main Neo-Brutalist Cyber Loader Terminal ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          maxWidth: '560px',
          background: '#0a0a0a',
          border: '3px solid #0085ff',
          boxShadow: '10px 10px 0px 0px #0085ff',
          padding: '2rem',
        }}
      >
        {/* Corner HUD Accent Brackets */}
        <div style={{ position: 'absolute', top: 4, left: 6, color: '#0085ff', fontSize: '0.9rem', fontFamily: 'monospace' }}>┌</div>
        <div style={{ position: 'absolute', top: 4, right: 6, color: '#0085ff', fontSize: '0.9rem', fontFamily: 'monospace' }}>┐</div>
        <div style={{ position: 'absolute', bottom: 4, left: 6, color: '#0085ff', fontSize: '0.9rem', fontFamily: 'monospace' }}>└</div>
        <div style={{ position: 'absolute', bottom: 4, right: 6, color: '#0085ff', fontSize: '0.9rem', fontFamily: 'monospace' }}>┘</div>

        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #222222',
            paddingBottom: '0.85rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 26,
                height: 26,
                background: '#0085ff',
                border: '2px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 2px 0px 0px #ffffff',
              }}
            >
              <Terminal size={15} color="#000000" strokeWidth={3} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                Kick Start <span style={{ color: '#0085ff' }}>OS</span>
              </span>
              <span style={{ fontSize: '0.68rem', color: '#888888', fontWeight: 700, letterSpacing: '0.05em' }}>
                REstart INITIATIVE // SEM 1 & 2
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: '#0085ff', fontFamily: "'JetBrains Mono', monospace" }}>
            <Radio size={12} className="animate-pulse" />
            <span>SYNCING</span>
          </div>
        </div>

        {/* GIANT Funky 0-100% Counter */}
        <div style={{ textAlign: 'center', margin: '0.75rem 0 1.25rem' }}>
          <div
            style={{
              fontSize: 'clamp(5rem, 14vw, 7.5rem)',
              fontWeight: 900,
              fontFamily: "'JetBrains Mono', monospace",
              color: '#ffffff',
              lineHeight: 0.85,
              letterSpacing: '-0.06em',
              textShadow: '0 0 35px rgba(0, 133, 255, 0.75), 0 0 10px #0085ff',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
            }}
          >
            <span>{String(progress).padStart(3, ' ')}</span>
            <span style={{ fontSize: '3rem', color: '#0085ff', marginLeft: '0.3rem', textShadow: 'none' }}>%</span>
          </div>
        </div>

        {/* Live Kernel Logs Stream */}
        <div
          style={{
            background: '#000000',
            border: '2px solid #1f1f1f',
            padding: '0.75rem 0.9rem',
            height: '84px',
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            marginBottom: '1.25rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.73rem',
            color: '#0085ff',
            lineHeight: 1.45,
          }}
        >
          {logs.slice(-3).map((log, idx) => (
            <div key={idx} style={{ opacity: idx === logs.slice(-3).length - 1 ? 1 : 0.45 }}>
              &gt; {log}
            </div>
          ))}
        </div>

        {/* Funky Multi-Segment Progress Bar */}
        <div>
          <div
            style={{
              width: '100%',
              height: '16px',
              background: '#000000',
              border: '2px solid #222222',
              padding: '2px',
              display: 'flex',
              gap: '2px',
            }}
          >
            {Array.from({ length: 25 }).map((_, i) => {
              const active = progress >= (i + 1) * 4;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: '100%',
                    background: active ? '#0085ff' : '#111111',
                    boxShadow: active ? '0 0 8px #0085ff' : 'none',
                    transition: 'background 0.06s ease',
                  }}
                />
              );
            })}
          </div>

          {/* Equalizer Frequency Bars + Footer Metadata */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.75rem',
            }}
          >
            {/* Equalizer frequency bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px' }}>
              {[0.4, 0.9, 0.6, 1.0, 0.3, 0.8, 0.5, 0.95, 0.7, 0.4, 0.85, 0.6].map((rate, i) => (
                <div
                  key={i}
                  style={{
                    width: '3px',
                    background: '#0085ff',
                    boxShadow: '0 0 4px #0085ff',
                    animation: `eqBarBounce ${0.6 + (i % 4) * 0.2}s infinite ease-in-out alternate`,
                    animationDelay: `${i * 0.08}s`,
                    height: '40%',
                  }}
                />
              ))}
            </div>

            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#888888',
                fontFamily: "'JetBrains Mono', monospace",
                display: 'flex',
                gap: '1rem',
              }}
            >
              <span>ONLINE JUDGE: READY</span>
              <span style={{ color: '#0085ff' }}>PORTAL VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Subtext */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          fontSize: '0.75rem',
          color: '#555555',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.08em',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        [ ✦ REstart CS & AIML · AUTOMATED ONLINE JUDGE ✦ ]
      </div>
    </div>
  );
}
