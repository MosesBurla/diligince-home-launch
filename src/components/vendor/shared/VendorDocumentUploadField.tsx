import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle2, 
  Eye, 
  AlertCircle, 
  Clock,
  FileText,
  Image as ImageIcon,
  Lock,
  RefreshCw
} from 'lucide-react';
import toast from '@/utils/toast.utils';
import { VerificationDocument, VendorDocumentType } from '@/types/verification';
import { getDocumentDisplayName } from '@/utils/vendorProfileValidation';
import { cn } from '@/lib/utils';

interface VendorDocumentUploadFieldProps {
  label: string;
  documentType: VendorDocumentType;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
  currentDocument?: VerificationDocument;
  onUpload: (file: File, documentType: string) => Promise<VerificationDocument>;
  onDelete: (documentId: string) => Promise<void>;
  helperText?: string;
  isProfileLocked?: boolean;
  vendorCategory?: string;
  className?: string;
}

export const VendorDocumentUploadField: React.FC<VendorDocumentUploadFieldProps> = ({
  label,
  documentType,
  required = false,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  currentDocument,
  onUpload,
  onDelete,
  helperText,
  isProfileLocked = false,
  vendorCategory,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Lock logic
  const isDocumentLocked = isProfileLocked && currentDocument && 
    (currentDocument.status === 'pending' || currentDocument.status === 'verified');
  const canEdit = !isDocumentLocked;
  const canDelete = !isDocumentLocked;
  const showActions = !isProfileLocked || currentDocument?.status === 'rejected';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) {
      toast.warning('Document locked', {
        description: currentDocument?.status === 'verified' 
          ? 'This document has been verified and cannot be changed.'
          : 'This document is pending verification.',
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

    if (currentDocument) {
      setPendingFile(file);
      setShowWarning(true);
      return;
    }

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
        description: 'Document is pending verification.',
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error('Upload failed', {
        description: error?.message || 'Please try again.',
      });
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
      toast.success('Document removed');
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error('Failed to remove document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType?: string) => {
    if (mimeType?.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case 'verified':
        return {
          border: 'border-emerald-300 dark:border-emerald-700',
          bg: 'bg-emerald-50 dark:bg-emerald-950/20',
          text: 'text-emerald-700 dark:text-emerald-300',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        };
      case 'rejected':
        return {
          border: 'border-red-300 dark:border-red-700',
          bg: 'bg-red-50 dark:bg-red-950/20',
          text: 'text-red-700 dark:text-red-300',
          badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
          icon: <X className="w-4 h-4 text-red-600" />,
        };
      case 'pending':
        return {
          border: 'border-amber-300 dark:border-amber-700',
          bg: 'bg-amber-50 dark:bg-amber-950/20',
          text: 'text-amber-700 dark:text-amber-300',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
          icon: <Clock className="w-4 h-4 text-amber-600" />,
        };
      default:
        return {
          border: 'border-blue-300 dark:border-blue-700',
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          text: 'text-blue-700 dark:text-blue-300',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
          icon: <File className="w-4 h-4 text-blue-600" />,
        };
    }
  };

  const statusStyles = getStatusStyles(currentDocument?.status);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label */}
      <Label className="flex items-center gap-2 text-sm font-medium">
        {label}
        {required && <span className="text-red-500">*</span>}
        {currentDocument && statusStyles.icon}
        {required && !currentDocument && !selectedFile && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
      </Label>

      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}

      {/* Replace Warning */}
      {showWarning && currentDocument && showActions && (
        <Alert className="border-amber-300 bg-amber-50/80 dark:bg-amber-950/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <p className="font-medium text-amber-800 dark:text-amber-300 mb-2">
              Replace existing document?
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
              This will replace <strong>{currentDocument.name}</strong>
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleConfirmUpload}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Replace
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelUpload}>
                Cancel
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Selected File Confirmation */}
      {selectedFile && !isUploading && !currentDocument && showActions && (
        <div className="p-3 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {getFileIcon(selectedFile.type)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • Ready to upload
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleConfirmSelection}
                className="bg-primary hover:bg-primary/90"
              >
                <CheckCircle2 className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCancelSelection}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Document Display */}
      {currentDocument ? (
        <div className={cn(
          'rounded-xl border-2 p-4 transition-all duration-200',
          statusStyles.border,
          statusStyles.bg
        )}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Document Icon */}
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                statusStyles.bg
              )}>
                {getFileIcon(currentDocument.type)}
              </div>
              
              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium truncate', statusStyles.text)}>
                  {currentDocument.name}
                </p>
                
                {/* Status Badge */}
                <span className={cn(
                  'inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium',
                  statusStyles.badge
                )}>
                  {currentDocument.status === 'verified' && '✓ Verified'}
                  {currentDocument.status === 'rejected' && '✗ Rejected'}
                  {currentDocument.status === 'pending' && '⏳ Pending'}
                  {!currentDocument.status && '📄 Uploaded'}
                </span>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(currentDocument.size)}
                  {currentDocument.uploadedAt && (
                    <> • {new Date(currentDocument.uploadedAt).toLocaleDateString()}</>
                  )}
                </p>
                
                {/* Rejection Reason */}
                {currentDocument.status === 'rejected' && currentDocument.remarks && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {currentDocument.remarks}
                  </p>
                )}
                
                {/* Lock Message */}
                {isDocumentLocked && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked during verification
                  </p>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.open(currentDocument.url, '_blank')}
                className="h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-black/20"
              >
                <Eye className="w-4 h-4" />
              </Button>
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Upload Zone */
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading || !canEdit}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !canEdit}
            className={cn(
              'w-full p-4 rounded-xl border-2 border-dashed transition-all duration-200',
              'flex flex-col items-center justify-center gap-2 min-h-[100px]',
              !canEdit
                ? 'opacity-50 cursor-not-allowed border-muted bg-muted/30'
                : required && !currentDocument
                ? 'border-red-300 hover:border-red-400 bg-red-50/30 dark:bg-red-950/10 hover:bg-red-50/50'
                : 'border-muted-foreground/25 hover:border-primary/50 bg-muted/20 hover:bg-muted/40'
            )}
          >
            {isDocumentLocked ? (
              <>
                <Lock className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Locked for Verification</span>
              </>
            ) : isUploading ? (
              <>
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className={cn(
                  'w-6 h-6',
                  required ? 'text-red-400' : 'text-muted-foreground'
                )} />
                <span className="text-sm font-medium text-foreground">
                  Click to upload
                </span>
                <span className="text-xs text-muted-foreground">
                  PDF, JPG, PNG up to {maxSizeMB}MB
                </span>
              </>
            )}
          </button>

          {/* Upload Progress */}
          {isUploading && (
            <Progress value={uploadProgress} className="h-1 mt-2" />
          )}
        </div>
      )}

      {/* Required Indicator */}
      {required && !currentDocument && !selectedFile && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          This document is required
        </p>
      )}
    </div>
  );
};
