
import React from "react";
import { StepType } from "@/pages/CreateRequirement";
import { useRequirement } from "@/contexts/RequirementContext";
import { cn } from "@/lib/utils";
import { 
  Info, 
  FileText, 
  Upload, 
  GitBranch,
  Eye, 
  Send,
  Check
} from "lucide-react";

interface StepIndicatorProps {
  currentStep: StepType;
  onStepClick: (step: StepType) => void;
}

export const steps = [
  { 
    id: 1, 
    name: "Basic Info", 
    description: "Project details and requirements",
    icon: Info 
  },
  { 
    id: 2, 
    name: "Details", 
    description: "Specifications and technical requirements",
    icon: FileText 
  },
  { 
    id: 3, 
    name: "Documents", 
    description: "Upload supporting files",
    icon: Upload 
  },
  { 
    id: 4, 
    name: "Workflow", 
    description: "Set approval workflow",
    icon: GitBranch 
  },
  { 
    id: 5, 
    name: "Preview", 
    description: "Review your requirement",
    icon: Eye 
  },
  { 
    id: 6, 
    name: "Publish", 
    description: "Submit and publish requirement",
    icon: Send 
  },
];

const RequirementStepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
}) => {
  const { formData } = useRequirement();

  const isStepCompleted = (stepId: number) => {
    if (!formData) return false;
    
    // A step is only completed if we've moved past it
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
        return true; // Documents are optional
      case 4:
        return true; // Approval workflow is optional
      case 5:
        return true; // Preview is always accessible if we got here
      case 6:
        return !!(formData.submissionDeadline && formData.evaluationCriteria && formData.termsAccepted);
      default:
        return false;
    }
  };

  const isStepAccessible = (stepId: number) => {
    // Step 1 is always accessible
    if (stepId === 1) return true;
    
    // Current step is always accessible
    if (stepId === currentStep) return true;
    
    // Can go back to any previous step
    if (stepId < currentStep) return true;
    
    // Future steps are not accessible
    return false;
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep && isStepCompleted(stepId)) return "completed";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  const getOverallProgress = () => {
    const completedSteps = steps.filter(step => isStepCompleted(step.id)).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  return (
    <div className="w-full py-8">
      {/* Desktop version */}
      <div className="hidden lg:block">
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;
              const isAccessible = isStepAccessible(step.id);
              const isLastStep = index === steps.length - 1;
              
              return (
                <div key={step.id} className="flex items-center">
                  {/* Step circle and content */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => isAccessible && onStepClick(step.id as StepType)}
                      disabled={!isAccessible}
                      className={cn(
                        "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors duration-200",
                        status === "completed" && "bg-corporate-navy-500 border-corporate-navy-500 text-white",
                        status === "current" && "bg-corporate-navy-500 border-corporate-navy-500 text-white ring-4 ring-corporate-navy-500/20",
                        status === "upcoming" && isAccessible && "bg-white border-corporate-gray-300 text-corporate-gray-600 hover:border-corporate-gray-400",
                        status === "upcoming" && !isAccessible && "bg-corporate-gray-100 border-corporate-gray-200 text-corporate-gray-400 cursor-not-allowed"
                      )}
                    >
                      {status === "completed" ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </button>
                    
                    <div className="mt-3 text-center">
                      <h3 className={cn(
                        "text-sm font-medium",
                        status === "completed" && "text-corporate-navy-600",
                        status === "current" && "text-corporate-navy-600",
                        status === "upcoming" && "text-corporate-gray-500"
                      )}>
                        {step.name}
                      </h3>
                    </div>
                  </div>

                  {/* Connecting line */}
                  {!isLastStep && (
                    <div className="flex-1 mx-4 h-0.5 bg-corporate-gray-200 relative overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-500 ease-out bg-corporate-navy-500",
                          isStepCompleted(step.id) && step.id < currentStep ? "w-full" : "w-0"
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="lg:hidden">
        <div className="bg-white rounded-lg shadow-sm border border-corporate-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-corporate-gray-900">
                Step {currentStep} of {steps.length}
              </h3>
              <p className="text-sm text-corporate-gray-600">
                {steps.find(step => step.id === currentStep)?.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-corporate-navy-600">
                {getOverallProgress()}%
              </div>
              <div className="text-xs text-corporate-gray-600">Complete</div>
            </div>
          </div>
          
          {/* Mobile progress bar */}
          <div className="w-full bg-corporate-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
            <div 
              className="bg-corporate-navy-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getOverallProgress()}%` }}
            />
          </div>

          {/* Step dots */}
          <div className="flex justify-center space-x-3">
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => isStepAccessible(step.id) && onStepClick(step.id as StepType)}
                  disabled={!isStepAccessible(step.id)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-200",
                    status === "completed" && "bg-corporate-navy-500",
                    status === "current" && "bg-corporate-navy-500 ring-2 ring-corporate-navy-500/30",
                    status === "upcoming" && "bg-corporate-gray-300",
                    !isStepAccessible(step.id) && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label={`Go to ${step.name}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementStepIndicator;
