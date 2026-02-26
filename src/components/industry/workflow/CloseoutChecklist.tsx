import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    CheckCircle2, Clock, Upload, Eye, ShieldCheck, FileText, AlertCircle, Loader2
} from 'lucide-react';
import { uploadCloseoutDocument, verifyCloseoutItem } from '@/services/modules/workflows/workflow.service';
import { toast } from 'sonner';

interface ChecklistItem {
    itemId: string;
    title: string;
    description: string;
    requiredFrom: 'industry' | 'vendor' | 'both';
    document?: { fileName: string; fileUrl: string; uploadedBy: string; uploadedAt: string } | null;
    verified: boolean;
    verifiedAt?: string;
}

interface CloseoutChecklistProps {
    workflowId: string;
    items: ChecklistItem[];
    isIndustry?: boolean;
    onRefresh: () => void;
    uploadFn?: (workflowId: string, itemId: string, file: File) => Promise<{ success: boolean; data: any; message: string }>;
    /** Call backend to get a fresh pre-signed S3 download URL for the document. */
    getViewUrlFn?: (workflowId: string, itemId: string) => Promise<{ success: boolean; data?: { viewUrl: string } }>;
}

export const CloseoutChecklist: React.FC<CloseoutChecklistProps> = ({
    workflowId, items, isIndustry = true, onRefresh, uploadFn, getViewUrlFn
}) => {
    const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
    const [viewingItemId, setViewingItemId] = useState<string | null>(null);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const verifiedCount = items.filter(i => i.verified).length;
    const progress = items.length > 0 ? Math.round((verifiedCount / items.length) * 100) : 0;

    const handleUpload = async (itemId: string, file: File) => {
        setLoadingItemId(itemId);
        try {
            const fn = uploadFn || uploadCloseoutDocument;
            const res = await fn(workflowId, itemId, file);
            if (res.success) {
                toast.success('Document uploaded successfully');
                onRefresh();
            } else {
                toast.error((res as any).message || 'Upload failed');
            }
        } catch {
            toast.error('Failed to upload document');
        } finally {
            setLoadingItemId(null);
        }
    };

    const handleViewDocument = async (itemId: string) => {
        if (!getViewUrlFn) {
            toast.error('Document viewer not configured');
            return;
        }
        setViewingItemId(itemId);
        try {
            const res = await getViewUrlFn(workflowId, itemId);
            if (res.success && res.data?.viewUrl) {
                window.open(res.data.viewUrl, '_blank', 'noopener,noreferrer');
            } else {
                toast.error('Could not generate document link. Please try again.');
            }
        } catch {
            toast.error('Failed to load document');
        } finally {
            setViewingItemId(null);
        }
    };

    const handleVerify = async (itemId: string) => {
        setLoadingItemId(itemId);
        try {
            const res = await verifyCloseoutItem(workflowId, itemId);
            if (res.success) {
                toast.success('Item verified successfully');
                onRefresh();
            } else {
                toast.error((res as any).message || 'Verification failed');
            }
        } catch {
            toast.error('Failed to verify item');
        } finally {
            setLoadingItemId(null);
        }
    };

    const getRequiredBadge = (requiredFrom: string) => {
        switch (requiredFrom) {
            case 'industry': return <Badge variant="outline" className="text-primary-500 border-primary-200 text-xs">Industry</Badge>;
            case 'vendor': return <Badge variant="outline" className="text-primary-500 border-primary-200 text-xs">Vendor</Badge>;
            default: return <Badge variant="outline" className="text-gray-600 border-gray-300 text-xs">Both Parties</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="h-4 w-4 text-primary-500" />
                        Closeout Checklist
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">{verifiedCount} / {items.length} verified</span>
                </div>
                <Progress value={progress} className="h-1.5 mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
                {items.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No checklist items yet.</p>
                )}
                {items.map((item) => {
                    const isLoading = loadingItemId === item.itemId;
                    const isViewing = viewingItemId === item.itemId;
                    // Upload allowed only to the responsible party
                    const canUpload = !item.verified && (
                        isIndustry
                            ? (item.requiredFrom === 'industry' || item.requiredFrom === 'both')
                            : (item.requiredFrom === 'vendor' || item.requiredFrom === 'both')
                    );
                    // Only industry can verify; a document must be uploaded first
                    const canVerify = isIndustry && !item.verified && !!item.document;

                    return (
                        <div
                            key={item.itemId}
                            className={`rounded-lg border p-3 transition-colors ${item.verified ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                {/* Left: icon + content */}
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                    {item.verified ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                                    ) : item.document ? (
                                        <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-medium">{item.title}</span>
                                            {getRequiredBadge(item.requiredFrom)}
                                        </div>
                                        {item.description && (
                                            <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                                        )}
                                        {/* Uploaded document — click to fetch pre-signed URL */}
                                        {item.document && (
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewDocument(item.itemId)}
                                                    disabled={isViewing}
                                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    {isViewing
                                                        ? <Loader2 className="h-3 w-3 animate-spin" />
                                                        : <Eye className="h-3 w-3" />
                                                    }
                                                    {item.document.fileName}
                                                </button>
                                                <span className="text-xs text-muted-foreground">
                                                    by {item.document.uploadedBy}
                                                </span>
                                            </div>
                                        )}
                                        {item.verified && item.verifiedAt && (
                                            <p className="text-xs text-green-700 mt-0.5">
                                                Verified {new Date(item.verifiedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right: action buttons */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {canUpload && (
                                        <>
                                            <input
                                                ref={el => { fileInputRefs.current[item.itemId] = el; }}
                                                type="file"
                                                className="hidden"
                                                onChange={e => {
                                                    const f = e.target.files?.[0];
                                                    if (f) handleUpload(item.itemId, f);
                                                    e.target.value = '';
                                                }}
                                            />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 px-2 text-xs"
                                                disabled={isLoading}
                                                onClick={() => fileInputRefs.current[item.itemId]?.click()}
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Upload className="h-3 w-3 mr-1" />
                                                        {item.document ? 'Re-upload' : 'Upload'}
                                                    </>
                                                )}
                                            </Button>
                                        </>
                                    )}
                                    {canVerify && (
                                        <Button
                                            size="sm"
                                            variant="default"
                                            className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700"
                                            disabled={isLoading}
                                            onClick={() => handleVerify(item.itemId)}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <>
                                                    <ShieldCheck className="h-3 w-3 mr-1" />
                                                    Verify
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};
