# Vendor RFQ Browse API Specification

## Overview

API endpoints for vendors to browse, view, and interact with published RFQs (Requirements for Quotation).

**Backend Collection:** `requirementdrafts`  
**Filter Condition:** `status: 'published'`

---

## Endpoints

### 1. GET `/api/v1/vendors/rfqs/browse`

**Description:** Get paginated list of published requirements for vendors to browse with AI-powered search

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | No | - | AI-powered natural language search query |
| `aiRecommended` | boolean | No | false | Filter to show only AI recommended RFQs |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 12 | Items per page (max: 50) |

#### AI Search Query Examples

The `query` parameter accepts natural language queries. The backend AI will parse and extract structured filters:

| Query | Extracted Filters |
|-------|-------------------|
| "urgent electrical in Delhi" | priority: critical/high, category: service, city: Delhi |
| "products under 5 lakhs" | category: product, maxBudget: 500000 |
| "high priority automation services in Mumbai" | priority: high, category: service, city: Mumbai |
| "closing soon logistics" | category: logistics, status: closing_soon |
| "ISO certified vendors Maharashtra" | keywords: ["ISO"], state: Maharashtra |

#### Request Examples

```http
# All RFQs (no filters)
GET /api/v1/vendors/rfqs/browse?page=1&limit=12
Authorization: Bearer <token>

# AI Recommended only
GET /api/v1/vendors/rfqs/browse?aiRecommended=true&page=1&limit=12
Authorization: Bearer <token>

# Natural language search
GET /api/v1/vendors/rfqs/browse?query=urgent%20electrical%20work%20in%20Mumbai&page=1&limit=12
Authorization: Bearer <token>

# Combined: AI Recommended with search
GET /api/v1/vendors/rfqs/browse?query=automation&aiRecommended=true&page=1&limit=12
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "rfqs": [
      {
        "id": "req-2025-001",
        "title": "Industrial Automation Services",
        "description": "Looking for experienced automation service provider for our manufacturing unit. The project involves PLC programming, SCADA implementation, and integration with existing systems.",
        "category": "service",
        "priority": "high",
        "status": "open",
        "company": {
          "id": "company-123",
          "name": "TechCorp Industries",
          "logo": "https://storage.example.com/logos/techcorp.png",
          "location": "Mumbai, Maharashtra",
          "rating": 4.5,
          "verified": true
        },
        "budget": {
          "min": 500000,
          "max": 750000,
          "currency": "INR",
          "display": "₹5,00,000 - ₹7,50,000"
        },
        "deadline": "2025-01-20T23:59:59Z",
        "postedDate": "2025-01-05T10:30:00Z",
        "location": {
          "state": "Maharashtra",
          "city": "Mumbai",
          "address": "Industrial Area, Andheri East"
        },
        "requirements": [
          "ISO 9001:2015 Certification required",
          "Minimum 5 years experience in automation",
          "24/7 on-site support capability"
        ],
        "skills": ["PLC Programming", "SCADA", "Industrial IoT"],
        "responses": 12,
        "daysLeft": 15,
        "isClosingSoon": false,
        "isSaved": false,
        "hasApplied": false,
        "aiRecommendation": {
          "score": 92,
          "reasoning": "Strong match with your service portfolio",
          "matchFactors": ["Location match", "Category expertise", "Budget range"]
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 156,
      "totalPages": 13,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "searchInterpretation": {
      "originalQuery": "high priority automation services in Mumbai under 10 lakhs",
      "extractedFilters": {
        "priority": "high",
        "category": "service",
        "city": "Mumbai",
        "maxBudget": 1000000,
        "keywords": ["automation"]
      },
      "sortedBy": "relevance",
      "confidence": 0.92
    }
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `rfqs` | array | List of RFQ browse items |
| `pagination` | object | Pagination metadata |
| `searchInterpretation` | object | AI interpretation of the search query (only present when `query` is provided) |

#### Search Interpretation Object

| Field | Type | Description |
|-------|------|-------------|
| `originalQuery` | string | The original search query |
| `extractedFilters` | object | Structured filters extracted from the query |
| `sortedBy` | string | How results are sorted (e.g., "relevance", "deadline") |
| `confidence` | number | Confidence score of the AI interpretation (0-1) |

#### Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Vendor profile not verified"
  }
}
```

