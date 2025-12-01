import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import CompanyProfile from "./CompanyProfile";
import Documents from "./Documents";
import Payment from "./Payments";
import Security from "./Security";
import { ProfileHeader } from "@/components/shared/ProfileHeader";

export type ContentType = 
  | "company-profile" 
  | "certifications" 
  | "payment-settings" 
  | "account-settings";

const IndustryProfile = () => {
  const { user, profileCompletion, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContentType>("company-profile");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  const companyName = user?.profile?.companyName || user?.name || "Steel Plant Ltd.";
  const industryType = user?.profile?.industryType || "Manufacturing";
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <ProfileHeader
          name={companyName}
          type="Industry"
          specialization={industryType}
          initials={getInitials(companyName)}
          isVerified={true}
          profileCompletion={profileCompletion.percentage}
          missingFields={profileCompletion.missingFields}
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType)} className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-muted">
            <TabsTrigger 
              value="company-profile"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Company Profile
            </TabsTrigger>
            <TabsTrigger 
              value="certifications"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Certifications
            </TabsTrigger>
            <TabsTrigger 
              value="payment-settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Payment Settings
            </TabsTrigger>
            <TabsTrigger 
              value="account-settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Account Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company-profile">
            <Card className="p-6">
              <CompanyProfile />
            </Card>
          </TabsContent>

          <TabsContent value="certifications">
            <Card className="p-6">
              <Documents />
            </Card>
          </TabsContent>

          <TabsContent value="payment-settings">
            <Card className="p-6">
              <Payment />
            </Card>
          </TabsContent>

          <TabsContent value="account-settings">
            <Card className="p-6">
              <Security />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IndustryProfile;
