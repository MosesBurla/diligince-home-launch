// Master Dropdowns API Service

import apiService from '@/services/core/api.service';
import type { 
  DropdownOption, 
  DropdownOptionsResponse, 
  GetDropdownOptionsParams 
} from './dropdown.types';

const DROPDOWN_ROUTES = {
  OPTIONS: '/api/v1/public/dropdown-options',
};

// Helper to build query string
const buildQueryString = (params: Record<string, string>): string => {
  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const dropdownService = {
  /**
   * Fetch dropdown options from API
   * Public endpoint - no authentication required
   */
  async getOptions(params: GetDropdownOptionsParams): Promise<DropdownOption[]> {
    const queryParams: Record<string, string> = {
      module: params.module, // Can be comma-separated: "expert,serviceVendor"
    };

    // Category is optional - backend defaults to 'specialization' when modules are vendor types
    if (params.category) {
      queryParams.category = params.category;
    }

    if (params.parentCategory) {
      queryParams.parentCategory = params.parentCategory;
    }

    if (params.search) {
      queryParams.search = params.search;
    }

    const queryString = buildQueryString(queryParams);
    const url = `${DROPDOWN_ROUTES.OPTIONS}${queryString}`;

    try {
      const response = await apiService.get<DropdownOptionsResponse>(url);
      
      if (response?.data?.options) {
        return response.data.options;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch dropdown options:', error);
      return [];
    }
  },
};
