import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  ListChecks,
  Target,
  Package,
  Wrench,
  Briefcase
} from 'lucide-react';

interface ViewDetailsSectionProps {
  requirement: {
    description?: string;
    businessJustification?: string;
    specifications?: Record<string, any>;
    category?: string;
    quantity?: number;
    unitOfMeasure?: string;
    technicalRequirements?: string;
    qualityStandards?: string;
  };
}

export const ViewDetailsSection: React.FC<ViewDetailsSectionProps> = ({ requirement }) => {
  const getCategoryIcon = (category?: string | any) => {
    const categoryStr = typeof category === 'string' ? category : String(category || '');
    switch (categoryStr.toLowerCase()) {
      case 'goods': return <Package className="w-5 h-5 text-primary" />;
      case 'services': return <Briefcase className="w-5 h-5 text-primary" />;
      case 'works': return <Wrench className="w-5 h-5 text-primary" />;
      default: return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Description */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground whitespace-pre-wrap">
            {requirement.description || 'No description provided'}
          </p>
        </CardContent>
      </Card>

      {/* Business Justification */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Business Justification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground whitespace-pre-wrap">
            {requirement.businessJustification || 'No business justification provided'}
          </p>
        </CardContent>
      </Card>

      {/* Category-Specific Specifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {getCategoryIcon(requirement.category)}
            Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requirement.quantity && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Quantity</label>
                <p className="text-base mt-1">{requirement.quantity}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Unit of Measure</label>
                <p className="text-base mt-1">{requirement.unitOfMeasure || 'Units'}</p>
              </div>
            </div>
          )}

          {requirement.technicalRequirements && (
            <div>
              <label className="text-sm text-muted-foreground">Technical Requirements</label>
              <p className="text-base mt-1 text-muted-foreground whitespace-pre-wrap">
                {requirement.technicalRequirements}
              </p>
            </div>
          )}

          {requirement.qualityStandards && (
            <div>
              <label className="text-sm text-muted-foreground">Quality Standards</label>
              <p className="text-base mt-1 text-muted-foreground whitespace-pre-wrap">
                {requirement.qualityStandards}
              </p>
            </div>
          )}

          {requirement.specifications && Object.keys(requirement.specifications).length > 0 && (
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Additional Specifications</label>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                {Object.entries(requirement.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!requirement.quantity && !requirement.technicalRequirements && !requirement.qualityStandards &&
            (!requirement.specifications || Object.keys(requirement.specifications).length === 0) && (
              <p className="text-muted-foreground text-sm">No specifications provided</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewDetailsSection;
