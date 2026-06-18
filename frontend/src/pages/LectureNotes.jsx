import { useEffect, useState, useMemo } from 'react';
import { fetchModules } from '../api/client';
import { BookOpen, FileText, Download, Search, PlayCircle } from 'lucide-react';

export default function LectureNotes() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchModules()
      .then(setModules)
      .finally(() => setLoading(false));
  }, []);

  // Filter out modules that have no PDFs, then filter by search query
  const modulesWithNotes = useMemo(() => {
    return modules
      .filter((m) => m.pdfUrls?.length > 0)
      .filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.pdfUrls.some((pdf) => pdf.label.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [modules, searchQuery]);

  const getPdfUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://localhost:5001')) {
      const apiBase = import.meta.env.VITE_API_URL;
      if (apiBase && apiBase !== '/api') {
        const backendHost = apiBase.replace(/\/api$/, '');
        return url.replace('http://localhost:5001', backendHost);
      }
    }
    return url;
  };

  return (
    <>
      <div className="page-header">
        <h2>
          <BookOpen size={20} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-blue)' }} />
          Lecture Notes
        </h2>
        <p>Access all your class materials, PDFs, and study guides in one place.</p>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', borderRadius: 8, padding: '0.45rem 0.9rem', flex: 1, maxWidth: 340,
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search notes or modules…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', width: '100%' }}
            />
          </div>
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="card-grid">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 220 }} />)}
          </div>
        ) : modulesWithNotes.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>No lecture notes found</p>
            <p>Try a different search term or upload PDFs to a module.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Hardcoded YouTube link */}
            {(!searchQuery || 'Problem solving in Python'.toLowerCase().includes(searchQuery.toLowerCase())) && (
              <section className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(34,211,238,0.1))',
                    border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <PlayCircle size={18} color="var(--text-primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Problem solving in Python</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      External Resource · 1 Video
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  <a
                    href="https://youtu.be/LNteQNuGF-E?si=-dHhQ09Nc0y467Ei"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-item"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s' }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <PlayCircle size={16} color="var(--text-primary)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                        Watch Video
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        YouTube
                      </div>
                    </div>
                    <Download size={14} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0 }} />
                  </a>
                </div>
              </section>
            )}

            {/* System and Web Essentials YouTube link */}
            {(!searchQuery || 'System and Web Essentials'.toLowerCase().includes(searchQuery.toLowerCase())) && (
              <section className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(34,211,238,0.1))',
                    border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <PlayCircle size={18} color="var(--text-primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>System and Web Essentials</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      External Resource · 1 Video
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  <a
                    href="https://youtu.be/HcOc7P5BMi4?si=5GQgxHxIz9706mJB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-item"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s' }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <PlayCircle size={16} color="var(--text-primary)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                        Watch Video
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        YouTube
                      </div>
                    </div>
                    <Download size={14} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0 }} />
                  </a>
                </div>
              </section>
            )}
            
            {modulesWithNotes.map((mod) => (
              <section key={mod._id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(34,211,238,0.1))',
                    border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <BookOpen size={18} color="var(--accent-blue)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{mod.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Semester {mod.semester} · {mod.pdfUrls.length} File{mod.pdfUrls.length !== 1 && 's'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {mod.pdfUrls
                    .filter(pdf => pdf.label.toLowerCase().includes(searchQuery.toLowerCase()) || mod.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((pdf, i) => (
                      <a
                        key={i}
                        href={getPdfUrl(pdf.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf-item"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s' }}
                      >
                        <div style={{
                          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <FileText size={16} color="var(--accent-red)" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                            {pdf.label}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                            PDF Document
                          </div>
                        </div>
                        <Download size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      </a>
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
