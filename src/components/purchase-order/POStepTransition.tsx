import React from 'react';
import { cn } from '@/lib/utils';

interface POStepTransitionProps {
  children: React.ReactNode;
  direction: 'forward' | 'backward';
  stepKey: number;
}

export const POStepTransition: React.FC<POStepTransitionProps> = ({
  children,
  direction,
  stepKey,
}) => {
  return (
    <div
      key={stepKey}
      className={cn(
        'animate-in duration-300 ease-out',
        direction === 'forward' ? 'slide-in-from-right-4' : 'slide-in-from-left-4',
        'fade-in'
      )}
    >
      {children}
    </div>
  );
};
