# Backend API Specifications for UI Consistency Updates

This document contains the backend API specifications for enhanced listing endpoints with filter metadata.

**Note:** AI Search Endpoint (POST /api/v1/search/ai) is **excluded** from this scope. The BE team will integrate with an external AI engine separately.

---

## 1. Purchase Orders List Endpoint (Enhancement)

**Endpoint:** `GET /api/v1/industry/purchase-orders`

**Current:** Basic listing with status filter

### Enhanced Request Parameters

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
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

### Enhanced Response

```json
{
  "success": true,
  "data": {
    "purchaseOrders": [
      {
        "id": "po-123",
        "orderNumber": "PO-2025-001",
        "projectTitle": "Industrial Equipment Supply",
        "projectId": "proj-456",
        "vendorId": "v-789",
        "vendorName": "TechCorp Solutions",
        "totalValue": 75000,
        "currency": "INR",
        "status": "in_progress",
        "startDate": "2025-02-01",
        "endDate": "2025-05-01",
        "createdAt": "2025-01-15T10:30:00Z",
        "updatedAt": "2025-02-01T14:20:00Z",
        "completionPercentage": 45,
        "milestonesCompleted": 2,
        "totalMilestones": 5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 45,
      "totalPages": 5
    },
    "filters": {
      "vendors": [
        { "id": "v1", "name": "TechCorp Solutions", "count": 15 },
        { "id": "v2", "name": "ServicePro Industries", "count": 8 },
        { "id": "v3", "name": "Global Supplies Ltd", "count": 12 }
      ],
      "projects": [
        { "id": "p1", "name": "Project Alpha", "count": 10 },
        { "id": "p2", "name": "Project Beta", "count": 8 }
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

## 2. Vendor PO List Endpoint (Enhancement)

**Endpoint:** `GET /api/v1/vendors/purchase-orders`

**Purpose:** List POs received by vendor

### Request Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search query |
| `status` | string | sent/accepted/rejected/in_progress/completed |
| `industryId` | string | Filter by industry (sender) |
| `minValue` | number | Minimum value |
| `maxValue` | number | Maximum value |
| `page` | number | Page number |
| `limit` | number | Items per page |

### Response

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
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 35,
      "totalPages": 4
    },
    "filters": {
      "industries": [
        { "id": "ind-456", "name": "Acme Industries", "count": 5 },
        { "id": "ind-789", "name": "Global Manufacturing", "count": 8 }
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

## 3. Quotations List Endpoint (Enhancement)

**Endpoint:** `GET /api/v1/industry/quotations`

### Enhanced Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Text search query |
| `status` | string | pending_review/under_evaluation/approved/rejected |
| `requirementId` | string | Filter by requirement |
| `vendorId` | string | Filter by vendor |
| `minAmount` | number | Minimum quoted amount |
| `maxAmount` | number | Maximum quoted amount |
| `submittedFrom` | date | Submission date range (from) |
| `submittedTo` | date | Submission date range (to) |
| `page` | number | Page number |
| `limit` | number | Items per page |

### Enhanced Response

```json
{
  "success": true,
  "data": {
    "quotations": [
      {
        "id": "quot-123",
        "quotationNumber": "QT-2025-001",
        "requirementId": "req-456",
        "requirementTitle": "Industrial Equipment",
        "vendorId": "v-789",
        "vendorName": "TechCorp Solutions",
        "quotedAmount": 75000,
        "currency": "INR",
        "status": "pending_review",
        "submittedDate": "2025-02-01T10:30:00Z",
        "validUntil": "2025-03-01T23:59:59Z",
        "responseTime": "2 days",
        "deliveryTimeWeeks": 8,
        "vendorRating": 4.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 28,
      "totalPages": 3
    },
    "filters": {
      "vendors": [
        { "id": "v1", "name": "Vendor A", "count": 5 },
        { "id": "v2", "name": "Vendor B", "count": 8 }
      ],
      "requirements": [
        { "id": "req-1", "title": "Equipment Procurement", "count": 8 },
        { "id": "req-2", "title": "IT Services", "count": 6 }
      ],
      "statusCounts": {
        "pending_review": 10,
        "under_evaluation": 5,
        "approved": 15,
        "rejected": 3
      },
      "amountRange": {
        "min": 5000,
        "max": 250000
      }
    },
    "statistics": {
      "totalPending": 10,
      "totalApproved": 15,
      "averageQuotedAmount": 45000
    }
  }
}
```

---

## 4. Vendor Quotations Endpoint (Enhancement)

**Endpoint:** `GET /api/v1/vendors/quotations`

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search query |
| `status` | string | draft/submitted/under_review/accepted/rejected |
| `rfqId` | string | Filter by RFQ |
| `industryId` | string | Filter by industry |
| `page` | number | Page number |
| `limit` | number | Items per page |

### Response

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
        "industryId": "ind-789",
        "quotedAmount": 75000,
        "currency": "INR",
        "status": "submitted",
        "submissionDate": "2025-02-01T10:30:00Z",
        "validUntil": "2025-03-01T23:59:59Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 25,
      "totalPages": 3
    },
    "filters": {
      "industries": [
        { "id": "ind-1", "name": "Acme Industries", "count": 5 },
        { "id": "ind-2", "name": "Global Manufacturing", "count": 8 }
      ],
      "rfqs": [
        { "id": "rfq-1", "title": "Equipment Supply", "count": 3 },
        { "id": "rfq-2", "title": "IT Services", "count": 5 }
      ],
      "statusCounts": {
        "draft": 2,
        "submitted": 10,
        "under_review": 5,
        "accepted": 15,
        "rejected": 3
      }
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

## Implementation Priority

| Endpoint | Change Type | Priority |
|----------|-------------|----------|
| Industry PO List | Add filters metadata | High |
| Vendor PO List | Add filters metadata | High |
| Quotations List | Add filters metadata | Medium |
| Vendor Quotations | Add filters metadata | Medium |

---

## Notes for Backend Team

1. **Filter metadata** should be computed based on the full dataset, not just the current page
2. **StatusCounts** should reflect counts for ALL statuses, not just the filtered status
3. **ValueRange/AmountRange** should reflect min/max across the entire dataset
4. **Vendor/Industry lists** should be limited to active entities with at least 1 record
5. **Search** parameter should support basic keyword matching across relevant fields (orderNumber, projectTitle, vendorName, etc.)
