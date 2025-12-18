# Comments Backend Implementation Guide

> **Document Version:** 1.0  
> **Last Updated:** 2025-12-09  
> **Module:** Requirements Comments  
> **Estimated Implementation Time:** 27 hours

---

## Table of Contents

1. [Overview](#1-overview)
2. [MongoDB Schema](#2-mongodb-schema)
3. [API Endpoints](#3-api-endpoints)
4. [Email Notification Strategy](#4-email-notification-strategy)
5. [Email Template Specification](#5-email-template-specification)
6. [CommentEmailService Implementation](#6-commentemailservice-implementation)
7. [Permission Rules](#7-permission-rules)
8. [Seeder Configuration](#8-seeder-configuration)
9. [Error Codes](#9-error-codes)
10. [Backend Task Breakdown](#10-backend-task-breakdown)
11. [Key Design Decisions](#11-key-design-decisions)

---

## 1. Overview

The Comments feature enables users to add, view, edit, and delete comments on requirements. Comments are visible to all users within the same company who have access to the requirement. Each new comment triggers email notifications to relevant stakeholders using a **Hybrid Notification Strategy**.

### Key Features

- Add comments with different types (General, Clarification, Feedback, Approval)
- View all comments for a requirement with pagination
- Edit comments (within 24-hour window, author only)
- Soft delete comments (author or admin)
- Email notifications using Hybrid approach
- Company-scoped security

---

## 2. MongoDB Schema

### Collection: `requirement_comments`

```javascript
const RequirementCommentSchema = new mongoose.Schema({
  // ==========================================
  // REFERENCE FIELDS
  // ==========================================
  requirementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement',
    required: true,
    index: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  
  // ==========================================
  // COMMENT AUTHOR DETAILS (Denormalized for performance)
  // ==========================================
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  userRole: {
    type: String,
    default: 'Team Member'
  },
  userDepartment: {
    type: String,
    default: ''
  },
  userAvatar: {
    type: String,
    default: ''
  },
  
  // ==========================================
  // COMMENT CONTENT
  // ==========================================
  content: {
    type: String,
    required: true,
    maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    trim: true
  },
  commentType: {
    type: String,
    enum: ['general', 'clarification', 'feedback', 'approval'],
    default: 'general'
  },
  
  // ==========================================
  // TIMESTAMPS & EDIT TRACKING
  // ==========================================
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: null
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  
  // ==========================================
  // SOFT DELETE
  // ==========================================
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: false, // We manage createdAt/updatedAt manually
  versionKey: false
});

// ==========================================
// INDEXES FOR EFFICIENT QUERYING
// ==========================================

// Primary listing query - get comments for a requirement sorted by date
RequirementCommentSchema.index({ requirementId: 1, createdAt: -1 });

// Company-scoped queries with requirement
RequirementCommentSchema.index({ companyId: 1, requirementId: 1 });

// User's comments history
RequirementCommentSchema.index({ userId: 1, createdAt: -1 });

// Active comments filter (excluding soft-deleted)
RequirementCommentSchema.index({ isDeleted: 1, requirementId: 1, createdAt: -1 });

// Compound index for common query pattern
RequirementCommentSchema.index({ 
  requirementId: 1, 
  isDeleted: 1, 
  createdAt: -1 
});

module.exports = mongoose.model('RequirementComment', RequirementCommentSchema);
```

---

## 3. API Endpoints

### Endpoint Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/industry/comments` | Create new comment | Yes |
| GET | `/api/v1/industry/comments/requirement/:requirementId` | Get comments for requirement | Yes |
| PUT | `/api/v1/industry/comments/:commentId` | Update comment | Yes (Author only) |
| DELETE | `/api/v1/industry/comments/:commentId` | Soft delete comment | Yes (Author/Admin) |

---

### 3.1 POST `/api/v1/industry/comments`

Create a new comment on a requirement.

#### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Request Body

```json
{
  "requirementId": "6925d6de23c5d620002a6eac",
  "content": "Please clarify the delivery timeline for this requirement. We need to ensure alignment with Q1 targets.",
  "commentType": "clarification"
}
```

#### Request Body Schema

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `requirementId` | ObjectId | Yes | Valid MongoDB ObjectId | ID of the requirement |
| `content` | string | Yes | 1-2000 characters, trimmed, XSS sanitized | Comment text |
| `commentType` | enum | No | One of: 'general', 'clarification', 'feedback', 'approval' | Type of comment (default: 'general') |

#### Validation Rules (Joi Schema)

```javascript
const createCommentSchema = Joi.object({
  requirementId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid requirement ID format',
      'any.required': 'Requirement ID is required'
    }),
  content: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Comment content cannot be empty',
      'string.max': 'Comment cannot exceed 2000 characters',
      'any.required': 'Comment content is required'
    }),
  commentType: Joi.string()
    .valid('general', 'clarification', 'feedback', 'approval')
    .default('general')
});
```

#### Response (201 Created)

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Comment added successfully",
  "data": {
    "id": "675734a1b2c3d4e5f6789012",
    "requirementId": "6925d6de23c5d620002a6eac",
    "companyId": "6750a1b2c3d4e5f678901234",
    "userId": "6751b2c3d4e5f67890123456",
    "userName": "John Doe",
    "userEmail": "john.doe@company.com",
    "userRole": "Procurement Manager",
    "userDepartment": "Operations",
    "userAvatar": "https://storage.example.com/avatars/john-doe.jpg",
    "content": "Please clarify the delivery timeline for this requirement. We need to ensure alignment with Q1 targets.",
    "commentType": "clarification",
    "createdAt": "2025-12-09T10:30:00.000Z",
    "updatedAt": null,
    "isEdited": false
  },
  "meta": {
    "notificationsSent": 3,
    "notificationRecipients": [
      { "type": "creator", "count": 1 },
      { "type": "completed_level_approvers", "count": 1 },
      { "type": "current_level_approvers", "count": 1 }
    ]
  }
}
```

#### Controller Implementation

```javascript
// controllers/comment.controller.js

async createComment(req, res, next) {
  try {
    const { requirementId, content, commentType } = req.body;
    const currentUser = req.user;
    
    // 1. Validate requirement exists and user has access
    const requirement = await Requirement.findOne({
      _id: requirementId,
      companyId: currentUser.companyId,
      isDeleted: { $ne: true }
    }).populate('createdBy', 'firstName lastName email')
      .populate('approvalProgress.levels.approvers');
    
    if (!requirement) {
      throw new ApiError(404, 'REQUIREMENT_NOT_FOUND', 'Requirement not found');
    }
    
    // 2. Sanitize content (XSS prevention)
    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {}
    });
    
    // 3. Create comment
    const comment = await RequirementComment.create({
      requirementId,
      companyId: currentUser.companyId,
      userId: currentUser._id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userEmail: currentUser.email,
      userRole: currentUser.role || 'Team Member',
      userDepartment: currentUser.department || '',
      userAvatar: currentUser.avatar || '',
      content: sanitizedContent,
      commentType: commentType || 'general',
      createdAt: new Date()
    });
    
    // 4. Send email notifications (async, don't block response)
    const notificationResult = await commentEmailService.notifyNewComment(
      requirement,
      comment,
      {
        userId: currentUser._id,
        userName: comment.userName,
        userEmail: currentUser.email,
        userRole: comment.userRole,
        userDepartment: comment.userDepartment
      }
    );
    
    // 5. Return response
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Comment added successfully',
      data: {
        id: comment._id,
        requirementId: comment.requirementId,
        companyId: comment.companyId,
        userId: comment.userId,
        userName: comment.userName,
        userEmail: comment.userEmail,
        userRole: comment.userRole,
        userDepartment: comment.userDepartment,
        userAvatar: comment.userAvatar,
        content: comment.content,
        commentType: comment.commentType,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        isEdited: comment.isEdited
      },
      meta: {
        notificationsSent: notificationResult.length,
        notificationRecipients: summarizeRecipients(notificationResult)
      }
    });
  } catch (error) {
    next(error);
  }
}
```

---

### 3.2 GET `/api/v1/industry/comments/requirement/:requirementId`

Get all comments for a specific requirement with pagination.

#### Request Headers

```
Authorization: Bearer <access_token>
```

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requirementId` | string | Yes | MongoDB ObjectId of the requirement |

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 50 | Items per page (max: 100) |
| `sortBy` | string | No | 'createdAt' | Sort field |
| `sortOrder` | string | No | 'desc' | Sort order: 'asc' or 'desc' |
| `commentType` | string | No | - | Filter by comment type |

#### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "comments": [
      {
        "id": "675734a1b2c3d4e5f6789012",
        "requirementId": "6925d6de23c5d620002a6eac",
        "userId": "6751b2c3d4e5f67890123456",
        "userName": "John Doe",
        "userEmail": "john.doe@company.com",
        "userRole": "Procurement Manager",
        "userDepartment": "Operations",
        "userAvatar": "https://storage.example.com/avatars/john-doe.jpg",
        "content": "Please clarify the delivery timeline for this requirement.",
        "commentType": "clarification",
        "createdAt": "2025-12-09T10:30:00.000Z",
        "updatedAt": null,
        "isEdited": false
      },
      {
        "id": "675734b2c3d4e5f67890123",
        "requirementId": "6925d6de23c5d620002a6eac",
        "userId": "6752c3d4e5f678901234567",
        "userName": "Jane Smith",
        "userEmail": "jane.smith@company.com",
        "userRole": "Finance Manager",
        "userDepartment": "Finance",
        "userAvatar": "https://storage.example.com/avatars/jane-smith.jpg",
        "content": "Budget has been approved for this procurement.",
        "commentType": "approval",
        "createdAt": "2025-12-09T09:15:00.000Z",
        "updatedAt": "2025-12-09T09:20:00.000Z",
        "isEdited": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 12,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

#### Controller Implementation

```javascript
// controllers/comment.controller.js

async getCommentsByRequirement(req, res, next) {
  try {
    const { requirementId } = req.params;
    const { 
      page = 1, 
      limit = 50, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      commentType 
    } = req.query;
    
    const currentUser = req.user;
    
    // 1. Validate requirement exists and user has access
    const requirement = await Requirement.findOne({
      _id: requirementId,
      companyId: currentUser.companyId,
      isDeleted: { $ne: true }
    });
    
    if (!requirement) {
      throw new ApiError(404, 'REQUIREMENT_NOT_FOUND', 'Requirement not found');
    }
    
    // 2. Build query
    const query = {
      requirementId,
      companyId: currentUser.companyId,
      isDeleted: false
    };
    
    if (commentType) {
      query.commentType = commentType;
    }
    
    // 3. Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    
    // 4. Build sort
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // 5. Execute queries in parallel
    const [comments, total] = await Promise.all([
      RequirementComment.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      RequirementComment.countDocuments(query)
    ]);
    
    // 6. Calculate pagination metadata
    const totalPages = Math.ceil(total / limitNum);
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        comments: comments.map(comment => ({
          id: comment._id,
          requirementId: comment.requirementId,
          userId: comment.userId,
          userName: comment.userName,
          userEmail: comment.userEmail,
          userRole: comment.userRole,
          userDepartment: comment.userDepartment,
          userAvatar: comment.userAvatar,
          content: comment.content,
          commentType: comment.commentType,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          isEdited: comment.isEdited
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPreviousPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
}
```

---

### 3.3 PUT `/api/v1/industry/comments/:commentId`

Update an existing comment. Only the comment author can edit, and only within 24 hours of creation.

#### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `commentId` | string | Yes | MongoDB ObjectId of the comment |

#### Request Body

```json
{
  "content": "Updated comment text with more specific details about the delivery timeline requirements."
}
```

#### Request Body Schema

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `content` | string | Yes | 1-2000 characters, trimmed, XSS sanitized | Updated comment text |

#### Validation Rules

```javascript
const updateCommentSchema = Joi.object({
  content: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Comment content cannot be empty',
      'string.max': 'Comment cannot exceed 2000 characters',
      'any.required': 'Comment content is required'
    })
});
```

#### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Comment updated successfully",
  "data": {
    "id": "675734a1b2c3d4e5f6789012",
    "content": "Updated comment text with more specific details about the delivery timeline requirements.",
    "updatedAt": "2025-12-09T11:00:00.000Z",
    "isEdited": true
  }
}
```

#### Error Response (403 - Edit Window Expired)

```json
{
  "success": false,
  "statusCode": 403,
  "error": {
    "code": "EDIT_WINDOW_EXPIRED",
    "message": "Comments can only be edited within 24 hours of creation"
  }
}
```

#### Controller Implementation

```javascript
// controllers/comment.controller.js

async updateComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const currentUser = req.user;
    
    // 1. Find the comment
    const comment = await RequirementComment.findOne({
      _id: commentId,
      companyId: currentUser.companyId,
      isDeleted: false
    });
    
    if (!comment) {
      throw new ApiError(404, 'COMMENT_NOT_FOUND', 'Comment not found');
    }
    
    // 2. Check if user is the author
    if (comment.userId.toString() !== currentUser._id.toString()) {
      throw new ApiError(403, 'NOT_AUTHORIZED', 'Only the comment author can edit this comment');
    }
    
    // 3. Check 24-hour edit window
    const hoursSinceCreation = (Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      throw new ApiError(403, 'EDIT_WINDOW_EXPIRED', 'Comments can only be edited within 24 hours of creation');
    }
    
    // 4. Sanitize content
    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {}
    });
    
    // 5. Update comment
    comment.content = sanitizedContent;
    comment.updatedAt = new Date();
    comment.isEdited = true;
    await comment.save();
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Comment updated successfully',
      data: {
        id: comment._id,
        content: comment.content,
        updatedAt: comment.updatedAt,
        isEdited: comment.isEdited
      }
    });
  } catch (error) {
    next(error);
  }
}
```

---

### 3.4 DELETE `/api/v1/industry/comments/:commentId`

Soft delete a comment. Only the comment author or IndustryAdmin can delete.

#### Request Headers

```
Authorization: Bearer <access_token>
```

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `commentId` | string | Yes | MongoDB ObjectId of the comment |

#### Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Comment deleted successfully"
}
```

