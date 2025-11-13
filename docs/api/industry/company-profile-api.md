================================================================================
                    INDUSTRY COMPANY PROFILE API DOCUMENTATION
================================================================================

VERSION: 1.0.0
BASE URL: /api/v1
AUTHENTICATION: Bearer Token (JWT)
USER TYPE: Industry

================================================================================
                            TABLE OF CONTENTS
================================================================================

1. Overview
2. Authentication
3. API Endpoints
   3.1 Save/Update Company Profile
   3.2 Get Company Profile
   3.3 Upload Document
   3.4 Delete Document
   3.5 Submit for Verification
   3.6 Get Profile Completion Status
4. Data Models
5. Validation Rules
6. Error Codes
7. Mock Examples

================================================================================
                              1. OVERVIEW
================================================================================

The Industry Company Profile API allows industry users to create, update, and
manage their company profiles for verification. The API supports:

- Draft profile creation with partial updates
- Document upload management
- Profile submission for verification
- Profile locking mechanism
- Completion percentage tracking

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
  "userType": "Industry",
  "userSubType": "Manufacturing",
  "role": "IndustryAdmin"
}

================================================================================
                          3. API ENDPOINTS
================================================================================

--------------------------------------------------------------------------------
3.1 SAVE/UPDATE COMPANY PROFILE
--------------------------------------------------------------------------------

Endpoint: POST /api/v1/industry/company-profile
Description: Create or update company profile (supports partial updates)
Authentication: Required
Profile Lock: Cannot update when locked

REQUEST HEADERS:
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "companyName": "Tech Innovations Pvt Ltd",
  "industryType": "IT Services",
  "companyDescription": "We are a leading technology company specializing in innovative software solutions for businesses across various industries.",
  "yearEstablished": "2015",
  "panNumber": "AABCU9603R",
  "gstNumber": "27AABCU9603R1Z5",
  "registrationNumber": "U72900MH2015PTC123456",
  "email": "contact@techinnovations.com",
  "mobile": "+919876543210",
  "telephone": "02212345678",
  "website": "https://www.techinnovations.com",
  "addresses": [
    {
      "line1": "123, Tech Park, Andheri East",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400069",
      "isPrimary": true
    }
  ]
}

SUCCESS RESPONSE (200 OK):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": {
      "id": "prof_1234567890",
      "companyName": "Tech Innovations Pvt Ltd",
      "industryType": "IT Services",
      "companyDescription": "We are a leading technology company...",
      "yearEstablished": "2015",
      "panNumber": "AABCU9603R",
      "gstNumber": "27AABCU9603R1Z5",
      "registrationNumber": "U72900MH2015PTC123456",
      "email": "contact@techinnovations.com",
      "mobile": "+919876543210",
      "telephone": "02212345678",
      "website": "https://www.techinnovations.com",
      "addresses": [...],
      "documents": [],
      "verificationStatus": "incomplete",
      "verificationSubmittedAt": null,
      "verificationCompletedAt": null,
      "verificationRemarks": null,
      "isProfileComplete": false,
      "profileCompletionPercentage": 85,
      "isLocked": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T14:45:00.000Z"
    },
    "missingFields": [],
    "missingDocuments": ["pan_card", "gst_certificate", "registration_certificate", "address_proof"]
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

--------------------------------------------------------------------------------
3.2 GET COMPANY PROFILE
--------------------------------------------------------------------------------

Endpoint: GET /api/v1/industry/company-profile
Description: Retrieve complete company profile with all fields and documents
Authentication: Required

REQUEST HEADERS:
Authorization: Bearer <token>

