# Vendor Profile API Specification

This document defines the API contract between the frontend and backend for vendor profile management.

---

## Base URL

```
/api/v1/vendors
```

---

## Endpoints

### 1. Get Vendor Profile

**GET** `/profile`

#### Response (Expected Structure)

```json
{
  "id": "uuid",
  "userId": "uuid",
  "vendorType": "service" | "product",
  "companyName": "Company Name",
  "description": "Company description",
  "email": "contact@company.com",
  "mobile": "+91 9876543210",
  "website": "https://company.com",
  "address": "123 Business Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "panNumber": "ABCDE1234F",
  "gstNumber": "22ABCDE1234F1Z5",
  "industryFocus": ["technology", "healthcare"],
  "companySize": "51-200",
  "foundedYear": 2015,
  "documents": [
    {
      "id": "doc-uuid",
      "type": "pan_card",
      "name": "PAN Card",
      "url": "https://storage.example.com/documents/pan-card.pdf",
      "status": "verified" | "pending" | "rejected",
      "uploadedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "verificationStatus": "pending" | "verified" | "rejected",
  "profileCompleteness": 75,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Current Backend Issues (Frontend Normalizer Handles These)

| Issue | Current Backend | Expected |
|-------|-----------------|----------|
| Profile wrapper | `{ profile: { ... } }` | `{ ... }` (flat) |
| Contact info | `{ contactInfo: { email, mobile } }` | `{ email, mobile }` (flat) |
| Business registration | `{ businessRegistration: { panNumber, gstNumber } }` | `{ panNumber, gstNumber }` (flat) |
| Documents array | `verificationDocuments` | `documents` |
| Document type field | `fileType` | `type` |
| Document URLs | Relative paths | Full URLs |

---

### 2. Update Vendor Profile

**POST** `/profile`

#### Request Body

```json
{
  "companyName": "Updated Company Name",
  "description": "Updated description",
  "email": "new@company.com",
  "mobile": "+91 9876543210",
  "website": "https://company.com",
  "address": "456 New Street",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001",
  "panNumber": "ABCDE1234F",
  "gstNumber": "22ABCDE1234F1Z5",
  "industryFocus": ["technology", "fintech"],
  "companySize": "201-500"
}
```

#### Response

Returns the updated profile in the same format as GET `/profile`.

---

### 3. Upload Document

**POST** `/profile/documents/upload`

#### Request

- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `file`: The document file (PDF, JPG, PNG)
  - `type`: Document type (`pan_card`, `gst_certificate`, `incorporation_certificate`, `bank_statement`, `cancelled_cheque`, `address_proof`)

#### Response

```json
{
  "id": "doc-uuid",
  "type": "pan_card",
  "name": "PAN Card",
  "url": "https://storage.example.com/documents/pan-card.pdf",
  "status": "pending",
  "uploadedAt": "2024-01-15T10:30:00Z"
}
```

#### Current Backend Issues

| Issue | Current Backend | Expected |
|-------|-----------------|----------|
| Document wrapper | `{ document: { ... } }` | `{ ... }` (flat) |
| Type field | `fileType` | `type` |
| URL format | Relative path | Full URL |

---

### 4. Delete Document

**DELETE** `/profile/documents/:documentId`

#### Response

```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

### 5. Submit for Verification

**POST** `/profile/submit-verification`

#### Response

```json
{
  "success": true,
  "message": "Profile submitted for verification",
  "verificationStatus": "pending"
}
```

---

### 6. Get Profile Completion Status

**GET** `/profile/completion-status`

#### Response

```json
{
  "completeness": 75,
  "missingFields": ["gstNumber", "bankDetails"],
  "requiredDocuments": {
    "uploaded": ["pan_card"],
    "missing": ["gst_certificate", "cancelled_cheque"]
  }
}
```

---

## Field Mapping Reference

### Frontend to Backend Field Mapping

When saving a profile, the frontend transforms data to match the backend's expected nested structure:

| Frontend Field | Backend Expected Path | Notes |
|----------------|----------------------|-------|
| `email` | `contactInfo.email` | Also sent flat for compatibility |
| `mobile` | `contactInfo.phone` | Also sent flat for compatibility |
| `telephone` | `contactInfo.telephone` | Optional |
| `website` | `contactInfo.website` | Optional |
| `panNumber` | `businessRegistration.taxId` | Also sent flat for compatibility |
| `gstNumber` | `businessRegistration.gstNumber` | Also sent flat for compatibility |
| `registrationNumber` | `businessRegistration.registrationNumber` | Also sent flat for compatibility |
| `addresses[0].line1` | `contactInfo.address.line1` | Primary address |
| `addresses[0].city` | `contactInfo.address.city` | Primary address |
| `addresses[0].state` | `contactInfo.address.state` | Primary address |
| `addresses[0].pincode` | `contactInfo.address.pincode` | Primary address |
| `addresses` | `addresses` | Full array also sent |
| `paymentTerms` | `paymentTerms` | Array of strings |
| `qualityStandards` | `qualityStandards` | Array of strings |
| `documents` | `documents` | Rename from `verificationDocuments` |
| `documents[].type` | `documents[].type` | Rename from `fileType` |
| `documents[].url` | `documents[].url` | Must be full URL |

