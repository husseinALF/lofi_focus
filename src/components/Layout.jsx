import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
  const { currentTheme } = useTheme();

  return (
    <div className="relative min-h-screen w-full overflow-hidden transition-all duration-700 ease-in-out">
      {/* Background Video */}
      <video
        key={currentTheme.id} // Force re-render on theme change
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        src={currentTheme.video}
        poster={currentTheme.bgImage} // Fallback image
      />
      
      {/* Fallback/Tint Layer */}
      <div 
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          backgroundColor: currentTheme.colors.bg.replace('bg-[', '').replace(']', ''), // Fallback color if video fails
          opacity: 0.2 // Slight tint behind the video if needed, or just relying on overlay
        }}
      />
      
      {/* Base Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default Layout;