SUCCESS RESPONSE (200 OK):
{
  "success": true,
  "data": {
    "profile": {
      "id": "prof_1234567890",
      "companyName": "Tech Innovations Pvt Ltd",
      "industryType": "IT Services",
      "companyDescription": "We are a leading technology company...",
      "yearEstablished": "2015",
      "panNumber": "AABCU9603R",
      "gstNumber": "27AABCU9603R1Z5",
      "registrationNumber": "U72900MH2015PTC123456",
      "email": "contact@techinnovations.com",
      "mobile": "+919876543210",
      "telephone": "02212345678",
      "website": "https://www.techinnovations.com",
      "addresses": [
        {
          "line1": "123, Tech Park, Andheri East",
          "city": "Mumbai",
          "state": "Maharashtra",
          "pincode": "400069",
          "isPrimary": true
        }
      ],
      "documents": [
        {
          "id": "doc_pan_001",
          "name": "pan_card_1234567890.pdf",
          "type": "application/pdf",
          "size": 245680,
          "url": "/public/Tech_Innovations_Pvt_Ltd/pan_card_1234567890.pdf",
          "documentType": "pan_card",
          "uploadedAt": "2025-01-15T11:00:00.000Z",
          "status": "pending"
        }
      ],
      "verificationStatus": "incomplete",
      "verificationSubmittedAt": null,
      "verificationCompletedAt": null,
      "verificationRemarks": null,
      "isProfileComplete": false,
      "profileCompletionPercentage": 75,
      "isLocked": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T14:45:00.000Z"
    },
    "missingFields": [],
    "missingDocuments": ["gst_certificate", "registration_certificate", "address_proof"]
  }
}

ERROR RESPONSE (404 NOT FOUND):
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Company profile not found",
    "statusCode": 404
  }
}

--------------------------------------------------------------------------------
3.3 UPLOAD DOCUMENT
--------------------------------------------------------------------------------

Endpoint: POST /api/v1/industry/company-profile/documents/upload
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

VALID DOCUMENT TYPES:
- pan_card
- gst_certificate
- registration_certificate
- address_proof
- company_logo
- authorization_letter

FILE CONSTRAINTS:
- Max Size: 10MB (5MB for company_logo)
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
      "url": "/public/Tech_Innovations_Pvt_Ltd/pan_card_1234567890.pdf",
      "documentType": "pan_card",
      "uploadedAt": "2025-01-15T11:00:00.000Z",
      "status": "pending"
    },
    "replacedDocument": null
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
      "url": "/public/Tech_Innovations_Pvt_Ltd/pan_card_1234567891.pdf",
      "documentType": "pan_card",
      "uploadedAt": "2025-01-15T13:30:00.000Z",
      "status": "pending"
    },
    "replacedDocument": {
      "id": "doc_pan_001",
      "name": "pan_card_1234567890.pdf"
    }
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
3.4 DELETE DOCUMENT
--------------------------------------------------------------------------------

Endpoint: DELETE /api/v1/industry/company-profile/documents/:documentId
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
    "documentType": "pan_card"
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
3.5 SUBMIT FOR VERIFICATION
--------------------------------------------------------------------------------

Endpoint: POST /api/v1/industry/company-profile/submit-verification
Description: Submit profile for admin verification (LOCKS profile permanently)
Authentication: Required
Requirements: Profile must be 100% complete with all documents uploaded

REQUEST HEADERS:
Authorization: Bearer <token>
Content-Type: application/json

REQUEST BODY:
{
  "confirmSubmission": true
}

SUCCESS RESPONSE (200 OK):
{
  "success": true,
  "message": "Profile submitted for verification successfully",
  "data": {
    "verificationId": "prof_1234567890",
    "status": "pending",
    "submittedAt": "2025-01-15T12:00:00.000Z",
    "estimatedCompletionAt": "2025-01-17T12:00:00.000Z",
    "estimatedCompletionHours": 48,
    "isLocked": true,
    "nextSteps": [
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
      "completionPercentage": 75,
      "missingFields": [],
      "missingDocuments": ["gst_certificate", "registration_certificate", "address_proof"],
      "requiredActions": [
        "Upload GST Certificate",
        "Upload Registration Certificate",
        "Upload Address Proof"
      ]
    },
    "statusCode": 422
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

ERROR RESPONSE (400 BAD REQUEST - Description Too Short):
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Company description must be at least 50 characters",
    "details": {
      "field": "companyDescription",
      "currentLength": 35,
      "minimumLength": 50
    },
    "statusCode": 400
  }
}

