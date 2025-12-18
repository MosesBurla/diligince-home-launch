# Pending Requirement View API Documentation

## Overview

This document specifies the exact API response structure required for the read-only Pending Requirement View page (`/dashboard/requirements/pending/:id`). The frontend uses this data to display requirement details and conditionally show Approve/Reject buttons.

---

## Endpoint

### GET /api/v1/industry/requirements/:requirementId

Fetches a single requirement by ID for detailed view.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| requirementId | string | Yes | The requirement ID or draft ID |

---

## Response Structure

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Requirement fetched successfully",
  "data": {
    "id": "req-67890",
    "draftId": "draft-12345",
    "title": "IT Infrastructure Upgrade for Data Center",
    "category": "it-infrastructure",
    "priority": "high",
    "status": "pending",
    "isSentForApproval": true,
    "sentForApprovalAt": "2024-01-15T10:30:00.000Z",
    "estimatedBudget": 150000,
    "department": "Information Technology",
    "costCenter": "IT-001",
    "description": "Complete infrastructure upgrade including servers and networking equipment.",
    "businessJustification": "Current infrastructure is outdated and cannot support growing business needs.",
    "createdBy": {
      "id": "user-creator-123",
      "name": "Jane Smith",
      "email": "jane.smith@company.com",
      "department": "Information Technology"
    },
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "selectedApprovalMatrix": {
      "id": "matrix-001",
      "name": "High Value IT Procurement",
      "totalLevels": 3
    },
    "approvalProgress": {
      "currentLevel": 1,
      "totalLevels": 3,
      "allLevelsCompleted": false,
      "estimatedCompletionDate": "2024-01-20T17:00:00.000Z",
      "levels": [
        {
          "levelNumber": 1,
          "name": "Department Head Approval",
          "status": "in_progress",
          "maxApprovalTimeHours": 48,
          "startedAt": "2024-01-15T10:30:00.000Z",
          "completedAt": null,
          "approvers": [
            {
              "memberId": "user-approver-456",
              "memberName": "John Doe",
              "memberEmail": "john.doe@company.com",
              "memberRole": "Department Head",
              "memberDepartment": "Information Technology",
              "isMandatory": true,
              "status": "pending",
              "notifiedAt": "2024-01-15T10:30:00.000Z",
              "approvedAt": null,
              "rejectedAt": null,
              "comments": null,
              "conditions": null
            },
            {
              "memberId": "user-approver-789",
              "memberName": "Sarah Johnson",
              "memberEmail": "sarah.johnson@company.com",
              "memberRole": "Technical Lead",
              "memberDepartment": "Information Technology",
              "isMandatory": false,
              "status": "approved",
              "notifiedAt": "2024-01-15T10:30:00.000Z",
              "approvedAt": "2024-01-15T14:22:00.000Z",
              "rejectedAt": null,
              "comments": "Technical specifications look good.",
              "conditions": null
            }
          ]
        },
        {
          "levelNumber": 2,
          "name": "Finance Review",
          "status": "waiting",
          "maxApprovalTimeHours": 72,
          "startedAt": null,
          "completedAt": null,
          "approvers": [
            {
              "memberId": "user-finance-001",
              "memberName": "Michael Brown",
              "memberEmail": "michael.brown@company.com",
              "memberRole": "Finance Manager",
              "memberDepartment": "Finance",
              "isMandatory": true,
              "status": "pending",
              "notifiedAt": null,
              "approvedAt": null,
              "rejectedAt": null,
              "comments": null,
              "conditions": null
            }
          ]
        },
        {
          "levelNumber": 3,
          "name": "Executive Approval",
          "status": "waiting",
          "maxApprovalTimeHours": 48,
          "startedAt": null,
          "completedAt": null,
          "approvers": [
            {
              "memberId": "user-exec-001",
              "memberName": "David Wilson",
              "memberEmail": "david.wilson@company.com",
              "memberRole": "CTO",
              "memberDepartment": "Executive",
              "isMandatory": true,
              "status": "pending",
              "notifiedAt": null,
              "approvedAt": null,
              "rejectedAt": null,
              "comments": null,
              "conditions": null
            }
          ]
        }
      ]
    },
    "documents": [
      {
        "id": "doc-001",
        "name": "Technical Specifications.pdf",
        "documentType": "specification",
        "size": 2456789,
        "url": "https://storage.example.com/docs/tech-spec.pdf",
        "uploadedAt": "2024-01-12T09:00:00.000Z"
      }
    ]
  }
}
```

---

## Critical Fields for Conditional Button Display

The frontend uses specific fields to determine whether to show Approve/Reject buttons. These fields are **REQUIRED** for the feature to work correctly.

### Required Fields

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| `status` | enum | **Yes** | Must be `'pending'` for approval actions to be available |
| `approvalProgress.currentLevel` | number | **Yes** | The current active approval level (1-indexed) |
| `approvalProgress.levels` | array | **Yes** | Array of all approval levels |
| `approvalProgress.levels[].levelNumber` | number | **Yes** | Level number (1, 2, 3, etc.) |
| `approvalProgress.levels[].status` | enum | **Yes** | One of: `'waiting'`, `'in_progress'`, `'completed'`, `'skipped'` |
| `approvalProgress.levels[].approvers` | array | **Yes** | Array of approvers for this level |
| `approvalProgress.levels[].approvers[].memberId` | string | **Yes** | User ID of the approver - **MUST match `user.id` from auth** |
| `approvalProgress.levels[].approvers[].status` | enum | **Yes** | One of: `'pending'`, `'approved'`, `'rejected'` |

---

## Frontend Conditional Button Logic

The frontend uses this exact logic to determine button visibility:

```typescript
const canShowApprovalActions = (): boolean => {
  // Condition 1: Requirement must be in pending status
  if (requirement?.status !== 'pending') {
    return false;
  }

  // Condition 2: Find the current active level
  const currentLevel = requirement?.approvalProgress?.currentLevel;
  const currentLevelData = requirement?.approvalProgress?.levels?.find(
    level => level.levelNumber === currentLevel && level.status === 'in_progress'
  );

  if (!currentLevelData) {
    return false;
  }

  // Condition 3: Check if current user is an approver with pending status
  const isUserPendingApprover = currentLevelData.approvers?.some(
    approver => approver.memberId === currentUserId && approver.status === 'pending'
  );

  return isUserPendingApprover;
};
```

### Why Buttons May Not Display

| Scenario | Reason |
|----------|--------|
| `status !== 'pending'` | Requirement is not awaiting approval (draft, approved, rejected, published) |
| `currentLevel` not found | No active approval level exists |
| Level `status !== 'in_progress'` | Current level hasn't started or is already completed |
| `memberId !== currentUserId` | Logged-in user is not an approver for this level |
| Approver `status !== 'pending'` | User has already approved or rejected |

---

## Enum Values

### Requirement Status
```typescript
type RequirementStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
```

### Level Status
```typescript
type LevelStatus = 'waiting' | 'in_progress' | 'completed' | 'skipped';
```

### Approver Status
```typescript
type ApproverStatus = 'pending' | 'approved' | 'rejected';
```

---

## TypeScript Interface (Frontend)

```typescript
interface ApprovalApprover {
  memberId: string;           // CRITICAL: Must match user.id from auth
  memberName: string;
  memberEmail: string;
  memberRole: string;
  memberDepartment?: string;
  isMandatory: boolean;
  status: 'pending' | 'approved' | 'rejected';
  notifiedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  comments?: string;
  conditions?: string[];
}

