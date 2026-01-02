'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addHabit } from '@/store/habitSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HabitForm() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    totalHours: 100,
    perDayHours: 1,
    timeSlot: 'Morning',
    weekFrequency: 7,
    totalDays: 30,
    color: '#3b82f6',
  });

  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#eab308', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f97316', // orange
    '#06b6d4', // cyan
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addHabit(formData));
    setOpen(false);
    // Reset form
    setFormData({
      title: '',
      description: '',
      totalHours: 100,
      perDayHours: 1,
      timeSlot: 'Morning',
      weekFrequency: 7,
      totalDays: 30,
      color: '#3b82f6',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="premium" className="gap-2">
          <Plus className="h-4 w-4" /> Add New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>
            Set your goals and track your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Habit Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Learn React"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your goal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="totalHours">Total Hours Goal</Label>
              <Input
                id="totalHours"
                type="number"
                min="1"
                value={formData.totalHours}
                onChange={(e) => setFormData({ ...formData, totalHours: Number(e.target.value) })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="perDayHours">Daily Goal (Hours)</Label>
              <Input
                id="perDayHours"
                type="number"
                min="0.1"
                step="0.1"
                value={formData.perDayHours}
                onChange={(e) => setFormData({ ...formData, perDayHours: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="timeSlot">Time Slot</Label>
              <Input
                id="timeSlot"
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                placeholder="e.g. Morning"
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="totalDays">Total Days</Label>
              <Input
                id="totalDays"
                type="number"
                min="1"
                value={formData.totalDays}
                onChange={(e) => setFormData({ ...formData, totalDays: Number(e.target.value) })}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
             <Label htmlFor="color">Theme Color</Label>
             <div className="flex gap-2 flex-wrap">
               {colors.map((c) => (
                 <button
                   key={c}
                   type="button"
                   className={cn(
                     "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                     formData.color === c ? "border-white scale-110" : "border-transparent"
                   )}
                   style={{ backgroundColor: c }}
                   onClick={() => setFormData({ ...formData, color: c })}
                 />
               ))}
             </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" variant="premium">Create Habit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
