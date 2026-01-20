# Quotes Collection Schema

> Enhanced schema for the `quotes` collection to support the Vendor Quotation Submission feature.

## Overview

This document defines the complete data structure for storing vendor quotations. The schema supports:
- Multi-step quotation form data (Pricing, Timeline, Technical, Terms)
- Status management for My Quotations module (Drafts, Submitted, Accepted, Rejected)
- Activity logging for audit trails
- Document attachments

---

## Collection: `quotes`

### Core Reference Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Yes | Primary key (auto-generated) |
| `quotationNumber` | String | Yes | Unique identifier (format: `QUO-YYYY-MM-DD-{shortId}`) |
| `rfqId` | ObjectId | Yes | Reference to `rfqs` collection |
| `requirementId` | ObjectId | Yes | Reference to `requirements` collection |
| `stakeholderId` | ObjectId | Yes | Vendor/Professional ID |
| `stakeholderType` | String | Yes | Enum: `vendor`, `professional` |
| `industryId` | ObjectId | Yes | Reference to `industryProfiles` collection |

### Pricing Section

```javascript
"pricing": {
  "lineItems": [{
    "id": String,              // Client-generated UUID
    "description": String,     // Required, item description
    "quantity": Number,        // Required, must be > 0
    "unitPrice": Number,       // Required, must be >= 0
    "total": Number            // Required, auto-calculated: quantity * unitPrice
  }],
  "subtotal": Number,          // Required, sum of all lineItems.total
  "taxRate": Number,           // Default: 0, percentage (0-100)
  "taxAmount": Number,         // Default: 0, auto-calculated: subtotal * (taxRate/100)
  "totalAmount": Number,       // Required, subtotal + taxAmount
  "currency": String,          // Default: "INR", ISO 4217 code
  "paymentTerms": String       // Required, enum values below
}
```

**Payment Terms Enum Values:**
- `advance` - 100% Advance Payment
- `net_30` - Net 30 Days
- `net_60` - Net 60 Days
- `milestone` - Milestone-based Payment
- `cod` - Cash on Delivery
- `50_50` - 50% Advance, 50% on Delivery

### Timeline Section

```javascript
"timeline": {
  "proposedStartDate": Date,        // Required
  "proposedCompletionDate": Date,   // Required, must be after startDate
  "durationDays": Number,           // Auto-calculated by backend
  "milestones": [{
    "id": String,                   // Client-generated UUID
    "name": String,                 // Required, milestone title
    "deliverables": String,         // Required, description of deliverables
    "dueDate": Date,                // Required
    "amount": Number                // Default: 0, payment amount for this milestone
  }]
}
```

### Technical Proposal Section

```javascript
"technicalProposal": {
  "methodology": String,                  // Required, min 50 characters
  "technicalSpecifications": String,      // Optional
  "qualityAssurance": String,             // Optional
  "complianceCertifications": [String]    // Array of certification names
}
```

**Compliance Certifications Enum Values:**
- `ISO 9001` - Quality Management
- `ISO 14001` - Environmental Management
- `ISO 27001` - Information Security
- `ISO 45001` - Occupational Health & Safety
- `CE Marking` - European Conformity
- `BIS` - Bureau of Indian Standards
- `FSSAI` - Food Safety (if applicable)
- `GMP` - Good Manufacturing Practice

### Terms & Conditions Section

```javascript
"termsAndConditions": {
  "warrantyPeriod": String,       // Required, enum values below
  "supportTerms": String,         // Required, enum values below
  "cancellationPolicy": String,   // Required, enum values below
  "specialConditions": String     // Optional, free text
}
```

**Warranty Period Enum Values:**
- `none` - No Warranty
- `3_months` - 3 Months
- `6_months` - 6 Months
- `12_months` - 12 Months
- `24_months` - 24 Months
- `lifetime` - Lifetime Warranty

**Support Terms Enum Values:**
- `none` - No Support Included
- `email` - Email Support Only
- `business_hours` - Business Hours Support (9-6)
- `extended` - Extended Hours Support (8-10)
- `24_7` - 24/7 Support

**Cancellation Policy Enum Values:**
- `no_refund` - No Refund on Cancellation
- `7_days` - Full Refund within 7 Days
- `14_days` - Full Refund within 14 Days
- `30_days` - Full Refund within 30 Days
- `pro_rata` - Pro-rata Refund Based on Work Done

### Documents Section

```javascript
"documents": [{
  "id": String,           // Unique document ID
  "name": String,         // Original filename
  "type": String,         // MIME type (application/pdf, etc.)
  "size": Number,         // File size in bytes
  "url": String,          // Storage URL
  "uploadedAt": Date      // Upload timestamp
}]
```

