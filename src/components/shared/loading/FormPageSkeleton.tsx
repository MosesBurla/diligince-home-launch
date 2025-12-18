import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface FormPageSkeletonProps {
  showHeader?: boolean;
  sections?: number;
  fieldsPerSection?: number;
  showSidebar?: boolean;
  showBackButton?: boolean;
}

export const FormPageSkeleton: React.FC<FormPageSkeletonProps> = ({
  showHeader = true,
  sections = 2,
  fieldsPerSection = 4,
  showSidebar = false,
  showBackButton = true,
}) => {
  const renderFormSection = (fieldCount: number) => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: fieldCount }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderSidebar = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        {showHeader && (
          <div className="flex items-center gap-4 mb-8">
            {showBackButton && <Skeleton className="h-10 w-10 rounded" />}
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        )}

        {/* Main Content */}
        {showSidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {Array.from({ length: sections }).map((_, i) => (
                <React.Fragment key={i}>
                  {renderFormSection(fieldsPerSection)}
                </React.Fragment>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-6">{renderSidebar()}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from({ length: sections }).map((_, i) => (
              <React.Fragment key={i}>
                {renderFormSection(fieldsPerSection)}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
