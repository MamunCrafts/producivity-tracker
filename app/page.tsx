import { HabitForm } from '@/components/HabitForm';
import { HabitList } from '@/components/HabitList';
import { FocusTimer } from '@/components/FocusTimer';
import StoreProvider from './StoreProvider';

export default function Home() {
  return (
    <StoreProvider>
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Productivity Tracker
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Design your days, track your progress.
            </p>
          </div>
          <HabitForm />
        </header>

        <section>
          <HabitList />
        </section>

        <FocusTimer />
      </div>
    </StoreProvider>
  );
}