### Backend to Frontend Field Mapping (Normalization)

When receiving a profile, the frontend handles multiple backend structures:

| Backend Path | Frontend Field | Fallback Paths |
|--------------|----------------|----------------|
| `email` | `email` | `contactInfo.email` |
| `mobile` | `mobile` | `phone`, `contactInfo.phone`, `contactInfo.mobile` |
| `panNumber` | `panNumber` | `businessRegistration.taxId`, `businessRegistration.panNumber` |
| `gstNumber` | `gstNumber` | `businessRegistration.gstNumber` |
| `registrationNumber` | `registrationNumber` | `businessRegistration.registrationNumber` |
| `addresses` | `addresses` | `contactInfo.address` (wrapped in array), flat fields |
| `documents` | `documents` | `verificationDocuments` |

---

## Document Types

### Current Frontend Document Types

| Type Key | Display Name | Category |
|----------|--------------|----------|
| `gst_certificate` | GST Certificate | Mandatory |
| `pan_card` | PAN Card | Mandatory |
| `registration_certificate` | Registration Certificate | Mandatory |
| `service_certifications` | Service Certifications | Service Vendor |
| `insurance_certificate` | Insurance Certificate | Service Vendor |
| `technical_qualifications` | Technical Qualifications | Service Vendor |
| `product_certifications` | Product Certifications | Product Vendor |
| `quality_certificates` | Quality Certificates | Product Vendor |
| `manufacturer_authorization` | Manufacturer Authorization | Product Vendor |
| `product_catalog` | Product Catalog | Product Vendor |
| `transport_license` | Transport License | Logistics Vendor |
| `vehicle_registration` | Vehicle Registration | Logistics Vendor |
| `goods_insurance` | Goods Insurance | Logistics Vendor |
| `warehouse_license` | Warehouse License | Logistics Vendor |
| `address_proof` | Address Proof | Optional |

### Backend Expected Document Types (from 422 error)

The backend appears to expect different document type values:

| Backend Expected | Frontend Current | Action Required |
|------------------|------------------|-----------------|
| `business_registration` | `registration_certificate` | Backend to accept both |
| `tax_document` | `pan_card` | Backend to accept both |
| `quality_certification` | `quality_certificates` | Backend to accept both |
| `address_proof` | `address_proof` | ✅ Matches |

**Recommendation**: Backend should accept both naming conventions and map internally.

---

## Verification Status Values

| Status | Description |
|--------|-------------|
| `incomplete` | Profile not ready for submission |
| `pending` | Awaiting verification |
| `approved` | Successfully verified |
| `rejected` | Verification failed |

---

## Required Fields for Verification

Based on the 422 error response, the following fields are required:

### Profile Fields
- `businessRegistration.registrationNumber` (frontend: `registrationNumber`)
- `businessRegistration.taxId` (frontend: `panNumber`)
- `contactInfo.email` (frontend: `email`)
- `contactInfo.phone` (frontend: `mobile`)
- `contactInfo.address` (frontend: `addresses[0]`)
- `paymentTerms` (frontend: `paymentTerms`)
- `qualityStandards` (frontend: `qualityStandards`)

### Required Documents
- `business_registration` or `registration_certificate`
- `tax_document` or `pan_card`
- `quality_certification` or `quality_certificates`
- `address_proof`

---

## Backend Checklist

- [ ] Remove `profile` wrapper from GET response
- [ ] Flatten `contactInfo` → move `email`, `mobile` to root
- [ ] Flatten `businessRegistration` → move `panNumber`, `gstNumber` to root
- [ ] Rename `verificationDocuments` → `documents`
- [ ] In documents: rename `fileType` → `type`
- [ ] Return full URLs for document files
- [ ] Remove `document` wrapper from upload response
- [ ] **NEW**: Accept both frontend and backend document type naming conventions
- [ ] **NEW**: Add validation endpoint to check profile completeness before submission

### Suggested New Endpoint: Pre-Validation

```
GET /api/v1/vendors/profile/validate
```

**Response**:
```json
{
  "success": true,
  "data": {
    "canSubmit": false,
    "completionPercentage": 65,
    "missingFields": [
      {
        "path": "contactInfo.address",
        "displayName": "Business Address"
      }
    ],
    "missingDocuments": [
      {
        "type": "address_proof",
        "displayName": "Address Proof"
      }
    ]
  }
}
```

---

## Frontend Status

✅ **Normalizer layer implemented** in `src/services/modules/vendor-profile/vendor-profile.service.ts`

The frontend handles both current and new backend structures via:
- `normalizeProfile()` - Maps nested/flat structures to expected interface
- `normalizeDocuments()` - Standardizes document array format
- `normalizeDocumentUrl()` - Ensures full URLs for documents
- `normalizeAddresses()` - **NEW**: Handles address normalization
- `denormalizeProfile()` - **NEW**: Transforms frontend to backend structure

**No frontend changes required** once backend is updated.

---

## Testing

After backend updates, verify:
1. Profile auto-populates on page load
2. Documents display with correct status indicators
3. "View" button opens documents in new tab
4. Document upload works and shows in list
5. Profile save persists all fields correctly
6. **NEW**: Address section displays and saves correctly
7. **NEW**: Verification submission succeeds with complete profile
