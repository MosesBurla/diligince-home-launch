/**
 * Razorpay SDK Hook
 * 
 * Handles loading the Razorpay SDK and initiating payments.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  RazorpayOptions,
  RazorpayPaymentResponse,
  RazorpayError,
  CreateOrderResponse,
} from '@/services/modules/subscription-purchase';

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (error: RazorpayError) => void) => void;
      close: () => void;
    };
  }
}

interface UseRazorpayReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  loadScript: () => Promise<boolean>;
  openCheckout: (
    orderData: CreateOrderResponse['data'],
    callbacks: {
      onSuccess: (response: RazorpayPaymentResponse) => void;
      onFailure: (error: RazorpayError) => void;
      onDismiss: () => void;
    }
  ) => void;
}

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const RAZORPAY_THEME_COLOR = '#153b60'; // Primary brand color

export function useRazorpay(): UseRazorpayReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already loaded on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setIsLoaded(true);
    }
  }, []);

  /**
   * Load Razorpay SDK script dynamically
   */
  const loadScript = useCallback(async (): Promise<boolean> => {
    // Already loaded
    if (typeof window !== 'undefined' && window.Razorpay) {
      setIsLoaded(true);
      return true;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          setIsLoaded(true);
          setIsLoading(false);
          resolve(true);
        });
        return;
      }

      const script = document.createElement('script');
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;

      script.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
        resolve(true);
      };

      script.onerror = () => {
        setError('Failed to load payment gateway. Please check your connection.');
        setIsLoading(false);
        resolve(false);
      };

      document.body.appendChild(script);
    });
  }, []);

  /**
   * Open Razorpay checkout modal
   */
  const openCheckout = useCallback(
    (
      orderData: CreateOrderResponse['data'],
      callbacks: {
        onSuccess: (response: RazorpayPaymentResponse) => void;
        onFailure: (error: RazorpayError) => void;
        onDismiss: () => void;
      }
    ) => {
      if (!window.Razorpay) {
        setError('Payment gateway not loaded');
        return;
      }

      const options: RazorpayOptions = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Diligince',
        description: 'Subscription Payment',
        order_id: orderData.razorpayOrderId,
        prefill: orderData.prefill,
        notes: orderData.notes,
        theme: {
          color: RAZORPAY_THEME_COLOR,
        },
        modal: {
          ondismiss: callbacks.onDismiss,
          escape: true,
          animation: true,
        },
        handler: callbacks.onSuccess,
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', callbacks.onFailure);
      
      rzp.open();
    },
    []
  );

  return {
    isLoaded,
    isLoading,
    error,
    loadScript,
    openCheckout,
  };
}

export default useRazorpay;
