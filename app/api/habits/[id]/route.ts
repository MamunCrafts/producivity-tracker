import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HabitModel from '@/models/Habit';
import TimeLogModel from '@/models/TimeLog';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  
  await HabitModel.findOneAndDelete({ id });
  await TimeLogModel.deleteMany({ habitId: id });
  
  return NextResponse.json({ message: 'Deleted' });
}
