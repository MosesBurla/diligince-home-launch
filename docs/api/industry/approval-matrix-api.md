# Approval Matrix API Documentation

## Overview
The Approval Matrix API provides endpoints for managing approval hierarchies used in requirement publishing workflows. Each matrix defines a sequence of approval levels with assigned team members who can approve or reject requirements.

## Base URL
```
/api/v1/auth/company/approval-matrix
```

---

## Endpoints

### 1. List All Approval Matrices

**GET** `/api/v1/auth/company/approval-matrix`

Get all approval matrices with pagination, search, and filters.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| search | string | No | Search by matrix name |
| status | string | No | Filter by status: 'active', 'inactive' |
| isDefault | boolean | No | Filter default matrices |
| sortBy | string | No | Sort field: 'name', 'createdAt', 'priority' |
| sortOrder | string | No | Sort order: 'asc', 'desc' |

#### Response
```json
{
  "success": true,
  "data": {
    "matrices": [
      {
        "id": "matrix_123",
        "name": "Standard Procurement Approval",
        "description": "Default approval matrix for procurement requirements",
        "isActive": true,
        "isDefault": true,
        "priority": 1,
        "levels": [
          {
            "id": "level_1",
            "order": 1,
            "name": "Department Head Approval",
            "description": "Initial approval by department head",
            "maxApprovalTimeHours": 24,
            "isRequired": true,
            "approvers": [
              {
                "id": "approver_1",
                "memberId": "member_123",
                "memberName": "John Doe",
                "memberEmail": "john@company.com",
                "memberRole": "Department Head",
                "memberDepartment": "Procurement",
                "isMandatory": true,
                "sequence": 1,
                "assignedAt": "2024-01-15T10:00:00Z",
                "assignedBy": {
                  "id": "admin_1",
                  "name": "Admin User",
                  "email": "admin@company.com"
                }
              }
            ]
          },
          {
            "id": "level_2",
            "order": 2,
            "name": "Finance Approval",
            "description": "Financial review and approval",
            "maxApprovalTimeHours": 48,
            "isRequired": true,
            "approvers": [
              {
                "id": "approver_2",
                "memberId": "member_456",
                "memberName": "Jane Smith",
                "memberEmail": "jane@company.com",
                "memberRole": "Finance Manager",
                "memberDepartment": "Finance",
                "isMandatory": true,
                "sequence": 1,
                "assignedAt": "2024-01-15T10:00:00Z",
                "assignedBy": {
                  "id": "admin_1",
                  "name": "Admin User",
                  "email": "admin@company.com"
                }
              },
              {
                "id": "approver_3",
                "memberId": "member_789",
                "memberName": "Bob Johnson",
                "memberEmail": "bob@company.com",
                "memberRole": "CFO",
                "memberDepartment": "Finance",
                "isMandatory": false,
                "sequence": 2,
                "assignedAt": "2024-01-15T10:00:00Z",
                "assignedBy": {
                  "id": "admin_1",
                  "name": "Admin User",
                  "email": "admin@company.com"
                }
              }
            ]
          }
        ],
        "statistics": {
          "totalLevels": 2,
          "totalApprovers": 3,
          "mandatoryApprovers": 2,
          "optionalApprovers": 1,
          "activeWorkflows": 15,
          "completedWorkflows": 142
        },
        "createdBy": {
          "id": "admin_1",
          "name": "Admin User",
          "email": "admin@company.com"
        },
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-02-20T14:30:00Z"
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
      "totalMatrices": 25,
      "activeMatrices": 18,
      "inactiveMatrices": 7,
      "defaultMatrix": 1,
      "totalApprovers": 45
    }
  }
}
```

---

### 2. Get Approval Matrix by ID

**GET** `/api/v1/auth/company/approval-matrix/:id`

Get detailed information about a specific approval matrix.

#### Response
```json
{
  "success": true,
  "data": {
    "id": "matrix_123",
    "name": "Standard Procurement Approval",
    "description": "Default approval matrix for procurement requirements",
    "isActive": true,
    "isDefault": true,
    "priority": 1,
    "levels": [...],
    "statistics": {...},
    "createdBy": {...},
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-02-20T14:30:00Z"
  }
}
```

---

### 3. Create Approval Matrix

**POST** `/api/v1/auth/company/approval-matrix`

Create a new approval matrix.

#### Request Body
```json
{
  "name": "High-Value Procurement Approval",
  "description": "Approval matrix for high-value procurement items",
  "isDefault": false,
  "priority": 2,
  "levels": [
    {
      "order": 1,
      "name": "Department Head Approval",
      "description": "Initial approval by department head",
      "maxApprovalTimeHours": 24,
      "isRequired": true,
      "approvers": [
        {
          "memberId": "member_123",
          "isMandatory": true,
          "sequence": 1
        }
      ]
    },
    {
      "order": 2,
      "name": "Finance Approval",
      "description": "Financial review",
      "maxApprovalTimeHours": 48,
      "isRequired": true,
      "approvers": [
        {
          "memberId": "member_456",
          "isMandatory": true,
          "sequence": 1
        },
        {
          "memberId": "member_789",
          "isMandatory": false,
          "sequence": 2
        }
      ]
    }
  ]
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "matrix_456",
    "name": "High-Value Procurement Approval",
    "description": "Approval matrix for high-value procurement items",
    "isActive": true,
    "isDefault": false,
    "priority": 2,
    "levels": [...],
    "statistics": {
      "totalLevels": 2,
      "totalApprovers": 3,
      "mandatoryApprovers": 2,
      "optionalApprovers": 1,
      "activeWorkflows": 0,
      "completedWorkflows": 0
    },
    "createdBy": {...},
    "createdAt": "2024-03-01T09:00:00Z",
    "updatedAt": "2024-03-01T09:00:00Z"
  },
  "message": "Approval matrix created successfully"
}
```

