import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatisticsBarSkeleton } from './StatisticsBarSkeleton';
import { TableSkeletonLoader } from './TableSkeletonLoader';
import { CardGridSkeletonLoader } from './CardGridSkeletonLoader';

interface PageSkeletonLoaderProps {
  variant?: 'table' | 'cards' | 'dashboard';
  showHeader?: boolean;
  showStats?: boolean;
  statsCount?: number;
  tableRows?: number;
  cardCount?: number;
}

export const PageSkeletonLoader: React.FC<PageSkeletonLoaderProps> = ({
  variant = 'table',
  showHeader = true,
  showStats = false,
  statsCount = 4,
  tableRows = 5,
  cardCount = 6,
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header skeleton */}
      {showHeader && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      )}

      {/* Statistics skeleton */}
      {showStats && <StatisticsBarSkeleton count={statsCount} />}

      {/* Content skeleton based on variant */}
      {variant === 'table' && <TableSkeletonLoader rows={tableRows} />}
      {variant === 'cards' && <CardGridSkeletonLoader count={cardCount} />}
      {variant === 'dashboard' && (
        <div className="space-y-6">
          <StatisticsBarSkeleton count={4} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TableSkeletonLoader rows={4} columns={4} showFilters={false} />
            <CardGridSkeletonLoader count={4} columns={2} cardHeight="h-48" />
          </div>
        </div>
      )}
    </div>
  );
};
