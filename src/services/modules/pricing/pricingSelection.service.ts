/**
 * Pricing Selection Service
 * 
 * This service handles storing user pricing selections when they complete registration.
 * The selection is only stored if the user type matches between pricing page and signup form.
 * 
 * @module pricingSelectionService
 */

import { API_BASE_PATH } from '@/services/core/api.config';
import apiService from '@/services/core/api.service';
import { calculatePricingBreakdown, GST_RATE } from '@/utils/pricingCalculations';
import type { UserType, Plan, AddOn } from '@/services/modules/subscription/subscription.types';

// ============= Types =============

export interface PricingBreakdown {
  planMonthlyMin: number;
  planMonthlyMax: number;
  addOnsMonthlyAmount: number;
  addOnsOneTimeAmount: number;
  gstRate: number;
  estimatedFirstMonthMin: number;
  estimatedFirstMonthMax: number;
  estimatedRecurringMin: number;
  estimatedRecurringMax: number;
}

export interface StorePricingSelectionPayload {
  userId: string;
  userType: UserType;
  selectedPlanCode: string;
  selectedAddOnCodes: string[];
  pricing: PricingBreakdown;
  source: 'pricing_page';
  capturedAt: string;
}

export interface StorePricingSelectionResponse {
  success: boolean;
  data?: {
    id: string;
    message: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface GetPricingSelectionResponse {
  success: boolean;
  data?: {
    id: string;
    userId: string;
    userType: UserType;
    selectedPlanCode: string;
    selectedAddOnCodes: string[];
    pricing: PricingBreakdown;
    source: string;
    capturedAt: string;
    createdAt: string;
    status: 'pending' | 'contacted' | 'converted' | 'expired';
    user?: {
      email: string;
      name: string;
      company?: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

// ============= Routes =============

export const pricingSelectionRoutes = {
  store: `${API_BASE_PATH}/pricing-selections`,
  getByUserId: (userId: string) => `${API_BASE_PATH}/pricing-selections/${userId}`,
  list: `${API_BASE_PATH}/pricing-selections`,
  updateStatus: (id: string) => `${API_BASE_PATH}/pricing-selections/${id}/status`,
};

// ============= Utilities =============

/**
 * Validates if the signup user type matches the pricing selection user type
 * 
 * @param pricingUserType - User type selected on pricing page
 * @param signupTab - Tab selected on signup page ('industry', 'vendor', 'professional')
 * @param vendorCategory - For vendor signups, the category ('service', 'product', 'logistics')
 * @returns boolean indicating if types match
 */
export const validateUserTypeMatch = (
  pricingUserType: UserType,
  signupTab: string,
  vendorCategory?: string
): boolean => {
  const mapping: Record<UserType, { tab: string; category?: string }> = {
    'industry': { tab: 'industry' },
    'service_vendor': { tab: 'vendor', category: 'service' },
    'product_vendor': { tab: 'vendor', category: 'product' },
    'logistics': { tab: 'vendor', category: 'logistics' },
    'professional': { tab: 'professional' },
  };

  const expected = mapping[pricingUserType];
  if (!expected) return false;

  if (signupTab !== expected.tab) return false;
  if (expected.category && vendorCategory && vendorCategory !== expected.category) return false;

  return true;
};

/**
 * Creates the payload for storing pricing selection
 * 
 * @param userId - The newly registered user's ID
 * @param userType - User type from pricing selection
 * @param plan - Selected plan object
 * @param addOns - Array of selected add-on objects
 * @returns Formatted payload for API
 */
export const createPricingSelectionPayload = (
  userId: string,
  userType: UserType,
  plan: { code: string; price?: number | null; priceRange?: { min: number; max: number } | null },
  addOns: Array<{ code: string; type: string; price: number }>
): StorePricingSelectionPayload => {
  // Calculate pricing breakdown
  const planPrice = plan.price || 0;
  const planMin = plan.priceRange?.min || planPrice;
  const planMax = plan.priceRange?.max || planPrice;

  const monthlyAddOns = addOns
    .filter(a => a.type === 'subscription')
    .reduce((sum, a) => sum + a.price, 0);

  const oneTimeAddOns = addOns
    .filter(a => a.type === 'usage')
    .reduce((sum, a) => sum + a.price, 0);

  const gstRate = GST_RATE;
  const gstMultiplier = 1 + gstRate;

  return {
    userId,
    userType,
    selectedPlanCode: plan.code,
    selectedAddOnCodes: addOns.map(a => a.code),
    pricing: {
      planMonthlyMin: planMin,
      planMonthlyMax: planMax,
      addOnsMonthlyAmount: monthlyAddOns,
      addOnsOneTimeAmount: oneTimeAddOns,
      gstRate: gstRate * 100,
      estimatedFirstMonthMin: Math.round((planMin + monthlyAddOns + oneTimeAddOns) * gstMultiplier),
      estimatedFirstMonthMax: Math.round((planMax + monthlyAddOns + oneTimeAddOns) * gstMultiplier),
      estimatedRecurringMin: Math.round((planMin + monthlyAddOns) * gstMultiplier),
      estimatedRecurringMax: Math.round((planMax + monthlyAddOns) * gstMultiplier),
    },
    source: 'pricing_page',
    capturedAt: new Date().toISOString(),
  };
};

// ============= Service =============

export const pricingSelectionService = {
  /**
   * Store the pricing selection for a newly registered user
   * 
   * @param payload - The pricing selection data to store
   * @returns Promise with the API response
   */
  storePricingSelection: async (
    payload: StorePricingSelectionPayload
  ): Promise<StorePricingSelectionResponse> => {
    try {
      const response = await apiService.post<StorePricingSelectionResponse, StorePricingSelectionPayload>(
        pricingSelectionRoutes.store,
        payload
      );
      return response;
    } catch (error) {
      console.error('[PricingSelection] Error storing selection:', error);
      return {
        success: false,
        error: {
          code: 'STORAGE_FAILED',
          message: 'Failed to store pricing selection',
        },
      };
    }
  },

  /**
   * Get pricing selection for a user (admin/support use)
   * 
   * @param userId - User ID to fetch selection for
   * @returns Promise with the user's pricing selection
   */
  getPricingSelection: async (userId: string): Promise<GetPricingSelectionResponse> => {
    try {
      const response = await apiService.get<GetPricingSelectionResponse>(
        pricingSelectionRoutes.getByUserId(userId)
      );
      return response;
    } catch (error) {
      console.error('[PricingSelection] Error fetching selection:', error);
      return {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch pricing selection',
        },
      };
    }
  },

  /**
   * Convenience method to store selection after successful signup
   * Only stores if user type matches between pricing page and signup form
   * 
   * @param userId - Newly registered user's ID
   * @param signupTab - Tab selected on signup ('industry', 'vendor', 'professional')
   * @param pricingUserType - User type from pricing page selection
   * @param plan - Selected plan object
   * @param addOns - Array of selected add-on objects
   * @param vendorCategory - For vendor signups, the category
   * @returns Promise with the API response
   */
  storeSelectionOnSignup: async (
    userId: string,
    signupTab: string,
    pricingUserType: UserType,
    plan: { code: string; price?: number | null; priceRange?: { min: number; max: number } | null },
    addOns: Array<{ code: string; type: string; price: number }>,
    vendorCategory?: string
  ): Promise<StorePricingSelectionResponse> => {
    // Validate user type match
    if (!validateUserTypeMatch(pricingUserType, signupTab, vendorCategory)) {
      console.log('[PricingSelection] User type mismatch, not storing selection');
      return {
        success: false,
        error: {
          code: 'USER_TYPE_MISMATCH',
          message: 'Pricing selection user type does not match signup user type',
          details: {
            pricingUserType,
            signupTab,
            vendorCategory,
          },
        },
      };
    }

    // Create and store payload
    const payload = createPricingSelectionPayload(userId, pricingUserType, plan, addOns);
    return pricingSelectionService.storePricingSelection(payload);
  },
};

export default pricingSelectionService;
