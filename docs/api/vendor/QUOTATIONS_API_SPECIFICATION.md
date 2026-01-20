# Vendor Quotations API Specification

> Complete API documentation for the Vendor Quotation Submission feature.

## Base URL

```
Production: https://api.example.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer <jwt_token>
```

The token must belong to a user with `stakeholderType: 'vendor'` or `'professional'`.

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/vendor/quotations` | Create new quotation |
| GET | `/vendor/quotations` | List vendor's quotations |
| GET | `/vendor/quotations/stats` | Get quotation statistics |
| GET | `/vendor/quotations/:id` | Get quotation details |
| PUT | `/vendor/quotations/:id` | Update draft quotation |
| DELETE | `/vendor/quotations/:id` | Delete draft quotation |
| POST | `/vendor/quotations/:id/submit` | Submit draft quotation |
| POST | `/vendor/quotations/:id/withdraw` | Withdraw submitted quotation |
| POST | `/vendor/quotations/:id/documents` | Upload document |
| DELETE | `/vendor/quotations/:id/documents/:docId` | Remove document |

---

## 1. Create Quotation

Creates a new quotation as draft or submits directly.

### Request

```
POST /api/v1/vendor/quotations
Content-Type: application/json
Authorization: Bearer <token>
```

### Request Body

```json
{
  "rfqId": "REQ-2026-01-05-94a1f4d3",
  "pricing": {
    "lineItems": [
      {
        "id": "item_1704470000000",
        "description": "Engineering Consultation Services",
        "quantity": 10,
        "unitPrice": 5000,
        "total": 50000
      },
      {
        "id": "item_1704470000001",
        "description": "Equipment Installation",
        "quantity": 1,
        "unitPrice": 25000,
        "total": 25000
      }
    ],
    "subtotal": 75000,
    "taxRate": 18,
    "taxAmount": 13500,
    "totalAmount": 88500,
    "currency": "INR",
    "paymentTerms": "milestone"
  },
  "timeline": {
    "proposedStartDate": "2026-02-01",
    "proposedCompletionDate": "2026-04-15",
    "milestones": [
      {
        "id": "milestone_1",
        "name": "Phase 1 - Design",
        "deliverables": "Complete design documentation and wireframes",
        "dueDate": "2026-02-15",
        "amount": 25000
      },
      {
        "id": "milestone_2",
        "name": "Phase 2 - Development",
        "deliverables": "Core implementation complete",
        "dueDate": "2026-03-30",
        "amount": 50000
      }
    ]
  },
  "technicalProposal": {
    "methodology": "We will employ an agile methodology with bi-weekly sprints, continuous integration, and regular stakeholder demos to ensure project alignment and transparency throughout the development lifecycle.",
    "technicalSpecifications": "Using latest industry standards with ISO 9001 compliance. All deliverables will meet international quality benchmarks.",
    "qualityAssurance": "Rigorous testing including unit tests, integration tests, and UAT with documented test cases and bug tracking.",
    "complianceCertifications": ["ISO 9001", "ISO 14001"]
  },
  "termsAndConditions": {
    "warrantyPeriod": "12_months",
    "supportTerms": "24_7",
    "cancellationPolicy": "30_days",
    "specialConditions": "Payment via bank transfer only. Advance payment of 30% required before project initiation."
  },
  "documents": [
    {
      "id": "doc_1",
      "name": "Technical_Proposal.pdf",
      "type": "application/pdf",
      "size": 2048576,
      "url": "https://storage.example.com/docs/technical_proposal.pdf"
    }
  ],
  "status": "submitted",
  "validUntil": "2026-02-05"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rfqId` | string | Yes | RFQ/Requirement ID to quote against |
| `pricing` | object | Yes | Pricing breakdown |
| `pricing.lineItems` | array | Yes | At least one item required |
| `pricing.lineItems[].description` | string | Yes | Item description |
| `pricing.lineItems[].quantity` | number | Yes | Must be > 0 |
| `pricing.lineItems[].unitPrice` | number | Yes | Must be >= 0 |
| `pricing.paymentTerms` | string | Yes | See enum values |
| `timeline` | object | Yes | Project timeline |
| `timeline.proposedStartDate` | date | Yes | ISO 8601 format |
| `timeline.proposedCompletionDate` | date | Yes | Must be after start date |
| `timeline.milestones` | array | No | Optional milestones |
| `technicalProposal` | object | Yes | Technical details |
| `technicalProposal.methodology` | string | Yes | Min 50 characters |
| `termsAndConditions` | object | Yes | Terms and conditions |
| `termsAndConditions.warrantyPeriod` | string | Yes | See enum values |
| `termsAndConditions.supportTerms` | string | Yes | See enum values |
| `termsAndConditions.cancellationPolicy` | string | Yes | See enum values |
| `status` | string | No | `draft` (default) or `submitted` |
| `validUntil` | date | No | Default: 30 days from submission |

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "quo_abc123def456",
    "quotationNumber": "QUO-2026-01-05-abc123",
    "rfqId": "REQ-2026-01-05-94a1f4d3",
    "rfqTitle": "Testing Requirement",
    "companyName": "Test Industry Co",
    "pricing": {
      "totalAmount": 88500,
      "currency": "INR"
    },
    "timeline": {
      "proposedStartDate": "2026-02-01",
      "proposedCompletionDate": "2026-04-15",
      "durationDays": 73
    },
    "status": "submitted",
    "validUntil": "2026-02-05T23:59:59.000Z",
    "submittedAt": "2026-01-05T19:30:00.000Z",
    "createdAt": "2026-01-05T19:30:00.000Z"
  },
  "message": "Quotation submitted successfully"
}
```

### Error Responses

**400 Bad Request - Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "technicalProposal.methodology",
        "message": "Methodology must be at least 50 characters"
      },
      {
        "field": "pricing.lineItems",
        "message": "At least one line item is required"
      }
    ]
  }
}
```

**404 Not Found - RFQ Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "RFQ_NOT_FOUND",
    "message": "The specified RFQ does not exist or is not open for quotations"
  }
}
```

