# Vendor Certifications & Portfolio API Specification

## Base URL
```
/api/v1/vendors
```

All endpoints require authentication via Bearer token. The vendor is identified from the authenticated user's context.

---

## 1. Certifications API

### 1.1 List Certifications

```
GET /api/v1/vendors/certifications
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| status | string | — | Filter: `active`, `expired`, `pending_renewal` |
| search | string | — | Search by name or issuing body |

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "certifications": [
      {
        "_id": "cert_abc123",
        "vendorId": "vendor_xyz",
        "name": "ISO 9001:2015",
        "issuingBody": "Bureau Veritas",
        "certificationNumber": "QMS-2024-001",
        "issueDate": "2024-01-15T00:00:00.000Z",
        "expiryDate": "2027-01-15T00:00:00.000Z",
        "status": "active",
        "category": "Quality Management",
        "description": "Quality Management System certification",
        "document": {
          "_id": "doc_001",
          "fileName": "iso9001-certificate.pdf",
          "fileUrl": "https://storage.example.com/certs/iso9001.pdf",
          "fileSize": 245000,
          "mimeType": "application/pdf",
          "uploadedAt": "2024-01-20T10:30:00.000Z"
        },
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 3,
      "total": 25
    }
  }
}
```

---

### 1.2 Add Certification

```
POST /api/v1/vendors/certifications
```

**Request Body:**
```json
{
  "name": "ISO 9001:2015",
  "issuingBody": "Bureau Veritas",
  "certificationNumber": "QMS-2024-001",
  "issueDate": "2024-01-15",
  "expiryDate": "2027-01-15",
  "category": "Quality Management",
  "description": "Quality Management System certification"
}
```

**Validation Rules:**
| Field | Required | Constraints |
|-------|----------|-------------|
| name | ✅ | 2–200 characters |
| issuingBody | ✅ | 2–200 characters |
| certificationNumber | ❌ | Max 100 characters |
| issueDate | ✅ | Valid ISO date, must be ≤ today |
| expiryDate | ❌ | Must be after issueDate |
| category | ✅ | Non-empty string |
| description | ❌ | Max 1000 characters |

**Response — 201 Created:**
```json
{
  "success": true,
  "data": { /* VendorCertification object */ },
  "message": "Certification added successfully"
}
```

---

### 1.3 Update Certification

```
PUT /api/v1/vendors/certifications/:id
```

**Path Params:** `id` — Certification ID

**Request Body:** Partial certification fields (same as create, all optional).

**Response — 200 OK:**
```json
{
  "success": true,
  "data": { /* Updated VendorCertification object */ },
  "message": "Certification updated successfully"
}
```

**Errors:**
- `404` — Certification not found or does not belong to vendor

---

### 1.4 Delete Certification

```
DELETE /api/v1/vendors/certifications/:id
```

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Certification deleted successfully"
}
```

---

### 1.5 Upload Certificate Document

```
POST /api/v1/vendors/certifications/:id/document
```

**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| document | File | ✅ | PDF, JPG, PNG. Max 10 MB |

**Response — 200 OK:**
```json
{
  "success": true,
  "data": { /* Updated VendorCertification with document field populated */ },
  "message": "Document uploaded successfully"
}
```

**Behavior:**
- Replaces existing document if one already exists
- Old file is deleted from storage

---

### 1.6 Delete Certificate Document

```
DELETE /api/v1/vendors/certifications/:id/document
```

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

## 2. Portfolio / Projects API

### 2.1 List Projects

```
GET /api/v1/vendors/portfolio/projects
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| status | string | — | Filter: `completed`, `in_progress`, `planned` |
| search | string | — | Search by project name or client name |

**Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "_id": "proj_abc123",
        "vendorId": "vendor_xyz",
        "name": "Factory Automation System",
        "clientName": "Acme Manufacturing",
        "description": "Complete factory automation with PLC and SCADA integration",
        "startDate": "2023-06-01T00:00:00.000Z",
        "endDate": "2024-02-28T00:00:00.000Z",
        "status": "completed",
        "technologies": ["PLC", "SCADA", "IoT", "HMI"],
        "outcomes": "30% improvement in production efficiency",
        "projectValue": 250000,
        "currency": "USD",
        "image": {
          "_id": "img_001",
          "fileName": "factory-automation.jpg",
          "fileUrl": "https://storage.example.com/portfolio/factory.jpg",
          "fileSize": 1200000,
          "mimeType": "image/jpeg",
          "uploadedAt": "2024-03-01T10:00:00.000Z"
        },
        "createdAt": "2024-03-01T10:00:00.000Z",
        "updatedAt": "2024-03-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 2,
      "total": 12
    }
  }
}
```

---

### 2.2 Add Project

```
POST /api/v1/vendors/portfolio/projects
```

**Request Body:**
```json
{
  "name": "Factory Automation System",
  "clientName": "Acme Manufacturing",
  "description": "Complete factory automation with PLC and SCADA integration",
  "startDate": "2023-06-01",
  "endDate": "2024-02-28",
  "status": "completed",
  "technologies": ["PLC", "SCADA", "IoT"],
  "outcomes": "30% improvement in production efficiency",
  "projectValue": 250000,
  "currency": "USD"
}
```

**Validation Rules:**
| Field | Required | Constraints |
|-------|----------|-------------|
| name | ✅ | 2–200 characters |
| clientName | ❌ | Max 200 characters |
| description | ✅ | 10–2000 characters |
| startDate | ✅ | Valid ISO date |
| endDate | ❌ | Must be after startDate |
| status | ✅ | `completed`, `in_progress`, `planned` |
| technologies | ✅ | Array of strings, at least 1 |
| outcomes | ❌ | Max 1000 characters |
| projectValue | ❌ | Positive number |
| currency | ❌ | 3-letter ISO code (default: `USD`) |

**Response — 201 Created:**
```json
{
  "success": true,
  "data": { /* PortfolioProject object */ },
  "message": "Project added successfully"
}
```

---

### 2.3 Update Project

```
PUT /api/v1/vendors/portfolio/projects/:id
```

**Path Params:** `id` — Project ID

**Request Body:** Partial project fields (same as create, all optional).

**Response — 200 OK:**
```json
{
  "success": true,
  "data": { /* Updated PortfolioProject object */ },
  "message": "Project updated successfully"
}
```

---

### 2.4 Delete Project

```
DELETE /api/v1/vendors/portfolio/projects/:id
```

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

### 2.5 Upload Project Image

```
POST /api/v1/vendors/portfolio/projects/:id/image
```

**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| image | File | ✅ | JPG, PNG, WEBP. Max 5 MB |

**Response — 200 OK:**
```json
{
  "success": true,
  "data": { /* Updated PortfolioProject with image field populated */ },
  "message": "Image uploaded successfully"
}
```

---

### 2.6 Delete Project Image

```
DELETE /api/v1/vendors/portfolio/projects/:id/image
```

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## 3. Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "name", "message": "Name is required" }
  ]
}
```

**Common HTTP Status Codes:**
| Code | Description |
|------|-------------|
| 400 | Validation error |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — not the owner of the resource |
| 404 | Resource not found |
| 413 | File too large |
| 500 | Internal server error |

---

## 4. Data Models

### VendorCertification (MongoDB)
```
{
  vendorId: ObjectId (ref: Vendor),
  name: String (required),
  issuingBody: String (required),
  certificationNumber: String,
  issueDate: Date (required),
  expiryDate: Date,
  status: String (enum: active, expired, pending_renewal),
  category: String (required),
  description: String,
  document: {
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: Date
  },
  timestamps: true
}
```

### PortfolioProject (MongoDB)
```
{
  vendorId: ObjectId (ref: Vendor),
  name: String (required),
  clientName: String,
  description: String (required),
  startDate: Date (required),
  endDate: Date,
  status: String (enum: completed, in_progress, planned),
  technologies: [String] (required, min 1),
  outcomes: String,
  projectValue: Number,
  currency: String (default: USD),
  image: {
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: Date
  },
  timestamps: true
}
```

---

## 5. Business Rules

1. **Certification Status Auto-Update**: Backend should run a scheduled job to update `status` to `expired` when `expiryDate` passes, and `pending_renewal` 30 days before expiry.
2. **Vendor Isolation**: All queries must filter by the authenticated vendor's ID. Vendors can only CRUD their own data.
3. **File Storage**: Documents and images should be stored in cloud storage (S3/GCS) with signed URLs for access.
4. **Public Profile**: Active certifications and completed projects appear on the vendor's public profile visible to industry buyers in the Diligince HUB.
