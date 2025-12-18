import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable from "@/components/CustomTable";
import { ColumnConfig, FilterConfig } from "@/types/table";
import requirementListService from "@/services/modules/requirements/lists.service";
import { RequirementListItem, PaginationData } from "@/types/requirement-list";
import { toast } from "sonner";
import { Edit, Trash2, Eye, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSkeletonLoader } from "@/components/shared/loading";
import { usePermissions } from "@/hooks/usePermissions";
import { useUser } from "@/contexts/UserContext";
import { CreatorFilterDropdown, Creator } from "@/components/shared/CreatorFilterDropdown";
import { Input } from "@/components/ui/input";

const MODULE_ID = 'requirements-drafts';

const RequirementsDrafts = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const { user } = useUser();

  // Permission checks
  const hasEditPermission = hasPermission(MODULE_ID, 'edit');
  const hasDeletePermission = hasPermission(MODULE_ID, 'delete');

  const [drafts, setDrafts] = useState<RequirementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Sort state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: 'updatedAt',
    direction: 'desc'
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<string>("me");
  const [teamMembers, setTeamMembers] = useState<Creator[]>([]);

  const fetchDrafts = async () => {
    try {
      setIsLoading(true);
      setLoading(true);
      const response = await requirementListService.getDrafts({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        sortBy: sortConfig.key,
        order: sortConfig.direction,
        search: searchTerm,
        filters,
        createdById: createdBy,
      });

      const requirements = response.data?.requirements || response.data?.items || [];

      setDrafts(Array.isArray(requirements) ? requirements : []);

      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination?.totalPages || 0,
        totalItems: response.data.pagination?.totalItems || 0
      }));

      // Update creators from response filters
      if (response.data.filters && response.data.filters.creators) {
        setTeamMembers(response.data.filters.creators);
      }

    } catch (error: any) {
      console.error("Failed to fetch drafts:", error);
      toast.error(error.message || "Failed to load drafts");
      setDrafts([]);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [pagination.currentPage, pagination.pageSize, sortConfig, searchTerm, filters, createdBy]);

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
        { key: "IT Services", value: "IT Services" },
        { key: "Marketing", value: "Marketing" },
        { key: "Construction", value: "Construction" },
        { key: "Logistics", value: "Logistics" },
      ],
    },
    {
      name: "createdBy",
      label: "Created By",
      render: (value, row) => {
        // @ts-ignore - createdBy might be populated object or id
        return row.createdBy?.name || 'Unknown';
      }
    },
    {
      name: "priority",
      label: "Priority",
      isSortable: true,
      isFilterable: true,
      render: (value) => {
        const priority = value || 'medium';
        const config: Record<string, { color: string; label: string }> = {
          critical: { color: 'bg-red-100 text-red-800', label: 'Critical' },
          high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
          medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
          low: { color: 'bg-green-100 text-green-800', label: 'Low' },
        };
        const cfg = config[priority] || config.medium;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
            {cfg.label}
          </span>
        );
      },
      filterOptions: [
        { key: "critical", value: "Critical", color: "#fee2e2" },
        { key: "high", value: "High", color: "#fed7aa" },
        { key: "medium", value: "Medium", color: "#fef3c7" },
        { key: "low", value: "Low", color: "#dcfce7" },
      ],
    },
    {
      name: "estimatedValue",
      label: "Est. Value",
      isSortable: true,
      align: "right",
      render: (value) => {
        const numValue = typeof value === 'number' ? value : 0;
        return numValue > 0
          ? `$${numValue.toLocaleString()}`
          : 'Not Set';
      },
    },
    {
      name: "lastModified",
      label: "Last Modified",
      isSortable: true,
      render: (value) => {
        if (!value) return 'N/A';
        try {
          const date = new Date(value);
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch {
          return 'Invalid Date';
        }
      },
    },
    {
      name: "actions",
      label: "Actions",
      render: (value, row) => {
        const status = row.status || 'draft';
        const canEditByStatus = status === 'draft' || status === 'rejected';

        return (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const reqId = row.id || row.draftId;
                if (!reqId || reqId === 'undefined') {
                  toast.error('Cannot view: Invalid ID');
                  return;
                }
                navigate(`/dashboard/requirements/${reqId}`);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>

            {canEditByStatus && hasEditPermission && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const draftId = row.id || row.draftId;
                  if (!draftId || draftId === 'undefined') {
                    console.error('Invalid draft ID for edit:', row);
                    toast.error('Cannot edit draft: Invalid ID');
                    return;
                  }
                  navigate(`/dashboard/create-requirement?draftId=${draftId}`);
                }}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}

            {status === 'draft' && hasDeletePermission && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  const draftId = row.id || row.draftId;
                  if (!draftId || draftId === 'undefined') {
                    console.error('Invalid draft ID for delete:', row);
                    toast.error('Cannot delete draft: Invalid ID');
                    return;
                  }
                  handleDeleteSingle(draftId);
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        );
      },
      width: "280px",
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
      const blob = await requirementListService.exportToXLSX('drafts', {
        filters,
        sortBy: sortConfig.key,
        order: sortConfig.direction,
        search: searchTerm,
        createdById: createdBy,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `drafts-${new Date().toISOString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Drafts exported to XLSX");
    } catch (error: any) {
      toast.error(error.message || "Failed to export drafts");
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await requirementListService.exportToCSV('drafts', {
        filters,
        sortBy: sortConfig.key,
        order: sortConfig.direction,
        search: searchTerm,
        createdById: createdBy,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `drafts-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Drafts exported to CSV");
    } catch (error: any) {
      toast.error(error.message || "Failed to export drafts");
    }
  };

  const handleAdd = () => {
    navigate('/dashboard/create-requirement');
  };

  const handleDeleteSingle = async (draftId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this draft? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await requirementListService.deleteDrafts([draftId]);
      toast.success("Draft deleted successfully");
      fetchDrafts();
    } catch (error: any) {
      console.error("Failed to delete draft:", error);
      toast.error(error.message || "Failed to delete draft");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select drafts to delete");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedRows.length} draft(s)?`
    );

    if (!confirmed) return;

    try {
      await requirementListService.deleteDrafts(selectedRows);
      toast.success(`${selectedRows.length} draft(s) deleted`);
      setSelectedRows([]);
      fetchDrafts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete drafts");
    }
  };

  if (loading && drafts.length === 0) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="mb-6">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-muted rounded animate-pulse" />
        </div>
        <TableSkeletonLoader rows={5} columns={6} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Draft Requirements</h1>
          <p className="text-muted-foreground mt-1">
            Manage and edit your draft requirements before submission.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Create Requirement
        </Button>
      </div>

      {/* Filters Section */}
      <div className="flex items-end gap-4 bg-muted/30 p-4 rounded-lg border mb-6">
        <div className="flex-1 max-w-sm">
          <label className="text-sm font-medium mb-1 block">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drafts..."
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="mb-4">
          <Button variant="destructive" onClick={handleBulkDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete {selectedRows.length} selected
          </Button>
        </div>
      )}

      <CustomTable
        columns={columns}
        data={drafts}
        onRowClick={(row) => {
          const draftId = row.id || row.draftId;
          if (!draftId || draftId === 'undefined') {
            console.error('Invalid draft ID:', row);
            toast.error('Cannot open draft: Invalid ID');
            return;
          }
          navigate(`/dashboard/create-requirement?draftId=${draftId}`);
        }}
        filterCallback={handleFilter}
        searchCallback={(term) => handleSearch(term, [])}
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
            isLoading={isLoading}
          />
        }
        onAdd={handleAdd}
        selectable={true}
        onSelectionChange={setSelectedRows}
        globalSearchPlaceholder="Search draft requirements..."
        pagination={{
          enabled: true,
          pageSize: pagination.pageSize,
          currentPage: pagination.currentPage,
          totalItems: pagination.totalItems,
          serverSide: true,
          onPageChange: (page) => setPagination(prev => ({ ...prev, currentPage: page })),
          onPageSizeChange: (size) => setPagination(prev => ({ ...prev, pageSize: size, currentPage: 1 })),
        }}
      />
    </div>
  );
};

export default RequirementsDrafts;
