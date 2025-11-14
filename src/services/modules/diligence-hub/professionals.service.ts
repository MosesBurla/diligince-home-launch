import apiService from '../../core/api.service';
import { DiliginceHubProfessionalsRoutes } from './professionals.routes';
import type { ProfessionalListResponse, ProfessionalSearchFilters, ProfessionalListItem } from '@/types/professional';

class DiliginceHubProfessionalsService {
  async searchProfessionals(filters?: ProfessionalSearchFilters): Promise<ProfessionalListResponse> {
    return apiService.get(DiliginceHubProfessionalsRoutes.search(filters));
  }

  async getProfessionalById(professionalId: string): Promise<ProfessionalListItem> {
    return apiService.get(DiliginceHubProfessionalsRoutes.getById(professionalId));
  }

  async getExpertiseAreas(): Promise<string[]> {
    return apiService.get(DiliginceHubProfessionalsRoutes.getExpertiseAreas());
  }

  async getSkills(): Promise<string[]> {
    return apiService.get(DiliginceHubProfessionalsRoutes.getSkills());
  }

  async getLocations(): Promise<string[]> {
    return apiService.get(DiliginceHubProfessionalsRoutes.getLocations());
  }
}

export const DiliginceHubProfessionalsService = new DiliginceHubProfessionalsService();
export default DiliginceHubProfessionalsService;
