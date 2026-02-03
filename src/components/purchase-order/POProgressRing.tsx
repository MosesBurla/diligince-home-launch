import React from 'react';
import { cn } from '@/lib/utils';

interface POProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const POProgressRing: React.FC<POProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Color states: gray when low, emerald when ready, primary when complete
  const getStrokeColor = () => {
    if (progress >= 100) return 'hsl(var(--primary))';
    if (progress >= 75) return 'hsl(142.1 76.2% 36.3%)'; // emerald-600
    return 'hsl(var(--muted-foreground))';
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          className="opacity-50"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">
          {Math.round(progress)}%
        </span>
        <span className="text-xs text-muted-foreground">Complete</span>
      </div>
    </div>
  );
};
