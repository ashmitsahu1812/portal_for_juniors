import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Check, BookOpen, Layers, Sparkles } from 'lucide-react';
import { useCourse } from '../context/CourseContext';

export default function CourseDropdown({ fullWidth = false }) {
  const { courses, activeCourse, activeSemester, selectCourse, setSemester } = useCourse();
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
      className="course-dropdown-container"
      ref={dropdownRef}
      style={{
        position: 'relative',
        display: fullWidth ? 'block' : 'inline-block',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      {/* Trigger Button matching the screenshot pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="course-dropdown-btn"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: fullWidth ? 'space-between' : 'flex-start',
          gap: '0.65rem',
          width: fullWidth ? '100%' : 'auto',
          padding: fullWidth ? '0.55rem 0.75rem' : '0.45rem 0.95rem',
          background: 'var(--bg-elevated)',
          border: '2px solid var(--border-bright, #fff)',
          borderRadius: '10px',
          boxShadow: '2px 2px 0px 0px var(--border-bright, #fff)',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontSize: '0.86rem',
          fontWeight: 600,
          fontFamily: "'Space Grotesk', sans-serif",
          transition: 'all 0.15s ease',
        }}
      >
        {/* Course icon matching blue shield/book style in screenshot */}
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: 'rgba(0, 133, 255, 0.15)',
            border: '1.5px solid var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-blue)',
            flexShrink: 0,
          }}
        >
          <Layers size={13} strokeWidth={2.5} />
        </div>

        <span style={{ letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
          {activeCourse.name}
          <span
            style={{
              marginLeft: '0.45rem',
              fontSize: '0.72rem',
              padding: '1px 6px',
              borderRadius: '6px',
              background: activeSemester === 2 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 133, 255, 0.15)',
              color: activeSemester === 2 ? '#10b981' : 'var(--accent-blue)',
              fontWeight: 700,
              border: '1px solid currentColor',
            }}
          >
            Sem {activeSemester}
          </span>
        </span>

        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: 'var(--text-muted)',
            marginLeft: '0.2rem',
          }}
        />
      </button>

      {/* Popover Dropdown matching screenshot */}
      {isOpen && (
        <div
          className="course-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: '340px',
            maxWidth: '90vw',
            background: 'var(--bg-card)',
            border: '2px solid var(--border)',
            borderRadius: '14px',
            boxShadow: 'var(--shadow-hard, 4px 4px 0px 0px #000)',
            padding: '1.1rem 1rem',
            zIndex: 100,
            animation: 'dropdownFadeIn 0.15s ease-out',
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Your Courses
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '3px 8px',
                cursor: 'pointer',
              }}
            >
              Show All
            </button>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
            Find your recently opened courses here
          </p>

          {/* Quick Semester Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              padding: '0.3rem',
              background: 'var(--bg-surface)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              marginBottom: '0.9rem',
            }}
          >
            <button
              type="button"
              onClick={() => setSemester(1)}
              style={{
                flex: 1,
                padding: '0.35rem 0.5rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: '6px',
                border: activeSemester === 1 ? '1.5px solid var(--border)' : '1.5px solid transparent',
                background: activeSemester === 1 ? 'var(--accent-blue)' : 'transparent',
                color: activeSemester === 1 ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Semester 1
            </button>
            <button
              type="button"
              onClick={() => setSemester(2)}
              style={{
                flex: 1,
                padding: '0.35rem 0.5rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: '6px',
                border: activeSemester === 2 ? '1.5px solid var(--border)' : '1.5px solid transparent',
                background: activeSemester === 2 ? '#10b981' : 'transparent',
                color: activeSemester === 2 ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Semester 2 🚀
            </button>
          </div>

          {/* Course List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {courses.map((course) => {
              const isSelected = activeCourse.id === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => {
                    selectCourse(course);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(0, 133, 255, 0.12)' : 'var(--bg-elevated)',
                    border: isSelected ? '1.5px solid var(--accent-blue)' : '1px solid var(--border)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'var(--bg-surface)';
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'var(--bg-elevated)';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: isSelected ? 700 : 600,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {course.name}
                      </span>
                      {course.semester && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: course.semester === 2 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 133, 255, 0.15)',
                            color: course.semester === 2 ? '#10b981' : 'var(--accent-blue)',
                          }}
                        >
                          Sem {course.semester}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {course.status || 'Enrolled'}
                    </span>
                  </div>

                  {isSelected && (
                    <ChevronRight size={18} color="var(--accent-blue)" strokeWidth={2.5} />
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
