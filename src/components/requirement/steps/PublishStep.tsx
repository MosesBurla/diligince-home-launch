import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequirement } from "@/contexts/RequirementContext";
import { useStakeholder } from "@/contexts/StakeholderContext";
import { useApproval } from "@/contexts/ApprovalContext";
import { useRequirementDraft } from "@/hooks/useRequirementDraft";
import { steps } from "@/components/requirement/RequirementStepIndicator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, AlertTriangle, Clock, Shield } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { parseBackendError } from "@/utils/backend-error-parser";
import { RequiredFieldsChecklist } from "@/components/requirement/RequiredFieldsChecklist";

interface PublishStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const PublishStep: React.FC<PublishStepProps> = ({ onNext, onPrevious }) => {
  console.log("PublishStep rendering...");
  
  const navigate = useNavigate();
  const { formData, updateFormData, validateStep, stepErrors, draftId } = useRequirement();
  const { publish } = useRequirementDraft();
  const stakeholderContext = useStakeholder();
  const { canPublishRequirement, getApprovalWorkflow, emergencyPublish } = useApproval();
  const [isPublishing, setIsPublishing] = useState(false);

  console.log("PublishStep rendered, formData:", formData);
  console.log("Stakeholder context available:", !!stakeholderContext);

  // Safe access to notifyStakeholders with fallback
  const notifyStakeholders = stakeholderContext?.notifyStakeholders || (() => {
    console.warn("notifyStakeholders not available - using fallback");
  });

  // Check approval status
  const approvalCheck = canPublishRequirement(formData);
  const approvalWorkflow = getApprovalWorkflow(formData.title || 'unknown');
  
  // Available evaluation criteria based on ISO 9001 procurement standards
  const availableEvaluationCriteria = [
    "Price/Cost Competitiveness",
    "Technical Compliance",
    "Quality Standards",
    "Delivery Timeline",
    "Past Performance/Experience",
    "Technical Capability",
    "Financial Stability",
    "Compliance & Certifications",
    "Risk Assessment",
    "Sustainability Practices"
  ];

  const handleEvaluationCriteriaChange = (criterion: string, checked: boolean) => {
    let updatedCriteria = [...(formData.evaluationCriteria || [])];
    if (checked) {
      updatedCriteria.push(criterion);
    } else {
      updatedCriteria = updatedCriteria.filter(c => c !== criterion);
    }
    updateFormData({ evaluationCriteria: updatedCriteria });
  };

