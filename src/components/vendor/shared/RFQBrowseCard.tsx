import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  Bookmark,
  BookmarkCheck,
  BadgeCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { RFQBrowseItem, RFQLocation } from '@/types/rfq-browse';
import { cn } from '@/lib/utils';

interface RFQBrowseCardProps {
  rfq: RFQBrowseItem;
  onViewDetails: (rfq: RFQBrowseItem) => void;
  onSubmitQuote: (rfq: RFQBrowseItem) => void;
  onViewQuote?: (rfq: RFQBrowseItem) => void; // NEW: Optional for viewing submitted quotation
  onToggleSave: (rfq: RFQBrowseItem) => void;
}

// Helper: Get first category from array or string
const getCategory = (category: string | string[]): string => {
  if (Array.isArray(category)) {
    return category[0] || 'service';
  }
  return category || 'service';
};

// Helper: Format location with fallback
const formatLocation = (location: Partial<RFQLocation> | undefined): string => {
  if (!location?.city && !location?.state) return 'Not specified';
  const parts = [location.city, location.state].filter(Boolean);
  return parts.join(', ') || 'Not specified';
};

// Helper: Format date with fallback
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Helper: Get deadline or posted info
const getDateInfo = (deadline?: string, postedDate?: string): { label: string; value: string } => {
  if (deadline) {
    const date = new Date(deadline);
    if (!isNaN(date.getTime())) {
      return { label: 'Deadline', value: formatDate(deadline) };
    }
  }
  return { label: 'Posted', value: formatDate(postedDate) };
};

// Helper: Format days left
const formatDaysLeft = (daysLeft: number | null): string | null => {
  if (daysLeft === null || daysLeft === undefined) return null;
  if (daysLeft <= 0) return 'Closing today';
  if (daysLeft === 1) return '1 day left';
  return `${daysLeft} days left`;
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800' },
  high: { label: 'High', className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800' },
  medium: { label: 'Medium', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' },
  low: { label: 'Low', className: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700' }
};

const categoryConfig: Record<string, { label: string; className: string }> = {
  service: { label: 'Service', className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800' },
  product: { label: 'Product', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' },
  logistics: { label: 'Logistics', className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800' },
  professional: { label: 'Professional', className: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800' }
};

const RFQBrowseCard: React.FC<RFQBrowseCardProps> = ({
  rfq,
  onViewDetails,
  onSubmitQuote,
  onViewQuote, // NEW
  onToggleSave
}) => {
  const categoryKey = getCategory(rfq.category);
  const category = categoryConfig[categoryKey] || categoryConfig.service;
  const priority = priorityConfig[rfq.priority] || priorityConfig.medium;
  const dateInfo = getDateInfo(rfq.deadline, rfq.postedDate);
  const daysLeftText = formatDaysLeft(rfq.daysLeft);
  const locationText = formatLocation(rfq.location);

  return (
    <Card className={cn(
      "group relative bg-card hover:shadow-lg transition-all duration-300 border rounded-xl overflow-hidden",
      rfq.isClosingSoon && "ring-1 ring-orange-300 dark:ring-orange-700",
      rfq.hasApplied && "ring-1 ring-green-300 bg-green-50/30 dark:ring-green-700 dark:bg-green-950/30"
    )}>
      <CardContent className="p-0">
        {/* Header: Badges & Bookmark */}
        <div className="flex items-start justify-between p-4 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("text-xs font-medium border", category.className)}>
              {category.label}
            </Badge>
            <Badge variant="outline" className={cn("text-xs font-medium border", priority.className)}>
              {priority.label}
            </Badge>
            {rfq.isClosingSoon && (
              <Badge className="bg-orange-500 text-white text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Closing Soon
              </Badge>
            )}
            {rfq.hasApplied && (
              <Badge className="bg-green-600 text-white text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Applied
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(rfq);
            }}
          >
            {rfq.isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Title & Company */}
        <div className="px-4 pb-3 space-y-1.5">
          <h3 className="text-base font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {rfq.title || 'Untitled RFQ'}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{rfq.company?.name || 'Unknown Company'}</span>
            {rfq.company?.verified && (
              <BadgeCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            )}
          </div>
        </div>

        {/* Description */}
        <div className="px-4 pb-3">
          {rfq.description ? (
            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">{rfq.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground/50 italic">No description provided</p>
          )}
        </div>

        {/* Meta: Location & Date */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{locationText}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{dateInfo.label}: {dateInfo.value}</span>
            </div>
          </div>
        </div>

        {/* Budget Section */}
        <div className="mx-4 mb-3 p-2.5 rounded-lg bg-muted/40">
          <div className="flex items-center gap-1.5">
            <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {rfq.budget?.display || 'Budget not specified'}
            </span>
          </div>
        </div>

        {/* Skills (only if present) */}
        {rfq.skills && rfq.skills.length > 0 && (
          <div className="px-4 pb-3">
            <div className="flex flex-wrap gap-1.5">
              {rfq.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-normal">
                  {skill}
                </Badge>
              ))}
              {rfq.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs font-normal">
                  +{rfq.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* AI Recommendation */}
        {rfq.aiRecommendation && (
          <div className="mx-4 mb-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {rfq.aiRecommendation.score}% Match
              </span>
              {rfq.aiRecommendation.winProbability && (
                <span className="text-xs text-purple-600 dark:text-purple-400">
                  • {rfq.aiRecommendation.winProbability}% win probability
                </span>
              )}
            </div>
            {rfq.aiRecommendation.reasoning && (
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 line-clamp-1">
                {rfq.aiRecommendation.reasoning}
              </p>
            )}
          </div>
        )}

        {/* Footer: Responses & Status */}
        <div className="px-4 py-2.5 border-t bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{rfq.responses || 0} responses</span>
            </div>
            {daysLeftText && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span className={rfq.isClosingSoon ? 'text-orange-600 font-medium' : ''}>
                  {daysLeftText}
                </span>
              </div>
            )}
          </div>
          <Badge variant={rfq.status === 'open' ? 'default' : 'secondary'} className="text-xs capitalize">
            {rfq.status || 'Open'}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="p-4 pt-3 flex gap-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-sm"
            onClick={() => onViewDetails(rfq)}
          >
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1.5 text-sm"
            onClick={() => rfq.hasApplied && onViewQuote ? onViewQuote(rfq) : onSubmitQuote(rfq)}
            variant={rfq.hasApplied ? "outline" : "default"}
          >
            {rfq.hasApplied ? 'View Quote' : 'Submit Quote'}
            {!rfq.hasApplied && <ArrowRight className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RFQBrowseCard;
