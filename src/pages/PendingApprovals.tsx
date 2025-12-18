import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IndustryHeader from "@/components/industry/IndustryHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CheckCircle, XCircle, ArrowLeft, Users, AlertTriangle, DollarSign } from "lucide-react";
import { usePendingApprovals } from "@/hooks/usePendingApprovals";
import { useApproveRequirement } from "@/hooks/useApproveRequirement";
import { useRejectRequirement } from "@/hooks/useRejectRequirement";
import { useUser } from "@/contexts/UserContext";
import { ApprovalProgressStepper, ApproveDialog, RejectDialog, ApprovalInfoDropdownPanel } from "@/components/approval";
import type { PendingApproval } from "@/services/modules/approvals/approvals.types";
import { format } from "date-fns";

const PendingApprovals = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const currentUserId = user?.id || '';
  
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>('');
  const { approvals, statistics, creators, isLoading, refetch } = usePendingApprovals({
    createdById: selectedCreatorId || undefined,
  });
  
  const { approve, isLoading: isApproving } = useApproveRequirement();
  const { reject, isLoading: isRejecting } = useRejectRequirement();
  
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);

  const handleApprove = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setApproveDialogOpen(true);
  };

  const handleReject = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setRejectDialogOpen(true);
  };

  const confirmApprove = async (comments: string) => {
    if (!selectedApproval) return;
    const result = await approve(selectedApproval.requirementId, { comments });
    if (result) {
      setApproveDialogOpen(false);
      refetch();
    }
  };

  const confirmReject = async (reason: string, comments: string, allowResubmission: boolean) => {
    if (!selectedApproval) return;
    const result = await reject(selectedApproval.requirementId, { reason, comments, allowResubmission });
    if (result) {
      setRejectDialogOpen(false);
      refetch();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canUserApprove = (approval: PendingApproval) => {
    if (!currentUserId) return false;
    const currentLevel = approval.approvalProgress?.levels?.find(
      l => l.levelNumber === approval.approvalProgress.currentLevel
    );
    if (!currentLevel || currentLevel.status !== 'in_progress') return false;
    const userAsApprover = currentLevel.approvers?.find(a => a.memberId === currentUserId);
    return userAsApprover?.status === 'pending';
  };

  return (
    <div className="min-h-screen bg-background">
      <IndustryHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pending Approvals</h1>
            <p className="text-muted-foreground mt-2">
              Review and approve requirements awaiting your decision
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/industry")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : statistics?.total || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Awaiting My Approval</CardTitle>
              <Users className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{isLoading ? <Skeleton className="h-8 w-12" /> : statistics?.awaitingMyApproval || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level 1 Pending</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : statistics?.level1Pending || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{isLoading ? <Skeleton className="h-8 w-12" /> : statistics?.overdueApprovals || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Creator Filter */}
        {creators.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter by creator:</span>
            <select
              value={selectedCreatorId}
              onChange={(e) => setSelectedCreatorId(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            >
              <option value="">All Creators</option>
              {creators.map((creator) => (
                <option key={creator.id} value={creator.id}>
                  {creator.name} ({creator.count})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Approvals List */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements Awaiting Approval</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : approvals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No pending approvals</p>
                <p className="text-sm">Requirements submitted for approval will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvals.map((approval) => (
                  <div key={approval.requirementId} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{approval.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(approval.priority)}>
                          {approval.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>{approval.category}</span>
                        <span>•</span>
                        <span>{approval.department}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {approval.estimatedBudget?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>By: {approval.createdBy?.name}</span>
                        <span>•</span>
                        <span>Sent: {approval.sentForApprovalAt ? format(new Date(approval.sentForApprovalAt), 'MMM d, yyyy') : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <ApprovalProgressStepper progress={approval.approvalProgress} compact />
                        <ApprovalInfoDropdownPanel 
                          approvalProgress={approval.approvalProgress as any}
                          status={approval.status}
                          triggerVariant="icon"
                        />
                      </div>
                      {canUserApprove(approval) && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleReject(approval)}>
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(approval)}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <ApproveDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        requirementTitle={selectedApproval?.title || ''}
        onConfirm={confirmApprove}
        isLoading={isApproving}
      />
      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        requirementTitle={selectedApproval?.title || ''}
        onConfirm={confirmReject}
        isLoading={isRejecting}
      />
    </div>
  );
};

export default PendingApprovals;
