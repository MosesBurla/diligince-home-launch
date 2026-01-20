import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomTable, { ColumnConfig } from '@/components/CustomTable';
import { TableSkeletonLoader } from '@/components/shared/loading';
import AISearchBar from '@/components/vendor/shared/AISearchBar';

import { vendorQuotationsService } from '@/services';
import type { VendorQuotation } from '@/types/vendor';

const VendorQuotations: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch quotations
  const { data: quotationsData, isLoading } = useQuery({
    queryKey: ['vendor-quotations', activeTab, page, limit, searchQuery],
    queryFn: () =>
      vendorQuotationsService.getMyQuotations({
        status: activeTab === 'all' ? undefined : (activeTab as any),
        page,
        limit,
        search: searchQuery || undefined,
      }),
  });

  const quotations = quotationsData?.data.quotations || [];

  const columns: ColumnConfig[] = [
    {
      name: 'quotationNumber',
      label: 'Quotation #',
      isSortable: true,
    },
    {
      name: 'rfqId',
      label: 'RFQ ID',
      isSortable: true,
    },
    {
      name: 'rfqTitle',
      label: 'RFQ Title',
      isSortable: true,
    },
    {
      name: 'companyName',
      label: 'Company',
      isSortable: true,
    },
    {
      name: 'quotedAmount',
      label: 'Amount',
      isSortable: true,
    },
    {
      name: 'submissionDate',
      label: 'Submitted',
      isSortable: true,
    },
    {
      name: 'status',
      label: 'Status',
    },
  ];

  const tableData = quotations.map(q => ({
    ...q,
    quotedAmount: `$${q.quotedAmount.toLocaleString()}`,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>My Quotations | Vendor Dashboard</title>
        </Helmet>
        <main className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          </div>
          <TableSkeletonLoader rows={8} columns={5} showFilters />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>My Quotations | Vendor Dashboard</title>
      </Helmet>

      <main className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Quotations</h1>
            <p className="text-muted-foreground">
              Manage your submitted quotations
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard/service-vendor-rfqs')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Browse RFQs
          </Button>
        </div>

        {/* AI Search Bar */}
        <AISearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search quotations by number, RFQ title, or company..."
          isLoading={isLoading}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <CustomTable
              columns={columns}
              data={tableData}
              onRowClick={(row) => navigate(`/dashboard/vendor/quotations/${row.id}`)}
              hideSearch
              hideFilters
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default VendorQuotations;
