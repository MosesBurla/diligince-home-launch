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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const RequirementsPending = () => {
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
  const [sortBy, setSortBy] = useState<string>("submittedDate");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<string>("all");
  const [teamMembers, setTeamMembers] = useState<Creator[]>([]);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const response = await requirementListService.getPending({
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
      console.error("Failed to fetch pending requirements:", error);
      toast.error(error.message || "Failed to load pending requirements");
      // Set empty array on error to prevent crash
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
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
        { key: "IT Infrastructure", value: "IT Infrastructure" },
        { key: "Construction", value: "Construction" },
        { key: "Marketing", value: "Marketing" },
        { key: "Logistics", value: "Logistics" },
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
        const amount = row.budget?.max || row.estimatedValue;
        if (!amount) return "-";
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: row.budget?.currency || 'USD',
          maximumFractionDigits: 0
        }).format(amount);
      }
    },
    {
      name: "submittedBy",
      label: "Submitted By",
      isSortable: true,
      isSearchable: true,
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.createdBy?.name || row.submittedBy || "Unknown"}</span>
          <span className="text-xs text-muted-foreground">{row.createdBy?.department || "N/A"}</span>
        </div>
      )
    },
    {
      name: "approver",
      label: "Approver",
      isSortable: true,
      isSearchable: true,
      render: (value, row) => {
        const level = row.approvalProgress?.levels?.find((l: any) => l.levelNumber === row.currentApprovalLevel);
        const approvers = level?.approvers || [];

        return (
          <div className="flex -space-x-2 overflow-hidden">
            <TooltipProvider>
              {approvers.map((approver: any, index: number) => {
                const initials = approver.memberName
                  ? approver.memberName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                  : '??';

                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Avatar className="h-8 w-8 border-2 border-background cursor-help">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{approver.memberName}</p>
                      <p className="text-xs text-muted-foreground">{approver.memberEmail}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
            {approvers.length === 0 && <span className="text-muted-foreground">-</span>}
          </div>
        );
      }
    },
    {
      name: "submittedDate",
      label: "Submitted Date",
      isSortable: true,
      render: (value, row) => {
        const date = row.sentForApprovalAt || row.createdAt;
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
      }
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
      const blob = await requirementListService.exportToXLSX('pending', { filters, sortBy, order: sortOrder, search: searchTerm });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pending-${new Date().toISOString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Pending requirements exported to XLSX");
    } catch (error: any) {
      toast.error(error.message || "Failed to export");
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await requirementListService.exportToCSV('pending', { filters, sortBy, order: sortOrder, search: searchTerm });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pending-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Pending requirements exported to CSV");
    } catch (error: any) {
      toast.error(error.message || "Failed to export");
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="mb-6">
          <div className="h-8 w-72 bg-muted rounded animate-pulse mb-2" />
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
          Pending Approval Requirements
        </h1>
        <p className="text-muted-foreground">
          Requirements awaiting approval from designated approvers
        </p>
      </div>

      <CustomTable
        columns={columns}
        data={data}
        onRowClick={(row) => navigate(`/dashboard/requirements/pending/${row.requirementId || row.id}`)}
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
              setCreatedBy(val || 'all');
              setPagination(prev => ({ ...prev, currentPage: 1 }));
            }}
          />
        }
        selectable={true}
        onSelectionChange={setSelectedRows}
        globalSearchPlaceholder="Search pending requirements..."
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

export default RequirementsPending;
