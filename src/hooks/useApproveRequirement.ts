import { useState } from 'react';
import { approvalsService } from '@/services/modules/approvals/approvals.service';
import type { ApprovePayload, ApproveResponse } from '@/services/modules/approvals/approvals.types';
import { toast } from 'sonner';

interface UseApproveRequirementReturn {
  approve: (requirementId: string, payload?: ApprovePayload) => Promise<ApproveResponse | null>;
  isLoading: boolean;
  error: Error | null;
}

export const useApproveRequirement = (): UseApproveRequirementReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approve = async (requirementId: string, payload: ApprovePayload = {}): Promise<ApproveResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await approvalsService.approve(requirementId, payload);
      
      if (response.data?.fullyApproved) {
        toast.success('Requirement fully approved! Ready to publish.');
      } else if (response.data?.levelAdvanced) {
        toast.success('Approved! Moving to next approval level.');
      } else {
        toast.success('Approved successfully!');
      }
      
      return response;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to approve requirement');
      console.error('Error approving requirement:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { approve, isLoading, error };
};

export default useApproveRequirement;