---

### 2. GET `/api/v1/vendors/rfqs/:rfqId`

**Description:** Get full details of a single RFQ

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `rfqId` | string | Unique RFQ identifier |

#### Request Example

```http
GET /api/v1/vendors/rfqs/req-2025-001
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "req-2025-001",
    "title": "Industrial Automation Services",
    "description": "Looking for experienced automation service provider for our manufacturing unit...",
    "category": "service",
    "priority": "high",
    "status": "open",
    "company": {
      "id": "company-123",
      "name": "TechCorp Industries",
      "logo": "https://storage.example.com/logos/techcorp.png",
      "location": "Mumbai, Maharashtra",
      "industry": "Manufacturing",
      "rating": 4.5,
      "totalProjects": 25,
      "verified": true,
      "memberSince": "2020-05-15"
    },
    "budget": {
      "min": 500000,
      "max": 750000,
      "currency": "INR",
      "display": "₹5,00,000 - ₹7,50,000",
      "isNegotiable": true
    },
    "timeline": {
      "postedDate": "2025-01-05T10:30:00Z",
      "deadline": "2025-01-20T23:59:59Z",
      "expectedStartDate": "2025-02-01",
      "expectedDuration": "3 months",
      "daysLeft": 15
    },
    "location": {
      "state": "Maharashtra",
      "city": "Mumbai",
      "address": "Industrial Area, Andheri East, Mumbai 400093",
      "isRemoteAllowed": false
    },
    "specifications": {
      "requirements": [
        "ISO 9001:2015 Certification required",
        "Minimum 5 years experience in industrial automation",
        "24/7 on-site support capability during implementation"
      ],
      "skills": ["PLC Programming", "SCADA", "Industrial IoT", "HMI Design"],
      "deliverables": [
        "Complete automation solution design document",
        "PLC programming and testing",
        "SCADA system implementation"
      ],
      "technicalDetails": "The plant has 5 production lines with various machinery..."
    },
    "attachments": [
      {
        "id": "att-001",
        "name": "Technical_Requirements_v2.pdf",
        "type": "application/pdf",
        "size": 2456789,
        "url": "https://storage.example.com/attachments/att-001.pdf"
      }
    ],
    "evaluation": {
      "criteria": ["Price", "Quality", "Timeline", "Experience"],
      "weightage": {
        "Price": 30,
        "Quality": 35,
        "Timeline": 20,
        "Experience": 15
      }
    },
    "responses": 12,
    "hasApplied": false,
    "isSaved": false,
    "aiRecommendation": {
      "score": 92,
      "reasoning": "Strong match with your service portfolio and expertise in industrial automation",
      "matchFactors": [
        "Location match - Same city as your office",
        "Category expertise - Automation is your primary specialization"
      ],
      "suggestedBid": "₹6,50,000",
      "winProbability": 75
    }
  }
}
```

#### Error Responses

**404 Not Found**
```json
{
  "success": false,
  "error": {
    "code": "RFQ_NOT_FOUND",
    "message": "RFQ not found or no longer available"
  }
}
```

---

### 3. GET `/api/v1/vendors/rfqs/stats`

**Description:** Get RFQ statistics for vendor dashboard

#### Request Example

```http
GET /api/v1/vendors/rfqs/stats
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "totalAvailable": 156,
    "aiRecommended": 24,
    "submittedQuotations": 8,
    "winRate": 74
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalAvailable` | number | Total number of available RFQs |
| `aiRecommended` | number | Number of RFQs recommended by AI for this vendor |
| `submittedQuotations` | number | Number of quotations submitted by the vendor |
| `winRate` | number | Win rate percentage (0-100) |

---

### 4. POST `/api/v1/vendors/rfqs/:rfqId/save`

**Description:** Save/bookmark an RFQ for later

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `rfqId` | string | Unique RFQ identifier |

#### Request Example

```http
POST /api/v1/vendors/rfqs/req-2025-001/save
Authorization: Bearer <token>
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "RFQ saved successfully",
  "data": {
    "rfqId": "req-2025-001",
    "savedAt": "2025-01-05T12:00:00Z"
  }
}
```

#### Error Responses