**409 Conflict - Duplicate Quotation:**
```json
{
  "success": false,
  "error": {
    "code": "QUOTATION_EXISTS",
    "message": "You have already submitted a quotation for this RFQ",
    "existingQuotationId": "quo_xyz789"
  }
}
```

---

## 2. List Quotations

Retrieves a paginated list of vendor's quotations with filtering.

### Request

```
GET /api/v1/vendor/quotations
Authorization: Bearer <token>
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | - | Filter by status: `draft`, `submitted`, `under_review`, `accepted`, `rejected`, `withdrawn` |
| `rfqId` | string | - | Filter by specific RFQ |
| `search` | string | - | Search in quotation number or RFQ title |
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max: 50) |
| `sortBy` | string | `createdAt` | Sort field: `createdAt`, `submittedAt`, `totalAmount`, `status` |
| `sortOrder` | string | `desc` | Sort order: `asc`, `desc` |

### Example Requests

```bash
# Get all quotations
GET /api/v1/vendor/quotations

# Get drafts only (for Drafts sub-module)
GET /api/v1/vendor/quotations?status=draft

# Get submitted quotations (for Submitted sub-module)
GET /api/v1/vendor/quotations?status=submitted

# Get accepted quotations (for Accepted sub-module)
GET /api/v1/vendor/quotations?status=accepted

# Get rejected quotations (for Rejected sub-module)
GET /api/v1/vendor/quotations?status=rejected

