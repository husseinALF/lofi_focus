import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Sliders } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

const SOUNDS = [
  { id: 'rain', name: 'Rain', path: '/sound/rain.mp3', icon: '🌧️' },
  { id: 'thunder', name: 'Thunder', path: '/sound/thunder.mp3', icon: '⚡' },
  { id: 'cafe', name: 'Cafe', path: '/sound/cafe.mp3', icon: '☕' },
  { id: 'fireplace', name: 'Fireplace', path: '/sound/fireplace.mp3', icon: '🔥' },
  { id: 'birds', name: 'Birds', path: '/sound/birds.mp3', icon: '🐦' },
  { id: 'ocean', name: 'Ocean', path: '/sound/ocean.mp3', icon: '🌊' },
  { id: 'crickets', name: 'Night', path: '/sound/crickets.mp3', icon: '🦗' },
  { id: 'tokyo', name: 'Tokyo', path: '/sound/tokyo.mp3', icon: '🗼' },
  { id: 'keyboard', name: 'Typing', path: '/sound/keyboard.mp3', icon: '⌨️' },
];

const SoundControl = ({ sound, onVolumeChange, initialVolume = 0, initialPlaying = false, isGlobalMute = false }) => {
  const [isPlaying, setIsPlaying] = useState(initialPlaying);
  const [volume, setVolume] = useState(initialVolume);
  const audioRef = useRef(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    audioRef.current = new Audio(sound.path);
    audioRef.current.loop = true;
    audioRef.current.volume = volume / 100;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [sound.path]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isGlobalMute) {
        // Handle promise to avoid "play() failed because the user didn't interact" errors
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Audio play failed:", error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isGlobalMute]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    onVolumeChange(sound.id, volume, isPlaying);
  }, [volume]);

  // Sync external state changes (e.g. from loading a preset)
  useEffect(() => {
      if (initialPlaying !== isPlaying) setIsPlaying(initialPlaying);
      if (initialVolume !== volume) setVolume(initialVolume);
  }, [initialPlaying, initialVolume]);


  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className="w-8 text-2xl flex justify-center">{sound.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-white/90">{sound.name}</span>
          <button 
            onClick={togglePlay}
            className={cn(
              "p-1 rounded-full transition-colors",
              isPlaying && !isGlobalMute ? "text-white bg-white/20" : "text-white/50 hover:text-white hover:bg-white/10"
            )}
            disabled={isGlobalMute}
          >
            {isPlaying && !isGlobalMute ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className={cn(
            "w-full h-1 rounded-lg appearance-none cursor-pointer bg-white/10",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3",
            "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/80 [&::-webkit-slider-thumb]:hover:bg-white",
            "[&::-webkit-slider-thumb]:transition-colors",
            isGlobalMute && "opacity-50 cursor-not-allowed"
          )}
          disabled={isGlobalMute}
        />
      </div>
    </div>
  );
};

const SoundMixer = ({ onMixChange, savedMix, isGlobalMute = false }) => {
  const { currentTheme } = useTheme();
  const [mixState, setMixState] = useState({});
  const [isMixerMuted, setIsMixerMuted] = useState(false);

  // Initialize mix state from saved mix or defaults
  useEffect(() => {
      if (savedMix) {
          setMixState(savedMix);
      }
  }, [savedMix]);

  const handleVolumeChange = (id, volume, isPlaying) => {
    const newState = { ...mixState, [id]: { volume, isPlaying } };
    setMixState(newState);
    if (onMixChange) onMixChange(newState);
  };

  const toggleMixerMute = () => {
    setIsMixerMuted(!isMixerMuted);
  };

  const effectiveMute = isGlobalMute || isMixerMuted;

  return (
    <div className={cn(
      "flex flex-col p-6 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl w-full",
      currentTheme.colors.panel
    )}>
      <div className="flex items-center justify-between mb-6 text-white/90 shrink-0">
        <div className="flex items-center gap-2">
          <Sliders size={20} />
          <h2 className="text-lg font-semibold tracking-wide">Ambience Mixer</h2>
        </div>
        <button 
          onClick={toggleMixerMute}
          className={cn(
            "p-2 rounded-full transition-colors",
            isMixerMuted ? "bg-white/20 text-white" : "text-white/60 hover:text-white hover:bg-white/10"
          )}
          title="Mute All Ambience"
        >
          {isMixerMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
      
      <div className="space-y-1.5 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-200px)] lg:max-h-[500px]">
        {SOUNDS.map(sound => (
          <SoundControl 
            key={sound.id} 
            sound={sound} 
            onVolumeChange={handleVolumeChange}
            initialVolume={savedMix?.[sound.id]?.volume || 0}
            initialPlaying={savedMix?.[sound.id]?.isPlaying || false}
            isGlobalMute={effectiveMute}
          />
        ))}
      </div>
    </div>
  );
};

export default SoundMixer;
