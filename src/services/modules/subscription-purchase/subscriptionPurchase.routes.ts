/**
 * Subscription Purchase API Routes
 * 
 * @module subscriptionPurchase.routes
 */

const API_BASE = '/api/v1/subscription';

export const SUBSCRIPTION_PURCHASE_ROUTES = {
  // Order Management
  CREATE_ORDER: `${API_BASE}/orders`,
  GET_ORDER: (orderId: string) => `${API_BASE}/orders/${orderId}`,
  
  // Payment
  VERIFY_PAYMENT: `${API_BASE}/payments/verify`,
  
  // Subscription Management
  GET_SUBSCRIPTION: `${API_BASE}/current`,
  CANCEL_SUBSCRIPTION: `${API_BASE}/cancel`,
  
  // Transactions
  GET_TRANSACTIONS: `${API_BASE}/transactions`,
  GET_TRANSACTION: (transactionId: string) => `${API_BASE}/transactions/${transactionId}`,
  DOWNLOAD_INVOICE: (transactionId: string) => `${API_BASE}/transactions/${transactionId}/invoice`,
} as const;
