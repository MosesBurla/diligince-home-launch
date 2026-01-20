/**
 * Purchase Flow Component
 * 
 * Main modal component for the subscription purchase flow.
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { usePurchaseFlow, PurchaseFlowProvider } from './PurchaseFlowContext';
import { PlanReviewStep } from './PlanReviewStep';
import { ConfirmationStep } from './ConfirmationStep';
import { useSubscriptionPurchase } from '@/hooks/useSubscriptionPurchase';
import { PurchaseStep } from '@/services/modules/subscription-purchase';
import { cn } from '@/lib/utils';

const STEPS: { key: PurchaseStep; label: string }[] = [
  { key: 'review', label: 'Review' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirmation', label: 'Complete' },
];

const PurchaseFlowContent: React.FC = () => {
  const {
    isOpen,
    selectedPlan,
    selectedAddOns,
    selectedPrice,
    closePurchaseFlow,
    resetFlow,
  } = usePurchaseFlow();

  const {
    step,
    isLoading,
    error,
    paymentResult,
    startPurchase,
    retryPayment,
    reset: resetPurchase,
  } = useSubscriptionPurchase({
    onSuccess: () => {
      // Payment succeeded
    },
    onError: () => {
      // Payment failed
    },
    source: 'subscription_dashboard',
  });

  const handleClose = () => {
    closePurchaseFlow();
    resetFlow();
    resetPurchase();
  };

  const handleProceed = async () => {
    if (!selectedPlan) return;
    await startPurchase(selectedPlan, selectedAddOns, selectedPrice ?? undefined);
  };

  // Calculate progress
  const currentStepIndex = STEPS.findIndex(s => s.key === step);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  if (!selectedPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'confirmation'
              ? paymentResult
                ? 'Payment Complete'
                : 'Payment Status'
              : 'Complete Your Purchase'}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        {step !== 'confirmation' && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              {STEPS.map((s, index) => (
                <span
                  key={s.key}
                  className={cn(
                    'font-medium',
                    index <= currentStepIndex
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {s.label}
                </span>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Step Content */}
        {step === 'review' && (
          <PlanReviewStep
            plan={selectedPlan}
            addOns={selectedAddOns}
            selectedPrice={selectedPrice ?? selectedPlan.price ?? 0}
            gstRate={18}
            onProceed={handleProceed}
            onCancel={handleClose}
            isLoading={isLoading}
          />
        )}

        {step === 'payment' && (
          <div className="py-8 text-center">
            <div className="animate-pulse">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 rounded-full bg-primary animate-spin" />
              </div>
              <p className="text-muted-foreground">
                Opening payment gateway...
              </p>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <ConfirmationStep
            result={paymentResult}
            error={error}
            onRetry={retryPayment}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export const PurchaseFlow: React.FC = () => {
  return (
    <PurchaseFlowProvider>
      <PurchaseFlowContent />
    </PurchaseFlowProvider>
  );
};

export default PurchaseFlow;
