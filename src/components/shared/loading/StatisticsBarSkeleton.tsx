import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface StatisticsBarSkeletonProps {
  count?: number;
  variant?: 'horizontal' | 'grid';
}

export const StatisticsBarSkeleton: React.FC<StatisticsBarSkeletonProps> = ({
  count = 4,
  variant = 'grid',
}) => {
  if (variant === 'horizontal') {
    return (
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="min-w-48 flex-shrink-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
