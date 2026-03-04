import React, { createContext, useContext, useState, useEffect } from 'react';

const themes = {
  forest: {
    id: 'forest',
    name: 'Forest',
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

  const setCustomThemeVideo = (videoId) => {
    setCurrentTheme({
      id: 'custom',
      name: 'Custom',
      video: `youtube:${videoId}`,
      colors: {
        bg: 'bg-[#1a1a2e]', // Fallback to a dark tint
        primary: 'text-[#16213e]',
        accent: 'text-[#0f3460]',
        panel: 'bg-[#000000]/80', // Darker panel for custom themes since we don't know the video color
      }
    });
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, setCustomThemeVideo, themes }}>
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
