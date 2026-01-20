import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    X,
    CheckCircle,
    Download,
    Building,
    Star,
    Calendar,
    Clock,
    DollarSign,
    Truck,
    FileText,
    ExternalLink,
} from "lucide-react";
import { ApproveQuotationModal } from "@/components/quotation/ApproveQuotationModal";
import { quotationService } from "@/services/quotation.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface QuotationSummary {
    id: string;
    quotationNumber: string;
    vendorId: string;
    vendorName: string;
    vendorRating: number;
    requirementTitle: string;
    requirementId: string;
    quotedAmount: number;
    currency: string;
    validUntil: string;
    submittedDate: string;
    status: string;
    deliveryTimeWeeks: number;
    paymentTerms: string;
    proposalSummary?: string;
    responseTime?: string;
}

interface QuotationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    quotation: QuotationSummary | null;
    onAcceptSuccess?: () => void;
}

export const QuotationDetailModal: React.FC<QuotationDetailModalProps> = ({
    isOpen,
    onClose,
    quotation,
    onAcceptSuccess,
}) => {
    const navigate = useNavigate();
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    if (!quotation) return null;

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending_review: "bg-yellow-100 text-yellow-800",
            submitted: "bg-yellow-100 text-yellow-800",
            under_evaluation: "bg-blue-100 text-blue-800",
            under_review: "bg-blue-100 text-blue-800",
            awaiting_clarification: "bg-purple-100 text-purple-800",
            approved: "bg-green-100 text-green-800",
            accepted: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            expired: "bg-gray-100 text-gray-800",
            withdrawn: "bg-gray-100 text-gray-800",
            draft: "bg-gray-100 text-gray-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number, currency: string = "INR") => {
        return `${currency} ${amount.toLocaleString()}`;
    };

    const canAccept =
        quotation.status === "pending_review" ||
        quotation.status === "submitted" ||
        quotation.status === "under_evaluation" ||
        quotation.status === "under_review";

    const handleApprove = async (
        comments?: string,
        notifyVendor?: boolean,
        createPO?: boolean
    ) => {
        try {
            await quotationService.approve(quotation.id, {
                comments,
                notifyVendor,
                createPurchaseOrder: createPO,
            } as any);
            toast.success("Quotation approved successfully");
            setShowApproveModal(false);
            onAcceptSuccess?.();
            onClose();
        } catch (error) {
            toast.error("Failed to approve quotation");
            console.error(error);
        }
    };

    const handleExportPDF = async () => {
        try {
            setIsExporting(true);
            // Open in new tab for PDF export via browser print
            toast.info("Opening quotation details for PDF export");
            window.open(`/dashboard/quotations/${quotation.id}`, "_blank");
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Failed to export PDF");
        } finally {
            setIsExporting(false);
        }
    };

    const handleViewFullDetails = () => {
        navigate(`/dashboard/quotations/${quotation.id}`);
        onClose();
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold">
                                Quotation {quotation.quotationNumber}
                            </DialogTitle>
                            <Badge className={getStatusColor(quotation.status)}>
                                {quotation.status.replace(/_/g, " ")}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Vendor Info */}
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Building className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">{quotation.vendorName}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                        <span>{quotation.vendorRating?.toFixed(1) || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary">
                                    {formatCurrency(quotation.quotedAmount, quotation.currency)}
                                </p>
                            </div>
                        </div>

                        {/* Requirement */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">
                                For Requirement
                            </p>
                            <p className="font-medium">{quotation.requirementTitle}</p>
                        </div>

                        <Separator />

                        {/* Key Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Submitted</p>
                                    <p className="font-medium">
                                        {formatDate(quotation.submittedDate)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Valid Until</p>
                                    <p className="font-medium">
                                        {formatDate(quotation.validUntil)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Delivery Time</p>
                                    <p className="font-medium">
                                        {quotation.deliveryTimeWeeks} weeks
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Payment Terms</p>
                                    <p className="font-medium">{quotation.paymentTerms}</p>
                                </div>
                            </div>
                        </div>

                        {/* Proposal Summary */}
                        {quotation.proposalSummary && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Proposal Summary
                                    </p>
                                    <p className="text-sm">{quotation.proposalSummary}</p>
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="ghost"
                            onClick={handleViewFullDetails}
                            className="sm:mr-auto"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Full Details
                        </Button>

                        <Button variant="outline" onClick={onClose}>
                            <X className="h-4 w-4 mr-2" />
                            Close
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleExportPDF}
                            disabled={isExporting}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {isExporting ? "Exporting..." : "Export PDF"}
                        </Button>

                        {canAccept && (
                            <Button onClick={() => setShowApproveModal(true)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Approve Modal */}
            <ApproveQuotationModal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onApprove={handleApprove}
                quotationNumber={quotation.quotationNumber}
                vendorName={quotation.vendorName}
            />
        </>
    );
};

export default QuotationDetailModal;
