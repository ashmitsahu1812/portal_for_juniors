import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchModules } from '../api/client';
import {
  BarChart3, BookOpen, Target, TrendingUp, Award, Lock,
  CheckCircle, Circle, Code2,
} from 'lucide-react';import { useAuth } from '../context/AuthContext';

export default function ProgressTracker() {
  const [modules,  setModules]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchModules(1).then(setModules).finally(() => setLoading(false));
  }, []);

  const totalModules  = modules.length;
  const doneModules   = user?.progress?.quizScores?.length || 0;
  const solvedProblems = user?.progress?.solvedProblems?.filter(p => p.verdict === 'Accepted').length || 0;
  const pct = totalModules ? Math.round((doneModules / totalModules) * 100) : 0;

  return (
    <>
      <div className="page-header">
        <h2>
          <BarChart3 size={20} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-purple)' }} />
          Progress Tracker
        </h2>
        <p>Track your quiz scores and problem-solving journey across all modules.</p>
      </div>

      <div className="page-body">
        {/* ── Overview stats ─────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { value: `${pct}%`,       label: 'Completion',       color: 'purple', Icon: Target     },
            { value: doneModules,      label: 'Quizzes Passed',   color: 'green',  Icon: CheckCircle},
            { value: totalModules,     label: 'Total Modules',    color: 'blue',   Icon: BookOpen   },
            { value: solvedProblems,   label: 'Problems Solved',  color: 'red',    Icon: Code2      },
          ].map(({ value, label, color, Icon }) => (
            <div key={label} className={`stat-card ${color}`}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Icon size={16} color="var(--text-muted)" />
              </div>
              <div className="stat-value">{loading ? '…' : value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Overall progress bar ────────────────────────────────────────── */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 600 }}>Overall Curriculum Progress</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{pct}%</span>
          </div>
          <div className="progress-bar-track" style={{ height: 10 }}>
            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))' }} />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
            {doneModules} of {totalModules} modules completed
          </p>
        </div>

        {/* ── Module-by-module breakdown ─────────────────────────────────── */}
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
          Module Breakdown
        </h3>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 80 }} />)}
          </div>
        ) : modules.length === 0 ? (
          <div className="empty-state">
            <TrendingUp size={48} />
            <p>No modules found. Complete your first quiz to start tracking!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {modules.map((mod, idx) => {
              const qs = user?.progress?.quizScores?.find(qs => qs.moduleId === mod._id);
              const quizDone    = !!qs;
              const quizScore   = qs ? `${qs.score} / ${qs.totalMarks}` : null;

              return (
                <div key={mod._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Step number */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: quizDone ? 'rgba(255,255,255,0.12)' : 'var(--bg-elevated)',
                    border: `1px solid ${quizDone ? 'rgba(255,255,255,0.25)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1rem', color: quizDone ? 'var(--accent-green)' : 'var(--text-muted)',
                  }}>
                    {quizDone ? <CheckCircle size={20} color="var(--accent-green)" /> : <span>{idx + 1}</span>}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {mod.title}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: quizDone ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                        {quizDone ? `✓ Quiz: ${quizScore ?? 'Complete'}` : '○ Quiz not started'}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    to={quizDone ? `/modules/${mod._id}` : `/modules/${mod._id}/quiz`}
                    className={`btn btn-sm ${quizDone ? 'btn-ghost' : 'btn-primary'}`}
                  >
                    {quizDone ? 'Review' : 'Start Quiz'}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
}
