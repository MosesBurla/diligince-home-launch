import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RoleSelectionCombobox } from './RoleSelectionCombobox';
import { TeamMember, RoleDetails } from '@/services/modules/team-members';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EditMemberRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roleId: string, reason?: string) => Promise<void>;
  member: TeamMember | null;
  roles: RoleDetails[];
}

export const EditMemberRoleModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  member, 
  roles 
}: EditMemberRoleModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId || selectedRoleId === member?.assignedRole?.id) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(selectedRoleId, reason);
      handleClose();
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedRoleId('');
    setReason('');
    onClose();
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Change Role: {member.fullName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Current Role</h3>
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {member.assignedRole?.name || 'No role assigned'}
                    </CardTitle>
                    {member.assignedRole?.isDefault && (
                      <Badge variant="outline">Default Role</Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">
                    {member.assignedRole?.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                {member.assignedRole && (
                  <CardContent className="text-xs text-muted-foreground">
                    Assigned: {new Date(member.assignedRole.assignedAt).toLocaleDateString()} by{' '}
                    {member.assignedRole.assignedBy.name}
                  </CardContent>
                )}
              </Card>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Select New Role *</h3>
              <RoleSelectionCombobox
                value={selectedRoleId}
                onChange={setSelectedRoleId}
                roles={roles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Change (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Promotion, department transfer, responsibility change..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedRoleId || selectedRoleId === member.assignedRole?.id}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
