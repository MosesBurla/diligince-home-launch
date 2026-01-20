/**
 * Pricing Selection Hook
 * 
 * React hook for storing pricing selections after user signup.
 * Integrates with the PricingSelectionContext and API service.
 * 
 * @module usePricingSelectionStore
 */

import { useState, useCallback } from 'react';
import { 
  pricingSelectionService, 
  validateUserTypeMatch,
  createPricingSelectionPayload,
} from '@/services/modules/pricing';
import type { 
  StorePricingSelectionResponse, 
  StorePricingSelectionPayload 
} from '@/services/modules/pricing';
import type { UserType } from '@/services/modules/subscription';
import { usePricingSelection } from '@/contexts/PricingSelectionContext';
import { toast } from 'sonner';

interface UsePricingSelectionStoreReturn {
  storeSelection: (userId: string, signupTab: string, vendorCategory?: string) => Promise<StorePricingSelectionResponse>;
  isStoring: boolean;
  error: Error | null;
  clearError: () => void;
}

/**
 * Hook for storing pricing selections after successful signup
 * 
 * @returns Object with storeSelection function and loading/error states
 * 
 * @example
 * const { storeSelection, isStoring } = usePricingSelectionStore();
 * 
 * // After successful signup
 * const handleSignupSuccess = async (userId: string) => {
 *   await storeSelection(userId, 'industry');
 * };
 */
export const usePricingSelectionStore = (): UsePricingSelectionStoreReturn => {
  const [isStoring, setIsStoring] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { selection, clearSelection, hasValidSelection } = usePricingSelection();

  const storeSelection = useCallback(async (
    userId: string,
    signupTab: string,
    vendorCategory?: string
  ): Promise<StorePricingSelectionResponse> => {
    // Check if there's a valid selection to store
    if (!hasValidSelection || !selection?.selectedPlan || !selection?.userType) {
      console.log('[usePricingSelectionStore] No valid selection to store');
      return {
        success: false,
        error: {
          code: 'NO_SELECTION',
          message: 'No pricing selection to store',
        },
      };
    }
    // Validate user type match
    if (!validateUserTypeMatch(selection.userType as UserType, signupTab, vendorCategory)) {
      console.log('[usePricingSelectionStore] User type mismatch');
      clearSelection(); // Clear mismatched selection
      return {
        success: false,
        error: {
          code: 'USER_TYPE_MISMATCH',
          message: 'Pricing selection user type does not match signup',
        },
      };
    }

    setIsStoring(true);
    setError(null);

    try {
      // Prepare plan and add-ons data
      const plan = {
        code: selection.selectedPlan.code,
        price: selection.selectedPlan.price,
        priceRange: selection.selectedPlan.priceRange,
      };

      const addOns = (selection.selectedAddOns || []).map(addon => ({
        code: addon.code,
        type: addon.type,
        price: addon.price,
      }));

      // Store the selection via API
      const result = await pricingSelectionService.storeSelectionOnSignup(
        userId,
        signupTab,
        selection.userType as UserType,
        plan,
        addOns,
        vendorCategory
      );

      if (result.success) {
        toast.success('Your plan preferences have been saved!');
        clearSelection(); // Clear selection after successful storage
      } else {
        console.error('[usePricingSelectionStore] Storage failed:', result.error);
        // Don't show error toast for user type mismatch - it's expected behavior
        if (result.error?.code !== 'USER_TYPE_MISMATCH') {
          toast.error('Could not save your plan preferences');
        }
      }

      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('[usePricingSelectionStore] Error:', error);
      return {
        success: false,
        error: {
          code: 'STORAGE_ERROR',
          message: error.message || 'Failed to store pricing selection',
        },
      };
    } finally {
      setIsStoring(false);
    }
  }, [selection, hasValidSelection, clearSelection]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    storeSelection,
    isStoring,
    error,
    clearError,
  };
};

export default usePricingSelectionStore;
