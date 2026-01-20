import React from 'react';
import { Check, Sparkles, Zap, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Plan } from '@/data/pricingData';

interface PlanCardProps {
  plan: Plan;
  onAction: (action: 'signup' | 'subscribe' | 'contact') => void;
  isSelected?: boolean;
  onSelect?: (plan: Plan) => void;
  selectionMode?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onAction, isSelected, onSelect, selectionMode }) => {
  const formatPrice = () => {
    if (plan.isCustomPricing) {
      return 'Custom';
    }
    if (plan.priceRange) {
      return `₹${plan.priceRange.min.toLocaleString('en-IN')} - ₹${plan.priceRange.max.toLocaleString('en-IN')}`;
    }
    if (plan.price === 0) {
      return 'Free';
    }
    return `₹${plan.price?.toLocaleString('en-IN')}`;
  };

  const isPopular = plan.isPopular;
  const isFree = plan.price === 0;
  const isEnterprise = plan.tier === 'enterprise';

  const handleCardClick = () => {
    if (selectionMode && onSelect) {
      onSelect(plan);
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col h-full transition-all duration-500",
        "bg-white/80 backdrop-blur-sm",
        "hover:-translate-y-2 hover:scale-[1.02]",
        selectionMode && "cursor-pointer",
        isSelected 
          ? "border-2 border-[hsl(210,64%,23%)] shadow-xl ring-2 ring-[hsl(210,64%,23%,0.3)]"
          : isPopular 
            ? "border-2 border-[hsl(210,64%,23%)] shadow-xl ring-1 ring-[hsl(210,64%,23%,0.2)]" 
            : "border border-[hsl(210,64%,23%,0.1)] hover:border-[hsl(210,64%,23%,0.3)] hover:shadow-xl"
      )}
    >
      {/* Animated gradient border for popular */}
      {isPopular && (
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[hsl(210,64%,23%)] via-[hsl(210,64%,35%)] to-[hsl(210,64%,23%)] opacity-20 blur-sm animate-gradient-border -z-10" />
      )}
      
      {/* Hover glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 pointer-events-none",
        "group-hover:opacity-100",
        isPopular 
          ? "shadow-[0_0_40px_-10px_hsl(210,64%,23%,0.4)]"
          : "shadow-[0_0_30px_-10px_hsl(210,64%,23%,0.2)]"
      )} />

      {/* Floating sparkles for enterprise */}
      {isEnterprise && (
        <div className="absolute top-4 right-4 opacity-40">
          <Sparkles className="h-5 w-5 text-[hsl(210,64%,23%)] animate-sparkle" />
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 z-20">
          <div className="p-1 rounded-full bg-[hsl(210,64%,23%)] shadow-lg">
            <CircleCheck className="h-5 w-5 text-white" />
          </div>
        </div>
      )}

      {isPopular && !isSelected && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <Badge className="bg-gradient-to-r from-[hsl(210,64%,23%)] to-[hsl(210,64%,30%)] hover:from-[hsl(210,64%,25%)] hover:to-[hsl(210,64%,33%)] text-white px-4 py-1.5 shadow-lg animate-badge-pulse">
            <Zap className="h-3 w-3 mr-1 inline" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className={cn("text-center pb-4", isPopular && "pt-8")}>
        <h3 className="text-xl font-bold text-foreground group-hover:text-[hsl(210,64%,23%)] transition-colors duration-300">
          {plan.name}
        </h3>
        <div className="mt-4">
          <span className={cn(
            "font-bold text-foreground",
            plan.priceRange ? "text-2xl" : "text-3xl"
          )}>
            {formatPrice()}
          </span>
          {!plan.isCustomPricing && !isFree && !plan.priceRange && (
            <span className="text-muted-foreground ml-1">/month</span>
          )}
          {plan.priceRange && (
            <span className="text-muted-foreground ml-1">/month</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{plan.shortDescription}</p>
      </CardHeader>

      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {plan.highlights.map((highlight, index) => (
            <li 
              key={index} 
              className="flex items-start gap-2 group/item"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative mt-0.5">
                <Check className="h-4 w-4 text-[hsl(210,64%,23%)] flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
              </div>
              <span className="text-sm text-foreground">{highlight}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-4">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (selectionMode && onSelect) {
              onSelect(plan);
            } else {
              onAction(plan.ctaAction);
            }
          }}
          className={cn(
            "w-full font-medium transition-all duration-300 group/btn",
            "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
            isSelected
              ? "bg-[hsl(210,64%,23%)] text-white shadow-md"
              : isPopular || isEnterprise
                ? "bg-gradient-to-r from-[hsl(210,64%,23%)] to-[hsl(210,64%,28%)] hover:from-[hsl(210,64%,18%)] hover:to-[hsl(210,64%,23%)] text-white shadow-md"
                : isFree
                  ? "bg-white border-2 border-[hsl(210,64%,23%)] text-[hsl(210,64%,23%)] hover:bg-[hsl(210,64%,23%)] hover:text-white"
                  : "bg-gradient-to-r from-[hsl(210,64%,23%)] to-[hsl(210,64%,28%)] hover:from-[hsl(210,64%,18%)] hover:to-[hsl(210,64%,23%)] text-white"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            {selectionMode ? (
              isSelected ? (
                <>
                  Selected
                  <CircleCheck className="h-4 w-4" />
                </>
              ) : (
                'Select'
              )
            ) : (
              <>
                {plan.ctaLabel}
                {(isPopular || isEnterprise) && (
                  <Sparkles className="h-3.5 w-3.5 opacity-70 group-hover/btn:animate-sparkle" />
                )}
              </>
            )}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};
