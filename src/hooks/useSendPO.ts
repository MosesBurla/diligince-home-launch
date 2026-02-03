import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { purchaseOrdersService } from '@/services/modules/purchase-orders';
import type { SendPORequest } from '@/services/modules/purchase-orders';

/**
 * Hook to send an approved PO to vendor/professional
 */
export const useSendPO = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ poId, data }: { poId: string; data?: SendPORequest }) => 
      purchaseOrdersService.send(poId, data),
    onSuccess: (response) => {
      toast.success('Purchase order sent successfully', {
        description: `PO ${response.data.poNumber} has been sent to ${response.data.recipient.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ['purchase-order'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
    onError: (error: any) => {
      const errorCode = error?.response?.data?.error?.code;
      
      if (errorCode === 'PO_NOT_APPROVED') {
        toast.error('PO not approved', {
          description: 'Purchase order must be approved before sending.',
        });
      } else if (errorCode === 'PO_ALREADY_SENT') {
        toast.error('Already sent', {
          description: 'This purchase order has already been sent.',
        });
      } else {
        toast.error('Failed to send purchase order', {
          description: error?.message || 'An unexpected error occurred.',
        });
      }
    },
  });
};

export default useSendPO;