**Allowed Document Types:**
- `application/pdf` - PDF documents
- `application/msword` - DOC files
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` - DOCX files
- `application/vnd.ms-excel` - XLS files
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` - XLSX files
- `image/png`, `image/jpeg` - Images

**Max File Size:** 10MB per document

### Status Management

```javascript
"status": String  // Enum values below
```

**Status Enum Values:**

| Status | Description | Allowed Transitions |
|--------|-------------|---------------------|
| `draft` | Initial state, quotation being prepared | → `submitted` |
| `submitted` | Sent to industry for review | → `under_review`, `withdrawn` |
| `under_review` | Industry is evaluating | → `accepted`, `rejected`, `withdrawn` |
| `accepted` | Quotation accepted by industry | Terminal state |
| `rejected` | Quotation rejected by industry | Terminal state |
| `withdrawn` | Vendor withdrew the quotation | Terminal state |
| `expired` | Validity period passed | Terminal state |

### Validity & Dates

| Field | Type | Description |
|-------|------|-------------|
| `validUntil` | Date | Quotation validity expiry (default: 30 days from submission) |
| `createdAt` | Date | Document creation timestamp |
| `updatedAt` | Date | Last modification timestamp |
| `submittedAt` | Date | When status changed to `submitted` |

### Evaluation (Industry Side)

```javascript
"evaluation": {
  "score": Number,              // 0-100 rating
  "notes": String,              // Internal evaluation notes
  "reviewedBy": ObjectId,       // User who reviewed
  "reviewedAt": Date            // Review timestamp
}
```

### Action Details (Accept/Reject)

```javascript
"actionDetails": {
  "reason": String,             // Reason for rejection/acceptance
  "feedback": String,           // Additional feedback to vendor
  "actionBy": ObjectId,         // User who took action
  "actionAt": Date              // Action timestamp
}
```

### Withdrawal (Vendor Initiated)

```javascript
"withdrawal": {
  "reason": String,             // Required when withdrawing
  "withdrawnAt": Date           // Withdrawal timestamp
}
```

### Activity Log

```javascript
"activityLog": [{
  "action": String,             // Action type (see below)
  "timestamp": Date,            // When action occurred
  "performedBy": ObjectId,      // User who performed action
  "details": String             // Additional context
}]
```

**Action Types:**
- `created` - Quotation draft created
- `updated` - Draft was updated
- `submitted` - Quotation submitted
- `viewed` - Industry viewed the quotation
- `under_review` - Moved to review
- `accepted` - Quotation accepted
- `rejected` - Quotation rejected
- `withdrawn` - Vendor withdrew
- `expired` - Quotation expired
- `document_added` - Document uploaded
- `document_removed` - Document deleted

---

## Indexes

```javascript
// Create these indexes for optimal query performance

// Primary lookups
db.quotes.createIndex({ "quotationNumber": 1 }, { unique: true });
db.quotes.createIndex({ "stakeholderId": 1 });
db.quotes.createIndex({ "rfqId": 1 });
db.quotes.createIndex({ "industryId": 1 });

// Status filtering (My Quotations module)
db.quotes.createIndex({ "status": 1 });
db.quotes.createIndex({ "stakeholderId": 1, "status": 1 });

// Date-based queries
db.quotes.createIndex({ "createdAt": -1 });
db.quotes.createIndex({ "submittedAt": -1 });
db.quotes.createIndex({ "validUntil": 1 });

// Compound for common queries
db.quotes.createIndex({ 
  "stakeholderId": 1, 
  "status": 1, 
  "createdAt": -1 
});
```

---

## Validation Rules

### On Create (Draft)
1. `rfqId` must exist and RFQ must be open
2. Vendor must not have existing quotation for this RFQ
3. `stakeholderId` extracted from auth token
4. `quotationNumber` auto-generated
5. `status` set to `draft`
6. `createdAt` and `updatedAt` set to now

### On Submit
1. All required fields in pricing section must be filled
2. At least one line item required
3. `methodology` must be at least 50 characters
4. `proposedCompletionDate` must be after `proposedStartDate`
5. `validUntil` set to 30 days from now (if not specified)
6. `status` changed to `submitted`
7. `submittedAt` set to now
8. Activity log entry added

### On Update (Draft Only)
1. Can only update if `status === 'draft'`
2. `updatedAt` set to now
3. Activity log entry added

### On Status Change
1. Validate transition is allowed (see status table)
2. Add activity log entry
3. Update `updatedAt`
4. Send appropriate notifications

