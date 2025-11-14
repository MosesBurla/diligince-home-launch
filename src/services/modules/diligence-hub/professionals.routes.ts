import { buildQueryString, API_BASE_PATH } from '../../core/api.config';
import type { ProfessionalSearchFilters } from '@/types/professional';

const BASE_PATH = `${API_BASE_PATH}/industry/Diligince-hub/professionals`;

export const DiliginceHubProfessionalsRoutes = {
  search: (filters?: ProfessionalSearchFilters) => 
    `${BASE_PATH}/search${buildQueryString(filters)}`,
  
  getById: (professionalId: string) => 
    `${BASE_PATH}/${professionalId}`,
  
  getExpertiseAreas: () => 
    `${BASE_PATH}/expertise-areas`,
  
  getSkills: () => 
    `${BASE_PATH}/skills`,
  
  getLocations: () => 
    `${BASE_PATH}/locations`,
};
