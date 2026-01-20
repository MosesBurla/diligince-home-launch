import { buildQueryString, API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/vendor/quotations`;

export const vendorQuotationsRoutes = {
  // Submit a new quotation
  submit: `${BASE_PATH}`,

  // Get vendor's submitted quotations
  getAll: (params?: {
    status?: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
    rfqId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => `${BASE_PATH}${buildQueryString(params)}`,

  // Get quotation details
  getById: (quotationId: string) => `${BASE_PATH}/${quotationId}`,

  // Update draft quotation
  update: (quotationId: string) => `${BASE_PATH}/${quotationId}`,

  // Delete draft quotation
  delete: (quotationId: string) => `${BASE_PATH}/${quotationId}`,

  // Withdraw submitted quotation
  withdraw: (quotationId: string) => `${BASE_PATH}/${quotationId}/withdraw`,

  // Upload quotation documents
  uploadDocument: (quotationId: string) => `${BASE_PATH}/${quotationId}/documents`,

  // Get quotation statistics
  stats: `${BASE_PATH}/stats`,
};
