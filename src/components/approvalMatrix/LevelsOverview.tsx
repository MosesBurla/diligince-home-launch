import React from 'react';
import { ApprovalLevel } from '@/services/modules/approval-matrix';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface LevelsOverviewProps {
  levels: ApprovalLevel[];
}

export const LevelsOverview: React.FC<LevelsOverviewProps> = ({ levels }) => {
  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Approval Levels</h3>
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {levels && levels.length > 0 ? (
          levels.map((level, index) => (
            <React.Fragment key={level?.id || index}>
              <div className="flex-shrink-0 bg-muted/30 rounded-lg p-4 border min-w-[200px]">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-2">
                  Level {level?.order || index + 1}
                </Badge>
                <p className="font-medium text-foreground text-sm">{level?.name || 'Unnamed'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {level?.approvers?.length || 0} approvers • {level?.maxApprovalTimeHours || 0}h
                </p>
              </div>
              {index < levels.length - 1 && (
                <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
            </React.Fragment>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No levels configured</p>
        )}
      </div>
    </div>
  );
};
