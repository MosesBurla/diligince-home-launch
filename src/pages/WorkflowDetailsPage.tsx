import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Clock,
    FileText,
    Package,
    Receipt,
    Building2,
    CheckCircle2,
    AlertTriangle,
    ExternalLink,
    TrendingUp
} from 'lucide-react';
import { workflowService } from '@/services/modules/workflows';
import { TableSkeletonLoader } from '@/components/shared/loading';
import MilestoneCard from '@/components/workflow/MilestoneCard';
import MilestoneDetailsDialog from '@/components/workflow/MilestoneDetailsDialog';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useToast } from '@/hooks/use-toast';
import { getCloseoutChecklist, getIndustryCloseoutDocumentViewUrl } from '@/services/modules/workflows/workflow.service';
import { WorkflowClosureGate } from '@/components/industry/workflow/WorkflowClosureGate';
import { CloseoutChecklist } from '@/components/industry/workflow/CloseoutChecklist';
import { CompletionCertificateCard } from '@/components/industry/workflow/CompletionCertificateCard';

interface WorkflowDetailsPageProps { }

const WorkflowDetailsPage: React.FC<WorkflowDetailsPageProps> = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedMilestone, setSelectedMilestone] = useState<any | null>(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [closeoutData, setCloseoutData] = useState<any>(null);
    const { toast } = useToast();
    const { isLoaded, loadScript } = useRazorpay();

    const { data: response, isLoading, error, refetch } = useQuery({
        queryKey: ['workflow-details', id],
        queryFn: () => workflowService.getWorkflowDetails(id!),
        enabled: !!id,
        refetchOnMount: true
    });

    const workflow = response?.data.workflow;
    const linkedEntities = response?.data.linkedEntities;
    const stakeholder = response?.data.stakeholder;
    const milestones = response?.data.milestones;
    const stats = response?.data.stats;
    const events = response?.data.events;

    // Load Razorpay script on mount
    React.useEffect(() => {
        if (!isLoaded) {
            loadScript();
        }
    }, [isLoaded, loadScript]);

    // Fetch closeout gate / checklist whenever workflow data is available
    const fetchCloseoutData = async () => {
        if (!id) return;
        try {
            const res = await getCloseoutChecklist(id);
            if (res.success) setCloseoutData(res.data);
        } catch (err) {
            console.warn('[Closeout] Could not fetch closeout checklist:', err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCloseoutData();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Helmet>
                    <title>Loading Workflow... | Diligince.ai</title>
                </Helmet>
                <div className="container mx-auto px-4 py-8">
                    <TableSkeletonLoader rows={6} columns={2} showActions />
                </div>
            </div>
        );
    }

    if (error || !workflow) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Helmet>
                    <title>Workflow Not Found | Diligince.ai</title>
                </Helmet>
                <div className="container mx-auto px-4 py-16">
                    <Card className="max-w-md mx-auto text-center">
                        <CardContent className="pt-12 pb-8">
                            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Workflow Not Found</h2>
                            <p className="text-muted-foreground mb-6">
                                The workflow you're looking for doesn't exist or you don't have access to it.
                            </p>
                            <Button onClick={() => navigate('/dashboard/industry-workflows')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Workflows
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Payment handlers
    const handlePaymentInitiate = async (milestoneId: string) => {
        const milestone = milestones?.find((m: any) => m.id === milestoneId);
        if (!milestone) return;

        if (!isLoaded) {
            toast({
                title: 'Not Ready',
                description: 'Payment system is still loading. Please wait.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await workflowService.initiateMilestonePayment(id!, milestoneId);

            if (!response.success) {
                toast({
                    title: 'Error',
                    description: response.error?.message || 'Failed to initiate payment',
                    variant: 'destructive',
                });
                return;
            }

            const { razorpayKeyId, razorpayOrderId, amount, currency } = response.data;

            const options = {
                key: razorpayKeyId,
                amount,
                currency,
                order_id: razorpayOrderId,
                name: 'Diligince Platform',
                description: `Payment for: ${milestone.name}`,
                prefill: {
                    name: '',
                    email: ''
                },
                theme: {
                    color: '#153b60',
                },
                handler: async (razorpayResponse: any) => {
                    try {
                        await workflowService.verifyMilestonePayment(razorpayResponse);
                        toast({
                            title: 'Payment Successful',
                            description: 'Payment completed and invoice generated',
                        });
                        refetch();
                    } catch (error: any) {
                        toast({
                            title: 'Verification Failed',
                            description: error?.response?.data?.error?.message || 'Failed to verify payment',
                            variant: 'destructive',
                        });
                    }
                },
                modal: {
                    ondismiss: () => {
                        console.log('Payment modal dismissed');
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);

            rzp.on('payment.failed', (response: any) => {
                toast({
                    title: 'Payment Failed',
                    description: response.error?.description || 'Payment was unsuccessful',
                    variant: 'destructive',
                });
            });

            rzp.open();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.error?.message || 'Failed to initiate payment',
                variant: 'destructive',
            });
        }
    };

    const handleViewDetails = (milestoneId: string) => {
        const milestone = milestones?.find((m: any) => m.id === milestoneId);
        if (milestone) {
            setSelectedMilestone(milestone);
            setIsDetailsDialogOpen(true);
        }
    };

    const handleMarkComplete = async (milestoneId: string) => {
        try {
            await workflowService.markMilestoneComplete(id!, milestoneId);
            toast({
                title: 'Success',
                description: 'Milestone marked as complete',
            });
            refetch();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.error?.message || 'Failed to mark milestone complete',
                variant: 'destructive',
            });
        }
    };

    const handleDownloadInvoice = (invoiceUrl: string) => {
        window.open(invoiceUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>{workflow.workflowId} - Workflow Details | Diligince.ai</title>
            </Helmet>

            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/dashboard/industry-workflows')}
                        className="mb-4 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Workflows
                    </Button>

                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{workflow.workflowId}</h1>
                            <p className="text-lg text-muted-foreground mt-1 max-w-3xl">
                                {workflow.projectTitle}
                            </p>
                        </div>
                        <Badge
                            variant={workflow.status === 'active' ? 'default' : 'secondary'}
                            className="text-sm px-4 py-1.5"
                        >
                            {workflow.status.toUpperCase()}
                        </Badge>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Progress</p>
                                        <p className="text-2xl font-bold text-gray-900">{workflow.progress}%</p>
                                        <Progress value={workflow.progress} className="mt-2 h-2" />
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Value</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {workflow.currency} {workflow.totalValue.toLocaleString()}
                                        </p>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">
                                            {workflow.isOverdue ? 'Days Overdue' : 'Days Left'}
                                        </p>
                                        <p className={`text-2xl font-bold ${workflow.isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                            {workflow.isOverdue
                                                ? `${workflow.daysOverdue ?? Math.abs(Math.ceil((new Date(workflow.endDate).getTime() - Date.now()) / 86400000))} days`
                                                : `${workflow.daysRemaining} days`}
                                        </p>
                                    </div>
                                    <Clock className={`h-8 w-8 ${workflow.isOverdue ? 'text-red-500' : 'text-orange-500'}`} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Milestones</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.completedMilestones} / {stats.totalMilestones}
                                        </p>
                                    </div>
                                    <CheckCircle2 className="h-8 w-8 text-purple-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Tabs Content */}
            <div className="container mx-auto px-4 py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="milestones">
                            Milestones
                            {stats.pendingMilestones > 0 && (
                                <Badge variant="secondary" className="ml-2">{stats.pendingMilestones}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Project Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5" />
                                        Project Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Workflow ID</p>
                                            <p className="text-sm font-semibold mt-1">{workflow.workflowId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                                            <Badge className="mt-1" variant="outline">{workflow.status}</Badge>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                                            <p className="text-sm mt-1 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                {new Date(workflow.startDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">End Date</p>
                                            <p className="text-sm mt-1 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                {new Date(workflow.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {stakeholder?.name && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Vendor/Partner</p>
                                                <p className="text-sm font-semibold mt-1">{stakeholder.name}</p>
                                                {stakeholder.type && (
                                                    <p className="text-xs text-muted-foreground mt-0.5">{stakeholder.type}</p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Related Documents */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Related Documents
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {linkedEntities?.requirement && (
                                        <Link
                                            to={`/dashboard/requirements/${linkedEntities.requirement._id}`}
                                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Requirement Details</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {linkedEntities.requirement.title || 'View Requirement'}
                                                    </p>
                                                </div>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        </Link>
                                    )}

                                    {linkedEntities?.quotation && (
                                        <Link
                                            to={`/dashboard/quotations/${linkedEntities.quotation._id}`}
                                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition">
                                                    <Receipt className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Quotation Details</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {linkedEntities.quotation.quotationNumber || 'View Quotation'}
                                                    </p>
                                                </div>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        </Link>
                                    )}

                                    {linkedEntities?.purchaseOrder && (
                                        <Link
                                            to={`/dashboard/purchase-orders/${linkedEntities.purchaseOrder._id}`}
                                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition">
                                                    <Package className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Purchase Order</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {linkedEntities.purchaseOrder.poNumber || 'View PO'}
                                                    </p>
                                                </div>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        </Link>
                                    )}

                                    {!linkedEntities?.requirement && !linkedEntities?.quotation && !linkedEntities?.purchaseOrder && (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            No linked documents available
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Payment Summary */}
                        {stats && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Payment Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Paid</p>
                                            <p className="text-2xl font-bold text-green-600 mt-1">
                                                {workflow.currency} {stats.paidAmount?.toLocaleString() || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Remaining</p>
                                            <p className="text-2xl font-bold text-orange-600 mt-1">
                                                {workflow.currency} {stats.remainingAmount?.toLocaleString() || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Paid Milestones</p>
                                            <p className="text-2xl font-bold mt-1">{stats.paidMilestones}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Pending Milestones</p>
                                            <p className="text-2xl font-bold mt-1">{stats.pendingMilestones}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ===== PROJECT CLOSURE SECTION ===== */}
                        {closeoutData && (
                            <>
                                <WorkflowClosureGate
                                    workflowId={id!}
                                    workflowStatus={workflow.status}
                                    gate={closeoutData.gate}
                                    hasRetention={!!closeoutData.retentionPayment}
                                    onStatusChange={() => { refetch(); fetchCloseoutData(); }}
                                />

                                {workflow.status === 'awaiting_closeout' && (
                                    <>
                                        <CloseoutChecklist
                                            workflowId={id!}
                                            items={closeoutData.checklist || []}
                                            isIndustry
                                            getViewUrlFn={getIndustryCloseoutDocumentViewUrl}
                                            onRefresh={fetchCloseoutData}
                                        />
                                        <CompletionCertificateCard
                                            workflowId={id!}
                                            certificate={closeoutData.certificate}
                                            allItemsVerified={(closeoutData.checklist || []).every((i: any) => i.verified)}
                                            onCertificateIssued={fetchCloseoutData}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </TabsContent>

                    {/* Milestones Tab */}
                    <TabsContent value="milestones">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Milestones</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Track payment and completion status for each milestone
                                </p>
                            </CardHeader>
                            <CardContent>
                                {milestones && milestones.length > 0 ? (
                                    <div className="space-y-4">
                                        {milestones.map((milestone: any, index: number) => (
                                            <MilestoneCard
                                                key={milestone.id || index}
                                                milestone={milestone}
                                                workflowId={id!}
                                                currency={workflow.currency || 'INR'}
                                                onPaymentInitiate={handlePaymentInitiate}
                                                onViewDetails={handleViewDetails}
                                                onMarkComplete={handleMarkComplete}
                                                onDownloadInvoice={handleDownloadInvoice}
                                                userType="industry"
                                                isProcessing={false}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-12">
                                        No milestones defined for this workflow
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Milestone Details Dialog */}
                        {selectedMilestone && (
                            <MilestoneDetailsDialog
                                open={isDetailsDialogOpen}
                                onClose={() => {
                                    setIsDetailsDialogOpen(false);
                                    setSelectedMilestone(null);
                                }}
                                milestone={selectedMilestone}
                                workflowId={id!}
                                currency={workflow.currency || 'INR'}
                                userType="industry"
                                currentUserId="" // TODO: Get from auth context
                            />
                        )}
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Timeline</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Recent events and updates for this workflow
                                </p>
                            </CardHeader>
                            <CardContent>
                                {events && events.length > 0 ? (
                                    <div className="space-y-4">
                                        {events.map((event: any, index: number) => (
                                            <div key={event.id || index} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                                    {index !== events.length - 1 && (
                                                        <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <p className="font-medium">{event.description}</p>
                                                    {event.performedBy?.name && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            by {event.performedBy.name}
                                                        </p>
                                                    )}
                                                    {event.timestamp && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {new Date(event.timestamp).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-12">
                                        No activity recorded yet
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default WorkflowDetailsPage;
