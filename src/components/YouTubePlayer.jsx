import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Volume2, VolumeX, Play, Pause, Minimize2, Maximize2, SkipBack, SkipForward, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';

const DEFAULT_PLAYLIST = "PL6NdkXsPL07Il2hEQGcLI4dg_LTg7xA2L"; // User requested playlist

const YouTubePlayer = ({ initialVolume = 50, onVolumeChange, isGlobalMute = false, playPauseTrigger = 0 }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mediaSource, setMediaSource] = useState({ type: 'playlist', id: DEFAULT_PLAYLIST });
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState(null);
  const { currentTheme } = useTheme();

  const volumeRef = useRef(volume);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Handle Global Play/Pause Hotkey
  useEffect(() => {
    if (playPauseTrigger > 0) { // Should not run on initial mount if trigger is 0
      togglePlay();
    }
  }, [playPauseTrigger]);

  const opts = React.useMemo(() => {
    const options = {
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 1,
        controls: 0, // Hide default controls
        modestbranding: 1,
        rel: 0,
        origin: window.location.origin,
      },
    };

    if (mediaSource.type === 'playlist') {
      options.playerVars.listType = 'playlist';
      options.playerVars.list = mediaSource.id;
    }

    return options;
  }, [mediaSource]);

  const onReady = React.useCallback((event) => {
    setPlayer(event.target);
    event.target.setVolume(volumeRef.current);
    event.target.playVideo();
    setError(null);
  }, []);

  const onStateChange = React.useCallback((event) => {
    setIsPlaying(event.data === 1);
    if (event.data === -1 || event.data === 1) {
       setError(null); // Clear error on start/unstarted
    }
  }, []);

  const onError = React.useCallback((event) => {
    console.error("YouTube Player Error:", event.data);
    setError("Video unavailable or restricted.");
  }, []);

  // Handle Global Mute
  useEffect(() => {
    if (player && typeof player.mute === 'function') {
      try {
        if (isGlobalMute) {
          player.mute();
        } else if (!isMuted) {
          player.unMute();
        }
      } catch (e) {
        console.warn("Player interaction failed", e);
      }
    }
  }, [isGlobalMute, player, isMuted]);

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleNext = () => {
    if (player && typeof player.nextVideo === 'function') {
      player.nextVideo();
    }
  };

  const handlePrevious = () => {
    if (player && typeof player.previousVideo === 'function') {
      player.previousVideo();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        player.unMute();
      }
    }
    if (onVolumeChange) onVolumeChange(newVolume);
  };

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      player.setVolume(volume);
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    // Extract Playlist ID
    const playlistMatch = urlInput.match(/[?&]list=([^#\&\?]+)/);
    if (playlistMatch) {
      setMediaSource({ type: 'playlist', id: playlistMatch[1] });
      setUrlInput('');
      return;
    }

    // Extract Video ID
    const videoMatch = urlInput.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    if (videoMatch) {
      setMediaSource({ type: 'video', id: videoMatch[1] });
      setUrlInput('');
      return;
    }

    setError("Invalid YouTube URL");
  };

  return (
    <div className={cn(
      "transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] overflow-hidden rounded-2xl backdrop-blur-md border border-white/10 shadow-xl relative group shrink-0 w-full",
      currentTheme.colors.panel,
      isMinimized ? "h-20" : "h-[250px] xl:h-[280px]"
    )}>
      {/* Header / Controls when minimized (NOW PLAYING info) */}
      <div className={cn(
        "absolute top-0 left-0 right-0 z-30 p-3 flex items-center justify-between transition-opacity pointer-events-none",
        !isMinimized && "opacity-0 group-hover:opacity-100 bg-gradient-to-b from-black/60 to-transparent",
        isMinimized && "static h-full w-full pointer-events-auto px-5"
      )}>
        <div className={cn(
          "flex items-center transition-opacity", 
          isMinimized ? "opacity-100 flex-1" : "opacity-0 invisible"
        )}>
          {/* Playback controls show up on the left when minimized */}
          {isMinimized && (
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={handlePrevious}
                disabled={mediaSource.type === 'video'}
                className={cn(
                  "w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-colors",
                  mediaSource.type === 'video' && "opacity-30 cursor-not-allowed hover:bg-white/10"
                )}
              >
                <SkipBack size={14} fill="currentColor" />
              </button>
              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm transition-colors"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
              </button>
              <button 
                onClick={handleNext}
                disabled={mediaSource.type === 'video'}
                className={cn(
                  "w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-colors",
                  mediaSource.type === 'video' && "opacity-30 cursor-not-allowed hover:bg-white/10"
                )}
              >
                <SkipForward size={14} fill="currentColor" />
              </button>
            </div>
          )}
        </div>

        {/* Volume control shows up inline in the middle when minimized */}
        {isMinimized && (
          <div className="flex shrink-0 justify-center items-center px-4 sm:px-8">
            <div className="flex items-center gap-2 w-[100px] sm:w-[150px]">
              <button onClick={toggleMute} className="text-white/80 hover:text-white shrink-0">
                {isMuted || volume === 0 || isGlobalMute ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted || isGlobalMute ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>
        )}

        <div className={cn(
          "flex justify-end",
          isMinimized ? "flex-1" : ""
        )}>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/50 hover:text-white transition-colors z-40 pointer-events-auto bg-black/20 p-1.5 rounded-md backdrop-blur-md"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className={cn(
        "w-full h-full transition-opacity duration-300 absolute inset-0 rounded-2xl overflow-hidden",
        isMinimized ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 bg-black/60 z-10 p-4 text-center">
            <AlertCircle size={32} className="mb-2 text-red-400" />
            <p className="text-sm font-medium">{error}</p>
            <p className="text-xs opacity-70 mt-1">Try pasting a new link below.</p>
          </div>
        ) : null}
        
        <YouTube 
          key={mediaSource.id} 
          videoId={mediaSource.type === 'video' ? mediaSource.id : undefined}
          opts={opts} 
          onReady={onReady}
          onStateChange={onStateChange}
          onError={onError}
          className="w-full h-full" 
          iframeClassName="w-full h-full"
        />
      </div>

      {/* Custom Controls Overlay (Only when expanded) */}
      {!isMinimized && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-300 flex flex-col gap-3 z-20 opacity-0 group-hover:opacity-100">
        
        {/* URL Input (Hidden when minimized) */}
        {!isMinimized && (
          <form onSubmit={handleUrlSubmit} className="flex items-center gap-2 w-full mb-1">
            <div className="relative flex-1 group/input">
              <LinkIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within/input:text-white/80 transition-colors" />
              <input 
                type="text" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste YouTube Link..." 
                className="w-full bg-black/40 hover:bg-black/50 focus:bg-black/60 border border-white/10 focus:border-white/30 rounded-full py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-white/50 outline-none transition-all shadow-sm"
              />
            </div>
            <button 
              type="submit"
              disabled={!urlInput}
              className="bg-black/40 hover:bg-black/60 disabled:opacity-30 disabled:hover:bg-black/40 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors border border-white/10"
            >
              Load
            </button>
          </form>
        )}

        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevious}
              disabled={mediaSource.type === 'video'}
              className={cn(
                "w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-colors",
                mediaSource.type === 'video' && "opacity-30 cursor-not-allowed hover:bg-white/10"
              )}
              title="Previous Track"
            >
              <SkipBack size={16} fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm transition-colors flex-shrink-0"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>

            <button 
              onClick={handleNext}
              disabled={mediaSource.type === 'video'}
              className={cn(
                "w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-colors",
                mediaSource.type === 'video' && "opacity-30 cursor-not-allowed hover:bg-white/10"
              )}
              title="Next Track"
            >
              <SkipForward size={16} fill="currentColor" />
            </button>
          </div>

          <div className={cn("flex items-center gap-2 flex-1", isMinimized && "hidden")}>
            <button onClick={toggleMute} className="text-white/80 hover:text-white">
              {isMuted || volume === 0 || isGlobalMute ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted || isGlobalMute ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default YouTubePlayer;
