import apiService from '../../core/api.service';
import { purchaseOrdersRoutes } from './purchase-orders.routes';
import type {
  PurchaseOrder,
  PurchaseOrderDetail,
  POListResponse,
  PODetailResponse,
  POListParams,
  CreatePORequest,
  UpdatePORequest,
  CancelPORequest,
  ApprovePORequest,
  RejectPORequest,
  SendPORequest,
  POSendResponse,
  POLimitResponse,
  POPrefillResponse,
  POCreateResponse,
  PaymentMilestone,
  MilestoneListResponse,
  MilestoneUpdateRequest,
  Invoice,
  InvoiceListResponse,
  InvoiceCreateRequest,
  InvoiceUpdateRequest,
  MarkInvoicePaidRequest,
  DeliveryTracking,
  DeliveryTrackingResponse,
  DeliveryUpdateRequest,
  ActivityLog,
  ActivityLogResponse,
  ExportXLSXRequest,
  ExportPDFOptions,
  VendorPOListParams,
  VendorPOListResponse,
  VendorPODetailResponse,
  VendorPOResponseRequest,
} from './purchase-orders.types';

class PurchaseOrdersService {
  // ============= List Operations =============

  async getActive(params?: POListParams): Promise<POListResponse> {
    return apiService.get<POListResponse>(purchaseOrdersRoutes.getActive(params));
  }

  async getPending(params?: POListParams): Promise<POListResponse> {
    return apiService.get<POListResponse>(purchaseOrdersRoutes.getPending(params));
  }

  async getInProgress(params?: POListParams): Promise<POListResponse> {
    return apiService.get<POListResponse>(purchaseOrdersRoutes.getInProgress(params));
  }

  async getCompleted(params?: POListParams): Promise<POListResponse> {
    return apiService.get<POListResponse>(purchaseOrdersRoutes.getCompleted(params));
  }

  async getAll(params?: POListParams): Promise<POListResponse> {
    return apiService.get<POListResponse>(purchaseOrdersRoutes.getAll(params));
  }

  // ============= Subscription Limit =============

  async checkLimit(): Promise<POLimitResponse> {
    return apiService.get<POLimitResponse>(purchaseOrdersRoutes.checkLimit);
  }

  // ============= Single PO Operations =============

  async getById(orderId: string): Promise<PODetailResponse> {
    return apiService.get<PODetailResponse>(purchaseOrdersRoutes.getById(orderId));
  }

  async getPrefillFromQuotation(quotationId: string): Promise<POPrefillResponse> {
    return apiService.get<POPrefillResponse>(purchaseOrdersRoutes.getPrefillFromQuotation(quotationId));
  }

  async create(data: CreatePORequest): Promise<POCreateResponse> {
    return apiService.post<POCreateResponse, CreatePORequest>(purchaseOrdersRoutes.create, data);
  }

  async update(orderId: string, data: UpdatePORequest): Promise<PODetailResponse> {
    return apiService.put<PODetailResponse, UpdatePORequest>(purchaseOrdersRoutes.update(orderId), data);
  }

  async cancel(orderId: string, reason: string): Promise<PODetailResponse> {
    const payload: CancelPORequest = { reason, cancelledBy: 'current_user' };
    return apiService.post<PODetailResponse, CancelPORequest>(purchaseOrdersRoutes.cancel(orderId), payload);
  }

  async delete(orderId: string): Promise<void> {
    return apiService.remove<void>(`/api/v1/industry/purchase-orders/${orderId}`);
  }

  // ============= Approval =============

  async approve(orderId: string, comments?: string): Promise<PODetailResponse> {
    const payload: ApprovePORequest = { comments };
    return apiService.post<PODetailResponse, ApprovePORequest>(purchaseOrdersRoutes.approve(orderId), payload);
  }

  async reject(orderId: string, reason: string): Promise<PODetailResponse> {
    const payload: RejectPORequest = { reason };
    return apiService.post<PODetailResponse, RejectPORequest>(purchaseOrdersRoutes.reject(orderId), payload);
  }

  // ============= Send to Vendor =============

  async send(orderId: string, data?: SendPORequest): Promise<POSendResponse> {
    return apiService.post<POSendResponse, SendPORequest | {}>(purchaseOrdersRoutes.send(orderId), data || {});
  }

  // ============= Milestone Operations =============

  async getMilestones(orderId: string): Promise<MilestoneListResponse> {
    return apiService.get<MilestoneListResponse>(purchaseOrdersRoutes.getMilestones(orderId));
  }

  async getMilestoneById(orderId: string, milestoneId: string): Promise<{ success: boolean; data: PaymentMilestone }> {
    return apiService.get<{ success: boolean; data: PaymentMilestone }>(
      purchaseOrdersRoutes.getMilestoneById(orderId, milestoneId)
    );
  }

  async updateMilestone(
    orderId: string,
    milestoneId: string,
    data: MilestoneUpdateRequest
  ): Promise<{ success: boolean; data: PaymentMilestone }> {
    return apiService.put<{ success: boolean; data: PaymentMilestone }, MilestoneUpdateRequest>(
      purchaseOrdersRoutes.updateMilestone(orderId, milestoneId),
      data
    );
  }

  async markMilestoneComplete(
    orderId: string,
    milestoneId: string,
    notes?: string
  ): Promise<{ success: boolean; data: PaymentMilestone }> {
    return apiService.post<{ success: boolean; data: PaymentMilestone }, { notes?: string }>(
      purchaseOrdersRoutes.markMilestoneComplete(orderId, milestoneId),
      { notes }
    );
  }

