================================================================================
                    VENDOR PROFILE API DOCUMENTATION
================================================================================

VERSION: 1.0.0
BASE URL: /api/v1
AUTHENTICATION: Bearer Token (JWT)
USER TYPE: Vendor
VENDOR CATEGORIES: Service Vendor | Product Vendor | Logistics Vendor

================================================================================
                            TABLE OF CONTENTS
================================================================================

1. Overview
2. Authentication
3. Vendor Categories & Requirements
4. API Endpoints
   4.1 Get Vendor Profile
   4.2 Save/Update Vendor Profile
   4.3 Upload Document
   4.4 Delete Document
   4.5 Submit for Verification
   4.6 Get Profile Completion Status
5. Data Models
6. Validation Rules
7. Error Codes
8. Mock Examples
   8.1 Service Vendor Examples
   8.2 Product Vendor Examples
   8.3 Logistics Vendor Examples

================================================================================
                              1. OVERVIEW
================================================================================

The Vendor Profile API allows vendors to create, update, and manage their
business profiles for verification. The API supports THREE vendor categories,
each with specific document requirements:

VENDOR CATEGORIES:
- Service Vendor: IT services, consulting, maintenance, etc.
- Product Vendor: Manufacturing, trading, wholesale, etc.
- Logistics Vendor: Transportation, warehousing, courier, etc.

KEY FEATURES:
- Draft profile creation with partial updates
- Category-specific document management
- Profile submission for verification
- Profile locking mechanism
- Completion percentage tracking
- Consent management

PROFILE LIFECYCLE:
incomplete → pending → approved/rejected

LOCKED STATES:
- incomplete: Editable
- pending: LOCKED (submitted, awaiting admin review)
- approved: LOCKED (permanently)
- rejected: Editable (with admin remarks)

================================================================================
                          2. AUTHENTICATION
================================================================================

All endpoints require a valid JWT token in the Authorization header.

Header Format:
Authorization: Bearer <token>

Token Payload:
{
  "id": "user_id",
  "userType": "Vendor",
  "userSubType": "Service Vendor",      // or "Product Vendor" or "Logistics Vendor"
  "role": "VendorAdmin",
  "vendorId": "vendor_12345"
}

================================================================================
                   3. VENDOR CATEGORIES & REQUIREMENTS
================================================================================

Each vendor category has specific document requirements beyond the mandatory
documents required for all vendors.

--------------------------------------------------------------------------------
3.1 MANDATORY DOCUMENTS (All Vendor Types)
--------------------------------------------------------------------------------

| Document Type          | Description                           | Required |
|------------------------|---------------------------------------|----------|
| gst_certificate        | GST Registration Certificate          | Yes      |
| pan_card               | PAN Card of Business/Proprietor       | Yes      |
| registration_certificate| Business Registration Certificate    | Yes      |

--------------------------------------------------------------------------------
3.2 SERVICE VENDOR Additional Documents
--------------------------------------------------------------------------------

| Document Type           | Description                          | Required |
|-------------------------|--------------------------------------|----------|
| service_certifications  | ISO, industry-specific certifications| Yes      |
| insurance_certificate   | Professional/Liability Insurance     | Yes      |
| technical_qualifications| Technical qualification documents    | Optional |

SERVICE VENDOR SPECIALIZATIONS:
- IT Services & Consulting
- Maintenance & Repair
- Professional Services
- Staffing & Recruitment
- Facility Management
- Security Services
- Catering & Hospitality
- Other Services

--------------------------------------------------------------------------------
3.3 PRODUCT VENDOR Additional Documents
--------------------------------------------------------------------------------

| Document Type              | Description                       | Required |
|----------------------------|-----------------------------------|----------|
| product_certifications     | BIS, CE, FDA certifications       | Yes      |
| quality_certificates       | ISO 9001, quality assurance docs  | Yes      |
| manufacturer_authorization | OEM/Dealer authorization letters  | Optional |
| product_catalog            | Product catalog/brochure          | Optional |

PRODUCT VENDOR SPECIALIZATIONS:
- Manufacturing
- Trading & Distribution
- Wholesale
- Raw Materials
- Equipment & Machinery
- Electronics & Components
- Packaging Materials
- Other Products

--------------------------------------------------------------------------------
3.4 LOGISTICS VENDOR Additional Documents
--------------------------------------------------------------------------------

| Document Type        | Description                           | Required |
|----------------------|---------------------------------------|----------|
| transport_license    | Commercial Vehicle Permit/License     | Yes      |
| vehicle_registration | Vehicle RC/Fleet Registration         | Yes      |
| goods_insurance      | Transit/Goods Insurance Policy        | Optional |
| warehouse_license    | Warehouse License (if applicable)     | Optional |

LOGISTICS VENDOR SPECIALIZATIONS:
- Road Transport
- Warehousing
- Courier & Express
- Cold Chain Logistics
- Container Services
- Last Mile Delivery
- International Freight
- Other Logistics

