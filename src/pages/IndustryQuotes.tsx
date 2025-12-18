import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import CustomTable, { ColumnConfig, FilterConfig } from '@/components/CustomTable';
import { quotationService } from '@/services/modules/quotations';
import type { Quotation } from '@/types/quotation';
import { useToast } from '@/hooks/use-toast';
import { TableSkeletonLoader } from '@/components/shared/loading';

const IndustryQuotes = () => {
  const [selectedRows, setSelectedRows] = useState<Quotation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['quotations', 'all', currentPage, pageSize, filters, searchTerm],
    queryFn: () => quotationService.getAll({
      page: currentPage,
      pageSize,
      search: searchTerm,
      ...filters,
    }),
  });

  const quotations = response?.data.quotations || [];
  const pagination = response?.data.pagination;

  const tableData = quotations.map(q => ({
    id: q.quotationNumber,
    vendorName: q.vendorName,
    requirementTitle: q.requirementTitle,
    quotedAmount: `${q.currency} ${q.quotedAmount.toLocaleString()}`,
    validUntil: new Date(q.validUntil).toLocaleDateString(),
    status: q.status,
    submittedDate: new Date(q.submittedDate).toLocaleDateString(),
    responseTime: q.responseTime,
    vendorRating: q.vendorRating.toFixed(1),
    deliveryTimeWeeks: `${q.deliveryTimeWeeks} weeks`,
  }));

  const columns: ColumnConfig[] = [
    {
      name: 'id',
      label: 'Quote ID',
      isSortable: true,
      isSearchable: true,
      action: (row) => {
        const quotation = quotations.find(q => q.quotationNumber === row.id);
        if (quotation) navigate(`/dashboard/quotations/${quotation.id}`);
      },
      width: '120px',
    },
    {
      name: 'vendorName',
      label: 'Vendor',
      isSortable: true,
      isSearchable: true,
    },
    {
      name: 'requirementTitle',
      label: 'Requirement',
      isSortable: true,
      isSearchable: true,
    },
    {
      name: 'quotedAmount',
      label: 'Quoted Amount',
      isSortable: true,
      align: 'right',
    },
    {
      name: 'validUntil',
      label: 'Valid Until',
      isSortable: true,
    },
    {
      name: 'status',
      label: 'Status',
      isSortable: true,
      isFilterable: true,
      filterOptions: [
        { key: 'pending_review', value: 'Pending Review', color: '#fef3c7' },
        { key: 'under_evaluation', value: 'Under Evaluation', color: '#fed7aa' },
        { key: 'awaiting_clarification', value: 'Awaiting Clarification', color: '#ddd6fe' },
        { key: 'approved', value: 'Approved', color: '#dcfce7' },
        { key: 'rejected', value: 'Rejected', color: '#fecaca' },
        { key: 'expired', value: 'Expired', color: '#e5e7eb' },
      ],
    },
    {
      name: 'submittedDate',
      label: 'Submitted',
      isSortable: true,
    },
    {
      name: 'responseTime',
      label: 'Response Time',
      isSortable: true,
      align: 'center',
    },
    {
      name: 'vendorRating',
      label: 'Vendor Rating',
      isSortable: true,
      align: 'center',
    },
    {
      name: 'deliveryTimeWeeks',
      label: 'Delivery Time',
      isSortable: true,
      align: 'center',
    },
  ];

  const handleFilterCallback = (appliedFilters: FilterConfig) => {
    setFilters(appliedFilters);
    setCurrentPage(1);
  };

  const handleSearchCallback = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleExportXLSX = async () => {
    try {
      const blob = await quotationService.exportToXLSX(filters);
      quotationService.downloadFile(blob, `quotations-${new Date().toISOString().split('T')[0]}.xlsx`);
      toast({ title: 'Export successful', description: 'Quotations exported to XLSX' });
    } catch (error) {
      toast({ title: 'Export failed', description: 'Failed to export quotations', variant: 'destructive' });
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await quotationService.exportToCSV(filters);
      quotationService.downloadFile(blob, `quotations-${new Date().toISOString().split('T')[0]}.csv`);
      toast({ title: 'Export successful', description: 'Quotations exported to CSV' });
    } catch (error) {
      toast({ title: 'Export failed', description: 'Failed to export quotations', variant: 'destructive' });
    }
  };

  const handleRowClick = (row: any) => {
    const quotation = quotations.find(q => q.quotationNumber === row.id);
    if (quotation) navigate(`/dashboard/quotations/${quotation.id}`);
  };

  const handleSelectionChange = (selected: any[]) => {
    const selectedQuotations = selected.map(row => 
      quotations.find(q => q.quotationNumber === row.id)
    ).filter(Boolean) as Quotation[];
    setSelectedRows(selectedQuotations);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load quotations. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quotations</h1>
          <p className="text-muted-foreground">Manage and compare quotes from vendors</p>
        </div>
      </div>

      {isLoading ? (
        <TableSkeletonLoader rows={6} columns={8} />
      ) : (
        <CustomTable
          columns={columns}
          data={tableData}
          filterCallback={handleFilterCallback}
          searchCallback={handleSearchCallback}
          onRowClick={handleRowClick}
          onExport={{
            xlsx: handleExportXLSX,
            csv: handleExportCSV,
          }}
          selectable={true}
          onSelectionChange={handleSelectionChange}
          globalSearchPlaceholder="Search quotations..."
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

export default IndustryQuotes;