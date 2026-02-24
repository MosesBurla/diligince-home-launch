# Industry Quotations Module

## Overview
The Quotations module lets Industry users receive, review, compare, and approve vendor quotations submitted against published requirements. It supports side-by-side comparison, approval workflows, and AI-powered search.

## Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| All Quotations | `/dashboard/industry-quotes` | Overview of all received quotations |
| Pending Review | `/dashboard/quotations/pending` | Quotations awaiting review |
| Approved | `/dashboard/quotations/approved` | Quotations that have been approved |
| For Requirement | `/dashboard/quotations/requirement/:draftId` | Quotations linked to a specific requirement |
| Quotation Details | `/dashboard/quotations/:id` | Full detail view of a single quotation |

## Key Features
- **Quotation Comparison** — Compare multiple vendor quotes side by side
- **Approval Workflow** — Approve or reject quotations with comments
- **AI-Powered Search** — Search across quotation listings
- **Status Tracking** — Track quotation status (Pending, Under Review, Approved, Rejected)
- **Linked to Requirements** — Each quotation is tied to a published requirement
- **Export** — Export quotation data to XLSX/CSV

## How To: Review a Quotation
### Steps
1. Go to [Pending Quotations](/dashboard/quotations/pending)
2. Click on a quotation to open the detail view
3. Review pricing, terms, vendor details, and attached documents
4. Click "Approve" to approve or "Reject" to reject with comments
5. Approved quotations move to [Approved](/dashboard/quotations/approved)

## How To: Compare Quotations for a Requirement
### Steps
1. Go to [All Quotations](/dashboard/industry-quotes) or [Quotations for Requirement](/dashboard/quotations/requirement/:draftId)
2. Select multiple quotations using the checkboxes
3. Click "Compare" to open the comparison view
4. Review pricing, terms, delivery timelines, and vendor ratings side by side
5. Select the best quotation and approve it

## How To: Create a Purchase Order from an Approved Quotation
### Steps
1. Go to [Approved Quotations](/dashboard/quotations/approved)
2. Click on the approved quotation
3. Click "Create Purchase Order" to start the PO creation process
4. You'll be redirected to [Create PO](/dashboard/create-purchase-order)

## Page Details

### All Quotations
**Route:** `/dashboard/industry-quotes`
**Description:** Master list of all quotations received from vendors.
**Available Actions:**
- Search using AI Search Bar
- Filter by status, vendor, requirement
- Sort by price, date, vendor rating
- Export to XLSX/CSV

### Quotation Details
**Route:** `/dashboard/quotations/:id`
**Description:** Complete view of a single quotation with pricing breakdown, terms, and vendor info.
**Available Actions:**
- Approve or reject the quotation
- Download attached documents
- Send message to vendor
- Create PO from approved quotation

## Common Questions

**Q:** Where do I see all quotations from vendors?
**A:** Go to [All Quotations](/dashboard/industry-quotes) to see every quotation received.

**Q:** How do I compare vendor quotes?
**A:** On any quotation listing page, select multiple quotes and click "Compare" for a side-by-side view.

**Q:** How do I approve a quotation?
**A:** Open the quotation from [Pending Review](/dashboard/quotations/pending), review the details, and click "Approve."

**Q:** What happens after I approve a quotation?
**A:** Approved quotations can be used to [Create a Purchase Order](/dashboard/create-purchase-order).

**Q:** Can I see quotations for a specific requirement?
**A:** Yes, go to [Quotations for Requirement](/dashboard/quotations/requirement/:draftId) with the requirement ID.
