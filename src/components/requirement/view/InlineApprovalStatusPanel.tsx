import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  X, 
  CheckCircle2, 
  Clock, 
  XCircle,
  User,
  ChevronRight
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

interface InlineApprovalStatusPanelProps {
  isOpen: boolean;
  onClose: () => void;
  approvalProgress?: {
    currentLevel: number;
    totalLevels: number;
    levels: ApprovalLevel[];
  };
  matrixName?: string;
}

export const InlineApprovalStatusPanel: React.FC<InlineApprovalStatusPanelProps> = ({
  isOpen,
  onClose,
  approvalProgress,
  matrixName
}) => {
  const getLevelIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'waiting': return <Clock className="w-4 h-4 text-muted-foreground" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getApproverIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
      case 'rejected': return <XCircle className="w-3.5 h-3.5 text-red-500" />;
      case 'pending': 
      default: return <Clock className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'dd MMM, HH:mm');
    } catch {
      return dateStr;
    }
  };

  const levels = approvalProgress?.levels || [];
  const currentLevel = approvalProgress?.currentLevel || 1;
  const totalLevels = approvalProgress?.totalLevels || 0;

  if (!isOpen) return null;

  return (
    <Card className={cn(
      "border-primary/20 shadow-lg",
      "animate-in slide-in-from-top-2 fade-in-0 duration-300"
    )}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Approval Status
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Matrix Info */}
        <div className="flex items-center justify-between pb-3 border-b">
          <div>
            <p className="text-sm text-muted-foreground">Approval Matrix</p>
            <p className="font-medium">{matrixName || 'Standard Approval'}</p>
          </div>
          <Badge variant="outline">
            Level {currentLevel} / {totalLevels}
          </Badge>
        </div>

        {/* Levels List */}
        <ScrollArea className="h-[250px] pr-2">
          {levels.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No approval levels</p>
            </div>
          ) : (
            <div className="space-y-3">
              {levels.map((level, index) => (
                <div 
                  key={level.levelNumber}
                  className={cn(
                    "p-3 rounded-lg border transition-all",
                    level.status === 'in_progress' && "border-primary bg-primary/5",
                    level.status === 'completed' && "border-green-200 bg-green-50/50",
                    level.status === 'waiting' && "border-muted bg-muted/20 opacity-60"
                  )}
                >
                  {/* Level Header */}
                  <div className="flex items-center gap-2 mb-2">
                    {getLevelIcon(level.status)}
                    <span className="text-sm font-medium flex-1">
                      {level.name}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs",
                        level.status === 'completed' && "bg-green-100 text-green-700",
                        level.status === 'in_progress' && "bg-amber-100 text-amber-700"
                      )}
                    >
                      {level.status === 'completed' ? 'Done' : 
                       level.status === 'in_progress' ? 'Active' : 'Waiting'}
                    </Badge>
                  </div>

                  {/* Approvers */}
                  <div className="space-y-1.5 ml-6">
                    {level.approvers?.map((approver) => (
                      <div 
                        key={approver.memberId}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {getApproverIcon(approver.status)}
                          <span className={cn(
                            approver.status === 'approved' && "text-green-700",
                            approver.status === 'rejected' && "text-red-700"
                          )}>
                            {approver.memberName}
                          </span>
                          {approver.isMandatory && (
                            <span className="text-red-500 text-xs">*</span>
                          )}
                        </div>
                        {approver.approvedAt && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(approver.approvedAt)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Progress Summary */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">
              {Math.round(((currentLevel - 1) / Math.max(totalLevels, 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${((currentLevel - 1) / Math.max(totalLevels, 1)) * 100}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InlineApprovalStatusPanel;
