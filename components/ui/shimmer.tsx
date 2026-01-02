import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export function ShimmerCard() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <Shimmer className="h-6 w-32 rounded" />
        <Shimmer className="h-8 w-20 rounded" />
      </div>
      <Shimmer className="h-4 w-full rounded" />
      <Shimmer className="h-2 w-full rounded-full" />
      <div className="flex gap-2">
        <Shimmer className="h-9 w-24 rounded" />
        <Shimmer className="h-9 w-24 rounded" />
      </div>
    </div>
  );
}

export function ShimmerList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </div>
  );
}
