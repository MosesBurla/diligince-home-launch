import apiService from '@/services/core/api.service';
import { vendorCertificationsRoutes } from './vendor-certifications.routes';
import type {
  VendorCertification,
  CreateCertificationRequest,
  UpdateCertificationRequest,
  CertificationsListResponse,
} from './vendor-certifications.types';

class VendorCertificationsService {
  async list(params?: { page?: number; limit?: number; status?: string }): Promise<CertificationsListResponse> {
    const response = await apiService.get<{ data: CertificationsListResponse }>(
      vendorCertificationsRoutes.list,
      { params }
    );
    return response.data;
  }

  async create(data: CreateCertificationRequest): Promise<VendorCertification> {
    const response = await apiService.post<{ data: VendorCertification }, CreateCertificationRequest>(
      vendorCertificationsRoutes.create,
      data
    );
    return response.data;
  }

  async update(id: string, data: UpdateCertificationRequest): Promise<VendorCertification> {
    const response = await apiService.put<{ data: VendorCertification }, UpdateCertificationRequest>(
      vendorCertificationsRoutes.update(id),
      data
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiService.remove(vendorCertificationsRoutes.delete(id));
  }

  async uploadDocument(id: string, file: File): Promise<VendorCertification> {
    const formData = new FormData();
    formData.append('document', file);
    const response = await apiService.post<{ data: VendorCertification }, FormData>(
      vendorCertificationsRoutes.uploadDocument(id),
      formData
    );
    return response.data;
  }

  async deleteDocument(id: string): Promise<void> {
    await apiService.remove(vendorCertificationsRoutes.deleteDocument(id));
  }
}

export const vendorCertificationsService = new VendorCertificationsService();
export default vendorCertificationsService;
