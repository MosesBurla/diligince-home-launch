import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, Shield } from 'lucide-react';

interface BankVerificationStatusProps {
  status: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  onVerify: () => void;
  isLocked: boolean;
}

const BankVerificationStatus: React.FC<BankVerificationStatusProps> = ({
  status,
  verifiedAt,
  onVerify,
  isLocked
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircle2 size={24} />,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-950/20',
          borderColor: 'border-green-200 dark:border-green-800',
          badge: 'bg-green-100 text-green-800 border-green-200',
          title: 'Bank Account Verified',
          description: verifiedAt
            ? `Verified on ${new Date(verifiedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}`
            : 'Your bank account has been successfully verified.',
        };
      case 'rejected':
        return {
          icon: <XCircle size={24} />,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-950/20',
          borderColor: 'border-red-200 dark:border-red-800',
          badge: 'bg-red-100 text-red-800 border-red-200',
          title: 'Verification Rejected',
          description: 'Please review your details and submit again for verification.',
        };
      default:
        return {
          icon: <Clock size={24} />,
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-50 dark:bg-amber-950/20',
          borderColor: 'border-amber-200 dark:border-amber-800',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          title: 'Verification Pending',
          description: 'Your bank account details are awaiting verification.',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className={`${config.borderColor} ${config.bgColor}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full bg-background ${config.color}`}>
            {config.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`font-semibold text-lg ${config.color}`}>
                {config.title}
              </h3>
              <Badge className={config.badge}>
                {status === 'verified' && 'Verified'}
                {status === 'pending' && 'Pending'}
                {status === 'rejected' && 'Rejected'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {config.description}
            </p>
            
            {status === 'pending' && !isLocked && (
              <Button
                onClick={onVerify}
                size="sm"
                className="gap-2"
              >
                <Shield size={16} />
                Submit for Verification
              </Button>
            )}
            
            {status === 'rejected' && !isLocked && (
              <Button
                onClick={onVerify}
                size="sm"
                variant="destructive"
                className="gap-2"
              >
                <Shield size={16} />
                Re-submit for Verification
              </Button>
            )}
            
            {status === 'verified' && (
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                <Shield size={16} />
                <span className="font-medium">Account secured and locked</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankVerificationStatus;
