import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RFQViewMode = 'all' | 'recommended';

interface RFQViewToggleProps {
  value: RFQViewMode;
  onChange: (mode: RFQViewMode) => void;
  className?: string;
}

const RFQViewToggle: React.FC<RFQViewToggleProps> = ({
  value,
  onChange,
  className
}) => {
  return (
    <div className={cn(
      "inline-flex items-center rounded-lg bg-muted p-1",
      className
    )}>
      <button
        type="button"
        onClick={() => onChange('all')}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md transition-all",
          value === 'all'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        All
      </button>
      <button
        type="button"
        onClick={() => onChange('recommended')}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-1.5",
          value === 'recommended'
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sparkles className={cn(
          "h-3.5 w-3.5",
          value === 'recommended' ? "text-violet-500" : ""
        )} />
        Diligence Recommended
      </button>
    </div>
  );
};

export default RFQViewToggle;
