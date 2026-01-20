# Service Vendor - Role Management, Team Management & Approval Matrix

## Comprehensive Implementation Document for Backend & Frontend Development

---

## Table of Contents

1. [Overview](#1-overview)
2. [Database Collections & Schema](#2-database-collections--schema)
3. [Role Management API](#3-role-management-api)
4. [Team Members Management API](#4-team-members-management-api)
5. [Approval Matrix API](#5-approval-matrix-api)
6. [Frontend Implementation Guide](#6-frontend-implementation-guide)
7. [Mock Data & Testing](#7-mock-data--testing)
8. [Security Considerations](#8-security-considerations)

---

## 1. Overview

### Purpose
Implement Role Management, Team Management, and Approval Matrix features for Service Vendor users, mirroring the Industry User implementation with vendor-specific adaptations.

### Reference Implementation
- **Industry Base Path**: `/api/v1/auth/company/*`
- **Service Vendor Base Path**: `/api/v1/vendor/*`

### User Types
| Industry | Service Vendor |
|----------|----------------|
| `IndustryMember` | `ServiceVendorMember` |
| `IndustryAdmin` | `ServiceVendorAdmin` |

### Existing Collections to Reuse
The backend can leverage the existing `productmastermodule` collection structure from "Service Vendor Platform" project. The roles and team members data structure should follow the same pattern as Industry.

---

## 2. Database Collections & Schema

### 2.1 Collection: `vendor_roles`

```javascript
{
  _id: ObjectId(),
  companyId: ObjectId("vendor_company_id"),  // References vendor company
  vendorType: "ServiceVendor",               // or "ProductVendor", "LogisticsVendor"
  name: "ServiceVendorAdmin",                // Unique identifier
  displayName: "Service Vendor Administrator",
  description: "Full access to all service vendor modules",
  userType: "ServiceVendorMember",
  isSystemRole: true,                        // Cannot be deleted
  isDefault: true,                           // Assigned by default
  isActive: true,
  permissionsV2: [
    {
      id: "sv-dashboard",
      name: "Dashboard",
      path: "/dashboard/service-vendor",
      icon: "LayoutDashboard",
      permissions: {
        read: true,
        write: true,
        edit: true,
        delete: false,
        download: false
      },
      submodules: []
    },
    {
      id: "sv-rfqs",
      name: "RFQs",
      path: "/dashboard/service-vendor-rfqs",
      icon: "FileText",
      permissions: {
        read: true,
        write: true,
        edit: true,
        delete: false,
        download: true
      },
      submodules: [
        {
          id: "sv-rfqs-browse",
          name: "Browse RFQs",
          path: "/dashboard/service-vendor-rfqs",
          icon: "Eye",
          permissions: { read: true, write: false, edit: false, delete: false, download: true }
        },
        {
          id: "sv-rfqs-saved",
          name: "Saved RFQs",
          path: "/dashboard/rfqs/saved",
          icon: "Bookmark",
          permissions: { read: true, write: true, edit: true, delete: true, download: true }
        },
        {
          id: "sv-rfqs-applied",
          name: "Applied RFQs",
          path: "/dashboard/rfqs/applied",
          icon: "CheckCircle",
          permissions: { read: true, write: false, edit: false, delete: false, download: true }
        }
      ]
    },
    {
      id: "sv-quotations",
      name: "My Quotations",
      path: "/dashboard/vendor/quotations",
      icon: "Quote",
      permissions: { read: true, write: true, edit: true, delete: true, download: true },
      submodules: [
        {
          id: "sv-quotations-all",
          name: "All Quotations",
          path: "/dashboard/vendor/quotations",
          icon: "List",
          permissions: { read: true, write: true, edit: true, delete: false, download: true }
        }
      ]
    },
    {
      id: "sv-projects",
      name: "Projects",
      path: "/dashboard/service-vendor-projects",
      icon: "Clipboard",
      permissions: { read: true, write: true, edit: true, delete: false, download: true },
      submodules: [
        {
          id: "sv-projects-active",
          name: "Active Projects",
          path: "/dashboard/service-vendor-projects/active",
          icon: "Activity",
          permissions: { read: true, write: true, edit: true, delete: false, download: true }
        }
      ]
    },
    {
      id: "sv-team",
      name: "Team",
      path: "/dashboard/team",
      icon: "Users",
      permissions: { read: true, write: true, edit: true, delete: true, download: true },
      submodules: [
        {
          id: "sv-team-members",
          name: "Team Members",
          path: "/dashboard/team/members",
          icon: "Users",
          permissions: { read: true, write: true, edit: true, delete: true, download: true }
        },
        {
          id: "sv-team-roles",
          name: "Role Management",
          path: "/dashboard/team/roles",
          icon: "Shield",
          permissions: { read: true, write: true, edit: true, delete: true, download: false }
        }
      ]
    },
    {
      id: "sv-settings",
      name: "Settings",
      path: "/dashboard/vendor-settings",
      icon: "Settings",
      permissions: { read: true, write: true, edit: true, delete: false, download: false },
      submodules: []
    }
  ],
  userCount: 0,
  createdBy: ObjectId("user_id"),
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

### 2.2 Collection: `vendor_team_members`

```javascript
{
  _id: ObjectId(),
  companyId: ObjectId("vendor_company_id"),
  vendorType: "ServiceVendor",
  userId: ObjectId("user_id"),              // Reference to auth users
  email: "member@vendor.com",
  phone: "+919876543210",
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  department: "Operations",
  designation: "Project Manager",
  status: "active",                         // active, suspended, pending_verification
  assignedRole: {
    id: "role_id",
    name: "ServiceVendorOperator",
    displayName: "Service Vendor Operator",
    assignedAt: ISODate(),
    assignedBy: {
      id: "admin_user_id",
      name: "Admin Name"
    }
  },
  verificationStatus: {
    emailVerified: true,
    phoneVerified: true
  },
  lastLoginAt: ISODate(),
  createdBy: ObjectId("admin_user_id"),
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

### 2.3 Collection: `vendor_approval_matrices`

```javascript
{
  _id: ObjectId(),
  companyId: ObjectId("vendor_company_id"),
  vendorType: "ServiceVendor",
  name: "Standard Quote Approval",
  description: "Default approval matrix for quotation submissions",
  isActive: true,
  isDefault: true,
  priority: 1,
  levels: [
    {
      id: "level_1",
      order: 1,
      name: "Manager Approval",
      description: "Initial approval by manager",
      maxApprovalTimeHours: 24,
      isRequired: true,
      approvers: [
        {
          id: "approver_1",
          memberId: "member_123",
          memberName: "John Doe",
          memberEmail: "john@vendor.com",
          memberRole: "Operations Manager",
          memberDepartment: "Operations",
          isMandatory: true,
          sequence: 1,
          assignedAt: ISODate(),
          assignedBy: {
            id: "admin_1",
            name: "Admin User",
            email: "admin@vendor.com"
          }
        }
      ]
    },
    {
      id: "level_2",
      order: 2,
      name: "Director Approval",
      description: "Final approval by director",
      maxApprovalTimeHours: 48,
      isRequired: true,
      approvers: [
        {
          id: "approver_2",
          memberId: "member_456",
          memberName: "Jane Smith",
          memberEmail: "jane@vendor.com",
          memberRole: "Director",
          memberDepartment: "Management",
          isMandatory: true,
          sequence: 1,
          assignedAt: ISODate(),
          assignedBy: {
            id: "admin_1",
            name: "Admin User",
            email: "admin@vendor.com"
          }
        }
      ]
    }
  ],
  statistics: {
    totalLevels: 2,
    totalApprovers: 2,
    mandatoryApprovers: 2,
    optionalApprovers: 0,
    activeWorkflows: 0,
    completedWorkflows: 0
  },
  createdBy: {
    id: "admin_1",
    name: "Admin User",
    email: "admin@vendor.com"
  },
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

---

## 3. Role Management API

### Base URL
```
/api/v1/vendor/roles
```

### 3.1 Get All Roles

**GET** `/api/v1/vendor/roles`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| search | string | No | Search in name, displayName, description |
| isSystemRole | boolean | No | Filter by system/custom roles |
| isActive | boolean | No | Filter by active status |
| sortBy | string | No | Sort field (default: "createdAt") |
| sortOrder | string | No | "asc" or "desc" (default: "desc") |

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "roles": [
      {
        "id": "role_123",
        "name": "ServiceVendorAdmin",
        "displayName": "Service Vendor Administrator",
        "description": "Full access to all service vendor modules",
        "userType": "ServiceVendorMember",
        "isSystemRole": true,
        "isDefault": true,
        "isActive": true,
        "userCount": 3,
        "createdAt": "2025-01-01T10:00:00Z",
        "updatedAt": "2025-01-01T10:00:00Z"
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
      "systemRoles": 2,
      "customRoles": 2,
      "activeRoles": 4,
      "inactiveRoles": 0,
      "totalAssignments": 15
    }
  }
}
```

### 3.2 Get Role by ID

**GET** `/api/v1/vendor/roles/:roleId`

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "role_123",
    "name": "ServiceVendorAdmin",
    "displayName": "Service Vendor Administrator",
    "description": "Full access to all service vendor modules",
    "userType": "ServiceVendorMember",
    "isSystemRole": true,
    "isDefault": true,
    "isActive": true,
    "permissionsV2": [
      {
        "id": "sv-dashboard",
        "name": "Dashboard",
        "path": "/dashboard/service-vendor",
        "icon": "LayoutDashboard",
        "permissions": {
          "read": true,
          "write": true,
          "edit": true,
          "delete": false,
          "download": false
        },
        "submodules": []
      }
    ],
    "userCount": 3,
    "createdBy": "user_123",
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-01T10:00:00Z"
  }
}
```

### 3.3 Get Permission Template

**GET** `/api/v1/vendor/roles/template`

Returns the master permission template with all Service Vendor modules and all permissions set to `false`.

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "permissionsV2": [
      {
        "id": "sv-dashboard",
        "name": "Dashboard",
        "path": "/dashboard/service-vendor",
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

### 3.4 Create Role

**POST** `/api/v1/vendor/roles`

**Request Body:**
```json
{
  "name": "QuotationManager",
  "displayName": "Quotation Manager",
  "description": "Manages quotation submissions and reviews",
  "permissionsV2": [
    {
      "id": "sv-dashboard",
      "name": "Dashboard",
      "path": "/dashboard/service-vendor",
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
      "id": "sv-quotations",
      "name": "My Quotations",
      "path": "/dashboard/vendor/quotations",
      "icon": "Quote",
      "permissions": {
        "read": true,
        "write": true,
        "edit": true,
        "delete": false,
        "download": true
      },
      "submodules": []
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Role created successfully",
  "data": {
    "id": "role_456",
    "name": "QuotationManager",
    "displayName": "Quotation Manager",
    "isSystemRole": false,
    "isDefault": false,
    "isActive": true,
    "permissionsV2": [...],
    "userCount": 0,
    "createdAt": "2025-01-06T10:00:00Z"
  }
}
```

### 3.5 Update Role

**PUT** `/api/v1/vendor/roles/:roleId`

**Note:** System roles cannot be updated.

**Request Body:**
```json
{
  "displayName": "Updated Quotation Manager",
  "description": "Updated description",
  "isActive": true,
  "permissionsV2": [...]
}
```

### 3.6 Delete Role

**DELETE** `/api/v1/vendor/roles/:roleId`

**Validation:**
- Cannot delete system roles
- Cannot delete roles with assigned users

**Error Response (400):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Cannot delete role with assigned users. Please reassign 5 users first."
}
```

### 3.7 Duplicate Role

**POST** `/api/v1/vendor/roles/:roleId/duplicate`

**Request Body:**
```json
{
  "name": "QuotationManagerCopy",
  "displayName": "Quotation Manager (Copy)",
  "description": "Copy of Quotation Manager"
}
```

### 3.8 Toggle Role Status

**PATCH** `/api/v1/vendor/roles/:roleId/status`

**Request Body:**
```json
{
  "isActive": false
}
```

---

## 4. Team Members Management API

### Base URL
```
/api/v1/vendor/members
```

### 4.1 Get All Team Members

**GET** `/api/v1/vendor/members`

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

**Response (200):**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "member_123",
        "email": "member@vendor.com",
        "phone": "+919876543210",
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "department": "Operations",
        "designation": "Project Manager",
        "status": "active",
        "assignedRole": {
          "id": "role_123",
          "name": "ServiceVendorOperator",
          "displayName": "Service Vendor Operator",
          "assignedAt": "2025-01-01T10:00:00Z",
          "assignedBy": {
            "id": "admin_1",
            "name": "Admin User"
          }
        },
        "verificationStatus": {
          "emailVerified": true,
          "phoneVerified": true
        },
        "lastLoginAt": "2025-01-05T14:30:00Z",
        "createdAt": "2025-01-01T10:00:00Z"
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
        "ServiceVendorAdmin": 2,
        "ServiceVendorOperator": 15,
        "ServiceVendorViewer": 8
      }
    }
  }
}
```

### 4.2 Get Member by ID

**GET** `/api/v1/vendor/members/:memberId`

### 4.3 Create Team Member

**POST** `/api/v1/vendor/members`

**Request Body:**
```json
{
  "email": "newmember@vendor.com",
  "phone": "+919876543210",
  "firstName": "Jane",
  "lastName": "Smith",
  "department": "Sales",
  "designation": "Sales Executive",
  "roleId": "role_123",
  "sendInvitation": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "member": {
      "id": "member_456",
      "email": "newmember@vendor.com",
      "phone": "+919876543210",
      "firstName": "Jane",
      "lastName": "Smith",
      "assignedRole": {
        "id": "role_123",
        "name": "ServiceVendorOperator"
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

### 4.4 Update Member Role

**PATCH** `/api/v1/vendor/members/:memberId/role`

**Request Body:**
```json
{
  "roleId": "role_456",
  "reason": "Promotion to Manager"
}
```

### 4.5 Update Member Basic Info

**PATCH** `/api/v1/vendor/members/:memberId`

**Request Body:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe",
  "department": "Sales",
  "designation": "Senior Manager"
}
```

### 4.6 Update Member Status

**PATCH** `/api/v1/vendor/members/:memberId/status`

**Request Body:**
```json
{
  "status": "suspended",
  "reason": "Policy violation"
}
```

### 4.7 Remove Member

**DELETE** `/api/v1/vendor/members/:memberId`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| permanent | boolean | No | Permanently delete (default: false) |

### 4.8 Resend Verification

**POST** `/api/v1/vendor/members/:memberId/resend-verification`

**Request Body:**
```json
{
  "type": "both"
}
```

### 4.9 Bulk Actions

**POST** `/api/v1/vendor/members/bulk-action`

**Request Body:**
```json
{
  "action": "suspend",
  "memberIds": ["member_1", "member_2", "member_3"],
  "reason": "Bulk suspension for policy review"
}
```

### 4.10 Get Statistics

**GET** `/api/v1/vendor/members/statistics`

### 4.11 Export Members

**GET** `/api/v1/vendor/members/export`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| format | string | No | Export format: 'csv', 'xlsx', 'pdf' (default: 'csv') |

### 4.12 Get Available Members

**GET** `/api/v1/vendor/members/available`

Returns team members available for approval matrix assignment.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search by name or email |
| role | string | No | Filter by role |
| department | string | No | Filter by department |
| excludeMatrixId | string | No | Exclude members already in this matrix |

---

## 5. Approval Matrix API

### Base URL
```
/api/v1/vendor/approval-matrix
```

### 5.1 Get All Matrices

**GET** `/api/v1/vendor/approval-matrix`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| search | string | No | Search by matrix name |
| status | string | No | Filter by status: 'active', 'inactive' |
| isDefault | boolean | No | Filter default matrices |
| sortBy | string | No | Sort field: 'name', 'createdAt', 'priority' |
| sortOrder | string | No | Sort order: 'asc', 'desc' |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "matrices": [
      {
        "id": "matrix_123",
        "name": "Standard Quote Approval",
        "description": "Default approval matrix for quotation submissions",
        "isActive": true,
        "isDefault": true,
        "priority": 1,
        "levels": [
          {
            "id": "level_1",
            "order": 1,
            "name": "Manager Approval",
            "description": "Initial approval by manager",
            "maxApprovalTimeHours": 24,
            "isRequired": true,
            "approvers": [
              {
                "id": "approver_1",
                "memberId": "member_123",
                "memberName": "John Doe",
                "memberEmail": "john@vendor.com",
                "memberRole": "Operations Manager",
                "memberDepartment": "Operations",
                "isMandatory": true,
                "sequence": 1,
                "assignedAt": "2025-01-01T10:00:00Z",
                "assignedBy": {
                  "id": "admin_1",
                  "name": "Admin User",
                  "email": "admin@vendor.com"
                }
              }
            ]
          }
        ],
        "statistics": {
          "totalLevels": 2,
          "totalApprovers": 2,
          "mandatoryApprovers": 2,
          "optionalApprovers": 0,
          "activeWorkflows": 5,
          "completedWorkflows": 42
        },
        "createdBy": {
          "id": "admin_1",
          "name": "Admin User",
          "email": "admin@vendor.com"
        },
        "createdAt": "2025-01-01T10:00:00Z",
        "updatedAt": "2025-01-05T14:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 3,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    },
    "statistics": {
      "totalMatrices": 3,
      "activeMatrices": 2,
      "inactiveMatrices": 1,
      "defaultMatrix": 1,
      "totalApprovers": 8
    }
  }
}
```

### 5.2 Get Matrix by ID

**GET** `/api/v1/vendor/approval-matrix/:matrixId`

### 5.3 Create Matrix

**POST** `/api/v1/vendor/approval-matrix`

**Request Body:**
```json
{
  "name": "High-Value Quote Approval",
  "description": "Approval matrix for quotations above 1 lakh",
  "isDefault": false,
  "priority": 2,
  "levels": [
    {
      "order": 1,
      "name": "Manager Approval",
      "description": "Initial approval by operations manager",
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
      "name": "Director Approval",
      "description": "Final approval by director",
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

### 5.4 Update Matrix

**PUT** `/api/v1/vendor/approval-matrix/:matrixId`

### 5.5 Delete Matrix

**DELETE** `/api/v1/vendor/approval-matrix/:matrixId`

**Validation:**
- Cannot delete if active workflows exist
- Cannot delete default matrix (must set another as default first)

### 5.6 Toggle Status

**PATCH** `/api/v1/vendor/approval-matrix/:matrixId/status`

**Request Body:**
```json
{
  "isActive": false,
  "reason": "Temporarily disabled for restructuring"
}
```

### 5.7 Duplicate Matrix

**POST** `/api/v1/vendor/approval-matrix/:matrixId/duplicate`

**Request Body:**
```json
{
  "name": "Copy of High-Value Quote Approval",
  "description": "Duplicate for testing",
  "copyApprovers": true
}
```

---

## 6. Frontend Implementation Guide

### 6.1 File Structure Created

```
src/
├── services/modules/vendor-roles/
│   ├── vendor-roles.routes.ts
│   ├── vendor-roles.service.ts
│   ├── vendor-roles.types.ts
│   └── index.ts
├── services/modules/vendor-team/
│   ├── vendor-team.routes.ts
│   ├── vendor-team.service.ts
│   ├── vendor-team.types.ts
│   └── index.ts
├── services/modules/vendor-approval-matrix/
│   ├── vendor-approval-matrix.routes.ts
│   ├── vendor-approval-matrix.service.ts
│   ├── vendor-approval-matrix.types.ts
│   └── index.ts
└── pages/
    ├── VendorRoleManagement.tsx
    ├── VendorTeamMembers.tsx
    └── VendorApprovalMatrixList.tsx
```

### 6.2 Routes Configuration

Add to `App.tsx` under vendor dashboard routes:

```tsx
// Service Vendor Team & Role Management Routes
<Route path="vendor/team/members" element={<VendorTeamMembers />} />
<Route path="vendor/team/roles" element={<VendorRoleManagement />} />
<Route path="vendor/team/roles/create" element={<VendorRoleCreate />} />
<Route path="vendor/team/roles/:roleId" element={<VendorRoleView />} />
<Route path="vendor/team/roles/:roleId/edit" element={<VendorRoleEdit />} />

// Service Vendor Approval Matrix Routes
<Route path="vendor/approval-matrix" element={<VendorApprovalMatrixList />} />
<Route path="vendor/approval-matrix/create" element={<VendorApprovalMatrixCreate />} />
<Route path="vendor/approval-matrix/:matrixId" element={<VendorApprovalMatrixView />} />
<Route path="vendor/approval-matrix/:matrixId/edit" element={<VendorApprovalMatrixEdit />} />
```

### 6.3 Menu Configuration

Add to `menuConfig.ts` under service-vendor:

```typescript
{
  icon: Users,
  label: "Team",
  path: "/dashboard/vendor/team",
  submenu: [
    {
      icon: Users,
      label: "Team Members",
      path: "/dashboard/vendor/team/members",
    },
    {
      icon: Shield,
      label: "Role Management",
      path: "/dashboard/vendor/team/roles",
    },
  ],
},
{
  icon: GitBranch,
  label: "Approval Matrix",
  path: "/dashboard/vendor/approval-matrix",
},
```

### 6.4 Reference Components (Reuse from Industry)

| Industry Component | Vendor Equivalent | Changes Needed |
|-------------------|-------------------|----------------|
| `RoleCard.tsx` | `VendorRoleCard.tsx` | Update module IDs (sv-*) |
| `RoleFilters.tsx` | `VendorRoleFilters.tsx` | Minimal changes |
| `PermissionMatrixV2.tsx` | `VendorPermissionMatrix.tsx` | Use sv-* module config |
| `MatrixCard.tsx` | `VendorMatrixCard.tsx` | Minimal changes |
| `LevelCard.tsx` | `VendorLevelCard.tsx` | Minimal changes |
| `ApproverAssignmentPanel.tsx` | `VendorApproverAssignment.tsx` | Use vendor team members |

---

## 7. Mock Data & Testing

### 7.1 Default System Roles to Seed

```json
[
  {
    "name": "ServiceVendorAdmin",
    "displayName": "Service Vendor Administrator",
    "description": "Full access to all service vendor modules",
    "isSystemRole": true,
    "isDefault": true
  },
  {
    "name": "ServiceVendorManager",
    "displayName": "Service Vendor Manager",
    "description": "Manage operations, quotations, and team members",
    "isSystemRole": true,
    "isDefault": false
  },
  {
    "name": "ServiceVendorOperator",
    "displayName": "Service Vendor Operator",
    "description": "Create and manage quotations and projects",
    "isSystemRole": true,
    "isDefault": false
  },
  {
    "name": "ServiceVendorViewer",
    "displayName": "Service Vendor Viewer",
    "description": "Read-only access to view data and reports",
    "isSystemRole": true,
    "isDefault": false
  }
]
```

### 7.2 Sample Team Members

```json
[
  {
    "firstName": "Rajesh",
    "lastName": "Kumar",
    "email": "rajesh.kumar@vendor.com",
    "phone": "+919876543210",
    "department": "Operations",
    "designation": "Operations Manager",
    "role": "ServiceVendorAdmin",
    "status": "active"
  },
  {
    "firstName": "Priya",
    "lastName": "Sharma",
    "email": "priya.sharma@vendor.com",
    "phone": "+919876543211",
    "department": "Sales",
    "designation": "Sales Executive",
    "role": "ServiceVendorOperator",
    "status": "active"
  }
]
```

---

## 8. Security Considerations

### 8.1 Authorization Rules

1. **Role Management Access**: Only users with `sv-team-roles` read permission can view roles
2. **Team Management Access**: Only users with `sv-team-members` read permission can view members
3. **Approval Matrix Access**: Only admin-level users can create/modify approval matrices
4. **System Roles Protection**: System roles cannot be edited or deleted

### 8.2 Backend Validation

```javascript
// Example middleware for vendor role management
const validateVendorRoleAccess = async (req, res, next) => {
  const user = req.user;
  
  // Verify user is a vendor member
  if (!user.vendorCompanyId) {
    return res.status(403).json({ error: 'Not a vendor user' });
  }
  
  // Check permission for sv-team-roles module
  const hasPermission = await checkModulePermission(
    user.id, 
    'sv-team-roles', 
    req.method === 'GET' ? 'read' : 'write'
  );
  
  if (!hasPermission) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  
  next();
};
```

### 8.3 Data Isolation

- All queries must include `companyId` filter to ensure data isolation between vendors
- Vendor A cannot see or modify Vendor B's roles, members, or approval matrices

---

## Summary

This document provides a complete specification for implementing Role Management, Team Management, and Approval Matrix features for Service Vendors. The implementation follows the same patterns and structures as the Industry User implementation, with vendor-specific adaptations:

1. **Base URL**: `/api/v1/vendor/*` instead of `/api/v1/auth/company/*`
2. **User Type**: `ServiceVendorMember` instead of `IndustryMember`
3. **Module IDs**: `sv-*` prefix for all Service Vendor modules
4. **Collections**: `vendor_roles`, `vendor_team_members`, `vendor_approval_matrices`

The frontend service layer and basic page components have been created. The backend team can use this specification to implement the APIs.
