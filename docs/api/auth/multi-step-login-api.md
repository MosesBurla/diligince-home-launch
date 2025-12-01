# Multi-Step Login API Documentation

This document outlines the API endpoints for the multi-step login flow with account selection and 2FA verification.

## Overview

The login flow consists of four steps:
1. **Email Lookup** - Find accounts associated with an email
2. **Account Selection** - User selects which account to log into
3. **Password Verification** - User enters password for selected account
4. **2FA Verification** (if enabled) - User verifies with OTP

---

## 1. Lookup Accounts by Email

Find all accounts associated with a given email address.

### Endpoint
```
POST /api/v1/auth/lookup-accounts
```

### Request Body
```json
{
  "email": "john.doe@example.com"
}
```

### Response (Success - Multiple Accounts)
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "id": "acc_123456",
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "userType": "industry",
        "role": "IndustryAdmin",
        "companyName": "Tech Corp Pvt Ltd",
        "avatar": "https://example.com/avatar1.jpg",
        "isActive": true,
        "lastLogin": "2025-01-15T10:30:00Z"
      },
      {
        "id": "acc_789012",
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "userType": "vendor",
        "role": "Vendor",
        "companyName": "JD Supplies",
        "avatar": "https://example.com/avatar2.jpg",
        "isActive": true,
        "lastLogin": "2025-01-10T08:15:00Z"
      },
      {
        "id": "acc_345678",
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "userType": "professional",
        "role": "Professional",
        "companyName": null,
        "avatar": null,
        "isActive": true,
        "lastLogin": "2025-01-05T14:20:00Z"
      }
    ]
  },
  "message": "Accounts retrieved successfully"
}
```

### Response (Success - Single Account)
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "id": "acc_123456",
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "userType": "industry",
        "role": "IndustryAdmin",
        "companyName": "Tech Corp PvLtd",
        "avatar": "https://example.com/avatar1.jpg",
        "isActive": true,
        "lastLogin": "2025-01-15T10:30:00Z"
      }
    ]
  },
  "message": "Account retrieved successfully"
}
```

### Response (No Accounts Found)
```json
{
  "success": false,
  "message": "No accounts found with this email address"
}
```

### Response (Validation Error)
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

---

## 2. Login with Account Selection

Authenticate user with selected account credentials.

### Endpoint
```
POST /api/v1/auth/login
```

### Request Body
```json
{
  "accountId": "acc_123456",
  "email": "john.doe@example.com",
  "userType": "industry",
  "password": "SecurePass123!"
}
```

### Response (Success - No 2FA)
```json
{
  "success": true,
  "data": {
    "twoFactorRequired": false,
    "user": {
      "id": "acc_123456",
      "email": "john.doe@example.com",
      "role": "IndustryAdmin",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "companyName": "Tech Corp Pvt Ltd",
        "vendorCategory": null,
        "isProfileComplete": true
      },
      "roleConfiguration": {
        "roleId": "role_admin_123",
        "roleName": "IndustryAdmin",
        "permissions": [
          {
            "id": "industry-dashboard",
            "name": "Dashboard",
            "path": "/dashboard/industry",
            "icon": "LayoutDashboard",
            "permissions": {
              "read": true,
              "write": true,
              "edit": true,
              "delete": true,
              "download": true
            },
            "submodules": []
          }
        ]
      }
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Response (Success - 2FA Required)
```json
{
  "success": true,
  "data": {
    "twoFactorRequired": true,
    "twoFactorToken": "temp_2fa_token_abc123xyz",
    "twoFactorMethod": "app",
    "expiresAt": "2025-01-20T15:35:00Z"
  },
  "message": "Two-factor authentication required"
}
```

### Response (Invalid Credentials)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Response (Account Inactive)
```json
{
  "success": false,
  "message": "Your account has been deactivated. Please contact support."
}
```

### Response (Account Locked)
```json
{
  "success": false,
  "message": "Your account has been locked due to multiple failed login attempts. Please try again after 15 minutes."
}
```

---

## 3. Verify 2FA OTP

Verify the OTP code for two-factor authentication.

### Endpoint
```
POST /api/v1/auth/2fa/verify
```

### Request Body
```json
{
  "twoFactorToken": "temp_2fa_token_abc123xyz",
  "code": "123456"
}
```

### Response (Success)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "acc_123456",
      "email": "john.doe@example.com",
      "role": "IndustryAdmin",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "companyName": "Tech Corp Pvt Ltd",
        "vendorCategory": null,
        "isProfileComplete": true
      },
      "roleConfiguration": {
        "roleId": "role_admin_123",
        "roleName": "IndustryAdmin",
        "permissions": [
          {
            "id": "industry-dashboard",
            "name": "Dashboard",
            "path": "/dashboard/industry",
            "icon": "LayoutDashboard",
            "permissions": {
              "read": true,
              "write": true,
              "edit": true,
              "delete": true,
              "download": true
            },
            "submodules": []
          }
        ]
      }
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Two-factor authentication verified successfully"
}
```

