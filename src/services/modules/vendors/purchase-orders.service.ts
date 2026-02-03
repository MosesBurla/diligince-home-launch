import apiService from '../../core/api.service';
import { vendorPurchaseOrdersRoutes } from './purchase-orders.routes';
import type {
  PurchaseOrder,
  PurchaseOrderDetail,
  Milestone,
  Invoice,
  POStatus,
} from '@/types/purchase-order';
import type {
  VendorPOListResponse,
  VendorPOStats,
  VendorInvoiceSubmitData,
  VendorPOAcceptData,
  VendorPORejectData,
  VendorMilestoneSubmitData,
} from '@/types/vendor';

class VendorPurchaseOrdersService {
  /**
   * Get vendor's purchase orders
   */
  async getMyPurchaseOrders(filters?: {
    status?: POStatus[];
    page?: number;
    limit?: number;
  }): Promise<VendorPOListResponse> {
    const response = await apiService.get<VendorPOListResponse>(
      vendorPurchaseOrdersRoutes.getAll(filters)
    );
    return response;
  }

  /**
   * Get PO details
   */
  async getPODetails(poId: string): Promise<PurchaseOrderDetail> {
    const response = await apiService.get<{ success: boolean; data: PurchaseOrderDetail }>(
      vendorPurchaseOrdersRoutes.getById(poId)
    );
    return response.data;
  }

  /**
   * Respond to purchase order (accept/reject/negotiate)
   */
  async respondToPO(
    poId: string,
    action: 'accept' | 'reject' | 'negotiate',
    data?: {
      comments?: string;
      estimatedCompletionDate?: string;
      digitalSignature?: {
        signedBy: string;
        designation: string;
      };
      reason?: string;
      negotiationPoints?: Array<{
        field: string;
        currentValue: any;
        proposedValue: any;
        justification: string;
      }>;
    }
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    const response = await apiService.post<
      { success: boolean; data?: any; message?: string },
      { action: string;[key: string]: any }
    >(
      vendorPurchaseOrdersRoutes.respond(poId),
      {
        action,
        ...data,
      }
    );
    return response;
  }

  /**
   * Submit milestone completion
   */
  async submitMilestoneCompletion(
    poId: string,
    milestoneId: string,
    data: VendorMilestoneSubmitData
  ): Promise<Milestone> {
    const formData = new FormData();
    formData.append('completionDate', data.completionDate);
    formData.append('notes', data.notes || '');
    data.deliverables.forEach((file) => {
      formData.append('deliverables', file);
    });

    const response = await apiService.post<{ success: boolean; data: Milestone }, FormData>(
      vendorPurchaseOrdersRoutes.submitMilestoneCompletion(poId, milestoneId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Submit invoice
   */
  async submitInvoice(poId: string, data: VendorInvoiceSubmitData): Promise<Invoice> {
    const response = await apiService.post<{ success: boolean; data: Invoice }, VendorInvoiceSubmitData>(
      vendorPurchaseOrdersRoutes.submitInvoice(poId),
      data
    );
    return response.data;
  }

  /**
   * Get vendor PO statistics
   */
  async getPOStats(): Promise<VendorPOStats> {
    const response = await apiService.get<{ success: boolean; data: VendorPOStats }>(
      vendorPurchaseOrdersRoutes.stats
    );
    return response.data;
  }

  /**
   * Export PO as PDF
   */
  async exportPOAsPDF(poId: string): Promise<any> {
    const response = await apiService.get<{ success: boolean; data: any }>(
      vendorPurchaseOrdersRoutes.export(poId)
    );
    return response.data;
  }
}

export const vendorPurchaseOrdersService = new VendorPurchaseOrdersService();
export default vendorPurchaseOrdersService;
