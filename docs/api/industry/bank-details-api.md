# Bank Details API (Company Profile)

This API allows industry users to manage bank account details as part of their Company Profile. Bank details are stored within the Industry Profile Collection and linked to the authenticated company.

## Base URL
```
/api/v1/industry/company-profile
```

## Authentication
All endpoints require:
- Valid JWT token in Authorization header
- User must have Industry role
- User must belong to a verified company

---

## Endpoints

### 1. Get Bank Details

Retrieve the bank account details from the company profile.

**Endpoint:** `GET /api/v1/industry/company-profile/bank-details`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bankName": "State Bank of India",
    "accountHolderName": "Tech Innovations Pvt Ltd",
    "accountNumber": "****7890",
    "ifscCode": "SBIN0001234",
    "branchName": "Andheri East Branch",
    "accountType": "current",
    "upiId": "techinnovations@sbi",
    "upiQrCodeUrl": "/uploads/qr/tech_upi.png",
    "verificationStatus": "verified",
    "verifiedAt": "2025-01-15T10:00:00Z",
    "isLocked": true,
    "updatedAt": "2025-01-15T10:00:00Z"
  },
  "message": "Bank details retrieved successfully"
}
```

**Response (200) - No Bank Details Yet:**
```json
{
  "success": true,
  "data": null,
  "message": "No bank details found"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Company profile not found"
}
```

---

### 2. Update Bank Details

Save or update bank account details in the company profile. Only allowed if account is not locked or is in pending/rejected verification status.

**Endpoint:** `PATCH /api/v1/industry/company-profile/bank-details`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "bankName": "HDFC Bank",
  "accountHolderName": "Tech Innovations Pvt Ltd",
  "accountNumber": "50100123456789",
  "ifscCode": "HDFC0001234",
  "branchName": "Andheri West Branch",
  "accountType": "current",
  "upiId": "techinnovations@hdfc",
  "upiQrCodeUrl": "/uploads/qr/hdfc_upi.png"
}
```

**Request Body Schema:**
```typescript
{
  bankName: string;              // Required
  accountHolderName: string;     // Required
  accountNumber: string;         // Required (min 9, max 18 digits)
  ifscCode: string;              // Required (11 characters)
  branchName: string;            // Required
  accountType: 'savings' | 'current';  // Required
  upiId?: string;                // Optional
  upiQrCodeUrl?: string;         // Optional (file path after upload)
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bankName": "HDFC Bank",
    "accountHolderName": "Tech Innovations Pvt Ltd",
    "accountNumber": "****6789",
    "ifscCode": "HDFC0001234",
    "branchName": "Andheri West Branch",
    "accountType": "current",
    "upiId": "techinnovations@hdfc",
    "upiQrCodeUrl": "/uploads/qr/hdfc_upi.png",
    "verificationStatus": "pending",
    "isLocked": false,
    "updatedAt": "2025-01-20T14:30:00Z"
  },
  "message": "Bank details updated successfully"
}
```

**Error Response (400) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "accountNumber",
      "message": "Account number must be between 9 and 18 digits"
    },
    {
      "field": "ifscCode",
      "message": "IFSC code must be exactly 11 characters"
    }
  ]
}
```

**Error Response (403) - Account Locked:**
```json
{
  "success": false,
  "message": "Bank account is locked. Please unlock it before making changes.",
  "code": "ACCOUNT_LOCKED"
}
```

---

### 3. Verify Bank Details

Submit the bank account details for verification. Once verified, the account will be locked.

**Endpoint:** `POST /api/v1/industry/company-profile/bank-details/verify`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "pending",
    "verificationId": "VER-20250120-001",
    "message": "Bank details submitted for verification. You will be notified once the verification is complete."
  },
  "message": "Verification request submitted successfully"
}
```

**Error Response (400) - Missing Bank Details:**
```json
{
  "success": false,
  "message": "Please save bank details before submitting for verification"
}
```

**Error Response (400) - Already Verified:**
```json
{
  "success": false,
  "message": "Bank account is already verified"
}
```

---

### 4. Unlock Bank Details

Unlock a verified bank account to allow editing. Requires admin approval or specific permissions.

