import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchProblem, fetchProblemsByModule, fetchModules, fetchProblems } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import CodeEditor from '../components/CodeEditor';
import {
  ArrowLeft, Code2, BookOpen, ChevronRight, Clock, Cpu,
  Eye, EyeOff, LayoutPanelLeft, CheckCircle, Sparkles, Filter,
  Search, X, RotateCcw, Tag, Check, Layers
} from 'lucide-react';

const diffClass = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };

function normalizeMathNotation(text = '') {
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, '\n```text\n$1\n```')
    .replace(/\\\(([\s\S]*?)\\\)/g, '`$1`')
    .replace(/\$\$([\s\S]*?)\$\$/g, '\n```text\n$1\n```')
    .replace(/\$([^$\n]+)\$/g, '`$1`')
    .replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '$1/$2')
    .replace(/\\sqrt\s*\{([^{}]+)\}/g, '√$1')
    .replace(/\\(?:leq?|le)(?![a-z])/g, '≤')
    .replace(/\\(?:geq?|ge)(?![a-z])/g, '≥')
    .replace(/\\times(?![a-z])/g, '×')
    .replace(/\\cdot(?![a-z])/g, '·')
    .replace(/\\neq(?![a-z])/g, '≠')
    .replace(/\\notin(?![a-z])/g, '∉')
    .replace(/\\in(?![a-z])/g, '∈')
    .replace(/\\(?:infty|infinity)(?![a-z])/g, '∞')
    .replace(/\\pi(?![a-z])/g, 'π')
    .replace(/\\pm(?![a-z])/g, '±')
    .replace(/\\approx(?![a-z])/g, '≈')
    .replace(/\\%/g, '%')
    .replace(/\\(?:left|right)(?![a-z])/g, '')
    .replace(/\\(?:text|mathrm)\{([^{}]*)\}/g, '$1');
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

