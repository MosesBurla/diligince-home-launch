import React from 'react';
import { CreateMatrixRequest } from '@/services/modules/approval-matrix';
import { Badge } from '@/components/ui/badge';
import { Layers, Users, CheckCircle2, AlertCircle } from 'lucide-react';

interface MatrixPreviewPanelProps {
  matrix: CreateMatrixRequest;
}

export const MatrixPreviewPanel: React.FC<MatrixPreviewPanelProps> = ({ matrix }) => {
  const totalLevels = matrix?.levels?.length || 0;
  const totalApprovers = matrix?.levels?.reduce((sum, level) => sum + (level?.approvers?.length || 0), 0) || 0;
  const mandatoryApprovers = matrix?.levels?.reduce(
    (sum, level) => sum + (level?.approvers?.filter(a => a?.isMandatory).length || 0), 0
  ) || 0;

  return (
    <div className="bg-card rounded-lg border p-6 space-y-4 sticky top-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Preview</h3>
        <p className="text-sm text-muted-foreground">Live summary of your approval matrix</p>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <Layers className="h-4 w-4" />
            <span className="font-semibold">{totalLevels}</span>
          </div>
          <p className="text-xs text-blue-600">Approval Levels</p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 mb-1">
            <Users className="h-4 w-4" />
            <span className="font-semibold">{totalApprovers}</span>
          </div>
          <p className="text-xs text-green-600">Total Approvers</p>
        </div>

        <div className="p-3 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 text-red-700 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-semibold">{mandatoryApprovers}</span>
          </div>
          <p className="text-xs text-red-600">Mandatory Approvers</p>
        </div>

        {matrix?.isDefault && (
          <Badge className="w-full justify-center bg-amber-50 text-amber-700 border-amber-200">
            Default Matrix
          </Badge>
        )}

        {totalLevels === 0 && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg text-xs">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Add at least one approval level</span>
          </div>
        )}
      </div>
    </div>
  );
};
