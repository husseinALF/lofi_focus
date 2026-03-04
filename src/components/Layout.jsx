import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
  const { currentTheme } = useTheme();

  return (
    <div className="relative min-h-screen w-full overflow-hidden transition-all duration-700 ease-in-out">
      <AnimatePresence>
        {currentTheme.video.startsWith('youtube:') ? (
          <motion.div
            key={currentTheme.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full pointer-events-none scale-[1.15] lg:scale-125 xl:scale-150"
          >
            <YouTube 
              videoId={currentTheme.video.replace('youtube:', '')}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, loop: 1, modestbranding: 1, mute: 1, rel: 0, showinfo: 0, iv_load_policy: 3, playlist: currentTheme.video.replace('youtube:', '') }
              }}
              className="w-full h-full"
              iframeClassName="w-full h-full object-cover"
              onReady={(e) => { e.target.playVideo(); e.target.mute(); }}
            />
          </motion.div>
        ) : (
          <motion.video
            key={currentTheme.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={currentTheme.video}
            poster={currentTheme.bgImage} // Fallback image
          />
        )}
      </AnimatePresence>
      
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
