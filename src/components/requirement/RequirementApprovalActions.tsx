import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle } from "lucide-react";
import { approvalsService } from "@/services/modules/approvals/approvals.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RequirementApprovalActionsProps {
    requirementId: string;
    onActionComplete?: () => void;
}

export const RequirementApprovalActions: React.FC<RequirementApprovalActionsProps> = ({
    requirementId,
    onActionComplete
}) => {
    const navigate = useNavigate();
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectComments, setRejectComments] = useState("");
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            const response = await approvalsService.approve(requirementId);
            if (response.success) {
                toast.success("Requirement approved successfully");
                if (onActionComplete) {
                    onActionComplete();
                } else {
                    navigate('/dashboard/requirements/pending'); // Redirect to pending list
                }
            } else {
                toast.error(response.message || "Failed to approve requirement");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred while approving");
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setIsRejecting(true);
        try {
            const response = await approvalsService.reject(requirementId, {
                reason: rejectReason,
                comments: rejectComments,
                allowResubmission: true
            });

            if (response.success) {
                toast.success("Requirement rejected");
                setIsRejectDialogOpen(false);
                if (onActionComplete) {
                    onActionComplete();
                } else {
                    navigate('/dashboard/requirements/pending');
                }
            } else {
                toast.error(response.message || "Failed to reject requirement");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred while rejecting");
        } finally {
            setIsRejecting(false);
        }
    };

    return (
        <div className="flex items-center gap-3 w-full justify-end">
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                        <X className="h-4 w-4" />
                        Reject
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reject Requirement</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this requirement. The creator will be notified.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reason for Rejection *</Label>
                            <Textarea
                                id="reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="E.g., Budget exceeds limit, Technical specs unclear..."
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="comments">Additional Comments (Optional)</Label>
                            <Textarea
                                id="comments"
                                value={rejectComments}
                                onChange={(e) => setRejectComments(e.target.value)}
                                placeholder="Any constructive feedback..."
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={isRejecting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
                            {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                onClick={handleApprove}
                disabled={isApproving}
            >
                <Check className="h-4 w-4" />
                {isApproving ? "Approving..." : "Approve"}
            </Button>
        </div>
    );
};
