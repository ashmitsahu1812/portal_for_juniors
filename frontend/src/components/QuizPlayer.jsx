import { useState, useCallback, useRef } from 'react';
import { submitQuiz } from '../api/client';
import api from '../api/client';
import { useTimer } from '../hooks/useTimer';
import {
  Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  AlertCircle, Lightbulb, Trophy,
} from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

/* ─────────────────────────────────────────────────────────────────────────────
   QuizPlayer — full timed quiz experience
───────────────────────────────────────────────────────────────────────────── */
export default function QuizPlayer({ quiz, onClose }) {
  const [answers, setAnswers]         = useState({});   // { questionId: index }
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [phase, setPhase]             = useState('quiz'); // 'quiz' | 'submitting' | 'results'
  const [results, setResults]         = useState(null);
  const [error, setError]             = useState('');
  const startTimeRef                  = useRef(Date.now());

  const totalQuestions = quiz.questions.length;
  const answered       = Object.keys(answers).length;
  const currentQ       = quiz.questions[currentIdx];

  /* Timer */
  const handleExpire = useCallback(() => handleSubmit(), [answers]);
  const { formatted, percentLeft, start, isRunning } = useTimer(
    (quiz.timeLimitMinutes ?? 20) * 60,
    handleExpire
  );

  // Auto-start timer on mount
  const timerStarted = useRef(false);
  if (!timerStarted.current) {
    timerStarted.current = true;
    setTimeout(() => start(), 0);
  }

  /* Select option */
  const select = (questionId, idx) => {
    setAnswers((prev) => ({ ...prev, [questionId]: idx }));
  };

  /* Submit */
  async function handleSubmit() {
    setPhase('submitting');
    const timeTakenSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex,
      })),
      timeTakenSeconds,
    };

    try {
      const data = await submitQuiz(quiz._id, payload);
      setResults(data);
      setPhase('results');

      // Record progress if user is authenticated
      try {
        await api.post('/progress/quiz', {
          moduleId: quiz.moduleId,
          score: data.score,
          totalMarks: data.totalMarks,
        });
      } catch (err) {
        console.error('Failed to update quiz progress', err);
      }
    } catch {
      setError('Submission failed. Please try again.');
      setPhase('quiz');
    }
  }

  /* ── Results screen ─────────────────────────────────────────────────────── */
  if (phase === 'results' && results) {
    return <QuizResults results={results} quiz={quiz} onClose={onClose} />;
  }

  /* ── Timer colour ───────────────────────────────────────────────────────── */
  const timerColor = percentLeft > 40 ? 'var(--accent-green)'
    : percentLeft > 20 ? 'var(--accent-yellow)'
    : 'var(--accent-red)';

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{quiz.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
            Question {currentIdx + 1} of {totalQuestions} · {answered} answered
          </p>
        </div>

        {/* Timer pill */}
        {quiz.timeLimitMinutes && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--bg-elevated)', border: `1px solid ${timerColor}33`,
            borderRadius: 100, padding: '0.45rem 1rem',
            color: timerColor, fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700, fontSize: '1rem',
          }}>
            <Clock size={15} />
            {formatted.minutes}:{formatted.seconds}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track" style={{ marginBottom: '1.75rem' }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* ── Question card ────────────────────────────────────────────────── */}
      <div className="card glow-blue" style={{ marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
          marginBottom: '1.25rem',
        }}>
          <span style={{
            background: 'rgba(255,255,255,0.12)', color: 'var(--accent-blue)',
            borderRadius: 6, padding: '0.2rem 0.55rem',
            fontSize: '0.78rem', fontWeight: 700, flexShrink: 0,
          }}>
            Q{currentIdx + 1}
          </span>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
            {currentQ.questionText}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {currentQ.options.map((opt, i) => {
            const isSelected = answers[currentQ._id] === i;
            return (
              <button
                key={i}
                className={`quiz-option ${isSelected ? 'selected' : ''}`}
                onClick={() => select(currentQ._id, i)}
              >
                <span className={`option-marker`}>{OPTION_LABELS[i]}</span>
                <span style={{ lineHeight: 1.5 }}>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      {error && (
        <div style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          <AlertCircle size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
        <button
          className="btn btn-ghost"
          onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
          disabled={currentIdx === 0}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {currentIdx < totalQuestions - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentIdx((p) => p + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={phase === 'submitting'}
            >
              {phase === 'submitting' ? (
                <><span className="spinner" /> Submitting…</>
              ) : (
                <><CheckCircle size={16} /> Submit Quiz</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Question dots */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.5rem' }}>
        {quiz.questions.map((q, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            style={{
              width: 30, height: 30, borderRadius: 6, border: 'none',
              cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
              transition: 'all 0.15s',
              background: i === currentIdx
                ? 'var(--accent-blue)'
                : answers[q._id] !== undefined
                ? 'rgba(255,255,255,0.25)'
                : 'var(--bg-elevated)',
              color: i === currentIdx
                ? '#fff'
                : answers[q._id] !== undefined
                ? 'var(--accent-green)'
                : 'var(--text-muted)',
              outline: i === currentIdx ? '2px solid rgba(255,255,255,0.5)' : 'none',
              outlineOffset: 2,
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   QuizResults — post-submission breakdown screen
───────────────────────────────────────────────────────────────────────────── */
function QuizResults({ results, quiz, onClose }) {
  const { score, totalMarks, percentage, timeTakenSeconds, results: breakdown } = results;
  const isPassing = percentage >= 60;

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      {/* Score card */}
      <div className="card" style={{
        textAlign: 'center', marginBottom: '2rem', padding: '2.5rem',
        background: isPassing
          ? 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(34,211,238,0.05))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05))',
        border: `1px solid ${isPassing ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.25)'}`,
      }}>
        <Trophy size={40} color={isPassing ? 'var(--accent-green)' : 'var(--accent-yellow)'} style={{ margin: '0 auto 1rem' }} />
        <div style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: isPassing ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {percentage}%
        </div>
        <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          {score} / {totalMarks} marks · {isPassing ? '✓ Passed' : '✗ Needs Review'}
        </div>
        {timeTakenSeconds && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Completed in {Math.floor(timeTakenSeconds / 60)}m {timeTakenSeconds % 60}s
          </div>
        )}
      </div>

      {/* Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {breakdown.map((item, i) => (
          <div key={item.questionId} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, marginTop: '0.1rem' }}>
                {item.isCorrect
                  ? <CheckCircle size={20} color="var(--accent-green)" />
                  : <XCircle    size={20} color="var(--accent-red)" />
                }
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>Q{i + 1}.</span>
                  {item.questionText}
                </p>

                {/* Show all options with result state */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {quiz.questions[i].options.map((opt, j) => {
                    const isCorrect  = j === item.correctOptionIndex;
                    const isSelected = j === item.selectedOptionIndex;
                    const cls = isCorrect ? 'correct' : (isSelected && !isCorrect) ? 'incorrect' : '';
                    return (
                      <div key={j} className={`quiz-option ${cls}`} style={{ cursor: 'default', padding: '0.6rem 0.9rem' }}>
                        <span className="option-marker">{OPTION_LABELS[j]}</span>
                        <span style={{ fontSize: '0.85rem' }}>{opt}</span>
                        {isCorrect  && <CheckCircle size={14} color="var(--accent-green)" style={{ marginLeft: 'auto' }} />}
                        {isSelected && !isCorrect && <XCircle size={14} color="var(--accent-red)" style={{ marginLeft: 'auto' }} />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <div style={{
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 8, padding: '0.75rem 1rem',
                    display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                  }}>
                    <Lightbulb size={15} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {item.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={onClose}>
          ← Back to Module
        </button>
      </div>
    </div>
  );
}
