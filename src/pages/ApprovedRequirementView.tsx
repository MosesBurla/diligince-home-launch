import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import requirementListService from '@/services/modules/requirements/lists.service';
import { RequirementViewLayout } from '@/components/requirement/view';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Loader2, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import type { RequirementDetail } from '@/types/requirement-list';

// Extended type for approved requirement
interface ApprovedRequirement extends Omit<RequirementDetail, 'createdBy' | 'approvedBy'> {
  approvedBy?: {
    id: string;
    name: string;
    email?: string;
  } | string;
  approvedDate?: string;
  publishDate?: string;
  createdBy?: {
    id: string;
    name: string;
    email?: string;
  };
}

const ApprovedRequirementView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [requirement, setRequirement] = useState<ApprovedRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if action=publish was passed in URL
  const actionParam = searchParams.get('action');

  // Fetch requirement details
  useEffect(() => {
    const fetchRequirement = async () => {
      if (!id) {
        setError('Invalid requirement ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await requirementListService.getApprovedById(id);
        
        if (data) {
          setRequirement(data as ApprovedRequirement);
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

  // Check if current user can publish (only creator can publish)
  const canPublish = (): boolean => {
    if (!requirement || !user?.id) return false;
    
    const isCreator = requirement.createdBy?.id === user.id || 
                     requirement.submittedBy === user.email;
    const isApproved = requirement.status === 'approved';
    
    return isCreator && isApproved;
  };

  const handlePublish = async () => {
    if (!id || !canPublish()) return;

    try {
      setPublishing(true);
      await requirementListService.publishRequirement(id);
      toast.success('Requirement published successfully');
      navigate('/dashboard/requirements/published');
    } catch (err: any) {
      console.error('Failed to publish requirement:', err);
      toast.error(err.message || 'Failed to publish requirement');
    } finally {
      setPublishing(false);
    }
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
          <Button onClick={() => navigate('/dashboard/requirements/approved')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Approved Requirements
          </Button>
        </div>
      </div>
    );
  }

  // Use RequirementViewLayout with custom footer for publish action
  return (
    <RequirementViewLayout
      requirement={requirement}
      canShowApprovalActions={false}
      customFooterActions={
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/requirements/approved')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          
          {canPublish() ? (
            <Button 
              onClick={handlePublish} 
              disabled={publishing}
              className="bg-primary hover:bg-primary/90"
            >
              <Rocket className="h-4 w-4 mr-2" />
              {publishing ? 'Publishing...' : 'Publish to Vendors'}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Only the creator can publish this requirement
            </p>
          )}
        </div>
      }
      onActionComplete={() => navigate('/dashboard/requirements/published')}
    />
  );
};

export default ApprovedRequirementView;