**409 Conflict**
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_SAVED",
    "message": "RFQ is already saved"
  }
}
```

---

### 5. DELETE `/api/v1/vendors/rfqs/:rfqId/save`

**Description:** Remove RFQ from saved list

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `rfqId` | string | Unique RFQ identifier |

#### Request Example

```http
DELETE /api/v1/vendors/rfqs/req-2025-001/save
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "RFQ removed from saved list"
}
```

---

## Data Models

### RFQ Browse Filters

```typescript
interface RFQBrowseFilters {
  query?: string;           // AI-powered natural language search
  aiRecommended?: boolean;  // Filter to AI recommended RFQs only
  page?: number;
  limit?: number;
}
```

### Search Interpretation

```typescript
interface SearchInterpretation {
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
```

### RFQ Browse Item

```typescript
interface RFQBrowseItem {
  id: string;
  title: string;
  description: string;
  category: 'service' | 'product' | 'logistics' | 'professional';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'closing_soon';
  company: {
    id: string;
    name: string;
    logo: string | null;
    location: string;
    rating: number;
    verified: boolean;
  };
  budget: {
    min: number;
    max: number;
    currency: string;
    display: string;
  };
  deadline: string; // ISO 8601
  postedDate: string; // ISO 8601
  location: {
    state: string;
    city: string;
    address?: string;
  };
  requirements: string[];
  skills: string[];
  responses: number;
  daysLeft: number;
  isClosingSoon: boolean;
  isSaved: boolean;
  hasApplied: boolean;
  aiRecommendation?: {
    score: number;
    reasoning: string;
    matchFactors: string[];
  } | null;
}
```

### RFQ Stats

```typescript
interface RFQStats {
  totalAvailable: number;
  aiRecommended: number;
  submittedQuotations: number;
  winRate: number; // percentage (0-100)
}
```

### RFQ Browse Response

```typescript
interface RFQBrowseResponse {
  success: boolean;
  data: {
    rfqs: RFQBrowseItem[];
    pagination: RFQBrowsePagination;
    searchInterpretation?: SearchInterpretation;
  };
}
```

---

## Backend Implementation Notes

### AI Query Processing

The backend should implement the following AI-powered query parsing:

1. **Parse natural language query** using NLP/AI to extract structured filters
2. **Extract intent** (category, priority, location, budget keywords)
3. **Apply relevance-based sorting** when query is present
4. **Calculate confidence score** for transparency

### Database Query Logic

```javascript
// Build query based on parsed filters
const query = db.collection('requirementdrafts')
  .where('status', '==', 'published');

// Apply AI-extracted filters
if (extractedFilters.category) {
  query.where('category', '==', extractedFilters.category);
}

if (extractedFilters.priority) {
  query.where('priority', '==', extractedFilters.priority);
}

if (extractedFilters.city || extractedFilters.state) {
  // Apply location filters
}

if (extractedFilters.maxBudget) {
  query.where('budget.max', '<=', extractedFilters.maxBudget);
}

// Apply keyword search on title/description
if (extractedFilters.keywords?.length) {
  // Full-text search implementation
}

// Apply AI recommendation filter
if (aiRecommended) {
  query.where('aiRecommendation.score', '>=', 70);
}
```

### AI Recommendation Logic

RFQs should be flagged as "AI Recommended" based on:

1. **Category match** - Vendor's primary service category
2. **Location proximity** - Within vendor's service area
3. **Budget alignment** - Within vendor's typical project range
4. **Skills match** - Required skills match vendor's capabilities
5. **Historical performance** - Similar past successful bids

### Closing Soon Criteria

An RFQ should be marked as `isClosingSoon` when:
- `daysLeft <= 3` (deadline within 3 days)

---

## Frontend Integration Notes

### Component Usage

```tsx
// AI Search Bar
<AISearchBar
  value={filters.query || ''}
  onChange={setQuery}
  placeholder="Search with AI..."
  isLoading={isLoading}
/>

// View Toggle
<RFQViewToggle
  value={filters.aiRecommended ? 'recommended' : 'all'}
  onChange={(mode) => setAiRecommended(mode === 'recommended')}
/>
```

### Hook Usage

```tsx
const {
  rfqs,
  stats,
  searchInterpretation,
  pagination,
  isLoading,
  filters,
  setQuery,
  setAiRecommended,
  clearFilters,
  toggleSaveRFQ,
  refreshRFQs
} = useVendorRFQs();
```