================================================================================
                          4. API ENDPOINTS
================================================================================

--------------------------------------------------------------------------------
4.1 GET VENDOR PROFILE
--------------------------------------------------------------------------------

Endpoint: GET /api/v1/vendor-profile
Description: Retrieve complete vendor profile with all fields and documents
Authentication: Required

REQUEST HEADERS:
Authorization: Bearer <token>

SUCCESS RESPONSE (200 OK):
{
  "success": true,
  "data": {
    "profile": {
      "id": "vendor_1234567890",
      "businessName": "TechServ Solutions Pvt Ltd",
      "vendorCategory": "Service Vendor",
      "specialization": "IT Services & Consulting",
      "panNumber": "AABCU9603R",
      "gstNumber": "27AABCU9603R1Z5",
      "registrationNumber": "U72900MH2015PTC123456",
      "email": "contact@techserv.com",
      "mobile": "+919876543210",
      "telephone": "02212345678",
      "website": "https://www.techserv.com",
      "primaryIndustry": "Information Technology",
      "yearsInBusiness": "8",
      "businessLocation": "Mumbai, Maharashtra",
      "serviceAreas": ["Maharashtra", "Gujarat", "Karnataka"],
      "documents": [
        {
          "id": "doc_pan_001",
          "name": "pan_card_1234567890.pdf",
          "type": "application/pdf",
          "size": 245680,
          "url": "/public/TechServ_Solutions_Pvt_Ltd/pan_card_1234567890.pdf",
          "documentType": "pan_card",
          "uploadedAt": "2025-01-15T11:00:00.000Z",
          "status": "pending"
        },
        {
          "id": "doc_gst_001",
          "name": "gst_certificate_1234567890.pdf",
          "type": "application/pdf",
          "size": 312450,
          "url": "/public/TechServ_Solutions_Pvt_Ltd/gst_certificate_1234567890.pdf",
          "documentType": "gst_certificate",
          "uploadedAt": "2025-01-15T11:05:00.000Z",
          "status": "pending"
        }
      ],
      "verificationStatus": "incomplete",
      "verificationSubmittedAt": null,
      "verificationCompletedAt": null,
      "verificationRemarks": null,
      "verificationSteps": [],
      "consentGiven": false,
      "consentTimestamp": null,
      "isProfileComplete": false,
      "profileCompletionPercentage": 65,
      "isLocked": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T14:45:00.000Z"
    },
    "missingFields": [],
    "missingDocuments": ["registration_certificate", "service_certifications", "insurance_certificate"],
    "requiredDocuments": ["gst_certificate", "pan_card", "registration_certificate", "service_certifications", "insurance_certificate"],
    "optionalDocuments": ["technical_qualifications"]
  }
}

ERROR RESPONSE (404 NOT FOUND):
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Vendor profile not found",
    "statusCode": 404
  }
}

--------------------------------------------------------------------------------
4.2 SAVE/UPDATE VENDOR PROFILE
--------------------------------------------------------------------------------

Endpoint: POST /api/v1/vendor-profile/save
Description: Create or update vendor profile (supports partial updates)
Authentication: Required
Profile Lock: Cannot update when locked

REQUEST HEADERS:
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "businessName": "TechServ Solutions Pvt Ltd",
  "vendorCategory": "Service Vendor",
  "specialization": "IT Services & Consulting",
  "panNumber": "AABCU9603R",
  "gstNumber": "27AABCU9603R1Z5",
  "registrationNumber": "U72900MH2015PTC123456",
  "email": "contact@techserv.com",
  "mobile": "+919876543210",
  "telephone": "02212345678",
  "website": "https://www.techserv.com",
  "primaryIndustry": "Information Technology",
  "yearsInBusiness": "8",
  "businessLocation": "Mumbai, Maharashtra",
  "serviceAreas": ["Maharashtra", "Gujarat", "Karnataka"]
}

SUCCESS RESPONSE (200 OK):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": {
      "id": "vendor_1234567890",
      "businessName": "TechServ Solutions Pvt Ltd",
      "vendorCategory": "Service Vendor",
      "specialization": "IT Services & Consulting",
      "panNumber": "AABCU9603R",
      "gstNumber": "27AABCU9603R1Z5",
      "registrationNumber": "U72900MH2015PTC123456",
      "email": "contact@techserv.com",
      "mobile": "+919876543210",
      "telephone": "02212345678",
      "website": "https://www.techserv.com",
      "primaryIndustry": "Information Technology",
      "yearsInBusiness": "8",
      "businessLocation": "Mumbai, Maharashtra",
      "serviceAreas": ["Maharashtra", "Gujarat", "Karnataka"],
      "documents": [],
      "verificationStatus": "incomplete",
      "verificationSubmittedAt": null,
      "verificationCompletedAt": null,
      "verificationRemarks": null,
      "isProfileComplete": false,
      "profileCompletionPercentage": 70,
      "isLocked": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T14:45:00.000Z"
    },
    "missingFields": [],
    "missingDocuments": ["gst_certificate", "pan_card", "registration_certificate", "service_certifications", "insurance_certificate"]
  }
}

