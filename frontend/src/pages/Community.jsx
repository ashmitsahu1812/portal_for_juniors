import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Code2, AlertTriangle } from 'lucide-react';
import api from '../api/client';

export default function Community() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunityProblems();
  }, []);

  const fetchCommunityProblems = async () => {
    try {
      const res = await api.get('/community/problems');
      if (res.data.success) {
        setProblems(res.data.problems);
      }
    } catch (err) {
      console.error("Failed to fetch community problems", err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyBadge = (diff) => {
    if (diff === 'Easy') return <span className="badge badge-easy">EASY</span>;
    if (diff === 'Medium') return <span className="badge badge-medium">MEDIUM</span>;
    return <span className="badge badge-hard">HARD</span>;
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <>
      <header className="page-header flex-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Users size={28} color="var(--accent-purple)" />
            <h2>Community Hub</h2>
          </div>
          <p>Solve problems created by your peers, or challenge them with your own!</p>
        </div>
        <button 
          className="btn btn-primary btn-lg" 
          onClick={() => navigate('/community/create')}
        >
          <Plus size={20} strokeWidth={3} />
          Create Problem
        </button>
      </header>

      <main className="page-body">
        {problems.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={48} />
            <h3 style={{ fontSize: '1.5rem', color: '#000' }}>No problems yet!</h3>
            <p>Be the first student to create a coding challenge for the community.</p>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/community/create')}>
              Create Problem
            </button>
          </div>
        ) : (
          <div className="card-grid">
            {problems.map((prob) => (
              <div key={prob._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{prob.title}</h3>
                  {getDifficultyBadge(prob.difficulty)}
                </div>
                
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>
                  Created by: <strong>{prob.authorId?.name || 'Unknown Student'}</strong>
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button 
                    className="btn btn-success" 
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => navigate(`/arena/${prob._id}`)}
                  >
                    <Code2 size={16} />
                    Solve Challenge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