---

## Migration Notes

### From Existing Schema

If migrating from an existing `quotes` collection:

1. **Add new fields with defaults:**
```javascript
db.quotes.updateMany(
  { technicalProposal: { $exists: false } },
  { 
    $set: { 
      technicalProposal: {
        methodology: "",
        technicalSpecifications: "",
        qualityAssurance: "",
        complianceCertifications: []
      },
      termsAndConditions: {
        warrantyPeriod: "none",
        supportTerms: "none",
        cancellationPolicy: "no_refund",
        specialConditions: ""
      },
      activityLog: [],
      evaluation: null,
      actionDetails: null,
      withdrawal: null
    }
  }
);
```

2. **Migrate existing pricing structure:**
```javascript
// If pricing was flat, convert to new structure
db.quotes.updateMany(
  { "pricing.lineItems": { $exists: false } },
  [{
    $set: {
      "pricing.lineItems": [{
        id: { $toString: "$_id" },
        description: "Quotation Amount",
        quantity: 1,
        unitPrice: "$pricing.totalAmount",
        total: "$pricing.totalAmount"
      }],
      "pricing.subtotal": "$pricing.totalAmount",
      "pricing.taxRate": 0,
      "pricing.taxAmount": 0
    }
  }]
);
```

3. **Generate quotation numbers for existing records:**
```javascript
db.quotes.find({ quotationNumber: { $exists: false } }).forEach(doc => {
  const date = doc.createdAt.toISOString().split('T')[0];
  const shortId = doc._id.toString().slice(-8);
  db.quotes.updateOne(
    { _id: doc._id },
    { $set: { quotationNumber: `QUO-${date}-${shortId}` } }
  );
});
```

---

## Sample Document

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "quotationNumber": "QUO-2026-01-05-39439011",
  "rfqId": ObjectId("507f1f77bcf86cd799439012"),
  "requirementId": ObjectId("507f1f77bcf86cd799439013"),
  "stakeholderId": ObjectId("507f1f77bcf86cd799439014"),
  "stakeholderType": "vendor",
  "industryId": ObjectId("507f1f77bcf86cd799439015"),
  
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
    "proposedStartDate": ISODate("2026-02-01T00:00:00Z"),
    "proposedCompletionDate": ISODate("2026-04-15T00:00:00Z"),
    "durationDays": 73,
    "milestones": [
      {
        "id": "milestone_1",
        "name": "Phase 1 - Design",
        "deliverables": "Complete design documentation",
        "dueDate": ISODate("2026-02-15T00:00:00Z"),
        "amount": 25000
      },
      {
        "id": "milestone_2",
        "name": "Phase 2 - Development",
        "deliverables": "Core implementation complete",
        "dueDate": ISODate("2026-03-30T00:00:00Z"),
        "amount": 50000
      }
    ]
  },
  
  "technicalProposal": {
    "methodology": "We will employ an agile methodology with bi-weekly sprints...",
    "technicalSpecifications": "Using latest industry standards",
    "qualityAssurance": "Rigorous testing including unit tests",
    "complianceCertifications": ["ISO 9001", "ISO 14001"]
  },
  
  "termsAndConditions": {
    "warrantyPeriod": "12_months",
    "supportTerms": "24_7",
    "cancellationPolicy": "30_days",
    "specialConditions": "Payment via bank transfer only"
  },
  
  "documents": [
    {
      "id": "doc_1",
      "name": "Technical_Proposal.pdf",
      "type": "application/pdf",
      "size": 2048576,
      "url": "https://storage.example.com/docs/technical_proposal.pdf",
      "uploadedAt": ISODate("2026-01-05T19:30:00Z")
    }
  ],
  
  "status": "submitted",
  "validUntil": ISODate("2026-02-05T23:59:59Z"),
  
  "evaluation": null,
  "actionDetails": null,
  "withdrawal": null,
  
  "activityLog": [
    {
      "action": "created",
      "timestamp": ISODate("2026-01-05T19:25:00Z"),
      "performedBy": ObjectId("507f1f77bcf86cd799439014"),
      "details": "Quotation draft created"
    },
    {
      "action": "submitted",
      "timestamp": ISODate("2026-01-05T19:30:00Z"),
      "performedBy": ObjectId("507f1f77bcf86cd799439014"),
      "details": "Quotation submitted for review"
    }
  ],
  
  "createdAt": ISODate("2026-01-05T19:25:00Z"),
  "updatedAt": ISODate("2026-01-05T19:30:00Z"),
  "submittedAt": ISODate("2026-01-05T19:30:00Z")
}
```
