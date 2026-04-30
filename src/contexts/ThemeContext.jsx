import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStoreData } from './StoreDataContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { storeSettings } = useStoreData();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('sweeto_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [primaryColor, setPrimaryColor] = useState(storeSettings?.primaryColor || '#0066FF');
  const [accentColor, setAccentColor] = useState(storeSettings?.accentColor || '#00a2ff');

  // Update local state when store settings change
  useEffect(() => {
    if (storeSettings?.primaryColor) setPrimaryColor(storeSettings.primaryColor);
    if (storeSettings?.accentColor) setAccentColor(storeSettings.accentColor);
  }, [storeSettings]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply Dark Mode
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('sweeto_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('sweeto_theme', 'light');
    }

    // Helper to get RGB from Hex
    const hexToRgb = (hex) => {
      if (!hex) return '37, 99, 235';
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '37, 99, 235';
    };

    // Apply Theme Identity (Accents only)
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--primary-rgb', hexToRgb(primaryColor));
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--accent-rgb', hexToRgb(accentColor));
    
    // Generate a default gradient based on primary
    const gradient = `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`;
    root.style.setProperty('--primary-gradient', gradient);
    
    // Ensure core backgrounds are NOT overridden by theme primary color
    if (isDarkMode) {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#0a0a0a');
      root.style.setProperty('--text-primary', '#ffffff');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--text-primary', '#0f172a');
    }
  }, [isDarkMode, primaryColor, accentColor]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, primaryColor, accentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
