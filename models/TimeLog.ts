import mongoose, { Schema, Model } from 'mongoose';
import { TimeLog } from '@/types';

type TimeLogDocument = TimeLog & mongoose.Document;

const TimeLogSchema = new Schema<TimeLogDocument>({
  id: { type: String, required: true, unique: true },
  habitId: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  durationSeconds: { type: Number, required: true },
  date: { type: String, required: true },
});

const TimeLogModel: Model<TimeLogDocument> = mongoose.models.TimeLog || mongoose.model<TimeLogDocument>('TimeLog', TimeLogSchema);

export default TimeLogModel;
