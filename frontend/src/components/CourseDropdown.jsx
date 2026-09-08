import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
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

  return (
    <div
      className="semester-switcher-wrapper"
      ref={dropdownRef}
      style={{
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Switcher Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.4rem',
          padding: '0.45rem 0.6rem',
          background: '#141414',
          border: `2px solid ${isOpen ? 'var(--accent-blue, #0085ff)' : '#333333'}`,
          borderRadius: '8px',
          boxShadow: isOpen ? '2px 2px 0px 0px var(--accent-blue, #0085ff)' : '2px 2px 0px 0px #000000',
          cursor: 'pointer',
          color: '#ffffff',
          fontFamily: "'Space Grotesk', sans-serif",
          transition: 'all 0.15s ease',
          textAlign: 'left',
        }}
        onMouseOver={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#555555';
        }}
        onMouseOut={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#333333';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, overflow: 'hidden' }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: activeSemester === 2 ? '#10b981' : '#0085ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.75rem',
            }}
          >
            {activeSemester}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.2, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Semester {activeSemester}
            </span>
            <span style={{ fontSize: '0.67rem', color: '#888888', lineHeight: 1.2 }}>
              CS & AIML Dept.
            </span>
          </div>
        </div>

        <ChevronDown
          size={14}
          color={isOpen ? 'var(--accent-blue, #0085ff)' : '#888888'}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
            marginLeft: '0.2rem',
          }}
        />
      </button>

      {/* Dropdown Menu - strictly contained inside sidebar */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '100%',
            boxSizing: 'border-box',
            background: '#111111',
            border: '2px solid #333333',
            borderRadius: '8px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.8), 2px 2px 0px 0px #000000',
            padding: '0.4rem',
            zIndex: 90,
            animation: 'dropdownFadeIn 0.15s ease-out',
          }}
        >
          <div
            style={{
              fontSize: '0.64rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#666666',
              padding: '0.2rem 0.35rem 0.3rem',
            }}
          >
            Select Semester
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(0, 133, 255, 0.15)' : 'transparent',
                    border: isSelected ? '1px solid var(--accent-blue, #0085ff)' : '1px solid transparent',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        background: sem.semester === 2 ? '#10b981' : '#0085ff',
                        color: '#fff',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {sem.semester}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? 700 : 600,
                          color: isSelected ? '#ffffff' : '#cccccc',
                          lineHeight: 1.2,
                        }}
                      >
                        {sem.title}
                      </span>
                      <span style={{ fontSize: '0.64rem', color: '#777777', lineHeight: 1.2 }}>
                        {sem.tag}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check
                      size={14}
                      color="var(--accent-blue, #0085ff)"
                      strokeWidth={3}
                      style={{ flexShrink: 0 }}
                    />
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
