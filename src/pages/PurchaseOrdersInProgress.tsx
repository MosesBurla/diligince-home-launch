import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomTable from '@/components/CustomTable';
import { ColumnConfig } from '@/types/table';
import { purchaseOrdersService } from '@/services/modules/purchase-orders';
import { POStatusBadge } from '@/components/purchase-order/POStatusBadge';
import { POQuickActions } from '@/components/purchase-order/POQuickActions';
import { POFilters } from '@/components/purchase-order/POFilters';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TableSkeletonLoader } from '@/components/shared/loading';

const PurchaseOrdersInProgress = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['purchase-orders-in-progress', page, searchTerm],
    queryFn: () =>
      purchaseOrdersService.getInProgress({
        page,
        limit: pageSize,
      }),
  });

  const handleExport = async (orderId: string) => {
    await purchaseOrdersService.exportToPDF(orderId);
  };

  const handleRowClick = (row: any) => {
    navigate(`/dashboard/purchase-orders/${row.id}`);
  };

  const columns: ColumnConfig[] = [
    {
      name: 'orderNumber',
      label: 'PO Number',
      isSortable: true,
      isSearchable: true,
      action: handleRowClick,
      width: '120px',
    },
    {
      name: 'projectTitle',
      label: 'Project',
      isSortable: true,
      isSearchable: true,
    },
    {
      name: 'vendorName',
      label: 'Vendor',
      isSortable: true,
      isSearchable: true,
    },
    {
      name: 'totalValue',
      label: 'Total Value',
      isSortable: true,
      align: 'right',
      render: (row) => `${row.currency} ${row.totalValue.toLocaleString()}`,
    },
    {
      name: 'completionPercentage',
      label: 'Progress',
      isSortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 min-w-[150px]">
          <Progress value={row.completionPercentage} className="h-2 flex-1" />
          <span className="text-sm font-medium w-12 text-right">
            {row.completionPercentage}%
          </span>
        </div>
      ),
    },
    {
      name: 'milestonesCompleted',
      label: 'Milestones',
      align: 'center',
      render: (row) => (
        <span className="text-sm">
          {row.milestonesCompleted}/{row.totalMilestones}
        </span>
      ),
    },
    {
      name: 'endDate',
      label: 'End Date',
      isSortable: true,
      render: (row) => format(new Date(row.endDate), 'PP'),
    },
    {
      name: 'status',
      label: 'Status',
      isSortable: true,
      render: (row) => <POStatusBadge status={row.status} />,
    },
    {
      name: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <POQuickActions
          orderId={row.id}
          status={row.status}
          onExport={() => handleExport(row.id)}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 bg-background min-h-screen space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-80 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-40 bg-muted animate-pulse rounded" />
        </div>
        <TableSkeletonLoader rows={8} columns={7} showFilters showActions />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <Card className="p-8 text-center">
          <p className="text-destructive">Failed to load purchase orders</p>
        </Card>
      </div>
    );
  }

  const purchaseOrders = data?.data || [];

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            In Progress Purchase Orders
          </h1>
          <p className="text-muted-foreground">
            Track ongoing purchase orders and their completion status
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/purchase-orders/create')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      <POFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter="in_progress"
        onStatusChange={() => {}}
        onClearFilters={() => setSearchTerm('')}
        showStatusFilter={false}
      />

      <CustomTable
        columns={columns}
        data={purchaseOrders}
        onRowClick={handleRowClick}
        selectable={true}
        onSelectionChange={setSelectedRows}
        globalSearchPlaceholder="Search in-progress purchase orders..."
        pagination={{
          enabled: true,
          pageSize,
          currentPage: page,
          onPageChange: setPage,
        }}
      />
    </div>
  );
};

export default PurchaseOrdersInProgress;
