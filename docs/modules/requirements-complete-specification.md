# Requirements Module - Complete Technical Specification

## Document Purpose
This document defines the complete behavior, data flow, and API interactions for the Requirements module, covering:
1. Draft Creation & Auto-Save
2. Draft Editing & Validation
3. Approval Workflow (Send, Approve, Reject)
4. Comments & Feedback
5. Publishing
6. Status-Based UI Controls

---

## 1. Architecture Overview

### 1.1 Single Table Design
All requirements are stored in ONE table with status-based filtering:

```
requirements_collection
├── status: enum ['draft', 'pending', 'approved', 'rejected', 'published', 'archived']
├── isSentForApproval: boolean
├── selectedApprovalMatrix: object (embedded snapshot)
├── approvalProgress: object (tracks current approval state)
└── ... other requirement fields
```

### 1.2 Status Flow Diagram

```
┌─────────┐     Send for     ┌─────────┐     All Levels    ┌──────────┐     Publish     ┌───────────┐
│  DRAFT  │ ────────────────►│ PENDING │ ─────────────────►│ APPROVED │ ───────────────►│ PUBLISHED │
└─────────┘     Approval     └─────────┘     Approved      └──────────┘                 └───────────┘
     ▲                            │                                                           │
     │                            │ Reject                                                    │
     │                            ▼                                                           ▼
     │                       ┌──────────┐                                               ┌──────────┐
     └───── Edit & ─────────│ REJECTED │                                               │ ARCHIVED │
            Resubmit        └──────────┘                                               └──────────┘
```

---

## 2. Draft Creation & Auto-Save

### 2.1 When Draft is Created (Frontend)

**Trigger Conditions:**
- User navigates to `/dashboard/create-requirement`
- User fills 2-3 meaningful fields (title, category, priority, budget, etc.)
- Auto-save timer fires (30 seconds)

**Frontend Flow:**
```typescript
// CreateRequirement.tsx
1. User enters page → startEditing() called
2. Form fields populated → formData updated via updateFormData()
3. After 2-3 fields filled + 30 seconds → initializeDraft() if no draftId exists
4. If draftId exists → forceSave() silently updates
5. User leaves page → stopEditing() called (cleanup)
```

### 2.2 Auto-Save Conditions

Auto-save ONLY runs when:
```typescript
const shouldAutoSave = () => {
  return (
    isAuthenticated &&              // User is logged in
    !isFormEmpty() &&               // Form has data
    isActivelyEditing &&            // User is in edit mode
    (status === 'draft' || status === 'rejected') &&  // Editable status
    !isSentForApproval              // Not yet sent for approval
  );
};
```

### 2.3 Create Draft API

**Endpoint:** `POST /api/v1/industry/requirements/draft`

**Request:**
```json
{
  "title": "Office Equipment Procurement",
  "category": "goods",
  "priority": "high",
  "department": "Engineering",
  "estimatedBudget": 50000
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "draftId": "draft-REQ-2025-12-07-fdda124d",
    "status": "draft",
    "isSentForApproval": false,
    "createdAt": "2025-12-07T05:08:20.812Z",
    "expiresAt": "2025-12-14T05:08:20.812Z"
  }
}
```

### 2.4 Update Draft API

**Endpoint:** `PATCH /api/v1/industry/requirements/draft/:draftId`

**Request:** (only changed fields - sanitized)
```json
{
  "title": "Updated Title",
  "estimatedBudget": 60000,
  "documents": [...]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "draftId": "draft-REQ-2025-12-07-fdda124d",
    "updatedAt": "2025-12-08T13:39:55.157Z"
  }
}
```

### 2.5 Sanitized Fields (Allowed for Update)

The following fields are allowed when updating a draft:

```typescript
const allowedUpdateKeys = [
  'title', 'category', 'priority', 'description', 'department',
  'costCenter', 'businessJustification', 'estimatedBudget',
  'riskLevel', 'complianceRequired', 'documents',
  'productSpecifications', 'quantity', 'technicalStandards',
  'productDeliveryDate', 'expertSkills', 'expertQualifications',
  'expertDuration', 'serviceDescription', 'serviceSLA',
  'logisticsDetails', 'selectedApprovalMatrixId', 'selectedApprovalMatrix',
  'submissionDeadline', 'visibility', 'evaluationCriteria',
  'notifyByEmail', 'notifyByApp', 'termsAccepted',
  'isSentForApproval', 'status'
];
```

