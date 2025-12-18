# API Communication Document: Requirement View & Publish Workflow

## Document Purpose
This document specifies the complete frontend-backend API contract for viewing requirements in read-only mode across all statuses (pending, approved, published) and the publish workflow with email notifications.

---

## 1. Single Requirement Detail Endpoint

### Issue
The `GET /api/v1/industry/requirements/:id` endpoint must return **ALL fields** stored during requirement creation, not a subset optimized for listing pages.

### Endpoint
**`GET /api/v1/industry/requirements/:id`**

### Complete Response Schema

```json
{
  "success": true,
  "data": {
    // ===== IDENTIFIERS =====
    "id": "req_abc123",
    "draftId": "draft_xyz789",
    "requirementId": "REQ-2024-001",
    
    // ===== BASIC INFO (Step 1 in Create Form) =====
    "title": "Software Development Services",
    "category": "service",
    "priority": "high",
    "department": "Engineering",
    "costCenter": "CC-1001",
    "estimatedBudget": 50000,
    "deadline": "2024-03-15T17:00:00Z",
    "businessJustification": "We need to automate our customer onboarding process to reduce manual effort by 70% and improve customer experience scores.",
    "requestedBy": "John Doe",
    "urgency": false,
    "budgetApproved": true,
    "complianceRequired": true,
    "riskLevel": "medium",
    
    // ===== DETAILS & SPECIFICATIONS (Step 2 in Create Form) =====
    "description": "Detailed description of the requirement including scope, objectives, and deliverables...",
    
    // Product-specific (when category = "product")
    "productSpecifications": "Detailed product specifications...",
    "quantity": 100,
    "unitOfMeasure": "units",
    "technicalRequirements": "Must comply with ISO 9001 quality standards...",
    "qualityStandards": "ISO 9001, CE Marking required",
    "technicalStandards": ["ISO 9001", "ISO 27001"],
    "productDeliveryDate": "2024-04-01",
    
    // Service-specific (when category = "service")
    "serviceDescription": "End-to-end implementation of CRM system...",
    "scopeOfWork": "Design, development, testing, and deployment...",
    "performanceMetrics": "99.9% uptime SLA, <2s response time",
    "serviceStartDate": "2024-02-01",
    "serviceEndDate": "2024-08-01",
    "serviceBudget": 50000,
    "location": "Mumbai, India",
    
    // Expert-specific (when category = "expert")
    "specialization": "Cloud Architecture",
    "certifications": ["AWS Solutions Architect", "Azure Expert"],
    "duration": 6,
    "startDate": "2024-02-15",
    "endDate": "2024-08-15",
    
    // Logistics-specific (when category = "logistics")
    "equipmentType": "Heavy Machinery",
    "pickupLocation": "Mumbai Port",
    "deliveryLocation": "Chennai Factory",
    "weight": 5000,
    "dimensions": "10x8x6 meters",
    "pickupDate": "2024-03-01",
    "deliveryDate": "2024-03-15",
    "specialHandling": "Temperature controlled, fragile equipment",
    
    // Generic specifications object (for additional key-value pairs)
    "specifications": {
      "customField1": "value1",
      "customField2": "value2"
    },
    
    // ===== DOCUMENTS (Step 3 in Create Form) =====
    "documents": [
      {
        "id": "doc_123",
        "name": "technical_specification.pdf",
        "type": "application/pdf",
        "documentType": "specification",
        "size": 2457600,
        "url": "https://storage.diligince.ai/docs/doc_123.pdf",
        "uploadedAt": "2024-01-15T10:30:00Z",
        "uploadedBy": "user_123",
        "version": 1
      },
      {
        "id": "doc_124",
        "name": "compliance_certificate.pdf",
        "type": "application/pdf",
        "documentType": "compliance",
        "size": 1024000,
        "url": "https://storage.diligince.ai/docs/doc_124.pdf",
        "uploadedAt": "2024-01-15T11:00:00Z",
        "uploadedBy": "user_123",
        "version": 1
      }
    ],
    
    // ===== APPROVAL WORKFLOW (Step 4 in Create Form) =====
    "selectedApprovalMatrixId": "matrix_001",
    "selectedApprovalMatrix": {
      "id": "matrix_001",
      "name": "Standard 2-Level Approval",
      "totalLevels": 2,
      "description": "Approval for requirements up to $100,000"
    },
    "isSentForApproval": true,
    "sentForApprovalAt": "2024-01-16T09:00:00Z",
    "approvalProgress": {
      "currentLevel": 2,
      "totalLevels": 2,
      "allLevelsCompleted": true,
      "estimatedCompletionDate": "2024-01-25T17:00:00Z",
      "levels": [
        {
          "levelNumber": 1,
          "name": "Department Head",
          "status": "completed",
          "maxApprovalTimeHours": 48,
          "completedAt": "2024-01-17T14:00:00Z",
          "approvers": [
            {
              "memberId": "user_456",
              "memberName": "Jane Smith",
              "memberEmail": "jane.smith@company.com",
              "memberRole": "Department Head",
              "isMandatory": true,
              "status": "approved",
              "approvedAt": "2024-01-17T14:00:00Z",
              "comments": "Approved. Budget verified."
            }
          ]
        },
        {
          "levelNumber": 2,
          "name": "Finance Manager",
          "status": "completed",
          "maxApprovalTimeHours": 72,
          "completedAt": "2024-01-20T16:30:00Z",
          "approvers": [
            {
              "memberId": "user_789",
              "memberName": "Bob Wilson",
              "memberEmail": "bob.wilson@company.com",
              "memberRole": "Finance Manager",
              "isMandatory": true,
              "status": "approved",
              "approvedAt": "2024-01-20T16:30:00Z",
              "comments": "Final approval granted."
            }
          ]
        }
      ]
    },
    
    // ===== STATUS & METADATA =====
    "status": "approved",
    "approvalStatus": "approved",
    
    // Creator info
    "createdBy": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john.doe@company.com"
    },
    "createdAt": "2024-01-15T08:00:00Z",
    "lastModified": "2024-01-20T16:30:00Z",
    
    // Approval metadata (populated after approval)
    "approvedBy": {
      "id": "user_789",
      "name": "Bob Wilson",
      "email": "bob.wilson@company.com"
    },
    "approvedDate": "2024-01-20T16:30:00Z",
    
    // Publication metadata (populated after publishing)
    "publishedAt": null,
    "publishedBy": null,
    "publishDate": null,
    
    // Engagement metrics (populated after publishing)
    "quotesReceived": 0,
    "engagement": null,
    
    // Permissions (computed based on user role and requirement status)
    "canEdit": false,
    "canPublish": true,
    "canApprove": false,
    "canReject": false
  }
}
```

