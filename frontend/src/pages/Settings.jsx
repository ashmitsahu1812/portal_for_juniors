import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveExternalProfiles } from '../api/client';
import { UserX, Settings as SettingsIcon, Link2, Save } from 'lucide-react';

export default function Settings() {
  const { deleteUserAccount, refreshUser, user } = useAuth();
  const [handles, setHandles] = useState(() => user?.externalProfiles || { leetcode: '', codeforces: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');


  const saveHandles = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await saveExternalProfiles(handles);
      await refreshUser();
      setMessage('Competitive programming profiles saved.');
    } catch (error) {
      setMessage(error.message || 'Could not save profile links.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and all your progress will be lost.')) {
      const res = await deleteUserAccount();
      if (!res.success) {
        alert(res.message || 'Failed to delete account');
      }
    }
  };

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <SettingsIcon size={20} color="var(--accent-blue)" />
              Settings
            </h2>
            <p>Manage your account preferences and data.</p>
          </div>
        </div>
      </div>

      <div className="page-body">
        <section className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}><Link2 size={18} /> Competitive Programming Profiles</h3>
          <p style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>Link public usernames to show your stats and join the Codeforces rating leaderboard.</p>
          <form onSubmit={saveHandles} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <label style={{ display: 'grid', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700 }}>LeetCode username
              <input className="select-styled" style={{ width: '100%' }} value={handles.leetcode} onChange={e => setHandles({ ...handles, leetcode: e.target.value })} placeholder="e.g. leetcoder" autoComplete="off" />
            </label>
            <label style={{ display: 'grid', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 700 }}>Codeforces handle
              <input className="select-styled" style={{ width: '100%' }} value={handles.codeforces} onChange={e => setHandles({ ...handles, codeforces: e.target.value })} placeholder="e.g. tourist" autoComplete="off" />
            </label>
            <button className="btn btn-primary" type="submit" disabled={saving}><Save size={16} />{saving ? 'Saving…' : 'Save profiles'}</button>
          </form>
          {message && <p role="status" style={{ marginTop: '0.75rem', color: message.includes('saved') ? 'var(--accent-green)' : 'var(--accent-red)' }}>{message}</p>}
        </section>

        {/* ── Danger Zone ─────────────────────────────────────────────────── */}
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <UserX size={18} /> Danger Zone
          </h3>
          <div className="card" style={{ padding: '0.75rem 1.25rem', border: '1.5px solid var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.1rem' }}>Delete Account</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Permanently delete your account and all of your progress. This action cannot be undone.</p>
            </div>
            <button onClick={handleDeleteAccount} className="btn btn-danger btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
