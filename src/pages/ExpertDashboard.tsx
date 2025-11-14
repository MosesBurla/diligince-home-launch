import React from "react";
import { Helmet } from "react-helmet";
import { GenericHeader } from "@/components/shared/layout/GenericHeader";
import { HeaderConfig } from "@/utils/navigationConfigs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, MessageSquare, DollarSign, Star, Clock } from "lucide-react";

const expertHeaderConfig: HeaderConfig = {
  brandName: "Diligince.ai",
  brandHref: "/dashboard/expert",
  navItems: [
    { label: "Dashboard", href: "/dashboard/expert", icon: <Briefcase size={18} /> },
    { label: "Projects", href: "/expert/projects", icon: <Briefcase size={18} /> },
    { label: "Messages", href: "/expert/messages", icon: <MessageSquare size={18} /> },
  ],
  avatarInitials: "EX",
  theme: {
    bgColor: "bg-blue-600",
    textColor: "text-white",
    hoverColor: "hover:bg-blue-700",
    buttonHoverColor: "hover:bg-blue-500",
    avatarBgColor: "bg-blue-500",
  },
};

const ExpertDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Expert Dashboard | Diligince.ai</title>
      </Helmet>
      
      <GenericHeader config={expertHeaderConfig} />
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expert Dashboard</h1>
          <p className="text-gray-600">Manage your consulting projects and expertise opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">$8,500</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Meeting</p>
                  <p className="text-2xl font-bold text-gray-900">2h</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Chemical Process Optimization</h3>
                  <Badge className="bg-green-100 text-green-800">In Progress</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">Industrial client requiring process efficiency improvements</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Due: Jan 30, 2024</span>
                  <span className="font-medium">$3,500</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Safety Audit Consultation</h3>
                  <Badge className="bg-blue-100 text-blue-800">Review</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">Comprehensive safety assessment for manufacturing facility</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Due: Feb 15, 2024</span>
                  <span className="font-medium">$5,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm">TechCorp Industries</h4>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <p className="text-sm text-gray-600">Can we schedule a follow-up meeting for the process optimization project?</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm">SafetyFirst Manufacturing</h4>
                  <span className="text-xs text-gray-500">5h ago</span>
                </div>
                <p className="text-sm text-gray-600">Thank you for the preliminary safety assessment report. Very thorough work!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ExpertDashboard;
