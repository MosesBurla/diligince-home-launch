import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import CustomTable, { ColumnConfig, FilterConfig } from '@/components/CustomTable';

const IndustryRequirements = () => {
  const navigate = useNavigate();

  // Mock requirements data
  const [requirements] = useState([
    {
      id: 'REQ-2024-001',
      title: 'Industrial Equipment Procurement',
      category: 'Equipment',
      priority: 'High',
      status: 'Active' as const,
      budget: 150000,
      createdDate: '2024-01-15',
      deadline: '2024-03-01',
      description: 'Procurement of industrial valves and pressure control systems'
    },
    {
      id: 'REQ-2024-002',
      title: 'Pipeline Inspection Services',
      category: 'Services',
      priority: 'Medium',
      status: 'Draft' as const,
      budget: 75000,
      createdDate: '2024-01-20',
      deadline: '2024-02-28',
      description: 'Comprehensive pipeline inspection and maintenance services'
    },
    {
      id: 'REQ-2024-003',
      title: 'Safety Compliance Audit',
      category: 'Professional Services',
      priority: 'High',
      status: 'Completed' as const,
      budget: 25000,
      createdDate: '2024-01-10',
      deadline: '2024-01-30',
      description: 'Full safety compliance audit and certification'
    },
    {
      id: 'REQ-2024-004',
      title: 'Equipment Transportation',
      category: 'Logistics',
      priority: 'Low',
      status: 'Pending' as const,
      budget: 30000,
      createdDate: '2024-01-18',
      deadline: '2024-02-15',
      description: 'Transportation of heavy industrial equipment'
    }
  ]);

  const handleViewRequirement = (requirementId: string) => {
    navigate(`/industry-project-workflow/${requirementId}`);
  };

  const handleCreateRequirement = () => {
    navigate('/dashboard/create-requirement');
  };

  // Define columns for CustomTable
  const columns: ColumnConfig[] = [
    {
      name: 'id',
      label: 'Requirement ID',
      isSortable: true,
      isSearchable: true,
      action: (row) => handleViewRequirement(row.id),
      width: '32',
    },
    {
      name: 'title',
      label: 'Title',
      isSortable: true,
      isSearchable: true,
    },
    {
      name: 'category',
      label: 'Category',
      isSortable: true,
      isSearchable: true,
      isFilterable: true,
      filterOptions: [
        { key: 'Equipment', value: 'Equipment' },
        { key: 'Services', value: 'Services' },
        { key: 'Professional Services', value: 'Professional Services' },
        { key: 'Logistics', value: 'Logistics' },
      ],
    },
    {
      name: 'priority',
      label: 'Priority',
      isSortable: true,
      isFilterable: true,
      filterOptions: [
        { key: 'High', value: 'High', color: '#fecaca' },
        { key: 'Medium', value: 'Medium', color: '#fed7aa' },
        { key: 'Low', value: 'Low', color: '#bbf7d0' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      isSortable: true,
      isFilterable: true,
      filterOptions: [
        { key: 'Active', value: 'Active', color: '#bbf7d0' },
        { key: 'Draft', value: 'Draft', color: '#e5e7eb' },
        { key: 'Completed', value: 'Completed', color: '#dcfce7' },
        { key: 'Pending', value: 'Pending', color: '#fef3c7' },
      ],
    },
    {
      name: 'budget',
      label: 'Budget',
      isSortable: true,
      render: (value) => `$${value.toLocaleString()}`,
      align: 'right' as const,
    },
    {
      name: 'deadline',
      label: 'Deadline',
      isSortable: true,
      isSearchable: true,
    },
  ];

  // Handle callbacks
  const handleFilterCallback = (filters: FilterConfig) => {
    console.log('Applied filters:', filters);
  };

  const handleSearchCallback = (searchTerm: string, selectedColumns: string[]) => {
    console.log('Search term:', searchTerm, 'Columns:', selectedColumns);
  };

  const handleRowClick = (row: any) => {
    handleViewRequirement(row.id);
  };

  const handleExportXLSX = () => {
    console.log('Exporting to XLSX...');
  };

  const handleExportCSV = () => {
    console.log('Exporting to CSV...');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/industry-dashboard" className="cursor-pointer text-primary hover:text-primary-dark">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage className="text-gray-700">Requirements</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Industry Requirements
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and track your project requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Table */}
        <CustomTable
          columns={columns}
          data={requirements}
          filterCallback={handleFilterCallback}
          searchCallback={handleSearchCallback}
          onRowClick={handleRowClick}
          onExport={{
            xlsx: handleExportXLSX,
            csv: handleExportCSV,
          }}
          onAdd={handleCreateRequirement}
          selectable={true}
          globalSearchPlaceholder="Search requirements..."
          pagination={{
            enabled: true,
            pageSize: 10,
            currentPage: 1,
          }}
        />
      </main>
    </div>
  );
};

export default IndustryRequirements;
