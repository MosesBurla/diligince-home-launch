import { useState, useEffect, useCallback } from "react";
import { UserCheck, ShieldCheck } from "lucide-react";
import { ProfessionalCard } from "@/components/Diligince-hub/ProfessionalCard";
import { SearchFilterBar } from "@/components/Diligince-hub/SearchFilterBar";
import { EmptyState } from "@/components/Diligince-hub/EmptyState";
import { CardGridSkeletonLoader } from "@/components/shared/loading";
import { Badge } from "@/components/ui/badge";
import { hubService } from "@/services/modules/hub/hub.service";
import type { HubProfessional } from "@/services/modules/hub/hub.service";

const FindProfessionals: React.FC = () => {
  const [professionals, setProfessionals] = useState<HubProfessional[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchProfessionals = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await hubService.getProfessionals({
        search: searchTerm || undefined,
        expertise: filters.expertise,
        rating: filters.rating,
        state: filters.state,
        limit: 24,
      });
      if (response.success) {
        setProfessionals(response.data.professionals);
        setTotal(response.data.total);
      }
    } catch (err) {
      console.error('[FindProfessionals] fetch error:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  // Adapt HubProfessional to shape ProfessionalCard expects
  const toProfessionalCardItem = (p: HubProfessional) => ({
    id: p.id,
    name: p.name,
    expertise: p.expertise,
    experience: p.experience,
    location: p.location,
    city: p.city,
    state: p.state,
    rating: p.rating,
    reviewCount: p.reviewCount,
    hourlyRate: p.hourlyRate,
    currency: p.currency,
    availability: p.availability,
    skills: p.skills,
    topSkills: p.topSkills,
    completedProjects: p.completedProjects,
    responseTime: p.responseTime,
    certificationCount: p.certificationCount,
    isVerified: p.isVerified,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Page Header — compact style matching dashboard pages */}
      <div className="bg-background border-b px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-5 h-5 text-primary" />
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Find Top Professionals</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect with verified industry experts and specialists for your projects
              </p>
            </div>

            {/* Verified badge */}
            <Badge
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30 rounded-full text-xs font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Profiles Only
            </Badge>
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

        {/* Results Row */}
        <div className="mb-6 flex items-center justify-between">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading professionals...</p>
          ) : hasError ? (
            <p className="text-sm text-destructive">Failed to load professionals. Please try again.</p>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{total}</span>{' '}
                {total === 1 ? 'professional' : 'professionals'} found
              </p>
              <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                All verified &amp; approved
              </div>
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && <CardGridSkeletonLoader count={6} columns={3} />}

        {/* Results Grid */}
        {!isLoading && !hasError && professionals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((prof, index) => (
              <div
                key={prof.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProfessionalCard professional={toProfessionalCardItem(prof)} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasError && professionals.length === 0 && (
          <EmptyState
            title="No verified professionals found"
            description="No approved professionals match your current filters. Try broadening your search criteria."
            icon={<UserCheck className="w-12 h-12 text-muted-foreground" />}
          />
        )}

        {/* Error State */}
        {!isLoading && hasError && (
          <EmptyState
            title="Could not load professionals"
            description="There was an error fetching professional profiles. Please refresh and try again."
            icon={<UserCheck className="w-12 h-12 text-muted-foreground" />}
          />
        )}
      </div>
    </div>
  );
};

export default FindProfessionals;
