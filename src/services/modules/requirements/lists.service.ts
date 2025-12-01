import apiService from '../../core/api.service';
import { requirementListsRoutes } from './lists.routes';
import { requirementsRoutes } from './requirements.routes';
import {
  RequirementListResponse,
  RequirementDetail,
} from "@/types/requirement-list";

export interface ListQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

class RequirementListService {
  // ============= Draft Requirements =============
  
  async getDrafts(params?: ListQueryParams): Promise<RequirementListResponse> {
    try {
      const url = requirementListsRoutes.drafts.list(params);
      const response = await apiService.get<any>(url);
      
      // Transform API response to match frontend expectations
      // Drafts API returns: { data: { drafts: [], pagination: {} } }
      return {
        success: response.success,
        data: {
          requirements: (response.data?.drafts || []).map((draft: any) => ({
            // Map draftId to id for table compatibility
            id: draft.draftId,
            draftId: draft.draftId, // Keep for backward compatibility
            
            // Map API field names to table expectations
            title: draft.title || 'Untitled Draft',
            category: draft.category || 'N/A',
            priority: draft.priority || 'medium',
            
            // Financial: estimatedBudget → estimatedValue
            estimatedValue: draft.estimatedBudget || 0,
            
            // Dates: lastSaved → lastModified
            lastModified: draft.lastSaved,
            createdDate: draft.lastSaved, // Use lastSaved as createdDate fallback
            
            // Draft-specific fields (pass through)
            currentStep: draft.currentStep,
            completedSteps: draft.completedSteps,
            progress: draft.progress,
            
            // Required by RequirementListItem interface
            status: 'draft' as const,
          })),
          pagination: {
            currentPage: response.data?.pagination?.page || 1,
            pageSize: response.data?.pagination?.limit || 10,
            totalItems: response.data?.pagination?.total || 0,
            totalPages: response.data?.pagination?.totalPages || 0,
          },
          filters: {
            applied: {},
            available: {}
          }
        }
      };
    } catch (error) {
      console.error("Failed to get drafts:", error);
      throw error;
    }
  }

  async deleteDrafts(draftIds: string[]): Promise<{ success: boolean; deleted: number }> {
    try {
      const response = await apiService.remove<{ success: boolean; deleted: number }>(
        requirementListsRoutes.drafts.bulkDelete,
        { data: { draftIds } }
      );
      return response;
    } catch (error) {
      console.error("Failed to delete drafts:", error);
      throw error;
    }
  }

  // ============= Pending Requirements =============
  
