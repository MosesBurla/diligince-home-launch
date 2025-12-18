import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CardGridSkeletonLoaderProps {
  count?: number;
  columns?: 2 | 3 | 4;
  cardHeight?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const CardGridSkeletonLoader: React.FC<CardGridSkeletonLoaderProps> = ({
  count = 6,
  columns = 3,
  cardHeight = 'h-64',
  showHeader = true,
  showFooter = true,
}) => {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className={cardHeight}>
          {showHeader && (
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48 mt-1" />
            </CardHeader>
          )}
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            {showFooter && (
              <div className="flex items-center justify-between pt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
