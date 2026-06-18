import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizByModule, fetchModule } from '../api/client';
import QuizPlayer from '../components/QuizPlayer';
import {
  ArrowLeft, Clock, HelpCircle, Zap, BookOpen,
} from 'lucide-react';

export default function QuizPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [module, setModule]   = useState(null);
  const [quiz,   setQuiz]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    Promise.all([
      fetchModule(moduleId).catch(() => null),
      fetchQuizByModule(moduleId).catch(() => null),
    ]).then(([mod, q]) => {
      setModule(mod);
      setQuiz(q);
      if (!q) setError('No quiz is available for this module yet.');
    }).finally(() => setLoading(false));
  }, [moduleId]);

  if (loading) return (
    <div className="page-body">
      <div className="skeleton" style={{ height: 200 }} />
    </div>
  );

  if (started && quiz) {
    return (
      <div className="page-body">
        <QuizPlayer quiz={quiz} onClose={() => navigate(`/modules/${moduleId}`)} />
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/modules/${moduleId}`)} style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={14} /> Back to Module
        </button>
        <h2>Module Quiz</h2>
        {module && <p>{module.title}</p>}
      </div>

      <div className="page-body">
        {error ? (
          <div className="empty-state">
            <HelpCircle size={48} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>{error}</p>
          </div>
        ) : quiz ? (
          /* Pre-quiz instructions card */
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div className="card glow-blue" style={{ padding: '2.5rem', textAlign: 'center' }}>
              {/* Icon */}
              <div style={{
                width: 72, height: 72, borderRadius: 20, margin: '0 auto 1.5rem',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(34,211,238,0.1))',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={32} color="var(--accent-blue)" />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {quiz.title}
              </h3>
              {quiz.instructions && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.65 }}>
                  {quiz.instructions}
                </p>
              )}

              {/* Meta grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem', marginBottom: '2rem',
              }}>
                {[
                  { label: 'Questions',   value: quiz.questions?.length ?? 0,        icon: HelpCircle },
                  { label: 'Time Limit',  value: quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} min` : 'No limit', icon: Clock },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '0.9rem',
                  }}>
                    <Icon size={16} color="var(--accent-blue)" style={{ margin: '0 auto 0.4rem', display: 'block' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Rules */}
              <div style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 10, padding: '1rem', textAlign: 'left', marginBottom: '2rem',
              }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--accent-yellow)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  ⚠ Rules
                </p>
                <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.8 }}>
                  <li>Each question has exactly one correct answer.</li>
                  <li>Answers and explanations are revealed only after submission.</li>
                  <li>The quiz auto-submits when the timer expires.</li>
                  <li>You cannot retake a quiz once submitted.</li>
                </ul>
              </div>

              <button className="btn btn-primary btn-lg" onClick={() => setStarted(true)} style={{ width: '100%', justifyContent: 'center' }}>
                <Zap size={17} /> Start Quiz Now
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
