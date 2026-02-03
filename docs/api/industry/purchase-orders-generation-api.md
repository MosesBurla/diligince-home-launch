# Purchase Order Generation API Documentation

## Overview

This document covers the API endpoints for generating Purchase Orders from approved quotations, including subscription-based limits, sending POs to vendors/professionals, and PDF export features.

## Base URL
```
/api/v1/industry/purchase-orders
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer {access_token}
```

---

## Subscription-Based Limits

### Monthly PO Generation Limits by Plan

| Plan | Monthly PO Limit | Behavior at Limit |
|------|------------------|-------------------|
| Industry Starter | 10 | Block with upgrade prompt |
| Industry Growth | 50-100 (configurable) | Block with upgrade prompt |
| Industry Enterprise | Contractual/Unlimited | Based on contract terms |

### Check PO Generation Limit

**Endpoint:** `GET /api/v1/industry/purchase-orders/limit`

**Description:** Check the current user's PO generation limit and usage for the billing period.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "canGenerate": true,
    "used": 7,
    "limit": 50,
    "remaining": 43,
    "periodStart": "2024-01-01T00:00:00Z",
    "periodEnd": "2024-01-31T23:59:59Z",
    "resetDate": "2024-02-01T00:00:00Z",
    "planName": "Industry Growth",
    "warningThreshold": 0.8,
    "isWarning": false
  }
}
```

**Limit Reached Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "canGenerate": false,
    "used": 50,
    "limit": 50,
    "remaining": 0,
    "periodStart": "2024-01-01T00:00:00Z",
    "periodEnd": "2024-01-31T23:59:59Z",
    "resetDate": "2024-02-01T00:00:00Z",
    "planName": "Industry Growth",
    "warningThreshold": 0.8,
    "isWarning": false,
    "upgradeOptions": [
      {
        "planCode": "industry-enterprise",
        "planName": "Industry Enterprise",
        "poLimit": "unlimited",
        "monthlyPrice": 25000
      }
    ]
  }
}
```

---

## Generate PO from Approved Quotation

### Create Purchase Order

**Endpoint:** `POST /api/v1/industry/purchase-orders`

**Description:** Create a new purchase order from an approved quotation. Pre-fills data from quotation but allows customization.

**Request Body:**

```json
{
  "quotationId": "quo_abc123",
  "projectTitle": "Manufacturing Equipment Installation",
  "scopeOfWork": "Supply and installation of CNC machines as per quotation specifications...",
  "specialInstructions": "Coordinate with site supervisor before delivery. Safety protocols must be followed.",
  "startDate": "2024-02-01",
  "endDate": "2024-04-30",
  "paymentTerms": "30% advance, 40% on delivery, 30% on completion",
  
  "deliverables": [
    {
      "description": "CNC Machine Model XYZ-500",
      "quantity": 2,
      "unit": "units",
      "unitPrice": 450000
    },
    {
      "description": "Installation and Calibration",
      "quantity": 1,
      "unit": "service",
      "unitPrice": 50000
    },
    {
      "description": "Operator Training (40 hours)",
      "quantity": 40,
      "unit": "hours",
      "unitPrice": 500
    }
  ],
  
  "paymentMilestones": [
    {
      "name": "Advance Payment",
      "description": "Initial advance on PO acceptance",
      "percentage": 30,
      "dueDate": "2024-02-05"
    },
    {
      "name": "Delivery Milestone",
      "description": "Payment on equipment delivery to site",
      "percentage": 40,
      "dueDate": "2024-03-15"
    },
    {
      "name": "Completion Payment",
      "description": "Final payment after installation and training",
      "percentage": 30,
      "dueDate": "2024-04-30"
    }
  ],
  
  "acceptanceCriteria": [
    { "criteria": "Equipment passes quality inspection as per ISO 9001 standards" },
    { "criteria": "Installation meets factory safety standards" },
    { "criteria": "All operators complete training with certification" },
    { "criteria": "Equipment achieves specified production output in trial run" }
  ],
  
  "isoCompliance": {
    "termsAndConditions": [
      "Standard T&C apply as per company policy",
      "Force majeure clause included",
      "Confidentiality agreement in effect"
    ],
    "qualityRequirements": [
      "ISO 9001:2015 certified components only",
      "All materials must have quality certificates"
    ],
    "warrantyPeriod": "24 months from installation date",
    "penaltyClause": "1% per week delay, maximum 10% of order value"
  },
  
  "saveAsDraft": false
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "po_xyz789",
    "poNumber": "PO-2401-0001",
    "status": "draft",
    "quotation": {
      "id": "quo_abc123",
      "quotationNumber": "QUO-2401-0015",
      "vendorName": "TechMach Industries Pvt Ltd"
    },
    "recipientType": "vendor",
    "recipientId": "vendor_abc123",
    "projectTitle": "Manufacturing Equipment Installation",
    "subtotal": 970000,
    "taxPercentage": 18,
    "taxAmount": 174600,
    "totalAmount": 1144600,
    "currency": "INR",
    "createdAt": "2024-01-20T10:30:00Z",
    "usageInfo": {
      "used": 8,
      "limit": 50,
      "remaining": 42
    }
  },
  "message": "Purchase order created successfully"
}
```

