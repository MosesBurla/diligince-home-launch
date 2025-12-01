# User Account Settings API Documentation

## Overview
User account settings API provides endpoints for managing user profile, notification preferences, security settings (password, 2FA), and active sessions. These endpoints are accessible to all authenticated users regardless of role or permissions.

**Base URL:** `/api/v1/auth/user`

---

## Endpoints

### 1. Get User Profile
**GET** `/api/v1/auth/user/profile`

Get authenticated user's profile information.

#### Response
```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "phone": "+919876543210",
    "role": "industry",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-06-20T14:30:00Z"
  },
  "message": "Profile retrieved successfully"
}
```

---

### 2. Get Notification Preferences
**GET** `/api/v1/auth/user/notifications`

Get user's notification preferences.

#### Response
```json
{
  "success": true,
  "data": {
    "email": true,
    "sms": false,
    "push": true,
    "channels": {
      "requirements": true,
      "approvals": true,
      "payments": false,
      "messages": true,
      "systemAlerts": true
    },
    "digestFrequency": "daily",
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00"
    }
  },
  "message": "Notification preferences retrieved successfully"
}
```

---

### 3. Update Notification Preferences
**PATCH** `/api/v1/auth/user/notifications`

Update user's notification preferences.

#### Request Body
```json
{
  "email": true,
  "sms": false,
  "push": true,
  "channels": {
    "requirements": true,
    "approvals": true,
    "payments": false,
    "messages": true,
    "systemAlerts": true
  },
  "digestFrequency": "daily",
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "email": true,
    "sms": false,
    "push": true,
    "channels": {
      "requirements": true,
      "approvals": true,
      "payments": false,
      "messages": true,
      "systemAlerts": true
    },
    "digestFrequency": "daily",
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00"
    }
  },
  "message": "Notification preferences updated successfully"
}
```

---

### 4. Change Password
**PATCH** `/api/v1/auth/user/security/password`

Change user's password.

#### Request Body
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePass456!"
}
```

#### Response
```json
{
  "success": true,
  "data": null,
  "message": "Password changed successfully"
}
```

#### Validation Rules
- Current password must be correct
- New password must be at least 8 characters
- New password must contain uppercase, lowercase, number, and special character
- New password cannot be the same as current password

---

### 5. Toggle Two-Factor Authentication
**PATCH** `/api/v1/auth/user/security/2fa`

Enable or disable two-factor authentication.

#### Request Body
```json
{
  "enabled": true,
  "code": "123456"
}
```

**Parameters:**
- `enabled` (boolean, required): True to enable, false to disable
- `code` (string, optional): Verification code when enabling 2FA

#### Response (Enable)
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "method": "app"
  },
  "message": "Two-factor authentication enabled successfully"
}
```

#### Response (Disable)
```json
{
  "success": true,
  "data": {
    "enabled": false
  },
  "message": "Two-factor authentication disabled successfully"
}
```

---

### 6. Get 2FA Status
**GET** `/api/v1/auth/user/security/2fa/status`

Get current 2FA status.

#### Response
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "method": "app"
  },
  "message": "2FA status retrieved successfully"
}
```

---

### 7. Generate Recovery Codes
**POST** `/api/v1/auth/user/security/recovery-codes`

Generate new recovery codes for 2FA.

#### Response
```json
{
  "success": true,
  "data": {
    "codes": [
      "ABCD-1234-EFGH",
      "IJKL-5678-MNOP",
      "QRST-9012-UVWX",
      "YZAB-3456-CDEF",
      "GHIJ-7890-KLMN"
    ],
    "generatedAt": "2024-06-20T10:30:00Z"
  },
  "message": "Recovery codes generated successfully"
}
```

---

### 8. Get Active Sessions
**GET** `/api/v1/auth/user/security/sessions`

Get all active sessions for the user.

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "session_123",
      "device": "Chrome",
      "browser": "Chrome 115.0",
      "location": "Mumbai, India",
      "ipAddress": "192.168.1.1",
      "lastActive": "2024-06-20T14:30:00Z",
      "isCurrent": true
    },
    {
      "id": "session_456",
      "device": "iPhone",
      "browser": "Safari 16.0",
      "location": "Delhi, India",
      "ipAddress": "192.168.1.2",
      "lastActive": "2024-06-20T10:15:00Z",
      "isCurrent": false
    }
  ],
  "message": "Active sessions retrieved successfully"
}
```

---

### 9. Revoke Session
**DELETE** `/api/v1/auth/user/security/sessions/:sessionId`

Revoke a specific session (logout from that device).

#### URL Parameters
- `sessionId` (string, required): ID of the session to revoke

#### Response
```json
{
  "success": true,
  "data": null,
  "message": "Session revoked successfully"
}
```

---

## Data Models

### NotificationPreferences
```typescript
{
  email: boolean;
  sms: boolean;
  push: boolean;
  channels: {
    requirements: boolean;
    approvals: boolean;
    payments: boolean;
    messages: boolean;
    systemAlerts: boolean;
  };
  digestFrequency: 'instant' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}
```

### TwoFactorAuthStatus
```typescript
{
  enabled: boolean;
  method?: 'app' | 'sms';
}
```

### ActiveSession
```typescript
{
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string; // ISO 8601
  isCurrent: boolean;
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request data",
  "errors": [
    {
      "field": "newPassword",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Session not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred while processing your request"
}
```

---

## Security Notes

1. **Authentication Required**: All endpoints require valid JWT token in Authorization header
2. **Password Validation**: Enforced on server-side with strong password requirements
3. **2FA Codes**: Valid for 30 seconds (TOTP standard)
4. **Recovery Codes**: Single-use only, generate new set after using
5. **Session Management**: Current session cannot be revoked (logout endpoint should be used)
6. **Rate Limiting**: Password change and 2FA operations limited to 5 attempts per hour

---

## Usage Example

```typescript
import { userAccountService } from '@/services/modules/user-account';

// Update notification preferences
const preferences = await userAccountService.updateNotificationPreferences({
  email: true,
  push: false,
  digestFrequency: 'daily'
});

// Change password
await userAccountService.changePassword({
  currentPassword: 'oldPass123',
  newPassword: 'newSecurePass456!'
});

// Enable 2FA
const status = await userAccountService.toggle2FA({
  enabled: true,
  code: '123456'
});
```
