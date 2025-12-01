# Bank Account API Documentation

## Overview
Bank account API provides endpoints for managing company bank account details including verification, IFSC lookup, and lock/unlock functionality. These endpoints are specific to industry users.

**Base URL:** `/api/v1/industry/bank-account`

---

## Endpoints

### 1. Get Bank Account Details
**GET** `/api/v1/industry/bank-account`

Get company's bank account details.

#### Response
```json
{
  "success": true,
  "data": {
    "id": "bank_123456",
    "bankName": "State Bank of India",
    "accountHolderName": "Tech Innovations Pvt Ltd",
    "accountNumber": "31234567890",
    "ifscCode": "SBIN0001234",
    "branchName": "Andheri East Branch",
    "accountType": "current",
    "upiId": "techinnovations@sbi",
    "upiQrCodeUrl": "/uploads/qr/tech_upi.png",
    "verificationStatus": "verified",
    "verifiedAt": "2025-01-15T10:00:00Z",
    "isLocked": true,
    "createdAt": "2025-01-10T08:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  },
  "message": "Bank account details retrieved successfully"
}
```

#### Status Codes
- `200` - Success
- `404` - No bank account found (first-time setup)
- `401` - Unauthorized
- `500` - Internal server error

---

### 2. Save/Update Bank Account Details
**POST** `/api/v1/industry/bank-account`

Save or update bank account details. Can only be done when account is not locked.

#### Request Body
```json
{
  "bankName": "State Bank of India",
  "accountHolderName": "Tech Innovations Pvt Ltd",
  "accountNumber": "31234567890",
  "ifscCode": "SBIN0001234",
  "branchName": "Andheri East Branch",
  "accountType": "current",
  "upiId": "techinnovations@sbi",
  "upiQrCodeUrl": "/uploads/qr/tech_upi.png"
}
```

#### Validation Rules
- `bankName`: Required, max 100 characters
- `accountHolderName`: Required, max 100 characters
- `accountNumber`: Required, digits only, 9-18 characters
- `ifscCode`: Required, exactly 11 characters, alphanumeric
- `branchName`: Required, max 100 characters
- `accountType`: Required, must be 'savings' or 'current'
- `upiId`: Optional, valid UPI format
- `upiQrCodeUrl`: Optional, valid URL

#### Response
```json
{
  "success": true,
  "data": {
    "id": "bank_123456",
    "bankName": "State Bank of India",
    "accountHolderName": "Tech Innovations Pvt Ltd",
    "accountNumber": "31234567890",
    "ifscCode": "SBIN0001234",
    "branchName": "Andheri East Branch",
    "accountType": "current",
    "upiId": "techinnovations@sbi",
    "upiQrCodeUrl": "/uploads/qr/tech_upi.png",
    "verificationStatus": "pending",
    "isLocked": false,
    "createdAt": "2025-01-10T08:00:00Z",
    "updatedAt": "2025-01-20T14:30:00Z"
  },
  "message": "Bank account details saved successfully"
}
```

---

### 3. Submit for Verification
**POST** `/api/v1/industry/bank-account/verify`

Submit bank account for verification. Account will be locked after successful verification.

#### Request Body
No body required. Verifies the currently saved bank account.

#### Response
```json
{
  "success": true,
  "data": {
    "status": "verified",
    "verificationId": "verify_789012",
    "message": "Bank account verified successfully"
  },
  "message": "Verification completed successfully"
}
```

#### Verification Status
- `pending` - Submitted, awaiting verification
- `verified` - Successfully verified and locked
- `rejected` - Verification failed, needs correction

---

### 4. Unlock Bank Account
**POST** `/api/v1/industry/bank-account/unlock`

Unlock a verified bank account for editing. Requires re-verification after editing.

#### Request Body
No body required.

#### Response
```json
{
  "success": true,
  "data": {
    "id": "bank_123456",
    "bankName": "State Bank of India",
    "accountHolderName": "Tech Innovations Pvt Ltd",
    "accountNumber": "31234567890",
    "ifscCode": "SBIN0001234",
    "branchName": "Andheri East Branch",
    "accountType": "current",
    "upiId": "techinnovations@sbi",
    "upiQrCodeUrl": "/uploads/qr/tech_upi.png",
    "verificationStatus": "pending",
    "isLocked": false,
    "createdAt": "2025-01-10T08:00:00Z",
    "updatedAt": "2025-01-22T09:15:00Z"
  },
  "message": "Bank account unlocked successfully. Re-verification required after editing."
}
```

---

### 5. IFSC Code Lookup
**GET** `/api/v1/industry/bank-account/ifsc/:code`

Get bank details by IFSC code for auto-filling bank and branch information.

#### URL Parameters
- `code` (string, required): 11-character IFSC code

#### Example Request
```
GET /api/v1/industry/bank-account/ifsc/SBIN0001234
```

#### Response
```json
{
  "success": true,
  "data": {
    "bank": "State Bank of India",
    "ifsc": "SBIN0001234",
    "branch": "Andheri East Branch",
    "address": "123 Main Road, Andheri East",
    "city": "Mumbai",
    "district": "Mumbai",
    "state": "Maharashtra"
  },
  "message": "Bank details retrieved successfully"
}
```

#### Error Response (Invalid IFSC)
```json
{
  "success": false,
  "message": "Invalid IFSC code or bank details not found"
}
```

---

## Data Models

### BankAccount
```typescript
{
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountType: 'savings' | 'current';
  upiId?: string;
  upiQrCodeUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### IFSCDetails
```typescript
{
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

## Error Responses

### 400 Bad Request (Locked Account)
```json
{
  "success": false,
  "message": "Bank account is locked. Please unlock before making changes."
}
```

### 400 Bad Request (Validation Error)
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

### 404 Not Found
```json
{
  "success": false,
  "message": "Bank account not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Cannot unlock account. Account is not verified."
}
```

---

## Workflow

### First-Time Setup
1. **GET** `/bank-account` → Returns 404
2. **POST** `/bank-account` → Save details, status: `pending`
3. **POST** `/bank-account/verify` → Submit for verification, status: `verified`, locked: `true`

### Editing Locked Account
1. **POST** `/bank-account/unlock` → Unlock account, status: `pending`, locked: `false`
2. **POST** `/bank-account` → Update details, status: `pending`
3. **POST** `/bank-account/verify` → Re-verify, status: `verified`, locked: `true`

### Auto-fill with IFSC
1. User enters IFSC code (11 characters)
2. **GET** `/bank-account/ifsc/:code` → Auto-fill bank name and branch

---

## Security Considerations

1. **Encryption**: All sensitive data (account numbers) encrypted at rest
2. **Audit Trail**: All changes logged with user ID and timestamp
3. **Verification Lock**: Prevents accidental changes to verified accounts
4. **Rate Limiting**: IFSC lookup limited to 10 requests per minute
5. **Permission Check**: Only company admins can modify bank accounts

---

## Usage Example

```typescript
import { bankAccountService } from '@/services/modules/bank-account';

// Save bank account
const account = await bankAccountService.saveAccount({
  bankName: 'State Bank of India',
  accountHolderName: 'Tech Innovations Pvt Ltd',
  accountNumber: '31234567890',
  ifscCode: 'SBIN0001234',
  branchName: 'Andheri East Branch',
  accountType: 'current'
});

// Verify account
await bankAccountService.verifyAccount();

// Get IFSC details
const ifscDetails = await bankAccountService.getBankByIFSC('SBIN0001234');
```
