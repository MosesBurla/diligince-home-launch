import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyInfoForm } from "@/components/vendor/logistics/CompanyInfoForm";
import { FleetEquipmentSection } from "@/components/vendor/logistics/FleetEquipmentSection";
import { LicensesPermitsSection } from "@/components/vendor/logistics/LicensesPermitsSection";
import { ServiceAreasSection } from "@/components/vendor/logistics/ServiceAreasSection";
import PaymentSettingsForm from "@/components/vendor/forms/PaymentSettingsForm";
import AccountSettingsForm from "@/components/vendor/forms/AccountSettingsForm";
import { ProfileHeader } from "@/components/shared/ProfileHeader";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useVendorSpecialization } from "@/contexts/VendorSpecializationContext";
import { getSpecializationDisplayName } from "@/utils/vendorSpecializationMapping";

export type ContentType =
  | "company-info"
  | "fleet-equipment"
  | "licenses-permits"
  | "service-areas"
  | "payment-settings"
  | "account-settings";

const LogisticsVendorProfile = () => {
  const { user, isAuthenticated, profileCompletion } = useUser();
  const { specialization } = useVendorSpecialization();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContentType>("company-info");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  const companyName = user?.profile?.businessName || user?.name || "TransLog India";
  const displaySpecialization = getSpecializationDisplayName(specialization);

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <ProfileHeader
          name={companyName}
          type="Logistics Provider"
          specialization={displaySpecialization}
          initials={user?.initials || "TL"}
          isVerified={true}
          profileCompletion={profileCompletion.percentage}
          missingFields={profileCompletion.missingFields}
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType)} className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-muted flex-wrap h-auto">
            <TabsTrigger value="company-info">Company Info</TabsTrigger>
            <TabsTrigger value="fleet-equipment">
              {specialization === 'heavy-equipment' || specialization === 'crane-services' 
                ? 'Equipment & Fleet' 
                : 'Fleet & Equipment'}
            </TabsTrigger>
            <TabsTrigger value="licenses-permits">Licenses & Permits</TabsTrigger>
            <TabsTrigger value="service-areas">Service Areas</TabsTrigger>
            <TabsTrigger value="payment-settings">Payment Settings</TabsTrigger>
            <TabsTrigger value="account-settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="company-info">
            <Card className="p-6">
              <CompanyInfoForm />
            </Card>
          </TabsContent>

          <TabsContent value="fleet-equipment">
            <Card className="p-6">
              <FleetEquipmentSection />
            </Card>
          </TabsContent>

          <TabsContent value="licenses-permits">
            <Card className="p-6">
              <LicensesPermitsSection />
            </Card>
          </TabsContent>

          <TabsContent value="service-areas">
            <Card className="p-6">
              <ServiceAreasSection />
            </Card>
          </TabsContent>

          <TabsContent value="payment-settings">
            <Card className="p-6">
              <PaymentSettingsForm />
            </Card>
          </TabsContent>

          <TabsContent value="account-settings">
            <Card className="p-6">
              <AccountSettingsForm />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LogisticsVendorProfile;

