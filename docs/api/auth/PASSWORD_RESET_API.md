# Password Reset API Specification

## Overview

This document specifies the API endpoints for the password reset flow. These endpoints are generic and work for all user types (Industry, Professional, Vendor).

---

## Endpoints

### 1. Forgot Password (Request Reset Link)

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Purpose:** Send a password reset email to the user

**Authentication:** None required

---

#### Request

```json
{
  "email": "user@example.com"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's registered email address |

---

#### Response (200 OK - Success)

```json
{
  "success": true,
  "message": "Password reset link has been sent to your email"
}
```

> **Security Note:** Always return a success message even if the email doesn't exist in the system. This prevents email enumeration attacks.

---

#### Response (429 Too Many Requests)

```json
{
  "success": false,
  "error": "RATE_LIMITED",
  "message": "Too many reset attempts. Please try again later.",
  "retryAfter": 300
}
```

| Field | Type | Description |
|-------|------|-------------|
| retryAfter | number | Seconds until next attempt allowed |

---

### 2. Reset Password (Submit New Password)

**Endpoint:** `POST /api/v1/auth/reset-password`

**Purpose:** Reset the user's password using the token from the email

**Authentication:** None required (token-based validation)

---

#### Request

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "NewSecureP@ssw0rd!"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | Yes | Reset token from email link |
| password | string | Yes | New password (must meet requirements) |

---

#### Response (200 OK - Success)

```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

---

#### Response (400 Bad Request - Invalid/Expired Token)

```json
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "Reset link is invalid or has expired"
}
```

---

#### Response (400 Bad Request - Token Already Used)

```json
{
  "success": false,
  "error": "TOKEN_USED",
  "message": "This reset link has already been used"
}
```

---

#### Response (400 Bad Request - Weak Password)

```json
{
  "success": false,
  "error": "WEAK_PASSWORD",
  "message": "Password does not meet requirements",
  "requirements": {
    "minLength": 8,
    "requireUppercase": true,
    "requireLowercase": true,
    "requireNumber": true,
    "requireSpecial": true
  }
}
```

---

## Backend Implementation Notes

### Token Generation

1. **Generate Token:**
   - Create a JWT or secure random token
   - Include: `userId`, `email`, `type: "password-reset"`, `exp` (expiry)
   - Recommended expiry: 1 hour

2. **Store Token Reference:**
   - Store a hash of the token in the database
   - Track: `userId`, `tokenHash`, `createdAt`, `expiresAt`, `used: boolean`

3. **Email Link Format:**
   ```
   https://app.diligince.ai/reset-password/{token}
   ```

### Token Validation

When processing `/reset-password`:

1. Verify token signature/format
2. Check token has not expired
3. Verify token type is "password-reset"
4. Check token has not been used (one-time use)
5. Retrieve user from token payload

### Password Requirements

Validate new password meets:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

### Security Considerations

1. **Rate Limiting:**
   - Limit to 3 reset requests per email per hour
   - Implement exponential backoff after failed attempts

2. **Token Security:**
   - Use cryptographically secure random token generation
   - Tokens should be single-use (mark as used after successful reset)
   - Invalidate all existing tokens when a new reset is requested

3. **Logging:**
   - Log password reset requests (without sensitive data)
   - Log successful password resets
   - Log failed attempts for security monitoring

4. **Email Security:**
   - Don't reveal whether email exists in system
   - Include warning in email about unexpected reset requests
   - Include link expiry information in email

5. **Password Handling:**
   - Never log the new password
   - Hash password before storing (bcrypt recommended)
   - Invalidate all active sessions after password reset

### Email Template

Use the existing template at: `docs/emailTemplates/auth/password-reset.html`

Template variables to replace:
- `{{user_name}}` - User's first name or "User"
- `{{reset_password_url}}` - Full reset URL with token
- `{{reset_code}}` - Optional: Short numeric code if using dual verification
- `{{current_year}}` - Current year for footer

---

## Error Codes Reference

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| RATE_LIMITED | 429 | Too many requests, try later |
| INVALID_TOKEN | 400 | Token is malformed or invalid |
| EXPIRED_TOKEN | 400 | Token has expired |
| TOKEN_USED | 400 | Token has already been used |
| WEAK_PASSWORD | 400 | Password doesn't meet requirements |
| USER_NOT_FOUND | 400 | User account not found (internal only) |
| INTERNAL_ERROR | 500 | Server error during processing |

---

## Frontend Integration

### Routes
- `/forgot-password` - Request reset link form
- `/reset-password/:token` - Reset password form

### API Calls

```typescript
// Request reset link
authService.forgotPassword(email: string): Promise<ForgotPasswordResponse>

// Reset password with token
authService.resetPassword(token: string, password: string): Promise<ResetPasswordResponse>
```

### Flow

1. User clicks "Forgot Password" on login page
2. User enters email on `/forgot-password`
3. Frontend calls `POST /auth/forgot-password`
4. User receives email with reset link
5. User clicks link → navigates to `/reset-password/{token}`
6. User enters new password
7. Frontend calls `POST /auth/reset-password` with token + password
8. On success, redirect to `/login` with success message

---

## Database Schema (Suggestion)

```javascript
// password_reset_tokens collection/table
{
  "_id": ObjectId,
  "userId": ObjectId,           // Reference to user
  "email": String,              // User's email
  "tokenHash": String,          // Hashed token for verification
  "createdAt": Date,
  "expiresAt": Date,
  "used": Boolean,              // Mark as used after successful reset
  "usedAt": Date,               // Timestamp when used
  "ipAddress": String,          // IP that requested reset
  "userAgent": String           // Browser/device info
}

// Indexes
{ "tokenHash": 1 }              // Fast lookup
{ "userId": 1 }                 // Find user's tokens
{ "expiresAt": 1 }              // TTL index for cleanup
```

---

## Testing Checklist

- [ ] Valid email receives reset link
- [ ] Invalid email still shows success (security)
- [ ] Rate limiting works after 3 attempts
- [ ] Valid token allows password reset
- [ ] Expired token shows appropriate error
- [ ] Used token cannot be reused
- [ ] Weak passwords are rejected
- [ ] Strong passwords are accepted
- [ ] User can login with new password
- [ ] Old password no longer works
- [ ] All sessions invalidated after reset
