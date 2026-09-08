import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { LogIn, Lock, Mail, User, X, ArrowRight, ShieldCheck } from 'lucide-react';

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
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#0d1117',
          border: '2px solid var(--accent-blue)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 133, 255, 0.25), 0 0 0 1px rgba(0, 133, 255, 0.2)',
          padding: '2rem',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '4px',
            color: '#aaa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Tab switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '3px',
            marginBottom: '1.75rem',
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
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'login' ? 'var(--accent-blue)' : 'transparent',
              color: mode === 'login' ? '#fff' : '#888',
              transition: 'all 0.15s ease',
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
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'register' ? 'var(--accent-blue)' : 'transparent',
              color: mode === 'register' ? '#fff' : '#888',
              transition: 'all 0.15s ease',
            }}
          >
            Create Account
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            {mode === 'login' ? 'Welcome Back, Junior!' : 'Join the CS Accelerator'}
          </h2>
          <p style={{ color: '#888', fontSize: '0.84rem', marginTop: '0.35rem' }}>
            {mode === 'login'
              ? 'Access your coding progress, lecture notes, and quizzes.'
              : 'Create your free account and start practicing algorithms.'}
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#aaa', marginBottom: '0.3rem' }}>
                Full Name
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  padding: '0.55rem 0.85rem',
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
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#aaa', marginBottom: '0.3rem' }}>
              University / Personal Email
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '8px',
                padding: '0.55rem 0.85rem',
              }}
            >
              <Mail size={15} color="#888" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="junior@university.edu"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  width: '100%',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#aaa', marginBottom: '0.3rem' }}>
              Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '8px',
                padding: '0.55rem 0.85rem',
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
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.7rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #0085ff, #00e5ff)',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: '0 0 15px rgba(0, 133, 255, 0.4)',
            }}
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Portal' : 'Create Free Account'}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
          <div style={{ flex: 1, height: 1, background: '#30363d' }} />
          <span style={{ fontSize: '0.72rem', color: '#666', textTransform: 'uppercase' }}>or quick 1-tap</span>
          <div style={{ flex: 1, height: 1, background: '#30363d' }} />
        </div>

        {/* Google Sign-In */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setError('Google Sign-In failed. Please try again.')}
            theme="filled_black"
            shape="rectangular"
            width="370"
            text="continue_with"
          />
        </div>
      </div>
    </div>
  );
}
