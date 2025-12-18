# Requirements Approval Workflow API Documentation

## Overview

This document outlines the API specifications for the Requirements Approval Workflow system. All requirements are stored in a **single table** with a `status` field that determines which page/list they appear in.

---

## Architecture

### Single Table Design

All requirements are stored in one collection/table with status-based filtering:

```
requirements_table
├── status: enum ['draft', 'pending', 'approved', 'rejected', 'published', 'archived']
├── isSentForApproval: boolean
├── selectedApprovalMatrix: object (embedded or reference)
├── approvalProgress: object (tracks current approval state)
└── ... other requirement fields
```

### Status Flow

```
draft → pending → approved → published
          ↓
       rejected → draft (if resubmitted)
```

### Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | enum | Current status: `'draft'` \| `'pending'` \| `'approved'` \| `'rejected'` \| `'published'` \| `'archived'` |
| `isSentForApproval` | boolean | `true` if requirement has been sent for approval at least once |
| `selectedApprovalMatrixId` | string | ID of the selected approval matrix |
| `selectedApprovalMatrix` | object | Full approval matrix object with levels and approvers |
| `approvalProgress` | object | Current approval progress with level statuses |

---

## Base URL

```
/api/v1/industry/requirements
```

---

## 1. List Endpoints (Status-Based Filtering)

All list endpoints filter from the same table using the `status` field.

### 1.1 List Drafts

**Endpoint:** `GET /api/v1/industry/requirements/drafts`

**Description:** Returns all requirements with `status: 'draft'`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Items per page |
| `sortBy` | string | No | `createdAt` | Field to sort by |
| `sortOrder` | string | No | `desc` | Sort order: `'asc'` \| `'desc'` |
| `search` | string | No | - | Search in title, description |
| `category` | string | No | - | Filter by category |
| `priority` | string | No | - | Filter by priority |
| `department` | string | No | - | Filter by department |
| `dateFrom` | string | No | - | Filter from date (ISO 8601) |
| `dateTo` | string | No | - | Filter to date (ISO 8601) |

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "items": [
      {
        "draftId": "draft-REQ-2025-12-07-fdda124d",
        "title": "Office Equipment Procurement",
        "category": "goods",
        "priority": "high",
        "department": "Engineering",
        "estimatedBudget": 50000,
        "status": "draft",
        "isSentForApproval": false,
        "selectedApprovalMatrixId": "692db2822235430a814a3988",
        "createdAt": "2025-12-07T05:08:20.812Z",
        "updatedAt": "2025-12-08T13:39:55.157Z",
        "createdBy": {
          "id": "6925d6de23c5d620002a6eac",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "documentsCount": 4,
        "isValid": true,
        "expiresAt": "2025-12-15T13:39:55.151Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "statistics": {
      "total": 25,
      "validDrafts": 18,
      "expiringSoon": 5,
      "expired": 2
    }
  }
}
```

---

### 1.2 List Pending Approval

**Endpoint:** `GET /api/v1/industry/requirements/pending`

**Description:** Returns all requirements with `status: 'pending'`

**Query Parameters:** Same as drafts endpoint, plus:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `approvalLevel` | number | No | - | Filter by current approval level |
| `approverId` | string | No | - | Filter by pending approver ID |

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "items": [
      {
        "requirementId": "REQ-2025-12-07-fdda124d",
        "draftId": "draft-REQ-2025-12-07-fdda124d",
        "title": "Office Equipment Procurement",
        "category": "goods",
        "priority": "high",
        "department": "Engineering",
        "estimatedBudget": 50000,
        "status": "pending",
        "isSentForApproval": true,
        "sentForApprovalAt": "2025-12-08T14:00:00.000Z",
        "sentForApprovalBy": {
          "id": "6925d6de23c5d620002a6eac",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "selectedApprovalMatrixId": "692db2822235430a814a3988",
        "selectedApprovalMatrix": {
          "id": "692db2822235430a814a3988",
          "name": "Standard Approval",
          "totalLevels": 2
        },
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
                  "memberRole": "Manager",
                  "isMandatory": true,
                  "status": "pending",
                  "approvedAt": null,
                  "rejectedAt": null,
                  "comments": null
                }
              ],
              "startedAt": "2025-12-08T14:00:00.000Z",
              "completedAt": null
            },
            {
              "levelNumber": 2,
              "name": "Level 2",
              "status": "waiting",
              "approvers": [...],
              "startedAt": null,
              "completedAt": null
            }
          ],
          "estimatedCompletionDate": "2025-12-10T14:00:00.000Z"
        },
        "createdAt": "2025-12-07T05:08:20.812Z",
        "updatedAt": "2025-12-08T14:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 12,
      "totalPages": 2,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "statistics": {
      "total": 12,
      "awaitingMyApproval": 3,
      "level1Pending": 5,
      "level2Pending": 4,
      "level3Pending": 3,
      "overdueApprovals": 1
    }
  }
}
```