**Error Response (Limit Reached):** `403 Forbidden`

```json
{
  "success": false,
  "error": {
    "code": "PO_LIMIT_REACHED",
    "message": "Monthly PO generation limit reached",
    "details": {
      "used": 50,
      "limit": 50,
      "resetDate": "2024-02-01T00:00:00Z",
      "upgradeUrl": "/subscription/upgrade"
    }
  }
}
```

**Error Response (Quotation Not Approved):** `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "code": "QUOTATION_NOT_APPROVED",
    "message": "Cannot generate PO from non-approved quotation",
    "details": {
      "quotationId": "quo_abc123",
      "quotationStatus": "pending"
    }
  }
}
```

---

## Get Quotation Data for PO Pre-fill

**Endpoint:** `GET /api/v1/industry/quotations/:quotationId/po-prefill`

**Description:** Get quotation data formatted for PO creation form pre-population.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "quotationId": "quo_abc123",
    "quotationNumber": "QUO-2401-0015",
    "requirementId": "req_xyz789",
    "requirementTitle": "CNC Machine Procurement",
    
    "vendor": {
      "id": "vendor_abc123",
      "type": "product",
      "name": "TechMach Industries Pvt Ltd",
      "contactPerson": "Rajesh Kumar",
      "email": "rajesh@techmach.com",
      "phone": "+91-9876543210",
      "gstin": "29ABCDE1234F1Z5",
      "address": "Industrial Area Phase II, Bengaluru 560058"
    },
    
    "financial": {
      "subtotal": 970000,
      "taxPercentage": 18,
      "taxAmount": 174600,
      "totalAmount": 1144600,
      "currency": "INR",
      "validUntil": "2024-02-15"
    },
    
    "lineItems": [
      {
        "description": "CNC Machine Model XYZ-500",
        "quantity": 2,
        "unit": "units",
        "unitPrice": 450000,
        "totalPrice": 900000,
        "specifications": "5-axis CNC with automatic tool changer"
      },
      {
        "description": "Installation and Calibration",
        "quantity": 1,
        "unit": "service",
        "unitPrice": 50000,
        "totalPrice": 50000
      },
      {
        "description": "Operator Training",
        "quantity": 40,
        "unit": "hours",
        "unitPrice": 500,
        "totalPrice": 20000
      }
    ],
    
    "proposedDeliveryDays": 60,
    "suggestedStartDate": "2024-02-01",
    "suggestedEndDate": "2024-04-01",
    
    "termsFromQuotation": {
      "paymentTerms": "30% advance, 40% on delivery, 30% on completion",
      "warrantyPeriod": "24 months",
      "deliveryTerms": "Ex-works, freight additional"
    }
  }
}
```

---

## Send PO to Vendor/Professional

### Send Purchase Order

**Endpoint:** `POST /api/v1/industry/purchase-orders/:poId/send`

**Description:** Send an approved PO to the vendor or professional for acceptance.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| poId | string | Yes | Purchase order ID |

**Request Body:**

```json
{
  "message": "Please review and confirm acceptance of this Purchase Order. Kindly respond within 3 business days.",
  "notifyViaEmail": true,
  "notifyViaPlatform": true,
  "requireDigitalAcceptance": true,
  "acceptanceDeadline": "2024-02-05T23:59:59Z"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "po_xyz789",
    "poNumber": "PO-2401-0001",
    "status": "sent_to_vendor",
    "sentToVendorAt": "2024-01-21T09:00:00Z",
    "sentBy": {
      "userId": "user_abc123",
      "name": "Procurement Manager"
    },
    "recipient": {
      "type": "vendor",
      "id": "vendor_abc123",
      "name": "TechMach Industries Pvt Ltd",
      "email": "orders@techmach.com"
    },
    "acceptanceDeadline": "2024-02-05T23:59:59Z",
    "notifications": {
      "emailSent": true,
      "platformNotified": true
    }
  },
  "message": "Purchase order sent to vendor successfully"
}
```

**Error Response (PO Not Approved):** `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "code": "PO_NOT_APPROVED",
    "message": "Purchase order must be approved before sending to vendor",
    "details": {
      "currentStatus": "pending_approval"
    }
  }
}
```

---

## PDF Export

### Export PO as PDF

**Endpoint:** `GET /api/v1/industry/purchase-orders/:poId/export/pdf`

**Description:** Generate and download the purchase order as a PDF document.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| poId | string | Yes | Purchase order ID |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| includeTerms | boolean | No | true | Include terms and conditions |
| includeSignature | boolean | No | true | Include signature blocks |
| template | string | No | standard | PDF template: standard, detailed, compact |

**Response:** Binary PDF file

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="PO-2401-0001.pdf"
Content-Length: 245760
```

