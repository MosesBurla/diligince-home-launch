import apiService from '../../core/api.service';
import { vendorQuotationsRoutes } from './quotations.routes';
import type {
  Quotation,
  QuotationDetail,
} from '@/types/quotation';
import type {
  VendorQuotationSubmitData,
  VendorQuotationListResponse,
  VendorQuotationStats,
  DocumentUploadResponse,
} from '@/types/vendor';

class VendorQuotationsService {
  /**
   * Submit a new quotation
   */
  async submitQuotation(data: VendorQuotationSubmitData): Promise<Quotation> {
    const response = await apiService.post<{ success: boolean; data: Quotation }, VendorQuotationSubmitData>(
      vendorQuotationsRoutes.submit,
      data
    );
    return response.data;
  }

  /**
   * Get vendor's submitted quotations
   */
  async getMyQuotations(filters?: {
    status?: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
    rfqId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<VendorQuotationListResponse> {
    const response = await apiService.get<VendorQuotationListResponse>(
      vendorQuotationsRoutes.getAll(filters)
    );
    return response;
  }

  /**
   * Get quotation details
   */
  async getQuotationDetails(quotationId: string): Promise<QuotationDetail> {
    const response = await apiService.get<{ success: boolean; data: QuotationDetail }>(
      vendorQuotationsRoutes.getById(quotationId)
    );
    return response.data;
  }

  /**
   * Update draft quotation
   */
  async updateDraftQuotation(
    quotationId: string,
    data: Partial<VendorQuotationSubmitData>
  ): Promise<Quotation> {
    const response = await apiService.put<{ success: boolean; data: Quotation }, Partial<VendorQuotationSubmitData>>(
      vendorQuotationsRoutes.update(quotationId),
      data
    );
    return response.data;
  }

  /**
   * Delete draft quotation
   */
  async deleteDraftQuotation(quotationId: string): Promise<void> {
    await apiService.remove(vendorQuotationsRoutes.delete(quotationId));
  }

  /**
   * Withdraw submitted quotation (before review)
   */
  async withdrawQuotation(quotationId: string, reason: string): Promise<void> {
    await apiService.post<{ success: boolean; message: string }, { reason: string }>(
      vendorQuotationsRoutes.withdraw(quotationId),
      { reason }
    );
  }

  /**
   * Upload quotation documents
   */
  async uploadDocument(quotationId: string, file: File): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('document', file);

    const response = await apiService.post<DocumentUploadResponse, FormData>(
      vendorQuotationsRoutes.uploadDocument(quotationId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  }

  /**
   * Get quotation statistics
   */
  async getQuotationStats(): Promise<VendorQuotationStats> {
    const response = await apiService.get<{ success: boolean; data: VendorQuotationStats }>(
      vendorQuotationsRoutes.stats
    );
    return response.data;
  }

  /**
   * Get purchase order associated with a quotation
   */
  async getPurchaseOrderForQuotation(quotationId: string): Promise<any | null> {
    try {
      const response = await apiService.get<{ success: boolean; data: any; message?: string }>(
        vendorQuotationsRoutes.getPurchaseOrder(quotationId)
      );
      return response.data; // Can be null if no PO exists
    } catch (error) {
      // If 404, return null (no PO exists yet)
      if ((error as any)?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}

export const vendorQuotationsService = new VendorQuotationsService();
export default vendorQuotationsService;
