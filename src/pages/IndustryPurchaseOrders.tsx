import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, Plus, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomTable, { ColumnConfig } from '@/components/CustomTable';
import { purchaseOrdersService, POStatus } from '@/services/modules/purchase-orders';
import { POStatusBadge } from '@/components/purchase-order/POStatusBadge';
import { POQuickActions } from '@/components/purchase-order/POQuickActions';
import { POFilters } from '@/components/purchase-order/POFilters';
import AISearchBar from '@/components/shared/AISearchBar';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { StatisticsBarSkeleton, TableSkeletonLoader } from '@/components/shared/loading';

const IndustryPurchaseOrders = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<POStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['purchase-orders-all', page, searchTerm, statusFilter],
    queryFn: () =>
      purchaseOrdersService.getAll({
        page,
        limit: pageSize,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }),
  });

  const { execute: executeApprove } = useAsyncOperation({
    showSuccessToast: true,
    successMessage: 'Purchase order approved successfully',
    onSuccess: () => refetch(),
  });

  const { execute: executeReject } = useAsyncOperation({
    showSuccessToast: true,
    successMessage: 'Purchase order rejected',
    onSuccess: () => refetch(),
  });

  const handleApprove = async (orderId: string) => {
    await executeApprove(() => purchaseOrdersService.approve(orderId, 'Approved'));
  };

  const handleReject = async (orderId: string) => {
    await executeReject(() => purchaseOrdersService.reject(orderId, 'Rejected'));
  };

  const handleExport = async (orderId: string) => {
    try {
      // Fetch full PO details
      const response = await purchaseOrdersService.getById(orderId);
      const poDetails = response.data;

      // Import PDF generator dynamically
      const { exportPOToPDF } = await import('@/services/pdf-generator');

      // Generate and download PDF
      await exportPOToPDF(poDetails);
    } catch (error) {
      console.error('Error exporting PO:', error);
      // Fallback to backend PDF export if frontend PDF fails
      try {
        await purchaseOrdersService.exportToPDF(orderId);
      } catch (backendError) {
        console.error('Backend PDF export also failed:', backendError);
        throw error;
      }
    }
  };

  const { execute: executeSubmit } = useAsyncOperation({
    showSuccessToast: true,
    successMessage: 'Purchase order submitted to vendor',
    onSuccess: () => refetch(),
  });

  const handleSubmit = async (orderId: string) => {
    await executeSubmit(() => purchaseOrdersService.send(orderId));
  };

  const handleEdit = (orderId: string) => {
    navigate(`/dashboard/purchase-orders/${orderId}/edit`);
  };

  const { execute: executeDelete } = useAsyncOperation({
    showSuccessToast: true,
    successMessage: 'Purchase order deleted successfully',
    onSuccess: () => refetch(),
  });

  const handleDelete = async (orderId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this purchase order? This action cannot be undone.'
    );
    if (confirmed) {
      await executeDelete(() => purchaseOrdersService.delete(orderId));
    }
  };

  const handleRowClick = (row: any) => {
    if (row?.id) {
      navigate(`/dashboard/purchase-orders/${row.id}`);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const columns: ColumnConfig[] = [
    {
      name: 'orderNumber',
      label: 'PO Number',
      isSortable: true,
      isSearchable: true,
      action: handleRowClick,
      width: '32',
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
      render: (value, row) => `${row.currency || 'INR'} ${(row.totalValue || row.amount || 0).toLocaleString()}`,
    },
    {
      name: 'startDate',
      label: 'Start Date',
      isSortable: true,
      render: (value, row) => row.startDate ? format(new Date(row.startDate), 'PP') : '-',
    },
    {
      name: 'endDate',
      label: 'End Date',
      isSortable: true,
      render: (value, row) => row.endDate ? format(new Date(row.endDate), 'PP') : '-',
    },
    {
      name: 'status',
      label: 'Status',
      isSortable: true,
      render: (value, row) => <POStatusBadge status={value} />,
    },
    {
      name: 'actions',
      label: 'Actions',
      align: 'right',
      render: (value, row) => row?.id ? (
        <POQuickActions
          orderId={row.id}
          status={row.status}
          onApprove={() => handleApprove(row.id)}
          onReject={() => handleReject(row.id)}
          onExport={() => handleExport(row.id)}
          onSubmit={() => handleSubmit(row.id)}
          onEdit={() => handleEdit(row.id)}
          onDelete={() => handleDelete(row.id)}
        />
      ) : null,
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-10 w-44 bg-muted rounded animate-pulse" />
        </div>
        <StatisticsBarSkeleton count={4} />
        <TableSkeletonLoader rows={5} columns={7} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Card className="p-8 text-center">
          <p className="text-destructive">Failed to load purchase orders</p>
        </Card>
      </div>
    );
  }

  const purchaseOrders = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // Calculate summary stats
  const statusCounts = {
    pending: purchaseOrders.filter((po) => po.status === 'pending_approval').length,
    inProgress: purchaseOrders.filter((po) => po.status === 'in_progress').length,
    completed: purchaseOrders.filter((po) => po.status === 'completed').length,
    cancelled: purchaseOrders.filter((po) => po.status === 'cancelled').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Purchase Orders
          </h1>
          <p className="text-muted-foreground">
            Manage and track all purchase orders
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/quotations-approved')} variant="outline" className="gap-2">
          View Approved Quotations
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Search Bar */}
      <AISearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search purchase orders with AI..."
        isLoading={isLoading}
      />

      {/* Filter Dropdowns */}
      <POFilters
        statusFilter={statusFilter}
        onStatusChange={(value) => setStatusFilter(value as POStatus | 'all')}
        onClearFilters={handleClearFilters}
      />

      <CustomTable
        columns={columns}
        data={purchaseOrders}
        onRowClick={handleRowClick}
        selectable={true}
        onSelectionChange={setSelectedRows}
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

export default IndustryPurchaseOrders;
