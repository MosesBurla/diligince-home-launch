import { buildQueryString, API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/industry/dashboard`;

export const dashboardRoutes = {
  // Get dashboard statistics
  stats: `${BASE_PATH}/stats`,
  
  // Get procurement analytics
  analytics: `${API_BASE_PATH}/industry/analytics/procurement`,
  
  // Get budget overview
  budget: `${API_BASE_PATH}/industry/budget/overview`,
  
  // Get vendor performance rankings
  vendorPerformance: `${API_BASE_PATH}/industry/vendors/top-performers`,
  
  // Get pending approvals for current user
  pendingApprovals: `${API_BASE_PATH}/industry/approvals/pending`,
  
  // Get active requirements
  activeRequirements: `${API_BASE_PATH}/industry/requirements/active`,
  
  // Get active purchase orders
  activePurchaseOrders: `${API_BASE_PATH}/industry/purchase-orders/active`,
  
  // Legacy endpoint function
  getStats: (params?: { period?: string; startDate?: string; endDate?: string }) =>
    `${BASE_PATH}/stats${buildQueryString(params)}`,
  
  // Legacy endpoints (kept for backward compatibility)
  getAll: (queryParams: any) => 
    `${API_BASE_PATH}/get_service_requests?${buildQueryString(queryParams)}`,
  getById: (id: any) => `${API_BASE_PATH}/request/details/${id}`,
  create: `${API_BASE_PATH}/request/create`,
};
