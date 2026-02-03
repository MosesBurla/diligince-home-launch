import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { purchaseOrdersService } from '@/services/modules/purchase-orders';
import type { VendorPOListParams, VendorPOResponseRequest } from '@/services/modules/purchase-orders';

/**
 * Hook to fetch vendor's received purchase orders
 */
export const useVendorPurchaseOrders = (params?: VendorPOListParams) => {
  return useQuery({
    queryKey: ['vendor-purchase-orders', params],
    queryFn: () => purchaseOrdersService.vendor.getAll(params),
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to fetch a single PO detail for vendor
 */
export const useVendorPODetail = (poId: string | undefined) => {
  return useQuery({
    queryKey: ['vendor-purchase-order', poId],
    queryFn: () => purchaseOrdersService.vendor.getById(poId!),
    enabled: !!poId,
  });
};

/**
 * Hook for vendor to respond to a PO (accept/reject/negotiate)
 */
export const useVendorPOResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ poId, data }: { poId: string; data: VendorPOResponseRequest }) => 
      purchaseOrdersService.vendor.respond(poId, data),
    onSuccess: (response, variables) => {
      const actionLabel = {
        accept: 'accepted',
        reject: 'rejected',
        negotiate: 'negotiation requested',
      }[variables.data.action];
      
      const poNumber = response?.data?.orderNumber || 'PO';
      
      toast.success(`Purchase order ${actionLabel}`, {
        description: `${poNumber} has been ${actionLabel}.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['vendor-purchase-order', variables.poId] });
      queryClient.invalidateQueries({ queryKey: ['vendor-purchase-orders'] });
    },
    onError: (error: any) => {
      const errorCode = error?.response?.data?.error?.code;
      
      if (errorCode === 'PO_ALREADY_RESPONDED') {
        toast.error('Already responded', {
          description: 'You have already responded to this purchase order.',
        });
      } else if (errorCode === 'ACCEPTANCE_DEADLINE_PASSED') {
        toast.error('Deadline passed', {
          description: 'The acceptance deadline has expired.',
        });
      } else {
        toast.error('Failed to respond', {
          description: error?.message || 'An unexpected error occurred.',
        });
      }
    },
  });
};

/**
 * Hook to get vendor PO statistics
 */
export const useVendorPOStats = () => {
  return useQuery({
    queryKey: ['vendor-po-stats'],
    queryFn: () => purchaseOrdersService.vendor.getStats(),
    staleTime: 60000, // 1 minute
  });
};

export default useVendorPurchaseOrders;
