
import React from "react";
import { cn } from "@/lib/utils";
import { POStepType } from "@/pages/CreatePurchaseOrder";

interface StepIndicatorProps {
  currentStep: POStepType;
  onStepClick: (step: POStepType) => void;
}

const steps = [
  { id: 1, name: "RFQ Info" },
  { id: 2, name: "Compare Quotes" },
  { id: 3, name: "PO Details" },
  { id: 4, name: "Review" },
  { id: 5, name: "Issue" },
];

const PurchaseOrderStepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
}) => {
  const isStepCompleted = (stepId: number) => {
    return stepId < currentStep;
  };

  const isStepActive = (stepId: number) => {
    return stepId === currentStep;
  };

  const isStepAccessible = (stepId: number) => {
    // First step is always accessible
    if (stepId === 1) return true;

    // Current step and previous steps are always accessible
    if (stepId <= currentStep) return true;

    // Allow access to the next step
    return stepId === currentStep + 1;
  };

  return (
    <div className="w-full">
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, index) => (
              <li
                key={step.id}
                className={cn(
                  "relative flex items-center",
                  index === 0 ? "pr-8" : "px-8",
                  index === steps.length - 1 ? "w-10" : "w-full"
                )}
              >
                <button
                  type="button"
                  onClick={() => isStepAccessible(step.id) && onStepClick(step.id as POStepType)}
                  className={cn(
                    "group relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 font-medium focus:outline-none",
                    isStepCompleted(step.id)
                      ? "border-blue-600 bg-blue-600 text-white"
                      : isStepActive(step.id)
                        ? "border-blue-600 bg-white text-blue-600"
                        : "border-gray-300 bg-white text-gray-500",
                    !isStepAccessible(step.id) && "cursor-not-allowed opacity-50"
                  )}
                  disabled={!isStepAccessible(step.id)}
                >
                  <span className="text-sm">{step.id}</span>
                </button>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className={cn(
                    "text-xs font-medium",
                    isStepActive(step.id) ? "text-blue-600" : "text-gray-700"
                  )}>
                    {step.name}
                  </span>
                </div>
                {index !== steps.length - 1 && (
                  <div className={cn(
                    "absolute right-0 top-0 hidden h-0.5 w-full md:block",
                    isStepCompleted(step.id)
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  )} style={{ transform: "translateY(20px)" }} />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Mobile version */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {steps.find(step => step.id === currentStep)?.name}
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderStepIndicator;
