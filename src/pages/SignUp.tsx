import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { IndustrySignUpForm } from "@/components/auth/forms/IndustrySignUpForm";
import { ProfessionalForm } from "@/components/signup/ProfessionalForm";
import { VendorFormEnhanced } from "@/components/signup/VendorFormEnhanced";

const SignUp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("industry");

  const leftContent = {
    title: "Join the Industrial Revolution",
    description:
      "Sign up to unlock AI-powered services tailored for industrial excellence",
    imageSrc: "/Diligince-no-bg-white.svg",
    imageAlt: "Industrial Professional",
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle=""
      leftContent={null}
    >
      <Tabs
        defaultValue="industry"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        {/* Tab Headers */}
        <TabsList className="grid grid-cols-3 mb-8 bg-muted">
          <TabsTrigger
            value="industry"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Industry
          </TabsTrigger>
          <TabsTrigger
            value="professional"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Professional
          </TabsTrigger>
          <TabsTrigger
            value="vendor"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Vendor
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="industry">
          <IndustrySignUpForm />
        </TabsContent>

        <TabsContent value="professional">
          <ProfessionalForm />
        </TabsContent>

        <TabsContent value="vendor">
          <VendorFormEnhanced />
        </TabsContent>
      </Tabs>

      {/* Footer Redirect */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
