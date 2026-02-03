import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { ArrowLeft, ArrowRight, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { POVerticalStepper } from './POVerticalStepper';
import { POStepTransition } from './POStepTransition';
import { cn } from '@/lib/utils';

interface CreatePOLayoutProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onSaveDraft?: () => void;
  isEditMode?: boolean;
  isSubmitting?: boolean;
  isSavingDraft?: boolean;
  progress: number;
  children: React.ReactNode;
  stepTitle: string;
}

const stepTitles = ['Basic Info', 'Deliverables', 'Milestones', 'Acceptance Criteria'];

export const CreatePOLayout: React.FC<CreatePOLayoutProps> = ({
  currentStep,
  totalSteps,
  onStepChange,
  onNext,
  onPrevious,
  onSubmit,
  onSaveDraft,
  isEditMode = false,
  isSubmitting = false,
  isSavingDraft = false,
  progress,
  children,
  stepTitle,
}) => {
  const navigate = useNavigate();
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const handleNext = useCallback(() => {
    setDirection('forward');
    onNext();
  }, [onNext]);

  const handlePrevious = useCallback(() => {
    setDirection('backward');
    onPrevious();
  }, [onPrevious]);

  const handleStepClick = useCallback((step: number) => {
    setDirection(step > currentStep ? 'forward' : 'backward');
    onStepChange(step);
  }, [currentStep, onStepChange]);

  const handleExit = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => currentStep < totalSteps && handleNext(),
    onSwipedRight: () => currentStep > 1 && handlePrevious(),
    trackMouse: false,
    trackTouch: true,
    delta: 50,
  });

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Sidebar */}
        <aside className="w-72 xl:w-80 flex-shrink-0 bg-card/50 backdrop-blur-sm border-r border-border/60 p-6">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="pb-6 border-b border-border/60">
              <h2 className="text-lg font-semibold text-foreground">
                {isEditMode ? 'Edit Purchase Order' : 'Create Purchase Order'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Complete all steps to {isEditMode ? 'update' : 'create'} your PO
              </p>
            </div>

            {/* Stepper */}
            <div className="flex-1 py-6">
              <POVerticalStepper
                currentStep={currentStep}
                onStepClick={handleStepClick}
                progress={progress}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex-shrink-0 h-16 border-b border-border/60 bg-background/80 backdrop-blur-sm px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {currentStep}
              </div>
              <h1 className="text-xl font-semibold text-foreground">{stepTitle}</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-6">
              <POStepTransition direction={direction} stepKey={currentStep}>
                {children}
              </POStepTransition>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex-shrink-0 h-16 border-t border-border/60 bg-background/80 backdrop-blur-sm px-6 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {onSaveDraft && (
                <Button
                  variant="outline"
                  onClick={onSaveDraft}
                  disabled={isSavingDraft}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </Button>
              )}

              {isLastStep ? (
                <Button
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Update PO' : 'Submit for Approval')}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-screen" {...swipeHandlers}>
        {/* Mobile Header */}
        <header className="flex-shrink-0 bg-background border-b border-border/60">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="gap-2 text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Step title */}
          <div className="px-4 py-3">
            <h1 className="text-lg font-semibold text-foreground">{stepTitle}</h1>
          </div>
        </header>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <POStepTransition direction={direction} stepKey={currentStep}>
            {children}
          </POStepTransition>
        </div>

        {/* Mobile Footer */}
        <footer className="flex-shrink-0 border-t border-border/60 bg-background p-4">
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {onSaveDraft && (
              <Button
                variant="outline"
                onClick={onSaveDraft}
                disabled={isSavingDraft}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSavingDraft ? 'Draft' : 'Save'}
              </Button>
            )}

            {isLastStep ? (
              <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Submit'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};
