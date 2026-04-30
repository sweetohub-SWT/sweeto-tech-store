import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

// Session duration: 8 hours
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

// Credentials loaded from .env.local (never hardcoded)
const ADMIN_EMAIL    = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser]                       = useState(null);
  const [loading, setLoading]                 = useState(true);

  // Restore session on mount — with expiry check and safe JSON parse
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('local_admin_user');
      if (savedUser) {
        const { timestamp, ...userData } = JSON.parse(savedUser);
        const isExpired = Date.now() - timestamp > SESSION_DURATION_MS;

        if (isExpired) {
          localStorage.removeItem('local_admin_user');
        } else {
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
    } catch {
      // Corrupted data — wipe it
      localStorage.removeItem('local_admin_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email, password) => {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return { success: false, error: 'Admin credentials are not configured.' };
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const userData = { id: 'local-admin', email, role: 'admin' };
      // Store with a timestamp so we can enforce session expiry
      localStorage.setItem(
        'local_admin_user',
        JSON.stringify({ ...userData, timestamp: Date.now() })
      );
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  const logout = () => {
    localStorage.removeItem('local_admin_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
