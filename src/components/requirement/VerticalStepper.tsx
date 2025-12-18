import React from "react";
import { cn } from "@/lib/utils";
import { Check, Info, FileText, Upload, GitBranch, Eye, Send } from "lucide-react";
import { StepType } from "@/pages/CreateRequirement";
import { useRequirement } from "@/contexts/RequirementContext";
import ProgressRing from "./ProgressRing";

interface VerticalStepperProps {
  currentStep: StepType;
  onStepClick: (step: StepType) => void;
}

const steps = [
  { id: 1, name: "Basic Info", description: "Project details", icon: Info },
  { id: 2, name: "Details", description: "Specifications", icon: FileText },
  { id: 3, name: "Documents", description: "Attachments", icon: Upload },
  { id: 4, name: "Workflow", description: "Approvals", icon: GitBranch },
  { id: 5, name: "Preview", description: "Review", icon: Eye },
  { id: 6, name: "Publish", description: "Submit", icon: Send },
];

export const VerticalStepper: React.FC<VerticalStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  const { formData } = useRequirement();

  const isStepCompleted = (stepId: number) => {
    if (!formData) return false;
    if (stepId >= currentStep) return false;
    
    switch (stepId) {
      case 1:
        return !!(formData.title && formData.category && formData.priority && 
                 formData.businessJustification && formData.department && 
                 formData.costCenter && formData.estimatedBudget);
      case 2:
        if (formData.category?.includes("expert")) {
          if (!(formData.specialization?.length && formData.description)) return false;
        }
        if (formData.category?.includes("product")) {
          if (!(formData.productSpecifications && formData.quantity)) return false;
        }
        if (formData.category?.includes("service")) {
          if (!(formData.serviceDescription && formData.scopeOfWork)) return false;
        }
        if (formData.category?.includes("logistics")) {
          if (!(formData.equipmentType && formData.pickupLocation && formData.deliveryLocation)) return false;
        }
        return (formData.category?.length || 0) > 0;
      case 3:
      case 4:
      case 5:
        return true;
      case 6:
        return !!(formData.submissionDeadline && formData.evaluationCriteria && formData.termsAccepted);
      default:
        return false;
    }
  };

  const isStepAccessible = (stepId: number) => {
    if (stepId === 1) return true;
    if (stepId === currentStep) return true;
    if (stepId < currentStep) return true;
    return false;
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep && isStepCompleted(stepId)) return "completed";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  const getOverallProgress = () => {
    let filledFields = 0;
    let totalRequiredFields = 7; // Base required fields for Step 1
    
    // Step 1 required fields
    if (formData.title) filledFields++;
    if (formData.category?.length) filledFields++;
    if (formData.priority) filledFields++;
    if (formData.businessJustification) filledFields++;
    if (formData.department) filledFields++;
    if (formData.costCenter) filledFields++;
    if (formData.estimatedBudget && formData.estimatedBudget > 0) filledFields++;
    
    // Step 2 category-specific fields
    if (formData.category?.includes("expert")) {
      totalRequiredFields += 2;
      if (formData.specialization?.length) filledFields++;
      if (formData.description) filledFields++;
    }
    if (formData.category?.includes("product")) {
      totalRequiredFields += 2;
      if (formData.productSpecifications) filledFields++;
      if (formData.quantity) filledFields++;
    }
    if (formData.category?.includes("service")) {
      totalRequiredFields += 2;
      if (formData.serviceDescription) filledFields++;
      if (formData.scopeOfWork) filledFields++;
    }
    if (formData.category?.includes("logistics")) {
      totalRequiredFields += 3;
      if (formData.equipmentType) filledFields++;
      if (formData.pickupLocation) filledFields++;
      if (formData.deliveryLocation) filledFields++;
    }
    
    // Step 6 required fields
    totalRequiredFields += 2;
    if (formData.submissionDeadline) filledFields++;
    if (formData.termsAccepted) filledFields++;
    
    return Math.round((filledFields / totalRequiredFields) * 100);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Ring */}
      <div className="flex flex-col items-center pb-6 border-b border-border/50">
        <ProgressRing 
          progress={getOverallProgress()} 
          currentStep={currentStep}
          totalSteps={6}
          size={90}
          strokeWidth={6}
        />
        <p className="mt-3 text-sm font-medium text-foreground">
          Overall Progress
        </p>
      </div>

      {/* Steps */}
      <div className="flex-1 py-6">
        <nav className="space-y-1">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;
            const isAccessible = isStepAccessible(step.id);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="relative">
                <button
                  type="button"
                  onClick={() => isAccessible && onStepClick(step.id as StepType)}
                  disabled={!isAccessible}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                    status === "current" && "bg-primary/10 shadow-sm",
                    status === "completed" && isAccessible && "hover:bg-muted/50",
                    status === "upcoming" && isAccessible && "hover:bg-muted/30",
                    !isAccessible && "opacity-50 cursor-not-allowed"
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

      {/* Auto-save hint */}
      <div className="pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          Auto-saves every 30 seconds
        </p>
      </div>
    </div>
  );
};

export default VerticalStepper;
