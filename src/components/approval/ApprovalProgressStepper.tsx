import React from 'react';
import { Check, Clock, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ApprovalProgress } from '@/services/modules/approvals/approvals.types';

interface ApprovalProgressStepperProps {
  progress: ApprovalProgress;
  compact?: boolean;
}

export const ApprovalProgressStepper: React.FC<ApprovalProgressStepperProps> = ({ 
  progress, 
  compact = false 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-white" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-white" />;
      case 'skipped':
        return <X className="h-4 w-4 text-white" />;
      default:
        return <span className="text-xs text-muted-foreground">{status === 'waiting' ? '•' : ''}</span>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500';
      case 'in_progress':
        return 'bg-amber-500';
      case 'skipped':
        return 'bg-muted';
      default:
        return 'bg-muted/50 border border-border';
    }
  };

  if (!progress?.levels?.length) {
    return <div className="text-sm text-muted-foreground">No approval levels</div>;
  }

  return (
    <div className={cn("flex items-center gap-2", compact && "gap-1")}>
      {progress.levels.map((level, index) => (
        <React.Fragment key={level.levelNumber}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex items-center justify-center rounded-full",
                compact ? "h-6 w-6" : "h-8 w-8",
                getStatusColor(level.status)
              )}
            >
              {getStatusIcon(level.status)}
            </div>
            {!compact && (
              <span className="text-[10px] text-muted-foreground text-center max-w-[60px] truncate">
                {level.name}
              </span>
            )}
          </div>
          {index < progress.levels.length - 1 && (
            <div 
              className={cn(
                "h-0.5 flex-1 min-w-[20px]",
                level.status === 'completed' ? 'bg-emerald-500' : 'bg-border'
              )} 
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ApprovalProgressStepper;
