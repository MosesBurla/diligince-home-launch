import React, { useState } from "react";
import { Helmet } from "react-helmet";
import IndustryHeader from "@/components/industry/IndustryHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStakeholder } from "@/contexts/StakeholderContext";
import { VendorDetailsModal } from "@/components/stakeholder/VendorDetailsModal";
import { ExpertDetailsModal } from "@/components/stakeholder/ExpertDetailsModal";
import { AddExpertModal } from "@/components/industry/AddExpertModal";
import { AddVendorModal } from "@/components/industry/AddVendorModal";
import { StakeholderProfile } from "@/types/stakeholder";
import { useModal } from "@/hooks/useModal";
import { Star, MapPin, Award, Mail, CheckCircle, Clock } from "lucide-react";

const Vendors = () => {
  const { stakeholderProfiles, applications, getInvitationStatus } =
    useStakeholder();
  const [selectedStakeholder, setSelectedStakeholder] =
    useState<StakeholderProfile | null>(null);
  const {
    isOpen: isVendorModalOpen,
    openModal: openVendorModal,
    closeModal: closeVendorModal,
  } = useModal();
  const {
    isOpen: isExpertModalOpen,
    openModal: openExpertModal,
    closeModal: closeExpertModal,
  } = useModal();
  const {
    isOpen: isAddExpertModalOpen,
    openModal: openAddExpertModal,
    closeModal: closeAddExpertModal,
  } = useModal();
  const {
    isOpen: isAddVendorModalOpen,
    openModal: openAddVendorModal,
    closeModal: closeAddVendorModal,
  } = useModal();

  // Filter stakeholders by type
  const vendors = stakeholderProfiles.filter(
    (s) =>
      s.type === "product_vendor" ||
      s.type === "service_vendor" ||
      s.type === "logistics_vendor"
  );
  const experts = stakeholderProfiles.filter((s) => s.type === "expert");

  const handleViewDetails = (stakeholder: StakeholderProfile) => {
    setSelectedStakeholder(stakeholder);
    if (stakeholder.type === "expert") {
      openExpertModal();
    } else {
      openVendorModal();
    }
  };

  const getStakeholderTypeLabel = (type: string) => {
    switch (type) {
      case "product_vendor":
        return "Product Vendor";
      case "service_vendor":
        return "Service Vendor";
      case "logistics_vendor":
        return "Logistics Vendor";
      case "expert":
        return "Expert Professional";
      default:
        return "Stakeholder";
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "product_vendor":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "service_vendor":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "expert":
        return "bg-green-50 text-green-700 border-green-200";
      case "logistics_vendor":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const hasActiveApplications = (stakeholderId: string) => {
    return applications.some(
      (app) =>
        app.stakeholderId === stakeholderId &&
        (app.status === "accepted" || app.status === "pending")
    );
  };

  const getInvitationStatusIcon = (stakeholderId: string) => {
    const invitation = getInvitationStatus(stakeholderId);
    if (!invitation) return null;

    switch (invitation.status) {
      case "sent":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "opened":
        return <Mail className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Stakeholders | Diligince.ai</title>
      </Helmet>

      

      <main className="flex-1 container mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stakeholders</h1>
            <p className="text-gray-700 text-lg mt-2">
              Manage your vendors and expert professionals
            </p>
          </div>
        </div>

        <Tabs defaultValue="vendors" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-100">
            <TabsTrigger
              value="vendors"
              className="data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50"
            >
              Vendors ({vendors.length})
            </TabsTrigger>
            <TabsTrigger
              value="experts"
              className="data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50"
            >
              Expert Professionals ({experts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="space-y-6 mt-8">
            <div className="flex justify-end">
              <Button
                onClick={openAddVendorModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Add Vendor
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <Card
                  key={vendor.id}
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {vendor.name}
                          </CardTitle>
                          {getInvitationStatusIcon(vendor.id)}
                        </div>
                        <CardDescription className="text-gray-600 mt-1">
                          {getStakeholderTypeLabel(vendor.type)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {vendor.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{vendor.location}</span>
                      </div>

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Projects Completed:</span>{" "}
                        {vendor.completedProjects}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Specializations:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {vendor.specializations.slice(0, 2).map((spec, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className={
                                getCategoryColor(vendor.type) + " text-xs"
                              }
                            >
                              {spec}
                            </Badge>
                          ))}
                          {vendor.specializations.length > 2 && (
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-600 border-gray-200 text-xs"
                            >
                              +{vendor.specializations.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(vendor)}
                        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        View Details
                      </Button>
                      {hasActiveApplications(vendor.id) && (
                        <Button
                          size="sm"
                          asChild
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                          <Link to="/work-completion-payment">
                            Review & Pay
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experts" className="space-y-6 mt-8">
            <div className="flex justify-end">
              <Button
                onClick={openAddExpertModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Add Expert Professional
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts.map((expert) => (
                <Card
                  key={expert.id}
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {expert.name}
                          </CardTitle>
                          {getInvitationStatusIcon(expert.id)}
                        </div>
                        <CardDescription className="text-gray-600 mt-1">
                          Expert Professional
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {expert.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{expert.location}</span>
                      </div>

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Experience:</span>{" "}
                        {expert.completedProjects} projects
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Expertise:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {expert.specializations.slice(0, 2).map((spec, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 text-xs"
                            >
                              {spec}
                            </Badge>
                          ))}
                          {expert.specializations.length > 2 && (
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-600 border-gray-200 text-xs"
                            >
                              +{expert.specializations.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Certifications:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {expert.certifications.slice(0, 2).map((cert, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
                            >
                              <Award className="h-3 w-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                          {expert.certifications.length > 2 && (
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-600 border-gray-200 text-xs"
                            >
                              +{expert.certifications.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(expert)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Detail Modals */}
      {selectedStakeholder && selectedStakeholder.type !== "expert" && (
        <VendorDetailsModal
          isOpen={isVendorModalOpen}
          onClose={closeVendorModal}
          vendor={selectedStakeholder}
          onCreatePO={() => {
            closeVendorModal();
            // Navigate to create PO page with vendor pre-selected
          }}
        />
      )}

      {selectedStakeholder && selectedStakeholder.type === "expert" && (
        <ExpertDetailsModal
          isOpen={isExpertModalOpen}
          onClose={closeExpertModal}
          expert={selectedStakeholder}
          onHireExpert={() => {
            closeExpertModal();
            // Navigate to expert hiring workflow
          }}
        />
      )}

      {/* Add Modals */}
      <AddVendorModal
        isOpen={isAddVendorModalOpen}
        onClose={closeAddVendorModal}
      />

      <AddExpertModal
        isOpen={isAddExpertModalOpen}
        onClose={closeAddExpertModal}
      />
    </div>
  );
};

export default Vendors;
