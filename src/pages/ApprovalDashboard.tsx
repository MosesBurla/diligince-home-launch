
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import IndustryHeader from "@/components/industry/IndustryHeader";
import { useApproval } from "@/contexts/ApprovalContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, CheckCircle, XCircle, AlertTriangle, Users, FileText } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const ApprovalDashboard = () => {
  const { approvalWorkflows, submitApproval, sendApprovalReminders } = useApproval();
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [approvalComments, setApprovalComments] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get all pending approvals for current user (mock user role)
  const pendingApprovals = approvalWorkflows.flatMap(workflow => 
    workflow.approvalRequests.filter(request => 
      request.status === 'pending' && 
      request.approverRole === 'Department Head' // Mock current user role
    ).map(request => ({
      ...request,
      workflowType: workflow.workflowType,
      isUrgent: workflow.isUrgent,
      requirementTitle: workflow.requirementId
    }))
  );

  const completedApprovals = approvalWorkflows.flatMap(workflow => 
    workflow.approvalRequests.filter(request => 
      (request.status === 'approved' || request.status === 'rejected') && 
      request.approverRole === 'Department Head'
    ).map(request => ({
      ...request,
      workflowType: workflow.workflowType,
      isUrgent: workflow.isUrgent,
      requirementTitle: workflow.requirementId
    }))
  );

  const handleApproval = (status: 'approved' | 'rejected') => {
    if (!selectedApproval) return;
    
    submitApproval(selectedApproval.id, status, approvalComments);
    setIsDialogOpen(false);
    setApprovalComments("");
    setSelectedApproval(null);
  };

  const openApprovalDialog = (approval: any) => {
    setSelectedApproval(approval);
    setIsDialogOpen(true);
  };

  const getUrgencyBadge = (isUrgent: boolean, urgentDeadline?: string) => {
    if (!isUrgent) return null;
    
    const isOverdue = urgentDeadline && new Date(urgentDeadline) < new Date();
    return (
      <Badge className={isOverdue ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}>
        {isOverdue ? "Overdue" : "Urgent"}
      </Badge>
    );
  };

  const stats = {
    pending: pendingApprovals.length,
    completed: completedApprovals.length,
    urgent: pendingApprovals.filter(a => a.isUrgent).length,
    overdue: pendingApprovals.filter(a => a.urgentDeadline && new Date(a.urgentDeadline) < new Date()).length
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Approval Dashboard | Diligince.ai</title>
      </Helmet>
      
      
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-20">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Approval Dashboard</h1>
              <p className="text-gray-600">Manage procurement requirement approvals and maintain ISO 9001 compliance</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Approvals</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Urgent</p>
                    <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-800">{stats.overdue}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-800" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pending Approvals */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Approvals ({pendingApprovals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovals.map((approval) => (
                  <TableRow key={approval.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{approval.requirementTitle}</div>
                        <div className="text-sm text-gray-500">Level {approval.approvalLevel} Approval</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {approval.workflowType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getUrgencyBadge(approval.isUrgent, approval.urgentDeadline)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(approval.requestedDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {approval.urgentDeadline ? (
                        <span className={
                          new Date(approval.urgentDeadline) < new Date() 
                            ? "text-red-600 font-medium" 
                            : "text-orange-600"
                        }>
                          {format(new Date(approval.urgentDeadline), "MMM dd, HH:mm")}
                        </span>
                      ) : (
                        <span className="text-gray-500">Standard</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => openApprovalDialog(approval)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Review
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => sendApprovalReminders(approval.requirementId)}
                        >
                          Remind
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {pendingApprovals.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-500">No pending approvals at this time.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Completed Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Completed Approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Decision</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedApprovals.slice(0, 10).map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell className="font-medium">{approval.requirementTitle}</TableCell>
                    <TableCell>
                      <Badge className={
                        approval.status === 'approved' 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }>
                        {approval.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {approval.responseDate && format(new Date(approval.responseDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {approval.comments || "No comments"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Approval Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Approval Request</DialogTitle>
            </DialogHeader>
            {selectedApproval && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Requirement Details</h3>
                    <p className="text-gray-600">{selectedApproval.requirementTitle}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Approval Level</label>
                      <p>Level {selectedApproval.approvalLevel}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Budget Threshold</label>
                      <p>${selectedApproval.budgetThreshold?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Workflow Type</label>
                      <p>{selectedApproval.workflowType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Priority</label>
                      {getUrgencyBadge(selectedApproval.isUrgent, selectedApproval.urgentDeadline)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comments (Optional)</label>
                  <Textarea
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                    placeholder="Add your comments or feedback..."
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleApproval('rejected')}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApproval('approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ApprovalDashboard;
