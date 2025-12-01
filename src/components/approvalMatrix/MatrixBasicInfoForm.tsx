import React from 'react';
import { CreateMatrixRequest } from '@/services/modules/approval-matrix';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MatrixBasicInfoFormProps {
  data: CreateMatrixRequest;
  onChange: (data: Partial<CreateMatrixRequest>) => void;
}

export const MatrixBasicInfoForm: React.FC<MatrixBasicInfoFormProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          Define the basic details of your approval matrix
        </p>
      </div>

      <div className="space-y-4">
        {/* Matrix Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Matrix Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Standard Procurement Approval"
            value={data?.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe when this approval matrix should be used..."
            value={data?.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
          />
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={data?.priority?.toString() || '1'}
            onValueChange={(value) => onChange({ priority: parseInt(value) })}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  Priority {num} {num === 1 && '(Highest)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Lower number = higher priority. Used to suggest matrices in order.
          </p>
        </div>

        {/* Default Matrix Toggle */}
        <div className="flex items-center justify-between space-x-2 p-3 bg-muted/30 rounded-md">
          <div className="space-y-0.5">
            <Label htmlFor="isDefault" className="cursor-pointer">
              Set as Default Matrix
            </Label>
            <p className="text-xs text-muted-foreground">
              This matrix will be automatically suggested when publishing requirements
            </p>
          </div>
          <Switch
            id="isDefault"
            checked={data?.isDefault || false}
            onCheckedChange={(checked) => onChange({ isDefault: checked })}
          />
        </div>
      </div>
    </div>
  );
};
