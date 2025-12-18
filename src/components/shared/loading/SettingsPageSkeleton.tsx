import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface SettingsPageSkeletonProps {
  showTabs?: boolean;
  tabCount?: number;
  sections?: number;
}

export const SettingsPageSkeleton: React.FC<SettingsPageSkeletonProps> = ({
  showTabs = true,
  tabCount = 2,
  sections = 3,
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>

      {/* Tabs */}
      {showTabs && (
        <div className="flex gap-2">
          {Array.from({ length: tabCount }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
      )}

      {/* Content Sections */}
      <div className="space-y-6">
        {Array.from({ length: sections }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
