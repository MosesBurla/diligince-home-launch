// Hook for fetching specialization options based on multiple selected categories

import { useQuery } from '@tanstack/react-query';
import { dropdownService } from '@/services/modules/dropdowns/dropdown.service';
import type { DropdownOption } from '@/services/modules/dropdowns/dropdown.types';

// Map requirement categories to dropdown module names
const categoryToModuleMap: Record<string, string> = {
  'expert': 'expert',
  'service': 'serviceVendor',
  'product': 'productVendor',
  'logistics': 'logisticsVendor',
};

/**
 * Convert selected requirement categories to comma-separated module string
 * @param categories Array of selected categories (e.g., ['expert', 'product'])
 * @returns Comma-separated modules string (e.g., 'expert,productVendor')
 */
export const getModulesFromCategories = (categories: string[]): string => {
  return categories
    .map(cat => categoryToModuleMap[cat])
    .filter(Boolean)
    .join(',');
};

interface UseSpecializationOptionsConfig {
  enabled?: boolean;
  staleTime?: number;
}

/**
 * Hook to fetch specialization options for multiple selected categories
 * Makes API call: GET /api/v1/public/dropdown-options?module=expert,serviceVendor
 */
export function useSpecializationOptions(
  categories: string[] | undefined,
  config: UseSpecializationOptionsConfig = {}
) {
  const { enabled = true, staleTime = 5 * 60 * 1000 } = config;

  // Build comma-separated modules string
  const modules = getModulesFromCategories(categories || []);
  const hasCategories = !!categories && categories.length > 0;

  const query = useQuery<DropdownOption[]>({
    queryKey: ['specialization-options', modules],
    queryFn: () => dropdownService.getOptions({ 
      module: modules,
      // Category is omitted - backend defaults to 'specialization' for vendor modules
    }),
    enabled: enabled && hasCategories,
    staleTime,
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    modules, // Expose for debugging
  };
}