**Error Response:** `404 Not Found`

```json
{
  "success": false,
  "error": {
    "code": "PO_NOT_FOUND",
    "message": "Purchase order not found"
  }
}
```

---

## Vendor Endpoints

### List Received Purchase Orders (Vendor View)

**Endpoint:** `GET /api/v1/vendors/purchase-orders`

**Description:** Get list of purchase orders received by the vendor.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Items per page |
| status | string | No | all | Filter: pending, accepted, rejected, in_progress, completed |
| search | string | No | - | Search PO number or project title |
| sortBy | string | No | receivedAt | Sort field |
| sortOrder | string | No | desc | Sort order |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "purchaseOrders": [
      {
        "id": "po_xyz789",
        "poNumber": "PO-2401-0001",
        "status": "pending",
        "industry": {
          "id": "company_abc123",
          "name": "ABC Manufacturing Ltd",
          "contactPerson": "John Smith",
          "email": "procurement@abc.com"
        },
        "projectTitle": "Manufacturing Equipment Installation",
        "totalAmount": 1144600,
        "currency": "INR",
        "startDate": "2024-02-01",
        "endDate": "2024-04-30",
        "receivedAt": "2024-01-21T09:00:00Z",
        "acceptanceDeadline": "2024-02-05T23:59:59Z",
        "requiresResponse": true
      }
    ],
    "summary": {
      "total": 15,
      "pending": 3,
      "accepted": 8,
      "inProgress": 3,
      "completed": 1,
      "totalValue": 8500000
    }
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get PO Details (Vendor View)

**Endpoint:** `GET /api/v1/vendors/purchase-orders/:poId`

**Description:** Get detailed view of a received purchase order.

**Response:** `200 OK`

Full PO details with vendor-specific fields like response options and deadline.

### Respond to Purchase Order

**Endpoint:** `POST /api/v1/vendors/purchase-orders/:poId/respond`

**Description:** Accept, reject, or negotiate a received purchase order.

**Request Body (Accept):**

```json
{
  "action": "accept",
  "comments": "Accepted. Work will commence on the scheduled start date.",
  "estimatedCompletionDate": "2024-04-25",
  "digitalSignature": {
    "signedBy": "Rajesh Kumar",
    "designation": "Sales Manager",
    "signedAt": "2024-01-22T10:30:00Z"
  }
}
```

**Request Body (Reject):**

```json
{
  "action": "reject",
  "reason": "Unable to fulfill order due to capacity constraints",
  "comments": "Current production capacity is fully committed until Q2. We can consider revised timeline starting April 2024.",
  "suggestAlternative": true,
  "alternativeProposal": {
    "suggestedStartDate": "2024-04-01",
    "suggestedEndDate": "2024-06-30"
  }
}
```

