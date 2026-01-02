'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { stopTimer } from '@/store/habitSlice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FocusTimer() {
  const activeTimer = useAppSelector((state) => state.habit.activeTimer);
  const habits = useAppSelector((state) => state.habit.habits);
  const dispatch = useAppDispatch();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer) {
      const startTime = new Date(activeTimer.startTime).getTime();
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  if (!activeTimer) return null;

  const activeHabit = habits.find((h) => h.id === activeTimer.habitId);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 right-4 z-50 w-full max-w-sm"
      >
        <Card className="border-t-4 shadow-2xl p-4 bg-zinc-900/95 backdrop-blur-xl border-zinc-800" style={{ borderColor: activeHabit?.color }}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Focusing On</p>
              <h3 className="font-bold text-lg text-white truncate max-w-[200px]">{activeHabit?.title}</h3>
            </div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums">
              {formatTime(elapsed)}
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={() => dispatch(stopTimer())}
            >
              <Square className="h-4 w-4 mr-2" fill="currentColor" /> Stop & Save
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
