import React, { useState, lazy, Suspense, useCallback, useEffect, memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SuccessScreen from "@/components/requirement/SuccessScreen";
import { useRequirement } from "@/contexts/RequirementContext";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { toast } from "sonner";
import CreateRequirementLayout from "@/components/requirement/CreateRequirementLayout";
import { StepLoadingSkeleton } from "@/components/requirement/StepLoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { RequirementApprovalActions } from "@/components/requirement/RequirementApprovalActions";
import { useUser } from "@/contexts/UserContext";

// Lazy load step components for better performance
const EnhancedBasicInfoStep = lazy(() => import("@/components/requirement/steps/EnhancedBasicInfoStep"));
const DetailsStep = lazy(() => import("@/components/requirement/steps/DetailsStep"));
const DocumentsStep = lazy(() => import("@/components/requirement/steps/DocumentsStep"));
const ApprovalWorkflowStep = lazy(() => import("@/components/requirement/steps/ApprovalWorkflowStep"));
const PreviewStep = lazy(() => import("@/components/requirement/steps/PreviewStep"));
const PublishStep = lazy(() => import("@/components/requirement/steps/PublishStep"));

export type StepType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Loading skeleton for draft loading
const DraftLoadingSkeleton = () => (
  <div className="min-h-screen bg-muted/30">
    <div className="hidden lg:flex h-screen">
      {/* Left Panel Skeleton */}
      <aside className="w-72 xl:w-80 flex-shrink-0 bg-card border-r border-border/50 flex flex-col">
        <div className="p-6 border-b border-border/50">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="flex justify-center py-4">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 flex flex-col">
        <header className="px-8 py-4 border-b border-border/50">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-24" />
        </header>
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-2/3" />
          </div>
        </div>
      </main>
    </div>

    {/* Mobile Skeleton */}
    <div className="lg:hidden p-4 space-y-4 pt-16">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

// Memoized step renderer
const StepRenderer = memo(({
  currentStep,
  handleNext,
  handlePrevious,
  handleGoToStep
}: {
  currentStep: StepType;
  handleNext: () => void;
  handlePrevious: () => void;
  handleGoToStep: (step: StepType) => void;
}) => {
  switch (currentStep) {
    case 1:
      return <EnhancedBasicInfoStep onNext={handleNext} />;
    case 2:
      return <DetailsStep onNext={handleNext} onPrevious={handlePrevious} />;
    case 3:
      return <DocumentsStep onNext={handleNext} onPrevious={handlePrevious} />;
    case 4:
      return <ApprovalWorkflowStep onNext={handleNext} onPrevious={handlePrevious} />;
    case 5:
      return (
        <PreviewStep
          onNext={handleNext}
          onPrevious={handlePrevious}
          onEdit={handleGoToStep}
        />
      );
    case 6:
      return <PublishStep onNext={handleNext} onPrevious={handlePrevious} />;
    default:
      return <div>Invalid step</div>;
  }
});

StepRenderer.displayName = "StepRenderer";

const CreateRequirement = () => {
  const [currentStep, setCurrentStep] = useState<StepType>(1);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { draftId, loadDraftById, startEditing, stopEditing, formData, saveAsDraft, validateStep } = useRequirement();
  const { user } = useUser();

  // Check if current user is an approver for the current level
  const isPending = formData?.status === 'pending';
  const currentLevel = formData?.currentApprovalLevel;
  const approvalProgress = formData?.approvalProgress;

  const currentLevelData = approvalProgress?.levels?.find((l: any) => l.levelNumber === currentLevel);
  const isApprover = currentLevelData?.approvers?.some((a: any) => a.memberId === user?.id);

  const showApprovalActions = isPending && isApprover && draftId;

  // Determine if we're in edit mode based on URL

  // Determine if we're in edit mode based on URL
  const urlDraftId = searchParams.get('draftId');
  const isEditMode = !!urlDraftId;

  // Start/stop editing mode for auto-save control
  useEffect(() => {
    // Only start editing if status allows it
    const status = formData.status || 'draft';
    const canEdit = status === 'draft' || status === 'rejected';

    if (canEdit && !formData.isSentForApproval) {
      startEditing();
    }

    return () => {
      stopEditing();
    };
  }, [startEditing, stopEditing, formData.status, formData.isSentForApproval]);

  // Navigation protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (draftId) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [draftId]);

  // Load draft from URL parameter on mount
  useEffect(() => {
    const urlDraftId = searchParams.get('draftId');

    if (!urlDraftId) return;

    const loadDraftFromUrl = async () => {
      setIsLoadingDraft(true);

      try {
        console.log("🔵 CreateRequirement: Loading draft from URL:", urlDraftId);

        // Use context's loadDraftById which updates both draftId and formData
        const draftData = await loadDraftById(urlDraftId);

        console.log("🟢 CreateRequirement: Draft data loaded:", draftData);

        if (draftData) {
          localStorage.setItem('requirement-draft-id', urlDraftId);
          localStorage.setItem('requirement-draft', JSON.stringify(draftData));
          setCurrentStep(1);
        } else {
          toast.error("Draft data is empty");
        }
      } catch (error) {
        console.error("🔴 CreateRequirement: Failed to load draft from URL:", error);
        toast.error("Failed to load draft. Redirecting...");
        setTimeout(() => navigate('/dashboard/requirements/drafts'), 2000);
      } finally {
        setIsLoadingDraft(false);
      }
    };

    loadDraftFromUrl();
  }, [searchParams, loadDraftById, navigate]);

  //Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('requirement-current-step', currentStep.toString());
  }, [currentStep]);

  const handleNext = useCallback(async () => {
    // Validate current step before proceeding
    const isValid = validateStep(currentStep);
    
    if (!isValid) {
      toast.error("Please fill in all required fields", {
        description: "Complete the required fields before proceeding to the next step.",
        duration: 4000,
      });
      return;
    }

    // Step 4 validation: Check if approval matrix is required but not selected
    if (currentStep === 4) {
      const budget = formData.estimatedBudget || 0;
      const priority = formData.priority || 'low';
      const requiresApproval = budget > 10000 ||
        priority === 'critical' ||
        priority === 'high' ||
        formData.complianceRequired;

      if (requiresApproval && !formData.selectedApprovalMatrixId) {
        toast.error("Approval Matrix Required", {
          description: "Can't proceed without selecting an approval matrix. Please configure one or select an existing matrix.",
          duration: 5000,
        });
        return;
      }
    }

    if (currentStep < 7) {
      // Ensure draft is created before moving to next step (especially needed for step 3 - Documents)
      // This prevents "No draft ID available" error when uploading documents
      if (!draftId && formData) {
        console.log("Creating draft before moving to next step...");
        try {
          await saveAsDraft();
        } catch (error) {
          console.error("Failed to create draft:", error);
          // Continue anyway - draft creation might have failed but auto-save will retry
        }
      }

      setCurrentStep((prev) => (prev + 1) as StepType);
    }
  }, [currentStep, draftId, formData, saveAsDraft, validateStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepType);
    }
  }, [currentStep]);

  const handleGoToStep = useCallback((step: StepType) => {
    setCurrentStep(step);
  }, []);

  // Success screen (Step 7)
  if (currentStep === 7) {
    return (
      <ErrorBoundary>
        <div className="flex min-h-screen flex-col bg-background">
          <SuccessScreen
            onCreateAnother={() => {
              setCurrentStep(1);
              localStorage.removeItem('requirement-current-step');
            }}
            onViewRequirement={() => navigate("/industry-requirements")}
            onReturnToDashboard={() => navigate("/industry")}
          />
          <Toaster richColors position="top-right" />
        </div>
      </ErrorBoundary>
    );
  }

  // Loading state
  if (isLoadingDraft) {
    return (
      <ErrorBoundary>
        <DraftLoadingSkeleton />
        <Toaster richColors position="top-right" />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <CreateRequirementLayout
        currentStep={currentStep}
        onStepChange={handleGoToStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isEditMode={isEditMode}
        customFooterActions={showApprovalActions ? (
          <RequirementApprovalActions
            requirementId={draftId!}
            onActionComplete={() => navigate('/dashboard/requirements/pending')}
          />
        ) : undefined}
      >
        <Suspense fallback={<StepLoadingSkeleton />}>
          <StepRenderer
            currentStep={currentStep}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleGoToStep={handleGoToStep}
          />
        </Suspense>
      </CreateRequirementLayout>
      <Toaster richColors position="top-right" />
    </ErrorBoundary>
  );
};

export default CreateRequirement;
