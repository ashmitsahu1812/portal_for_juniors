import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Lock, Mail, User, X, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        onClose();
        navigate('/');
      } else {
        setError(res.message);
      }
    } else {
      const res = await register(name, email, password);
      setLoading(false);
      if (res.success) {
        onClose();
        navigate('/');
      } else {
        setError(res.message);
      }
    }
  };

  const handleGoogle = async (credentialResponse) => {
    setError('');
    const res = await googleLogin(credentialResponse.credential);
    if (res.success) {
      onClose();
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#0a0a0a',
          border: '3px solid #0085ff',
          boxShadow: '6px 6px 0px 0px #0085ff',
          padding: '2rem',
          position: 'relative',
          color: '#ffffff',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: '#141414',
            border: '2px solid #333',
            color: '#fff',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>

        {/* Tab switcher */}
        <div
          style={{
            display: 'flex',
            border: '2px solid #222222',
            background: '#000000',
            marginBottom: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'login' ? '#0085ff' : 'transparent',
              color: mode === 'login' ? '#ffffff' : '#888888',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'register' ? '#0085ff' : 'transparent',
              color: mode === 'register' ? '#ffffff' : '#888888',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Create Account
          </button>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            {mode === 'login' ? 'Welcome Back' : 'Join Portal'}
          </h2>
          <p style={{ color: '#888888', fontSize: '0.82rem', marginTop: '0.25rem' }}>
            {mode === 'login'
              ? 'Enter your credentials to access your coding dashboard.'
              : 'Create your account to start solving problems and taking quizzes.'}
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              padding: '0.6rem 0.8rem',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              border: '1px solid #ef4444',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#aaaaaa', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                Full Name
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#141414',
                  border: '2px solid #333333',
                  padding: '0.55rem 0.75rem',
                }}
              >
                <User size={15} color="#888" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Alex Sharma"
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    width: '100%',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#aaaaaa', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
              Email
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#141414',
                border: '2px solid #333333',
                padding: '0.55rem 0.75rem',
              }}
            >
              <Mail size={15} color="#888" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="student@university.edu"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  width: '100%',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#aaaaaa', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
              Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#141414',
                border: '2px solid #333333',
                padding: '0.55rem 0.75rem',
              }}
            >
              <Lock size={15} color="#888" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  width: '100%',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.65rem',
              border: '2px solid #000000',
              background: '#0085ff',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: '3px 3px 0px 0px #000000',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
          <div style={{ flex: 1, height: 1, background: '#222' }} />
          <span style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#222' }} />
        </div>

        {/* Google Sign-In */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setError('Google Sign-In failed. Please try again.')}
            theme="filled_black"
            shape="rectangular"
            width="350"
            text="signin_with"
          />
        </div>
      </div>
    </div>
  );
}
