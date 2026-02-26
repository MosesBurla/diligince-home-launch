import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    Calendar,
    Clock,
    AlertTriangle,
    Loader2,
    IndianRupee,
    Building2,
    FileText,
    CheckCircle2,
    TrendingUp,
    Info,
} from 'lucide-react';

import { getVendorWorkflowDetails as fetchVendorWorkflowDetails, markMilestoneComplete as vendorMarkMilestoneComplete, getVendorCloseoutChecklist, uploadVendorCloseoutDocument, getVendorCloseoutDocumentViewUrl } from '@/services/modules/workflows/workflow.service';
import type { WorkflowDetail, WorkflowMilestone } from '@/services/modules/workflows/workflow.types';
import { MilestoneCard } from '@/components/workflow/MilestoneCard';
import { MilestoneDetailsDialog } from '@/components/workflow/MilestoneDetailsDialog';
import { CloseoutChecklist } from '@/components/industry/workflow/CloseoutChecklist';

// Helper functions
const formatCurrency = (amount: number, currency: string) => `${currency} ${amount.toLocaleString()}`;

// Types imported from shared workflow.types

const VendorWorkflowDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [workflowData, setWorkflowData] = useState<WorkflowDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingMilestone, setProcessingMilestone] = useState<string | null>(null);
    const [closeoutData, setCloseoutData] = useState<any>(null);

    // Milestone details dialog state
    const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

    // Derive the milestone live from workflowData so documents appear after upload without re-opening
    const dialogMilestone = selectedMilestoneId
        ? workflowData?.milestones?.find((m: any) => m.id === selectedMilestoneId) ?? null
        : null;

    const fetchWorkflowDetails = async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetchVendorWorkflowDetails(id);
            if (response.success) {
                setWorkflowData(response.data);
            } else {
                setError('Failed to load project details');
            }
        } catch (err) {
            setError('Failed to load project details');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkflowDetails();
    }, [id]);

    useEffect(() => {
        if (!id || !workflowData?.workflow) return;
        // Fetch closeout checklist when workflow is in awaiting_closeout or closed
        getVendorCloseoutChecklist(id)
            .then(res => { if (res.success) setCloseoutData(res.data); })
            .catch(() => { });
    }, [workflowData]);

    // Milestone action handlers
    const handleMarkComplete = async (milestoneId: string) => {
        if (!id) return;
        try {
            setProcessingMilestone(milestoneId);
            const response = await vendorMarkMilestoneComplete(id, milestoneId, {});
            if (response.success) {
                toast.success('Milestone marked as complete!');
                fetchWorkflowDetails();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.error?.message || 'Failed to mark milestone complete');
        } finally {
            setProcessingMilestone(null);
        }
    };

    const handleViewDetails = (milestoneId: string) => {
        setSelectedMilestoneId(milestoneId);
        setIsDetailsDialogOpen(true);
    };

    const handleDownloadInvoice = (invoiceUrl: string) => {
        window.open(invoiceUrl, '_blank');
    };

    // Payment initiate — vendor doesn't pay, noop
    const handlePaymentInitiate = (_milestoneId: string) => {
        toast.info('Payments are handled by the industry side.');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (error || !workflowData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border border-border/60 rounded-xl p-8 text-center max-w-md shadow-sm">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-foreground mb-2">Project Not Found</h2>
                    <p className="text-sm text-muted-foreground mb-6">{error || 'Unable to load project details'}</p>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const { workflow, linkedEntities, industry, milestones, stats } = workflowData;

    const statusConfig: Record<string, { label: string; className: string }> = {
        active: { label: 'ACTIVE', className: 'bg-primary/10 text-primary border-primary/20' },
        completed: { label: 'COMPLETED', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200' },
        paused: { label: 'PAUSED', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        cancelled: { label: 'CANCELLED', className: 'bg-red-100 text-red-700 border-red-200' },
        awaiting_closeout: { label: 'AWAITING CLOSEOUT', className: 'bg-primary-50 text-primary-600 border-primary-200' },
        closed: { label: 'CLOSED', className: 'bg-slate-100 text-slate-600 border-slate-200' },
        disputed: { label: 'DISPUTED', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    };
    const currentStatus = statusConfig[workflow.status] || { label: workflow.status.toUpperCase(), className: 'bg-muted text-muted-foreground' };

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>{workflow.projectTitle} | Project | Diligence</title>
            </Helmet>

            <main className="container mx-auto px-4 py-8 pt-20">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="mb-4 hover:bg-muted/50 -ml-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Button>

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                {workflow.projectTitle}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Project ID: <span className="font-mono">{workflow.workflowId}</span>
                            </p>
                        </div>
                        <Badge className={cn('text-xs font-medium px-3 py-1 border', currentStatus.className)}>
                            {currentStatus.label}
                        </Badge>
                    </div>
                </div>

                {/* Overview stat chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="bg-white/98 dark:bg-gray-950/98 border border-border/60 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Progress</p>
                            <p className="text-base font-bold text-foreground">{workflow.progress}%</p>
                        </div>
                    </div>
                    <div className="bg-white/98 dark:bg-gray-950/98 border border-border/60 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                        <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <IndianRupee className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Contract Value</p>
                            <p className="text-base font-bold text-foreground">{workflow.currency} {workflow.totalValue.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-white/98 dark:bg-gray-950/98 border border-border/60 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                        <div className="p-1.5 bg-primary/5 rounded-lg">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Milestones</p>
                            <p className="text-base font-bold text-foreground">{stats.completedMilestones}/{stats.totalMilestones}</p>
                        </div>
                    </div>
                    <div className="bg-white/98 dark:bg-gray-950/98 border border-border/60 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                        <div className={cn('p-1.5 rounded-lg', workflow.isOverdue ? 'bg-red-50' : 'bg-muted/50')}>
                            <Clock className={cn('h-4 w-4', workflow.isOverdue ? 'text-destructive' : 'text-muted-foreground')} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">{workflow.isOverdue ? 'Days Overdue' : 'Days Left'}</p>
                            <p className={cn('text-base font-bold', workflow.isOverdue ? 'text-destructive' : 'text-foreground')}>
                                {workflow.isOverdue
                                    ? `${workflow.daysOverdue ?? Math.abs(Math.ceil((new Date(workflow.endDate).getTime() - Date.now()) / 86400000))}d`
                                    : `${workflow.daysRemaining}d`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content — 2/3 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress card */}
                        <Card className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border-border/60 shadow-sm rounded-xl overflow-hidden">
                            <div
                                className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/40"
                                style={{ width: `${workflow.progress}%` }}
                            />
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-foreground">
                                    Project Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-muted-foreground">Overall Completion</span>
                                    <span className="text-sm font-semibold text-primary">{workflow.progress}%</span>
                                </div>
                                <Progress value={workflow.progress} className="h-2 bg-muted/50" />

                                <div className="grid grid-cols-3 gap-3 mt-6">
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center border border-green-100 dark:border-green-800/30">
                                        <p className="text-2xl font-bold text-green-600">{stats.completedMilestones}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
                                    </div>
                                    <div className="p-3 bg-primary/5 rounded-lg text-center border border-primary/10">
                                        <p className="text-2xl font-bold text-primary">{stats.paidMilestones}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Paid</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg text-center border border-border/60">
                                        <p className="text-2xl font-bold text-muted-foreground">{stats.totalMilestones - stats.paidMilestones}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Pending</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Project Milestones using shared MilestoneCard */}
                        <Card className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border-border/60 shadow-sm rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Project Milestones
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Mark milestones complete, download invoices, and manage documents
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {milestones && milestones.length > 0 ? (
                                    milestones.map((milestone) => (
                                        <MilestoneCard
                                            key={milestone.id}
                                            milestone={milestone as any}
                                            workflowId={id!}
                                            currency={workflow.currency || 'INR'}
                                            onPaymentInitiate={handlePaymentInitiate}
                                            onViewDetails={handleViewDetails}
                                            onMarkComplete={handleMarkComplete}
                                            onDownloadInvoice={handleDownloadInvoice}
                                            userType="vendor"
                                            isProcessing={processingMilestone === milestone.id}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center text-sm text-muted-foreground py-10">
                                        No milestones defined for this project
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* ===== PROJECT CLOSURE SECTION (left main column, full width) ===== */}
                        {/* Status banner when all milestones are done but closeout not yet started */}
                        {workflow.status === 'completed' && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-blue-800">All Milestones Complete</p>
                                    <p className="text-xs text-blue-700 mt-0.5">
                                        All deliverables have been approved by both parties.{' '}
                                        <span className="font-medium">{industry?.name || 'The client'}</span>
                                        {industry?.contact?.email && (
                                            <span> ({industry.contact.email})</span>
                                        )}{' '}
                                        will initiate the formal project closure. No action is required from you at this time.
                                    </p>
                                </div>
                            </div>
                        )}
                        {/* Banner when closure is in progress */}
                        {workflow.status === 'awaiting_closeout' && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-50 border border-primary-200">
                                <Info className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-primary-800">Project Closeout In Progress</p>
                                    <p className="text-xs text-primary-700 mt-0.5">
                                        The client has initiated the project closeout process. Please upload your required documents in the checklist below — only items assigned to <strong>Vendor</strong> or <strong>Both Parties</strong> require your upload. The client will verify each item and issue a completion certificate.
                                    </p>
                                </div>
                            </div>
                        )}
                        {/* Banner when project is formally closed */}
                        {workflow.status === 'closed' && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <CheckCircle2 className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">Project Closed</p>
                                    <p className="text-xs text-slate-500 mt-0.5">This project has been formally closed by the client.</p>
                                </div>
                            </div>
                        )}
                        {/* Closeout checklist — vendor can only upload Vendor / Both items */}
                        {closeoutData?.checklist?.length > 0 && (
                            <CloseoutChecklist
                                workflowId={id!}
                                items={closeoutData.checklist}
                                isIndustry={false}
                                uploadFn={uploadVendorCloseoutDocument}
                                getViewUrlFn={getVendorCloseoutDocumentViewUrl}
                                onRefresh={() =>
                                    getVendorCloseoutChecklist(id!)
                                        .then(r => { if (r.success) setCloseoutData(r.data); })
                                        .catch(() => { })
                                }
                            />
                        )}
                    </div>

                    {/* Sidebar — 1/3 */}
                    <div className="space-y-4">
                        {/* Earnings Summary */}
                        <Card className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border-border/60 shadow-sm rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                    <IndianRupee className="h-4 w-4 text-primary" />
                                    Earnings Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Contract</span>
                                    <span className="text-sm font-semibold">
                                        {formatCurrency(workflow.totalValue, workflow.currency)}
                                    </span>
                                </div>
                                <Separator className="bg-border/50" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Received</span>
                                    <span className="text-sm font-semibold text-green-600">
                                        {formatCurrency(stats.receivedAmount, workflow.currency)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Pending</span>
                                    <span className="text-sm font-semibold text-primary">
                                        {formatCurrency(stats.pendingAmount, workflow.currency)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border-border/60 shadow-sm rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Start Date</span>
                                    <span className="font-medium">{new Date(workflow.startDate).toLocaleDateString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">End Date</span>
                                    <span className="font-medium">{new Date(workflow.endDate).toLocaleDateString('en-IN')}</span>
                                </div>
                                <Separator className="bg-border/50" />
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Days Remaining</span>
                                    <span className={cn(
                                        'font-semibold',
                                        workflow.isOverdue ? 'text-destructive' : 'text-foreground'
                                    )}>
                                        {workflow.isOverdue
                                            ? `${workflow.daysOverdue ?? Math.abs(Math.ceil((new Date(workflow.endDate).getTime() - Date.now()) / 86400000))} days overdue`
                                            : `${workflow.daysRemaining} days`}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Client Details */}
                        <Card className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border-border/60 shadow-sm rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    Client Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="font-medium text-foreground text-sm">
                                    {industry?.name || linkedEntities?.purchaseOrder?.projectTitle || workflow.projectTitle}
                                </p>
                                {linkedEntities?.purchaseOrder?.poNumber && (
                                    <p className="text-xs text-muted-foreground">
                                        PO: {linkedEntities.purchaseOrder.poNumber}
                                    </p>
                                )}
                                {linkedEntities?.quotation?.quotationNumber && (
                                    <p className="text-xs text-muted-foreground">
                                        Quotation: {linkedEntities.quotation.quotationNumber}
                                    </p>
                                )}
                                {industry?.contact?.email && (
                                    <p className="text-xs text-primary mt-2">{industry.contact.email}</p>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>

            {/* Milestone Details Dialog */}
            {dialogMilestone && (
                <MilestoneDetailsDialog
                    open={isDetailsDialogOpen}
                    onClose={() => {
                        setIsDetailsDialogOpen(false);
                        setSelectedMilestoneId(null);
                    }}
                    onUploadSuccess={fetchWorkflowDetails}
                    milestone={dialogMilestone as any}
                    workflowId={id!}
                    currency={workflow.currency || 'INR'}
                    userType="vendor"
                    currentUserId=""
                />
            )}
        </div>
    );
};

export default VendorWorkflowDetails;
