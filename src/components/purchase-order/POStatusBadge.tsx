import React from 'react';
import { Badge } from '@/components/ui/badge';
import { POStatus } from '@/services/modules/purchase-orders';

interface POStatusBadgeProps {
  status: POStatus;
  className?: string;
}

export const POStatusBadge: React.FC<POStatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: POStatus) => {
    const configs = {
      draft: {
        label: 'Draft',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
      },
      pending_approval: {
        label: 'Pending Approval',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      approved: {
        label: 'Approved',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      in_progress: {
        label: 'In Progress',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
      },
      completed: {
        label: 'Completed',
        className: 'bg-green-100 text-green-800 border-green-200',
      },
      cancelled: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800 border-red-200',
      },
    };

    return configs[status] || {
      label: status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown',
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    };
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={`${config.className} ${className || ''}`} variant="outline">
      {config.label}
    </Badge>
  );
};
