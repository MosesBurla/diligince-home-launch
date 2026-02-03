import { useQuery } from '@tanstack/react-query';
import { purchaseOrdersService } from '@/services/modules/purchase-orders';
import type { POLimitStatus } from '@/services/modules/purchase-orders';

export interface UsePOSubscriptionLimitResult {
  canGenerate: boolean;
  used: number;
  limit: number | 'unlimited';
  remaining: number | 'unlimited';
  resetDate: string | null;
  planName: string;
  isWarning: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  upgradeOptions: POLimitStatus['upgradeOptions'];
  refetch: () => void;
}

/**
 * Hook to check the current user's PO generation limit and usage.
 * Used to gate PO creation based on subscription limits.
 */
export const usePOSubscriptionLimit = (): UsePOSubscriptionLimitResult => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['po-subscription-limit'],
    queryFn: () => purchaseOrdersService.checkLimit(),
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const limitData = data?.data;

  return {
    canGenerate: limitData?.canGenerate ?? false,
    used: limitData?.used ?? 0,
    limit: limitData?.limit ?? 0,
    remaining: limitData?.remaining ?? 0,
    resetDate: limitData?.resetDate ?? null,
    planName: limitData?.planName ?? '',
    isWarning: limitData?.isWarning ?? false,
    isLoading,
    isError,
    error: error as Error | null,
    upgradeOptions: limitData?.upgradeOptions,
    refetch,
  };
};

export default usePOSubscriptionLimit;
