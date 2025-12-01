import React from 'react';
import { MatrixListStatistics } from '@/services/modules/approval-matrix';
import { Skeleton } from '@/components/ui/skeleton';

interface MatrixStatisticsBarProps {
  statistics: MatrixListStatistics;
  loading: boolean;
}

export const MatrixStatisticsBar: React.FC<MatrixStatisticsBarProps> = ({
  statistics,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Matrices',
      value: statistics?.totalMatrices || 0,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Active',
      value: statistics?.activeMatrices || 0,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Inactive',
      value: statistics?.inactiveMatrices || 0,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
    },
    {
      label: 'Default Matrix',
      value: statistics?.defaultMatrix || 0,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Total Approvers',
      value: statistics?.totalApprovers || 0,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bg} rounded-lg p-4 border border-border/50 transition-all hover:shadow-md`}
        >
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
