// Vendor Approval Matrix API Routes

import { API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/vendor/approval-matrix`;

export const vendorApprovalMatrixRoutes = {
  // Main CRUD operations
  getMatrices: BASE_PATH,
  getMatrix: (matrixId: string) => `${BASE_PATH}/${matrixId}`,
  createMatrix: BASE_PATH,
  updateMatrix: (matrixId: string) => `${BASE_PATH}/${matrixId}`,
  deleteMatrix: (matrixId: string) => `${BASE_PATH}/${matrixId}`,
  
  // Status management
  toggleStatus: (matrixId: string) => `${BASE_PATH}/${matrixId}/status`,
  
  // Matrix operations
  duplicateMatrix: (matrixId: string) => `${BASE_PATH}/${matrixId}/duplicate`,
  exportMatrices: `${BASE_PATH}/export`,
  
  // Member management
  getAvailableMembers: `${API_BASE_PATH}/vendor/members/available`,
};
