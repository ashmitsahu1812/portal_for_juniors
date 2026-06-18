import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchModules } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, Code2, CheckCircle, Clock, Zap, ArrowRight,
  TrendingUp, Star,
} from 'lucide-react';

/* ── Quick-stat card ──────────────────────────────────────────────────────── */
function StatCard({ value, label, color, icon: Icon }) {
  return (
    <div className={`stat-card ${color}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color="var(--text-secondary)" />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchModules(1).then(setModules).finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Star size={20} color="var(--accent-yellow)" />
              Welcome back! 👋
            </h2>
            <p>Your CS Semester 1 learning hub — quizzes, lectures, and coding challenges.</p>
          </div>
          <Link to="/modules" className="btn btn-primary">
            Explore Modules <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className="page-body">
        {/* ── Stats grid ─────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          <StatCard value={loading ? '…' : modules.length} label="Modules Available" color="blue"   icon={BookOpen}    />
          <StatCard value={user?.progress?.quizScores?.length || 0}  label="Quizzes Completed" color="purple" icon={CheckCircle}  />
          <StatCard value={user?.progress?.solvedProblems?.filter(p => p.verdict === 'Accepted').length || 0}  label="Problems Solved"   color="green"  icon={Code2}        />
          <StatCard value="0"  label="Hours Studied"     color="red"    icon={Clock}        />
        </div>

        {/* ── Hero banner ─────────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          border: '1px solid var(--border)',
          borderRadius: 16, padding: '2rem', marginBottom: '2.5rem',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative orb */}
          <div style={{
            position: 'absolute', right: '-4rem', top: '-4rem',
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Zap size={22} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Getting Started</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 500, lineHeight: 1.65 }}>
            Start with <strong style={{ color: 'var(--text-primary)' }}>Introduction to Programming</strong> — 
            browse the lecture notes from the sidebar, attempt the module quizzes, and then solve the practice problems 
            in the Coding Arena using our sandboxed online judge.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/modules" className="btn btn-primary">
              <BookOpen size={15} /> Browse Syllabus
            </Link>
            <Link to="/arena" className="btn btn-ghost">
              <Code2 size={15} /> Open Coding Arena
            </Link>
          </div>
        </div>

        {/* ── Recent modules ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
            <TrendingUp size={16} style={{ display: 'inline', marginRight: '0.4rem', color: 'var(--accent-blue)' }} />
            Semester 1 Modules
          </h3>
          <Link to="/modules" style={{ fontSize: '0.82rem', color: 'var(--accent-blue)', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="card-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 160 }} />
            ))}
          </div>
        ) : modules.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} />
            <p>No modules published yet. Run <code>npm run seed</code> in the backend.</p>
          </div>
        ) : (
          <div className="card-grid">
            {modules.slice(0, 3).map((mod) => (
              <div key={mod._id} className="card" style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '12px 12px 0 0',
                  background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <BookOpen size={16} color="var(--accent-blue)" />
                  <span className="badge badge-blue">Sem {mod.semester}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.4rem' }}>{mod.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  {mod.description.slice(0, 90)}…
                </p>
                <Link
                  to={`/modules/${mod._id}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.9rem', fontSize: '0.82rem', color: 'var(--accent-blue)', textDecoration: 'none' }}
                >
                  Open Module <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
