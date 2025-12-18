import React, { useState } from 'react';
import { Users, CheckCircle, Clock, XCircle, ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownPanel } from '@/components/ui/dropdown-panel';
import { formatDistanceToNow, format } from 'date-fns';

interface Approver {
  memberId?: string;
  userId?: string;
  name: string;
  email?: string;
  role?: string;
  department?: string;
  isMandatory?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date | string;
  rejectedAt?: Date | string;
  comments?: string;
}

interface ApprovalLevel {
  levelNumber: number;
  name: string;
  status: string; // Accept any status string for flexibility
  maxApprovalTime?: number;
  approvers: Approver[];
}

interface ApprovalProgress {
  currentLevel: number;
  totalLevels: number;
  levels: ApprovalLevel[];
  allLevelsCompleted?: boolean;
  estimatedCompletionDate?: Date | string;
  estimatedPublishDate?: string;
}

interface ApprovalInfoDropdownPanelProps {
  approvalProgress?: ApprovalProgress | any; // Accept any for compatibility
  status?: string;
  triggerVariant?: 'button' | 'icon';
  className?: string;
}

const getStatusConfig = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || 'pending';
  
  if (normalizedStatus === 'approved' || normalizedStatus === 'completed') {
    return {
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      border: 'border-emerald-200',
      label: 'Completed',
    };
  }
  if (normalizedStatus === 'in_progress') {
    return {
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      border: 'border-amber-200',
      label: 'In Progress',
    };
  }
  if (normalizedStatus === 'rejected') {
    return {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-200',
      label: 'Rejected',
    };
  }
  // Default for 'pending', 'waiting', 'skipped', etc.
  return {
    icon: Clock,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    border: 'border-border',
    label: status === 'waiting' ? 'Waiting' : status === 'skipped' ? 'Skipped' : 'Pending',
  };
};

const getOverallStatusBadge = (status?: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-emerald-600 text-white">Approved</Badge>;
    case 'pending':
      return <Badge className="bg-amber-500 text-white">Pending</Badge>;
    case 'rejected':
      return <Badge className="bg-red-600 text-white">Rejected</Badge>;
    case 'published':
      return <Badge className="bg-blue-600 text-white">Published</Badge>;
    default:
      return null;
  }
};