#### Controller Implementation

```javascript
// controllers/comment.controller.js

async deleteComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const currentUser = req.user;
    
    // 1. Find the comment
    const comment = await RequirementComment.findOne({
      _id: commentId,
      companyId: currentUser.companyId,
      isDeleted: false
    });
    
    if (!comment) {
      throw new ApiError(404, 'COMMENT_NOT_FOUND', 'Comment not found');
    }
    
    // 2. Check authorization (author or admin)
    const isAuthor = comment.userId.toString() === currentUser._id.toString();
    const isAdmin = currentUser.role === 'IndustryAdmin';
    
    if (!isAuthor && !isAdmin) {
      throw new ApiError(403, 'NOT_AUTHORIZED', 'You do not have permission to delete this comment');
    }
    
    // 3. Soft delete
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    comment.deletedBy = currentUser._id;
    await comment.save();
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
```

---

## 4. Email Notification Strategy

### Hybrid Approach

The Comments feature uses a **Hybrid Notification Strategy** that balances transparency with notification noise reduction.

### Who Gets Notified

| Recipient Type | Description | Rationale |
|----------------|-------------|-----------|
| **Requirement Creator** | Always notified | Owner must know all activity on their requirement |
| **Completed Level Approvers** | All approvers from levels that have already approved | They have context and may need to provide input |
| **Current Active Level Approvers** | All approvers in the level currently awaiting approval | They may need this information for their decision |

