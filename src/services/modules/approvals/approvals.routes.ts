import { buildQueryString, API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/industry/requirements`;
const APPROVALS_BASE = `${API_BASE_PATH}/industry/approvals`;

export interface PendingListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  createdById?: string;
  category?: string;
  priority?: string;
  department?: string;
  approvalLevel?: number;
  search?: string;
}

export const approvalsRoutes = {
  // Pending list (with creator filter support)
  pending: {
    list: (params?: PendingListParams) => `${BASE_PATH}/pending${buildQueryString(params)}`,
    export: (format: 'csv' | 'xlsx') => `${BASE_PATH}/pending/export/${format}`,
  },
  
  // Approved list
  approved: {
    list: (params?: PendingListParams) => `${BASE_PATH}/approved${buildQueryString(params)}`,
    export: (format: 'csv' | 'xlsx') => `${BASE_PATH}/approved/export/${format}`,
  },
  
  // Published list
  published: {
    list: (params?: PendingListParams) => `${BASE_PATH}/published${buildQueryString(params)}`,
    export: (format: 'csv' | 'xlsx') => `${BASE_PATH}/published/export/${format}`,
  },
  
  // Approval actions on requirements
  approve: (requirementId: string) => `${BASE_PATH}/${requirementId}/approve`,
  reject: (requirementId: string) => `${BASE_PATH}/${requirementId}/reject`,
  resubmit: (requirementId: string) => `${BASE_PATH}/${requirementId}/resubmit`,
  publish: (requirementId: string) => `${BASE_PATH}/${requirementId}/publish`,
  emergencyPublish: (draftId: string) => `${BASE_PATH}/${draftId}/emergency-publish`,
  
  // Legacy routes for backward compatibility
  getPending: (params?: { 
    userId?: string; 
    role?: string; 
    priority?: string;
    category?: string;
    page?: number; 
    limit?: number 
  }) => `${APPROVALS_BASE}/pending${buildQueryString(params)}`,
  
  getById: (approvalId: string) => `${APPROVALS_BASE}/${approvalId}`,
  getHistory: (approvalId: string) => `${APPROVALS_BASE}/${approvalId}/history`,
  delegate: (approvalId: string) => `${APPROVALS_BASE}/${approvalId}/delegate`,
  escalate: (approvalId: string) => `${APPROVALS_BASE}/${approvalId}/escalate`,
};
