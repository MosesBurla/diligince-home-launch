import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import CustomTable from "@/components/CustomTable";
import { ColumnConfig } from "@/types/table";
import AISearchBar from "@/components/shared/AISearchBar";
import { TableSkeletonLoader } from "@/components/shared/loading";
import { getVendorWorkflows } from "@/services/modules/workflows/workflow.service";

interface WorkflowRow {
  id: string;
  workflowId: string;
  projectTitle: string;
  industryName: string;
  status: "active" | "paused" | "completed" | "cancelled";
  progress: number;
  totalValue: number;
  currency: string;
  deadline: string;
  milestones: {
    total: number;
    completed: number;
    pending: number;
  };
  daysRemaining: number;
  isOverdue: boolean;
  [key: string]: unknown; // Index signature for CustomTable compatibility
}

const ServiceVendorProjects: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Derive status filter from route:
  // 'active' page = all in-flight statuses (not yet formally closed)
  // 'completed' page = only formally closed projects
  const ACTIVE_STATUSES = "active,completed,awaiting_closeout,paused";
  const COMPLETED_STATUSES = "closed";

  const routeStatus = location.pathname.includes("/completed")
    ? COMPLETED_STATUSES
    : location.pathname.includes("/active")
      ? ACTIVE_STATUSES
      : undefined;

  const pageTitle = location.pathname.includes("/completed")
    ? "Completed Projects"
    : location.pathname.includes("/active")
      ? "Active Projects"
      : "All Projects";

  // Fetch via React Query (same pattern as IndustryWorkflows)
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["vendor-workflows", currentPage, pageSize, filters, searchTerm, routeStatus],
    queryFn: () =>
      getVendorWorkflows({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        status: filters.status || routeStatus,
        sortBy: filters.sortBy || "createdAt",
        order: filters.order || "desc",
      }),
    refetchOnMount: true,
    staleTime: 0,
  });

  const workflows = response?.data?.workflows || [];
  const pagination = response?.data?.pagination;

  const tableData: WorkflowRow[] = workflows.map((wf) => ({
    id: wf.id,
    workflowId: wf.workflowId,
    projectTitle: wf.projectTitle,
    industryName: wf.industryName || "N/A",
    status: wf.status as WorkflowRow["status"],
    progress: wf.progress,
    totalValue: wf.totalValue,
    currency: wf.currency,
    deadline: wf.endDate,
    milestones: wf.milestones,
    daysRemaining: wf.daysRemaining,
    isOverdue: wf.isOverdue,
  }));

  const columns: ColumnConfig[] = [
    {
      name: "workflowId",
      label: "Workflow ID",
      isSortable: true,
      isSearchable: true,
      width: "150px",
      action: (row) => navigate(`/dashboard/vendor/projects/${row.id}`),
    },
    {
      name: "projectTitle",
      label: "Project Title",
      isSortable: true,
      isSearchable: true,
      width: "260px",
      render: (value) => (
        <span
          className="text-primary hover:underline cursor-pointer font-medium"
          title={String(value)}
        >
          {String(value)}
        </span>
      ),
    },
    {
      name: "industryName",
      label: "Client",
      isSortable: false,
      width: "160px",
    },
    {
      name: "status",
      label: "Status",
      isSortable: true,
      isFilterable: true,
      width: "120px",
      filterOptions: [
        { key: "active", value: "Active", color: "#dcfce7" },
        { key: "paused", value: "Paused", color: "#fef3c7" },
        { key: "completed", value: "Milestones Complete", color: "#dbeafe" },
        { key: "awaiting_closeout", value: "Closure In Progress", color: "#ede9fe" },
        { key: "closed", value: "Closed", color: "#f1f5f9" },
        { key: "cancelled", value: "Cancelled", color: "#fee2e2" },
      ],
    },
    {
      name: "progress",
      label: "Progress",
      isSortable: true,
      align: "center",
      width: "140px",
      render: (value) => {
        const progress = Number(value) || 0;
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground min-w-[35px]">
              {progress}%
            </span>
          </div>
        );
      },
    },
    {
      name: "totalValue",
      label: "Contract Value",
      isSortable: true,
      align: "right",
      width: "140px",
      render: (value, row) => {
        const data = row as WorkflowRow;
        return (
          <span>
            {data.currency} {data.totalValue?.toLocaleString() || "0"}
          </span>
        );
      },
    },
    {
      name: "deadline",
      label: "Deadline",
      isSortable: true,
      width: "120px",
      render: (value) => (
        <span>{value ? new Date(String(value)).toLocaleDateString("en-IN") : "N/A"}</span>
      ),
    },
    {
      name: "daysRemaining",
      label: "Days Left",
      isSortable: true,
      width: "100px",
      render: (value, row) => {
        const data = row as WorkflowRow;
        if (data.isOverdue) {
          const daysOverdue = Math.abs(Math.ceil(
            (new Date(data.deadline || '').getTime() - Date.now()) / 86400000
          ));
          return <span className="text-red-600 font-semibold">{daysOverdue} days overdue</span>;
        }
        return <span>{value} days</span>;
      },
    },
    {
      name: "milestones",
      label: "Milestones",
      width: "110px",
      render: (value) => {
        const ms = (value as any) || { completed: 0, total: 0 };
        return (
          <span className="text-sm">
            {ms.completed} / {ms.total}
          </span>
        );
      },
    },
  ];

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleFilter = (appliedFilters: any) => {
    setFilters(appliedFilters);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Helmet>
          <title>{pageTitle} | Diligence</title>
        </Helmet>
        <main className="flex-1 container mx-auto px-4 py-6 pt-20">
          <AISearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search projects by title, ID, or client..."
            isLoading={true}
            className="mb-6"
          />
          <TableSkeletonLoader rows={8} columns={9} showFilters showActions />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Helmet>
          <title>{pageTitle} | Diligence</title>
        </Helmet>
        <main className="flex-1 container mx-auto px-4 py-6 pt-20">
          <div className="text-center py-12 bg-white rounded-xl border border-[#E0E0E0]">
            <p className="text-red-600 text-lg mb-4">Failed to load projects</p>
            <p className="text-gray-600">Please try refreshing the page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>{pageTitle} | Diligence</title>
      </Helmet>

      <main className="flex-1 container mx-auto px-4 py-6 pt-20">
        {/* AI Search Bar */}
        <AISearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search projects by title, ID, or client..."
          isLoading={isLoading}
          className="mb-6"
        />

        {/* Projects Table */}
        <CustomTable
          columns={columns}
          data={tableData}
          hideSearch
          filterCallback={handleFilter}
          selectable={false}
          pagination={{
            enabled: true,
            pageSize: pageSize,
            currentPage: currentPage,
            onPageChange: setCurrentPage,
          }}
        />
      </main>
    </div>
  );
};

export default ServiceVendorProjects;
