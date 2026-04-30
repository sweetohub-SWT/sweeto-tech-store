import React, { createContext, useContext, useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import WelcomeScreen from '../components/WelcomeScreen';
import { apiService } from '../services/api';
import analyticsService from '../utils/analyticsService';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Just initialize user data
    const savedUser = localStorage.getItem('local_customer_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleWelcomeEnter = () => {
    setShowWelcome(false);
  };

  const login = async (email, password) => {
    // Mock Customer Auth
    if (email) {
      const mockUser = { id: 'local-customer-' + Date.now(), email, display_name: email.split('@')[0] };
      localStorage.setItem('local_customer_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true, user: mockUser };
    }
    return { success: false, error: 'Invalid email' };
  };

  const register = async (name, email, password) => {
    // Mock Customer Auth with DB persistence
    if (email) {
      const newUser = { 
        id: 'customer-' + Date.now(), 
        email, 
        display_name: name,
        created_at: new Date().toISOString(),
        device: analyticsService.getDeviceType(),
        website_referrer: document.referrer || analyticsService.getReferrerSource() || 'Direct'
      };
      
      // Save to global users list for admin visibility
      try {
        await apiService.create('users', newUser);
      } catch (err) {
        console.error('Failed to save user to DB', err);
      }

      localStorage.setItem('local_customer_user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser };
    }
    return { success: false, error: 'Invalid email' };
  };

  const loginWithGoogle = async () => {
    // Simulate Google OAuth popup delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock Google User
    const googleUser = { 
      id: 'google-' + Date.now(), 
      email: `user${Math.floor(Math.random() * 1000)}@gmail.com`, 
      display_name: 'Google User',
      created_at: new Date().toISOString(),
      device: analyticsService.getDeviceType(),
      website_referrer: 'Google Auth',
      auth_provider: 'google'
    };
    
    // Save to global users list for admin visibility
    try {
      await apiService.create('users', googleUser);
    } catch (err) {
      console.error('Failed to save user to DB', err);
    }

    localStorage.setItem('local_customer_user', JSON.stringify(googleUser));
    setUser(googleUser);
    setIsAuthenticated(true);
    return { success: true, user: googleUser };
  };

  const logout = async () => {
    localStorage.removeItem('local_customer_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.email === 'sweeto@sweeto.com';

  const value = {
    isAuthenticated,
    isAdmin,
    user,
    login,
    loginWithGoogle,
    register,
    logout,
    loading
  };

  return (
    <UserAuthContext.Provider value={value}>
      {showWelcome ? (
        <WelcomeScreen onEnter={handleWelcomeEnter} />
      ) : (
        children
      )}
    </UserAuthContext.Provider>
  );
};
