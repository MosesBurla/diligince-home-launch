import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare, 
  Shield,
  Eye
} from 'lucide-react';
import { ReadOnlyVerticalStepper } from './ReadOnlyVerticalStepper';
import { ViewBasicInfoSection } from './ViewBasicInfoSection';
import { ViewDetailsSection } from './ViewDetailsSection';
import { ViewDocumentsSection } from './ViewDocumentsSection';
import { ViewApprovalSection } from './ViewApprovalSection';
import { InlineCommentsPanel } from './InlineCommentsPanel';
import { InlineApprovalStatusPanel } from './InlineApprovalStatusPanel';
import { RequirementApprovalActions } from '@/components/requirement/RequirementApprovalActions';

interface RequirementViewLayoutProps {
  requirement: any;
  canShowApprovalActions: boolean;
  onActionComplete?: () => void;
  headerBadge?: React.ReactNode;
  customFooterActions?: React.ReactNode;
}

const stepTitles = [
  "Basic Information",
  "Details & Specifications",
  "Documents & Attachments",
  "Approval Workflow",
];

export const RequirementViewLayout: React.FC<RequirementViewLayoutProps> = ({
  requirement,
  canShowApprovalActions,
  onActionComplete,
  headerBadge,
  customFooterActions
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [activePanel, setActivePanel] = useState<'comments' | 'approval' | null>(null);

  const requirementId = requirement?.id || requirement?.draftId || requirement?.requirementId || '';

  const togglePanel = (panel: 'comments' | 'approval') => {
    setActivePanel(current => current === panel ? null : panel);
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'approved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'published': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-500/10 text-red-600';
      case 'high': return 'bg-orange-500/10 text-orange-600';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600';
      case 'low': return 'bg-emerald-500/10 text-emerald-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleStepClick = useCallback((step: number) => {
    setDirection(step > currentStep ? "forward" : "backward");
    setCurrentStep(step);
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < 4) {
      setDirection("forward");
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setDirection("backward");
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Swipe gestures for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => currentStep < 4 && handleNext(),
    onSwipedRight: () => currentStep > 1 && handlePrevious(),
    trackMouse: false,
    trackTouch: true,
    delta: 50,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === 'ArrowRight' && currentStep < 4) {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ViewBasicInfoSection requirement={requirement} />;
      case 2:
        return <ViewDetailsSection requirement={requirement} />;
      case 3:
        return <ViewDocumentsSection documents={requirement?.documents} />;
      case 4:
        return <ViewApprovalSection requirement={requirement} />;
      default:
        return <ViewBasicInfoSection requirement={requirement} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Progress Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-1 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {currentStep > 1 ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="shrink-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Step {currentStep} of 4
              </p>
              <h2 className="text-sm font-semibold truncate">
                {stepTitles[currentStep - 1]}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={activePanel === 'comments' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => togglePanel('comments')}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button
              variant={activePanel === 'approval' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => togglePanel('approval')}
            >
              <Shield className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Inline Panels */}
        <div className="px-4 pb-3">
          <InlineCommentsPanel
            requirementId={requirementId}
            isOpen={activePanel === 'comments'}
            onClose={() => setActivePanel(null)}
          />
          <InlineApprovalStatusPanel
            isOpen={activePanel === 'approval'}
            onClose={() => setActivePanel(null)}
            approvalProgress={requirement?.approvalProgress}
            matrixName={requirement?.selectedApprovalMatrix?.name}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Panel - Vertical Stepper */}
        <aside className="w-72 xl:w-80 flex-shrink-0 bg-card border-r border-border/50 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">
                View Requirement
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Read-only mode
            </p>
          </div>

          {/* Stepper */}
          <div className="flex-1 overflow-y-auto p-4">
            <ReadOnlyVerticalStepper
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Status Footer */}
          <div className="p-4 border-t border-border/50 bg-muted/30 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getStatusColor(requirement?.status)}>
                {requirement?.status || 'Draft'}
              </Badge>
              {requirement?.priority && (
                <Badge className={getPriorityColor(requirement.priority)}>
                  {requirement.priority}
                </Badge>
              )}
            </div>
            {requirement?.title && (
              <p className="text-xs text-muted-foreground truncate">
                {requirement.title}
              </p>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Header */}
          <header className="flex-shrink-0 bg-background border-b border-border/50 px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {stepTitles[currentStep - 1]}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Step {currentStep} of 4
                  </p>
                </div>
                {headerBadge && (
                  <div className="ml-4">
                    {headerBadge}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={activePanel === 'comments' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => togglePanel('comments')}
                  className="gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Comments
                </Button>
                <Button
                  variant={activePanel === 'approval' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => togglePanel('approval')}
                  className="gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Approval Status
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="gap-2 text-muted-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>

            {/* Desktop Inline Panels */}
            <div className="mt-4">
              <InlineCommentsPanel
                requirementId={requirementId}
                isOpen={activePanel === 'comments'}
                onClose={() => setActivePanel(null)}
              />
              <InlineApprovalStatusPanel
                isOpen={activePanel === 'approval'}
                onClose={() => setActivePanel(null)}
                approvalProgress={requirement?.approvalProgress}
                matrixName={requirement?.selectedApprovalMatrix?.name}
              />
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 lg:p-8">
              <div
                className={cn(
                  "transition-all duration-300 ease-out",
                  direction === "forward" ? "animate-in slide-in-from-right-4 fade-in" : "animate-in slide-in-from-left-4 fade-in"
                )}
                key={currentStep}
              >
                {renderStepContent()}
              </div>
            </div>
          </div>

          {/* Desktop Footer */}
          <footer className="flex-shrink-0 bg-background border-t border-border/50 px-8 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
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
              </div>

              <p className="text-xs text-muted-foreground hidden md:block">
                Use Alt + Arrow keys to navigate
              </p>

              <div className="flex items-center gap-3">
                {/* Custom footer actions (for approved/published views) */}
                {customFooterActions ? (
                  customFooterActions
                ) : canShowApprovalActions ? (
                  <RequirementApprovalActions
                    requirementId={requirementId}
                    onActionComplete={onActionComplete}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {requirement?.status === 'approved' 
                      ? 'Approved'
                      : requirement?.status === 'rejected'
                      ? 'Rejected'
                      : 'Not an approver'}
                  </p>
                )}

                <Button
                  onClick={handleNext}
                  disabled={currentStep === 4}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Content */}
      <div
        {...swipeHandlers}
        className="lg:hidden pt-2 pb-32 px-4 touch-pan-y"
      >
        <div
          className={cn(
            "transition-all duration-300 ease-out",
            direction === "forward" ? "animate-in slide-in-from-right-4 fade-in" : "animate-in slide-in-from-left-4 fade-in"
          )}
          key={currentStep}
        >
          {renderStepContent()}
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t shadow-lg">
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

          {/* Custom footer actions (for approved/published views) */}
          {customFooterActions ? (
            <div className="flex-1">{customFooterActions}</div>
          ) : canShowApprovalActions ? (
            <div className="flex-1">
              <RequirementApprovalActions
                requirementId={requirementId}
                onActionComplete={onActionComplete}
              />
            </div>
          ) : (
            <span className="flex-1 text-xs text-muted-foreground text-center">
              {requirement?.status === 'approved' 
                ? 'Approved'
                : requirement?.status === 'rejected'
                ? 'Rejected'
                : 'Not an approver for current level'}
            </span>
          )}

          {currentStep < 4 && (
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequirementViewLayout;
