import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import RFQBrowseCard from '@/components/vendor/shared/RFQBrowseCard';
import { vendorRFQsService } from '@/services/modules/vendors/rfqs.service';
import { RFQBrowseItem } from '@/types/rfq-browse';
import { Button } from '@/components/ui/button';
import { RefreshCw, Bookmark } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const VendorRFQsSaved = () => {
    const navigate = useNavigate();

    // Fetch saved RFQs
    const {
        data: savedData,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ['vendor-rfqs', 'saved'],
        queryFn: () => vendorRFQsService.getSavedRFQs(),
        refetchOnMount: 'always',
    });

    const rfqs = savedData?.data?.rfqs || [];

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

    const handleToggleSave = async (rfq: RFQBrowseItem) => {
        try {
            await vendorRFQsService.toggleSaveRFQ(rfq.id);
            // Refetch saved RFQs to update the list
            refetch();
        } catch (error) {
            toast.error('Failed to update saved RFQ');
        }
    };

    return (
        <div className="p-6 bg-background min-h-screen space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Saved RFQs</h1>
                    <p className="text-muted-foreground">
                        RFQs you've bookmarked for later review
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
                        <Bookmark className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        No Saved RFQs
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                        You haven't saved any RFQs yet. Browse available RFQs and bookmark the ones you're interested in.
                    </p>
                    <Button onClick={() => navigate('/dashboard/service-vendor-rfqs')}>
                        Browse RFQs
                    </Button>
                </div>
            ) : (
                <>
                    <div className="text-sm text-muted-foreground">
                        {rfqs.length} {rfqs.length === 1 ? 'RFQ' : 'RFQs'} saved
                    </div>
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
                </>
            )}
        </div>
    );
};

export default VendorRFQsSaved;
