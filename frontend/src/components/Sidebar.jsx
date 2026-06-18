import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Code2, BarChart3, Zap, Terminal, FileText, LogOut, Trophy, Milestone, Moon, Sun, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard'        },
  { to: '/paths',       icon: Milestone,       label: 'Learning Paths'   },
  { to: '/modules',     icon: BookOpen,        label: 'Quizzes'          },
  { to: '/notes',       icon: FileText,        label: 'Lecture Notes'   },
  { to: '/arena',       icon: Code2,           label: 'Coding Arena'    },
  { to: '/progress',   icon: BarChart3,        label: 'Progress Tracker' },
  { to: '/leaderboard', icon: Trophy,          label: 'Leaderboard'     },
  { to: '/community',   icon: Users,           label: 'Community Hub'   },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.15rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 0,
            background: 'var(--accent-purple)',
            border: '2px solid #000',
            boxShadow: '2px 2px 0px 0px #000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Terminal size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <h1>FreshmanPortal</h1>
        </div>
        <p>Semester 1 · CS Dept.</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}

        <div className="nav-section-label" style={{ marginTop: '1.25rem' }}>Quick Access</div>
        <NavLink to="/modules" className="nav-link">
          <Zap size={16} strokeWidth={2} />
          Latest Module
        </NavLink>
      </nav>

      {/* Footer / User Profile */}
      <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
              <button onClick={toggleTheme} className="btn" style={{ padding: '0.4rem', background: 'var(--bg-elevated)', border: '2px solid var(--border)', boxShadow: '2px 2px 0px 0px var(--border)', cursor: 'pointer', color: 'var(--text-primary)' }} title="Toggle Theme">
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button onClick={logout} className="btn" style={{ padding: '0.4rem', background: 'var(--bg-elevated)', border: '2px solid var(--border)', boxShadow: '2px 2px 0px 0px var(--border)', cursor: 'pointer', color: 'var(--text-primary)' }} title="Log out">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      </aside>
    </>
  );
}