ERROR RESPONSE (403 FORBIDDEN - Profile Locked):
{
  "success": false,
  "error": {
    "code": "PROFILE_LOCKED",
    "message": "Profile cannot be modified. Status: pending",
    "details": "Profile is locked for verification. Please contact support if changes are needed.",
    "statusCode": 403
  }
}

ERROR RESPONSE (400 BAD REQUEST - Invalid Vendor Category):
{
  "success": false,
  "error": {
    "code": "INVALID_VENDOR_CATEGORY",
    "message": "Invalid vendor category. Must be one of: Service Vendor, Product Vendor, Logistics Vendor",
    "statusCode": 400
  }
}

--------------------------------------------------------------------------------
4.3 UPLOAD DOCUMENT
--------------------------------------------------------------------------------

Endpoint: POST /api/v1/vendor-profile/documents/upload
Description: Upload verification documents (replaces existing document of same type)
Authentication: Required
Profile Lock: Cannot upload when locked
Content-Type: multipart/form-data

REQUEST HEADERS:
Authorization: Bearer <token>
Content-Type: multipart/form-data

REQUEST BODY (Form Data):
file: [Binary file data]
documentType: "pan_card"

VALID DOCUMENT TYPES (All Vendors):
- gst_certificate
- pan_card
- registration_certificate

VALID DOCUMENT TYPES (Service Vendor):
- service_certifications
- insurance_certificate
- technical_qualifications

VALID DOCUMENT TYPES (Product Vendor):
- product_certifications
- quality_certificates
- manufacturer_authorization
- product_catalog

VALID DOCUMENT TYPES (Logistics Vendor):
- transport_license
- vehicle_registration
- goods_insurance
- warehouse_license

FILE CONSTRAINTS:
- Max Size: 10MB
- Accepted Formats: .pdf, .jpg, .jpeg, .png

SUCCESS RESPONSE (201 CREATED):
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "doc_pan_001",
      "name": "pan_card_1234567890.pdf",
      "type": "application/pdf",
      "size": 245680,
      "url": "/public/TechServ_Solutions_Pvt_Ltd/pan_card_1234567890.pdf",
      "documentType": "pan_card",
      "uploadedAt": "2025-01-15T11:00:00.000Z",
      "status": "pending"
    },
    "replacedDocument": null,
    "profileCompletionPercentage": 75,
    "remainingDocuments": ["registration_certificate", "service_certifications"]
  }
}

SUCCESS RESPONSE (201 CREATED - Document Replaced):
{
  "success": true,
  "message": "Document uploaded successfully. Previous document replaced.",
  "data": {
    "document": {
      "id": "doc_pan_002",
      "name": "pan_card_1234567891.pdf",
      "type": "application/pdf",
      "size": 267890,
      "url": "/public/TechServ_Solutions_Pvt_Ltd/pan_card_1234567891.pdf",
      "documentType": "pan_card",
      "uploadedAt": "2025-01-15T13:30:00.000Z",
      "status": "pending"
    },
    "replacedDocument": {
      "id": "doc_pan_001",
      "name": "pan_card_1234567890.pdf"
    },
    "profileCompletionPercentage": 75,
    "remainingDocuments": ["registration_certificate", "service_certifications"]
  }
}

ERROR RESPONSE (400 BAD REQUEST - Invalid Document Type for Category):
{
  "success": false,
  "error": {
    "code": "INVALID_DOCUMENT_TYPE",
    "message": "Document type 'transport_license' is not valid for Service Vendor",
    "details": {
      "vendorCategory": "Service Vendor",
      "validDocumentTypes": [
        "gst_certificate",
        "pan_card",
        "registration_certificate",
        "service_certifications",
        "insurance_certificate",
        "technical_qualifications"
      ]
    },
    "statusCode": 400
  }
}

ERROR RESPONSE (400 BAD REQUEST - Invalid File Type):
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Invalid file type. Accepted formats: .pdf, .jpg, .jpeg, .png",
    "statusCode": 400
  }
}

ERROR RESPONSE (413 PAYLOAD TOO LARGE):
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum limit of 10MB",
    "statusCode": 413
  }
}

ERROR RESPONSE (403 FORBIDDEN - Profile Locked):
{
  "success": false,
  "error": {
    "code": "PROFILE_LOCKED",
    "message": "Cannot upload documents. Profile is locked for verification.",
    "details": "Profile status: pending",
    "statusCode": 403
  }
}

--------------------------------------------------------------------------------
4.4 DELETE DOCUMENT
--------------------------------------------------------------------------------