**Endpoint:** `POST /api/v1/industry/company-profile/bank-details/unlock`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "reason": "Need to update bank account due to branch change"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bankName": "HDFC Bank",
    "accountHolderName": "Tech Innovations Pvt Ltd",
    "accountNumber": "****6789",
    "ifscCode": "HDFC0001234",
    "branchName": "Andheri West Branch",
    "accountType": "current",
    "verificationStatus": "pending",
    "isLocked": false,
    "updatedAt": "2025-01-21T09:00:00Z"
  },
  "message": "Bank account unlocked successfully. You can now edit the details."
}
```

**Error Response (400) - Not Locked:**
```json
{
  "success": false,
  "message": "Bank account is not locked"
}
```

**Error Response (403) - Permission Denied:**
```json
{
  "success": false,
  "message": "You don't have permission to unlock bank accounts"
}
```

---

### 5. IFSC Code Lookup

Look up bank details using IFSC code. This is a utility endpoint to auto-fill bank and branch information.

**Endpoint:** `GET /api/v1/industry/ifsc/:code`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `code` (string, required): 11-character IFSC code

**Example Request:**
```
GET /api/v1/industry/ifsc/HDFC0001234
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bank": "HDFC Bank",
    "ifsc": "HDFC0001234",
    "branch": "Andheri West Branch",
    "address": "Shop No 1-3, Oshiwara Industrial Centre, New Link Road",
    "city": "Mumbai",
    "district": "Mumbai Suburban",
    "state": "Maharashtra"
  },
  "message": "IFSC details retrieved successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Invalid IFSC code"
}
```

---

## Data Models

### BankDetails (Nested within IndustryProfile)

```typescript
interface BankDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;        // Encrypted in database, masked in responses
  ifscCode: string;
  branchName: string;
  accountType: 'savings' | 'current';
  upiId?: string;
  upiQrCodeUrl?: string;        // Path to uploaded QR code image
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedAt?: Date;
  rejectionReason?: string;     // Populated if status is 'rejected'
  isLocked: boolean;            // true after verification
  updatedAt: Date;
}
```

### IFSCDetails

```typescript
interface IFSCDetails {
  bank: string;
  ifsc: string;
  branch: string;
  address: string;
  city: string;
  district: string;
  state: string;
}
```

---

## Business Rules

### Account Locking
- Bank account is automatically locked when `verificationStatus` changes to `verified`
- Locked accounts cannot be edited without unlocking first
- Unlocking requires specific permissions (Company Administrator role)
- Unlocking resets `verificationStatus` to `pending`

### Account Number Security
- Account numbers are encrypted at rest in the database
- API responses mask account numbers (e.g., `****7890`)
- Full account number is only stored and transmitted during initial save/update

### Verification Workflow
1. User enters bank details and saves
2. User clicks "Submit for Verification"
3. Verification status set to `pending`
4. Admin reviews and approves/rejects
5. If approved: status → `verified`, `isLocked` → `true`
6. If rejected: status → `rejected`, rejection reason provided
7. User can edit and resubmit if rejected

### UPI Details
- UPI ID and QR code are optional
- QR code file must be uploaded separately via file upload endpoint
- QR code URL is the relative path to the uploaded file

---

## Error Responses

### Common Errors

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "You don't have permission to perform this action"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Company profile not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "An error occurred while processing your request"
}
```

---

## Security Considerations

1. **Encryption**: All sensitive bank details (account numbers) are encrypted at rest
2. **Masking**: Account numbers are masked in all API responses except during initial save
3. **Audit Trail**: All bank detail changes are logged with user ID, timestamp, and action
4. **Rate Limiting**: IFSC lookup endpoint limited to 10 requests per minute per user
5. **Permissions**: Only Company Administrators can unlock verified accounts
6. **Validation**: Strong validation on IFSC codes, account numbers, and bank details

---

## Usage Examples

### Complete Bank Details Setup Flow

```javascript
// 1. Fetch IFSC details to auto-fill bank information
const ifscData = await api.get('/api/v1/industry/ifsc/HDFC0001234');

// 2. Save bank details with auto-filled information
const saveResponse = await api.patch('/api/v1/industry/company-profile/bank-details', {
  bankName: ifscData.data.bank,
  accountHolderName: "Tech Innovations Pvt Ltd",
  accountNumber: "50100123456789",
  ifscCode: "HDFC0001234",
  branchName: ifscData.data.branch,
  accountType: "current",
  upiId: "techinnovations@hdfc"
});

// 3. Submit for verification
const verifyResponse = await api.post('/api/v1/industry/company-profile/bank-details/verify', {});

// 4. Later, if need to edit verified account
const unlockResponse = await api.post('/api/v1/industry/company-profile/bank-details/unlock', {
  reason: "Need to update bank account due to branch change"
});

// 5. Update bank details after unlocking
const updateResponse = await api.patch('/api/v1/industry/company-profile/bank-details', {
  branchName: "New Branch Name"
});
```

---

## Integration with Company Profile

Bank details are stored as a nested object within the `IndustryProfile` MongoDB collection:

```javascript
{
  _id: ObjectId("..."),
  companyName: "Tech Innovations Pvt Ltd",
  industry: "manufacturing",
  email: "contact@techinnovations.com",
  // ... other company profile fields ...
  
  // Bank Details nested object
  bankDetails: {
    bankName: "HDFC Bank",
    accountHolderName: "Tech Innovations Pvt Ltd",
    accountNumber: "<encrypted>",
    ifscCode: "HDFC0001234",
    branchName: "Andheri West Branch",
    accountType: "current",
    verificationStatus: "verified",
    verifiedAt: "2025-01-15T10:00:00Z",
    isLocked: true,
    updatedAt: "2025-01-15T10:00:00Z"
  },
  
  createdAt: "2024-12-01T10:00:00Z",
  updatedAt: "2025-01-20T14:30:00Z"
}
```

This structure ensures:
- Single source of truth for all company data
- Automatic association with authenticated company
- Atomic updates (entire profile updated together)
- Consistent data model across the application