### Backend Implementation Notes

1. **Fetch complete document** from MongoDB `requirements` collection
2. **Transform field names** if backend stores differently (e.g., `estimated_budget` → `estimatedBudget`)
3. **Populate nested objects** (`createdBy`, `approvedBy`, `selectedApprovalMatrix`)
4. **Compute permissions** based on requesting user's role and requirement status
5. **Include documents with signed URLs** (generate presigned URLs for S3/cloud storage)

---

## 2. Publish Requirement Endpoint

### Endpoint
**`POST /api/v1/industry/requirements/:requirementId/publish`**

### Request Body
```json
{
  "visibility": "all",
  "selectedVendors": [],
  "notifyByEmail": true,
  "notifyByApp": true,
  "submissionDeadline": "2024-03-15T17:00:00Z",
  "publishNotes": "Optional notes for vendors"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "requirementId": "req_abc123",
    "status": "published",
    "publishedAt": "2024-01-21T09:00:00Z",
    "publishedBy": {
      "id": "user_123",
      "name": "John Doe"
    },
    "vendorsNotified": 45,
    "emailsSent": 47,
    "inAppNotificationsSent": 47
  }
}
```

### Backend Actions on Publish

1. **Validate** requirement status is `approved`
2. **Update requirement**:
   - Set `status` to `published`
   - Set `publishedAt` to current timestamp
   - Set `publishedBy` to current user object
3. **Collect email recipients**:
   - Creator (`requirement.createdBy`)
   - All approvers who approved (from `approvalProgress.levels[].approvers[]` where `status === 'approved'`)
4. **Fetch email template** from `emailtemplates` collection:
   - Query: `{ templateId: 'requirement-published-notification' }`
5. **Send emails** to each recipient using the template with personalized variables
6. **Send in-app notifications** if `notifyByApp: true`
7. **Log audit entry** for publish action

---

## 3. Email Notification (Generic Template)

### Template Source
Use existing template from MongoDB `emailtemplates` collection:
- **Template ID:** `requirement-published-notification`

### Recipients
| Recipient Type | Source | Count |
|----------------|--------|-------|
| Creator | `requirement.createdBy.email` | 1 |
| Approvers | `approvalProgress.levels[].approvers[]` where `status === 'approved'` | N |

### Template Variables
The backend should populate these variables when sending:

| Variable | Value Source | Example |
|----------|--------------|---------|
| `recipientName` | Recipient's name (personalized per email) | "John Doe" |
| `requirementTitle` | `requirement.title` | "Software Development Services" |
| `requirementId` | `requirement.requirementId` | "REQ-2024-001" |
| `publisherName` | Current user's name | "John Doe" |
| `publishedAt` | Formatted timestamp | "January 21, 2024 at 9:00 AM" |
| `submissionDeadline` | `requirement.deadline` formatted | "March 15, 2024" |
| `vendorCount` | Count of vendors notified | "45" |
| `visibility` | Based on request visibility | "All Vendors" or "Selected Vendors" |
| `viewPublishedUrl` | Dashboard URL | `${APP_URL}/dashboard/requirements/published/${id}` |
| `category` | `requirement.category` | "Service" |
| `estimatedBudget` | Formatted budget | "₹50,000" |

