import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists in localStorage, then fetch user profile
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      localStorage.setItem('token', res.data.data.token);
      setUser(res.data.data);
      return { success: true };
    }
    return { success: false, message: res.data?.message || 'Login failed' };
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data?.success) {
      localStorage.setItem('token', res.data.data.token);
      setUser(res.data.data);
      return { success: true };
    }
    return { success: false, message: res.data?.message || 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProgress = (progressData) => {
    if (user) {
      setUser({ ...user, progress: progressData });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
};
