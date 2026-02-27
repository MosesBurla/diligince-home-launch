# Service Vendor Quotations Module

## Overview
The Quotations module helps Service Vendors manage all their submitted quotations, track statuses, and edit quotes when needed.

## Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| All Quotations | `/dashboard/vendor/quotations` | All your quotations across statuses |
| Quotation Details | `/dashboard/vendor/quotations/:quotationId` | Full view of a specific quotation |
| Edit Quotation | `/dashboard/vendor/quotations/:quotationId/edit` | Edit a quotation |

## Key Features
- **Status Tabs** — Filter by Draft, Submitted, Under Review, Accepted, Rejected
- **AI-Powered Search** — Search across all your quotations
- **Edit Capability** — Edit quotations before buyer review
- **Detailed View** — View full pricing breakdown, terms, and buyer feedback
- **Export** — Export quotation data

## Quotation Status Lifecycle

```
Draft → Submitted → Under Review → Accepted / Rejected
```

## How To: View Your Quotations
### Steps
1. Navigate to [All Quotations](/dashboard/vendor/quotations)
2. Use status tabs to filter (Draft, Submitted, Under Review, Accepted, Rejected)
3. Use the AI Search Bar to search by RFQ title or quotation ID
4. Click on any quotation to view [details](/dashboard/vendor/quotations/:quotationId)

## How To: Edit a Quotation
### Steps
1. Go to [All Quotations](/dashboard/vendor/quotations)
2. Find the quotation (must be in Draft or Submitted status)
3. Click "Edit" to go to [Edit Quotation](/dashboard/vendor/quotations/:quotationId/edit)
4. Update pricing, terms, or attached documents
5. Save changes or resubmit

## Common Questions

**Q:** Where can I see all my quotations?
**A:** Go to [All Quotations](/dashboard/vendor/quotations) to view them all.

**Q:** Can I edit a submitted quotation?
**A:** You can edit quotations that haven't been reviewed yet. Go to [All Quotations](/dashboard/vendor/quotations) and click "Edit."

**Q:** How do I know if my quotation was accepted?
**A:** Check the status tab on [All Quotations](/dashboard/vendor/quotations) — accepted quotations appear under the "Accepted" tab.

**Q:** What happens after my quotation is accepted?
**A:** The Industry buyer creates a Purchase Order, and a project is initiated. Track it at [Projects](/dashboard/service-vendor-projects).
