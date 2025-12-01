import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApprovalMatrix } from '@/hooks/useApprovalMatrix';
import { CreateMatrixRequest, CreateApprovalLevelRequest } from '@/services/modules/approval-matrix';
import {
  MatrixBasicInfoForm,
  LevelConfigurationPanel,
  MatrixPreviewPanel,
} from '@/components/approvalMatrix';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const ApprovalMatrixFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { matrixId } = useParams<{ matrixId: string }>();
  const isEditMode = !!matrixId;

  const {
    selectedMatrix,
    loading,
    fetchMatrixById,
    createMatrix,
    updateMatrix,
  } = useApprovalMatrix();

  const [formData, setFormData] = useState<CreateMatrixRequest>({
    name: '',
    description: '',
    isDefault: false,
    priority: 1,
    levels: [],
  });

  // Load matrix data in edit mode
  useEffect(() => {
    if (isEditMode && matrixId) {
      fetchMatrixById(matrixId);
    }
  }, [isEditMode, matrixId, fetchMatrixById]);

  // Populate form when matrix data is loaded
  useEffect(() => {
    if (isEditMode && selectedMatrix) {
      setFormData({
        name: selectedMatrix.name || '',
        description: selectedMatrix.description || '',
        isDefault: selectedMatrix.isDefault || false,
        priority: selectedMatrix.priority || 1,
        levels: selectedMatrix.levels?.map((level) => ({
          order: level.order || 0,
          name: level.name || '',
          description: level.description || '',
          maxApprovalTimeHours: level.maxApprovalTimeHours || 24,
          isRequired: level.isRequired !== undefined ? level.isRequired : true,
          approvers: level.approvers?.map((approver) => ({
            memberId: approver.memberId || '',
            isMandatory: approver.isMandatory !== undefined ? approver.isMandatory : true,
            sequence: approver.sequence || 0,
          })) || [],
        })) || [],
      });
    }
  }, [isEditMode, selectedMatrix]);

  const handleBasicInfoChange = (data: Partial<CreateMatrixRequest>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleLevelsChange = (levels: CreateApprovalLevelRequest[]) => {
    setFormData((prev) => ({ ...prev, levels }));
  };

  const handleSubmit = async () => {
    if (!formData?.name || !formData?.levels || (formData?.levels?.length || 0) === 0) {
      return;
    }

    let result;
    if (isEditMode && matrixId) {
      result = await updateMatrix(matrixId, formData);
    } else {
      result = await createMatrix(formData);
    }

    if (result) {
      navigate('/dashboard/approval-matrix');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/approval-matrix');
  };

  if (isEditMode && loading && !selectedMatrix) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isEditMode ? 'Edit Approval Matrix' : 'Create Approval Matrix'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? 'Update approval hierarchy and approvers'
                  : 'Define approval levels and assign team members'}
              </p>
            </div>
          </div>
          {/* <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? 'Update Matrix' : 'Create Matrix'}
            </Button>
          </div> */}
        </div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <MatrixBasicInfoForm
              data={formData}
              onChange={handleBasicInfoChange}
            />

            {/* Level Configuration */}
            <LevelConfigurationPanel
              levels={formData.levels || []}
              onChange={handleLevelsChange}
            />
          </div>

          {/* Preview Panel - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <MatrixPreviewPanel matrix={formData} />
                        <div className="flex items-center gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? 'Update Matrix' : 'Create Matrix'}
            </Button>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
