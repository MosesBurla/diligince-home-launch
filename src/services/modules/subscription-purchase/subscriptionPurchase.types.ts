/**
 * Subscription Purchase Types
 * 
 * Types for subscription purchase flow including orders, payments,
 * and subscription management.
 * 
 * @module subscriptionPurchase.types
 */

import { Plan, AddOn, UserType, BillingCycle } from '../subscription/subscription.types';

// ============= Order Types =============

export type OrderStatus = 'created' | 'attempted' | 'paid' | 'failed' | 'expired' | 'refunded';
export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';

export interface OrderPlan {
  code: string;
  name: string;
  tier: string;
  price: number;
  priceRange?: {
    min: number;
    max: number;
  };
  billingCycle: BillingCycle;
  selectedPrice: number;
}

export interface OrderAddOn {
  code: string;
  name: string;
  type: 'subscription' | 'usage';
  price: number;
}

export interface PricingBreakdown {
  planAmount: number;
  addOnsAmount: number;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number; // In paise for Razorpay
  currency: string;
}

export interface PaymentDetails {
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  method?: PaymentMethod;
  bank?: string;
  wallet?: string;
  vpa?: string;
  cardNetwork?: string;
  cardLast4?: string;
  capturedAt?: string;
  failureReason?: string;
}

export interface SubscriptionOrder {
  id: string;
  orderId: string;
  razorpayOrderId: string;
  companyId: string;
  userId: string;
  userType: UserType;
  plan: OrderPlan;
  addOns: OrderAddOn[];
  pricing: PricingBreakdown;
  status: OrderStatus;
  payment?: PaymentDetails;
  source: 'pricing_page' | 'subscription_dashboard' | 'upgrade';
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

// ============= Subscription Types =============

export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'expired' | 'suspended';

export interface SubscriptionBilling {
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  amount: number;
  currency: string;
}

export interface ActiveAddOn {
  code: string;
  name: string;
  type: 'subscription' | 'usage';
  price: number;
  credits?: number;
  creditsUsed?: number;
  activatedAt: string;
  expiresAt?: string;
}

export interface CancellationDetails {
  requestedAt: string;
  requestedBy: string;
  reason: string;
  effectiveDate: string;
  refundAmount?: number;
  refundStatus?: 'pending' | 'processed' | 'failed' | 'not_applicable';
}

export interface Subscription {
  id: string;
  subscriptionId: string;
  companyId: string;
  userId: string;
  userType: UserType;
  plan: OrderPlan;
  addOns: ActiveAddOn[];
  billing: SubscriptionBilling;
  status: SubscriptionStatus;
  cancellation?: CancellationDetails;
  createdAt: string;
  updatedAt: string;
  activatedAt: string;
  expiresAt?: string;
}

// ============= Transaction Types =============

export type TransactionType = 'purchase' | 'renewal' | 'upgrade' | 'refund' | 'addon';
export type TransactionStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface TransactionItem {
  type: 'plan' | 'addon';
  code: string;
  name: string;
  amount: number;
}

export interface SubscriptionTransaction {
  id: string;
  transactionId: string;
  subscriptionId: string;
  orderId: string;
  companyId: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  gstAmount: number;
  netAmount: number;
  gateway: string;
  gatewayTransactionId: string;
  gatewayOrderId: string;
  items: TransactionItem[];
  createdAt: string;
  completedAt?: string;
  metadata?: {
    invoiceId?: string;
    receiptUrl?: string;
    refundReason?: string;
  };
}

// ============= API Request Types =============

export interface CreateOrderPayload {
  planCode: string;
  selectedPrice?: number;
  addOnCodes?: string[];
  source: 'pricing_page' | 'subscription_dashboard' | 'upgrade';
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface CancelSubscriptionPayload {
  reason: string;
  feedback?: string;
  immediateCancel?: boolean;
}

// ============= API Response Types =============

export interface CreateOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    razorpayKeyId: string;
    prefill: {
      name: string;
      email: string;
      contact?: string;
    };
    notes: Record<string, string>;
    expiresAt: string;
  };
  error?: {
    code: string;
    message: string;
    data?: {
      orderId?: string;
    };
  };
}

export interface VerifyPaymentResponse {
  success: boolean;
  data: {
    subscriptionId: string;
    status: SubscriptionStatus;
    plan: {
      code: string;
      name: string;
    };
    billing: {
      nextBillingDate: string;
      amount: number;
    };
    transaction: {
      transactionId: string;
      receiptUrl?: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface CancelSubscriptionResponse {
  success: boolean;
  data: {
    subscriptionId: string;
    status: SubscriptionStatus;
    effectiveDate: string;
    refund: {
      eligible: boolean;
      amount?: number;
      reason: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface GetSubscriptionResponse {
  success: boolean;
  data: Subscription | null;
  error?: {
    code: string;
    message: string;
  };
}

export interface GetTransactionsResponse {
  success: boolean;
  data: {
    transactions: SubscriptionTransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

// ============= Razorpay Types =============

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: {
    order_id?: string;
    payment_id?: string;
  };
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    animation?: boolean;
  };
  handler: (response: RazorpayPaymentResponse) => void;
}

// ============= Purchase Flow Types =============

export type PurchaseStep = 'review' | 'payment' | 'confirmation';

export interface PurchaseFlowState {
  step: PurchaseStep;
  selectedPlan: Plan | null;
  selectedAddOns: AddOn[];
  selectedPrice: number | null;
  order: CreateOrderResponse['data'] | null;
  paymentResult: VerifyPaymentResponse['data'] | null;
  error: string | null;
  isLoading: boolean;
}

export interface PurchaseFlowActions {
  setStep: (step: PurchaseStep) => void;
  setSelectedPlan: (plan: Plan | null) => void;
  setSelectedAddOns: (addOns: AddOn[]) => void;
  setSelectedPrice: (price: number | null) => void;
  createOrder: () => Promise<void>;
  verifyPayment: (response: RazorpayPaymentResponse) => Promise<void>;
  resetFlow: () => void;
}
