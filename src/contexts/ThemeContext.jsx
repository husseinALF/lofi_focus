import React, { createContext, useContext, useState, useEffect } from 'react';

const themes = {
  forest: {
    id: 'forest',
    name: 'Forest',
    bgImage: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2070&auto=format&fit=crop', // Deep Forest
    video: '/videos/forest.mp4',
    colors: {
      bg: 'bg-[#2d3e30]',
      primary: 'text-[#4a6741]',
      accent: 'text-[#8fbc8f]',
      panel: 'bg-[#2d3e30]/90',
    }
  },
  cafe: {
    id: 'cafe',
    name: 'Cafe',
    bgImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop', // Cozy Cafe
    video: '/videos/cafe.mp4',
    colors: {
      bg: 'bg-[#3e2d20]',
      primary: 'text-[#8b4513]',
      accent: 'text-[#d2691e]',
      panel: 'bg-[#3e2d20]/90',
    }
  },
  bedroom: {
    id: 'bedroom',
    name: 'Bedroom',
    bgImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop', // Cozy Bedroom Night
    video: '/videos/bedroom.mp4',
    colors: {
      bg: 'bg-[#1a1a2e]',
      primary: 'text-[#16213e]',
      accent: 'text-[#0f3460]',
      panel: 'bg-[#1a1a2e]/90',
    }
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(themes.forest);

  const setTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentTheme(themes[themeId]);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