# Search with pagination
GET /api/v1/vendor/quotations?search=engineering&page=2&limit=20
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "quotations": [
      {
        "id": "quo_abc123def456",
        "quotationNumber": "QUO-2026-01-05-abc123",
        "rfqId": "REQ-2026-01-05-94a1f4d3",
        "rfqTitle": "Testing Requirement",
        "company": {
          "id": "693b8e64929abb4cb0d8fa91",
          "name": "Test Industry Co",
          "logo": "https://storage.example.com/logos/test-industry.png"
        },
        "quotedAmount": 88500,
        "currency": "INR",
        "status": "submitted",
        "submittedAt": "2026-01-05T19:30:00.000Z",
        "validUntil": "2026-02-05T23:59:59.000Z",
        "timeline": {
          "proposedStartDate": "2026-02-01",
          "proposedCompletionDate": "2026-04-15",
          "durationDays": 73
        },
        "createdAt": "2026-01-05T19:25:00.000Z"
      },
      {
        "id": "quo_def456ghi789",
        "quotationNumber": "QUO-2026-01-04-def456",
        "rfqId": "REQ-2026-01-03-xyz789",
        "rfqTitle": "Manufacturing Equipment Supply",
        "company": {
          "id": "693b8e64929abb4cb0d8fa92",
          "name": "Industrial Solutions Ltd",
          "logo": null
        },
        "quotedAmount": 250000,
        "currency": "INR",
        "status": "accepted",
        "submittedAt": "2026-01-04T14:20:00.000Z",
        "validUntil": "2026-02-04T23:59:59.000Z",
        "timeline": {
          "proposedStartDate": "2026-02-15",
          "proposedCompletionDate": "2026-05-30",
          "durationDays": 104
        },
        "createdAt": "2026-01-04T10:15:00.000Z",
        "actionDetails": {
          "reason": "Best value proposition",
          "actionAt": "2026-01-05T10:00:00.000Z"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "stats": {
      "draft": 3,
      "submitted": 12,
      "under_review": 2,
      "accepted": 5,
      "rejected": 3,
      "withdrawn": 0
    }
  }
}
```

---

## 3. Get Quotation Statistics

Retrieves summary statistics for vendor's quotations.

### Request

```
GET /api/v1/vendor/quotations/stats
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "totalQuotations": 25,
    "byStatus": {
      "draft": 3,
      "submitted": 12,
      "under_review": 2,
      "accepted": 5,
      "rejected": 3,
      "withdrawn": 0,
      "expired": 0
    },
    "acceptanceRate": 62.5,
    "averageResponseTime": {
      "days": 2.3,
      "formatted": "2 days 7 hours"
    },
    "totalValue": {
      "submitted": 1250000,
      "accepted": 450000,
      "currency": "INR"
    },
    "thisMonth": {
      "submitted": 5,
      "accepted": 2,
      "rejected": 1
    },
    "trend": {
      "direction": "up",
      "percentage": 15.5,
      "comparedTo": "last_month"
    }
  }
}
```

---

## 4. Get Quotation Details

Retrieves complete details of a specific quotation.

### Request

```
GET /api/v1/vendor/quotations/:quotationId
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "quo_abc123def456",
    "quotationNumber": "QUO-2026-01-05-abc123",
    "rfq": {
      "id": "REQ-2026-01-05-94a1f4d3",
      "title": "Testing Requirement",
      "description": "We need comprehensive testing services for our manufacturing facility.",
      "category": ["service", "consulting"],
      "priority": "critical",
      "budget": {
        "min": 50000,
        "max": 150000,
        "currency": "INR",
        "display": "₹50,000 - ₹1,50,000"
      },
      "deadline": "2026-01-20T23:59:59.000Z",
      "status": "open"
    },
    "company": {
      "id": "693b8e64929abb4cb0d8fa91",
      "name": "Test Industry Co",
      "logo": "https://storage.example.com/logos/test-industry.png",
      "location": "Mumbai, Maharashtra",
      "verified": true,
      "rating": 4.5
    },
    "pricing": {
      "lineItems": [
        {
          "id": "item_1704470000000",
          "description": "Engineering Consultation Services",
          "quantity": 10,
          "unitPrice": 5000,
          "total": 50000
        },
        {
          "id": "item_1704470000001",
          "description": "Equipment Installation",
          "quantity": 1,
          "unitPrice": 25000,
          "total": 25000
        }
      ],
      "subtotal": 75000,
      "taxRate": 18,
      "taxAmount": 13500,
      "totalAmount": 88500,
      "currency": "INR",
      "paymentTerms": "milestone",
      "paymentTermsDisplay": "Milestone-based Payment"
    },
    "timeline": {
      "proposedStartDate": "2026-02-01",
      "proposedCompletionDate": "2026-04-15",
      "durationDays": 73,
      "durationDisplay": "2 months 13 days",
      "milestones": [
        {
          "id": "milestone_1",
          "name": "Phase 1 - Design",
          "deliverables": "Complete design documentation and wireframes",
          "dueDate": "2026-02-15",
          "amount": 25000
        },
        {
          "id": "milestone_2",
          "name": "Phase 2 - Development",
          "deliverables": "Core implementation complete",
          "dueDate": "2026-03-30",
          "amount": 50000
        }
      ]
    },
    "technicalProposal": {
      "methodology": "We will employ an agile methodology with bi-weekly sprints, continuous integration, and regular stakeholder demos to ensure project alignment and transparency throughout the development lifecycle.",
      "technicalSpecifications": "Using latest industry standards with ISO 9001 compliance. All deliverables will meet international quality benchmarks.",
      "qualityAssurance": "Rigorous testing including unit tests, integration tests, and UAT with documented test cases and bug tracking.",
      "complianceCertifications": ["ISO 9001", "ISO 14001"],
      "complianceCertificationsDisplay": [
        { "code": "ISO 9001", "name": "Quality Management" },
        { "code": "ISO 14001", "name": "Environmental Management" }
      ]
    },
    "termsAndConditions": {
      "warrantyPeriod": "12_months",
      "warrantyPeriodDisplay": "12 Months",
      "supportTerms": "24_7",
      "supportTermsDisplay": "24/7 Support",
      "cancellationPolicy": "30_days",
      "cancellationPolicyDisplay": "Full Refund within 30 Days",
      "specialConditions": "Payment via bank transfer only. Advance payment of 30% required before project initiation."
    },
    "documents": [
      {
        "id": "doc_1",
        "name": "Technical_Proposal.pdf",
        "type": "application/pdf",
        "size": 2048576,
        "sizeDisplay": "2 MB",
        "url": "https://storage.example.com/docs/technical_proposal.pdf",
        "uploadedAt": "2026-01-05T19:28:00.000Z"
      }
    ],
    "status": "submitted",
    "statusDisplay": "Submitted",
    "validUntil": "2026-02-05T23:59:59.000Z",
    "validityDaysRemaining": 31,
    "evaluation": null,
    "actionDetails": null,
    "withdrawal": null,
    "activityLog": [
      {
        "action": "created",
        "actionDisplay": "Draft Created",
        "timestamp": "2026-01-05T19:25:00.000Z",
        "performedBy": {
          "id": "user_xyz",
          "name": "John Doe"
        },
        "details": "Quotation draft created"
      },
      {
        "action": "document_added",
        "actionDisplay": "Document Uploaded",
        "timestamp": "2026-01-05T19:28:00.000Z",
        "performedBy": {
          "id": "user_xyz",
          "name": "John Doe"
        },
        "details": "Uploaded Technical_Proposal.pdf"
      },
      {
        "action": "submitted",
        "actionDisplay": "Submitted",
        "timestamp": "2026-01-05T19:30:00.000Z",
        "performedBy": {
          "id": "user_xyz",
          "name": "John Doe"
        },
        "details": "Quotation submitted for review"
      }
    ],
    "createdAt": "2026-01-05T19:25:00.000Z",
    "updatedAt": "2026-01-05T19:30:00.000Z",
    "submittedAt": "2026-01-05T19:30:00.000Z",
    "permissions": {
      "canEdit": false,
      "canDelete": false,
      "canWithdraw": true,
      "canResubmit": false
    }
  }
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "error": {
    "code": "QUOTATION_NOT_FOUND",
    "message": "Quotation not found or you don't have permission to view it"
  }
}
```

---

## 5. Update Draft Quotation

Updates an existing draft quotation. Only allowed when status is `draft`.

### Request

```
PUT /api/v1/vendor/quotations/:quotationId
Content-Type: application/json
Authorization: Bearer <token>
```

### Request Body

Same structure as Create, but all fields are optional (partial updates allowed).

```json
{
  "pricing": {
    "lineItems": [
      {
        "id": "item_1704470000000",
        "description": "Updated Engineering Services",
        "quantity": 15,
        "unitPrice": 4500,
        "total": 67500
      }
    ],
    "subtotal": 67500,
    "taxRate": 18,
    "taxAmount": 12150,
    "totalAmount": 79650
  }
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "quo_abc123def456",
    "quotationNumber": "QUO-2026-01-05-abc123",
    "status": "draft",
    "updatedAt": "2026-01-05T20:00:00.000Z"
  },
  "message": "Quotation updated successfully"
}
```

### Error Response (403 Forbidden)

```json
{
  "success": false,
  "error": {
    "code": "UPDATE_NOT_ALLOWED",
    "message": "Only draft quotations can be updated. Current status: submitted"
  }
}
```

---

## 6. Delete Draft Quotation

Deletes a draft quotation. Only allowed when status is `draft`.

### Request

```
DELETE /api/v1/vendor/quotations/:quotationId
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Draft quotation deleted successfully"
}
```

### Error Response (403 Forbidden)

```json
{
  "success": false,
  "error": {
    "code": "DELETE_NOT_ALLOWED",
    "message": "Only draft quotations can be deleted. Current status: submitted"
  }
}
```

---

## 7. Submit Draft Quotation

Submits a draft quotation for review.

### Request

```
POST /api/v1/vendor/quotations/:quotationId/submit
Authorization: Bearer <token>
```

### Request Body (Optional)

```json
{
  "validUntil": "2026-02-15"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "quo_abc123def456",
    "quotationNumber": "QUO-2026-01-05-abc123",
    "status": "submitted",
    "submittedAt": "2026-01-05T20:30:00.000Z",
    "validUntil": "2026-02-15T23:59:59.000Z"
  },
  "message": "Quotation submitted successfully"
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Quotation is incomplete and cannot be submitted",
    "details": [
      {
        "field": "technicalProposal.methodology",
        "message": "Methodology is required and must be at least 50 characters"
      }
    ]
  }
}
```

---

## 8. Withdraw Quotation

Withdraws a submitted quotation. Only allowed when status is `submitted` or `under_review`.

### Request

```
POST /api/v1/vendor/quotations/:quotationId/withdraw
Content-Type: application/json
Authorization: Bearer <token>
```

### Request Body

```json
{
  "reason": "Unable to meet the delivery timeline due to resource constraints"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | Yes | Reason for withdrawal (min 10 characters) |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "quo_abc123def456",
    "quotationNumber": "QUO-2026-01-05-abc123",
    "status": "withdrawn",
    "withdrawal": {
      "reason": "Unable to meet the delivery timeline due to resource constraints",
      "withdrawnAt": "2026-01-06T10:00:00.000Z"
    }
  },
  "message": "Quotation withdrawn successfully"
}
```

### Error Response (403 Forbidden)

```json
{
  "success": false,
  "error": {
    "code": "WITHDRAWAL_NOT_ALLOWED",
    "message": "Cannot withdraw quotation with status: accepted"
  }
}
```

---

## 9. Upload Document

Uploads a document to a quotation.

### Request

```
POST /api/v1/vendor/quotations/:quotationId/documents
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

