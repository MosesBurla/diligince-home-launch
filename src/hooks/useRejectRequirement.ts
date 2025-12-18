import { useState } from 'react';
import { approvalsService } from '@/services/modules/approvals/approvals.service';
import type { RejectPayload, RejectResponse } from '@/services/modules/approvals/approvals.types';
import { toast } from 'sonner';

interface UseRejectRequirementReturn {
  reject: (requirementId: string, payload: RejectPayload) => Promise<RejectResponse | null>;
  isLoading: boolean;
  error: Error | null;
}

export const useRejectRequirement = (): UseRejectRequirementReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reject = async (requirementId: string, payload: RejectPayload): Promise<RejectResponse | null> => {
    if (!payload.reason?.trim()) {
      toast.error('Rejection reason is required');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await approvalsService.reject(requirementId, payload);
      
      toast.success('Requirement rejected');
      
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to reject requirement');
      console.error('Error rejecting requirement:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { reject, isLoading, error };
};

export default useRejectRequirement;
