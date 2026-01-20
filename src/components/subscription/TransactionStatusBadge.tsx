import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import type { TransactionStatus } from '@/data/mockSubscriptionData';
import { cn } from '@/lib/utils';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<TransactionStatus, { 
  label: string; 
  icon: typeof CheckCircle;
  className: string;
}> = {
  success: {
    label: 'Success',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
  }
};

export const TransactionStatusBadge = ({ 
  status, 
  className,
  showIcon = true 
}: TransactionStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-medium gap-1.5',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {config.label}
    </Badge>
  );
};

export default TransactionStatusBadge;
