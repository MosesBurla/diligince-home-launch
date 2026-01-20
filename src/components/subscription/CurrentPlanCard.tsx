import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import type { CurrentSubscription } from '@/data/mockSubscriptionData';
import { formatCurrency } from '@/data/mockSubscriptionData';
import { cn } from '@/lib/utils';

interface CurrentPlanCardProps {
  subscription: CurrentSubscription;
  onUpgrade?: () => void;
  onManage?: () => void;
  className?: string;
}

const tierColors: Record<string, string> = {
  free: 'bg-slate-100 text-slate-700 border-slate-200',
  plus: 'bg-blue-100 text-blue-700 border-blue-200',
  pro: 'bg-purple-100 text-purple-700 border-purple-200',
  enterprise: 'bg-amber-100 text-amber-700 border-amber-200'
};

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-green-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' },
  expired: { label: 'Expired', color: 'bg-gray-500' },
  pending: { label: 'Pending', color: 'bg-amber-500' },
  trial: { label: 'Trial', color: 'bg-blue-500' }
};

export const CurrentPlanCard = ({ 
  subscription, 
  onUpgrade,
  onManage,
  className 
}: CurrentPlanCardProps) => {
  const daysRemaining = differenceInDays(
    parseISO(subscription.currentPeriodEnd),
    new Date()
  );
  
  const totalDays = differenceInDays(
    parseISO(subscription.currentPeriodEnd),
    parseISO(subscription.currentPeriodStart)
  );
  
  const progressPercent = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));

  const status = statusConfig[subscription.status];

  return (
    <Card className={cn(
      'relative overflow-hidden border-2',
      subscription.tier === 'pro' && 'border-primary/30',
      subscription.tier === 'enterprise' && 'border-amber-500/30',
      className
    )}>
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-32 translate-x-32" />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {subscription.planName}
                <Badge variant="outline" className={cn('text-xs', tierColors[subscription.tier])}>
                  {subscription.tier.toUpperCase()}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('h-2 w-2 rounded-full', status.color)} />
                <span className="text-sm text-muted-foreground">{status.label}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(subscription.amount)}
            </div>
            <span className="text-sm text-muted-foreground">
              /{subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Billing Period Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Billing Period
            </span>
            <span className="font-medium">{daysRemaining} days remaining</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{format(parseISO(subscription.currentPeriodStart), 'MMM d, yyyy')}</span>
            <span>{format(parseISO(subscription.currentPeriodEnd), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {/* Next Billing */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Next billing date</span>
          </div>
          <span className="font-medium text-sm">
            {format(parseISO(subscription.nextBillingDate), 'MMMM d, yyyy')}
          </span>
        </div>

        {/* Plan Features */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Plan Features
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {subscription.features.slice(0, 6).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
          {subscription.features.length > 6 && (
            <p className="text-xs text-muted-foreground">
              +{subscription.features.length - 6} more features
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {subscription.tier !== 'enterprise' && (
            <Button 
              onClick={onUpgrade}
              className="flex-1 gap-2"
            >
              Upgrade Plan
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={onManage}
            className="flex-1"
          >
            Manage Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPlanCard;
