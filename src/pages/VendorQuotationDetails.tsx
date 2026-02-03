import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Edit,
  Trash2,
  X,
  Building2,
  Calendar,
  IndianRupee,
  FileText,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Shield,
  Wrench,
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DetailPageSkeleton } from '@/components/shared/loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

import { vendorQuotationsService } from '@/services';

const VendorQuotationDetails: React.FC = () => {
  const { quotationId } = useParams<{ quotationId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch quotation details
  const { data: quotation, isLoading } = useQuery({
    queryKey: ['vendor-quotation', quotationId],
    queryFn: () => vendorQuotationsService.getQuotationDetails(quotationId!),
    enabled: !!quotationId,
  });

  // Fetch purchase order for this quotation
  const { data: purchaseOrder } = useQuery({
    queryKey: ['vendor-quotation-po', quotationId],
    queryFn: () => vendorQuotationsService.getPurchaseOrderForQuotation(quotationId!),
    enabled: !!quotationId,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => vendorQuotationsService.deleteDraftQuotation(quotationId!),
    onSuccess: () => {
      toast.success('Quotation deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['vendor-quotations'] });
      navigate('/dashboard/vendor/quotations');
    },
    onError: () => {
      toast.error('Failed to delete quotation');
    },
  });

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: () => vendorQuotationsService.withdrawQuotation(quotationId!, 'Vendor requested withdrawal'),
    onSuccess: () => {
      toast.success('Quotation withdrawn successfully');
      queryClient.invalidateQueries({ queryKey: ['vendor-quotations'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-quotation', quotationId] });
    },
    onError: () => {
      toast.error('Failed to withdraw quotation');
    },
  });

  if (isLoading) {
    return <DetailPageSkeleton showTabs tabCount={6} sections={2} />;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-muted text-muted-foreground',
      submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      withdrawn: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[status] || colors.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Draft',
      submitted: 'Submitted',
      under_review: 'Under Review',
      accepted: 'Accepted',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn',
    };
    return labels[status] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleEdit = () => {
    navigate(`/dashboard/vendor/quotations/${quotationId}/edit`);
  };

  const canEdit = quotation?.status === 'draft';
  const canDelete = quotation?.status === 'draft';
  const canWithdraw = quotation?.status === 'submitted' || quotation?.status === 'under_review';

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{quotation?.quotationNumber || 'Quotation Details'} | Vendor Dashboard</title>
      </Helmet>

      <main className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/dashboard/vendor/quotations')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{quotation?.quotationNumber}</h1>
                <Badge className={getStatusColor(quotation?.status || 'draft')}>
                  {getStatusLabel(quotation?.status || 'draft')}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{quotation?.requirementTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {purchaseOrder && purchaseOrder.status !== 'rejected' && purchaseOrder.status !== 'vendor_rejected' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate(`/dashboard/vendor/purchase-orders/${purchaseOrder.id}`)}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                View PO
              </Button>
            )}
            {canEdit && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Quotation?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your draft quotation.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {canWithdraw && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <X className="mr-2 h-4 w-4" />
                    Withdraw
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Withdraw Quotation?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to withdraw this quotation? You can submit a new quotation for this RFQ later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => withdrawMutation.mutate()}>
                      Withdraw
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="terms">Terms</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Company Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Company Name</p>
                    <p className="text-sm font-medium">{quotation?.vendorName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">RFQ Reference</p>
                    <p className="text-sm font-medium">{quotation?.requirementTitle || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(quotation?.quotedAmount || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Valid Until</p>
                    <p className="text-sm font-medium">{formatDate(quotation?.validUntil)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Key Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted Date</p>
                    <p className="text-sm font-medium">{formatDate(quotation?.submittedDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">{formatDate(quotation?.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    Status Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Status</p>
                    <Badge className={getStatusColor(quotation?.status || 'draft')}>
                      {getStatusLabel(quotation?.status || 'draft')}
                    </Badge>
                  </div>
                  {quotation?.rejectionReason && (
                    <div>
                      <p className="text-xs text-muted-foreground">Rejection Reason</p>
                      <p className="text-sm text-destructive">{quotation.rejectionReason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                {quotation?.lineItems && quotation.lineItems.length > 0 ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3 font-medium">Description</th>
                            <th className="text-right p-3 font-medium">Qty</th>
                            <th className="text-right p-3 font-medium">Unit</th>
                            <th className="text-right p-3 font-medium">Rate</th>
                            <th className="text-right p-3 font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quotation.lineItems.map((item: any, index: number) => (
                            <tr key={index} className="border-t">
                              <td className="p-3">{item.description}</td>
                              <td className="text-right p-3">{item.quantity}</td>
                              <td className="text-right p-3">{item.unit}</td>
                              <td className="text-right p-3">{formatCurrency(item.unitPrice)}</td>
                              <td className="text-right p-3 font-medium">{formatCurrency(item.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Separator />
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{formatCurrency(quotation.subtotal || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax ({quotation.taxRate || 0}%)</span>
                          <span>{formatCurrency(quotation.taxAmount || 0)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span className="text-primary">{formatCurrency(quotation.quotedAmount || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No line items available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{quotation?.paymentTerms || 'No payment terms specified'}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Proposed Start Date</p>
                    <p className="text-sm font-medium">{formatDate(quotation?.proposedStartDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Proposed Completion Date</p>
                    <p className="text-sm font-medium">{formatDate(quotation?.proposedCompletionDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                {quotation?.milestones && quotation.milestones.length > 0 ? (
                  <div className="space-y-3">
                    {quotation.milestones.map((milestone: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{milestone.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{milestone.deliverables}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Due: {formatDate(milestone.dueDate)}</span>
                            <span>Amount: {formatCurrency(milestone.amount || 0)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No milestones defined</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Tab */}
          <TabsContent value="technical" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  Methodology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{quotation?.methodology || 'No methodology specified'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{quotation?.technicalSpecifications || 'No technical specifications provided'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  Quality Assurance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{quotation?.qualityAssurance || 'No quality assurance details provided'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Compliance & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quotation?.complianceCertifications && quotation.complianceCertifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {quotation.complianceCertifications.map((cert: string, index: number) => (
                      <Badge key={index} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No certifications listed</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terms Tab */}
          <TabsContent value="terms" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Warranty Period</p>
                  <p className="text-sm">{quotation?.warrantyPeriod || 'Not specified'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">Support Terms</p>
                  <p className="text-sm whitespace-pre-wrap">{quotation?.supportTerms || 'Not specified'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">Cancellation Policy</p>
                  <p className="text-sm whitespace-pre-wrap">{quotation?.cancellationPolicy || 'Not specified'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">Special Conditions</p>
                  <p className="text-sm whitespace-pre-wrap">{quotation?.specialConditions || 'None'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Attached Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quotation?.documents && quotation.documents.length > 0 ? (
                  <div className="space-y-2">
                    {quotation.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No documents attached</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                {quotation?.activityLog && quotation.activityLog.length > 0 ? (
                  <div className="space-y-4">
                    {quotation.activityLog.map((activity: any, index: number) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(activity.timestamp)} • {activity.user}
                          </p>
                          {activity.details && (
                            <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No activity recorded</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default VendorQuotationDetails;