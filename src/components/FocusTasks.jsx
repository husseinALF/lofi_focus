import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Check, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export const FocusTasks = () => {
  const { currentTheme } = useTheme();
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('lofi_focus_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTaskText, setNewTaskText] = useState('');

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('lofi_focus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    setTasks([
      ...tasks, 
      { id: Date.now(), text: newTaskText.trim(), completed: false }
    ]);
    setNewTaskText('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className={cn(
      "flex flex-col h-[340px] w-full p-5 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl transition-colors",
      currentTheme.colors.panel
    )}>
      <h2 className="text-lg font-semibold text-white/90 mb-4 flex-shrink-0">Focus Tasks</h2>
      
      <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 mb-4 space-y-2">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-white/40 text-sm"
            >
              What's your main focus right now? Add a task below.
            </motion.div>
          ) : (
            tasks.map(task => (
              <motion.div 
                key={task.id}
                layout
                initial={{ opacity: 0, y: 15, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto", marginBottom: 8 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={cn(
                  "group flex items-center justify-between p-2.5 rounded-xl border transition-colors overflow-hidden",
                  task.completed 
                    ? "bg-white/5 border-white/5 opacity-60" 
                    : "bg-white/10 border-white/10 hover:bg-white/15 hover:border-white/20"
                )}
              >
              <button 
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                {task.completed ? (
                  <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
                ) : (
                  <Circle size={18} className="text-white/40 group-hover:text-white/70 flex-shrink-0" />
                )}
                <span className={cn(
                  "text-sm transition-all",
                  task.completed ? "text-white/50 line-through" : "text-white/90"
                )}>
                  {task.text}
                </span>
              </button>
              
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))
        )}
        </AnimatePresence>
      </div>

      <form onSubmit={addTask} className="flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
        />
        <button 
          type="submit"
          disabled={!newTaskText.trim()}
          className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 rounded-lg text-white transition-colors border border-white/5"
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
};