  const handleEmergencyPublish = async () => {
    if (!formData.isUrgent) {
      toast.error("Emergency publish is only available for urgent requirements");
      return;
    }
    
    try {
      setIsPublishing(true);
      const success = await emergencyPublish(formData.title || 'unknown');
      if (success) {
        // Safely notify stakeholders with error handling
        try {
          notifyStakeholders(formData);
        } catch (error) {
          console.warn("Failed to notify stakeholders:", error);
          // Don't block the publish process for notification failures
        }
        toast.success("Requirement published under emergency protocol!");
        onNext();
      }
    } catch (error) {
      console.error("Emergency publish failed:", error);
      toast.error("Emergency publish failed. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Validate all required fields before publishing
  const validateAllRequiredFields = () => {
    const errors: { step: number; field: string }[] = [];
    
    // Step 1: Basic Info
    if (!formData.title?.trim()) {
      errors.push({ step: 1, field: 'Title' });
    }
    if (!formData.category) {
      errors.push({ step: 1, field: 'Category' });
    }
    
    // Step 2: Category-specific fields
    if (formData.category === 'product') {
      if (!formData.productSpecifications?.trim()) {
        errors.push({ step: 2, field: 'Product Specifications' });
      }
      if (!formData.quantity || formData.quantity <= 0) {
        errors.push({ step: 2, field: 'Quantity' });
      }
    } else if (formData.category === 'expert') {
      if (!formData.specialization?.trim()) {
        errors.push({ step: 2, field: 'Specialization' });
      }
      if (!formData.description?.trim()) {
        errors.push({ step: 2, field: 'Description' });
      }
    } else if (formData.category === 'service') {
      if (!formData.serviceDescription?.trim()) {
        errors.push({ step: 2, field: 'Service Description' });
      }
      if (!formData.scopeOfWork?.trim()) {
        errors.push({ step: 2, field: 'Scope of Work' });
      }
    } else if (formData.category === 'logistics') {
      if (!formData.equipmentType?.trim()) {
        errors.push({ step: 2, field: 'Equipment Type' });
      }
      if (!formData.pickupLocation?.trim()) {
        errors.push({ step: 2, field: 'Pickup Location' });
      }
      if (!formData.deliveryLocation?.trim()) {
        errors.push({ step: 2, field: 'Delivery Location' });
      }
    }
    
    // Step 4: Budget
    if (!formData.estimatedBudget || formData.estimatedBudget <= 0) {
      errors.push({ step: 4, field: 'Estimated Budget' });
    }
    
    // Step 5: Timeline/Deadline
    if (!formData.deadline) {
      errors.push({ step: 5, field: 'Deadline' });
    }
    
    return errors;
  };

  const handlePublish = async () => {
    try {
      console.log("Starting publish process...");
      setIsPublishing(true);
      
      // First, validate all required fields across all steps
      const fieldErrors = validateAllRequiredFields();
      if (fieldErrors.length > 0) {
        const errorMessage = `Missing required fields: ${fieldErrors.map(e => e.field).join(', ')}`;
        const firstErrorStep = Math.min(...fieldErrors.map(e => e.step));
        toast.error(errorMessage, {
          description: `Please go back to Step ${firstErrorStep} and complete the required fields.`,
          duration: 6000,
        });
        return;
      }
      
      if (!validateStep(6)) {
        console.log("Step 6 validation failed:", stepErrors);
        toast.error("Please fill in all required fields on this step");
        return;
      }

      // Check approval status
      if (!approvalCheck.canPublish) {
        toast.error(approvalCheck.reason || "Approval required before publishing");
        return;
      }

      if (!draftId) {
        toast.error("No draft ID available. Please save the requirement first.");
        return;
      }
      
      console.log("Validation and approval checks passed, proceeding with publish...");
      
      // Call API to publish requirement
      const response = await publish({
        draftId,
        submissionDeadline: formData.submissionDeadline!,
        evaluationCriteria: formData.evaluationCriteria!,
        visibility: formData.visibility!,
        selectedVendors: formData.visibility === "selected" ? formData.selectedVendors : undefined,
        notifyByEmail: formData.notifyByEmail!,
        notifyByApp: formData.notifyByApp!,
        termsAccepted: formData.termsAccepted!,
      });

      // Display success message and navigate based on status
      if (response.status === "published") {
        toast.success(`Requirement published! ${response.vendorsNotified} vendors notified.`);
        // Navigate to success screen
        onNext();
      } else if (response.status === "pending_approval") {
        toast.success("Requirement submitted for approval");
        // Navigate to pending approvals page
        navigate("/pending-approvals");
      }
      
      // Safely notify relevant stakeholders about the new requirement
      try {
        notifyStakeholders(formData);
      } catch (error) {
        console.warn("Failed to notify stakeholders:", error);
        // Don't block the publish process for notification failures
      }
      
      console.log("Publish successful");
    } catch (error: any) {
      console.error("Error during publish:", error);
      
      // Parse backend error and show user-friendly message
      const parsedError = parseBackendError(error);
      
      if (parsedError.type === 'validation' && parsedError.step) {
        toast.error(parsedError.message, {
          description: `Please go back to Step ${parsedError.step} and complete this field.`,
          duration: 6000,
        });
      } else {
        toast.error(parsedError.message, {
          description: "Please check all fields and try again.",
          duration: 5000,
        });
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = () => {
    toast.success("Requirement saved as draft");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">{steps[5].name}</h2>
        <p className="text-gray-600">
          {steps[5].description}
        </p>
        
        {/* Approval Status Display */}
        {approvalWorkflow && (
          <div className={cn(
            "p-4 rounded-lg border",
            approvalCheck.canPublish 
              ? "bg-green-50 border-green-200" 
              : "bg-yellow-50 border-yellow-200"
          )}>
            <div className="flex items-center gap-2 mb-2">
              {approvalCheck.canPublish ? (
                <Shield className="h-5 w-5 text-green-600" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-600" />
              )}
              <h3 className="font-medium">
                {approvalCheck.canPublish ? "Approval Completed" : "Approval Required"}
              </h3>
            </div>
            {!approvalCheck.canPublish && (
              <p className="text-sm text-gray-600 mb-3">{approvalCheck.reason}</p>
            )}
            <div className="text-sm">
              <p>Workflow Status: <span className="font-medium">{approvalWorkflow.status}</span></p>
              <p>Completed Approvals: {approvalWorkflow.completedApprovals}/{approvalWorkflow.totalApprovals}</p>
              {approvalWorkflow.isUrgent && approvalWorkflow.emergencyPublishDeadline && (
                <p className="text-orange-600 font-medium">
                  Emergency Deadline: {format(new Date(approvalWorkflow.emergencyPublishDeadline), "PPp")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Required Fields Checklist */}
      <RequiredFieldsChecklist />

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base">Requirement Visibility</Label>
          <RadioGroup
            value={formData.visibility || "all"}
            onValueChange={(value: "all" | "selected") => updateFormData({ visibility: value })}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 rounded-md border p-3">
              <RadioGroupItem value="all" id="all-vendors" />
              <div className="space-y-1">
                <Label htmlFor="all-vendors" className="font-medium">
                  All Relevant Vendors
                </Label>
                <p className="text-sm text-gray-500">
                  Your requirement will be visible to all approved vendors that match the category.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 rounded-md border p-3">
              <RadioGroupItem value="selected" id="selected-vendors" />
              <div className="space-y-1">
                <Label htmlFor="selected-vendors" className="font-medium">
                  Selected Vendors Only
                </Label>
                <p className="text-sm text-gray-500">
                  Only vendors you specifically invite will see your requirement.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-base">
            Submission Deadline <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.submissionDeadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.submissionDeadline ? (
                  format(formData.submissionDeadline, "PPP")
                ) : (
                  <span>Select deadline date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.submissionDeadline || undefined}
                onSelect={(date) => updateFormData({ submissionDeadline: date })}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {stepErrors?.submissionDeadline && (
            <p className="text-sm text-red-500">{stepErrors.submissionDeadline}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-base">
            Evaluation Criteria <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-600">
            Select the criteria that will be used to evaluate vendor proposals (ISO 9001 compliant)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableEvaluationCriteria.map((criterion) => (
              <div key={criterion} className="flex items-center space-x-2">
                <Checkbox
                  id={criterion}
                  checked={(formData.evaluationCriteria || []).includes(criterion)}
                  onCheckedChange={(checked) => handleEvaluationCriteriaChange(criterion, !!checked)}
                />
                <Label htmlFor={criterion} className="text-sm font-normal cursor-pointer">
                  {criterion}
                </Label>
              </div>
            ))}
          </div>
          {stepErrors?.evaluationCriteria && (
            <p className="text-sm text-red-500">{stepErrors.evaluationCriteria}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-base">Notification Preferences</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notify-email" className="cursor-pointer">Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive updates about proposals via email
                </p>
              </div>
              <Switch
                id="notify-email"
                checked={formData.notifyByEmail || false}
                onCheckedChange={(checked) => updateFormData({ notifyByEmail: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notify-app" className="cursor-pointer">In-App Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive updates within the platform
                </p>
              </div>
              <Switch
                id="notify-app"
                checked={formData.notifyByApp || true}
                onCheckedChange={(checked) => updateFormData({ notifyByApp: checked })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={formData.termsAccepted || false}
              onCheckedChange={(checked) => updateFormData({ termsAccepted: !!checked })}
            />
            <div className="space-y-1">
              <Label
                htmlFor="terms"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Terms and Conditions <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-gray-500">
                I acknowledge that I have read and agree to the{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
          {stepErrors?.termsAccepted && (
            <p className="text-sm text-red-500">{stepErrors.termsAccepted}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isPublishing}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isPublishing}
          >
            Save as Draft
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {formData.isUrgent && !approvalCheck.canPublish && (
            <Button 
              onClick={handleEmergencyPublish}
              disabled={isPublishing}
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Publish
            </Button>
          )}
          <Button 
            onClick={handlePublish}
            disabled={isPublishing || !approvalCheck.canPublish}
          >
            {isPublishing ? "Publishing..." : "Publish & Notify Stakeholders"}
          </Button>
        </div>
      </div>
      
      {!approvalCheck.canPublish && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              {approvalCheck.reason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishStep;
