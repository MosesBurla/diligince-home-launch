import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { useAvailableMatrices } from '@/hooks/useAvailableMatrices';
import { ApprovalMatrix } from '@/services/modules/approval-matrix/approval-matrix.types';
import { Users, Layers, Clock, Settings, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApprovalMatrixSelectorProps {
  selectedMatrixId: string | null;
  onSelect: (matrix: ApprovalMatrix) => void;
}

export const ApprovalMatrixSelector: React.FC<ApprovalMatrixSelectorProps> = ({
  selectedMatrixId,
  onSelect,
}) => {
  const navigate = useNavigate();
  const { matrices, isLoading, error } = useAvailableMatrices();

  // Auto-select default matrix or first one when matrices load
  const handleAutoSelect = useCallback(() => {
    if (!isLoading && matrices && matrices.length > 0 && !selectedMatrixId) {
      // Priority: default matrix first, then first available
      const defaultMatrix = matrices.find(m => m.isDefault);
      const matrixToSelect = defaultMatrix || matrices[0];
      onSelect(matrixToSelect);
    }
  }, [isLoading, matrices, selectedMatrixId, onSelect]);

  useEffect(() => {
    handleAutoSelect();
  }, [handleAutoSelect]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!matrices || matrices.length === 0) {
    return (
      <Card className="p-6 border-dashed">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Layers className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">No Approval Matrices Available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Configure an approval matrix to enable workflow approvals.
            </p>
          </div>
          <PermissionGate moduleId="settings-approval-matrix" action="write">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/approval-matrix/create')}
              className="mt-2"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Approval Matrix
            </Button>
          </PermissionGate>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {matrices.map((matrix) => (
        <MatrixCard
          key={matrix.id}
          matrix={matrix}
          isSelected={selectedMatrixId === matrix.id}
          onSelect={() => onSelect(matrix)}
        />
      ))}
    </div>
  );
};

interface MatrixCardProps {
  matrix: ApprovalMatrix;
  isSelected: boolean;
  onSelect: () => void;
}

const MatrixCard: React.FC<MatrixCardProps> = ({ matrix, isSelected, onSelect }) => {
  const totalApprovers = matrix.statistics?.totalApprovers || 0;
  const totalLevels = matrix.statistics?.totalLevels || matrix.levels?.length || 0;

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border hover:border-primary/50'
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground truncate">{matrix.name}</h4>
            {matrix.isDefault && (
              <Badge variant="secondary" className="text-xs">Default</Badge>
            )}
          </div>
          {matrix.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {matrix.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              {totalLevels} Levels
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {totalApprovers} Approvers
            </span>
            {matrix.levels?.[0]?.maxApprovalTimeHours && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {matrix.levels.reduce((sum, l) => sum + (l.maxApprovalTimeHours || 0), 0)}h max
              </span>
            )}
          </div>
        </div>
        <div
          className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
            isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
          )}
        >
          {isSelected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
        </div>
      </div>
    </Card>
  );
};