/* ── Test case panel shown in the left pane ─────────────────────────────────── */
function TestCasePanel({ testCases, hiddenTestCaseCount = 0 }) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!testCases || testCases.length === 0) {
    return <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>No sample input/output is available for this problem yet. Submit runs against {hiddenTestCaseCount} hidden test case{hiddenTestCaseCount === 1 ? '' : 's'}.</p>;
  }

  const tc = testCases[activeIdx];
  return (      <div style={{ marginTop: '1.5rem' }}>
      <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
        Sample Test Cases
      </h4>

      {/* Tabs */}
      {hiddenTestCaseCount > 0 && <p style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hiddenTestCaseCount} additional hidden test case{hiddenTestCaseCount === 1 ? '' : 's'} run on submission.</p>}
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
function ProblemList({ currentId, problems, fromUrl }) {
  const { user } = useAuth();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {problems.map((p) => {
        const isSolved = user?.progress?.solvedProblems?.some(sp => sp.problemId === p._id && sp.verdict === 'Accepted');
        return (
          <Link
            key={p._id}
            to={`/arena/${p._id}`}
            state={{ from: fromUrl || '/arena' }}
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
   CodingArena — full split-pane IDE layout with filters and smart back navigation
───────────────────────────────────────────────────────────────────────────── */
export default function CodingArena() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { activeSemester, setSemester } = useCourse();

  const [problem,  setProblem]  = useState(null);
  const [allProbs, setAllProbs] = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Default to saved semester filter, or 1 (since 116 problems currently exist in sem 1)
  const [selectedSemFilter, setSelectedSemFilter] = useState(() => {
    const saved = sessionStorage.getItem('arena_sem_filter');
    if (saved) return saved === 'all' ? 'all' : Number(saved);
    return 1;
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState(() => sessionStorage.getItem('arena_search') || '');
  const [difficultyFilter, setDifficultyFilter] = useState(() => sessionStorage.getItem('arena_diff') || 'all');
  const [statusFilter, setStatusFilter] = useState(() => sessionStorage.getItem('arena_status') || 'all');
  const [selectedTag, setSelectedTag] = useState(() => sessionStorage.getItem('arena_tag') || 'all');
  const [selectedModule, setSelectedModule] = useState(() => sessionStorage.getItem('arena_module') || 'all');

  // Sync filters to sessionStorage for instant restoration on back navigation
  useEffect(() => {
    sessionStorage.setItem('arena_search', searchQuery);
  }, [searchQuery]);
  useEffect(() => {
    sessionStorage.setItem('arena_diff', difficultyFilter);
  }, [difficultyFilter]);
  useEffect(() => {
    sessionStorage.setItem('arena_status', statusFilter);
  }, [statusFilter]);
  useEffect(() => {
    sessionStorage.setItem('arena_tag', selectedTag);
  }, [selectedTag]);
  useEffect(() => {
    sessionStorage.setItem('arena_module', selectedModule);
  }, [selectedModule]);

  // Semester change handler
  const handleSemChange = (sem) => {
    setSelectedSemFilter(sem);
    sessionStorage.setItem('arena_sem_filter', String(sem));
    if (sem !== 'all') {
      setSemester(sem);
    }
  };

  /* Smart Back Navigation Handlers */
  const handleProblemBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/arena');
    }
  };

  const handlePageBack = () => {
    if (location.state?.from && location.state.from !== '/arena') {
      navigate(location.state.from);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  /* Load problem + sibling problem list */
  useEffect(() => {
    if (!problemId) {
      setLoading(true);
      const semParam = selectedSemFilter === 'all' ? undefined : Number(selectedSemFilter);
      fetchProblems(semParam)
        .then((probs) => setAllProbs(probs || []))
        .catch((err) => {
          console.error("Failed to fetch problems:", err);
          setAllProbs([]);
        })
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
      .then((related) => setAllProbs(related || []))
      .catch((err) => {
        console.error("Failed to load problem:", err);
        setProblem(null);
      })
      .finally(() => setLoading(false));
  }, [problemId, selectedSemFilter]);

  // Available modules & tags
  const availableModules = useMemo(() => {
    return Array.from(
      new Set(allProbs.map((p) => p.moduleId?.title || 'General Challenges'))
    ).sort();
  }, [allProbs]);

  const { tagCounts, topTags } = useMemo(() => {
    const counts = allProbs.reduce((acc, p) => {
      (p.tags || []).forEach((t) => {
        acc[t] = (acc[t] || 0) + 1;
      });
      return acc;
    }, {});
    const tags = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
    return { tagCounts: counts, topTags: tags };
  }, [allProbs]);

  // Overall counts for badges
  const easyCount = useMemo(() => allProbs.filter((p) => p.difficulty === 'Easy').length, [allProbs]);
  const medCount = useMemo(() => allProbs.filter((p) => p.difficulty === 'Medium').length, [allProbs]);
  const hardCount = useMemo(() => allProbs.filter((p) => p.difficulty === 'Hard').length, [allProbs]);
  const solvedCount = useMemo(() => {
    return allProbs.filter((p) =>
      user?.progress?.solvedProblems?.some((sp) => sp.problemId === p._id && sp.verdict === 'Accepted')
    ).length;
  }, [allProbs, user]);

  // Filtered problems computation
  const filteredProbs = useMemo(() => {
    return allProbs.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = p.title?.toLowerCase().includes(q);
        const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q));
        const moduleMatch = p.moduleId?.title?.toLowerCase().includes(q);
        if (!titleMatch && !tagMatch && !moduleMatch) return false;
      }

      // 2. Difficulty
      if (difficultyFilter !== 'all') {
        if (p.difficulty?.toLowerCase() !== difficultyFilter.toLowerCase()) return false;
      }

      // 3. Status (Solved / Unsolved)
      if (statusFilter !== 'all') {
        const isSolved = user?.progress?.solvedProblems?.some(
          (sp) => sp.problemId === p._id && sp.verdict === 'Accepted'
        );
        if (statusFilter === 'solved' && !isSolved) return false;
        if (statusFilter === 'unsolved' && isSolved) return false;
      }

      // 4. Tag
      if (selectedTag !== 'all') {
        const hasTag = p.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
        if (!hasTag) return false;
      }

      // 5. Module
      if (selectedModule !== 'all') {
        const modTitle = p.moduleId?.title || 'General Challenges';
        if (modTitle !== selectedModule) return false;
      }

      return true;
    });
  }, [allProbs, searchQuery, difficultyFilter, statusFilter, selectedTag, selectedModule, user]);

  const isAnyFilterActive =
    searchQuery.trim() !== '' ||
    difficultyFilter !== 'all' ||
    statusFilter !== 'all' ||
    selectedTag !== 'all' ||
    selectedModule !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
    setStatusFilter('all');
    setSelectedTag('all');
    setSelectedModule('all');
  };

  /* ── No problem selected screen (Coding Arena / Questions List) ─────────────────── */
  if (!problemId) {
    return (
      <>
        <div className="page-header">
          {/* Top navigation row with back button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <button
              type="button"
              onClick={handlePageBack}
              className="btn btn-ghost btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                background: 'var(--bg-elevated)',
                borderRadius: '7px',
              }}
              title="Go back"
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2>
                <Code2 size={22} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-blue)', verticalAlign: 'middle' }} />
                Coding Arena
              </h2>
              <p>
                {selectedSemFilter === 2
                  ? 'Semester 2 algorithmic challenges, data structures & practice problem bank.'
                  : selectedSemFilter === 1
                  ? 'Semester 1 foundational algorithmic challenges and online judge problems.'
                  : 'Practice algorithmic problems with instant multi-language compilation & verdicts.'}
              </p>
            </div>

            {/* Semester Tabs */}
            <div
              style={{
                display: 'flex',
                background: 'var(--bg-elevated)',
                border: '2px solid var(--border)',
                borderRadius: '10px',
                padding: '3px',
                gap: '4px',
              }}
            >
              <button
                type="button"
                onClick={() => handleSemChange(1)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: selectedSemFilter === 1 ? 'var(--accent-blue)' : 'transparent',
                  color: selectedSemFilter === 1 ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Semester 1
              </button>
              <button
                type="button"
                onClick={() => handleSemChange(2)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: selectedSemFilter === 2 ? '#10b981' : 'transparent',
                  color: selectedSemFilter === 2 ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Semester 2 🔥
              </button>
              <button
                type="button"
                onClick={() => handleSemChange('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: selectedSemFilter === 'all' ? 'var(--text-primary)' : 'transparent',
                  color: selectedSemFilter === 'all' ? 'var(--bg-base)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                All
              </button>
            </div>
          </div>
        </div>

        <div className="page-body">
          {/* ═══ FILTER SECTION CARD ════════════════════════════════════════════ */}
          <div
            className="card"
            style={{
              padding: '1.25rem',
              marginBottom: '1.75rem',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              background: 'var(--bg-elevated)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Row 1: Search bar + Module dropdown */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', flex: '1 1 320px', minWidth: '240px' }}>
                <Search
                  size={16}
                  color="var(--text-muted)"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search questions by title, topic, or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 2.2rem 0.65rem 2.4rem',
                    background: 'var(--bg-base)',
                    border: '2px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    fontFamily: "'Space Grotesk', sans-serif",
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent-blue)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Module Filter Dropdown */}
              {availableModules.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                  <Layers size={15} color="var(--accent-purple)" />
                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '8px',
                      border: '2px solid var(--border)',
                      background: 'var(--bg-base)',
                      color: selectedModule === 'all' ? 'var(--text-secondary)' : 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    <option value="all">All Modules ({availableModules.length})</option>
                    {availableModules.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Row 2: Difficulty Filter Chips & Status Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              {/* Difficulty Chips */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.2rem' }}>
                  Difficulty:
                </span>
                {[
                  { id: 'all', label: 'All', count: allProbs.length, color: 'var(--text-secondary)' },
                  { id: 'Easy', label: 'Easy', count: easyCount, color: '#10b981' },
                  { id: 'Medium', label: 'Medium', count: medCount, color: '#f59e0b' },
                  { id: 'Hard', label: 'Hard', count: hardCount, color: '#ef4444' },
                ].map((d) => {
                  const isSelected = difficultyFilter.toLowerCase() === d.id.toLowerCase();
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDifficultyFilter(isSelected && d.id !== 'all' ? 'all' : d.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '7px',
                        border: isSelected ? '2px solid var(--border-bright)' : '1px solid var(--border)',
                        background: isSelected ? 'var(--bg-base)' : 'transparent',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                      <span>{d.label}</span>
                      <span style={{ opacity: 0.7, fontSize: '0.72rem' }}>({d.count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Status Filter Chips */}
              <div style={{ display: 'flex', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: '8px', padding: '2px', gap: '2px' }}>
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  style={{
                    padding: '0.35rem 0.7rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: statusFilter === 'all' ? 700 : 500,
                    background: statusFilter === 'all' ? 'var(--bg-elevated)' : 'transparent',
                    color: statusFilter === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  All Status
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('solved')}
                  style={{
                    padding: '0.35rem 0.7rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: statusFilter === 'solved' ? 700 : 500,
                    background: statusFilter === 'solved' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    color: statusFilter === 'solved' ? '#10b981' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <CheckCircle size={12} color="#10b981" /> Solved ({solvedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('unsolved')}
                  style={{
                    padding: '0.35rem 0.7rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: statusFilter === 'unsolved' ? 700 : 500,
                    background: statusFilter === 'unsolved' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    color: statusFilter === 'unsolved' ? '#ef4444' : 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  Unsolved ({allProbs.length - solvedCount})
                </button>
              </div>
            </div>

            {/* Row 3: Popular Topic Tag Pills */}
            {topTags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.65rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.2rem' }}>
                  Topics:
                </span>
                {topTags.map((tag) => {
                  const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(isSelected ? 'all' : tag)}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '12px',
                        border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border)',
                        background: isSelected ? 'rgba(0, 133, 255, 0.18)' : 'var(--bg-base)',
                        color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      #{tag} <span style={{ opacity: 0.65 }}>({tagCounts[tag]})</span>
                    </button>
                  );
                })}
                {selectedTag !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedTag('all')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-purple)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: '2px 4px',
                      fontWeight: 600,
                    }}
                  >
                    Clear topic
                  </button>
                )}
              </div>
            )}

            {/* Row 4: Summary row and Reset button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span>
                  Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredProbs.length}</strong> of {allProbs.length} questions
                </span>
                {solvedCount > 0 && (
                  <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    • <CheckCircle size={13} /> {filteredProbs.filter(p => user?.progress?.solvedProblems?.some(sp => sp.problemId === p._id && sp.verdict === 'Accepted')).length} solved
                  </span>
                )}
              </div>

              {isAnyFilterActive && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.08)',
                    borderRadius: '6px',
                  }}
                >
                  <RotateCcw size={12} /> Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* ═══ PROBLEMS LIST OR EMPTY STATES ══════════════════════════════════ */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton" style={{ height: 60 }} />
              ))}
            </div>
          ) : allProbs.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: 'rgba(0, 133, 255, 0.1)',
                  border: '2px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <Code2 size={32} color="var(--accent-blue)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {selectedSemFilter === 2
                  ? 'Semester 2 Coding Arena Ready!'
                  : 'No problems found'}
              </h3>
              <p style={{ maxWidth: 450, margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {selectedSemFilter === 2
                  ? 'Ready for your Semester 2 questions! Share the questions you would like to import, and they will be added here with full test suite coverage.'
                  : 'No problems are available for this filter.'}
              </p>
              {selectedSemFilter === 2 && (
                <button
                  type="button"
                  onClick={() => handleSemChange(1)}
                  className="btn btn-ghost btn-sm"
                >
                  View Semester 1 Problems
                </button>
              )}
            </div>
          ) : filteredProbs.length === 0 ? (
            <div className="empty-state" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '14px',
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: '2px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <Filter size={28} color="var(--accent-purple)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                No questions match your filters
              </h3>
              <p style={{ maxWidth: 440, margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                We couldn't find any questions matching your current search query or filter combination.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RotateCcw size={14} /> Clear All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {Object.entries(
                filteredProbs.reduce((acc, p) => {
                  const group = p.moduleId?.title || 'General Challenges';
                  if (!acc[group]) acc[group] = [];
                  acc[group].push(p);
                  return acc;
                }, {})
              ).map(([moduleTitle, problems]) => (
                <div key={moduleTitle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {moduleTitle}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {problems.length} {problems.length === 1 ? 'problem' : 'problems'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {problems.map((p) => {
                      const isSolved = user?.progress?.solvedProblems?.some(
                        (sp) => sp.problemId === p._id && sp.verdict === 'Accepted'
                      );
                      return (
                        <Link
                          key={p._id}
                          to={`/arena/${p._id}`}
                          state={{ from: location.pathname + location.search }}
                          style={{ textDecoration: 'none' }}
                        >
                          <div
                            className="card"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem',
                              padding: '1rem',
                              border: isSolved ? '3px solid var(--accent-green, #10b981)' : '3px solid var(--border)',
                              transition: 'transform 0.15s ease, border-color 0.15s ease',
                            }}
                            onMouseOver={(e) => {
                              if (!isSolved) e.currentTarget.style.borderColor = 'var(--border-bright)';
                            }}
                            onMouseOut={(e) => {
                              if (!isSolved) e.currentTarget.style.borderColor = 'var(--border)';
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                background: isSolved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.08)',
                                border: isSolved ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {isSolved ? (
                                <CheckCircle size={18} color="var(--accent-green, #10b981)" />
                              ) : (
                                <Code2 size={18} color="var(--accent-blue)" />
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600 }}>{p.title}</div>
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span className={`badge ${diffClass[p.difficulty] ?? ''}`}>{p.difficulty}</span>
                                {p.semester && (
                                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
                                    Sem {p.semester}
                                  </span>
                                )}
                                {p.tags?.slice(0, 3).map((t) => (
                                  <span key={t} style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <ChevronRight size={16} color="var(--text-muted)" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
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
      <button onClick={handleProblemBack} className="btn btn-primary btn-sm">
        Back to Questions
      </button>
    </div>
  );

  /* ── Full split-pane IDE ────────────────────────────────────────────────── */
  return (
    <div className="arena-shell">

      {/* ═══ LEFT PANE — Problem Description ════════════════════════════════ */}
      <div className="arena-left">
        {/* Left header */}
        <div className="arena-pane-header">
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleProblemBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.65rem', fontWeight: 600 }}
            title="Go back"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
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
              {normalizeMathNotation(problem.description)}
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
          <TestCasePanel key={problem._id} testCases={problem.testCases} hiddenTestCaseCount={problem.hiddenTestCaseCount} />

          {/* Related problems */}
          {allProbs.length > 1 && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                More in this module
              </div>
              <ProblemList currentId={problem._id} problems={allProbs} fromUrl={location.state?.from || '/arena'} />
            </div>
          )}
        </div>
      </div>

      {/* ═══ RIGHT PANE — Monaco Editor ══════════════════════════════════════ */}
      <div className="arena-right">
        <CodeEditor key={problem._id} problem={problem} />
      </div>
    </div>
  );
}