---

## 3. Draft Editing (From Drafts List)

### 3.1 Action Buttons Visibility (Frontend)

**Table Actions Logic:**
```typescript
const MODULE_ID = 'requirements-drafts';
const canEditByStatus = row.status === 'draft' || row.status === 'rejected';
const hasEditPermission = hasPermission(MODULE_ID, 'edit');
const hasDeletePermission = hasPermission(MODULE_ID, 'delete');

// Buttons:
// VIEW - Always visible
// EDIT - Show if canEditByStatus && hasEditPermission
// DELETE - Show if status === 'draft' && hasDeletePermission
```

| Status | View | Edit | Delete |
|--------|------|------|--------|
| `draft` | ✅ | ✅ (if permission) | ✅ (if permission) |
| `pending` | ✅ | ❌ | ❌ |
| `approved` | ✅ | ❌ | ❌ |
| `rejected` | ✅ | ✅ (if permission) | ❌ |
| `published` | ✅ | ❌ | ❌ |

### 3.2 Edit Navigation

**View Mode:** `/dashboard/requirements/:id` → Read-only page
**Edit Mode:** `/dashboard/create-requirement?draftId=xxx` → Form pre-populated

### 3.3 Load Draft for Editing

**Endpoint:** `GET /api/v1/industry/requirements/draft/:draftId`

**Response:**
```json
{
  "success": true,
  "data": {
    "draftId": "draft-REQ-2025-12-07-fdda124d",
    "formData": {
      "title": "Office Equipment Procurement",
      "category": "goods",
      "priority": "high",
      "status": "draft",
      "isSentForApproval": false,
      "selectedApprovalMatrixId": "692db2822235430a814a3988",
      "selectedApprovalMatrix": {...},
      "documents": [...],
      ...
    }
  }
}
```

---

## 4. Approval Workflow

### 4.1 Send for Approval

**Trigger:** User clicks "Send for Approval" button in PublishStep

**Pre-conditions:**
1. `draftId` exists (draft saved)
2. `selectedApprovalMatrixId` selected
3. Required fields complete (title, category, budget, deadline)
4. Terms accepted

**Frontend Flow:**
```typescript
const handleSendForApproval = async () => {
  // Validate required fields
  if (!draftId) return toast.error("Please save first");
  if (!formData.selectedApprovalMatrixId) return toast.error("Select approval matrix");
  
  const response = await sendForApproval({
    draftId,
    selectedApprovalMatrixId: formData.selectedApprovalMatrixId,
    submissionDeadline: formData.submissionDeadline,
    evaluationCriteria: formData.evaluationCriteria,
  });
  
  if (response) {
    updateFormData({ 
      status: 'pending',
      isSentForApproval: true,
      approvalProgress: response.approvalProgress,
    });
    stopEditing(); // Stop auto-save
  }
};
```

**Endpoint:** `POST /api/v1/industry/requirements/:draftId/send-for-approval`

**Request:**
```json
{
  "selectedApprovalMatrixId": "692db2822235430a814a3988",
  "submissionDeadline": "2025-12-20T18:30:00.000Z",
  "evaluationCriteria": ["price", "quality", "delivery"],
  "notifyByEmail": true,
  "notifyByApp": true,
  "termsAccepted": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Requirement sent for approval successfully",
  "data": {
    "requirementId": "REQ-2025-12-07-fdda124d",
    "draftId": "draft-REQ-2025-12-07-fdda124d",
    "status": "pending",
    "isSentForApproval": true,
    "sentForApprovalAt": "2025-12-08T14:00:00.000Z",
    "approvalProgress": {
      "currentLevel": 1,
      "totalLevels": 2,
      "levels": [
        {
          "levelNumber": 1,
          "name": "Level 1",
          "status": "in_progress",
          "approvers": [
            {
              "memberId": "6927429a2de4792cb3db7c9e",
              "memberName": "Jane Smith",
              "memberEmail": "jane@example.com",
              "isMandatory": true,
              "status": "pending",
              "notifiedAt": "2025-12-08T14:00:00.000Z"
            }
          ]
        },
        {
          "levelNumber": 2,
          "name": "Level 2",
          "status": "waiting",
          "approvers": [...]
        }
      ],
      "estimatedCompletionDate": "2025-12-11T14:00:00.000Z"
    }
  }
}
```

