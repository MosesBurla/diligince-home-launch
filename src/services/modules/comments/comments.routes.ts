import { buildQueryString, API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/industry/comments`;

export const commentsRoutes = {
  // CRUD operations
  create: `${BASE_PATH}`,
  getById: (commentId: string) => `${BASE_PATH}/${commentId}`,
  update: (commentId: string) => `${BASE_PATH}/${commentId}`,
  delete: (commentId: string) => `${BASE_PATH}/${commentId}`,
  
  // Requirement-specific comments
  getByRequirement: (requirementId: string, params?: any) => 
    `${BASE_PATH}/requirement/${requirementId}${buildQueryString(params)}`,
  
  // Approval-specific comments
  getApprovalComments: (requirementId: string, approvalStepId: string) => 
    `${BASE_PATH}/requirement/${requirementId}/approval/${approvalStepId}`,
  
  // Attachments
  uploadAttachment: (commentId: string) => 
    `${BASE_PATH}/${commentId}/attachments`,
  deleteAttachment: (commentId: string, attachmentId: string) => 
    `${BASE_PATH}/${commentId}/attachments/${attachmentId}`,
};
