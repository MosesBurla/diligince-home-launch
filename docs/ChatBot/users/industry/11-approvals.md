# Industry Approvals Module

## Overview
The Approvals module manages multi-level approval workflows for requirements, quotations, and purchase orders. Industry admins can configure approval matrices to define who needs to approve what, at which thresholds, and in what order.

## Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| Approvals | `/dashboard/industry-approvals` | Main approvals dashboard |
| Pending Approvals | `/dashboard/pending-approvals` | Items waiting for your approval |
| Approval Matrix | `/dashboard/approval-matrix` | Manage approval workflow configurations |
| Create Matrix | `/dashboard/approval-matrix/create` | Create a new approval matrix |
| View Matrix | `/dashboard/approval-matrix/:matrixId` | View an approval matrix configuration |
| Edit Matrix | `/dashboard/approval-matrix/:matrixId/edit` | Edit an existing approval matrix |

## Key Features
- **Pending Approvals** — View all items awaiting your approval action
- **Multi-Level Approvals** — Configure sequential or parallel approval chains
- **Approval Matrix** — Define approval rules based on amount thresholds, categories, and departments
- **AI-Powered Search** — Search across approval listings
- **Status Tracking** — Track approval progress through each level
- **Notifications** — Real-time notifications when items need your approval

## How To: Approve an Item
### Steps
1. Go to [Pending Approvals](/dashboard/pending-approvals)
2. Review the list of items waiting for your action
3. Click on an item to view its details
4. Review the information thoroughly
5. Click "Approve" to approve or "Reject" with comments to reject
6. The item moves to the next approval level or gets finalized

## How To: Create an Approval Matrix
### Steps
1. Navigate to [Approval Matrix](/dashboard/approval-matrix)
2. Click "Create New Matrix" to go to [Create Matrix](/dashboard/approval-matrix/create)
3. Define the matrix name and applicable module (Requirements, Quotations, POs)
4. Set approval levels with approvers
5. Define threshold amounts for each level
6. Configure notification settings
7. Save the matrix

## Page Details

### Pending Approvals
**Route:** `/dashboard/pending-approvals`
**Description:** All items across modules that require your approval action.
**Available Actions:**
- View item details
- Approve or reject items
- Add comments
- Filter by type (Requirement, Quotation, PO)

### Approval Matrix
**Route:** `/dashboard/approval-matrix`
**Description:** Configuration center for approval workflows.
**Available Actions:**
- View existing matrices
- Create new matrices
- Edit or delete matrices
- Set threshold rules

## Common Questions

**Q:** Where do I see items waiting for my approval?
**A:** Go to [Pending Approvals](/dashboard/pending-approvals) for all items needing your action.

**Q:** How do I set up approval workflows?
**A:** Go to [Approval Matrix](/dashboard/approval-matrix) to create and configure approval rules.

**Q:** Can I have multiple levels of approval?
**A:** Yes, create multi-level approval chains in the [Approval Matrix](/dashboard/approval-matrix/create).

**Q:** How do I get notified about pending approvals?
**A:** You receive real-time notifications. Configure notification preferences at [Notifications](/dashboard/industry-notifications).
