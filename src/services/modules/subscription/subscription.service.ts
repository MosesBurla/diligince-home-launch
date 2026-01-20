/**
 * Subscription Service
 * 
 * Service for fetching subscription plans, add-ons, and GST configuration.
 * Provides methods to interact with the subscription plans API.
 * 
 * @module subscriptionService
 */

import apiService from '@/services/core/api.service';
import { subscriptionRoutes } from './subscription.routes';
import type {
  UserType,
  Plan,
  AddOn,
  GSTRate,
  PlansApiResponse,
  AddOnsApiResponse,
  GSTRateApiResponse,
  SinglePlanApiResponse,
  GetPlansParams,
  GetAddOnsParams,
  PlansByUserType,
} from './subscription.types';

// Re-export types for convenience
export type { 
  UserType, 
  Plan, 
  AddOn, 
  GSTRate, 
  PlansByUserType,
  PlansApiResponse,
  AddOnsApiResponse,
  GSTRateApiResponse,
};

/**
 * Subscription Service
 * 
 * Handles all subscription-related API calls including:
 * - Fetching subscription plans (all or by user type)
 * - Fetching add-ons (all or by user type compatibility)
 * - Fetching GST rate configuration
 * - Fetching individual plans by code
 */
export const subscriptionService = {
  /**
   * Fetch all subscription plans
   * 
   * @param params - Optional filters (userType, includeCustom)
   * @returns Promise with plans grouped by user type
   * 
   * @example
   * // Fetch all plans
   * const allPlans = await subscriptionService.getPlans();
   * 
   * // Fetch plans for industry users only
   * const industryPlans = await subscriptionService.getPlans({ userType: 'industry' });
   */
  getPlans: async (params?: GetPlansParams): Promise<PlansApiResponse> => {
    try {
      const response = await apiService.get<PlansApiResponse>(
        subscriptionRoutes.plans(params)
      );
      return response;
    } catch (error) {
      console.error('[SubscriptionService] Error fetching plans:', error);
      return {
        success: false,
        data: {},
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch subscription plans',
        },
      };
    }
  },

  /**
   * Fetch plans for a specific user type
   * 
   * @param userType - The user type to fetch plans for
   * @returns Promise with array of plans for that user type
   * 
   * @example
   * const plans = await subscriptionService.getPlansByUserType('industry');
   */
  getPlansByUserType: async (userType: UserType): Promise<Plan[]> => {
    const response = await subscriptionService.getPlans({ userType });
    if (response.success && response.data[userType]) {
      return response.data[userType] || [];
    }
    return [];
  },

  /**
   * Fetch a specific plan by its code
   * 
   * @param code - The unique plan code (e.g., 'INDUSTRY_GROWTH')
   * @returns Promise with the plan details
   * 
   * @example
   * const plan = await subscriptionService.getPlanByCode('INDUSTRY_GROWTH');
   */
  getPlanByCode: async (code: string): Promise<SinglePlanApiResponse> => {
    try {
      const response = await apiService.get<SinglePlanApiResponse>(
        subscriptionRoutes.planByCode(code)
      );
      return response;
    } catch (error) {
      console.error('[SubscriptionService] Error fetching plan:', error);
      return {
        success: false,
        data: {} as Plan,
        error: {
          code: 'PLAN_NOT_FOUND',
          message: `Plan with code "${code}" not found`,
          details: { planCode: code },
        },
      };
    }
  },

  /**
   * Fetch all available add-ons
   * 
   * @param params - Optional filters (userType for compatibility filter)
   * @returns Promise with array of add-ons
   * 
   * @example
   * // Fetch all add-ons
   * const addOns = await subscriptionService.getAddOns();
   * 
   * // Fetch add-ons compatible with industry users
   * const industryAddOns = await subscriptionService.getAddOns({ userType: 'industry' });
   */
  getAddOns: async (params?: GetAddOnsParams): Promise<AddOnsApiResponse> => {
    try {
      const response = await apiService.get<AddOnsApiResponse>(
        subscriptionRoutes.addOns(params)
      );
      return response;
    } catch (error) {
      console.error('[SubscriptionService] Error fetching add-ons:', error);
      return {
        success: false,
        data: [],
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch add-ons',
        },
      };
    }
  },

  /**
   * Fetch add-ons compatible with a specific user type
   * 
   * @param userType - The user type to filter compatible add-ons
   * @returns Promise with array of compatible add-ons
   * 
   * @example
   * const addOns = await subscriptionService.getAddOnsByUserType('industry');
   */
  getAddOnsByUserType: async (userType: UserType): Promise<AddOn[]> => {
    const response = await subscriptionService.getAddOns({ userType });
    if (response.success) {
      return response.data;
    }
    return [];
  },

  /**
   * Fetch current GST rate and configuration
   * 
   * @returns Promise with GST rate data
   * 
   * @example
   * const gst = await subscriptionService.getGSTRate();
   * console.log(`Current GST rate: ${gst.data.rate}%`);
   */
  getGSTRate: async (): Promise<GSTRateApiResponse> => {
    try {
      const response = await apiService.get<GSTRateApiResponse>(
        subscriptionRoutes.gstRate
      );
      return response;
    } catch (error) {
      console.error('[SubscriptionService] Error fetching GST rate:', error);
      // Return default GST rate as fallback
      return {
        success: true,
        data: {
          rate: 18,
          rateDecimal: 0.18,
          effectiveFrom: '2024-01-01',
          description: 'Goods and Services Tax applicable in India (fallback)',
        },
      };
    }
  },
};

export default subscriptionService;
