import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, File, X, CheckCircle2, Eye, AlertCircle, Clock } from 'lucide-react';
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
  isProfileLocked?: boolean;
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
  helperText,
  isProfileLocked = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Lock logic: Document is locked if profile is locked AND document status is pending or verified
  const isDocumentLocked = isProfileLocked && currentDocument && 
                          (currentDocument.status === 'pending' || currentDocument.status === 'verified');
  
  const canEdit = !isDocumentLocked;
  const canDelete = !isDocumentLocked;
  const showActions = !isProfileLocked || currentDocument?.status === 'rejected';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent file selection when locked
    if (!canEdit) {
      toast.warning('Document locked', {
        description: currentDocument?.status === 'verified' 
          ? 'This document has been verified and cannot be changed.'
          : 'This document is pending verification and cannot be changed.',
      });
      return;
    }

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

    // No existing document, show confirmation first
    setSelectedFile(file);
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
      setSelectedFile(null);
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

  const handleConfirmSelection = async () => {
    if (selectedFile) {
      await performUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
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
        {required && <span className="text-red-500 text-sm">*</span>}
        {currentDocument && (
          <CheckCircle2 className="w-5 h-5 text-green-600 animate-in zoom-in duration-300" />
        )}
        {required && !currentDocument && !selectedFile && (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        {selectedFile && !currentDocument && (
          <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
        )}
      </Label>

      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}

      {/* Warning Alert - shown when replacing existing document */}
      {showWarning && currentDocument && showActions && (
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

      {/* File Selection Confirmation - shown when file is selected but not uploaded */}
      {selectedFile && !isUploading && !currentDocument && showActions && (
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm text-blue-900 dark:text-blue-100">{selectedFile.name}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    {formatFileSize(selectedFile.size)} • Ready to upload
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-col">
                <Button 
                  size="sm" 
                  onClick={handleConfirmSelection}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancelSelection}
                  className="border-blue-300"
                >
                  <X className="w-4 h-4 mr-1" />
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {currentDocument ? (
        <div className={`border-2 rounded-lg p-4 ${
          currentDocument.status === 'verified' 
            ? 'bg-green-50 border-green-500 dark:bg-green-950/20 dark:border-green-700'
            : currentDocument.status === 'rejected'
            ? 'bg-red-50 border-red-500 dark:bg-red-950/20 dark:border-red-700'
            : currentDocument.status === 'pending'
            ? 'bg-blue-50 border-blue-500 dark:bg-blue-950/20 dark:border-blue-700'
            : 'bg-green-50 border-green-500 dark:bg-green-950/20 dark:border-green-700'
        } animate-in fade-in slide-in-from-top-2 duration-300`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div>
                <div>
                  <p className={`text-sm font-semibold break-words ${
                    currentDocument.status === 'verified' 
                      ? 'text-green-900 dark:text-green-100'
                      : currentDocument.status === 'rejected'
                      ? 'text-red-900 dark:text-red-100'
                      : currentDocument.status === 'pending'
                      ? 'text-blue-900 dark:text-blue-100'
                      : 'text-green-900 dark:text-green-100'
                  }`}>
                    {currentDocument.name}
                  </p>
                  {/* Show verification status badge */}
                  {currentDocument.status && (
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                      currentDocument.status === 'verified' 
                        ? 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : currentDocument.status === 'rejected'
                        ? 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                        : 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                    }`}>
                      {currentDocument.status === 'verified' ? '✓ Verified' : 
                       currentDocument.status === 'rejected' ? '✗ Rejected' : 
                       'Pending'}
                    </span>
                  )}
                </div>
                <p className={`text-xs ${
                  currentDocument.status === 'verified' 
                    ? 'text-green-700 dark:text-green-400'
                    : currentDocument.status === 'rejected'
                    ? 'text-red-700 dark:text-red-400'
                    : currentDocument.status === 'pending'
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-green-700 dark:text-green-400'
                }`}>
                  {formatFileSize(currentDocument.size)} • Uploaded successfully
                </p>
                {currentDocument.uploadedAt && (
                  <p className={`text-xs mt-0.5 ${
                    currentDocument.status === 'verified' 
                      ? 'text-green-600 dark:text-green-500'
                      : currentDocument.status === 'rejected'
                      ? 'text-red-600 dark:text-red-500'
                      : currentDocument.status === 'pending'
                      ? 'text-blue-600 dark:text-blue-500'
                      : 'text-green-600 dark:text-green-500'
                  }`}>
                    {new Date(currentDocument.uploadedAt).toLocaleDateString()} at {new Date(currentDocument.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
                {/* Show remarks if rejected */}
                {currentDocument.status === 'rejected' && currentDocument.remarks && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    <strong>Reason:</strong> {currentDocument.remarks}
                  </p>
                )}
                {/* Show lock message when locked */}
                {isDocumentLocked && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Locked during verification
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 self-start flex-shrink-0">
              {/* Always show preview button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.open(currentDocument.url, '_blank')}
                className="hover:bg-muted"
              >
                <Eye className="w-4 h-4" />
              </Button>
              {/* Only show delete button when can delete */}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
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
            disabled={isUploading || !canEdit}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !canEdit}
            className={`w-full ${
              !canEdit
                ? 'opacity-50 cursor-not-allowed'
                : selectedFile 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
                : required && !currentDocument 
                ? 'border-red-300' 
                : ''
            }`}
          >
            <Upload className="w-4 h-4 mr-2" />
            {!canEdit 
              ? 'Locked for Verification'
              : isUploading 
              ? 'Uploading...' 
              : currentDocument 
              ? 'Replace Document' 
              : 'Upload Document'}
          </Button>

          {/* Show lock explanation when profile is locked */}
          {isProfileLocked && !currentDocument && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Upload disabled during verification process
            </p>
          )}

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
