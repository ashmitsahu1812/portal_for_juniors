import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchProblem, fetchProblemsByModule, fetchModules } from '../api/client';
import { useAuth } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import {
  ArrowLeft, Code2, BookOpen, ChevronRight, Clock, Cpu,
  Eye, EyeOff, LayoutPanelLeft, CheckCircle
} from 'lucide-react';

const diffClass = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

/* ── Test case panel shown in the left pane ─────────────────────────────────── */
function TestCasePanel({ testCases }) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!testCases || testCases.length === 0) return null;

  const tc = testCases[activeIdx];
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
        Sample Test Cases
      </h4>

      {/* Tabs */}
      <div className="tab-bar" style={{ padding: '0.4rem 0', background: 'none', border: 'none', marginBottom: '0.75rem' }}>
        {testCases.map((_, i) => (
          <button key={i} className={`tab ${activeIdx === i ? 'active' : ''}`} onClick={() => setActiveIdx(i)}>
            Case {i + 1}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Input</div>
        <div className="console-box" style={{ minHeight: 'auto', padding: '0.65rem 0.9rem', whiteSpace: 'pre-wrap' }}>
          {tc.input || <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>(empty)</span>}
        </div>
      </div>

      {/* Expected Output */}
      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expected Output</div>
        <div className="console-box" style={{ minHeight: 'auto', padding: '0.65rem 0.9rem', whiteSpace: 'pre-wrap' }}>
          {tc.expectedOutput}
        </div>
      </div>
    </div>
  );
}

/* ── Problem list sidebar (for arena index) ──────────────────────────────────── */
function ProblemList({ currentId, problems }) {
  const { user } = useAuth();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {problems.map((p) => {
        const isSolved = user?.progress?.solvedProblems?.some(sp => sp.problemId === p._id && sp.verdict === 'Accepted');
        return (
          <Link
            key={p._id}
            to={`/arena/${p._id}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.6rem 0.8rem', borderRadius: 8, textDecoration: 'none',
              background: p._id === currentId ? 'rgba(255,255,255,0.12)' : 'var(--bg-elevated)',
              border: `1px solid ${isSolved ? 'var(--accent-green, #10b981)' : (p._id === currentId ? 'var(--border-bright)' : 'var(--border)')}`,
              color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 500,
            }}
          >
            {isSolved ? <CheckCircle size={13} color="var(--accent-green, #10b981)" /> : <Code2 size={13} color={p._id === currentId ? 'var(--accent-blue)' : 'var(--text-muted)'} />}
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
            <span className={`badge ${diffClass[p.difficulty] ?? ''}`}>{p.difficulty}</span>
          </Link>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CodingArena — full split-pane IDE layout
───────────────────────────────────────────────────────────────────────────── */
export default function CodingArena() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem,  setProblem]  = useState(null);
  const [allProbs, setAllProbs] = useState([]);
  const [loading,  setLoading]  = useState(true);

  /* Load problem + sibling problem list */
  useEffect(() => {
    if (!problemId) {
      // No problem selected — show all problems across all modules
      fetchModules(1)
        .then((mods) => Promise.all(mods.map((m) => fetchProblemsByModule(m._id))))
        .then((arrays) => setAllProbs(arrays.flat()))
        .finally(() => setLoading(false));
      return;
    }

    setLoading(true);
    fetchProblem(problemId)
      .then((p) => {
        setProblem(p);
        if (p.isCommunity || !p.moduleId) {
          return [];
        }
        return fetchProblemsByModule(p.moduleId);
      })
      .then(setAllProbs)
      .catch((err) => {
        console.error("Failed to load problem:", err);
        setProblem(null);
      })
      .finally(() => setLoading(false));
  }, [problemId]);

  /* ── No problem selected screen ─────────────────────────────────────────── */
  if (!problemId) {
    return (
      <>
        <div className="page-header">
          <h2>
            <Code2 size={20} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-blue)' }} />
            Coding Arena
          </h2>
          <p>Practice algorithmic problems with an online judge — instant feedback, all 4 languages.</p>
        </div>
        <div className="page-body">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 60 }} />)}
            </div>
          ) : allProbs.length === 0 ? (
            <div className="empty-state">
              <Code2 size={48} />
              <p>No problems available. Seed the database first.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {allProbs.map((p) => {
                const isSolved = user?.progress?.solvedProblems?.some(sp => sp.problemId === p._id && sp.verdict === 'Accepted');
                return (
                <Link key={p._id} to={`/arena/${p._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                    border: isSolved ? '3px solid var(--accent-green, #10b981)' : '3px solid var(--border)'
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: isSolved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.08)', 
                      border: isSolved ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {isSolved ? <CheckCircle size={18} color="var(--accent-green, #10b981)" /> : <Code2 size={18} color="var(--accent-blue)" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{p.title}</div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <span className={`badge ${diffClass[p.difficulty] ?? ''}`}>{p.difficulty}</span>
                        {p.tags?.slice(0,3).map(t => (
                          <span key={t} style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>#{t}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </div>
      </>
    );
  }

  /* ── Problem loading ────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="arena-shell">
      <div className="arena-left">
        <div className="arena-pane-body">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="skeleton" style={{ height: 24, marginBottom: '0.75rem' }} />
          ))}
        </div>
      </div>
      <div className="arena-right">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <span className="spinner" style={{ width: 28, height: 28 }} />
        </div>
      </div>
    </div>
  );

  if (!problem) return (
    <div className="page-body empty-state">
      <Code2 size={48} />
      <p>Problem not found.</p>
      <Link to="/arena" className="btn btn-primary btn-sm">Back to Arena</Link>
    </div>
  );

  /* ── Full split-pane IDE ────────────────────────────────────────────────── */
  return (
    <div className="arena-shell">

      {/* ═══ LEFT PANE — Problem Description ════════════════════════════════ */}
      <div className="arena-left">
        {/* Left header */}
        <div className="arena-pane-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/arena')}>
            <ArrowLeft size={13} />
          </button>
          <span style={{ flex: 1, fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {problem.title}
          </span>
          <span className={`badge ${diffClass[problem.difficulty] ?? ''}`}>{problem.difficulty}</span>
        </div>

        {/* Problem content */}
        <div className="arena-pane-body">
          {/* Meta row */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {problem.allowedLanguages?.map((l) => (
              <span key={l} className="badge badge-blue">{l}</span>
            ))}
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Clock size={12} /> {problem.timeLimitSeconds}s
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Cpu size={12} /> {problem.memoryLimitMB}MB
            </span>
          </div>

          {/* Markdown description */}
          <div className="md-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {problem.description}
            </ReactMarkdown>
          </div>

          {/* Constraints */}
          {problem.constraints && (
            <div style={{
              marginTop: '1.25rem', padding: '0.9rem',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                Constraints
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {problem.constraints}
              </p>
            </div>
          )}

          {/* Sample test cases */}
          <TestCasePanel testCases={problem.testCases} />

          {/* Related problems */}
          {allProbs.length > 1 && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                More in this module
              </div>
              <ProblemList currentId={problem._id} problems={allProbs} />
            </div>
          )}
        </div>
      </div>

      {/* ═══ RIGHT PANE — Monaco Editor ══════════════════════════════════════ */}
      <div className="arena-right">
        <CodeEditor problem={problem} />
      </div>
    </div>
  );
}
