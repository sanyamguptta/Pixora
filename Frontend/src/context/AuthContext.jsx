import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('pixora_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('pixora_user');
      }
    }
    setLoading(false);
  }, []);

  async function login(credentials) {
    const res = await api.post('/auth/login', credentials);
    const userData = res.data.user;
    setUser(userData);
    localStorage.setItem('pixora_user', JSON.stringify(userData));
    return res.data;
  }

  async function register(data) {
    const res = await api.post('/auth/register', data);
    const userData = res.data.user;
    setUser(userData);
    localStorage.setItem('pixora_user', JSON.stringify(userData));
    return res.data;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('pixora_user');
    // Cookie is cleared on next request; reload to clear session
    window.location.href = '/login';
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
