import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api'; // Make sure api.js uses baseURL: '/api'

export const AuthContext = createContext({
  user: null,
  login: async (email, password) => {},
  logout: async () => {},
  refreshUser: async () => {},
  register: async (email, password, firstName, lastName) => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const refreshUser = async () => {
    try {
      const resp = await api.get('/auth/me');
      setUser({
        id: resp.data.user_id,
        email: resp.data.email,
        isAdmin: resp.data.is_admin,
      });
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    const form = new FormData();
    form.append('email', email);
    form.append('password', password);
    const resp = await api.post('/auth/login', form);
    setUser({
      id: resp.data.user.id,
      email: resp.data.user.email,
      firstName: resp.data.user.first_name,
      lastName: resp.data.user.last_name,
      isAdmin: resp.data.user.is_admin,
    });
  };

  const logout = async () => {
    setUser(null);
  };

  const register = async (email, password, firstName, lastName) => {
    const form = new FormData();
    form.append('email', email);
    form.append('password', password);
    form.append('first_name', firstName);
    form.append('last_name', lastName);
    form.append('is_admin', 'false');

    // ✅ FIXED: removed /auth from here — baseURL already includes /api
    await api.post('/auth/register', form);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, register }}>
      {children}
    </AuthContext.Provider>
  );
}
