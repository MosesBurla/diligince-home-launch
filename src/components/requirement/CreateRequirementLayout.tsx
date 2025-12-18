import React, { memo, Suspense, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Save, ChevronLeft, ChevronRight, X } from "lucide-react";
import { StepType } from "@/pages/CreateRequirement";
import { useRequirement } from "@/contexts/RequirementContext";
import { StepLoadingSkeleton } from "./StepLoadingSkeleton";
import VerticalStepper from "./VerticalStepper";
import StepTransition from "./StepTransition";
import { CommentsDropdownPanel } from "./CommentsDropdownPanel";
import { ApprovalInfoDropdownPanel } from "@/components/approval";

interface CreateRequirementLayoutProps {
  currentStep: StepType;
  onStepChange: (step: StepType) => void;
  onNext: () => void;
  onPrevious: () => void;
  isEditMode?: boolean;
  customFooterActions?: React.ReactNode;
  children: React.ReactNode;
}

export const CreateRequirementLayout: React.FC<CreateRequirementLayoutProps> = memo(({
  currentStep,
  onStepChange,
  onNext,
  onPrevious,
  isEditMode = false,
  customFooterActions,
  children,
}) => {
  const navigate = useNavigate();
  const { isSaving, lastSaved, draftId, saveAsDraft, formData } = useRequirement();
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const handleSaveDraft = useCallback(async () => {
    await saveAsDraft();
  }, [saveAsDraft]);

  const stepTitles = [
    "Basic Information",
    "Requirements Details",
    "Documents & Attachments",
    "Approval Workflow",
    "Preview & Review",
    "Publish Requirement",
  ];

  const formatLastSaved = () => {
    if (isSaving) return "Saving...";
    if (!lastSaved) return "Not saved yet";

    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleStepClick = useCallback((step: StepType) => {
    setDirection(step > currentStep ? "forward" : "backward");
    onStepChange(step);
  }, [currentStep, onStepChange]);

  const handleNext = useCallback(() => {
    setDirection("forward");
    onNext();
  }, [onNext]);

  const handlePrevious = useCallback(() => {
    setDirection("backward");
    onPrevious();
  }, [onPrevious]);

  // Swipe gestures for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => currentStep < 6 && handleNext(),
    onSwipedRight: () => currentStep > 1 && handlePrevious(),
    trackMouse: false,
    trackTouch: true,
    delta: 50,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === 'ArrowRight' && currentStep < 6) {
          e.preventDefault();
          handleNext();
        } else if (e.key === 'ArrowLeft' && currentStep > 1) {
          e.preventDefault();
          handlePrevious();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, handleNext, handlePrevious]);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Progress Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-1 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="shrink-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Step {currentStep} of 6
              </p>
              <h2 className="text-sm font-semibold truncate">
                {stepTitles[currentStep - 1]}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {draftId && (
              <>
                <CommentsDropdownPanel requirementId={draftId} />
                <ApprovalInfoDropdownPanel
                  approvalProgress={formData?.approvalProgress as any}
                  status="draft"
                />
              </>
            )}
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">
                {formatLastSaved()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Panel - Vertical Stepper */}
        <aside className="w-72 xl:w-80 flex-shrink-0 bg-card border-r border-border/50 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <h1 className="text-lg font-bold text-foreground">
              {isEditMode ? 'Edit Requirement' : 'New Requirement'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Complete all steps to publish
            </p>
          </div>

          {/* Stepper */}
          <div className="flex-1 overflow-y-auto p-4">
            <VerticalStepper
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Save Status */}
          <div className="p-4 border-t border-border/50 bg-muted/30">
            <div className="flex items-center gap-2">
              <Save className={cn(
                "h-4 w-4",
                isSaving ? "text-primary animate-pulse" : "text-muted-foreground"
              )} />
              <span className="text-sm text-muted-foreground">
                {formatLastSaved()}
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Header */}
          <header className="flex-shrink-0 bg-background border-b border-border/50 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {stepTitles[currentStep - 1]}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Step {currentStep} of 6
                </p>
              </div>

              <div className="flex items-center gap-3">
                {draftId && (
                  <>
                    <CommentsDropdownPanel requirementId={draftId} />
                    <ApprovalInfoDropdownPanel
                      approvalProgress={formData?.approvalProgress as any}
                      status="draft"
                    />
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard/requirements/drafts')}
                  className="gap-2 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  Exit
                </Button>
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 lg:p-8">
              <StepTransition stepKey={currentStep} direction={direction}>
                <Suspense fallback={<StepLoadingSkeleton />}>
                  {children}
                </Suspense>
              </StepTransition>
            </div>
          </div>

          {/* Desktop Footer */}
          <footer className="flex-shrink-0 bg-background border-t border-border/50 px-8 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {customFooterActions ? (
                <div className="w-full">
                  {customFooterActions}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={handleSaveDraft}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? "Saving..." : "Save Draft"}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground hidden md:block">
                    Use Alt + Arrow keys to navigate
                  </p>

                  <Button
                    onClick={handleNext}
                    disabled={currentStep === 6}
                    className="gap-2"
                  >
                    {currentStep === 5 ? 'Review & Publish' : 'Continue'}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Content */}
      <div
        {...swipeHandlers}
        className="lg:hidden pt-2 pb-24 px-4 touch-pan-y"
      >
        <StepTransition stepKey={currentStep} direction={direction}>
          <Suspense fallback={<StepLoadingSkeleton />}>
            {children}
          </Suspense>
        </StepTransition>
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t shadow-lg">
        {customFooterActions ? (
          <div className="p-4">
            {customFooterActions}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                size="sm"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={handleSaveDraft}
              disabled={isSaving}
              size="sm"
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? "..." : "Save"}
            </Button>

            {currentStep < 6 && (
              <Button
                onClick={handleNext}
                className="flex-1"
              >
                {currentStep === 5 ? 'Review' : 'Continue'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

CreateRequirementLayout.displayName = "CreateRequirementLayout";

export default CreateRequirementLayout;
