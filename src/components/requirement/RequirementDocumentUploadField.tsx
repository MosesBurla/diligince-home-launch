import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, File, X, Eye, FileText, Image as ImageIcon, FileArchive } from 'lucide-react';
import { toast } from 'sonner';
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

interface RequirementDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  documentType: 'specification' | 'drawing' | 'reference' | 'compliance' | 'other';
  uploadedAt: Date | string;
}

interface RequirementDocumentUploadFieldProps {
  label: string;
  documentType: 'specification' | 'drawing' | 'reference' | 'compliance' | 'other';
  helperText: string;
  accept?: string;
  maxSizeMB?: number;
  currentDocument?: RequirementDocument;
  onUpload: (file: File, documentType: string) => Promise<RequirementDocument>;
  onDelete: (documentId: string) => Promise<void>;
  isUploading?: boolean;
}

export const RequirementDocumentUploadField: React.FC<RequirementDocumentUploadFieldProps> = ({
  label,
  documentType,
  helperText,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  currentDocument,
  onUpload,
  onDelete,
  isUploading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [localUploading, setLocalUploading] = useState(false);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    if (['pdf'].includes(ext || '')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (['doc', 'docx'].includes(ext || '')) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }
    if (['xls', 'xlsx'].includes(ext || '')) {
      return <FileArchive className="w-5 h-5 text-green-600" />;
    }
    return <File className="w-5 h-5 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatUploadTime = (date: Date | string | undefined): string => {
    if (!date) return 'Just now';
    
    // Convert string to Date if needed (for data from API)
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Validate the date is valid
    if (isNaN(dateObj.getTime())) return 'Recently';

    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    // If document exists, show replace confirmation
    if (currentDocument) {
      setPendingFile(file);
      setShowReplaceDialog(true);
      return;
    }

    // Upload directly
    await performUpload(file);
  };

  const performUpload = async (file: File) => {
    try {
      setLocalUploading(true);
      setUploadProgress(20);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      await onUpload(file, documentType);

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success(`${label} uploaded successfully`);
      
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setLocalUploading(false);
      setPendingFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmReplace = async () => {
    if (pendingFile) {
      await performUpload(pendingFile);
    }
    setShowReplaceDialog(false);
  };

  const handleDelete = async () => {
    if (!currentDocument) return;
    
    try {
      await onDelete(currentDocument.id);
      toast.success('Document deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete document');
    }
    setShowDeleteDialog(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }

      if (currentDocument) {
        setPendingFile(file);
        setShowReplaceDialog(true);
      } else {
        performUpload(file);
      }
    }
  };

  const isProcessing = localUploading || isUploading;

  return (
    <div className="h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isProcessing}
      />

      {!currentDocument ? (
        <Card 
          className={`
            border-2 border-dashed transition-all duration-200 h-[160px]
            ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/40'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="p-4 h-full flex flex-col items-center justify-center">
            {isProcessing ? (
              <div className="text-center space-y-2 w-full">
                <Upload className="w-8 h-8 mx-auto text-primary animate-pulse" />
                <p className="text-sm font-medium">Uploading...</p>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{helperText}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-3 h-[160px] bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <div className="flex flex-col h-full">
            <p className="font-semibold text-xs text-emerald-700 dark:text-emerald-400 mb-2">{label}</p>
            <div className="flex items-center gap-2">
              {getFileIcon(currentDocument.name)}
              <p className="font-medium text-sm truncate flex-1">{currentDocument.name}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatFileSize(currentDocument.size)} • {formatUploadTime(currentDocument.uploadedAt)}
            </p>
            <div className="flex gap-2 mt-auto pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 h-8"
                onClick={() => window.open(currentDocument.url, '_blank')}
              >
                <Eye className="w-3 h-3 mr-1" /> Preview
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Replace Confirmation Dialog */}
      <AlertDialog open={showReplaceDialog} onOpenChange={setShowReplaceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace Document?</AlertDialogTitle>
            <AlertDialogDescription>
              A {label.toLowerCase()} already exists. Do you want to replace it with the new file?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReplace}>Replace</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
