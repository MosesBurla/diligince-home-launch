import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomTable from "@/components/CustomTable";
import { ColumnConfig, FilterConfig } from "@/types/table";
import requirementListService from "@/services/requirement-list.service";
import { RequirementListItem } from "@/types/requirement-list";
import { toast } from "sonner";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const RequirementsDrafts = () => {
  const navigate = useNavigate();
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
  const [sortBy, setSortBy] = useState<string>("lastModified");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const response = await requirementListService.getDrafts({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        sortBy,
        order: sortOrder,
        search: searchTerm,
        filters,
      });
      
      // Defensive check to ensure requirements is an array
      const requirements = Array.isArray(response.data?.requirements) 
        ? response.data.requirements 
        : [];
      
      setData(requirements);
      
      // Debug logging in development
      if (import.meta.env.DEV) {
        console.group('📋 Draft Requirements Loaded');
        console.log('Total:', requirements.length);
        console.log('Sample:', requirements[0]);
        console.log('All have IDs:', requirements.every(r => r.id));
        console.log('Missing IDs:', requirements.filter(r => !r.id).length);
        console.groupEnd();
      }
      
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error("Failed to fetch drafts:", error);
      toast.error(error.message || "Failed to load drafts");
      // Set empty array on error to prevent crash
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [pagination.currentPage, pagination.pageSize, sortBy, sortOrder, searchTerm, filters]);

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
      render: (value, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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
        </div>
      ),
      width: "200px",
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
        sortBy,
        order: sortOrder,
        search: searchTerm,
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
        sortBy,
        order: sortOrder,
        search: searchTerm,
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
      const draftIds = selectedRows.map(row => row.id);
      await requirementListService.deleteDrafts(draftIds);
      
      toast.success(`${selectedRows.length} draft(s) deleted`);
      setSelectedRows([]);
      fetchDrafts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete drafts");
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Draft Requirements
        </h1>
        <p className="text-muted-foreground">
          Manage your draft requirements before submitting for approval
        </p>
      </div>

      {selectedRows.length > 0 && (
        <div className="mb-4">
          <Button variant="destructive" onClick={handleBulkDelete}>
            Delete {selectedRows.length} selected
          </Button>
        </div>
      )}

      <CustomTable
        columns={columns}
        data={data}
        onRowClick={(row) => {
          const draftId = row.id || row.draftId;
          if (!draftId || draftId === 'undefined') {
            console.error('Invalid draft ID:', row);
            toast.error('Cannot open draft: Invalid ID');
            return;
          }
          navigate(`/dashboard/requirements/${draftId}`);
        }}
        filterCallback={handleFilter}
        searchCallback={handleSearch}
        onExport={{
          xlsx: handleExportXLSX,
          csv: handleExportCSV,
        }}
        onAdd={handleAdd}
        selectable={true}
        onSelectionChange={setSelectedRows}
        globalSearchPlaceholder="Search draft requirements..."
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

export default RequirementsDrafts;
