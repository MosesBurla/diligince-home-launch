import { buildQueryString, API_BASE_PATH } from '../../core/api.config';
import type { RFQBrowseFilters } from '@/types/rfq-browse';

const BASE_PATH = `${API_BASE_PATH}/vendors/rfqs`;

export const vendorRFQsRoutes = {
  // Browse available RFQs with full filter support
  browse: (params?: RFQBrowseFilters) => `${BASE_PATH}/browse${buildQueryString(params)}`,

  // Get RFQ details
  getById: (rfqId: string) => `${BASE_PATH}/${rfqId}`,

  // Get RFQs invited to (vendor received invitation)
  invited: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => `${BASE_PATH}/invited${buildQueryString(params)}`,

  // Get saved/bookmarked RFQs
  saved: `${BASE_PATH}/saved`,

  // Get applied RFQs (where vendor has submitted quotations)
  applied: (params?: RFQBrowseFilters) => `${BASE_PATH}/applied${buildQueryString(params)}`,

  // Save/Unsave RFQ
  save: (rfqId: string) => `${BASE_PATH}/${rfqId}/save`,

  // Get RFQ statistics for vendor dashboard
  stats: `${BASE_PATH}/stats`,
};