  async getPending(params?: ListQueryParams): Promise<RequirementListResponse> {
    try {
      const url = requirementListsRoutes.pending.list(params);
      const response = await apiService.get<any>(url);
      
      // Transform API response to match frontend expectations
      // Handle both nested and flat response structures
      let requirements: any[] = [];
      
      if (response.data) {
        if (Array.isArray(response.data.pending)) {
          requirements = response.data.pending;
        } else if (Array.isArray(response.data.requirements)) {
          requirements = response.data.requirements;
        } else if (Array.isArray(response.data)) {
          requirements = response.data;
        }
      }
      
      const paginationData = response.data?.pagination || response.pagination || {};
      
      return {
        success: response.success,
        data: {
          requirements,
          pagination: {
            currentPage: paginationData.page || 1,
            pageSize: paginationData.limit || 10,
            totalItems: paginationData.total || 0,
            totalPages: paginationData.totalPages || 0,
          },
          filters: {
            applied: {},
            available: {}
          }
        }
      };
    } catch (error) {
      console.error("Failed to get pending requirements:", error);
      // Return empty data structure on error instead of throwing
      return {
        success: false,
        data: {
          requirements: [],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
          },
          filters: {
            applied: {},
            available: {}
          }
        }
      };
    }
  }

  // ============= Approved Requirements =============
  
  async getApproved(params?: ListQueryParams): Promise<RequirementListResponse> {
    try {
      const url = requirementListsRoutes.approved.list(params);
      const response = await apiService.get<any>(url);
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Approved API Response:', {
          hasData: !!response.data,
          dataKeys: response.data ? Object.keys(response.data) : [],
          dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
        });
      }
      
      // Transform API response to match frontend expectations
      // Handle both nested and flat response structures
      let requirements: any[] = [];
      
      if (response.data) {
        if (Array.isArray(response.data.approved)) {
          requirements = response.data.approved;
        } else if (Array.isArray(response.data.requirements)) {
          requirements = response.data.requirements;
        } else if (Array.isArray(response.data)) {
          requirements = response.data;
        }
      }
      
      const paginationData = response.data?.pagination || response.pagination || {};
      
      return {
        success: response.success,
        data: {
          requirements,
          pagination: {
            currentPage: paginationData.page || 1,
            pageSize: paginationData.limit || 10,
            totalItems: paginationData.total || 0,
            totalPages: paginationData.totalPages || 0,
          },
          filters: {
            applied: {},
            available: {}
          }
        }
      };
    } catch (error) {
      console.error("Failed to get approved requirements:", error);
      // Return empty data structure on error instead of throwing
      return {
        success: false,
        data: {
          requirements: [],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
          },
          filters: {
            applied: {},
            available: {}
          }
        }
      };
    }
  }

  async publishApproved(requirementIds: string[]): Promise<{ success: boolean; published: number }> {
    try {
      const response = await apiService.post<{ success: boolean; published: number }, { requirementIds: string[] }>(
        requirementListsRoutes.approved.bulkPublish,
        { requirementIds }
      );
      return response;
    } catch (error) {
      console.error("Failed to publish requirements:", error);
      throw error;
    }
  }

  // ============= Published Requirements =============
  
  async getPublished(params?: ListQueryParams): Promise<RequirementListResponse> {
    try {
      const url = requirementListsRoutes.published.list(params);
      const response = await apiService.get<any>(url);
      
      // Transform API response to match frontend expectations
      // Handle both nested and flat response structures
      let requirements: any[] = [];
      
      if (response.data) {
        if (Array.isArray(response.data.published)) {
          requirements = response.data.published;
        } else if (Array.isArray(response.data.requirements)) {
          requirements = response.data.requirements;
        } else if (Array.isArray(response.data)) {
          requirements = response.data;
        }
      }
      
      const paginationData = response.data?.pagination || response.pagination || {};
      
      return {
        success: response.success,
        data: {
          requirements,
          pagination: {
            currentPage: paginationData.page || 1,
            pageSize: paginationData.limit || 10,
            totalItems: paginationData.total || 0,
            totalPages: paginationData.totalPages || 0,
          },
          filters: {
            applied: {},
            available: {}
          }
        }
      };
    } catch (error) {
      console.error("Failed to get published requirements:", error);
      // Return empty data structure on error instead of throwing
      return {
        success: false,
        data: {
          requirements: [],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
          },
          filters: {
            applied: {},
            available: {}
          }
        }
      };
    }
  }

  // ============= Archived Requirements =============
  
  async getArchived(params?: ListQueryParams): Promise<RequirementListResponse> {
    try {
      const url = requirementListsRoutes.archived.list(params);
      const response = await apiService.get<any>(url);
      
      // Transform API response to match frontend expectations
      // Handle both nested and flat response structures
      let requirements: any[] = [];
      
      if (response.data) {
        if (Array.isArray(response.data.archived)) {
          requirements = response.data.archived;
        } else if (Array.isArray(response.data.requirements)) {
          requirements = response.data.requirements;
        } else if (Array.isArray(response.data)) {
          requirements = response.data;
        }
      }
      
      const paginationData = response.data?.pagination || response.pagination || {};
      
      return {
        success: response.success,
        data: {
          requirements,
          pagination: {
            currentPage: paginationData.page || 1,
            pageSize: paginationData.limit || 10,
            totalItems: paginationData.total || 0,
            totalPages: paginationData.totalPages || 0,
          },
          filters: {
            applied: {},
            available: {}
          }
        }
      };
    } catch (error) {
      console.error("Failed to get archived requirements:", error);
      // Return empty data structure on error instead of throwing
      return {
        success: false,
        data: {
          requirements: [],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
          },
          filters: {
            applied: {},
            available: {}
          }
        }
      };
    }
  }

  async archiveRequirements(
    requirementIds: string[], 
    reason: string
  ): Promise<{ success: boolean; archived: number }> {
    try {
      const response = await apiService.post<{ success: boolean; archived: number }, { requirementIds: string[]; reason: string }>(
        requirementListsRoutes.archived.bulkArchive,
        { requirementIds, reason }
      );
      return response;
    } catch (error) {
      console.error("Failed to archive requirements:", error);
      throw error;
    }
  }

  // ============= Requirement Details =============
  
  async getRequirementById(requirementId: string): Promise<RequirementDetail> {
    try {
      const response = await apiService.get<{ success: boolean; data: RequirementDetail }>(
        requirementsRoutes.getById(requirementId)
      );
      
      // Validate response structure
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response structure from API');
      }
      
      // Check if it's an empty array (wrong response)
      if (Array.isArray(response.data)) {
        throw new Error('Requirement not found or invalid ID format. Use draft endpoint for draft requirements.');
      }
      
      return response.data;
    } catch (error) {
      console.error("Failed to get requirement detail:", error);
      throw error;
    }
  }

  // ============= Export Functions =============
  
  async exportToXLSX(type: 'drafts' | 'pending' | 'approved' | 'published' | 'archived', params?: ListQueryParams): Promise<Blob> {
    try {
      const url = requirementListsRoutes[type].export.xlsx(params);
      const response = await apiService.get<Blob>(url, { responseType: 'blob' });
      return response;
    } catch (error) {
      console.error("Failed to export XLSX:", error);
      throw error;
    }
  }

  async exportToCSV(type: 'drafts' | 'pending' | 'approved' | 'published' | 'archived', params?: ListQueryParams): Promise<Blob> {
    try {
      const url = requirementListsRoutes[type].export.csv(params);
      const response = await apiService.get<Blob>(url, { responseType: 'blob' });
      return response;
    } catch (error) {
      console.error("Failed to export CSV:", error);
      throw error;
    }
  }
}

export default new RequirementListService();
