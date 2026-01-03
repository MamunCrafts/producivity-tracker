"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { Habit } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format, subDays } from "date-fns";

interface AnalyticsProps {
  habit: Habit;
}

export function HabitAnalytics({ habit }: AnalyticsProps) {
  const logs = useAppSelector((state) => state.habit.logs);

  const data = useMemo(() => {
    const last21Days = Array.from({ length: 21 }, (_, i) => {
      const date = subDays(new Date(), 20 - i);
      const isToday =
        format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
      return {
        date: format(date, "yyyy-MM-dd"),
        displayDate: isToday ? "Today" : format(date, "MMM dd"),
        hours: 0,
      };
    });

    const habitLogs = logs.filter((l) => l.habitId === habit.id);

    habitLogs.forEach((log) => {
      const day = last21Days.find((d) => d.date === log.date);
      if (day) {
        day.hours += log.durationSeconds / 3600;
      }
    });

    return last21Days.map((d) => ({
      ...d,
      hours: Number(d.hours.toFixed(2)),
    }));
  }, [logs, habit.id]);

  const totalHours = useMemo(() => {
    return (
      logs
        .filter((l) => l.habitId === habit.id)
        .reduce((acc, curr) => acc + curr.durationSeconds, 0) / 3600
    );
  }, [logs, habit.id]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Hours Focused
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-50">
              {totalHours.toFixed(1)} hrs
            </div>
            <p className="text-xs text-muted-foreground">
              Target: {habit.totalHours} hrs
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Daily Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-50">
              {habit.perDayHours} hrs
            </div>
            <p className="text-xs text-muted-foreground">Required per day</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-50">Last 21 Days Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis
                  dataKey="displayDate"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}h`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#a1a1aa" }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={habit.color}
                      opacity={entry.hours > 0 ? 1 : 0.3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
