'use client';

import { useAppSelector } from '@/store/hooks';
import { HabitCard } from './HabitCard';

export function HabitList() {
  const habits = useAppSelector((state) => state.habit.habits);

  if (habits.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-zinc-300">No habits yet</h3>
        <p className="text-zinc-500 mt-2">Create your first habit to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
        ))}
    </div>
  );
}