### Email Send Logic (Pseudocode)
```javascript
async function sendPublishNotifications(requirement, publisher, vendorsNotified) {
  // 1. Fetch template
  const template = await EmailTemplate.findOne({ 
    templateId: 'requirement-published-notification' 
  });
  
  // 2. Collect recipients
  const recipients = [];
  
  // Add creator
  recipients.push({
    email: requirement.createdBy.email,
    name: requirement.createdBy.name
  });
  
  // Add all approved approvers (deduplicate by email)
  const approverEmails = new Set([requirement.createdBy.email]);
  for (const level of requirement.approvalProgress.levels) {
    for (const approver of level.approvers) {
      if (approver.status === 'approved' && !approverEmails.has(approver.memberEmail)) {
        approverEmails.add(approver.memberEmail);
        recipients.push({
          email: approver.memberEmail,
          name: approver.memberName
        });
      }
    }
  }
  
  // 3. Send personalized emails
  for (const recipient of recipients) {
    await sendEmail({
      to: recipient.email,
      template: template,
      variables: {
        recipientName: recipient.name,
        requirementTitle: requirement.title,
        requirementId: requirement.requirementId,
        publisherName: publisher.name,
        publishedAt: formatDate(new Date()),
        submissionDeadline: formatDate(requirement.deadline),
        vendorCount: vendorsNotified,
        visibility: 'All Vendors',
        viewPublishedUrl: `${APP_URL}/dashboard/requirements/published/${requirement.id}`,
        category: capitalize(requirement.category),
        estimatedBudget: formatCurrency(requirement.estimatedBudget)
      }
    });
  }
  
  return recipients.length;
}
```

---

## 4. Field Mapping Reference

| Frontend Field | MongoDB Field | Notes |
|---------------|---------------|-------|
| `estimatedBudget` | `estimated_budget` or `budget.amount` | Number in smallest currency unit |
| `createdBy.name` | `created_by.first_name + created_by.last_name` | Concatenate names |
| `createdAt` | `created_at` or `createdAt` | ISO 8601 format |
| `businessJustification` | `business_justification` | Text field |
| `technicalRequirements` | `technical_requirements` | Text field |
| `qualityStandards` | `quality_standards` | Text field |
| `documents[].documentType` | `documents[].document_type` | Enum: specification, drawing, reference, compliance, other |
| `approvalProgress` | Computed from `approval_levels` array | Aggregate approver statuses |

---

## 5. Implementation Checklist

### Backend Tasks (Estimated: 12 hours)

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 1 | Update `GET /requirements/:id` to return ALL fields from creation form | Critical | 4h |
| 2 | Ensure `documents` array includes `documentType`, `size`, `url` fields | Critical | 2h |
| 3 | Ensure `createdBy`, `approvedBy` are populated objects (not strings) | High | 1h |
| 4 | Ensure `approvalProgress` includes complete level and approver details | High | 2h |
| 5 | Use existing `requirement-published-notification` template to send emails | High | 2h |
| 6 | Add `quotesReceived` field to published requirements | Medium | 1h |

### Frontend Tasks (Already Complete)

| # | Component/Page | Status |
|---|----------------|--------|
| 1 | `ViewBasicInfoSection` component | ✅ Complete |
| 2 | `ViewDetailsSection` component | ✅ Complete |
| 3 | `ViewDocumentsSection` component | ✅ Complete |
| 4 | `ViewApprovalSection` component | ✅ Complete |
| 5 | `RequirementViewLayout` component | ✅ Complete |
| 6 | `ApprovedRequirementView` page | ✅ Complete |
| 7 | `PublishedRequirementView` page | ✅ Complete |
| 8 | `PendingRequirementView` page | ✅ Complete |

---

## 6. Testing Checklist

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 1 | View Pending Requirement | All 4 sections display complete data |
| 2 | View Approved Requirement | All 4 sections display data + Publish button visible to creator |
| 3 | View Published Requirement | All 4 sections display data + Quotes badge visible |
| 4 | Publish Requirement | Status changes to published, emails sent, redirects to published list |
| 5 | Email to Creator | Receives `requirement-published-notification` with personalized variables |
| 6 | Email to Approvers | Each approver receives same template with their name |

---

## 7. Summary

| Item | Details |
|------|---------|
| **Email Template** | Use existing `requirement-published-notification` from `emailtemplates` collection |
| **Recipients** | Creator + All approvers who approved (deduplicated by email) |
| **Personalization** | Only `recipientName` changes per email; all other variables are same |
| **Backend Effort** | ~12 hours total (4h for detail endpoint, 2h for emails) |
| **Frontend Status** | All view components and pages already implemented |
