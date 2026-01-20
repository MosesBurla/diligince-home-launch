import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Plan, AddOn, UserType } from '@/data/pricingData';

export interface PricingSelection {
  userType: UserType;
  selectedPlan: Plan | null;
  selectedAddOns: AddOn[];
  source: 'pricing_page';
  timestamp: number;
}

interface PricingSelectionContextType {
  selection: PricingSelection | null;
  setSelectedPlan: (userType: UserType, plan: Plan | null) => void;
  toggleAddOn: (addOn: AddOn) => void;
  removeAddOn: (addOnCode: string) => void;
  clearSelection: () => void;
  isAddOnSelected: (addOnCode: string) => boolean;
  hasValidSelection: boolean;
}

const STORAGE_KEY = 'diligince_pricing_selection';
const EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

const PricingSelectionContext = createContext<PricingSelectionContextType | undefined>(undefined);

export const PricingSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selection, setSelection] = useState<PricingSelection | null>(() => {
    // Load from sessionStorage on init
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PricingSelection;
        // Check if expired
        if (Date.now() - parsed.timestamp < EXPIRY_MS) {
          return parsed;
        }
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error loading pricing selection:', e);
    }
    return null;
  });

  // Persist to sessionStorage on change
  useEffect(() => {
    if (selection) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [selection]);

  const setSelectedPlan = useCallback((userType: UserType, plan: Plan | null) => {
    setSelection(prev => {
      // If switching user type, clear add-ons
      const shouldClearAddOns = prev?.userType !== userType;
      return {
        userType,
        selectedPlan: plan,
        selectedAddOns: shouldClearAddOns ? [] : (prev?.selectedAddOns || []),
        source: 'pricing_page',
        timestamp: Date.now(),
      };
    });
  }, []);

  const toggleAddOn = useCallback((addOn: AddOn) => {
    setSelection(prev => {
      if (!prev) return prev;
      
      const isSelected = prev.selectedAddOns.some(a => a.code === addOn.code);
      const newAddOns = isSelected
        ? prev.selectedAddOns.filter(a => a.code !== addOn.code)
        : [...prev.selectedAddOns, addOn];
      
      return {
        ...prev,
        selectedAddOns: newAddOns,
        timestamp: Date.now(),
      };
    });
  }, []);

  const removeAddOn = useCallback((addOnCode: string) => {
    setSelection(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        selectedAddOns: prev.selectedAddOns.filter(a => a.code !== addOnCode),
        timestamp: Date.now(),
      };
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelection(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const isAddOnSelected = useCallback((addOnCode: string) => {
    return selection?.selectedAddOns.some(a => a.code === addOnCode) || false;
  }, [selection]);

  const hasValidSelection = Boolean(selection?.selectedPlan);

  return (
    <PricingSelectionContext.Provider
      value={{
        selection,
        setSelectedPlan,
        toggleAddOn,
        removeAddOn,
        clearSelection,
        isAddOnSelected,
        hasValidSelection,
      }}
    >
      {children}
    </PricingSelectionContext.Provider>
  );
};

export const usePricingSelection = () => {
  const context = useContext(PricingSelectionContext);
  if (!context) {
    throw new Error('usePricingSelection must be used within a PricingSelectionProvider');
  }
  return context;
};

export default PricingSelectionContext;
