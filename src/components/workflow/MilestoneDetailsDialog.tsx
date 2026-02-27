import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, Trash2, FileText, CheckCircle2, Circle, Check, Eye, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import workflowService from '@/services/modules/workflows';

interface MilestoneDocument {
    documentId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    uploadedBy: 'industry' | 'vendor';
    uploadedByUserId: string;
    uploadedAt: string;
    metadata?: {
        description?: string;
    };
}

interface Milestone {
    id: string;
    name: string;
    description?: string;
    amount: number;
    status: string;
    documents?: MilestoneDocument[];
    invoiceUrl?: string;
    invoiceNumber?: string;
    completionStatus?: {
        industryMarkedComplete: { status: boolean };
        vendorMarkedComplete: { status: boolean };
        fullyCompleted: boolean;
    };
}

interface MilestoneDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    onUploadSuccess?: () => void;
    milestone: Milestone;
    workflowId: string;
    currency: string;
    userType: 'industry' | 'vendor';
    currentUserId: string;
}

export const MilestoneDetailsDialog: React.FC<MilestoneDetailsDialogProps> = ({
    open,
    onClose,
    onUploadSuccess,
    milestone,
    workflowId,
    currency,
    userType,
    currentUserId
}) => {
    const { toast } = useToast();
    const [uploadingType, setUploadingType] = useState<'industry' | 'vendor' | null>(null);
    const [viewingDocId, setViewingDocId] = useState<string | null>(null);
    const [isFetchingInvoice, setIsFetchingInvoice] = useState(false);

    // New state for pending uploads
    const [pendingUploads, setPendingUploads] = useState<{
        industry: File[];
        vendor: File[];
    }>({ industry: [], vendor: [] });

    // Track individual files being uploaded
    const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

    // Upload document mutation
    const uploadMutation = useMutation({
        mutationFn: async ({ file, type }: { file: File; type: 'industry' | 'vendor' }) => {
            const formData = new FormData();
            formData.append('file', file);
            if (userType === 'vendor') {
                return workflowService.uploadVendorMilestoneDocument(workflowId, milestone.id, formData);
            }
            return workflowService.uploadMilestoneDocument(workflowId, milestone.id, formData);
        },
        onSuccess: () => {
            onUploadSuccess?.();
            toast({
                title: 'Success',
                description: 'Document uploaded successfully',
            });
            setUploadingType(null);
        },
        onError: (error: any) => {
            toast({
                title: 'Upload Failed',
                description: error?.response?.data?.error?.message || 'Failed to upload document',
                variant: 'destructive',
            });
            setUploadingType(null);
        }
    });

    // Delete document mutation
    const deleteMutation = useMutation({
        mutationFn: async (documentId: string) => {
            if (userType === 'vendor') {
                return workflowService.deleteVendorMilestoneDocument(workflowId, milestone.id, documentId);
            }
            return workflowService.deleteMilestoneDocument(workflowId, milestone.id, documentId);
        },
        onSuccess: () => {
            onUploadSuccess?.();
            toast({
                title: 'Success',
                description: 'Document deleted successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Delete Failed',
                description: error?.response?.data?.error?.message || 'Failed to delete document',
                variant: 'destructive',
            });
        }
    });

    // Helper to check upload permission
    const canUploadToSide = (side: 'industry' | 'vendor') => {
        return side === userType;
    };

    // Industry dropzone - add to pending list instead of uploading immediately
    const onDropIndustry = useCallback((acceptedFiles: File[]) => {
        if (!canUploadToSide('industry')) {
            toast({
                title: 'Permission Denied',
                description: 'You can only upload to your side',
                variant: 'destructive',
            });
            return;
        }

        if (acceptedFiles.length > 0) {
            setPendingUploads(prev => ({
                ...prev,
                industry: [...prev.industry, ...acceptedFiles]
            }));
            toast({
                title: 'Files Selected',
                description: `${acceptedFiles.length} file(s) ready to upload`,
            });
        }
    }, [userType]);

    const industryDropzone = useDropzone({
        onDrop: onDropIndustry,
        maxFiles: 1,
        maxSize: 20 * 1024 * 1024, // 20MB
        disabled: !canUploadToSide('industry')
    });

    // Vendor dropzone - add to pending list instead of uploading immediately
    const onDropVendor = useCallback((acceptedFiles: File[]) => {
        if (!canUploadToSide('vendor')) {
            toast({
                title: 'Permission Denied',
                description: 'You can only upload to your side',
                variant: 'destructive',
            });
            return;
        }

        if (acceptedFiles.length > 0) {
            setPendingUploads(prev => ({
                ...prev,
                vendor: [...prev.vendor, ...acceptedFiles]
            }));
            toast({
                title: 'Files Selected',
                description: `${acceptedFiles.length} file(s) ready to upload`,
            });
        }
    }, [userType]);

    const vendorDropzone = useDropzone({
        onDrop: onDropVendor,
        maxFiles: 1,
        maxSize: 20 * 1024 * 1024,
        disabled: !canUploadToSide('vendor')
    });

    const industryDocuments = milestone.documents?.filter(d => d.uploadedBy === 'industry') || [];
    const vendorDocuments = milestone.documents?.filter(d => d.uploadedBy === 'vendor') || [];

    // Handle confirming upload for a pending file
    const handleConfirmUpload = async (file: File, side: 'industry' | 'vendor') => {
        const fileId = `${file.name}-${file.size}`;
        setUploadingFiles(prev => new Set(prev).add(fileId));

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (userType === 'vendor') {
                await workflowService.uploadVendorMilestoneDocument(workflowId, milestone.id, formData);
            } else {
                await workflowService.uploadMilestoneDocument(workflowId, milestone.id, formData);
            }

            // Remove from pending
            setPendingUploads(prev => ({
                ...prev,
                [side]: prev[side].filter(f => f !== file)
            }));

            // Refresh milestone data
            onUploadSuccess?.();

            toast({
                title: 'Success',
                description: 'Document uploaded successfully',
            });
        } catch (error: any) {
            toast({
                title: 'Upload Failed',
                description: error?.response?.data?.error?.message || 'Failed to upload document',
                variant: 'destructive',
            });
        } finally {
            setUploadingFiles(prev => {
                const next = new Set(prev);
                next.delete(fileId);
                return next;
            });
        }
    };

    // Handle removing pending file before upload
    const handleRemovePending = (file: File, side: 'industry' | 'vendor') => {
        setPendingUploads(prev => ({
            ...prev,
            [side]: prev[side].filter(f => f !== file)
        }));
        toast({
            title: 'File Removed',
            description: 'File removed from upload queue',
        });
    };

    const handleDelete = (documentId: string) => {
        deleteMutation.mutate(documentId);
    };

    const handleViewDocument = async (doc: MilestoneDocument) => {
        setViewingDocId(doc.documentId);
        try {
            let response;
            if (userType === 'vendor') {
                response = await workflowService.getVendorDocumentViewUrl(workflowId, milestone.id, doc.documentId);
            } else {
                response = await workflowService.getIndustryDocumentViewUrl(workflowId, milestone.id, doc.documentId);
            }
            if (response.success && response.data?.viewUrl) {
                window.open(response.data.viewUrl, '_blank');
            } else {
                toast({
                    title: 'Error',
                    description: 'Could not generate view URL',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.error?.message || 'Failed to open document',
                variant: 'destructive',
            });
        } finally {
            setViewingDocId(null);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleViewInvoice = async () => {
        if (isFetchingInvoice) return;
        setIsFetchingInvoice(true);
        try {
            const result = userType === 'vendor'
                ? await workflowService.getVendorMilestoneInvoice(workflowId, milestone.id)
                : await workflowService.getIndustryMilestoneInvoice(workflowId, milestone.id);
            if (result.success && result.data.viewUrl) {
                window.open(result.data.viewUrl, '_blank');
            } else {
                toast({ title: 'Invoice not available', description: 'Invoice has not been generated yet.', variant: 'destructive' });
            }
        } catch (err: any) {
            toast({ title: 'Error', description: err?.response?.data?.error?.message || 'Could not fetch invoice.', variant: 'destructive' });
        } finally {
            setIsFetchingInvoice(false);
        }
    };

    // New DocumentList component showing both pending and uploaded files
    const DocumentList = ({
        documents,
        pendingFiles,
        side
    }: {
        documents: MilestoneDocument[];
        pendingFiles: File[];
        side: 'industry' | 'vendor';
    }) => (
        <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
                {/* Pending uploads section */}
                {pendingFiles.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Pending Uploads</p>
                        {pendingFiles.map((file, index) => {
                            const fileId = `${file.name}-${file.size}`;
                            const isUploading = uploadingFiles.has(fileId);

                            return (
                                <div key={`pending-${index}`} className="flex items-center justify-between p-3 border rounded-lg bg-amber-50/50 border-amber-200">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Upload Button (tick) */}
                                        {!isUploading && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                                onClick={() => handleConfirmUpload(file, side)}
                                                title="Upload to server"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}

                                        {/* Uploading Spinner */}
                                        {isUploading && (
                                            <div className="px-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            </div>
                                        )}

                                        {/* Delete Button */}
                                        {!isUploading && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                onClick={() => handleRemovePending(file, side)}
                                                title="Remove file"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Uploaded documents section */}
                {documents.length > 0 && (
                    <div className="space-y-2">
                        {pendingFiles.length > 0 && (
                            <p className="text-xs font-medium text-muted-foreground uppercase mt-4">Uploaded Documents</p>
                        )}
                        {documents.map((doc) => (
                            <div key={doc.documentId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{doc.fileName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(doc.fileSize)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* View/Eye Button – fetches a pre-signed S3 URL then opens it */}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10"
                                        onClick={() => handleViewDocument(doc)}
                                        disabled={viewingDocId === doc.documentId}
                                        title="View document"
                                    >
                                        {viewingDocId === doc.documentId ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>

                                    {/* Delete Button – visible only on the uploader's side */}
                                    {doc.uploadedBy === userType && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDelete(doc.documentId)}
                                            disabled={deleteMutation.isPending}
                                            title="Delete document"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {documents.length === 0 && pendingFiles.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No documents available</p>
                )}
            </div>
        </ScrollArea>
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-xl">{milestone.name}</DialogTitle>
                    {milestone.description && (
                        <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    )}
                </DialogHeader>

                {/* Status Bar */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div>
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge className="ml-2" variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                                {milestone.status.toUpperCase()}
                            </Badge>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Amount:</span>
                            <span className="ml-2 font-semibold">{currency} {milestone.amount.toLocaleString()}</span>
                        </div>
                    </div>
                    {/* View Invoice button – visible for paid/completed milestones */}
                    {(milestone.status === 'paid' || milestone.status === 'completed') && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleViewInvoice}
                            disabled={isFetchingInvoice}
                            className="gap-2"
                        >
                            {isFetchingInvoice ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            View Invoice
                        </Button>
                    )}
                </div>

                {/* Split Screen Document Management */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Industry Side */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase text-gray-600 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                            Industry Documents
                        </h3>

                        {/* Upload Zone */}
                        {canUploadToSide('industry') ? (
                            <div
                                {...industryDropzone.getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${industryDropzone.isDragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-blue-400'
                                    }`}
                            >
                                <input {...industryDropzone.getInputProps()} />
                                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm font-medium">Drop file or click to upload</p>
                                <p className="text-xs text-muted-foreground mt-1">Max 20MB</p>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm font-medium text-muted-foreground">View Only</p>
                                <p className="text-xs text-muted-foreground mt-1">You cannot upload to this section</p>
                            </div>
                        )}

                        {/* Document List */}
                        <div>
                            <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                            <DocumentList documents={industryDocuments} pendingFiles={pendingUploads.industry} side="industry" />
                        </div>
                    </div>

                    {/* Vendor Side */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase text-gray-600 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-600"></div>
                            Vendor Documents
                        </h3>

                        {/* Upload Zone */}
                        {canUploadToSide('vendor') ? (
                            <div
                                {...vendorDropzone.getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${vendorDropzone.isDragActive
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300 hover:border-green-400'
                                    }`}
                            >
                                <input {...vendorDropzone.getInputProps()} />
                                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm font-medium">Drop file or click to upload</p>
                                <p className="text-xs text-muted-foreground mt-1">Max 20MB</p>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm font-medium text-muted-foreground">View Only</p>
                                <p className="text-xs text-muted-foreground mt-1">You cannot upload to this section</p>
                            </div>
                        )}

                        {/* Document List */}
                        <div>
                            <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                            <DocumentList documents={vendorDocuments} pendingFiles={pendingUploads.vendor} side="vendor" />
                        </div>
                    </div>
                </div>

                {/* Completion Status Footer */}
                {milestone.completionStatus && (
                    <div className="mt-6 pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3">Completion Status</h4>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    {milestone.completionStatus.industryMarkedComplete?.status ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-gray-300" />
                                    )}
                                    <span className={milestone.completionStatus.industryMarkedComplete?.status ? 'text-green-700 font-medium' : 'text-muted-foreground'}>
                                        Industry Marked Complete
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {milestone.completionStatus.vendorMarkedComplete?.status ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-gray-300" />
                                    )}
                                    <span className={milestone.completionStatus.vendorMarkedComplete?.status ? 'text-green-700 font-medium' : 'text-muted-foreground'}>
                                        Vendor Marked Complete
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default MilestoneDetailsDialog;
