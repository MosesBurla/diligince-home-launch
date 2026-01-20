// Vendor Team Members API Routes

import { API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/vendor`;

export const vendorTeamRoutes = {
  // Roles endpoints
  getRoles: `${BASE_PATH}/roles`,
  
  // Team members endpoints
  getMembers: `${BASE_PATH}/members`,
  getMember: (memberId: string) => `${BASE_PATH}/members/${memberId}`,
  createMember: `${BASE_PATH}/members`,
  updateMember: (memberId: string) => `${BASE_PATH}/members/${memberId}`,
  updateMemberRole: (memberId: string) => `${BASE_PATH}/members/${memberId}/role`,
  updateMemberStatus: (memberId: string) => `${BASE_PATH}/members/${memberId}/status`,
  removeMember: (memberId: string) => `${BASE_PATH}/members/${memberId}`,
  resendVerification: (memberId: string) => `${BASE_PATH}/members/${memberId}/resend-verification`,
  
  // Bulk operations
  bulkAction: `${BASE_PATH}/members/bulk-action`,
  
  // Statistics and reporting
  getStatistics: `${BASE_PATH}/members/statistics`,
  exportMembers: `${BASE_PATH}/members/export`,
  
  // Available members for assignment
  getAvailableMembers: `${BASE_PATH}/members/available`,
};