### Who Does NOT Get Notified

| Excluded | Reason |
|----------|--------|
| Comment Author | Don't notify self |
| Waiting Level Approvers | Levels not yet active - they'll get context when their level activates |
| Duplicate Emails | Deduplicate by email address |

### Notification Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     NEW COMMENT NOTIFICATION FLOW                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   1. New Comment Created                                                 │
│              │                                                           │
│              ▼                                                           │
│   2. Get Requirement with Approval Progress                              │
│              │                                                           │
│              ▼                                                           │
│   3. Build Recipients List:                                              │
│      ┌──────────────────────────────────────────────────────┐           │
│      │                                                       │           │
│      │  ① Requirement Creator (always)                      │           │
│      │       ↓                                               │           │
│      │  ② Completed Level Approvers                         │           │
│      │     (Level 1 ✓, Level 2 ✓, etc.)                     │           │
│      │       ↓                                               │           │
│      │  ③ Current Active Level Approvers                    │           │
│      │     (Level currently in_progress)                     │           │
│      │                                                       │           │
│      └──────────────────────────────────────────────────────┘           │
│              │                                                           │
│              ▼                                                           │
│   4. Remove Duplicates & Comment Author                                  │
│              │                                                           │
│              ▼                                                           │
│   5. Send Email to Each Recipient                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Example Scenario

