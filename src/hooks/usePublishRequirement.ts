import { useState } from 'react';
import apiService from '@/services/core/api.service';
import { API_BASE_PATH } from '@/services/core/api.config';
import { toast } from 'sonner';

interface PublishPayload {
  requirementId: string;
  visibility?: 'all' | 'selected';
  selectedVendors?: string[];
  notifyByEmail?: boolean;
  notifyByApp?: boolean;
}

interface PublishResponse {
  success: boolean;
  data: {
    requirementId: string;
    status: 'published';
    vendorsNotified: number;
    publishedAt: string;
  };
}

export const usePublishRequirement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publishRequirement = async (payload: PublishPayload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.post<PublishResponse, object>(
        `${API_BASE_PATH}/industry/requirements/${payload.requirementId}/publish`,
        {
          visibility: payload.visibility,
          selectedVendors: payload.selectedVendors,
          notifyByEmail: payload.notifyByEmail,
          notifyByApp: payload.notifyByApp,
        }
      );
      
      toast.success(`Requirement published! ${response?.data?.vendorsNotified || 0} vendors notified.`);
      return response?.data || null;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to publish requirement';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { publishRequirement, isLoading, error };
};
