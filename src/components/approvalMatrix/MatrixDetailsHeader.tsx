import React from 'react';
import { ApprovalMatrix } from '@/services/modules/approval-matrix';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Copy, Power, Trash2 } from 'lucide-react';
import { PermissionGate } from '@/components/shared/PermissionGate';

interface MatrixDetailsHeaderProps {
  matrix: ApprovalMatrix;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onDuplicate: () => void;
  onBack: () => void;
}

export const MatrixDetailsHeader: React.FC<MatrixDetailsHeaderProps> = ({
  matrix,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
  onBack,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">{matrix?.name || 'Approval Matrix'}</h1>
            {matrix?.isDefault && (
              <Badge className="bg-amber-50 text-amber-700 border-amber-200">Default</Badge>
            )}
            <Badge variant={matrix?.isActive ? 'default' : 'secondary'}>
              {matrix?.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">View approval matrix details</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <PermissionGate moduleId="settings-approval-matrix" action="write">
          <Button variant="outline" onClick={onDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
        </PermissionGate>
        <PermissionGate moduleId="settings-approval-matrix" action="edit">
          <Button variant="outline" onClick={onToggleStatus}>
            <Power className="h-4 w-4 mr-2" />
            {matrix?.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </PermissionGate>
        <PermissionGate moduleId="settings-approval-matrix" action="delete">
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </PermissionGate>
      </div>
    </div>
  );
};