Endpoint: DELETE /api/v1/vendor-profile/documents/:documentId
Description: Delete an uploaded document
Authentication: Required
Profile Lock: Cannot delete when locked

REQUEST HEADERS:
Authorization: Bearer <token>

URL PARAMETERS:
documentId: Document ID to delete (e.g., "doc_pan_001")

SUCCESS RESPONSE (200 OK):
{
  "success": true,
  "message": "Document deleted successfully",
  "data": {
    "deletedDocumentId": "doc_pan_001",
    "documentType": "pan_card",
    "profileCompletionPercentage": 60,
    "isProfileComplete": false
  }
}

ERROR RESPONSE (404 NOT FOUND):
{
  "success": false,
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "Document not found",
    "statusCode": 404
  }
}

ERROR RESPONSE (403 FORBIDDEN - Profile Locked):
{
  "success": false,
  "error": {
    "code": "PROFILE_LOCKED",
    "message": "Cannot delete documents. Profile is locked for verification.",
    "details": "Profile status: pending",
    "statusCode": 403
  }
}

--------------------------------------------------------------------------------
4.5 SUBMIT FOR VERIFICATION
--------------------------------------------------------------------------------

Endpoint: POST /api/v1/vendor-profile/submit-verification
Description: Submit profile for admin verification (LOCKS profile)
Authentication: Required
Requirements: Profile must be 100% complete with all required documents uploaded

REQUEST HEADERS:
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "consentGiven": true,
  "consentTimestamp": "2025-01-15T12:00:00.000Z"
}

CONSENT REQUIREMENTS:
Vendor must explicitly consent to:
- Accuracy of provided information
- Terms and conditions
- Data processing agreement
- Verification process

SUCCESS RESPONSE (200 OK):
{
  "success": true,
  "message": "Profile submitted for verification successfully",
  "data": {
    "verificationId": "vendor_1234567890",
    "status": "pending",
    "submittedAt": "2025-01-15T12:00:00.000Z",
    "estimatedCompletionAt": "2025-01-17T12:00:00.000Z",
    "estimatedCompletionHours": 48,
    "isLocked": true,
    "consentRecorded": true,
    "verificationSteps": [
      {
        "step": "profile_submitted",
        "status": "completed",
        "completedAt": "2025-01-15T12:00:00.000Z"
      },
      {
        "step": "digital_verification",
        "status": "pending"
      },
      {
        "step": "manual_review",
        "status": "pending"
      },
      {
        "step": "final_approval",
        "status": "pending"
      }
    ],
    "nextSteps": [
      "Your profile has been submitted for verification",
      "Our team will review your documents within 24-48 hours",
      "You will receive an email notification once review is complete",
      "Check your profile status at any time from the dashboard"
    ]
  }
}

ERROR RESPONSE (422 UNPROCESSABLE ENTITY - Incomplete Profile):
{
  "success": false,
  "error": {
    "code": "INCOMPLETE_PROFILE",
    "message": "Profile is not complete. Cannot submit for verification.",
    "details": {
      "vendorCategory": "Service Vendor",
      "completionPercentage": 75,
      "missingFields": [],
      "missingDocuments": ["service_certifications", "insurance_certificate"],
      "requiredActions": [
        "Upload Service Certifications (ISO, industry-specific)",
        "Upload Insurance Certificate (Professional/Liability)"
      ]
    },
    "statusCode": 422
  }
}

ERROR RESPONSE (400 BAD REQUEST - Consent Not Provided):
{
  "success": false,
  "error": {
    "code": "CONSENT_REQUIRED",
    "message": "Consent must be provided before submitting for verification",
    "details": {
      "requiredFields": ["consentGiven", "consentTimestamp"],
      "consentTerms": [
        "I confirm that all information provided is accurate and complete",
        "I agree to the terms and conditions",
        "I consent to the verification process and data processing"
      ]
    },
    "statusCode": 400
  }
}

ERROR RESPONSE (409 CONFLICT - Already Submitted):
{
  "success": false,
  "error": {
    "code": "ALREADY_SUBMITTED",
    "message": "Profile has already been submitted for verification",
    "details": {
      "currentStatus": "pending",
      "submittedAt": "2025-01-15T12:00:00.000Z"
    },
    "statusCode": 409
  }
}

--------------------------------------------------------------------------------
4.6 GET PROFILE COMPLETION STATUS
--------------------------------------------------------------------------------

Endpoint: GET /api/v1/vendor-profile/completion-status
Description: Get profile completion percentage and missing items
Authentication: Required

REQUEST HEADERS:
Authorization: Bearer <token>

