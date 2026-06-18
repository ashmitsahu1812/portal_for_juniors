import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { UserPlus, User, Lock, Mail } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    setError('');
    const res = await googleLogin(credentialResponse.credential);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', background: 'var(--bg-main)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #a855f7, #6382ff)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <UserPlus size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>Join the CS freshman portal</p>
        </div>

        {error && <div style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--accent-red)', padding: '0.75rem', borderRadius: 8, fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.2)' }}>{error}</div>}

        {/* Google Sign-Up — fastest way to join */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setError('Google Sign-In failed. Please try again.')}
            theme="filled_black"
            shape="rectangular"
            width="352"
            text="signup_with"
          />
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>or register with email</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Full Name</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.9rem' }}>
              <User size={16} color="var(--text-muted)" />
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Jane Doe" style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '0.9rem' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Email</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.9rem' }}>
              <Mail size={16} color="var(--text-muted)" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="student@university.edu" style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '0.9rem' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.9rem' }}>
              <Lock size={16} color="var(--text-muted)" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '0.9rem' }} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.7rem' }}>Register</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500 }}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
