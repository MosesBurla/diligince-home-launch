import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import requirementListService from '@/services/modules/requirements/lists.service';
import { RequirementViewLayout } from '@/components/requirement/view';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { RequirementDetail } from '@/types/requirement-list';

// Extended type for pending requirement with approval progress
interface ApprovalApprover {
  memberId: string;
  memberName: string;
  memberEmail?: string;
  memberRole?: string;
  isMandatory?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  comments?: string;
}

interface ApprovalProgressLevel {
  levelNumber: number;
  name: string;
  status: 'waiting' | 'in_progress' | 'completed';
  maxApprovalTimeHours?: number;
  approvers: ApprovalApprover[];
  completedAt?: string;
}

interface PendingRequirement extends Omit<RequirementDetail, 'approvalProgress'> {
  draftId?: string;
  requirementId?: string;
  sentForApprovalAt?: string;
  estimatedBudget?: number;
  selectedApprovalMatrix?: {
    id: string;
    name: string;
    totalLevels: number;
  };
  approvalProgress?: {
    currentLevel: number;
    totalLevels: number;
    levels: ApprovalProgressLevel[];
  };
}

const PendingRequirementView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [requirement, setRequirement] = useState<PendingRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch requirement details using dedicated endpoint
  useEffect(() => {
    const fetchRequirement = async () => {
      if (!id) {
        setError('Invalid requirement ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await requirementListService.getPendingById(id);
        
        if (data) {
          setRequirement(data as PendingRequirement);
        } else {
          setError('Requirement not found');
        }
      } catch (err: any) {
        console.error('Failed to fetch requirement:', err);
        setError(err.message || 'Failed to load requirement');
        toast.error('Failed to load requirement details');
      } finally {
        setLoading(false);
      }
    };

    fetchRequirement();
  }, [id]);

  // Check if current user can approve/reject
  const canShowApprovalActions = (): boolean => {
    if (!requirement || !user?.id) return false;
    
    const isPendingStatus = requirement.status === 'pending';
    const currentLevel = requirement.approvalProgress?.currentLevel;
    const currentLevelData = requirement.approvalProgress?.levels?.find(
      l => l.levelNumber === currentLevel && l.status === 'in_progress'
    );
    
    const isUserApprover = currentLevelData?.approvers?.some(
      approver => approver.memberId === user.id && approver.status === 'pending'
    );

    return isPendingStatus && !!isUserApprover;
  };

  const handleActionComplete = () => {
    navigate('/dashboard/requirements/pending');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading requirement details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !requirement) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">Error Loading Requirement</h2>
          <p className="text-muted-foreground">{error || 'Requirement not found'}</p>
          <Button onClick={() => navigate('/dashboard/requirements/pending')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pending Approvals
          </Button>
        </div>
      </div>
    );
  }

  // Use new RequirementViewLayout component
  return (
    <RequirementViewLayout
      requirement={requirement}
      canShowApprovalActions={canShowApprovalActions()}
      onActionComplete={handleActionComplete}
    />
  );
};

export default PendingRequirementView;
