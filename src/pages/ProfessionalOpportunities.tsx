import React, { useState } from "react";
import { Briefcase, TrendingUp, FileText, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { JobApplicationModal } from "@/components/professional/dashboard/JobApplicationModal";
import { RequirementsFeed } from "@/components/shared/requirements/RequirementsFeed";
import { useToast } from "@/hooks/use-toast";

interface ApplicationData {
  coverLetter: string;
  resume: string;
}

const ProfessionalOpportunities = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleJobClick = (id: string) => {
    toast({
      title: "View Opportunity",
      description: `Opening details for opportunity ${id}`,
    });
    setIsModalOpen(true);
  };

  const handleApplicationSubmit = (jobId: number, applicationData: ApplicationData) => {
    console.log(`Application for job ${jobId}:`, applicationData);
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully!",
    });
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <ProfessionalHeader navItems={headerNavItems} /> */}

      <main className="pt-32 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 mt-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Professional Opportunities</h1>
            <p className="text-gray-600 mt-1">
              Discover projects that match your expertise
            </p>
          </div>

          {/* AI Recommendations Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Diligince AI Suggests These Opportunities for You
            </h2>
            <p className="text-sm text-muted-foreground">
              Based on your profile: Safety Engineering Expert, 15 years experience
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <Briefcase className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">42</p>
                  <p className="text-sm text-gray-600">Total Available Opportunities</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">5</p>
                  <p className="text-sm text-gray-600">Your Applications</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">8</p>
                  <p className="text-sm text-gray-600">AI Recommended for You</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">6</p>
                  <p className="text-sm text-gray-600">Applications Closing Soon</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requirements Feed */}
          <RequirementsFeed
            userType="professional"
            categoryFilter="professional"
            showAIRecommendations={true}
            maxRecommendations={5}
            onViewDetails={handleJobClick}
            onSubmitQuote={handleJobClick}
          />
        </div>
      </main>

      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
};

export default ProfessionalOpportunities;
