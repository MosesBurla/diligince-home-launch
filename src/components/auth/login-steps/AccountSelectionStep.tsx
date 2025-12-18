import React from 'react';
import { Building2, Users, Package, ArrowLeft, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { AvailableAccount } from '@/services/modules/auth';
import { formatDistanceToNow } from 'date-fns';

interface AccountSelectionStepProps {
  accounts: AvailableAccount[];
  selectedAccount: AvailableAccount | null;
  onSelectAccount: (account: AvailableAccount) => void;
  onBack: () => void;
  email: string;
}

export const AccountSelectionStep: React.FC<AccountSelectionStepProps> = ({
  accounts,
  selectedAccount,
  onSelectAccount,
  onBack,
  email,
}) => {
  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'industry':
        return Building2;
      case 'professional':
        return Users;
      case 'vendor':
        return Package;
      default:
        return Users;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'industry':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'professional':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'vendor':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '??';
  };

  const getDisplayName = (account: AvailableAccount) => {
    if (account.firstName && account.lastName) {
      return `${account.firstName} ${account.lastName}`;
    }
    return account.email || account.role || 'User';
  };

  const getAccountId = (account: AvailableAccount) => {
    return account.id || account.accountId || account.role;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <p className="text-center text-muted-foreground mb-6">
        Multiple accounts found for <span className="font-medium text-foreground">{email}</span>
      </p>

      <div className="grid gap-4">
        {accounts.map((account) => {
          const Icon = getUserTypeIcon(account.userType);
          const accountId = getAccountId(account);
          const isSelected = selectedAccount?.id === account.id || selectedAccount?.accountId === account.accountId;
          const isInactive = account.isActive === false;

          return (
            <div
              key={accountId}
              onClick={() => !isInactive && onSelectAccount(account)}
              className={`p-6 rounded-xl border-2 transition-all ${
                isInactive
                  ? 'border-muted bg-muted/30 cursor-not-allowed opacity-60'
                  : isSelected
                  ? 'border-primary bg-primary/5 cursor-pointer hover:shadow-md'
                  : 'border-border hover:border-primary/50 cursor-pointer hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={account.avatar} alt={getDisplayName(account)} />
                  <AvatarFallback className="text-lg">
                    {getInitials(account.firstName, account.lastName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {getDisplayName(account)}
                      </h3>
                      {account.companyName && (
                        <p className="text-sm text-muted-foreground">{account.companyName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isInactive && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Inactive
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`${getUserTypeColor(account.userType)} flex items-center space-x-1`}
                      >
                        <Icon className="w-3 h-3" />
                        <span className="capitalize">{account.userType}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <Badge variant="secondary" className="font-normal">
                      {account.role}
                    </Badge>
                    {account.lastLogin && (
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          Last login {formatDistanceToNow(new Date(account.lastLogin), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
