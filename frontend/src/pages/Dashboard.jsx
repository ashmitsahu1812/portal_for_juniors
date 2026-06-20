import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchModules, fetchPathways } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Code2, CheckCircle, Clock, Zap, ArrowRight, TrendingUp, Star, Target, Milestone } from 'lucide-react';

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
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      fetchModules(1).then(setModules),
      fetchPathways().then(setPathways)
    ]).finally(() => setLoading(false));
  }, []);

  const quizScores = user?.progress?.quizScores || [];
  const earnedMarks = quizScores.reduce((sum, q) => sum + (q.score || 0), 0);
  const totalMarks = quizScores.reduce((sum, q) => sum + (q.totalMarks || 0), 0);
  const quizAccuracy = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) + '%' : '0%';

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
          <StatCard value={quizAccuracy} label="Quiz Accuracy" color="red" icon={Target} />
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

        {/* ── Learning Paths ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
            <TrendingUp size={16} style={{ display: 'inline', marginRight: '0.4rem', color: 'var(--accent-purple)' }} />
            Learning Paths
          </h3>
          <Link to="/paths" style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="card-grid">
            <div className="skeleton" style={{ height: 160 }} />
            <div className="skeleton" style={{ height: 160 }} />
          </div>
        ) : pathways.length === 0 ? (
          <div className="empty-state">
            <Milestone size={48} />
            <p>No learning paths available.</p>
          </div>
        ) : (
          <div className="card-grid">
            {pathways.slice(0, 3).map((path) => (
              <div key={path._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', transition: 'transform 0.2s', position: 'relative' }}
                   onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                   onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '12px 12px 0 0',
                  background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Milestone color="var(--accent-purple)" size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>{path.title}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{path.levels?.length || 0} Levels</span>
                  </div>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', flex: 1, marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {path.description}
                </p>

                <Link to={`/paths/${path._id}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
                  Start Learning <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}
