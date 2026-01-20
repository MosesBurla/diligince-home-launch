/**
 * Purchase Flow Context
 * 
 * Provides state management for the subscription purchase flow.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Plan, AddOn } from '@/services/modules/subscription';
import { 
  CreateOrderResponse, 
  VerifyPaymentResponse,
  PurchaseStep,
} from '@/services/modules/subscription-purchase';

interface PurchaseFlowState {
  isOpen: boolean;
  step: PurchaseStep;
  selectedPlan: Plan | null;
  selectedAddOns: AddOn[];
  selectedPrice: number | null;
  order: CreateOrderResponse['data'] | null;
  paymentResult: VerifyPaymentResponse['data'] | null;
  error: string | null;
  isLoading: boolean;
}

interface PurchaseFlowContextValue extends PurchaseFlowState {
  openPurchaseFlow: (plan: Plan, addOns?: AddOn[], price?: number) => void;
  closePurchaseFlow: () => void;
  setStep: (step: PurchaseStep) => void;
  setSelectedPlan: (plan: Plan | null) => void;
  setSelectedAddOns: (addOns: AddOn[]) => void;
  setSelectedPrice: (price: number | null) => void;
  setOrder: (order: CreateOrderResponse['data'] | null) => void;
  setPaymentResult: (result: VerifyPaymentResponse['data'] | null) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  resetFlow: () => void;
}

const initialState: PurchaseFlowState = {
  isOpen: false,
  step: 'review',
  selectedPlan: null,
  selectedAddOns: [],
  selectedPrice: null,
  order: null,
  paymentResult: null,
  error: null,
  isLoading: false,
};

const PurchaseFlowContext = createContext<PurchaseFlowContextValue | null>(null);

export const PurchaseFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PurchaseFlowState>(initialState);

  const openPurchaseFlow = useCallback((plan: Plan, addOns: AddOn[] = [], price?: number) => {
    setState({
      ...initialState,
      isOpen: true,
      selectedPlan: plan,
      selectedAddOns: addOns,
      selectedPrice: price ?? plan.price,
    });
  }, []);

  const closePurchaseFlow = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const setStep = useCallback((step: PurchaseStep) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const setSelectedPlan = useCallback((plan: Plan | null) => {
    setState(prev => ({ ...prev, selectedPlan: plan }));
  }, []);

  const setSelectedAddOns = useCallback((addOns: AddOn[]) => {
    setState(prev => ({ ...prev, selectedAddOns: addOns }));
  }, []);

  const setSelectedPrice = useCallback((price: number | null) => {
    setState(prev => ({ ...prev, selectedPrice: price }));
  }, []);

  const setOrder = useCallback((order: CreateOrderResponse['data'] | null) => {
    setState(prev => ({ ...prev, order }));
  }, []);

  const setPaymentResult = useCallback((result: VerifyPaymentResponse['data'] | null) => {
    setState(prev => ({ ...prev, paymentResult: result }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const resetFlow = useCallback(() => {
    setState(initialState);
  }, []);

  const value: PurchaseFlowContextValue = {
    ...state,
    openPurchaseFlow,
    closePurchaseFlow,
    setStep,
    setSelectedPlan,
    setSelectedAddOns,
    setSelectedPrice,
    setOrder,
    setPaymentResult,
    setError,
    setIsLoading,
    resetFlow,
  };

  return (
    <PurchaseFlowContext.Provider value={value}>
      {children}
    </PurchaseFlowContext.Provider>
  );
};

export const usePurchaseFlow = (): PurchaseFlowContextValue => {
  const context = useContext(PurchaseFlowContext);
  if (!context) {
    throw new Error('usePurchaseFlow must be used within a PurchaseFlowProvider');
  }
  return context;
};

export default PurchaseFlowContext;
