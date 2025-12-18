import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable from "@/components/CustomTable";
import { ColumnConfig, FilterConfig } from "@/types/table";
import requirementListService from "@/services/requirement-list.service";
import { RequirementListItem } from "@/types/requirement-list";
import { toast } from "sonner";
import { TableSkeletonLoader } from "@/components/shared/loading";
import { useUser } from "@/contexts/UserContext";
import { CreatorFilterDropdown, Creator } from "@/components/shared/CreatorFilterDropdown";
const RequirementsPublished = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [data, setData] = useState<RequirementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<RequirementListItem[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<string>("publishedDate");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<string>("all");
  const [teamMembers, setTeamMembers] = useState<Creator[]>([]);

  const fetchPublished = async () => {
    try {
      setLoading(true);
      const response = await requirementListService.getPublished({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        sortBy,
        order: sortOrder,
        search: searchTerm,
        filters,
        createdById: createdBy === 'me' ? user?.id : createdBy === 'all' ? undefined : createdBy,
      });
      // Defensive check to ensure requirements is an array
      const requirements = Array.isArray(response.data?.requirements)
        ? response.data.requirements
        : [];

      setData(requirements);
      setPagination(response.data.pagination);

      // Update creators from response filters
      if (response.data.filters && response.data.filters.creators) {
        setTeamMembers(response.data.filters.creators);
      }
    } catch (error: any) {
      console.error("Failed to fetch published requirements:", error);
      toast.error(error.message || "Failed to load published requirements");
      // Set empty array on error to prevent crash
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublished();
  }, [pagination.currentPage, pagination.pageSize, sortBy, sortOrder, searchTerm, filters, createdBy]);

  const columns: ColumnConfig[] = [
    {
      name: "id",
      label: "Requirement ID",
      isSortable: true,
      isSearchable: true,
      render: (value, row) => (
        <span className="font-mono text-blue-600 font-semibold">
          {value || row.draftId || 'N/A'}
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
      render: (value, row) => {
        const amount = row.estimatedBudget ?? row.estimatedValue ?? value;
        if (!amount) return '-';
        return `₹${Number(amount).toLocaleString()}`;
      },
    },
    {
      name: "publishedDate",
      label: "Published Date",
      isSortable: true,
      render: (value, row) => {
        const date = row.publishedAt ?? row.publishedDate ?? value;
        if (!date) return '-';
        return new Date(date).toLocaleDateString();
      },
    },
    {
      name: "deadline",
      label: "Quote Deadline",
      isSortable: true,
      render: (value, row) => {
        const date = row.submissionDeadline ?? row.deadline ?? value;
        if (!date) return '-';
        return new Date(date).toLocaleDateString();
      },
    },
    {
      name: "quotesReceived",
      label: "Quotes",
      isSortable: true,
      align: "center",
      render: (value) => {
        const count = value ?? 0;
        return (
          <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            count > 0 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {count}
          </span>
        );
      },
    },
  ];

  const handleFilter = (newFilters: FilterConfig) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (term: string, selectedColumns: string[]) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleExportXLSX = async () => {
    try {
      const blob = await requirementListService.exportToXLSX('published', { filters, sortBy, order: sortOrder, search: searchTerm });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `published-${new Date().toISOString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Published requirements exported to XLSX");
    } catch (error: any) {
      toast.error(error.message || "Failed to export");
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await requirementListService.exportToCSV('published', { filters, sortBy, order: sortOrder, search: searchTerm });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `published-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Published requirements exported to CSV");
    } catch (error: any) {
      toast.error(error.message || "Failed to export");
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="mb-6">
          <div className="h-8 w-60 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-full max-w-lg bg-muted rounded animate-pulse" />
        </div>
        <TableSkeletonLoader rows={5} columns={7} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Published Requirements
        </h1>
        <p className="text-muted-foreground">
          Requirements that are live and accepting quotes from vendors and
          professionals
        </p>
      </div>

      <CustomTable
        columns={columns}
        data={data}
        onRowClick={(row) => navigate(`/dashboard/requirements/published/${row.id || row.draftId}`)}
        filterCallback={handleFilter}
        searchCallback={handleSearch}
        onExport={{
          xlsx: handleExportXLSX,
          csv: handleExportCSV,
        }}
        additionalFilters={
          <CreatorFilterDropdown
            creators={teamMembers}
            selectedCreatorId={createdBy}
            currentUserId={user?.id || ''}
            onSelect={(val) => {
              setCreatedBy(val);
              setPagination(prev => ({ ...prev, currentPage: 1 }));
            }}
          />
        }
        selectable={true}
        onSelectionChange={setSelectedRows}
        globalSearchPlaceholder="Search published requirements..."
        pagination={{
          enabled: true,
          pageSize: pagination.pageSize,
          currentPage: pagination.currentPage,
          onPageChange: (page) => setPagination(prev => ({ ...prev, currentPage: page })),
        }}
      />
    </div>
  );
};

export default RequirementsPublished;