**Backend Actions:**
1. Validate draft completeness
2. Fetch approval matrix and create snapshot
3. Set `status = 'pending'`, `isSentForApproval = true`
4. Initialize `approvalProgress` with all levels
5. Set level 1 status to `'in_progress'`
6. Send notifications to level 1 approvers
7. Log in notification history

### 4.2 Approve Requirement (Approver Action)

**Display Approve Button Condition:**
```typescript
const canApprove = (
  requirement.status === 'pending' &&
  requirement.approvalProgress.levels.some(level => 
    level.status === 'in_progress' &&
    level.approvers.some(approver => 
      approver.memberId === currentUserId &&
      approver.status === 'pending'
    )
  )
);
```

**Endpoint:** `POST /api/v1/industry/requirements/:requirementId/approve`

**Request:**
```json
{
  "comments": "Approved. Budget looks reasonable.",
  "conditions": ["Ensure 2-year warranty"]
}
```

**Backend Logic:**
```javascript
async function approveRequirement(requirementId, userId, payload) {
  const requirement = await findRequirement(requirementId);
  
  // 1. Validate user is approver in current level
  const currentLevel = requirement.approvalProgress.levels.find(
    l => l.status === 'in_progress'
  );
  const approver = currentLevel.approvers.find(a => a.memberId === userId);
  
  if (!approver || approver.status !== 'pending') {
    throw new Error('NOT_AUTHORIZED');
  }
  
  // 2. Update approver status
  approver.status = 'approved';
  approver.approvedAt = new Date();
  approver.comments = payload.comments;
  
  // 3. Check if all MANDATORY approvers in level approved
  const mandatoryApprovers = currentLevel.approvers.filter(a => a.isMandatory);
  const allMandatoryApproved = mandatoryApprovers.every(a => a.status === 'approved');
  
  let levelAdvanced = false;
  let fullyApproved = false;
  
  if (allMandatoryApproved) {
    // Complete current level
    currentLevel.status = 'completed';
    currentLevel.completedAt = new Date();
    
    // Check if more levels exist
    const nextLevelIndex = requirement.approvalProgress.currentLevel;
    if (nextLevelIndex < requirement.approvalProgress.totalLevels) {
      // Advance to next level
      requirement.approvalProgress.currentLevel += 1;
      requirement.approvalProgress.levels[nextLevelIndex].status = 'in_progress';
      requirement.approvalProgress.levels[nextLevelIndex].startedAt = new Date();
      levelAdvanced = true;
      
      // Notify next level approvers
      await notifyApprovers(requirement.approvalProgress.levels[nextLevelIndex].approvers);
    } else {
      // All levels complete
      requirement.status = 'approved';
      requirement.approvalProgress.allLevelsCompleted = true;
      fullyApproved = true;
      
      // Notify creator - ready to publish
      await sendReadyToPublishEmail(requirement.createdBy);
    }
  }
  
  // 4. Save and return
  await requirement.save();
  
  return {
    requirementId,
    status: requirement.status,
    approvalProgress: requirement.approvalProgress,
    levelAdvanced,
    fullyApproved,
    readyToPublish: fullyApproved
  };
}
```

**Response Scenarios:**

**Level NOT Advanced (other approvers pending):**
```json
{
  "success": true,
  "message": "Requirement approved successfully",
  "data": {
    "requirementId": "REQ-xxx",
    "status": "pending",
    "levelAdvanced": false,
    "fullyApproved": false,
    "readyToPublish": false
  }
}
```

**Level Advanced:**
```json
{
  "success": true,
  "message": "Approved! Moving to Level 2",
  "data": {
    "requirementId": "REQ-xxx",
    "status": "pending",
    "levelAdvanced": true,
    "fullyApproved": false,
    "nextApprovers": [...]
  }
}
```

