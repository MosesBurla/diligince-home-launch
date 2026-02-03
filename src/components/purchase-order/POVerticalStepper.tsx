import React from 'react';
import { Info, Package, Milestone, CheckSquare, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { POProgressRing } from './POProgressRing';

interface POVerticalStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  progress: number;
}

const steps = [
  { id: 1, name: 'Basic Info', description: 'Project details & dates', icon: Info },
  { id: 2, name: 'Deliverables', description: 'Items & quantities', icon: Package },
  { id: 3, name: 'Milestones', description: 'Payment schedule', icon: Milestone },
  { id: 4, name: 'Acceptance', description: 'Criteria & terms', icon: CheckSquare },
];

export const POVerticalStepper: React.FC<POVerticalStepperProps> = ({
  currentStep,
  onStepClick,
  progress,
}) => {
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const isStepAccessible = (stepId: number) => {
    return stepId <= currentStep;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Ring */}
      <div className="flex flex-col items-center pb-6 border-b border-border/60">
        <POProgressRing progress={progress} size={100} strokeWidth={6} />
        <p className="mt-3 text-sm text-muted-foreground">
          Step {currentStep} of {steps.length}
        </p>
      </div>

      {/* Steps */}
      <nav className="flex-1 py-6 space-y-1">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const accessible = isStepAccessible(step.id);
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              <button
                type="button"
                onClick={() => accessible && onStepClick(step.id)}
                disabled={!accessible}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left',
                  status === 'current' && 'bg-primary/10 border border-primary/20',
                  status === 'completed' && 'hover:bg-muted/50',
                  status === 'upcoming' && 'opacity-50 cursor-not-allowed',
                  accessible && status !== 'current' && 'hover:bg-muted/50 cursor-pointer'
                )}
              >
                {/* Step indicator */}
                <div
                  className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
                    status === 'completed' && 'bg-primary text-primary-foreground',
                    status === 'current' && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                    status === 'upcoming' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium truncate',
                      status === 'current' && 'text-primary',
                      status === 'completed' && 'text-foreground',
                      status === 'upcoming' && 'text-muted-foreground'
                    )}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {step.description}
                  </p>
                </div>
              </button>

              {/* Connecting line */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-[1.4rem] top-[3.25rem] w-0.5 h-4',
                    status === 'completed' ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="pt-4 border-t border-border/60">
        <p className="text-xs text-muted-foreground text-center">
          All fields are auto-validated
        </p>
      </div>
    </div>
  );
};
