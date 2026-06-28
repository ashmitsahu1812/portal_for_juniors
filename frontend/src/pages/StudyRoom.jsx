import { useState, useEffect } from 'react';
import { Users, Wifi, Clock, ArrowLeft, Video, VideoOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export default function StudyRoom() {
  const [activeUsers, setActiveUsers] = useState([]);
  const [inCall, setInCall] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;

    // Connect to study-room namespace
    let backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    if (backendUrl.endsWith('/api')) {
      backendUrl = backendUrl.slice(0, -4);
    }
    const socketUrl = `${backendUrl}/study-room`;

    const socket = io(socketUrl, {
      withCredentials: true
    });

    socket.on('connect', () => {
      // Announce presence
      socket.emit('joinStudyRoom', {
        id: user.id || user._id,
        name: user.name,
        email: user.email
      });
    });

    socket.on('activeUsersUpdate', (usersList) => {
      setActiveUsers(usersList);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const getTimeOnline = (joinedAt) => {
    const diffMins = Math.floor((new Date() - new Date(joinedAt)) / 60000);
    if (diffMins < 1) return 'Just joined';
    if (diffMins < 60) return `${diffMins}m online`;
    return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m online`;
  };

  return (
    <div className="page-body">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users size={24} color="var(--accent-blue)" /> Virtual Study Room
          </h2>
          <p>See who else from your batch is currently online and studying.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-elevated)', padding: '0.5rem 1rem', borderRadius: 20, border: '1px solid var(--border)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }}></div>
          <span style={{ fontWeight: 600 }}>{activeUsers.length} Online</span>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Video size={18} color="var(--accent-purple)" /> Join the Group Call
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Hop in to talk, study together, or share your screen.
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setInCall(!inCall)}
          style={{ background: inCall ? 'var(--accent-red)' : 'var(--accent-purple)' }}
        >
          {inCall ? <><VideoOff size={16} /> Leave Call</> : <><Video size={16} /> Join Call</>}
        </button>
      </div>

      {inCall && (
        <div style={{ width: '100%', height: '600px', borderRadius: 12, overflow: 'hidden', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <iframe 
            allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; autoplay" 
            src={`https://p2p.mirotalk.com/join/JuniorKickstartPortalStudyRoom?name=${encodeURIComponent(user?.name || 'Student')}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Video Call"
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {activeUsers.map(u => (
          <div key={u.userId} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-hard-sm)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative'
          }}>
            {u.userId === user?.id && (
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'var(--accent-yellow)', color: '#000', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 10, fontWeight: 800 }}>
                YOU
              </div>
            )}
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '1.5rem', fontWeight: 800,
              marginBottom: '1rem',
              border: '2px solid var(--border)'
            }}>
              {u.name.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{u.name}</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              <Clock size={14} /> {getTimeOnline(u.joinedAt)}
            </div>
          </div>
        ))}
      </div>
      
      {activeUsers.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Wifi size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
          Connecting to study room...
        </div>
      )}
    </div>
  );
}