**Request Body (Negotiate):**

```json
{
  "action": "negotiate",
  "negotiationPoints": [
    {
      "field": "startDate",
      "currentValue": "2024-02-01",
      "proposedValue": "2024-02-15",
      "reason": "Need additional time for material procurement"
    },
    {
      "field": "paymentTerms",
      "currentValue": "30% advance, 40% delivery, 30% completion",
      "proposedValue": "40% advance, 30% delivery, 30% completion",
      "reason": "Higher advance needed for raw material purchase"
    }
  ],
  "comments": "We are keen to work on this project with minor adjustments to terms."
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "po_xyz789",
    "poNumber": "PO-2401-0001",
    "status": "vendor_accepted",
    "vendorResponse": {
      "action": "accept",
      "respondedAt": "2024-01-22T10:30:00Z",
      "respondedBy": {
        "userId": "vendor_user_123",
        "name": "Rajesh Kumar"
      },
      "comments": "Accepted. Work will commence on the scheduled start date."
    }
  },
  "message": "Purchase order accepted successfully"
}
```

---

## Professional Endpoints

Professional endpoints mirror vendor endpoints with the base path:
```
/api/v1/professionals/purchase-orders
```

---

## Email Notifications

### Email Templates Triggered by PO Actions

| Template | Trigger Event | Recipient | Variables |
|----------|---------------|-----------|-----------|
| `po-created-industry` | PO created as draft | Industry creator | poNumber, projectTitle, vendorName, totalAmount |
| `po-pending-approval` | PO submitted for approval | Approvers | poNumber, projectTitle, creatorName, totalAmount, approvalUrl |
| `po-approved` | PO approved | Industry creator | poNumber, projectTitle, approverName, approvedAt |
| `po-sent-to-vendor` | PO sent to vendor/professional | Vendor/Professional | poNumber, projectTitle, industryName, totalAmount, acceptanceDeadline, viewUrl |
| `po-accepted` | Vendor accepts PO | Industry creator | poNumber, projectTitle, vendorName, acceptedAt, estimatedCompletion |
| `po-rejected` | Vendor rejects PO | Industry creator | poNumber, projectTitle, vendorName, rejectionReason |
| `po-negotiation-request` | Vendor requests changes | Industry creator | poNumber, projectTitle, vendorName, negotiationPoints |
| `po-limit-warning` | 80% of monthly limit used | Industry admin | currentUsage, limit, resetDate, upgradeUrl |
| `po-limit-reached` | 100% of monthly limit used | Industry admin | limit, resetDate, upgradeUrl |
| `po-reminder-vendor` | Acceptance deadline approaching | Vendor/Professional | poNumber, projectTitle, deadline, daysRemaining |

### Email Template Variables

```javascript
// Common variables for all PO emails
{
  recipientName: String,
  poNumber: String,
  projectTitle: String,
  vendorName: String,     // or professionalName
  industryName: String,
  totalAmount: String,    // Formatted with currency
  currency: String,
  startDate: String,
  endDate: String,
  poDetailsUrl: String,
  dashboardUrl: String,
  supportEmail: String
}
```

---

## MongoDB Collection Updates

### `subscription_usage` Collection (New)

```javascript
{
  _id: ObjectId,
  companyId: ObjectId,           // Industry ProfileId
  subscriptionId: ObjectId,      // Active subscription
  periodStart: Date,             // Billing period start
  periodEnd: Date,               // Billing period end
  
  usage: {
    posGenerated: Number,        // POs created this period
    requirementsPublished: Number,
    rfqsIssued: Number,
    quotationsReceived: Number
  },
  
  limits: {                      // Snapshot from subscription plan
    posGenerated: Number | 'unlimited',
    requirementsPublished: Number | 'unlimited',
    rfqsIssued: Number | 'unlimited'
  },
  
  warnings: {
    poWarningAt: Date,           // When 80% warning was sent
    poLimitReachedAt: Date       // When 100% notification was sent
  },
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.subscription_usage.createIndex({ companyId: 1, periodStart: 1 }, { unique: true })
db.subscription_usage.createIndex({ periodEnd: 1 })
```

