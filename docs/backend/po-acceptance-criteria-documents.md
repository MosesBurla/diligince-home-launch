# Backend Requirements: Purchase Order Enhancements

## Overview

This document outlines the backend API changes required to support:
1. Human-readable requirement numbers in quotation responses
2. Document attachments for acceptance criteria in purchase orders

---

## 1. Requirement Number in Quotation Responses

### Current Issue
The quotation list endpoints return `requirementId` (MongoDB ObjectId), which displays as a hash in the UI (e.g., `#695c0638f0e6a8d036356fdb`).

### Required Change
Add `requirementNumber` field to quotation responses.

### Affected Endpoints
- `GET /api/v1/industry/quotations/pending`
- `GET /api/v1/industry/quotations/approved`
- `GET /api/v1/industry/quotations` (all quotations)

### Current Response
```json
{
  "success": true,
  "data": {
    "quotations": [{
      "id": "quot_123",
      "quotationNumber": "QOT-2026-0042",
      "requirementId": "695c0638f0e6a8d036356fdb",
      "requirementTitle": "Office Furniture Supply",
      "vendorName": "ABC Suppliers",
      ...
    }]
  }
}
```

### Required Response
```json
{
  "success": true,
  "data": {
    "quotations": [{
      "id": "quot_123",
      "quotationNumber": "QOT-2026-0042",
      "requirementId": "695c0638f0e6a8d036356fdb",
      "requirementNumber": "REQ-2026-01-0042",  // NEW FIELD
      "requirementTitle": "Office Furniture Supply",
      "vendorName": "ABC Suppliers",
      ...
    }]
  }
}
```

### Backend Implementation
1. Join/populate requirement data when fetching quotations
2. Include the `requirementNumber` field from the requirements collection
3. Apply to all quotation list endpoints

### Estimated Effort
**1-2 hours**

---

## 2. Document Attachments for Acceptance Criteria

### Feature Description
Each acceptance criteria entry in a purchase order can now have optional document attachments. This allows users to attach specifications, reference documents, or verification templates to individual criteria.

### Schema Update Required

#### Current Acceptance Criteria Schema
```javascript
{
  criteria: String,
  status: { type: String, enum: ['pending', 'met', 'failed'] },
  verifiedAt: Date,
  verifiedBy: String,
  notes: String
}
```

#### Updated Acceptance Criteria Schema
```javascript
{
  criteria: String,
  status: { type: String, enum: ['pending', 'met', 'failed'] },
  verifiedAt: Date,
  verifiedBy: String,
  notes: String,
  documents: [{                    // NEW FIELD
    id: String,
    name: String,
    size: Number,                  // File size in bytes
    type: String,                  // MIME type
    url: String,                   // Storage URL
    uploadedAt: Date
  }]
}
```

### API Changes

#### A. Create Purchase Order Endpoint
**Endpoint:** `POST /api/v1/industry/purchase-orders`

**Updated Request Body (acceptanceCriteria section):**
```json
{
  "acceptanceCriteria": [
    {
      "criteria": "All deliverables must pass quality inspection",
      "documents": [
        {
          "id": "doc_abc123",
          "name": "quality_checklist.pdf",
          "size": 102400,
          "type": "application/pdf",
          "url": "https://storage.example.com/po/criteria/quality_checklist.pdf"
        }
      ]
    },
    {
      "criteria": "Installation must be completed within 48 hours",
      "documents": []
    }
  ]
}
```

**Validation Rules:**
- `documents` is optional (default: empty array)
- Maximum 3 documents per criteria
- Maximum file size: 10MB per file
- Allowed file types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG

#### B. Update Purchase Order Endpoint
**Endpoint:** `PUT /api/v1/industry/purchase-orders/:orderId`

Same structure as create - documents array can be updated for each criteria.

#### C. Get Purchase Order Detail Endpoint
**Endpoint:** `GET /api/v1/industry/purchase-orders/:orderId`

**Response should include documents in acceptanceCriteria:**
```json
{
  "success": true,
  "data": {
    "id": "po_123",
    "orderNumber": "PO-2026-0001",
    ...
    "acceptanceCriteria": [
      {
        "id": "crit_001",
        "criteria": "All deliverables must pass quality inspection",
        "status": "pending",
        "documents": [
          {
            "id": "doc_abc123",
            "name": "quality_checklist.pdf",
            "size": 102400,
            "type": "application/pdf",
            "url": "https://storage.example.com/po/criteria/quality_checklist.pdf",
            "uploadedAt": "2026-01-29T10:00:00Z"
          }
        ]
      }
    ]
  }
}
```

#### D. File Upload Endpoint (If using separate upload flow)

If the frontend uploads files separately before submitting the form:

**Endpoint:** `POST /api/v1/uploads/po-documents`

**Request:** Multipart form-data with file

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "doc_abc123",
    "name": "quality_checklist.pdf",
    "size": 102400,
    "type": "application/pdf",
    "url": "https://storage.example.com/po/criteria/quality_checklist.pdf",
    "uploadedAt": "2026-01-29T10:00:00Z"
  }
}
```

**Alternative:** If using existing upload infrastructure, reuse that endpoint and store the returned URL.

### Estimated Effort

| Task | Time |
|------|------|
| Update database schema | 30 min |
| Update Joi/Zod validation | 30 min |
| Update create PO endpoint | 1 hour |
| Update get PO endpoint | 30 min |
| Update update PO endpoint | 30 min |
| Testing | 1 hour |
| **Total** | **4 hours** |

---

## Summary

| Task | Priority | Estimated Time |
|------|----------|----------------|
| Add `requirementNumber` to quotation responses | High | 1-2 hours |
| Add documents support to acceptance criteria | Medium | 4 hours |
| **Total** | | **5-6 hours** |

---

## Frontend Status

The frontend has been updated to:
1. Display `requirementNumber` (with fallback to `requirementTitle`) in Approved Quotations
2. Support document attachments in the acceptance criteria form
3. Restrict "Create PO" menu item to only be accessible from Approved Quotations page

Once backend changes are deployed, the features will be fully functional.
