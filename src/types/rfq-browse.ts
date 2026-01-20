// RFQ Browse Types for Vendor Portal

export interface RFQCompany {
  id: string;
  name: string;
  logo: string | null;
  location: string;
  rating: number;
  verified: boolean;
  industry?: string;
  totalProjects?: number;
  memberSince?: string;
}

export interface RFQBudget {
  min: number;
  max: number;
  currency: string;
  display: string;
  isNegotiable?: boolean;
}

export interface RFQLocation {
  state: string;
  city: string;
  address?: string;
  isRemoteAllowed?: boolean;
}

export interface RFQTimeline {
  postedDate: string;
  deadline: string;
  expectedStartDate?: string;
  expectedDuration?: string;
  daysLeft: number;
}

export interface RFQSpecifications {
  requirements: string[];
  skills: string[];
  deliverables?: string[];
  technicalDetails?: string;
}

export interface RFQAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface RFQEvaluation {
  criteria: string[];
  weightage: Record<string, number>;
}

export interface AIRecommendation {
  score: number;
  reasoning: string;
  matchFactors: string[];
  suggestedBid?: string;
  winProbability?: number;
}

export type RFQCategory = 'service' | 'product' | 'logistics' | 'professional';
export type RFQPriority = 'critical' | 'high' | 'medium' | 'low';
export type RFQStatus = 'open' | 'closing_soon';

export interface RFQBrowseItem {
  id: string;
  title: string;
  description: string;
  category: RFQCategory | string | string[];
  priority: RFQPriority;
  status: RFQStatus;
  company: RFQCompany;
  budget: RFQBudget;
  deadline?: string;
  postedDate: string;
  location: Partial<RFQLocation>;
  requirements: string[];
  skills: string[];
  responses: number;
  daysLeft: number | null;
  isClosingSoon: boolean;
  isSaved: boolean;
  hasApplied: boolean;
  quotationId?: string; // NEW: ID of submitted quotation
  quotationStatus?: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn'; // NEW: Status of quotation
  aiRecommendation?: AIRecommendation | null;
}

export interface RFQDetailItem extends Omit<RFQBrowseItem, 'deadline' | 'postedDate'> {
  timeline: RFQTimeline;
  specifications: RFQSpecifications;
  attachments: RFQAttachment[];
  evaluation: RFQEvaluation;
}

export interface RFQBrowseFilters {
  query?: string;           // AI-powered natural language search
  aiRecommended?: boolean;  // Toggle: true = Diligence Recommended only
  page?: number;
  limit?: number;
}

export interface SearchInterpretation {
  originalQuery: string;
  extractedFilters: {
    category?: string;
    priority?: string;
    state?: string;
    city?: string;
    minBudget?: number;
    maxBudget?: number;
    keywords?: string[];
  };
  sortedBy: string;
  confidence: number;
}

export interface RFQBrowsePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RFQBrowseResponse {
  success: boolean;
  data: {
    rfqs: RFQBrowseItem[];
    pagination: RFQBrowsePagination;
    searchInterpretation?: SearchInterpretation;
  };
}

export interface RFQDetailResponse {
  success: boolean;
  data: RFQDetailItem;
}

export interface RFQStats {
  totalAvailable: number;
  aiRecommended: number;
  submittedQuotations: number;
  winRate: number; // percentage (0-100)
}

export interface RFQStatsResponse {
  success: boolean;
  data: RFQStats;
}
