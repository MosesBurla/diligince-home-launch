import React from "react";
import { useParams } from "react-router-dom";
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

const VendorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Vendor Details | Diligince.ai</title>
      </Helmet>

      {/* Global Header */}
      

      <main className="flex-1 container mx-auto px-4 py-8 pt-20">
        <Card className="max-w-4xl mx-auto shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Vendor Details
            </CardTitle>
            <CardDescription className="text-gray-600">
              Vendor ID: <span className="font-medium">{id}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Company Info */}
            <section>
              <h3 className="text-lg font-semibold mb-2">
                Company Information
              </h3>
              <p className="text-gray-700">
                Detailed vendor information will be displayed here. This data
                could come from your backend API based on the vendor ID.
              </p>
            </section>

            {/* Services */}
            <section>
              <h3 className="text-lg font-semibold mb-2">Services</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Manufacturing</Badge>
                <Badge variant="outline">Quality Control</Badge>
                <Badge variant="outline">Supply Chain</Badge>
              </div>
            </section>

            {/* Actions */}
            <div className="flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Contact Vendor
              </Button>
              <Button variant="outline">View Profile</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VendorDetails;
