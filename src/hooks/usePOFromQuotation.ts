import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { purchaseOrdersService } from '@/services/modules/purchase-orders';
import type { CreatePORequest, POPrefillData } from '@/services/modules/purchase-orders';

/**
 * Hook to fetch quotation data for PO pre-fill
 */
export const usePOPrefill = (quotationId: string | undefined) => {
  return useQuery({
    queryKey: ['po-prefill', quotationId],
    queryFn: () => purchaseOrdersService.getPrefillFromQuotation(quotationId!),
    enabled: !!quotationId,
    staleTime: 300000, // 5 minutes
  });
};

/**
 * Hook to create a PO from an approved quotation
 */
export const useCreatePOFromQuotation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreatePORequest) => purchaseOrdersService.create(data),
    onSuccess: (response) => {
      toast.success('Purchase order created successfully');
      queryClient.invalidateQueries({ queryKey: ['po-subscription-limit'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      
      if (response?.data?.id) {
        navigate(`/dashboard/purchase-orders/${response.data.id}`);
      }
    },
    onError: (error: any) => {
      const errorCode = error?.response?.data?.error?.code;
      
      if (errorCode === 'PO_LIMIT_REACHED') {
        toast.error('Monthly PO limit reached', {
          description: 'Please upgrade your plan to create more purchase orders.',
        });
      } else if (errorCode === 'QUOTATION_NOT_APPROVED') {
        toast.error('Quotation not approved', {
          description: 'Cannot create PO from a non-approved quotation.',
        });
      } else {
        toast.error('Failed to create purchase order', {
          description: error?.message || 'An unexpected error occurred.',
        });
      }
    },
  });
};

/**
 * Transform prefill data to form defaults
 */
export const transformPrefillToFormData = (prefill: POPrefillData) => {
  return {
    quotationId: prefill.quotationId,
    projectTitle: prefill.requirementTitle,
    scopeOfWork: '',
    specialInstructions: '',
    startDate: new Date(prefill.suggestedStartDate),
    endDate: new Date(prefill.suggestedEndDate),
    paymentTerms: prefill.termsFromQuotation.paymentTerms || '',
    deliverables: prefill.lineItems.map((item, index) => ({
      id: `del_${index}`,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
    })),
    paymentMilestones: [],
    acceptanceCriteria: [],
    isoCompliance: {
      termsAndConditions: [],
      qualityRequirements: [],
      warrantyPeriod: prefill.termsFromQuotation.warrantyPeriod || '',
      penaltyClause: '',
    },
  };
};
