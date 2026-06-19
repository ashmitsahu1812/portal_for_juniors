import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Star, Search, TrendingUp, Code2, BookOpen, Swords } from 'lucide-react';

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
const medalLabels = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [totalProblems, setTotalProblems] = useState(76);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLeaderboard()
      .then(result => {
        // result is the data array from the API client, but we need totalProblems from the raw response
        setData(result);
        if (result.length > 0 && result[0].totalProblems) {
          setTotalProblems(result[0].totalProblems);
        }
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const myRank = data.findIndex(s => s._id === user?._id) + 1;
  const myData = data.find(s => s._id === user?._id);

  return (
    <>
      <div className="page-header">
        <h2>
          <Trophy size={20} style={{ display: 'inline', marginRight: '0.5rem', color: '#FFD700' }} />
          Leaderboard
        </h2>
        <p>See how you rank among your peers. Updated in real-time.</p>

        {/* My rank banner */}
        {myData && (
          <div style={{
            marginTop: '1.25rem',
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, rgba(99,130,255,0.15), rgba(34,211,238,0.1))',
            border: '1px solid rgba(99,130,255,0.3)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-blue)', fontFamily: 'JetBrains Mono' }}>
              #{myRank}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Your Ranking</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {myData.solvedCount} problems solved · {myData.quizScore}/{myData.quizMax} quiz marks · Score: {myData.totalScore}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{myData.solvedCount}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Problems</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#22d3ee' }}>{myData.totalScore}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '0.45rem 0.9rem', maxWidth: 320, marginTop: '1rem',
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', width: '100%' }}
          />
        </div>
      </div>

      <div className="page-body">
        {loading ? (
          <div className="card" style={{ padding: '2rem' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton" style={{ height: 56, marginBottom: '0.75rem', borderRadius: 10 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Trophy size={48} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>No students found</p>
          </div>
        ) : (
          <div className="card" style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '52px 1fr 120px 120px 120px 90px',
              gap: '0.5rem', padding: '0 0.75rem 0.75rem',
              borderBottom: '1px solid var(--border)',
              fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              <div>Rank</div>
              <div>Student</div>
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <Code2 size={12} /> Problems
              </div>
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <BookOpen size={12} /> Quiz Score
              </div>
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <Swords size={12} /> Battle Rating
              </div>
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <Star size={12} /> Total
              </div>
            </div>

            {/* Rows */}
            {filtered.map((student, idx) => {
              const rank = data.indexOf(student) + 1;
              const isMe = student._id === user?._id;
              const isTop3 = rank <= 3;

              return (
                <div
                  key={student._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 1fr 120px 120px 120px 90px',
                    gap: '0.5rem',
                    padding: '0.85rem 0.75rem',
                    borderRadius: 10,
                    marginTop: '0.25rem',
                    background: isMe
                      ? 'linear-gradient(135deg, rgba(99,130,255,0.12), rgba(34,211,238,0.08))'
                      : 'transparent',
                    border: isMe ? '1px solid rgba(99,130,255,0.25)' : '1px solid transparent',
                    transition: 'background 0.2s',
                    alignItems: 'center',
                  }}
                >
                  {/* Rank */}
                  <div style={{ fontWeight: 800, fontSize: isTop3 ? '1.3rem' : '0.9rem', color: isTop3 ? medalColors[rank - 1] : 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    {isTop3 ? medalLabels[rank - 1] : `#${rank}`}
                  </div>

                  {/* Name */}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {student.name}
                        {isMe && <span style={{ fontSize: '0.65rem', background: 'rgba(99,130,255,0.2)', color: 'var(--accent-blue)', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>YOU</span>}
                      </div>
                    </div>

                  {/* Problems Solved */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent-blue)' }}>{student.solvedCount}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}> / {totalProblems}</span>
                  </div>

                  {/* Quiz Score */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: '#22d3ee' }}>{student.quizScore}</span>
                    {student.quizMax > 0 && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}> / {student.quizMax}</span>}
                  </div>

                  {/* Battle Rating */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent-red)' }}>{student.battleRating || 0}</span>
                  </div>

                  {/* Total Score */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.95rem',
                      color: isTop3 ? medalColors[rank - 1] : 'var(--text-primary)',
                    }}>
                      {student.totalScore}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Score formula note */}
        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          <TrendingUp size={12} style={{ display: 'inline', marginRight: '0.3rem' }} />
          Score = 50% quiz percentage + 50% problems solved ratio + Battle Rating
        </div>
      </div>
    </>
  );
}
