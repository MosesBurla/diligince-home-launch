import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  XCircle,
  User,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Approver {
  memberId: string;
  memberName: string;
  memberEmail?: string;
  memberRole?: string;
  isMandatory?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  comments?: string;
}

interface ApprovalLevel {
  levelNumber: number;
  name: string;
  status: 'waiting' | 'in_progress' | 'completed';
  maxApprovalTimeHours?: number;
  approvers: Approver[];
  completedAt?: string;
}

interface ViewApprovalSectionProps {
  requirement: {
    status?: string;
    selectedApprovalMatrix?: {
      id: string;
      name: string;
      totalLevels: number;
    };
    approvalProgress?: {
      currentLevel: number;
      totalLevels: number;
      levels: ApprovalLevel[];
    };
    sentForApprovalAt?: string;
  };
}

export const ViewApprovalSection: React.FC<ViewApprovalSectionProps> = ({ requirement }) => {
  const getLevelStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'waiting': return <Clock className="w-5 h-5 text-muted-foreground" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getApproverStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': 
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected': 
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'pending': 
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy, HH:mm');
    } catch {
      return dateStr;
    }
  };

  const levels = requirement.approvalProgress?.levels || [];
  const currentLevel = requirement.approvalProgress?.currentLevel || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Approval Matrix Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Approval Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Approval Matrix</label>
              <p className="text-base font-medium mt-1">
                {requirement.selectedApprovalMatrix?.name || 'Standard Approval'}
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Total Levels</label>
              <p className="text-base mt-1">
                {requirement.approvalProgress?.totalLevels || requirement.selectedApprovalMatrix?.totalLevels || 0} levels
              </p>
            </div>
          </div>
          
          {requirement.sentForApprovalAt && (
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Sent for Approval
              </label>
              <p className="text-base mt-1">{formatDate(requirement.sentForApprovalAt)}</p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                Level {currentLevel} of {requirement.approvalProgress?.totalLevels || 0}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((currentLevel - 1) / (requirement.approvalProgress?.totalLevels || 1)) * 100}%` 
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Levels */}
      {levels.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Approval Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {levels.map((level, index) => (
                <div 
                  key={level.levelNumber}
                  className={cn(
                    "relative p-4 rounded-lg border transition-colors",
                    level.status === 'in_progress' && "border-primary bg-primary/5",
                    level.status === 'completed' && "border-green-200 bg-green-50",
                    level.status === 'waiting' && "border-muted bg-muted/30"
                  )}
                >
                  {/* Level Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getLevelStatusIcon(level.status)}
                      <span className="font-medium">
                        Level {level.levelNumber}: {level.name}
                      </span>
                    </div>
                    <Badge variant={level.status === 'completed' ? 'default' : 'secondary'}>
                      {level.status === 'completed' ? 'Completed' : 
                       level.status === 'in_progress' ? 'In Progress' : 'Waiting'}
                    </Badge>
                  </div>

                  {/* Approvers */}
                  <div className="space-y-2 ml-7">
                    {level.approvers?.map((approver) => (
                      <div 
                        key={approver.memberId}
                        className="flex items-center justify-between py-2 border-b border-muted last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{approver.memberName}</p>
                            <p className="text-xs text-muted-foreground">
                              {approver.memberRole || approver.memberEmail}
                              {approver.isMandatory && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getApproverStatusBadge(approver.status)}
                          {approver.approvedAt && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(approver.approvedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {level.completedAt && (
                    <p className="text-xs text-muted-foreground mt-2 ml-7">
                      Completed on {formatDate(level.completedAt)}
                    </p>
                  )}

                  {/* Connector line */}
                  {index < levels.length - 1 && (
                    <div className="absolute left-[1.65rem] top-full w-0.5 h-4 bg-muted" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {levels.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No approval levels configured</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ViewApprovalSection;
