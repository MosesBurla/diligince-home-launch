import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import requirementListService from '@/services/modules/requirements/lists.service';
import { RequirementViewLayout } from '@/components/requirement/view';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { RequirementDetail } from '@/types/requirement-list';

// Extended type for published requirement
interface PublishedRequirement extends Omit<RequirementDetail, 'createdBy'> {
  publishedDate?: string;
  quotesReceived?: number;
  createdBy?: {
    id: string;
    name: string;
    email?: string;
  };
  engagement?: {
    totalViews?: number;
    uniqueVendors?: number;
    quotesReceived?: number;
  };
}

const PublishedRequirementView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [requirement, setRequirement] = useState<PublishedRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const data = await requirementListService.getPublishedById(id);
        
        if (data) {
          setRequirement(data as PublishedRequirement);
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

  // Get quotes count
  const quotesCount = requirement?.quotesReceived ?? requirement?.engagement?.quotesReceived ?? 0;

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
          <Button onClick={() => navigate('/dashboard/requirements/published')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Published Requirements
          </Button>
        </div>
      </div>
    );
  }

  // Use RequirementViewLayout with custom header badge and footer
  return (
    <RequirementViewLayout
      requirement={requirement}
      canShowApprovalActions={false}
      headerBadge={
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <FileText className="h-3 w-3 mr-1" />
          {quotesCount} {quotesCount === 1 ? 'Quote' : 'Quotes'} Received
        </Badge>
      }
      customFooterActions={
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/requirements/published')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Published List
        </Button>
      }
    />
  );
};

export default PublishedRequirementView;
