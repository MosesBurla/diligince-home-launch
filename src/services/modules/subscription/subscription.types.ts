/**
 * Subscription Plans & Add-ons Types
 * 
 * Types for API responses and data structures related to subscription plans,
 * add-ons, and GST configuration.
 * 
 * @module subscription.types
 */

// ============= User Types =============

export type UserType = 'industry' | 'service_vendor' | 'product_vendor' | 'logistics' | 'professional';

// ============= Plan Types =============

export type PlanTier = 'free' | 'plus' | 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type CtaAction = 'signup' | 'subscribe' | 'contact';

export interface PriceRange {
  min: number;
  max: number;
}

export interface PlanFeatures {
  teamSize?: { min: number; max: number } | number;
  requirementsPerMonth?: { min: number; max: number } | number;
  rfqsPerMonth?: { min: number; max: number } | number;
  posPerMonth?: { min: number; max: number } | number;
  aiSearch?: 'basic' | 'advanced' | 'enterprise';
  botVersion?: 'helper' | 'v2' | 'v3' | 'custom';
  analytics?: 'basic' | 'advanced' | 'enterprise';
  [key: string]: any;
}

export interface Plan {
  code: string;
  name: string;
  tier: PlanTier;
  price: number | null;
  priceRange: PriceRange | null;
  currency: string;
  billingCycle: BillingCycle;
  description: string;
  shortDescription: string;
  highlights: string[];
  isPopular: boolean;
  isCustomPricing: boolean;
  ctaLabel: string;
  ctaAction: CtaAction;
  features?: PlanFeatures;
}

export interface PlansByUserType {
  industry?: Plan[];
  service_vendor?: Plan[];
  product_vendor?: Plan[];
  logistics?: Plan[];
  professional?: Plan[];
}

// ============= Add-on Types =============

export type AddOnType = 'subscription' | 'usage';

export interface AddOnLimits {
  credits?: number;
  validityDays?: number;
  [key: string]: any;
}

export interface AddOn {
  code: string;
  name: string;
  type: AddOnType;
  price: number;
  currency: string;
  billingCycle: BillingCycle | null;
  icon: string;
  description: string;
  shortDescription: string;
  featureList: string[];
  compatibleUserTypes: UserType[];
  limits: AddOnLimits | null;
}

// ============= GST Types =============

export interface GSTRate {
  rate: number;
  rateDecimal: number;
  effectiveFrom: string;
  description?: string;
}

// ============= API Response Types =============

export interface PlansApiResponse {
  success: boolean;
  data: PlansByUserType;
  metadata?: {
    lastUpdated: string;
    version: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AddOnsApiResponse {
  success: boolean;
  data: AddOn[];
  error?: {
    code: string;
    message: string;
  };
}

export interface GSTRateApiResponse {
  success: boolean;
  data: GSTRate;
  error?: {
    code: string;
    message: string;
  };
}

export interface SinglePlanApiResponse {
  success: boolean;
  data: Plan;
  error?: {
    code: string;
    message: string;
    details?: {
      planCode?: string;
    };
  };
}

// ============= Query Parameters =============

export interface GetPlansParams {
  userType?: UserType;
  includeCustom?: boolean;
}

export interface GetAddOnsParams {
  userType?: UserType;
}
