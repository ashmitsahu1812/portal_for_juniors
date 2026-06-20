import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchProblem } from '../api/client';
import CodeEditor from '../components/CodeEditor';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Swords, Clock, Cpu, Trophy, Frown } from 'lucide-react';

const diffClass = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };

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

export default function BattleArena() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [gameOver, setGameOver] = useState(false);
  const [winnerName, setWinnerName] = useState('');
  const [didIWin, setDidIWin] = useState(false);
  const [points, setPoints] = useState(0);

  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds

  useEffect(() => {
    if (!socket || !location.state?.problemId) {
      navigate('/battle'); // Return to lobby if accessed directly
      return;
    }

    // Load Problem
    fetchProblem(location.state.problemId)
      .then((p) => {
        setProblem(p);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load battle problem:", err);
        navigate('/battle');
      });

    // Socket listeners
    socket.on('game_over', (data) => {
      setGameOver(true);
      setWinnerName(data.winnerName);
      setDidIWin(data.winnerId === (user.id || user._id));
      setPoints(data.pointsAwarded);
    });

    socket.on('opponent_disconnected', () => {
      setOpponentDisconnected(true);
    });

    return () => {
      socket.off('game_over');
      socket.off('opponent_disconnected');
    };
  }, [socket, location, navigate, user]);

  // Timer logic
  useEffect(() => {
    if (gameOver || opponentDisconnected || loading) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameOver(true); // Draw
          setWinnerName('Time Expired! Draw.');
          setDidIWin(false);
          setPoints(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, opponentDisconnected, loading]);

  const handleSuccess = () => {
    if (!socket) return;
    socket.emit('player_won', { roomId });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-secondary)' }}>Loading Battle Arena...</div>;
  }

  return (
    <div className="arena-shell" style={{ position: 'relative' }}>
      
      {/* ═══ OPPONENT STATUS BAR (Top) ════════════════════════════════ */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40, background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--accent-red)' }}>
          <Swords size={16} /> BATTLE ROOM: {roomId}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.2rem', fontFamily: 'JetBrains Mono', color: timeLeft <= 60 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
          <Clock size={16} /> {formatTime(timeLeft)}
        </div>
        {opponentDisconnected && (
          <div style={{ color: 'var(--accent-red)', fontWeight: 600, fontSize: '0.85rem' }}>
            Opponent Disconnected. You can safely leave.
          </div>
        )}
      </div>

      {/* ═══ LEFT PANE — Problem Description ════════════════════════════════ */}
      <div className="arena-left" style={{ paddingTop: 40 }}>
        <div className="arena-pane-header">
          <span style={{ flex: 1, fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {problem.title}
          </span>
          <span className={`badge ${diffClass[problem.difficulty] ?? ''}`}>{problem.difficulty}</span>
        </div>

        <div className="arena-pane-body">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Clock size={12} /> {problem.timeLimitSeconds}s
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Cpu size={12} /> {problem.memoryLimitMB}MB
            </span>
          </div>

          <div className="md-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {problem.description}
            </ReactMarkdown>
          </div>

          {problem.constraints && (
            <div style={{ marginTop: '1.25rem', padding: '0.9rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }}>
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
        </div>
      </div>

      {/* ═══ RIGHT PANE — Monaco Editor ══════════════════════════════════════ */}
      <div className="arena-right" style={{ paddingTop: 40 }}>
        <CodeEditor problem={problem} onSuccess={handleSuccess} />
      </div>

      {/* ═══ GAME OVER OVERLAY ═══════════════════════════════════════════════ */}
      {gameOver && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div className="card" style={{ maxWidth: 450, width: '100%', padding: '3rem 2rem', textAlign: 'center', border: `2px solid ${didIWin ? 'var(--accent-green)' : 'var(--accent-red)'}` }}>
            {didIWin ? (
              <div style={{ color: 'var(--accent-green)', marginBottom: '1rem' }}>
                <Trophy size={64} style={{ margin: '0 auto' }} />
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', color: 'var(--text-primary)' }}>VICTORY!</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--accent-green)', fontWeight: 600 }}>+{points} Rating</p>
              </div>
            ) : (
              <div style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>
                <Frown size={64} style={{ margin: '0 auto' }} />
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', color: 'var(--text-primary)' }}>DEFEAT</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--accent-red)', fontWeight: 600 }}>Winner: {winnerName}</p>
              </div>
            )}
            <button onClick={() => navigate('/battle')} className="btn btn-primary" style={{ marginTop: '2rem', width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '0.85rem' }}>
              Back to Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
