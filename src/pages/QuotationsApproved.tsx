import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import CustomTable from "@/components/CustomTable";
import { ColumnConfig, FilterConfig } from "@/types/table";
import { quotationService } from "@/services/modules/quotations";
import type { Quotation } from "@/types/quotation";
import { useToast } from "@/hooks/use-toast";
import { TableSkeletonLoader } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import AISearchBar from "@/components/shared/AISearchBar";

const QuotationsApproved = () => {
  const [selectedRows, setSelectedRows] = useState<Quotation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["quotations", "approved", currentPage, pageSize, filters, searchTerm],
    queryFn: () =>
      quotationService.getApproved({
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
    requirementNumber: (q as any).requirementNumber, // Will be populated when backend adds this field
    requirementTitle: q.requirementTitle,
    requirementDisplay: (q as any).requirementNumber || q.requirementTitle || 'N/A',
    vendorName: q.vendorName,
    quotedAmount: `${q.currency} ${q.quotedAmount.toLocaleString()}`,
    approvedDate: q.approvedDate ? new Date(q.approvedDate).toLocaleDateString() : "N/A",
    approvedBy: q.approvedBy || "N/A",
    contractValue: `${q.currency} ${q.quotedAmount.toLocaleString()}`,
    status: q.status,
    quotationId: q.id, // Add quotation ID for Create PO action
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
      name: "requirementDisplay",
      label: "Requirement",
      isSortable: true,
      isSearchable: true,
      action: (row) => navigate(`/dashboard/requirements/${row.requirementId}`),
      width: "180px",
      render: (row) => (
        <span 
          className="text-primary hover:underline cursor-pointer font-medium"
          title={row.requirementTitle}
        >
          {row.requirementNumber || row.requirementTitle || 'N/A'}
        </span>
      ),
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
      name: "contractValue",
      label: "Contract Value",
      isSortable: true,
      align: "right",
    },
    {
      name: "approvedBy",
      label: "Approved By",
      isSortable: true,
      isSearchable: true,
    },
    {
      name: "approvedDate",
      label: "Approved Date",
      isSortable: true,
    },
    {
      name: "status",
      label: "Status",
      isSortable: true,
      isFilterable: true,
      filterOptions: [
        { key: "approved", value: "Approved", color: "#dcfce7" },
      ],
    },
    {
      name: "actions",
      label: "Actions",
      align: "center",
      width: "120px",
      render: (row) => (
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/purchase-orders/create?quotationId=${row.quotationId}`);
          }}
          className="gap-1"
        >
          <Plus className="h-3 w-3" />
          Create PO
        </Button>
      ),
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
      const blob = await quotationService.exportToXLSX({ status: 'approved', ...filters });
      quotationService.downloadFile(blob, `approved-quotations-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast({ title: "Export successful", description: "Approved quotations exported to XLSX" });
    } catch (error) {
      toast({ title: "Export failed", description: "Failed to export quotations", variant: "destructive" });
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await quotationService.exportToCSV({ status: 'approved', ...filters });
      quotationService.downloadFile(blob, `approved-quotations-${new Date().toISOString().split('T')[0]}.csv`);
      toast({ title: "Export successful", description: "Approved quotations exported to CSV" });
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
          <p className="text-destructive">Failed to load approved quotations. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Approved Quotations
        </h1>
        <p className="text-muted-foreground">
          Quotations that have been approved and are ready for contract
          execution
        </p>
      </div>

      {/* AI Search Bar */}
      <AISearchBar
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search approved quotations with AI..."
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

export default QuotationsApproved;
