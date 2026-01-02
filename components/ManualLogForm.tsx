'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addManualLog } from '@/store/habitSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

interface ManualLogFormProps {
  habitId: string;
  habitTitle: string;
}

export function ManualLogForm({ habitId, habitTitle }: ManualLogFormProps) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    minutes: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationSeconds = (formData.hours * 3600) + (formData.minutes * 60);
    if (durationSeconds > 0) {
        dispatch(addManualLog({
            habitId,
            durationSeconds,
            date: formData.date
        }));
        setOpen(false);
        // Reset (keep date as is for convenience, reset value)
        setFormData(prev => ({ ...prev, hours: 0, minutes: 0 }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Log Time Manually</DialogTitle>
          <DialogDescription>
            Add progress to <span className="font-semibold text-white">{habitTitle}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minutes">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={formData.minutes}
                onChange={(e) => setFormData({ ...formData, minutes: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" variant="default">Add Log</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
