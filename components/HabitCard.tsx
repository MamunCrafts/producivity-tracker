'use client';

import { Habit } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { startTimer, deleteHabitAsync } from '@/store/habitSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Play, BarChart2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HabitAnalytics } from './HabitAnalytics';
import { ManualLogForm } from './ManualLogForm';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const dispatch = useAppDispatch();
  const activeTimer = useAppSelector((state) => state.habit.activeTimer);
  const logs = useAppSelector((state) => state.habit.logs);
  
  const isRunning = activeTimer?.habitId === habit.id;

  // Calculate progress
  // Ideally this should be a memoized selector, but keeping it inline for simplicity as per previous implementation
  const calculateProgress = () => {
    const totalSecondsLogged = logs
      .filter((l) => l.habitId === habit.id)
      .reduce((acc, log) => acc + log.durationSeconds, 0);

    const totalHoursLogged = totalSecondsLogged / 3600;
    const percentage = Math.min((totalHoursLogged / habit.totalHours) * 100, 100);

    return {
      current: totalHoursLogged,
      percentage,
    };
  };

  const progress = calculateProgress();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300 relative group overflow-hidden border-zinc-800 bg-zinc-900/40">
        <div 
          className="absolute left-0 top-0 w-1 h-full transition-all duration-300 group-hover:w-1.5"
          style={{ backgroundColor: habit.color }}
        />
        <CardHeader className="flex flex-row items-start justify-between pb-2 pl-6">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-zinc-100">{habit.title}</CardTitle>
            <p className="text-xs text-muted-foreground line-clamp-1">{habit.description}</p>
          </div>
          {isRunning && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
        </CardHeader>
        <CardContent className="space-y-4 pl-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Total Progress</span>
              <span className="font-medium text-zinc-100">{Math.round(progress.percentage)}%</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
            <div className="flex justify-between text-xs text-zinc-500">
               <span>{progress.current.toFixed(1)} / {habit.totalHours} hrs</span>
               <span>{habit.totalDays} Days Goal</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
                size="sm" 
                variant={isRunning ? "secondary" : "default"}
                className={cn(
                    "flex-1 gap-2",
                    !isRunning && "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                )}
                onClick={() => !isRunning && dispatch(startTimer(habit.id))}
                disabled={isRunning}
            >
                <Play className={cn("h-4 w-4", isRunning && "animate-pulse")} fill="currentColor" />
                {isRunning ? "Focusing..." : "Start Focus"}
            </Button>
            
            <ManualLogForm habitId={habit.id} habitTitle={habit.title} />

             <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" variant="outline" className="border-zinc-700 hover:bg-zinc-800 hover:text-white">
                  <BarChart2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    {/* Fixed: Added DialogTitle for accessibility */}
                    <DialogTitle>{habit.title} Analytics</DialogTitle>
                </DialogHeader>
                <HabitAnalytics habit={habit} />
              </DialogContent>
            </Dialog>
            
            <Button size="icon" variant="ghost" className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10" onClick={() => dispatch(deleteHabitAsync(habit.id))}>
                <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
