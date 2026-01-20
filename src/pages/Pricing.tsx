import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Sparkles } from "lucide-react";
import { 
  UserTypeSelector, 
  PlanCard, 
  AddOnSection, 
  PricingFAQ,
  TransactionFeeCard,
  PricingHeroBackground,
  PricingCalculator
} from "@/components/pricing";
import { 
  UserType, 
  Plan,
  plansByUserType, 
  userTypes 
} from "@/data/pricingData";
import { usePricingSelection } from "@/contexts/PricingSelectionContext";

const Pricing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selection, setSelectedPlan, toggleAddOn, hasValidSelection } = usePricingSelection();
  
  // Parse hash to get initial user type
  const getInitialUserType = (): UserType => {
    const hash = location.hash.replace('#', '');
    const validTypes: UserType[] = ['industry', 'service_vendor', 'product_vendor', 'logistics', 'professional'];
    if (validTypes.includes(hash as UserType)) {
      return hash as UserType;
    }
    // If we have a selection, use that user type
    if (selection?.userType) {
      return selection.userType;
    }
    return 'industry';
  };

  const [selectedUserType, setSelectedUserType] = useState<UserType>(getInitialUserType);

  // Update URL hash when user type changes
  useEffect(() => {
    window.history.replaceState(null, '', `#${selectedUserType}`);
  }, [selectedUserType]);

  const handleUserTypeChange = (userType: UserType) => {
    setSelectedUserType(userType);
    // Clear plan selection if user type changes
    if (selection?.userType !== userType && selection?.selectedPlan) {
      setSelectedPlan(userType, null);
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(selectedUserType, plan);
  };

  const handlePlanAction = (action: 'signup' | 'subscribe' | 'contact') => {
    switch (action) {
      case 'signup':
        navigate("/signup");
        break;
      case 'subscribe':
        navigate("/signup");
        break;
      case 'contact':
        navigate("/contact");
        break;
    }
  };

  const currentPlans = plansByUserType[selectedUserType];
  const currentUserTypeConfig = userTypes.find(t => t.id === selectedUserType);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section with AI Background */}
        <PricingHeroBackground>
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-8">
              <div className="text-center mb-10 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(210,64%,23%,0.08)] border border-[hsl(210,64%,23%,0.15)] mb-4">
                  <Sparkles className="h-4 w-4 text-[hsl(210,64%,23%)]" />
                  <span className="text-sm font-medium text-[hsl(210,64%,23%)]">AI-Powered Pricing</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Flexible Plans for Every Business
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose your role and find the perfect plan to grow your business on Diligince
                </p>
              </div>

              {/* User Type Selector */}
              <UserTypeSelector
                selectedType={selectedUserType}
                onSelect={handleUserTypeChange}
              />
            </div>
          </section>
        </PricingHeroBackground>

        {/* Pricing Cards Section with Calculator */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              {/* Left Column: Plans + Add-ons (Scrollable) */}
              <div className="flex-1">
                {/* Compact User Type Header */}
                {currentUserTypeConfig && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <currentUserTypeConfig.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {currentUserTypeConfig.label} Plans
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {currentUserTypeConfig.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentPlans.map((plan, index) => (
                    <div 
                      key={plan.code}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <PlanCard
                        plan={plan}
                        onAction={handlePlanAction}
                        selectionMode={true}
                        isSelected={selection?.selectedPlan?.code === plan.code && selection?.userType === selectedUserType}
                        onSelect={handlePlanSelect}
                      />
                    </div>
                  ))}
                </div>

                {/* Add-ons Section - Inside left column */}
                <div className="mt-10">
                  <AddOnSection 
                    userType={selectedUserType}
                    selectionMode={hasValidSelection}
                    selectedAddOns={selection?.selectedAddOns || []}
                    onToggleAddOn={toggleAddOn}
                  />
                </div>
              </div>

              {/* Right Column: Calculator (Sticky) */}
              <div className="lg:w-[340px] xl:w-[380px]">
                <div className="lg:sticky lg:top-24">
                  <PricingCalculator />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ + Transaction/Contact - Two Column Layout */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              {/* Left Column: FAQ Section */}
              <div className="flex-1 lg:flex-[2]">
                <PricingFAQ />
              </div>
              
        {/* Right Column: Transaction Fee + Contact Us (stacked) */}
        <div className="lg:w-[340px] xl:w-[380px] flex flex-col gap-5 lg:sticky lg:top-24">
          {/* Transaction Fee Card */}
          <TransactionFeeCard />
          
          {/* Need Help Deciding Card */}
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Need Help Deciding?
              </h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Our team can guide you to the perfect plan for your business
              </p>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => navigate("/contact")}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                or email us at <span className="font-medium">support@diligince.com</span>
              </p>
            </div>
          </Card>
        </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
