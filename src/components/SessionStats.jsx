import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Flame, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export const SessionStats = ({ stats }) => {
  const { currentTheme } = useTheme();

  return (
    <div className={cn(
      "flex flex-row justify-between w-full p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl transition-colors shrink-0",
      currentTheme.colors.panel
    )}>
      <div className="flex flex-col items-center justify-center flex-1 border-r border-white/10">
        <div className="flex items-center gap-1.5 text-white/50 mb-1">
          <Clock size={14} />
          <span className="text-xs font-medium uppercase tracking-wider">Focus Time</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white leading-none">
            {stats.focusMinutes}
          </span>
          <span className="text-[10px] text-white/40">minutes today</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <div className="flex items-center gap-1.5 text-white/50 mb-1">
          <Flame size={14} />
          <span className="text-xs font-medium uppercase tracking-wider">Sessions</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white leading-none">
            {stats.completedSessions}
          </span>
          <span className="text-[10px] text-white/40">completed</span>
        </div>
      </div>
    </div>
  );
};
