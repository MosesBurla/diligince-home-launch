# Team Members Management API Documentation

## Base Path
`/api/v1/auth/company/members`

## Authentication
All endpoints require JWT authentication with IndustryAdmin role.

---

## 1. Get Available Roles for Company

**Endpoint:** `GET /api/v1/auth/company/roles`

**Description:** Get all roles available for this company (default + custom roles created by admin)

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| includeSystem | boolean | No | Include system default roles (default: true) |
| userType | string | No | Filter by user_type (IndustryMember) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "role-1",
        "name": "Company Administrator",
        "description": "Full access to all company features",
        "userType": "IndustryAdmin",
        "isSystemRole": false,
        "isDefault": true,
        "permissions": {
          "dashboard": ["read", "write"],
          "requirements": ["read", "write", "edit", "delete"]
        },
        "userCount": 1,
        "createdAt": "2024-01-15T08:00:00Z"
      }
    ],
    "statistics": {
      "totalRoles": 6,
      "defaultRoles": 4,
      "customRoles": 2,
      "totalAssignments": 25
    }
  }
}
```

---

## 2. Get All Team Members

**Endpoint:** `GET /api/v1/auth/company/members`

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10, max: 50) |
| search | string | No | Search by name, email, or phone |
| role | string | No | Filter by role ID |
| status | string | No | Filter by status (active, suspended, pending_verification) |
| department | string | No | Filter by department |
| sortBy | string | No | Sort field (createdAt, name, email, lastLoginAt) |
| sortOrder | string | No | Sort order (asc, desc) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "user_mongodb_id",
        "email": "member@company.com",
        "phone": "+919876543210",
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "role": "IndustryMember",
        "status": "active",
        "profileId": "company_profile_id",
        "department": "Procurement",
        "designation": "Procurement Manager",
        "assignedRole": {
          "id": "role-2",
          "name": "Procurement Manager",
          "description": "Manage procurement activities",
          "permissions": {
            "dashboard": ["read"],
            "requirements": ["read", "write", "edit"]
          },
          "assignedAt": "2024-01-15T09:00:00Z",
          "assignedBy": {
            "id": "admin_id",
            "name": "Admin User"
          }
        },
        "isEmailVerified": true,
        "isPhoneVerified": true,
        "lastLoginAt": "2024-11-24T10:30:00Z",
        "createdAt": "2024-01-15T08:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "statistics": {
      "totalMembers": 25,
      "activeMembers": 20,
      "pendingVerification": 3,
      "suspended": 2,
      "byRole": {
        "Procurement Manager": 8,
        "Department Viewer": 10,
        "Finance Manager": 5
      }
    }
  }
}
```

---

## 3. Create Team Member

**Endpoint:** `POST /api/v1/auth/company/members`

**Request Body:**
```json
{
  "email": "newmember@company.com",
  "phone": "+919876543210",
  "firstName": "Jane",
  "lastName": "Smith",
  "department": "Engineering",
  "designation": "Senior Engineer",
  "roleId": "role-2",
  "sendInvitation": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "member": {
      "id": "new_user_id",
      "email": "newmember@company.com",
      "phone": "+919876543210",
      "firstName": "Jane",
      "lastName": "Smith",
      "assignedRole": {
        "id": "role-2",
        "name": "Procurement Manager"
      },
      "tempPassword": "SecurePass123!@#",
      "verificationStatus": {
        "email": "sent",
        "phone": "sent"
      }
    }
  },
  "message": "Team member created successfully. Verification emails and SMS sent."
}
```

---

## 4. Update Team Member Role

**Endpoint:** `PATCH /api/v1/auth/company/members/:memberId/role`

**Request Body:**
```json
{
  "roleId": "role-3",
  "reason": "Promotion to Finance Manager"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "member_id",
    "previousRole": {
      "id": "role-2",
      "name": "Procurement Manager"
    },
    "newRole": {
      "id": "role-3",
      "name": "Finance Manager"
    },
    "changedAt": "2024-11-24T10:30:00Z"
  }
}
```

---

## 5. Update Team Member Basic Info

**Endpoint:** `PATCH /api/v1/auth/company/members/:memberId`

**Request Body:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe",
  "department": "Operations",
  "designation": "Senior Manager"
}
```

---

## 6. Other Endpoints

- `GET /api/v1/auth/company/members/:memberId` - Get member details
- `DELETE /api/v1/auth/company/members/:memberId` - Remove member
- `PATCH /api/v1/auth/company/members/:memberId/status` - Update status
- `POST /api/v1/auth/company/members/:memberId/resend-verification` - Resend verification
- `POST /api/v1/auth/company/members/bulk-action` - Bulk actions
- `GET /api/v1/auth/company/members/statistics` - Team statistics
- `GET /api/v1/auth/company/members/export` - Export members

---

## Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| MEMBER_NOT_FOUND | 404 | Team member not found |
| DUPLICATE_EMAIL | 400 | Email already exists |
| DUPLICATE_PHONE | 400 | Phone number already exists |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| SERVER_ERROR | 500 | Internal server error |

---

## Enhanced Login Flow

**Endpoint:** `POST /api/v1/auth/login`

**Enhanced Response includes role:**
```json
{
  "success": true,
  "data": {
    "user": { "..." },
    "assignedRole": {
      "id": "role-2",
      "name": "Procurement Manager",
      "permissions": { "..." }
    },
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

**Verification Required Response:**
```json
{
  "success": false,
  "error": {
    "code": "VERIFICATION_REQUIRED",
    "message": "Please verify your email and phone before logging in",
    "details": {
      "emailVerified": false,
      "phoneVerified": true,
      "userId": "user_id",
      "canResend": true
    }
  }
}
```