interface ApprovalProgressLevel {
  levelNumber: number;
  name: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'skipped';
  maxApprovalTimeHours: number;
  startedAt?: string;
  completedAt?: string;
  approvers: ApprovalApprover[];
}

interface ApprovalProgress {
  currentLevel: number;
  totalLevels: number;
  allLevelsCompleted: boolean;
  estimatedCompletionDate?: string;
  levels: ApprovalProgressLevel[];
}
```

---

## Backend Implementation Notes

### 1. Member ID Matching

The `memberId` field in approvers **MUST** be the same identifier used in the authentication system. When a user logs in, their `user.id` is stored in context. The backend must ensure:

```javascript
// When assigning approvers from approval matrix
approver.memberId = teamMember._id.toString(); // or teamMember.userId

// This must match what's returned from auth
user.id = authenticatedUser._id.toString();
```

### 2. Level Status Transitions

```
waiting → in_progress (when previous level completes)
in_progress → completed (when all mandatory approvers approve)
in_progress → skipped (optional: if level is bypassed)
```

### 3. Approver Status Transitions

```
pending → approved (when approver approves)
pending → rejected (when approver rejects)
```

### 4. Current Level Advancement

When all mandatory approvers in current level approve:
1. Set current level's `status` to `'completed'`
2. Set current level's `completedAt` to current timestamp
3. Increment `approvalProgress.currentLevel`
4. Set next level's `status` to `'in_progress'`
5. Set next level's `startedAt` to current timestamp
6. Send notifications to next level's approvers

---

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "message": "Requirement not found",
  "error": {
    "code": "REQUIREMENT_NOT_FOUND",
    "details": "No requirement exists with the provided ID"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied",
  "error": {
    "code": "ACCESS_DENIED",
    "details": "You don't have permission to view this requirement"
  }
}
```

---

## Related Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `POST /api/v1/industry/requirements/:id/approve` | POST | Approve requirement at current level |
| `POST /api/v1/industry/requirements/:id/reject` | POST | Reject requirement with reason |
| `GET /api/v1/industry/requirements?status=pending` | GET | List all pending requirements |

See `requirements-pending-api.md` for approve/reject endpoint specifications.
