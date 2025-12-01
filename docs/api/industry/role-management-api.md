# Role Management API Documentation

## Base URL
```
/api/v1/auth/company/roles
```

## Authentication
All endpoints require Bearer token authentication.

```
Authorization: Bearer {access_token}
```

---

## Data Schemas

### PermissionFlags
```typescript
{
  "read": boolean,
  "write": boolean,
  "edit": boolean,
  "delete": boolean,
  "download": boolean
}
```

### SubmodulePermission
```typescript
{
  "id": string,           // e.g., "create-requirement"
  "name": string,         // e.g., "Create New"
  "path": string,         // e.g., "/dashboard/create-requirement"
  "icon": string,         // e.g., "Edit"
  "permissions": PermissionFlags
}
```

### ModulePermissionV2
```typescript
{
  "id": string,           // e.g., "industry-requirements"
  "name": string,         // e.g., "Requirements"
  "path": string,         // e.g., "/dashboard/industry-requirements"
  "icon": string,         // e.g., "FileText"
  "permissions": PermissionFlags,
  "submodules": SubmodulePermission[]
}
```

### Role
```typescript
{
  "id": string,
  "name": string,         // Role identifier (e.g., "IndustryAdmin")
  "displayName": string,  // Human-readable name
  "description": string,
  "userType": "IndustryMember",
  "isSystemRole": boolean,
  "isDefault": boolean,
  "isActive": boolean,
  "permissionsV2": ModulePermissionV2[],
  "userCount": number,
  "createdBy": string,
  "createdAt": string,
  "updatedAt": string
}
```

### RoleStatistics
```typescript
{
  "totalRoles": number,
  "systemRoles": number,
  "customRoles": number,
  "activeRoles": number,
  "inactiveRoles": number,
  "totalAssignments": number
}
```

---

## Endpoints

### 1. Get All Roles

**GET** `/api/v1/auth/company/roles`

Get all roles for the company with optional filtering.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| search | string | No | Search in name, displayName, description |
| isSystemRole | boolean | No | Filter by system/custom roles |
| isActive | boolean | No | Filter by active status |
| sortBy | string | No | Sort field (default: "createdAt") |
| sortOrder | string | No | "asc" or "desc" (default: "desc") |

#### Response - Success (200)
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "roles": [
      {
        "id": "6925dc63409bf48e4eff6f35",
        "name": "IndustryAdmin",
        "displayName": "Industry Administrator",
        "description": "Full access to industry management modules and limited system administration",
        "userType": "IndustryMember",
        "isSystemRole": true,
        "isDefault": true,
        "isActive": true,
        "userCount": 3,
        "createdAt": "2025-11-25T16:42:11.595Z",
        "updatedAt": "2025-11-25T16:42:11.595Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 4,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    },
    "statistics": {
      "totalRoles": 4,
      "systemRoles": 4,
      "customRoles": 0,
      "activeRoles": 4,
      "inactiveRoles": 0,
      "totalAssignments": 15
    }
  }
}
```

---

### 2. Get Role by ID

**GET** `/api/v1/auth/company/roles/:roleId`

Get detailed information about a specific role including full permissions structure.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| roleId | string | Yes | Role ID |

#### Response - Success (200)
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "6925dc63409bf48e4eff6f35",
    "name": "IndustryAdmin",
    "displayName": "Industry Administrator",
    "description": "Full access to industry management modules and limited system administration",
    "userType": "IndustryMember",
    "isSystemRole": true,
    "isDefault": true,
    "isActive": true,
    "permissionsV2": [
      {
        "id": "industry-dashboard",
        "name": "Dashboard",
        "path": "/dashboard/industry",
        "icon": "LayoutDashboard",
        "permissions": {
          "read": true,
          "write": true,
          "edit": true,
          "delete": false,
          "download": false
        },
        "submodules": []
      },
      {
        "id": "industry-requirements",
        "name": "Requirements",
        "path": "/dashboard/industry-requirements",
        "icon": "FileText",
        "permissions": {
          "read": true,
          "write": true,
          "edit": true,
          "delete": true,
          "download": true
        },
        "submodules": [
          {
            "id": "create-requirement",
            "name": "Create New",
            "path": "/dashboard/create-requirement",
            "icon": "Edit",
            "permissions": {
              "read": true,
              "write": true,
              "edit": true,
              "delete": false,
              "download": false
            }
          }
        ]
      }
    ],
    "userCount": 3,
    "createdBy": "6925d6de23c5d620002a6eb3",
    "createdAt": "2025-11-25T16:42:11.595Z",
    "updatedAt": "2025-11-25T16:42:11.595Z"
  }
}
```

---

### 3. Get Permission Template

**GET** `/api/v1/auth/company/roles/template`

Get the master permission template for creating new roles. This returns all available modules with all permissions set to false.