SUCCESS RESPONSE (200 OK):
{
  "success": true,
  "data": {
    "vendorCategory": "Service Vendor",
    "completionPercentage": 75,
    "isProfileComplete": false,
    "canSubmit": false,
    "missingFields": [],
    "missingDocuments": ["service_certifications", "insurance_certificate"],
    "requiredDocuments": {
      "mandatory": ["gst_certificate", "pan_card", "registration_certificate"],
      "categorySpecific": ["service_certifications", "insurance_certificate"]
    },
    "optionalDocuments": ["technical_qualifications"],
    "uploadedDocuments": ["gst_certificate", "pan_card", "registration_certificate"]
  }
}

SUCCESS RESPONSE (200 OK - Complete Profile):
{
  "success": true,
  "data": {
    "vendorCategory": "Service Vendor",
    "completionPercentage": 100,
    "isProfileComplete": true,
    "canSubmit": true,
    "missingFields": [],
    "missingDocuments": [],
    "requiredDocuments": {
      "mandatory": ["gst_certificate", "pan_card", "registration_certificate"],
      "categorySpecific": ["service_certifications", "insurance_certificate"]
    },
    "optionalDocuments": ["technical_qualifications"],
    "uploadedDocuments": [
      "gst_certificate",
      "pan_card",
      "registration_certificate",
      "service_certifications",
      "insurance_certificate"
    ]
  }
}

================================================================================
                          5. DATA MODELS
================================================================================

VENDOR PROFILE:
{
  "id": String,
  "businessName": String (Required),
  "vendorCategory": String (Required, Enum: "Service Vendor" | "Product Vendor" | "Logistics Vendor"),
  "specialization": String (Required),
  "panNumber": String (Required, 10 chars),
  "gstNumber": String (Required, 15 chars),
  "registrationNumber": String (Required),
  "email": String (Required, Valid email),
  "mobile": String (Required, 10-15 digits),
  "telephone": String (Optional),
  "website": String (Optional),
  "primaryIndustry": String (Optional),
  "yearsInBusiness": String (Optional),
  "businessLocation": String (Optional),
  "serviceAreas": Array<String> (Optional),
  "documents": Array<Document>,
  "verificationStatus": String (incomplete/pending/approved/rejected),
  "verificationSubmittedAt": Date,
  "verificationCompletedAt": Date,
  "verificationRemarks": String,
  "verificationSteps": Array<VerificationStep>,
  "consentGiven": Boolean,
  "consentTimestamp": Date,
  "isProfileComplete": Boolean,
  "profileCompletionPercentage": Number (0-100),
  "isLocked": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}

DOCUMENT:
{
  "id": String,
  "name": String,
  "type": String (MIME type),
  "size": Number (bytes),
  "url": String,
  "documentType": String (Enum),
  "uploadedAt": Date,
  "status": String (pending/verified/rejected),
  "remarks": String
}

VERIFICATION STEP:
{
  "step": String (profile_submitted/digital_verification/manual_review/final_approval),
  "status": String (pending/in_progress/completed/rejected),
  "startedAt": Date,
  "completedAt": Date,
  "remarks": String
}

CONSENT RECORD:
{
  "consentGiven": Boolean,
  "consentTimestamp": Date,
  "consentVersion": String,
  "ipAddress": String,
  "userAgent": String
}

================================================================================
                          6. VALIDATION RULES
================================================================================

FIELD VALIDATIONS:
--------------------------------------------------------------------------------
| Field              | Required | Validation                                    |
|--------------------| ---------|-----------------------------------------------|
| businessName       | Yes      | Non-empty, Max 200 chars                      |
| vendorCategory     | Yes      | Enum: Service/Product/Logistics Vendor        |
| specialization     | Yes      | Non-empty, Max 100 chars                      |
| panNumber          | Yes      | Exactly 10 chars, Format: AAAAA9999A          |
| gstNumber          | Yes      | Exactly 15 chars, Format: 99AAAAA9999A9A9     |
| registrationNumber | Yes      | Non-empty, Max 50 chars                       |
| email              | Yes      | Valid RFC 5322 email format                   |
| mobile             | Yes      | 10-15 digits, Optional country code           |
| telephone          | No       | 10-15 digits (if provided)                    |
| website            | No       | Valid URL format (if provided)                |
| primaryIndustry    | No       | Max 100 chars                                 |
| yearsInBusiness    | No       | Numeric string                                |
| businessLocation   | No       | Max 200 chars                                 |
| serviceAreas       | No       | Array of strings, Max 20 items                |

PAN NUMBER FORMAT:
Pattern: AAAAA9999A
Example: AABCU9603R
Rules:
- First 5 characters: Uppercase letters (A-Z)
- Next 4 characters: Digits (0-9)
- Last character: Uppercase letter (A-Z)
- Total: 10 characters

GST NUMBER FORMAT:
Pattern: 99AAAAA9999A9A9
Example: 27AABCU9603R1Z5
Rules:
- First 2 digits: State code (01-37)
- Next 10 characters: PAN number
- Next 1 character: Registration number (1-9, A-Z)
- Next 1 character: 'Z' (default)
- Last 1 character: Checksum digit/letter
- Total: 15 characters

