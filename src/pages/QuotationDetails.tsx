import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  Download,
  GitCompare,
  Calendar,
  DollarSign,
  Truck,
  Star,
  FileText,
  Clock,
  Building,
  Mail,
  Phone,
  User,
  Loader2,
  Shield,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { quotationService } from "@/services/quotation.service";
import type { QuotationDetail, QuotationActivity, QuotationStatus } from "@/types/quotation";
import { toast } from "sonner";
import { ApproveQuotationModal } from "@/components/quotation/ApproveQuotationModal";
import { RejectQuotationModal } from "@/components/quotation/RejectQuotationModal";
import { ClarificationModal } from "@/components/quotation/ClarificationModal";

export default function QuotationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management
  const [quotation, setQuotation] = useState<QuotationDetail | null>(null);
  const [activities, setActivities] = useState<QuotationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionPermissions, setActionPermissions] = useState<any>(null);

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showClarificationModal, setShowClarificationModal] = useState(false);

  // Fetch quotation details
  useEffect(() => {
    if (id) {
      fetchQuotationDetails();
    }
  }, [id]);

  const fetchQuotationDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [quotationData, activityData, permissionsData] = await Promise.all([
        quotationService.getById(id),
        quotationService.getActivity(id),
        quotationService.validateAction(id, 'approve'),
      ]);
      setQuotation(quotationData);
      setActivities(activityData);
      setActionPermissions(permissionsData.data);
    } catch (error) {
      toast.error("Failed to load quotation details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Action handlers
  const handleApprove = async (comments?: string, notifyVendor?: boolean, createPO?: boolean) => {
    if (!id) return;
    
    try {
      await quotationService.approve(id, { comments, notifyVendor, createPurchaseOrder: createPO } as any);
      toast.success("Quotation approved successfully");
      await fetchQuotationDetails();
      setShowApproveModal(false);
    } catch (error) {
      toast.error("Failed to approve quotation");
      console.error(error);
    }
  };

  const handleReject = async (reason: string, comments: string) => {
    if (!id) return;
    
    try {
      await quotationService.reject(id, { reason: reason as any, comments });
      toast.success("Quotation rejected");
      await fetchQuotationDetails();
      setShowRejectModal(false);
    } catch (error) {
      toast.error("Failed to reject quotation");
      console.error(error);
    }
  };

  const handleRequestClarification = async (data: any) => {
    if (!id) return;
    
    try {
      await quotationService.requestClarification(id, data);
      toast.success("Clarification request sent to vendor");
      await fetchQuotationDetails();
      setShowClarificationModal(false);
    } catch (error) {
      toast.error("Failed to send clarification request");
      console.error(error);
    }
  };

  const handleDownloadDocument = async (documentId: string, documentName: string) => {
    if (!id) return;
    
    try {
      const blob = await quotationService.downloadDocument(id, documentId);
      quotationService.downloadFile(blob, documentName);
      toast.success("Document downloaded");
    } catch (error) {
      toast.error("Failed to download document");
      console.error(error);
    }
  };

  const handleCompareWithOthers = () => {
    if (quotation) {
      navigate(`/dashboard/quotations/comparison?highlight=${id}&requirement=${quotation.requirementId}`);
    }
  };

  const getStatusColor = (status: QuotationStatus) => {
    const colors = {
      pending_review: "bg-yellow-100 text-yellow-800",
      under_evaluation: "bg-blue-100 text-blue-800",
      awaiting_clarification: "bg-purple-100 text-purple-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
      withdrawn: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getRecommendationBadge = (recommendation: string | null) => {
    if (!recommendation) return null;
    
    const badges: Record<string, { label: string; className: string }> = {
      top_pick: { label: "Top Pick", className: "bg-green-100 text-green-800" },
      best_value: { label: "Best Value", className: "bg-blue-100 text-blue-800" },
      fastest_delivery: { label: "Fastest Delivery", className: "bg-purple-100 text-purple-800" },
      highest_rated: { label: "Highest Rated", className: "bg-yellow-100 text-yellow-800" },
      best_match: { label: "Best Match", className: "bg-indigo-100 text-indigo-800" },
    };
    
    const badge = badges[recommendation];
    return badge ? <Badge className={badge.className}>{badge.label}</Badge> : null;
  };

  const getRiskBadge = (risk: string) => {
    const badges = {
      low: { label: "Low Risk", className: "bg-green-100 text-green-800" },
      medium: { label: "Medium Risk", className: "bg-yellow-100 text-yellow-800" },
      high: { label: "High Risk", className: "bg-red-100 text-red-800" },
    };
    const badge = badges[risk as keyof typeof badges];
    return badge ? <Badge className={badge.className}>{badge.label}</Badge> : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInMins > 0) return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Quotation not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const canApprove = quotation.status === 'pending_review' || quotation.status === 'under_evaluation';
  const canReject = quotation.status === 'pending_review' || quotation.status === 'under_evaluation';
  const canRequestClarification = quotation.status !== 'approved' && quotation.status !== 'rejected' && quotation.status !== 'expired';

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Quotation {quotation.quotationNumber} | Diligince.ai</title>
      </Helmet>

      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Quotation {quotation.quotationNumber}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className={getStatusColor(quotation.status)}>{quotation.status.replace('_', ' ')}</Badge>
                {quotation.aiEvaluation?.recommendation && getRecommendationBadge(quotation.aiEvaluation.recommendation)}
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{quotation.vendorName}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{quotation.vendorRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                ${quotation.quotedAmount.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">{quotation.currency}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            {canApprove && actionPermissions?.userPermissions?.canApprove && (
              <Button onClick={() => setShowApproveModal(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            )}
            {canReject && actionPermissions?.userPermissions?.canReject && (
              <Button variant="destructive" onClick={() => setShowRejectModal(true)}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            )}
            {canRequestClarification && actionPermissions?.userPermissions?.canRequestClarification && (
              <Button variant="outline" onClick={() => setShowClarificationModal(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Request Clarification
              </Button>
            )}
            <Button variant="outline" onClick={handleCompareWithOthers}>
              <GitCompare className="h-4 w-4 mr-2" />
              Compare with Others
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Terms</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="evaluation">AI Evaluation</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Requirement Information */}
            {quotation.requirement && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirement Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Link 
                      to={`/dashboard/requirements/${quotation.requirement.id}`}
                      className="text-lg font-semibold text-primary hover:underline"
                    >
                      {quotation.requirement.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {quotation.requirement.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-lg font-semibold">${quotation.requirement.budget.toLocaleString()}</p>
                      {quotation.quotedAmount < quotation.requirement.budget && (
                        <p className="text-sm text-green-600">
                          ${(quotation.requirement.budget - quotation.quotedAmount).toLocaleString()} under budget
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="text-lg font-semibold">{formatDate(quotation.requirement.deadline)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vendor Information */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold">{quotation.vendorName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{quotation.vendorRating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground ml-1">rating</span>
                    </div>
                  </div>
                </div>

                {quotation.vendorContact && (
                  <div className="space-y-2 pt-2">
                    <Separator />
                    <h4 className="text-sm font-medium">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{quotation.vendorContact.primaryContact}</span>
                        <span className="text-muted-foreground">- {quotation.vendorContact.contactRole}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${quotation.vendorContact.email}`} className="text-primary hover:underline">
                          {quotation.vendorContact.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${quotation.vendorContact.phone}`} className="text-primary hover:underline">
                          {quotation.vendorContact.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proposal Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Proposal Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{quotation.proposalSummary}</p>
                {quotation.detailedDescription && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Detailed Description</h4>
                      <p className="text-sm text-muted-foreground">{quotation.detailedDescription}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Submitted</p>
                  </div>
                  <p className="text-lg font-semibold">{formatDate(quotation.submittedDate)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Response: {quotation.responseTime}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Valid Until</p>
                  </div>
                  <p className="text-lg font-semibold">{formatDate(quotation.validUntil)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Delivery Time</p>
                  </div>
                  <p className="text-lg font-semibold">{quotation.deliveryTimeWeeks} weeks</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Payment Terms</p>
                  </div>
                  <p className="text-lg font-semibold">{quotation.paymentTerms}</p>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Metrics */}
            {quotation.comparisonMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle>Comparison Metrics</CardTitle>
                  <CardDescription>
                    How this quotation compares to {quotation.comparisonMetrics.totalQuotationsForRequirement} quotations received
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price Ranking</p>
                      <p className="text-2xl font-bold">#{quotation.comparisonMetrics.rankByPrice}</p>
                      <p className="text-sm text-muted-foreground">
                        {quotation.comparisonMetrics.pricePercentileVsAverage > 0 ? '+' : ''}
                        {quotation.comparisonMetrics.pricePercentileVsAverage.toFixed(1)}% vs average
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Delivery Ranking</p>
                      <p className="text-2xl font-bold">#{quotation.comparisonMetrics.rankByDelivery}</p>
                      {quotation.comparisonMetrics.deliveryPercentileVsBest === 0 && (
                        <p className="text-sm text-green-600">Fastest delivery</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rating Ranking</p>
                      <p className="text-2xl font-bold">#{quotation.comparisonMetrics.rankByRating}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pricing & Terms Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-lg font-semibold">Total Quoted Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      ${quotation.quotedAmount.toLocaleString()} {quotation.currency}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Terms</p>
                      <p className="text-lg font-medium">{quotation.paymentTerms}</p>
                    </div>
                    {quotation.warrantyPeriod && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Warranty Period</p>
                        <p className="text-lg font-medium">{quotation.warrantyPeriod}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {quotation.termsAndConditions && (
              <Card>
                <CardHeader>
                  <CardTitle>Terms and Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{quotation.termsAndConditions}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attached Documents</CardTitle>
                <CardDescription>
                  {quotation.documents.length} document{quotation.documents.length !== 1 ? 's' : ''} attached
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quotation.documents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotation.documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {doc.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.type}</Badge>
                          </TableCell>
                          <TableCell>{(doc.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                          <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadDocument(doc.id, doc.name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No documents attached</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Evaluation Tab */}
          <TabsContent value="evaluation" className="space-y-6">
            {quotation.aiEvaluation ? (
              <>
                {/* Overall Score */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Overall Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="relative w-32 h-32">
                          <svg className="transform -rotate-90 w-32 h-32">
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-muted"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={`${2 * Math.PI * 56}`}
                              strokeDashoffset={`${2 * Math.PI * 56 * (1 - quotation.aiEvaluation.overallScore / 100)}`}
                              className="text-primary"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold">{quotation.aiEvaluation.overallScore}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getRecommendationBadge(quotation.aiEvaluation.recommendation)}
                          {getRiskBadge(quotation.aiEvaluation.riskLevel)}
                        </div>
                        <p className="text-sm text-muted-foreground">{quotation.aiEvaluation.reasoning}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Score Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Price Score</span>
                        <span className="text-sm font-medium">{quotation.aiEvaluation.priceScore}/100</span>
                      </div>
                      <Progress value={quotation.aiEvaluation.priceScore} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Delivery Score</span>
                        <span className="text-sm font-medium">{quotation.aiEvaluation.deliveryScore}/100</span>
                      </div>
                      <Progress value={quotation.aiEvaluation.deliveryScore} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Rating Score</span>
                        <span className="text-sm font-medium">{quotation.aiEvaluation.ratingScore}/100</span>
                      </div>
                      <Progress value={quotation.aiEvaluation.ratingScore} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Specialization Score</span>
                        <span className="text-sm font-medium">{quotation.aiEvaluation.specializationScore}/100</span>
                      </div>
                      <Progress value={quotation.aiEvaluation.specializationScore} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Performance Score</span>
                        <span className="text-sm font-medium">{quotation.aiEvaluation.performanceScore}/100</span>
                      </div>
                      <Progress value={quotation.aiEvaluation.performanceScore} />
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths & Concerns */}
                {(quotation.aiEvaluation.strengths || quotation.aiEvaluation.concerns) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {quotation.aiEvaluation.strengths && quotation.aiEvaluation.strengths.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-green-600">Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {quotation.aiEvaluation.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                    {quotation.aiEvaluation.concerns && quotation.aiEvaluation.concerns.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-yellow-600">Concerns</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {quotation.aiEvaluation.concerns.map((concern, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span>{concern}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No AI Evaluation Available</h3>
                    <p className="text-sm text-muted-foreground">
                      AI evaluation has not been performed for this quotation yet.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>
                  {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'} recorded
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          {index < activities.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-medium">{activity.description}</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                              {getTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">{activity.performedByName}</span>
                            <span> · {activity.performedByRole}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDateTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No activity recorded yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <ApproveQuotationModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onApprove={handleApprove}
        quotationNumber={quotation.quotationNumber}
        vendorName={quotation.vendorName}
      />

      <RejectQuotationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onReject={handleReject}
        quotationNumber={quotation.quotationNumber}
        vendorName={quotation.vendorName}
      />

      <ClarificationModal
        isOpen={showClarificationModal}
        onClose={() => setShowClarificationModal(false)}
        onSend={handleRequestClarification}
        quotationNumber={quotation.quotationNumber}
        vendorContact={quotation.vendorContact}
      />
    </div>
  );
}
