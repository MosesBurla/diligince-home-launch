# Industry Role Management Configuration

## Overview

This document defines the role-based permission configuration for the Industry portal. It outlines how permissions are structured, what modules are available, and how the frontend consumes this data.

## Permission Structure

### Module Permission Format

```json
{
  "module": "module-id",
  "permissions": {
    "read": true,
    "write": true,
    "edit": true,
    "delete": false,
    "download": false
  }
}
```

### Complete User Permissions Response

```json
{
  "permissions": [
    {
      "module": "industry-dashboard",
      "permissions": {
        "read": true,
        "write": false,
        "edit": false,
        "delete": false,
        "download": false
      }
    },
    {
      "module": "industry-requirements",
      "permissions": {
        "read": true,
        "write": true,
        "edit": true,
        "delete": true,
        "download": true
      }
    }
    // ... more modules
  ]
}
```

## Available Permission Actions

| Action | Description | Use Case |
|--------|-------------|----------|
| `read` | View/access the module | Navigation visibility, page access |
| `write` | Create new records | Create buttons, forms |
| `edit` | Modify existing records | Edit buttons, update forms |
| `delete` | Remove records | Delete buttons, archive actions |
| `download` | Export data | Download buttons, reports, exports |

## Module ID Mapping

### Core Modules

| Module ID | Display Name | Route Path | Available Actions |
|-----------|--------------|------------|-------------------|
| `industry-dashboard` | Dashboard | `/dashboard` | read |
| `industry-requirements` | Requirements | `/dashboard/requirements` | read, write, edit, delete, download |
| `industry-quotations` | Quotations | `/dashboard/quotations` | read, write, edit, delete, download |
| `industry-purchase-orders` | Purchase Orders | `/dashboard/purchase-orders` | read, write, edit, delete, download |
| `industry-projects` | Projects | `/dashboard/projects` | read, write, edit, delete |
| `industry-workflow` | Workflow | `/dashboard/workflow` | read, write, edit |
| `industry-team` | Team Management | `/dashboard/team` | read, write, edit, delete |
| `industry-stakeholders` | Stakeholders | `/dashboard/stakeholders` | read, write, edit, delete |
| `industry-role-management` | Role Management | `/dashboard/role-management` | read, write, edit, delete |
| `industry-analytics` | Analytics | `/dashboard/analytics` | read, download |
| `industry-reports` | Reports | `/dashboard/reports` | read, download |
| `industry-messages` | Messages | `/dashboard/messages` | read, write, delete |
| `industry-notifications` | Notifications | `/dashboard/notifications` | read, delete |
| `industry-vendors` | Vendors | `/dashboard/vendors` | read, write, edit, delete |
| `industry-budget` | Budget | `/dashboard/budget` | read, write, edit |
| `industry-approvals` | Approvals | `/dashboard/approvals` | read, edit |
| `industry-archive` | Archive | `/dashboard/archive` | read, download |
| `industry-compliance` | Compliance | `/dashboard/compliance` | read, write, edit |
| `industry-audit-logs` | Audit Logs | `/dashboard/audit-logs` | read, download |

### Sub-Modules (Requirements)

| Module ID | Display Name | Route Path | Parent Module | Available Actions |
|-----------|--------------|------------|---------------|-------------------|
| `create-requirement` | Create Requirement | `/dashboard/create-requirement` | industry-requirements | read, write, edit |
| `view-requirement` | View Requirement | `/dashboard/requirements/:id` | industry-requirements | read, write, edit, delete, download |

### Sub-Modules (Quotations)

| Module ID | Display Name | Route Path | Parent Module | Available Actions |
|-----------|--------------|------------|---------------|-------------------|
| `view-quotation` | View Quotation | `/dashboard/quotations/:id` | industry-quotations | read, write, edit, delete, download |

### Sub-Modules (Purchase Orders)

| Module ID | Display Name | Route Path | Parent Module | Available Actions |
|-----------|--------------|------------|---------------|-------------------|
| `create-purchase-order` | Create Purchase Order | `/dashboard/create-purchase-order` | industry-purchase-orders | read, write, edit |
| `view-purchase-order` | View Purchase Order | `/dashboard/purchase-orders/:id` | industry-purchase-orders | read, write, edit, delete, download |

### Sub-Modules (Projects)

| Module ID | Display Name | Route Path | Parent Module | Available Actions |
|-----------|--------------|------------|---------------|-------------------|
| `create-project` | Create Project | `/dashboard/create-project` | industry-projects | read, write, edit |
| `view-project` | View Project | `/dashboard/projects/:id` | industry-projects | read, write, edit, delete |

### Sub-Modules (Vendors)

| Module ID | Display Name | Route Path | Parent Module | Available Actions |
|-----------|--------------|------------|---------------|-------------------|
| `view-vendor` | View Vendor | `/dashboard/vendors/:id` | industry-vendors | read |

