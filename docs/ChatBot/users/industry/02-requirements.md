# Industry Requirements Module

## Overview
The Requirements module allows Industry users to define, create, manage, and publish procurement requirements. Requirements go through a lifecycle from Draft to Published, with approval workflows in between. Vendors can then view published requirements and submit quotations.

## Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| All Requirements | `/dashboard/industry-requirements` | Overview of all requirements across statuses |
| Create Requirement | `/dashboard/create-requirement` | 6-step wizard to create a new requirement |
| Drafts | `/dashboard/requirements/drafts` | Requirements still being prepared |
| Pending Approval | `/dashboard/requirements/pending` | Requirements submitted for internal approval |
| Pending Detail | `/dashboard/requirements/pending/:id` | Detail view of a pending requirement |
| Approved | `/dashboard/requirements/approved` | Requirements approved and ready to publish |
| Approved Detail | `/dashboard/requirements/approved/:id` | Detail view of an approved requirement |
| Published | `/dashboard/requirements/published` | Requirements visible to vendors |
| Published Detail | `/dashboard/requirements/published/:id` | Detail view of a published requirement |
| Requirement Details | `/dashboard/requirements/:id` | General detail view of any requirement |

## Key Features
- **6-Step Creation Wizard** — Guided process to define requirements completely
- **Status Lifecycle** — Draft → Pending → Approved → Published
- **AI-Powered Search** — Search across all requirement listing pages using the AI Search Bar
- **Multi-level Approvals** — Requirements can require approval before publishing
- **Category & Priority Filtering** — Filter by equipment, services, logistics, priority level
- **Export** — Export requirement lists to XLSX or CSV

## Status Lifecycle

```
Draft → Pending Approval → Approved → Published
  ↑         ↓                              ↓
  └── Rejected (back to draft)     Vendors see & quote
```

## How To: Create a New Requirement
### Steps
1. Go to [Create Requirement](/dashboard/create-requirement) or click "Create Requirement" from the [Dashboard](/dashboard/industry)
2. **Step 1 — Basic Info:** Enter title, description, category, and priority
3. **Step 2 — Specifications:** Define technical specifications and quantities
4. **Step 3 — Timeline:** Set deadline, delivery dates, and milestones
5. **Step 4 — Budget:** Enter budget range and payment preferences
6. **Step 5 — Documents:** Upload supporting documents (specs, drawings, etc.)
7. **Step 6 — Review & Submit:** Review all details and submit for approval or save as draft
8. The requirement appears in [Drafts](/dashboard/requirements/drafts) if saved, or [Pending](/dashboard/requirements/pending) if submitted

## How To: Search Requirements
### Steps
1. Navigate to any requirements listing page (e.g., [All Requirements](/dashboard/industry-requirements))
2. Use the **AI-Powered Search Bar** at the top of the page
3. Type your search query (ID, title, category, etc.)
4. Click the search icon or press Enter to search
5. Results are filtered in the table below

## How To: Publish a Requirement
### Steps
1. Go to [Approved Requirements](/dashboard/requirements/approved)
2. Click on the requirement you want to publish
3. Review all details on the detail page
4. Click "Publish" to make it visible to vendors
5. The requirement moves to [Published](/dashboard/requirements/published)

## Page Details

### All Requirements
**Route:** `/dashboard/industry-requirements`
**Description:** Master list of all requirements across all statuses with filtering and sorting.
**Available Actions:**
- Search using AI Search Bar
- Filter by category, priority, status
- Sort by any column
- Click any requirement to view details
- Export to XLSX/CSV
- Create new requirement

### Drafts
**Route:** `/dashboard/requirements/drafts`
**Description:** Requirements that are still being prepared and have not been submitted for approval.
**Available Actions:**
- Edit draft requirements
- Submit for approval
- Delete drafts
- Search and filter

### Pending Approval
**Route:** `/dashboard/requirements/pending`
**Description:** Requirements submitted for internal approval, waiting for approver action.
**Available Actions:**
- View requirement details
- Approve or reject (if you are an approver)
- Search and filter

### Approved
**Route:** `/dashboard/requirements/approved`
**Description:** Requirements that have been approved and are ready to be published.
**Available Actions:**
- Publish to make visible to vendors
- View details
- Search and filter

### Published
**Route:** `/dashboard/requirements/published`
**Description:** Requirements that are live and visible to vendors who can submit quotations.
**Available Actions:**
- View vendor quotations received
- Close or archive requirement
- Search and filter

## Common Questions

**Q:** How do I create a requirement?
**A:** Go to [Create Requirement](/dashboard/create-requirement) and follow the 6-step wizard.

**Q:** Where are my draft requirements?
**A:** Find them at [Drafts](/dashboard/requirements/drafts).

**Q:** How do I know if my requirement is approved?
**A:** Check [Pending Approval](/dashboard/requirements/pending) for items awaiting approval, or [Approved](/dashboard/requirements/approved) for approved ones.

**Q:** Can I edit a published requirement?
**A:** Published requirements cannot be directly edited. You may need to create a new version or contact your admin.

**Q:** How do vendors see my requirements?
**A:** Once published, requirements appear in the vendor's RFQ browse page where they can submit quotations.

**Q:** Where can I see quotations for a specific requirement?
**A:** Go to [Quotations for Requirement](/dashboard/quotations/requirement/:draftId) replacing `:draftId` with your requirement ID.
