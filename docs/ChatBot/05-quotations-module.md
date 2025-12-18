# Quotations Module

## What is the Quotations Module?

The Quotations Module manages vendor responses to your published requirements. Here you receive, evaluate, compare, and approve or reject quotations from vendors.

## Key Features

- **Quotation Inbox**: View all received quotations
- **Comparison Tool**: Side-by-side quote comparison
- **Approval Actions**: Approve, reject, or request clarification
- **Bulk Operations**: Handle multiple quotes at once
- **Export**: Download quotes for offline analysis
- **AI Analysis**: Intelligent quote evaluation (if enabled)

---

## Quotation Statuses

| Status | Description |
|--------|-------------|
| **Pending** | Received, awaiting review |
| **Under Review** | Being evaluated |
| **Approved** | Accepted, PO to be issued |
| **Rejected** | Declined |
| **Clarification Requested** | Need more info from vendor |
| **Expired** | Validity period ended |

---

## Quotations Submodules

### 1. Pending
Quotations awaiting your review:
- New submissions from vendors
- Requires evaluation
- High-priority items highlighted

### 2. Approved
Quotations you've approved:
- Ready for PO creation
- Vendor notified
- Contract terms finalized

### 3. All Quotations
Complete list of all quotations:
- All statuses
- Full filtering capability
- Search and sort

---

## How to View Quotations

### Navigating to Quotations
1. Click "Quotations" in the sidebar
2. Select submodule: Pending, Approved, or All
3. View the quotation list

### Quotation List View
Each quotation shows:
- **Vendor Name**: Who submitted
- **Requirement**: Which requirement it's for
- **Amount**: Quoted price
- **Validity**: Quote valid until date
- **Submitted Date**: When received
- **Status**: Current status

### Filtering Quotations
Filter by:
- Status (Pending, Approved, Rejected, etc.)
- Vendor
- Requirement
- Date range
- Amount range

### Sorting
Sort by:
- Newest first / Oldest first
- Amount (low to high / high to low)
- Vendor name
- Requirement name

---

## How to View Quotation Details

1. Click on any quotation in the list
2. Details page shows:

### Quotation Information
- Quotation ID
- Submitted date
- Validity period
- Total amount
- Payment terms

### Vendor Information
- Vendor name
- Contact details
- Company profile link
- Past performance rating

### Line Items
- Item/service description
- Quantity
- Unit price
- Amount
- Tax details

### Documents
- Technical proposal
- Commercial proposal
- Certifications
- Other attachments

### Activity Log
- Timeline of all actions
- Who did what and when

---

## How to Compare Quotations

### Starting Comparison
1. Go to Quotations → All (or Pending)
2. Select multiple quotations (checkbox)
3. Click "Compare Selected" button
4. Comparison view opens

### Comparison View
Side-by-side comparison showing:
- **Vendor details**: Name, rating, experience
- **Pricing**: Total amount, line-item breakdown
- **Delivery**: Proposed timeline
- **Terms**: Payment, warranty, support
- **Compliance**: How well they meet requirements

### Comparison Tips
- Compare quotes for the same requirement
- Maximum 4 quotes can be compared at once
- Export comparison as PDF

---

## How to Approve a Quotation

### Prerequisites
- You have approval permission
- Quotation is in Pending/Under Review status

### Steps
1. Open the quotation details
2. Review all information thoroughly
3. Click "Approve" button
4. Add approval comments (optional but recommended)
5. Confirm the approval
6. Quotation status changes to "Approved"

### What Happens Next
- Vendor is notified of approval
- Quotation appears in "Approved" section
- You can now create a Purchase Order

---

## How to Reject a Quotation

### Steps
1. Open the quotation details
2. Click "Reject" button
3. Select rejection reason:
   - Price too high
   - Technical requirements not met
   - Delivery timeline not acceptable
   - Better alternative received
   - Other (specify)
4. Add rejection comments (required)
5. Confirm rejection
6. Vendor is notified

### Rejection Best Practices
- Always provide clear reasons
- Be professional in comments
- Vendors may submit revised quotes

---

## How to Request Clarification

When you need more information from the vendor:

### Steps
1. Open the quotation details
2. Click "Request Clarification" button
3. Enter your questions/concerns:
   - Be specific about what you need
   - Mention which items need clarification
4. Click "Send"
5. Vendor receives notification

### What Happens
- Status changes to "Clarification Requested"
- Vendor responds in the activity thread
- You're notified when they respond
- Review response and proceed with approval/rejection

---

## How to Use Bulk Operations

For handling multiple quotations at once:

### Bulk Approve
1. Select multiple quotations (checkboxes)
2. Click "Bulk Actions" dropdown
3. Select "Approve Selected"
4. Confirm the action
5. All selected quotations are approved

### Bulk Reject
1. Select multiple quotations
2. Click "Bulk Actions" → "Reject Selected"
3. Enter common rejection reason
4. Confirm
5. All selected are rejected

---

## How to Export Quotations

### Export Options
- **Excel (XLSX)**: Full data with formatting
- **CSV**: Simple comma-separated values

### Steps
1. Go to Quotations list
2. Apply filters if needed
3. Click "Export" button
4. Select format (XLSX or CSV)
5. File downloads

### Export Contents
- Quotation details
- Vendor information
- Pricing data
- Status history
- (Optional) AI analysis results

---

## Quotation Comparison AI Analysis

If AI features are enabled:

### What AI Analyzes
- Price competitiveness
- Compliance with requirements
- Vendor reliability score
- Risk assessment
- Recommendation

### How to Use
1. Select quotations for comparison
2. Click "AI Analysis" button
3. Wait for analysis to complete
4. Review AI recommendations
5. Use as input for your decision

**Note:** AI analysis is advisory. Final decision is always yours.

---

## Common Questions

**Q: Can I edit a quotation?**
A: No, quotations are submitted by vendors. You can only approve, reject, or request clarification.

**Q: What if a vendor wants to revise their quote?**
A: They need to submit a new quotation. You can reject the old one and evaluate the new submission.

**Q: How do I know which quote is the best?**
A: Use the comparison tool to evaluate side-by-side. Consider price, compliance, vendor reliability, and delivery terms.

**Q: Can I approve multiple vendors for the same requirement?**
A: Yes, you can approve multiple quotes. Then decide which one to issue a PO for.

**Q: What happens after I approve a quotation?**
A: The next step is to create a Purchase Order based on the approved quotation.

**Q: How long are quotations valid?**
A: Vendors specify validity when submitting. Check the "Valid Until" date. Expired quotes cannot be approved.

**Q: Can I reopen a rejected quotation?**
A: No, once rejected, the action is final. Ask the vendor to submit a new quotation if needed.

---

## Related Modules

- [Requirements Module](./04-requirements-module.md) - Source of quotations
- [Purchase Orders Module](./06-purchase-orders-module.md) - Next step after approval
- [Analytics Module](./09-analytics-module.md) - Quotation analytics
