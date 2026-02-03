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
    CheckCircle,
    DollarSign,
    FileText,
    Upload,
    Download,
    AlertTriangle,
    Loader2,
    CreditCard,
    IndianRupee,
    Building2
} from 'lucide-react';

import {
    getIndustryWorkflowDetails,
    initiateMilestonePayment,
    verifyMilestonePayment,
    openRazorpayCheckout,
    formatCurrency,
    getMilestoneStatusColor,
    uploadPaymentReceipt,
    downloadPaymentReceipt,
    type WorkflowDetail,
    type WorkflowMilestone
} from '@/services/modules/workflows';

interface MilestoneCardProps {
    milestone: WorkflowMilestone;
    workflowId: string;
    currency: string;
    razorpayLoaded: boolean;
    onPaymentComplete: () => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({
    milestone,
    workflowId,
    currency,
    razorpayLoaded,
    onPaymentComplete
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handlePayNow = async () => {
        try {
            setIsProcessing(true);

            // Initiate payment to get Razorpay order
            const response = await initiateMilestonePayment(workflowId, milestone.id);

            if (!response.success) {
                throw new Error('Failed to initiate payment');
            }

            // Open Razorpay checkout
            openRazorpayCheckout(
                response.data,
                async (paymentResult) => {
                    try {
                        // Verify payment
                        const verifyResponse = await verifyMilestonePayment({
                            razorpayOrderId: paymentResult.razorpay_order_id,
                            razorpayPaymentId: paymentResult.razorpay_payment_id,
                            razorpaySignature: paymentResult.razorpay_signature
                        });

                        if (verifyResponse.success) {
                            toast.success('Payment completed! Receipt generated.');
                            onPaymentComplete();
                        }
                    } catch (error) {
                        toast.error('Payment verification failed');
                        console.error(error);
                    } finally {
                        setIsProcessing(false);
                    }
                },
                (error) => {
                    setIsProcessing(false);
                    if (error?.message !== 'Payment was cancelled') {
                        toast.error('Payment failed');
                    }
                }
            );
        } catch (error) {
            setIsProcessing(false);
            toast.error('Failed to initiate payment');
            console.error(error);
        }
    };

    const handleUploadReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const response = await uploadPaymentReceipt(milestone.payment?.paymentId || '', file);

            if (response.success) {
                toast.success('Receipt uploaded! Vendor can now verify.');
                onPaymentComplete();
            }
        } catch (error) {
            toast.error('Failed to upload receipt');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownloadReceipt = async () => {
        try {
            if (!milestone.payment?.paymentId) return;

            const blob = await downloadPaymentReceipt(milestone.payment.paymentId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `receipt-${milestone.payment.receipt?.receiptNumber || 'payment'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error('Failed to download receipt');
            console.error(error);
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

            {/* Action buttons based on status */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
                {milestone.status === 'pending' && (
                    <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                        onClick={handlePayNow}
                        disabled={isProcessing || !razorpayLoaded}
                    >
                        {isProcessing ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <CreditCard className="h-4 w-4 mr-2" />
                        )}
                        Pay Now
                    </Button>
                )}

                {milestone.status === 'paid' && !milestone.payment?.uploadedReceipt && (
                    <>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-border/80 hover:bg-muted/50"
                            onClick={() => document.getElementById(`receipt-upload-${milestone.id}`)?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Upload className="h-4 w-4 mr-2" />
                            )}
                            Upload Receipt for Vendor
                        </Button>
                        <input
                            id={`receipt-upload-${milestone.id}`}
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={handleUploadReceipt}
                        />
                    </>
                )}

                {milestone.payment?.receipt && (
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-border/80 hover:bg-muted/50"
                        onClick={handleDownloadReceipt}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                    </Button>
                )}

                {milestone.status === 'completed' && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Verified by vendor
                    </span>
                )}

                {milestone.payment?.uploadedReceipt && !milestone.payment.vendorVerification?.verified && (
                    <span className="text-sm text-yellow-600 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Awaiting vendor verification
                    </span>
                )}
            </div>
        </div>
    );
};

const IndustryWorkflowDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [workflowData, setWorkflowData] = useState<WorkflowDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    // Load Razorpay script
    useEffect(() => {
        const loadRazorpay = () => {
            if ((window as any).Razorpay) {
                setRazorpayLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setRazorpayLoaded(true);
            script.onerror = () => console.error('Failed to load Razorpay script');
            document.body.appendChild(script);
        };

        loadRazorpay();
    }, []);

    const fetchWorkflowDetails = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            setError(null);
            const response = await getIndustryWorkflowDetails(id);
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
                    <p className="text-sm text-muted-foreground">Loading workflow details...</p>
                </div>
            </div>
        );
    }

    if (error || !workflowData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border border-border/60 rounded-xl p-8 text-center max-w-md shadow-sm">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-foreground mb-2">Workflow Not Found</h2>
                    <p className="text-sm text-muted-foreground mb-6">{error || 'Unable to load workflow details'}</p>
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
                <title>{workflow.projectTitle} | Workflow | Diligence</title>
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
                        Back to Workflows
                    </Button>

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                {workflow.projectTitle}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Workflow ID: <span className="font-mono">{workflow.workflowId}</span>
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
                                    Payment Milestones
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {milestones.map((milestone) => (
                                    <MilestoneCard
                                        key={milestone.id}
                                        milestone={milestone}
                                        workflowId={workflow.id}
                                        currency={workflow.currency}
                                        razorpayLoaded={razorpayLoaded}
                                        onPaymentComplete={fetchWorkflowDetails}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Financial summary */}
                        <Card className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border-border/60 shadow-sm rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                    <IndianRupee className="h-4 w-4 text-primary" />
                                    Financial Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Value</span>
                                    <span className="text-sm font-semibold">
                                        {formatCurrency(workflow.totalValue, workflow.currency)}
                                    </span>
                                </div>
                                <Separator className="bg-border/50" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Paid</span>
                                    <span className="text-sm font-semibold text-green-600">
                                        {formatCurrency(stats.paidAmount, workflow.currency)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Remaining</span>
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

                        {/* Vendor info */}
                        <Card className="bg-white/98 dark:bg-gray-950/98 backdrop-blur-xl border-border/60 shadow-sm rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    Vendor Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium text-foreground">{stakeholder.name}</p>
                                <p className="text-sm text-muted-foreground capitalize mt-1">{stakeholder.type}</p>
                                {stakeholder.contact?.email && (
                                    <p className="text-sm text-primary mt-2">{stakeholder.contact.email}</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default IndustryWorkflowDetails;