**Fully Approved:**
```json
{
  "success": true,
  "message": "Requirement fully approved! Ready to publish.",
  "data": {
    "requirementId": "REQ-xxx",
    "status": "approved",
    "levelAdvanced": false,
    "fullyApproved": true,
    "readyToPublish": true
  }
}
```

### 4.3 Reject Requirement

**Endpoint:** `POST /api/v1/industry/requirements/:requirementId/reject`

**Request:**
```json
{
  "reason": "Budget exceeds quarterly allocation",
  "comments": "Please revise budget to fit Q1 allocation",
  "allowResubmission": true,
  "resubmissionDeadline": "2025-12-15T23:59:59.000Z"
}
```

**Backend Actions:**
1. Validate user is approver in current level
2. Set `status = 'rejected'`
3. Store rejection details
4. Send rejection email to creator
5. If `allowResubmission`, creator can edit and resubmit

**Response:**
```json
{
  "success": true,
  "message": "Requirement rejected",
  "data": {
    "requirementId": "REQ-xxx",
    "status": "rejected",
    "rejectedAt": "2025-12-08T17:00:00.000Z",
    "rejectedBy": {
      "id": "user-xxx",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "rejectionDetails": {
      "reason": "Budget exceeds quarterly allocation",
      "comments": "Please revise budget...",
      "allowResubmission": true,
      "resubmissionDeadline": "2025-12-15T23:59:59.000Z"
    },
    "canResubmit": true
  }
}
```

### 4.4 Resubmit After Rejection

**User Flow:**
1. User sees requirement in Drafts with `status: 'rejected'`
2. Clicks "Edit" → navigates to create-requirement page
3. Sees rejection feedback (comments from approver)
4. Makes changes and saves
5. Clicks "Send for Approval" again

**Endpoint:** `POST /api/v1/industry/requirements/:requirementId/resubmit`

**Request:**
```json
{
  "revisionNotes": "Budget revised as per feedback",
  "changesDescription": "Reduced total budget from 100K to 60K"
}
```

**Backend Actions:**
1. Reset approval workflow (all levels back to 'waiting')
2. Set level 1 to 'in_progress'
3. Increment `resubmissionCount`
4. Add entry to `resubmissionHistory`
5. Set `status = 'pending'`
6. Notify level 1 approvers

---

## 5. Comments & Feedback

### 5.1 Comments Flow

**When Comments are Used:**
- Creator adds notes/questions during drafting
- Approvers add feedback during review
- Rejection reasons are captured as comments
- Clarification requests during approval

### 5.2 Create Comment

**Endpoint:** `POST /api/v1/industry/comments`

**Request:**
```json
{
  "requirementId": "REQ-001",
  "content": "Budget needs clarification for line item 3",
  "commentType": "clarification"
}
```

**Comment Types:**
| Type | Use Case |
|------|----------|
| `general` | Team discussions, updates |
| `approval_rejection` | Rejection feedback from approver |
| `approval_request` | Submitter's justification |
| `clarification` | Questions needing answers |

### 5.3 Get Comments for Requirement

**Endpoint:** `GET /api/v1/industry/comments/requirement/:requirementId`

