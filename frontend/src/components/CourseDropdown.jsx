import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Layers, Sparkles } from 'lucide-react';
import { useCourse } from '../context/CourseContext';

export default function CourseDropdown() {
  const { semesters, activeSemester, setSemester } = useCourse();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = semesters.find((s) => s.semester === activeSemester) || semesters[0];

  return (
    <div
      className="semester-switcher-wrapper"
      ref={dropdownRef}
      style={{ position: 'relative', width: '100%', marginTop: '0.65rem' }}
    >
      {/* Switcher Button inside Sidebar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          padding: '0.45rem 0.65rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          cursor: 'pointer',
          color: '#ffffff',
          fontFamily: "'Space Grotesk', sans-serif",
          transition: 'all 0.15s ease',
          textAlign: 'left',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.borderColor = 'var(--accent-blue)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: activeSemester === 2 ? '#10b981' : 'var(--accent-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.72rem',
            }}
          >
            {activeSemester}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.2, color: '#fff' }}>
              Semester {activeSemester}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#888', lineHeight: 1.2 }}>
              CS & AIML Dept.
            </span>
          </div>
        </div>

        <ChevronDown
          size={14}
          color="#aaa"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            minWidth: '240px',
            background: '#111111',
            border: '2px solid #333333',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.8), 2px 2px 0px 0px var(--accent-blue)',
            padding: '0.5rem',
            zIndex: 100,
            animation: 'dropdownFadeIn 0.15s ease-out',
          }}
        >
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#777',
              padding: '0.3rem 0.5rem 0.4rem',
            }}
          >
            Choose Semester
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {semesters.map((sem) => {
              const isSelected = sem.semester === activeSemester;
              return (
                <div
                  key={sem.id}
                  onClick={() => {
                    setSemester(sem.semester);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    padding: '0.55rem 0.65rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(0, 133, 255, 0.15)' : 'transparent',
                    border: isSelected ? '1px solid var(--accent-blue)' : '1px solid transparent',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? 700 : 600,
                          color: isSelected ? '#fff' : '#ccc',
                        }}
                      >
                        {sem.title}
                      </span>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: sem.semester === 2 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          color: sem.semester === 2 ? '#34d399' : '#aaa',
                        }}
                      >
                        {sem.tag}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#777', lineHeight: 1.3 }}>
                      {sem.focus}
                    </span>
                  </div>

                  {isSelected && (
                    <Check size={14} color="var(--accent-blue)" strokeWidth={3} style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
