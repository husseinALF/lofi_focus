import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Layout from './components/Layout';
import YouTubePlayer from './components/YouTubePlayer';
import SoundMixer from './components/SoundMixer';
import { Save, Disc, Trash2, Moon, Sun, Coffee, Trees, Volume2, VolumeX } from 'lucide-react';
import { cn } from './lib/utils';

const ThemeSwitcher = () => {
  const { currentTheme, setTheme, themes } = useTheme();

  return (
    <div className="flex gap-2 bg-black/20 p-1.5 rounded-full backdrop-blur-sm border border-white/10">
      <button
        onClick={() => setTheme('forest')}
        className={cn(
          "p-2 rounded-full transition-all duration-300",
          currentTheme.id === 'forest' ? "bg-white/20 text-white shadow-lg" : "text-white/50 hover:text-white"
        )}
        title="Forest"
      >
        <Trees size={18} />
      </button>
      <button
        onClick={() => setTheme('cafe')}
        className={cn(
          "p-2 rounded-full transition-all duration-300",
          currentTheme.id === 'cafe' ? "bg-white/20 text-white shadow-lg" : "text-white/50 hover:text-white"
        )}
        title="Cafe"
      >
        <Coffee size={18} />
      </button>
      <button
        onClick={() => setTheme('bedroom')}
        className={cn(
          "p-2 rounded-full transition-all duration-300",
          currentTheme.id === 'bedroom' ? "bg-white/20 text-white shadow-lg" : "text-white/50 hover:text-white"
        )}
        title="Bedroom"
      >
        <Moon size={18} />
      </button>
    </div>
  );
};

const LofiStation = () => {
  const { currentTheme } = useTheme();
  const [currentMix, setCurrentMix] = useState({});
  const [savedMixes, setSavedMixes] = useState([]);
  const [activeMixId, setActiveMixId] = useState(null);
  const [isGlobalMute, setIsGlobalMute] = useState(false);

  // Load saved mixes from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lofi_mixes');
    if (saved) {
      setSavedMixes(JSON.parse(saved));
    }
  }, []);

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
      <header className="p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Disc className="text-white animate-spin-slow" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md hidden sm:block">
            Lofi Focus
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsGlobalMute(!isGlobalMute)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10 transition-colors",
              isGlobalMute ? "bg-red-500/20 text-red-200 border-red-500/30" : "bg-black/20 text-white/70 hover:bg-black/30 hover:text-white"
            )}
          >
            {isGlobalMute ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline">
              {isGlobalMute ? "Unmute All" : "Mute All"}
            </span>
          </button>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 p-6 lg:p-12 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Player & Controls */}
        <div className="flex flex-col gap-6 w-full lg:w-2/3 max-w-3xl">
          <YouTubePlayer isGlobalMute={isGlobalMute} />
          
          {/* Saved Mixes Panel */}
          <div className={cn(
            "p-6 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl transition-colors",
            currentTheme.colors.panel
          )}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white/90">Saved Mixes</h2>
              <button 
                onClick={saveMix}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/5"
              >
                <Save size={16} />
                Save Current Mix
              </button>
            </div>

            {savedMixes.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-sm">
                No saved mixes yet. Create your perfect vibe and save it!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedMixes.map(mix => (
                  <div 
                    key={mix.id}
                    onClick={() => loadMix(mix)}
                    className={cn(
                      "group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
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
                        <span className="text-white font-medium text-sm">{mix.name}</span>
                        <span className="text-white/40 text-xs">{new Date(mix.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => deleteMix(mix.id, e)}
                      className="text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mixer */}
        <div className="w-full lg:w-auto flex-shrink-0">
          <SoundMixer 
            onMixChange={handleMixChange} 
            savedMix={activeMixId ? savedMixes.find(m => m.id === activeMixId)?.mixState : null}
            isGlobalMute={isGlobalMute}
          />
        </div>

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