**Response:**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "comment-123",
        "requirementId": "REQ-001",
        "userId": "user-456",
        "userName": "John Doe",
        "userRole": "Department Head",
        "content": "Comment content...",
        "commentType": "general",
        "createdAt": "2025-01-15T10:30:00Z",
        "isEdited": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 25
    }
  }
}
```

### 5.4 Update Comment

**Endpoint:** `PUT /api/v1/industry/comments/:commentId`

**Request:**
```json
{
  "content": "Updated comment content"
}
```

### 5.5 Delete Comment

**Endpoint:** `DELETE /api/v1/industry/comments/:commentId`

### 5.6 Frontend Comments Display

**CommentsDropdownPanel:**
- Shows in CreateRequirementLayout header
- Fetches comments using `useComments(requirementId)`
- Allows adding new comments via `useAddComment`
- Allows editing own comments via `useUpdateComment`
- Allows deleting own comments via `useDeleteComment`

---

## 6. Publishing

### 6.1 Publish Approved Requirement

**Pre-conditions:**
1. `status === 'approved'`
2. `approvalProgress.allLevelsCompleted === true`
3. User is the creator

**Endpoint:** `POST /api/v1/industry/requirements/:requirementId/publish`

**Request:**
```json
{
  "notifyVendors": true,
  "publishNotes": "Open for all registered vendors",
  "visibility": "all",
  "submissionDeadline": "2025-12-20T18:30:00.000Z"
}
```

**Backend Actions:**
1. Validate status is 'approved'
2. Set `status = 'published'`
3. Set `publishedAt`, `publishedBy`
4. Send notifications to vendors (based on visibility)
5. Generate public URL
6. Send confirmation email to creator

**Response:**
```json
{
  "success": true,
  "message": "Requirement published successfully",
  "data": {
    "requirementId": "REQ-xxx",
    "status": "published",
    "publishedAt": "2025-12-09T12:00:00.000Z",
    "publishedBy": {
      "id": "user-xxx",
      "name": "John Doe"
    },
    "vendorNotifications": {
      "totalVendors": 150,
      "notified": 145,
      "failed": 5
    },
    "publicUrl": "/requirements/REQ-xxx"
  }
}
```

### 6.2 Publish Button Visibility (Approved Page)

```typescript
const canPublish = (
  requirement.status === 'approved' &&
  requirement.createdBy.id === currentUserId &&
  hasPermission(MODULE_ID, 'write')
);
```

---

## 7. List Endpoints (Status-Based Filtering)

All lists filter from the SAME table using `status` field:

| Page | Endpoint | Status Filter |
|------|----------|---------------|
| Drafts | `GET /api/v1/industry/requirements/drafts` | `status: 'draft'` |
| Pending Approval | `GET /api/v1/industry/requirements/pending` | `status: 'pending'` |
| Approved | `GET /api/v1/industry/requirements/approved` | `status: 'approved'` |
| Published | `GET /api/v1/industry/requirements/published` | `status: 'published'` |
| Archived | `GET /api/v1/industry/requirements/archived` | `status: 'archived'` |

### 7.1 Common Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `sortBy` | string | Sort field (default: createdAt) |
| `sortOrder` | string | 'asc' or 'desc' |
| `search` | string | Search in title, description |
| `category` | string | Filter by category |
| `priority` | string | Filter by priority |
| `department` | string | Filter by department |
| `createdById` | string | Filter by creator |

### 7.2 Common Response Structure

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 100,
      "totalPages": 10
    },
    "filters": {
      "applied": {
        "status": "draft",
        "category": "goods"
      },
      "available": {
        "categories": [...],
        "priorities": [...],
        "departments": [...],
        "creators": [...]
      }
    },
    "statistics": {
      "total": 100,
      "byPriority": {
        "critical": 5,
        "high": 20,
        "medium": 50,
        "low": 25
      }
    }
  }
}
```

---

## 8. Email Notifications (Backend)

| Trigger | Template | Recipients |
|---------|----------|------------|
| Send for Approval | `approval_request` | Level 1 approvers |
| Level Advanced | `level_advanced` | Next level approvers |
| Approved | `fully_approved` | Creator |
| Rejected | `rejection_notice` | Creator |
| Published | `requirement_published` | Creator + all approvers |
| Vendor Notification | `new_requirement` | Matching vendors |

### 8.1 Email Template Variables

**approval_request:**
```
{{requirementTitle}}
{{requirementId}}
{{creatorName}}
{{priority}}
{{estimatedBudget}}
{{approvalLink}}
```

**rejection_notice:**
```
{{requirementTitle}}
{{rejectorName}}
{{rejectionReason}}
{{rejectionComments}}
{{canResubmit}}
{{resubmissionDeadline}}
{{editLink}}
```

---

## 9. Key Data Types

### 9.1 RequirementFormData

