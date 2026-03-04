import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const PomodoroTimer = ({ onSessionComplete }) => {
  const [mode, setMode] = useState('work'); // 'work' | 'break'
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false); // Pausa klockan under de 5 sekunderna

      // Spela upp notifikationsljud när tiden är ute
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.error("Kunde inte spela upp ljudet:", e));

      // If we just finished a 'work' session naturally
      if (mode === 'work' && onSessionComplete) {
        onSessionComplete(25); // Ändrad tillbaka till 25 minuter
      }
      
      // Vänta 5 sekunder innan vi byter läge och startar timern igen
      setTimeout(() => {
        const nextMode = mode === 'work' ? 'break' : 'work';
        setMode(nextMode);
        setTimeLeft(nextMode === 'work' ? WORK_TIME : BREAK_TIME);
        setIsActive(true); // STARTA NÄSTA RUNDA AUTOMATISKT
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, onSessionComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="hidden md:flex items-center gap-3 bg-black/20 backdrop-blur-md rounded-full pl-1 pr-3 py-1 border border-white/10 shadow-lg">
      <div className="flex bg-white/5 rounded-full p-1">
        <button
          onClick={() => switchMode('work')}
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all",
            mode === 'work' ? "bg-white/20 text-white shadow-sm" : "text-white/40 hover:text-white/80"
          )}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all",
            mode === 'break' ? "bg-white/20 text-white shadow-sm" : "text-white/40 hover:text-white/80"
          )}
        >
          Break
        </button>
      </div>

      <div className="w-px h-6 bg-white/10" />

      <div className="font-mono text-lg font-bold text-white tracking-widest min-w-[60px] text-center tabular-nums">
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleTimer}
          className={cn(
            "p-1.5 rounded-full transition-all",
            isActive ? "bg-red-500/20 text-red-100 hover:bg-red-500/30" : "bg-white/10 text-white hover:bg-white/20"
          )}
          title={isActive ? "Pause" : "Start"}
        >
          {isActive ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          title="Reset"
        >
          <RotateCcw size={12} />
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