---

### 1.3 List Approved

**Endpoint:** `GET /api/v1/industry/requirements/approved`

**Description:** Returns all requirements with `status: 'approved'`

**Query Parameters:** Same as drafts endpoint.

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "items": [
      {
        "requirementId": "REQ-2025-12-07-fdda124d",
        "draftId": "draft-REQ-2025-12-07-fdda124d",
        "title": "Office Equipment Procurement",
        "category": "goods",
        "priority": "high",
        "department": "Engineering",
        "estimatedBudget": 50000,
        "status": "approved",
        "isSentForApproval": true,
        "approvedAt": "2025-12-09T10:00:00.000Z",
        "finalApprover": {
          "id": "692dad7a2235430a814a305c",
          "name": "Director Name",
          "email": "director@example.com"
        },
        "approvalSummary": {
          "totalLevels": 2,
          "completedLevels": 2,
          "totalApprovers": 4,
          "approvedBy": 4,
          "totalApprovalTime": "48 hours"
        },
        "readyToPublish": true,
        "createdAt": "2025-12-07T05:08:20.812Z",
        "updatedAt": "2025-12-09T10:00:00.000Z"
      }
    ],
    "pagination": {...},
    "statistics": {
      "total": 8,
      "readyToPublish": 6,
      "awaitingPublish": 8
    }
  }
}
```

---

### 1.4 List Published

**Endpoint:** `GET /api/v1/industry/requirements/published`

**Description:** Returns all requirements with `status: 'published'`

**Query Parameters:** Same as drafts endpoint, plus:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `isActive` | boolean | No | - | Filter active/inactive published requirements |
| `hasQuotations` | boolean | No | - | Filter requirements with quotations |

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "items": [
      {
        "requirementId": "REQ-2025-12-07-fdda124d",
        "title": "Office Equipment Procurement",
        "category": "goods",
        "priority": "high",
        "department": "Engineering",
        "estimatedBudget": 50000,
        "status": "published",
        "publishedAt": "2025-12-09T12:00:00.000Z",
        "publishedBy": {
          "id": "6925d6de23c5d620002a6eac",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "submissionDeadline": "2025-12-20T18:30:00.000Z",
        "isActive": true,
        "visibility": "all",
        "vendorNotifications": {
          "notifiedCount": 45,
          "viewedCount": 32,
          "quotationsReceived": 8
        },
        "quotationsSummary": {
          "total": 8,
          "underReview": 5,
          "shortlisted": 2,
          "rejected": 1
        },
        "createdAt": "2025-12-07T05:08:20.812Z",
        "updatedAt": "2025-12-09T12:00:00.000Z"
      }
    ],
    "pagination": {...},
    "statistics": {
      "total": 50,
      "active": 35,
      "expired": 15,
      "withQuotations": 42,
      "noQuotations": 8
    }
  }
}
```

---

### 1.5 List Archived

**Endpoint:** `GET /api/v1/industry/requirements/archived`

