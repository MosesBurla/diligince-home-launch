/**
 * Subscription Purchase Service
 * 
 * Handles subscription orders, payments, and subscription management.
 * 
 * @module subscriptionPurchase.service
 */

import { AxiosResponse } from 'axios';
import api from '@/services/api.service';
import { SUBSCRIPTION_PURCHASE_ROUTES } from './subscriptionPurchase.routes';
import {
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
  CancelSubscriptionPayload,
  CancelSubscriptionResponse,
  GetSubscriptionResponse,
  GetTransactionsResponse,
  SubscriptionOrder,
} from './subscriptionPurchase.types';

class SubscriptionPurchaseService {
  /**
   * Create a new subscription order
   * This calls the backend to create a Razorpay order
   */
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    console.log('[SubscriptionPurchase] Creating order:', payload);

    // api.post already returns the envelope {success, data, error}
    const response = await api.post<CreateOrderResponse, CreateOrderPayload>(
      SUBSCRIPTION_PURCHASE_ROUTES.CREATE_ORDER,
      payload
    );

    // The response is already the API envelope, return it directly
    return response as unknown as CreateOrderResponse;
  }

  /**
   * Verify payment after Razorpay checkout
   * Validates signature and activates subscription
   */
  async verifyPayment(payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> {
    console.log('[SubscriptionPurchase] Verifying payment:', payload.razorpayPaymentId);

    // api.post already returns the envelope {success, data, error}
    const response = await api.post<VerifyPaymentResponse, VerifyPaymentPayload>(
      SUBSCRIPTION_PURCHASE_ROUTES.VERIFY_PAYMENT,
      payload
    );

    // The response is already the API envelope, return it directly
    return response as unknown as VerifyPaymentResponse;
  }

  /**
   * Get current user's active subscription
   */
  async getSubscription(): Promise<GetSubscriptionResponse> {
    const response = await api.get<GetSubscriptionResponse>(
      SUBSCRIPTION_PURCHASE_ROUTES.GET_SUBSCRIPTION
    );

    return response as unknown as GetSubscriptionResponse;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(payload: CancelSubscriptionPayload): Promise<CancelSubscriptionResponse> {
    console.log('[SubscriptionPurchase] Cancelling subscription');

    const response = await api.post<CancelSubscriptionResponse, CancelSubscriptionPayload>(
      SUBSCRIPTION_PURCHASE_ROUTES.CANCEL_SUBSCRIPTION,
      payload
    );

    return response as unknown as CancelSubscriptionResponse;
  }

  /**
   * Get transaction history
   */
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<GetTransactionsResponse> {
    const response = await api.get<GetTransactionsResponse>(
      SUBSCRIPTION_PURCHASE_ROUTES.GET_TRANSACTIONS,
      { params }
    );

    return response as unknown as GetTransactionsResponse;
  }

  /**
   * Download invoice for a transaction
   */
  async downloadInvoice(transactionId: string): Promise<Blob> {
    const response: AxiosResponse<Blob> = await api.get(
      SUBSCRIPTION_PURCHASE_ROUTES.DOWNLOAD_INVOICE(transactionId),
      { responseType: 'blob' }
    );

    return response.data;
  }

  /**
   * Get order details by ID
   */
  async getOrder(orderId: string): Promise<{ success: boolean; data: SubscriptionOrder }> {
    const response = await api.get<{ success: boolean; data: SubscriptionOrder }>(
      SUBSCRIPTION_PURCHASE_ROUTES.GET_ORDER(orderId)
    );

    return response as unknown as { success: boolean; data: SubscriptionOrder };
  }

  /**
   * Calculate pricing breakdown
   */
  calculatePricing(
    planPrice: number,
    addOnPrices: number[],
    gstRate: number = 18
  ): {
    planAmount: number;
    addOnsAmount: number;
    subtotal: number;
    gstRate: number;
    gstAmount: number;
    totalAmount: number;
    totalAmountInPaise: number;
    currency: string;
  } {
    const planAmount = planPrice;
    const addOnsAmount = addOnPrices.reduce((sum, price) => sum + price, 0);
    const subtotal = planAmount + addOnsAmount;
    const gstAmount = Math.round(subtotal * gstRate / 100);
    const totalAmount = subtotal + gstAmount;
    const totalAmountInPaise = totalAmount * 100; // Razorpay uses paise

    return {
      planAmount,
      addOnsAmount,
      subtotal,
      gstRate,
      gstAmount,
      totalAmount,
      totalAmountInPaise,
      currency: 'INR',
    };
  }
}

export const subscriptionPurchaseService = new SubscriptionPurchaseService();
export default subscriptionPurchaseService;
