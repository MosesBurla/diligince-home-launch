import { useState, useEffect, useCallback } from "react";
import { Building2, ShieldCheck, Users } from "lucide-react";
import { VendorCard } from "@/components/Diligince-hub/VendorCard";
import { SearchFilterBar } from "@/components/Diligince-hub/SearchFilterBar";
import { EmptyState } from "@/components/Diligince-hub/EmptyState";
import { CardGridSkeletonLoader } from "@/components/shared/loading";
import { Badge } from "@/components/ui/badge";
import { hubService } from "@/services/modules/hub/hub.service";
import type { HubVendor } from "@/services/modules/hub/hub.service";
import type { VendorType } from "@/types/vendor";

const FindVendors: React.FC = () => {
  const [vendors, setVendors] = useState<HubVendor[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await hubService.getVendors({
        search: searchTerm || undefined,
        vendorType: filters.vendorType,
        rating: filters.rating,
        state: filters.state,
        limit: 24,
      });
      if (response.success) {
        setVendors(response.data.vendors);
        setTotal(response.data.total);
      }
    } catch (err) {
      console.error('[FindVendors] fetch error:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Adapt HubVendor to the shape VendorCard expects
  const toVendorCardItem = (v: HubVendor) => ({
    id: v.id,
    name: v.name,
    companyName: v.companyName,
    vendorType: (v.vendorType === 'LogisticsVendor' ? 'logistics'
      : v.vendorType === 'ProductVendor' ? 'product' : 'service') as VendorType,
    specialization: v.specialization,
    location: v.location,
    city: v.city,
    state: v.state,
    rating: v.rating,
    reviewCount: v.reviewCount,
    completedProjects: v.completedProjects,
    yearsInBusiness: v.yearsInBusiness,
    isVerified: v.isVerified,
    availability: v.availability,
    responseTime: v.responseTime,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Page Header — matches dashboard page style */}
      <div className="bg-background border-b px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-5 h-5 text-primary" />
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Find Trusted Vendors</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover and connect with verified vendors for all your procurement needs
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
        {/* Search and Filters */}
        <SearchFilterBar
          type="vendors"
          onSearch={setSearchTerm}
          onFilterChange={setFilters}
          filters={filters}
        />

        {/* Results Row */}
        <div className="mb-6 flex items-center justify-between">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading vendors...</p>
          ) : hasError ? (
            <p className="text-sm text-destructive">Failed to load vendors. Please try again.</p>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{total}</span>{' '}
                {total === 1 ? 'vendor' : 'vendors'} found
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
        {!isLoading && !hasError && vendors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor, index) => (
              <div
                key={vendor.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <VendorCard vendor={toVendorCardItem(vendor)} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasError && vendors.length === 0 && (
          <EmptyState
            title="No verified vendors found"
            description="No approved vendors match your current search criteria. Try adjusting your filters."
            icon={<Building2 className="w-12 h-12 text-muted-foreground" />}
          />
        )}

        {/* Error State */}
        {!isLoading && hasError && (
          <EmptyState
            title="Could not load vendors"
            description="There was an error fetching vendor profiles. Please refresh and try again."
            icon={<Building2 className="w-12 h-12 text-muted-foreground" />}
          />
        )}
      </div>
    </div>
  );
};

export default FindVendors;
