import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Layout from './components/Layout';
import YouTubePlayer from './components/YouTubePlayer';
import SoundMixer from './components/SoundMixer';
import PomodoroTimer from './components/PomodoroTimer';
import { FocusTasks } from './components/FocusTasks';
import { SessionStats } from './components/SessionStats';
import { Save, Disc, Trash2, Moon, Sun, Coffee, Trees, Volume2, VolumeX, Keyboard, X, MonitorPlay } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

const HelpModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md bg-zinc-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white/10 rounded-lg">
            <Keyboard className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <span className="text-white/80 font-medium">Play / Pause Music</span>
            <kbd className="px-2 py-1 bg-white/10 rounded-md text-white text-xs font-mono border border-white/10 shadow-sm">Space</kbd>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <span className="text-white/80 font-medium">Mute / Unmute All</span>
            <kbd className="px-2 py-1 bg-white/10 rounded-md text-white text-xs font-mono border border-white/10 shadow-sm">M</kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <span className="text-white/80 font-medium">Switch Themes</span>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded-md text-white text-xs font-mono border border-white/10 shadow-sm">1</kbd>
              <kbd className="px-2 py-1 bg-white/10 rounded-md text-white text-xs font-mono border border-white/10 shadow-sm">2</kbd>
              <kbd className="px-2 py-1 bg-white/10 rounded-md text-white text-xs font-mono border border-white/10 shadow-sm">3</kbd>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <span className="text-white/80 font-medium">Custom Background</span>
            <span className="text-white/40 text-xs font-medium px-2 py-1 flex items-center gap-1">
              <MonitorPlay size={12} className="inline mr-1" /> Look for TV Icon
            </span>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-white/40">
          Shortcuts are disabled when typing in text fields.
        </div>
      </motion.div>
    </motion.div>
    )}
    </AnimatePresence>
  );
};

const ThemeSwitcher = () => {
  const { currentTheme, setTheme, setCustomThemeVideo } = useTheme();

  const handleCustom = () => {
    const url = prompt("Klistra in en YouTube URL för att använda som videobakgrund:");
    if (!url) return;

    try {
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        videoId = new URL(url).searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        setCustomThemeVideo(videoId);
      } else {
        alert("Ops! Det där ser inte ut som en giltig YouTube-länk.");
      }
    } catch {
      alert("Ops! Det där ser inte ut som en giltig YouTube-länk.");
    }
  };

  return (
    <div className="flex gap-2 bg-black/20 p-1.5 rounded-full backdrop-blur-sm border border-white/10">
      <button
        onClick={() => setTheme('forest')}
        className={cn(
          "p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
          currentTheme.id === 'forest' ? "bg-white/20 text-white shadow-lg" : "text-white/50 hover:text-white"
        )}
        title="Forest (1)"
      >
        <Trees size={18} />
      </button>
      <button
        onClick={() => setTheme('cafe')}
        className={cn(
          "p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
          currentTheme.id === 'cafe' ? "bg-white/20 text-white shadow-lg" : "text-white/50 hover:text-white"
        )}
        title="Cafe (2)"
      >
        <Coffee size={18} />
      </button>
      <button
        onClick={() => setTheme('bedroom')}
        className={cn(
          "p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
          currentTheme.id === 'bedroom' ? "bg-white/20 text-white shadow-lg" : "text-white/50 hover:text-white"
        )}
        title="Bedroom (3)"
      >
        <Moon size={18} />
      </button>
      <div className="w-px h-6 bg-white/10 self-center mx-1" />
      <button
        onClick={handleCustom}
        className={cn(
          "p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
          currentTheme.id === 'custom' ? "bg-white/20 text-white shadow-lg" : "text-white/50 hover:text-white"
        )}
        title="Custom YouTube Background"
      >
        <MonitorPlay size={18} />
      </button>
    </div>
  );
};

