

# Updated UI Consistency & Backend API Specification Plan
## Listing Pages with AI Search Bar and Filter Dropdowns

---

## Executive Summary

This plan addresses three key areas:
1. **Fix build error** in `PurchaseOrderDetails.tsx` (TypeScript type mismatch)
2. **UI Consistency** - Add AI Search Bar to all listing pages that are missing it
3. **Backend API Specifications** - Document expected endpoints and responses for features requiring backend support

**Note:** AI Search Engine endpoint (POST /api/v1/search/ai) is excluded from this scope as the BE team will integrate with an external AI engine separately.

---

## Part 1: Build Error Fix

### Issue
```typescript
// src/pages/PurchaseOrderDetails.tsx line 121
const isVendor = user?.role === 'vendor'; // ERROR: 'vendor' not in UserRole type
```

### Root Cause
`UserRole` type is defined as `'industry' | 'professional'` in `src/types/shared.ts`, but code compares against `'vendor'`.

### Solution
Check `user?.userType` instead of `user?.role` for vendor detection:
```typescript
// Fix: Use userType instead
const isVendor = user?.userType === 'Vendor';
const isIndustry = user?.userType === 'Industry' || user?.role === 'industry';
```

**File to modify:** `src/pages/PurchaseOrderDetails.tsx`

---

## Part 2: Current State Audit - AI Search Bar Usage

### Pages WITH AI Search Bar (Consistent)
| Page | Location | Has Dropdown Filters |
|------|----------|---------------------|
| `IndustryQuotes.tsx` | Industry | Yes (Category, Priority) |
| `QuotationsForRequirement.tsx` | Industry | Yes |
| `VendorQuotations.tsx` | Vendor | Yes (Tab-based status) |
| `VendorRFQsBrowse.tsx` | Vendor | No (uses toggle) |
| `VendorRFQsApplied.tsx` | Vendor | No |

### Pages MISSING AI Search Bar (Need Update)
| Page | Module | Current Search | Filters Available |
|------|--------|----------------|-------------------|
| `IndustryPurchaseOrders.tsx` | PO | POFilters (basic Input) | Status dropdown |
| `PurchaseOrdersPending.tsx` | PO | POFilters (basic Input) | None (status fixed) |
| `PurchaseOrdersInProgress.tsx` | PO | POFilters (basic Input) | None (status fixed) |
| `PurchaseOrdersCompleted.tsx` | PO | POFilters (basic Input) | None (status fixed) |
| `QuotationsPending.tsx` | Quotations | CustomTable search | Status |
| `QuotationsApproved.tsx` | Quotations | CustomTable search | Status |
| `RequirementsDrafts.tsx` | Requirements | Basic Input | Category, Priority, Creator |
| `RequirementsApproved.tsx` | Requirements | CustomTable search | Category, Priority, Creator |
| `RequirementsPending.tsx` | Requirements | CustomTable search | Category, Priority, Creator |
| `RequirementsPublished.tsx` | Requirements | CustomTable search | Category, Priority, Creator |
| `IndustryTeam.tsx` | Team | CustomTable search | Department, Role, Status |
| `StakeholdersProfessionals.tsx` | Stakeholders | CustomTable search | Expertise, Status |
| `StakeholdersVendors.tsx` | Stakeholders | CustomTable search | Type, Status |
| `WorkflowsActive.tsx` | Workflows | CustomTable search | Status |
| `IndustryApprovals.tsx` | Approvals | CustomTable search | Type, Status |

---

## Part 3: UI Implementation Tasks

### Task 3.1: Update PO Pages with AI Search Bar

**Files to modify:**
- `src/pages/IndustryPurchaseOrders.tsx`
- `src/pages/PurchaseOrdersPending.tsx`
- `src/pages/PurchaseOrdersInProgress.tsx`
- `src/pages/PurchaseOrdersCompleted.tsx`

**Changes:**
1. Import `AISearchBar` from `@/components/shared/AISearchBar`
2. Add `AISearchBar` component above `POFilters`
3. Remove search from `POFilters` or set `showSearch={false}`
4. Wire AI search to existing `searchTerm` state

**Example structure:**
```tsx
{/* AI Search Bar */}
<AISearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search purchase orders with AI..."
  isLoading={isLoading}
/>

{/* Filter Dropdowns - search removed */}
<div className="flex flex-wrap gap-4 mb-6">
  {/* Status Filter */}
  <Select value={statusFilter} onValueChange={setStatusFilter}>
    ...
  </Select>
  
  {/* Vendor Filter (if applicable) */}
  <Select value={vendorFilter} onValueChange={setVendorFilter}>
    ...
  </Select>
  
  {/* Date Range Filter (optional) */}
  ...
</div>
```

### Task 3.2: Update Quotation Pages with AI Search Bar

**Files to modify:**
- `src/pages/QuotationsPending.tsx`
- `src/pages/QuotationsApproved.tsx`