### Form Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `document` | file | Yes | File to upload (max 10MB) |
| `type` | string | No | Document type description |

### Allowed File Types

- PDF (`application/pdf`)
- Word Documents (`application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
- Excel Files (`application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)
- Images (`image/png`, `image/jpeg`)

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "doc_xyz789",
    "name": "Company_Certification.pdf",
    "type": "application/pdf",
    "size": 1048576,
    "sizeDisplay": "1 MB",
    "url": "https://storage.example.com/docs/doc_xyz789.pdf",
    "uploadedAt": "2026-01-05T21:00:00.000Z"
  },
  "message": "Document uploaded successfully"
}
```

### Error Response (413 Payload Too Large)

```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum allowed size of 10MB"
  }
}
```

---

## 10. Remove Document

Removes a document from a quotation.

### Request

```
DELETE /api/v1/vendor/quotations/:quotationId/documents/:documentId
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Document removed successfully"
}
```

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `UNAUTHORIZED` | 401 | Invalid or missing auth token |
| `FORBIDDEN` | 403 | Action not allowed for current user |
| `RFQ_NOT_FOUND` | 404 | RFQ does not exist |
| `QUOTATION_NOT_FOUND` | 404 | Quotation does not exist |
| `QUOTATION_EXISTS` | 409 | Duplicate quotation for RFQ |
| `UPDATE_NOT_ALLOWED` | 403 | Cannot update non-draft quotation |
| `DELETE_NOT_ALLOWED` | 403 | Cannot delete non-draft quotation |
| `WITHDRAWAL_NOT_ALLOWED` | 403 | Cannot withdraw in current status |
| `SUBMISSION_NOT_ALLOWED` | 403 | Cannot submit incomplete quotation |
| `FILE_TOO_LARGE` | 413 | Uploaded file exceeds size limit |
| `INVALID_FILE_TYPE` | 415 | File type not supported |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Enum Values Reference

### Payment Terms

| Value | Display |
|-------|---------|
| `advance` | 100% Advance Payment |
| `net_30` | Net 30 Days |
| `net_60` | Net 60 Days |
| `milestone` | Milestone-based Payment |
| `cod` | Cash on Delivery |
| `50_50` | 50% Advance, 50% on Delivery |

### Warranty Period

| Value | Display |
|-------|---------|
| `none` | No Warranty |
| `3_months` | 3 Months |
| `6_months` | 6 Months |
| `12_months` | 12 Months |
| `24_months` | 24 Months |
| `lifetime` | Lifetime Warranty |

### Support Terms

| Value | Display |
|-------|---------|
| `none` | No Support Included |
| `email` | Email Support Only |
| `business_hours` | Business Hours Support (9-6) |
| `extended` | Extended Hours Support (8-10) |
| `24_7` | 24/7 Support |

### Cancellation Policy

| Value | Display |
|-------|---------|
| `no_refund` | No Refund on Cancellation |
| `7_days` | Full Refund within 7 Days |
| `14_days` | Full Refund within 14 Days |
| `30_days` | Full Refund within 30 Days |
| `pro_rata` | Pro-rata Refund Based on Work Done |

### Quotation Status

| Value | Display | Description |
|-------|---------|-------------|
| `draft` | Draft | Being prepared by vendor |
| `submitted` | Submitted | Sent to industry |
| `under_review` | Under Review | Industry is evaluating |
| `accepted` | Accepted | Quotation accepted |
| `rejected` | Rejected | Quotation rejected |
| `withdrawn` | Withdrawn | Vendor withdrew |
| `expired` | Expired | Validity period passed |

---

## Frontend Integration

### Routes Mapping

| Frontend Route | API Endpoint |
|----------------|--------------|
| `/dashboard/rfqs/:rfqId/submit-quotation` | POST `/vendor/quotations` |
| `/dashboard/vendor/quotations` | GET `/vendor/quotations` |
| `/dashboard/vendor/quotations/drafts` | GET `/vendor/quotations?status=draft` |
| `/dashboard/vendor/quotations/submitted` | GET `/vendor/quotations?status=submitted` |
| `/dashboard/vendor/quotations/accepted` | GET `/vendor/quotations?status=accepted` |
| `/dashboard/vendor/quotations/rejected` | GET `/vendor/quotations?status=rejected` |
| `/dashboard/vendor/quotations/:id` | GET `/vendor/quotations/:id` |
| `/dashboard/vendor/quotations/:id/edit` | PUT `/vendor/quotations/:id` |

### Service File Location

```
src/services/modules/vendor-quotations/
├── vendor-quotations.routes.ts
├── vendor-quotations.service.ts
└── vendor-quotations.types.ts
```

---

## Webhook Events (Optional)

If implementing webhooks, these events should be triggered:

| Event | Payload | When |
|-------|---------|------|
| `quotation.submitted` | Quotation summary | Vendor submits quotation |
| `quotation.accepted` | Quotation + action details | Industry accepts |
| `quotation.rejected` | Quotation + rejection reason | Industry rejects |
| `quotation.withdrawn` | Quotation + withdrawal reason | Vendor withdraws |
| `quotation.expired` | Quotation summary | Validity expires |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| POST `/quotations` | 10 per hour |
| GET `/quotations` | 100 per minute |
| POST `/documents` | 20 per hour |
| All other endpoints | 60 per minute |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-05 | Initial specification |