#### Response - Success (200)
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "permissionsV2": [
      {
        "id": "industry-dashboard",
        "name": "Dashboard",
        "path": "/dashboard/industry",
        "icon": "LayoutDashboard",
        "permissions": {
          "read": false,
          "write": false,
          "edit": false,
          "delete": false,
          "download": false
        },
        "submodules": []
      }
    ]
  }
}
```

---

### 4. Create Role

**POST** `/api/v1/auth/company/roles`

Create a new custom role with specified permissions.

#### Request Body
```json
{
  "name": "CustomProcurementManager",
  "displayName": "Custom Procurement Manager",
  "description": "Custom role for procurement team with limited access",
  "permissionsV2": [
    {
      "id": "industry-dashboard",
      "name": "Dashboard",
      "path": "/dashboard/industry",
      "icon": "LayoutDashboard",
      "permissions": {
        "read": true,
        "write": false,
        "edit": false,
        "delete": false,
        "download": false
      },
      "submodules": []
    },
    {
      "id": "industry-requirements",
      "name": "Requirements",
      "path": "/dashboard/industry-requirements",
      "icon": "FileText",
      "permissions": {
        "read": true,
        "write": true,
        "edit": true,
        "delete": false,
        "download": true
      },
      "submodules": [
        {
          "id": "create-requirement",
          "name": "Create New",
          "path": "/dashboard/create-requirement",
          "icon": "Edit",
          "permissions": {
            "read": true,
            "write": true,
            "edit": true,
            "delete": false,
            "download": false
          }
        }
      ]
    }
  ]
}
```

#### Response - Success (201)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Role created successfully",
  "data": {
    "id": "692abc123def456789012345",
    "name": "CustomProcurementManager",
    "displayName": "Custom Procurement Manager",
    "description": "Custom role for procurement team with limited access",
    "userType": "IndustryMember",
    "isSystemRole": false,
    "isDefault": false,
    "isActive": true,
    "permissionsV2": [...],
    "userCount": 0,
    "createdBy": "6925d6de23c5d620002a6eb3",
    "createdAt": "2025-11-28T10:30:00.000Z",
    "updatedAt": "2025-11-28T10:30:00.000Z"
  }
}
```

---

### 5. Update Role

**PUT** `/api/v1/auth/company/roles/:roleId`

Update an existing role. System roles cannot be updated.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| roleId | string | Yes | Role ID |

#### Request Body
```json
{
  "displayName": "Updated Procurement Manager",
  "description": "Updated description",
  "isActive": true,
  "permissionsV2": [...]
}
```

#### Response - Success (200)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Role updated successfully",
  "data": {
    "id": "692abc123def456789012345",
    "name": "CustomProcurementManager",
    "displayName": "Updated Procurement Manager",
    "description": "Updated description",
    "userType": "IndustryMember",
    "isSystemRole": false,
    "isDefault": false,
    "isActive": true,
    "permissionsV2": [...],
    "userCount": 2,
    "createdAt": "2025-11-28T10:30:00.000Z",
    "updatedAt": "2025-11-28T11:00:00.000Z"
  }
}
```

---

### 6. Delete Role

**DELETE** `/api/v1/auth/company/roles/:roleId`

Delete a custom role. System roles and roles with assigned users cannot be deleted.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| roleId | string | Yes | Role ID |

#### Response - Success (200)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Role deleted successfully"
}
```

#### Response - Error (400)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Cannot delete system role"
}
```

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Cannot delete role with assigned users. Please reassign 5 users first."
}
```

---

### 7. Duplicate Role

**POST** `/api/v1/auth/company/roles/:roleId/duplicate`

Create a copy of an existing role with a new name.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| roleId | string | Yes | Source role ID |

#### Request Body
```json
{
  "name": "DuplicatedRole",
  "displayName": "Duplicated Role Name",
  "description": "Copy of Industry Administrator"
}
```

#### Response - Success (201)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Role duplicated successfully",
  "data": {
    "id": "692xyz987fed654321098765",
    "name": "DuplicatedRole",
    "displayName": "Duplicated Role Name",
    "description": "Copy of Industry Administrator",
    "userType": "IndustryMember",
    "isSystemRole": false,
    "isDefault": false,
    "isActive": true,
    "permissionsV2": [...],
    "userCount": 0,
    "createdAt": "2025-11-28T12:00:00.000Z",
    "updatedAt": "2025-11-28T12:00:00.000Z"
  }
}
```

---

### 8. Toggle Role Status

**PATCH** `/api/v1/auth/company/roles/:roleId/status`

Activate or deactivate a role. System roles and default roles cannot be deactivated.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| roleId | string | Yes | Role ID |

#### Request Body
```json
{
  "isActive": false
}
```

#### Response - Success (200)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Role status updated successfully",
  "data": {
    "id": "692abc123def456789012345",
    "isActive": false
  }
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "statusCode": 400 | 401 | 403 | 404 | 500,
  "message": "Error message",
  "errors": [
    {
      "field": "displayName",
      "message": "Display name is required"
    }
  ]
}
```

### Common Error Codes

| Status Code | Message | Description |
|-------------|---------|-------------|
| 400 | Invalid request data | Missing required fields or validation errors |
| 401 | Unauthorized | Invalid or missing authentication token |
| 403 | Forbidden | User lacks permission to perform action |
| 404 | Role not found | Requested role does not exist |
| 409 | Role name already exists | Role name must be unique |
| 500 | Internal server error | Server-side error |

---

## Validation Rules

### Role Name
- Required
- 3-50 characters
- Alphanumeric, hyphens, underscores only
- Must be unique per company
- Cannot start with "System"

### Display Name
- Required
- 3-100 characters

### Description
- Optional
- Max 500 characters

### Permissions
- Must contain at least one module with read=true
- Module IDs must match template
- Submodule permissions cannot exceed parent module permissions

---

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per company

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1638360000
```
