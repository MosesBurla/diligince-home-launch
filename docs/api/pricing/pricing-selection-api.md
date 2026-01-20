# Pricing Selection API Specification

## Overview

API endpoint for storing user's pricing page selections when they complete registration. This data helps the sales/support team follow up on subscription interest and assist users in completing their purchase.

**Base URL:** `/api/v1`

---

## Business Rules

1. **User Type Matching**: Only store the selection if the user completes signup with a matching user type:
   - `industry` pricing → `industry` signup form
   - `service_vendor` pricing → `vendor` signup with Service Vendor category
   - `product_vendor` pricing → `vendor` signup with Product Vendor category
   - `logistics` pricing → `vendor` signup with Logistics category
   - `professional` pricing → `professional` signup form

2. **Timing**: Selection is stored immediately after successful user registration

3. **Source Tracking**: All selections from pricing page are marked with `source: 'pricing_page'`

4. **Expiration**: Selections should be followed up within 7 days or marked as expired

---

## Endpoints

### POST /pricing-selections

Store pricing selection for a newly registered user.

#### Request

```http
POST /api/v1/pricing-selections
Authorization: Bearer <user_token>
Content-Type: application/json
```

#### Request Body

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "userType": "industry",
  "selectedPlanCode": "INDUSTRY_GROWTH",
  "selectedAddOnCodes": ["DILIGIENCE_HUB", "AI_RECOMMENDATION_PACK"],
  "pricing": {
    "planMonthlyMin": 12000,
    "planMonthlyMax": 20000,
    "addOnsMonthlyAmount": 999,
    "addOnsOneTimeAmount": 499,
    "gstRate": 18,
    "estimatedFirstMonthMin": 15928,
    "estimatedFirstMonthMax": 25368,
    "estimatedRecurringMin": 15339,
    "estimatedRecurringMax": 24779
  },
  "source": "pricing_page",
  "capturedAt": "2024-01-15T10:30:00Z"
}
```

#### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | UUID | Yes | User ID from successful registration |
| `userType` | string | Yes | User type from pricing page selection |
| `selectedPlanCode` | string | Yes | Code of the selected plan |
| `selectedAddOnCodes` | string[] | No | Codes of selected add-ons |
| `pricing` | object | Yes | Calculated pricing breakdown |
| `pricing.planMonthlyMin` | number | Yes | Minimum monthly plan cost |
| `pricing.planMonthlyMax` | number | Yes | Maximum monthly plan cost |
| `pricing.addOnsMonthlyAmount` | number | Yes | Total monthly add-ons cost |
| `pricing.addOnsOneTimeAmount` | number | Yes | Total one-time add-ons cost |
| `pricing.gstRate` | number | Yes | GST rate percentage (e.g., 18) |
| `pricing.estimatedFirstMonthMin` | number | Yes | Minimum first month total (with GST) |
| `pricing.estimatedFirstMonthMax` | number | Yes | Maximum first month total (with GST) |
| `pricing.estimatedRecurringMin` | number | Yes | Minimum recurring monthly (with GST) |
| `pricing.estimatedRecurringMax` | number | Yes | Maximum recurring monthly (with GST) |
| `source` | string | Yes | Always "pricing_page" for this flow |
| `capturedAt` | ISO8601 | Yes | Timestamp when selection was captured |

#### Success Response

```json
{
  "success": true,
  "data": {
    "id": "ps_550e8400-e29b-41d4-a716-446655440001",
    "message": "Pricing selection stored successfully"
  }
}
```

#### Error Responses

**User Type Mismatch (400)**
```json
{
  "success": false,
  "error": {
    "code": "USER_TYPE_MISMATCH",
    "message": "Pricing selection user type does not match signup user type",
    "details": {
      "pricingUserType": "industry",
      "signupUserType": "vendor"
    }
  }
}
```

**User Not Found (404)**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with specified ID does not exist"
  }
}
```

**Duplicate Selection (409)**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_SELECTION",
    "message": "A pricing selection already exists for this user"
  }
}
```

---

### GET /pricing-selections/:userId

Get pricing selection for a specific user (admin/support use).

#### Request

```http
GET /api/v1/pricing-selections/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <admin_token>
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "ps_550e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "userType": "industry",
    "selectedPlanCode": "INDUSTRY_GROWTH",
    "selectedAddOnCodes": ["DILIGIENCE_HUB", "AI_RECOMMENDATION_PACK"],
    "pricing": {...},
    "source": "pricing_page",
    "capturedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:31:00Z",
    "status": "pending",
    "user": {
      "email": "user@example.com",
      "name": "John Doe",
      "company": "Acme Industries"
    }
  }
}
```

---

### GET /pricing-selections (Admin List)

List all pricing selections for admin dashboard.

#### Request

```http
GET /api/v1/pricing-selections?status=pending&page=1&limit=20
Authorization: Bearer <admin_token>
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: pending, contacted, converted, expired |
| `userType` | string | Filter by user type |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |
| `sortBy` | string | Sort field: createdAt, capturedAt |
| `sortOrder` | string | asc or desc (default: desc) |

#### Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalItems": 45,
      "totalPages": 3
    }
  }
}
```

---

### PATCH /pricing-selections/:id/status

Update the status of a pricing selection (admin use).

#### Request

```http
PATCH /api/v1/pricing-selections/ps_550e8400/status
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "status": "contacted",
  "notes": "Called user on 2024-01-16, scheduling demo"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "ps_550e8400",
    "status": "contacted",
    "updatedAt": "2024-01-16T14:30:00Z"
  }
}
```

---

## Database Schema

```sql
CREATE TABLE pricing_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type VARCHAR(50) NOT NULL,
  selected_plan_code VARCHAR(100) NOT NULL,
  selected_addon_codes TEXT[] DEFAULT '{}',
  
  -- Pricing breakdown
  plan_monthly_min DECIMAL(10,2) NOT NULL,
  plan_monthly_max DECIMAL(10,2) NOT NULL,
  addons_monthly_amount DECIMAL(10,2) DEFAULT 0,
  addons_onetime_amount DECIMAL(10,2) DEFAULT 0,
  gst_rate DECIMAL(5,2) DEFAULT 18.00,
  estimated_first_month_min DECIMAL(10,2) NOT NULL,
  estimated_first_month_max DECIMAL(10,2) NOT NULL,
  estimated_recurring_min DECIMAL(10,2) NOT NULL,
  estimated_recurring_max DECIMAL(10,2) NOT NULL,
  
  -- Metadata
  source VARCHAR(50) DEFAULT 'pricing_page',
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  contacted_by UUID REFERENCES auth.users(id),
  contacted_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'contacted', 'converted', 'expired')),
  CONSTRAINT valid_user_type CHECK (user_type IN ('industry', 'service_vendor', 'product_vendor', 'logistics', 'professional'))
);

-- Indexes
CREATE INDEX idx_pricing_selections_user_id ON pricing_selections(user_id);
CREATE INDEX idx_pricing_selections_status ON pricing_selections(status);
CREATE INDEX idx_pricing_selections_created_at ON pricing_selections(created_at DESC);
CREATE UNIQUE INDEX idx_pricing_selections_user_unique ON pricing_selections(user_id) WHERE status = 'pending';

-- RLS Policies
ALTER TABLE pricing_selections ENABLE ROW LEVEL SECURITY;

-- Users can read their own selections
CREATE POLICY "Users can read own selections" ON pricing_selections
  FOR SELECT USING (auth.uid() = user_id);

-- Only service can insert (via API)
CREATE POLICY "Service can insert" ON pricing_selections
  FOR INSERT WITH CHECK (true);

-- Admins can do everything
CREATE POLICY "Admins full access" ON pricing_selections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'support')
    )
  );
```

---

## Status Workflow

```
┌─────────┐     Contact      ┌───────────┐     Convert     ┌───────────┐
│ pending │ ───────────────> │ contacted │ ──────────────> │ converted │
└─────────┘                  └───────────┘                 └───────────┘
     │                            │
     │ 7 days                     │ 14 days
     ▼                            ▼
┌─────────┐                  ┌─────────┐
│ expired │                  │ expired │
└─────────┘                  └─────────┘
```

---

## Integration Notes

### Frontend Integration

1. After successful signup, check if there's a pricing selection in context
2. Validate user type match
3. If matching, call the API to store selection
4. Clear the pricing selection from context after storing

### Example Frontend Code

```typescript
// After successful signup
const storePricingSelection = async (userId: string) => {
  const { selection, clearSelection } = usePricingSelection();
  
  if (!selection?.selectedPlan) return;
  
  // Validate match
  if (!validateUserTypeMatch(selection.userType, signupTab, vendorCategory)) {
    clearSelection();
    return;
  }
  
  // Store selection
  const result = await pricingSelectionService.storePricingSelection(
    createPricingSelectionPayload(
      userId,
      selection.userType,
      selection.selectedPlan,
      selection.selectedAddOns
    )
  );
  
  if (result.success) {
    clearSelection();
  }
};
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `USER_TYPE_MISMATCH` | 400 | Pricing and signup user types don't match |
| `INVALID_PLAN_CODE` | 400 | Plan code doesn't exist |
| `USER_NOT_FOUND` | 404 | User ID doesn't exist |
| `DUPLICATE_SELECTION` | 409 | User already has a pending selection |
| `UNAUTHORIZED` | 401 | Invalid or missing auth token |
| `FORBIDDEN` | 403 | Not authorized for this operation |
| `INTERNAL_ERROR` | 500 | Server error |
