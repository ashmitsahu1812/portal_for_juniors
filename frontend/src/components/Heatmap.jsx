import React from 'react';

export default function Heatmap({ activeDays = [] }) {
  // Generate the last 364 days (52 weeks * 7 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today
  
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  // Group by weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="heatmap-container" style={{
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
      border: '1px solid var(--border)',
      borderRadius: '16px', padding: '1.5rem', width: '100%', overflowX: 'auto',
      marginBottom: '2.5rem'
    }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        Contribution Activity
      </h3>
      <div style={{ display: 'flex', gap: '4px', minWidth: 'max-content' }}>
        {weeks.map((week, wIdx) => (
          <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {week.map((day, dIdx) => {
              // Format date cleanly, accounting for local timezone shifts to match server UTC assumption simply
              const dateStr = day.toLocaleDateString('en-CA'); // e.g. YYYY-MM-DD
              
              // We compare against the activeDays array
              const isActive = activeDays.includes(dateStr);
              return (
                <div
                  key={dIdx}
                  title={`${isActive ? 'Activity on ' : 'No activity on '}${dateStr}`}
                  style={{
                    width: '12px', height: '12px', borderRadius: '3px',
                    background: isActive ? 'var(--accent-green, #10b981)' : 'rgba(255,255,255,0.06)',
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
        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-green, #10b981)' }} />
        <span>More</span>
      </div>
    </div>
  );
}
