import React, { useState, useEffect } from 'react';
import { CreateApprovalLevelRequest, AvailableMember } from '@/services/modules/approval-matrix';
import { approvalMatrixService } from '@/services/modules/approval-matrix';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, UserPlus, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ApproverAssignmentPanelProps {
  level: CreateApprovalLevelRequest;
  onUpdate: (level: CreateApprovalLevelRequest) => void;
  onClose: () => void;
}

export const ApproverAssignmentPanel: React.FC<ApproverAssignmentPanelProps> = ({
  level,
  onUpdate,
  onClose,
}) => {
  const [members, setMembers] = useState<AvailableMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<{
    [key: string]: { member: AvailableMember; isMandatory: boolean };
  }>({});

  // Load existing approvers into selectedMembers on mount
  useEffect(() => {
    const existing: typeof selectedMembers = {};
    (level?.approvers || []).forEach((approver) => {
      existing[approver.memberId] = {
        member: {
          id: approver.memberId,
          firstName: '',
          lastName: '',
          fullName: 'Loading...',
          email: '',
          phone: '',
          role: '',
          isActive: true,
        },
        isMandatory: approver.isMandatory,
      };
    });
    setSelectedMembers(existing);
  }, [level]);

  // Fetch available members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await approvalMatrixService.getAvailableMembers({
          search: search || undefined,
        });
        if (response?.success && response?.data?.members) {
          setMembers(response.data.members);
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchMembers, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const toggleMember = (member: AvailableMember) => {
    setSelectedMembers((prev) => {
      const newSelection = { ...prev };
      if (newSelection[member.id]) {
        delete newSelection[member.id];
      } else {
        newSelection[member.id] = { member, isMandatory: true };
      }
      return newSelection;
    });
  };

  const toggleMandatory = (memberId: string) => {
    setSelectedMembers((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        isMandatory: !prev[memberId]?.isMandatory,
      },
    }));
  };

  const handleSave = () => {
    const approvers = Object.values(selectedMembers)
      .filter((item) => item?.member?.id)
      .map((item, index) => ({
        memberId: item?.member?.id || '',
        isMandatory: item?.isMandatory !== undefined ? item.isMandatory : true,
        sequence: index + 1,
      }));
    onUpdate({ ...level, approvers });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Assign Approvers - Level {level?.order}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Members */}
          {Object.keys(selectedMembers).length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg space-y-2">
              <Label>Selected Approvers ({Object.keys(selectedMembers).length})</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedMembers).map(([id, item]) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    className={
                      item.isMandatory
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }
                  >
                    {item.member.fullName || item.member.id}
                    <button onClick={() => toggleMandatory(id)} className="ml-2 text-xs">
                      {item.isMandatory ? 'M' : 'O'}
                    </button>
                    <button onClick={() => toggleMember(item.member)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                M = Mandatory, O = Optional. Click to toggle.
              </p>
            </div>
          )}

          {/* Available Members List */}
          <div className="border rounded-lg max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : members && members.length > 0 ? (
              <div className="divide-y">
                {members.map((member) => {
                  const isSelected = !!selectedMembers[member?.id || ''];
                  return (
                    <div
                      key={member?.id}
                      className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => toggleMember(member)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground truncate">
                              {member?.fullName || 'Unknown Member'}
                            </p>
                            {isSelected && (
                              <Badge
                                variant="secondary"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                Selected
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {member?.email || 'No email'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {member?.role || 'No role'}
                            </Badge>
                            {member?.department && (
                              <Badge variant="outline" className="text-xs">
                                {member.department}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMember(member);
                          }}
                        >
                          {isSelected ? (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No team members found</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Approvers ({Object.keys(selectedMembers).length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