```typescript
interface RequirementFormData {
  // Identifiers
  draftId?: string;
  
  // Basic Info
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  
  // Organization
  department?: string;
  costCenter?: string;
  businessJustification?: string;
  
  // Budget
  estimatedBudget?: number;
  
  // Documents
  documents?: RequirementDocument[];
  
  // Approval
  selectedApprovalMatrixId?: string;
  selectedApprovalMatrix?: ApprovalMatrix;
  approvalProgress?: ApprovalProgress;
  
  // Status Tracking
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  isSentForApproval?: boolean;
  
  // Publishing
  submissionDeadline?: Date;
  visibility?: 'all' | 'selected';
  evaluationCriteria?: string[];
  termsAccepted?: boolean;
  
  // Category-specific fields
  productSpecifications?: string;
  quantity?: number;
  technicalStandards?: string[];
  productDeliveryDate?: string;
  expertSkills?: string[];
  expertQualifications?: string[];
  expertDuration?: string;
  serviceDescription?: string;
  serviceSLA?: string;
  logisticsDetails?: string;
}
```

### 9.2 ApprovalProgress

```typescript
interface ApprovalProgress {
  currentLevel: number;
  totalLevels: number;
  allLevelsCompleted: boolean;
  estimatedCompletionDate?: string;
  levels: ApprovalLevel[];
}

interface ApprovalLevel {
  levelNumber: number;
  name: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'skipped';
  maxApprovalTimeHours: number;
  startedAt?: string;
  completedAt?: string;
  approvers: Approver[];
}

interface Approver {
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberRole: string;
  isMandatory: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  rejectedAt?: string;
  comments?: string;
}
```

### 9.3 RequirementDocument

```typescript
interface RequirementDocument {
  id: string;
  name: string;
  type: string;
  documentType: 'specification' | 'drawing' | 'reference' | 'compliance' | 'other';
  url: string;
  size: number;
  uploadedAt: Date | string;
  uploadedBy?: string;
}
```

### 9.4 Comment

```typescript
interface Comment {
  id: string;
  requirementId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  commentType: 'general' | 'approval_rejection' | 'approval_request' | 'clarification';
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
}
```

---

## 10. Files Involved (Frontend)

| Area | Files |
|------|-------|
| **Context** | `src/contexts/RequirementContext.tsx` |
| **Pages** | `src/pages/CreateRequirement.tsx`, `RequirementsDrafts.tsx`, `PendingApprovals.tsx`, `RequirementsApproved.tsx`, `RequirementsPublished.tsx`, `RequirementDetails.tsx` |
| **Steps** | `src/components/requirement/steps/EnhancedBasicInfoStep.tsx`, `DetailsStep.tsx`, `DocumentsStep.tsx`, `ApprovalWorkflowStep.tsx`, `PreviewStep.tsx`, `PublishStep.tsx` |
| **Hooks** | `src/hooks/useRequirementDraft.ts`, `useSendForApproval.ts`, `useApprovalStatus.ts`, `useApproveRequirement.ts`, `useRejectRequirement.ts`, `usePublishRequirement.ts`, `useComments.ts`, `useAddComment.ts`, `useAvailableMatrices.ts` |
| **Services** | `src/services/modules/requirements/drafts.service.ts`, `requirements.service.ts`, `approval-submission.service.ts` |
| **Types** | `src/types/requirement-form.types.ts`, `src/types/requirement-list.ts`, `src/types/comment.ts` |

---

## 11. Error Handling

### 11.1 Common Error Responses

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### 11.2 Error Codes

| Code | Message | Action |
|------|---------|--------|
| 400 | Validation failed | Show field-level errors |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show permission denied |
| 404 | Not found | Show not found page |
| 409 | Conflict | Already processed |
| 500 | Server error | Show generic error |

---

## 12. Security Considerations

### 12.1 Authorization Checks

- **Create Draft:** User must be authenticated
- **Update Draft:** User must be creator OR have edit permission
- **Delete Draft:** User must be creator AND status is 'draft'
- **Send for Approval:** User must be creator
- **Approve/Reject:** User must be in current level approvers
- **Publish:** User must be creator AND status is 'approved'

### 12.2 Data Validation

- All inputs sanitized on backend
- File uploads validated (type, size)
- Budget amounts validated as positive numbers
- Dates validated as future dates where applicable

---

## 13. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-11 | Initial specification |
