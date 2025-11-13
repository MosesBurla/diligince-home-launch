import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, File, X, CheckCircle2, Eye, AlertCircle } from 'lucide-react';
import toast from '@/utils/toast.utils';
import { VerificationDocument } from '@/types/verification';

interface DocumentUploadFieldProps {
  label: string;
  documentType: VerificationDocument['documentType'];
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
  currentDocument?: VerificationDocument;
  onUpload: (file: File, documentType: string) => Promise<VerificationDocument>;
  onDelete: (documentId: string) => Promise<void>;
  helperText?: string;
}

export const DocumentUploadField: React.FC<DocumentUploadFieldProps> = ({
  label,
  documentType,
  required = false,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  currentDocument,
  onUpload,
  onDelete,
  helperText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.warning(`File size exceeds ${maxSizeMB}MB limit`, {
        description: 'Please select a smaller file.',
      });
      return;
    }

    // If there's already a document, show warning
    if (currentDocument) {
      setPendingFile(file);
      setShowWarning(true);
      return;
    }

    // No existing document, upload directly
    await performUpload(file);
  };

  const performUpload = async (file: File) => {
    const loadingToast = toast.loading(`Uploading ${label}...`);
    
    try {
      setIsUploading(true);
      setUploadProgress(20);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      await onUpload(file, documentType);

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.dismiss(loadingToast);
      toast.success(`${label} uploaded successfully`, {
        description: 'Document has been uploaded and is pending verification.',
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      // Error already handled by service layer
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setPendingFile(null);
      setShowWarning(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmUpload = async () => {
    if (pendingFile) {
      await performUpload(pendingFile);
    }
  };

  const handleCancelUpload = () => {
    setPendingFile(null);
    setShowWarning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!currentDocument) return;
    
    const loadingToast = toast.loading('Removing document...');
    try {
      await onDelete(currentDocument.id);
      toast.dismiss(loadingToast);
      toast.success('Document removed successfully');
    } catch (error: any) {
      toast.dismiss(loadingToast);
      // Error already handled by service layer
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
        {currentDocument && (
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        )}
        {required && !currentDocument && (
          <AlertCircle className="w-4 h-4 text-red-600" />
        )}
      </Label>

      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}

      {/* Warning Alert - shown when replacing existing document */}
      {showWarning && currentDocument && (
        <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm">
            <p className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
              Replace existing document?
            </p>
            <p className="text-amber-700 dark:text-amber-500 mb-3">
              This will permanently replace{' '}
              <span className="font-medium">{currentDocument.name}</span>{' '}
              with the newly selected file. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleConfirmUpload}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Yes, Replace Document
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelUpload}
              >
                Cancel
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {currentDocument ? (
        <div className="border rounded-lg p-3 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">{currentDocument.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(currentDocument.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(currentDocument.url, '_blank')}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`w-full ${required && !currentDocument ? 'border-red-300' : ''}`}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading 
              ? 'Uploading...' 
              : currentDocument 
              ? 'Replace Document' 
              : 'Upload Document'}
          </Button>

          {isUploading && (
            <div className="mt-2">
              <Progress value={uploadProgress} className="h-1" />
            </div>
          )}
        </div>
      )}

      {required && !currentDocument && (
        <p className="text-xs text-red-600">This document is required</p>
      )}
    </div>
  );
};
