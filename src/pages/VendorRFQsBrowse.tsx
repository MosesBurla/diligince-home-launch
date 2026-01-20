import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import RFQBrowseCard from '@/components/vendor/shared/RFQBrowseCard';
import AISearchBar from '@/components/vendor/shared/AISearchBar';
import RFQViewToggle, { RFQViewMode } from '@/components/vendor/shared/RFQViewToggle';
// import RFQStatsCards from '@/components/vendor/shared/RFQStatsCards'; // Stats moved to Service Vendor Dashboard
import { useVendorRFQs } from '@/hooks/useVendorRFQs';
import { RFQBrowseItem } from '@/types/rfq-browse';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const VendorRFQsBrowse = () => {
  const navigate = useNavigate();
  const {
    rfqs,
    // stats, // Stats moved to Service Vendor Dashboard
    pagination,
    isLoading,
    filters,
    setFilters,
    setQuery,
    setAiRecommended,
    clearFilters,
    toggleSaveRFQ,
    refreshRFQs
  } = useVendorRFQs();

  const handleViewDetails = (rfq: RFQBrowseItem) => {
    navigate(`/dashboard/rfqs/${rfq.id}`);
  };

  const handleSubmitQuote = (rfq: RFQBrowseItem) => {
    if (rfq.hasApplied) {
      toast.info('You have already submitted a quote for this RFQ');
      return;
    }
    navigate(`/dashboard/rfqs/${rfq.id}/submit-quotation`);
  };

  const handleViewQuote = (rfq: RFQBrowseItem) => {
    if (rfq.quotationId) {
      navigate(`/dashboard/vendor/quotations/${rfq.quotationId}`);
    } else {
      toast.error('Quotation not found');
    }
  };

  const handleToggleSave = (rfq: RFQBrowseItem) => {
    toggleSaveRFQ(rfq.id);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = (mode: RFQViewMode) => {
    setAiRecommended(mode === 'recommended');
  };

  return (
    <div className="p-6 bg-background min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Browse RFQs</h1>
          <p className="text-muted-foreground">
            Find and apply to new business opportunities matching your services
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshRFQs}
          className="self-start"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards - Moved to Service Vendor Dashboard
      <RFQStatsCards stats={stats} isLoading={isLoading && !rfqs.length} />
      */}

      {/* AI Search Bar */}
      <AISearchBar
        value={filters.query || ''}
        onChange={setQuery}
        placeholder="Search with AI..."
        isLoading={isLoading}
      />

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <RFQViewToggle
          value={filters.aiRecommended ? 'recommended' : 'all'}
          onChange={handleViewModeChange}
        />

        {/* Results count */}
        {pagination && (
          <div className="text-sm text-muted-foreground">
            Showing {rfqs.length} of {pagination.total} RFQs
          </div>
        )}
      </div>

      {/* RFQ Cards Grid */}
      {isLoading && !rfqs.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4 p-5 border rounded-xl bg-card">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          ))}
        </div>
      ) : rfqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No RFQs Found
          </h3>
          <p className="text-muted-foreground max-w-md mb-4">
            {filters.query || filters.aiRecommended
              ? 'No RFQs match your search. Try adjusting your query or view all RFQs.'
              : 'No RFQs are currently available.'}
          </p>
          {(filters.query || filters.aiRecommended) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {rfqs.map((rfq) => (
            <RFQBrowseCard
              key={rfq.id}
              rfq={rfq}
              onViewDetails={handleViewDetails}
              onSubmitQuote={handleSubmitQuote}
              onViewQuote={handleViewQuote}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPreviousPage}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={pagination.page === i + 1 ? 'default' : 'outline'}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VendorRFQsBrowse;
