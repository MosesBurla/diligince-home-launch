/**
 * Plan Review Step Component
 * 
 * First step in the purchase flow - review selected plan and add-ons.
 */

import React from 'react';
import { Check, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plan, AddOn } from '@/services/modules/subscription';
import { formatCurrency } from '@/utils/formatters';

interface PlanReviewStepProps {
  plan: Plan;
  addOns: AddOn[];
  selectedPrice: number;
  gstRate: number;
  onProceed: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PlanReviewStep: React.FC<PlanReviewStepProps> = ({
  plan,
  addOns,
  selectedPrice,
  gstRate,
  onProceed,
  onCancel,
  isLoading = false,
}) => {
  // Calculate pricing
  const planAmount = selectedPrice;
  const addOnsAmount = addOns.reduce((sum, addon) => sum + addon.price, 0);
  const subtotal = planAmount + addOnsAmount;
  const gstAmount = Math.round(subtotal * gstRate / 100);
  const totalAmount = subtotal + gstAmount;

  return (
    <div className="space-y-6">
      {/* Selected Plan */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Selected Plan
            </CardTitle>
            <Badge variant={plan.tier === 'pro' ? 'default' : 'secondary'}>
              {plan.tier.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {plan.shortDescription}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {formatCurrency(planAmount)}
              </p>
              <p className="text-sm text-muted-foreground">
                /{plan.billingCycle}
              </p>
            </div>
          </div>

          {/* Plan Highlights */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Includes:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {plan.highlights.slice(0, 4).map((highlight, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Selected Add-ons */}
      {addOns.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Selected Add-ons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {addOns.map((addon) => (
                <div key={addon.code} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{addon.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {addon.shortDescription}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(addon.price)}
                    {addon.billingCycle && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /{addon.billingCycle}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Plan ({plan.name})</span>
            <span>{formatCurrency(planAmount)}</span>
          </div>
          
          {addOnsAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Add-ons ({addOns.length})</span>
              <span>{formatCurrency(addOnsAmount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>GST ({gstRate}%)</span>
            <span>{formatCurrency(gstAmount)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={onProceed}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </div>
    </div>
  );
};

export default PlanReviewStep;
