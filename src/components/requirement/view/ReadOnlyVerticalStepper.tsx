import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Info, 
  FileText, 
  Upload, 
  GitBranch,
  Check
} from 'lucide-react';

interface ReadOnlyVerticalStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const steps = [
  { id: 1, name: "Basic Info", description: "Project details", icon: Info },
  { id: 2, name: "Details", description: "Specifications", icon: FileText },
  { id: 3, name: "Documents", description: "Attachments", icon: Upload },
  { id: 4, name: "Approval", description: "Workflow status", icon: GitBranch },
];

export const ReadOnlyVerticalStepper: React.FC<ReadOnlyVerticalStepperProps> = ({
  currentStep,
  onStepClick
}) => {
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress indicator */}
      <div className="flex flex-col items-center pb-6 border-b border-border/50">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 36}
              strokeDashoffset={2 * Math.PI * 36 * (1 - currentStep / 4)}
              className="text-primary transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">
              {currentStep}/4
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          Viewing Progress
        </p>
      </div>

      {/* Steps */}
      <div className="flex-1 py-6">
        <nav className="space-y-1">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="relative">
                {/* Connecting line */}
                {!isLast && (
                  <div className="absolute left-5 top-12 w-0.5 h-8 -ml-px">
                    <div 
                      className={cn(
                        "h-full w-full transition-colors duration-300",
                        status === "completed" ? "bg-primary" : "bg-border"
                      )}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onStepClick(step.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                    status === "current" && "bg-primary/10 shadow-sm",
                    status === "completed" && "hover:bg-muted/50",
                    status === "upcoming" && "hover:bg-muted/30"
                  )}
                >
                  {/* Step indicator */}
                  <div
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                      status === "completed" && "bg-primary border-primary text-primary-foreground",
                      status === "current" && "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                      status === "upcoming" && "bg-background border-border text-muted-foreground"
                    )}
                  >
                    {status === "completed" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    
                    {/* Pulse animation for current step */}
                    {status === "current" && (
                      <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 text-left">
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        status === "current" && "text-primary",
                        status === "completed" && "text-foreground",
                        status === "upcoming" && "text-muted-foreground"
                      )}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Step number */}
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      status === "current" && "bg-primary/20 text-primary",
                      status === "completed" && "bg-muted text-muted-foreground",
                      status === "upcoming" && "bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {step.id}
                  </span>
                </button>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer hint */}
      <div className="pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          Click any section to view
        </p>
      </div>
    </div>
  );
};

export default ReadOnlyVerticalStepper;