  async uploadMilestoneProof(
    orderId: string,
    milestoneId: string,
    document: File
  ): Promise<{ success: boolean; data: PaymentMilestone }> {
    const formData = new FormData();
    formData.append('document', document);
    return apiService.post<{ success: boolean; data: PaymentMilestone }, FormData>(
      purchaseOrdersRoutes.uploadMilestoneProof(orderId, milestoneId),
      formData
    );
  }

  // ============= Invoice Operations =============

  async getInvoices(orderId: string): Promise<InvoiceListResponse> {
    return apiService.get<InvoiceListResponse>(purchaseOrdersRoutes.getInvoices(orderId));
  }

  async getInvoiceById(orderId: string, invoiceId: string): Promise<{ success: boolean; data: Invoice }> {
    return apiService.get<{ success: boolean; data: Invoice }>(
      purchaseOrdersRoutes.getInvoiceById(orderId, invoiceId)
    );
  }

  async createInvoice(orderId: string, data: InvoiceCreateRequest): Promise<{ success: boolean; data: Invoice }> {
    return apiService.post<{ success: boolean; data: Invoice }, InvoiceCreateRequest>(
      purchaseOrdersRoutes.createInvoice(orderId),
      data
    );
  }

  async updateInvoice(
    orderId: string,
    invoiceId: string,
    data: InvoiceUpdateRequest
  ): Promise<{ success: boolean; data: Invoice }> {
    return apiService.put<{ success: boolean; data: Invoice }, InvoiceUpdateRequest>(
      purchaseOrdersRoutes.updateInvoice(orderId, invoiceId),
      data
    );
  }

  async markInvoicePaid(
    orderId: string,
    invoiceId: string,
    paymentData: MarkInvoicePaidRequest
  ): Promise<{ success: boolean; data: Invoice }> {
    return apiService.post<{ success: boolean; data: Invoice }, MarkInvoicePaidRequest>(
      purchaseOrdersRoutes.markInvoicePaid(orderId, invoiceId),
      paymentData
    );
  }

  async exportInvoicePDF(orderId: string, invoiceId: string): Promise<Blob> {
    return apiService.get<Blob>(
      purchaseOrdersRoutes.exportInvoicePDF(orderId, invoiceId),
      { responseType: 'blob' }
    );
  }

  // ============= Delivery Operations =============

  async getDeliveryTracking(orderId: string): Promise<DeliveryTrackingResponse> {
    return apiService.get<DeliveryTrackingResponse>(purchaseOrdersRoutes.getDeliveryTracking(orderId));
  }

  async getDeliveryTimeline(orderId: string): Promise<DeliveryTrackingResponse> {
    return apiService.get<DeliveryTrackingResponse>(purchaseOrdersRoutes.getDeliveryTimeline(orderId));
  }

  async updateDeliveryStatus(orderId: string, data: DeliveryUpdateRequest): Promise<DeliveryTrackingResponse> {
    return apiService.post<DeliveryTrackingResponse, DeliveryUpdateRequest>(
      purchaseOrdersRoutes.updateDeliveryStatus(orderId),
      data
    );
  }

  async uploadProofOfDelivery(orderId: string, document: File): Promise<DeliveryTrackingResponse> {
    const formData = new FormData();
    formData.append('document', document);
    return apiService.post<DeliveryTrackingResponse, FormData>(
      purchaseOrdersRoutes.uploadProofOfDelivery(orderId),
      formData
    );
  }

  // ============= Activity Log =============

  async getActivityLog(orderId: string): Promise<ActivityLogResponse> {
    return apiService.get<ActivityLogResponse>(purchaseOrdersRoutes.getActivityLog(orderId));
  }

  // ============= Export Operations =============

  async exportToPDF(orderId: string, options?: ExportPDFOptions): Promise<Blob> {
    return apiService.get<Blob>(
      purchaseOrdersRoutes.exportToPDF(orderId, options),
      { responseType: 'blob' }
    );
  }

  async exportToXLSX(params: ExportXLSXRequest): Promise<Blob> {
    return apiService.post<Blob, ExportXLSXRequest>(
      purchaseOrdersRoutes.exportToXLSX,
      params,
      { responseType: 'blob' }
    );
  }

  // ============= Vendor Methods =============

  vendor = {
    getAll: async (params?: VendorPOListParams): Promise<VendorPOListResponse> => {
      return apiService.get<VendorPOListResponse>(purchaseOrdersRoutes.vendor.getAll(params));
    },

    getById: async (poId: string): Promise<VendorPODetailResponse> => {
      return apiService.get<VendorPODetailResponse>(purchaseOrdersRoutes.vendor.getById(poId));
    },

    respond: async (poId: string, data: VendorPOResponseRequest): Promise<PODetailResponse> => {
      return apiService.post<PODetailResponse, VendorPOResponseRequest>(purchaseOrdersRoutes.vendor.respond(poId), data);
    },

    getStats: async (): Promise<any> => {
      return apiService.get(purchaseOrdersRoutes.vendor.stats);
    },

    exportToPDF: async (poId: string, options?: ExportPDFOptions): Promise<Blob> => {
      return apiService.get<Blob>(purchaseOrdersRoutes.vendor.exportToPDF(poId, options), { responseType: 'blob' });
    },
  };
}

export const purchaseOrdersService = new PurchaseOrdersService();
export default purchaseOrdersService;
