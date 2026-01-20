import React from 'react';
import { Puzzle, Sparkles } from 'lucide-react';
import { AddOnCard } from './AddOnCard';
import { UserType, AddOn, getAddOnsForUserType } from '@/data/pricingData';

interface AddOnSectionProps {
  userType: UserType;
  selectionMode?: boolean;
  selectedAddOns?: AddOn[];
  onToggleAddOn?: (addon: AddOn) => void;
}

export const AddOnSection: React.FC<AddOnSectionProps> = ({ 
  userType, 
  selectionMode,
  selectedAddOns = [],
  onToggleAddOn 
}) => {
  const compatibleAddOns = getAddOnsForUserType(userType);

  if (compatibleAddOns.length === 0) {
    return null;
  }

  const isAddOnSelected = (code: string) => selectedAddOns.some(a => a.code === code);

  return (
    <section className="relative py-12 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(210,64%,23%,0.02)] via-transparent to-[hsl(210,64%,23%,0.02)] pointer-events-none" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(210,64%,23%)] to-transparent blur-2xl" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[hsl(210,64%,23%)] to-transparent blur-2xl" />
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-[hsl(210,64%,23%,0.05)] border border-[hsl(210,64%,23%,0.1)]">
            <Puzzle className="h-5 w-5 text-[hsl(210,64%,23%)]" />
            <h2 className="text-2xl font-bold text-foreground">Power-Up Add-ons</h2>
            <Sparkles className="h-4 w-4 text-[hsl(210,64%,23%)] opacity-60" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {selectionMode 
              ? 'Select add-ons to enhance your plan (click to add/remove)'
              : 'Enhance your plan with powerful AI-driven add-ons tailored to your needs'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {compatibleAddOns.map((addon, index) => (
            <AddOnCard 
              key={addon.code} 
              addon={addon} 
              index={index}
              selectionMode={selectionMode}
              isSelected={isAddOnSelected(addon.code)}
              onToggle={onToggleAddOn}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
