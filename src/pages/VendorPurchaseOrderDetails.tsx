import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Building2,
    Calendar,
    IndianRupee,
    FileText,
    CheckCircle2,
    Clock,
    Loader2,
    AlertCircle,
    CheckCircle,
    Download,
    MessageCircle
} from 'lucide-react';
import { vendorPurchaseOrdersService } from '@/services/modules/vendors/purchase-orders.service';
import { DetailPageSkeleton } from '@/components/shared/loading';
import { useToast } from '@/components/ui/use-toast';
import { exportPOToPDF } from '@/services/pdf-generator';
import { InlineChatPanel } from '@/components/chat/InlineChatPanel';

const VendorPurchaseOrderDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isResponding, setIsResponding] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showChatPanel, setShowChatPanel] = useState(false);

    // Hide chatbot icon when chat panel is open
    useEffect(() => {
        if (showChatPanel) {
            document.body.classList.add('inline-chat-open');
        } else {
            document.body.classList.remove('inline-chat-open');
        }
        return () => {
            document.body.classList.remove('inline-chat-open');
        };
    }, [showChatPanel]);

    // Dialog states
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showNegotiateDialog, setShowNegotiateDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [negotiateComments, setNegotiateComments] = useState('');

    const { data: poDetail, isLoading, error } = useQuery<any>({
        queryKey: ['vendor-purchase-order', id],
        queryFn: () => vendorPurchaseOrdersService.getPODetails(id!),
        enabled: !!id,
    });

    // Debug logging
    console.log('VendorPurchaseOrderDetails - ID:', id);
    console.log('VendorPurchaseOrderDetails - Loading:', isLoading);
    console.log('VendorPurchaseOrderDetails - Error:', error);
    console.log('VendorPurchaseOrderDetails - PO Detail:', poDetail);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            sent_to_vendor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            negotiating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            sent_to_vendor: 'Pending Review',
            pending: 'Pending Approval',
            pending_approval: 'Pending Approval',
            approved: 'Approved',
            accepted: 'Accepted',
            rejected: 'Rejected',
            negotiating: 'Under Negotiation',
            cancelled: 'Cancelled',
        };
        return labels[status] || status;
    };

    const formatDate = (dateValue: any) => {
        if (!dateValue) return 'N/A';
        try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return 'N/A';
        }
    };

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Handle Accept PO - Open dialog
    const handleAcceptClick = () => {
        setShowAcceptDialog(true);
    };

    const handleAcceptConfirm = async () => {
        if (!id) return;

        setIsResponding(true);
        try {
            await vendorPurchaseOrdersService.respondToPO(id, 'accept', {
                comments: 'Purchase order accepted',
            });

            toast({
                title: 'Success!',
                description: 'Purchase order accepted successfully. Workflow has been created.',
                variant: 'default',
            });

            // Invalidate queries and navigate to workflows
            queryClient.invalidateQueries({ queryKey: ['vendor-purchase-order', id] });
            queryClient.invalidateQueries({ queryKey: ['vendor-purchase-orders'] });

            setShowAcceptDialog(false);

            // Navigate to workflows page after a short delay
            setTimeout(() => {
                navigate('/dashboard/vendor/workflows');
            }, 1500);
        } catch (error: any) {
            console.error('Error accepting PO:', error);

            // Handle PO_ALREADY_RESPONDED error specifically
            const errorMessage = error?.response?.data?.error?.message || 'Failed to accept purchase order';
            const errorCode = error?.response?.data?.error?.code;

            if (errorCode === 'PO_ALREADY_RESPONDED') {
                toast({
                    title: 'Already Responded',
                    description: 'This purchase order has already been responded to.',
                    variant: 'default',
                });

                // Close dialog and refresh data to get current status
                setShowAcceptDialog(false);
                queryClient.invalidateQueries({ queryKey: ['vendor-purchase-order', id] });
                queryClient.invalidateQueries({ queryKey: ['vendor-purchase-orders'] });
            } else {
                toast({
                    title: 'Error',
                    description: errorMessage,
                    variant: 'destructive',
                });
            }
        } finally {
            setIsResponding(false);
        }
    };

    // Handle Reject PO - Open dialog
    const handleRejectClick = () => {
        setRejectReason('');
        setShowRejectDialog(true);
    };

    const handleRejectConfirm = async () => {
        if (!id) return;

        if (!rejectReason.trim()) {
            toast({
                title: 'Reason Required',
                description: 'Please provide a reason for rejection.',
                variant: 'destructive',
            });
            return;
        }

        setIsResponding(true);
        try {
            await vendorPurchaseOrdersService.respondToPO(id, 'reject', {
                reason: rejectReason,
                comments: 'Purchase order rejected',
            });

            toast({
                title: 'Purchase Order Rejected',
                description: 'The purchase order has been rejected successfully.',
                variant: 'default',
            });

            // Invalidate queries and navigate back
            queryClient.invalidateQueries({ queryKey: ['vendor-purchase-order', id] });
            queryClient.invalidateQueries({ queryKey: ['vendor-purchase-orders'] });

            setShowRejectDialog(false);
            setRejectReason('');

            setTimeout(() => {
                navigate('/dashboard/vendor/purchase-orders');
            }, 1500);
        } catch (error: any) {
            console.error('Error rejecting PO:', error);
            toast({
                title: 'Error',
                description: error?.response?.data?.error?.message || 'Failed to reject purchase order',
                variant: 'destructive',
            });
        } finally {
            setIsResponding(false);
        }
    };

    // Handle Negotiate PO - Open dialog
    const handleNegotiateClick = () => {
        setNegotiateComments('');
        setShowNegotiateDialog(true);
    };

    const handleNegotiateConfirm = async () => {
        if (!id) return;

        if (!negotiateComments.trim()) {
            toast({
                title: 'Comments Required',
                description: 'Please provide your negotiation comments.',
                variant: 'destructive',
            });
            return;
        }

        setIsResponding(true);
        try {
            await vendorPurchaseOrdersService.respondToPO(id, 'negotiate', {
                comments: negotiateComments,
            });

            toast({
                title: 'Negotiation Initiated',
                description: 'Your negotiation request has been sent to the industry.',
                variant: 'default',
            });

            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['vendor-purchase-order', id] });
            queryClient.invalidateQueries({ queryKey: ['vendor-purchase-orders'] });

            setShowNegotiateDialog(false);
            setNegotiateComments('');
        } catch (error: any) {
            console.error('Error negotiating PO:', error);
            toast({
                title: 'Error',
                description: error?.response?.data?.error?.message || 'Failed to initiate negotiation',
                variant: 'destructive',
            });
        } finally {
            setIsResponding(false);
        }
    };

    const handleExport = async () => {
        if (!poDetail) return;

        setIsExporting(true);
        try {
            const data = await vendorPurchaseOrdersService.exportPOAsPDF(poDetail.id);
            if (data && data.success) {
                await exportPOToPDF(data.data);
                toast({
                    title: 'Success',
                    description: 'Purchase order exported as PDF successfully.',
                    variant: 'default',
                });
            } else {
                toast({
                    title: 'Error',
                    description: data?.error?.message || 'Failed to export purchase order',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Export error:', error);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred during export.',
                variant: 'destructive',
            });
        } finally {
            setIsExporting(false);
        }
    };



    if (isLoading) {
        return <DetailPageSkeleton />;
    }

    if (error || !poDetail) {
        console.error('VendorPurchaseOrderDetails - Error details:', error);
        return (
            <div className="container mx-auto p-6">
                <div className="text-center space-y-4">
                    <p className="text-red-600 text-lg font-medium">Failed to load purchase order details</p>
                    {error && (
                        <p className="text-sm text-muted-foreground">
                            Error: {error instanceof Error ? error.message : String(error)}
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                        PO ID: {id || 'No ID provided'}
                    </p>
                    <Button onClick={() => navigate('/dashboard/vendor/quotations')} className="mt-4">
                        Go Back to Quotations
                    </Button>
                </div>
            </div>
        );
    }

    const canRespond = poDetail.status === 'pending' || poDetail.status === 'pending_approval' || poDetail.status === 'negotiating';

    // Check if PO has already been responded to
    const isAlreadyResponded = poDetail.status === 'accepted' ||
        poDetail.status === 'rejected' ||
        poDetail.status === 'vendor_accepted' ||
        poDetail.status === 'vendor_rejected';

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header with sticky action buttons */}
            <div className="sticky top-0 z-10 pb-6 mb-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/dashboard/vendor/quotations')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">{poDetail.poNumber}</h1>
                                <Badge className={getStatusColor(poDetail.status)}>
                                    {getStatusLabel(poDetail.status)}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mt-1">
                                {poDetail.project?.title || 'Purchase Order Details'}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons - Top Right */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            disabled={isExporting}
                            size="sm"
                        >
                            {isExporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                            Export PO
                        </Button>



                        {canRespond && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowChatPanel(true)}
                                    size="sm"
                                    className="border-blue-500 text-blue-700 hover:bg-blue-50"
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Chat
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleRejectClick}
                                    disabled={isResponding}
                                    size="sm"
                                >
                                    {isResponding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Reject
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={handleAcceptClick}
                                    disabled={isResponding}
                                    size="sm"
                                >
                                    {isResponding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Accept
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Already Responded Indicator */}
                    {isAlreadyResponded && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Responded</span>
                        </div>
                    )}
                </div>
            </div>

            {/* PO Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            Total Value
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {formatCurrency(poDetail.paymentMilestones?.reduce((sum: number, m: any) => sum + (m.amount || 0), 0))}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Currency: {poDetail.currency || 'INR'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            Project Duration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">
                            <span className="font-medium">Start:</span> {formatDate(poDetail.project?.startDate)}
                        </p>
                        <p className="text-sm mt-1">
                            <span className="font-medium">End:</span> {formatDate(poDetail.project?.endDate)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Deadline
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">
                            <span className="font-medium">Received:</span> {formatDate(poDetail.receivedAt)}
                        </p>
                        <p className="text-sm mt-1">
                            <span className="font-medium">Status:</span> {getStatusLabel(poDetail.status)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Industry Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Client Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Company Name</p>
                        <p className="text-sm font-medium">{poDetail.industry?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">GSTIN</p>
                        <p className="text-sm font-medium">{poDetail.industry?.gstin || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="text-sm font-medium">{poDetail.industry?.address || 'N/A'}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Project Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Project Title</p>
                        <p className="text-sm mt-1 font-medium">
                            {poDetail.project?.title || poDetail.projectTitle || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm mt-1">
                            {formatDate(poDetail.project?.startDate || poDetail.startDate)} to {formatDate(poDetail.project?.endDate || poDetail.endDate)}
                        </p>
                    </div>
                    {poDetail.project?.scopeOfWork && (
                        <div>
                            <p className="text-xs text-muted-foreground">Scope of Work</p>
                            <p className="text-sm mt-1 whitespace-pre-wrap">
                                {poDetail.project.scopeOfWork}
                            </p>
                        </div>
                    )}
                    {poDetail.project?.specialInstructions && (
                        <div>
                            <p className="text-xs text-muted-foreground">Special Instructions</p>
                            <p className="text-sm mt-1 whitespace-pre-wrap">
                                {poDetail.project.specialInstructions}
                            </p>
                        </div>
                    )}
                    {poDetail.acceptanceCriteria && Array.isArray(poDetail.acceptanceCriteria) && poDetail.acceptanceCriteria.length > 0 && (
                        <div>
                            <p className="text-xs text-muted-foreground">Acceptance Criteria</p>
                            <div className="mt-2 space-y-2">
                                {poDetail.acceptanceCriteria.map((item: any, index: number) => (
                                    <div key={item.id || index} className="flex items-start gap-2">
                                        <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${item.isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                                        <p className="text-sm">{item.criteria}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Financial Summary */}
            {poDetail.financial && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IndianRupee className="h-5 w-5" />
                            Financial Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Subtotal</span>
                                <span className="text-sm font-medium">{formatCurrency(poDetail.financial.subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Tax ({poDetail.financial.taxPercentage}%)
                                </span>
                                <span className="text-sm font-medium">{formatCurrency(poDetail.financial.taxAmount)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-base font-semibold">Total Amount</span>
                                <span className="text-base font-bold text-primary">
                                    {formatCurrency(poDetail.financial.totalAmount)}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Currency: {poDetail.financial.currency || 'INR'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Deliverables */}
            {poDetail.deliverables && poDetail.deliverables.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Deliverables</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {poDetail.deliverables.map((item: any, index: number) => (
                                <div key={index} className="p-4 border rounded-lg space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-2 flex-1">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="font-medium">{item.description}</p>
                                                {item.specifications && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {item.specifications}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {item.totalPrice && (
                                            <div className="text-right ml-4">
                                                <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-4 text-sm text-muted-foreground ml-7">
                                        {item.quantity && (
                                            <span>
                                                Quantity: <span className="font-medium text-foreground">{item.quantity} {item.unit || 'units'}</span>
                                            </span>
                                        )}
                                        {item.unitPrice && (
                                            <span>
                                                Unit Price: <span className="font-medium text-foreground">{formatCurrency(item.unitPrice)}</span>
                                            </span>
                                        )}
                                        {item.status && (
                                            <span>
                                                Status: <span className="font-medium text-foreground capitalize">{item.status.replace('_', ' ')}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Payment Milestones */}
            {poDetail.paymentMilestones && poDetail.paymentMilestones.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Milestones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {poDetail.paymentMilestones.map((milestone: any, index: number) => (
                                <div key={index} className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium">{milestone.name || `Milestone ${index + 1}`}</p>
                                        <p className="font-bold">{formatCurrency(milestone.amount)}</p>
                                    </div>
                                    {milestone.description && (
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {milestone.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {milestone.percentage}% of total
                                        </span>
                                        {milestone.dueDate && (
                                            <span className="text-muted-foreground">
                                                Due: {formatDate(milestone.dueDate)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Payment Terms */}
            {poDetail.paymentTerms && (
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm whitespace-pre-wrap">
                            {typeof poDetail.paymentTerms === 'object'
                                ? `Method: ${poDetail.paymentTerms.method || 'N/A'}\nAdvance Payment: ${poDetail.paymentTerms.advancePayment || 0}%`
                                : poDetail.paymentTerms}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Acceptance Criteria */}
            {poDetail.acceptanceCriteria && Array.isArray(poDetail.acceptanceCriteria) && poDetail.acceptanceCriteria.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Acceptance Criteria</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {poDetail.acceptanceCriteria.map((item: any, index: number) => (
                                <div key={item.id || index} className="flex items-start gap-2">
                                    <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${item.isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                                    <p className="text-sm">{item.criteria}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Accept Dialog */}
            <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">Accept Purchase Order</DialogTitle>
                                <DialogDescription className="mt-1">
                                    Confirm your acceptance of this purchase order
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                <strong>Important:</strong> Accepting this purchase order will automatically create a project workflow.
                                You'll be able to track milestones, upload deliverables, and communicate with the industry.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowAcceptDialog(false)}
                            disabled={isResponding}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAcceptConfirm}
                            disabled={isResponding}
                        >
                            {isResponding ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Accepting...
                                </>
                            ) : (
                                'Accept Purchase Order'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">Reject Purchase Order</DialogTitle>
                                <DialogDescription className="mt-1">
                                    Please provide a reason for rejection
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reject-reason">Reason for Rejection *</Label>
                            <Textarea
                                id="reject-reason"
                                placeholder="Please explain why you're rejecting this purchase order..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                This reason will be shared with the industry.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowRejectDialog(false);
                                setRejectReason('');
                            }}
                            disabled={isResponding}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectConfirm}
                            disabled={isResponding || !rejectReason.trim()}
                        >
                            {isResponding ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Rejecting...
                                </>
                            ) : (
                                'Reject Purchase Order'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Negotiate Dialog */}
            <Dialog open={showNegotiateDialog} onOpenChange={setShowNegotiateDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">Negotiate Purchase Order</DialogTitle>
                                <DialogDescription className="mt-1">
                                    Share your negotiation points with the industry
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="negotiate-comments">Negotiation Comments *</Label>
                            <Textarea
                                id="negotiate-comments"
                                placeholder="Describe what you'd like to negotiate (pricing, timeline, deliverables, etc.)..."
                                value={negotiateComments}
                                onChange={(e) => setNegotiateComments(e.target.value)}
                                rows={5}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                Be specific about what aspects you'd like to discuss.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowNegotiateDialog(false);
                                setNegotiateComments('');
                            }}
                            disabled={isResponding}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleNegotiateConfirm}
                            disabled={isResponding || !negotiateComments.trim()}
                        >
                            {isResponding ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                'Send Negotiation Request'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Inline Chat Panel */}
            <InlineChatPanel
                isOpen={showChatPanel}
                onClose={() => setShowChatPanel(false)}
                relatedType="quote"
                relatedId={poDetail.quotationId || poDetail.quoteId || poDetail._id}
                relatedTitle={poDetail.poNumber}
                companyId={poDetail.industry?._id || ''}
                companyName={poDetail.industry?.name || poDetail.industry?.email || 'Industry'}
            />
        </div>
    );
};

export default VendorPurchaseOrderDetails;