**Requirement:** "IT Equipment Procurement"
- Creator: Alice (alice@company.com)
- Approval Matrix with 3 Levels:
  - Level 1: Bob (Approved ✓), Carol (Approved ✓)
  - Level 2: Dave (Pending), Eve (Pending) ← Current Active Level
  - Level 3: Frank (Waiting)

**When John adds a comment:**

Recipients who will receive email notification:
1. ✅ Alice (Creator)
2. ✅ Bob (Completed Level 1)
3. ✅ Carol (Completed Level 1)
4. ✅ Dave (Current Level 2)
5. ✅ Eve (Current Level 2)
6. ❌ Frank (Level 3 - Not yet active)
7. ❌ John (Comment author - excluded)

---

## 5. Email Template Specification

### Template ID: `new-comment-notification`

### Subject Line

```
New comment on "${requirementTitle}" by ${commentAuthorName}
```

### Template Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `recipientName` | string | Name of person receiving email | "John Doe" |
| `commentAuthorName` | string | Name of person who added comment | "Jane Smith" |
| `commentAuthorRole` | string | Role of comment author | "Procurement Manager" |
| `commentAuthorDepartment` | string | Department of comment author | "Operations" |
| `commentAuthorAvatar` | string | Avatar URL of comment author | "https://..." |
| `commentContent` | string | The comment text (truncated to 200 chars) | "Please clarify..." |
| `commentContentFull` | string | Full comment text | "Please clarify the delivery..." |
| `commentType` | string | Formatted type | "Clarification" |
| `commentTypeBadgeColor` | string | CSS color for type badge | "#3B82F6" |
| `requirementTitle` | string | Title of the requirement | "IT Equipment Procurement" |
| `requirementId` | string | Requirement ID for reference | "REQ-2025-0042" |
| `category` | string | Requirement category | "IT Hardware" |
| `priority` | string | Requirement priority | "High" |
| `commentedAt` | string | Formatted date/time of comment | "December 9, 2025 at 10:30 AM" |
| `viewUrl` | string | Direct link to requirement with comments | "https://app.../requirements/..." |
| `appUrl` | string | Application base URL | "https://app.diligince.ai" |
| `privacyUrl` | string | Privacy policy link | "https://diligince.ai/privacy" |
| `termsUrl` | string | Terms of service link | "https://diligince.ai/terms" |
| `unsubscribeUrl` | string | Unsubscribe link | "https://app.../unsubscribe" |
| `currentYear` | number | Current year for footer | 2025 |

### Email Template Design

**Design Requirements (Following Diligince Theme):**