**Description:** Returns all requirements with `status: 'archived'`

**Query Parameters:** Same as drafts endpoint, plus:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `archivedReason` | string | No | - | Filter by archive reason |

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "items": [
      {
        "requirementId": "REQ-2025-12-07-fdda124d",
        "title": "Office Equipment Procurement",
        "category": "goods",
        "status": "archived",
        "previousStatus": "published",
        "archivedAt": "2025-12-15T10:00:00.000Z",
        "archivedBy": {
          "id": "6925d6de23c5d620002a6eac",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "archivedReason": "Requirement fulfilled",
        "createdAt": "2025-12-07T05:08:20.812Z"
      }
    ],
    "pagination": {...},
    "statistics": {
      "total": 100,
      "thisMonth": 15,
      "thisYear": 100
    }
  }
}
```

---

## 2. Status Transition Endpoints

### 2.1 Send for Approval

**Endpoint:** `POST /api/v1/industry/requirements/:draftId/send-for-approval`

**Description:** Sends a draft requirement for approval. Changes `status` from `'draft'` to `'pending'` and sets `isSentForApproval: true`.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `draftId` | string | Yes | The draft requirement ID |

**Request Body:**

```json
{
  "selectedApprovalMatrixId": "692db2822235430a814a3988",
  "submissionDeadline": "2025-12-20T18:30:00.000Z",
  "evaluationCriteria": ["price", "quality", "delivery"],
  "visibility": "all",
  "notifyByEmail": true,
  "notifyByApp": true,
  "termsAccepted": true,
  "notes": "Please review and approve urgently"
}
```

**Request Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `selectedApprovalMatrixId` | string | Yes | ID of the approval matrix to use |
| `submissionDeadline` | string | No | Deadline for vendor submissions (ISO 8601) |
| `evaluationCriteria` | array | No | Criteria for evaluating quotations |
| `visibility` | string | No | Visibility setting: `'all'` \| `'selected'` \| `'invited'` |
| `notifyByEmail` | boolean | No | Send email notifications to approvers |
| `notifyByApp` | boolean | No | Send in-app notifications to approvers |
| `termsAccepted` | boolean | Yes | User accepted terms and conditions |
| `notes` | string | No | Additional notes for approvers |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement sent for approval successfully",
  "data": {
    "requirementId": "REQ-2025-12-07-fdda124d",
    "draftId": "draft-REQ-2025-12-07-fdda124d",
    "status": "pending",
    "isSentForApproval": true,
    "sentForApprovalAt": "2025-12-08T14:00:00.000Z",
    "selectedApprovalMatrix": {
      "id": "692db2822235430a814a3988",
      "name": "Standard Approval",
      "levels": [
        {
          "levelNumber": 1,
          "name": "Level 1",
          "status": "in_progress",
          "maxApprovalTimeHours": 24,
          "approvers": [
            {
              "memberId": "6927429a2de4792cb3db7c9e",
              "memberName": "Jane Smith",
              "memberEmail": "jane@example.com",
              "memberRole": "Manager",
              "memberDepartment": "Finance",
              "isMandatory": true,
              "status": "pending",
              "notifiedAt": "2025-12-08T14:00:00.000Z"
            }
          ],
          "startedAt": "2025-12-08T14:00:00.000Z"
        },
        {
          "levelNumber": 2,
          "name": "Level 2",
          "status": "waiting",
          "maxApprovalTimeHours": 48,
          "approvers": [...],
          "startedAt": null
        }
      ]
    },
    "approvalProgress": {
      "currentLevel": 1,
      "totalLevels": 2,
      "estimatedCompletionDate": "2025-12-11T14:00:00.000Z"
    },
    "notifications": {
      "emailsSent": 2,
      "appNotificationsSent": 2
    }
  }
}
```

