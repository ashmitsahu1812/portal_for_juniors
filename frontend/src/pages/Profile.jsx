import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Mail, Shield, Zap, Swords } from 'lucide-react';
import Heatmap from '../components/Heatmap';

export default function Profile() {
  const { user } = useAuth();

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

        {/* Heatmap */}
        <Heatmap activeDays={user.progress?.activity?.activeDays || []} />

      </div>
    </>
  );
}
