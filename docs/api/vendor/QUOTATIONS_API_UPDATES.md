# Vendor Quotations API Updates

This document outlines the backend API changes required to support the enhanced My Quotations module features.

---

## 1. Add Search Parameter to List Quotations

### Endpoint
`GET /api/v1/vendor/quotations`

### New Query Parameter

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| search    | string | No       | Search text to filter quotations by quotation number, RFQ title, or company name |

### Example Request
```
GET /api/v1/vendor/quotations?search=QUO-2026&status=submitted&page=1&limit=10
```

### Backend Implementation

```javascript
// MongoDB query with search
const buildSearchQuery = (vendorId, filters) => {
  const query = {
    stakeholderId: vendorId,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.search) {
    query.$or = [
      { quotationNumber: { $regex: filters.search, $options: 'i' } },
      { 'rfq.title': { $regex: filters.search, $options: 'i' } },
      { 'company.name': { $regex: filters.search, $options: 'i' } }
    ];
  }

  return query;
};
```

### Response
No changes to response structure - only filtering behavior changes.

---

## 2. Prevent Duplicate Quotation Submission

### Endpoint
`POST /api/v1/vendor/quotations`

### New Validation Rule
Before creating a new quotation, check if the vendor already has a quotation with status `submitted`, `under_review`, or `accepted` for the same RFQ.

### Error Response (409 Conflict)

```json
{
  "success": false,
  "error": "DUPLICATE_QUOTATION",
  "message": "You have already submitted a quotation for this RFQ",
  "existingQuotationId": "quo_abc123"
}
```

### Backend Implementation

```javascript
// Check for existing submitted/accepted quotation
const checkDuplicateQuotation = async (rfqId, vendorId) => {
  const existing = await Quotation.findOne({
    rfqId,
    stakeholderId: vendorId,
    status: { $in: ['submitted', 'under_review', 'accepted'] }
  });

  if (existing) {
    const error = new Error('You have already submitted a quotation for this RFQ');
    error.code = 'DUPLICATE_QUOTATION';
    error.statusCode = 409;
    error.existingQuotationId = existing._id;
    throw error;
  }
};

// In the create quotation handler
router.post('/quotations', async (req, res) => {
  const { rfqId } = req.body;
  const vendorId = req.user.stakeholderId;

  // Check for duplicate before creating
  await checkDuplicateQuotation(rfqId, vendorId);

  // Proceed with quotation creation
  // ...
});
```

---

## 3. Validate Edit Draft Only

### Endpoint
`PUT /api/v1/vendor/quotations/:id`

### Validation Rule
Only allow updates when the quotation status is `draft`. Return 403 Forbidden for any other status.

### Error Response (403 Forbidden)

```json
{
  "success": false,
  "error": "QUOTATION_NOT_EDITABLE",
  "message": "Only draft quotations can be edited"
}
```

### Backend Implementation

```javascript
// In the update quotation handler
router.put('/quotations/:id', async (req, res) => {
  const { id } = req.params;
  const vendorId = req.user.stakeholderId;

  // Fetch existing quotation
  const quotation = await Quotation.findOne({
    _id: id,
    stakeholderId: vendorId
  });

  if (!quotation) {
    return res.status(404).json({
      success: false,
      error: 'QUOTATION_NOT_FOUND',
      message: 'Quotation not found'
    });
  }

  // Check if quotation is editable
  if (quotation.status !== 'draft') {
    return res.status(403).json({
      success: false,
      error: 'QUOTATION_NOT_EDITABLE',
      message: 'Only draft quotations can be edited'
    });
  }

  // Proceed with update
  // ...
});
```

---

## 4. Enhanced Get Quotation Details Response

### Endpoint
`GET /api/v1/vendor/quotations/:id`

### Response Fields Required

Ensure the following fields are included in the quotation detail response:

```typescript
interface QuotationDetailResponse {
  success: boolean;
  data: {
    id: string;
    quotationNumber: string;
    rfqId: string;
    requirementTitle: string;
    vendorName: string;
    status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';
    
    // Financial
    quotedAmount: number;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    currency: string;
    paymentTerms: string;
    lineItems: Array<{
      description: string;
      quantity: number;
      unit: string;
      unitPrice: number;
      amount: number;
    }>;
    
    // Timeline
    proposedStartDate: string;
    proposedCompletionDate: string;
    milestones: Array<{
      name: string;
      deliverables: string;
      dueDate: string;
      amount: number;
    }>;
    
    // Technical
    methodology: string;
    technicalSpecifications: string;
    qualityAssurance: string;
    complianceCertifications: string[];
    
    // Terms
    warrantyPeriod: string;
    supportTerms: string;
    cancellationPolicy: string;
    specialConditions: string;
    
    // Documents
    documents: Array<{
      id: string;
      name: string;
      type: string;
      size: string;
      url: string;
    }>;
    
    // Activity Log
    activityLog: Array<{
      action: string;
      user: string;
      timestamp: string;
      details?: string;
    }>;
    
    // Dates
    validUntil: string;
    submittedDate: string;
    createdAt: string;
    updatedAt: string;
    
    // Rejection info (if applicable)
    rejectionReason?: string;
  };
}
```

---

## 5. Withdraw Quotation

### Endpoint
`POST /api/v1/vendor/quotations/:id/withdraw`

### Validation Rules
- Only quotations with status `submitted` or `under_review` can be withdrawn
- Update status to `withdrawn`
- Add activity log entry

### Request Body
```json
{
  "reason": "Vendor requested withdrawal"
}
```

### Success Response
```json
{
  "success": true,
  "message": "Quotation withdrawn successfully"
}
```

### Error Response (403 Forbidden)
```json
{
  "success": false,
  "error": "QUOTATION_NOT_WITHDRAWABLE",
  "message": "Only submitted or under review quotations can be withdrawn"
}
```

---

## Summary of Changes

| Endpoint | Change Type | Description |
|----------|-------------|-------------|
| `GET /api/v1/vendor/quotations` | Enhancement | Add `search` query parameter |
| `POST /api/v1/vendor/quotations` | Validation | Prevent duplicate quotations for same RFQ |
| `PUT /api/v1/vendor/quotations/:id` | Validation | Only allow editing draft quotations |
| `GET /api/v1/vendor/quotations/:id` | Enhancement | Include all detail fields |
| `POST /api/v1/vendor/quotations/:id/withdraw` | Validation | Only allow withdrawing submitted/under_review |

---

## Notes for Backend Team

1. **Search Performance**: Consider adding indexes on `quotationNumber`, `rfq.title`, and `company.name` fields for optimal search performance.

2. **Activity Logging**: Ensure all status changes are logged in the `activityLog` array with the action, user, timestamp, and relevant details.

3. **Email Notifications**: Consider sending email notifications when:
   - Quotation is withdrawn
   - Quotation status changes to accepted/rejected

4. **Audit Trail**: All edit operations on draft quotations should be tracked for compliance purposes.
