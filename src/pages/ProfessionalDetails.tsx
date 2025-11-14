import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import IndustryHeader from "@/components/industry/IndustryHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProfessionalDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Professional Details | Diligince.ai</title>
      </Helmet>

      {/* Industry header from shared component */}
      

      <main className="flex-1 container mx-auto px-4 py-8 pt-20">
        <Card className="max-w-4xl mx-auto shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Professional Details
            </CardTitle>
            <CardDescription>
              Professional ID: <span className="font-mono">{id}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Professional Info */}
            <section>
              <h3 className="text-lg font-semibold mb-2">
                Professional Information
              </h3>
              <p className="text-gray-600">
                Detailed professional information would be displayed here.
              </p>
            </section>

            {/* Expertise */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Project Management</Badge>
                <Badge variant="outline">Engineering</Badge>
                <Badge variant="outline">Quality Assurance</Badge>
              </div>
            </section>

            {/* Experience */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Experience</h3>
              <p className="text-gray-600">
                10+ years in industrial manufacturing
              </p>
            </section>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() =>
                  navigate("/dashboard/stakeholders/professionals")
                }
              >
                Hire Professional
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/dashboard/professional-portfolio/${id}`)
                }
              >
                View Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfessionalDetails;
