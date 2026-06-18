import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchModule, fetchProblemsByModule } from '../api/client';
import {
  ArrowLeft, ExternalLink, Code2, ChevronRight,
  BookOpen, Lightbulb, Download,
} from 'lucide-react';

const diffClass = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module,   setModule]   = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetchModule(id),
      fetchProblemsByModule(id),
    ]).then(([mod, probs]) => {
      setModule(mod);
      setProblems(probs);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-body">
      <div className="skeleton" style={{ height: 60, marginBottom: '1rem' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 80 }} />)}
      </div>
    </div>
  );

  if (!module) return (
    <div className="page-body empty-state">
      <BookOpen size={48} />
      <p>Module not found.</p>
      <Link to="/modules" className="btn btn-primary btn-sm">Back to Modules</Link>
    </div>
  );

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/modules')} style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={14} /> All Modules
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-blue">Semester {module.semester}</span>
            </div>
            <h2>{module.title}</h2>
            <p style={{ marginTop: '0.4rem' }}>{module.description}</p>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
            <Link to={`/modules/${id}/quiz`} className="btn btn-primary">
              Take Quiz <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {/* Quiz CTA */}
          <div style={{
            marginTop: '1.5rem',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.06))',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 12, padding: '2rem', textAlign: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Lightbulb size={32} color="var(--accent-purple)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Ready to test yourself?</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                  Take the timed multiple-choice quiz to test your knowledge of this module.
                </div>
              </div>
            </div>
            <Link to={`/modules/${id}/quiz`} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              Start Module Quiz <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