DOCUMENT VALIDATIONS:
- File types: .pdf, .jpg, .jpeg, .png
- Max size: 10MB
- Document type must match vendor category

REQUIRED DOCUMENTS BY VENDOR CATEGORY:
--------------------------------------------------------------------------------
| Category         | Mandatory              | Category-Specific                |
|------------------|------------------------|----------------------------------|
| Service Vendor   | GST, PAN, Registration | Service Certs, Insurance         |
| Product Vendor   | GST, PAN, Registration | Product Certs, Quality Certs     |
| Logistics Vendor | GST, PAN, Registration | Transport License, Vehicle Reg   |

SUBMISSION VALIDATIONS:
- Profile completion: 100%
- All required fields: Filled
- All required documents: Uploaded (mandatory + category-specific)
- Consent: Must be provided with timestamp
- Profile status: incomplete or rejected

================================================================================
                          7. ERROR CODES
================================================================================

AUTHENTICATION ERRORS:
- USER_NOT_FOUND (404): User not found in system
- UNAUTHORIZED (401): Invalid or missing token
- FORBIDDEN (403): User lacks permission

PROFILE ERRORS:
- PROFILE_NOT_FOUND (404): Profile doesn't exist
- PROFILE_LOCKED (403): Profile is locked, cannot modify
- ALREADY_SUBMITTED (409): Profile already submitted
- INCOMPLETE_PROFILE (422): Profile not complete for submission
- INVALID_VENDOR_CATEGORY (400): Invalid vendor category

DOCUMENT ERRORS:
- NO_FILE (400): No file uploaded
- INVALID_FILE_TYPE (400): File type not supported
- FILE_TOO_LARGE (413): File size exceeds limit
- DOCUMENT_NOT_FOUND (404): Document doesn't exist
- INVALID_DOCUMENT_TYPE (400): Document type not valid for vendor category

VALIDATION ERRORS:
- VALIDATION_ERROR (400): Field validation failed
- CONSENT_REQUIRED (400): Consent not provided
- INVALID_PAN_FORMAT (400): PAN number format invalid
- INVALID_GST_FORMAT (400): GST number format invalid

SYSTEM ERRORS:
- INTERNAL_ERROR (500): Internal server error

================================================================================
                          8. MOCK EXAMPLES
================================================================================

--------------------------------------------------------------------------------
8.1 SERVICE VENDOR EXAMPLES
--------------------------------------------------------------------------------

EXAMPLE 1: First-Time Service Vendor Profile Creation
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/vendor-profile/save
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "businessName": "TechServ Solutions Pvt Ltd",
  "vendorCategory": "Service Vendor",
  "specialization": "IT Services & Consulting",
  "email": "contact@techserv.com",
  "mobile": "+919876543210"
}

RESPONSE:
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "profile": {
      "id": "vendor_srv_001",
      "businessName": "TechServ Solutions Pvt Ltd",
      "vendorCategory": "Service Vendor",
      "specialization": "IT Services & Consulting",
      "panNumber": null,
      "gstNumber": null,
      "registrationNumber": null,
      "email": "contact@techserv.com",
      "mobile": "+919876543210",
      "telephone": null,
      "website": null,
      "primaryIndustry": null,
      "yearsInBusiness": null,
      "businessLocation": null,
      "serviceAreas": [],
      "documents": [],
      "verificationStatus": "incomplete",
      "isProfileComplete": false,
      "profileCompletionPercentage": 25,
      "isLocked": false,
      "createdAt": "2025-01-15T09:00:00.000Z",
      "updatedAt": "2025-01-15T09:00:00.000Z"
    },
    "missingFields": [
      "panNumber",
      "gstNumber",
      "registrationNumber"
    ],
    "missingDocuments": [
      "gst_certificate",
      "pan_card",
      "registration_certificate",
      "service_certifications",
      "insurance_certificate"
    ]
  }
}

EXAMPLE 2: Service Vendor Document Upload (Insurance Certificate)
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/vendor-profile/documents/upload
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

Form Data:
file: insurance_certificate.pdf (binary)
documentType: insurance_certificate

RESPONSE:
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "doc_ins_001",
      "name": "insurance_certificate_1705318800000.pdf",
      "type": "application/pdf",
      "size": 456789,
      "url": "/public/TechServ_Solutions_Pvt_Ltd/insurance_certificate_1705318800000.pdf",
      "documentType": "insurance_certificate",
      "uploadedAt": "2025-01-15T11:30:00.000Z",
      "status": "pending"
    },
    "replacedDocument": null,
    "profileCompletionPercentage": 90,
    "remainingDocuments": ["service_certifications"]
  }
}