**Changes:**
1. Import `AISearchBar`
2. Add above `CustomTable`
3. Pass `hideSearch={true}` to `CustomTable` to avoid duplicate search

### Task 3.3: Update Requirements Pages with AI Search Bar

**Files to modify:**
- `src/pages/RequirementsDrafts.tsx`
- `src/pages/RequirementsApproved.tsx`
- `src/pages/RequirementsPending.tsx`
- `src/pages/RequirementsPublished.tsx`

**Changes:**
1. Import `AISearchBar`
2. Replace existing filter section search with `AISearchBar`
3. Keep `CreatorFilterDropdown` and column-based filters as separate filter bar

### Task 3.4: Update Other Industry Pages

**Files to modify:**
- `src/pages/IndustryTeam.tsx`
- `src/pages/IndustryApprovals.tsx`
- `src/pages/WorkflowsActive.tsx`
- `src/pages/StakeholdersProfessionals.tsx`
- `src/pages/StakeholdersVendors.tsx`

**Changes:**
Same pattern - add `AISearchBar` above table, set `hideSearch={true}` on CustomTable

---

## Part 4: Enhanced POFilters Component

Update `src/components/purchase-order/POFilters.tsx` to:
1. Remove integrated search (moved to AI Search Bar)
2. Add more filter dropdowns (vendor, date range, value range)

**New component structure:**
```tsx
interface POFiltersProps {
  statusFilter: POStatus | 'all';
  onStatusChange: (value: POStatus | 'all') => void;
  vendorFilter?: string;
  onVendorChange?: (value: string) => void;
  dateRange?: { from: Date | null; to: Date | null };
  onDateRangeChange?: (range: { from: Date | null; to: Date | null }) => void;
  onClearFilters: () => void;
  showStatusFilter?: boolean;
  vendors?: { id: string; name: string }[]; // Populated from API
}
```

---

## Part 5: Backend API Specifications

> **Note:** AI Search Endpoint (POST /api/v1/search/ai) is **excluded** from this scope.
> The BE team will integrate with an external AI engine separately. Frontend will consume results when ready.

---

### 5.1 Purchase Orders List Endpoint (Enhancement)

**Endpoint:** `GET /api/v1/industry/purchase-orders`

**Current:** Basic listing with status filter

**Proposed Enhancement - Add filter parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Text search query (basic keyword match) |
| `status` | string | Filter by status |
| `vendorId` | string | Filter by vendor |
| `projectId` | string | Filter by project |
| `minValue` | number | Minimum total value |
| `maxValue` | number | Maximum total value |
| `startDateFrom` | date | Start date range (from) |
| `startDateTo` | date | Start date range (to) |
| `sortBy` | string | Sort field |
| `order` | 'asc'/'desc' | Sort direction |

**Enhanced Response - Add filters metadata:**
```json
{
  "success": true,
  "data": {
    "purchaseOrders": [...],
    "pagination": {...},
    "filters": {
      "vendors": [
        { "id": "v1", "name": "TechCorp", "count": 15 },
        { "id": "v2", "name": "ServicePro", "count": 8 }
      ],
      "projects": [
        { "id": "p1", "name": "Project Alpha", "count": 10 }
      ],
      "statusCounts": {
        "draft": 5,
        "pending_approval": 12,
        "approved": 8,
        "in_progress": 15,
        "completed": 20,
        "cancelled": 3
      },
      "valueRange": {
        "min": 1000,
        "max": 500000
      }
    },
    "statistics": {
      "totalPending": 12,
      "totalInProgress": 15,
      "totalCompleted": 20,
      "totalValue": 2500000
    }
  }
}
```

---

### 5.2 Vendor PO List Endpoint (Enhancement)

**Endpoint:** `GET /api/v1/vendors/purchase-orders`

**Purpose:** List POs received by vendor

**Enhanced Request Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search query |
| `status` | string | sent/accepted/rejected/in_progress/completed |
| `industryId` | string | Filter by industry (sender) |
| `minValue` | number | Minimum value |
| `maxValue` | number | Maximum value |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response:**
```json
{
  "success": true,
  "data": {
    "purchaseOrders": [
      {
        "id": "po-123",
        "orderNumber": "PO-2025-001",
        "projectTitle": "Industrial Equipment Supply",
        "industryName": "Acme Industries",
        "industryId": "ind-456",
        "totalValue": 75000,
        "currency": "INR",
        "status": "sent",
        "receivedAt": "2025-02-01T10:30:00Z",
        "responseDeadline": "2025-02-10T23:59:59Z",
        "startDate": "2025-02-15",
        "endDate": "2025-05-15",
        "milestonesCount": 4
      }
    ],
    "pagination": {...},
    "filters": {
      "industries": [
        { "id": "ind-456", "name": "Acme Industries", "count": 5 }
      ],
      "statusCounts": {
        "sent": 3,
        "accepted": 10,
        "in_progress": 7,
        "completed": 15
      }
    },
    "statistics": {
      "totalReceived": 35,
      "pendingResponse": 3,
      "activeOrders": 7,
      "completedValue": 1200000
    }
  }
}
```

