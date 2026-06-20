import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Heatmap({ activeDays = [] }) {
  const { isDarkMode } = useTheme();

  // Generate the last 364 days (52 weeks * 7 days) aligned to UTC
  const today = new Date();
  
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    days.push(d);
  }

  // Group into weeks
  const weeks = [];
  let currentWeek = [];

  // Pad the first week using UTC day
  const firstDayOfWeek = days[0].getUTCDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <div className="heatmap-container" style={{
      display: 'flex', flexDirection: 'column',
      background: isDarkMode ? 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' : 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '16px', padding: '1.5rem', width: '100%', overflowX: 'auto',
      marginBottom: '2.5rem',
      boxShadow: 'var(--shadow-hard)'
    }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        Contribution Activity
      </h3>
      <div style={{ display: 'flex', gap: '4px', minWidth: 'max-content' }}>
        {weeks.map((week, wIdx) => (
          <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {week.map((day, dIdx) => {
              if (!day) return <div key={dIdx} style={{ width: '12px', height: '12px' }} />;

              // Format date cleanly using UTC to match the server's UTC assumption
              const dateStr = day.toISOString().split('T')[0];
              
              // We compare against the activeDays array
              const isActive = activeDays.includes(dateStr);
              return (
                <div
                  key={dIdx}
                  title={`${isActive ? 'Activity on ' : 'No activity on '}${dateStr}`}
                  style={{
                    width: '12px', height: '12px', borderRadius: '3px',
                    background: isActive ? 'var(--accent-green, #10b981)' : (isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                    transition: 'all 0.15s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'none'}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <span>Less</span>
        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-green, #10b981)' }} />
        <span>More</span>
      </div>
    </div>
  );
}
