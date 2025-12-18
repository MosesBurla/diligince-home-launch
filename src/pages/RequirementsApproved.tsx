import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable from "@/components/CustomTable";
import { ColumnConfig, FilterConfig } from "@/types/table";
import requirementListService from "@/services/requirement-list.service";
import { RequirementListItem } from "@/types/requirement-list";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TableSkeletonLoader } from "@/components/shared/loading";
import { Eye, Rocket } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useUser } from "@/contexts/UserContext";


import { CreatorFilterDropdown, Creator } from "@/components/shared/CreatorFilterDropdown";

const MODULE_ID = 'requirements-approved';

const RequirementsApproved = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const { user } = useUser();

  // Permission checks
  const hasWritePermission = hasPermission(MODULE_ID, 'write');

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
  const [sortBy, setSortBy] = useState<string>("approvedDate");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<string>("all");
  const [teamMembers, setTeamMembers] = useState<Creator[]>([]);

  const fetchApproved = async () => {
    try {
      setLoading(true);
      const response = await requirementListService.getApproved({
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
      console.error("Failed to fetch approved requirements:", error);
      toast.error(error.message || "Failed to load approved requirements");
      // Set empty array on error to prevent crash
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved();
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
        { key: "Marketing Technology", value: "Marketing Technology" },
        { key: "Logistics", value: "Logistics" },
        { key: "IT Infrastructure", value: "IT Infrastructure" },
        { key: "Construction", value: "Construction" },
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
        if (!value) return '-';
        return `₹${Number(value).toLocaleString()}`;
      },
    },
    {
      name: "approvedBy",
      label: "Approved By",
      isSortable: true,
      isSearchable: true,
      render: (value, row) => {
        // Handle object format: { id, name, email }
        if (typeof value === 'object' && value?.name) {
          return value.name;
        }
        // Fallback: get from last approval level
        const lastLevel = (row as any).approvalProgress?.levels?.find(
          (l: any) => l.levelNumber === (row as any).approvalProgress?.totalLevels
        );
        const lastApprover = lastLevel?.approvers?.find((a: any) => a.status === 'approved');
        return lastApprover?.memberName || value || 'N/A';
      },
    },
    {
      name: "approvedDate",
      label: "Approved Date",
      isSortable: true,
      render: (value, row) => {
        // Try direct field first, then fallback to last approval timestamp
        const date = value || (row as any).approvalProgress?.levels?.[(row as any).approvalProgress?.totalLevels - 1]?.completedAt;
        if (!date) return '-';
        return new Date(date).toLocaleDateString();
      },
    },
    {
      name: "publishDate",
      label: "Scheduled Publish",
      isSortable: true,
      render: (value) => {
        if (!value) return <span className="text-muted-foreground">Not scheduled</span>;
        return new Date(value).toLocaleDateString();
      },
    },
    {
      name: "actions",
      label: "Actions",
      render: (value, row) => {
        // Check if current user is the creator (can publish)
        const isCreator = row.submittedBy === user?.email ||
          (row as any).createdBy?.id === user?.id ||
          (row as any).createdBy === user?.id;

        return (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {/* View - Always visible - opens read-only approved view */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const reqId = row.id;
                if (!reqId) {
                  toast.error('Cannot view: Invalid ID');
                  return;
                }
                navigate(`/dashboard/requirements/approved/${reqId}`);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>

            {/* Publish - Only for creators with write permission - opens view with publish action */}
            {isCreator && hasWritePermission && (
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  navigate(`/dashboard/requirements/approved/${row.id}?action=publish`);
                }}
              >
                <Rocket className="h-4 w-4 mr-1" />
                Publish
              </Button>
            )}
          </div>
        );
      },
      width: "220px",
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
      const blob = await requirementListService.exportToXLSX('approved', { filters, sortBy, order: sortOrder, search: searchTerm });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `approved-${new Date().toISOString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Approved requirements exported to XLSX");
    } catch (error: any) {
      toast.error(error.message || "Failed to export");
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await requirementListService.exportToCSV('approved', { filters, sortBy, order: sortOrder, search: searchTerm });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `approved-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Approved requirements exported to CSV");
    } catch (error: any) {
      toast.error(error.message || "Failed to export");
    }
  };

  const handlePublish = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select requirements to publish");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to publish ${selectedRows.length} requirement(s)?`
    );

    if (!confirmed) return;

    try {
      const requirementIds = selectedRows.map(row => row.id);
      await requirementListService.publishApproved(requirementIds);

      toast.success(`${selectedRows.length} requirement(s) published`);
      setSelectedRows([]);
      fetchApproved();
    } catch (error: any) {
      toast.error(error.message || "Failed to publish requirements");
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="mb-6">
          <div className="h-8 w-56 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-muted rounded animate-pulse" />
        </div>
        <TableSkeletonLoader rows={5} columns={7} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Approved Requirements
        </h1>
        <p className="text-muted-foreground">
          Requirements that have been approved and are ready for publishing
        </p>
      </div>

      {selectedRows.length > 0 && (
        <div className="mb-4">
          <Button onClick={handlePublish}>
            Publish {selectedRows.length} selected
          </Button>
        </div>
      )}

      <CustomTable
        columns={columns}
        data={data}
        onRowClick={(row) => navigate(`/dashboard/requirements/approved/${row.id}`)}
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
        globalSearchPlaceholder="Search approved requirements..."
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

export default RequirementsApproved;
