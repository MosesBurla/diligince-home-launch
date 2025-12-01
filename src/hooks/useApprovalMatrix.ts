import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import {
  approvalMatrixService,
  ApprovalMatrix,
  MatrixFilters,
  MatrixListStatistics,
  CreateMatrixRequest,
  UpdateMatrixRequest,
  DuplicateMatrixRequest,
  ToggleStatusRequest,
} from '@/services/modules/approval-matrix';

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const useApprovalMatrix = () => {
  const { toast } = useToast();
  const [matrices, setMatrices] = useState<ApprovalMatrix[]>([]);
  const [selectedMatrix, setSelectedMatrix] = useState<ApprovalMatrix | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [statistics, setStatistics] = useState<MatrixListStatistics>({
    totalMatrices: 0,
    activeMatrices: 0,
    inactiveMatrices: 0,
    defaultMatrix: 0,
    totalApprovers: 0,
  });

  /**
   * Fetch all approval matrices with filters
   */
  const fetchMatrices = useCallback(async (filters?: MatrixFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await approvalMatrixService.getMatrices(filters);
      
      if (response?.success && response?.data) {
        setMatrices(response.data.matrices || []);
        setPagination(response.data.pagination || pagination);
        setStatistics(response.data.statistics || statistics);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to fetch approval matrices';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Fetch single matrix by ID
   */
  const fetchMatrixById = useCallback(async (matrixId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await approvalMatrixService.getMatrixById(matrixId);
      
      if (response?.success && response?.data) {
        setSelectedMatrix(response.data);
        return response.data;
      }
      return null;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to fetch approval matrix';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Create new approval matrix
   */
  const createMatrix = useCallback(async (data: CreateMatrixRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await approvalMatrixService.createMatrix(data);
      
      if (response?.success && response?.data) {
        toast({
          title: 'Success',
          description: response.message || 'Approval matrix created successfully',
        });
        return response.data;
      }
      return null;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to create approval matrix';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Update existing approval matrix
   */
  const updateMatrix = useCallback(async (matrixId: string, data: UpdateMatrixRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await approvalMatrixService.updateMatrix(matrixId, data);
      
      if (response?.success && response?.data) {
        toast({
          title: 'Success',
          description: response.message || 'Approval matrix updated successfully',
        });
        return response.data;
      }
      return null;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to update approval matrix';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Delete approval matrix
   */
  const deleteMatrix = useCallback(async (matrixId: string, permanent: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await approvalMatrixService.deleteMatrix(matrixId, permanent);
      
      if (response?.success) {
        toast({
          title: 'Success',
          description: response.message || 'Approval matrix deleted successfully',
        });
        return true;
      }
      return false;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to delete approval matrix';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Toggle matrix status
   */
  const toggleStatus = useCallback(async (matrixId: string, data: ToggleStatusRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await approvalMatrixService.toggleStatus(matrixId, data);
      
      if (response?.success && response?.data) {
        toast({
          title: 'Success',
          description: response.message || 'Matrix status updated successfully',
        });
        return response.data;
      }
      return null;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to update matrix status';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Duplicate approval matrix
   */
  const duplicateMatrix = useCallback(async (matrixId: string, data: DuplicateMatrixRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await approvalMatrixService.duplicateMatrix(matrixId, data);
      
      if (response?.success && response?.data) {
        toast({
          title: 'Success',
          description: response.message || 'Approval matrix duplicated successfully',
        });
        return response.data;
      }
      return null;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to duplicate approval matrix';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Export matrices
   */
  const exportMatrices = useCallback(async (
    format: 'csv' | 'xlsx' | 'pdf' = 'csv',
    filters?: MatrixFilters
  ) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await approvalMatrixService.exportMatrices(format, filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `approval-matrices-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Approval matrices exported successfully',
      });
      return true;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to export approval matrices';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    matrices,
    selectedMatrix,
    loading,
    error,
    pagination,
    statistics,
    fetchMatrices,
    fetchMatrixById,
    createMatrix,
    updateMatrix,
    deleteMatrix,
    toggleStatus,
    duplicateMatrix,
    exportMatrices,
  };
};
