# Admin Panel - User Management Module Technical Specification

> **Document Version:** 1.0  
> **Last Updated:** December 12, 2025  
> **Status:** Ready for Development  
> **Target:** Admin Panel Development Team

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Mock Data Structures](#2-mock-data-structures)
3. [Page Specifications](#3-page-specifications)
4. [User Profile View Page](#4-user-profile-view-page)
5. [Admin Actions](#5-admin-actions)
6. [File Structure](#6-file-structure)
7. [Routes Configuration](#7-routes-configuration)
8. [UI Design Guidelines](#8-ui-design-guidelines)
9. [Mock Data Examples](#9-mock-data-examples)
10. [Implementation Priority](#10-implementation-priority)
11. [Future API Integration Points](#11-future-api-integration-points)

---

## 1. Module Overview

### 1.1 Purpose

The User Management Module enables Diligince.ai admin staff to monitor, manage, and control all platform users across three categories: Industry, Professional, and Vendor users.

### 1.2 Module Structure

```
User Management
├── Dashboard Overview (summary of all users)
├── Industry Users
│   ├── List (table with filters)
│   └── Profile View (detailed user info + stats)
├── Professional Users
│   ├── List (table with filters)
│   └── Profile View (detailed user info + stats)
└── Vendor Users
    ├── List (table with filters - shows all vendor types)
    ├── Profile View (detailed user info + stats)
    └── Filters by type (Service, Product, Logistics)
```

### 1.3 User Statuses (Common across all types)

| Status | Color | Description |
|--------|-------|-------------|
| `active` | Green | User has full platform access |
| `blocked` | Red | Temporarily blocked by admin |
| `deleted` | Gray | Soft-deleted, data retained |
| `pending` | Amber | Awaiting verification/approval |
| `suspended` | Orange | Account suspended for review |

### 1.4 Verification Statuses

| Status | Color | Description |
|--------|-------|-------------|
| `verified` | Green | Fully verified account |
| `pending` | Amber | Verification in progress |
| `incomplete` | Gray | Missing verification documents |
| `rejected` | Red | Verification rejected |

---

## 2. Mock Data Structures

### 2.1 Industry User Type

```typescript
interface AdminIndustryUser {
  id: string;
  companyName: string;
  adminName: string;
  email: string;
  phone: string;
  industry: string;  // e.g., "Manufacturing", "Oil & Gas", "IT", "Construction"
  employeeCount: string;  // e.g., "1-50", "51-100", "100-500", "500-1000", "1000+"
  location: string;
  avatar?: string;
  status: 'active' | 'blocked' | 'deleted' | 'pending' | 'suspended';
  verificationStatus: 'verified' | 'pending' | 'incomplete' | 'rejected';
  registrationDate: string;  // ISO date string
  lastLogin: string;  // ISO datetime string
  stats: {
    totalRequirements: number;
    activeRequirements: number;
    totalPurchaseOrders: number;
    totalTeamMembers: number;
    totalVendorEngagements: number;
  };
}
```

### 2.2 Professional User Type

```typescript
interface AdminProfessionalUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  expertise: string;  // Primary area of expertise
  experience: number;  // Years of experience
  location: string;
  hourlyRate: string;  // e.g., "₹5,000"
  skills: string[];
  availability: 'available' | 'busy' | 'unavailable';
  status: 'active' | 'blocked' | 'deleted' | 'pending' | 'suspended';
  verificationStatus: 'verified' | 'pending' | 'incomplete' | 'rejected';
  registrationDate: string;
  lastLogin: string;
  rating: number;  // 0-5
  stats: {
    completedProjects: number;
    activeProjects: number;
    totalEarnings: string;  // Formatted currency string
    certificationCount: number;
    averageRating: number;
  };
}
```

### 2.3 Vendor User Type

```typescript
interface AdminVendorUser {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  avatar?: string;
  vendorType: 'service' | 'product' | 'logistics';
  specializations: string[];
  location: string;
  status: 'active' | 'blocked' | 'deleted' | 'pending' | 'suspended';
  verificationStatus: 'verified' | 'pending' | 'incomplete' | 'rejected';
  registrationDate: string;
  lastLogin: string;
  rating: number;  // 0-5
  stats: {
    completedProjects: number;
    activeQuotations: number;
    totalRevenue: string;  // Formatted currency string
    winRate: number;  // Percentage 0-100
    averageResponseTime: string;  // e.g., "4 hours"
  };
}
```

### 2.4 Common Types

```typescript
// Status change history entry
interface StatusChangeEntry {
  id: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string;
  reason: string;
  timestamp: string;
}

// Activity log entry
interface ActivityLogEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
}

// Statistics card data
interface StatCard {
  title: string;
  value: number | string;
  icon: string;  // Lucide icon name
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}
```

---

## 3. Page Specifications

### 3.1 Industry Users Listing Page

**Route:** `/admin/users/industry`

**Page Title:** Industry Users

#### Statistics Overview Cards (4 cards)

| Card | Icon | Mock Value | Description |
|------|------|------------|-------------|
| Total Companies | Building | 1,245 | All registered industry accounts |
| Active | CheckCircle | 1,089 | Currently active accounts |
| Blocked | Ban | 28 | Blocked accounts |
| Pending Verification | Clock | 128 | Awaiting approval |

#### Filter Controls

| Filter | Type | Options |
|--------|------|---------|
| Search | Text Input | Search by Name, Company, Email |
| Status | Select Dropdown | All, Active, Blocked, Deleted, Pending, Suspended |
| Industry | Select Dropdown | All, Manufacturing, Oil & Gas, IT, Construction, Healthcare, Retail, Others |
| Date Range | Date Picker | Registration date range |
| Verification | Select Dropdown | All, Verified, Pending, Incomplete, Rejected |

#### Table Columns

| Column | Sortable | Content |
|--------|----------|---------|
| Company | ✅ | Company name (bold) + Admin name (muted) + Avatar |
| Contact | ❌ | Email + Phone (stacked) |
| Industry | ✅ | Industry type badge |
| Status | ✅ | Status badge (colored) |
| Verification | ✅ | Verification status badge |
| Registered | ✅ | Registration date (formatted) |
| Last Login | ✅ | Last login date/time (relative) |
| Actions | ❌ | Dropdown: View, Block/Unblock, Delete |

#### Pagination

- Default: 10 items per page
- Options: 10, 25, 50, 100

---

### 3.2 Professional Users Listing Page

**Route:** `/admin/users/professionals`

**Page Title:** Professional Users

#### Statistics Overview Cards (4 cards)

| Card | Icon | Mock Value | Description |
|------|------|------------|-------------|
| Total Professionals | User | 3,567 | All registered professionals |
| Active | CheckCircle | 2,890 | Currently active |
| Blocked | Ban | 45 | Blocked accounts |
| Available | Briefcase | 1,234 | Currently available for work |

#### Filter Controls

| Filter | Type | Options |
|--------|------|---------|
| Search | Text Input | Search by Name, Email, Skills |
| Status | Select Dropdown | All, Active, Blocked, Deleted, Pending, Suspended |
| Expertise | Select Dropdown | All, Engineering, Consulting, Project Management, IT, Legal, Finance, Others |
| Experience | Select Dropdown | All, 0-5 years, 5-10 years, 10-15 years, 15+ years |
| Availability | Select Dropdown | All, Available, Busy, Unavailable |
| Rating | Select Dropdown | All, 4+ stars, 3+ stars, 2+ stars |

#### Table Columns

| Column | Sortable | Content |
|--------|----------|---------|
| Professional | ✅ | Name (bold) + Avatar + Expertise (muted) |
| Contact | ❌ | Email + Phone (stacked) |
| Experience | ✅ | Years + "years" label |
| Rating | ✅ | Star rating (visual stars) |
| Status | ✅ | Status badge (colored) |
| Registered | ✅ | Registration date |
| Last Login | ✅ | Last login (relative) |
| Actions | ❌ | Dropdown: View, Block/Unblock, Delete |

---

### 3.3 Vendor Users Listing Page

**Route:** `/admin/users/vendors`

**Page Title:** Vendor Users

#### Statistics Overview Cards (5 cards)

| Card | Icon | Mock Value | Description |
|------|------|------------|-------------|
| Total Vendors | Store | 2,890 | All registered vendors |
| Service Vendors | Wrench | 1,245 | Service providers |
| Product Vendors | Package | 1,123 | Product suppliers |
| Logistics Vendors | Truck | 522 | Logistics partners |
| Blocked | Ban | 67 | Blocked vendors |

#### Filter Controls

| Filter | Type | Options |
|--------|------|---------|
| Search | Text Input | Search by Company Name, Contact, Email |
| Status | Select Dropdown | All, Active, Blocked, Deleted, Pending, Suspended |
| Vendor Type | Select Dropdown | All, Service, Product, Logistics |
| Rating | Select Dropdown | All, 4+ stars, 3+ stars, 2+ stars |
| Verification | Select Dropdown | All, Verified, Pending, Incomplete, Rejected |

#### Table Columns

| Column | Sortable | Content |
|--------|----------|---------|
| Vendor | ✅ | Company name + Contact name + Type badge (color-coded) |
| Contact | ❌ | Email + Phone (stacked) |
| Type | ✅ | Vendor type badge (Service=Blue, Product=Purple, Logistics=Orange) |
| Rating | ✅ | Star rating |
| Status | ✅ | Status badge |
| Registered | ✅ | Registration date |
| Last Login | ✅ | Last login (relative) |
| Actions | ❌ | Dropdown: View, Block/Unblock, Delete |

#### Vendor Type Badge Colors

| Type | Background | Text |
|------|------------|------|
| Service | Blue-100 | Blue-800 |
| Product | Purple-100 | Purple-800 |
| Logistics | Orange-100 | Orange-800 |

---

## 4. User Profile View Page

**Route:** `/admin/users/:userType/:userId`

**Examples:**
- `/admin/users/industry/ind-001`
- `/admin/users/professionals/prof-001`
- `/admin/users/vendors/vnd-001`

### 4.1 Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│ ← Back to [User Type] Users                    [Block] [Delete]  │
├──────────────────────────────────────────────────────────────────┤
│ ┌───────────┐                                                    │
│ │           │  Company/User Name                                 │
│ │  Avatar   │  email@example.com | +91 98765 43210               │
│ │           │  [Status Badge] [Verification Badge]               │
│ └───────────┘  Registered: Jan 15, 2024 | Last Login: 2 hours ago│
├──────────────────────────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │
│ │ Stat 1 │ │ Stat 2 │ │ Stat 3 │ │ Stat 4 │ │ Stat 5 │          │
│ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘          │
├──────────────────────────────────────────────────────────────────┤
│ [Profile Details] [Activity Log] [Related Data]                  │
│ ─────────────────────────────────────────────────────────────────│
│                                                                  │
│                     Tab Content Area                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Profile Stats Cards by User Type

#### Industry User Stats
| Stat | Icon | Description |
|------|------|-------------|
| Total Requirements | FileText | Requirements created |
| Active Requirements | Clock | Currently open |
| Purchase Orders | ShoppingCart | Total POs issued |
| Team Members | Users | Company team size |
| Vendor Engagements | Handshake | Vendors worked with |

#### Professional User Stats
| Stat | Icon | Description |
|------|------|-------------|
| Completed Projects | CheckCircle | Projects finished |
| Active Projects | Briefcase | Ongoing work |
| Total Earnings | DollarSign | Lifetime earnings |
| Certifications | Award | Verified certs |
| Average Rating | Star | Client rating |

#### Vendor User Stats
| Stat | Icon | Description |
|------|------|-------------|
| Completed Projects | CheckCircle | Projects delivered |
| Active Quotations | FileText | Open quotes |
| Total Revenue | DollarSign | Lifetime revenue |
| Win Rate | TrendingUp | Quote success % |
| Avg Response Time | Clock | Response speed |

### 4.3 Tab Contents

#### Tab 1: Profile Details

**Industry Users:**
- Company Information (name, industry, employee count)
- Admin Contact Details
- Business Address
- GST/Tax Information (if available)
- Company Description

**Professional Users:**
- Personal Information
- Expertise & Skills
- Experience Summary
- Certifications List
- Hourly Rate & Availability

**Vendor Users:**
- Company Information
- Primary Contact
- Vendor Type & Specializations
- Service/Product Catalog Summary
- Business Credentials

#### Tab 2: Activity Log (Mock Data)

Display last 20 activities:
- Login events
- Status changes
- Profile updates
- Key actions (requirements created, quotes submitted, etc.)

**Activity Log Entry Format:**
```
[Icon] Action Description
Timestamp (relative) • IP Address (if available)
```

#### Tab 3: Related Data

**Industry Users:**
- Recent Requirements (last 5)
- Active Team Members (count + link)
- Recent Purchase Orders (last 5)

**Professional Users:**
- Recent Projects (last 5)
- Certifications Gallery
- Reviews/Feedback Summary

**Vendor Users:**
- Recent Quotations (last 5)
- Product/Service Listings (if Product/Service vendor)
- Fleet Information (if Logistics vendor)
- Reviews/Feedback Summary

---

## 5. Admin Actions

### 5.1 Block User

**Trigger:** Click "Block" button from list actions or profile page header

**Dialog Component:** `BlockUserDialog`

**Dialog Contents:**
```
┌─────────────────────────────────────────────┐
│ Block User Account                      [X] │
├─────────────────────────────────────────────┤
│ You are about to block:                     │
│ [Avatar] User/Company Name                  │
│                                             │
│ Reason for blocking: *                      │
│ ┌─────────────────────────────────────────┐ │
│ │ Select reason...                      ▼ │ │
│ └─────────────────────────────────────────┘ │
│ Options:                                    │
│ - Violation of Terms of Service             │
│ - Suspicious Activity                       │
│ - Payment Issues                            │
│ - Fraudulent Behavior                       │
│ - User Request                              │
│ - Other                                     │
│                                             │
│ Additional Notes (optional):                │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Block Duration:                             │
│ ○ Indefinite                                │
│ ○ 7 Days                                    │
│ ○ 30 Days                                   │
│ ○ Custom: [Date Picker]                     │
│                                             │
│ ☑ Notify user via email                     │
│                                             │
├─────────────────────────────────────────────┤
│              [Cancel]  [Block User]         │
└─────────────────────────────────────────────┘
```

**After Block Action:**
1. User status changes to `blocked`
2. User cannot login to platform
3. If "Notify user" checked, send notification email
4. Log action in activity history
5. Show success toast: "User blocked successfully"
6. Refresh table data

### 5.2 Unblock User

**Trigger:** Click "Unblock" button (shown when user is blocked)

**Dialog Contents:**
```
┌─────────────────────────────────────────────┐
│ Unblock User Account                    [X] │
├─────────────────────────────────────────────┤
│ You are about to unblock:                   │
│ [Avatar] User/Company Name                  │
│                                             │
│ This will restore the user's access to the  │
│ platform.                                   │
│                                             │
│ ☑ Notify user via email                     │
│                                             │
├─────────────────────────────────────────────┤
│              [Cancel]  [Unblock User]       │
└─────────────────────────────────────────────┘
```

**After Unblock Action:**
1. User status changes to `active`
2. User can login again
3. If "Notify user" checked, send notification email
4. Log action in activity history
5. Show success toast: "User unblocked successfully"

### 5.3 Delete User (Soft Delete)

**Trigger:** Click "Delete" button from list actions or profile page header

**Dialog Component:** `DeleteUserDialog`

**Dialog Contents:**
```
┌─────────────────────────────────────────────┐
│ ⚠️ Delete User Account                  [X] │
├─────────────────────────────────────────────┤
│ You are about to delete:                    │
│ [Avatar] User/Company Name                  │
│                                             │
│ ⚠️ Warning: This action will:               │
│ • Prevent user from logging in              │
│ • Hide user from active listings            │
│ • Retain user data for audit purposes       │
│                                             │
│ This is a SOFT DELETE. Data will be         │
│ retained and can be restored by Super Admin.│
│                                             │
│ Reason for deletion: *                      │
│ ┌─────────────────────────────────────────┐ │
│ │ Select reason...                      ▼ │ │
│ └─────────────────────────────────────────┘ │
│ Options:                                    │
│ - User requested deletion                   │
│ - Inactive account                          │
│ - Duplicate account                         │
│ - Policy violation                          │
│ - Other                                     │
│                                             │
│ Additional Notes:                           │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
├─────────────────────────────────────────────┤
│              [Cancel]  [Delete User]        │
└─────────────────────────────────────────────┘
```

**After Delete Action:**
1. User status changes to `deleted`
2. User cannot login
3. User hidden from active listings (unless "Show Deleted" filter applied)
4. Data retained in database
5. Log action in activity history
6. Show success toast: "User deleted successfully"

### 5.4 View User

**Trigger:** Click "View" button or click on table row

**Action:** Navigate to `/admin/users/:type/:id`

---

## 6. File Structure

```
src/
├── pages/admin/
│   ├── UserManagementDashboard.tsx      # Overview dashboard
│   ├── IndustryUsersPage.tsx            # Industry users list
│   ├── ProfessionalUsersPage.tsx        # Professional users list
│   ├── VendorUsersPage.tsx              # Vendor users list
│   └── UserProfilePage.tsx              # Shared profile view page
│
├── components/admin/user-management/
│   ├── UserStatisticsCards.tsx          # Stats cards component
│   ├── UserFilters.tsx                  # Filter controls component
│   ├── UserTable.tsx                    # Shared table component
│   ├── UserTableRow.tsx                 # Table row component
│   ├── UserProfileHeader.tsx            # Profile page header
│   ├── UserProfileStats.tsx             # Profile stats cards
│   ├── UserProfileTabs.tsx              # Profile tabs container
│   ├── ProfileDetailsTab.tsx            # Profile details content
│   ├── ActivityLogTab.tsx               # Activity log content
│   ├── RelatedDataTab.tsx               # Related data content
│   ├── BlockUserDialog.tsx              # Block confirmation dialog
│   ├── UnblockUserDialog.tsx            # Unblock confirmation dialog
│   ├── DeleteUserDialog.tsx             # Delete confirmation dialog
│   ├── StatusBadge.tsx                  # Status badge component
│   ├── VerificationBadge.tsx            # Verification badge component
│   └── VendorTypeBadge.tsx              # Vendor type badge component
│
├── hooks/admin/
│   ├── useAdminUsers.ts                 # Users data hook (uses mock)
│   ├── useUserFilters.ts                # Filter state management
│   └── useUserActions.ts                # Block/Unblock/Delete actions
│
├── data/admin/
│   ├── mockIndustryUsers.ts             # 20+ mock industry users
│   ├── mockProfessionalUsers.ts         # 20+ mock professional users
│   ├── mockVendorUsers.ts               # 20+ mock vendor users
│   └── mockActivityLogs.ts              # Mock activity log entries
│
└── types/admin/
    └── admin-user-management.types.ts   # All TypeScript interfaces
```

---

## 7. Routes Configuration

```typescript
// In App.tsx or routes configuration file

import { UserManagementDashboard } from '@/pages/admin/UserManagementDashboard';
import { IndustryUsersPage } from '@/pages/admin/IndustryUsersPage';
import { ProfessionalUsersPage } from '@/pages/admin/ProfessionalUsersPage';
import { VendorUsersPage } from '@/pages/admin/VendorUsersPage';
import { UserProfilePage } from '@/pages/admin/UserProfilePage';

// Admin User Management Routes
const adminUserManagementRoutes = [
  {
    path: "/admin/users",
    children: [
      { 
        index: true, 
        element: <UserManagementDashboard /> 
      },
      { 
        path: "industry", 
        element: <IndustryUsersPage /> 
      },
      { 
        path: "industry/:userId", 
        element: <UserProfilePage userType="industry" /> 
      },
      { 
        path: "professionals", 
        element: <ProfessionalUsersPage /> 
      },
      { 
        path: "professionals/:userId", 
        element: <UserProfilePage userType="professional" /> 
      },
      { 
        path: "vendors", 
        element: <VendorUsersPage /> 
      },
      { 
        path: "vendors/:userId", 
        element: <UserProfilePage userType="vendor" /> 
      },
    ]
  }
];
```

---

## 8. UI Design Guidelines

### 8.1 Color Palette

Use semantic tokens from the design system:

| Purpose | CSS Variable | Fallback HSL |
|---------|--------------|--------------|
| Primary (Corporate Navy) | `--primary` | `hsl(207, 63%, 23%)` |
| Success (Active/Verified) | `--success` or Emerald | `hsl(158, 64%, 52%)` |
| Warning (Pending) | `--warning` or Amber | `hsl(38, 92%, 50%)` |
| Danger (Blocked/Deleted) | `--destructive` or Red | `hsl(0, 84%, 60%)` |
| Info (Verified) | Blue | `hsl(217, 91%, 60%)` |
| Muted | `--muted` | As defined |

### 8.2 Status Badge Styles

```typescript
const statusStyles = {
  active: {
    background: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200"
  },
  blocked: {
    background: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200"
  },
  deleted: {
    background: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200"
  },
  pending: {
    background: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200"
  },
  suspended: {
    background: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200"
  },
};
```

### 8.3 Verification Badge Styles

```typescript
const verificationStyles = {
  verified: {
    background: "bg-emerald-100",
    text: "text-emerald-800",
    icon: "CheckCircle"
  },
  pending: {
    background: "bg-amber-100",
    text: "text-amber-800",
    icon: "Clock"
  },
  incomplete: {
    background: "bg-gray-100",
    text: "text-gray-600",
    icon: "AlertCircle"
  },
  rejected: {
    background: "bg-red-100",
    text: "text-red-800",
    icon: "XCircle"
  },
};
```

### 8.4 Component Patterns

- **Cards:** Use `Card` component from shadcn/ui with subtle shadow
- **Tables:** Use existing `Table` components with hover states
- **Inputs:** Use `Input`, `Select` from design system
- **Badges:** Use `Badge` component with custom variants
- **Dialogs:** Use `AlertDialog` for confirmation actions
- **Loading:** Use skeleton loaders during data fetch
- **Empty State:** Show friendly message when no data

### 8.5 Typography

| Element | Style |
|---------|-------|
| Page Title | `text-2xl font-semibold text-foreground` |
| Card Title | `text-lg font-medium` |
| Table Header | `text-sm font-medium text-muted-foreground` |
| Table Cell | `text-sm text-foreground` |
| Badge Text | `text-xs font-medium` |
| Muted Text | `text-sm text-muted-foreground` |

### 8.6 Spacing

- Page padding: `p-6`
- Card padding: `p-4` or `p-6`
- Grid gap: `gap-4` or `gap-6`
- Stats cards: `grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4`

### 8.7 Responsive Behavior

- **Desktop (1280px+):** Full layout, all columns visible
- **Tablet (768px-1279px):** Condensed columns, hide less important data
- **Mobile (<768px):** Card-based layout instead of table

---

## 9. Mock Data Examples

### 9.1 Industry Users (20 samples)

```typescript
export const mockIndustryUsers: AdminIndustryUser[] = [
  {
    id: "ind-001",
    companyName: "Tata Steel Limited",
    adminName: "Rajesh Kumar",
    email: "rajesh.kumar@tatasteel.com",
    phone: "+91 98765 43210",
    industry: "Manufacturing",
    employeeCount: "1000+",
    location: "Mumbai, Maharashtra",
    status: "active",
    verificationStatus: "verified",
    registrationDate: "2024-06-15",
    lastLogin: "2025-12-12T10:30:00Z",
    stats: {
      totalRequirements: 45,
      activeRequirements: 12,
      totalPurchaseOrders: 89,
      totalTeamMembers: 15,
      totalVendorEngagements: 34
    }
  },
  {
    id: "ind-002",
    companyName: "Reliance Industries",
    adminName: "Priya Sharma",
    email: "priya.sharma@ril.com",
    phone: "+91 98765 43211",
    industry: "Oil & Gas",
    employeeCount: "1000+",
    location: "Mumbai, Maharashtra",
    status: "active",
    verificationStatus: "verified",
    registrationDate: "2024-05-20",
    lastLogin: "2025-12-11T15:45:00Z",
    stats: {
      totalRequirements: 78,
      activeRequirements: 23,
      totalPurchaseOrders: 156,
      totalTeamMembers: 28,
      totalVendorEngagements: 67
    }
  },
  {
    id: "ind-003",
    companyName: "Infosys Technologies",
    adminName: "Amit Verma",
    email: "amit.verma@infosys.com",
    phone: "+91 98765 43212",
    industry: "IT",
    employeeCount: "1000+",
    location: "Bangalore, Karnataka",
    status: "active",
    verificationStatus: "verified",
    registrationDate: "2024-07-01",
    lastLogin: "2025-12-12T08:00:00Z",
    stats: {
      totalRequirements: 34,
      activeRequirements: 8,
      totalPurchaseOrders: 45,
      totalTeamMembers: 12,
      totalVendorEngagements: 23
    }
  },
  {
    id: "ind-004",
    companyName: "L&T Construction",
    adminName: "Sanjay Patel",
    email: "sanjay.patel@lnt.com",
    phone: "+91 98765 43213",
    industry: "Construction",
    employeeCount: "500-1000",
    location: "Chennai, Tamil Nadu",
    status: "blocked",
    verificationStatus: "verified",
    registrationDate: "2024-04-10",
    lastLogin: "2025-11-28T11:20:00Z",
    stats: {
      totalRequirements: 56,
      activeRequirements: 0,
      totalPurchaseOrders: 78,
      totalTeamMembers: 20,
      totalVendorEngagements: 45
    }
  },
  {
    id: "ind-005",
    companyName: "Apollo Hospitals",
    adminName: "Dr. Meena Reddy",
    email: "meena.reddy@apollo.com",
    phone: "+91 98765 43214",
    industry: "Healthcare",
    employeeCount: "500-1000",
    location: "Hyderabad, Telangana",
    status: "active",
    verificationStatus: "pending",
    registrationDate: "2025-01-05",
    lastLogin: "2025-12-10T09:30:00Z",
    stats: {
      totalRequirements: 12,
      activeRequirements: 5,
      totalPurchaseOrders: 18,
      totalTeamMembers: 8,
      totalVendorEngagements: 10
    }
  },
  // ... Add 15 more entries with varied statuses
];
```

### 9.2 Professional Users (20 samples)

```typescript
export const mockProfessionalUsers: AdminProfessionalUser[] = [
  {
    id: "prof-001",
    name: "Dr. Ananya Sharma",
    email: "ananya.sharma@gmail.com",
    phone: "+91 87654 32109",
    expertise: "Mechanical Engineering",
    experience: 12,
    location: "Bangalore, Karnataka",
    hourlyRate: "₹5,000",
    skills: ["AutoCAD", "Project Management", "Quality Control", "Six Sigma"],
    availability: "available",
    status: "active",
    verificationStatus: "verified",
    registrationDate: "2024-08-20",
    lastLogin: "2025-12-11T14:45:00Z",
    rating: 4.8,
    stats: {
      completedProjects: 23,
      activeProjects: 3,
      totalEarnings: "₹12,50,000",
      certificationCount: 5,
      averageRating: 4.8
    }
  },
  {
    id: "prof-002",
    name: "Vikram Malhotra",
    email: "vikram.malhotra@outlook.com",
    phone: "+91 87654 32110",
    expertise: "Civil Engineering",
    experience: 8,
    location: "Delhi, NCR",
    hourlyRate: "₹4,000",
    skills: ["Structural Analysis", "AutoCAD Civil 3D", "Project Planning"],
    availability: "busy",
    status: "active",
    verificationStatus: "verified",
    registrationDate: "2024-09-15",
    lastLogin: "2025-12-12T11:00:00Z",
    rating: 4.5,
    stats: {
      completedProjects: 18,
      activeProjects: 2,
      totalEarnings: "₹8,75,000",
      certificationCount: 3,
      averageRating: 4.5
    }
  },
  {
    id: "prof-003",
    name: "Sneha Gupta",
    email: "sneha.gupta@yahoo.com",
    phone: "+91 87654 32111",
    expertise: "IT Consulting",
    experience: 15,
    location: "Pune, Maharashtra",
    hourlyRate: "₹7,500",
    skills: ["Cloud Architecture", "DevOps", "Agile", "AWS", "Azure"],
    availability: "available",
    status: "active",
    verificationStatus: "verified",
    registrationDate: "2024-06-01",
    lastLogin: "2025-12-12T09:15:00Z",
    rating: 4.9,
    stats: {
      completedProjects: 45,
      activeProjects: 5,
      totalEarnings: "₹35,00,000",
      certificationCount: 8,
      averageRating: 4.9
    }
  },
  {
    id: "prof-004",
    name: "Rakesh Nair",
    email: "rakesh.nair@gmail.com",
    phone: "+91 87654 32112",
    expertise: "Legal Consulting",
    experience: 20,
    location: "Mumbai, Maharashtra",
    hourlyRate: "₹10,000",
    skills: ["Corporate Law", "Contract Law", "Compliance", "Due Diligence"],
    availability: "unavailable",
    status: "suspended",
    verificationStatus: "verified",
    registrationDate: "2024-03-10",
    lastLogin: "2025-11-15T16:30:00Z",
    rating: 4.2,
    stats: {
      completedProjects: 67,
      activeProjects: 0,
      totalEarnings: "₹85,00,000",
      certificationCount: 4,
      averageRating: 4.2
    }
  },
  // ... Add 16 more entries
];
```

### 9.3 Vendor Users (20 samples)

```typescript
export const mockVendorUsers: AdminVendorUser[] = [
  {
    id: "vnd-001",
    companyName: "TechServe Solutions Pvt Ltd",
    contactName: "Vikram Patel",
    email: "vikram@techserve.com",
    phone: "+91 76543 21098",
    vendorType: "service",
    specializations: ["IT Services", "Consulting", "System Integration"],
    location: "Hyderabad, Telangana",
    status: "active",
    verificationStatus: "verified",
    registrationDate: "2024-05-10",
    lastLogin: "2025-12-12T09:15:00Z",
    rating: 4.5,
    stats: {
      completedProjects: 67,
      activeQuotations: 8,
      totalRevenue: "₹2,45,00,000",
      winRate: 72,
      averageResponseTime: "4 hours"
    }
  },
  {
    id: "vnd-002",
    companyName: "Industrial Supplies Co",
    contactName: "Ramesh Kumar",
    email: "ramesh@industrialsupplies.in",
    phone: "+91 76543 21099",
    vendorType: "product",
    specializations: ["Industrial Equipment", "Safety Gear", "Tools"],
    location: "Chennai, Tamil Nadu",
    status: "active",
    verificationStatus: "verified",
    registrationDate: "2024-04-15",
    lastLogin: "2025-12-11T16:45:00Z",
    rating: 4.7,
    stats: {
      completedProjects: 134,
      activeQuotations: 12,
      totalRevenue: "₹5,67,00,000",
      winRate: 68,
      averageResponseTime: "2 hours"
    }
  },
  {
    id: "vnd-003",
    companyName: "FastTrack Logistics",
    contactName: "Suresh Reddy",
    email: "suresh@fasttrack.com",
    phone: "+91 76543 21100",
    vendorType: "logistics",
    specializations: ["Heavy Equipment Transport", "Warehousing", "Last Mile Delivery"],
    location: "Bangalore, Karnataka",
    status: "active",
    verificationStatus: "pending",
    registrationDate: "2025-01-02",
    lastLogin: "2025-12-12T07:30:00Z",
    rating: 4.3,
    stats: {
      completedProjects: 23,
      activeQuotations: 5,
      totalRevenue: "₹45,00,000",
      winRate: 65,
      averageResponseTime: "6 hours"
    }
  },
  {
    id: "vnd-004",
    companyName: "ElectroMart Distributors",
    contactName: "Kavitha Iyer",
    email: "kavitha@electromart.in",
    phone: "+91 76543 21101",
    vendorType: "product",
    specializations: ["Electrical Components", "Automation Equipment", "Control Systems"],
    location: "Coimbatore, Tamil Nadu",
    status: "blocked",
    verificationStatus: "verified",
    registrationDate: "2024-06-20",
    lastLogin: "2025-11-20T14:00:00Z",
    rating: 3.8,
    stats: {
      completedProjects: 45,
      activeQuotations: 0,
      totalRevenue: "₹1,23,00,000",
      winRate: 55,
      averageResponseTime: "8 hours"
    }
  },
  // ... Add 16 more entries
];
```

### 9.4 Mock Activity Logs

```typescript
export const mockActivityLogs: ActivityLogEntry[] = [
  {
    id: "log-001",
    action: "Login",
    description: "User logged in successfully",
    timestamp: "2025-12-12T10:30:00Z",
    ipAddress: "192.168.1.100"
  },
  {
    id: "log-002",
    action: "Profile Update",
    description: "Updated company address",
    timestamp: "2025-12-11T15:20:00Z",
    ipAddress: "192.168.1.100"
  },
  {
    id: "log-003",
    action: "Requirement Created",
    description: "Created new requirement REQ-2025-001",
    timestamp: "2025-12-10T09:45:00Z",
    ipAddress: "192.168.1.100"
  },
  // ... more entries
];
```

---

## 10. Implementation Priority

### Phase 1: Foundation (2 days)
- [ ] Create TypeScript interfaces in `admin-user-management.types.ts`
- [ ] Create mock data files for all three user types (20+ each)
- [ ] Set up basic page structure and routing

### Phase 2: Industry Users (2 days)
- [ ] `IndustryUsersPage.tsx` - Statistics cards + Filters + Table
- [ ] `StatusBadge.tsx` and `VerificationBadge.tsx` components
- [ ] Sorting and pagination functionality

### Phase 3: Professional Users (1 day)
- [ ] `ProfessionalUsersPage.tsx` - Adapt from Industry page
- [ ] Add availability badge component
- [ ] Rating display component

### Phase 4: Vendor Users (1 day)
- [ ] `VendorUsersPage.tsx` - Adapt from Industry page
- [ ] `VendorTypeBadge.tsx` component
- [ ] Extra statistics card (5 instead of 4)

### Phase 5: User Profile Page (2 days)
- [ ] `UserProfilePage.tsx` - Shared component for all types
- [ ] `UserProfileHeader.tsx` - Avatar, name, status
- [ ] `UserProfileStats.tsx` - Dynamic stats based on user type
- [ ] `UserProfileTabs.tsx` - Tab container
- [ ] `ProfileDetailsTab.tsx`, `ActivityLogTab.tsx`, `RelatedDataTab.tsx`

### Phase 6: Admin Actions (1 day)
- [ ] `BlockUserDialog.tsx` - Block confirmation with reason
- [ ] `UnblockUserDialog.tsx` - Unblock confirmation
- [ ] `DeleteUserDialog.tsx` - Soft delete with reason
- [ ] `useUserActions.ts` hook for action handlers

### Phase 7: Polish (1 day)
- [ ] Responsive design testing
- [ ] Loading states and empty states
- [ ] Error handling
- [ ] Final UI polish

**Total Estimated: 10 development days**

---

## 11. Future API Integration Points

When backend is ready, replace mock data with these API calls:

### 11.1 List Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Get Industry Users | GET | `/api/v1/admin/users/industry` |
| Get Professional Users | GET | `/api/v1/admin/users/professionals` |
| Get Vendor Users | GET | `/api/v1/admin/users/vendors` |
| Get User Statistics | GET | `/api/v1/admin/users/statistics` |

**Query Parameters (common):**
- `page` - Page number
- `limit` - Items per page
- `sortBy` - Sort field
- `sortOrder` - asc/desc
- `search` - Search term
- `status` - Status filter
- `verificationStatus` - Verification filter

### 11.2 Detail Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Get User by ID | GET | `/api/v1/admin/users/:type/:id` |
| Get User Stats | GET | `/api/v1/admin/users/:type/:id/stats` |
| Get Activity Log | GET | `/api/v1/admin/users/:type/:id/activity` |

### 11.3 Action Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Block User | PATCH | `/api/v1/admin/users/:type/:id/block` |
| Unblock User | PATCH | `/api/v1/admin/users/:type/:id/unblock` |
| Delete User | DELETE | `/api/v1/admin/users/:type/:id` |
| Restore User | PATCH | `/api/v1/admin/users/:type/:id/restore` |

### 11.4 Request/Response Examples

**Block User Request:**
```json
POST /api/v1/admin/users/industry/ind-001/block
{
  "reason": "violation_of_terms",
  "notes": "Multiple policy violations reported",
  "duration": "indefinite",
  "notifyUser": true
}
```

**Block User Response:**
```json
{
  "success": true,
  "message": "User blocked successfully",
  "data": {
    "userId": "ind-001",
    "previousStatus": "active",
    "newStatus": "blocked",
    "blockedAt": "2025-12-12T12:00:00Z",
    "blockedBy": "admin-001",
    "notificationSent": true
  }
}
```

---

## 12. Notes for Development Team

1. **No API Integration Initially:** All data comes from mock files. Create realistic mock data with varied statuses.

2. **State Management:** Use React useState/useReducer for filter and action states. No global state management needed initially.

3. **Component Reusability:** The `UserTable`, `StatusBadge`, and dialog components should be reusable across all three user types.

4. **Responsive Priority:** Ensure mobile layout works with card-based design for tables.

5. **Design System Compliance:** Use only design system tokens for colors, spacing, and typography. No hardcoded values.

6. **Testing:** Include mock data that covers all status combinations for thorough testing.

---

**Document Prepared By:** Lovable AI  
**Review Required By:** Development Lead  
**Target Completion:** TBD
