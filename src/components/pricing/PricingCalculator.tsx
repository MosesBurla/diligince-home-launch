import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Sparkles, 
  X, 
  ArrowRight, 
  Check,
  Trash2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { usePricingSelection } from '@/contexts/PricingSelectionContext';
import { 
  calculatePricingBreakdown, 
  formatPriceValue, 
  formatCurrency,
  GST_RATE 
} from '@/utils/pricingCalculations';
import { userTypes } from '@/data/pricingData';

interface PricingCalculatorProps {
  className?: string;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ className }) => {
  const navigate = useNavigate();
  const { 
    selection, 
    removeAddOn, 
    clearSelection, 
    hasValidSelection 
  } = usePricingSelection();

  const breakdown = calculatePricingBreakdown(
    selection?.selectedPlan || null,
    selection?.selectedAddOns || []
  );

  const userTypeConfig = userTypes.find(t => t.id === selection?.userType);
  const UserTypeIcon = userTypeConfig?.icon;

  // Map pricing user type to signup tab
  const getSignupPath = () => {
    if (!selection?.userType) return '/signup';
    
    const mapping: Record<string, string> = {
      'industry': '/signup?tab=industry',
      'service_vendor': '/signup?tab=vendor&category=service',
      'product_vendor': '/signup?tab=vendor&category=product',
      'logistics': '/signup?tab=vendor&category=logistics',
      'professional': '/signup?tab=professional',
    };
    
    return mapping[selection.userType] || '/signup';
  };

  const handleSignUp = () => {
    navigate(getSignupPath());
  };

  if (!hasValidSelection) {
    return (
      <Card className={cn(
        "bg-white/80 backdrop-blur-sm border border-[hsl(210,64%,23%,0.1)]",
        "shadow-lg transition-all duration-300",
        className
      )}>
        <CardContent className="p-6 text-center">
          <div className="p-4 rounded-full bg-[hsl(210,64%,23%,0.05)] w-fit mx-auto mb-4">
            <Calculator className="h-8 w-8 text-[hsl(210,64%,23%,0.4)]" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Select a Plan
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a subscription plan above to see your pricing breakdown
          </p>
        </CardContent>
      </Card>
    );
  }

  const isCustomPricing = selection?.selectedPlan?.isCustomPricing;

  return (
    <Card className={cn(
      "bg-white/90 backdrop-blur-sm border border-[hsl(210,64%,23%,0.15)]",
      "shadow-xl transition-all duration-500",
      "hover:shadow-2xl hover:border-[hsl(210,64%,23%,0.25)]",
      className
    )}>
      {/* Header */}
      <CardHeader className="pb-3 border-b border-[hsl(210,64%,23%,0.1)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(210,64%,23%)] to-[hsl(210,64%,30%)]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Your Selection</h3>
              <p className="text-xs text-muted-foreground">Pricing Calculator</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearSelection}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col max-h-[calc(100vh-200px)] overflow-hidden">
        {/* Scrollable: Plan selection + Add-ons only */}
        <div 
          className="max-h-[200px] overflow-auto flex-shrink-0 pr-2"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Selected Plan */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              {UserTypeIcon && (
                <UserTypeIcon className="h-4 w-4 text-[hsl(210,64%,23%)]" />
              )}
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {userTypeConfig?.label} Plan
              </span>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-[hsl(210,64%,23%,0.05)] to-transparent border border-[hsl(210,64%,23%,0.1)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(210,64%,23%)]" />
                  <span className="font-medium text-foreground">
                    {selection?.selectedPlan?.name}
                  </span>
                  {selection?.selectedPlan?.isPopular && (
                    <Badge variant="outline" className="text-xs border-[hsl(210,64%,23%,0.3)] text-[hsl(210,64%,23%)]">
                      Popular
                    </Badge>
                  )}
                </div>
                <span className="font-semibold text-foreground">
                  {isCustomPricing ? 'Custom' : `${formatPriceValue(breakdown.planMonthly)}/mo`}
                </span>
              </div>
            </div>
          </div>

          {/* Selected Add-ons */}
          {selection?.selectedAddOns && selection.selectedAddOns.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Add-ons ({selection.selectedAddOns.length})
                </span>
              </div>
              <div className="space-y-2">
                {selection.selectedAddOns.map(addon => (
                  <div 
                    key={addon.code}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[hsl(210,64%,23%,0.03)] border border-[hsl(210,64%,23%,0.08)] group"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[hsl(210,64%,23%)]" />
                      <span className="text-sm text-foreground">{addon.name}</span>
                      {addon.type === 'usage' && (
                        <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-700 bg-amber-50">
                          One-time
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(addon.price)}
                        {addon.type === 'subscription' && <span className="text-xs text-muted-foreground">/mo</span>}
                      </span>
                      <button
                        onClick={() => removeAddOn(addon.code)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Always Visible: Cost Breakdown + Total + CTA */}
        {!isCustomPricing && (
          <div className="mt-4 border-t border-[hsl(210,64%,23%,0.1)] pt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-4 w-4 text-[hsl(210,64%,23%)]" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Cost Breakdown
                </span>
              </div>

              {/* Monthly Subscription */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Subscription</span>
                <span className="text-foreground">{formatPriceValue(breakdown.planMonthly)}</span>
              </div>

              {/* Monthly Add-ons */}
              {breakdown.addOnsMonthly > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Add-ons</span>
                  <span className="text-foreground">{formatCurrency(breakdown.addOnsMonthly)}</span>
                </div>
              )}

              {/* One-time Add-ons */}
              {breakdown.addOnsOneTime > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">One-time Add-ons</span>
                  <span className="text-foreground">{formatCurrency(breakdown.addOnsOneTime)}</span>
                </div>
              )}

              <Separator className="my-2" />

              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">
                  {formatPriceValue(breakdown.subtotalMonthly)}
                  {breakdown.addOnsOneTime > 0 && ` + ${formatCurrency(breakdown.addOnsOneTime)}`}
                </span>
              </div>

              {/* GST */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  GST ({GST_RATE * 100}%)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Goods and Services Tax applicable in India</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                <span className="text-foreground">
                  {formatPriceValue(breakdown.gstMonthly)}
                  {breakdown.gstOneTime > 0 && ` + ${formatCurrency(breakdown.gstOneTime)}`}
                </span>
              </div>

              <Separator className="my-2" />

              {/* First Month Total */}
              <div className="flex justify-between items-center p-3 -mx-1 rounded-lg bg-gradient-to-r from-[hsl(210,64%,23%,0.08)] to-[hsl(210,64%,23%,0.03)]">
                <span className="font-semibold text-foreground">First Month Total</span>
                <span className="font-bold text-lg text-[hsl(210,64%,23%)]">
                  {formatPriceValue(breakdown.firstMonthTotal)}
                </span>
              </div>

              {/* Recurring Monthly (if different from first month) */}
              {breakdown.addOnsOneTime > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Then monthly</span>
                  <span className="text-foreground font-medium">
                    {formatPriceValue(breakdown.recurringMonthly)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA Button - always visible */}
        <div className="mt-4 pt-4 border-t border-[hsl(210,64%,23%,0.1)]">
          <Button
            onClick={handleSignUp}
            className="w-full bg-gradient-to-r from-[hsl(210,64%,23%)] to-[hsl(210,64%,30%)] hover:from-[hsl(210,64%,18%)] hover:to-[hsl(210,64%,25%)] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
          >
            <span className="flex items-center gap-2">
              Sign Up & Get Started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <Info className="h-3 w-3" />
            Profile verification required before purchase
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
