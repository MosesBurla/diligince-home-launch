# Approval Workflow Backend Implementation Guide

## Document Overview

This document provides complete implementation details for the multi-level requirement approval workflow system. It includes MongoDB schema updates, API endpoints, email service integration, and implementation pseudo-code.

**Version:** 1.0  
**Last Updated:** 2025-01-09  
**Module:** Requirements → Approval Workflow

---

## Table of Contents

1. [MongoDB Schema Updates](#1-mongodb-schema-updates)
2. [API Endpoints](#2-api-endpoints)
3. [Email Service Implementation](#3-email-service-implementation)
4. [Seeder Configuration](#4-seeder-configuration)
5. [Implementation Pseudo-code](#5-implementation-pseudo-code)
6. [Task Breakdown](#6-task-breakdown)

---

## 1. MongoDB Schema Updates

### 1.1 Requirements Collection Schema

Add/modify the following fields in the `requirements` collection:

```javascript
// Requirements Collection Schema Updates
{
  // ==========================================
  // EXISTING FIELDS (ensure enum values)
  // ==========================================
  
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  
  // ==========================================
  // NEW FIELDS - Approval Tracking
  // ==========================================
  
  // Quick-access flags (stored at root for efficient queries)
  isSentForApproval: { 
    type: Boolean, 
    default: false,
    index: true
  },
  sentForApprovalAt: {
    type: Date,
    default: null
  },
  currentApprovalLevel: { 
    type: Number, 
    default: 0,
    index: true
  },
  totalApprovalLevels: { 
    type: Number, 
    default: 0 
  },
  
  // ==========================================
  // NEW FIELDS - Approval Matrix Reference
  // ==========================================
  
  selectedApprovalMatrixId: { 
    type: ObjectId, 
    ref: 'ApprovalMatrix',
    index: true
  },
  
  // Embedded snapshot of matrix at time of sending (for audit trail)
  selectedApprovalMatrix: {
    id: { type: ObjectId },
    name: { type: String },
    totalLevels: { type: Number },
    snapshotAt: { type: Date }
  },
  
  // ==========================================
  // NEW FIELDS - Approval Progress (Embedded)
  // ==========================================
  
  approvalProgress: {
    currentLevel: { type: Number, default: 0 },
    totalLevels: { type: Number, default: 0 },
    allLevelsCompleted: { type: Boolean, default: false },
    estimatedCompletionDate: { type: Date },
    
    levels: [{
      levelNumber: { type: Number, required: true },
      name: { type: String, required: true },
      status: { 
        type: String, 
        enum: ['waiting', 'in_progress', 'completed', 'skipped'],
        default: 'waiting'
      },
      maxApprovalTimeHours: { type: Number, default: 24 },
      startedAt: { type: Date },
      completedAt: { type: Date },
      
      approvers: [{
        memberId: { type: ObjectId, ref: 'User', required: true },
        memberName: { type: String, required: true },
        memberEmail: { type: String, required: true },
        memberRole: { type: String },
        memberDepartment: { type: String },
        isMandatory: { type: Boolean, default: true },
        status: { 
          type: String, 
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending'
        },
        notifiedAt: { type: Date },
        approvedAt: { type: Date },
        rejectedAt: { type: Date },
        comments: { type: String, maxlength: 1000 },
        conditions: [{ type: String }]
      }]
    }]
  },
  
  // ==========================================
  // NEW FIELDS - Rejection Details
  // ==========================================
  
  rejectionDetails: {
    reason: { type: String, required: true },
    comments: { type: String, maxlength: 2000 },
    rejectedBy: { type: ObjectId, ref: 'User' },
    rejectedByName: { type: String },
    rejectedByEmail: { type: String },
    rejectedAt: { type: Date },
    levelRejectedAt: { type: Number },
    allowResubmission: { type: Boolean, default: true },
    resubmissionDeadline: { type: Date }
  },
  
  // ==========================================
  // NEW FIELDS - Resubmission Tracking
  // ==========================================
  
  resubmissionCount: { type: Number, default: 0 },
  resubmissionHistory: [{
    submittedAt: { type: Date },
    revisionNotes: { type: String },
    changesDescription: { type: String },
    previousRejectionReason: { type: String }
  }],
  
  // ==========================================
  // NEW FIELDS - Publishing Details
  // ==========================================
  
  publishedAt: { type: Date },
  publishedBy: { type: ObjectId, ref: 'User' },
  publishedByName: { type: String },
  publishNotes: { type: String },
  visibility: { 
    type: String, 
    enum: ['all', 'selected', 'invited'],
    default: 'all'
  },
  selectedVendors: [{ type: ObjectId, ref: 'Vendor' }],
  emergencyPublished: { type: Boolean, default: false },
  emergencyJustification: { type: String },
  
  // ==========================================
  // ENHANCED FIELDS - Creator Info (for filtering)
  // ==========================================
  
  createdBy: {
    id: { type: ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  
  companyId: { 
    type: ObjectId, 
    ref: 'Company', 
    required: true,
    index: true
  },
  
  // ==========================================
  // NEW FIELDS - Notification History (Audit)
  // ==========================================
  
  notificationHistory: [{
    templateId: { type: String, required: true },
    templateName: { type: String },
    recipientEmail: { type: String, required: true },
    recipientName: { type: String },
    recipientId: { type: ObjectId, ref: 'User' },
    sentAt: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['queued', 'sent', 'failed', 'delivered', 'opened'],
      default: 'queued'
    },
    errorMessage: { type: String },
    context: { type: Object } // Template variables used
  }]
}
```

### 1.2 Indexes

Create compound indexes for efficient querying:

```javascript
// Compound Indexes for Requirements Collection

// 1. Company + Status listing (primary use case)
requirementSchema.index({ companyId: 1, status: 1, createdAt: -1 });

// 2. Creator filter within company
requirementSchema.index({ companyId: 1, 'createdBy.id': 1, status: 1 });

// 3. Approver lookup (find requirements awaiting specific user)
requirementSchema.index({ 
  'approvalProgress.levels.approvers.memberId': 1, 
  status: 1,
  currentApprovalLevel: 1 
});

// 4. Level-based queries
requirementSchema.index({ currentApprovalLevel: 1, status: 1 });

// 5. Sent for approval date (for SLA tracking)
requirementSchema.index({ sentForApprovalAt: 1, status: 1 });

// 6. Matrix reference
requirementSchema.index({ selectedApprovalMatrixId: 1 });
```

### 1.3 Migration Script

For existing requirements, run this migration:

```javascript
// migration/add-approval-fields.js

db.requirements.updateMany(
  { isSentForApproval: { $exists: false } },
  {
    $set: {
      isSentForApproval: false,
      currentApprovalLevel: 0,
      totalApprovalLevels: 0,
      approvalProgress: null,
      rejectionDetails: null,
      resubmissionCount: 0,
      resubmissionHistory: [],
      notificationHistory: []
    }
  }
);

// Update existing 'pending' status requirements
db.requirements.updateMany(
  { status: 'pending', isSentForApproval: false },
  {
    $set: {
      isSentForApproval: true
    }
  }
);
```

---

## 2. API Endpoints

### 2.1 List Endpoints (Enhanced with Creator Filter)

#### GET /api/v1/industry/requirements/pending

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10, max: 100) |
| sortBy | string | No | Sort field (default: createdAt) |
| sortOrder | string | No | 'asc' or 'desc' (default: desc) |
| createdById | string | No | Filter by creator's user ID |
| category | string | No | Filter by category |
| priority | string | No | Filter by priority |
| department | string | No | Filter by department |
| approvalLevel | number | No | Filter by current approval level |
| search | string | No | Search in title, description |

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "items": [
      {
        "requirementId": "6925d6de23c5d620002a6eac",
        "draftId": "draft_123",
        "title": "Office Furniture Procurement",
        "category": "furniture",
        "priority": "high",
        "estimatedBudget": 50000,
        "department": "Operations",
        "status": "pending",
        "isSentForApproval": true,
        "sentForApprovalAt": "2025-01-09T10:30:00.000Z",
        "createdBy": {
          "id": "6927429a2de4792cb3db7c9e",
          "name": "John Doe",
          "email": "john.doe@company.com"
        },
        "createdAt": "2025-01-08T09:00:00.000Z",
        "selectedApprovalMatrix": {
          "id": "matrix_001",
          "name": "Standard 3-Level Approval",
          "totalLevels": 3
        },
        "approvalProgress": {
          "currentLevel": 1,
          "totalLevels": 3,
          "allLevelsCompleted": false,
          "estimatedCompletionDate": "2025-01-12T10:30:00.000Z",
          "levels": [
            {
              "levelNumber": 1,
              "name": "Department Head",
              "status": "in_progress",
              "maxApprovalTimeHours": 24,
              "startedAt": "2025-01-09T10:30:00.000Z",
              "approvers": [
                {
                  "memberId": "user_001",
                  "memberName": "Alice Manager",
                  "memberEmail": "alice@company.com",
                  "memberRole": "Department Head",
                  "isMandatory": true,
                  "status": "pending",
                  "notifiedAt": "2025-01-09T10:30:00.000Z"
                }
              ]
            },
            {
              "levelNumber": 2,
              "name": "Finance Review",
              "status": "waiting",
              "approvers": [...]
            }
          ]
        },
        "canApprove": true,
        "canReject": true,
        "myApproverInfo": {
          "levelNumber": 1,
          "isMandatory": true,
          "status": "pending"
        }
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
    "filters": {
      "creators": [
        {
          "id": "6927429a2de4792cb3db7c9e",
          "name": "John Doe",
          "email": "john.doe@company.com",
          "count": 5
        },
        {
          "id": "6927429a2de4792cb3db7c9f",
          "name": "Jane Smith",
          "email": "jane.smith@company.com",
          "count": 3
        }
      ]
    },
    "statistics": {
      "total": 25,
      "awaitingMyApproval": 5,
      "level1Pending": 10,
      "level2Pending": 8,
      "level3Pending": 7,
      "overdueApprovals": 2
    }
  }
}
```

### 2.2 Action Endpoints

#### POST /api/v1/industry/requirements/:requirementId/approve

**Request Body:**
```json
{
  "comments": "Approved. Budget looks reasonable.",
  "conditions": [
    "Ensure vendor provides 2-year warranty",
    "Get 3 competitive quotes"
  ]
}
```

**Response (Level Not Advanced):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement approved successfully",
  "data": {
    "requirementId": "6925d6de23c5d620002a6eac",
    "status": "pending",
    "approvalProgress": { ... },
    "levelAdvanced": false,
    "fullyApproved": false,
    "readyToPublish": false
  }
}
```

**Response (Level Advanced):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Approved! Moving to Level 2",
  "data": {
    "requirementId": "6925d6de23c5d620002a6eac",
    "status": "pending",
    "approvalProgress": { ... },
    "levelAdvanced": true,
    "fullyApproved": false,
    "readyToPublish": false,
    "nextApprovers": [
      {
        "memberId": "user_002",
        "memberName": "Bob Finance",
        "memberEmail": "bob@company.com",
        "notifiedAt": "2025-01-09T14:00:00.000Z"
      }
    ]
  }
}
```

**Response (Fully Approved):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement fully approved! Ready to publish.",
  "data": {
    "requirementId": "6925d6de23c5d620002a6eac",
    "status": "approved",
    "approvalProgress": {
      "currentLevel": 3,
      "totalLevels": 3,
      "allLevelsCompleted": true
    },
    "levelAdvanced": false,
    "fullyApproved": true,
    "readyToPublish": true
  }
}
```

#### POST /api/v1/industry/requirements/:requirementId/reject

**Request Body:**
```json
{
  "reason": "Budget exceeds quarterly allocation",
  "comments": "Please revise the budget to fit within Q1 allocation of ₹40,000. Consider splitting into two phases.",
  "allowResubmission": true,
  "resubmissionDeadline": "2025-01-15T23:59:59.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement rejected",
  "data": {
    "requirementId": "6925d6de23c5d620002a6eac",
    "status": "rejected",
    "rejectedAt": "2025-01-09T15:30:00.000Z",
    "rejectedBy": {
      "id": "user_002",
      "name": "Bob Finance",
      "email": "bob@company.com"
    },
    "rejectionDetails": {
      "reason": "Budget exceeds quarterly allocation",
      "comments": "Please revise...",
      "allowResubmission": true,
      "resubmissionDeadline": "2025-01-15T23:59:59.000Z"
    },
    "canResubmit": true
  }
}
```

#### POST /api/v1/industry/requirements/:requirementId/publish

**Request Body:**
```json
{
  "notifyVendors": true,
  "publishNotes": "Open for submissions until Jan 31",
  "visibility": "all",
  "selectedVendors": [],
  "submissionDeadline": "2025-01-31T23:59:59.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Requirement published successfully",
  "data": {
    "requirementId": "6925d6de23c5d620002a6eac",
    "status": "published",
    "publishedAt": "2025-01-09T16:00:00.000Z",
    "publishedBy": {
      "id": "user_001",
      "name": "John Doe",
      "email": "john@company.com"
    },
    "submissionDeadline": "2025-01-31T23:59:59.000Z",
    "visibility": "all",
    "vendorNotifications": {
      "totalVendors": 150,
      "notified": 148,
      "failed": 2
    },
    "publicUrl": "/requirements/6925d6de23c5d620002a6eac"
  }
}
```

### 2.3 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| REQUIREMENT_NOT_FOUND | 404 | Requirement does not exist |
| NOT_PENDING | 400 | Requirement is not in pending status |
| NOT_APPROVED | 400 | Requirement is not in approved status |
| NOT_AUTHORIZED | 403 | User is not an approver for current level |
| ALREADY_APPROVED | 400 | User has already approved this requirement |
| ALREADY_REJECTED | 400 | Requirement has already been rejected |
| NOT_CREATOR | 403 | Only creator can publish |
| REASON_REQUIRED | 400 | Rejection reason is required |
| RESUBMISSION_NOT_ALLOWED | 400 | Resubmission was not allowed for this rejection |
| RESUBMISSION_DEADLINE_PASSED | 400 | Resubmission deadline has passed |

---

## 3. Email Service Implementation

### 3.1 Email Templates Overview

| Template ID | Filename | Trigger | Recipients |
|-------------|----------|---------|------------|
| approval-sent-to-approvers | `approval-sent-to-approvers.html` | Send for Approval | Level 1 Approvers |
| submission-confirmed-to-creator | `submission-confirmed-to-creator.html` | Send for Approval | Creator |
| approval-received-notification | `approval-received-notification.html` | Approver Approves | Level Approvers + Creator |
| level-completed-notification | `level-completed-notification.html` | Level Completes | Completed Level + Creator |
| new-level-approval-request | `new-level-approval-request.html` | Level Advances | Next Level Approvers |
| rejection-notification | `rejection-notification.html` | Approver Rejects | Creator + All Approvers |
| fully-approved-ready-to-publish | `fully-approved-ready-to-publish.html` | All Levels Complete | Creator |
| requirement-published-notification | `requirement-published-notification.html` | Publish | Creator + All Approvers |

### 3.2 ApprovalEmailService Class

```javascript
// services/email/approval-email.service.js

const EmailService = require('./email.service');
const EmailTemplate = require('../models/EmailTemplate');

class ApprovalEmailService {
  
  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Get base URLs and common variables used in all templates
   */
  getBaseContext() {
    return {
      appUrl: process.env.APP_URL || 'https://app.diligince.ai',
      privacyUrl: `${process.env.APP_URL}/privacy`,
      termsUrl: `${process.env.APP_URL}/terms`,
      currentYear: new Date().getFullYear()
    };
  }

  /**
   * Template 1: Notify Level 1 approvers when requirement is sent for approval
   * 
   * @param {Object} requirement - The requirement document
   * @param {Array} approvers - Level 1 approvers array
   * @returns {Array} Notification records for history
   */
  async notifySentForApproval(requirement, approvers) {
    const template = await EmailTemplate.findOne({ 
      templateId: 'approval-sent-to-approvers' 
    });
    
    if (!template || !template.isActive) {
      console.warn('Template approval-sent-to-approvers not found or inactive');
      return [];
    }

    const notifications = [];
    const level = requirement.approvalProgress.levels[0];

    for (const approver of approvers) {
      const context = {
        ...this.getBaseContext(),
        approverName: approver.memberName,
        requirementTitle: requirement.title,
        requirementId: requirement._id.toString(),
        category: requirement.category,
        priority: requirement.priority,
        estimatedBudget: this.formatCurrency(requirement.estimatedBudget),
        department: requirement.department,
        creatorName: requirement.createdBy.name,
        creatorEmail: requirement.createdBy.email,
        submittedAt: this.formatDate(new Date()),
        maxApprovalTime: level.maxApprovalTimeHours,
        mandatoryStatus: approver.isMandatory ? 'Mandatory' : 'Optional',
        approveUrl: `${process.env.APP_URL}/dashboard/pending-approvals/${requirement._id}?action=approve`,
        rejectUrl: `${process.env.APP_URL}/dashboard/pending-approvals/${requirement._id}?action=reject`,
        viewDetailsUrl: `${process.env.APP_URL}/dashboard/pending-approvals/${requirement._id}`
      };

      try {
        await this.emailService.send({
          to: approver.memberEmail,
          subject: this.parseSubject(template.subject, context),
          template: template.filePath,
          context
        });

        notifications.push({
          templateId: 'approval-sent-to-approvers',
          templateName: template.name,
          recipientEmail: approver.memberEmail,
          recipientName: approver.memberName,
          recipientId: approver.memberId,
          sentAt: new Date(),
          status: 'sent',
          context
        });

        // Update approver's notifiedAt timestamp
        approver.notifiedAt = new Date();

      } catch (error) {
        console.error(`Failed to send email to ${approver.memberEmail}:`, error);
        
        notifications.push({
          templateId: 'approval-sent-to-approvers',
          templateName: template.name,
          recipientEmail: approver.memberEmail,
          recipientName: approver.memberName,
          recipientId: approver.memberId,
          sentAt: new Date(),
          status: 'failed',
          errorMessage: error.message,
          context
        });
      }
    }

    return notifications;
  }

  /**
   * Template 2: Notify creator that submission is confirmed
   */
  async notifyCreatorSubmissionConfirmed(requirement) {
    const template = await EmailTemplate.findOne({ 
      templateId: 'submission-confirmed-to-creator' 
    });
    
    if (!template?.isActive) return [];

    const totalApprovers = requirement.approvalProgress.levels.reduce(
      (sum, level) => sum + level.approvers.length, 0
    );

    const context = {
      ...this.getBaseContext(),
      creatorName: requirement.createdBy.name,
      requirementTitle: requirement.title,
      requirementId: requirement._id.toString(),
      matrixName: requirement.selectedApprovalMatrix?.name || 'Custom',
      totalLevels: requirement.approvalProgress.totalLevels,
      approverCount: totalApprovers,
      trackStatusUrl: `${process.env.APP_URL}/dashboard/requirements/${requirement._id}/approval-status`
    };

    try {
      await this.emailService.send({
        to: requirement.createdBy.email,
        subject: this.parseSubject(template.subject, context),
        template: template.filePath,
        context
      });

      return [{
        templateId: 'submission-confirmed-to-creator',
        templateName: template.name,
        recipientEmail: requirement.createdBy.email,
        recipientName: requirement.createdBy.name,
        recipientId: requirement.createdBy.id,
        sentAt: new Date(),
        status: 'sent',
        context
      }];
    } catch (error) {
      return [{
        templateId: 'submission-confirmed-to-creator',
        recipientEmail: requirement.createdBy.email,
        sentAt: new Date(),
        status: 'failed',
        errorMessage: error.message
      }];
    }
  }

  /**
   * Template 3: Notify when an approval is received
   */
  async notifyApprovalReceived(requirement, approver, levelApprovers, creator) {
    const template = await EmailTemplate.findOne({ 
      templateId: 'approval-received-notification' 
    });
    
    if (!template?.isActive) return [];

    const notifications = [];
    const currentLevel = requirement.approvalProgress.levels.find(
      l => l.levelNumber === requirement.approvalProgress.currentLevel
    );

    const approvedCount = currentLevel.approvers.filter(a => a.status === 'approved').length;
    const pendingCount = currentLevel.approvers.filter(a => a.status === 'pending').length;
    const mandatoryApprovers = currentLevel.approvers.filter(a => a.isMandatory);
    const allMandatoryApproved = mandatoryApprovers.every(a => a.status === 'approved');

    // Send to all level approvers + creator
    const recipients = [
      ...levelApprovers.map(a => ({
        id: a.memberId,
        name: a.memberName,
        email: a.memberEmail
      })),
      {
        id: creator.id,
        name: creator.name,
        email: creator.email
      }
    ];

    // Deduplicate by email
    const uniqueRecipients = [...new Map(recipients.map(r => [r.email, r])).values()];

    for (const recipient of uniqueRecipients) {
      const context = {
        ...this.getBaseContext(),
        recipientName: recipient.name,
        requirementTitle: requirement.title,
        requirementId: requirement._id.toString(),
        approverName: approver.memberName,
        approverRole: approver.memberRole,
        approvalComments: approver.comments || 'No comments provided',
        approvedAt: this.formatDate(new Date()),
        currentLevel: requirement.approvalProgress.currentLevel,
        approvedCount,
        totalApprovers: currentLevel.approvers.length,
        pendingCount,
        levelStatus: allMandatoryApproved ? 'Completed' : 'In Progress',
        allMandatoryApproved,
        viewDetailsUrl: `${process.env.APP_URL}/dashboard/pending-approvals/${requirement._id}`
      };

      try {
        await this.emailService.send({
          to: recipient.email,
          subject: this.parseSubject(template.subject, context),
          template: template.filePath,
          context
        });

        notifications.push({
          templateId: 'approval-received-notification',
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          recipientId: recipient.id,
          sentAt: new Date(),
          status: 'sent',
          context
        });
      } catch (error) {
        notifications.push({
          templateId: 'approval-received-notification',
          recipientEmail: recipient.email,
          sentAt: new Date(),
          status: 'failed',
          errorMessage: error.message
        });
      }
    }

    return notifications;
  }

  /**
   * Template 4 & 5: Notify level transition
   */
  async notifyLevelTransition(requirement, completedLevel, nextLevelApprovers, allInvolved) {
    const notifications = [];

    // Template 4: Level completed notification
    const levelCompletedNotifications = await this.sendLevelCompletedNotification(
      requirement, 
      completedLevel, 
      allInvolved
    );
    notifications.push(...levelCompletedNotifications);

    // Template 5: New level approval request
    if (nextLevelApprovers?.length > 0) {
      const newLevelNotifications = await this.sendNewLevelApprovalRequest(
        requirement,
        nextLevelApprovers,
        completedLevel
      );
      notifications.push(...newLevelNotifications);
    }

    return notifications;
  }

  /**
   * Template 4: Level completed notification
   */
  async sendLevelCompletedNotification(requirement, completedLevel, recipients) {
    const template = await EmailTemplate.findOne({ 
      templateId: 'level-completed-notification' 
    });
    
    if (!template?.isActive) return [];

    const notifications = [];
    const nextLevel = requirement.approvalProgress.levels.find(
      l => l.levelNumber === completedLevel.levelNumber + 1
    );

    // Calculate completion time
    const startTime = new Date(completedLevel.startedAt);
    const endTime = new Date();
    const completionTime = this.formatDuration(endTime - startTime);

    for (const recipient of recipients) {
      const context = {
        ...this.getBaseContext(),
        recipientName: recipient.name,
        requirementTitle: requirement.title,
        requirementId: requirement._id.toString(),
        completedLevel: completedLevel.levelNumber,
        completedLevelName: completedLevel.name,
        totalApprovers: completedLevel.approvers.length,
        approvedCount: completedLevel.approvers.filter(a => a.status === 'approved').length,
        completionTime,
        nextLevel: nextLevel?.levelNumber || 'N/A',
        nextLevelName: nextLevel?.name || 'Final',
        nextLevelApproverCount: nextLevel?.approvers.length || 0,
        nextLevelMaxTime: nextLevel?.maxApprovalTimeHours || 0,
        trackProgressUrl: `${process.env.APP_URL}/dashboard/requirements/${requirement._id}/approval-status`
      };

      try {
        await this.emailService.send({
          to: recipient.email,
          subject: this.parseSubject(template.subject, context),
          template: template.filePath,
          context
        });

        notifications.push({
          templateId: 'level-completed-notification',
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          sentAt: new Date(),
          status: 'sent'
        });
      } catch (error) {
        notifications.push({
          templateId: 'level-completed-notification',
          recipientEmail: recipient.email,
          sentAt: new Date(),
          status: 'failed',
          errorMessage: error.message
        });
      }
    }

    return notifications;
  }

  /**
   * Template 5: New level approval request
   */
  async sendNewLevelApprovalRequest(requirement, approvers, previousLevel) {
    const template = await EmailTemplate.findOne({ 
      templateId: 'new-level-approval-request' 
    });
    
    if (!template?.isActive) return [];

    const notifications = [];
    const completedLevels = requirement.approvalProgress.levels
      .filter(l => l.status === 'completed')
      .map(l => ({
        levelNumber: l.levelNumber,
        levelName: l.name,
        approverNames: l.approvers
          .filter(a => a.status === 'approved')
          .map(a => a.memberName)
          .join(', ')
      }));

    for (const approver of approvers) {
      const context = {
        ...this.getBaseContext(),
        approverName: approver.memberName,
        requirementTitle: requirement.title,
        requirementId: requirement._id.toString(),
        category: requirement.category,
        priority: requirement.priority,
        estimatedBudget: this.formatCurrency(requirement.estimatedBudget),
        creatorName: requirement.createdBy.name,
        currentLevel: requirement.approvalProgress.currentLevel,
        mandatoryStatus: approver.isMandatory ? 'Mandatory' : 'Optional',
        maxApprovalTime: requirement.approvalProgress.levels[
          requirement.approvalProgress.currentLevel - 1
        ]?.maxApprovalTimeHours || 24,
        completedLevels,
        approveUrl: `${process.env.APP_URL}/dashboard/pending-approvals/${requirement._id}?action=approve`,
        rejectUrl: `${process.env.APP_URL}/dashboard/pending-approvals/${requirement._id}?action=reject`,
        viewDetailsUrl: `${process.env.APP_URL}/dashboard/pending-approvals/${requirement._id}`
      };

      try {
        await this.emailService.send({
          to: approver.memberEmail,
          subject: this.parseSubject(template.subject, context),
          template: template.filePath,
          context
        });

        notifications.push({
          templateId: 'new-level-approval-request',
          recipientEmail: approver.memberEmail,
          recipientName: approver.memberName,
          recipientId: approver.memberId,
          sentAt: new Date(),
          status: 'sent'
        });

        // Update notifiedAt
        approver.notifiedAt = new Date();

      } catch (error) {
        notifications.push({
          templateId: 'new-level-approval-request',
          recipientEmail: approver.memberEmail,
          sentAt: new Date(),
          status: 'failed',
          errorMessage: error.message
        });
      }
    }

    return notifications;
  }

  /**
   * Template 6: Notify rejection to all involved
   */
  async notifyRejection(requirement, rejector, allInvolvedParties) {
    const template = await EmailTemplate.findOne({ 
      templateId: 'rejection-notification' 
    });
    
    if (!template?.isActive) return [];

    const notifications = [];

    for (const recipient of allInvolvedParties) {
      const isCreator = recipient.id?.toString() === requirement.createdBy.id?.toString();

      const context = {
        ...this.getBaseContext(),
        recipientName: recipient.name,
        isCreator,
        requirementTitle: requirement.title,
        requirementId: requirement._id.toString(),
        rejectorName: rejector.memberName,
        rejectorRole: rejector.memberRole,
        rejectedLevel: requirement.approvalProgress.currentLevel,
        levelName: requirement.approvalProgress.levels[
          requirement.approvalProgress.currentLevel - 1
        ]?.name || `Level ${requirement.approvalProgress.currentLevel}`,
        rejectedAt: this.formatDate(new Date()),
        rejectionReason: requirement.rejectionDetails.reason,
        rejectionComments: requirement.rejectionDetails.comments || 'No additional comments',
        allowResubmission: requirement.rejectionDetails.allowResubmission,
        resubmissionDeadline: requirement.rejectionDetails.resubmissionDeadline 
          ? this.formatDate(requirement.rejectionDetails.resubmissionDeadline)
          : null,
        editResubmitUrl: isCreator 
          ? `${process.env.APP_URL}/create-requirement?draftId=${requirement._id}`
          : null,
        viewDetailsUrl: `${process.env.APP_URL}/dashboard/requirements/${requirement._id}`
      };

      try {
        await this.emailService.send({
          to: recipient.email,
          subject: this.parseSubject(template.subject, context),
          template: template.filePath,
          context
        });

        notifications.push({
          templateId: 'rejection-notification',
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          recipientId: recipient.id,
          sentAt: new Date(),
          status: 'sent'
        });
      } catch (error) {
        notifications.push({
          templateId: 'rejection-notification',
          recipientEmail: recipient.email,
          sentAt: new Date(),
          status: 'failed',
          errorMessage: error.message
        });
      }
    }

    return notifications;
  }

  /**
   * Template 7: Notify creator that requirement is fully approved
   */
  async notifyFullyApproved(requirement, creator) {
    const template = await EmailTemplate.findOne({ 
      templateId: 'fully-approved-ready-to-publish' 
    });
    
    if (!template?.isActive) return [];

    // Calculate total approval time
    const startTime = new Date(requirement.sentForApprovalAt);
    const endTime = new Date();
    const totalApprovalTime = this.formatDuration(endTime - startTime);

    const levels = requirement.approvalProgress.levels.map(l => ({
      levelNumber: l.levelNumber,
      levelName: l.name,
      approverNames: l.approvers
        .filter(a => a.status === 'approved')
        .map(a => a.memberName)
        .join(', '),
      completedAt: l.completedAt ? this.formatDate(l.completedAt) : 'N/A'
    }));

    const context = {
      ...this.getBaseContext(),
      creatorName: creator.name,
      requirementTitle: requirement.title,
      requirementId: requirement._id.toString(),
      approvedAt: this.formatDate(new Date()),
      totalLevels: requirement.approvalProgress.totalLevels,
      totalApprovers: requirement.approvalProgress.levels.reduce(
        (sum, l) => sum + l.approvers.length, 0
      ),
      totalApprovalTime,
      levels,
      publishNowUrl: `${process.env.APP_URL}/dashboard/approved?publish=${requirement._id}`,
      viewDetailsUrl: `${process.env.APP_URL}/dashboard/requirements/${requirement._id}`
    };

    try {
      await this.emailService.send({
        to: creator.email,
        subject: this.parseSubject(template.subject, context),
        template: template.filePath,
        context
      });

      return [{
        templateId: 'fully-approved-ready-to-publish',
        recipientEmail: creator.email,
        recipientName: creator.name,
        recipientId: creator.id,
        sentAt: new Date(),
        status: 'sent'
      }];
    } catch (error) {
      return [{
        templateId: 'fully-approved-ready-to-publish',
        recipientEmail: creator.email,
        sentAt: new Date(),
        status: 'failed',
        errorMessage: error.message
      }];
    }
  }

  /**
   * Template 8: Notify all involved that requirement is published
   */
  async notifyPublished(requirement, creator, allApprovers) {
    const template = await EmailTemplate.findOne({ 
      templateId: 'requirement-published-notification' 
    });
    
    if (!template?.isActive) return [];

    const notifications = [];
    const recipients = [
      { id: creator.id, name: creator.name, email: creator.email },
      ...allApprovers
    ];

    // Deduplicate
    const uniqueRecipients = [...new Map(recipients.map(r => [r.email, r])).values()];

    for (const recipient of uniqueRecipients) {
      const context = {
        ...this.getBaseContext(),
        recipientName: recipient.name,
        requirementTitle: requirement.title,
        requirementId: requirement._id.toString(),
        publisherName: requirement.publishedByName || creator.name,
        publishedAt: this.formatDate(new Date()),
        submissionDeadline: requirement.submissionDeadline 
          ? this.formatDate(requirement.submissionDeadline) 
          : 'Open-ended',
        vendorCount: requirement.vendorNotifications?.totalVendors || 0,
        visibility: this.formatVisibility(requirement.visibility),
        viewPublishedUrl: `${process.env.APP_URL}/requirements/${requirement._id}`
      };

      try {
        await this.emailService.send({
          to: recipient.email,
          subject: this.parseSubject(template.subject, context),
          template: template.filePath,
          context
        });

        notifications.push({
          templateId: 'requirement-published-notification',
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          sentAt: new Date(),
          status: 'sent'
        });
      } catch (error) {
        notifications.push({
          templateId: 'requirement-published-notification',
          recipientEmail: recipient.email,
          sentAt: new Date(),
          status: 'failed',
          errorMessage: error.message
        });
      }
    }

    return notifications;
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  /**
   * Get all parties involved in the approval workflow
   */
  getAllInvolvedParties(requirement) {
    const parties = new Map();
    
    // Add creator
    if (requirement.createdBy?.id) {
      parties.set(requirement.createdBy.id.toString(), {
        id: requirement.createdBy.id,
        name: requirement.createdBy.name,
        email: requirement.createdBy.email,
        role: 'creator'
      });
    }
    
    // Add all approvers from all levels
    if (requirement.approvalProgress?.levels) {
      for (const level of requirement.approvalProgress.levels) {
        for (const approver of level.approvers || []) {
          if (approver.memberId && !parties.has(approver.memberId.toString())) {
            parties.set(approver.memberId.toString(), {
              id: approver.memberId,
              name: approver.memberName,
              email: approver.memberEmail,
              role: approver.memberRole
            });
          }
        }
      }
    }
    
    return Array.from(parties.values());
  }

  /**
   * Parse subject line with variables
   */
  parseSubject(subject, context) {
    return subject.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
  }

  /**
   * Format currency
   */
  formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency
    }).format(amount || 0);
  }

  /**
   * Format date
   */
  formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date));
  }

  /**
   * Format duration from milliseconds
   */
  formatDuration(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  /**
   * Format visibility
   */
  formatVisibility(visibility) {
    const map = {
      'all': 'All Vendors',
      'selected': 'Selected Vendors Only',
      'invited': 'Invited Vendors Only'
    };
    return map[visibility] || visibility;
  }
}

module.exports = ApprovalEmailService;
```

---

## 4. Seeder Configuration

### 4.1 Email Template Seeder

Update `seeders/email-templates.seeder.js`:

```javascript
// seeders/email-templates.seeder.js

const approvalTemplates = [
  {
    templateId: 'approval-sent-to-approvers',
    name: 'Approval Request - To Approvers',
    subject: '🔔 Approval Required: {{requirementTitle}}',
    category: 'approval',
    description: 'Sent to Level 1 approvers when requirement is submitted for approval',
    filePath: 'templates/emails/approval/approval-sent-to-approvers.html',
    variables: [
      'approverName', 'requirementTitle', 'requirementId', 'category', 
      'priority', 'estimatedBudget', 'department', 'creatorName', 
      'creatorEmail', 'submittedAt', 'maxApprovalTime', 'mandatoryStatus', 
      'approveUrl', 'rejectUrl', 'viewDetailsUrl', 'appUrl', 
      'privacyUrl', 'termsUrl', 'currentYear'
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    templateId: 'submission-confirmed-to-creator',
    name: 'Submission Confirmed - To Creator',
    subject: '✅ Submitted for Approval: {{requirementTitle}}',
    category: 'approval',
    description: 'Confirmation sent to creator when requirement is submitted',
    filePath: 'templates/emails/approval/submission-confirmed-to-creator.html',
    variables: [
      'creatorName', 'requirementTitle', 'requirementId', 'matrixName',
      'totalLevels', 'approverCount', 'trackStatusUrl', 'appUrl',
      'privacyUrl', 'termsUrl', 'currentYear'
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    templateId: 'approval-received-notification',
    name: 'Approval Received Notification',
    subject: '✅ Approval Received: {{requirementTitle}}',
    category: 'approval',
    description: 'Sent when an approver approves the requirement',
    filePath: 'templates/emails/approval/approval-received-notification.html',
    variables: [
      'recipientName', 'requirementTitle', 'requirementId', 'approverName',
      'approverRole', 'approvalComments', 'approvedAt', 'currentLevel',
      'approvedCount', 'totalApprovers', 'pendingCount', 'levelStatus',
      'allMandatoryApproved', 'viewDetailsUrl', 'appUrl', 'privacyUrl',
      'termsUrl', 'currentYear'
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    templateId: 'level-completed-notification',
    name: 'Level Completed - Moving to Next',
    subject: '✅ Level {{completedLevel}} Complete: {{requirementTitle}}',
    category: 'approval',
    description: 'Sent when all mandatory approvers in a level approve',
    filePath: 'templates/emails/approval/level-completed-notification.html',
    variables: [
      'recipientName', 'requirementTitle', 'requirementId', 'completedLevel',
      'completedLevelName', 'totalApprovers', 'approvedCount', 'completionTime',
      'nextLevel', 'nextLevelName', 'nextLevelApproverCount', 'nextLevelMaxTime',
      'trackProgressUrl', 'appUrl', 'privacyUrl', 'termsUrl', 'currentYear'
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    templateId: 'new-level-approval-request',
    name: 'New Level Approval Request',
    subject: '🔔 Your Approval Required (Level {{currentLevel}}): {{requirementTitle}}',
    category: 'approval',
    description: 'Sent to approvers when their level becomes active',
    filePath: 'templates/emails/approval/new-level-approval-request.html',
    variables: [
      'approverName', 'requirementTitle', 'requirementId', 'category',
      'priority', 'estimatedBudget', 'creatorName', 'currentLevel',
      'mandatoryStatus', 'maxApprovalTime', 'completedLevels', 'approveUrl',
      'rejectUrl', 'viewDetailsUrl', 'appUrl', 'privacyUrl', 'termsUrl',
      'currentYear'
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    templateId: 'rejection-notification',
    name: 'Requirement Rejected',
    subject: '❌ Requirement Rejected: {{requirementTitle}}',
    category: 'approval',
    description: 'Sent when any approver rejects the requirement',
    filePath: 'templates/emails/approval/rejection-notification.html',
    variables: [
      'recipientName', 'isCreator', 'requirementTitle', 'requirementId',
      'rejectorName', 'rejectorRole', 'rejectedLevel', 'levelName',
      'rejectedAt', 'rejectionReason', 'rejectionComments', 'allowResubmission',
      'resubmissionDeadline', 'editResubmitUrl', 'viewDetailsUrl', 'appUrl',
      'privacyUrl', 'termsUrl', 'currentYear'
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    templateId: 'fully-approved-ready-to-publish',
    name: 'Fully Approved - Ready to Publish',
    subject: '🎉 Ready to Publish: {{requirementTitle}}',
    category: 'approval',
    description: 'Sent to creator when all approval levels complete',
    filePath: 'templates/emails/approval/fully-approved-ready-to-publish.html',
    variables: [
      'creatorName', 'requirementTitle', 'requirementId', 'approvedAt',
      'totalLevels', 'totalApprovers', 'totalApprovalTime', 'levels',
      'publishNowUrl', 'viewDetailsUrl', 'appUrl', 'privacyUrl',
      'termsUrl', 'currentYear'
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    templateId: 'requirement-published-notification',
    name: 'Requirement Published',
    subject: '🚀 Published: {{requirementTitle}}',
    category: 'approval',
    description: 'Sent to creator and approvers when requirement is published',
    filePath: 'templates/emails/approval/requirement-published-notification.html',
    variables: [
      'recipientName', 'requirementTitle', 'requirementId', 'publisherName',
      'publishedAt', 'submissionDeadline', 'vendorCount', 'visibility',
      'viewPublishedUrl', 'appUrl', 'privacyUrl', 'termsUrl', 'currentYear'
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Seed function
async function seedApprovalEmailTemplates() {
  const EmailTemplate = require('../models/EmailTemplate');
  
  for (const template of approvalTemplates) {
    await EmailTemplate.findOneAndUpdate(
      { templateId: template.templateId },
      template,
      { upsert: true, new: true }
    );
    console.log(`✓ Seeded template: ${template.templateId}`);
  }
  
  console.log(`\n✅ Seeded ${approvalTemplates.length} approval email templates`);
}

module.exports = { approvalTemplates, seedApprovalEmailTemplates };
```

---

## 5. Implementation Pseudo-code

### 5.1 Approve Endpoint Logic

```javascript
// POST /api/v1/industry/requirements/:requirementId/approve

async function approve(req, res) {
  const { requirementId } = req.params;
  const { comments, conditions } = req.body;
  const currentUserId = req.user.id;
  const approvalEmailService = new ApprovalEmailService();

  // STEP 1: Fetch requirement
  const requirement = await Requirement.findById(requirementId);
  if (!requirement) {
    return res.status(404).json({ 
      success: false, 
      error: { code: 'REQUIREMENT_NOT_FOUND' } 
    });
  }

  // STEP 2: Validate status is 'pending'
  if (requirement.status !== 'pending') {
    return res.status(400).json({ 
      success: false, 
      error: { code: 'NOT_PENDING' } 
    });
  }

  // STEP 3: Find current level
  const currentLevelIndex = requirement.approvalProgress.levels.findIndex(
    l => l.levelNumber === requirement.approvalProgress.currentLevel
  );
  
  if (currentLevelIndex === -1) {
    return res.status(400).json({ 
      success: false, 
      error: { code: 'INVALID_APPROVAL_STATE' } 
    });
  }

  const currentLevel = requirement.approvalProgress.levels[currentLevelIndex];

  // STEP 4: Validate level is in_progress
  if (currentLevel.status !== 'in_progress') {
    return res.status(400).json({ 
      success: false, 
      error: { code: 'LEVEL_NOT_ACTIVE' } 
    });
  }

  // STEP 5: Find user in approvers list
  const approverIndex = currentLevel.approvers.findIndex(
    a => a.memberId.toString() === currentUserId
  );

  if (approverIndex === -1) {
    return res.status(403).json({ 
      success: false, 
      error: { code: 'NOT_AUTHORIZED', message: 'You are not an approver for this level' } 
    });
  }

  const approver = currentLevel.approvers[approverIndex];

  // STEP 6: Check if already approved
  if (approver.status !== 'pending') {
    return res.status(400).json({ 
      success: false, 
      error: { code: 'ALREADY_APPROVED' } 
    });
  }

  // STEP 7: Update approver status
  requirement.approvalProgress.levels[currentLevelIndex].approvers[approverIndex] = {
    ...approver.toObject(),
    status: 'approved',
    approvedAt: new Date(),
    comments: comments || null,
    conditions: conditions || []
  };

  // STEP 8: Check if all MANDATORY approvers have approved
  const updatedLevel = requirement.approvalProgress.levels[currentLevelIndex];
  const mandatoryApprovers = updatedLevel.approvers.filter(a => a.isMandatory);
  const allMandatoryApproved = mandatoryApprovers.every(a => a.status === 'approved');

  // STEP 9: Send approval received notification (Template 3)
  let notifications = await approvalEmailService.notifyApprovalReceived(
    requirement,
    approver,
    updatedLevel.approvers,
    requirement.createdBy
  );

  let levelAdvanced = false;
  let fullyApproved = false;

  // STEP 10: If all mandatory approved, handle level transition
  if (allMandatoryApproved) {
    // Mark current level as completed
    requirement.approvalProgress.levels[currentLevelIndex].status = 'completed';
    requirement.approvalProgress.levels[currentLevelIndex].completedAt = new Date();

    // Find next level
    const nextLevelIndex = requirement.approvalProgress.levels.findIndex(
      l => l.levelNumber === requirement.approvalProgress.currentLevel + 1
    );

    if (nextLevelIndex !== -1) {
      // ADVANCE TO NEXT LEVEL
      const nextLevel = requirement.approvalProgress.levels[nextLevelIndex];
      
      // Activate next level
      requirement.approvalProgress.levels[nextLevelIndex].status = 'in_progress';
      requirement.approvalProgress.levels[nextLevelIndex].startedAt = new Date();
      
      // Update current level counters
      requirement.approvalProgress.currentLevel++;
      requirement.currentApprovalLevel++;
      
      levelAdvanced = true;

      // Send level transition notifications (Templates 4 & 5)
      const transitionNotifications = await approvalEmailService.notifyLevelTransition(
        requirement,
        updatedLevel,
        nextLevel.approvers,
        approvalEmailService.getAllInvolvedParties(requirement)
      );
      notifications = [...notifications, ...transitionNotifications];

    } else {
      // ALL LEVELS COMPLETE - FULLY APPROVED
      requirement.status = 'approved';
      requirement.approvalProgress.allLevelsCompleted = true;
      fullyApproved = true;

      // Send fully approved notification (Template 7)
      const approvedNotifications = await approvalEmailService.notifyFullyApproved(
        requirement,
        requirement.createdBy
      );
      notifications = [...notifications, ...approvedNotifications];
    }
  }

  // STEP 11: Save notification history
  requirement.notificationHistory = [
    ...(requirement.notificationHistory || []),
    ...notifications
  ];

  // STEP 12: Save requirement
  await requirement.save();

  // STEP 13: Return response
  const response = {
    success: true,
    statusCode: 200,
    message: fullyApproved 
      ? 'Requirement fully approved! Ready to publish.' 
      : levelAdvanced 
        ? `Approved! Moving to Level ${requirement.approvalProgress.currentLevel}`
        : 'Approved successfully',
    data: {
      requirementId: requirement._id,
      status: requirement.status,
      approvalProgress: requirement.approvalProgress,
      levelAdvanced,
      fullyApproved,
      readyToPublish: fullyApproved
    }
  };

  // Add next approvers if level advanced
  if (levelAdvanced) {
    const nextLevel = requirement.approvalProgress.levels.find(
      l => l.levelNumber === requirement.approvalProgress.currentLevel
    );
    response.data.nextApprovers = nextLevel?.approvers.map(a => ({
      memberId: a.memberId,
      memberName: a.memberName,
      memberEmail: a.memberEmail,
      notifiedAt: a.notifiedAt
    }));
  }

  return res.json(response);
}
```

### 5.2 Reject Endpoint Logic

```javascript
// POST /api/v1/industry/requirements/:requirementId/reject

async function reject(req, res) {
  const { requirementId } = req.params;
  const { reason, comments, allowResubmission = true, resubmissionDeadline } = req.body;
  const currentUserId = req.user.id;
  const approvalEmailService = new ApprovalEmailService();

  // STEP 1: Validate reason is provided
  if (!reason || reason.trim() === '') {
    return res.status(400).json({
      success: false,
      error: { code: 'REASON_REQUIRED', message: 'Rejection reason is required' }
    });
  }

  // STEP 2: Fetch requirement
  const requirement = await Requirement.findById(requirementId);
  if (!requirement) {
    return res.status(404).json({ 
      success: false, 
      error: { code: 'REQUIREMENT_NOT_FOUND' } 
    });
  }

  // STEP 3: Validate status
  if (requirement.status !== 'pending') {
    return res.status(400).json({ 
      success: false, 
      error: { code: 'NOT_PENDING' } 
    });
  }

  // STEP 4-6: Same validation as approve (find level, find approver)
  const currentLevelIndex = requirement.approvalProgress.levels.findIndex(
    l => l.levelNumber === requirement.approvalProgress.currentLevel
  );
  
  if (currentLevelIndex === -1) {
    return res.status(400).json({ 
      success: false, 
      error: { code: 'INVALID_APPROVAL_STATE' } 
    });
  }

  const currentLevel = requirement.approvalProgress.levels[currentLevelIndex];

  if (currentLevel.status !== 'in_progress') {
    return res.status(400).json({ 
      success: false, 
      error: { code: 'LEVEL_NOT_ACTIVE' } 
    });
  }

  const approverIndex = currentLevel.approvers.findIndex(
    a => a.memberId.toString() === currentUserId
  );

  if (approverIndex === -1) {
    return res.status(403).json({ 
      success: false, 
      error: { code: 'NOT_AUTHORIZED', message: 'You are not an approver for this level' } 
    });
  }

  const approver = currentLevel.approvers[approverIndex];

  if (approver.status !== 'pending') {
    return res.status(400).json({ 
      success: false, 
      error: { code: 'ALREADY_APPROVED' } 
    });
  }

  // STEP 7: Update requirement status to rejected
  requirement.status = 'rejected';
  
  // STEP 8: Store rejection details
  requirement.rejectionDetails = {
    reason,
    comments: comments || null,
    rejectedBy: currentUserId,
    rejectedByName: req.user.name,
    rejectedByEmail: req.user.email,
    rejectedAt: new Date(),
    levelRejectedAt: requirement.approvalProgress.currentLevel,
    allowResubmission,
    resubmissionDeadline: resubmissionDeadline ? new Date(resubmissionDeadline) : null
  };

  // STEP 9: Update approver status
  requirement.approvalProgress.levels[currentLevelIndex].approvers[approverIndex] = {
    ...approver.toObject(),
    status: 'rejected',
    rejectedAt: new Date(),
    comments: reason
  };

  // STEP 10: Send rejection notifications (Template 6)
  const allInvolved = approvalEmailService.getAllInvolvedParties(requirement);
  const notifications = await approvalEmailService.notifyRejection(
    requirement,
    { ...approver.toObject(), reason },
    allInvolved
  );

  // STEP 11: Save notification history
  requirement.notificationHistory = [
    ...(requirement.notificationHistory || []),
    ...notifications
  ];

  // STEP 12: Save requirement
  await requirement.save();

  // STEP 13: Return response
  return res.json({
    success: true,
    statusCode: 200,
    message: 'Requirement rejected',
    data: {
      requirementId: requirement._id,
      status: 'rejected',
      rejectedAt: requirement.rejectionDetails.rejectedAt,
      rejectedBy: {
        id: currentUserId,
        name: req.user.name,
        email: req.user.email
      },
      rejectionDetails: {
        reason: requirement.rejectionDetails.reason,
        comments: requirement.rejectionDetails.comments,
        allowResubmission: requirement.rejectionDetails.allowResubmission,
        resubmissionDeadline: requirement.rejectionDetails.resubmissionDeadline
      },
      canResubmit: allowResubmission
    }
  });
}
```

### 5.3 Creator Filter Aggregation

```javascript
// Helper function to get unique creators for filter dropdown

async function getUniqueCreators(companyId, status) {
  return await Requirement.aggregate([
    { 
      $match: { 
        companyId: new ObjectId(companyId), 
        status: status 
      } 
    },
    { 
      $group: { 
        _id: '$createdBy.id', 
        name: { $first: '$createdBy.name' },
        email: { $first: '$createdBy.email' },
        count: { $sum: 1 }
      }
    },
    { 
      $project: {
        _id: 0,
        id: '$_id',
        name: 1,
        email: 1,
        count: 1
      }
    },
    { $sort: { name: 1 } }
  ]);
}
```

### 5.4 Statistics Calculation

```javascript
// Calculate statistics for pending approvals

async function calculatePendingStatistics(companyId, currentUserId) {
  const stats = await Requirement.aggregate([
    { $match: { companyId: new ObjectId(companyId), status: 'pending' } },
    {
      $facet: {
        total: [{ $count: 'count' }],
        byLevel: [
          { $group: { _id: '$currentApprovalLevel', count: { $sum: 1 } } }
        ],
        overdue: [
          {
            $match: {
              sentForApprovalAt: {
                $lt: new Date(Date.now() - 48 * 60 * 60 * 1000) // 48 hours ago
              }
            }
          },
          { $count: 'count' }
        ],
        awaitingMyApproval: [
          {
            $match: {
              'approvalProgress.levels': {
                $elemMatch: {
                  status: 'in_progress',
                  'approvers': {
                    $elemMatch: {
                      memberId: new ObjectId(currentUserId),
                      status: 'pending'
                    }
                  }
                }
              }
            }
          },
          { $count: 'count' }
        ]
      }
    }
  ]);

  const result = stats[0];
  
  return {
    total: result.total[0]?.count || 0,
    awaitingMyApproval: result.awaitingMyApproval[0]?.count || 0,
    level1Pending: result.byLevel.find(l => l._id === 1)?.count || 0,
    level2Pending: result.byLevel.find(l => l._id === 2)?.count || 0,
    level3Pending: result.byLevel.find(l => l._id === 3)?.count || 0,
    overdueApprovals: result.overdue[0]?.count || 0
  };
}
```

---

## 6. Task Breakdown

### Backend Tasks Summary

| Task ID | Task Name | Priority | Hours | Dependencies |
|---------|-----------|----------|-------|--------------|
| BE-001 | MongoDB Schema Updates | Critical | 8 | None |
| BE-002 | Migration Script | Critical | 2 | BE-001 |
| BE-003 | Create 8 Email Templates (HTML) | High | 16 | None |
| BE-004 | Email Template Seeder | High | 2 | BE-003 |
| BE-005 | ApprovalEmailService Class | High | 12 | BE-003 |
| BE-006 | List Endpoints (Creator Filter) | High | 6 | BE-001 |
| BE-007 | Statistics Aggregation | Medium | 4 | BE-001 |
| BE-008 | Approve Endpoint | Critical | 8 | BE-001, BE-005 |
| BE-009 | Reject Endpoint | Critical | 6 | BE-001, BE-005 |
| BE-010 | Publish Endpoint | High | 4 | BE-001, BE-005 |
| BE-011 | Resubmit Endpoint | Medium | 4 | BE-001, BE-005 |
| BE-012 | Update Routes | High | 2 | BE-008, BE-009, BE-010 |
| BE-013 | Unit Tests | Medium | 8 | All |

**Total Backend Hours: 82**

### Implementation Order

1. **Phase 1 - Foundation (Week 1)**
   - BE-001: MongoDB Schema Updates
   - BE-002: Migration Script
   - BE-003: Create Email Templates

2. **Phase 2 - Services (Week 2)**
   - BE-004: Email Template Seeder
   - BE-005: ApprovalEmailService Class
   - BE-006: List Endpoints with Creator Filter

3. **Phase 3 - Core Actions (Week 2-3)**
   - BE-008: Approve Endpoint
   - BE-009: Reject Endpoint
   - BE-010: Publish Endpoint

4. **Phase 4 - Polish (Week 3)**
   - BE-007: Statistics Aggregation
   - BE-011: Resubmit Endpoint
   - BE-012: Update Routes
   - BE-013: Unit Tests

---

## Appendix: Email Template Design Specifications

All templates should follow the existing Diligince AI theme:

| Element | Specification |
|---------|---------------|
| Header Background | `#153b60` (Corporate Navy) |
| Header Logo | "Diligince AI" text-based |
| Body Background | `#ffffff` (White) |
| Max Width | 600px |
| Padding | 50px 40px |
| Primary Font | -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto |
| CTA Button Color | `#153b60` |
| CTA Button Radius | 8px |
| Footer Background | `#f9fafb` (Light Gray) |
| Link Color | `#153b60` |

See `docs/emailTemplates/approval/README.md` for detailed template specifications.
