import React, { useRef, useState, useCallback } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Allowed file types and max size
const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface UploadedFile {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
}

interface SOWDocumentUploadProps {
    files: UploadedFile[];
    onFilesChange: (files: UploadedFile[]) => void;
    maxFiles?: number;
    disabled?: boolean;
}

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileExtension = (filename: string): string => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 1).toLowerCase();
};

const SOWDocumentUpload: React.FC<SOWDocumentUploadProps> = ({
    files,
    onFilesChange,
    maxFiles = 5,
    disabled = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
        // Check file type
        const extension = `.${getFileExtension(file.name)}`;
        if (!ALLOWED_EXTENSIONS.includes(extension) && !ALLOWED_TYPES.includes(file.type)) {
            return {
                valid: false,
                error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
            };
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `File too large. Max size: ${formatFileSize(MAX_FILE_SIZE)}`
            };
        }

        return { valid: true };
    }, []);

    const handleFiles = useCallback((fileList: FileList | null) => {
        if (!fileList || disabled) return;

        const newFiles: UploadedFile[] = [];
        const currentCount = files.length;
        const remainingSlots = maxFiles - currentCount;

        if (remainingSlots <= 0) {
            return;
        }

        for (let i = 0; i < Math.min(fileList.length, remainingSlots); i++) {
            const file = fileList[i];
            const validation = validateFile(file);

            newFiles.push({
                id: `${Date.now()}-${i}-${file.name}`,
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                status: validation.valid ? 'pending' : 'error',
                error: validation.error
            });
        }

        onFilesChange([...files, ...newFiles]);
    }, [files, maxFiles, disabled, validateFile, onFilesChange]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleRemoveFile = useCallback((fileId: string) => {
        onFilesChange(files.filter(f => f.id !== fileId));
    }, [files, onFilesChange]);

    const handleBrowseClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const canAddMore = files.length < maxFiles && !disabled;

    return (
        <div className="space-y-4">
            {/* Drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    disabled && "opacity-50 cursor-not-allowed",
                    !canAddMore && "opacity-50"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ALLOWED_EXTENSIONS.join(',')}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                    disabled={disabled || !canAddMore}
                />

                <div className="flex flex-col items-center gap-2">
                    <Upload className={cn(
                        "h-8 w-8",
                        isDragging ? "text-primary" : "text-muted-foreground"
                    )} />
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            {isDragging ? "Drop files here" : "Drag & drop files here"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            or{' '}
                            <button
                                type="button"
                                onClick={handleBrowseClick}
                                disabled={!canAddMore}
                                className="text-primary hover:text-primary/80 font-medium disabled:opacity-50"
                            >
                                browse
                            </button>
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        PDF, DOC, DOCX, XLS, XLSX (max {formatFileSize(MAX_FILE_SIZE)} each, up to {maxFiles} files)
                    </p>
                </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                        Uploaded Documents ({files.length}/{maxFiles})
                    </p>
                    {files.map((file) => (
                        <Card key={file.id} className="p-3 bg-card/60 border-border/60">
                            <div className="flex items-center gap-3">
                                <File className={cn(
                                    "h-8 w-8 flex-shrink-0",
                                    file.status === 'error' ? "text-destructive" : "text-primary"
                                )} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {file.name}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {formatFileSize(file.size)}
                                        </span>
                                        {file.status === 'error' && (
                                            <span className="flex items-center gap-1 text-xs text-destructive">
                                                <AlertCircle className="h-3 w-3" />
                                                {file.error}
                                            </span>
                                        )}
                                        {file.status === 'success' && (
                                            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle className="h-3 w-3" />
                                                Uploaded
                                            </span>
                                        )}
                                        {file.status === 'pending' && (
                                            <span className="text-xs text-muted-foreground">Ready to upload</span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFile(file.id)}
                                    disabled={disabled}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SOWDocumentUpload;
