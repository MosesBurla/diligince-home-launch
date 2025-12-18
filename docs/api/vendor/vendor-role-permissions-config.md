# Vendor Role Permissions Configuration

This document outlines the role-based permission configuration for all three Vendor types (Service, Product, Logistics). This serves as the master template for:
1. Sidebar menu filtering (based on read permissions)
2. Role Management UI for each vendor type
3. Backend API restrictions and database seeding

---

## Table of Contents

1. [Overview](#overview)
2. [Module ID Naming Convention](#module-id-naming-convention)
3. [Permission Structure](#permission-structure)
4. [Service Vendor Configuration](#service-vendor-configuration)
5. [Product Vendor Configuration](#product-vendor-configuration)
6. [Logistics Vendor Configuration](#logistics-vendor-configuration)
7. [Default Role Configurations](#default-role-configurations)
8. [API Integration](#api-integration)
9. [Database Seeding](#database-seeding)
10. [Frontend Integration](#frontend-integration)

---

## Overview

Each vendor type has a unique set of modules and submodules tailored to their business operations:

| Vendor Type | Total Modules | Total Submodules | Prefix |
|-------------|---------------|------------------|--------|
| Service Vendor | 8 | 18 | `sv-` |
| Product Vendor | 7 | 18 | `pv-` |
| Logistics Vendor | 8 | 17 | `lv-` |

---

## Module ID Naming Convention

All module IDs follow a consistent naming pattern with vendor-specific prefixes:

| Vendor Type | Prefix | Examples |
|-------------|--------|----------|
| Service Vendor | `sv-` | `sv-dashboard`, `sv-rfqs`, `sv-quotations` |
| Product Vendor | `pv-` | `pv-dashboard`, `pv-catalog`, `pv-orders` |
| Logistics Vendor | `lv-` | `lv-dashboard`, `lv-requests`, `lv-fleet` |

This ensures:
- No ID collisions across vendor types
- Easy identification of which vendor type a module belongs to
- Consistent structure for backend database indexing

---

## Permission Structure

Each module/submodule has 5 permission flags:

```typescript
interface PermissionFlags {
  read: boolean;      // Can view/access the module
  write: boolean;     // Can create new records
  edit: boolean;      // Can modify existing records
  delete: boolean;    // Can remove records
  download: boolean;  // Can export/download data
}
```

### Complete JSON Structure

```json
{
  "version": "1.0.0",
  "roleName": "VendorTypeAdmin",
  "userType": "VendorType",
  "modules": [
    {
      "id": "prefix-module-name",
      "name": "Module Display Name",
      "path": "/dashboard/route-path",
      "icon": "LucideIconName",
      "permissions": {
        "read": true,
        "write": true,
        "edit": true,
        "delete": false,
        "download": false
      },
      "submodules": [
        {
          "id": "prefix-submodule-name",
          "name": "Submodule Display Name",
          "path": "/dashboard/route-path/subpath",
          "icon": "LucideIconName",
          "permissions": {
            "read": true,
            "write": true,
            "edit": true,
            "delete": false,
            "download": true
          }
        }
      ]
    }
  ]
}
```

---

## Service Vendor Configuration

**File:** `src/data/service_vendor_module_permissions.json`

### Modules Overview

| Module ID | Name | Submodules |
|-----------|------|------------|
| `sv-dashboard` | Dashboard | - |
| `sv-rfqs` | RFQs | Browse RFQs, Saved RFQs, Applied RFQs |
| `sv-quotations` | My Quotations | All Quotations, Drafts, Submitted, Accepted, Rejected |
| `sv-projects` | Projects | Active Projects, Completed Projects, Milestones |
| `sv-messages` | Messages | - |
| `sv-team` | Team | Team Members, Role Management |
| `sv-services` | Services | Service Catalog, Skills & Expertise |
| `sv-settings` | Settings | Company Profile, Certifications, Projects & Portfolio, Payment Settings |

### Complete Module Structure

```json
{
  "version": "1.0.0",
  "roleName": "ServiceVendorAdmin",
  "userType": "ServiceVendor",
  "modules": [
    {
      "id": "sv-dashboard",
      "name": "Dashboard",
      "path": "/dashboard/service-vendor",
      "icon": "LayoutDashboard",
      "permissions": { "read": true, "write": true, "edit": true, "delete": false, "download": false }
    },
    {
      "id": "sv-rfqs",
      "name": "RFQs",
      "path": "/dashboard/service-vendor-rfqs",
      "icon": "FileText",
      "permissions": { "read": true, "write": true, "edit": true, "delete": false, "download": true },
      "submodules": [
        { "id": "sv-rfqs-browse", "name": "Browse RFQs", "path": "/dashboard/service-vendor-rfqs", "icon": "Eye", "permissions": { "read": true, "write": false, "edit": false, "delete": false, "download": true } },
        { "id": "sv-rfqs-saved", "name": "Saved RFQs", "path": "/dashboard/rfqs/saved", "icon": "Bookmark", "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": true } },
        { "id": "sv-rfqs-applied", "name": "Applied RFQs", "path": "/dashboard/rfqs/applied", "icon": "CheckCircle", "permissions": { "read": true, "write": false, "edit": false, "delete": false, "download": true } }
      ]
    },
    {
      "id": "sv-quotations",
      "name": "My Quotations",
      "path": "/dashboard/vendor/quotations",
      "icon": "Quote",
      "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": true },
      "submodules": [
        { "id": "sv-quotations-all", "name": "All Quotations", "path": "/dashboard/vendor/quotations", "icon": "List", "permissions": { "read": true, "write": true, "edit": true, "delete": false, "download": true } },
        { "id": "sv-quotations-drafts", "name": "Drafts", "path": "/dashboard/vendor/quotations/drafts", "icon": "GitPullRequestDraft", "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": false } },
        { "id": "sv-quotations-submitted", "name": "Submitted", "path": "/dashboard/vendor/quotations/submitted", "icon": "Clock", "permissions": { "read": true, "write": false, "edit": false, "delete": false, "download": true } },
        { "id": "sv-quotations-accepted", "name": "Accepted", "path": "/dashboard/vendor/quotations/accepted", "icon": "CheckCircle", "permissions": { "read": true, "write": false, "edit": false, "delete": false, "download": true } },
        { "id": "sv-quotations-rejected", "name": "Rejected", "path": "/dashboard/vendor/quotations/rejected", "icon": "XCircle", "permissions": { "read": true, "write": false, "edit": false, "delete": false, "download": true } }
      ]
    },
    {
      "id": "sv-projects",
      "name": "Projects",
      "path": "/dashboard/service-vendor-projects",
      "icon": "Clipboard",
      "permissions": { "read": true, "write": true, "edit": true, "delete": false, "download": true },
      "submodules": [
        { "id": "sv-projects-active", "name": "Active Projects", "path": "/dashboard/service-vendor-projects/active", "icon": "Activity", "permissions": { "read": true, "write": true, "edit": true, "delete": false, "download": true } },
        { "id": "sv-projects-completed", "name": "Completed Projects", "path": "/dashboard/service-vendor-projects/completed", "icon": "CheckCircle", "permissions": { "read": true, "write": false, "edit": false, "delete": false, "download": true } },
        { "id": "sv-projects-milestones", "name": "Milestones", "path": "/dashboard/service-vendor-projects/milestones", "icon": "Target", "permissions": { "read": true, "write": true, "edit": true, "delete": false, "download": true } }
      ]
    },
    {
      "id": "sv-messages",
      "name": "Messages",
      "path": "/dashboard/service-vendor-messages",
      "icon": "MessageSquare",
      "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": false }
    },
    {
      "id": "sv-team",
      "name": "Team",
      "path": "/dashboard/team",
      "icon": "Users",
      "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": true },
      "submodules": [
        { "id": "sv-team-members", "name": "Team Members", "path": "/dashboard/team/members", "icon": "Users", "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": true } },
        { "id": "sv-team-roles", "name": "Role Management", "path": "/dashboard/team/roles", "icon": "Shield", "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": false } }
      ]
    },
    {
      "id": "sv-services",
      "name": "Services",
      "path": "/dashboard/service-vendor-services",
      "icon": "Layers",
      "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": false },
      "submodules": [
        { "id": "sv-services-catalog", "name": "Service Catalog", "path": "/dashboard/service-vendor-services/catalog", "icon": "List", "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": false } },
        { "id": "sv-services-skills", "name": "Skills & Expertise", "path": "/dashboard/service-vendor-services/skills", "icon": "Award", "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": false } }
      ]
    },
    {
      "id": "sv-settings",
      "name": "Settings",
      "path": "/dashboard/service-vendor-profile",
      "icon": "Settings",
      "permissions": { "read": true, "write": true, "edit": true, "delete": false, "download": false },
      "submodules": [
        { "id": "sv-settings-company", "name": "Company Profile", "path": "/dashboard/service-vendor-profile", "icon": "Building", "permissions": { "read": true, "write": true, "edit": true, "delete": false, "download": false } },
        { "id": "sv-settings-certifications", "name": "Certifications", "path": "/dashboard/service-vendor-profile/certifications", "icon": "Award", "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": true } },
        { "id": "sv-settings-portfolio", "name": "Projects & Portfolio", "path": "/dashboard/service-vendor-profile/portfolio", "icon": "Briefcase", "permissions": { "read": true, "write": true, "edit": true, "delete": true, "download": true } },
        { "id": "sv-settings-payment", "name": "Payment Settings", "path": "/dashboard/service-vendor-profile/payment", "icon": "CreditCard", "permissions": { "read": true, "write": true, "edit": true, "delete": false, "download": false } }
      ]
    }
  ]
}
```

---

## Product Vendor Configuration

**File:** `src/data/product_vendor_module_permissions.json`

### Modules Overview

| Module ID | Name | Submodules |
|-----------|------|------------|
| `pv-dashboard` | Dashboard | - |
| `pv-catalog` | Product Catalog | All Products, Add Product, Categories, Inventory |
| `pv-orders` | Orders | New Orders, Processing, Shipped, Completed, Returns |
| `pv-messages` | Messages | - |
| `pv-team` | Team | Team Members, Role Management |
| `pv-analytics` | Analytics | Sales Reports, Inventory Reports |
| `pv-settings` | Settings | Company Profile, Brands & Partners, Shipping & Returns, Certifications, Payment Settings |

---

## Logistics Vendor Configuration

**File:** `src/data/logistics_vendor_module_permissions.json`

### Modules Overview

| Module ID | Name | Submodules |
|-----------|------|------------|
| `lv-dashboard` | Dashboard | - |
| `lv-requests` | Requests | New Requests, Pending, Assigned, Completed |
| `lv-deliveries` | Deliveries | In Transit, Completed, Failed/Returned |
| `lv-fleet` | Fleet | Vehicles, Maintenance, Drivers & Personnel |
| `lv-messages` | Messages | - |
| `lv-team` | Team | Team Members, Role Management |
| `lv-tracking` | Tracking | Live Tracking, Route History |
| `lv-settings` | Settings | Company Profile, Service Areas, Licenses & Permits, Payment Settings |

---

## Default Role Configurations

### For Each Vendor Type, Create These Default Roles:

#### 1. VendorAdmin (Full Access)
- All permissions set to `true` (as defined in JSON files)
- System role, cannot be deleted or modified

#### 2. VendorManager
- `read`: true for all modules
- `write`: true for core business modules
- `edit`: true for own records
- `delete`: false for most modules
- `download`: true for reports

#### 3. VendorOperator
- `read`: true for assigned modules only
- `write`: true for operational modules
- `edit`: true for own records
- `delete`: false
- `download`: false

#### 4. VendorViewer (Read-Only)
- `read`: true for all modules
- `write`: false
- `edit`: false
- `delete`: false
- `download`: true (for reports only)

---

## API Integration

### Login API Response Structure

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "vendor@example.com",
      "userType": "Vendor",
      "userSubType": "ServiceVendor",
      "companyId": "company_456"
    },
    "access_token": "eyJhbG...",
    "refresh_token": "eyJhbG...",
    "roleConfiguration": {
      "name": "service-vendor-admin",
      "displayName": "Service Vendor Admin",
      "permissions": [
        {
          "id": "sv-dashboard",
          "name": "Dashboard",
          "path": "/dashboard/service-vendor",
          "icon": "LayoutDashboard",
          "permissions": { "read": true, "write": true, "edit": true, "delete": false, "download": false }
        }
        // ... more modules
      ]
    }
  }
}
```

### API Endpoints for Role Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/vendor/roles` | List all roles for vendor company |
| GET | `/api/v1/vendor/roles/:roleId` | Get role details |
| POST | `/api/v1/vendor/roles` | Create new role |
| PATCH | `/api/v1/vendor/roles/:roleId` | Update role |
| DELETE | `/api/v1/vendor/roles/:roleId` | Delete role |
| POST | `/api/v1/vendor/roles/:roleId/duplicate` | Duplicate role |

---

## Database Seeding

### MongoDB Collections

#### 1. `vendor_role_templates` Collection
Store the master templates for each vendor type:

```javascript
{
  _id: ObjectId(),
  vendorType: "ServiceVendor", // or "ProductVendor", "LogisticsVendor"
  version: "1.0.0",
  modules: [...] // Full module structure from JSON
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

#### 2. `vendor_roles` Collection
Store company-specific roles:

```javascript
{
  _id: ObjectId(),
  companyId: ObjectId("company_456"),
  vendorType: "ServiceVendor",
  name: "sales-manager",
  displayName: "Sales Manager",
  description: "Manages quotations and client communications",
  isDefault: false,
  isSystemRole: false,
  isActive: true,
  permissions: [...], // Modified permissions
  createdBy: ObjectId("user_123"),
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

### Seeder Script Requirements

1. Insert master templates for all 3 vendor types
2. Create default roles (Admin, Manager, Operator, Viewer) for each vendor type
3. Link to `vendor_companies` collection
4. Set up indexes for efficient querying

---

## Frontend Integration

### Using the Configurations

```typescript
import { 
  getVendorHierarchicalConfig,
  getPermissionsConfigByUserType,
  VendorType 
} from '@/config/permissionsConfig';

// Get config by vendor type
const serviceVendorConfig = getVendorHierarchicalConfig('service');
const productVendorConfig = getVendorHierarchicalConfig('product');
const logisticsVendorConfig = getVendorHierarchicalConfig('logistics');

// Get config by user type and sub-type (from login response)
const config = getPermissionsConfigByUserType('Vendor', 'ServiceVendor');
```

### Permission Checking

```typescript
import { usePermissions } from '@/contexts/PermissionsContext';

const MyComponent = () => {
  const { canAccessModule, hasPermission } = usePermissions();

  // Check module access
  if (canAccessModule('sv-quotations')) {
    // Show quotations section
  }

  // Check specific action
  if (hasPermission('sv-quotations', 'write')) {
    // Show create quotation button
  }
};
```

---

## Security Considerations

1. **Client-side permissions are for UX only** - All API endpoints must validate permissions server-side
2. **Never trust roleConfiguration from localStorage** - Always validate against database on sensitive operations
3. **Audit logging** - Log all permission changes with user ID and timestamp
4. **Rate limiting** - Apply rate limits to role management endpoints

---

## Implementation Status

| Component | Status |
|-----------|--------|
| Service Vendor JSON | ✅ Complete |
| Product Vendor JSON | ✅ Complete |
| Logistics Vendor JSON | ✅ Complete |
| menuConfig.ts Update | ✅ Complete |
| permissionsConfig.ts Update | ✅ Complete |
| Backend API Implementation | ⏳ Pending |
| Database Seeding | ⏳ Pending |
| Role Management UI (Vendors) | ⏳ Pending |

---

## File References

- `src/data/service_vendor_module_permissions.json`
- `src/data/product_vendor_module_permissions.json`
- `src/data/logistics_vendor_module_permissions.json`
- `src/config/menuConfig.ts`
- `src/config/permissionsConfig.ts`
