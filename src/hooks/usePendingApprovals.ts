import { useState, useEffect, useCallback } from 'react';
import { approvalsService } from '@/services/modules/approvals/approvals.service';
import type { 
  PendingListResponse, 
  PendingApproval,
  CreatorFilter,
  PendingStatistics 
} from '@/services/modules/approvals/approvals.types';
import { PendingListParams } from '@/services/modules/approvals/approvals.routes';
import { toast } from 'sonner';

interface UsePendingApprovalsReturn {
  approvals: PendingApproval[];
  pagination: PendingListResponse['pagination'] | null;
  creators: CreatorFilter[];
  statistics: PendingStatistics | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const usePendingApprovals = (params: PendingListParams = {}): UsePendingApprovalsReturn => {
  const [data, setData] = useState<PendingListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPending = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await approvalsService.getPending(params);
      setData(response);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to load pending approvals');
      console.error('Error fetching pending approvals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  return {
    approvals: data?.items ?? [],
    pagination: data?.pagination ?? null,
    creators: data?.filters?.creators ?? [],
    statistics: data?.statistics ?? null,
    isLoading,
    error,
    refetch: fetchPending,
  };
};

export default usePendingApprovals;
