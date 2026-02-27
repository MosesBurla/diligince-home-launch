import React from 'react';
import { Download, FileText, CheckCircle2, Circle, Clock, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Milestone {
    id: string;
    name: string;
    description?: string;
    amount: number;
    percentage: number;
    status: 'pending' | 'in_progress' | 'payment_pending' | 'paid' | 'completed';
    dueDate?: string;
    completionStatus?: {
        industryMarkedComplete: {
            status: boolean;
            markedAt?: string;
            markedBy?: string;
        };
        vendorMarkedComplete: {
            status: boolean;
            markedAt?: string;
            markedBy?: string;
        };
        fullyCompleted: boolean;
        completedAt?: string;
    };
    invoiceUrl?: string;
    invoiceNumber?: string;
}

interface MilestoneCardProps {
    milestone: Milestone;
    workflowId: string;
    currency: string;
    onPaymentInitiate: (milestoneId: string) => void;
    onViewDetails: (milestoneId: string) => void;
    onMarkComplete: (milestoneId: string) => void;
    onDownloadInvoice?: (invoiceUrl: string) => void;
    userType: 'industry' | 'vendor';
    isProcessing?: boolean;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
    milestone,
    workflowId,
    currency,
    onPaymentInitiate,
    onViewDetails,
    onMarkComplete,
    onDownloadInvoice,
    userType,
    isProcessing = false
}) => {
    const getStatusBadge = () => {
        const statusConfig: Record<string, { variant: 'outline' | 'secondary' | 'default'; className: string; label: string }> = {
            pending: { variant: 'outline' as const, className: 'bg-gray-50', label: 'Pending' },
            payment_pending: { variant: 'secondary' as const, className: 'bg-amber-50 text-amber-700', label: 'Payment Pending' },
            in_progress: { variant: 'secondary' as const, className: 'bg-blue-50 text-blue-700', label: 'In Progress' },
            paid: { variant: 'secondary' as const, className: 'bg-green-50 text-green-700', label: 'Paid' },
            completed: { variant: 'default' as const, className: 'bg-green-600', label: 'Completed' }
        };

        const config = statusConfig[milestone.status] || statusConfig.pending;
        return (
            <Badge variant={config.variant} className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const canPay = ['pending', 'in_progress', 'payment_pending'].includes(milestone.status) && userType === 'industry' && milestone.amount > 0;
    const canDownloadInvoice = ['paid', 'completed'].includes(milestone.status) && milestone.invoiceUrl;
    const canMarkComplete = milestone.status === 'paid' && !milestone.completionStatus?.fullyCompleted;

    const isIndustryComplete = milestone.completionStatus?.industryMarkedComplete?.status || false;
    const isVendorComplete = milestone.completionStatus?.vendorMarkedComplete?.status || false;
    const currentUserComplete = userType === 'industry' ? isIndustryComplete : isVendorComplete;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{milestone.name}</h3>
                            {getStatusBadge()}
                        </div>
                        {milestone.description && (
                            <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Milestone Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground mb-1">Amount</p>
                        <p className="font-semibold text-lg">
                            {currency} {milestone.amount.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1">Progress</p>
                        <p className="font-semibold text-lg">{milestone.percentage}%</p>
                    </div>
                    {milestone.dueDate && (() => {
                        const due = new Date(milestone.dueDate);
                        const now = new Date();
                        const isNotDone = !['completed'].includes(milestone.status);
                        const overdueDays = isNotDone ? Math.ceil((now.getTime() - due.getTime()) / 86400000) : 0;
                        const isOverdue = overdueDays > 0;
                        return (
                            <div>
                                <p className="text-muted-foreground mb-1">Due Date</p>
                                <p className={`font-semibold ${isOverdue ? 'text-destructive' : ''}`}>
                                    {due.toLocaleDateString()}
                                </p>
                                {isOverdue && (
                                    <p className="text-xs text-destructive font-medium mt-0.5">
                                        {overdueDays} day{overdueDays !== 1 ? 's' : ''} overdue
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </div>

                {/* Completion Status */}
                {canMarkComplete && (
                    <div className="pt-3 border-t">
                        <p className="text-sm font-medium mb-2">Completion Status</p>
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                {isIndustryComplete ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                    <Circle className="h-4 w-4 text-gray-300" />
                                )}
                                <span className={isIndustryComplete ? 'text-green-700 font-medium' : 'text-muted-foreground'}>
                                    Industry Approved
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {isVendorComplete ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                    <Circle className="h-4 w-4 text-gray-300" />
                                )}
                                <span className={isVendorComplete ? 'text-green-700 font-medium' : 'text-muted-foreground'}>
                                    Vendor Approved
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-3 border-t">
                    {canPay && (
                        <Button
                            onClick={() => onPaymentInitiate(milestone.id)}
                            disabled={isProcessing}
                            className="flex items-center gap-2 bg-[#153b60] hover:bg-[#1e4976] text-white"
                        >
                            <CreditCard className="h-4 w-4" />
                            Pay Now
                        </Button>
                    )}

                    <Button
                        onClick={() => onViewDetails(milestone.id)}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        View Details
                    </Button>

                    {canDownloadInvoice && onDownloadInvoice && (
                        <Button
                            onClick={() => onDownloadInvoice(milestone.invoiceUrl!)}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Download Invoice
                        </Button>
                    )}

                    {canMarkComplete && !currentUserComplete && (
                        <Button
                            onClick={() => onMarkComplete(milestone.id)}
                            disabled={isProcessing}
                            className="flex items-center gap-2 ml-auto bg-[#153b60] hover:bg-[#1e4976] text-white"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Mark as Complete
                        </Button>
                    )}

                    {canMarkComplete && currentUserComplete && (
                        <div className="flex items-center gap-2 ml-auto text-sm text-green-700 font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            You marked this complete
                        </div>
                    )}
                </div>

                {/* Invoice Number */}
                {milestone.invoiceNumber && (
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                        Invoice: {milestone.invoiceNumber}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MilestoneCard;
