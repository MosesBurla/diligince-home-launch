// Hook for fetching master dropdown options

import { useQuery } from '@tanstack/react-query';
import { dropdownService } from '@/services/modules/dropdowns/dropdown.service';
import type { 
  DropdownModule, 
  DropdownCategory, 
  DropdownOption 
} from '@/services/modules/dropdowns/dropdown.types';

interface UseDropdownOptionsConfig {
  enabled?: boolean;
  parentCategory?: string;
  staleTime?: number;
}

export function useDropdownOptions(
  module: DropdownModule,
  category: DropdownCategory,
  config: UseDropdownOptionsConfig = {}
) {
  const { enabled = true, parentCategory, staleTime = 5 * 60 * 1000 } = config;

  const query = useQuery<DropdownOption[]>({
    queryKey: ['dropdown-options', module, category, parentCategory],
    queryFn: () => dropdownService.getOptions({ module, category, parentCategory }),
    enabled,
    staleTime,
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
