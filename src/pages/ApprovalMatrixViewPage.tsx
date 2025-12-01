import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApprovalMatrix } from '@/hooks/useApprovalMatrix';
import {
  MatrixDetailsHeader,
  LevelsOverview,
  ApproversTable,
} from '@/components/approvalMatrix';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const ApprovalMatrixViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { matrixId } = useParams<{ matrixId: string }>();
  const {
    selectedMatrix,
    loading,
    fetchMatrixById,
    deleteMatrix,
    toggleStatus,
    duplicateMatrix,
  } = useApprovalMatrix();

  useEffect(() => {
    if (matrixId) {
      fetchMatrixById(matrixId);
    }
  }, [matrixId, fetchMatrixById]);

  const handleEdit = () => {
    if (matrixId) {
      navigate(`/dashboard/approval-matrix/${matrixId}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!matrixId) return;
    const success = await deleteMatrix(matrixId);
    if (success) {
      navigate('/dashboard/approval-matrix');
    }
  };

  const handleToggleStatus = async () => {
    if (!matrixId || !selectedMatrix || selectedMatrix?.isActive === undefined) return;
    const result = await toggleStatus(matrixId, {
      isActive: !selectedMatrix.isActive,
    });
    if (result && matrixId) {
      fetchMatrixById(matrixId);
    }
  };

  const handleDuplicate = async () => {
    if (!matrixId || !selectedMatrix?.name) return;
    const result = await duplicateMatrix(matrixId, {
      name: `Copy of ${selectedMatrix.name}`,
      copyApprovers: true,
    });
    if (result?.id) {
      navigate(`/dashboard/approval-matrix/${result.id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/approval-matrix');
  };

  if (loading && !selectedMatrix) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!selectedMatrix) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-muted-foreground">Approval matrix not found</p>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Actions */}
        <MatrixDetailsHeader
          matrix={selectedMatrix}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onDuplicate={handleDuplicate}
          onBack={handleBack}
        />

        {/* Matrix Details */}
        <div className="bg-card rounded-lg border p-6 space-y-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p className="text-foreground mt-1">
              {selectedMatrix.description || 'No description provided'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Priority</p>
              <p className="text-lg font-semibold text-foreground">
                {selectedMatrix.priority || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Levels</p>
              <p className="text-lg font-semibold text-foreground">
                {selectedMatrix.statistics?.totalLevels || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Approvers</p>
              <p className="text-lg font-semibold text-foreground">
                {selectedMatrix.statistics?.totalApprovers || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Workflows</p>
              <p className="text-lg font-semibold text-foreground">
                {selectedMatrix.statistics?.activeWorkflows || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Levels Overview */}
        <LevelsOverview levels={selectedMatrix.levels || []} />

        {/* Approvers Table */}
        <ApproversTable matrix={selectedMatrix} />
      </div>
    </div>
  );
};
