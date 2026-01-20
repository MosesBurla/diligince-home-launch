// Mock Subscription Data for Development

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending' | 'trial';
export type TransactionStatus = 'success' | 'pending' | 'failed';
export type PaymentMethodType = 'card' | 'upi' | 'netbanking' | 'wallet';

export interface ActiveAddOn {
  code: string;
  name: string;
  price: number;
  billingCycle?: string;
  expiresAt?: string;
  creditsRemaining?: number;
  creditsTotal?: number;
  type: 'subscription' | 'usage';
}

export interface CurrentSubscription {
  id: string;
  userId: string;
  planCode: string;
  planName: string;
  tier: 'free' | 'plus' | 'pro' | 'enterprise';
  status: SubscriptionStatus;
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  amount: number;
  currency: string;
  addOns: ActiveAddOn[];
  features: string[];
  createdAt: string;
  cancelledAt?: string;
}

export interface TransactionBreakdown {
  planAmount: number;
  addOnsAmount: number;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  addOnsDetails?: Array<{ name: string; amount: number }>;
}

export interface PaymentMethod {
  type: PaymentMethodType;
  brand?: string;
  last4?: string;
  upiId?: string;
  bankName?: string;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  date: string;
  planCode: string;
  planName: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  expiryDate?: string;
  addOnsCount: number;
  breakdown: TransactionBreakdown;
  paymentMethod: PaymentMethod;
  razorpayId?: string;
  failureReason?: string;
  refundStatus?: 'none' | 'partial' | 'full';
  refundAmount?: number;
  invoiceUrl?: string;
}

// Current subscription mock data
export const mockCurrentSubscription: CurrentSubscription = {
  id: 'sub_001',
  userId: 'user_001',
  planCode: 'INDUSTRY_GROWTH',
  planName: 'Growth Plan',
  tier: 'pro',
  status: 'active',
  billingCycle: 'monthly',
  currentPeriodStart: '2026-01-15',
  currentPeriodEnd: '2026-02-14',
  nextBillingDate: '2026-02-15',
  amount: 12000,
  currency: 'INR',
  createdAt: '2025-06-15',
  addOns: [
    {
      code: 'DILIGIENCE_HUB',
      name: 'Diligince Hub',
      price: 999,
      billingCycle: 'monthly',
      expiresAt: '2026-02-15',
      type: 'subscription'
    },
    {
      code: 'AI_RECOMMENDATION_PACK',
      name: 'AI Recommendation Pack',
      price: 499,
      creditsRemaining: 15,
      creditsTotal: 20,
      type: 'usage'
    }
  ],
  features: [
    'Team of 10-25 members',
    '50-100 requirements/month',
    '150-300 RFQs/month',
    '50-100 POs/month',
    'Advanced AI search',
    'Bot V2 included',
    'Advanced analytics'
  ]
};

