/**
 * Industry Dashboard API Service
 *
 * Uses Promise.allSettled so a single endpoint failure never crashes the whole dashboard.
 * Each failed call logs a warning and falls back to a safe empty default.
 */

import apiService from '../../core/api.service';
import { dashboardRoutes } from './dashboard.routes';
import {
  DashboardStats,
  ProcurementAnalytics,
  BudgetOverview,
  VendorPerformance,
  ActiveRequirement,
  ActivePurchaseOrder,
  PendingApproval,
  DashboardResponse,
  PaginatedResponse,
  ApiFilters,
  DateRange,
} from '@/types/industry-dashboard';

// ─── Safe fallbacks ────────────────────────────────────────────────────────────

const EMPTY_STATS: DashboardStats = {
  totalProcurementSpend: 0,
  activePurchaseOrders: 0,
  budgetUtilization: 0,
  costSavings: 0,
  period: 'This Year',
};

const EMPTY_ANALYTICS: ProcurementAnalytics = {
  totalSpend: 0,
  categories: [],
  monthlyTrend: [],
};

const EMPTY_BUDGET: BudgetOverview = {
  totalAllocated: 0,
  totalSpent: 0,
  overallPercentage: 0,
  categories: [],
};

const emptyPaginated = <T>(): PaginatedResponse<T> => ({
  data: [],
  total: 0,
  page: 1,
  pageSize: 10,
  hasMore: false,
});

// ─── Helper: unwrap API envelope ───────────────────────────────────────────────

const unwrap = <T>(response: any, fallback: T): T => {
  if (response && response.success === true && response.data !== undefined) {
    return response.data as T;
  }
  // Some endpoints return data directly (array or object)
  if (response && typeof response === 'object' && !('success' in response)) {
    return response as T;
  }
  return fallback;
};

const unwrapPaginated = <T>(response: any): PaginatedResponse<T> => {
  if (response?.success === true) {
    const d = response.data;
    if (Array.isArray(d)) {
      return { data: d, total: d.length, page: 1, pageSize: d.length, hasMore: false };
    }
    if (d && Array.isArray(d.data)) return d as PaginatedResponse<T>;
  }
  if (Array.isArray(response)) {
    return { data: response, total: response.length, page: 1, pageSize: response.length, hasMore: false };
  }
  return emptyPaginated<T>();
};

// ─── Service ───────────────────────────────────────────────────────────────────

class IndustryDashboardService {

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiService.get<any>(dashboardRoutes.stats);
    return unwrap<DashboardStats>(response, EMPTY_STATS);
  }

  async getProcurementAnalytics(dateRange?: DateRange): Promise<ProcurementAnalytics> {
    const params = dateRange
      ? { startDate: dateRange.startDate, endDate: dateRange.endDate }
      : undefined;
    const response = await apiService.get<any>(dashboardRoutes.analytics, { params });
    return unwrap<ProcurementAnalytics>(response, EMPTY_ANALYTICS);
  }

  async getBudgetOverview(): Promise<BudgetOverview> {
    const response = await apiService.get<any>(dashboardRoutes.budget);
    return unwrap<BudgetOverview>(response, EMPTY_BUDGET);
  }

  async getVendorPerformance(limit = 5): Promise<VendorPerformance[]> {
    const response = await apiService.get<any>(dashboardRoutes.vendorPerformance, { params: { limit } });
    const data = unwrap<VendorPerformance[]>(response, []);
    return Array.isArray(data) ? data : [];
  }

  async getActiveRequirements(filters?: ApiFilters): Promise<PaginatedResponse<ActiveRequirement>> {
    const response = await apiService.get<any>(dashboardRoutes.activeRequirements, { params: filters });
    return unwrapPaginated<ActiveRequirement>(response);
  }

  async getActivePurchaseOrders(filters?: ApiFilters): Promise<PaginatedResponse<ActivePurchaseOrder>> {
    const response = await apiService.get<any>(dashboardRoutes.activePurchaseOrders, { params: filters });
    return unwrapPaginated<ActivePurchaseOrder>(response);
  }

  async getPendingApprovals(filters?: ApiFilters): Promise<PaginatedResponse<PendingApproval>> {
    const response = await apiService.get<any>(dashboardRoutes.pendingApprovals, { params: filters });
    return unwrapPaginated<PendingApproval>(response);
  }

  /**
   * Fetches all dashboard data with partial-failure resilience.
   * If one endpoint fails the rest still load; failed sections use empty defaults.
   */
  async getAllDashboardData(): Promise<DashboardResponse> {
    const [
      statsResult,
      analyticsResult,
      budgetResult,
      vendorsResult,
      requirementsResult,
      purchaseOrdersResult,
      pendingApprovalsResult,
    ] = await Promise.allSettled([
      this.getDashboardStats(),
      this.getProcurementAnalytics(),
      this.getBudgetOverview(),
      this.getVendorPerformance(5),
      this.getActiveRequirements({ limit: 10 }),
      this.getActivePurchaseOrders({ limit: 10 }),
      this.getPendingApprovals({ limit: 10 }),
    ]);

    const resolved = <T>(result: PromiseSettledResult<T>, fallback: T, label: string): T => {
      if (result.status === 'fulfilled') return result.value;
      console.warn(`⚠️ Dashboard [${label}] failed:`, (result as PromiseRejectedResult).reason?.message);
      return fallback;
    };

    const stats = resolved(statsResult, EMPTY_STATS, 'stats');
    const analytics = resolved(analyticsResult, EMPTY_ANALYTICS, 'analytics');
    const budget = resolved(budgetResult, EMPTY_BUDGET, 'budget');
    const vendors = resolved(vendorsResult, [], 'vendors');
    const requirements = resolved(requirementsResult, emptyPaginated<ActiveRequirement>(), 'requirements');
    const purchaseOrders = resolved(purchaseOrdersResult, emptyPaginated<ActivePurchaseOrder>(), 'purchaseOrders');
    const pendingApprovals = resolved(pendingApprovalsResult, emptyPaginated<PendingApproval>(), 'pendingApprovals');

    return {
      stats,
      analytics,
      budget,
      vendors,
      requirements: requirements.data,
      purchaseOrders: purchaseOrders.data,
      pendingApprovals: pendingApprovals.data,
    };
  }
}

export default new IndustryDashboardService();
