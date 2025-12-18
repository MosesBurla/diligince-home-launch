# Requirements Module

## What is the Requirements Module?

The Requirements Module is where you create, manage, and publish procurement requirements. It's the starting point of the procurement lifecycle, where you define what products or services you need from vendors.

## Key Features

- **6-Step Creation Wizard**: Guided requirement creation
- **Draft Auto-Save**: Never lose your work
- **Approval Workflow**: Multi-level approval before publishing
- **Document Management**: Attach specifications, drawings, etc.
- **Category-Based Forms**: Dynamic fields based on requirement type
- **Status Tracking**: Track requirements through their lifecycle

---

## Requirement Statuses

| Status | Description |
|--------|-------------|
| **Draft** | Work in progress, not submitted |
| **Pending Approval** | Submitted, awaiting approval |
| **Approved** | Approved, ready to publish |
| **Published** | Live, accepting vendor quotations |
| **Archived** | Closed or expired |

---

## Requirements Submodules

### 1. Create New
Create a new procurement requirement using the 6-step wizard.

### 2. Drafts
View and manage requirements you've started but not submitted:
- Resume editing
- Delete unwanted drafts
- View last saved time
- Track completion progress

### 3. Pending Approval
Requirements submitted and awaiting approval:
- View approval status
- See who needs to approve
- Track approval progress by level

### 4. Approved
Requirements that have been approved:
- Ready to publish
- View approval history
- Publish to go live

### 5. Published
Live requirements accepting vendor quotations:
- View received quotations
- Monitor vendor responses
- Track deadline

### 6. Archived
Closed or expired requirements:
- Historical reference
- Download reports
- Reuse as template (if needed)

---

## How to Create a New Requirement

### Overview of the 6-Step Wizard

```
Step 1: Basic Information
    ↓
Step 2: Requirement Details
    ↓
Step 3: Documents
    ↓
Step 4: Approval Workflow
    ↓
Step 5: Preview
    ↓
Step 6: Send for Approval / Publish
```

### Step 1: Basic Information

**Required Fields:**
- **Title**: Clear, descriptive name (e.g., "Annual IT Equipment Procurement")
- **Category**: Select type:
  - Professional Services
  - Expert Services
  - Product Requirements
- **Priority**: Critical / High / Medium / Low
- **Business Justification**: Why this requirement is needed

**Optional Fields:**
- Department
- Cost Center
- Estimated Budget *(Recommended)*
- Expected Delivery Date

**Tips:**
- Be specific in the title
- Estimated budget helps vendors provide relevant quotes
- Business justification helps approvers understand the need

### Step 2: Requirement Details

Fields vary by category selected in Step 1:

**For Professional Services:**
- Service type
- Scope of work
- Required qualifications
- Engagement model (fixed/hourly/retainer)
- Duration

**For Expert Services:**
- Expertise area
- Project description
- Deliverables
- Technical requirements

**For Product Requirements:**
- Product specifications
- Quantity
- Technical specifications
- Quality standards
- Delivery requirements

### Step 3: Documents

Upload supporting documents:
- **Specifications**: Technical specs, drawings, designs
- **Terms**: Terms and conditions
- **Scope Documents**: SOW, requirements doc
- **Other**: Any relevant supporting files

**Supported Formats:**
- PDF, DOC, DOCX, XLS, XLSX
- PNG, JPG, JPEG
- Max 10MB per file
- Max 5 files total

**How to Upload:**
1. Click "Upload Documents" or drag-and-drop
2. Select document type from dropdown
3. Wait for upload to complete
4. Repeat for additional documents

### Step 4: Approval Workflow

Select an approval matrix for this requirement:

1. View available approval matrices
2. Each matrix shows:
   - Matrix name
   - Number of levels
   - Approvers at each level
   - Estimated approval time
3. Select the appropriate matrix
4. Selected matrix will apply to this requirement

**Note:** Approval matrices are configured by your admin in Settings → Approval Matrix.

### Step 5: Preview

Review your requirement before submission:
- All entered information displayed
- Documents listed
- Selected approval workflow shown
- Edit button to go back and modify any section

