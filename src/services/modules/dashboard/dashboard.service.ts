/**
 * Industry Dashboard API Service
 * 
 * Handles all API calls for Industry Dashboard
 * Documentation: docs/api/industry/industry-dashboard-api.md
 * 
 * Endpoints:
 * - Dashboard Statistics (KPIs)
 * - Pending Approvals
 * - Procurement Analytics (Spend by Category, Monthly Trends)
 * - Budget Overview & Utilization
 * - Vendor Performance Rankings
 * - Active Requirements List
 * - Purchase Orders (Active, Pending, Completed)
 */

import apiService from '../../core/api.service';
import { dashboardRoutes } from './dashboard.routes';
import {
  DashboardStats,
  DashboardStatsEnhanced,
  ProcurementAnalytics,
  BudgetOverview,
  VendorPerformance,
  ActiveRequirement,
  ActivePurchaseOrder,
  PendingApproval,
  ApiFilters,
  DateRange,
  DashboardResponse,
  PaginatedResponse
} from '@/types/industry-dashboard';
import { isEnhancedValue } from '@/types/api-common';

class IndustryDashboardService {
  /**
   * Get Dashboard Statistics (KPIs)
   * Endpoint: GET /api/industry/dashboard/stats
   * 
   * Handles both flat and enhanced API response formats
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiService.get<any>(
        dashboardRoutes.stats
      );
      
      console.log('📊 Dashboard Stats API Response:', response);
      
      // Check if response has enhanced format (nested objects with value/trend)
      if (response.totalProcurementSpend && isEnhancedValue(response.totalProcurementSpend)) {
        console.log('✅ Detected enhanced API format with trends');
        // Return as-is, components will extract values
        return {
          ...response,
          period: response.period || 'N/A'
        };
      }
      
      // Already flat format
      console.log('✅ Detected flat API format');
      return response;
      
    } catch (error) {
      console.error('❌ Failed to fetch dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get Procurement Analytics
   * Endpoint: GET /api/industry/dashboard/analytics
   * 
   * @param dateRange - Optional date range filter
   */
  async getProcurementAnalytics(dateRange?: DateRange): Promise<ProcurementAnalytics> {
    try {
      const params = dateRange ? {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      } : undefined;

      const response = await apiService.get<ProcurementAnalytics>(
        dashboardRoutes.analytics,
        { params }
      );
      console.log('📊 Analytics API Response:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch procurement analytics:', error);
      throw error;
    }
  }

  /**
   * Get Budget Overview & Utilization
   * Endpoint: GET /api/industry/dashboard/budget
   */
  async getBudgetOverview(): Promise<BudgetOverview> {
    try {
      const response = await apiService.get<BudgetOverview>(
        dashboardRoutes.budget
      );
      console.log('📊 Budget API Response:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch budget overview:', error);
      throw error;
    }
  }

  /**
   * Get Vendor Performance Rankings
   * Endpoint: GET /api/industry/dashboard/vendors/performance
   * 
   * @param limit - Number of top vendors to return (default: 5)
   */
  async getVendorPerformance(limit: number = 5): Promise<VendorPerformance[]> {
    try {
      const response = await apiService.get<VendorPerformance[]>(
        dashboardRoutes.vendorPerformance,
        { params: { limit } }
      );
      console.log('📊 Vendor Performance API Response:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch vendor performance:', error);
      throw error;
    }
  }

  /**
   * Get Active Requirements
   * Endpoint: GET /api/industry/requirements?status=active
   * 
   * @param filters - Optional filters (category, date range, etc.)
   */
  async getActiveRequirements(filters?: ApiFilters): Promise<PaginatedResponse<ActiveRequirement>> {
    try {
      return await apiService.get<PaginatedResponse<ActiveRequirement>>(
        dashboardRoutes.activeRequirements,
        { params: filters }
      );
    } catch (error) {
      console.error('❌ Failed to fetch active requirements:', error);
      throw error;
    }
  }

  /**
   * Get Active Purchase Orders
   * Endpoint: GET /api/industry/purchase-orders?status=active,in_progress
   * 
   * @param filters - Optional filters (status, date range, etc.)
   */
  async getActivePurchaseOrders(filters?: ApiFilters): Promise<PaginatedResponse<ActivePurchaseOrder>> {
    try {
      return await apiService.get<PaginatedResponse<ActivePurchaseOrder>>(
        dashboardRoutes.activePurchaseOrders,
        { params: filters }
      );
    } catch (error) {
      console.error('❌ Failed to fetch active purchase orders:', error);
      throw error;
    }
  }

  /**
   * Get Pending Approvals for Current User
   * Endpoint: GET /api/industry/approvals/pending
   * 
   * @param filters - Optional filters (priority, category, etc.)
   */
  async getPendingApprovals(filters?: ApiFilters): Promise<PaginatedResponse<PendingApproval>> {
    try {
      return await apiService.get<PaginatedResponse<PendingApproval>>(
        dashboardRoutes.pendingApprovals,
        { params: filters }
      );
    } catch (error) {
      console.error('❌ Failed to fetch pending approvals:', error);
      throw error;
    }
  }

  /**
   * Get All Dashboard Data in Single Request
   * Fetches all dashboard sections
   * 
   * NOTE: This is a convenience method that makes multiple API calls
   * Consider creating a dedicated backend endpoint for better performance
   */
  async getAllDashboardData(): Promise<DashboardResponse> {
    const [
      stats,
      analytics,
      budget,
      vendors,
      requirements,
      purchaseOrders,
      pendingApprovals
    ] = await Promise.all([
      this.getDashboardStats(),
      this.getProcurementAnalytics(),
      this.getBudgetOverview(),
      this.getVendorPerformance(5),
      this.getActiveRequirements({ limit: 10 }),
      this.getActivePurchaseOrders({ limit: 10 }),
      this.getPendingApprovals({ limit: 10 })
    ]);

    return {
      stats,
      analytics,
      budget,
      vendors,
      requirements: requirements.data,
      purchaseOrders: purchaseOrders.data,
      pendingApprovals: pendingApprovals.data
    };
  }
}

export default new IndustryDashboardService();