---

### 5.3 Quotations List Endpoints (Enhancement)

**Endpoint:** `GET /api/v1/industry/quotations`

**Enhanced Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Text search query |
| `status` | string | pending_review/under_evaluation/approved/rejected |
| `requirementId` | string | Filter by requirement |
| `vendorId` | string | Filter by vendor |
| `minAmount` | number | Minimum quoted amount |
| `maxAmount` | number | Maximum quoted amount |
| `submittedFrom` | date | Submission date range |
| `submittedTo` | date | Submission date range |

**Enhanced Response - Add filters:**
```json
{
  "success": true,
  "data": {
    "quotations": [...],
    "pagination": {...},
    "filters": {
      "vendors": [
        { "id": "v1", "name": "Vendor A", "count": 5 }
      ],
      "requirements": [
        { "id": "req-1", "title": "Equipment Procurement", "count": 8 }
      ],
      "statusCounts": {
        "pending_review": 10,
        "under_evaluation": 5,
        "approved": 15,
        "rejected": 3
      }
    }
  }
}
```

---

### 5.4 Vendor Quotations Endpoint (Enhancement)

**Endpoint:** `GET /api/v1/vendors/quotations`

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search query |
| `status` | string | draft/submitted/under_review/accepted/rejected |
| `rfqId` | string | Filter by RFQ |
| `industryId` | string | Filter by industry |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response:**
```json
{
  "success": true,
  "data": {
    "quotations": [
      {
        "id": "quot-123",
        "quotationNumber": "QT-2025-001",
        "rfqId": "rfq-456",
        "rfqTitle": "Industrial Equipment Supply",
        "companyName": "Acme Industries",
        "quotedAmount": 75000,
        "currency": "INR",
        "status": "submitted",
        "submissionDate": "2025-02-01T10:30:00Z",
        "validUntil": "2025-03-01T23:59:59Z"
      }
    ],
    "pagination": {...},
    "filters": {
      "industries": [...],
      "rfqs": [...],
      "statusCounts": {...}
    },
    "statistics": {
      "totalSubmitted": 25,
      "totalAccepted": 15,
      "totalValue": 2500000,
      "successRate": 60
    }
  }
}
```

---

## Part 6: Implementation Sequence

### Phase 1: Bug Fix (Immediate)
1. Fix `PurchaseOrderDetails.tsx` type error

### Phase 2: Industry PO Module (Priority 1)
1. Update `IndustryPurchaseOrders.tsx` with AI Search Bar
2. Update `PurchaseOrdersPending.tsx` with AI Search Bar
3. Update `PurchaseOrdersInProgress.tsx` with AI Search Bar
4. Update `PurchaseOrdersCompleted.tsx` with AI Search Bar
5. Enhance `POFilters.tsx` component

### Phase 3: Quotations Module (Priority 2)
1. Update `QuotationsPending.tsx` with AI Search Bar
2. Update `QuotationsApproved.tsx` with AI Search Bar

### Phase 4: Requirements Module (Priority 3)
1. Update all Requirements list pages with AI Search Bar
2. Maintain existing CreatorFilterDropdown

### Phase 5: Other Modules (Priority 4)
1. Update Team, Stakeholders, Workflows, Approvals pages

---

## Part 7: Vendor Module Updates

### Files to Update:
- `src/pages/VendorQuotations.tsx` - Already has AI Search Bar (verified)
- `src/pages/VendorRFQsBrowse.tsx` - Already has AI Search Bar (verified)
- `src/pages/VendorRFQsApplied.tsx` - Already has AI Search Bar (verified)

### New Vendor Pages Needed:
1. **Vendor Purchase Orders List Page** (`src/pages/VendorPurchaseOrders.tsx`)
   - List all POs received from industries
   - AI Search Bar
   - Filters: Status, Industry, Date Range
   - Actions: View, Accept/Reject, Track Progress

---

## Summary

### Frontend Changes (16 files):
| Category | Files | Priority |
|----------|-------|----------|
| Bug Fix | 1 | Immediate |
| PO Module | 5 | High |
| Quotations | 2 | High |
| Requirements | 4 | Medium |
| Other Industry | 5 | Low |

### Backend Changes Required:
| Endpoint | Change Type | Priority |
|----------|-------------|----------|
| Industry PO List | Add filters metadata | High |
| Vendor PO List | Add filters metadata | High |
| Quotations List | Add filters metadata | Medium |
| Vendor Quotations | Add filters metadata | Medium |

### Excluded from Scope:
- **AI Search Endpoint** (`POST /api/v1/search/ai`) - BE team will integrate with external AI engine

### Estimated Effort:
- **Frontend:** 12-16 hours
- **Backend:** 12-16 hours (reduced from 16-20 hours after removing AI endpoint)

