import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HabitModel from '@/models/Habit';

export async function GET() {
  await dbConnect();
  const habits = await HabitModel.find({});
  return NextResponse.json(habits);
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const habit = await HabitModel.create(body);
  return NextResponse.json(habit, { status: 201 });
}
