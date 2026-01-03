import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import HabitModel from "@/models/Habit";
import TimeLogModel from "@/models/TimeLog";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  // Soft delete: update status to 'Deleted' instead of actually deleting
  const res = await HabitModel.findOneAndUpdate(
    { id },
    { $set: { status: "Deleted" } },
    { new: true } // Return the updated document
  );
  console.log("Soft deleted habit:", res);

  return NextResponse.json({ message: "Deleted", habit: res });
}
