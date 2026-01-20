/**
 * Confirmation Step Component
 * 
 * Final step showing payment result (success/failure).
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Calendar, Receipt, ArrowRight, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VerifyPaymentResponse } from '@/services/modules/subscription-purchase';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface ConfirmationStepProps {
  result: VerifyPaymentResponse['data'] | null;
  error: string | null;
  onRetry?: () => void;
  onClose: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  result,
  error,
  onRetry,
  onClose,
}) => {
  const isSuccess = !!result && !error;

  if (!isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        
        <h3 className="font-semibold text-xl mb-2">Payment Failed</h3>
        
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {error || 'Something went wrong with your payment. Please try again.'}
        </p>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {onRetry && (
            <Button onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>

      <h3 className="font-semibold text-2xl mb-2">Payment Successful!</h3>
      
      <p className="text-muted-foreground mb-8">
        Your subscription has been activated successfully.
      </p>

      {/* Subscription Details */}
      <Card className="mb-6 text-left">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium">{result.plan.name}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={cn(
                'font-medium capitalize',
                result.status === 'active' && 'text-green-600'
              )}>
                {result.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Next Billing</span>
              </div>
              <span className="font-medium">
                {formatDate(result.billing.nextBillingDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Receipt className="h-4 w-4" />
                <span>Amount</span>
              </div>
              <span className="font-medium">
                {formatCurrency(result.billing.amount / 100)}
              </span>
            </div>

            {result.transaction.transactionId && (
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-muted-foreground text-sm">Transaction ID</span>
                <span className="text-sm font-mono">
                  {result.transaction.transactionId}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button asChild className="w-full gap-2">
          <Link to="/dashboard/subscription/plans">
            View Subscription
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button variant="outline" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>

      {/* Email Notice */}
      <p className="text-sm text-muted-foreground mt-6">
        A confirmation email has been sent to your registered email address.
      </p>
    </div>
  );
};

export default ConfirmationStep;