### Response (Invalid Code)
```json
{
  "success": false,
  "message": "Invalid verification code",
  "attemptsRemaining": 2
}
```

### Response (Expired Token)
```json
{
  "success": false,
  "message": "Two-factor authentication token has expired. Please log in again."
}
```

### Response (Token Not Found)
```json
{
  "success": false,
  "message": "Invalid two-factor authentication token"
}
```

---

## 4. Resend 2FA OTP

Request a new OTP code to be sent.

### Endpoint
```
POST /api/v1/auth/2fa/resend
```

### Request Body
```json
{
  "twoFactorToken": "temp_2fa_token_abc123xyz"
}
```

### Response (Success)
```json
{
  "success": true,
  "data": {
    "expiresAt": "2025-01-20T15:40:00Z",
    "resendCooldown": 60
  },
  "message": "OTP resent successfully"
}
```

### Response (Cooldown Active)
```json
{
  "success": false,
  "message": "Please wait 45 seconds before requesting a new OTP",
  "cooldownRemaining": 45
}
```

### Response (Max Attempts Reached)
```json
{
  "success": false,
  "message": "Maximum resend attempts reached. Please try logging in again after 15 minutes."
}
```

---

## Data Models

### AvailableAccount
```typescript
interface AvailableAccount {
  id: string;                    // Account ID
  email: string;                 // User email
  firstName: string;             // User first name
  lastName: string;              // User last name
  userType: 'industry' | 'professional' | 'vendor';  // Account type
  role: string;                  // User role (e.g., IndustryAdmin, Vendor)
  companyName?: string;          // Company name (for industry/vendor)
  avatar?: string;               // Avatar URL (optional)
  isActive: boolean;             // Account active status
  lastLogin?: string;            // Last login timestamp (ISO 8601)
}
```

### LoginRequest
```typescript
interface LoginRequest {
  accountId: string;             // Selected account ID from lookup
  email: string;                 // User email
  userType: string;              // Account type
  password: string;              // User password
}
```

### LoginResponse (2FA Not Required)
```typescript
interface LoginResponse {
  success: boolean;
  data: {
    twoFactorRequired: false;
    user: User;                  // Full user object with profile and permissions
    access_token: string;        // JWT access token
    refresh_token: string;       // JWT refresh token
  };
  message: string;
}
```

### LoginResponse (2FA Required)
```typescript
interface LoginResponse {
  success: boolean;
  data: {
    twoFactorRequired: true;
    twoFactorToken: string;      // Temporary token for 2FA verification
    twoFactorMethod: 'app' | 'sms';  // 2FA delivery method
    expiresAt: string;           // Token expiration time (ISO 8601)
  };
  message: string;
}
```

### Verify2FARequest
```typescript
interface Verify2FARequest {
  twoFactorToken: string;        // Token from login response
  code: string;                  // 6-digit OTP code
}
```

### Resend2FARequest
```typescript
interface Resend2FARequest {
  twoFactorToken: string;        // Token from login response
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Invalid email format | Email validation failed |
| 401 | Invalid email or password | Authentication failed |
| 401 | Invalid verification code | 2FA code is incorrect |
| 403 | Account deactivated | User account is inactive |
| 403 | Account locked | Too many failed attempts |
| 404 | No accounts found | Email has no associated accounts |
| 410 | Token expired | 2FA token has expired |
| 429 | Too many requests | Rate limit exceeded |

---

## Security Notes

1. **Account Lookup**: Does not reveal whether accounts exist if email is invalid
2. **Failed Attempts**: Account locks after 5 failed password attempts
3. **2FA Token**: Valid for 5 minutes only
4. **OTP Resend**: Maximum 3 resend attempts with 60-second cooldown
5. **Password Requirements**: Min 8 chars, uppercase, lowercase, number, special char
6. **Token Storage**: JWT tokens should be stored securely (httpOnly cookies recommended)

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/lookup-accounts` | 10 requests | 1 minute |
| `/login` | 5 requests | 5 minutes |
| `/2fa/verify` | 5 requests | 5 minutes |
| `/2fa/resend` | 3 requests | 5 minutes |

---

## Testing Scenarios

### Scenario 1: Single Account Login (No 2FA)
1. POST `/lookup-accounts` with email
2. Receive single account in response
3. POST `/login` with account credentials
4. Receive tokens immediately (twoFactorRequired: false)

### Scenario 2: Multiple Accounts Selection
1. POST `/lookup-accounts` with email
2. Receive multiple accounts
3. User selects desired account
4. POST `/login` with selected account credentials
5. Receive tokens (if no 2FA) or 2FA token

### Scenario 3: Login with 2FA
1. Complete steps 1-4 from Scenario 2
2. Receive `twoFactorToken` (twoFactorRequired: true)
3. POST `/2fa/verify` with token and OTP
4. Receive final tokens and user data

### Scenario 4: 2FA OTP Resend
1. During 2FA step, user doesn't receive OTP
2. POST `/2fa/resend` with twoFactorToken
3. Receive confirmation with new expiry time
4. User receives new OTP
5. POST `/2fa/verify` with new code
