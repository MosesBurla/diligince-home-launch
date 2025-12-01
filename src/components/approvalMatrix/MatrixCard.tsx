import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApprovalMatrix } from '@/services/modules/approval-matrix';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Power,
  Trash2,
  Users,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { PermissionGate } from '@/components/shared/PermissionGate';

interface MatrixCardProps {
  matrix: ApprovalMatrix;
  onDelete: (matrixId: string) => void;
  onToggleStatus: (matrixId: string, isActive: boolean) => void;
  onDuplicate: (matrixId: string, name: string) => void;
}

export const MatrixCard: React.FC<MatrixCardProps> = ({
  matrix,
  onDelete,
  onToggleStatus,
  onDuplicate,
}) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleView = () => {
    if (matrix?.id) {
      navigate(`/dashboard/approval-matrix/${matrix.id}`);
    }
  };

  const handleEdit = () => {
    if (matrix?.id) {
      navigate(`/dashboard/approval-matrix/${matrix.id}/edit`);
    }
  };

  const handleDuplicate = () => {
    if (matrix?.id && matrix?.name) {
      const newName = `Copy of ${matrix.name}`;
      onDuplicate(matrix.id, newName);
    }
  };

  const handleToggleStatus = () => {
    if (matrix?.id && matrix?.isActive !== undefined) {
      onToggleStatus(matrix.id, !matrix.isActive);
    }
  };

  const handleDeleteConfirm = () => {
    if (matrix?.id) {
      onDelete(matrix.id);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-all overflow-hidden">
        {/* Status Bar */}
        <div
          className={`h-1 ${
            matrix?.isActive ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />

        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {matrix?.name || 'Untitled Matrix'}
                </h3>
                {matrix?.isDefault && (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                    Default
                  </Badge>
                )}
                <Badge
                  variant={matrix?.isActive ? 'default' : 'secondary'}
                  className={
                    matrix?.isActive
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }
                >
                  {matrix?.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {matrix?.description || 'No description provided'}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <PermissionGate moduleId="settings-approval-matrix" action="edit">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Matrix
                  </DropdownMenuItem>
                </PermissionGate>
                <PermissionGate moduleId="settings-approval-matrix" action="write">
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                </PermissionGate>
                <DropdownMenuSeparator />
                <PermissionGate moduleId="settings-approval-matrix" action="edit">
                  <DropdownMenuItem onClick={handleToggleStatus}>
                    <Power className="h-4 w-4 mr-2" />
                    {matrix?.isActive ? 'Deactivate' : 'Activate'}
                  </DropdownMenuItem>
                </PermissionGate>
                <PermissionGate moduleId="settings-approval-matrix" action="delete">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </PermissionGate>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <Layers className="h-4 w-4" />
                <span className="text-lg font-semibold">
                  {matrix?.statistics?.totalLevels || 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Levels</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-lg font-semibold">
                  {matrix?.statistics?.totalApprovers || 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Approvers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-lg font-semibold">
                  {matrix?.statistics?.activeWorkflows || 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
            <span>Priority: {matrix?.priority || 'N/A'}</span>
            <span>
              By {matrix?.createdBy?.name || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Approval Matrix?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{matrix?.name || 'this matrix'}"? This action
              cannot be undone. Active workflows using this matrix will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
