import React from 'react';
import { CreateApprovalLevelRequest } from '@/services/modules/approval-matrix';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LevelCard } from './LevelCard';

interface LevelConfigurationPanelProps {
  levels: CreateApprovalLevelRequest[];
  onChange: (levels: CreateApprovalLevelRequest[]) => void;
}

export const LevelConfigurationPanel: React.FC<LevelConfigurationPanelProps> = ({
  levels,
  onChange,
}) => {
  const addLevel = () => {
    const newLevel: CreateApprovalLevelRequest = {
      order: levels?.length ? levels.length + 1 : 1,
      name: `Level ${levels?.length ? levels.length + 1 : 1}`,
      description: '',
      maxApprovalTimeHours: 24,
      isRequired: true,
      approvers: [],
    };
    onChange([...(levels || []), newLevel]);
  };

  const updateLevel = (index: number, updatedLevel: CreateApprovalLevelRequest) => {
    const updatedLevels = [...(levels || [])];
    updatedLevels[index] = updatedLevel;
    onChange(updatedLevels);
  };

  const removeLevel = (index: number) => {
    const updatedLevels = (levels || []).filter((_, i) => i !== index);
    // Reorder remaining levels
    const reorderedLevels = updatedLevels.map((level, i) => ({
      ...level,
      order: i + 1,
    }));
    onChange(reorderedLevels);
  };

  const moveLevel = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === (levels?.length || 0) - 1)
    ) {
      return;
    }

    const updatedLevels = [...(levels || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [updatedLevels[index], updatedLevels[targetIndex]] = [
      updatedLevels[targetIndex],
      updatedLevels[index],
    ];

    // Update order numbers
    const reorderedLevels = updatedLevels.map((level, i) => ({
      ...level,
      order: i + 1,
    }));
    onChange(reorderedLevels);
  };

  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Approval Levels</h2>
          <p className="text-sm text-muted-foreground">
            Define the sequential approval stages and assign team members
          </p>
        </div>
        <Button onClick={addLevel} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Level
        </Button>
      </div>

      {/* Levels List */}
      <div className="space-y-4">
        {levels && levels.length > 0 ? (
          levels.map((level, index) => (
            <LevelCard
              key={index}
              level={level}
              index={index}
              totalLevels={levels.length}
              onUpdate={(updatedLevel) => updateLevel(index, updatedLevel)}
              onRemove={() => removeLevel(index)}
              onMove={(direction) => moveLevel(index, direction)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No approval levels defined yet</p>
            <p className="text-sm mt-2">Click "Add Level" to create your first approval stage</p>
          </div>
        )}
      </div>
    </div>
  );
};
