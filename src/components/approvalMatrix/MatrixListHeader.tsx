import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PermissionGate } from '@/components/shared/PermissionGate';

export const MatrixListHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Approval Matrices</h1>
        <p className="text-muted-foreground mt-1">
          Manage approval hierarchies for requirement publishing workflows
        </p>
      </div>
      <PermissionGate moduleId="settings-approval-matrix" action="write">
        <Button onClick={() => navigate('/dashboard/approval-matrix/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Matrix
        </Button>
      </PermissionGate>
    </div>
  );
};
