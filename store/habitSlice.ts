import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Habit, TimeLog } from "@/types";
import { RootState } from "./store";

interface HabitState {
  habits: Habit[];
  logs: TimeLog[];
  activeTimer: { habitId: string; startTime: string; logId: string } | null;
  status: "idle" | "loading" | "failed";
}

const initialState: HabitState = {
  habits: [],
  logs: [],
  activeTimer: null,
  status: "idle",
};

// Async Thunks
export const fetchHabits = createAsyncThunk("habit/fetchHabits", async () => {
  const response = await fetch("/api/habits");
  return (await response.json()) as Habit[];
});

export const fetchLogs = createAsyncThunk("habit/fetchLogs", async () => {
  const response = await fetch("/api/logs");
  return (await response.json()) as TimeLog[];
});

export const createHabit = createAsyncThunk(
  "habit/createHabit",
  async (
    habitData: Omit<Habit, "id" | "createdAt" | "completed" | "color"> & {
      color?: string;
    }
  ) => {
    const newHabit = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completed: false,
      color: habitData.color || "#3b82f6",
      ...habitData,
    };
    const response = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newHabit),
    });
    return (await response.json()) as Habit;
  }
);

export const deleteHabitAsync = createAsyncThunk(
  "habit/deleteHabit",
  async (id: string) => {
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
    return id;
  }
);

export const createLogAsync = createAsyncThunk(
  "habit/createLog",
  async (logData: TimeLog) => {
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
    return (await response.json()) as TimeLog;
  }
);

export const stopTimerAsync = createAsyncThunk(
  "habit/stopTimer",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { activeTimer } = state.habit;
    if (!activeTimer) {
      throw new Error("No active timer");
    }

    const endTime = new Date().toISOString();
    const start = new Date(activeTimer.startTime);
    const end = new Date(endTime);
    const durationSeconds = Math.floor(
      (end.getTime() - start.getTime()) / 1000
    );
    const date = start.toISOString().split("T")[0];

    const newLog: TimeLog = {
      id: activeTimer.logId,
      habitId: activeTimer.habitId,
      startTime: activeTimer.startTime,
      endTime,
      durationSeconds,
      date,
    };

    // Dispatch createLog and wait for it
    await dispatch(createLogAsync(newLog)).unwrap();
    return newLog;
  }
);

export const habitSlice = createSlice({
  name: "habit",
  initialState,
  reducers: {
    startTimer: (state, action: PayloadAction<string>) => {
      if (state.activeTimer) return;
      state.activeTimer = {
        habitId: action.payload,
        startTime: new Date().toISOString(),
        logId: crypto.randomUUID(),
      };
    },
    // We keep a simple stopTimer to clear state if needed, but the Thunk handles the logic
    clearTimer: (state) => {
      state.activeTimer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.habits = action.payload;
        state.status = "idle";
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.logs = action.payload;
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.habits.push(action.payload);
      })
      .addCase(deleteHabitAsync.fulfilled, (state, action) => {
        state.habits = state.habits.filter((h) => h.id !== action.payload);
        state.logs = state.logs.filter((l) => l.habitId !== action.payload);
      })
      .addCase(createLogAsync.fulfilled, (state, action) => {
        state.logs.push(action.payload);
      })
      .addCase(stopTimerAsync.fulfilled, (state) => {
        state.activeTimer = null;
      });
  },
});

export const { startTimer, clearTimer } = habitSlice.actions;
export default habitSlice.reducer;
