import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ExitDraftDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  lastSaved: Date | null;
}

export const ExitDraftDialog: React.FC<ExitDraftDialogProps> = ({
  open,
  onClose,
  onDelete,
  lastSaved
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Requirement Autosaved as Draft</AlertDialogTitle>
          <AlertDialogDescription>
            Your requirement has been automatically saved as a draft.
            {lastSaved && (
              <span className="block mt-2 text-foreground/80">
                Last saved: {new Date(lastSaved).toLocaleString()}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="destructive" onClick={onDelete}>
            Delete Draft
          </Button>
          <AlertDialogCancel onClick={onClose}>
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
