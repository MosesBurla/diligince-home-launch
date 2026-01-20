import api from '../../core/api.service';
import { vendorApprovalMatrixRoutes } from './vendor-approval-matrix.routes';
import {
  VendorApprovalMatrix,
  VendorMatrixListResponse,
  VendorMatrixResponse,
  CreateVendorMatrixRequest,
  UpdateVendorMatrixRequest,
  VendorMatrixFilters,
  VendorToggleStatusRequest,
  VendorDuplicateMatrixRequest,
  VendorAvailableMembersResponse,
  VendorMemberFilters,
} from './vendor-approval-matrix.types';

class VendorApprovalMatrixService {
  /**
   * Get all vendor approval matrices with filters and pagination
   */
  async getMatrices(filters?: VendorMatrixFilters): Promise<VendorMatrixListResponse> {
    return await api.get<VendorMatrixListResponse>(vendorApprovalMatrixRoutes.getMatrices, {
      params: filters,
    });
  }

  /**
   * Get a single vendor approval matrix by ID
   */
  async getMatrixById(matrixId: string): Promise<VendorMatrixResponse> {
    return await api.get<VendorMatrixResponse>(vendorApprovalMatrixRoutes.getMatrix(matrixId));
  }

  /**
   * Create a new vendor approval matrix
   */
  async createMatrix(data: CreateVendorMatrixRequest): Promise<VendorMatrixResponse> {
    return await api.post<VendorMatrixResponse, CreateVendorMatrixRequest>(
      vendorApprovalMatrixRoutes.createMatrix,
      data
    );
  }

  /**
   * Update an existing vendor approval matrix
   */
  async updateMatrix(
    matrixId: string,
    data: UpdateVendorMatrixRequest
  ): Promise<VendorMatrixResponse> {
    return await api.put<VendorMatrixResponse, UpdateVendorMatrixRequest>(
      vendorApprovalMatrixRoutes.updateMatrix(matrixId),
      data
    );
  }

  /**
   * Delete a vendor approval matrix
   */
  async deleteMatrix(
    matrixId: string,
    permanent: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    return await api.remove<{ success: boolean; message: string }>(
      vendorApprovalMatrixRoutes.deleteMatrix(matrixId),
      {
        params: { permanent },
      }
    );
  }

  /**
   * Toggle vendor matrix status (active/inactive)
   */
  async toggleStatus(
    matrixId: string,
    data: VendorToggleStatusRequest
  ): Promise<VendorMatrixResponse> {
    return await api.patch<VendorMatrixResponse, VendorToggleStatusRequest>(
      vendorApprovalMatrixRoutes.toggleStatus(matrixId),
      data
    );
  }

  /**
   * Duplicate a vendor approval matrix
   */
  async duplicateMatrix(
    matrixId: string,
    data: VendorDuplicateMatrixRequest
  ): Promise<VendorMatrixResponse> {
    return await api.post<VendorMatrixResponse, VendorDuplicateMatrixRequest>(
      vendorApprovalMatrixRoutes.duplicateMatrix(matrixId),
      data
    );
  }

  /**
   * Export vendor approval matrices data
   */
  async exportMatrices(
    format: 'csv' | 'xlsx' | 'pdf' = 'csv',
    filters?: VendorMatrixFilters
  ): Promise<Blob> {
    return await api.get<Blob>(vendorApprovalMatrixRoutes.exportMatrices, {
      params: { format, ...filters },
      responseType: 'blob',
    });
  }

  /**
   * Get available vendor members for assignment
   */
  async getAvailableMembers(filters?: VendorMemberFilters): Promise<VendorAvailableMembersResponse> {
    return await api.get<VendorAvailableMembersResponse>(
      vendorApprovalMatrixRoutes.getAvailableMembers,
      {
        params: filters,
      }
    );
  }
}

export const vendorApprovalMatrixService = new VendorApprovalMatrixService();
