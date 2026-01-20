import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePricingSelection } from '@/contexts/PricingSelectionContext';
import { formatPriceValue, calculatePricingBreakdown } from '@/utils/pricingCalculations';
import { userTypes } from '@/data/pricingData';
import { cn } from '@/lib/utils';

interface PricingSelectionBannerProps {
  currentTab: string;
  vendorCategory?: string;
}

export const PricingSelectionBanner: React.FC<PricingSelectionBannerProps> = ({ 
  currentTab,
  vendorCategory 
}) => {
  const navigate = useNavigate();
  const { selection, clearSelection, hasValidSelection } = usePricingSelection();

  if (!hasValidSelection || !selection) return null;

  // Check if current signup form matches pricing selection
  const isMatchingUserType = () => {
    const mapping: Record<string, { tab: string; category?: string }> = {
      'industry': { tab: 'industry' },
      'service_vendor': { tab: 'vendor', category: 'service' },
      'product_vendor': { tab: 'vendor', category: 'product' },
      'logistics': { tab: 'vendor', category: 'logistics' },
      'professional': { tab: 'professional' },
    };
    
    const expected = mapping[selection.userType];
    if (!expected) return false;
    
    if (currentTab !== expected.tab) return false;
    if (expected.category && vendorCategory && vendorCategory !== expected.category) return false;
    
    return true;
  };

  const isMatching = isMatchingUserType();
  const userTypeConfig = userTypes.find(t => t.id === selection.userType);
  const breakdown = calculatePricingBreakdown(selection.selectedPlan, selection.selectedAddOns);

  return (
    <div className={cn(
      "mb-6 p-4 rounded-xl border transition-all duration-300",
      isMatching 
        ? "bg-gradient-to-r from-[hsl(210,64%,23%,0.05)] to-[hsl(210,64%,23%,0.02)] border-[hsl(210,64%,23%,0.2)]"
        : "bg-amber-50/50 border-amber-200"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            isMatching 
              ? "bg-[hsl(210,64%,23%,0.1)]" 
              : "bg-amber-100"
          )}>
            <Sparkles className={cn(
              "h-4 w-4",
              isMatching ? "text-[hsl(210,64%,23%)]" : "text-amber-600"
            )} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground text-sm">
                Your Selected Plan
              </h4>
              {isMatching && (
                <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                  <Check className="h-3 w-3 mr-1" />
                  Matching
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-foreground">
                {userTypeConfig?.label} {selection.selectedPlan?.name}
              </span>
              {!selection.selectedPlan?.isCustomPricing && (
                <span className="text-muted-foreground">
                  ({formatPriceValue(breakdown.firstMonthTotal)} first month)
                </span>
              )}
              {selection.selectedAddOns.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  +{selection.selectedAddOns.length} add-on{selection.selectedAddOns.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {!isMatching && (
              <p className="text-xs text-amber-700 mt-2">
                ⚠️ Complete this form to save your selection, or switch to the {userTypeConfig?.label} tab.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/pricing')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Change
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSelection}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
