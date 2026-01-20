import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from 'lucide-react';

export const TransactionFeeCard: React.FC = () => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Transaction Fee
        </h3>
        
        {/* Hero Number */}
        <div className="text-center py-6 mb-4 rounded-lg bg-muted/30 border border-border/30">
          <span className="text-4xl font-bold text-foreground">5%</span>
          <p className="text-sm text-muted-foreground mt-1">Platform Commission</p>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">
          Applied to successful transactions processed through the platform.
        </p>
        
        {/* Benefit */}
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-muted-foreground">No fees on subscription plans</span>
        </div>
      </CardContent>
    </Card>
  );
};
