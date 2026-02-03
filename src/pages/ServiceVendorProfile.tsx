import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyInfoForm from "@/components/vendor/forms/CompanyInfoForm";
import ServicesSkillsForm from "@/components/vendor/forms/ServicesSkillsForm";
import CertificationsSection from "@/components/vendor/forms/CertificationsSection";
import ProjectsPortfolioSection from "@/components/vendor/forms/ProjectsPortfolioSection";
import PaymentSettingsForm from "@/components/vendor/forms/PaymentSettingsForm";
import AccountSettingsForm from "@/components/vendor/forms/AccountSettingsForm";
import { ProfileHeader } from "@/components/shared/ProfileHeader";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

export type ContentType =
  | "company-info"
  | "services-skills"
  | "certifications"
  | "projects-portfolio"
  | "payment-settings"
  | "account-settings";

const ServiceVendorProfile: React.FC = () => {
  const { user, isAuthenticated, profileCompletion } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContentType>("company-info");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  const companyName = user?.profile?.businessName || user?.name || "TechServe Solutions";
  const specialization = user?.profile?.specialization || "Industrial Automation";

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <ProfileHeader
          name={companyName}
          type="Service Vendor"
          specialization={specialization}
          initials={user?.initials || "TS"}
          isVerified={true}
          profileCompletion={profileCompletion.percentage}
          missingFields={profileCompletion.missingFields}
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType)} className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-muted flex-wrap h-auto">
            <TabsTrigger value="company-info">Company Info</TabsTrigger>
            <TabsTrigger value="services-skills">Services & Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="projects-portfolio">Projects & Portfolio</TabsTrigger>
            <TabsTrigger value="payment-settings">Payment Settings</TabsTrigger>
            <TabsTrigger value="account-settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="company-info">
            <Card className="p-6">
              <CompanyInfoForm />
            </Card>
          </TabsContent>

          <TabsContent value="services-skills">
            <Card className="p-6">
              <ServicesSkillsForm />
            </Card>
          </TabsContent>

          <TabsContent value="certifications">
            <Card className="p-6">
              <CertificationsSection />
            </Card>
          </TabsContent>

          <TabsContent value="projects-portfolio">
            <Card className="p-6">
              <ProjectsPortfolioSection />
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

export default ServiceVendorProfile;

