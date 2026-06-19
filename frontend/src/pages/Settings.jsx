import { useAuth } from '../context/AuthContext';
import { UserX, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const { deleteUserAccount } = useAuth();

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
