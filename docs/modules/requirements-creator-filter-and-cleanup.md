# Requirements Module: Creator Filter, Send for Approval & Mock Data Cleanup

> **Document Version:** 1.0  
> **Last Updated:** 2025-12-13  
> **Status:** Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Part 1: Creator Filter Feature](#part-1-creator-filter-feature)
3. [Part 2: Send for Approval Enhancement](#part-2-send-for-approval-enhancement)
4. [Part 3: Mock Data Cleanup Checklist](#part-3-mock-data-cleanup-checklist)
5. [Part 4: API Endpoint Specifications](#part-4-api-endpoint-specifications)
6. [Part 5: Flow Diagrams](#part-5-flow-diagrams)
7. [Part 6: Implementation Checklist](#part-6-implementation-checklist)

---

## Overview

### Purpose

This document specifies three interconnected enhancements to the Requirements Module:

1. **Creator Filter**: Add a filter dropdown to all requirement list pages allowing users to filter by who created the requirement
2. **Send for Approval Enhancement**: Make `submissionDeadline` and `evaluationCriteria` mandatory fields when sending for approval
3. **Mock Data Cleanup**: Remove all mock/hardcoded data from frontend and backend, ensuring real API integration

### Current State Summary

| Feature | Current State | Target State |
|---------|---------------|--------------|
| Creator Filter - Drafts | ✅ Has filter (uses team members list) | Use API-provided creators list |
| Creator Filter - Pending | ✅ Has filter | Keep, verify API integration |
| Creator Filter - Approved | ❌ No filter | Add filter |
| Creator Filter - Published | ❌ No filter | Add filter |
| Creator Filter - Archived | ❌ No filter | Add filter |
| Send for Approval - Deadline | Optional | **Required** |
| Send for Approval - Criteria | Optional | **Required** |
| Mock Data | Present in multiple files | Remove all |

---

## Part 1: Creator Filter Feature

### 1.1 Feature Description

Allow users to filter requirements by creator across all list pages:
- **Default**: All requirements for the company (based on logged-in user's companyId)
- **Filter Options**:
  - "All" - Shows all requirements for the company
  - "Me" - Shows only current user's requirements
  - Individual users - Shows specific user's requirements

### 1.2 Backend Requirements

#### 1.2.1 Database Schema

Each requirement document MUST have a `createdBy` object:

```javascript
{
  "_id": ObjectId("..."),
  "title": "Requirement Title",
  "companyId": ObjectId("company-id"),
  "createdBy": {
    "id": "user-id-string",      // Required
    "name": "John Doe",           // Required - Full name
    "email": "john@company.com"   // Required
  },
  "status": "draft",
  // ... other fields
}
```

#### 1.2.2 Creator Aggregation Pipeline

Backend MUST aggregate unique creators for each list response:

```javascript
// MongoDB Aggregation Pipeline Example
const getUniqueCreators = async (companyId, status) => {
  return await Requirements.aggregate([
    // Step 1: Match by company and status
    { 
      $match: { 
        companyId: ObjectId(companyId),
        status: status // 'draft', 'pending', 'approved', 'published', 'archived'
      } 
    },
    
    // Step 2: Group by creator
    { 
      $group: {
        _id: "$createdBy.id",
        name: { $first: "$createdBy.name" },
        email: { $first: "$createdBy.email" },
        count: { $sum: 1 }
      }
    },
    
    // Step 3: Project final structure
    { 
      $project: {
        id: "$_id",
        name: 1,
        email: 1,
        count: 1,
        _id: 0
      }
    },
    
    // Step 4: Sort by name
    { $sort: { name: 1 } }
  ]);
};
```

#### 1.2.3 Enhanced List Response Structure

All list endpoints MUST return creators in the `filters` object:

```json
{
  "success": true,
  "data": {
    "requirements": [
      {
        "id": "req-001",
        "title": "Office Supplies",
        "category": "products",
        "priority": "high",
        "estimatedValue": 50000,
        "status": "draft",
        "createdDate": "2025-12-10T10:00:00Z",
        "createdBy": {
          "id": "user-123",
          "name": "John Doe",
          "email": "john@company.com"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 45,
      "totalPages": 5
    },
    "filters": {
      "applied": {
        "status": "draft",
        "createdById": null
      },
      "available": {
        "categories": [
          { "key": "products", "value": "Products", "count": 20 },
          { "key": "services", "value": "Services", "count": 15 }
        ],
        "priorities": [
          { "key": "critical", "value": "Critical", "color": "red", "count": 5 },
          { "key": "high", "value": "High", "color": "orange", "count": 15 }
        ]
      },
      "creators": [
        { "id": "user-123", "name": "John Doe", "email": "john@company.com", "count": 15 },
        { "id": "user-456", "name": "Jane Smith", "email": "jane@company.com", "count": 8 },
        { "id": "user-789", "name": "Bob Wilson", "email": "bob@company.com", "count": 22 }
      ]
    },
    "statistics": {
      "total": 45,
      "byPriority": {
        "critical": 5,
        "high": 15,
        "medium": 20,
        "low": 5
      }
    }
  }
}
```

#### 1.2.4 Query Parameter Support

All list endpoints MUST support `createdById` query parameter:

```
GET /api/v1/industry/requirements/drafts?createdById=user-123&page=1&limit=10
GET /api/v1/industry/requirements/pending?createdById=user-456
GET /api/v1/industry/requirements/approved?createdById=user-789
GET /api/v1/industry/requirements/published?createdById=user-123
GET /api/v1/industry/requirements/archived?createdById=user-456
```

**Backend Filter Logic:**
```javascript
const buildQuery = (companyId, status, createdById) => {
  const query = {
    companyId: ObjectId(companyId),
    status: status
  };
  
  // Add creator filter if specified
  if (createdById && createdById !== 'all') {
    query['createdBy.id'] = createdById;
  }
  
  return query;
};
```

### 1.3 Frontend Requirements

#### 1.3.1 Reusable CreatorFilterDropdown Component

Create a new reusable component at `src/components/shared/CreatorFilterDropdown.tsx`:

```tsx
interface Creator {
  id: string;
  name: string;
  email: string;
  count: number;
}

interface CreatorFilterDropdownProps {
  creators: Creator[];
  selectedCreatorId: string | null;
  currentUserId: string;
  onSelect: (creatorId: string | null) => void;
  isLoading?: boolean;
}

// Options to display:
// 1. "All" (value: null) - Default
// 2. "Me" (value: currentUserId) - Current user's requirements
// 3. Individual creators from API response
```

#### 1.3.2 Pages to Update

| Page | File Path | Current State | Changes Needed |
|------|-----------|---------------|----------------|
| Drafts | `src/pages/RequirementsDrafts.tsx` | Has filter using team members | Replace with API creators, use CreatorFilterDropdown |
| Pending | `src/pages/RequirementsPending.tsx` | Has creator filter | Verify uses API creators, standardize component |
| Approved | `src/pages/RequirementsApproved.tsx` | **No filter** | Add CreatorFilterDropdown |
| Published | `src/pages/RequirementsPublished.tsx` | **No filter** | Add CreatorFilterDropdown |
| Archived | `src/pages/RequirementsArchived.tsx` | **No filter** | Add CreatorFilterDropdown (when page exists) |

#### 1.3.3 Frontend Implementation Pattern

```tsx
// Example: RequirementsApproved.tsx update
const RequirementsApproved = () => {
  const { user } = useUser();
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  
  // Fetch approved requirements with creator filter
  const fetchApproved = async () => {
    const params = {
      page: pagination.currentPage,
      limit: pagination.pageSize,
      sortBy: sortConfig.key,
      sortOrder: sortConfig.direction,
      search: searchTerm,
      createdById: selectedCreatorId, // Pass to API
    };
    
    const response = await requirementListService.getApproved(params);
    
    // Extract creators from response
    if (response?.data?.filters?.creators) {
      setCreators(response.data.filters.creators);
    }
    
    // Set requirements data
    setData(response?.data?.requirements || []);
  };
  
  // Re-fetch when creator filter changes
  useEffect(() => {
    fetchApproved();
  }, [selectedCreatorId, pagination, sortConfig, searchTerm]);
  
  return (
    <div>
      {/* Creator Filter Dropdown */}
      <CreatorFilterDropdown
        creators={creators}
        selectedCreatorId={selectedCreatorId}
        currentUserId={user?.id}
        onSelect={(id) => {
          setSelectedCreatorId(id);
          setPagination(prev => ({ ...prev, currentPage: 1 }));
        }}
      />
      
      {/* Rest of the page */}
    </div>
  );
};
```

---

## Part 2: Send for Approval Enhancement

### 2.1 Current State

The current `useSendForApproval` hook sends:

```typescript
interface SendForApprovalPayload {
  draftId: string;
  selectedApprovalMatrixId: string;
  submissionDeadline?: Date;        // Currently optional
  evaluationCriteria?: string[];    // Currently optional
}
```

### 2.2 Required Changes

Both `submissionDeadline` and `evaluationCriteria` MUST become **required fields**.

#### 2.2.1 Updated Interface

```typescript
interface SendForApprovalPayload {
  draftId: string;
  selectedApprovalMatrixId: string;   // Required
  submissionDeadline: Date;            // NOW REQUIRED
  evaluationCriteria: string[];        // NOW REQUIRED
  visibility?: 'all' | 'invited';      // Optional, default 'all'
  notifyByEmail?: boolean;             // Optional, default true
  notifyByApp?: boolean;               // Optional, default true
  termsAccepted: boolean;              // Required
}
```

#### 2.2.2 Backend Validation (Joi Schema)

```javascript
const sendForApprovalSchema = Joi.object({
  selectedApprovalMatrixId: Joi.string().required()
    .messages({ 'any.required': 'Approval matrix is required' }),
  
  submissionDeadline: Joi.date().iso().greater('now').required()
    .messages({ 
      'any.required': 'Submission deadline is required',
      'date.greater': 'Submission deadline must be in the future'
    }),
  
  evaluationCriteria: Joi.array().items(Joi.string()).min(1).required()
    .messages({ 
      'any.required': 'At least one evaluation criterion is required',
      'array.min': 'At least one evaluation criterion is required'
    }),
  
  visibility: Joi.string().valid('all', 'invited').default('all'),
  notifyByEmail: Joi.boolean().default(true),
  notifyByApp: Joi.boolean().default(true),
  termsAccepted: Joi.boolean().valid(true).required()
    .messages({ 'any.only': 'You must accept the terms to proceed' })
});
```

#### 2.2.3 Backend Actions on Send for Approval

When POST `/api/v1/industry/requirements/:draftId/send-for-approval` is called:

```javascript
const sendForApproval = async (draftId, payload, userId, companyId) => {
  // 1. Validate payload against schema
  const { error, value } = sendForApprovalSchema.validate(payload);
  if (error) throw new ValidationError(error.details[0].message);
  
  // 2. Fetch the approval matrix
  const matrix = await ApprovalMatrix.findById(value.selectedApprovalMatrixId);
  if (!matrix) throw new NotFoundError('Approval matrix not found');
  
  // 3. Build approval progress structure
  const approvalProgress = {
    currentLevel: 1,
    totalLevels: matrix.levels.length,
    allLevelsCompleted: false,
    levels: matrix.levels.map(level => ({
      levelNumber: level.order,
      name: level.name,
      status: level.order === 1 ? 'in_progress' : 'waiting',
      approvers: level.approvers.map(approver => ({
        userId: approver.userId,
        name: approver.name,
        email: approver.email,
        isMandatory: approver.isMandatory,
        status: 'pending',
        approvedAt: null,
        comments: null
      }))
    }))
  };
  
  // 4. Update the requirement document
  const updatedRequirement = await Requirement.findByIdAndUpdate(
    draftId,
    {
      $set: {
        // Status transition
        status: 'pending',
        isSentForApproval: true,
        sentForApprovalAt: new Date(),
        
        // Store deadline and criteria
        submissionDeadline: value.submissionDeadline,
        evaluationCriteria: value.evaluationCriteria,
        
        // Store selected matrix (snapshot for audit)
        selectedApprovalMatrixId: value.selectedApprovalMatrixId,
        selectedApprovalMatrix: {
          id: matrix._id,
          name: matrix.name,
          levels: matrix.levels
        },
        
        // Initialize approval workflow
        approvalProgress: approvalProgress,
        
        // Notification preferences
        visibility: value.visibility,
        notifyByEmail: value.notifyByEmail,
        notifyByApp: value.notifyByApp
      }
    },
    { new: true }
  );
  
  // 5. Send notifications to Level 1 approvers
  await sendApprovalRequestEmails(approvalProgress.levels[0].approvers, updatedRequirement);
  
  // 6. Return updated requirement
  return updatedRequirement;
};
```

#### 2.2.4 Frontend UI Updates (PublishStep.tsx)

The PublishStep component must:

1. **Display submission deadline input** (required, must be future date)
2. **Display evaluation criteria input** (required, at least one criterion)
3. **Validate before enabling "Send for Approval" button**

```tsx
// PublishStep.tsx - Required fields section
<div className="space-y-6">
  {/* Submission Deadline */}
  <div className="space-y-2">
    <Label htmlFor="submissionDeadline" className="flex items-center gap-1">
      Submission Deadline
      <span className="text-destructive">*</span>
    </Label>
    <DatePicker
      id="submissionDeadline"
      value={formData.submissionDeadline}
      onChange={(date) => updateFormData({ submissionDeadline: date })}
      minDate={new Date()} // Must be future date
      placeholder="Select deadline for vendor submissions"
    />
    {!formData.submissionDeadline && (
      <p className="text-sm text-destructive">Submission deadline is required</p>
    )}
  </div>
  
  {/* Evaluation Criteria */}
  <div className="space-y-2">
    <Label htmlFor="evaluationCriteria" className="flex items-center gap-1">
      Evaluation Criteria
      <span className="text-destructive">*</span>
    </Label>
    <MultiSelectInput
      id="evaluationCriteria"
      value={formData.evaluationCriteria || []}
      onChange={(criteria) => updateFormData({ evaluationCriteria: criteria })}
      options={[
        { value: 'price', label: 'Price' },
        { value: 'quality', label: 'Quality' },
        { value: 'delivery_time', label: 'Delivery Time' },
        { value: 'warranty', label: 'Warranty' },
        { value: 'experience', label: 'Vendor Experience' },
        { value: 'compliance', label: 'Compliance' }
      ]}
      placeholder="Select evaluation criteria"
      allowCustom={true}
    />
    {(!formData.evaluationCriteria || formData.evaluationCriteria.length === 0) && (
      <p className="text-sm text-destructive">At least one criterion is required</p>
    )}
  </div>
</div>

{/* Send for Approval button - disabled until required fields filled */}
<Button
  onClick={handleSendForApproval}
  disabled={
    !formData.selectedApprovalMatrixId ||
    !formData.submissionDeadline ||
    !formData.evaluationCriteria?.length ||
    isLoading
  }
>
  {isLoading ? 'Sending...' : 'Send for Approval'}
</Button>
```

---

## Part 3: Mock Data Cleanup Checklist

### 3.1 Frontend Files to Clean

#### 3.1.1 Files to DELETE (Remove Entirely)

| File Path | Mock Data Type | Action |
|-----------|---------------|--------|
| `src/mocks/requirements-feed-mock.ts` | Requirements feed data | DELETE |
| `src/services/verification.mock.ts` | Verification mock service | DELETE |
| `src/data/mockRequirements.ts` | Requirements mock data | DELETE (if exists) |

#### 3.1.2 Files to UPDATE (Remove Mock Usage)

| File Path | Current Mock Usage | Action |
|-----------|-------------------|--------|
| `src/pages/IndustryRequirements.tsx` | Uses inline mock data | Replace with API call |
| `src/pages/ProjectsActive.tsx` | Uses mock projects | Replace with API call |
| `src/pages/StakeholdersVendors.tsx` | Uses mock vendors | Replace with API call |
| `src/pages/StakeholdersProfessionals.tsx` | Uses mock professionals | Replace with API call |
| `src/pages/IndustryDocuments.tsx` | Uses mock documents | Replace with API call |
| `src/components/shared/requirements/RequirementsFeed.tsx` | Uses mock feed data | Replace with API call |
| `src/pages/RequirementsDrafts.tsx` | Uses team members for filter | Use API creators |
| `src/pages/RequirementsApproved.tsx` | May have mock fallbacks | Remove fallbacks |
| `src/pages/RequirementsPublished.tsx` | May have mock fallbacks | Remove fallbacks |

#### 3.1.3 Files to KEEP (For Now)

| File Path | Reason |
|-----------|--------|
| `src/data/MockMessages.ts` | Messages module not yet integrated |
| `src/data/mockRoles.ts` | Backward compatibility during role transition |
| `src/data/admin/*.ts` | Admin module in development phase |

### 3.2 Backend Cleanup

#### 3.2.1 Controllers to Update

| Controller | Current Mock Usage | Action |
|------------|-------------------|--------|
| `requirements.controller.js` | May return mock on error | Remove, return proper errors |
| `drafts.controller.js` | May have test data | Remove test data |
| `approvals.controller.js` | May have mock approvers | Use real user data |

#### 3.2.2 Seeders to Organize

| Seeder | Current State | Action |
|--------|--------------|--------|
| `requirements.seeder.js` | Mixed test/prod data | Move test data to test scripts |
| `users.seeder.js` | Contains test users | Keep only essential seed data |
| `approval-matrix.seeder.js` | Contains samples | Keep as reference templates |

#### 3.2.3 Remove Development Mock Middleware

```javascript
// REMOVE from any controller or middleware
if (process.env.NODE_ENV === 'development') {
  return res.json({ success: true, data: mockData }); // REMOVE THIS
}
```

### 3.3 Mock Data Cleanup Verification Checklist

After cleanup, verify:

- [ ] All list pages fetch from API (no inline mock data)
- [ ] No `mockData`, `dummyData`, `testData` variables in production code
- [ ] No `if (isDevelopment) return mockData` patterns
- [ ] All filter dropdowns populated from API responses
- [ ] Error states show proper error messages (not mock fallbacks)
- [ ] Empty states show "No data" messages (not mock data)
- [ ] Console has no "using mock data" warnings

---

## Part 4: API Endpoint Specifications

### 4.1 List Endpoints (All Statuses)

#### GET /api/v1/industry/requirements/drafts

```yaml
Method: GET
Auth: Required (Bearer token)
Module: requirements/drafts (read permission)

Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10, max: 100)
  - sortBy: string (default: 'createdDate')
  - sortOrder: 'asc' | 'desc' (default: 'desc')
  - search: string (searches title, description)
  - category: string (filter by category)
  - priority: string (filter by priority)
  - createdById: string (filter by creator ID) # NEW

Response: See Section 1.2.3 for structure
```

#### GET /api/v1/industry/requirements/pending

```yaml
Method: GET
Auth: Required (Bearer token)
Module: requirements/pending-approval (read permission)

Query Parameters: Same as /drafts

Additional Response Fields:
  - Each requirement includes:
    - approvalProgress: object (current approval state)
    - canApprove: boolean (if current user can approve)
    - canReject: boolean (if current user can reject)
```

#### GET /api/v1/industry/requirements/approved

```yaml
Method: GET
Auth: Required (Bearer token)
Module: requirements/approved (read permission)

Query Parameters: Same as /drafts

Additional Response Fields:
  - Each requirement includes:
    - approvedAt: datetime
    - approvedBy: object { id, name }
    - canPublish: boolean (if current user can publish)
```

#### GET /api/v1/industry/requirements/published

```yaml
Method: GET
Auth: Required (Bearer token)
Module: requirements/published (read permission)

Query Parameters: Same as /drafts

Additional Response Fields:
  - Each requirement includes:
    - publishedAt: datetime
    - publishedBy: object { id, name }
    - quotesReceived: number
```

### 4.2 Send for Approval Endpoint

#### POST /api/v1/industry/requirements/:draftId/send-for-approval

```yaml
Method: POST
Auth: Required (Bearer token)
Module: requirements/create-requirement (write permission)

Path Parameters:
  - draftId: string (required)

Request Body:
  selectedApprovalMatrixId: string    # REQUIRED
  submissionDeadline: ISO8601 date    # REQUIRED (must be future)
  evaluationCriteria: string[]        # REQUIRED (min 1 item)
  visibility: 'all' | 'invited'       # Optional (default: 'all')
  notifyByEmail: boolean              # Optional (default: true)
  notifyByApp: boolean                # Optional (default: true)
  termsAccepted: boolean              # REQUIRED (must be true)

Success Response (200):
{
  "success": true,
  "data": {
    "requirementId": "req-123",
    "status": "pending",
    "isSentForApproval": true,
    "sentForApprovalAt": "2025-12-13T10:30:00Z",
    "submissionDeadline": "2025-12-20T18:30:00Z",
    "evaluationCriteria": ["price", "quality", "delivery_time"],
    "approvalProgress": {
      "currentLevel": 1,
      "totalLevels": 3,
      "levels": [
        {
          "levelNumber": 1,
          "name": "Department Head",
          "status": "in_progress",
          "approvers": [
            {
              "userId": "user-456",
              "name": "Jane Smith",
              "status": "pending",
              "isMandatory": true
            }
          ]
        }
      ]
    },
    "estimatedPublishDate": "2025-12-18T00:00:00Z"
  }
}

Error Response (400 - Validation):
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Submission deadline is required",
    "field": "submissionDeadline"
  }
}

Error Response (404 - Not Found):
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Draft requirement not found"
  }
}
```

---

## Part 5: Flow Diagrams

### 5.1 Requirement List Page Load Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      REQUIREMENT LIST PAGE LOAD FLOW                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐                                                            │
│  │   Frontend   │                                                            │
│  │  Page Load   │                                                            │
│  └──────┬───────┘                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ GET /api/v1/industry/requirements/{status}                           │   │
│  │ Headers: Authorization: Bearer {token}                                │   │
│  │ Query: ?page=1&limit=10&sortBy=createdDate&sortOrder=desc            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────┐                                                            │
│  │   Backend    │                                                            │
│  │  Controller  │                                                            │
│  └──────┬───────┘                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Extract companyId from JWT token                                   │   │
│  │ 2. Validate user has read permission for module                       │   │
│  │ 3. Build query: { companyId, status }                                 │   │
│  │ 4. Fetch requirements with pagination                                 │   │
│  │ 5. Aggregate unique creators for this company+status                  │   │
│  │ 6. Calculate statistics                                               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Response: {                                                           │   │
│  │   requirements: [...],                                                │   │
│  │   pagination: { currentPage, totalPages, totalItems },                │   │
│  │   filters: {                                                          │   │
│  │     creators: [{ id, name, email, count }, ...]  ← NEW                │   │
│  │   },                                                                  │   │
│  │   statistics: { total, byPriority }                                   │   │
│  │ }                                                                     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────┐                                                            │
│  │   Frontend   │                                                            │
│  │   Renders    │                                                            │
│  └──────┬───────┘                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Display statistics cards                                           │   │
│  │ 2. Populate CreatorFilterDropdown with filters.creators               │   │
│  │ 3. Render requirements table                                          │   │
│  │ 4. Show pagination controls                                           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Creator Filter Selection Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CREATOR FILTER SELECTION FLOW                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────┐                                │
│  │ User selects creator from dropdown      │                                │
│  │ Options: "All" | "Me" | "John Doe" | ...│                                │
│  └────────────────────┬────────────────────┘                                │
│                       │                                                      │
│                       ▼                                                      │
│  ┌─────────────────────────────────────────┐                                │
│  │ Frontend updates state:                 │                                │
│  │ setSelectedCreatorId(creatorId)         │                                │
│  │ setPagination({ currentPage: 1 })       │                                │
│  └────────────────────┬────────────────────┘                                │
│                       │                                                      │
│                       ▼                                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ GET /api/v1/industry/requirements/{status}?createdById={selectedId}  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                       │                                                      │
│                       ▼                                                      │
│  ┌─────────────────────────────────────────┐                                │
│  │ Backend filters by createdBy.id         │                                │
│  │ Returns filtered requirements           │                                │
│  │ Still returns ALL creators for dropdown │                                │
│  └────────────────────┬────────────────────┘                                │
│                       │                                                      │
│                       ▼                                                      │
│  ┌─────────────────────────────────────────┐                                │
│  │ Frontend updates table with filtered    │                                │
│  │ requirements, keeps dropdown populated  │                                │
│  └─────────────────────────────────────────┘                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Send for Approval Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SEND FOR APPROVAL FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ STEP 1-4: User completes requirement form                              │ │
│  │ - Basic Info, Details, Documents, Approval Matrix Selection            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                       │                                                      │
│                       ▼                                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ STEP 5: Preview                                                        │ │
│  │ - User reviews all entered information                                 │ │
│  │ - Clicks "Continue" to proceed                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                       │                                                      │
│                       ▼                                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ STEP 6: Publish/Approval Step                                          │ │
│  │                                                                        │ │
│  │ User MUST enter:                                                       │ │
│  │ ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │ │ Submission Deadline *     [Date Picker - Future dates only]     │   │ │
│  │ └─────────────────────────────────────────────────────────────────┘   │ │
│  │ ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │ │ Evaluation Criteria *     [Multi-select: Price, Quality, ...]   │   │ │
│  │ └─────────────────────────────────────────────────────────────────┘   │ │
│  │ ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │ │ [✓] I accept the terms and conditions                           │   │ │
│  │ └─────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                        │ │
│  │ [Send for Approval] ← Disabled until all required fields filled       │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                       │                                                      │
│                       ▼                                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Frontend Validation:                                                   │ │
│  │ ✓ selectedApprovalMatrixId exists                                      │ │
│  │ ✓ submissionDeadline is set and is future date                        │ │
│  │ ✓ evaluationCriteria has at least 1 item                              │ │
│  │ ✓ termsAccepted is true                                               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                       │                                                      │
│                       ▼                                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ POST /api/v1/industry/requirements/:draftId/send-for-approval        │   │
│  │                                                                       │   │
│  │ Request Body: {                                                       │   │
│  │   selectedApprovalMatrixId: "matrix-123",                            │   │
│  │   submissionDeadline: "2025-12-20T18:30:00Z",    ← REQUIRED          │   │
│  │   evaluationCriteria: ["price", "quality"],      ← REQUIRED          │   │
│  │   visibility: "all",                                                │   │
│  │   notifyByEmail: true,                                                │   │
│  │   termsAccepted: true                                                 │   │
│  │ }                                                                     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                       │                                                      │
│                       ▼                                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Backend Actions:                                                       │ │
│  │                                                                        │ │
│  │ 1. Validate all required fields                                        │ │
│  │ 2. Update requirement document:                                        │ │
│  │    - status = 'pending'                                                │ │
│  │    - isSentForApproval = true                                          │ │
│  │    - sentForApprovalAt = now()                                         │ │
│  │    - submissionDeadline = payload.submissionDeadline                   │ │
│  │    - evaluationCriteria = payload.evaluationCriteria                   │ │
│  │                                                                        │ │
│  │ 3. Initialize approvalProgress with matrix levels                      │ │
│  │ 4. Send email notifications to Level 1 approvers                       │ │
│  │ 5. Return updated requirement with approval progress                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                       │                                                      │
│                       ▼                                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Frontend displays:                                                     │ │
│  │ - Success toast: "Requirement sent for approval"                       │ │
│  │ - Approval progress UI showing hierarchical levels                     │ │
│  │ - Level 1 approvers and their pending status                          │ │
│  │ - Estimated publish date                                               │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 6: Implementation Checklist

### 6.1 Backend Tasks

| # | Task | Priority | Est. Hours | Dependencies |
|---|------|----------|------------|--------------|
| B1 | Add `createdBy` object to all requirements (migration) | High | 4 | None |
| B2 | Implement creator aggregation pipeline | High | 4 | B1 |
| B3 | Update all list endpoint controllers to include `filters.creators` | High | 6 | B2 |
| B4 | Add `createdById` query parameter handling | High | 2 | B3 |
| B5 | Make `submissionDeadline` required in send-for-approval | High | 2 | None |
| B6 | Make `evaluationCriteria` required in send-for-approval | High | 2 | None |
| B7 | Store deadline and criteria in requirement on send-for-approval | High | 2 | B5, B6 |
| B8 | Remove mock data from controllers | Medium | 4 | None |
| B9 | Move test data to test scripts | Low | 3 | B8 |
| **Total** | | | **29 hours** | |

### 6.2 Frontend Tasks

| # | Task | Priority | Est. Hours | Dependencies |
|---|------|----------|------------|--------------|
| F1 | Create `CreatorFilterDropdown` component | High | 3 | None |
| F2 | Add creator filter to `RequirementsApproved.tsx` | High | 2 | F1 |
| F3 | Add creator filter to `RequirementsPublished.tsx` | High | 2 | F1 |
| F4 | Update `RequirementsDrafts.tsx` to use API creators | Medium | 2 | F1 |
| F5 | Add creator filter to `RequirementsArchived.tsx` | Medium | 2 | F1 |
| F6 | Update `PublishStep.tsx` with required deadline/criteria | High | 3 | None |
| F7 | Update `useSendForApproval` validation | High | 1 | F6 |
| F8 | Delete mock data files | Medium | 1 | None |
| F9 | Remove mock fallbacks from pages | Medium | 3 | None |
| F10 | Update list services to pass `createdById` param | High | 2 | None |
| **Total** | | | **21 hours** | |

### 6.3 Testing Checklist

| # | Test Case | Type |
|---|-----------|------|
| T1 | All list pages load with creators in filter dropdown | Integration |
| T2 | Selecting "All" shows all company requirements | Integration |
| T3 | Selecting "Me" shows only current user's requirements | Integration |
| T4 | Selecting specific user shows their requirements | Integration |
| T5 | Creator counts match actual requirement counts | Unit |
| T6 | Send for approval fails without deadline | API |
| T7 | Send for approval fails without criteria | API |
| T8 | Send for approval stores deadline and criteria | API |
| T9 | No mock data warnings in console | E2E |
| T10 | Empty states show proper messages (not mock data) | E2E |

---

## Appendix A: TypeScript Interfaces

```typescript
// Creator filter types
interface Creator {
  id: string;
  name: string;
  email: string;
  count: number;
}

interface CreatorFilterDropdownProps {
  creators: Creator[];
  selectedCreatorId: string | null;
  currentUserId: string;
  onSelect: (creatorId: string | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

// Updated list response type
interface RequirementListResponse {
  success: boolean;
  data: {
    requirements: RequirementListItem[];
    pagination: PaginationData;
    filters: {
      applied: Record<string, any>;
      available: {
        categories?: FilterOption[];
        priorities?: FilterOption[];
      };
      creators: Creator[]; // NEW - Always included
    };
    statistics: {
      total: number;
      byPriority: Record<string, number>;
    };
  };
}

// Updated send for approval payload
interface SendForApprovalPayload {
  draftId: string;
  selectedApprovalMatrixId: string;
  submissionDeadline: Date;         // NOW REQUIRED
  evaluationCriteria: string[];     // NOW REQUIRED
  visibility?: 'all' | 'invited';
  notifyByEmail?: boolean;
  notifyByApp?: boolean;
  termsAccepted: boolean;
}

// Updated requirement form data
interface RequirementFormData {
  // ... existing fields
  submissionDeadline?: Date;
  evaluationCriteria?: string[];
}
```

---

## Appendix B: Migration Script Example

```javascript
// MongoDB Migration: Add createdBy object to existing requirements
// Run once to migrate existing data

db.requirements.updateMany(
  { "createdBy.id": { $exists: false } },
  [
    {
      $set: {
        createdBy: {
          id: { $toString: "$createdById" },
          name: "$creatorName", // If exists
          email: "$creatorEmail" // If exists
        }
      }
    }
  ]
);

// For requirements without creator info, lookup from users collection
db.requirements.aggregate([
  { $match: { "createdBy.name": { $exists: false } } },
  {
    $lookup: {
      from: "users",
      localField: "createdBy.id",
      foreignField: "_id",
      as: "creatorUser"
    }
  },
  { $unwind: "$creatorUser" },
  {
    $set: {
      "createdBy.name": {
        $concat: ["$creatorUser.firstName", " ", "$creatorUser.lastName"]
      },
      "createdBy.email": "$creatorUser.email"
    }
  },
  { $unset: "creatorUser" },
  { $merge: { into: "requirements", whenMatched: "merge" } }
]);
```

---

**Document Complete. Ready for implementation by frontend and backend teams.**
