import { Plan, AddOn } from '@/data/pricingData';

export const GST_RATE = 0.18; // 18%

export interface PriceValue {
  min: number;
  max: number;
  isRange: boolean;
}

export interface PricingBreakdown {
  planMonthly: PriceValue;
  addOnsMonthly: number;
  addOnsOneTime: number;
  subtotalMonthly: PriceValue;
  subtotalOneTime: number;
  gstMonthly: PriceValue;
  gstOneTime: number;
  firstMonthTotal: PriceValue;
  recurringMonthly: PriceValue;
  hasSelection: boolean;
}

/**
 * Get the price value from a plan (handles both fixed and range prices)
 */
export const getPlanPrice = (plan: Plan | null): PriceValue => {
  if (!plan) {
    return { min: 0, max: 0, isRange: false };
  }
  
  if (plan.isCustomPricing) {
    return { min: 0, max: 0, isRange: false };
  }
  
  if (plan.priceRange) {
    return { min: plan.priceRange.min, max: plan.priceRange.max, isRange: true };
  }
  
  const price = plan.price || 0;
  return { min: price, max: price, isRange: false };
};

/**
 * Calculate monthly add-ons total (subscription type)
 */
export const calculateMonthlyAddOns = (addOns: AddOn[]): number => {
  return addOns
    .filter(a => a.type === 'subscription')
    .reduce((sum, a) => sum + a.price, 0);
};

/**
 * Calculate one-time add-ons total (usage type)
 */
export const calculateOneTimeAddOns = (addOns: AddOn[]): number => {
  return addOns
    .filter(a => a.type === 'usage')
    .reduce((sum, a) => sum + a.price, 0);
};

/**
 * Apply GST to a price value
 */
export const applyGST = (price: PriceValue): PriceValue => ({
  min: Math.round(price.min * GST_RATE),
  max: Math.round(price.max * GST_RATE),
  isRange: price.isRange,
});

/**
 * Add a fixed amount to a price value
 */
export const addToPrice = (price: PriceValue, amount: number): PriceValue => ({
  min: price.min + amount,
  max: price.max + amount,
  isRange: price.isRange,
});

/**
 * Calculate complete pricing breakdown
 */
export const calculatePricingBreakdown = (
  plan: Plan | null,
  selectedAddOns: AddOn[]
): PricingBreakdown => {
  const planMonthly = getPlanPrice(plan);
  const addOnsMonthly = calculateMonthlyAddOns(selectedAddOns);
  const addOnsOneTime = calculateOneTimeAddOns(selectedAddOns);
  
  // Monthly subtotal = plan + monthly add-ons
  const subtotalMonthly: PriceValue = {
    min: planMonthly.min + addOnsMonthly,
    max: planMonthly.max + addOnsMonthly,
    isRange: planMonthly.isRange,
  };
  
  // GST on monthly
  const gstMonthly = applyGST(subtotalMonthly);
  
  // GST on one-time
  const gstOneTime = Math.round(addOnsOneTime * GST_RATE);
  
  // First month total = monthly subtotal + monthly GST + one-time + one-time GST
  const firstMonthTotal: PriceValue = {
    min: subtotalMonthly.min + gstMonthly.min + addOnsOneTime + gstOneTime,
    max: subtotalMonthly.max + gstMonthly.max + addOnsOneTime + gstOneTime,
    isRange: planMonthly.isRange,
  };
  
  // Recurring monthly = monthly subtotal + monthly GST (no one-time)
  const recurringMonthly: PriceValue = {
    min: subtotalMonthly.min + gstMonthly.min,
    max: subtotalMonthly.max + gstMonthly.max,
    isRange: planMonthly.isRange,
  };
  
  return {
    planMonthly,
    addOnsMonthly,
    addOnsOneTime,
    subtotalMonthly,
    subtotalOneTime: addOnsOneTime,
    gstMonthly,
    gstOneTime,
    firstMonthTotal,
    recurringMonthly,
    hasSelection: Boolean(plan),
  };
};

/**
 * Format price value for display
 */
export const formatPriceValue = (price: PriceValue, showZero = false): string => {
  if (price.min === 0 && price.max === 0 && !showZero) {
    return '—';
  }
  
  const formatNum = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  
  if (price.isRange && price.min !== price.max) {
    return `${formatNum(price.min)} - ${formatNum(price.max)}`;
  }
  
  return formatNum(price.min);
};

/**
 * Format a simple number as currency
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};