**Error Responses:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `INVALID_DRAFT` | Draft is incomplete or invalid |
| 400 | `APPROVAL_MATRIX_REQUIRED` | No approval matrix selected |
| 400 | `APPROVAL_MATRIX_NOT_FOUND` | Selected approval matrix not found |
| 400 | `ALREADY_SENT` | Requirement already sent for approval |
| 404 | `DRAFT_NOT_FOUND` | Draft not found |

---

### 2.2 Approve Requirement (Approver Action)

**Endpoint:** `POST /api/v1/industry/requirements/:requirementId/approve`

**Description:** Approves a requirement at the current level. If all mandatory approvers at current level approve, advances to next level. If final level completes, changes `status` to `'approved'`.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requirementId` | string | Yes | The requirement ID |

**Request Body:**

```json
{
  "comments": "Approved. Budget allocation confirmed.",
  "conditions": []
}
```

**Request Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `comments` | string | No | Approval comments |
| `conditions` | array | No | Any conditions attached to approval |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement approved successfully",
  "data": {
    "requirementId": "REQ-2025-12-07-fdda124d",
    "status": "pending",
    "approvalProgress": {
      "currentLevel": 2,
      "totalLevels": 2,
      "levels": [
        {
          "levelNumber": 1,
          "name": "Level 1",
          "status": "completed",
          "completedAt": "2025-12-08T16:00:00.000Z",
          "approvers": [
            {
              "memberId": "6927429a2de4792cb3db7c9e",
              "memberName": "Jane Smith",
              "status": "approved",
              "approvedAt": "2025-12-08T16:00:00.000Z",
              "comments": "Approved. Budget allocation confirmed."
            }
          ]
        },
        {
          "levelNumber": 2,
          "name": "Level 2",
          "status": "in_progress",
          "startedAt": "2025-12-08T16:00:00.000Z",
          "approvers": [...]
        }
      ]
    },
    "nextApprovers": [
      {
        "memberId": "692dad7a2235430a814a305c",
        "memberName": "Director Name",
        "memberEmail": "director@example.com",
        "notifiedAt": "2025-12-08T16:00:00.000Z"
      }
    ]
  }
}
```

**Final Approval Response (when all levels complete):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement fully approved",
  "data": {
    "requirementId": "REQ-2025-12-07-fdda124d",
    "status": "approved",
    "isSentForApproval": true,
    "approvedAt": "2025-12-09T10:00:00.000Z",
    "approvalProgress": {
      "currentLevel": 2,
      "totalLevels": 2,
      "allLevelsCompleted": true,
      "levels": [...]
    },
    "readyToPublish": true
  }
}
```

**Error Responses:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `NOT_PENDING` | Requirement not in pending status |
| 403 | `NOT_AUTHORIZED` | User not authorized to approve at current level |
| 403 | `ALREADY_APPROVED` | User already approved this requirement |
| 404 | `REQUIREMENT_NOT_FOUND` | Requirement not found |

---

### 2.3 Reject Requirement (Approver Action)

**Endpoint:** `POST /api/v1/industry/requirements/:requirementId/reject`

**Description:** Rejects a requirement. Changes `status` to `'rejected'`. Optionally allows resubmission.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requirementId` | string | Yes | The requirement ID |

**Request Body:**

```json
{
  "reason": "Budget exceeds department allocation for Q4",
  "comments": "Please revise budget or split into multiple requirements",
  "allowResubmission": true,
  "resubmissionDeadline": "2025-12-15T18:30:00.000Z"
}
```

