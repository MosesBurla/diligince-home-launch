import React, { useState } from 'react';
import { CreateApprovalLevelRequest } from '@/services/modules/approval-matrix';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  X,
  Users,
} from 'lucide-react';
import { ApproverAssignmentPanel } from './ApproverAssignmentPanel';

interface LevelCardProps {
  level: CreateApprovalLevelRequest;
  index: number;
  totalLevels: number;
  onUpdate: (level: CreateApprovalLevelRequest) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  index,
  totalLevels,
  onUpdate,
  onRemove,
  onMove,
}) => {
  const [showApproverPanel, setShowApproverPanel] = useState(false);

  const getLevelColor = (order: number) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-green-50 text-green-700 border-green-200',
      'bg-amber-50 text-amber-700 border-amber-200',
      'bg-purple-50 text-purple-700 border-purple-200',
    ];
    return colors[(order - 1) % colors.length] || colors[0];
  };

  const mandatoryCount = level?.approvers?.filter((a) => a?.isMandatory).length || 0;
  const optionalCount = (level?.approvers?.length || 0) - mandatoryCount;

  return (
    <>
      <div className="bg-muted/30 rounded-lg border p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={getLevelColor(level?.order || 0)}>
              Level {level?.order || index + 1}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {level?.approvers?.length || 0} approvers
                {level?.approvers?.length ? (
                  <>
                    {' '}({mandatoryCount} mandatory, {optionalCount} optional)
                  </>
                ) : null}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMove('up')}
              disabled={index === 0}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMove('down')}
              disabled={index === totalLevels - 1}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        {/* Level Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Level Name</Label>
            <Input
              placeholder="e.g., Department Head Approval"
              value={level?.name || ''}
              onChange={(e) => onUpdate({ ...level, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Approval Time (Hours)</Label>
            <Input
              type="number"
              min={1}
              max={720}
              value={level?.maxApprovalTimeHours || 24}
              onChange={(e) =>
                onUpdate({ ...level, maxApprovalTimeHours: parseInt(e.target.value) || 24 })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Describe this approval stage..."
            value={level?.description || ''}
            onChange={(e) => onUpdate({ ...level, description: e.target.value })}
            rows={2}
          />
        </div>

        {/* Required Toggle */}
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-md">
          <div className="space-y-0.5">
            <Label className="cursor-pointer">Required Level</Label>
            <p className="text-xs text-muted-foreground">
              This level must be completed before moving to the next
            </p>
          </div>
          <Switch
            checked={level?.isRequired !== undefined ? level.isRequired : true}
            onCheckedChange={(checked) => onUpdate({ ...level, isRequired: checked })}
          />
        </div>

        {/* Approvers Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Approvers ({level?.approvers?.length || 0})</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApproverPanel(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Assign Members
            </Button>
          </div>
          {level?.approvers && level.approvers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {level.approvers.map((approver, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className={
                    approver?.isMandatory
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }
                >
                  Member: {approver?.memberId?.slice(0, 8)}...
                  {approver?.isMandatory && ' (M)'}
                  <button
                    onClick={() => {
                      const updatedApprovers = (level.approvers || []).filter(
                        (_, index) => index !== i
                      );
                      onUpdate({ ...level, approvers: updatedApprovers });
                    }}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Approver Assignment Panel */}
      {showApproverPanel && (
        <ApproverAssignmentPanel
          level={level}
          onUpdate={onUpdate}
          onClose={() => setShowApproverPanel(false)}
        />
      )}
    </>
  );
};
