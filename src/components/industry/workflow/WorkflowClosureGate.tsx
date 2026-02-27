import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    CheckCircle2, XCircle, Lock, ChevronDown, ChevronUp,
    FlagTriangleRight, Loader2, AlertCircle
} from 'lucide-react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { initiateCloseout, closeWorkflow, releaseRetention } from '@/services/modules/workflows/workflow.service';
import { toast } from 'sonner';

interface Gate {
    allMilestonesComplete: boolean;
    allPaymentsPaid: boolean;
    retentionReleased: boolean;
    certificateIssued: boolean;
    readyToClose: boolean;
}

interface WorkflowClosureGateProps {
    workflowId: string;
    workflowStatus: string;
    gate: Gate;
    hasRetention: boolean;
    onStatusChange: () => void;
}

const GateRow: React.FC<{ label: string; passed: boolean; optional?: boolean }> = ({ label, passed, optional }) => (
    <div className="flex items-center gap-2 py-1.5">
        {passed ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
        ) : (
            <XCircle className={`h-4 w-4 shrink-0 ${optional ? 'text-gray-300' : 'text-gray-300'}`} />
        )}
        <span className={`text-sm ${passed ? 'text-gray-800' : 'text-gray-500'}`}>{label}</span>
        {optional && !passed && (
            <Badge variant="outline" className="text-xs text-gray-400 border-gray-200 ml-auto">optional</Badge>
        )}
    </div>
);

