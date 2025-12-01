import api from '../../core/api.service';
import { approvalMatrixRoutes } from './approval-matrix.routes';
import {
  ApprovalMatrix,
  MatrixListResponse,
  MatrixResponse,
  CreateMatrixRequest,
  UpdateMatrixRequest,
  MatrixFilters,
  ToggleStatusRequest,
  DuplicateMatrixRequest,
  AvailableMembersResponse,
  MemberFilters,
} from './approval-matrix.types';

class ApprovalMatrixService {
  /**
   * Get all approval matrices with filters and pagination
   */
  async getMatrices(filters?: MatrixFilters): Promise<MatrixListResponse> {
    return await api.get<MatrixListResponse>(approvalMatrixRoutes.getMatrices, {
      params: filters,
    });
  }

  /**
   * Get a single approval matrix by ID
   */
  async getMatrixById(matrixId: string): Promise<MatrixResponse> {
    return await api.get<MatrixResponse>(approvalMatrixRoutes.getMatrix(matrixId));
  }

  /**
   * Create a new approval matrix
   */
  async createMatrix(data: CreateMatrixRequest): Promise<MatrixResponse> {
    return await api.post<MatrixResponse, CreateMatrixRequest>(
      approvalMatrixRoutes.createMatrix,
      data
    );
  }

  /**
   * Update an existing approval matrix
   */
  async updateMatrix(
    matrixId: string,
    data: UpdateMatrixRequest
  ): Promise<MatrixResponse> {
    return await api.put<MatrixResponse, UpdateMatrixRequest>(
      approvalMatrixRoutes.updateMatrix(matrixId),
      data
    );
  }

  /**
   * Delete an approval matrix
   */
  async deleteMatrix(
    matrixId: string,
    permanent: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    return await api.remove<{ success: boolean; message: string }>(
      approvalMatrixRoutes.deleteMatrix(matrixId),
      {
        params: { permanent },
      }
    );
  }

  /**
   * Toggle matrix status (active/inactive)
   */
  async toggleStatus(
    matrixId: string,
    data: ToggleStatusRequest
  ): Promise<MatrixResponse> {
    return await api.patch<MatrixResponse, ToggleStatusRequest>(
      approvalMatrixRoutes.toggleStatus(matrixId),
      data
    );
  }

  /**
   * Duplicate an approval matrix
   */
  async duplicateMatrix(
    matrixId: string,
    data: DuplicateMatrixRequest
  ): Promise<MatrixResponse> {
    return await api.post<MatrixResponse, DuplicateMatrixRequest>(
      approvalMatrixRoutes.duplicateMatrix(matrixId),
      data
    );
  }

  /**
   * Export approval matrices data
   */
  async exportMatrices(
    format: 'csv' | 'xlsx' | 'pdf' = 'csv',
    filters?: MatrixFilters
  ): Promise<Blob> {
    return await api.get<Blob>(approvalMatrixRoutes.exportMatrices, {
      params: { format, ...filters },
      responseType: 'blob',
    });
  }

  /**
   * Get available company members for assignment
   */
  async getAvailableMembers(filters?: MemberFilters): Promise<AvailableMembersResponse> {
    return await api.get<AvailableMembersResponse>(
      approvalMatrixRoutes.getAvailableMembers,
      {
        params: filters,
      }
    );
  }
}

export const approvalMatrixService = new ApprovalMatrixService();
