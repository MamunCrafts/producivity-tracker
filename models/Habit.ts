import mongoose, { Schema, Model } from 'mongoose';
import { Habit } from '@/types';

type HabitDocument = Habit & mongoose.Document;

const HabitSchema = new Schema<HabitDocument>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  totalHours: { type: Number, required: true },
  perDayHours: { type: Number, required: true },
  timeSlot: { type: String },
  weekFrequency: { type: Number, required: true },
  totalDays: { type: Number },
  createdAt: { type: String, required: true },
  completed: { type: Boolean, default: false },
  color: { type: String, required: true },
});

// Check if model already exists to prevent overwrite error in hot reload
const HabitModel: Model<HabitDocument> = mongoose.models.Habit || mongoose.model<HabitDocument>('Habit', HabitSchema);

export default HabitModel;
