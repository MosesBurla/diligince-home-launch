# Requirements Comments API

## Overview
The Comments API allows users to add, view, update, and delete comments on requirements. Comments support various types including general discussions, approval feedback, clarification requests, and rejection reasons.

## Base URL
```
/api/industry/comments
```

## Authentication
All endpoints require authentication with JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### 1. Create Comment
**POST** `/api/industry/comments`

Create a new comment on a requirement.

#### Request Body (JSON)
```json
{
  "requirementId": "REQ-001",
  "content": "This requirement needs more details about the budget allocation.",
  "commentType": "clarification",
  "relatedApprovalStepId": "approval-step-1",
  "parentCommentId": null
}
```

#### Form Data (for file attachments)
```
Content-Type: multipart/form-data

requirementId: REQ-001
content: Comment text here
commentType: general
attachments: [file1, file2]
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "comment-123",
    "requirementId": "REQ-001",
    "userId": "user-456",
    "userName": "John Doe",
    "userRole": "Department Head",
    "content": "This requirement needs more details...",
    "commentType": "clarification",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": null,
    "isEdited": false,
    "attachments": [],
    "mentions": [],
    "parentCommentId": null
  }
}
```

---

### 2. Get Comments by Requirement
**GET** `/api/industry/comments/requirement/:requirementId`

Retrieve all comments for a specific requirement.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 50)
- `commentType` (optional): Filter by type (`general`, `approval_rejection`, `approval_request`, `clarification`)

#### Response (200 OK)
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
        "isEdited": false,
        "attachments": []
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 25,
      "totalPages": 1
    }
  }
}
```

---

### 3. Get Approval Comments
**GET** `/api/industry/comments/requirement/:requirementId/approval/:approvalStepId`

Get comments specifically related to an approval step (typically rejection feedback).

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "comment-789",
      "requirementId": "REQ-001",
      "userId": "approver-123",
      "userName": "Jane Smith",
      "userRole": "Finance Manager",
      "content": "Budget allocation unclear. Please revise section 3.",
      "commentType": "approval_rejection",
      "relatedApprovalStepId": "approval-step-2",
      "createdAt": "2025-01-14T15:20:00Z",
      "isEdited": false
    }
  ]
}
```

---

### 4. Update Comment
**PUT** `/api/industry/comments/:commentId`

Update an existing comment (only by comment author).

#### Request Body
```json
{
  "content": "Updated comment text"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "comment-123",
    "content": "Updated comment text",
    "updatedAt": "2025-01-15T11:00:00Z",
    "isEdited": true
  }
}
```

---

### 5. Delete Comment
**DELETE** `/api/industry/comments/:commentId`

Delete a comment (only by comment author or admin).

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

### 6. Upload Attachment
**POST** `/api/industry/comments/:commentId/attachments`

Add file attachments to an existing comment.

#### Request (multipart/form-data)
```
attachments: [file1, file2]
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "attachments": [
      {
        "id": "attach-001",
        "fileName": "document.pdf",
        "fileUrl": "https://storage/comments/attach-001.pdf",
        "fileType": "application/pdf",
        "fileSize": 245678,
        "uploadedAt": "2025-01-15T11:30:00Z"
      }
    ]
  }
}
```

---

### 7. Delete Attachment
**DELETE** `/api/industry/comments/:commentId/attachments/:attachmentId`

Remove a file attachment from a comment.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Attachment deleted successfully"
}
```

---

## Comment Types

| Type | Description | Use Case |
|------|-------------|----------|
| `general` | General discussion | Team communication, updates |
| `approval_rejection` | Approval rejection feedback | Reasons for rejection, required changes |
| `approval_request` | Approval request notes | Submitter's justification |
| `clarification` | Clarification request | Questions needing answers |

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_COMMENT_DATA",
    "message": "Comment content cannot be empty"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You can only edit your own comments"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "COMMENT_NOT_FOUND",
    "message": "Comment not found"
  }
}
```

---

## Business Rules

1. **Comment Permissions:**
   - All stakeholders can view comments
   - Only authenticated users can create comments
   - Users can only edit/delete their own comments
   - Admins can delete any comment

2. **Approval Comments:**
   - `approval_rejection` comments are created when approvers reject
   - These comments are highlighted in the draft editing view
   - Rejection comments require addressing before resubmission

3. **Attachments:**
   - Max 5 files per comment
   - Max file size: 10MB per file
   - Allowed types: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, JPEG

4. **Mentions:**
   - Use `@username` to mention users
   - Mentioned users receive notifications

5. **Threading:**
   - Comments can be replied to using `parentCommentId`
   - Max thread depth: 3 levels

---

## UI Integration Examples

### Display Comments on Requirement Details
```typescript
import { CommentsSection } from '@/components/requirement/CommentsSection';

<CommentsSection 
  requirementId="REQ-001"
  commentType="general"
  title="Discussion"
/>
```

### Show Rejection Feedback in Edit Mode
```typescript
<CommentsSection 
  requirementId="REQ-001"
  commentType="approval_rejection"
  title="Approval Feedback"
/>
```

### Add Comment with File
```typescript
const handleAddComment = async () => {
  const commentData = {
    requirementId: 'REQ-001',
    content: 'Comment text',
    commentType: 'general',
    attachments: files
  };
  
  await commentService.createComment(commentData);
};
```

---

## Integration Notes

1. **Backend Implementation Required:**
   - All endpoints need to be implemented in the backend
   - Database schema for comments table
   - File storage integration for attachments
   - Real-time notifications for new comments

2. **Frontend Features:**
   - Comments module is UI-ready
   - Backend integration pending
   - Will be enabled once API endpoints are live

3. **Security Considerations:**
   - Validate user permissions on all operations
   - Sanitize comment content to prevent XSS
   - Rate limit comment creation to prevent spam
   - Scan uploaded files for viruses
