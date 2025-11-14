import { useState, useEffect } from "react";
import { Building } from "lucide-react";
import { VendorCard } from "@/components/Diligince-hub/VendorCard";
import { SearchFilterBar } from "@/components/Diligince-hub/SearchFilterBar";
import { EmptyState } from "@/components/Diligince-hub/EmptyState";
import type { VendorListItem, VendorSearchFilters } from "@/types/vendor";

// Mock data for development
const mockVendors: VendorListItem[] = [
  {
    id: "vnd_001",
    name: "Rajesh Kumar",
    companyName: "Precision Manufacturing Solutions",
    vendorType: "service",
    specialization: ["CNC Machining", "Quality Control", "Tool & Die Making", "Precision Engineering", "Manufacturing Automation"],
    location: "Andheri East, Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    rating: 4.8,
    reviewCount: 156,
    completedProjects: 243,
    yearsInBusiness: 12,
    isVerified: true,
    availability: "available",
    responseTime: "Within 2 hours",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=RK"
  },
  {
    id: "vnd_002",
    name: "Priya Sharma",
    companyName: "TechFab Industries",
    vendorType: "service",
    specialization: ["Metal Fabrication", "Welding Services", "Sheet Metal Work", "Industrial Coating"],
    location: "Powai, Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    rating: 4.6,
    reviewCount: 98,
    completedProjects: 187,
    yearsInBusiness: 8,
    isVerified: true,
    availability: "busy",
    responseTime: "Within 4 hours"
  },
  {
    id: "vnd_003",
    name: "Amit Patel",
    companyName: "Advanced Tooling Systems",
    vendorType: "product",
    specialization: ["Industrial Tools", "Cutting Tools", "Measuring Instruments", "Safety Equipment", "Pneumatic Tools"],
    location: "Vashi, Navi Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    rating: 4.9,
    reviewCount: 234,
    completedProjects: 512,
    yearsInBusiness: 15,
    isVerified: true,
    availability: "available",
    responseTime: "Within 1 hour"
  },
];

const FindVendors: React.FC = () => {
  const [vendors, setVendors] = useState<VendorListItem[]>(mockVendors);
  const [filteredVendors, setFilteredVendors] = useState<VendorListItem[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<VendorSearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    filterVendors();
  }, [searchTerm, filters]);

  const filterVendors = () => {
    let result = [...vendors];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(term) ||
        v.companyName.toLowerCase().includes(term) ||
        v.specialization.some(s => s.toLowerCase().includes(term))
      );
    }

    // Rating filter
    if (filters.rating) {
      result = result.filter(v => v.rating >= filters.rating!);
    }

    // Category filter
    if (filters.category) {
      result = result.filter(v => v.vendorType === filters.category);
    }

    // Location filter
    if (filters.location) {
      result = result.filter(v => v.city === filters.location);
    }

    setFilteredVendors(result);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Building className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Find Vendors</h1>
        </div>
        <p className="text-muted-foreground">
          Discover and connect with verified vendors for your procurement needs
        </p>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        type="vendors"
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
        filters={filters}
      />

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'}
        </p>
      </div>

      {/* Vendor Grid */}
      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No vendors found"
          description="Try adjusting your search criteria or filters to find more vendors"
          icon={<Building className="w-12 h-12 text-muted-foreground" />}
        />
      )}

      {/* Loading indicator for infinite scroll */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default FindVendors;
