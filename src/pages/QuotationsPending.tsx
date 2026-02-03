import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CustomTable from "@/components/CustomTable";
import { ColumnConfig, FilterConfig } from "@/types/table";
import { quotationService } from "@/services/modules/quotations";
import type { Quotation } from "@/types/quotation";
import { useToast } from "@/hooks/use-toast";
import { TableSkeletonLoader } from "@/components/shared/loading";
import AISearchBar from "@/components/shared/AISearchBar";

const QuotationsPending = () => {
  const [selectedRows, setSelectedRows] = useState<Quotation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["quotations", "pending", currentPage, pageSize, filters, searchTerm],
    queryFn: () =>
      quotationService.getPending({
        page: currentPage,
        pageSize,
        search: searchTerm,
        ...filters,
      }),
  });

  const quotations = response?.data.quotations || [];
  const pagination = response?.data.pagination;

  const tableData = quotations.map((q) => ({
    id: q.quotationNumber,
    requirementId: q.requirementId,
    requirementTitle: q.requirementTitle,
    vendorName: q.vendorName,
    quotedAmount: `${q.currency} ${q.quotedAmount.toLocaleString()}`,
    submittedDate: new Date(q.submittedDate).toLocaleDateString(),
    validUntil: new Date(q.validUntil).toLocaleDateString(),
    responseTime: q.responseTime,
    deliveryTime: `${q.deliveryTimeWeeks} weeks`,
    status: q.status,
    vendorRating: q.vendorRating.toFixed(1),
  }));

  const columns: ColumnConfig[] = [
    {
      name: "id",
      label: "Quote ID",
      isSortable: true,
      isSearchable: true,
      action: (row) => {
        const quotation = quotations.find((q) => q.quotationNumber === row.id);
        if (quotation) navigate(`/dashboard/quotations/${quotation.id}`);
      },
      width: "120px",
    },
    {
      name: "requirementId",
      label: "Requirement",
      isSortable: true,
      isSearchable: true,
      action: (row) => navigate(`/dashboard/requirements/${row.requirementId}`),
      width: "120px",
    },
    {
      name: "requirementTitle",
      label: "Title",
      isSortable: true,
      isSearchable: true,
    },
    {
      name: "vendorName",
      label: "Vendor",
      isSortable: true,
      isSearchable: true,
    },
    {
      name: "quotedAmount",
      label: "Quoted Amount",
      isSortable: true,
      align: "right",
    },
    {
      name: "submittedDate",
      label: "Submitted",
      isSortable: true,
    },
    {
      name: "validUntil",
      label: "Valid Until",
      isSortable: true,
    },
    {
      name: "responseTime",
      label: "Response Time",
      isSortable: true,
      align: "center",
    },
    {
      name: "status",
      label: "Status",
      isSortable: true,
      isFilterable: true,
      filterOptions: [
        { key: "pending_review", value: "Pending Review", color: "#fef3c7" },
        { key: "under_evaluation", value: "Under Evaluation", color: "#fed7aa" },
        { key: "awaiting_clarification", value: "Awaiting Clarification", color: "#ddd6fe" },
      ],
    },
  ];

  const handleFilter = (appliedFilters: FilterConfig) => {
    setFilters(appliedFilters);
    setCurrentPage(1);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleExportXLSX = async () => {
    try {
      const blob = await quotationService.exportToXLSX({ status: 'pending_review', ...filters });
      quotationService.downloadFile(blob, `pending-quotations-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast({ title: "Export successful", description: "Pending quotations exported to XLSX" });
    } catch (error) {
      toast({ title: "Export failed", description: "Failed to export quotations", variant: "destructive" });
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await quotationService.exportToCSV({ status: 'pending_review', ...filters });
      quotationService.downloadFile(blob, `pending-quotations-${new Date().toISOString().split('T')[0]}.csv`);
      toast({ title: "Export successful", description: "Pending quotations exported to CSV" });
    } catch (error) {
      toast({ title: "Export failed", description: "Failed to export quotations", variant: "destructive" });
    }
  };

  const handleSelectionChange = (selected: any[]) => {
    const selectedQuotations = selected.map((row) =>
      quotations.find((q) => q.quotationNumber === row.id)
    ).filter(Boolean) as Quotation[];
    setSelectedRows(selectedQuotations);
  };

  if (error) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load pending quotations. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Pending Quotations
        </h1>
        <p className="text-muted-foreground">
          Quotations received from vendors awaiting your review and decision
        </p>
      </div>

      {/* AI Search Bar */}
      <AISearchBar
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search pending quotations with AI..."
        isLoading={isLoading}
        className="mb-6"
      />

      {isLoading ? (
        <TableSkeletonLoader rows={8} columns={6} showFilters showActions />
      ) : (
        <CustomTable
          columns={columns}
          data={tableData}
          filterCallback={handleFilter}
          onExport={{
            xlsx: handleExportXLSX,
            csv: handleExportCSV,
          }}
          selectable={true}
          onSelectionChange={handleSelectionChange}
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

export default QuotationsPending;
