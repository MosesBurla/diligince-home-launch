import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRequirement } from "@/contexts/RequirementContext";
import { useSendForApproval } from "@/hooks/useSendForApproval";
import { useApprovalStatus, ApprovalProgress } from "@/hooks/useApprovalStatus";
import { usePublishRequirement } from "@/hooks/usePublishRequirement";
import { steps } from "@/components/requirement/RequirementStepIndicator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Send, CheckCircle2, Clock, AlertCircle, Loader2, Rocket } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PublishStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const PublishStep: React.FC<PublishStepProps> = ({ onNext }) => {
  const navigate = useNavigate();
  const { formData, updateFormData, draftId, stopEditing } = useRequirement();
  const { sendForApproval, isLoading: isSending } = useSendForApproval();
  const { status: approvalStatus, progress: approvalProgress, isLoading: isLoadingStatus, refetch } = useApprovalStatus(draftId);
  const { publishRequirement, isLoading: isPublishing } = usePublishRequirement();

  // Local state for tracking approval sent status (for UI before API response)
  const [localApprovalStatus, setLocalApprovalStatus] = useState<'not_sent' | 'pending' | 'approved'>('not_sent');
  const [localProgress, setLocalProgress] = useState<ApprovalProgress | null>(null);

  // Sync with API status
  useEffect(() => {
    if (approvalStatus === 'pending') {
      setLocalApprovalStatus('pending');
      setLocalProgress(approvalProgress);
    } else if (approvalStatus === 'approved') {
      setLocalApprovalStatus('approved');
      setLocalProgress(approvalProgress);
    }
  }, [approvalStatus, approvalProgress]);

  // Determine if approval is required
  const requiresApproval = !!formData.selectedApprovalMatrixId;

  // Available evaluation criteria
  const availableEvaluationCriteria = [
    "Price/Cost Competitiveness",
    "Technical Compliance",
    "Quality Standards",
    "Delivery Timeline",
    "Past Performance/Experience",
    "Technical Capability",
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

  // Validate required fields for sending/publishing
  const validateRequiredFields = () => {
    const errors: string[] = [];
    if (!formData.title?.trim()) errors.push('Title');
    if (!formData.category) errors.push('Category');
    if (!formData.estimatedBudget || formData.estimatedBudget <= 0) errors.push('Budget');
    if (!formData.submissionDeadline) errors.push('Submission Deadline');
    if (!formData.evaluationCriteria || formData.evaluationCriteria.length === 0) errors.push('Evaluation Criteria (at least one)');
    if (!formData.termsAccepted) errors.push('Terms acceptance');
    return errors;
  };

  // Handle Send for Approval
  const handleSendForApproval = async () => {
    const errors = validateRequiredFields();
    if (errors.length > 0) {
      toast.error(`Please complete: ${errors.join(', ')}`);
      return;
    }

    if (!draftId) {
      toast.error("Please save the requirement first");
      return;
    }

    if (!formData.selectedApprovalMatrixId) {
      toast.error("Please select an approval matrix");
      return;
    }

    const response = await sendForApproval({
      draftId,
      selectedApprovalMatrixId: formData.selectedApprovalMatrixId,
      submissionDeadline: formData.submissionDeadline,
      evaluationCriteria: formData.evaluationCriteria,
    });

    if (response) {
      setLocalApprovalStatus('pending');
      setLocalProgress(response.approvalProgress || null);
      updateFormData({
        approvalStatus: 'pending',
        status: 'pending',
        isSentForApproval: true,
        approvalProgress: response.approvalProgress,
      });
      // Stop auto-save after sending for approval
      stopEditing();
      // Refetch to get latest status
      setTimeout(() => refetch(), 1000);
    }
  };

  // Handle Direct Publish (no approval required)
  const handlePublish = async () => {
    const errors = validateRequiredFields();
    if (errors.length > 0) {
      toast.error(`Please complete: ${errors.join(', ')}`);
      return;
    }

    if (!draftId) {
      toast.error("Please save the requirement first");
      return;
    }

    const response = await publishRequirement({
      requirementId: draftId,
      visibility: formData.visibility,
      selectedVendors: formData.selectedVendors,
      notifyByEmail: formData.notifyByEmail,
      notifyByApp: formData.notifyByApp,
    });

    if (response) {
      // Stop auto-save after publishing
      stopEditing();
      updateFormData({ status: 'published' });
      onNext(); // Navigate to success screen
    }
  };

  // Render approval progress levels
  const renderApprovalProgress = () => {
    if (!localProgress?.levels) return null;

    return (
      <div className="space-y-3">
        {localProgress.levels.map((level, index) => (
          <div
            key={level.levelNumber}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border",
              level.status === 'approved' ? "bg-emerald-50 border-emerald-200" :
                level.status === 'pending' && level.levelNumber === localProgress.currentLevel ? "bg-amber-50 border-amber-200" :
                  "bg-muted/30 border-border/50"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
              level.status === 'approved' ? "bg-emerald-600 text-white" :
                level.status === 'pending' && level.levelNumber === localProgress.currentLevel ? "bg-amber-500 text-white" :
                  "bg-muted text-muted-foreground"
            )}>
              {level.status === 'approved' ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{level.name || `Level ${level.levelNumber}`}</p>
              <p className="text-xs text-muted-foreground">
                {level.approvers?.length || 0} approver(s) •
                {level.status === 'approved' ? ' Approved' :
                  level.status === 'pending' ? ' Awaiting approval' : ' Pending'}
              </p>
            </div>
            {level.status === 'approved' && (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            )}
            {level.status === 'pending' && level.levelNumber === localProgress.currentLevel && (
              <Clock className="h-5 w-5 text-amber-500" />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Determine which UI state to show
  const getUIState = () => {
    if (isLoadingStatus) return 'loading';
    if (!requiresApproval) return 'no_approval';
    if (localApprovalStatus === 'approved') return 'approved';
    if (localApprovalStatus === 'pending') return 'pending';
    return 'not_sent';
  };

  const uiState = getUIState();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{steps[5].name}</h2>
        <p className="text-sm text-muted-foreground">
          Configure publishing options and submit your requirement
        </p>
      </div>

      {/* Loading State */}
      {uiState === 'loading' && (
        <Card>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      )}

      {/* Approval Status Card */}
      {uiState !== 'loading' && (
        <Card className={cn(
          "border",
          uiState === 'approved' ? "border-emerald-200 bg-emerald-50/50" :
            uiState === 'pending' ? "border-amber-200 bg-amber-50/50" :
              uiState === 'no_approval' ? "border-emerald-200 bg-emerald-50/50" :
                "border-border"
        )}>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center gap-2">
              {uiState === 'approved' || uiState === 'no_approval' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : uiState === 'pending' ? (
                <Clock className="h-5 w-5 text-amber-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
              )}
              <CardTitle className="text-base font-medium">
                {uiState === 'approved' ? "All Approvals Complete" :
                  uiState === 'pending' ? "Awaiting Approvals" :
                    uiState === 'no_approval' ? "Ready to Publish" :
                      "Approval Required"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            {uiState === 'pending' && renderApprovalProgress()}

            {uiState === 'pending' && localProgress?.estimatedPublishDate && (
              <p className="text-sm text-muted-foreground mt-3">
                Estimated publish date: {format(new Date(localProgress.estimatedPublishDate), "PPP")}
              </p>
            )}

            {uiState === 'approved' && (
              <p className="text-sm text-emerald-700">
                All approval levels completed. You can now publish this requirement.
              </p>
            )}

            {uiState === 'no_approval' && (
              <p className="text-sm text-emerald-700">
                No approval matrix selected. You can publish directly.
              </p>
            )}

            {uiState === 'not_sent' && (
              <p className="text-sm text-muted-foreground">
                Selected approval matrix requires review before publishing.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Publishing Options */}
      <div className="space-y-5">
        {/* Visibility */}
        {/* <div className="space-y-3">
          <Label className="text-sm font-medium">Requirement Visibility</Label>
          <RadioGroup
            value={formData.visibility || "all"}
            onValueChange={(value: "all" | "selected") => updateFormData({ visibility: value })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-vendors" />
              <Label htmlFor="all-vendors" className="text-sm font-normal cursor-pointer">
                All Vendors
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="selected" id="selected-vendors" />
              <Label htmlFor="selected-vendors" className="text-sm font-normal cursor-pointer">
                Selected Only
              </Label>
            </div>
          </RadioGroup>
        </div> */}

        {/* Submission Deadline */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Submission Deadline <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full max-w-sm justify-start text-left font-normal h-9",
                  !formData.submissionDeadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.submissionDeadline ? (
                  format(formData.submissionDeadline, "PPP")
                ) : (
                  <span>Select deadline</span>
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
        </div>

        {/* Evaluation Criteria */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Evaluation Criteria <span className="text-red-500">*</span></Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableEvaluationCriteria.map((criterion) => (
              <div key={criterion} className="flex items-center space-x-2">
                <Checkbox
                  id={criterion}
                  checked={(formData.evaluationCriteria || []).includes(criterion)}
                  onCheckedChange={(checked) => handleEvaluationCriteriaChange(criterion, !!checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor={criterion} className="text-xs font-normal cursor-pointer">
                  {criterion}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        {/* <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="notify-email"
              checked={formData.notifyByEmail || false}
              onCheckedChange={(checked) => updateFormData({ notifyByEmail: checked })}
            />
            <Label htmlFor="notify-email" className="text-sm font-normal cursor-pointer">
              Email notifications
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="notify-app"
              checked={formData.notifyByApp !== false}
              onCheckedChange={(checked) => updateFormData({ notifyByApp: checked })}
            />
            <Label htmlFor="notify-app" className="text-sm font-normal cursor-pointer">
              In-app notifications
            </Label>
          </div>
        </div> */}

        {/* Terms */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted || false}
            onCheckedChange={(checked) => updateFormData({ termsAccepted: !!checked })}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
            I agree to the{" "}
            <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            <span className="text-red-500"> *</span>
          </Label>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t">
        {/* Show Send for Approval button if approval is required and not yet sent */}
        {uiState === 'not_sent' && (
          <Button
            onClick={handleSendForApproval}
            disabled={isSending || !formData.termsAccepted}
            className="w-full sm:w-auto gap-2"
            size="lg"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send for Approval
              </>
            )}
          </Button>
        )}

        {/* Show waiting message when pending */}
        {uiState === 'pending' && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-lg">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">
              Waiting for approvals. You will be notified when ready to publish.
            </span>
          </div>
        )}

        {/* Show Publish button when approved or no approval required */}
        {(uiState === 'approved' || uiState === 'no_approval') && (
          <Button
            onClick={handlePublish}
            disabled={isPublishing || !formData.termsAccepted}
            className="w-full sm:w-auto gap-2"
            size="lg"
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                Publish Requirement
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PublishStep;
