import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Package,
  CheckCircle,
  Crown,
  Sparkles,
  ArrowRight,
  Zap,
  Loader2
} from 'lucide-react';
import { CurrentPlanCard, ActiveAddOnsList } from '@/components/subscription';
import { PlanCard, AddOnCard, PricingCalculator } from '@/components/pricing';
import { formatCurrency } from '@/data/mockSubscriptionData';
import {
  plansByUserType,
  addOns as allAddOns,
  type UserType,
  type Plan,
  type AddOn
} from '@/data/pricingData';
import { usePricingSelection } from '@/contexts/PricingSelectionContext';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { subscriptionPurchaseService } from '@/services/modules/subscription-purchase/subscriptionPurchase.service';
import type { RazorpayOptions, RazorpayPaymentResponse } from '@/services/modules/subscription-purchase/subscriptionPurchase.types';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('current');
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const {
    selection,
    setSelectedPlan,
    toggleAddOn,
    isAddOnSelected,
    hasValidSelection
  } = usePricingSelection();

  // Fetch current subscription
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setIsLoadingSubscription(true);
        const response = await subscriptionPurchaseService.getSubscription();
        if (response.success && response.data) {
          setSubscription(response.data);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoadingSubscription(false);
      }
    };
    fetchSubscription();
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // For demo, we'll use the user type from current subscription
  const userType: UserType = 'industry';
  const plans = plansByUserType[userType];
  const compatibleAddOns = allAddOns.filter(addon =>
    addon.compatibleUserTypes.includes(userType)
  );

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(userType, plan);
  };

  const handleAddOnToggle = (addOn: AddOn) => {
    toggleAddOn(addOn);
  };

  const handlePayment = async () => {
    if (!selection?.selectedPlan) {
      toast.error('Please select a plan first');
      return;
    }

    if (!razorpayLoaded) {
      toast.error('Payment system is loading. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Calculate pricing
      const addOnPrices = selection.selectedAddOns?.map(a => a.price) || [];
      const pricing = subscriptionPurchaseService.calculatePricing(
        selection.selectedPlan.price ?? selection.selectedPlan.priceRange?.min ?? 0,
        addOnPrices
      );

      // 2. Create order on backend
      // For plans with price ranges, use the minimum if no specific price selected
      const selectedPrice = selection.selectedPlan.price ??
        selection.selectedPlan.priceRange?.min ??
        0;

      let orderData: any;

      try {
        const orderResponse = await subscriptionPurchaseService.createOrder({
          planCode: selection.selectedPlan.code,
          selectedPrice,
          addOnCodes: selection.selectedAddOns?.map(a => a.code),
          source: 'subscription_dashboard'
        });

        if (!orderResponse.success) {
          // Check if it's an ORDER_EXISTS error - fetch and reuse the existing order
          if (orderResponse.error?.code === 'ORDER_EXISTS' && orderResponse.error?.data?.orderId) {
            toast.info('Using existing pending order', {
              description: 'Resuming your previous payment attempt...'
            });

            const existingOrderResponse = await subscriptionPurchaseService.getOrder(
              orderResponse.error.data.orderId
            );

            if (existingOrderResponse.success && existingOrderResponse.data) {
              orderData = existingOrderResponse.data;
            } else {
              throw new Error('Failed to retrieve existing order');
            }
          } else {
            throw new Error(orderResponse.error?.message || 'Failed to create order');
          }
        } else {
          orderData = orderResponse.data;
        }
      } catch (createError: any) {
        // Handle axios error response for 409
        if (createError.response?.status === 409 && createError.response?.data?.error?.data?.orderId) {
          toast.info('Using existing pending order', {
            description: 'Resuming your previous payment attempt...'
          });

          const existingOrderResponse = await subscriptionPurchaseService.getOrder(
            createError.response.data.error.data.orderId
          );

          if (existingOrderResponse.success && existingOrderResponse.data) {
            orderData = existingOrderResponse.data;
          } else {
            throw new Error('Failed to retrieve existing order');
          }
        } else {
          throw createError;
        }
      }

      // 3. Open Razorpay checkout
      const options: RazorpayOptions = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Diligence.ai',
        description: `${selection.selectedPlan.name} Plan Subscription`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: '#1a365d'
        },
        handler: async (response: RazorpayPaymentResponse) => {
          // 4. Verify payment on backend
          try {
            const verifyResponse = await subscriptionPurchaseService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyResponse.success) {
              toast.success('Payment successful!', {
                description: 'Your subscription has been activated.'
              });
              // Refresh to show updated subscription
              navigate('/dashboard/subscription/plans');
              setActiveTab('current');
            } else {
              toast.error('Payment verification failed', {
                description: verifyResponse.error?.message || 'Unknown error'
              });
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            toast.error('Payment verification failed. Please contact support.');
          }
          setIsProcessing(false);
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Payment failed', {
        description: error.response?.data?.error?.message || error.message || 'Something went wrong. Please try again.'
      });
      setIsProcessing(false);
    }
  };

  const handleUpgrade = () => {
    setActiveTab('available');
  };

  const handlePlanAction = (action: 'signup' | 'subscribe' | 'contact') => {
    if (action === 'contact') {
      navigate('/contact');
    } else {
      handlePayment();
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subscription Plans</h1>
            <p className="text-muted-foreground">
              Manage your subscription and explore available plans
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="current" className="gap-2">
            <Crown className="h-4 w-4" />
            Current Plan
          </TabsTrigger>
          <TabsTrigger value="available" className="gap-2">
            <Package className="h-4 w-4" />
            Available Plans
          </TabsTrigger>
        </TabsList>

        {/* Current Plan Tab */}
        <TabsContent value="current" className="space-y-6">
          {isLoadingSubscription ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading subscription...</span>
            </div>
          ) : subscription ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CurrentPlanCard
                  subscription={{
                    id: subscription.subscriptionId || subscription.id,
                    userId: subscription.userId || '',
                    planCode: subscription.plan?.code || '',
                    planName: subscription.plan?.name || 'Unknown Plan',
                    tier: subscription.plan?.tier || 'plus',
                    status: subscription.status,
                    amount: subscription.billing?.amount || 0,
                    currency: 'INR',
                    billingCycle: subscription.plan?.billingCycle || 'monthly',
                    currentPeriodStart: subscription.billing?.currentPeriodStart || new Date().toISOString(),
                    currentPeriodEnd: subscription.billing?.currentPeriodEnd || new Date().toISOString(),
                    nextBillingDate: subscription.billing?.nextBillingDate || new Date().toISOString(),
                    features: subscription.plan?.features || [],
                    addOns: subscription.addOns || [],
                    createdAt: subscription.createdAt || new Date().toISOString()
                  }}
                  onUpgrade={handleUpgrade}
                  onManage={() => toast.info('Subscription management coming soon!')}
                />
                <ActiveAddOnsList
                  addOns={subscription.addOns || []}
                  onAddMore={handleUpgrade}
                />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="text-lg font-semibold">June 2025</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="text-lg font-semibold">{formatCurrency(78500)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">AI Credits Used</p>
                        <p className="text-lg font-semibold">45 / 100</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Subscription</h3>
              <p className="text-muted-foreground mb-4">Choose a plan to get started</p>
              <Button onClick={handleUpgrade}>
                Browse Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Available Plans Tab */}
        <TabsContent value="available" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Plans Section */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Choose Your Plan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <PlanCard
                      key={plan.code}
                      plan={plan}
                      onAction={handlePlanAction}
                      isSelected={selection?.selectedPlan?.code === plan.code}
                      onSelect={handlePlanSelect}
                      selectionMode
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Enhance with Add-ons
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {compatibleAddOns.map((addOn, index) => (
                    <AddOnCard
                      key={addOn.code}
                      addon={addOn}
                      index={index}
                      isSelected={isAddOnSelected(addOn.code)}
                      onToggle={handleAddOnToggle}
                      selectionMode
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Calculator */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                {hasValidSelection ? (
                  <Card className="border-2 border-primary/20">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                      <CardDescription>Review your selection</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <PricingCalculator className="border-0 shadow-none p-0" />
                      <Button
                        className="w-full gap-2 mt-4"
                        size="lg"
                        onClick={handlePayment}
                        disabled={isProcessing || !razorpayLoaded}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4" />
                            Pay with Razorpay
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Secure payment powered by Razorpay
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-1">Select a plan</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose a plan to see pricing details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionPlans;
