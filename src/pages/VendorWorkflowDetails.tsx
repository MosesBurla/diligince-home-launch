import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    Calendar,
    Clock,
    CheckCircle,
    DollarSign,
    FileText,
    Download,
    AlertTriangle,
    Loader2,
    IndianRupee,
    Building2
} from 'lucide-react';

import {
    getVendorWorkflowDetails,
    markMilestoneComplete,
    formatCurrency,
    getMilestoneStatusColor,
    type WorkflowDetail,
    type WorkflowMilestone
} from '@/services/modules/workflows';

interface VendorMilestoneCardProps {
    milestone: WorkflowMilestone;
    workflowId: string;
    currency: string;
    onMilestoneUpdate: () => void;
}

const VendorMilestoneCard: React.FC<VendorMilestoneCardProps> = ({
    milestone,
    workflowId,
    currency,
    onMilestoneUpdate
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [notes, setNotes] = useState('');
    const [showNotes, setShowNotes] = useState(false);

    const handleMarkComplete = async () => {
        try {
            setIsProcessing(true);
            const response = await markMilestoneComplete(workflowId, milestone.id, { notes });

            if (response.success) {
                toast.success('Milestone marked as complete!');
                onMilestoneUpdate();
                setShowNotes(false);
                setNotes('');
            }
        } catch (error) {
            toast.error('Failed to mark milestone complete');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getMilestoneIcon = () => {
        switch (milestone.status) {
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'paid':
                return <DollarSign className="h-5 w-5 text-primary" />;
            case 'payment_pending':
                return <Clock className="h-5 w-5 text-yellow-600" />;
            default:
                return <Clock className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const getStatusBorderColor = () => {
        switch (milestone.status) {
            case 'completed':
                return 'border-t-green-500';
            case 'paid':
                return 'border-t-primary';
            case 'payment_pending':
                return 'border-t-yellow-500';
            default:
                return 'border-t-muted';
        }
    };

    const canMarkComplete = milestone.status === 'paid' && milestone.payment?.uploadedReceipt;

    return (
        <div className={cn(
            "relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-border/60 rounded-xl p-5 hover:border-primary/30 transition-all duration-200 shadow-sm",
            "border-t-2",
            getStatusBorderColor()
        )}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className={cn(
                        "p-2 rounded-lg",
                        milestone.status === 'completed' && 'bg-green-50 dark:bg-green-900/20',
                        milestone.status === 'paid' && 'bg-primary/10',
                        milestone.status === 'payment_pending' && 'bg-yellow-50 dark:bg-yellow-900/20',
                        milestone.status === 'pending' && 'bg-muted'
                    )}>
                        {getMilestoneIcon()}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                            {milestone.name || milestone.description}
                        </h4>
                        {milestone.name && milestone.description !== milestone.name && (
                            <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Due: {new Date(milestone.dueDate).toLocaleDateString('en-IN')}
                            </span>
                            <span className="flex items-center gap-1">
                                <IndianRupee className="h-3.5 w-3.5" />
                                {formatCurrency(milestone.amount, currency)}
                            </span>
                            <span className="text-muted-foreground/70">({milestone.percentage}%)</span>
                        </div>
                    </div>
                </div>
                <Badge className={cn(
                    "text-xs font-medium",
                    milestone.status === 'completed' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200',
                    milestone.status === 'paid' && 'bg-primary/10 text-primary border-primary/20',
                    milestone.status === 'payment_pending' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200',
                    milestone.status === 'pending' && 'bg-muted text-muted-foreground border-border'
                )}>
                    {milestone.status.replace('_', ' ').toUpperCase()}
                </Badge>
            </div>

            {/* Payment info */}
            {milestone.payment && (
                <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/40">
                    <div className="flex items-center gap-2 text-sm">
                        {milestone.payment.status === 'paid' && (
                            <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-green-700 dark:text-green-400">
                                    Payment received on {new Date(milestone.payment.paidAt || '').toLocaleDateString('en-IN')}
                                </span>
                            </>
                        )}
                        {milestone.payment.uploadedReceipt && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="ml-auto h-7 text-xs hover:bg-muted/50"
                                onClick={() => window.open(milestone.payment?.uploadedReceipt?.url, '_blank')}
                            >
                                <Download className="h-3 w-3 mr-1" />
                                View Receipt
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="mt-4 flex flex-col gap-3">
                {/* Can mark complete when payment is made and receipt uploaded */}
                {canMarkComplete && !showNotes && (
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white shadow-sm w-fit"
                        onClick={() => setShowNotes(true)}
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify & Mark Complete
                    </Button>
                )}

                {showNotes && (
                    <div className="space-y-3 bg-muted/20 p-4 rounded-lg border border-border/40">
                        <Textarea
                            placeholder="Add completion notes (optional)..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className="text-sm bg-background/50 border-border/60 focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                onClick={handleMarkComplete}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Confirm Complete
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-border/80 hover:bg-muted/50"
                                onClick={() => {
                                    setShowNotes(false);
                                    setNotes('');
                                }}
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {milestone.status === 'completed' && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Completed on {milestone.completedAt ?
                            new Date(milestone.completedAt).toLocaleDateString('en-IN') : ''}
                    </span>
                )}

                {milestone.status === 'pending' && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Awaiting payment from buyer
                    </span>
                )}

                {milestone.status === 'paid' && !milestone.payment?.uploadedReceipt && (
                    <span className="text-sm text-yellow-600 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Payment received - awaiting receipt upload from buyer
                    </span>
                )}
            </div>
        </div>
    );
};

const VendorWorkflowDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [workflowData, setWorkflowData] = useState<WorkflowDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkflowDetails = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            setError(null);
            const response = await getVendorWorkflowDetails(id);
            if (response.success) {
                setWorkflowData(response.data);
            } else {
                setError('Failed to load workflow details');
            }
        } catch (err) {
            setError('Failed to load workflow details');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkflowDetails();
    }, [id]);

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

    const { workflow, linkedEntities, stakeholder, milestones, stats } = workflowData;

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>{workflow.projectTitle} | Project | Diligence</title>
            </Helmet>

            <main className="container mx-auto px-4 py-8 pt-20">
                {/* Header */}
                <div className="mb-8">
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
                        <Badge className={cn(
                            "text-xs font-medium px-3 py-1",
                            workflow.status === 'completed' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                            workflow.status === 'active' && 'bg-primary/10 text-primary',
                            workflow.status === 'paused' && 'bg-yellow-100 text-yellow-700',
                            workflow.status === 'cancelled' && 'bg-red-100 text-red-700'
                        )}>
                            {workflow.status.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress card */}
                        <Card className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border-border/60 shadow-sm rounded-xl overflow-hidden">
                            {/* Progress header with gradient accent */}
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
                                        <p className="text-2xl font-bold text-muted-foreground">{stats.pendingMilestones}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Pending</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Milestones */}
                        <Card className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border-border/60 shadow-sm rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Project Milestones
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {milestones.map((milestone) => (
                                    <VendorMilestoneCard
                                        key={milestone.id}
                                        milestone={milestone}
                                        workflowId={workflow.id}
                                        currency={workflow.currency}
                                        onMilestoneUpdate={fetchWorkflowDetails}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Earnings summary */}
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
                                        {formatCurrency(stats.paidAmount, workflow.currency)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Pending</span>
                                    <span className="text-sm font-semibold text-primary">
                                        {formatCurrency(stats.remainingAmount, workflow.currency)}
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
                                        "font-semibold",
                                        workflow.isOverdue ? 'text-destructive' : 'text-foreground'
                                    )}>
                                        {workflow.isOverdue ? 'Overdue' : `${workflow.daysRemaining} days`}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Client info */}
                        <Card className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border-border/60 shadow-sm rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    Client Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium text-foreground">{linkedEntities.purchaseOrder?.projectTitle || stakeholder.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    PO: {linkedEntities.purchaseOrder?.poNumber || 'N/A'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VendorWorkflowDetails;
