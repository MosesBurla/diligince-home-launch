import { apiService } from '@/services/core';
import { requirementsFeedRoutes } from './requirements-feed.routes';
import {
  RequirementWithAI,
  BrowseFilters,
  RequirementListResponse,
  RequirementsFeedStats
} from '@/types/requirement-feed';


class RequirementsFeedService {
  /**
   * Get requirements visible to vendor/professional
   */
  async getBrowseRequirements(filters?: BrowseFilters): Promise<RequirementListResponse> {
    const url = requirementsFeedRoutes.browse(filters);
    const response = await apiService.get<any>(url);

    // If API returns specific structure, return it, otherwise simpler mock fallback if endpoint not ready
    // But since directive is "full API integration", we assume endpoint exists or will exist.
    // We map response to expected format
    return {
      requirements: response.data?.requirements || response.data?.items || [],
      total: response.data?.pagination?.total || 0,
      page: response.data?.pagination?.page || 1,
      limit: response.data?.pagination?.limit || 20,
      hasMore: (response.data?.pagination?.page || 1) < (response.data?.pagination?.totalPages || 0),
    };
  }

  /**
   * Get AI-recommended requirements
   */
  async getRecommendedRequirements(userType: string): Promise<RequirementWithAI[]> {
    const url = requirementsFeedRoutes.recommended(userType);
    const response = await apiService.get<any>(url);
    return response.data || [];
  }

  /**
   * Get requirement details
   */
  async getRequirementDetails(requirementId: string): Promise<RequirementWithAI> {
    const url = requirementsFeedRoutes.getById(requirementId);
    const response = await apiService.get<any>(url);
    return response.data;
  }

  /**
   * Get dashboard statistics
   */
  async getStats(userType: string): Promise<RequirementsFeedStats> {
    const url = requirementsFeedRoutes.stats(userType);
    const response = await apiService.get<any>(url);
    return response.data;
  }
}

export const requirementsFeedService = new RequirementsFeedService();
export default requirementsFeedService;
