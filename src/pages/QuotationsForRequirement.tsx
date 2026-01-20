import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AISearchBar from "@/components/shared/AISearchBar";
import AIViewToggle, { ViewMode } from "@/components/shared/AIViewToggle";
import CustomTable from "@/components/CustomTable";
import type { ColumnConfig } from "@/types/table";
import { quotationService } from "@/services/modules/quotations";
import requirementListService from "@/services/requirement-list.service";
import { toast } from "sonner";

interface QuotationForList {
    id: string;
    quotationNumber: string;
    vendorId: string;
    vendorName: string;
    vendorRating: number;
    requirementTitle: string;
    requirementId: string;
    quotedAmount: number;
    currency: string;
    validUntil: string;
    submittedDate: string;
    status: string;
    deliveryTimeWeeks: number;
    paymentTerms: string;
    proposalSummary?: string;
    responseTime?: string;
}

const QuotationsForRequirement: React.FC = () => {
    const { draftId } = useParams<{ draftId: string }>();
    const navigate = useNavigate();

    // State
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("all");

    // Fetch requirement details
    const { data: requirement, isLoading: isLoadingRequirement } = useQuery({
        queryKey: ["requirement", draftId],
        queryFn: async () => {
            if (!draftId) return null;
            // Get requirement from published list
            const response = await requirementListService.getPublished({
                page: 1,
                limit: 1,
                filters: { draftId },
            } as any);
            return response.data?.requirements?.[0] || null;
        },
        enabled: !!draftId,
    });

    // Fetch quotations for requirement
    const {
        data: quotationsResponse,
        isLoading: isLoadingQuotations,
        refetch,
    } = useQuery({
        queryKey: ["quotations", "byRequirement", draftId, searchQuery, viewMode],
        queryFn: async () => {
            if (!draftId) return null;
            const response = await quotationService.getByRequirement(draftId, {
                search: searchQuery || undefined,
                aiRecommended: viewMode === "recommended" || undefined,
            } as any);
            return response;
        },
        enabled: !!draftId,
    });

    // Handle different response formats from API
    const rawData = quotationsResponse?.data;
    const quotations = ((): any[] => {
        if (!rawData) return [];
        if (Array.isArray(rawData)) return rawData;
        if (rawData.quotations && Array.isArray(rawData.quotations)) return rawData.quotations;
        return [];
    })();
    const isLoading = isLoadingRequirement || isLoadingQuotations;

    // Transform quotations for table
    const tableData = quotations.map((q: any) => ({
        id: q.quotationNumber || q.id,
        quotationId: q.id,
        vendorName: q.vendorName || "Unknown Vendor",
        quotedAmount: `${q.currency || "INR"} ${(
            q.quotedAmount || 0
        ).toLocaleString()}`,
        validUntil: q.validUntil
            ? new Date(q.validUntil).toLocaleDateString()
            : "N/A",
        submittedDate: q.submittedDate
            ? new Date(q.submittedDate).toLocaleDateString()
            : "N/A",
        status: q.status || "submitted",
        deliveryTime: `${q.deliveryTimeWeeks || 0} weeks`,
        vendorRating: (q.vendorRating || 0).toFixed(1),
        // Raw data for modal
        _raw: q,
    }));

    const columns: ColumnConfig[] = [
        {
            name: "id",
            label: "Quote ID",
            isSortable: true,
            isSearchable: true,
            width: "150px",
        },
        {
            name: "vendorName",
            label: "Vendor",
            isSortable: true,
            isSearchable: true,
        },
        {
            name: "quotedAmount",
            label: "Amount",
            isSortable: true,
            align: "right",
        },
        {
            name: "deliveryTime",
            label: "Delivery",
            isSortable: true,
            align: "center",
        },
        {
            name: "vendorRating",
            label: "Rating",
            isSortable: true,
            align: "center",
        },
        {
            name: "validUntil",
            label: "Valid Until",
            isSortable: true,
        },
        {
            name: "status",
            label: "Status",
            isSortable: true,
            isFilterable: true,
            filterOptions: [
                { key: "submitted", value: "Submitted", color: "#fef3c7" },
                { key: "pending_review", value: "Pending Review", color: "#fef3c7" },
                { key: "under_review", value: "Under Review", color: "#dbeafe" },
                { key: "approved", value: "Approved", color: "#dcfce7" },
                { key: "rejected", value: "Rejected", color: "#fecaca" },
                { key: "draft", value: "Draft", color: "#e5e7eb" },
            ],
        },
    ];

    const handleRowClick = (row: any) => {
        // Navigate directly to quotation details page
        const quotation = quotations.find(
            (q: any) => (q.quotationNumber || q.id) === row.id
        );
        if (quotation) {
            navigate(`/dashboard/quotations/${quotation.id}`);
        }
    };

    const handleRefresh = () => {
        refetch();
        toast.success("Quotations refreshed");
    };

    return (
        <div className="p-6 bg-background min-h-screen space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Quotations for Requirement
                    </h1>
                    {isLoadingRequirement ? (
                        <Skeleton className="h-5 w-64 mt-1" />
                    ) : (
                        <p className="text-muted-foreground">
                            {requirement?.title || "Loading..."} • {quotations.length}{" "}
                            quotation{quotations.length !== 1 ? "s" : ""} received
                        </p>
                    )}
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* AI Search Bar */}
            <AISearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search quotations with AI..."
                isLoading={isLoading}
            />

            {/* View Toggle */}
            <div className="flex items-center justify-between">
                <AIViewToggle
                    value={viewMode}
                    onChange={setViewMode}
                    recommendedLabel="AI Recommended"
                />
                {quotations.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                        Showing {quotations.length} quotation
                        {quotations.length !== 1 ? "s" : ""}
                    </div>
                )}
            </div>

            {/* Quotations Table */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 p-4 border rounded-lg"
                        >
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                        </div>
                    ))}
                </div>
            ) : quotations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <RefreshCw className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        No Quotations Found
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                        {searchQuery || viewMode === "recommended"
                            ? "No quotations match your search criteria. Try adjusting your query or view all quotations."
                            : "No quotations have been submitted for this requirement yet."}
                    </p>
                    {(searchQuery || viewMode === "recommended") && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setViewMode("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            ) : (
                <CustomTable
                    columns={columns}
                    data={tableData}
                    onRowClick={handleRowClick}
                    globalSearchPlaceholder="Filter quotations..."
                    pagination={{
                        enabled: true,
                        pageSize: 10,
                        currentPage: 1,
                        onPageChange: () => { },
                    }}
                />
            )}
        </div>
    );
};

export default QuotationsForRequirement;
