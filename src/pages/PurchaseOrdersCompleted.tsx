import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Plus, Package, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomTable from '@/components/CustomTable';
import { ColumnConfig } from '@/types/table';
import { purchaseOrdersService } from '@/services/modules/purchase-orders';
import { POStatusBadge } from '@/components/purchase-order/POStatusBadge';
import { POQuickActions } from '@/components/purchase-order/POQuickActions';
import { POFilters } from '@/components/purchase-order/POFilters';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableSkeletonLoader, StatisticsBarSkeleton } from '@/components/shared/loading';

const PurchaseOrdersCompleted = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['purchase-orders-completed', page, searchTerm],
    queryFn: () =>
      purchaseOrdersService.getCompleted({
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
      name: 'startDate',
      label: 'Start Date',
      isSortable: true,
      render: (row) => format(new Date(row.startDate), 'PP'),
    },
    {
      name: 'completedAt',
      label: 'Completed Date',
      isSortable: true,
      render: (row) =>
        row.completedAt ? format(new Date(row.completedAt), 'PP') : 'N/A',
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
        <StatisticsBarSkeleton count={3} />
        <TableSkeletonLoader rows={8} columns={6} showFilters showActions />
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

  // Calculate summary stats
  const totalCompleted = purchaseOrders.length;
  const totalValue = purchaseOrders.reduce(
    (sum, po) => sum + po.totalValue,
    0
  );

  return (
    <div className="p-6 bg-background min-h-screen space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Completed Purchase Orders
          </h1>
          <p className="text-muted-foreground">
            View all successfully completed purchase orders
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/purchase-orders/create')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}</div>
          </CardContent>
        </Card>
      </div>

      <POFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter="completed"
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
        globalSearchPlaceholder="Search completed purchase orders..."
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

export default PurchaseOrdersCompleted;
