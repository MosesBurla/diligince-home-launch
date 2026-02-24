

# Chatbot Knowledge Base Documentation Plan
## User-Specific Feature Docs with Page Links for Industry & Service Vendor

---

## Overview

Create a new structured documentation folder (`docs/ChatBot/users/`) organized by user type, containing detailed markdown files that describe every feature, page, and workflow. The chatbot will use these docs to provide contextual help and clickable page links when users ask about features.

---

## Folder Structure

```text
docs/ChatBot/users/
  industry/
    00-overview.md
    01-dashboard.md
    02-requirements.md
    03-quotations.md
    04-purchase-orders.md
    05-project-workflows.md
    06-messages.md
    07-analytics.md
    08-diligince-hub.md
    09-stakeholders.md
    10-documents.md
    11-approvals.md
    12-settings.md
    13-subscription.md
  service-vendor/
    00-overview.md
    01-dashboard.md
    02-rfqs.md
    03-quotations.md
    04-projects.md
    05-messages.md
    06-team.md
    07-services.md
    08-settings.md
    09-subscription.md
```

---

## Document Format Standard

Every markdown file will follow this consistent structure:

```markdown
# [Feature Name]

## Overview
Brief description of what this feature/module does.

## Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| Page Name | `/dashboard/path` | What this page shows |

## Key Features
- Feature 1
- Feature 2

## How To: [Action Name]
### Steps
1. Step 1
2. Step 2

## Page Details

### [Page Name]
**Route:** `/dashboard/path`
**Description:** What the user sees on this page.
**Available Actions:**
- Action 1
- Action 2

## Common Questions
**Q:** Question?
**A:** Answer with page link: [Page Name](/dashboard/path)
```

---

## Part 1: Industry User Documentation (13 files)

### `industry/00-overview.md`
- What Industry users can do on Diligince.ai
- Complete page index with all routes
- Quick reference table of all modules and their routes
- User roles (Admin, Procurement Manager, Finance Manager, Department Viewer)

### `industry/01-dashboard.md`
- **Route:** `/dashboard/industry`
- KPI cards, procurement analytics, budget overview
- Pending approvals widget
- Active requirements and PO summaries
- Quick actions (Create Requirement, View Quotes, etc.)

### `industry/02-requirements.md`
- **Pages & Routes:**
  - All Requirements: `/dashboard/industry-requirements`
  - Create New: `/dashboard/create-requirement`
  - Drafts: `/dashboard/requirements/drafts`
  - Pending Approval: `/dashboard/requirements/pending`
  - Pending Detail: `/dashboard/requirements/pending/:id`
  - Approved: `/dashboard/requirements/approved`
  - Approved Detail: `/dashboard/requirements/approved/:id`
  - Published: `/dashboard/requirements/published`
  - Published Detail: `/dashboard/requirements/published/:id`
  - Requirement Details: `/dashboard/requirements/:id`
- 6-step creation wizard walkthrough
- Status lifecycle: Draft -> Pending -> Approved -> Published
- AI Search Bar usage on listing pages

### `industry/03-quotations.md`
- **Pages & Routes:**
  - All Quotations: `/dashboard/industry-quotes`
  - Pending Review: `/dashboard/quotations/pending`
  - Approved: `/dashboard/quotations/approved`
  - For Requirement: `/dashboard/quotations/requirement/:draftId`
  - Quotation Details: `/dashboard/quotations/:id`
- How to compare, approve, reject quotations
- AI Search Bar on listing pages

### `industry/04-purchase-orders.md`
- **Pages & Routes:**
  - All Orders: `/dashboard/industry-purchase-orders`
  - Create PO: `/dashboard/create-purchase-order` (restricted, via approved quotations)
  - Create/Edit: `/dashboard/purchase-orders/create`, `/dashboard/purchase-orders/:id/edit`
  - Pending: `/dashboard/purchase-orders/pending`
  - In Progress: `/dashboard/purchase-orders/in-progress`
  - Completed: `/dashboard/purchase-orders/completed`
  - PO Details: `/dashboard/purchase-orders/:id`
- PO creation from approved quotation
- Milestone tracking, deliverables, payment terms

