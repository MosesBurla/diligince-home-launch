import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, User, Building, Shield } from "lucide-react";
import { toast } from "sonner";

const StakeholderOnboarding: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasValidInvitation, setHasValidInvitation] = useState(true);

  const invitationToken = searchParams.get("token");
  const stakeholderType = searchParams.get("type");
  const email = searchParams.get("email");
  const name = searchParams.get("name");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    phone: "",
    acceptTerms: false,
  });

  useEffect(() => {
    if (!invitationToken || !email || !name) {
      console.log("Missing required parameters:", {
        invitationToken,
        email,
        name,
      });
      setHasValidInvitation(false);
      toast.error("Invalid invitation link");
    } else {
      setHasValidInvitation(true);
    }
  }, [invitationToken, email, name]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }

      // Simulated account creation
      console.log("Creating account for:", {
        email,
        name,
        stakeholderType,
      });

      toast.success("Account created successfully!");
      setCurrentStep(2);
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOnboarding = () => {
    toast.success("Welcome to Diligince.ai! Redirecting to your dashboard...");

    setTimeout(() => {
      if (stakeholderType === "expert") {
        navigate("/professional-dashboard");
      } else {
        switch (stakeholderType) {
          case "product_vendor":
            navigate("/product-vendor-dashboard");
            break;
          case "service_vendor":
            navigate("/service-vendor-dashboard");
            break;
          case "logistics_vendor":
            navigate("/logistics-vendor-dashboard");
            break;
          default:
            navigate("/industry-dashboard");
        }
      }
    }, 2000);
  };

  const getStakeholderTypeLabel = () => {
    switch (stakeholderType) {
      case "expert":
        return "Expert Professional";
      case "product_vendor":
        return "Product Vendor";
      case "service_vendor":
        return "Service Vendor";
      case "logistics_vendor":
        return "Logistics Vendor";
      default:
        return "Stakeholder";
    }
  };

  const steps = [
    { number: 1, title: "Create Account", icon: <User className="h-5 w-5" /> },
    {
      number: 2,
      title: "Complete Profile",
      icon: <Building className="h-5 w-5" />,
    },
    {
      number: 3,
      title: "Dashboard Access",
      icon: <Shield className="h-5 w-5" />,
    },
  ];

  if (!hasValidInvitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Helmet>
          <title>Invalid Invitation | Diligince.ai</title>
        </Helmet>

        <div className="w-full max-w-md">
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">
                Invalid Invitation Link
              </CardTitle>
              <CardDescription>
                The invitation link you used is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800">This could happen if:</p>
                <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                  <li>The invitation link is incomplete</li>
                  <li>The link has expired</li>
                  <li>You accessed the page directly without an invitation</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Go to Homepage
                </Button>
                <Button
                  onClick={() => navigate("/contact")}
                  variant="outline"
                  className="flex-1"
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Helmet>
        <title>Join Diligince.ai | Stakeholder Onboarding</title>
      </Helmet>

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Diligince.ai
          </h1>
          <p className="text-gray-600">
            Complete your registration as a {getStakeholderTypeLabel()}
          </p>
        </div>

        {/* Steps */}
        <div className="flex justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.number ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="bg-white shadow-lg">
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Create Your Account
                </CardTitle>
                <CardDescription>
                  Set up your account to access the Diligince.ai platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Invitation Details:</strong>
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        Name: <strong>{name}</strong>
                      </p>
                      <p className="text-sm">
                        Email: <strong>{email}</strong>
                      </p>
                      <p className="text-sm">
                        Role: <strong>{getStakeholderTypeLabel()}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div>
                    <Label htmlFor="password">Create Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Enter a secure password"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 8 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+1-555-0123"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={(e) =>
                        handleInputChange("acceptTerms", e.target.checked)
                      }
                      className="rounded border-gray-300"
                      required
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.acceptTerms}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Account Created Successfully!
                </CardTitle>
                <CardDescription>
                  Your account has been created. You can now complete your
                  profile and access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Welcome aboard!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your account has been successfully created and verified. You
                    now have access to the Diligince.ai platform.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Next Steps:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">
                        1
                      </Badge>
                      <div>
                        <p className="font-medium">Complete Your Profile</p>
                        <p className="text-sm text-gray-600">
                          Add your company details, specializations, and
                          portfolio
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">
                        2
                      </Badge>
                      <div>
                        <p className="font-medium">Explore Opportunities</p>
                        <p className="text-sm text-gray-600">
                          Browse available projects and requirements
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">
                        3
                      </Badge>
                      <div>
                        <p className="font-medium">Start Collaborating</p>
                        <p className="text-sm text-gray-600">
                          Connect with industry partners and grow your business
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCompleteOnboarding}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Access My Dashboard
                </Button>
              </CardContent>
            </>
          )}
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StakeholderOnboarding;
