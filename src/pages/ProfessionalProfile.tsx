import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoForm from "@/components/professional/forms/PersonalInfoForm";
import SkillsForm from "@/components/professional/forms/SkillsForm";
import CertificationsForm from "@/components/professional/forms/CertificationsForm";
import ExperienceForm from "@/components/professional/forms/ExperienceForm";
import EnhancedAvailabilityCalendar from "@/components/professional/calendar/EnhancedAvailabilityCalendar";
import PaymentSettingsForm from "@/components/professional/forms/PaymentSettingsForm";
import AccountSettingsForm from "@/components/professional/forms/AccountSettingsForm";
import { ProfileHeader } from "@/components/shared/ProfileHeader";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

export type ContentType =
  | "personal-info"
  | "skills"
  | "certifications"
  | "experience"
  | "availability"
  | "payment"
  | "account";

const ProfessionalProfile = () => {
  const { user, profileCompletion, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContentType>("personal-info");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  const professionalName = user?.profile?.fullName || user?.name || "Rahul Sharma";
  const expertise = user?.profile?.expertise || "Mechanical Engineering";

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <ProfileHeader
          name={professionalName}
          type="Professional"
          specialization={expertise}
          initials={user?.initials || "RS"}
          isVerified={true}
          profileCompletion={profileCompletion.percentage}
          missingFields={profileCompletion.missingFields}
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType)} className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-muted flex-wrap h-auto">
            <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
            <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="payment">Payment Settings</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal-info">
            <Card className="p-6">
              <PersonalInfoForm />
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card className="p-6">
              <SkillsForm />
            </Card>
          </TabsContent>

          <TabsContent value="certifications">
            <Card className="p-6">
              <CertificationsForm />
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card className="p-6">
              <ExperienceForm />
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card className="p-6">
              <EnhancedAvailabilityCalendar />
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card className="p-6">
              <PaymentSettingsForm />
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="p-6">
              <AccountSettingsForm />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalProfile;

