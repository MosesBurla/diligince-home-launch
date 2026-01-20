import { apiService } from '@/services/core';

// ============= Types =============
export interface VendorService {
  id: string;
  name: string;
  description: string;
  pricingModel: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetVendorServicesResponse {
  success: boolean;
  data: VendorService[];
  message?: string;
}

export interface SaveVendorServiceResponse {
  success: boolean;
  data: VendorService;
  message?: string;
}

export interface DeleteVendorServiceResponse {
  success: boolean;
  message?: string;
}

// ============= API Routes =============
const VENDOR_SERVICES_ROUTES = {
  list: '/api/v1/vendor-profile/services',
  create: '/api/v1/vendor-profile/services',
  update: (id: string) => `/api/v1/vendor-profile/services/${id}`,
  delete: (id: string) => `/api/v1/vendor-profile/services/${id}`,
};

// ============= Service Class =============
class VendorServicesService {
  /**
   * Fetch all vendor services
   */
  async getServices(): Promise<VendorService[]> {
    try {
      const response = await apiService.get<GetVendorServicesResponse>(
        VENDOR_SERVICES_ROUTES.list
      );
      return response.data || [];
    } catch (error: any) {
      // Return empty array if no services exist yet (404)
      if (error?.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Create a new vendor service
   */
  async createService(service: Omit<VendorService, 'id' | 'createdAt' | 'updatedAt'>): Promise<SaveVendorServiceResponse> {
    const response = await apiService.post<SaveVendorServiceResponse, typeof service>(
      VENDOR_SERVICES_ROUTES.create,
      service
    );
    return response;
  }

  /**
   * Update an existing vendor service
   */
  async updateService(id: string, service: Partial<Omit<VendorService, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SaveVendorServiceResponse> {
    const response = await apiService.put<SaveVendorServiceResponse, typeof service>(
      VENDOR_SERVICES_ROUTES.update(id),
      service
    );
    return response;
  }

  /**
   * Delete a vendor service
   */
  async deleteService(id: string): Promise<DeleteVendorServiceResponse> {
    const response = await apiService.remove<DeleteVendorServiceResponse>(
      VENDOR_SERVICES_ROUTES.delete(id)
    );
    return response;
  }
}

// Export singleton instance
export const vendorServicesService = new VendorServicesService();
