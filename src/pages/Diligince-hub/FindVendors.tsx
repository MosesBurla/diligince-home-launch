import { useState, useEffect } from "react";
import { Building, Search, Sparkles, TrendingUp, Award } from "lucide-react";
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

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(term) ||
        v.companyName.toLowerCase().includes(term) ||
        v.specialization.some(s => s.toLowerCase().includes(term))
      );
    }

    if (filters.rating) {
      result = result.filter(v => v.rating >= filters.rating!);
    }

    if (filters.category) {
      result = result.filter(v => v.vendorType === filters.category);
    }

    if (filters.location) {
      result = result.filter(v => v.city === filters.location);
    }

    setFilteredVendors(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#fff] from-primary/5 via-primary/10 to-accent/5 border-b">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Building className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Find Trusted Vendors
                </h1>
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Discover and connect with verified vendors for all your procurement needs
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <SearchFilterBar
          type="vendors"
          onSearch={setSearchTerm}
          onFilterChange={setFilters}
          filters={filters}
        />

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredVendors.length}</span> {filteredVendors.length === 1 ? 'vendor' : 'vendors'} available
          </p>
        </div>

        {/* Vendor Grid */}
        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor, index) => (
              <div 
                key={vendor.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <VendorCard vendor={vendor} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No vendors found"
            description="Try adjusting your search criteria or filters to find more vendors"
            icon={<Building className="w-12 h-12 text-muted-foreground" />}
          />
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindVendors;
