
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import IndustryHeader from "@/components/industry/IndustryHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, Star, MapPin, Phone, Mail, Building } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { InviteStakeholderModal } from "@/components/stakeholder/InviteStakeholderModal";
import { ProjectSelectionModal } from "@/components/stakeholder/ProjectSelectionModal";
import { StakeholderStatusBadge } from "@/components/stakeholder/StakeholderStatusBadge";

interface Stakeholder {
  id: string;
  name: string;
  type: "Product Vendor" | "Service Vendor" | "Logistics" | "Expert";
  rating: number;
  location: string;
  specializations: string[];
  email: string;
  phone: string;
  completedProjects: number;
  initials: string;
  status: 'invited' | 'pre-qualified' | 'approved' | 'active' | 'suspended' | 'rejected';
}

const mockStakeholders: Stakeholder[] = [
  {
    id: "1",
    name: "TechValve Solutions",
    type: "Product Vendor",
    rating: 4.8,
    location: "Houston, TX",
    specializations: ["Industrial Valves", "Pressure Systems", "Safety Equipment"],
    email: "contact@techvalve.com",
    phone: "+1 (555) 123-4567",
    completedProjects: 28,
    initials: "TV",
    status: 'approved'
  },
  {
    id: "2",
    name: "EngiConsult Group",
    type: "Expert",
    rating: 4.9,
    location: "Dallas, TX",
    specializations: ["Chemical Engineering", "Process Optimization", "Safety Audits"],
    email: "experts@engiconsult.com",
    phone: "+1 (555) 234-5678",
    completedProjects: 45,
    initials: "EG",
    status: 'active'
  },
  {
    id: "3",
    name: "Service Pro Maintenance",
    type: "Service Vendor",
    rating: 4.7,
    location: "Austin, TX",
    specializations: ["Equipment Maintenance", "Inspection Services", "Repairs"],
    email: "service@servicepro.com",
    phone: "+1 (555) 345-6789",
    completedProjects: 32,
    initials: "SP",
    status: 'approved'
  },
  {
    id: "4",
    name: "FastTrack Logistics",
    type: "Logistics",
    rating: 4.6,
    location: "San Antonio, TX",
    specializations: ["Heavy Equipment Transport", "Hazmat Shipping", "Warehousing"],
    email: "logistics@fasttrack.com",
    phone: "+1 (555) 456-7890",
    completedProjects: 67,
    initials: "FL",
    status: 'active'
  }
];

const IndustryStakeholders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  
  // Modal states
  const inviteModal = useModal();
  const projectModal = useModal();

  const filteredStakeholders = mockStakeholders.filter(stakeholder => {
    const matchesSearch = stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stakeholder.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "all" || stakeholder.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Product Vendor": return "bg-purple-100 text-purple-800";
      case "Service Vendor": return "bg-blue-100 text-blue-800";
      case "Expert": return "bg-green-100 text-green-800";
      case "Logistics": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Handler functions - Updated for ISO compliance
  const handleViewProfile = (stakeholderId: string) => {
    console.log('Viewing stakeholder profile:', stakeholderId);
    window.open(`/vendor-details/${stakeholderId}`, '_blank');
  };

  const handleInviteToProject = (stakeholder: Stakeholder) => {
    console.log('Opening project selection for stakeholder:', stakeholder.id);
    setSelectedStakeholder(stakeholder);
    projectModal.openModal();
  };

  const handleInviteStakeholder = () => {
    console.log('Opening invite stakeholder modal');
    inviteModal.openModal();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Stakeholder Management | Diligince.ai</title>
      </Helmet>
      
      
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stakeholder Management</h1>
          <p className="text-gray-600">Find and manage your approved vendors, experts, and service providers</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search stakeholders by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button 
              onClick={handleInviteStakeholder}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Invite Stakeholder
            </Button>
          </div>
        </div>

        <Tabs value={selectedType} onValueChange={setSelectedType} className="mb-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="all">All ({mockStakeholders.length})</TabsTrigger>
            <TabsTrigger value="Product Vendor">Products</TabsTrigger>
            <TabsTrigger value="Service Vendor">Services</TabsTrigger>
            <TabsTrigger value="Expert">Experts</TabsTrigger>
            <TabsTrigger value="Logistics">Logistics</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStakeholders.map((stakeholder) => (
            <Card key={stakeholder.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100">
                      <AvatarFallback className="text-blue-600 font-semibold">
                        {stakeholder.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{stakeholder.rating}</span>
                        <span className="text-sm text-gray-500">({stakeholder.completedProjects} projects)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getTypeColor(stakeholder.type)}>
                      {stakeholder.type}
                    </Badge>
                    <StakeholderStatusBadge status={stakeholder.status} size="sm" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {stakeholder.location}
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {stakeholder.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {stakeholder.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {stakeholder.phone}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewProfile(stakeholder.id)}
                  >
                    View Profile
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleInviteToProject(stakeholder)}
                    disabled={stakeholder.status === 'suspended' || stakeholder.status === 'rejected'}
                  >
                    Invite to Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStakeholders.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stakeholders found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or invite new stakeholders.</p>
            <Button 
              onClick={handleInviteStakeholder}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Invite Stakeholder
            </Button>
          </div>
        )}
      </main>

      {/* Modals */}
      <InviteStakeholderModal
        isOpen={inviteModal.isOpen}
        onClose={inviteModal.closeModal}
      />

      {selectedStakeholder && (
        <ProjectSelectionModal
          isOpen={projectModal.isOpen}
          onClose={() => {
            projectModal.closeModal();
            setSelectedStakeholder(null);
          }}
          stakeholderName={selectedStakeholder.name}
          stakeholderId={selectedStakeholder.id}
        />
      )}
    </div>
  );
};

export default IndustryStakeholders;
