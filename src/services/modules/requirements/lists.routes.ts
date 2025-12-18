import { buildQueryString, API_BASE_PATH } from '../../core/api.config';

const BASE_PATH = `${API_BASE_PATH}/industry/requirements`;

export const requirementListsRoutes = {
  drafts: {
    list: (params?: any) => `${BASE_PATH}/drafts${buildQueryString(params)}`,
    bulkDelete: `${BASE_PATH}/drafts/bulk-delete`,
    export: {
      xlsx: (params?: any) => `${BASE_PATH}/drafts/export/xlsx${buildQueryString(params)}`,
      csv: (params?: any) => `${BASE_PATH}/drafts/export/csv${buildQueryString(params)}`,
    },
  },
  
  pending: {
    list: (params?: any) => `${BASE_PATH}/pending${buildQueryString(params)}`,
    getById: (id: string) => `${BASE_PATH}/${id}`,
    export: {
      xlsx: (params?: any) => `${BASE_PATH}/pending/export/xlsx${buildQueryString(params)}`,
      csv: (params?: any) => `${BASE_PATH}/pending/export/csv${buildQueryString(params)}`,
    },
  },
  
  approved: {
    list: (params?: any) => `${BASE_PATH}/approved${buildQueryString(params)}`,
    bulkPublish: `${BASE_PATH}/approved/bulk-publish`,
    export: {
      xlsx: (params?: any) => `${BASE_PATH}/approved/export/xlsx${buildQueryString(params)}`,
      csv: (params?: any) => `${BASE_PATH}/approved/export/csv${buildQueryString(params)}`,
    },
  },
  
  published: {
    list: (params?: any) => `${BASE_PATH}/published${buildQueryString(params)}`,
    export: {
      xlsx: (params?: any) => `${BASE_PATH}/published/export/xlsx${buildQueryString(params)}`,
      csv: (params?: any) => `${BASE_PATH}/published/export/csv${buildQueryString(params)}`,
    },
  },
  
  archived: {
    list: (params?: any) => `${BASE_PATH}/archived${buildQueryString(params)}`,
    bulkArchive: `${BASE_PATH}/archived/bulk-archive`,
    export: {
      xlsx: (params?: any) => `${BASE_PATH}/archived/export/xlsx${buildQueryString(params)}`,
      csv: (params?: any) => `${BASE_PATH}/archived/export/csv${buildQueryString(params)}`,
    },
  },
};
