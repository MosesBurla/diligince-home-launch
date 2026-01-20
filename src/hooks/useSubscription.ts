/**
 * Subscription Hooks
 * 
 * React Query hooks for fetching subscription plans, add-ons, and GST configuration.
 * These hooks provide caching, loading states, and error handling out of the box.
 * 
 * @module useSubscription
 */

import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/services/modules/subscription';
import type { 
  UserType, 
  Plan, 
  AddOn, 
  GSTRate,
  PlansApiResponse,
  AddOnsApiResponse,
  GSTRateApiResponse,
} from '@/services/modules/subscription';

// ============= Query Keys =============

export const subscriptionKeys = {
  all: ['subscription'] as const,
  plans: () => [...subscriptionKeys.all, 'plans'] as const,
  plansByType: (userType: UserType) => [...subscriptionKeys.plans(), userType] as const,
  planByCode: (code: string) => [...subscriptionKeys.plans(), 'code', code] as const,
  addOns: () => [...subscriptionKeys.all, 'addons'] as const,
  addOnsByType: (userType: UserType) => [...subscriptionKeys.addOns(), userType] as const,
  gstRate: () => [...subscriptionKeys.all, 'gst-rate'] as const,
};

// ============= Hooks =============

/**
 * Hook to fetch all subscription plans
 * 
 * @param userType - Optional user type to filter plans
 * @returns Query result with plans data
 * 
 * @example
 * const { data, isLoading, error } = useSubscriptionPlans('industry');
 */
export const useSubscriptionPlans = (userType?: UserType) => {
  return useQuery({
    queryKey: userType 
      ? subscriptionKeys.plansByType(userType) 
      : subscriptionKeys.plans(),
    queryFn: () => subscriptionService.getPlans(userType ? { userType } : undefined),
    staleTime: 60 * 60 * 1000, // 1 hour (as per API cache guidelines)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    select: (response: PlansApiResponse) => {
      if (!response.success) return null;
      return userType ? response.data[userType] : response.data;
    },
  });
};

/**
 * Hook to fetch plans for a specific user type
 * 
 * @param userType - User type to fetch plans for
 * @returns Query result with array of plans
 * 
 * @example
 * const { data: plans, isLoading } = usePlansByUserType('industry');
 */
export const usePlansByUserType = (userType: UserType) => {
  return useQuery({
    queryKey: subscriptionKeys.plansByType(userType),
    queryFn: () => subscriptionService.getPlansByUserType(userType),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    enabled: !!userType,
  });
};

/**
 * Hook to fetch a specific plan by code
 * 
 * @param code - Plan code to fetch
 * @returns Query result with plan data
 * 
 * @example
 * const { data: plan, isLoading } = usePlanByCode('INDUSTRY_GROWTH');
 */
export const usePlanByCode = (code: string) => {
  return useQuery({
    queryKey: subscriptionKeys.planByCode(code),
    queryFn: () => subscriptionService.getPlanByCode(code),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    enabled: !!code,
    select: (response) => response.success ? response.data : null,
  });
};

/**
 * Hook to fetch all add-ons
 * 
 * @param userType - Optional user type to filter compatible add-ons
 * @returns Query result with add-ons data
 * 
 * @example
 * const { data: addOns, isLoading } = useAddOns('industry');
 */
export const useAddOns = (userType?: UserType) => {
  return useQuery({
    queryKey: userType 
      ? subscriptionKeys.addOnsByType(userType) 
      : subscriptionKeys.addOns(),
    queryFn: () => subscriptionService.getAddOns(userType ? { userType } : undefined),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    select: (response: AddOnsApiResponse) => response.success ? response.data : [],
  });
};

/**
 * Hook to fetch add-ons compatible with a user type
 * 
 * @param userType - User type to filter compatible add-ons
 * @returns Query result with array of compatible add-ons
 * 
 * @example
 * const { data: addOns, isLoading } = useAddOnsByUserType('industry');
 */
export const useAddOnsByUserType = (userType: UserType) => {
  return useQuery({
    queryKey: subscriptionKeys.addOnsByType(userType),
    queryFn: () => subscriptionService.getAddOnsByUserType(userType),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    enabled: !!userType,
  });
};

/**
 * Hook to fetch current GST rate
 * 
 * @returns Query result with GST rate data
 * 
 * @example
 * const { data: gstRate, isLoading } = useGSTRate();
 * console.log(`GST: ${gstRate?.rate}%`);
 */
export const useGSTRate = () => {
  return useQuery({
    queryKey: subscriptionKeys.gstRate(),
    queryFn: () => subscriptionService.getGSTRate(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (as per API cache guidelines)
    gcTime: 48 * 60 * 60 * 1000, // 48 hours
    select: (response: GSTRateApiResponse) => response.success ? response.data : null,
  });
};

/**
 * Combined hook to fetch plans and add-ons for a user type
 * Useful for pricing pages that need both datasets
 * 
 * @param userType - User type to fetch data for
 * @returns Object with plans and addOns query results
 * 
 * @example
 * const { plans, addOns, isLoading } = usePricingData('industry');
 */
export const usePricingData = (userType: UserType) => {
  const plansQuery = usePlansByUserType(userType);
  const addOnsQuery = useAddOnsByUserType(userType);
  const gstQuery = useGSTRate();

  return {
    plans: plansQuery.data || [],
    addOns: addOnsQuery.data || [],
    gstRate: gstQuery.data,
    isLoading: plansQuery.isLoading || addOnsQuery.isLoading || gstQuery.isLoading,
    isError: plansQuery.isError || addOnsQuery.isError || gstQuery.isError,
    error: plansQuery.error || addOnsQuery.error || gstQuery.error,
    refetch: () => {
      plansQuery.refetch();
      addOnsQuery.refetch();
      gstQuery.refetch();
    },
  };
};
