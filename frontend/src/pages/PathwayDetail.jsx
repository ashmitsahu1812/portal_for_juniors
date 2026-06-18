import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPathway } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Milestone, Lock, Unlock, CheckCircle, PlayCircle, BookOpen, Code2 } from 'lucide-react';

export default function PathwayDetail() {
  const { id } = useParams();
  const [pathway, setPathway] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPathway(id)
      .then(setPathway)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading pathway...</div>;
  }

  if (!pathway) {
    return <div style={{ padding: '2rem' }}>Pathway not found.</div>;
  }

  // Determine which problems are solved
  const solvedProblemIds = new Set(
    (user?.progress?.solvedProblems || [])
      .filter((p) => p.verdict === 'Accepted')
      .map((p) => p.problemId)
  );

  // Helper to check if a level is completely solved
  const isLevelSolved = (level) => {
    if (!level.problems || level.problems.length === 0) return true;
    return level.problems.every((p) => solvedProblemIds.has(p._id));
  };

  // Helper to check if a level is unlocked
  // Level N is unlocked if Level N-1 is solved. Level 1 is always unlocked.
  const isLevelUnlocked = (levelIndex) => {
    if (levelIndex === 0) return true;
    const prevLevel = pathway.levels[levelIndex - 1];
    return isLevelSolved(prevLevel);
  };

  return (
    <>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>
          <Milestone size={24} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-purple)' }} />
          {pathway.title}
        </h2>
        <p>{pathway.description}</p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {pathway.levels.map((level, index) => {
          const unlocked = isLevelUnlocked(index);
          const solved = isLevelSolved(level);
          
          let statusColor = 'var(--bg-elevated)';
          let borderColor = 'var(--border)';
          let icon = <Lock size={20} color="var(--text-muted)" />;
          let titleColor = 'var(--text-muted)';
          
          if (solved) {
            statusColor = 'rgba(34, 197, 94, 0.1)';
            borderColor = 'var(--accent-green)';
            icon = <CheckCircle size={20} color="var(--accent-green)" />;
            titleColor = 'var(--accent-green)';
          } else if (unlocked) {
            statusColor = 'var(--bg-elevated)';
            borderColor = 'var(--accent-blue)';
            icon = <Unlock size={20} color="var(--accent-blue)" />;
            titleColor = 'var(--text-primary)';
          }

          return (
            <div key={level._id} className="card" style={{ 
              border: `2px solid ${borderColor}`, 
              background: statusColor,
              opacity: unlocked ? 1 : 0.6,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderBottom: unlocked ? '1px solid var(--border)' : 'none' }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: '50%', 
                  background: 'var(--bg-main)', border: `2px solid ${borderColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', color: titleColor
                }}>
                  {level.levelNumber}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: titleColor, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {level.title}
                  </h3>
                </div>
                <div>{icon}</div>
              </div>

              {unlocked && (
                <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                  
                  {/* Theory Section */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>
                      <BookOpen size={18} /> Learn
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                      {level.theoryText}
                    </p>
                  </div>

                  {/* YouTube Embed */}
                  {level.youtubeUrl && (
                    <div style={{ marginBottom: '2rem', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', margin: 0, background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                        <PlayCircle size={18} color="var(--accent-red)" /> Video Lecture
                      </h4>
                      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe 
                          src={level.youtubeUrl} 
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen 
                          title="Theory Video"
                        />
                      </div>
                    </div>
                  )}

                  {/* Practice Problems */}
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-purple)' }}>
                      <Code2 size={18} /> Practice to Unlock Next Level
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {level.problems.map((prob) => {
                        const isProbSolved = solvedProblemIds.has(prob._id);
                        return (
                          <div key={prob._id} style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.75rem 1rem', background: 'var(--bg-elevated)', borderRadius: 8,
                            border: `1px solid ${isProbSolved ? 'var(--accent-green)' : 'var(--border)'}`
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              {isProbSolved ? (
                                <CheckCircle size={16} color="var(--accent-green)" />
                              ) : (
                                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--text-muted)' }} />
                              )}
                              <span style={{ fontWeight: 500, color: isProbSolved ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                                {prob.title}
                              </span>
                            </div>
                            <Link to={`/arena/${prob._id}`} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: isProbSolved ? 'transparent' : '', border: isProbSolved ? '1px solid var(--accent-green)' : '', color: isProbSolved ? 'var(--accent-green)' : '' }}>
                              {isProbSolved ? 'Solved' : 'Solve'}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
