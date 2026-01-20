/**
 * Subscription Gate Component
 * 
 * Wrapper component that shows subscription features in read-only mode
 * until the user's profile is verified.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscriptionGate } from '@/hooks/useSubscriptionGate';
import { cn } from '@/lib/utils';

interface SubscriptionGateProps {
  children: React.ReactNode;
  /** Custom message to show when blocked */
  customMessage?: string;
  /** Custom fallback component */
  fallback?: React.ReactNode;
  /** Whether to show the overlay (default: true) */
  showOverlay?: boolean;
  /** Additional class names */
  className?: string;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  children,
  customMessage,
  fallback,
  showOverlay = true,
  className,
}) => {
  const {
    isVerified,
    isPending,
    isRejected,
    blockMessage,
    verificationPath,
  } = useSubscriptionGate();

  // If verified, render children normally
  if (isVerified) {
    return <>{children}</>;
  }

  // Use custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Determine icon based on status
  const StatusIcon = isPending ? Clock : isRejected ? XCircle : Lock;
  const iconColor = isPending
    ? 'text-yellow-500'
    : isRejected
    ? 'text-destructive'
    : 'text-muted-foreground';

  return (
    <div className={cn('relative', className)}>
      {/* Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <Card className="max-w-md mx-4 shadow-lg border-2">
            <CardContent className="pt-6 text-center">
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                isPending ? 'bg-yellow-50' : isRejected ? 'bg-destructive/10' : 'bg-muted'
              )}>
                <StatusIcon className={cn('h-8 w-8', iconColor)} />
              </div>
              
              <h3 className="font-semibold text-lg mb-2">
                {isPending
                  ? 'Verification In Progress'
                  : isRejected
                  ? 'Verification Required'
                  : 'Profile Verification Required'}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-6">
                {customMessage || blockMessage}
              </p>
              
              {!isPending && (
                <Button asChild>
                  <Link to={verificationPath}>
                    {isRejected ? 'Update Profile' : 'Complete Verification'}
                  </Link>
                </Button>
              )}
              
              {isPending && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>This usually takes 1-2 business days</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Blurred content underneath */}
      <div className={cn(
        showOverlay && 'pointer-events-none select-none',
        showOverlay && !isVerified && 'blur-[2px] opacity-60'
      )}>
        {children}
      </div>
    </div>
  );
};

export default SubscriptionGate;
