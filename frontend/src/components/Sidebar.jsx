import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Code2, BarChart3, Zap, GraduationCap, FileText, LogOut, Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard'        },
  { to: '/modules',     icon: BookOpen,        label: 'Syllabus Modules' },
  { to: '/notes',       icon: FileText,        label: 'Lecture Notes'   },
  { to: '/arena',       icon: Code2,           label: 'Coding Arena'    },
  { to: '/progress',   icon: BarChart3,        label: 'Progress Tracker' },
  { to: '/leaderboard', icon: Trophy,          label: 'Leaderboard'     },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.15rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6382ff, #22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GraduationCap size={18} color="#fff" strokeWidth={2.5} />
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</span>
            </div>
            <button onClick={logout} className="btn" style={{ padding: '0.4rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', cursor: 'pointer' }} title="Log out">
              <LogOut size={16} color="var(--text-secondary)" />
            </button>
          </div>
        )}
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          Powered by <span style={{ color: 'var(--accent-blue)' }}>Piston API</span>
        </div>
      </div>
    </aside>
  );
}