EXAMPLE 3: Service Vendor Submit for Verification
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/vendor-profile/submit-verification
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "consentGiven": true,
  "consentTimestamp": "2025-01-15T12:00:00.000Z"
}

RESPONSE:
{
  "success": true,
  "message": "Profile submitted for verification successfully",
  "data": {
    "verificationId": "vendor_srv_001",
    "status": "pending",
    "submittedAt": "2025-01-15T12:00:00.000Z",
    "estimatedCompletionAt": "2025-01-17T12:00:00.000Z",
    "estimatedCompletionHours": 48,
    "isLocked": true,
    "consentRecorded": true,
    "verificationSteps": [
      {
        "step": "profile_submitted",
        "status": "completed",
        "completedAt": "2025-01-15T12:00:00.000Z"
      },
      {
        "step": "digital_verification",
        "status": "pending"
      },
      {
        "step": "manual_review",
        "status": "pending"
      },
      {
        "step": "final_approval",
        "status": "pending"
      }
    ],
    "nextSteps": [
      "Your profile has been submitted for verification",
      "Our team will review your documents within 24-48 hours",
      "You will receive an email notification once review is complete"
    ]
  }
}

--------------------------------------------------------------------------------
8.2 PRODUCT VENDOR EXAMPLES
--------------------------------------------------------------------------------

EXAMPLE 1: Product Vendor Complete Profile Creation
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/vendor-profile/save
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "businessName": "Prime Manufacturing Industries",
  "vendorCategory": "Product Vendor",
  "specialization": "Manufacturing",
  "panNumber": "AABCP1234M",
  "gstNumber": "27AABCP1234M1Z9",
  "registrationNumber": "L28920MH2010PLC123456",
  "email": "sales@primemanufacturing.com",
  "mobile": "+919999888877",
  "telephone": "02022345678",
  "website": "https://www.primemanufacturing.com",
  "primaryIndustry": "Industrial Manufacturing",
  "yearsInBusiness": "15",
  "businessLocation": "Pune, Maharashtra",
  "serviceAreas": ["Pan India", "Export - Middle East", "Export - Southeast Asia"]
}

RESPONSE:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": {
      "id": "vendor_prd_001",
      "businessName": "Prime Manufacturing Industries",
      "vendorCategory": "Product Vendor",
      "specialization": "Manufacturing",
      "panNumber": "AABCP1234M",
      "gstNumber": "27AABCP1234M1Z9",
      "registrationNumber": "L28920MH2010PLC123456",
      "email": "sales@primemanufacturing.com",
      "mobile": "+919999888877",
      "telephone": "02022345678",
      "website": "https://www.primemanufacturing.com",
      "primaryIndustry": "Industrial Manufacturing",
      "yearsInBusiness": "15",
      "businessLocation": "Pune, Maharashtra",
      "serviceAreas": ["Pan India", "Export - Middle East", "Export - Southeast Asia"],
      "documents": [],
      "verificationStatus": "incomplete",
      "isProfileComplete": false,
      "profileCompletionPercentage": 50,
      "isLocked": false,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    },
    "missingFields": [],
    "missingDocuments": [
      "gst_certificate",
      "pan_card",
      "registration_certificate",
      "product_certifications",
      "quality_certificates"
    ]
  }
}

EXAMPLE 2: Product Vendor Upload Quality Certificate
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/vendor-profile/documents/upload
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

Form Data:
file: iso_9001_certificate.pdf (binary)
documentType: quality_certificates

RESPONSE:
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "doc_qc_001",
      "name": "quality_certificates_1705318800000.pdf",
      "type": "application/pdf",
      "size": 678901,
      "url": "/public/Prime_Manufacturing_Industries/quality_certificates_1705318800000.pdf",
      "documentType": "quality_certificates",
      "uploadedAt": "2025-01-15T11:00:00.000Z",
      "status": "pending"
    },
    "replacedDocument": null,
    "profileCompletionPercentage": 60,
    "remainingDocuments": ["gst_certificate", "pan_card", "registration_certificate", "product_certifications"]
  }
}

EXAMPLE 3: Product Vendor - Error Invalid Document Type
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/vendor-profile/documents/upload
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

Form Data:
file: transport_license.pdf (binary)
documentType: transport_license

RESPONSE:
{
  "success": false,
  "error": {
    "code": "INVALID_DOCUMENT_TYPE",
    "message": "Document type 'transport_license' is not valid for Product Vendor",
    "details": {
      "vendorCategory": "Product Vendor",
      "validDocumentTypes": [
        "gst_certificate",
        "pan_card",
        "registration_certificate",
        "product_certifications",
        "quality_certificates",
        "manufacturer_authorization",
        "product_catalog"
      ]
    },
    "statusCode": 400
  }
}

--------------------------------------------------------------------------------
8.3 LOGISTICS VENDOR EXAMPLES
--------------------------------------------------------------------------------

