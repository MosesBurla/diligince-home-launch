import { API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/vendors/certifications`;

export const vendorCertificationsRoutes = {
  list: BASE_PATH,
  create: BASE_PATH,
  update: (id: string) => `${BASE_PATH}/${id}`,
  delete: (id: string) => `${BASE_PATH}/${id}`,
  uploadDocument: (id: string) => `${BASE_PATH}/${id}/document`,
  deleteDocument: (id: string) => `${BASE_PATH}/${id}/document`,
} as const;