--------------------------------------------------------------------------------
3.6 GET PROFILE COMPLETION STATUS
--------------------------------------------------------------------------------

Endpoint: GET /api/v1/industry/company-profile/completion-status
Description: Get profile completion percentage and missing items
Authentication: Required

REQUEST HEADERS:
Authorization: Bearer <token>

SUCCESS RESPONSE (200 OK):
{
  "success": true,
  "data": {
    "completionPercentage": 75,
    "isProfileComplete": false,
    "missingFields": [],
    "missingDocuments": ["gst_certificate", "registration_certificate", "address_proof"],
    "canSubmit": false
  }
}

SUCCESS RESPONSE (200 OK - Complete Profile):
{
  "success": true,
  "data": {
    "completionPercentage": 100,
    "isProfileComplete": true,
    "missingFields": [],
    "missingDocuments": [],
    "canSubmit": true
  }
}

================================================================================
                          4. DATA MODELS
================================================================================

COMPANY PROFILE:
{
  "id": String,
  "companyName": String (Required),
  "industryType": String (Required, Enum),
  "companyDescription": String (Required, Min 50 chars),
  "yearEstablished": String (Required, 4 digits),
  "panNumber": String (Required, 10 chars),
  "gstNumber": String (Required, 15 chars),
  "registrationNumber": String (Required),
  "email": String (Required, Valid email),
  "mobile": String (Required, 10-15 digits),
  "telephone": String (Optional),
  "website": String (Optional),
  "addresses": Array (Required, Min 1),
  "documents": Array,
  "verificationStatus": String (incomplete/pending/approved/rejected),
  "verificationSubmittedAt": Date,
  "verificationCompletedAt": Date,
  "verificationRemarks": String,
  "isProfileComplete": Boolean,
  "profileCompletionPercentage": Number (0-100),
  "isLocked": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}

ADDRESS:
{
  "line1": String (Required),
  "city": String (Required),
  "state": String (Required),
  "pincode": String (Required, 6 digits),
  "isPrimary": Boolean
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

================================================================================
                          5. VALIDATION RULES
================================================================================

FIELD VALIDATIONS:
- companyName: Required, Non-empty, Max 200 chars
- industryType: Required, Enum values
- companyDescription: Required, Min 50 chars, Max 1000 chars
- yearEstablished: Required, 4-digit year, 1800 ≤ year ≤ current year
- panNumber: Required, Exactly 10 chars, Format: AAAAA9999A
- gstNumber: Required, Exactly 15 chars, Format: 99AAAAA9999A9A9
- email: Required, Valid RFC 5322 email format
- mobile: Required, 10-15 digits, Optional country code
- telephone: Optional, 10-15 digits (if provided)
- website: Optional, Valid URL format (if provided)
- addresses: Required, Min 1 complete address
- pincode: Required, Exactly 6 digits

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
- Max size: 10MB (5MB for company_logo)
- Required documents: pan_card, gst_certificate, registration_certificate, address_proof

SUBMISSION VALIDATIONS:
- Profile completion: 100%
- All required fields: Filled
- All required documents: Uploaded
- Description length: ≥ 50 characters
- Profile status: incomplete or rejected
- Confirmation flag: true

================================================================================
                          6. ERROR CODES
================================================================================

AUTHENTICATION ERRORS:
- USER_NOT_FOUND (404): User not found in system
- UNAUTHORIZED (401): Invalid or missing token

PROFILE ERRORS:
- PROFILE_NOT_FOUND (404): Profile doesn't exist
- PROFILE_LOCKED (403): Profile is locked, cannot modify
- ALREADY_SUBMITTED (409): Profile already submitted
- INCOMPLETE_PROFILE (422): Profile not complete for submission

DOCUMENT ERRORS:
- NO_FILE (400): No file uploaded
- INVALID_FILE_TYPE (400): File type not supported
- FILE_TOO_LARGE (413): File size exceeds limit
- DOCUMENT_NOT_FOUND (404): Document doesn't exist
- INVALID_DOCUMENT_TYPE (400): Document type not valid

VALIDATION ERRORS:
- VALIDATION_ERROR (400): Field validation failed
- CONFIRMATION_REQUIRED (400): Confirmation flag missing

SYSTEM ERRORS:
- INTERNAL_ERROR (500): Internal server error

================================================================================
                          7. MOCK EXAMPLES
================================================================================

--------------------------------------------------------------------------------
EXAMPLE 1: First-Time Profile Creation
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/industry/company-profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "companyName": "Innovative Solutions Ltd",
  "industryType": "Manufacturing",
  "email": "info@innovativesolutions.com",
  "mobile": "+919988776655"
}

