import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface TableSkeletonLoaderProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  showActions?: boolean;
  showFilters?: boolean;
}

export const TableSkeletonLoader: React.FC<TableSkeletonLoaderProps> = ({
  rows = 5,
  columns = 6,
  showHeader = true,
  showActions = true,
  showFilters = true,
}) => {
  return (
    <div className="space-y-4">
      {/* Filters skeleton */}
      {showFilters && (
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      )}

      {/* Table skeleton */}
      <Card className="overflow-hidden">
        <div className="w-full">
          {/* Header */}
          {showHeader && (
            <div className="flex items-center gap-4 p-4 border-b bg-muted/50">
              {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
              ))}
              {showActions && <Skeleton className="h-4 w-20" />}
            </div>
          )}

          {/* Rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center gap-4 p-4 border-b last:border-b-0"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={`h-4 flex-1 ${colIndex === 0 ? 'max-w-32' : ''}`}
                />
              ))}
              {showActions && (
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
};
