import React from 'react';
import { cn } from '@/lib/utils';
import { userTypes, UserType } from '@/data/pricingData';


interface UserTypeSelectorProps {
  selectedType: UserType;
  onSelect: (type: UserType) => void;
}

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  selectedType,
  onSelect
}) => {
  return (
    <div className="w-full">
      {/* Desktop: Horizontal tabs with AI glow effect */}
      <div className="hidden md:flex justify-center gap-2 p-2 bg-white/60 backdrop-blur-sm rounded-2xl max-w-4xl mx-auto shadow-lg border border-[hsl(210,64%,23%,0.1)]">
        {userTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={cn(
                "group relative flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                "hover:scale-[1.02] active:scale-[0.98]",
                isSelected
                  ? "bg-[hsl(210,64%,23%)] text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-[hsl(210,64%,23%,0.05)]"
              )}
            >
              {/* AI glow ring on selected */}
              {isSelected && (
                <div className="absolute inset-0 rounded-xl bg-[hsl(210,64%,23%)] opacity-20 blur-md animate-pulse-glow" />
              )}
              <div className="relative z-10 flex items-center gap-2">
                <Icon className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  isSelected && "animate-icon-pulse"
                )} />
                <span>{type.shortLabel}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile: Scrollable pills with glow */}
      <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {userTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => onSelect(type.id)}
                className={cn(
                  "group relative flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "active:scale-95",
                  isSelected
                    ? "bg-[hsl(210,64%,23%)] text-white shadow-lg"
                    : "bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-foreground border border-[hsl(210,64%,23%,0.1)]"
                )}
              >
                {isSelected && (
                  <div className="absolute inset-0 rounded-full bg-[hsl(210,64%,23%)] opacity-20 blur-md animate-pulse-glow" />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{type.shortLabel}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
