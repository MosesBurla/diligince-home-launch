import apiService from '../../core/api.service';
import { DiliginceHubVendorsRoutes } from './vendors.routes';
import type { VendorListResponse, VendorSearchFilters, VendorListItem } from '@/types/vendor';

class DiliginceHubVendorsService {
  async searchVendors(filters?: VendorSearchFilters): Promise<VendorListResponse> {
    return apiService.get(DiliginceHubVendorsRoutes.search(filters));
  }

  async getVendorById(vendorId: string): Promise<VendorListItem> {
    return apiService.get(DiliginceHubVendorsRoutes.getById(vendorId));
  }

  async getSpecializations(): Promise<string[]> {
    return apiService.get(DiliginceHubVendorsRoutes.getSpecializations());
  }

  async getLocations(): Promise<string[]> {
    return apiService.get(DiliginceHubVendorsRoutes.getLocations());
  }
}

export const diliginceHubVendorsService = new DiliginceHubVendorsService();
export default diliginceHubVendorsService;
