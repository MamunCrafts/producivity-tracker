import { configureStore } from '@reduxjs/toolkit';
import habitReducer from './habitSlice';

export const store = configureStore({
  reducer: {
    habit: habitReducer,
  },
});

// Subscribe to store changes to persist to localStorage
store.subscribe(() => {
  if (typeof window !== 'undefined') {
    const state = store.getState();
    localStorage.setItem('habit-storage', JSON.stringify({
      state: state.habit,
       version: 0 // Matching zustand persist format loosely or just simple object
    })); 
    // Simplified persistence: direct object. 
    // NOTE: Zustand used { state: ... }, sticking to simple key for now or adapting.
    // Let's just save the habit slice directly for simplicity, but cleaner to match structure if we wanted to standardise.
    // Direct save:
    localStorage.setItem('redux-habit-state', JSON.stringify(state.habit));
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