### Sub-Modules (Settings)

| Module ID | Display Name | Route Path | Parent Module | Available Actions |
|-----------|--------------|------------|---------------|-------------------|
| `industry-settings` | Settings | `/dashboard/industry-settings` | - | read, edit |
| `industry-settings-profile` | Profile Settings | `/dashboard/industry-settings/profile` | industry-settings | read, edit |
| `industry-settings-company` | Company Settings | `/dashboard/industry-settings/company` | industry-settings | read, edit |
| `industry-settings-team-members` | Team Members Settings | `/dashboard/industry-settings/team-members` | industry-settings | read, write, edit, delete |
| `industry-settings-security` | Security Settings | `/dashboard/industry-settings/security` | industry-settings | read, edit |

## Default Role Configurations

### IndustryAdmin (Full Access)

```json
{
  "permissions": [
    // All modules with all actions enabled
    {
      "module": "industry-dashboard",
      "permissions": {
        "read": true,
        "write": true,
        "edit": true,
        "delete": true,
        "download": true
      }
    }
    // ... (all other modules with full permissions)
  ]
}
```

### Procurement Manager (Limited Access)

```json
{
  "permissions": [
    {
      "module": "industry-dashboard",
      "permissions": {
        "read": true,
        "write": false,
        "edit": false,
        "delete": false,
        "download": false
      }
    },
    {
      "module": "industry-requirements",
      "permissions": {
        "read": true,
        "write": true,
        "edit": true,
        "delete": false,
        "download": true
      }
    },
    {
      "module": "industry-quotations",
      "permissions": {
        "read": true,
        "write": false,
        "edit": true,
        "delete": false,
        "download": true
      }
    }
    // ... (limited permissions for other modules)
  ]
}
```

### Department Viewer (Read-Only)

```json
{
  "permissions": [
    {
      "module": "industry-dashboard",
      "permissions": {
        "read": true,
        "write": false,
        "edit": false,
        "delete": false,
        "download": false
      }
    },
    {
      "module": "industry-requirements",
      "permissions": {
        "read": true,
        "write": false,
        "edit": false,
        "delete": false,
        "download": true
      }
    }
    // ... (read-only access to specific modules)
  ]
}
```

## API Integration

### Login API Response Format

The login API should return user permissions in the following format:

```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "admin@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "industry",
    "profile": {
      "companyName": "ABC Industries"
    }
  },
  "permissions": {
    "permissions": [
      {
        "module": "industry-dashboard",
        "permissions": {
          "read": true,
          "write": true,
          "edit": true,
          "delete": true,
          "download": true
        }
      }
      // ... all other modules
    ]
  },
  "token": "jwt-token-here"
}
```

### Frontend Integration Steps

1. **After successful login**, extract `permissions` from API response
2. **Update PermissionsContext** with received permissions
3. **Navigation automatically filters** based on read permissions
4. **UI elements conditionally render** based on action permissions

### Example Usage in Components

```typescript
import { usePermissions } from '@/hooks/usePermissions';

function RequirementsList() {
  const { hasPermission, canAccessModule } = usePermissions();
  
  // Check module access
  if (!canAccessModule('industry-requirements')) {
    return <AccessDenied />;
  }
  
  // Check specific actions
  const canCreate = hasPermission('industry-requirements', 'write');
  const canEdit = hasPermission('industry-requirements', 'edit');
  const canDelete = hasPermission('industry-requirements', 'delete');
  
  return (
    <div>
      {canCreate && <CreateButton />}
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
    </div>
  );
}
```

## Current Implementation Status

### ✅ Completed
- Type definitions (`src/types/permissions.ts`)
- Module configuration (`src/config/permissionsConfig.ts`)
- Permissions context (`src/contexts/PermissionsContext.tsx`)
- Permissions hook (`src/hooks/usePermissions.ts`)
- Utility functions (`src/utils/permissionUtils.ts`)
- Mock configuration with all permissions enabled

### 🚧 Pending
- API integration in login flow
- Navigation filtering based on permissions
- UI element conditional rendering
- Server-side permission validation

## Security Considerations

1. **Client-side permissions are for UX only** - Never rely on frontend permissions for security
2. **Server-side validation required** - All API endpoints must validate permissions
3. **Token-based authorization** - Use JWT or session-based auth with permission claims
4. **Audit logging** - Track all permission changes and access attempts
5. **Default deny** - If permission not found, default to no access

## Future Enhancements

- [ ] Time-based permissions (temporary access)
- [ ] Resource-level permissions (per-project, per-requirement)
- [ ] Permission inheritance (role hierarchies)
- [ ] Dynamic permission updates (real-time)
- [ ] Permission caching strategy
- [ ] Offline permission support
