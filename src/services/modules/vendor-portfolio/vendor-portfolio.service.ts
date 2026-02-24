import apiService from '@/services/core/api.service';
import { vendorPortfolioRoutes } from './vendor-portfolio.routes';
import type {
  PortfolioProject,
  CreateProjectRequest,
  UpdateProjectRequest,
  PortfolioListResponse,
} from './vendor-portfolio.types';

class VendorPortfolioService {
  async list(params?: { page?: number; limit?: number; status?: string }): Promise<PortfolioListResponse> {
    const response = await apiService.get<{ data: PortfolioListResponse }>(
      vendorPortfolioRoutes.list,
      { params }
    );
    return response.data;
  }

  async create(data: CreateProjectRequest): Promise<PortfolioProject> {
    const response = await apiService.post<{ data: PortfolioProject }, CreateProjectRequest>(
      vendorPortfolioRoutes.create,
      data
    );
    return response.data;
  }

  async update(id: string, data: UpdateProjectRequest): Promise<PortfolioProject> {
    const response = await apiService.put<{ data: PortfolioProject }, UpdateProjectRequest>(
      vendorPortfolioRoutes.update(id),
      data
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiService.remove(vendorPortfolioRoutes.delete(id));
  }

  async uploadImage(id: string, file: File): Promise<PortfolioProject> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiService.post<{ data: PortfolioProject }, FormData>(
      vendorPortfolioRoutes.uploadImage(id),
      formData
    );
    return response.data;
  }

  async deleteImage(id: string): Promise<void> {
    await apiService.remove(vendorPortfolioRoutes.deleteImage(id));
  }
}

export const vendorPortfolioService = new VendorPortfolioService();
export default vendorPortfolioService;