EXAMPLE 1: Logistics Vendor Profile Creation
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/vendor-profile/save
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "businessName": "FastTrack Logistics Pvt Ltd",
  "vendorCategory": "Logistics Vendor",
  "specialization": "Road Transport",
  "panNumber": "AABCF5678L",
  "gstNumber": "29AABCF5678L1Z3",
  "registrationNumber": "U60300KA2012PTC123456",
  "email": "operations@fasttracklogistics.com",
  "mobile": "+918888777766",
  "telephone": "08041234567",
  "website": "https://www.fasttracklogistics.com",
  "primaryIndustry": "Transportation & Logistics",
  "yearsInBusiness": "12",
  "businessLocation": "Bangalore, Karnataka",
  "serviceAreas": ["Karnataka", "Tamil Nadu", "Andhra Pradesh", "Telangana", "Kerala"]
}

RESPONSE:
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "profile": {
      "id": "vendor_log_001",
      "businessName": "FastTrack Logistics Pvt Ltd",
      "vendorCategory": "Logistics Vendor",
      "specialization": "Road Transport",
      "panNumber": "AABCF5678L",
      "gstNumber": "29AABCF5678L1Z3",
      "registrationNumber": "U60300KA2012PTC123456",
      "email": "operations@fasttracklogistics.com",
      "mobile": "+918888777766",
      "telephone": "08041234567",
      "website": "https://www.fasttracklogistics.com",
      "primaryIndustry": "Transportation & Logistics",
      "yearsInBusiness": "12",
      "businessLocation": "Bangalore, Karnataka",
      "serviceAreas": ["Karnataka", "Tamil Nadu", "Andhra Pradesh", "Telangana", "Kerala"],
      "documents": [],
      "verificationStatus": "incomplete",
      "isProfileComplete": false,
      "profileCompletionPercentage": 50,
      "isLocked": false,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    },
    "missingFields": [],
    "missingDocuments": [
      "gst_certificate",
      "pan_card",
      "registration_certificate",
      "transport_license",
      "vehicle_registration"
    ]
  }
}

EXAMPLE 2: Logistics Vendor Upload Transport License
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/vendor-profile/documents/upload
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

Form Data:
file: commercial_vehicle_permit.pdf (binary)
documentType: transport_license

RESPONSE:
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "doc_tl_001",
      "name": "transport_license_1705318800000.pdf",
      "type": "application/pdf",
      "size": 345678,
      "url": "/public/FastTrack_Logistics_Pvt_Ltd/transport_license_1705318800000.pdf",
      "documentType": "transport_license",
      "uploadedAt": "2025-01-15T11:00:00.000Z",
      "status": "pending"
    },
    "replacedDocument": null,
    "profileCompletionPercentage": 60,
    "remainingDocuments": ["gst_certificate", "pan_card", "registration_certificate", "vehicle_registration"]
  }
}

EXAMPLE 3: Logistics Vendor - Incomplete Submission Error
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/vendor-profile/submit-verification
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "consentGiven": true,
  "consentTimestamp": "2025-01-15T12:00:00.000Z"
}

RESPONSE:
{
  "success": false,
  "error": {
    "code": "INCOMPLETE_PROFILE",
    "message": "Profile is not complete. Cannot submit for verification.",
    "details": {
      "vendorCategory": "Logistics Vendor",
      "completionPercentage": 80,
      "missingFields": [],
      "missingDocuments": ["vehicle_registration"],
      "requiredActions": [
        "Upload Vehicle Registration (Vehicle RC/Fleet Registration)"
      ]
    },
    "statusCode": 422
  }
}

EXAMPLE 4: Logistics Vendor - Edit Locked Profile Error
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/vendor-profile/save
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "website": "https://www.fasttracklogistics.in"
}

RESPONSE:
{
  "success": false,
  "error": {
    "code": "PROFILE_LOCKED",
    "message": "Profile cannot be modified. Status: pending",
    "details": "Profile is locked for verification. Please contact support if changes are needed.",
    "statusCode": 403
  }
}

================================================================================
                     APPENDIX: VERIFICATION FLOW DIAGRAM
================================================================================

                    ┌─────────────────┐
                    │   incomplete    │
                    │   (Editable)    │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  Submit for Verification     │
              │  (Consent + 100% Complete)   │
              └──────────────┬───────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     pending     │
                    │    (LOCKED)     │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐           ┌─────────────────┐
     │    approved     │           │    rejected     │
     │   (LOCKED)      │           │   (Editable)    │
     │   Permanently   │           │   with remarks  │
     └─────────────────┘           └─────────────────┘

VERIFICATION STEPS (Sequential):
1. profile_submitted → Document Received
2. digital_verification → Automated Checks (PAN, GST, etc.)
3. manual_review → Human Review of Documents
4. final_approval → Approval/Rejection Decision

================================================================================
                            END OF DOCUMENTATION
================================================================================
