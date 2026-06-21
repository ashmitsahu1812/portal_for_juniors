import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import api from '../../api/client';

const ICONS = ['🚀', '💻', '🧠', '⚡', '🔥', '🎮', '💡', '🌟'];

const getDailyRNG = () => {
  const d = new Date();
  let seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

export default function MemoryMatch({ onBack }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    fetchStatus();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && !hasPlayed) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, hasPlayed]);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/games/status');
      if (res.data.success) {
        setHasPlayed(res.data.status.memory);
        if (!res.data.status.memory) {
          startNewGame();
        }
      }
    } catch (err) {
      console.error('Failed to fetch status');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/games/leaderboard/memory');
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard');
    }
  };

  const submitScore = async (timeTaken) => {
    try {
      const res = await api.post('/games/score', { gameType: 'memory', timeTakenSeconds: timeTaken });
      if (res.data.success) {
        setHasPlayed(true);
      }
      fetchLeaderboard();
    } catch (err) {
      alert(err.message || 'Error submitting score');
      console.error('Failed to submit score');
    }
  };

  const startNewGame = () => {
    const random = getDailyRNG();
    const shuffled = [...ICONS, ...ICONS]
      .sort(() => random() - 0.5)
      .map((icon, id) => ({ id, icon }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setTime(0);
    setIsPlaying(true);
  };

  const handleCardClick = (index) => {
    if (!isPlaying || flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        setMatched((prev) => {
          const newMatched = [...prev, first, second];
          if (newMatched.length === cards.length) {
            setIsPlaying(false);
            submitScore(time); // Wait for state to settle, then submit
          }
          return newMatched;
        });
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Hub
        </button>
        {!hasPlayed && <div className="game-timer">{formatTime(time)}</div>}
        {!hasPlayed && (
          <button className="btn btn-primary" onClick={startNewGame}>
            Restart
          </button>
        )}
      </div>

      {hasPlayed ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <Trophy size={48} color="#eab308" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>You've already solved today's puzzle!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Great job! Come back tomorrow for a new Memory Match challenge.</p>
        </div>
      ) : (
        <>
          <div className="memory-grid">
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index) || matched.includes(index);
              const isMatched = matched.includes(index);
              
              return (
                <div
                  key={card.id}
                  className={`memory-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="memory-card-inner">
                    <div className="memory-card-front">{card.icon}</div>
                    <div className="memory-card-back">?</div>
                  </div>
                </div>
              );
            })}
          </div>

          {!isPlaying && matched.length === cards.length && (
            <div style={{ marginTop: '2rem', textAlign: 'center', color: '#10b981' }}>
              <h2>🎉 You finished in {formatTime(time)}!</h2>
            </div>
          )}
        </>
      )}

      {/* Leaderboard */}
      <div className="leaderboard-panel">
        <h3><Trophy size={20} color="#eab308" /> Today's Top Times</h3>
        {leaderboard.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No scores yet today. Be the first!</p>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((entry, idx) => (
              <div key={idx} className={`leaderboard-item top-${idx + 1}`}>
                <span className="rank">#{idx + 1}</span>
                <span className="name">{entry.name}</span>
                <span className="time">{formatTime(entry.timeTakenSeconds)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
