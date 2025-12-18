import { useState } from 'react';
import apiService from '@/services/core/api.service';
import { API_BASE_PATH } from '@/services/core/api.config';
import { toast } from 'sonner';

interface SendForApprovalPayload {
  draftId: string;
  selectedApprovalMatrixId: string;
  submissionDeadline?: Date;
  evaluationCriteria?: string[];
}

interface ApprovalResponse {
  success: boolean;
  data: {
    requirementId: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    approvalProgress?: {
      currentLevel: number;
      totalLevels: number;
      levels: Array<{
        levelNumber: number;
        name: string;
        approvers: Array<{
          userId: string;
          name: string;
          status: 'pending' | 'approved' | 'rejected';
          approvedAt?: string;
        }>;
        status: 'pending' | 'approved' | 'rejected';
      }>;
    };
    estimatedPublishDate?: string;
  };
}

export const useSendForApproval = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendForApproval = async (payload: SendForApprovalPayload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.post<ApprovalResponse, object>(
        `${API_BASE_PATH}/industry/requirements/draft/${payload.draftId}/submit-approval`,
        {
          selectedApprovalMatrixId: payload.selectedApprovalMatrixId,
          submissionDeadline: payload.submissionDeadline,
          evaluationCriteria: payload.evaluationCriteria,
        }
      );
      
      toast.success('Requirement sent for approval successfully');
      return response?.data || null;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to send for approval';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendForApproval, isLoading, error };
};
