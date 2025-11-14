import { buildQueryString, API_BASE_PATH } from '../../core/api.config';
import type { VendorSearchFilters } from '@/types/vendor';

const BASE_PATH = `${API_BASE_PATH}/industry/Diligince-hub/vendors`;

export const DiliginceHubVendorsRoutes = {
  search: (filters?: VendorSearchFilters) => 
    `${BASE_PATH}/search${buildQueryString(filters)}`,
  
  getById: (vendorId: string) => 
    `${BASE_PATH}/${vendorId}`,
  
  getSpecializations: () => 
    `${BASE_PATH}/specializations`,
  
  getLocations: () => 
    `${BASE_PATH}/locations`,
};