const ApproverRow: React.FC<{ approver: Approver }> = ({ approver }) => {
  const statusConfig = getStatusConfig(approver.status);
  const StatusIcon = statusConfig.icon;
  const approverId = approver.memberId || approver.userId || '';
  const isMandatory = approver.isMandatory ?? true;

  return (
    <div className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/40 transition-colors">
      <div className={cn(
        "mt-0.5 p-1 rounded-full",
        statusConfig.bg
      )}>
        <StatusIcon className={cn("h-3.5 w-3.5", statusConfig.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">{approver.name}</span>
          {isMandatory ? (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/40 text-primary">
              Required
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground">
              Optional
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {approver.role && <span>{approver.role}</span>}
          {approver.role && approver.department && <span>•</span>}
          {approver.department && <span>{approver.department}</span>}
        </div>
        {approver.status === 'approved' && approver.approvedAt && (
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Approved {formatDistanceToNow(new Date(approver.approvedAt), { addSuffix: true })}
          </p>
        )}
        {approver.status === 'rejected' && approver.rejectedAt && (
          <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">
            Rejected {formatDistanceToNow(new Date(approver.rejectedAt), { addSuffix: true })}
          </p>
        )}
        {approver.comments && (
          <p className="text-xs text-foreground/80 mt-1.5 italic bg-muted/50 px-2 py-1 rounded">
            "{approver.comments}"
          </p>
        )}
      </div>
    </div>
  );
};

const LevelSection: React.FC<{ level: ApprovalLevel; isCurrentLevel: boolean }> = ({ level, isCurrentLevel }) => {
  const [isOpen, setIsOpen] = useState(isCurrentLevel || level.status === 'completed');
  const statusConfig = getStatusConfig(level.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          "flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors",
          isCurrentLevel && "bg-primary/5 border-l-2 border-primary"
        )}>
          <div className="flex items-center gap-3">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <div className={cn("p-1.5 rounded-full", statusConfig.bg)}>
              <StatusIcon className={cn("h-4 w-4", statusConfig.color)} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">Level {level.levelNumber}</span>
                <span className="text-muted-foreground text-sm">- {level.name}</span>
              </div>
              {level.maxApprovalTime && (
                <p className="text-[11px] text-muted-foreground">
                  Max {level.maxApprovalTime}h approval time
                </p>
              )}
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={cn("text-xs", statusConfig.bg, statusConfig.color, statusConfig.border)}
          >
            {statusConfig.label}
          </Badge>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-3 ml-7 space-y-1">
          {level.approvers.map((approver) => (
            <ApproverRow key={approver.memberId} approver={approver} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Mock data for demo
const mockApprovalProgress: ApprovalProgress = {
  currentLevel: 2,
  totalLevels: 3,
  levels: [
    {
      levelNumber: 1,
      name: 'Department Head',
      status: 'completed',
      maxApprovalTime: 24,
      approvers: [
        {
          memberId: '1',
          name: 'John Smith',
          role: 'Dept Manager',
          department: 'Procurement',
          isMandatory: true,
          status: 'approved',
          approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          comments: 'Specifications reviewed and approved.',
        },
        {
          memberId: '2',
          name: 'Jane Doe',
          role: 'Finance Lead',
          department: 'Finance',
          isMandatory: true,
          status: 'approved',
          approvedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      levelNumber: 2,
      name: 'CFO Approval',
      status: 'in_progress',
      maxApprovalTime: 48,
      approvers: [
        {
          memberId: '3',
          name: 'Robert Chen',
          role: 'CFO',
          department: 'Executive',
          isMandatory: true,
          status: 'pending',
        },
        {
          memberId: '4',
          name: 'Sarah Lee',
          role: 'VP Finance',
          department: 'Finance',
          isMandatory: false,
          status: 'pending',
        },
      ],
    },
    {
      levelNumber: 3,
      name: 'CEO Sign-off',
      status: 'pending',
      maxApprovalTime: 72,
      approvers: [
        {
          memberId: '5',
          name: 'Michael Brown',
          role: 'CEO',
          department: 'Executive',
          isMandatory: true,
          status: 'pending',
        },
      ],
    },
  ],
};

export const ApprovalInfoDropdownPanel: React.FC<ApprovalInfoDropdownPanelProps> = ({
  approvalProgress = mockApprovalProgress,
  status = 'pending',
  triggerVariant = 'button',
  className,
}) => {
  const [open, setOpen] = useState(false);

  // Only show for pending, rejected, published statuses
  const visibleStatuses = ['pending', 'rejected', 'published', 'approved'];
  if (!visibleStatuses.includes(status)) {
    return null;
  }

  const TriggerComponent = triggerVariant === 'icon' ? (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 hover:bg-muted/50"
    >
      <Users className="h-4 w-4" />
    </Button>
  ) : (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 border-border/60 hover:bg-muted/50"
    >
      <Shield className="h-4 w-4" />
      <span className="hidden sm:inline">Approval Info</span>
    </Button>
  );

  return (
    <DropdownPanel
      open={open}
      onOpenChange={setOpen}
      trigger={TriggerComponent}
      title="Approval Progress"
      titleIcon={<Shield className="h-4 w-4" />}
      headerExtra={getOverallStatusBadge(status)}
      className={className}
      contentClassName="p-0"
    >
      {!approvalProgress || !approvalProgress.levels?.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Shield className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm font-medium">No approval workflow</p>
          <p className="text-xs mt-1">This requirement has no approval matrix assigned</p>
        </div>
      ) : (
        <div className="divide-y divide-border/30">
          {/* Progress Summary */}
          <div className="px-4 py-3 bg-muted/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                Level {approvalProgress.currentLevel} of {approvalProgress.totalLevels}
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ 
                  width: `${((approvalProgress.currentLevel - 1) / approvalProgress.totalLevels) * 100}%` 
                }}
              />
            </div>
            {approvalProgress.estimatedCompletionDate && (
              <p className="text-xs text-muted-foreground mt-2">
                Est. completion: {format(new Date(approvalProgress.estimatedCompletionDate), 'MMM d, yyyy')}
              </p>
            )}
          </div>

          {/* Levels */}
          <div className="divide-y divide-border/30">
            {approvalProgress.levels.map((level) => (
              <LevelSection 
                key={level.levelNumber} 
                level={level}
                isCurrentLevel={level.levelNumber === approvalProgress.currentLevel}
              />
            ))}
          </div>
        </div>
      )}
    </DropdownPanel>
  );
};

export default ApprovalInfoDropdownPanel;
