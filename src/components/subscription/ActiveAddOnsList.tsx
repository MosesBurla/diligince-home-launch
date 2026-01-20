import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Plug, 
  Plus, 
  Calendar, 
  Zap, 
  Network, 
  Sparkles, 
  FileSearch, 
  Bot 
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import type { ActiveAddOn } from '@/data/mockSubscriptionData';
import { formatCurrency } from '@/data/mockSubscriptionData';
import { cn } from '@/lib/utils';

interface ActiveAddOnsListProps {
  addOns: ActiveAddOn[];
  onAddMore?: () => void;
  className?: string;
}

const addOnIcons: Record<string, typeof Network> = {
  DILIGIENCE_HUB: Network,
  AI_RECOMMENDATION_PACK: Sparkles,
  AI_QUOTATION_ANALYSIS_PACK: FileSearch,
  BOT_V2_ADDON: Bot
};

export const ActiveAddOnsList = ({ 
  addOns, 
  onAddMore,
  className 
}: ActiveAddOnsListProps) => {
  if (addOns.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plug className="h-5 w-5 text-muted-foreground" />
            Active Add-ons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Plug className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No active add-ons</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enhance your plan with powerful add-ons
            </p>
            <Button onClick={onAddMore} className="gap-2">
              <Plus className="h-4 w-4" />
              Browse Add-ons
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Plug className="h-5 w-5 text-primary" />
          Active Add-ons
          <Badge variant="secondary" className="ml-2">{addOns.length}</Badge>
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onAddMore} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add More
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {addOns.map((addOn) => {
          const Icon = addOnIcons[addOn.code] || Zap;
          const daysRemaining = addOn.expiresAt 
            ? differenceInDays(parseISO(addOn.expiresAt), new Date())
            : null;
          
          const creditsPercent = addOn.creditsRemaining && addOn.creditsTotal
            ? (addOn.creditsRemaining / addOn.creditsTotal) * 100
            : null;

          return (
            <div 
              key={addOn.code}
              className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium flex items-center gap-2">
                      {addOn.name}
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'text-xs',
                          addOn.type === 'subscription' 
                            ? 'bg-blue-100 text-blue-700 border-blue-200' 
                            : 'bg-purple-100 text-purple-700 border-purple-200'
                        )}
                      >
                        {addOn.type === 'subscription' ? 'Monthly' : 'Usage'}
                      </Badge>
                    </h4>
                    
                    {/* Subscription type - show expiry */}
                    {addOn.type === 'subscription' && addOn.expiresAt && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          Expires {format(parseISO(addOn.expiresAt), 'MMM d, yyyy')}
                          {daysRemaining !== null && daysRemaining <= 7 && (
                            <span className="text-amber-600 ml-1">
                              ({daysRemaining} days left)
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    
                    {/* Usage type - show credits */}
                    {addOn.type === 'usage' && addOn.creditsRemaining !== undefined && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Credits remaining</span>
                          <span className="font-medium">
                            {addOn.creditsRemaining}/{addOn.creditsTotal}
                          </span>
                        </div>
                        <Progress 
                          value={creditsPercent || 0} 
                          className={cn(
                            'h-1.5',
                            creditsPercent && creditsPercent < 25 && '[&>div]:bg-amber-500'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-semibold text-foreground">
                    {formatCurrency(addOn.price)}
                  </span>
                  {addOn.billingCycle && (
                    <span className="text-sm text-muted-foreground">/mo</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ActiveAddOnsList;
