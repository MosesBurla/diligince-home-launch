# Approval Workflow Email Templates

## Overview

This document describes the 8 email templates required for the multi-level approval workflow system. All templates follow the existing Diligince AI brand theme.

---

## Design Specifications

### Color Palette

| Element | Color Code | Usage |
|---------|------------|-------|
| Primary (Corporate Navy) | `#153b60` | Header, buttons, links |
| White | `#ffffff` | Body background |
| Light Gray | `#f9fafb` | Footer background |
| Text Primary | `#1f2937` | Body text |
| Text Secondary | `#6b7280` | Secondary text |
| Success Green | `#10b981` | Approval badges |
| Error Red | `#ef4444` | Rejection badges |
| Warning Amber | `#f59e0b` | Pending badges |

### Typography

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

| Element | Size | Weight |
|---------|------|--------|
| Logo | 24px | Bold |
| Heading (H1) | 24px | Bold |
| Heading (H2) | 20px | Semi-bold |
| Body | 16px | Normal |
| Small | 14px | Normal |
| Footer | 12px | Normal |

### Layout

| Property | Value |
|----------|-------|
| Max Width | 600px |
| Padding (Header) | 30px 40px |
| Padding (Body) | 40px |
| Padding (Footer) | 30px 40px |
| Border Radius (Buttons) | 8px |
| Border Radius (Cards) | 8px |

### CTA Buttons

```css
.cta-button {
  display: inline-block;
  background-color: #153b60;
  color: #ffffff;
  padding: 14px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
}

.cta-button-secondary {
  background-color: #ffffff;
  color: #153b60;
  border: 2px solid #153b60;
}

.cta-button-danger {
  background-color: #ef4444;
  color: #ffffff;
}
```

---

## Template 1: Approval Request - To Approvers

**File:** `templates/emails/approval/approval-sent-to-approvers.html`

**Trigger:** When requirement is sent for approval  
**Recipients:** All Level 1 approvers

### Subject Line
```
🔔 Approval Required: {{requirementTitle}}
```

### Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| approverName | string | Recipient's name | "Alice Manager" |
| requirementTitle | string | Requirement title | "Office Furniture Procurement" |
| requirementId | string | Requirement ID | "6925d6de23c5d620002a6eac" |
| category | string | Category | "Furniture" |
| priority | string | Priority level | "High" |
| estimatedBudget | string | Formatted budget | "₹50,000" |
| department | string | Department | "Operations" |
| creatorName | string | Creator's name | "John Doe" |
| creatorEmail | string | Creator's email | "john@company.com" |
| submittedAt | string | Submission date | "Jan 9, 2025, 10:30 AM" |
| maxApprovalTime | number | Max hours to approve | 24 |
| mandatoryStatus | string | "Mandatory" or "Optional" | "Mandatory" |
| approveUrl | string | Direct approve link | "https://..." |
| rejectUrl | string | Direct reject link | "https://..." |
| viewDetailsUrl | string | View details link | "https://..." |
| appUrl | string | App base URL | "https://app.diligince.ai" |
| privacyUrl | string | Privacy policy URL | "https://..." |
| termsUrl | string | Terms URL | "https://..." |
| currentYear | number | Current year | 2025 |

### Template Structure

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Approval Required</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #153b60; padding: 30px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Diligince AI</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 20px;">Hi {{approverName}},</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px;">
                A new requirement needs your approval. Please review and take action.
              </p>
              
              <!-- Requirement Card -->
              <table width="100%" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #153b60; margin: 0 0 16px;">{{requirementTitle}}</h3>
                    <table width="100%">
                      <tr>
                        <td width="50%" style="padding: 4px 0;">
                          <span style="color: #6b7280;">Category:</span>
                          <strong style="color: #1f2937;">{{category}}</strong>
                        </td>
                        <td width="50%" style="padding: 4px 0;">
                          <span style="color: #6b7280;">Priority:</span>
                          <strong style="color: #1f2937;">{{priority}}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0;">
                          <span style="color: #6b7280;">Budget:</span>
                          <strong style="color: #1f2937;">{{estimatedBudget}}</strong>
                        </td>
                        <td style="padding: 4px 0;">
                          <span style="color: #6b7280;">Department:</span>
                          <strong style="color: #1f2937;">{{department}}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 4px 0;">
                          <span style="color: #6b7280;">Submitted by:</span>
                          <strong style="color: #1f2937;">{{creatorName}}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Status Badge -->
              <p style="margin: 0 0 24px;">
                <span style="background-color: {{#if mandatoryStatus == 'Mandatory'}}#fef3c7{{else}}#e0f2fe{{/if}}; color: {{#if mandatoryStatus == 'Mandatory'}}#92400e{{else}}#0369a1{{/if}}; padding: 4px 12px; border-radius: 4px; font-size: 14px;">
                  {{mandatoryStatus}} Approval
                </span>
                <span style="color: #6b7280; font-size: 14px; margin-left: 12px;">
                  Please respond within {{maxApprovalTime}} hours
                </span>
              </p>
              
              <!-- CTA Buttons -->
              <table width="100%">
                <tr>
                  <td align="center" style="padding: 8px;">
                    <a href="{{approveUrl}}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                      ✓ Approve
                    </a>
                  </td>
                  <td align="center" style="padding: 8px;">
                    <a href="{{rejectUrl}}" style="display: inline-block; background-color: #ef4444; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                      ✗ Reject
                    </a>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" align="center" style="padding: 16px 0 0;">
                    <a href="{{viewDetailsUrl}}" style="color: #153b60; text-decoration: underline;">
                      View Full Details →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px;">
                This email was sent by Diligince AI
              </p>
              <p style="margin: 0;">
                <a href="{{privacyUrl}}" style="color: #153b60; font-size: 12px;">Privacy Policy</a>
                <span style="color: #d1d5db; margin: 0 8px;">|</span>
                <a href="{{termsUrl}}" style="color: #153b60; font-size: 12px;">Terms of Service</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0;">
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