**Request Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | Yes | Rejection reason |
| `comments` | string | No | Additional comments for requester |
| `allowResubmission` | boolean | No | Allow resubmission after revision (default: true) |
| `resubmissionDeadline` | string | No | Deadline for resubmission (ISO 8601) |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement rejected",
  "data": {
    "requirementId": "REQ-2025-12-07-fdda124d",
    "status": "rejected",
    "rejectedAt": "2025-12-08T17:00:00.000Z",
    "rejectedBy": {
      "id": "6927429a2de4792cb3db7c9e",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "Manager"
    },
    "rejectionDetails": {
      "reason": "Budget exceeds department allocation for Q4",
      "comments": "Please revise budget or split into multiple requirements",
      "levelRejectedAt": 1,
      "allowResubmission": true,
      "resubmissionDeadline": "2025-12-15T18:30:00.000Z"
    },
    "canResubmit": true
  }
}
```

**Error Responses:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `NOT_PENDING` | Requirement not in pending status |
| 400 | `REASON_REQUIRED` | Rejection reason is required |
| 403 | `NOT_AUTHORIZED` | User not authorized to reject at current level |
| 404 | `REQUIREMENT_NOT_FOUND` | Requirement not found |

---

### 2.4 Resubmit Rejected Requirement

**Endpoint:** `POST /api/v1/industry/requirements/:requirementId/resubmit`

**Description:** Resubmits a rejected requirement after revisions. Resets approval workflow and changes `status` back to `'pending'`.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requirementId` | string | Yes | The requirement ID |

**Request Body:**

```json
{
  "revisionNotes": "Budget revised as per feedback. Split into two phases.",
  "changesDescription": "Reduced total budget from 100K to 60K, added phased delivery"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement resubmitted for approval",
  "data": {
    "requirementId": "REQ-2025-12-07-fdda124d",
    "status": "pending",
    "resubmittedAt": "2025-12-10T09:00:00.000Z",
    "resubmissionCount": 1,
    "approvalProgress": {
      "currentLevel": 1,
      "totalLevels": 2,
      "levels": [...]
    }
  }
}
```

---

### 2.5 Publish Requirement

**Endpoint:** `POST /api/v1/industry/requirements/:requirementId/publish`

**Description:** Publishes an approved requirement. Changes `status` from `'approved'` to `'published'`.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requirementId` | string | Yes | The requirement ID |

**Request Body:**

```json
{
  "notifyVendors": true,
  "publishNotes": "Open for all registered vendors",
  "visibility": "all",
  "selectedVendors": [],
  "submissionDeadline": "2025-12-20T18:30:00.000Z"
}
```

**Request Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `notifyVendors` | boolean | No | Send notifications to vendors (default: true) |
| `publishNotes` | string | No | Notes visible to vendors |
| `visibility` | string | No | `'all'` \| `'selected'` \| `'invited'` |
| `selectedVendors` | array | No | Vendor IDs if visibility is `'selected'` |
| `submissionDeadline` | string | No | Override submission deadline |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement published successfully",
  "data": {
    "requirementId": "REQ-2025-12-07-fdda124d",
    "status": "published",
    "publishedAt": "2025-12-09T12:00:00.000Z",
    "publishedBy": {
      "id": "6925d6de23c5d620002a6eac",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "submissionDeadline": "2025-12-20T18:30:00.000Z",
    "visibility": "all",
    "vendorNotifications": {
      "totalVendors": 150,
      "notified": 145,
      "failed": 5
    },
    "publicUrl": "/requirements/REQ-2025-12-07-fdda124d"
  }
}
```

**Error Responses:**

| Status | Code | Description |
|--------|------|-------------|
| 400 | `NOT_APPROVED` | Requirement not in approved status |
| 400 | `APPROVAL_INCOMPLETE` | Approval workflow not complete |
| 404 | `REQUIREMENT_NOT_FOUND` | Requirement not found |

---

### 2.6 Emergency Publish (Skip Approval)

**Endpoint:** `POST /api/v1/industry/requirements/:draftId/emergency-publish`

**Description:** Publishes a draft directly without approval workflow. Requires special permission. Sets `emergencyPublished: true`.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `draftId` | string | Yes | The draft requirement ID |

**Request Body:**

```json
{
  "justification": "Critical production requirement - machinery breakdown",
  "notifyVendors": true,
  "submissionDeadline": "2025-12-10T18:30:00.000Z"
}
```

