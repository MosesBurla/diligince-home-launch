
import React, { useState, useEffect } from "react";
import { useRequirement } from "@/contexts/RequirementContext";
import { CommentsSection } from "@/components/requirement/CommentsSection";
import { useApproval } from "@/contexts/ApprovalContext";
import { steps } from "@/components/requirement/RequirementStepIndicator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, AlertTriangle, Shield, CheckCircle, XCircle, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ApprovalWorkflowStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ApprovalWorkflowStep: React.FC<ApprovalWorkflowStepProps> = ({ onNext, onPrevious }) => {
  const { formData, updateFormData } = useRequirement();
  const { createApprovalWorkflow, approvalMatrix, getApprovalWorkflow } = useApproval();
  const [workflowCreated, setWorkflowCreated] = useState(false);
  const [approvalWorkflow, setApprovalWorkflow] = useState<any>(null);

  useEffect(() => {
    const workflow = getApprovalWorkflow(formData.title || 'unknown');
    if (workflow) {
      setApprovalWorkflow(workflow);
      setWorkflowCreated(true);
    }
  }, [formData.title, getApprovalWorkflow]);

  const determineApprovalLevel = () => {
    const budget = formData.budget || 0;
    const priority = formData.priority || 'low';
    
    if (budget >= 100000 || priority === 'critical') return 'critical';
    if (budget >= 25000 || priority === 'high') return 'high';
    if (budget >= 5000 || priority === 'medium') return 'medium';
    return 'low';
  };

  const approvalLevel = determineApprovalLevel();
  const policy = approvalMatrix[approvalLevel as keyof typeof approvalMatrix];
  const requiresApproval = (formData.budget || 0) > 10000 || 
                          formData.priority === 'critical' || 
                          formData.priority === 'high' || 
                          formData.complianceRequired;

  const isCritical = formData.priority === 'critical';

  const handleCreateWorkflow = () => {
    if (!formData.title) {
      toast.error("Please complete basic information first");
      return;
    }

    const workflowId = createApprovalWorkflow(formData);
    updateFormData({ approvalWorkflowId: workflowId });
    setWorkflowCreated(true);
    
    if (isCritical) {
      toast.warning("URGENT: Critical requirement workflow created. Director-level approval assigned.");
    } else {
      toast.success("Approval workflow created successfully");
    }
  };

  const handleSkipApproval = () => {
    updateFormData({ approvalStatus: 'not_required' });
    onNext();
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getApprovalProgress = () => {
    if (!approvalWorkflow) return 0;
    return Math.round((approvalWorkflow.completedApprovals / approvalWorkflow.totalApprovals) * 100);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">{steps[3].name}</h2>
        <p className="text-gray-600">
          {steps[3].description}
        </p>
      </div>

      {/* Critical Requirement Alert Banner */}
      {isCritical && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-800">URGENT REQUIREMENT</h3>
          </div>
          <p className="text-sm text-red-700">
            This is an URGENT requirement. Fast approval is required as per ISO 9001 guidelines.
            Director-level approval will be automatically assigned for expedited processing.
          </p>
        </div>
      )}

      {/* Approval Requirements Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Approval Requirements Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                ${(formData.budget || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Budget</div>
            </div>
            <div className="text-center">
              <Badge className={
                formData.priority === 'critical' ? 'bg-red-100 text-red-800' :
                formData.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                formData.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }>
                {formData.priority || 'Not Set'}
              </Badge>
              <div className="text-sm text-gray-500 mt-1">Priority Level</div>
            </div>
            <div className="text-center">
              <Badge className={
                requiresApproval ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
              }>
                {requiresApproval ? 'Required' : 'Not Required'}
              </Badge>
              <div className="text-sm text-gray-500 mt-1">Approval Status</div>
            </div>
          </div>

          {requiresApproval && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h3 className="font-medium text-yellow-800">Approval Required</h3>
              </div>
              <p className="text-sm text-yellow-700">
                This requirement requires approval due to budget ({formData.budget ? `$${formData.budget.toLocaleString()}` : 'TBD'}), 
                priority level ({formData.priority}), or compliance requirements.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {requiresApproval && (
        <>
          {/* Approval Chain Display */}
          {workflowCreated && approvalWorkflow && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Approval Chain Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{getApprovalProgress()}%</span>
                  </div>
                  <Progress value={getApprovalProgress()} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  {approvalWorkflow.approvalRequests.map((request: any, index: number) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{request.approverName}</div>
                          <div className="text-sm text-gray-500">{request.approverRole}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getApprovalStatusBadge(request.status)}
                        {request.isUrgent && (
                          <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Approval Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Approval Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base">Urgency Level</Label>
                <RadioGroup
                  value={formData.isUrgent ? "urgent" : "normal"}
                  onValueChange={(value) => updateFormData({ isUrgent: value === "urgent" })}
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-3 rounded-md border p-3">
                    <RadioGroupItem value="normal" id="normal-approval" />
                    <div className="space-y-1">
                      <Label htmlFor="normal-approval" className="font-medium">
                        Standard Approval Process
                      </Label>
                      <p className="text-sm text-gray-500">
                        Sequential approval process with standard timelines (5-7 business days)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-md border p-3">
                    <RadioGroupItem value="urgent" id="urgent-approval" />
                    <div className="space-y-1">
                      <Label htmlFor="urgent-approval" className="font-medium">
                        Urgent Approval Process
                      </Label>
                      <p className="text-sm text-gray-500">
                        Expedited parallel approval with 24-48 hour timeline and emergency publish option
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base">Required Approvers</Label>
                <div className="space-y-2">
                  {policy.requiredApprovers.map((approver, index) => (
                    <div key={approver} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">
                          {approver.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-gray-500">
                          Level {index + 1} • Required for {approvalLevel} priority requirements
                        </div>
                      </div>
                      <Badge variant="outline">Required</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compliance-required" className="cursor-pointer">
                      ISO 9001 Compliance Required
                    </Label>
                    <p className="text-sm text-gray-500">
                      Enable additional compliance checks and documentation
                    </p>
                  </div>
                  <Switch
                    id="compliance-required"
                    checked={formData.complianceRequired || false}
                    onCheckedChange={(checked) => updateFormData({ complianceRequired: checked })}
                  />
                </div>
              </div>

              {(formData.isUrgent || isCritical) && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <h3 className="font-medium text-orange-800">
                      {isCritical ? 'Critical' : 'Urgent'} Approval Timeline
                    </h3>
                  </div>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Approvers will be notified immediately</li>
                    <li>• Target response time: {policy.urgentApprovalHours} hours</li>
                    <li>• Emergency publish available if approvals are delayed</li>
                    <li>• Auto-escalation after {policy.autoEscalationHours} hours</li>
                    {isCritical && <li>• Director-level approval automatically assigned</li>}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workflow Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Status</CardTitle>
            </CardHeader>
            <CardContent>
              {!workflowCreated ? (
                <div className="text-center py-6">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Approval Workflow Not Created
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Click the button below to create and initiate the approval workflow for this requirement.
                  </p>
                  <Button onClick={handleCreateWorkflow}>
                    Create Approval Workflow
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Approval Workflow Created</span>
                  </div>
                  {approvalWorkflow && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Status: <span className="font-medium">{approvalWorkflow.status}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Progress: {approvalWorkflow.completedApprovals}/{approvalWorkflow.totalApprovals} approvals completed
                      </p>
                      <p className="text-sm text-gray-600">
                        Type: <span className="font-medium">{approvalWorkflow.workflowType}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approver Comments Section */}
          {workflowCreated && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Approver Comments & Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add comments, questions, or feedback for approvers to review with this requirement.
                </p>
                <CommentsSection
                  requirementId={formData.approvalWorkflowId || 'pending'}
                  commentType="approval_request"
                  title=""
                  placeholder="Add comments for approvers..."
                />
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="flex items-center justify-between gap-4 pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
        >
          Previous
        </Button>
        <div className="flex gap-3">
          {!requiresApproval && (
            <Button
              variant="outline"
              onClick={handleSkipApproval}
            >
              Skip Approval
            </Button>
          )}
          <Button 
            onClick={onNext}
            disabled={requiresApproval && !workflowCreated}
          >
            Continue to Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflowStep;