### Enhanced `purchase_orders` Collection

Add these fields to the existing schema:

```javascript
{
  // ... existing fields ...
  
  // Recipient Info (supports both Vendor and Professional)
  recipientType: String,         // 'vendor' | 'professional'
  recipientId: ObjectId,         // ProfileId
  recipientUserId: ObjectId,     // Primary contact
  
  // ISO 9001 Compliance Fields
  isoCompliance: {
    termsAndConditions: [String],
    qualityRequirements: [String],
    warrantyPeriod: String,
    penaltyClause: String,
    complianceCertificates: [ObjectId]
  },
  
  // Vendor/Professional Response
  vendorResponse: {
    status: String,              // 'pending' | 'accepted' | 'rejected' | 'negotiating'
    respondedAt: Date,
    respondedBy: ObjectId,
    comments: String,
    digitalSignature: {
      signedBy: String,
      designation: String,
      signedAt: Date,
      signatureHash: String
    },
    negotiationNotes: String,
    negotiationHistory: [{
      field: String,
      originalValue: Mixed,
      proposedValue: Mixed,
      reason: String,
      status: String,            // 'pending' | 'accepted' | 'rejected'
      respondedAt: Date
    }]
  },
  
  // Sending Info
  sentToVendorAt: Date,
  sentBy: ObjectId,
  acceptanceDeadline: Date,
  remindersSent: [{
    sentAt: Date,
    type: String                 // 'deadline_approaching' | 'overdue'
  }],
  
  // PDF Export Tracking
  exports: [{
    exportedAt: Date,
    exportedBy: ObjectId,
    format: String,              // 'pdf'
    template: String,            // 'standard' | 'detailed' | 'compact'
    url: String,
    expiresAt: Date
  }]
}
```

---

## Backend Implementation Tasks

| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| Create `subscription_usage` collection & indexes | High | 1.5h | - |
| Implement PO limit check middleware | High | 2h | subscription_usage |
| Update `purchase_orders` schema with new fields | High | 1.5h | - |
| GET /purchase-orders/limit endpoint | High | 1.5h | subscription_usage |
| GET /quotations/:id/po-prefill endpoint | High | 2h | - |
| Enhanced POST /purchase-orders with limit check | High | 3h | Limit middleware |
| POST /purchase-orders/:id/send endpoint | High | 2h | - |
| GET /purchase-orders/:id/export/pdf | High | 4h | PDF generator |
| Vendor: GET /vendors/purchase-orders | High | 2h | - |
| Vendor: GET /vendors/purchase-orders/:id | High | 1.5h | - |
| Vendor: POST /vendors/purchase-orders/:id/respond | High | 2.5h | - |
| Professional endpoints (mirror vendor) | Medium | 2h | Vendor endpoints |
| Email template implementations (10 templates) | Medium | 5h | - |
| Scheduled job: usage period reset | Medium | 1.5h | subscription_usage |
| Scheduled job: acceptance reminders | Medium | 1h | - |

**Total Backend Effort:** ~32 hours

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| PO_LIMIT_REACHED | 403 | Monthly PO generation limit exceeded |
| PO_LIMIT_CHECK_FAILED | 500 | Unable to verify subscription limits |
| QUOTATION_NOT_APPROVED | 400 | Cannot create PO from non-approved quotation |
| QUOTATION_NOT_FOUND | 404 | Referenced quotation does not exist |
| PO_NOT_FOUND | 404 | Purchase order not found |
| PO_NOT_APPROVED | 400 | PO must be approved before sending |
| PO_ALREADY_SENT | 400 | PO has already been sent to vendor |
| PO_ALREADY_RESPONDED | 400 | Vendor has already responded to this PO |
| INVALID_RESPONSE_ACTION | 400 | Invalid action (must be accept/reject/negotiate) |
| ACCEPTANCE_DEADLINE_PASSED | 400 | Acceptance deadline has expired |
| UNAUTHORIZED_ACCESS | 403 | User not authorized to access this PO |
| PDF_GENERATION_FAILED | 500 | Failed to generate PDF document |
