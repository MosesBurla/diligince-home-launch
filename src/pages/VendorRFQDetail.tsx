import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Download,
  FileText,
  Star,
  ExternalLink,
  IndianRupee
} from 'lucide-react';
import { RFQDetailItem } from '@/types/rfq-browse';
import { useVendorRFQDetail } from '@/hooks/useVendorRFQs';
import { vendorRFQsService } from '@/services/modules/vendors/rfqs.service';
import { cn } from '@/lib/utils';

const priorityConfig = {
  critical: { label: 'Critical', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  high: { label: 'High', className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  medium: { label: 'Medium', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  low: { label: 'Low', className: 'bg-muted text-muted-foreground border-border' }
};

const categoryConfig: Record<string, { label: string; className: string }> = {
  service: { label: 'Service', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  product: { label: 'Product', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  logistics: { label: 'Logistics', className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  professional: { label: 'Professional', className: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' }
};

// Helper: Get first category from array or string
const getCategory = (category: string | string[] | undefined): string => {
  if (Array.isArray(category)) {
    return category[0] || 'service';
  }
  return category || 'service';
};

const VendorRFQDetail = () => {
  const { rfqId } = useParams<{ rfqId: string }>();
  const navigate = useNavigate();
  const { rfq, isLoading, error } = useVendorRFQDetail(rfqId || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (rfq) {
      setIsSaved(rfq.isSaved);
    }
  }, [rfq]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const handleToggleSave = async () => {
    try {
      const response = await vendorRFQsService.toggleSaveRFQ(rfqId || '');
      setIsSaved(response.data.saved);
      toast.success(response.data.saved ? 'RFQ saved successfully' : 'RFQ removed from saved list');
    } catch (error) {
      toast.error('Failed to update saved RFQ');
    }
  };

  const handleSubmitQuote = () => {
    if (rfq?.hasApplied) {
      toast.info('You have already submitted a quote for this RFQ');
      return;
    }
    navigate(`/dashboard/rfqs/${rfqId}/submit-quotation`);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-background min-h-screen space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">RFQ Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested RFQ could not be found or is no longer available.
          </p>
          <Button onClick={() => navigate('/dashboard/service-vendor-rfqs')}>
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  const priority = priorityConfig[rfq.priority] || priorityConfig.medium;
  const categoryKey = getCategory(rfq.category);
  const category = categoryConfig[categoryKey] || categoryConfig.service;

  return (
    <div className="p-6 bg-background min-h-screen space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Browse
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="p-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className={category.className}>
                  {category.label}
                </Badge>
                <Badge variant="outline" className={priority.className}>
                  {priority.label} Priority
                </Badge>
                {rfq.isClosingSoon && (
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Closing Soon
                  </Badge>
                )}
                {rfq.hasApplied && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Applied
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-foreground mb-4">
                {rfq.title}
              </h1>

              {/* Company Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{rfq.company.name}</span>
                    {rfq.company.verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{rfq.company.industry}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {rfq.company.rating}
                    </div>
                    <span>•</span>
                    <span>{rfq.company.totalProjects} projects</span>
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    Location
                  </div>
                  <div className="font-medium">{rfq.location.city}, {rfq.location.state}</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Deadline
                  </div>
                  <div className={cn(
                    "font-medium",
                    rfq.isClosingSoon && "text-orange-600"
                  )}>
                    {formatDate(rfq.timeline.deadline)}
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    Time Left
                  </div>
                  <div className={cn(
                    "font-medium",
                    rfq.daysLeft <= 3 && "text-orange-600"
                  )}>
                    {rfq.timeline.daysLeft} days
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Responses
                  </div>
                  <div className="font-medium">{rfq.responses} vendors</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          {rfq.aiRecommendation && (
            <Card className="border-violet-200 bg-gradient-to-r from-violet-50/50 to-purple-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-violet-700">
                  <Sparkles className="w-5 h-5" />
                  AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-violet-700">
                    {rfq.aiRecommendation.score}%
                  </div>
                  <div>
                    <div className="font-medium text-violet-800">Match Score</div>
                    <div className="text-sm text-violet-600">{rfq.aiRecommendation.reasoning}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {rfq.aiRecommendation.matchFactors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-violet-700">
                      <CheckCircle2 className="w-4 h-4 text-violet-600" />
                      {factor}
                    </div>
                  ))}
                </div>
                {(rfq.aiRecommendation.suggestedBid || rfq.aiRecommendation.winProbability) && (
                  <div className="flex gap-4 mt-4 pt-4 border-t border-violet-200">
                    {rfq.aiRecommendation.suggestedBid && (
                      <div>
                        <div className="text-xs text-violet-600">Suggested Bid</div>
                        <div className="font-semibold text-violet-800">{rfq.aiRecommendation.suggestedBid}</div>
                      </div>
                    )}
                    {rfq.aiRecommendation.winProbability && (
                      <div>
                        <div className="text-xs text-violet-600">Win Probability</div>
                        <div className="font-semibold text-violet-800">{rfq.aiRecommendation.winProbability}%</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {rfq.description}
              </p>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements & Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Requirements */}
              <div>
                <h4 className="font-medium mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {rfq.specifications.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Skills */}
              <div>
                <h4 className="font-medium mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {rfq.specifications.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Deliverables */}
              <div>
                <h4 className="font-medium mb-3">Expected Deliverables</h4>
                <ul className="space-y-2">
                  {rfq.specifications.deliverables?.map((del, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      {del}
                    </li>
                  ))}
                </ul>
              </div>

              {rfq.specifications.technicalDetails && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Technical Details</h4>
                    <p className="text-sm text-muted-foreground">
                      {rfq.specifications.technicalDetails}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          {rfq.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rfq.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{attachment.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(attachment.size)}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={attachment.url} download>
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Evaluation Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {rfq.evaluation.criteria.map((criterion) => (
                  <div key={criterion} className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {rfq.evaluation.weightage[criterion]}%
                    </div>
                    <div className="text-sm text-muted-foreground">{criterion}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {rfq.budget.display}
              </div>
              {rfq.budget.isNegotiable && (
                <Badge variant="secondary" className="text-xs">
                  Negotiable
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Posted</span>
                <span>{formatDate(rfq.timeline.postedDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deadline</span>
                <span className={cn(rfq.isClosingSoon && "text-orange-600 font-medium")}>
                  {formatDate(rfq.timeline.deadline)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expected Start</span>
                <span>{rfq.timeline.expectedStartDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span>{rfq.timeline.expectedDuration}</span>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {rfq.location.address}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {rfq.location.city}, {rfq.location.state}
              </div>
              {rfq.location.isRemoteAllowed && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  Remote work allowed
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmitQuote}
                disabled={rfq.hasApplied}
              >
                {rfq.hasApplied ? 'Quote Submitted' : 'Submit Quotation'}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleToggleSave}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 mr-2 text-primary" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save for Later
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorRFQDetail;
