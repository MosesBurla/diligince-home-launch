import { useState, useEffect } from "react";
import { UserCheck } from "lucide-react";
import { ProfessionalCard } from "@/components/Diligince-hub/ProfessionalCard";
import { SearchFilterBar } from "@/components/Diligince-hub/SearchFilterBar";
import { EmptyState } from "@/components/Diligince-hub/EmptyState";
import type { ProfessionalListItem, ProfessionalSearchFilters } from "@/types/professional";

// Mock data for development
const mockProfessionals: ProfessionalListItem[] = [
  {
    id: "prof_001",
    name: "Dr. Vikram Singh",
    expertise: "Quality Control & Assurance",
    experience: 15,
    location: "Pune, Maharashtra",
    city: "Pune",
    state: "Maharashtra",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 3500,
    currency: "INR",
    availability: "available",
    skills: ["Six Sigma Black Belt", "ISO 9001 Auditing", "Statistical Process Control", "Root Cause Analysis", "Quality Management Systems", "Lean Manufacturing", "Process Improvement", "Supplier Quality Management"],
    topSkills: ["Six Sigma Black Belt", "ISO 9001 Auditing", "Statistical Process Control", "Root Cause Analysis"],
    completedProjects: 89,
    responseTime: "Within 1 hour",
    certificationCount: 8,
    isVerified: true,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=VS"
  },
  {
    id: "prof_002",
    name: "Sneha Deshmukh",
    expertise: "Manufacturing Quality Engineer",
    experience: 10,
    location: "Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    rating: 4.7,
    reviewCount: 94,
    hourlyRate: 2800,
    currency: "INR",
    availability: "available",
    skills: ["Quality Assurance", "FMEA", "Control Plans", "MSA", "APQP", "PPAP", "Quality Auditing", "GD&T"],
    topSkills: ["Quality Assurance", "FMEA", "Control Plans", "MSA"],
    completedProjects: 67,
    responseTime: "Within 2 hours",
    certificationCount: 5,
    isVerified: true
  },
  {
    id: "prof_003",
    name: "Arjun Mehta",
    expertise: "Quality Control Specialist",
    experience: 8,
    location: "Bengaluru, Karnataka",
    city: "Bengaluru",
    state: "Karnataka",
    rating: 4.8,
    reviewCount: 76,
    hourlyRate: 2500,
    currency: "INR",
    availability: "available",
    skills: ["Inspection Planning", "Testing Procedures", "Calibration Management", "Non-Destructive Testing", "Quality Documentation", "Corrective Actions"],
    topSkills: ["Inspection Planning", "Testing Procedures", "Calibration Management", "Non-Destructive Testing"],
    completedProjects: 52,
    responseTime: "Within 3 hours",
    certificationCount: 4,
    isVerified: false
  },
];

const FindProfessionals: React.FC = () => {
  const [professionals, setProfessionals] = useState<ProfessionalListItem[]>(mockProfessionals);
  const [filteredProfessionals, setFilteredProfessionals] = useState<ProfessionalListItem[]>(mockProfessionals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ProfessionalSearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    filterProfessionals();
  }, [searchTerm, filters]);

  const filterProfessionals = () => {
    let result = [...professionals];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.expertise.toLowerCase().includes(term) ||
        p.skills.some(s => s.toLowerCase().includes(term))
      );
    }

    // Rating filter
    if (filters.rating) {
      result = result.filter(p => p.rating >= filters.rating!);
    }

    // Expertise filter
    if (filters.expertise) {
      result = result.filter(p => p.expertise === filters.expertise);
    }

    // Location filter
    if (filters.location) {
      result = result.filter(p => p.city === filters.location);
    }

    setFilteredProfessionals(result);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <UserCheck className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Find Professionals</h1>
        </div>
        <p className="text-muted-foreground">
          Connect with expert professionals to support your business needs
        </p>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        type="professionals"
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
        filters={filters}
      />

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProfessionals.length} {filteredProfessionals.length === 1 ? 'professional' : 'professionals'}
        </p>
      </div>

      {/* Professional Grid */}
      {filteredProfessionals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No professionals found"
          description="Try adjusting your search criteria or filters to find more professionals"
          icon={<UserCheck className="w-12 h-12 text-muted-foreground" />}
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

export default FindProfessionals;