// Transactions mock data
export const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    transactionNumber: 'TXN-2026-001-15',
    date: '2026-01-15T10:30:00Z',
    planCode: 'INDUSTRY_GROWTH',
    planName: 'Growth Plan',
    amount: 15928,
    currency: 'INR',
    status: 'success',
    expiryDate: '2026-02-15',
    addOnsCount: 2,
    breakdown: {
      planAmount: 12000,
      addOnsAmount: 1498,
      subtotal: 13498,
      gstRate: 18,
      gstAmount: 2430,
      total: 15928,
      addOnsDetails: [
        { name: 'Diligince Hub', amount: 999 },
        { name: 'AI Recommendation Pack', amount: 499 }
      ]
    },
    paymentMethod: {
      type: 'card',
      brand: 'VISA',
      last4: '4242'
    },
    razorpayId: 'rzp_txn_abc123xyz',
    invoiceUrl: '/invoices/TXN-2026-001-15.pdf'
  },
  {
    id: 'txn_002',
    transactionNumber: 'TXN-2025-012-15',
    date: '2025-12-15T14:20:00Z',
    planCode: 'INDUSTRY_GROWTH',
    planName: 'Growth Plan',
    amount: 15339,
    currency: 'INR',
    status: 'success',
    expiryDate: '2026-01-15',
    addOnsCount: 2,
    breakdown: {
      planAmount: 12000,
      addOnsAmount: 999,
      subtotal: 12999,
      gstRate: 18,
      gstAmount: 2340,
      total: 15339,
      addOnsDetails: [
        { name: 'Diligince Hub', amount: 999 }
      ]
    },
    paymentMethod: {
      type: 'upi',
      upiId: 'user@paytm'
    },
    razorpayId: 'rzp_txn_def456uvw'
  },
  {
    id: 'txn_003',
    transactionNumber: 'TXN-2025-011-15',
    date: '2025-11-15T09:45:00Z',
    planCode: 'INDUSTRY_STARTER',
    planName: 'Starter Plan',
    amount: 4719,
    currency: 'INR',
    status: 'success',
    expiryDate: '2025-12-15',
    addOnsCount: 0,
    breakdown: {
      planAmount: 3999,
      addOnsAmount: 0,
      subtotal: 3999,
      gstRate: 18,
      gstAmount: 720,
      total: 4719
    },
    paymentMethod: {
      type: 'netbanking',
      bankName: 'HDFC Bank'
    },
    razorpayId: 'rzp_txn_ghi789rst'
  },
  {
    id: 'txn_004',
    transactionNumber: 'TXN-2025-011-01',
    date: '2025-11-01T16:10:00Z',
    planCode: 'AI_RECOMMENDATION_PACK',
    planName: 'AI Recommendation Pack',
    amount: 589,
    currency: 'INR',
    status: 'pending',
    addOnsCount: 0,
    breakdown: {
      planAmount: 0,
      addOnsAmount: 499,
      subtotal: 499,
      gstRate: 18,
      gstAmount: 90,
      total: 589
    },
    paymentMethod: {
      type: 'wallet',
    },
    razorpayId: 'rzp_txn_jkl012mno'
  },
  {
    id: 'txn_005',
    transactionNumber: 'TXN-2025-010-15',
    date: '2025-10-15T11:30:00Z',
    planCode: 'INDUSTRY_STARTER',
    planName: 'Starter Plan',
    amount: 4719,
    currency: 'INR',
    status: 'failed',
    addOnsCount: 0,
    breakdown: {
      planAmount: 3999,
      addOnsAmount: 0,
      subtotal: 3999,
      gstRate: 18,
      gstAmount: 720,
      total: 4719
    },
    paymentMethod: {
      type: 'card',
      brand: 'Mastercard',
      last4: '8888'
    },
    razorpayId: 'rzp_txn_pqr345stu',
    failureReason: 'Insufficient funds'
  },
  {
    id: 'txn_006',
    transactionNumber: 'TXN-2025-009-15',
    date: '2025-09-15T08:00:00Z',
    planCode: 'INDUSTRY_STARTER',
    planName: 'Starter Plan',
    amount: 4719,
    currency: 'INR',
    status: 'success',
    expiryDate: '2025-10-15',
    addOnsCount: 0,
    breakdown: {
      planAmount: 3999,
      addOnsAmount: 0,
      subtotal: 3999,
      gstRate: 18,
      gstAmount: 720,
      total: 4719
    },
    paymentMethod: {
      type: 'card',
      brand: 'VISA',
      last4: '4242'
    },
    razorpayId: 'rzp_txn_vwx678yza'
  },
  {
    id: 'txn_007',
    transactionNumber: 'TXN-2025-008-15',
    date: '2025-08-15T12:15:00Z',
    planCode: 'INDUSTRY_STARTER',
    planName: 'Starter Plan',
    amount: 4719,
    currency: 'INR',
    status: 'success',
    expiryDate: '2025-09-15',
    addOnsCount: 0,
    breakdown: {
      planAmount: 3999,
      addOnsAmount: 0,
      subtotal: 3999,
      gstRate: 18,
      gstAmount: 720,
      total: 4719
    },
    paymentMethod: {
      type: 'upi',
      upiId: 'user@okicici'
    },
    razorpayId: 'rzp_txn_bcd901efg'
  },
  {
    id: 'txn_008',
    transactionNumber: 'TXN-2025-007-10',
    date: '2025-07-10T15:45:00Z',
    planCode: 'DILIGIENCE_HUB',
    planName: 'Diligince Hub Add-on',
    amount: 1179,
    currency: 'INR',
    status: 'success',
    expiryDate: '2025-08-10',
    addOnsCount: 1,
    breakdown: {
      planAmount: 0,
      addOnsAmount: 999,
      subtotal: 999,
      gstRate: 18,
      gstAmount: 180,
      total: 1179
    },
    paymentMethod: {
      type: 'card',
      brand: 'VISA',
      last4: '4242'
    },
    razorpayId: 'rzp_txn_hij234klm'
  }
];

// Helper functions
export const getTransactionsByStatus = (status: TransactionStatus): Transaction[] => {
  return mockTransactions.filter(t => t.status === status);
};

export const getTransactionsByPlan = (planCode: string): Transaction[] => {
  return mockTransactions.filter(t => t.planCode === planCode);
};

export const getTransactionById = (id: string): Transaction | undefined => {
  return mockTransactions.find(t => t.id === id || t.transactionNumber === id);
};

export const getUniquePlansFromTransactions = (): string[] => {
  const plans = [...new Set(mockTransactions.map(t => t.planName))];
  return plans;
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
};
