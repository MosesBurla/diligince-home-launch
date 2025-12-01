import React, { useEffect, useState } from 'react';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { useApprovalMatrix } from '@/hooks/useApprovalMatrix';
import { MatrixFilters } from '@/services/modules/approval-matrix';
import {
  MatrixListHeader,
  MatrixStatisticsBar,
  MatrixCard,
  MatrixFilters as MatrixFiltersComponent,
} from '@/components/approvalMatrix';
import { Skeleton } from '@/components/ui/skeleton';

export const ApprovalMatrixListPage: React.FC = () => {
  const {
    matrices,
    loading,
    pagination,
    statistics,
    fetchMatrices,
    deleteMatrix,
    toggleStatus,
    duplicateMatrix,
  } = useApprovalMatrix();

  const [filters, setFilters] = useState<MatrixFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
    isDefault: undefined,
    sortBy: 'priority',
    sortOrder: 'asc',
  });

  // Fetch matrices on mount and when filters change
  useEffect(() => {
    fetchMatrices(filters);
  }, [filters, fetchMatrices]);

  const handleFilterChange = (newFilters: Partial<MatrixFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDelete = async (matrixId: string) => {
    if (!matrixId) return;
    const success = await deleteMatrix(matrixId);
    if (success) {
      fetchMatrices(filters);
    }
  };

  const handleToggleStatus = async (matrixId: string, isActive: boolean) => {
    if (!matrixId || isActive === undefined) return;
    const result = await toggleStatus(matrixId, { isActive });
    if (result) {
      fetchMatrices(filters);
    }
  };

  const handleDuplicate = async (matrixId: string, name: string) => {
    if (!matrixId || !name) return;
    const result = await duplicateMatrix(matrixId, { name, copyApprovers: true });
    if (result) {
      fetchMatrices(filters);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <MatrixListHeader />

      {/* Statistics Bar */}
      <MatrixStatisticsBar statistics={statistics} loading={loading} />

      {/* Filters */}
      <MatrixFiltersComponent
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Matrices Grid */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : matrices && matrices.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matrices.map((matrix) => (
                <MatrixCard
                  key={matrix?.id || Math.random()}
                  matrix={matrix}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && (pagination?.totalPages || 0) > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {((pagination?.currentPage || 1) - 1) * (pagination?.pageSize || 10) + 1} to{' '}
                  {Math.min((pagination?.currentPage || 1) * (pagination?.pageSize || 10), pagination?.totalItems || 0)} of{' '}
                  {pagination?.totalItems || 0} results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange((pagination?.currentPage || 1) - 1)}
                    disabled={!(pagination?.hasPreviousPage)}
                    className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {pagination?.currentPage || 1} of {pagination?.totalPages || 1}
                  </span>
                  <button
                    onClick={() => handlePageChange((pagination?.currentPage || 1) + 1)}
                    disabled={!(pagination?.hasNextPage)}
                    className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Empty state
          <div className="text-center py-12">
            <p className="text-muted-foreground">No approval matrices found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first approval matrix to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
