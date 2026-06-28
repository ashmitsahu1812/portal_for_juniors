import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

export default function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      if (isBreak) {
        // Break finished, back to work
        setTimeLeft(25 * 60);
        setIsBreak(false);
        setIsActive(false);
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
      } else {
        // Work finished, start break
        setTimeLeft(5 * 60);
        setIsBreak(true);
        setIsActive(false);
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const skipPhase = () => {
    setIsActive(false);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(25 * 60);
    } else {
      setIsBreak(true);
      setTimeLeft(5 * 60);
    }
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  // Calculate progress for stroke-dasharray (circumference ~ 283)
  const totalSeconds = isBreak ? 5 * 60 : 25 * 60;
  const progress = (timeLeft / totalSeconds) * 283;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '2px solid var(--border)',
      boxShadow: 'var(--shadow-hard-sm)',
      borderRadius: '12px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Timer size={18} color={isBreak ? 'var(--accent-green)' : 'var(--accent-red)'} />
          {isBreak ? 'Break Time' : 'Focus Time'}
        </h3>
        <button onClick={skipPhase} style={{ fontSize: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
          Skip
        </button>
      </div>

      <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="120" height="120" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-surface)" strokeWidth="6" />
          <circle cx="50" cy="50" r="45" fill="none" 
                  stroke={isBreak ? 'var(--accent-green)' : 'var(--accent-red)'} 
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray="283" strokeDashoffset={283 - progress}
                  style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div style={{ position: 'absolute', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
          {minutes}:{seconds}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
        <button onClick={toggleTimer} className="btn" style={{ flex: 1, background: isActive ? 'var(--bg-surface)' : 'var(--accent-blue)', color: isActive ? 'var(--text-primary)' : '#fff', border: '2px solid var(--border)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          {isActive ? <><Pause size={16}/> Pause</> : <><Play size={16}/> Start</>}
        </button>
        <button onClick={resetTimer} className="btn" style={{ background: 'var(--bg-surface)', border: '2px solid var(--border)', display: 'flex', justifyContent: 'center', alignItems: 'center' }} title="Reset">
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