---

## Template 2: Submission Confirmed - To Creator

**File:** `templates/emails/approval/submission-confirmed-to-creator.html`

**Trigger:** When requirement is sent for approval  
**Recipients:** Requirement creator

### Subject Line
```
✅ Submitted for Approval: {{requirementTitle}}
```

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| creatorName | string | Creator's name |
| requirementTitle | string | Requirement title |
| requirementId | string | Requirement ID |
| matrixName | string | Approval matrix name |
| totalLevels | number | Total approval levels |
| approverCount | number | Total number of approvers |
| trackStatusUrl | string | Link to track status |
| appUrl, privacyUrl, termsUrl, currentYear | - | Standard footer variables |

### Content Summary
- Confirmation that requirement was submitted
- Display approval matrix name and level count
- Show total approvers involved
- CTA to track approval status

---

## Template 3: Approval Received Notification

**File:** `templates/emails/approval/approval-received-notification.html`

**Trigger:** When any approver approves  
**Recipients:** All level approvers + Creator

### Subject Line
```
✅ Approval Received: {{requirementTitle}}
```

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| recipientName | string | Recipient's name |
| requirementTitle | string | Requirement title |
| requirementId | string | Requirement ID |
| approverName | string | Name of approver who approved |
| approverRole | string | Role of approver |
| approvalComments | string | Comments from approver |
| approvedAt | string | Approval timestamp |
| currentLevel | number | Current level number |
| approvedCount | number | Count of approved |
| totalApprovers | number | Total approvers in level |
| pendingCount | number | Pending approvals count |
| levelStatus | string | "In Progress" or "Completed" |
| allMandatoryApproved | boolean | All mandatory approved? |
| viewDetailsUrl | string | View details link |

### Content Summary
- Notify that [Approver Name] approved
- Show approval comments/conditions if any
- Display approval progress (X of Y approved)
- Level status indicator
- CTA to view details

---

## Template 4: Level Completed Notification

**File:** `templates/emails/approval/level-completed-notification.html`

**Trigger:** When all mandatory approvers in a level approve  
**Recipients:** Completed level approvers + Creator

### Subject Line
```
✅ Level {{completedLevel}} Complete: {{requirementTitle}}
```

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| recipientName | string | Recipient's name |
| requirementTitle | string | Requirement title |
| requirementId | string | Requirement ID |
| completedLevel | number | Completed level number |
| completedLevelName | string | Level name |
| totalApprovers | number | Total in level |
| approvedCount | number | Approved count |
| completionTime | string | Time taken to complete |
| nextLevel | number | Next level number |
| nextLevelName | string | Next level name |
| nextLevelApproverCount | number | Approvers in next level |
| nextLevelMaxTime | number | Max hours for next level |
| trackProgressUrl | string | Track progress link |

### Content Summary
- Celebrate level completion
- Show time taken
- Preview next level information
- CTA to track overall progress

---

## Template 5: New Level Approval Request

**File:** `templates/emails/approval/new-level-approval-request.html`

**Trigger:** When previous level completes  
**Recipients:** All approvers in the new level

### Subject Line
```
🔔 Your Approval Required (Level {{currentLevel}}): {{requirementTitle}}
```

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| approverName | string | Approver's name |
| requirementTitle | string | Requirement title |
| requirementId | string | Requirement ID |
| category | string | Category |
| priority | string | Priority |
| estimatedBudget | string | Formatted budget |
| creatorName | string | Creator's name |
| currentLevel | number | Current level |
| mandatoryStatus | string | Mandatory/Optional |
| maxApprovalTime | number | Max hours to approve |
| completedLevels | array | Array of completed levels with names and approvers |
| approveUrl | string | Approve link |
| rejectUrl | string | Reject link |
| viewDetailsUrl | string | View details link |

