import { useEffect, useState } from 'react';
import { fetchModules } from '../api/client';
import ModuleCard from '../components/ModuleCard';
import { BookOpen, Search, Filter } from 'lucide-react';

export default function ModulesPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [semester, setSemester] = useState('all');

  useEffect(() => {
    const sem = semester === 'all' ? undefined : Number(semester);
    setLoading(true);
    fetchModules(sem).then(setModules).finally(() => setLoading(false));
  }, [semester]);

  const filtered = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h2>
          <BookOpen size={20} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-blue)' }} />
          Syllabus Modules
        </h2>
        <p>Browse lectures, PDFs, quizzes, and coding problems for each topic.</p>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '0.45rem 0.9rem', flex: 1, maxWidth: 340,
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search modules…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: 'var(--text-primary)', fontSize: '0.875rem', width: '100%',
              }}
            />
          </div>

          {/* Semester filter */}
          <select
            className="select-styled"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4].map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="card-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={{ height: 220 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>No modules found</p>
            <p>Try a different search term or seed the database first.</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
              Showing {filtered.length} module{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="card-grid">
              {filtered.map((mod) => <ModuleCard key={mod._id} module={mod} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
