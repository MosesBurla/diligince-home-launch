import { useState, useEffect } from "react";
import { UserCheck, Search, Sparkles } from "lucide-react";
import { ProfessionalCard } from "@/components/Diligince-hub/ProfessionalCard";
import { SearchFilterBar } from "@/components/Diligince-hub/SearchFilterBar";
import { EmptyState } from "@/components/Diligince-hub/EmptyState";
import { CardGridSkeletonLoader } from "@/components/shared/loading";
import type { ProfessionalListItem, ProfessionalSearchFilters } from "@/types/professional";

// Mock data for development
const mockProfessionals: ProfessionalListItem[] = [
  {
    id: "prof_001",
    name: "Dr. Vikram Singh",
    expertise: ["Quality Control & Assurance", "Six Sigma"],
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
    expertise: ["Manufacturing Quality Engineer"],
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
    expertise: ["Quality Control Specialist"],
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
        p.expertise.some(e => e.toLowerCase().includes(term)) ||
        p.skills.some(s => s.toLowerCase().includes(term))
      );
    }

    // Rating filter
    if (filters.rating) {
      result = result.filter(p => p.rating >= filters.rating!);
    }

    // Expertise filter
    if (filters.expertise && filters.expertise.length > 0) {
      result = result.filter(p => 
        filters.expertise!.some(filterExp => 
          p.expertise.some(pExp => pExp.toLowerCase().includes(filterExp.toLowerCase()))
        )
      );
    }

    // Location filter
    if (filters.location) {
      result = result.filter(p => p.city === filters.location);
    }

    setFilteredProfessionals(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#fff] from-primary/5 via-primary/10 to-accent/5 border-b">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <UserCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Find Top Professionals
                </h1>
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Connect with verified industry experts and specialists for your projects
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SearchFilterBar
          type="professionals"
          onSearch={setSearchTerm}
          onFilterChange={setFilters}
          filters={filters}
        />

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredProfessionals.length}</span> {filteredProfessionals.length === 1 ? 'professional' : 'professionals'} available
          </p>
        </div>

        {filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional, index) => (
              <div 
                key={professional.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProfessionalCard professional={professional} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No professionals found"
            description="Try adjusting your search criteria or filters to find more professionals"
            icon={<UserCheck className="w-12 h-12 text-muted-foreground" />}
          />
        )}

        {isLoading && (
          <CardGridSkeletonLoader count={6} columns={3} />
        )}
      </div>
    </div>
  );
};

export default FindProfessionals;
