import { useState, useEffect, useCallback } from 'react';
import apiService from '@/services/core/api.service';
import { API_BASE_PATH } from '@/services/core/api.config';

export interface ApprovalLevel {
  levelNumber: number;
  name: string;
  approvers: Array<{
    userId: string;
    name: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedAt?: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ApprovalProgress {
  currentLevel: number;
  totalLevels: number;
  levels: ApprovalLevel[];
  estimatedPublishDate?: string;
}

interface ApprovalStatusResponse {
  success: boolean;
  data: {
    requirementId: string;
    approvalStatus: 'not_required' | 'pending' | 'approved' | 'rejected';
    approvalProgress?: ApprovalProgress;
  };
}

export const useApprovalStatus = (requirementId: string | undefined) => {
  const [status, setStatus] = useState<'not_required' | 'pending' | 'approved' | 'rejected'>('not_required');
  const [progress, setProgress] = useState<ApprovalProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!requirementId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.get<ApprovalStatusResponse>(
        `${API_BASE_PATH}/industry/requirements/${requirementId}/approval-status`
      );
      
      setStatus(response?.data?.approvalStatus || 'not_required');
      setProgress(response?.data?.approvalProgress || null);
    } catch (err: any) {
      // If 404, means no approval workflow yet
      if (err?.response?.status === 404) {
        setStatus('not_required');
        setProgress(null);
      } else {
        setError(err?.response?.data?.message || 'Failed to fetch approval status');
      }
    } finally {
      setIsLoading(false);
    }
  }, [requirementId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { status, progress, isLoading, error, refetch: fetchStatus };
};