RESPONSE:
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "profile": {
      "id": "prof_9876543210",
      "companyName": "Innovative Solutions Ltd",
      "industryType": "Manufacturing",
      "companyDescription": null,
      "yearEstablished": null,
      "panNumber": null,
      "gstNumber": null,
      "registrationNumber": null,
      "email": "info@innovativesolutions.com",
      "mobile": "+919988776655",
      "telephone": null,
      "website": null,
      "addresses": [],
      "documents": [],
      "verificationStatus": "incomplete",
      "isProfileComplete": false,
      "profileCompletionPercentage": 30,
      "isLocked": false,
      "createdAt": "2025-01-15T09:00:00.000Z",
      "updatedAt": "2025-01-15T09:00:00.000Z"
    },
    "missingFields": [
      "companyDescription",
      "yearEstablished",
      "panNumber",
      "gstNumber",
      "registrationNumber",
      "addresses"
    ],
    "missingDocuments": [
      "pan_card",
      "gst_certificate",
      "registration_certificate",
      "address_proof"
    ]
  }
}

--------------------------------------------------------------------------------
EXAMPLE 2: Upload PAN Card Document
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/industry/company-profile/documents/upload
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

Form Data:
file: pan-card.pdf (binary)
documentType: pan_card

RESPONSE:
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "doc_pan_12345",
      "name": "pan_card_1705318800000.pdf",
      "type": "application/pdf",
      "size": 245680,
      "url": "/public/Innovative_Solutions_Ltd/pan_card_1705318800000.pdf",
      "documentType": "pan_card",
      "uploadedAt": "2025-01-15T11:00:00.000Z",
      "status": "pending"
    },
    "replacedDocument": null
  }
}

--------------------------------------------------------------------------------
EXAMPLE 3: Submit Complete Profile for Verification
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/industry/company-profile/submit-verification
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "confirmSubmission": true
}

RESPONSE:
{
  "success": true,
  "message": "Profile submitted for verification successfully",
  "data": {
    "verificationId": "prof_9876543210",
    "status": "pending",
    "submittedAt": "2025-01-15T12:00:00.000Z",
    "estimatedCompletionAt": "2025-01-17T12:00:00.000Z",
    "estimatedCompletionHours": 48,
    "isLocked": true,
    "nextSteps": [
      "Our team will review your documents within 24-48 hours",
      "You will receive an email notification once review is complete",
      "Check your profile status at any time from the dashboard"
    ]
  }
}

--------------------------------------------------------------------------------
EXAMPLE 4: Attempt to Edit Locked Profile (Error)
--------------------------------------------------------------------------------

REQUEST:
POST /api/v1/industry/company-profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "website": "https://www.innovativesolutions.com"
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
                            END OF DOCUMENTATION
================================================================================
