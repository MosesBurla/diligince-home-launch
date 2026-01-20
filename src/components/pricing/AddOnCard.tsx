import React from 'react';
import { Check, Sparkles, CircleCheck } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AddOn, getIconComponent } from '@/data/pricingData';
import { cn } from '@/lib/utils';

interface AddOnCardProps {
  addon: AddOn;
  index?: number;
  isSelected?: boolean;
  onToggle?: (addon: AddOn) => void;
  selectionMode?: boolean;
}

export const AddOnCard: React.FC<AddOnCardProps> = ({ addon, index = 0, isSelected, onToggle, selectionMode }) => {
  const Icon = getIconComponent(addon.icon);
  const isSubscription = addon.type === 'subscription';
  const isAIRelated = addon.name.toLowerCase().includes('ai') || addon.name.toLowerCase().includes('bot');

  const handleClick = () => {
    if (selectionMode && onToggle) {
      onToggle(addon);
    }
  };

  return (
    <Card 
      onClick={handleClick}
      className={cn(
        "group relative h-full transition-all duration-500 bg-white/70 backdrop-blur-sm",
        "border border-[hsl(210,64%,23%,0.1)]",
        "hover:-translate-y-1 hover:shadow-xl hover:border-[hsl(210,64%,23%,0.3)]",
        "hover:bg-white/90",
        selectionMode && "cursor-pointer",
        isSelected && "border-[hsl(210,64%,23%)] ring-2 ring-[hsl(210,64%,23%,0.2)] bg-[hsl(210,64%,23%,0.03)]"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Selection indicator - matches PlanCard */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 z-20">
          <div className="p-1 rounded-full bg-[hsl(210,64%,23%)] shadow-lg">
            <CircleCheck className="h-5 w-5 text-white" />
          </div>
        </div>
      )}
      {/* AI glow for AI-related add-ons */}
      {isAIRelated && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(210,64%,23%,0.05)] to-transparent rounded-xl" />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "relative p-2.5 rounded-xl transition-all duration-300",
              "bg-gradient-to-br from-[hsl(210,64%,23%,0.1)] to-[hsl(210,64%,23%,0.05)]",
              "group-hover:from-[hsl(210,64%,23%,0.15)] group-hover:to-[hsl(210,64%,23%,0.08)]",
              "group-hover:shadow-md"
            )}>
              {isAIRelated && (
                <div className="absolute -inset-0.5 rounded-xl bg-[hsl(210,64%,23%)] opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-300" />
              )}
              <Icon className={cn(
                "h-5 w-5 text-[hsl(210,64%,23%)] relative transition-transform duration-300",
                "group-hover:scale-110"
              )} />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground flex items-center gap-1.5 group-hover:text-[hsl(210,64%,23%)] transition-colors duration-300">
                {addon.name}
                {isAIRelated && (
                  <Sparkles className="h-3 w-3 text-[hsl(210,64%,23%)] opacity-50 group-hover:opacity-100 group-hover:animate-sparkle transition-opacity duration-300" />
                )}
              </h4>
              <p className="text-sm text-muted-foreground">{addon.shortDescription}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">
              ₹{addon.price.toLocaleString('en-IN')}
            </span>
            {isSubscription ? (
              <span className="text-sm text-muted-foreground">/month</span>
            ) : (
              <Badge variant="outline" className="text-xs border-[hsl(210,64%,23%,0.3)] text-[hsl(210,64%,23%)]">
                One-time
              </Badge>
            )}
          </div>
          {selectionMode && (
            <Checkbox 
              checked={isSelected} 
              className="h-5 w-5 border-2 data-[state=checked]:bg-[hsl(210,64%,23%)] data-[state=checked]:border-[hsl(210,64%,23%)]"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ul className="space-y-2">
          {addon.featureList.map((feature, idx) => (
            <li 
              key={idx} 
              className="flex items-start gap-2 group/item"
            >
              <Check className="h-3.5 w-3.5 text-[hsl(210,64%,23%)] flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover/item:scale-110" />
              <span className="text-xs text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
