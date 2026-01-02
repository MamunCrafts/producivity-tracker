import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Habit, TimeLog } from '@/types';

interface HabitState {
  habits: Habit[];
  logs: TimeLog[];
  activeTimer: { habitId: string; startTime: string; logId: string } | null;
}

const initialState: HabitState = {
  habits: [],
  logs: [],
  activeTimer: null,
};

export const habitSlice = createSlice({
  name: 'habit',
  initialState,
  reducers: {
    hydrate: (state, action: PayloadAction<HabitState>) => {
      return { ...state, ...action.payload };
    },
    addHabit: (state, action: PayloadAction<Omit<Habit, 'id' | 'createdAt' | 'completed' | 'color'> & { color?: string }>) => {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        completed: false,
        color: action.payload.color || '#3b82f6',
        ...action.payload,
      };
      state.habits.push(newHabit);
    },
    updateHabit: (state, action: PayloadAction<{ id: string; updates: Partial<Habit> }>) => {
      const index = state.habits.findIndex((h) => h.id === action.payload.id);
      if (index !== -1) {
        state.habits[index] = { ...state.habits[index], ...action.payload.updates };
      }
    },
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter((h) => h.id !== action.payload);
      state.logs = state.logs.filter((l) => l.habitId !== action.payload);
    },
    startTimer: (state, action: PayloadAction<string>) => {
      if (state.activeTimer) return;
      state.activeTimer = {
        habitId: action.payload,
        startTime: new Date().toISOString(),
        logId: crypto.randomUUID(),
      };
    },
    stopTimer: (state) => {
      if (!state.activeTimer) return;
      
      const endTime = new Date().toISOString();
      const start = new Date(state.activeTimer.startTime);
      const end = new Date(endTime);
      const durationSeconds = (end.getTime() - start.getTime()) / 1000;
      const date = start.toISOString().split('T')[0];

      const newLog: TimeLog = {
        id: state.activeTimer.logId,
        habitId: state.activeTimer.habitId,
        startTime: state.activeTimer.startTime,
        endTime,
        durationSeconds,
        date,
      };

      state.logs.push(newLog);
      state.activeTimer = null;
    },
    addManualLog: (state, action: PayloadAction<{ habitId: string; durationSeconds: number; date: string }>) => {
      const newLog: TimeLog = {
        id: crypto.randomUUID(),
        habitId: action.payload.habitId,
        startTime: new Date().toISOString(), // Approximate for manual entry
        endTime: null,
        durationSeconds: action.payload.durationSeconds,
        date: action.payload.date,
      };
      state.logs.push(newLog);
    },
  },
});

export const { addHabit, updateHabit, deleteHabit, startTimer, stopTimer, hydrate, addManualLog } = habitSlice.actions;
export default habitSlice.reducer;
