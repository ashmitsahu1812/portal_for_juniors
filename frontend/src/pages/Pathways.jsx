import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPathways } from '../api/client';
import { Milestone, ArrowRight } from 'lucide-react';

export default function Pathways() {
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPathways()
      .then(setPathways)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <h2>
          <Milestone size={24} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-purple)' }} />
          Learning Paths
        </h2>
        <p>Master specific topics step-by-step. Solve problems to unlock new levels.</p>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="card-grid">
            <div className="skeleton" style={{ height: 200 }} />
          </div>
        ) : pathways.length === 0 ? (
          <div className="empty-state">
            <Milestone size={48} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>No paths available</p>
            <p>Check back later for new learning roadmaps.</p>
          </div>
        ) : (
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {pathways.map((path) => (
              <div key={path._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', transition: 'transform 0.2s, box-shadow 0.2s' }}
                   onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                   onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #a855f7, #6382ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Milestone color="#fff" size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{path.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-purple)' }}>{path.levels.length} Levels</span>
                  </div>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  {path.description}
                </p>

                <Link to={`/paths/${path._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}>
                  Start Learning <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