export const WorkflowClosureGate: React.FC<WorkflowClosureGateProps> = ({
    workflowId, workflowStatus, gate, hasRetention, onStatusChange
}) => {
    const [expanded, setExpanded] = useState(true);
    const [closureNotes, setClosureNotes] = useState('');
    const [releaseNotes, setReleaseNotes] = useState('');
    const [loading, setLoading] = useState<'initiate' | 'release' | 'close' | null>(null);

    const isAwaiting = workflowStatus === 'awaiting_closeout';
    const isClosed = workflowStatus === 'closed';
    const isActive = workflowStatus === 'active' || workflowStatus === 'completed';

    const canInitiate = isActive && gate.allMilestonesComplete && gate.allPaymentsPaid;
    const canClose = isAwaiting && gate.certificateIssued && (!hasRetention || gate.retentionReleased);
    const canRelease = isAwaiting && !gate.retentionReleased && hasRetention;

    const handleInitiate = async () => {
        setLoading('initiate');
        try {
            const res = await initiateCloseout(workflowId);
            if (res.success) {
                toast.success('Closeout process initiated');
                onStatusChange();
            } else {
                toast.error(res.message || 'Failed to initiate closeout');
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to initiate closeout');
        } finally {
            setLoading(null);
        }
    };

    const handleReleaseRetention = async () => {
        setLoading('release');
        try {
            const res = await releaseRetention(workflowId, releaseNotes);
            if (res.success) {
                toast.success('Retention released successfully');
                onStatusChange();
            } else {
                toast.error(res.message || 'Failed to release retention');
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to release retention');
        } finally {
            setLoading(null);
        }
    };

    const handleClose = async () => {
        setLoading('close');
        try {
            const res = await closeWorkflow(workflowId, closureNotes);
            if (res.success) {
                toast.success('Project workflow closed successfully!');
                onStatusChange();
            } else {
                toast.error(res.message || 'Failed to close workflow');
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to close workflow');
        } finally {
            setLoading(null);
        }
    };

    if (isClosed) {
        return (
            <Card className="border-slate-200 bg-slate-50">
                <CardContent className="py-4 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-slate-600" />
                    <div>
                        <p className="text-sm font-semibold text-slate-700">Project Closed</p>
                        <p className="text-xs text-slate-500">This project workflow has been formally closed.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={isAwaiting ? 'border-primary-200 bg-primary-50/40' : ''}>
            <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(e => !e)}>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                        {isAwaiting ? (
                            <FlagTriangleRight className="h-4 w-4 text-primary-500" />
                        ) : (
                            <Lock className="h-4 w-4 text-gray-400" />
                        )}
                        Project Closure
                        {isAwaiting && (
                            <Badge className="bg-primary-100 text-primary-700 border-primary-200 hover:bg-primary-100">
                                In Progress
                            </Badge>
                        )}
                    </CardTitle>
                    {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
            </CardHeader>

            {expanded && (
                <CardContent className="space-y-4">
                    {/* Gate checklist */}
                    <div className="rounded-lg border bg-white p-3 space-y-0.5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Prerequisites</p>
                        <GateRow label="All milestones marked complete" passed={gate.allMilestonesComplete} />
                        <GateRow label="All milestone payments paid" passed={gate.allPaymentsPaid} />
                        <GateRow label="All checklist items verified" passed={gate.certificateIssued || (isAwaiting)} />
                        <GateRow label="Completion certificate issued" passed={gate.certificateIssued} />
                        {hasRetention && (
                            <GateRow label="Retention payment released" passed={gate.retentionReleased} />
                        )}
                    </div>

                    {/* Gate failure warning */}
                    {!canInitiate && !isAwaiting && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">
                                {!gate.allMilestonesComplete
                                    ? 'All milestones must be marked complete before initiating closeout.'
                                    : 'All milestone payments must be paid before initiating closeout.'}
                            </p>
                        </div>
                    )}

                    {/* Initiate closeout */}
                    {!isAwaiting && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white"
                                    disabled={!canInitiate || loading !== null}
                                >
                                    {loading === 'initiate' ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <FlagTriangleRight className="h-4 w-4 mr-2" />
                                    )}
                                    Initiate Project Closeout
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Initiate Project Closeout?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will transition the workflow to <strong>Awaiting Closeout</strong> status
                                        and create a closeout checklist that both parties must complete before the
                                        project can be formally closed.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-primary-500 hover:bg-primary-600 text-white"
                                        onClick={handleInitiate}
                                    >
                                        Initiate Closeout
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    {/* Release Retention (in awaiting_closeout) */}
                    {canRelease && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                                    disabled={loading !== null}
                                >
                                    {loading === 'release' ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    Release Retention Payment
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Release Retention Payment</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Record that the retention payment has been released to the vendor.
                                        Please add any notes for this release (e.g., bank ref, transfer details).
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <Textarea
                                    placeholder="Release notes / bank reference (optional)"
                                    value={releaseNotes}
                                    onChange={e => setReleaseNotes(e.target.value)}
                                    className="mx-4 mb-2"
                                    rows={3}
                                />
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-orange-600 hover:bg-orange-700"
                                        onClick={handleReleaseRetention}
                                    >
                                        Confirm Release
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    {/* Close Workflow */}
                    {isAwaiting && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="w-full bg-slate-700 hover:bg-slate-800 disabled:opacity-50"
                                    disabled={!canClose || loading !== null}
                                >
                                    {loading === 'close' ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                    )}
                                    Close Project
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Close This Project?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This is the final step. The project workflow will be marked as{' '}
                                        <strong>Closed</strong> and the linked Purchase Order will be updated to{' '}
                                        <strong>Completed</strong>. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <Textarea
                                    placeholder="Closure notes (optional)"
                                    value={closureNotes}
                                    onChange={e => setClosureNotes(e.target.value)}
                                    className="mx-4 mb-2"
                                    rows={3}
                                />
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-slate-700 hover:bg-slate-800"
                                        onClick={handleClose}
                                    >
                                        Close Project
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    {!canClose && isAwaiting && (
                        <p className="text-xs text-center text-muted-foreground">
                            {!gate.certificateIssued
                                ? 'Issue the completion certificate to unlock project closure.'
                                : 'Release the retention payment to unlock project closure.'}
                        </p>
                    )}
                </CardContent>
            )}
        </Card>
    );
};
