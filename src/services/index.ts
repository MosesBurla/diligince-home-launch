// ============= Core Services =============
export { apiService } from './core';
export { buildQueryString, generateQueryParams, API_BASE_PATH } from './core/api.config';

// ============= Modules (Alphabetical) =============
export * from './modules/analytics';
export * from './modules/approvals';
export * from './modules/auth';
export * from './modules/budget';
export * from './modules/company-profile';
export * from './modules/dashboard';
export * from './modules/pricing';
export * from './modules/purchase-orders';
export * from './modules/quotations';
export * from './modules/requirements';
export * from './modules/roles';
export * from './modules/approval-matrix';
export * from './modules/subscription';
export * from './modules/vendors';
export * from './modules/bank-account';
export * from './modules/user-account';
export * from './modules/vendor-profile';
export { vendorServicesService } from './modules/vendor-profile/vendor-services.service';

// ============= Convenience Aggregations =============
import { authRoutes } from './modules/auth';
import { dashboardRoutes } from './modules/dashboard';
import { approvalsRoutes } from './modules/approvals';
import { analyticsRoutes } from './modules/analytics';
import { budgetRoutes } from './modules/budget';
import { vendorsRoutes } from './modules/vendors';
import { requirementsRoutes, draftsRoutes, requirementListsRoutes } from './modules/requirements';
import { quotationsRoutes } from './modules/quotations';
import { purchaseOrdersRoutes } from './modules/purchase-orders';
import { subscriptionRoutes } from './modules/subscription';
import { pricingSelectionRoutes } from './modules/pricing';

/**
 * Aggregated routes object for backward compatibility
 * @deprecated Import from specific modules instead:
 * import { quotationsRoutes } from '@/services/modules/quotations';
 */
export const apiRoutes = {
  auth: authRoutes,
  subscription: subscriptionRoutes,
  pricing: pricingSelectionRoutes,
  industry: {
    dashboard: dashboardRoutes,
    approvals: approvalsRoutes,
    analytics: analyticsRoutes,
    budget: budgetRoutes,
    vendors: vendorsRoutes,
    requirements: {
      ...requirementsRoutes,
      draft: draftsRoutes,
      drafts: requirementListsRoutes.drafts,
      pending: requirementListsRoutes.pending,
      approved: requirementListsRoutes.approved,
      published: requirementListsRoutes.published,
      archived: requirementListsRoutes.archived,
    },
    quotations: quotationsRoutes,
    purchaseOrders: purchaseOrdersRoutes,
  },
};
