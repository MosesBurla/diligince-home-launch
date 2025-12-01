import { API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/industry/company-profile`;

export const companyProfileRoutes = {
  // Get company profile
  get: BASE_PATH,
  
  // Save/Update company profile
  save: BASE_PATH,
  
  // Document management
  uploadDocument: `${BASE_PATH}/documents/upload`,
  deleteDocument: (documentId: string) => `${BASE_PATH}/documents/${documentId}`,
  
  // Verification
  submitVerification: `${BASE_PATH}/submit-verification`,
};
