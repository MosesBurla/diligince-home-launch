import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { purchaseOrdersService } from '@/services/modules/purchase-orders';
import type { ExportPDFOptions } from '@/services/modules/purchase-orders';

/**
 * Hook to export a PO as PDF
 */
export const usePOExportPDF = () => {
  return useMutation({
    mutationFn: ({ poId, options }: { poId: string; options?: ExportPDFOptions }) => 
      purchaseOrdersService.exportToPDF(poId, options),
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PO-${variables.poId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to export PDF', {
        description: error?.message || 'An unexpected error occurred.',
      });
    },
  });
};

/**
 * Hook for vendor to export their received PO as PDF
 */
export const useVendorPOExportPDF = () => {
  return useMutation({
    mutationFn: ({ poId, options }: { poId: string; options?: ExportPDFOptions }) => 
      purchaseOrdersService.vendor.exportToPDF(poId, options),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PO-${variables.poId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to export PDF', {
        description: error?.message || 'An unexpected error occurred.',
      });
    },
  });
};

export default usePOExportPDF;
