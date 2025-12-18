import React from "react";
import { useRequirement } from "@/contexts/RequirementContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ApprovalMatrixSelector } from "@/components/requirement/ApprovalMatrixSelector";
import { ApprovalMatrix } from "@/services/modules/approval-matrix/approval-matrix.types";
import { DollarSign, Flag, Clock, AlertTriangle } from "lucide-react";

interface ApprovalWorkflowStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ApprovalWorkflowStep: React.FC<ApprovalWorkflowStepProps> = () => {
  const { formData, updateFormData } = useRequirement();

  const budget = formData.estimatedBudget || 0;
  const priority = formData.priority || 'low';
  const requiresApproval = budget > 10000 ||
    priority === 'critical' ||
    priority === 'high' ||
    formData.complianceRequired;

  const getPriorityColor = () => {
    switch (priority) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleMatrixSelect = (matrix: ApprovalMatrix) => {
    updateFormData({
      selectedApprovalMatrixId: matrix.id,
      selectedApprovalMatrix: matrix
    });
  };

  return (
    <div className="space-y-6">
      {/* Compact Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="font-semibold text-foreground">
                ₹{budget.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Priority</p>
              <Badge variant="outline" className={getPriorityColor()}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${requiresApproval ? 'bg-orange-100' : 'bg-emerald-100'
              }`}>
              {requiresApproval ? (
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              ) : (
                <Clock className="h-5 w-5 text-emerald-600" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant="outline" className={
                requiresApproval
                  ? 'bg-orange-100 text-orange-700 border-orange-200'
                  : 'bg-emerald-100 text-emerald-700 border-emerald-200'
              }>
                {requiresApproval ? 'Approval Required' : 'No Approval'}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Approval Matrix Selection */}
      {requiresApproval && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Select Approval Matrix</Label>
          <p className="text-sm text-muted-foreground">
            Choose an approval workflow for this requirement.
          </p>
          <ApprovalMatrixSelector
            selectedMatrixId={formData.selectedApprovalMatrixId || null}
            onSelect={handleMatrixSelect}
          />
        </div>
      )}

      {/* Urgency Toggle */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="urgent-toggle" className="font-medium cursor-pointer">
              Mark as Urgent
            </Label>
            <p className="text-sm text-muted-foreground">
              Expedited approval with 24-48 hour timeline
            </p>
          </div>
          <Switch
            id="urgent-toggle"
            checked={formData.isUrgent || false}
            onCheckedChange={(checked) => updateFormData({ isUrgent: checked })}
          />
        </div>

        {formData.isUrgent && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-start gap-2 text-sm text-orange-700">
              <Clock className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p>Approvers will be notified immediately</p>
                <p>Target response: 24-48 hours</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ISO 9001 Compliance - Hidden as requested */}
      {/* <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="compliance-toggle" className="font-medium cursor-pointer">
              ISO 9001 Compliance
            </Label>
            <p className="text-sm text-muted-foreground">
              Enable additional compliance checks
            </p>
          </div>
          <Switch
            id="compliance-toggle"
            checked={formData.complianceRequired || false}
            onCheckedChange={(checked) => updateFormData({ complianceRequired: checked })}
          />
        </div>
      </Card> */}
    </div>
  );
};

export default ApprovalWorkflowStep;
