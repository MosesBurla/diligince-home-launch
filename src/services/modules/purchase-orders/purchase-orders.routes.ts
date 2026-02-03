import { buildQueryString, API_BASE_PATH } from '../../core/api.config';
import type { ExportPDFOptions, POListParams, VendorPOListParams } from './purchase-orders.types';

const BASE_PATH = `${API_BASE_PATH}/industry/purchase-orders`;
const VENDOR_BASE_PATH = `${API_BASE_PATH}/vendors/purchase-orders`;
const PROFESSIONAL_BASE_PATH = `${API_BASE_PATH}/professionals/purchase-orders`;

export const purchaseOrdersRoutes = {
  // ============= List Endpoints (Status-based) =============
  getActive: (params?: POListParams) => `${BASE_PATH}/active${buildQueryString(params)}`,
  
  getPending: (params?: POListParams) => `${BASE_PATH}/pending${buildQueryString(params)}`,
  
  getInProgress: (params?: POListParams) => `${BASE_PATH}/in-progress${buildQueryString(params)}`,
  
  getCompleted: (params?: POListParams) => `${BASE_PATH}/completed${buildQueryString(params)}`,
  
  getAll: (params?: POListParams) => `${BASE_PATH}${buildQueryString(params)}`,
  
  // ============= Subscription Limit =============
  checkLimit: `${BASE_PATH}/limit`,
  
  // ============= Single PO Operations =============
  getById: (orderId: string) => `${BASE_PATH}/${orderId}`,
  
  create: `${BASE_PATH}`,
  
  update: (orderId: string) => `${BASE_PATH}/${orderId}`,
  
  cancel: (orderId: string) => `${BASE_PATH}/${orderId}/cancel`,
  
  // ============= Pre-fill from Quotation =============
  getPrefillFromQuotation: (quotationId: string) => 
    `${API_BASE_PATH}/industry/quotations/${quotationId}/po-prefill`,
  
  // ============= Approval Workflow =============
  approve: (orderId: string) => `${BASE_PATH}/${orderId}/approve`,
  
  reject: (orderId: string) => `${BASE_PATH}/${orderId}/reject`,
  
  // ============= Send to Vendor/Professional =============
  send: (orderId: string) => `${BASE_PATH}/${orderId}/send`,
  
  // ============= Milestone Operations =============
  getMilestones: (orderId: string) => `${BASE_PATH}/${orderId}/milestones`,
  
  getMilestoneById: (orderId: string, milestoneId: string) => 
    `${BASE_PATH}/${orderId}/milestones/${milestoneId}`,
  
  updateMilestone: (orderId: string, milestoneId: string) => 
    `${BASE_PATH}/${orderId}/milestones/${milestoneId}`,
  
  markMilestoneComplete: (orderId: string, milestoneId: string) => 
    `${BASE_PATH}/${orderId}/milestones/${milestoneId}/mark-complete`,
  
  uploadMilestoneProof: (orderId: string, milestoneId: string) => 
    `${BASE_PATH}/${orderId}/milestones/${milestoneId}/upload-proof`,
  
  // ============= Invoice Operations =============
  getInvoices: (orderId: string) => `${BASE_PATH}/${orderId}/invoices`,
  
  getInvoiceById: (orderId: string, invoiceId: string) => 
    `${BASE_PATH}/${orderId}/invoices/${invoiceId}`,
  
  createInvoice: (orderId: string) => `${BASE_PATH}/${orderId}/invoices`,
  
  updateInvoice: (orderId: string, invoiceId: string) => 
    `${BASE_PATH}/${orderId}/invoices/${invoiceId}`,
  
  markInvoicePaid: (orderId: string, invoiceId: string) => 
    `${BASE_PATH}/${orderId}/invoices/${invoiceId}/mark-paid`,
  
  exportInvoicePDF: (orderId: string, invoiceId: string) => 
    `${BASE_PATH}/${orderId}/invoices/${invoiceId}/export/pdf`,
  
  // ============= Delivery Tracking =============
  getDeliveryTracking: (orderId: string) => `${BASE_PATH}/${orderId}/delivery`,
  
  getDeliveryTimeline: (orderId: string) => `${BASE_PATH}/${orderId}/delivery/timeline`,
  
  updateDeliveryStatus: (orderId: string) => `${BASE_PATH}/${orderId}/delivery/update`,
  
  uploadProofOfDelivery: (orderId: string) => `${BASE_PATH}/${orderId}/delivery/proof`,
  
  // ============= Activity Log =============
  getActivityLog: (orderId: string) => `${BASE_PATH}/${orderId}/activity`,
  
  // ============= Export Operations =============
  exportToPDF: (orderId: string, options?: ExportPDFOptions) => 
    `${BASE_PATH}/${orderId}/export/pdf${buildQueryString(options)}`,
  
  exportToXLSX: `${BASE_PATH}/export/xlsx`,
  
  // ============= Vendor Routes =============
  vendor: {
    getAll: (params?: VendorPOListParams) => `${VENDOR_BASE_PATH}${buildQueryString(params)}`,
    getById: (poId: string) => `${VENDOR_BASE_PATH}/${poId}`,
    respond: (poId: string) => `${VENDOR_BASE_PATH}/${poId}/respond`,
    accept: (poId: string) => `${VENDOR_BASE_PATH}/${poId}/accept`,
    reject: (poId: string) => `${VENDOR_BASE_PATH}/${poId}/reject`,
    submitMilestoneCompletion: (poId: string, milestoneId: string) =>
      `${VENDOR_BASE_PATH}/${poId}/milestones/${milestoneId}/complete`,
    submitInvoice: (poId: string) => `${VENDOR_BASE_PATH}/${poId}/invoices`,
    updateDelivery: (poId: string) => `${VENDOR_BASE_PATH}/${poId}/delivery`,
    stats: `${VENDOR_BASE_PATH}/stats`,
    exportToPDF: (poId: string, options?: ExportPDFOptions) => 
      `${VENDOR_BASE_PATH}/${poId}/export/pdf${buildQueryString(options)}`,
  },
  
  // ============= Professional Routes =============
  professional: {
    getAll: (params?: VendorPOListParams) => `${PROFESSIONAL_BASE_PATH}${buildQueryString(params)}`,
    getById: (poId: string) => `${PROFESSIONAL_BASE_PATH}/${poId}`,
    respond: (poId: string) => `${PROFESSIONAL_BASE_PATH}/${poId}/respond`,
    accept: (poId: string) => `${PROFESSIONAL_BASE_PATH}/${poId}/accept`,
    reject: (poId: string) => `${PROFESSIONAL_BASE_PATH}/${poId}/reject`,
    submitMilestoneCompletion: (poId: string, milestoneId: string) =>
      `${PROFESSIONAL_BASE_PATH}/${poId}/milestones/${milestoneId}/complete`,
    submitInvoice: (poId: string) => `${PROFESSIONAL_BASE_PATH}/${poId}/invoices`,
    updateDelivery: (poId: string) => `${PROFESSIONAL_BASE_PATH}/${poId}/delivery`,
    stats: `${PROFESSIONAL_BASE_PATH}/stats`,
    exportToPDF: (poId: string, options?: ExportPDFOptions) => 
      `${PROFESSIONAL_BASE_PATH}/${poId}/export/pdf${buildQueryString(options)}`,
  },
};
