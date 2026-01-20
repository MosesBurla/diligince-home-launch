/**
 * Subscription Purchase Hook
 * 
 * Manages the complete subscription purchase flow including
 * order creation, payment processing, and verification.
 */

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  subscriptionPurchaseService,
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyPaymentResponse,
  RazorpayPaymentResponse,
  RazorpayError,
  PurchaseStep,
} from '@/services/modules/subscription-purchase';
import { Plan, AddOn } from '@/services/modules/subscription';
import { useRazorpay } from './useRazorpay';

interface UsePurchaseFlowOptions {
  onSuccess?: (result: VerifyPaymentResponse['data']) => void;
  onError?: (error: string) => void;
  source?: CreateOrderPayload['source'];
}

interface UsePurchaseFlowReturn {
  // State
  step: PurchaseStep;
  isLoading: boolean;
  error: string | null;
  order: CreateOrderResponse['data'] | null;
  paymentResult: VerifyPaymentResponse['data'] | null;
  
  // Razorpay state
  isRazorpayLoaded: boolean;
  isLoadingRazorpay: boolean;
  
  // Actions
  startPurchase: (
    plan: Plan,
    addOns: AddOn[],
    selectedPrice?: number
  ) => Promise<void>;
  retryPayment: () => void;
  handlePaymentSuccess: (response: RazorpayPaymentResponse) => Promise<void>;
  handlePaymentFailure: (error: RazorpayError) => void;
  handlePaymentDismiss: () => void;
  reset: () => void;
}

export function useSubscriptionPurchase(
  options: UsePurchaseFlowOptions = {}
): UsePurchaseFlowReturn {
  const { onSuccess, onError, source = 'subscription_dashboard' } = options;
  
  const queryClient = useQueryClient();
  const { isLoaded: isRazorpayLoaded, isLoading: isLoadingRazorpay, loadScript, openCheckout } = useRazorpay();
  
  // State
  const [step, setStep] = useState<PurchaseStep>('review');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<CreateOrderResponse['data'] | null>(null);
  const [paymentResult, setPaymentResult] = useState<VerifyPaymentResponse['data'] | null>(null);
  
  // Store plan/addons for retry
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [currentAddOns, setCurrentAddOns] = useState<AddOn[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | undefined>();

  /**
   * Start the purchase flow
   */
  const startPurchase = useCallback(async (
    plan: Plan,
    addOns: AddOn[],
    selectedPrice?: number
  ) => {
    setError(null);
    setIsLoading(true);
    setCurrentPlan(plan);
    setCurrentAddOns(addOns);
    setCurrentPrice(selectedPrice);

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadScript();
      if (!loaded) {
        throw new Error('Failed to load payment gateway');
      }

      // 2. Create order
      const payload: CreateOrderPayload = {
        planCode: plan.code,
        selectedPrice: selectedPrice || (plan.price ?? undefined),
        addOnCodes: addOns.map(a => a.code),
        source,
      };

      const response = await subscriptionPurchaseService.createOrder(payload);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create order');
      }

      setOrder(response.data);
      setStep('payment');

      // 3. Open Razorpay checkout
      openCheckout(response.data, {
        onSuccess: handlePaymentSuccess,
        onFailure: handlePaymentFailure,
        onDismiss: handlePaymentDismiss,
      });

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to initiate payment';
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [loadScript, openCheckout, source, onError]);

  /**
   * Retry payment with existing order or create new one
   */
  const retryPayment = useCallback(() => {
    if (currentPlan) {
      startPurchase(currentPlan, currentAddOns, currentPrice);
    }
  }, [currentPlan, currentAddOns, currentPrice, startPurchase]);

  /**
   * Handle successful payment from Razorpay
   */
  const handlePaymentSuccess = useCallback(async (response: RazorpayPaymentResponse) => {
    setIsLoading(true);
    setError(null);

    try {
      const verifyResponse = await subscriptionPurchaseService.verifyPayment({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });

      if (!verifyResponse.success || !verifyResponse.data) {
        throw new Error(verifyResponse.error?.message || 'Payment verification failed');
      }

      setPaymentResult(verifyResponse.data);
      setStep('confirmation');

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-transactions'] });

      toast.success('Payment successful! Your subscription is now active.');
      onSuccess?.(verifyResponse.data);

    } catch (err: any) {
      const errorMessage = err.message || 'Payment verification failed';
      setError(errorMessage);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, onSuccess, onError]);

  /**
   * Handle payment failure from Razorpay
   */
  const handlePaymentFailure = useCallback((rzpError: RazorpayError) => {
    const errorMessage = rzpError.description || 'Payment failed. Please try again.';
    setError(errorMessage);
    onError?.(errorMessage);
    toast.error(errorMessage);
  }, [onError]);

  /**
   * Handle user dismissing the payment modal
   */
  const handlePaymentDismiss = useCallback(() => {
    setStep('review');
    toast.info('Payment cancelled. You can try again when ready.');
  }, []);

  /**
   * Reset the entire flow
   */
  const reset = useCallback(() => {
    setStep('review');
    setIsLoading(false);
    setError(null);
    setOrder(null);
    setPaymentResult(null);
    setCurrentPlan(null);
    setCurrentAddOns([]);
    setCurrentPrice(undefined);
  }, []);

  return {
    // State
    step,
    isLoading,
    error,
    order,
    paymentResult,
    
    // Razorpay state
    isRazorpayLoaded,
    isLoadingRazorpay,
    
    // Actions
    startPurchase,
    retryPayment,
    handlePaymentSuccess,
    handlePaymentFailure,
    handlePaymentDismiss,
    reset,
  };
}

export default useSubscriptionPurchase;
