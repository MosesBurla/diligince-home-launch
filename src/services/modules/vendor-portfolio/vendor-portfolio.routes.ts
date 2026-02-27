import { API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/vendors/portfolio/projects`;

export const vendorPortfolioRoutes = {
  list: BASE_PATH,
  create: BASE_PATH,
  update: (id: string) => `${BASE_PATH}/${id}`,
  delete: (id: string) => `${BASE_PATH}/${id}`,
  uploadImage: (id: string) => `${BASE_PATH}/${id}/image`,
  deleteImage: (id: string) => `${BASE_PATH}/${id}/image`,
} as const;
