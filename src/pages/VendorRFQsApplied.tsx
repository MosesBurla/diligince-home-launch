import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import RFQBrowseCard from '@/components/vendor/shared/RFQBrowseCard';
import AISearchBar from '@/components/vendor/shared/AISearchBar';
import { vendorRFQsService } from '@/services/modules/vendors/rfqs.service';
import { RFQBrowseItem } from '@/types/rfq-browse';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const VendorRFQsApplied = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch applied RFQs
    const {
        data: appliedData,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ['vendor-rfqs', 'applied', searchQuery, currentPage],
        queryFn: () => vendorRFQsService.getAppliedRFQs({
            query: searchQuery || undefined,
            page: currentPage,
            limit: 12
        }),
        refetchOnMount: 'always',
    });

    const rfqs = appliedData?.data?.rfqs || [];
    const pagination = appliedData?.data?.pagination;

    const handleViewDetails = (rfq: RFQBrowseItem) => {
        navigate(`/dashboard/rfqs/${rfq.id}`);
    };

    const handleSubmitQuote = (rfq: RFQBrowseItem) => {
        // This shouldn't be called for applied RFQs, but keeping for consistency
        navigate(`/dashboard/rfqs/${rfq.id}/submit-quotation`);
    };

    const handleViewQuote = (rfq: RFQBrowseItem) => {
        if (rfq.quotationId) {
            navigate(`/dashboard/vendor/quotations/${rfq.quotationId}`);
        } else {
            toast.error('Quotation not found');
        }
    };

    const handleToggleSave = async (rfq: RFQBrowseItem) => {
        try {
            await vendorRFQsService.toggleSaveRFQ(rfq.id);
            refetch();
        } catch (error) {
            toast.error('Failed to update saved RFQ');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on new search
    };

    return (
        <div className="p-6 bg-background min-h-screen space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Applied RFQs</h1>
                    <p className="text-muted-foreground">
                        RFQs where you've submitted quotations
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="self-start"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* AI Search Bar */}
            <AISearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search applied RFQs with AI..."
                isLoading={isLoading}
            />

            {/* Results count */}
            {pagination && (
                <div className="text-sm text-muted-foreground">
                    Showing {rfqs.length} of {pagination.total} applied RFQs
                </div>
            )}

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
                        <FileCheck className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        No Applied RFQs
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                        {searchQuery
                            ? 'No applied RFQs match your search. Try adjusting your query or clear the search.'
                            : "You haven't submitted any quotations yet. Browse available RFQs and submit your proposals."}
                    </p>
                    {searchQuery ? (
                        <Button variant="outline" onClick={() => handleSearch('')}>
                            Clear Search
                        </Button>
                    ) : (
                        <Button onClick={() => navigate('/dashboard/service-vendor-rfqs')}>
                            Browse RFQs
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
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPreviousPage}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <Button
                                key={i}
                                variant={currentPage === i + 1 ? 'default' : 'outline'}
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
                        onClick={() => handlePageChange(currentPage + 1)}
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

export default VendorRFQsApplied;