const Toast = ({ message, isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div 
        initial={{ opacity: 0, y: 20, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 0, x: "-50%", scale: 0.95 }}
        className="fixed bottom-24 left-1/2 z-50 px-6 py-3 rounded-full bg-black/80 text-white backdrop-blur-md border border-white/10 shadow-2xl flex items-center gap-2 pointer-events-none"
      >
        <span className="text-sm font-medium">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

const LofiStation = () => {
  const { currentTheme, setTheme } = useTheme(); 
  const [currentMix, setCurrentMix] = useState({});
  const [savedMixes, setSavedMixes] = useState([]);
  const [activeMixId, setActiveMixId] = useState(null);
  const [isGlobalMute, setIsGlobalMute] = useState(false);
  const [sessionStats, setSessionStats] = useState({ focusMinutes: 0, completedSessions: 0, date: new Date().toLocaleDateString() });
  
  // Hotkey States
  const [toast, setToast] = useState({ message: '', visible: false });
  const [playPauseTrigger, setPlayPauseTrigger] = useState(0);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Load saved mixes and stats from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lofi_mixes');
    if (saved) {
      setSavedMixes(JSON.parse(saved));
    }
    const savedStats = localStorage.getItem('lofi_session_stats');
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      const today = new Date().toLocaleDateString();
      
      // Nollställ om det är en ny dag
      if (parsedStats.date !== today) {
        const resetStats = { focusMinutes: 0, completedSessions: 0, date: today };
        setSessionStats(resetStats);
        localStorage.setItem('lofi_session_stats', JSON.stringify(resetStats));
      } else {
        setSessionStats(parsedStats);
      }
    }
  }, []);

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
  };

  // Global Hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      
      // Help Toggle (?) or (H)
      if (key === '?' || (key === 'h' && !e.metaKey && !e.ctrlKey)) {
        setIsHelpOpen(prev => !prev);
      }

      // If modal is open, ignore other hotkeys except closing it
      if (isHelpOpen) {
        if (key === 'escape') setIsHelpOpen(false);
        return;
      }

      // Mute Toggle (M)
      if (key === 'm') {
        setIsGlobalMute(prev => {
          const newState = !prev;
          showToast(newState ? "🔇 All Audio Muted" : "🔊 Audio Unmuted");
          return newState;
        });
      }

      // Play/Pause YouTube Only (Space)
      if (key === ' ') {
        e.preventDefault();
        setPlayPauseTrigger(prev => prev + 1);
        showToast("⏯️ Play/Pause Music");
      }

      // Theme Switching (1-3)
      if (['1', '2', '3'].includes(key)) {
        const themeMap = { '1': 'forest', '2': 'cafe', '3': 'bedroom' };
        const newTheme = themeMap[key];
        if (newTheme) {
          setTheme(newTheme);
          // Capitalize first letter for toast
          const themeName = newTheme.charAt(0).toUpperCase() + newTheme.slice(1);
          showToast(`🎨 Theme: ${themeName}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTheme, isHelpOpen]); // Add isHelpOpen to dep array

  const handleSessionComplete = (minutes) => {
    setSessionStats(prev => {
      const today = new Date().toLocaleDateString();
      const isNewDay = prev.date !== today; // Check in case page was open over midnight

      const newStats = {
        focusMinutes: isNewDay ? minutes : prev.focusMinutes + minutes,
        completedSessions: isNewDay ? 1 : prev.completedSessions + 1,
        date: today
      };
      localStorage.setItem('lofi_session_stats', JSON.stringify(newStats));
      showToast(`🎉 Session complete! +${minutes} min focus`);
      return newStats;
    });
  };

  const handleMixChange = (newMixState) => {
    setCurrentMix(newMixState);
  };

  const saveMix = () => {
    const name = prompt("Enter a name for this mix:", `Mix ${savedMixes.length + 1}`);
    if (!name) return;

    const newMix = {
      id: Date.now(),
      name,
      themeId: currentTheme.id,
      mixState: currentMix,
      timestamp: new Date().toISOString()
    };

    const updatedMixes = [...savedMixes, newMix];
    setSavedMixes(updatedMixes);
    localStorage.setItem('lofi_mixes', JSON.stringify(updatedMixes));
  };

  const loadMix = (mix) => {
    setActiveMixId(mix.id);
    // Theme will be updated by the user manually or we can force it:
    // setTheme(mix.themeId); // Need access to setTheme here if we want to force it
    // But for now, let's just pass the mix state down
  };

  const deleteMix = (id, e) => {
    e.stopPropagation();
    const updatedMixes = savedMixes.filter(m => m.id !== id);
    setSavedMixes(updatedMixes);
    localStorage.setItem('lofi_mixes', JSON.stringify(updatedMixes));
    if (activeMixId === id) setActiveMixId(null);
  };

  return (
    <Layout>
      <Toast message={toast.message} isVisible={toast.visible} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      <header className="p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Disc className="text-white animate-spin-slow" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md hidden sm:block">
            Lofi Focus
          </h1>
        </div>

        {/* Centered Pomodoro Timer */}
        <div className="absolute left-1/2 top-6 -translate-x-1/2 z-30">
          <PomodoroTimer onSessionComplete={handleSessionComplete} />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/20 text-white/70 hover:bg-black/30 hover:text-white backdrop-blur-sm border border-white/10 transition-colors"
            title="Shortcuts (H or ?)"
          >
            <Keyboard size={18} />
          </button>
          
          <button 
            onClick={() => setIsGlobalMute(!isGlobalMute)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10 transition-colors",
              isGlobalMute ? "bg-red-500/20 text-red-200 border-red-500/30" : "bg-black/20 text-white/70 hover:bg-black/30 hover:text-white"
            )}
            title="Hotkey: M"
          >
            {isGlobalMute ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline">
              {isGlobalMute ? "Unmute All" : "Mute All"}
            </span>
          </button>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 p-4 lg:p-8 max-w-[1400px] mx-auto w-full">
        
        {/* Left Column: Player & Mixes */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col gap-6 w-full lg:w-[400px] xl:w-[450px] flex-shrink-0"
        >
          <YouTubePlayer 
            isGlobalMute={isGlobalMute} 
            playPauseTrigger={playPauseTrigger}
          />
          
          {/* Saved Mixes Panel */}
          <div className={cn(
            "flex flex-col h-56 w-full p-5 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl transition-colors",
            currentTheme.colors.panel
          )}>
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h2 className="text-lg font-semibold text-white/90">Saved Mixes</h2>
              <button 
                onClick={saveMix}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/5"
              >
                <Save size={16} />
                Save Mix
              </button>
            </div>

            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1"> 
              <AnimatePresence>
                {savedMixes.length === 0 ? (
                  <motion.div 
                    key="no-mixes"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 text-white/40 text-sm"
                  >
                    No saved mixes yet. Create your perfect vibe and save it!
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {savedMixes.map(mix => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 15, height: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        key={mix.id}
                        onClick={() => loadMix(mix)}
                        className={cn(
                          "group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors overflow-hidden",
                          activeMixId === mix.id 
                            ? "bg-white/20 border-white/30" 
                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70">
                            {mix.themeId === 'forest' ? '🌲' : mix.themeId === 'cafe' ? '☕' : '🌙'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-medium text-sm truncate max-w-[180px]">{mix.name}</span>
                            <span className="text-white/40 text-xs">{new Date(mix.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => deleteMix(mix.id, e)}
                          className="text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Middle Column: Focus Tasks & Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col gap-6 w-full lg:w-[320px] xl:w-[350px] flex-shrink-0"
        >
          <SessionStats stats={sessionStats} />
          <FocusTasks />
        </motion.div>

        {/* Right Column: Mixer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col w-full lg:w-[320px] xl:w-[350px] flex-shrink-0"
        >
          <SoundMixer 
            onMixChange={handleMixChange} 
            savedMix={activeMixId ? savedMixes.find(m => m.id === activeMixId)?.mixState : null}
            isGlobalMute={isGlobalMute}
          />
        </motion.div>

      </main>
    </Layout>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LofiStation />
    </ThemeProvider>
  );
};

export default App;