### Step 6: Send for Approval

**If Approval Required:**
1. Click "Send for Approval"
2. Requirement goes to first-level approvers
3. Track progress in "Pending Approval" section
4. Once all levels approve, requirement becomes "Approved"
5. Then you can "Publish" to go live

**After Publishing:**
- Requirement is visible to vendors
- Vendors can submit quotations
- Monitor responses in Quotations module

---

## How to Save a Draft

### Auto-Save
- Drafts auto-save every 30 seconds
- Triggers after you fill 3 or more fields
- Small indicator shows "Saving..." when active
- No action needed from you

### Manual Save
1. Click "Save Draft" button in the footer
2. Confirmation toast appears
3. Draft is saved immediately

### Resuming a Draft
1. Go to Requirements → Drafts
2. Find your draft in the list
3. Click "Edit" or "Resume"
4. Continue from where you left off

---

## How to View Drafts

1. Navigate to Requirements → Drafts
2. View the table with all your drafts
3. Columns show:
   - Title
   - Category
   - Priority
   - Progress (%)
   - Last Saved
   - Actions

### Draft Actions
- **Edit**: Open and continue editing
- **Delete**: Remove the draft permanently
- **View Comments**: See any comments/feedback

---

## How to Track Approval Status

### Viewing Pending Approvals
1. Go to Requirements → Pending Approval
2. See list of requirements awaiting approval
3. Click on any to view details

### Understanding Approval Levels
```
Level 1: Department Manager
    ↓ (Approved)
Level 2: Procurement Head
    ↓ (Pending)
Level 3: Finance Director
    ↓ (Not Started)
Published
```

### Approval Status Indicators
- ✅ **Approved**: This level has approved
- ⏳ **Pending**: Awaiting decision at this level
- ⭕ **Not Started**: Previous levels not complete
- ❌ **Rejected**: Rejected at this level

---

## How to Publish a Requirement

### Prerequisites
- Requirement must be "Approved" status
- All approval levels must be complete

### Steps
1. Go to Requirements → Approved
2. Find the approved requirement
3. Click "Publish" button
4. Confirm the action
5. Requirement is now live and visible to vendors

### After Publishing
- Status changes to "Published"
- Vendors can view and submit quotations
- Monitor in Quotations module
- Set expiry date if needed

---

## How to Archive a Requirement

### When to Archive
- Requirement is fulfilled (PO issued)
- Requirement expired with no suitable quotes
- Requirement cancelled

### Steps
1. Go to the requirement details
2. Click "Archive" action
3. Provide archive reason (optional)
4. Confirm
5. Requirement moves to Archived

---

## Common Questions

**Q: Can I edit a requirement after submitting for approval?**
A: No, once submitted, you cannot edit. If changes needed, ask an approver to reject it, then edit and resubmit.

**Q: How long does approval take?**
A: Depends on your approval matrix. Each level has a maximum time limit set by admin. Check the approval progress for estimated time.

**Q: Can I withdraw a requirement from approval?**
A: Contact your admin. The ability to withdraw may be restricted by role.

**Q: What happens if approval is rejected?**
A: The requirement returns to you with rejection comments. Review the feedback, make changes, and resubmit.

**Q: Can vendors see draft requirements?**
A: No, only Published requirements are visible to vendors.

**Q: How many quotations will I receive?**
A: Depends on vendor interest. You can share the requirement link directly with preferred vendors.

**Q: Can I duplicate a requirement?**
A: Yes, go to any existing requirement and click "Duplicate" to create a copy as a new draft.

**Q: What's the difference between Save Draft and Auto-Save?**
A: Auto-save runs automatically every 30 seconds after 3+ fields are filled. Save Draft is manual and saves immediately when you click it. Both use the same underlying save mechanism.

---

## Related Modules

- [Quotations Module](./05-quotations-module.md) - Handle vendor responses
- [Dashboard Module](./03-dashboard-module.md) - Overview of activities
- [Settings → Approval Matrix](./11-settings-module.md) - Configure approval workflows
