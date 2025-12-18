import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, XCircle } from 'lucide-react';

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirementTitle: string;
  onConfirm: (reason: string, comments: string, allowResubmission: boolean) => Promise<void>;
  isLoading?: boolean;
}

export const RejectDialog: React.FC<RejectDialogProps> = ({
  open,
  onOpenChange,
  requirementTitle,
  onConfirm,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [allowResubmission, setAllowResubmission] = useState(true);

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    await onConfirm(reason, comments, allowResubmission);
    setReason('');
    setComments('');
    setAllowResubmission(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Reject Requirement
          </DialogTitle>
          <DialogDescription>
            You are about to reject: <strong>{requirementTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Rejection Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for rejection..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comments">Additional Comments (optional)</Label>
            <Textarea
              id="comments"
              placeholder="Add any additional comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-resubmit">Allow Resubmission</Label>
            <Switch
              id="allow-resubmit"
              checked={allowResubmission}
              onCheckedChange={setAllowResubmission}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isLoading || !reason.trim()} 
            variant="destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              'Reject'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDialog;
