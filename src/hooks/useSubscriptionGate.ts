/**
 * Subscription Gate Hook
 * 
 * Manages access control for subscription features based on
 * profile verification status.
 */

import { useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { VerificationStatus } from '@/types/verification';

interface UseSubscriptionGateReturn {
  /** Whether the user's profile is verified */
  isVerified: boolean;
  
  /** Whether verification is pending */
  isPending: boolean;
  
  /** Whether verification was rejected */
  isRejected: boolean;
  
  /** Current verification status */
  verificationStatus: VerificationStatus;
  
  /** Whether subscription features should be accessible */
  canAccessSubscription: boolean;
  
  /** Whether subscription features should be shown (visible but maybe locked) */
  showSubscriptionMenu: boolean;
  
  /** Message to display when access is blocked */
  blockMessage: string;
  
  /** Path to redirect for verification */
  verificationPath: string;
}

export function useSubscriptionGate(): UseSubscriptionGateReturn {
  const { user, verificationStatus } = useUser();

  const result = useMemo(() => {
    const status = verificationStatus || VerificationStatus.INCOMPLETE;
    
    const isVerified = status === VerificationStatus.APPROVED;
    const isPending = status === VerificationStatus.PENDING;
    const isRejected = status === VerificationStatus.REJECTED;
    
    // Subscription menu is always shown to logged-in users
    const showSubscriptionMenu = !!user;
    
    // But features are only accessible when verified
    const canAccessSubscription = isVerified;
    
    // Determine block message based on status
    let blockMessage = '';
    if (!isVerified) {
      if (isPending) {
        blockMessage = 'Your profile is under review. Subscription features will be available once verified.';
      } else if (isRejected) {
        blockMessage = 'Your profile verification was rejected. Please update your profile and resubmit.';
      } else {
        blockMessage = 'Complete your profile verification to access subscription features.';
      }
    }
    
    // Determine verification path based on user type
    const userType = user?.userType || 'industry';
    const verificationPath = userType === 'industry'
      ? '/dashboard/industry-settings'
      : '/dashboard/vendor-settings';

    return {
      isVerified,
      isPending,
      isRejected,
      verificationStatus: status,
      canAccessSubscription,
      showSubscriptionMenu,
      blockMessage,
      verificationPath,
    };
  }, [user, verificationStatus]);

  return result;
}

export default useSubscriptionGate;