### `industry/05-project-workflows.md`
- **Pages & Routes:**
  - All Projects: `/dashboard/industry-workflows`
  - Active Projects: `/dashboard/workflows/active`
  - Project Details: `/dashboard/industry-project-workflow/:id`
  - Workflow Details: `/dashboard/workflow-details/:id`
- Task management, timeline, progress tracking

### `industry/06-messages.md`
- **Route:** `/dashboard/industry-messages`
- Direct messaging with vendors
- Contextual messaging (linked to requirements/POs)
- File sharing, notifications

### `industry/07-analytics.md`
- **Route:** `/dashboard/industry-analytics`
- Reports, procurement insights, charts
- Export capabilities

### `industry/08-diligince-hub.md`
- **Pages & Routes:**
  - Find Vendors: `/dashboard/Diligince-hub/vendors`
  - Find Professionals: `/dashboard/Diligince-hub/professionals`
- Vendor discovery, profile browsing, invite to quote
- Requires subscription feature: DILIGENCE_HUB

### `industry/09-stakeholders.md`
- **Pages & Routes:**
  - Vendors: `/dashboard/stakeholders/vendors`
  - Professionals: `/dashboard/stakeholders/professionals`
- Managing vendor and professional relationships

### `industry/10-documents.md`
- **Route:** `/dashboard/industry-documents`
- Document management, upload, categorization

### `industry/11-approvals.md`
- **Pages & Routes:**
  - Approvals: `/dashboard/industry-approvals`
  - Pending Approvals: `/dashboard/pending-approvals`
  - Approval Matrix: `/dashboard/approval-matrix`
  - Create Matrix: `/dashboard/approval-matrix/create`
  - View Matrix: `/dashboard/approval-matrix/:matrixId`
  - Edit Matrix: `/dashboard/approval-matrix/:matrixId/edit`
- Multi-level approval workflows

### `industry/12-settings.md`
- **Pages & Routes:**
  - Company Profile: `/dashboard/industry-settings`
  - Team Members: `/dashboard/industry-team`
  - Role Management: `/dashboard/role-management`
  - Create Role: `/dashboard/role-management/create`
  - View Role: `/dashboard/role-management/:roleId`
  - Edit Role: `/dashboard/role-management/:roleId/edit`
  - Approval Matrix: `/dashboard/industry-approval-matrix`
  - Notifications: `/dashboard/industry-notifications`
  - Account Settings: `/settings/account-settings`
- RBAC, team management, notification preferences

### `industry/13-subscription.md`
- **Pages & Routes:**
  - My Plan: `/dashboard/subscription/plans`
  - Transactions: `/dashboard/subscription/transactions`
  - Transaction Detail: `/dashboard/subscription/transactions/:id`
- Plan features, upgrade, payment history

---

## Part 2: Service Vendor Documentation (10 files)

### `service-vendor/00-overview.md`
- What Service Vendors can do
- Complete page index with all routes
- Quick reference table

### `service-vendor/01-dashboard.md`
- **Route:** `/dashboard/service-vendor`
- Stats, team availability, RFQ management, active projects, message center

### `service-vendor/02-rfqs.md`
- **Pages & Routes:**
  - Browse RFQs: `/dashboard/service-vendor-rfqs`
  - Saved RFQs: `/dashboard/rfqs/saved`
  - Applied RFQs: `/dashboard/rfqs/applied`
  - RFQ Detail: `/dashboard/rfqs/:rfqId`
  - Submit Quotation: `/dashboard/rfqs/:rfqId/submit-quotation`
- How to browse, save, apply to RFQs
- AI Search Bar usage

### `service-vendor/03-quotations.md`
- **Pages & Routes:**
  - All Quotations: `/dashboard/vendor/quotations`
  - Quotation Details: `/dashboard/vendor/quotations/:quotationId`
  - Edit Quotation: `/dashboard/vendor/quotations/:quotationId/edit`
- Status tabs (Draft, Submitted, Under Review, Accepted, Rejected)
- AI Search Bar usage

### `service-vendor/04-projects.md`
- **Pages & Routes:**
  - All Projects: `/dashboard/service-vendor-projects`
  - Active Projects: `/dashboard/service-vendor-projects/active`
  - Completed Projects: `/dashboard/service-vendor-projects/completed`
  - Project Details: `/dashboard/vendor/projects/:id`
- Milestone tracking, deliverables, project workflow

### `service-vendor/05-messages.md`
- **Route:** `/dashboard/service-vendor-messages`
- Communication with industry clients