**Request Body Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `justification` | string | Yes | Justification for emergency publish |
| `notifyVendors` | boolean | No | Send vendor notifications |
| `submissionDeadline` | string | Yes | Deadline for submissions |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement emergency published",
  "data": {
    "requirementId": "REQ-2025-12-07-fdda124d",
    "status": "published",
    "emergencyPublished": true,
    "emergencyPublishedAt": "2025-12-08T14:00:00.000Z",
    "emergencyPublishedBy": {...},
    "justification": "Critical production requirement - machinery breakdown"
  }
}
```

---

### 2.7 Archive Requirement

**Endpoint:** `POST /api/v1/industry/requirements/:requirementId/archive`

**Description:** Archives a requirement. Can archive from any status.

**Request Body:**

```json
{
  "reason": "Requirement fulfilled",
  "notes": "PO issued and delivered"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement archived",
  "data": {
    "requirementId": "REQ-2025-12-07-fdda124d",
    "status": "archived",
    "previousStatus": "published",
    "archivedAt": "2025-12-20T10:00:00.000Z",
    "archivedBy": {...},
    "archivedReason": "Requirement fulfilled"
  }
}
```

---

## 3. Get Requirement Detail

### 3.1 Get Draft Detail

**Endpoint:** `GET /api/v1/industry/requirements/draft/:draftId`

**Description:** Returns full draft details with form data.

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "draftId": "draft-REQ-2025-12-07-fdda124d",
    "formData": {
      "draftId": "draft-REQ-2025-12-07-fdda124d",
      "currentStep": 1,
      "completedSteps": [],
      "title": "Office Equipment Procurement",
      "category": "goods",
      "priority": "critical",
      "description": "...",
      "businessJustification": "...",
      "department": "Engineering",
      "costCenter": "cc-1234",
      "estimatedBudget": 50000,
      "status": "draft",
      "isSentForApproval": false,
      "selectedApprovalMatrixId": "692db2822235430a814a3988",
      "selectedApprovalMatrix": {
        "id": "692db2822235430a814a3988",
        "name": "Standard Approval",
        "levels": [...]
      },
      "documents": [...],
      "certifications": [...],
      "isValid": true,
      "lastSaved": "2025-12-08T13:39:55.151Z",
      "expiresAt": "2025-12-15T13:39:55.151Z",
      "createdAt": "2025-12-07T05:08:20.812Z",
      "updatedAt": "2025-12-08T13:39:55.157Z"
    },
    "metadata": {
      "currentStep": 1,
      "lastSaved": "2025-12-08T13:39:55.151Z",
      "completedSteps": [],
      "selectedApprovalMatrix": {...}
    }
  }
}
```

---

### 3.2 Get Requirement Detail (Any Status)

**Endpoint:** `GET /api/v1/industry/requirements/:requirementId`

**Description:** Returns full requirement details for any status.

**Response includes status-specific fields based on current status.**

---

## 4. Bulk Operations

### 4.1 Bulk Delete Drafts

**Endpoint:** `POST /api/v1/industry/requirements/drafts/bulk-delete`

**Request Body:**

```json
{
  "draftIds": ["draft-1", "draft-2", "draft-3"]
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "successful": 3,
    "failed": 0,
    "errors": []
  }
}
```

---

### 4.2 Bulk Publish Approved

**Endpoint:** `POST /api/v1/industry/requirements/approved/bulk-publish`

**Request Body:**

```json
{
  "requirementIds": ["req-1", "req-2"],
  "notifyVendors": true
}
```

---

### 4.3 Bulk Archive

**Endpoint:** `POST /api/v1/industry/requirements/bulk-archive`

**Request Body:**

```json
{
  "requirementIds": ["req-1", "req-2"],
  "reason": "Q4 cleanup"
}
```

---

## 5. Export Endpoints

All list pages support CSV and XLSX export.

**Pattern:** `GET /api/v1/industry/requirements/{status}/export/{format}`

