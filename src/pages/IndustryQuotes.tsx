import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CustomTable from "@/components/CustomTable";
import { ColumnConfig, FilterConfig } from "@/types/table";
import AISearchBar from "@/components/shared/AISearchBar";
import requirementListService from "@/services/requirement-list.service";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const IndustryQuotes = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Fetch published requirements
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "requirements",
      "published",
      currentPage,
      pageSize,
      searchQuery,
      filters,
    ],
    queryFn: async () => {
      const result = await requirementListService.getPublished({
        page: currentPage,
        limit: pageSize,
        search: searchQuery || undefined,
        filters,
      } as any);
      return result;
    },
  });

  const requirements = response?.data?.requirements || [];
  const pagination = response?.data?.pagination;

  // Transform data for table - showing only requirements with quotations
  const tableData = requirements.map((req: any) => ({
    id: req.id || req.draftId,
    draftId: req.draftId || req.id,
    title: req.title || "Untitled Requirement",
    category: req.category || "General",
    priority: req.priority || "Medium",
    estimatedValue: req.estimatedBudget || req.estimatedValue || 0,
    publishedDate: req.publishedAt || req.publishedDate,
    deadline: req.submissionDeadline || req.deadline,
    quotesReceived: req.quotesReceived || 0,
  }));

  const columns: ColumnConfig[] = [
    {
      name: "id",
      label: "Requirement ID",
      isSortable: true,
      isSearchable: true,
      render: (value, row) => (
        <span className="font-mono text-blue-600 font-semibold">
          {value || row.draftId || "N/A"}
        </span>
      ),
      width: "150px",
    },
    {
      name: "title",
      label: "Title",
      isSortable: true,
      isSearchable: true,
    },
    {
      name: "category",
      label: "Category",
      isSortable: true,
      isFilterable: true,
      filterOptions: [
        { key: "Software Development", value: "Software Development" },
        { key: "Operations", value: "Operations" },
        { key: "Marketing", value: "Marketing" },
        { key: "Infrastructure", value: "Infrastructure" },
      ],
    },
    {
      name: "priority",
      label: "Priority",
      isSortable: true,
      isFilterable: true,
      filterOptions: [
        { key: "High", value: "High", color: "#fee2e2" },
        { key: "Medium", value: "Medium", color: "#fef3c7" },
        { key: "Low", value: "Low", color: "#dcfce7" },
      ],
    },
    {
      name: "estimatedValue",
      label: "Est. Value",
      isSortable: true,
      align: "right",
      render: (value) => {
        if (!value) return "-";
        return `₹${Number(value).toLocaleString()}`;
      },
    },
    {
      name: "publishedDate",
      label: "Published Date",
      isSortable: true,
      render: (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleDateString();
      },
    },
    {
      name: "deadline",
      label: "Quote Deadline",
      isSortable: true,
      render: (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleDateString();
      },
    },
    {
      name: "quotesReceived",
      label: "Quotations",
      isSortable: true,
      align: "center",
      render: (value) => {
        const count = value ?? 0;
        return (
          <span
            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${count > 0
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
              }`}
          >
            {count}
          </span>
        );
      },
    },
  ];

  const handleRowClick = (row: any) => {
    // Navigate to quotations page for this requirement
    const requirementId = row.draftId || row.id;
    navigate(`/dashboard/quotations/requirement/${requirementId}`);
  };

  const handleFilterCallback = (appliedFilters: FilterConfig) => {
    setFilters(appliedFilters);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Requirements refreshed");
  };

  return (
    <div className="p-6 bg-background min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quotations
          </h1>
          <p className="text-muted-foreground">
            Select a requirement to view and manage vendor quotations
          </p>
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
        placeholder="Search requirements with AI..."
        isLoading={isLoading}
      />

      {/* Requirements Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-48 flex-1" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      ) : requirements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Requirements Found
          </h3>
          <p className="text-muted-foreground max-w-md mb-4">
            {searchQuery
              ? "No requirements match your search. Try adjusting your query."
              : "No published requirements found. Create and publish a requirement to receive quotations."}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <CustomTable
          columns={columns}
          data={tableData}
          onRowClick={handleRowClick}
          filterCallback={handleFilterCallback}
          hideSearch={true}
          pagination={{
            enabled: true,
            pageSize: pageSize,
            currentPage: currentPage,
            onPageChange: setCurrentPage,
          }}
        />
      )}
    </div>
  );
};

export default IndustryQuotes;