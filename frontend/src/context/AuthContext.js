import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const saveAuth = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const { data } = await authAPI.getMe();
          setUser(data.user);
        } catch {
          clearAuth();
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    saveAuth(data.user, data.token);
    toast.success('Account created successfully!');
    return data;
  };

  const login = async (formData) => {
    const { data } = await authAPI.login(formData);
    saveAuth(data.user, data.token);
    toast.success(`Welcome back, ${data.user.name}!`);
    return data;
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    clearAuth();
    toast.success('Logged out successfully');
  };

  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
  }, [user]);

  const isAdmin = user?.role === 'admin' || user?.role === 'subadmin';
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAdmin, isAuthenticated,
      register, login, logout, updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