### Content Summary
- Similar to Template 1 but includes summary of previously completed levels
- Shows that previous levels have approved
- Urgency indicator based on level
- Approve/Reject CTAs

---

## Template 6: Rejection Notification

**File:** `templates/emails/approval/rejection-notification.html`

**Trigger:** When any approver rejects  
**Recipients:** Creator + All approvers (in current and previous levels)

### Subject Line
```
❌ Requirement Rejected: {{requirementTitle}}
```

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| recipientName | string | Recipient's name |
| isCreator | boolean | Is this the creator? |
| requirementTitle | string | Requirement title |
| requirementId | string | Requirement ID |
| rejectorName | string | Name of rejector |
| rejectorRole | string | Role of rejector |
| rejectedLevel | number | Level where rejected |
| levelName | string | Level name |
| rejectedAt | string | Rejection timestamp |
| rejectionReason | string | Primary reason |
| rejectionComments | string | Additional comments |
| allowResubmission | boolean | Can resubmit? |
| resubmissionDeadline | string | Deadline if allowed |
| editResubmitUrl | string | Edit & resubmit link (creator only) |
| viewDetailsUrl | string | View details link |

### Content Summary
- Clear rejection message
- Display rejection reason and comments
- Conditional section for resubmission (if allowed)
  - Show deadline
  - CTA to edit and resubmit (creator only)
- CTA to view details

---

## Template 7: Fully Approved - Ready to Publish

**File:** `templates/emails/approval/fully-approved-ready-to-publish.html`

**Trigger:** When all approval levels complete  
**Recipients:** Creator only

### Subject Line
```
🎉 Ready to Publish: {{requirementTitle}}
```

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| creatorName | string | Creator's name |
| requirementTitle | string | Requirement title |
| requirementId | string | Requirement ID |
| approvedAt | string | Final approval timestamp |
| totalLevels | number | Total levels completed |
| totalApprovers | number | Total approvers involved |
| totalApprovalTime | string | Total time taken |
| levels | array | Array of level summaries |
| publishNowUrl | string | Publish now link |
| viewDetailsUrl | string | View details link |

### Levels Array Item
```javascript
{
  levelNumber: 1,
  levelName: "Department Head",
  approverNames: "Alice Manager, Bob Lead",
  completedAt: "Jan 9, 2025, 2:30 PM"
}
```

### Content Summary
- Celebration message
- Summary of all approval levels with approver names
- Total time taken for full approval
- Prominent "Publish Now" CTA
- Secondary "View Details" link

---

## Template 8: Requirement Published Notification

**File:** `templates/emails/approval/requirement-published-notification.html`

**Trigger:** When creator publishes  
**Recipients:** Creator + All approvers

### Subject Line
```
🚀 Published: {{requirementTitle}}
```

### Variables

| Variable | Type | Description |
|----------|------|-------------|
| recipientName | string | Recipient's name |
| requirementTitle | string | Requirement title |
| requirementId | string | Requirement ID |
| publisherName | string | Publisher's name |
| publishedAt | string | Published timestamp |
| submissionDeadline | string | Vendor submission deadline |
| vendorCount | number | Number of vendors notified |
| visibility | string | Visibility setting |
| viewPublishedUrl | string | Public requirement URL |

### Content Summary
- Announcement that requirement is now live
- Show publisher info and timestamp
- Display vendor notification count
- Submission deadline info
- CTA to view published requirement

---

## Template File Structure

```
templates/
└── emails/
    └── approval/
        ├── approval-sent-to-approvers.html
        ├── submission-confirmed-to-creator.html
        ├── approval-received-notification.html
        ├── level-completed-notification.html
        ├── new-level-approval-request.html
        ├── rejection-notification.html
        ├── fully-approved-ready-to-publish.html
        └── requirement-published-notification.html
```

---

## Testing Checklist

For each template, verify:

- [ ] Renders correctly in Gmail (web and mobile)
- [ ] Renders correctly in Outlook (desktop and web)
- [ ] Renders correctly in Apple Mail
- [ ] All variables are replaced correctly
- [ ] Links are clickable and correct
- [ ] Images load properly (if any)
- [ ] Responsive on mobile devices
- [ ] Plain text fallback available
- [ ] Unsubscribe link works (if applicable)
- [ ] Subject line renders with variables

---

## Email Trigger Matrix

| Event | Template(s) | Recipients |
|-------|-------------|------------|
| Send for Approval | 1, 2 | Level 1 Approvers, Creator |
| Approver Approves (level not complete) | 3 | Level Approvers + Creator |
| Level Completes (more levels remain) | 3, 4, 5 | All involved + Next Level |
| All Levels Complete | 3, 4, 7 | All involved + Creator |
| Approver Rejects | 6 | Creator + All Approvers |
| Creator Publishes | 8 | Creator + All Approvers |