- Header: Corporate Navy (#153b60) with Diligince logo
- Body: White background (#FFFFFF)
- Max width: 600px, centered
- Font: System font stack (San Francisco, Segoe UI, Roboto, etc.)
- CTA Button: Navy background (#153b60), white text, 8px border radius
- Comment box: Light gray background (#F9FAFB), 8px border radius
- Footer: Gray text (#6B7280), links to Privacy, Terms, Unsubscribe

### HTML Template Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Comment on Requirement</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F3F4F6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #153b60; padding: 24px 32px;">
              <img src="{{appUrl}}/logo-white.png" alt="Diligince" width="140" style="display: block;">
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <!-- Greeting -->
              <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
                Hi {{recipientName}},
              </p>
              
              <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.5;">
                <strong>{{commentAuthorName}}</strong> ({{commentAuthorRole}}) added a new comment on a requirement you're involved with.
              </p>
              
              <!-- Requirement Info Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 4px; font-size: 14px; color: #6B7280;">Requirement</p>
                    <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #111827;">{{requirementTitle}}</p>
                    <p style="margin: 0; font-size: 14px; color: #6B7280;">
                      {{category}} • {{priority}} Priority
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Comment Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <!-- Author Info -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #153b60; color: #FFFFFF; font-size: 16px; font-weight: 600; text-align: center; line-height: 40px;">
                            {{commentAuthorInitials}}
                          </div>
                        </td>
                        <td style="vertical-align: middle;">
                          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">{{commentAuthorName}}</p>
                          <p style="margin: 0; font-size: 12px; color: #6B7280;">{{commentAuthorRole}} • {{commentAuthorDepartment}}</p>
                        </td>
                        <td style="vertical-align: middle; text-align: right;">
                          <span style="display: inline-block; padding: 4px 8px; background-color: {{commentTypeBadgeColor}}20; color: {{commentTypeBadgeColor}}; font-size: 12px; font-weight: 500; border-radius: 4px;">
                            {{commentType}}
                          </span>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Comment Content -->
                    <div style="background-color: #F9FAFB; border-radius: 8px; padding: 12px;">
                      <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
                        "{{commentContent}}"
                      </p>
                    </div>
                    
                    <!-- Timestamp -->
                    <p style="margin: 12px 0 0; font-size: 12px; color: #9CA3AF;">
                      {{commentedAt}}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="{{viewUrl}}" style="display: inline-block; padding: 12px 32px; background-color: #153b60; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 8px;">
                      View & Reply
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 24px 32px; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6B7280; text-align: center;">
                Diligince AI • Intelligent Procurement Platform
              </p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF; text-align: center;">
                <a href="{{privacyUrl}}" style="color: #6B7280; text-decoration: none;">Privacy Policy</a> • 
                <a href="{{termsUrl}}" style="color: #6B7280; text-decoration: none;">Terms of Service</a> • 
                <a href="{{unsubscribeUrl}}" style="color: #6B7280; text-decoration: none;">Unsubscribe</a>
              </p>
              <p style="margin: 16px 0 0; font-size: 12px; color: #9CA3AF; text-align: center;">
                © {{currentYear}} Diligince AI. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Comment Type Badge Colors

| Type | Background | Text Color | Hex |
|------|------------|------------|-----|
| General | Gray 10% | Gray | #6B7280 |
| Clarification | Blue 10% | Blue | #3B82F6 |
| Feedback | Green 10% | Green | #10B981 |
| Approval | Purple 10% | Purple | #8B5CF6 |

---

## 6. CommentEmailService Implementation

### Service Class

```javascript
// services/email/comment-email.service.js

const EmailService = require('./email.service');
const EmailTemplate = require('../../models/email-template.model');

class CommentEmailService {
  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Send notification for new comment
   * Uses Hybrid Approach: Creator + Completed Levels + Current Level Approvers
   * 
   * @param {Object} requirement - The requirement document with approval progress
   * @param {Object} comment - The newly created comment
   * @param {Object} commentAuthor - Author details { userId, userName, userEmail, userRole, userDepartment }
   * @returns {Array} - Array of notification results
   */
  async notifyNewComment(requirement, comment, commentAuthor) {
    const notifications = [];
    
    try {
      // 1. Get email template
      const template = await EmailTemplate.findOne({ 
        templateId: 'new-comment-notification',
        isActive: true
      });
      
      if (!template) {
        console.warn('Email template "new-comment-notification" not found or inactive');
        return notifications;
      }
      
      // 2. Get recipients using hybrid approach
      const recipients = this.getHybridRecipients(requirement, commentAuthor);
      
      if (recipients.length === 0) {
        console.log('No recipients for comment notification');
        return notifications;
      }
      
      // 3. Prepare base context
      const baseContext = this.buildBaseContext(requirement, comment, commentAuthor);
      
      // 4. Send emails to each recipient
      for (const recipient of recipients) {
        const result = await this.sendNotification(template, recipient, baseContext);
        notifications.push(result);
      }
      
      return notifications;
    } catch (error) {
      console.error('Error sending comment notifications:', error);
      return notifications;
    }
  }

  /**
   * Hybrid Approach: Get recipients for comment notification
   * - Requirement Creator (always)
   * - Completed Level Approvers (have context)
   * - Current Active Level Approvers (need info for decision)
   */
  getHybridRecipients(requirement, commentAuthor) {
    const recipientMap = new Map();
    
    // 1. Always add requirement creator (if not the comment author)
    if (requirement.createdBy && requirement.createdBy.email !== commentAuthor.userEmail) {
      recipientMap.set(requirement.createdBy.email, {
        id: requirement.createdBy._id || requirement.createdBy.id,
        name: this.getFullName(requirement.createdBy),
        email: requirement.createdBy.email,
        type: 'creator'
      });
    }
    
    // 2. Process approval levels if they exist
    if (requirement.approvalProgress?.levels && Array.isArray(requirement.approvalProgress.levels)) {
      for (const level of requirement.approvalProgress.levels) {
        const shouldInclude = level.status === 'completed' || level.status === 'in_progress';
        
        if (shouldInclude && level.approvers && Array.isArray(level.approvers)) {
          for (const approver of level.approvers) {
            // Skip if this is the comment author
            if (approver.memberEmail === commentAuthor.userEmail) {
              continue;
            }
            
            // Skip if already added (deduplication)
            if (recipientMap.has(approver.memberEmail)) {
              continue;
            }
            
            recipientMap.set(approver.memberEmail, {
              id: approver.memberId,
              name: approver.memberName,
              email: approver.memberEmail,
              type: level.status === 'completed' ? 'completed_level_approver' : 'current_level_approver'
            });
          }
        }
      }
    }
    
    return Array.from(recipientMap.values());
  }

  /**
   * Build base context for email template
   */
  buildBaseContext(requirement, comment, commentAuthor) {
    return {
      // Comment Author
      commentAuthorName: commentAuthor.userName,
      commentAuthorRole: commentAuthor.userRole || 'Team Member',
      commentAuthorDepartment: commentAuthor.userDepartment || '',
      commentAuthorInitials: this.getInitials(commentAuthor.userName),
      
      // Comment Content
      commentContent: this.truncateContent(comment.content, 200),
      commentContentFull: comment.content,
      commentType: this.formatCommentType(comment.commentType),
      commentTypeBadgeColor: this.getTypeBadgeColor(comment.commentType),
      commentedAt: this.formatDate(comment.createdAt),
      
      // Requirement
      requirementTitle: requirement.title,
      requirementId: requirement.requirementId || requirement._id.toString(),
      category: requirement.category || 'General',
      priority: requirement.priority || 'Medium',
      
      // URLs
      viewUrl: `${process.env.APP_URL}/dashboard/requirements/${requirement._id}?panel=comments`,
      appUrl: process.env.APP_URL,
      privacyUrl: `${process.env.APP_URL}/privacy`,
      termsUrl: `${process.env.APP_URL}/terms`,
      unsubscribeUrl: `${process.env.APP_URL}/settings/notifications`,
      
      // Misc
      currentYear: new Date().getFullYear()
    };
  }

  /**
   * Send individual notification
   */
  async sendNotification(template, recipient, baseContext) {
    const context = {
      ...baseContext,
      recipientName: recipient.name
    };
    
    try {
      await this.emailService.send({
        to: recipient.email,
        subject: this.parseTemplate(template.subject, context),
        template: template.filePath,
        context
      });
      
      return {
        templateId: 'new-comment-notification',
        recipientId: recipient.id,
        recipientEmail: recipient.email,
        recipientName: recipient.name,
        recipientType: recipient.type,
        sentAt: new Date(),
        status: 'sent'
      };
    } catch (error) {
      console.error(`Failed to send notification to ${recipient.email}:`, error);
      return {
        templateId: 'new-comment-notification',
        recipientEmail: recipient.email,
        recipientType: recipient.type,
        sentAt: new Date(),
        status: 'failed',
        errorMessage: error.message
      };
    }
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  getFullName(user) {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || user.email || 'Unknown';
  }

  getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  truncateContent(content, maxLength) {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  }

  formatCommentType(type) {
    const labels = {
      general: 'General',
      clarification: 'Clarification',
      feedback: 'Feedback',
      approval: 'Approval Related'
    };
    return labels[type] || 'General';
  }

  getTypeBadgeColor(type) {
    const colors = {
      general: '#6B7280',
      clarification: '#3B82F6',
      feedback: '#10B981',
      approval: '#8B5CF6'
    };
    return colors[type] || colors.general;
  }

  formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  parseTemplate(template, context) {
    let result = template;
    for (const [key, value] of Object.entries(context)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
      result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value || '');
    }
    return result;
  }
}

module.exports = new CommentEmailService();
```

---

## 7. Permission Rules

### Access Control Matrix

| Action | Who Can Perform | Validation Logic |
|--------|-----------------|------------------|
| **View comments** | Any authenticated user in same company | `comment.companyId === user.companyId` |
| **Add comment** | Any authenticated user with read access to requirement | User can access requirement + `user.companyId === requirement.companyId` |
| **Edit comment** | Only comment author (within 24 hours) | `comment.userId === user._id` AND `hoursSinceCreation <= 24` |
| **Delete comment** | Comment author OR IndustryAdmin | `comment.userId === user._id` OR `user.role === 'IndustryAdmin'` |

### Permission Middleware

```javascript
// middleware/comment-permissions.middleware.js

const checkCommentAccess = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const currentUser = req.user;
    
    const comment = await RequirementComment.findOne({
      _id: commentId,
      isDeleted: false
    });
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: { code: 'COMMENT_NOT_FOUND', message: 'Comment not found' }
      });
    }
    
    // Check company access
    if (comment.companyId.toString() !== currentUser.companyId.toString()) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        error: { code: 'NOT_AUTHORIZED', message: 'Access denied' }
      });
    }
    
    req.comment = comment;
    next();
  } catch (error) {
    next(error);
  }
};

const checkCommentEditPermission = async (req, res, next) => {
  const comment = req.comment;
  const currentUser = req.user;
  
  // Only author can edit
  if (comment.userId.toString() !== currentUser._id.toString()) {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      error: { code: 'NOT_AUTHORIZED', message: 'Only the comment author can edit' }
    });
  }
  
  // Check 24-hour window
  const hoursSinceCreation = (Date.now() - new Date(comment.createdAt).getTime()) / (1000 * 60 * 60);
  if (hoursSinceCreation > 24) {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      error: { code: 'EDIT_WINDOW_EXPIRED', message: 'Comments can only be edited within 24 hours' }
    });
  }
  
  next();
};

const checkCommentDeletePermission = async (req, res, next) => {
  const comment = req.comment;
  const currentUser = req.user;
  
  const isAuthor = comment.userId.toString() === currentUser._id.toString();
  const isAdmin = currentUser.role === 'IndustryAdmin';
  
  if (!isAuthor && !isAdmin) {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      error: { code: 'NOT_AUTHORIZED', message: 'Permission denied' }
    });
  }
  
  next();
};

module.exports = {
  checkCommentAccess,
  checkCommentEditPermission,
  checkCommentDeletePermission
};
```

---

## 8. Seeder Configuration

### Email Template Seeder Entry

Add to: `seeders/email-templates.seeder.js`

```javascript
{
  templateId: 'new-comment-notification',
  name: 'New Comment Notification',
  subject: 'New comment on "${requirementTitle}" by ${commentAuthorName}',
  description: 'Sent when a new comment is added to a requirement. Uses Hybrid notification strategy to notify creator, completed level approvers, and current level approvers.',
  category: 'requirements',
  filePath: 'templates/comments/new-comment-notification.html',
  isActive: true,
  variables: [
    'recipientName',
    'commentAuthorName',
    'commentAuthorRole',
    'commentAuthorDepartment',
    'commentAuthorInitials',
    'commentContent',
    'commentContentFull',
    'commentType',
    'commentTypeBadgeColor',
    'requirementTitle',
    'requirementId',
    'category',
    'priority',
    'commentedAt',
    'viewUrl',
    'appUrl',
    'privacyUrl',
    'termsUrl',
    'unsubscribeUrl',
    'currentYear'
  ],
  notificationStrategy: 'hybrid',
  notificationRecipients: [
    'requirement_creator',
    'completed_level_approvers',
    'current_level_approvers'
  ],
  createdAt: new Date(),
  updatedAt: new Date()
}
```

---

## 9. Error Codes

### API Error Responses

| Error Code | HTTP Status | Description | When Thrown |
|------------|-------------|-------------|-------------|
| `COMMENT_NOT_FOUND` | 404 | Comment does not exist | GET/PUT/DELETE with invalid commentId |
| `REQUIREMENT_NOT_FOUND` | 404 | Requirement does not exist | POST with invalid requirementId |
| `INVALID_COMMENT_DATA` | 400 | Missing or invalid comment content | POST/PUT with empty content |
| `CONTENT_TOO_LONG` | 400 | Comment exceeds 2000 characters | POST/PUT with content > 2000 chars |
| `INVALID_COMMENT_TYPE` | 400 | Invalid commentType value | POST with invalid enum value |
| `NOT_AUTHORIZED` | 403 | User cannot perform this action | Edit/Delete without permission |
| `EDIT_WINDOW_EXPIRED` | 403 | Cannot edit after 24 hours | PUT after 24 hours |
| `VALIDATION_ERROR` | 400 | Request validation failed | Any validation failure |
| `INTERNAL_ERROR` | 500 | Server error | Unexpected errors |

### Error Response Format

```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "INVALID_COMMENT_DATA",
    "message": "Comment content cannot be empty",
    "details": [
      {
        "field": "content",
        "message": "Content is required"
      }
    ]
  }
}
```

---

## 10. Backend Task Breakdown

### Implementation Tasks

| Task ID | Task | Est. Hours | Dependencies | Priority |
|---------|------|------------|--------------|----------|
| **COMMENTS-001** | Create MongoDB collection schema & indexes | 2 | None | High |
| **COMMENTS-002** | Implement POST /comments endpoint | 4 | COMMENTS-001 | High |
| **COMMENTS-003** | Implement GET /comments/requirement/:id endpoint | 3 | COMMENTS-001 | High |
| **COMMENTS-004** | Implement PUT /comments/:id endpoint | 2 | COMMENTS-001 | Medium |
| **COMMENTS-005** | Implement DELETE /comments/:id endpoint | 2 | COMMENTS-001 | Medium |
| **COMMENTS-006** | Create email template HTML | 4 | None | High |
| **COMMENTS-007** | Register template in seeder | 1 | COMMENTS-006 | High |
| **COMMENTS-008** | Implement CommentEmailService class | 4 | COMMENTS-006, 007 | High |
| **COMMENTS-009** | Integrate email sending in POST endpoint | 2 | COMMENTS-002, 008 | High |
| **COMMENTS-010** | Add validation & XSS sanitization | 2 | COMMENTS-002 | High |
| **COMMENTS-011** | Update routes & integrate | 1 | All above | High |
| | **TOTAL** | **27 hours** | | |

### Task Dependencies Diagram

```
COMMENTS-001 (Schema)
       │
       ├──► COMMENTS-002 (POST) ──► COMMENTS-009 (Email Integration)
       │           │
       │           └──► COMMENTS-010 (Validation)
       │
       ├──► COMMENTS-003 (GET)
       │
       ├──► COMMENTS-004 (PUT)
       │
       └──► COMMENTS-005 (DELETE)

COMMENTS-006 (Template HTML)
       │
       └──► COMMENTS-007 (Seeder) ──► COMMENTS-008 (Email Service)
                                              │
                                              └──► COMMENTS-009
                                              
All Tasks ──► COMMENTS-011 (Routes)
```

### Recommended Implementation Order

1. **Week 1 (Day 1-2):** COMMENTS-001, COMMENTS-006
2. **Week 1 (Day 3-4):** COMMENTS-002, COMMENTS-003, COMMENTS-007
3. **Week 1 (Day 5):** COMMENTS-008, COMMENTS-010
4. **Week 2 (Day 1):** COMMENTS-004, COMMENTS-005
5. **Week 2 (Day 2):** COMMENTS-009, COMMENTS-011

---

## 11. Key Design Decisions

### Summary of Design Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Storage** | Separate `requirement_comments` collection | Scalability - comments can grow large; separate collection allows efficient queries and indexing |
| **Notification Strategy** | Hybrid Approach | Balance between transparency and noise reduction |
| **Delete Strategy** | Soft delete | Maintain audit trail; allow recovery if needed |
| **Edit Window** | 24 hours | Allow corrections without enabling abuse |
| **Attachments** | Not included (MVP) | Simplify initial implementation; can be added as enhancement |
| **Threading** | Not included (MVP) | Flat comment list for simplicity; threading can be added later |
| **Company Scope** | All comments scoped to company | Security - prevent cross-company data access |
| **Content Sanitization** | XSS prevention on all content | Security - prevent script injection |
| **Author Details** | Denormalized in comment | Performance - avoid joins on every comment fetch |

### Future Enhancements (Not in MVP)

1. **Comment Attachments** - Allow file uploads with comments
2. **Threading/Replies** - Nested comment threads
3. **Mentions** - @mention users in comments
4. **Reactions** - Emoji reactions on comments
5. **Rich Text** - Markdown or rich text formatting
6. **Real-time Updates** - WebSocket for live comment updates
7. **Comment Search** - Full-text search across comments

---

## Appendix A: Routes Configuration

### Routes File

```javascript
// routes/comment.routes.js

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { 
  checkCommentAccess,
  checkCommentEditPermission,
  checkCommentDeletePermission 
} = require('../middleware/comment-permissions.middleware');
const { validateRequest } = require('../middleware/validation.middleware');
const { createCommentSchema, updateCommentSchema } = require('../validators/comment.validator');

// Create comment
router.post(
  '/',
  authenticate,
  validateRequest(createCommentSchema),
  commentController.createComment
);

// Get comments for requirement
router.get(
  '/requirement/:requirementId',
  authenticate,
  commentController.getCommentsByRequirement
);

// Update comment
router.put(
  '/:commentId',
  authenticate,
  checkCommentAccess,
  checkCommentEditPermission,
  validateRequest(updateCommentSchema),
  commentController.updateComment
);

// Delete comment
router.delete(
  '/:commentId',
  authenticate,
  checkCommentAccess,
  checkCommentDeletePermission,
  commentController.deleteComment
);

module.exports = router;
```

### Register Routes

```javascript
// app.js or routes/index.js

const commentRoutes = require('./routes/comment.routes');

// Register comment routes
app.use('/api/v1/industry/comments', commentRoutes);
```

---

## Appendix B: Testing Checklist

### Unit Tests

- [ ] Comment model validation
- [ ] CommentEmailService.getHybridRecipients()
- [ ] CommentEmailService helper methods
- [ ] Permission middleware functions

### Integration Tests

- [ ] POST /comments - create comment successfully
- [ ] POST /comments - validation errors
- [ ] GET /comments/requirement/:id - with pagination
- [ ] GET /comments/requirement/:id - with filters
- [ ] PUT /comments/:id - within 24 hours
- [ ] PUT /comments/:id - after 24 hours (should fail)
- [ ] DELETE /comments/:id - by author
- [ ] DELETE /comments/:id - by admin
- [ ] Email notification sent to correct recipients

### E2E Tests

- [ ] Full comment creation flow with email
- [ ] Comment edit and delete flows
- [ ] Cross-company access denied

---

**Document End**

*This document should be shared with the backend team for implementation. Frontend integration can begin after COMMENTS-002 and COMMENTS-003 are complete.*
