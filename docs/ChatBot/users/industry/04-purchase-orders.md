# Industry Purchase Orders Module

## Overview
The Purchase Orders (PO) module allows Industry users to create, manage, and track purchase orders generated from approved quotations. POs formalize the agreement between buyer and vendor, including deliverables, milestones, payment terms, and timelines.

## Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| All Orders | `/dashboard/industry-purchase-orders` | Overview of all purchase orders |
| Create PO | `/dashboard/create-purchase-order` | Create a new purchase order (from approved quotation) |
| Create/Edit PO | `/dashboard/purchase-orders/create` | Alternative PO creation route |
| Edit PO | `/dashboard/purchase-orders/:id/edit` | Edit an existing purchase order |
| Pending | `/dashboard/purchase-orders/pending` | POs awaiting vendor acceptance |
| In Progress | `/dashboard/purchase-orders/in-progress` | POs currently being fulfilled |
| Completed | `/dashboard/purchase-orders/completed` | Completed purchase orders |
| PO Details | `/dashboard/purchase-orders/:id` | Full detail view of a purchase order |

## Key Features
- **PO from Approved Quotation** — Create POs directly from approved vendor quotations
- **Milestone Tracking** — Define and track delivery milestones
- **Payment Terms** — Set payment schedules and terms
- **Deliverables Management** — Track deliverable items and their status
- **AI-Powered Search** — Search across all PO listing pages
- **Status Tracking** — Pending → In Progress → Completed
- **Export** — Export PO data to XLSX/CSV

## How To: Create a Purchase Order
### Steps
1. Go to [Approved Quotations](/dashboard/quotations/approved) and select an approved quotation
2. Click "Create Purchase Order" — you'll be taken to [Create PO](/dashboard/create-purchase-order)
3. Review pre-filled details from the quotation (vendor, pricing, scope)
4. Add project title, scope of work, and special instructions
5. Set start date, end date, and delivery milestones
6. Define payment terms and payment milestones
7. Add acceptance criteria
8. Upload supporting documents
9. Review and submit the PO

## How To: Track a Purchase Order
### Steps
1. Go to [In Progress POs](/dashboard/purchase-orders/in-progress)
2. Click on a PO to view its details
3. Check milestone completion status
4. Review deliverable progress
5. Communicate with the vendor via [Messages](/dashboard/industry-messages)

## Page Details

### All Orders
**Route:** `/dashboard/industry-purchase-orders`
**Description:** Master list of all purchase orders with status tabs and filters.
**Available Actions:**
- Search using AI Search Bar
- Filter by status, vendor, date range
- Sort by amount, date, status
- Export to XLSX/CSV
- Click any PO for details

### PO Details
**Route:** `/dashboard/purchase-orders/:id`
**Description:** Complete view of a purchase order including milestones, deliverables, payment schedule, and documents.
**Available Actions:**
- Track milestone progress
- View payment schedule
- Download documents
- Message vendor
- Mark milestones as complete

## Common Questions

**Q:** How do I create a purchase order?
**A:** First approve a quotation at [Approved Quotations](/dashboard/quotations/approved), then click "Create Purchase Order" to go to [Create PO](/dashboard/create-purchase-order).

**Q:** Where are my active purchase orders?
**A:** View them at [In Progress POs](/dashboard/purchase-orders/in-progress).

**Q:** How do I track delivery milestones?
**A:** Open any PO from [All Orders](/dashboard/industry-purchase-orders) and check the milestones section on the detail page.

**Q:** Where can I see completed orders?
**A:** Go to [Completed POs](/dashboard/purchase-orders/completed).

**Q:** Can I edit a purchase order after creation?
**A:** Yes, go to the PO detail page and click edit, or navigate to `/dashboard/purchase-orders/:id/edit`.
