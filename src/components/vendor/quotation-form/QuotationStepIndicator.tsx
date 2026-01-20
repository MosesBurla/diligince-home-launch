import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type QuotationStep = 'pricing' | 'timeline' | 'technical' | 'terms' | 'review';

interface Step {
  id: QuotationStep;
  label: string;
  number: number;
}

const steps: Step[] = [
  { id: 'pricing', label: 'Pricing', number: 1 },
  { id: 'timeline', label: 'Timeline', number: 2 },
  { id: 'technical', label: 'Technical', number: 3 },
  { id: 'terms', label: 'Terms', number: 4 },
  { id: 'review', label: 'Review', number: 5 },
];

interface QuotationStepIndicatorProps {
  currentStep: QuotationStep;
  completedSteps: QuotationStep[];
  onStepClick?: (step: QuotationStep) => void;
}

export const QuotationStepIndicator: React.FC<QuotationStepIndicatorProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isPast = index < currentIndex;
          const isClickable = isCompleted || isPast || isCurrent;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={cn(
                  'flex flex-col items-center gap-2 group',
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground',
                    isClickable && !isCurrent && 'group-hover:ring-2 group-hover:ring-primary/30'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium transition-colors',
                    isCurrent
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mt-[-1.5rem]">
                  <div
                    className={cn(
                      'h-full transition-colors',
                      index < currentIndex || (isCompleted && completedSteps.includes(steps[index + 1]?.id))
                        ? 'bg-primary'
                        : 'bg-border'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
