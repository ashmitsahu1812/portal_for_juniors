import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchExternalStats } from '../api/client';
import { UserCircle, Mail, Shield, Zap, Swords, ExternalLink } from 'lucide-react';
import Heatmap from '../components/Heatmap';

export default function Profile() {
  const { user } = useAuth();
  const [external, setExternal] = useState(null);

  useEffect(() => {
    fetchExternalStats().then(setExternal).catch(() => setExternal(null));
  }, []);

  if (!user) return null;

  return (
    <>
      <div className="page-header">
        <h2>
          <UserCircle size={28} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-purple)' }} />
          Profile Details
        </h2>
        <p>Manage your account, view your stats, and check your contribution activity.</p>
      </div>
      <div className="page-body">
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-surface)',
            border: '3px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <UserCircle size={40} color="var(--text-muted)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user.name}
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}><Shield size={10} /> {user.role}</span>
            </h3>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={14} /> {user.email}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="card-grid" style={{ marginBottom: '2.5rem' }}>
          <div className="stat-card blue">
            <Zap size={24} color="var(--accent-blue)" />
            <div className="stat-value">{user.progress?.activity?.streak || 0}</div>
            <div className="stat-label">Day Streak</div>
          </div>
          <div className="stat-card green">
            <Swords size={24} color="var(--accent-green)" />
            <div className="stat-value">{user.progress?.rating || 0}</div>
            <div className="stat-label">Battle Rating</div>
          </div>
        </div>

        <section className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div><h3>Competitive Programming Stats</h3><p style={{ fontSize: '0.82rem' }}>Stats for your linked public accounts.</p></div>
            <Link className="btn btn-sm" to="/settings">Manage links</Link>
          </div>
          <div className="card-grid">
            <div style={{ padding: '1rem', border: '2px solid var(--border)' }}><strong>LeetCode</strong><div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: 6 }}>{external?.stats?.leetcode?.totalSolved ?? '—'}</div><span style={{ color: 'var(--text-muted)', fontSize: 12 }}>problems solved</span><p style={{ fontSize: 12, marginTop: 5 }}>{external?.profiles?.leetcode ? `@${external.profiles.leetcode}` : 'Not linked'}</p></div>
            <div style={{ padding: '1rem', border: '2px solid var(--border)' }}><strong>Codeforces</strong><div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: 6 }}>{external?.stats?.codeforces?.rating ?? '—'}</div><span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{external?.stats?.codeforces?.rank || 'rating'} · max {external?.stats?.codeforces?.maxRating ?? '—'}</span><p style={{ fontSize: 12, marginTop: 5 }}>{external?.profiles?.codeforces ? `@${external.profiles.codeforces}` : 'Not linked'}</p></div>
          </div>
          <Link to="/competitive-programming" className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>Open CP hub <ExternalLink size={14} /></Link>
        </section>

        {/* Heatmap */}
        <Heatmap activeDays={user.progress?.activity?.activeDays || []} />

      </div>
    </>
  );
}
