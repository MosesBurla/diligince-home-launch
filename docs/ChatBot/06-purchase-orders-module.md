# Purchase Orders Module

## What is the Purchase Orders Module?

The Purchase Orders (PO) Module manages formal purchase agreements with vendors. After approving a quotation, you create a PO that defines the terms, deliverables, milestones, and payment schedule.

## Key Features

- **PO Creation**: Generate POs from approved quotations
- **Milestone Tracking**: Define and track payment milestones
- **Delivery Tracking**: Monitor delivery progress
- **Invoice Management**: Handle vendor invoices
- **Activity Log**: Complete audit trail
- **Export & Print**: Generate PDF documents

---

## PO Statuses

| Status | Description |
|--------|-------------|
| **Draft** | PO being prepared |
| **Pending** | Sent to vendor, awaiting acceptance |
| **Active** | Accepted, work in progress |
| **In Progress** | Deliverables being fulfilled |
| **Completed** | All milestones complete, closed |
| **Cancelled** | PO cancelled before completion |

---

## Purchase Orders Submodules

### 1. Active
Currently active purchase orders:
- Work in progress
- Milestones being tracked
- Payments pending

### 2. Pending
POs awaiting vendor acceptance:
- Sent but not confirmed
- Awaiting vendor response

### 3. In Progress
POs where work is underway:
- Deliverables being provided
- Milestones being completed

### 4. Completed
Finished purchase orders:
- All milestones complete
- All payments made
- Closed successfully

### 5. All
Complete list of all POs:
- All statuses
- Full history

---

## How to Create a Purchase Order

### Prerequisites
- You have an approved quotation
- You have PO creation permission

### Steps

#### Step 1: Start from Approved Quotation
1. Go to Quotations → Approved
2. Find the quotation
3. Click "Create PO" button

#### Step 2: Review PO Details
System pre-fills from quotation:
- Vendor information
- Line items and pricing
- Terms from quotation

Add/Edit:
- **PO Number**: Auto-generated or custom
- **PO Date**: Issue date
- **Delivery Date**: Expected completion
- **Delivery Address**: Where to deliver
- **Billing Address**: For invoicing

#### Step 3: Define Deliverables
List what the vendor will deliver:
- Description
- Quantity
- Specifications
- Acceptance criteria

#### Step 4: Set Payment Milestones
Define payment schedule:

| Milestone | Percentage | Description | Due Date |
|-----------|------------|-------------|----------|
| Advance | 30% | Upon PO acceptance | Immediate |
| Progress | 40% | On 50% completion | Date |
| Final | 30% | On completion & acceptance | Date |

**Tips:**
- Common splits: 30-40-30, 50-50, 100% on completion
- Link milestones to deliverables
- Set realistic due dates

#### Step 5: Add Terms & Conditions
- Payment terms (Net 30, Net 45, etc.)
- Warranty terms
- Penalty clauses (if any)
- Cancellation terms

#### Step 6: Review and Send
1. Review all details
2. Click "Send to Vendor" or "Save as Draft"
3. PO is sent to vendor for acceptance

---

## How to Track a Purchase Order

### Viewing PO Details
1. Go to Purchase Orders → Active (or relevant section)
2. Click on the PO
3. Details page shows:

### Overview Tab
- PO number and status
- Vendor information
- Total amount
- Progress percentage
- Timeline

### Milestones Tab
- List of payment milestones
- Status of each (Pending, In Progress, Completed)
- Due dates
- Proof of completion (if uploaded)

### Deliverables Tab
- List of items/services
- Delivery status
- Quantity delivered vs ordered
- Quality notes

### Invoices Tab
- Invoices submitted by vendor
- Invoice status (Pending, Approved, Paid)
- Payment dates

### Activity Tab
- Complete timeline
- All actions taken
- Who did what, when

---

## How to Manage Milestones

### Viewing Milestones
1. Open PO details
2. Go to Milestones tab
3. See all milestones with status

### Completing a Milestone
1. Find the milestone
2. Click "Mark Complete" (if you have permission)
3. Upload proof of completion (optional)
4. Add notes
5. Confirm

### Milestone Status Flow
```
Pending → In Progress → Completed
                      → Overdue (if past due date)
```

### Uploading Proof of Completion
1. Click "Upload Proof" on milestone
2. Select files (images, documents)
3. Add description
4. Submit
5. Proof attached to milestone

---

## How to Handle Invoices

### Viewing Invoices
1. Open PO details
2. Go to Invoices tab
3. See all invoices

### Invoice Status
- **Submitted**: Vendor submitted, awaiting review
- **Under Review**: Being verified
- **Approved**: Ready for payment
- **Paid**: Payment completed
- **Rejected**: Discrepancy found

### Approving an Invoice
1. Click on the invoice
2. Review details:
   - Invoice amount matches milestone
   - Deliverables verified
   - Documents attached
3. Click "Approve" or "Reject"
4. If rejecting, provide reason

### Marking Invoice as Paid
1. Open approved invoice
2. Click "Mark as Paid"
3. Enter payment details:
   - Payment date
   - Transaction reference
   - Payment method
4. Confirm
5. Invoice marked as Paid

---

## How to Track Delivery

### Delivery Overview
1. Open PO details
2. View delivery progress in Overview
3. Go to Delivery tab for details

### Delivery Timeline
Shows sequence of events:
- PO Accepted
- Work Started
- Partial Delivery (if any)
- Full Delivery
- Acceptance

### Uploading Proof of Delivery
1. Go to Delivery tab
2. Click "Upload Proof"
3. Add delivery documents:
   - Delivery challan
   - Goods receipt
   - Inspection reports
4. Submit

---

## How to Cancel a Purchase Order

### When to Cancel
- Vendor unable to fulfill
- Requirement changed
- Budget constraints

### Steps
1. Open PO details
2. Click "Cancel PO" button
3. Select cancellation reason
4. Enter details
5. Confirm

### Cancellation Impact
- Vendor is notified
- PO status changes to Cancelled
- Any advance payments may need recovery
- Linked quotation can be re-evaluated

---

## How to Export PO

### Export as PDF
1. Open PO details
2. Click "Export" → "PDF"
3. PDF downloads
4. Print or share as needed

### Export List to Excel
1. Go to PO listing
2. Apply filters
3. Click "Export"
4. Excel file downloads

---

## Common Questions

**Q: Can I edit a PO after sending?**
A: Only Draft POs can be edited. Once sent to vendor, you may need to cancel and create new, or issue an amendment.

**Q: What if vendor rejects the PO?**
A: PO goes back to Draft status. Review vendor's concerns, negotiate, and resend.

**Q: How do I know when a milestone is complete?**
A: Vendor marks milestones complete with proof. You receive notification to verify and approve.

**Q: Can I change payment milestones?**
A: Not after PO is accepted. Changes require formal amendment or new PO.

**Q: What's the difference between Deliverables and Milestones?**
A: Deliverables are what you receive (items/services). Milestones are payment trigger points (may or may not align with deliverables).

**Q: How do I handle partial delivery?**
A: Update delivery tracking with partial quantities. Payment can be proportional or wait for full delivery (depends on terms).

**Q: Can I reopen a completed PO?**
A: No, completed POs cannot be reopened. Create a new PO if additional work needed.

---

## Related Modules

- [Quotations Module](./05-quotations-module.md) - Source of POs
- [Project Workflows Module](./07-project-workflows-module.md) - Project tracking
- [Analytics Module](./09-analytics-module.md) - PO analytics
