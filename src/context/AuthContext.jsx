// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext({
  user: null,
  login: async (email, password) => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Fetch /auth/me to load current user (if logged in)
  const refreshUser = async () => {
    try {
      const resp = await api.get('/auth/me');
      setUser({
        id: resp.data.user_id,
        email: resp.data.email,
        isAdmin: resp.data.is_admin,
      });
    } catch (err) {
      setUser(null);
    }
  };

  // Call once on mount
  useEffect(() => {
    refreshUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    const form = new FormData();
    form.append('email', email);
    form.append('password', password);
    // FastAPI login sets cookies and returns user data
    const resp = await api.post('/auth/login', form);
    // resp.data.user has first_name / last_name
    setUser({
      id: resp.data.user.id,
      email: resp.data.user.email,
      firstName: resp.data.user.first_name,
      lastName: resp.data.user.last_name,
      isAdmin: resp.data.user.is_admin,
    });
  };

  // Logout function
  const logout = async () => {
    // simply clear client-side; you could also hit a backend logout route
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
