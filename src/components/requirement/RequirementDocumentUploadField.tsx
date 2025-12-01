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
  uploadedAt: Date;
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

  const formatUploadTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
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
    <div className="space-y-3">
      <div>
        <Label className="text-base font-semibold">{label}</Label>
        <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
      </div>

      {!currentDocument ? (
        <Card 
          className={`
            border-2 border-dashed transition-all duration-200
            ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/40'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="p-8">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isProcessing}
            />
            
            {isProcessing ? (
              <div className="text-center space-y-4">
                <Upload className="w-12 h-12 mx-auto text-primary animate-pulse" />
                <div>
                  <p className="font-medium">Uploading {label}...</p>
                  <p className="text-sm text-muted-foreground">Please wait</p>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max {maxSizeMB}MB)
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-4 bg-muted/30 border-muted-foreground/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {getFileIcon(currentDocument.name)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{currentDocument.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(currentDocument.size)} • Uploaded {formatUploadTime(currentDocument.uploadedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => window.open(currentDocument.url, '_blank')}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
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