### `service-vendor/06-team.md`
- **Pages & Routes:**
  - Team Members: `/dashboard/team/members`
  - Role Management: `/dashboard/team/roles`
  - Create Role: `/dashboard/team/roles/create`
  - View Role: `/dashboard/team/roles/:id`
  - Edit Role: `/dashboard/team/roles/:id/edit`
- Managing team, RBAC for vendors

### `service-vendor/07-services.md`
- **Route:** `/dashboard/service-vendor-services`
- Service catalog management, skills and expertise

### `service-vendor/08-settings.md`
- **Pages & Routes:**
  - Company Profile: `/dashboard/vendor-settings`
  - Service Vendor Profile: `/dashboard/service-vendor-profile`
  - Certifications: `/dashboard/service-vendor-profile/certifications`
  - Projects and Portfolio: `/dashboard/service-vendor-profile/portfolio`
  - Payment Settings: `/dashboard/service-vendor-profile/payment`
  - Account Settings: `/settings/account-settings`

### `service-vendor/09-subscription.md`
- **Pages & Routes:**
  - My Plan: `/dashboard/subscription/plans`
  - Transactions: `/dashboard/subscription/transactions`

---

## Part 3: Files to Create (Total: 23 files)

| # | File Path | Content |
|---|-----------|---------|
| 1 | `docs/ChatBot/users/industry/00-overview.md` | Industry user overview and complete page index |
| 2 | `docs/ChatBot/users/industry/01-dashboard.md` | Dashboard features and KPIs |
| 3 | `docs/ChatBot/users/industry/02-requirements.md` | Requirements module with all sub-pages |
| 4 | `docs/ChatBot/users/industry/03-quotations.md` | Quotations module with all sub-pages |
| 5 | `docs/ChatBot/users/industry/04-purchase-orders.md` | PO module with all sub-pages |
| 6 | `docs/ChatBot/users/industry/05-project-workflows.md` | Workflows module |
| 7 | `docs/ChatBot/users/industry/06-messages.md` | Messages module |
| 8 | `docs/ChatBot/users/industry/07-analytics.md` | Analytics module |
| 9 | `docs/ChatBot/users/industry/08-diligince-hub.md` | Vendor/professional discovery |
| 10 | `docs/ChatBot/users/industry/09-stakeholders.md` | Stakeholder management |
| 11 | `docs/ChatBot/users/industry/10-documents.md` | Document management |
| 12 | `docs/ChatBot/users/industry/11-approvals.md` | Approval workflows and matrix |
| 13 | `docs/ChatBot/users/industry/12-settings.md` | Settings, team, roles |
| 14 | `docs/ChatBot/users/industry/13-subscription.md` | Subscription plans |
| 15 | `docs/ChatBot/users/service-vendor/00-overview.md` | Service vendor overview |
| 16 | `docs/ChatBot/users/service-vendor/01-dashboard.md` | Dashboard features |
| 17 | `docs/ChatBot/users/service-vendor/02-rfqs.md` | RFQ browsing and application |
| 18 | `docs/ChatBot/users/service-vendor/03-quotations.md` | Quotation management |
| 19 | `docs/ChatBot/users/service-vendor/04-projects.md` | Project tracking |
| 20 | `docs/ChatBot/users/service-vendor/05-messages.md` | Messaging |
| 21 | `docs/ChatBot/users/service-vendor/06-team.md` | Team and role management |
| 22 | `docs/ChatBot/users/service-vendor/07-services.md` | Service catalog |
| 23 | `docs/ChatBot/users/service-vendor/08-settings.md` | Profile and settings |
| 24 | `docs/ChatBot/users/service-vendor/09-subscription.md` | Subscription |

---

## Key Design Decisions

1. **Page links as clickable routes** - Every feature description includes the exact route path so the chatbot can provide direct navigation links
2. **Separate from existing docs** - The existing `docs/ChatBot/` files are generic module docs. The new `docs/ChatBot/users/` folder is user-type-specific with route-level detail
3. **Consistent format** - Every file follows the same structure: Overview, Pages table, Features, How-To guides, Common Questions
4. **AI Search Bar documented** - Each listing page doc mentions the AI-powered search capability
5. **No code changes** - This is purely documentation; no component or routing changes needed

