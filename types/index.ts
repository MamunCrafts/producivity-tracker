export interface Habit {
  id: string;
  title: string;
  description: string;
  totalHours: number; // Goal for the total duration in hours
  perDayHours: number; // Goal for daily duration in hours
  timeSlot: string; // e.g., "Morning", "10:00-12:00"
  weekFrequency: number; // days per week
  totalDays: number; // Duration of the challenge
  createdAt: string; // ISO Date string
  completed: boolean;
  color: string; // Hex color for UI
  status: "Active" | "Deleted"; // Status for soft delete
}

export interface TimeLog {
  id: string;
  habitId: string;
  startTime: string; // ISO Date string
  endTime: string | null; // ISO Date string
  durationSeconds: number;
  date: string; // YYYY-MM-DD
}
