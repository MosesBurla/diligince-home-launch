# Service Vendor RFQs Module

## Overview
The RFQs (Request for Quotation) module allows Service Vendors to browse available requirements published by Industry buyers, save interesting ones, and apply by submitting quotations.

## Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| Browse RFQs | `/dashboard/service-vendor-rfqs` | Browse all available RFQs |
| Saved RFQs | `/dashboard/rfqs/saved` | RFQs you've bookmarked |
| Applied RFQs | `/dashboard/rfqs/applied` | RFQs you've submitted quotations for |
| RFQ Detail | `/dashboard/rfqs/:rfqId` | Full details of a specific RFQ |
| Submit Quotation | `/dashboard/rfqs/:rfqId/submit-quotation` | Submit a quotation for an RFQ |

## Key Features
- **Browse & Discover** — Browse RFQs matching your services and expertise
- **AI-Powered Search** — Search RFQs by keyword, category, or location
- **Save/Bookmark** — Save interesting RFQs for later review
- **Apply with Quotation** — Submit detailed quotations with pricing and terms
- **Status Tracking** — Track which RFQs you've applied to and their status
- **Filters** — Filter by category, budget range, deadline, location

## How To: Browse Available RFQs
### Steps
1. Navigate to [Browse RFQs](/dashboard/service-vendor-rfqs)
2. Use the AI Search Bar to search by keyword or category
3. Apply filters to narrow results
4. Click on any RFQ to view its full details at [RFQ Detail](/dashboard/rfqs/:rfqId)

## How To: Save an RFQ for Later
### Steps
1. Browse RFQs at [Browse RFQs](/dashboard/service-vendor-rfqs)
2. Click the bookmark/save icon on any RFQ card
3. View saved RFQs at [Saved RFQs](/dashboard/rfqs/saved)

## How To: Submit a Quotation
### Steps
1. Open an RFQ from [Browse RFQs](/dashboard/service-vendor-rfqs) or [Saved RFQs](/dashboard/rfqs/saved)
2. Review the requirement details thoroughly
3. Click "Submit Quotation" to go to [Submit Quotation](/dashboard/rfqs/:rfqId/submit-quotation)
4. Enter your pricing, delivery timeline, and terms
5. Attach supporting documents if needed
6. Review and submit your quotation
7. Track it at [Applied RFQs](/dashboard/rfqs/applied) and [Quotations](/dashboard/vendor/quotations)

## Page Details

### Browse RFQs
**Route:** `/dashboard/service-vendor-rfqs`
**Description:** Card-based view of all available RFQs from Industry buyers.
**Available Actions:**
- Search using AI Search Bar
- Filter by category, budget, deadline
- Save/bookmark RFQs
- Click to view details
- Apply with quotation

### Saved RFQs
**Route:** `/dashboard/rfqs/saved`
**Description:** Your bookmarked RFQs for quick access.
**Available Actions:**
- Search using AI Search Bar
- Remove from saved
- View details
- Submit quotation

### Applied RFQs
**Route:** `/dashboard/rfqs/applied`
**Description:** RFQs you've already submitted quotations for, with status tracking.
**Available Actions:**
- Search using AI Search Bar
- View quotation status
- View RFQ details

## Common Questions

**Q:** Where do I find new RFQs?
**A:** Browse all available RFQs at [Browse RFQs](/dashboard/service-vendor-rfqs).

**Q:** How do I apply to an RFQ?
**A:** Open the RFQ detail page and click "Submit Quotation" to go to the [submission form](/dashboard/rfqs/:rfqId/submit-quotation).

**Q:** Where are my saved RFQs?
**A:** Find them at [Saved RFQs](/dashboard/rfqs/saved).

**Q:** How do I track RFQs I've applied to?
**A:** Go to [Applied RFQs](/dashboard/rfqs/applied) to see status updates.

**Q:** Can I edit a submitted quotation?
**A:** Check [Your Quotations](/dashboard/vendor/quotations) — you may be able to edit before the buyer reviews it.
