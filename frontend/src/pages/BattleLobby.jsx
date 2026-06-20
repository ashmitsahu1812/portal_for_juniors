import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Swords, Plus, LogIn, Users, Play, Copy, Check } from 'lucide-react';

export default function BattleLobby() {
  const socket = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('select'); // select | create | join | waiting
  const [difficulty, setDifficulty] = useState('Medium');
  const [joinCode, setJoinCode] = useState('');
  
  const [roomId, setRoomId] = useState('');
  const [players, setPlayers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!socket) return;

    socket.on('room_created', (data) => {
      setRoomId(data.roomId);
      setIsCreator(true);
      setMode('waiting');
    });

    socket.on('player_joined', (data) => {
      setPlayers(data.players);
      setRoomId(data.roomId || roomId); // Just in case
      setMode('waiting');
    });

    socket.on('battle_started', (data) => {
      navigate(`/battle/${roomId}`, { 
        state: { problemId: data.problemId, startTime: data.startTime, title: data.title, difficulty: data.difficulty } 
      });
    });

    socket.on('error', (err) => {
      setError(err.message);
      setTimeout(() => setError(''), 5000);
    });

    socket.on('opponent_disconnected', () => {
      setError('Opponent disconnected.');
      setPlayers((prev) => prev.filter(p => p.socketId === socket.id));
    });

    return () => {
      socket.off('room_created');
      socket.off('player_joined');
      socket.off('battle_started');
      socket.off('error');
      socket.off('opponent_disconnected');
    };
  }, [socket, navigate, roomId]);

  const handleCreateRoom = () => {
    if (!socket) return;
    socket.emit('create_room', { userName: user.name, userId: (user.id || user._id), difficulty });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!socket || !joinCode) return;
    const code = joinCode.toUpperCase().trim();
    setRoomId(code);
    setIsCreator(false);
    socket.emit('join_room', { roomId: code, userName: user.name, userId: (user.id || user._id) });
  };

  const handleStartBattle = () => {
    if (!socket || !roomId) return;
    socket.emit('start_battle', { roomId });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="page-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <h2>
          <Swords size={24} style={{ display: 'inline', marginRight: '0.6rem', color: 'var(--accent-red)' }} />
          1v1 Code Battles
        </h2>
        <p>Challenge your friends in real-time. Highest score wins.</p>
      </div>

      <div className="page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="card" style={{ maxWidth: 500, width: '100%', padding: '2.5rem', textAlign: 'center' }}>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', padding: '0.75rem', borderRadius: 8, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {mode === 'select' && (
            <div>
              <div style={{ width: 64, height: 64, background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Swords size={32} color="var(--accent-red)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Ready to Battle?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => setMode('create')} className="btn btn-primary" style={{ padding: '1rem', justifyContent: 'center', fontSize: '1.1rem' }}>
                  <Plus size={20} /> Create a Room
                </button>
                <button onClick={() => setMode('join')} className="btn btn-ghost" style={{ padding: '1rem', justifyContent: 'center', fontSize: '1.1rem', border: '2px solid var(--border)' }}>
                  <LogIn size={20} /> Join with Code
                </button>
              </div>
            </div>
          )}

          {mode === 'create' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Create Room</h3>
              <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Select Problem Difficulty</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-elevated)', border: '2px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }}
                >
                  <option value="Easy">Easy (+10 pts)</option>
                  <option value="Medium">Medium (+30 pts)</option>
                  <option value="Hard">Hard (+50 pts)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setMode('select')} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button onClick={handleCreateRoom} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Generate Code</button>
              </div>
            </div>
          )}

          {mode === 'join' && (
            <form onSubmit={handleJoinRoom}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Join Room</h3>
              <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Enter 5-Character Code</label>
                <input 
                  type="text" 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="e.g. X9F2A"
                  maxLength={5}
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-elevated)', border: '2px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setMode('select')} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Join Battle</button>
              </div>
            </form>
          )}

          {mode === 'waiting' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Waiting Lobby</h3>
              
              <div style={{ background: 'var(--bg-elevated)', border: '2px dashed var(--border)', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>ROOM CODE</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '4px', fontFamily: 'JetBrains Mono' }}>{roomId}</span>
                  <button onClick={copyCode} className="btn" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 8, cursor: 'pointer', border: '1px solid var(--border)' }}>
                    {copied ? <Check size={20} color="var(--accent-green)" /> : <Copy size={20} color="var(--text-secondary)" />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ width: 32, height: 32, background: 'var(--accent-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {players[0]?.name?.charAt(0) || user.name.charAt(0)}
                  </div>
                  <span style={{ fontWeight: 600 }}>{players[0]?.name || user.name}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderRadius: 8, border: '1px dashed var(--border)' }}>
                  <div style={{ width: 32, height: 32, background: players[1] ? 'var(--accent-red)' : 'transparent', border: players[1] ? 'none' : '2px dashed var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {players[1] ? players[1].name.charAt(0) : '?'}
                  </div>
                  <span style={{ fontWeight: 600, color: players[1] ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {players[1] ? players[1].name : 'Waiting for opponent...'}
                  </span>
                </div>
              </div>

              {isCreator ? (
                <button 
                  onClick={handleStartBattle} 
                  disabled={players.length < 2}
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem', opacity: players.length < 2 ? 0.5 : 1 }}
                >
                  <Play size={20} fill="currentColor" /> Start Match
                </button>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Waiting for host to start...</p>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
