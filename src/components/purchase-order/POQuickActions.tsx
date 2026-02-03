import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, CheckCircle, XCircle, Download, Edit, MoreVertical, Send, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { POStatus } from '@/services/modules/purchase-orders';

interface POQuickActionsProps {
  orderId: string;
  status: POStatus;
  onApprove?: () => void;
  onReject?: () => void;
  onExport?: () => void;
  onSubmit?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const POQuickActions: React.FC<POQuickActionsProps> = ({
  orderId,
  status,
  onApprove,
  onReject,
  onExport,
  onSubmit,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/purchase-orders/${orderId}`);
  };

  const showApprovalActions = status === 'pending_approval';
  const showSubmitAction = status === 'draft';
  const canEdit = ['draft', 'cancelled'].includes(status);
  const canDelete = ['draft', 'cancelled'].includes(status);

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleView}
        className="gap-1"
      >
        <Eye className="h-4 w-4" />
        View
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {showSubmitAction && (
            <DropdownMenuItem onClick={onSubmit} className="text-primary">
              <Send className="h-4 w-4 mr-2" />
              Submit to Vendor
            </DropdownMenuItem>
          )}
          {showApprovalActions && (
            <>
              <DropdownMenuItem onClick={onApprove}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onReject}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </DropdownMenuItem>
            </>
          )}
          {canEdit && onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          {canDelete && onDelete && (
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
