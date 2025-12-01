import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AutoSaveIndicatorProps {
  lastSaved: Date | null;
  isSaving: boolean;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ 
  lastSaved, 
  isSaving 
}) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      {isSaving ? (
        <span>Saving...</span>
      ) : lastSaved ? (
        <span>Autosaved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
      ) : (
        <span>Not saved yet</span>
      )}
    </div>
  );
};