**Examples:**
- `GET /api/v1/industry/requirements/drafts/export/xlsx`
- `GET /api/v1/industry/requirements/pending/export/csv`
- `GET /api/v1/industry/requirements/published/export/xlsx`

**Query Parameters:** Same filters as list endpoints.

**Response:** Binary file download with appropriate Content-Type header.

---

## 6. Data Models

### RequirementStatus Enum

```typescript
type RequirementStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'archived';
```

### ApprovalLevelStatus Enum

```typescript
type ApprovalLevelStatus = 'waiting' | 'in_progress' | 'completed' | 'skipped';
```

### ApproverStatus Enum

```typescript
type ApproverStatus = 'pending' | 'approved' | 'rejected';
```

### ApprovalProgress Object

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
  description?: string;
  status: ApprovalLevelStatus;
  maxApprovalTimeHours: number;
  isRequired: boolean;
  approvers: Approver[];
  startedAt?: string;
  completedAt?: string;
}

interface Approver {
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberRole: string;
  memberDepartment: string;
  isMandatory: boolean;
  sequence: number;
  status: ApproverStatus;
  notifiedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  comments?: string;
}
```

---

## 7. Changes Summary for Existing APIs

### Draft Save/Update Endpoint Changes

**Endpoint:** `POST /api/v1/industry/requirements/draft/:draftId`

**Add to Response:**
- `isSentForApproval: boolean` (should be in response)
- `status: string` (should be in response)

### List Endpoints Changes

All list endpoints should include:
- `status` field in each item
- `isSentForApproval` field in each item
- Status-specific fields as documented above

### New Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/:draftId/send-for-approval` | POST | Send for approval |
| `/:requirementId/approve` | POST | Approver approves |
| `/:requirementId/reject` | POST | Approver rejects |
| `/:requirementId/resubmit` | POST | Resubmit rejected |
| `/:requirementId/publish` | POST | Publish approved |
| `/:draftId/emergency-publish` | POST | Emergency publish |
| `/:requirementId/archive` | POST | Archive requirement |
| `/approved/bulk-publish` | POST | Bulk publish |
| `/bulk-archive` | POST | Bulk archive |

---

## 8. Permissions Matrix

| Action | Required Permission |
|--------|---------------------|
| List Drafts | `requirements.drafts.read` |
| Create Draft | `requirements.create-requirement.write` |
| Send for Approval | `requirements.create-requirement.write` |
| Approve/Reject | User must be in current level approvers list |
| Publish | `requirements.approved.write` |
| Emergency Publish | `requirements.create-requirement.write` + special flag |
| Archive | `requirements.archived.write` |
| Bulk Operations | Same as individual + `delete` permission |
| Export | `{status}.download` permission |

---

## 9. Frontend Integration Notes

### Button Toggle Logic in PublishStep

```typescript
const getUIState = () => {
  // No approval matrix = direct publish allowed
  if (!formData.selectedApprovalMatrixId) return 'no_approval';
  
  // Based on API response fields
  if (formData.status === 'approved') return 'approved';
  if (formData.isSentForApproval && formData.status === 'pending') return 'pending';
  if (formData.status === 'rejected') return 'rejected';
  
  // Default: not yet sent
  return 'not_sent';
};

// UI States:
// 'not_sent' → Show "Send for Approval" button
// 'pending' → Show approval progress, disable publish
// 'approved' → Show "Publish" button
// 'rejected' → Show rejection details, "Resubmit" button
// 'no_approval' → Show "Publish" directly
```

### Status-Based Page Routing

| Page | API Call | Status Filter |
|------|----------|---------------|
| Drafts | `GET /requirements/drafts` | `status: 'draft'` |
| Pending Approval | `GET /requirements/pending` | `status: 'pending'` |
| Approved | `GET /requirements/approved` | `status: 'approved'` |
| Published | `GET /requirements/published` | `status: 'published'` |
| Archived | `GET /requirements/archived` | `status: 'archived'` |

---

*Document Version: 1.0*
*Last Updated: 2025-12-08*
