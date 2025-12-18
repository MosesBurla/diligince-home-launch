import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Tag, 
  AlertTriangle, 
  Building2, 
  Calendar,
  DollarSign,
  User,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';

interface ViewBasicInfoSectionProps {
  requirement: {
    title?: string;
    category?: string;
    priority?: string;
    department?: string;
    costCenter?: string;
    estimatedBudget?: number;
    deadline?: string;
    createdAt?: string;
    createdBy?: {
      name?: string;
      email?: string;
    };
  };
}

export const ViewBasicInfoSection: React.FC<ViewBasicInfoSectionProps> = ({ requirement }) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not specified';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Category */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Requirement Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Title</label>
            <p className="text-base font-medium mt-1">{requirement.title || 'Untitled Requirement'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Category</label>
              <p className="text-base mt-1 capitalize">{requirement.category || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Priority</label>
              <div className="mt-1">
                <Badge className={getPriorityColor(requirement.priority)}>
                  {requirement.priority || 'Not set'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department & Budget */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Organization Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Department</label>
              <p className="text-base mt-1">{requirement.department || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Cost Center</label>
              <p className="text-base mt-1">{requirement.costCenter || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Estimated Budget
              </label>
              <p className="text-base font-medium mt-1 text-primary">
                {formatCurrency(requirement.estimatedBudget)}
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Deadline
              </label>
              <p className="text-base mt-1">{formatDate(requirement.deadline)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submitted By */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Submitted By
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{requirement.createdBy?.name || 'Unknown User'}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {requirement.createdBy?.email || 'No email'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Submitted on {formatDate(requirement.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewBasicInfoSection;
