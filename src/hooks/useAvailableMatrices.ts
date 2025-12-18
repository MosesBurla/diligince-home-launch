import { useState, useEffect } from 'react';
import { approvalMatrixService } from '@/services/modules/approval-matrix/approval-matrix.service';
import { ApprovalMatrix } from '@/services/modules/approval-matrix/approval-matrix.types';

export const useAvailableMatrices = () => {
  const [matrices, setMatrices] = useState<ApprovalMatrix[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatrices = async () => {
      try {
        setIsLoading(true);
        const response = await approvalMatrixService.getMatrices({ status: 'active' });
        setMatrices(response?.data?.matrices || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch approval matrices:', err);
        setError('Failed to load approval matrices');
        setMatrices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatrices();
  }, []);

  return { matrices, isLoading, error, refetch: () => {} };
};