---

### 4. Update Approval Matrix

**PUT** `/api/v1/auth/company/approval-matrix/:id`

Update an existing approval matrix.

#### Request Body
```json
{
  "name": "Updated Procurement Approval",
  "description": "Updated description",
  "priority": 3,
  "levels": [...]
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "matrix_123",
    "name": "Updated Procurement Approval",
    ...
  },
  "message": "Approval matrix updated successfully"
}
```

---

### 5. Delete Approval Matrix

**DELETE** `/api/v1/auth/company/approval-matrix/:id`

Delete an approval matrix. Cannot delete if there are active workflows using it.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| permanent | boolean | No | Permanently delete (default: false) |

#### Response
```json
{
  "success": true,
  "message": "Approval matrix deleted successfully"
}
```

#### Error Response (if active workflows exist)
```json
{
  "success": false,
  "message": "Cannot delete matrix with active workflows",
  "errors": [
    {
      "field": "activeWorkflows",
      "message": "This matrix has 5 active workflows. Please complete or reassign them first.",
      "code": "ACTIVE_WORKFLOWS_EXIST"
    }
  ]
}
```

---

### 6. Toggle Matrix Status

**PATCH** `/api/v1/auth/company/approval-matrix/:id/status`

Activate or deactivate an approval matrix.

#### Request Body
```json
{
  "isActive": false,
  "reason": "Temporarily disabled for restructuring"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "matrix_123",
    "isActive": false,
    ...
  },
  "message": "Matrix status updated successfully"
}
```

---

### 7. Duplicate Approval Matrix

**POST** `/api/v1/auth/company/approval-matrix/:id/duplicate`

Create a copy of an existing approval matrix.

#### Request Body
```json
{
  "name": "Copy of Standard Procurement Approval",
  "description": "Duplicate for testing",
  "copyApprovers": true
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "matrix_789",
    "name": "Copy of Standard Procurement Approval",
    "isActive": false,
    "isDefault": false,
    ...
  },
  "message": "Approval matrix duplicated successfully"
}
```

---

### 8. Export Approval Matrices

**GET** `/api/v1/auth/company/approval-matrix/export`

Export approval matrices data in various formats.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| format | string | No | Export format: 'csv', 'xlsx', 'pdf' (default: 'csv') |
| status | string | No | Filter by status |
| includeInactive | boolean | No | Include inactive matrices (default: false) |

#### Response
Returns file download with appropriate content-type header.

---

### 9. Get Available Company Members

**GET** `/api/v1/auth/company/members/available`

Get list of company members available for approval matrix assignment.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search by name or email |
| role | string | No | Filter by role |
| department | string | No | Filter by department |
| excludeMatrixId | string | No | Exclude members already in this matrix |

#### Response
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "member_123",
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "email": "john@company.com",
        "phone": "+1234567890",
        "role": "Department Head",
        "department": "Procurement",
        "designation": "Senior Manager",
        "isActive": true,
        "profilePicture": "https://example.com/pic.jpg"
      }
    ],
    "totalMembers": 42
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Matrix name is required",
      "code": "REQUIRED_FIELD"
    },
    {
      "field": "levels",
      "message": "At least one approval level is required",
      "code": "MIN_LEVELS_REQUIRED"
    }
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Approval matrix not found",
  "errors": [
    {
      "field": "id",
      "message": "Matrix with ID 'matrix_123' does not exist",
      "code": "NOT_FOUND"
    }
  ]
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Matrix name already exists",
  "errors": [
    {
      "field": "name",
      "message": "An approval matrix with this name already exists",
      "code": "DUPLICATE_NAME"
    }
  ]
}
```

---

## Business Rules

1. **Level Ordering**: Levels must be sequential starting from 1
2. **Mandatory Approvers**: Each level must have at least one mandatory approver
3. **Default Matrix**: Only one matrix can be set as default
4. **Active Workflows**: Cannot delete or deactivate matrix with active workflows
5. **Member Availability**: Only active members can be assigned as approvers
6. **Time Limits**: maxApprovalTimeHours must be between 1 and 720 (30 days)
7. **Priority**: Higher priority matrices are suggested first (lower number = higher priority)

---

## Permissions

| Action | Required Permission |
|--------|-------------------|
| List matrices | `settings-approval-matrix:read` |
| View matrix details | `settings-approval-matrix:read` |
| Create matrix | `settings-approval-matrix:write` |
| Update matrix | `settings-approval-matrix:edit` |
| Delete matrix | `settings-approval-matrix:delete` |
| Toggle status | `settings-approval-matrix:edit` |
| Duplicate matrix | `settings-approval-matrix:write` |
| Export matrices | `settings-approval-matrix:download` |
