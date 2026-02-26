import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { issueCompletionCertificate } from '@/services/modules/workflows/workflow.service';
import { toast } from 'sonner';

interface CertificateInfo {
    issued: boolean;
    issuedAt?: string;
    certificateNo?: string;
    fileUrl?: string;
}

interface CompletionCertificateCardProps {
    workflowId: string;
    certificate: CertificateInfo | null;
    allItemsVerified: boolean;
    onCertificateIssued: () => void;
}

export const CompletionCertificateCard: React.FC<CompletionCertificateCardProps> = ({
    workflowId,
    certificate,
    allItemsVerified,
    onCertificateIssued
}) => {
    const [loading, setLoading] = useState(false);

    const handleIssueCertificate = async () => {
        setLoading(true);
        try {
            const res = await issueCompletionCertificate(workflowId);
            if (res.success) {
                toast.success('Completion certificate issued successfully');
                onCertificateIssued();
            } else {
                toast.error((res as any).message || 'Failed to issue certificate');
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to issue certificate');
        } finally {
            setLoading(false);
        }
    };

    const isIssued = certificate?.issued;
    const canIssue = !isIssued && allItemsVerified;

    return (
        <Card className={isIssued ? 'border-green-200 bg-green-50/50' : ''}>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Award className={`h-4 w-4 ${isIssued ? 'text-green-600' : 'text-gray-400'}`} />
                    Completion Certificate
                    {isIssued && (
                        <Badge className="ml-auto bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                            Issued
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isIssued ? (
                    <>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-green-100 border border-green-200">
                            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-green-800">Certificate Issued</p>
                                {certificate?.certificateNo && (
                                    <p className="text-xs text-green-700 mt-0.5">
                                        Certificate No: <span className="font-mono font-semibold">{certificate.certificateNo}</span>
                                    </p>
                                )}
                                {certificate?.issuedAt && (
                                    <p className="text-xs text-green-600 mt-0.5">
                                        Issued on {new Date(certificate.issuedAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>

                        {certificate?.fileUrl && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-green-300 text-green-700 hover:bg-green-100"
                                onClick={() => window.open(certificate.fileUrl, '_blank')}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download Certificate PDF
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        {!allItemsVerified && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700">
                                    All checklist items must be verified before issuing the certificate.
                                </p>
                            </div>
                        )}
                        <Button
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                            disabled={!canIssue || loading}
                            onClick={handleIssueCertificate}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Award className="h-4 w-4 mr-2" />
                            )}
                            Issue Completion Certificate
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
};
