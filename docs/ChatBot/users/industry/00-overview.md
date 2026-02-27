# Industry User - Platform Overview

## Overview
Industry users are buyers/companies on Diligince.ai who procure services, equipment, and professional expertise. The platform provides end-to-end procurement lifecycle management — from creating requirements to tracking delivery and payments.

## User Roles

| Role | Description | Access Level |
|------|-------------|-------------|
| Industry Admin | Company administrator | Full access to all modules, settings, team management |
| Procurement Manager | Handles procurement operations | Create requirements, approve quotes, issue POs |
| Finance Manager | Financial oversight | View budgets, approve payments, financial reports |
| Department Viewer | View-only access | View requirements, statuses, and reports |

## Complete Page Index

| Module | Page | Route |
|--------|------|-------|
| **Dashboard** | Main Dashboard | `/dashboard/industry` |
| **Requirements** | All Requirements | `/dashboard/industry-requirements` |
| | Create Requirement | `/dashboard/create-requirement` |
| | Drafts | `/dashboard/requirements/drafts` |
| | Pending Approval | `/dashboard/requirements/pending` |
| | Approved | `/dashboard/requirements/approved` |
| | Published | `/dashboard/requirements/published` |
| | Requirement Details | `/dashboard/requirements/:id` |
| **Quotations** | All Quotations | `/dashboard/industry-quotes` |
| | Pending Review | `/dashboard/quotations/pending` |
| | Approved Quotations | `/dashboard/quotations/approved` |
| | For Requirement | `/dashboard/quotations/requirement/:draftId` |
| | Quotation Details | `/dashboard/quotations/:id` |
| **Purchase Orders** | All Orders | `/dashboard/industry-purchase-orders` |
| | Create PO | `/dashboard/create-purchase-order` |
| | Pending | `/dashboard/purchase-orders/pending` |
| | In Progress | `/dashboard/purchase-orders/in-progress` |
| | Completed | `/dashboard/purchase-orders/completed` |
| | PO Details | `/dashboard/purchase-orders/:id` |
| **Project Workflows** | All Projects | `/dashboard/industry-workflows` |
| | Active Projects | `/dashboard/workflows/active` |
| | Project Details | `/dashboard/industry-project-workflow/:id` |
| **Messages** | Messages | `/dashboard/industry-messages` |
| **Analytics** | Analytics | `/dashboard/industry-analytics` |
| **Diligince HUB** | Find Vendors | `/dashboard/Diligince-hub/vendors` |
| | Find Professionals | `/dashboard/Diligince-hub/professionals` |
| **Stakeholders** | Vendors | `/dashboard/stakeholders/vendors` |
| | Professionals | `/dashboard/stakeholders/professionals` |
| **Documents** | Documents | `/dashboard/industry-documents` |
| **Approvals** | Approvals | `/dashboard/industry-approvals` |
| | Pending Approvals | `/dashboard/pending-approvals` |
| | Approval Matrix | `/dashboard/approval-matrix` |
| **Settings** | Company Profile | `/dashboard/industry-settings` |
| | Team Members | `/dashboard/industry-team` |
| | Role Management | `/dashboard/role-management` |
| | Notifications | `/dashboard/industry-notifications` |
| | Account Settings | `/settings/account-settings` |
| **Subscription** | My Plan | `/dashboard/subscription/plans` |
| | Transactions | `/dashboard/subscription/transactions` |

## Procurement Lifecycle

1. **Create Requirement** → Define what you need ([Create Requirement](/dashboard/create-requirement))
2. **Publish Requirement** → Make it visible to vendors ([Published Requirements](/dashboard/requirements/published))
3. **Receive Quotations** → Vendors submit quotes ([All Quotations](/dashboard/industry-quotes))
4. **Compare & Approve** → Evaluate and approve best quotes ([Approved Quotations](/dashboard/quotations/approved))
5. **Issue Purchase Order** → Formalize the agreement ([Create PO](/dashboard/create-purchase-order))
6. **Track Project** → Monitor delivery and milestones ([Active Projects](/dashboard/workflows/active))
7. **Complete & Pay** → Finalize delivery and process payments ([Completed POs](/dashboard/purchase-orders/completed))

## Common Questions

**Q:** Where do I start as a new Industry user?
**A:** Begin at your [Dashboard](/dashboard/industry) to see an overview, then [Create a Requirement](/dashboard/create-requirement) to start procuring.

**Q:** How do I find vendors?
**A:** Use the [Diligince HUB](/dashboard/Diligince-hub/vendors) to discover and invite vendors, or publish requirements for vendors to find.

**Q:** Where can I manage my team?
**A:** Go to [Team Members](/dashboard/industry-team) to add/manage users and [Role Management](/dashboard/role-management) for permissions.
