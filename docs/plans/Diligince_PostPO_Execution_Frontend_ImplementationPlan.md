# Diligince.ai — Post-PO Execution Implementation Plan (Frontend-Only)

> **Version:** 1.0  
> **Date:** 2026-02-24  
> **Scope:** Pure implementation plan — no code. Covers progress tracking → milestone completion → payments → retention → closeout → closure.  
> **Baseline:** Existing Lovable frontend codebase with routed pages, PO services, workflow types, and Razorpay integration.

---

## 1) Goals and Non-Goals

### Goals

1. **Single source of truth** for execution state from PO acceptance through final closure.
2. **Milestone-driven execution** with vendor submission, industry approval, evidence uploads, progress updates, payment initiation + verification, invoice/receipt capture, retention withholding + release.
3. **Closeout package** with checklist, verification, final acceptance, completion certificate.
4. **Auditability:** every action recorded as an immutable event entry for timeline and compliance.

### Non-Goals (this phase)

- No AI matching or recommendation logic changes.
- No redesign of existing routing.
- No backend implementation (only contract-level planning).

---

## 2) Users and Roles in Post-PO Execution

### Primary Actors

| Actor | Responsibilities |
|-------|-----------------|
| **Industry Owner/Buyer** | Approves milestones, initiates payments, verifies closeout, closes workflow/requirement |
| **Vendor/Professional** | Executes work, submits milestone completion, uploads proof, submits invoices |
| **Site Engineer / Technical Approver** | Technical verification of milestone deliverables |
| **QA/Quality** | Quality inspection sign-off |
| **Finance** | Payment release, retention management, invoice verification |
| **Procurement Manager** | Overall execution oversight, dispute resolution |

### Permissions Principle

Every action in execution flow must be gated by:
- User role (industry vs vendor/professional) — via `usePermissions()` hook (`src/hooks/usePermissions.ts`)
- Approval stage and current status — via approval matrix logic (`src/contexts/ApprovalContext.tsx`)
- Ownership/association to workflow/PO

**Existing evidence:**
- `src/components/shared/PermissionGate.tsx` — conditional rendering by `moduleId` + `action`
- `src/hooks/usePermissions.ts` — `hasPermission()`, `hasPermissionByPath()`
- `src/types/roleManagement.ts` — `PermissionAction` type

---

## 3) Entities and Data Contracts (Frontend Domain View)

### 3.1 Workflow (Execution Container)

**Existing type:** `src/services/modules/workflows/workflow.types.ts` → `ProjectWorkflow`, `WorkflowDetail`

**Current fields (already defined):**
- `workflowId`, `projectTitle`, `status`, `progress`, `totalValue`, `currency`, `startDate`, `endDate`, `daysRemaining`, `isOverdue`
- `linkedEntities` (PO, quotation, requirement)
- `stats` (totalMilestones, completedMilestones, paidMilestones, awaitingCompletion, receivedAmount, pendingAmount)
- `events[]` (audit trail)
- `milestones[]` (WorkflowMilestone)

**Status extension required (GAP):**

| Current Statuses | Additional Statuses Needed |
|-----------------|---------------------------|
| `active`, `paused`, `completed`, `cancelled` | `awaiting_closeout`, `closed`, `disputed` |

**Action:** Extend `WorkflowStatus` type in `src/services/modules/workflows/workflow.types.ts`

### 3.2 Milestone (Execution Unit)

**Existing type:** `src/services/modules/workflows/workflow.types.ts` → `WorkflowMilestone`

**Current fields (already defined):**
- `id`, `name`, `description`, `percentage`, `amount`, `dueDate`, `status`, `completedAt`
- `payment` object with `paymentId`, `status`, `paidAt`, `receipt`, `uploadedReceipt`, `vendorVerification`
- `canMarkComplete`

**Execution status extension (GAP):**

| Current | Needed |
|---------|--------|
| `pending`, `payment_pending`, `paid`, `completed` | `in_progress`, `submitted`, `approved`, `rejected`, `overdue` |

**Additional fields needed (GAP):**

- `executionStatus`: separate from payment status
- `proofDocuments[]`: array of uploaded evidence files
- `progressUpdates[]`: array of { note, percentageChange, updatedBy, timestamp }
- `approvalTrail[]`: array of { approverId, action, comments, timestamp }
- `rejectionComments`: string (when rejected)
- `resubmissionCount`: number

### 3.3 Payment Ledger (Workflow-Level) — GAP

No dedicated payment ledger type exists. Required fields:

- `totalPaid`: number
- `totalPending`: number
- `retentionWithheld`: number
- `retentionReleased`: number
- `retentionReleaseDate`: string
- `retentionStatus`: `'withheld'` | `'partially_released'` | `'fully_released'`
- `paymentHistory[]`: array of milestone payment records

**Existing partial:** `WorkflowDetail.stats` has `receivedAmount` and `pendingAmount` — extend this.

### 3.4 Closeout Package — GAP

No closeout types exist. Required:

```
CloseoutChecklist:
  - items[]: { id, title, isRequired, status ('pending'|'uploaded'|'verified'|'rejected'), 
               documentUrl, verifiedBy, verifiedAt, rejectionReason }
  - overallStatus: 'incomplete' | 'pending_verification' | 'verified' | 'accepted'
  
CompletionCertificate:
  - certificateId, issuedAt, issuedBy, documentUrl, status ('draft'|'issued'|'accepted')
  
FinalAcceptance:
  - decision: 'accepted' | 'rejected'
  - remarks, decidedBy, decidedAt
  - signOffDocument
```

### 3.5 Templates — GAP

No template types exist. Required:

**Milestone Template:**
- `templateId`, `name`, `stakeholderType` (service/product/logistics/professional)
- `milestones[]`: { percentage, dueDaysFromStart, proofRequired, approvalStages[] }
- `retentionRule`: { enabled, percentage, releaseCriteria }

**Closeout Checklist Template:**
- `templateId`, `name`, `workType`
- `items[]`: { title, isRequired, suggestedDocumentTypes[] }

---

## 4) End-to-End State Machine

### 4.1 Workflow Lifecycle

```
PO_ACCEPTED
    ↓
ACTIVE (milestones executing)
    ↓ (all milestones completed + paid/retention applied)
AWAITING_CLOSEOUT
    ↓ (checklist verified + final acceptance)
CLOSED
    ↓ (triggers)
REQUIREMENT_CLOSED
```

Side transitions:
- `ACTIVE` ↔ `PAUSED` (manual)
- `ACTIVE` → `DISPUTED` (if conflict) → `ACTIVE` (resolved)
- Any → `CANCELLED` (with approval)

### 4.2 Milestone Lifecycle

**Execution track:**
```
PENDING → IN_PROGRESS → SUBMITTED → APPROVED → COMPLETED
                              ↓
                          REJECTED → IN_PROGRESS (resubmit)
```

**Payment track (parallel):**
```
UNPAID → PAYMENT_PENDING → PAID
                              ↓
                          RETENTION_WITHHELD → RETENTION_RELEASED
```

**Edge conditions:**
- If rejected: milestone returns to `in_progress`, vendor resubmits
- If overdue: visual red flag, optional escalation event
- Retention: computed at payment time, released per retention rules

---

## 5) Screens and UX Implementation Tasks

### 5.1 Workflows List (Industry Side)

**Existing page:** `src/pages/IndustryWorkflows.tsx`  
**Existing route:** `/dashboard/industry-workflows`

**Current state:** Table with workflowId, projectTitle, poNumber, status, progress bar, totalValue, deadline, daysRemaining, milestones count.

**Enhancements needed:**

| Enhancement | Details |
|------------|---------|
| Status filter expansion | Add `awaiting_closeout`, `closed`, `disputed` to filter options (line 111-116 in IndustryWorkflows.tsx) |
| Payment summary column | Add column showing paid/pending amounts |
| Overdue visual emphasis | Strengthen overdue row highlighting |
| Closeout indicator | Badge/icon showing closeout readiness |

**Components to reuse:**
- `CustomTable` (`src/components/CustomTable.tsx`)
- `AISearchBar` (`src/components/shared/AISearchBar.tsx`)
- `TableSkeletonLoader` (`src/components/shared/loading`)

**API calls (existing):**
- `workflowService.getWorkflows()` — `src/services/modules/workflows/workflow.service.ts`

### 5.2 Workflow Details (Industry Side)

**Existing page:** `src/pages/IndustryWorkflowDetails.tsx`  
**Existing route:** `/dashboard/industry-project-workflow/:id`

**Current state:** Shows workflow header, milestones with payment actions (Razorpay), events timeline.

**Enhancements needed:**

| Section | What to Add |
|---------|------------|
| **Header** | Add closure-relevant status badges, payment summary stats |
| **Milestones list** | Dual status display (execution + payment), approval trail per milestone, proof documents viewer, progress updates log |
| **Payment summary box** | Total paid, pending, retention withheld, retention release date/status |
| **Closeout section** (NEW) | Checklist progress, document uploads, verification actions, completion certificate, final acceptance CTA |
| **Closure CTA** (NEW) | "Close Workflow" button, enabled only when all prerequisites met |
| **Events timeline** | Ensure all new action types append events |

**Components to reuse:**
- `MilestoneCard` (`src/components/workflow/MilestoneCard.tsx`)
- `PaymentMilestoneTracker` (`src/components/industry/workflow/PaymentMilestoneTracker.tsx`)
- `RetentionPaymentCard` (`src/components/industry/workflow/RetentionPaymentCard.tsx`)

**Components to create (GAP):**
- `CloseoutChecklist` — checklist items with upload/verify actions
- `CompletionCertificateCard` — display/download/upload certificate
- `MilestoneApprovalTrail` — timeline of approvals per milestone
- `MilestoneProofViewer` — document gallery for proof uploads
- `PaymentLedgerSummary` — reconciliation card (paid + pending + retention)
- `WorkflowClosureGate` — validates all prerequisites before enabling close

**API calls (existing):**
- `workflowService.getWorkflowDetail(id)` — returns `WorkflowDetail`
- `workflowService.initiatePayment(workflowId, milestoneId)`
- `workflowService.verifyPayment(workflowId, milestoneId, payload)`
- `workflowService.uploadReceipt(workflowId, milestoneId, formData)`

**API calls needed (GAP):**
- `approveMilestone(workflowId, milestoneId, { comments })`
- `rejectMilestone(workflowId, milestoneId, { comments, allowResubmission })`
- `getCloseoutChecklist(workflowId)`
- `uploadCloseoutDocument(workflowId, itemId, formData)`
- `verifyCloseoutItem(workflowId, itemId, { verified, comments })`
- `issueCompletionCertificate(workflowId)`
- `closeWorkflow(workflowId, { remarks })`
- `releaseRetention(workflowId, { amount, comments })`

### 5.3 Vendor/Professional Workflow Details

**Existing page:** `src/pages/VendorWorkflowDetails.tsx`  
**Existing route:** `/dashboard/vendor-project-workflow/:id`

**Current state:** Shows milestones with vendor actions (mark complete, upload proof).

**Enhancements needed:**

| Section | What to Add |
|---------|------------|
| **Milestone actions** | Progress update form (note + % change), multi-file proof upload, submit for approval button, view rejection comments + resubmit |
| **Status visibility** | Show approval status per milestone, payment status (paid/pending/hold), "what is needed next" guidance per milestone |
| **Closeout documents** | View required closeout documents, upload assigned documents |

**Components to create (GAP):**
- `ProgressUpdateForm` — note input + percentage slider + submit
- `MilestoneSubmissionForm` — bundle proof docs + notes → submit for approval
- `RejectionFeedback` — show rejection comments + resubmit CTA
- `VendorCloseoutUploader` — upload required closeout documents

**Permission enforcement:**
- Vendor CANNOT approve milestones or initiate payments
- Vendor CANNOT close workflow
- Vendor CAN: add progress, upload proof, submit milestone, upload closeout docs

**API calls needed (GAP):**
- `submitMilestoneProgress(workflowId, milestoneId, { note, percentage })`
- `uploadMilestoneProof(workflowId, milestoneId, formData)`
- `submitMilestoneForApproval(workflowId, milestoneId, { notes })`
- `resubmitMilestone(workflowId, milestoneId, { notes, proofDocuments })`
- `uploadCloseoutDocument(workflowId, itemId, formData)` (shared with industry)

### 5.4 Work Completion & Payment Page (Closeout Center)

**Existing page:** `src/pages/WorkCompletionPayment.tsx`  
**Existing route:** `/dashboard/work-completion-payment` (or similar)

**Purpose:** This becomes the **finalization cockpit**.

**Enhancements needed:**

| Section | What to Add |
|---------|------------|
| **Closeout checklist** | All checklist items with status, upload slots, verification buttons |
| **Document management** | Required documents list, upload UI, version tracking |
| **Retention release** | Current retention amount, release criteria status, release action |
| **Completion certificate** | Generate/upload certificate, preview, download |
| **Final acceptance** | Accept/reject decision with remarks, sign-off document upload |
| **Close triggers** | "Close Workflow" + "Close Requirement" buttons with prerequisite gates |

**Acceptance criteria:**
- Acts as single closure surface
- All closeout items visible + trackable
- Final closure cannot bypass required items
- All actions append to events timeline

---

## 6) Templates Implementation Plan

### 6.1 Template Types

**Milestone Template:**
- Per stakeholder type: service / product / logistics / professional
- Fields: milestone list (percentage, due days, proof required, approval stages), retention rule

**Closeout Checklist Template:**
- Per work type / category
- Fields: checklist items (title, required/optional, suggested document types)

### 6.2 Where Templates Apply

| Trigger Point | Template Usage |
|--------------|----------------|
| PO creation/edit (Industry) | Select milestone template → auto-generate milestones; select closeout template → pre-fill checklist |
| Workflow creation (backend) | Derive workflow milestones from PO milestones |
| Closeout initiation | Template becomes checklist instance |

### 6.3 Template Management Screens (GAP)

- **Template list page** — CRUD for milestone and closeout templates
- **Template selector** — dropdown/modal in PO form and workflow creation
- **Template override tracking** — any manual changes logged in events timeline

**Existing pattern to follow:**
- Approval matrix template selection in requirement form (`src/contexts/ApprovalContext.tsx`)

---

## 7) Payment + Receipt + Retention Plan

### 7.1 Payment Flow (Per Milestone)

```
Industry clicks "Pay" on approved milestone
    ↓
Frontend calls initiatePayment(workflowId, milestoneId)
    ↓
Backend returns Razorpay order (razorpayOrderId, amount, razorpayKeyId)
    ↓
Razorpay checkout opens
    ↓
On success: frontend calls verifyPayment(workflowId, milestoneId, { razorpayOrderId, razorpayPaymentId, razorpaySignature })
    ↓
Backend confirms → returns paymentId, paidAt, receiptNumber, receiptUrl
    ↓
UI updates milestone payment status + workflow stats
```

**Existing implementation:**
- `workflowService.initiatePayment()` → `InitiatePaymentResponse` type
- `workflowService.verifyPayment()` → `VerifyPaymentResponse` type
- Razorpay integration already in `VendorWorkflowDetails` / `IndustryWorkflowDetails`

### 7.2 Receipt Handling

| Type | Source | Evidence |
|------|--------|----------|
| System-generated receipt | Backend returns `receipt.receiptNumber` + `receipt.downloadUrl` | `VerifyPaymentResponse.data.receipt` |
| Uploaded receipt | Industry finance uploads manually | `workflowService.uploadReceipt()` → `UploadReceiptResponse` |

Track `downloadCount` for audit (existing in `WorkflowMilestone.payment.receipt.downloadCount`).

### 7.3 Retention

**Existing partial:** `RetentionPaymentCard` component (`src/components/industry/workflow/RetentionPaymentCard.tsx`)

**Retention rules:**
- Withheld percent/amount computed at payment time
- Shown in payment summary (PaymentLedgerSummary)
- Release action available only when:
  - Release criteria met (all milestones completed + verified)
  - Release date passed (or manual override by finance approver)
- Retention release recorded as event

**Reconciliation rule:** `paidAmount + withheldAmount = totalWorkflowValue` (always)

**API needed (GAP):**
- `releaseRetention(workflowId, { amount, comments })` → updates retention status, appends event

---

## 8) Delivery Tracking and Invoices

### 8.1 Delivery Tracking (Product/Logistics)

**Existing types:** `src/types/purchase-order.ts` → `Deliverable` type exists

**Needed additions (GAP):**
- Delivery status timeline per deliverable
- Proof of delivery upload
- Delay reporting (reason + revised ETA)

### 8.2 Invoices

**Existing types:** `src/types/purchase-order.ts` → `Invoice` type with full structure (lineItems, statuses, dates)

**Needed additions:**
- Milestone-to-invoice linking (field exists: `Invoice.milestoneId`)
- Invoice list view within workflow details
- Status-driven highlighting (overdue invoices = risk flag)
- PDF export (industry side)

**Existing component:** `src/components/purchase-order/POMilestonesTab.tsx` — can be extended for invoice display

---

## 9) Compliance and Audit Requirements

### 9.1 Audit Events (Must Be Enforced)

Every action writes an event to `WorkflowDetail.events[]`:

| Event Type | Trigger |
|-----------|---------|
| `milestone_progress_updated` | Vendor adds progress note |
| `proof_uploaded` | Vendor uploads evidence |
| `milestone_submitted` | Vendor submits for approval |
| `milestone_approved` | Industry approves milestone |
| `milestone_rejected` | Industry rejects milestone |
| `payment_initiated` | Industry starts payment |
| `payment_verified` | Payment confirmed |
| `payment_failed` | Payment failed |
| `receipt_uploaded` | Receipt manually uploaded |
| `receipt_downloaded` | Receipt downloaded (audit) |
| `closeout_document_uploaded` | Closeout doc uploaded |
| `closeout_item_verified` | Closeout item verified |
| `closeout_item_rejected` | Closeout item rejected |
| `certificate_issued` | Completion certificate issued |
| `retention_released` | Retention payment released |
| `workflow_closed` | Workflow closed |
| `requirement_closed` | Linked requirement closed |

**Existing pattern:** `WorkflowDetail.events[]` already captures events with `type`, `description`, `performedBy`, `performedByRole`, `timestamp`, `metadata`.

### 9.2 ISO-Aligned Controls

- Approvals captured per stage (existing approval matrix pattern)
- Quality documents required before completion (closeout checklist enforcement)
- Final acceptance mandatory before closure (gate logic)

---

## 10) API Contract Planning

### 10.1 Existing Workflow APIs

| Method | Endpoint Pattern | Service Method | Status |
|--------|-----------------|----------------|--------|
| GET | `/workflows` | `getWorkflows()` | ✅ Exists |
| GET | `/workflows/:id` | `getWorkflowDetail(id)` | ✅ Exists |
| POST | `/workflows/:id/milestones/:mid/pay` | `initiatePayment()` | ✅ Exists |
| POST | `/workflows/:id/milestones/:mid/verify` | `verifyPayment()` | ✅ Exists |
| POST | `/workflows/:id/milestones/:mid/receipt` | `uploadReceipt()` | ✅ Exists |
| POST | `/workflows/:id/milestones/:mid/complete` | `markMilestoneComplete()` | ✅ Exists |

### 10.2 GAP APIs Required

| Method | Endpoint Pattern | Purpose | Request Fields | Response Shape |
|--------|-----------------|---------|---------------|----------------|
| POST | `/workflows/:id/milestones/:mid/progress` | Add progress update | `{ note, percentage }` | `{ success, data: { progressUpdate } }` |
| POST | `/workflows/:id/milestones/:mid/proof` | Upload proof documents | `FormData (files[])` | `{ success, data: { documents[] } }` |
| POST | `/workflows/:id/milestones/:mid/submit` | Submit milestone for approval | `{ notes, attachmentIds[] }` | `{ success, data: { milestone, workflowProgress } }` |
| POST | `/workflows/:id/milestones/:mid/approve` | Approve milestone | `{ comments }` | `{ success, data: { milestone, workflowProgress } }` |
| POST | `/workflows/:id/milestones/:mid/reject` | Reject milestone | `{ comments, allowResubmission }` | `{ success, data: { milestone } }` |
| POST | `/workflows/:id/milestones/:mid/resubmit` | Resubmit after rejection | `{ notes, proofDocumentIds[] }` | `{ success, data: { milestone } }` |
| GET | `/workflows/:id/closeout` | Get closeout checklist | — | `{ success, data: { checklist, overallStatus } }` |
| POST | `/workflows/:id/closeout/:itemId/upload` | Upload closeout document | `FormData` | `{ success, data: { item } }` |
| POST | `/workflows/:id/closeout/:itemId/verify` | Verify closeout item | `{ verified, comments }` | `{ success, data: { item } }` |
| POST | `/workflows/:id/certificate` | Issue completion certificate | `{ remarks }` | `{ success, data: { certificate } }` |
| POST | `/workflows/:id/retention/release` | Release retention | `{ amount, comments }` | `{ success, data: { retention, event } }` |
| POST | `/workflows/:id/close` | Close workflow | `{ remarks, signOffDocumentId }` | `{ success, data: { workflow } }` |
| POST | `/workflows/:id/pause` | Pause workflow | `{ reason }` | `{ success, data: { workflow } }` |
| POST | `/workflows/:id/resume` | Resume workflow | `{ reason }` | `{ success, data: { workflow } }` |
| GET | `/workflows/:id/payment-ledger` | Get payment ledger | — | `{ success, data: { totalPaid, pending, retention, history[] } }` |
| GET | `/templates/milestones` | List milestone templates | `?stakeholderType=` | `{ success, data: { templates[] } }` |
| GET | `/templates/closeout` | List closeout templates | `?workType=` | `{ success, data: { templates[] } }` |

### 10.3 Requirements Closure API (GAP)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/requirements/:id/close` | Close requirement linked to workflow |

**Contract rules:**
- All IDs: strings (MongoDB ObjectId compatible)
- All timestamps: ISO 8601 strings
- All responses: `{ success: boolean, data: {...}, message?: string }`
- Auth: Bearer token, role-checked per endpoint

---

## 11) Implementation Phases

### Phase 1 — Normalize Execution Model (Types + Service Layer)

**Duration:** 1 week

| Task | Files |
|------|-------|
| Extend `WorkflowStatus` with `awaiting_closeout`, `closed`, `disputed` | `src/services/modules/workflows/workflow.types.ts` |
| Extend `MilestoneStatus` with `in_progress`, `submitted`, `approved`, `rejected`, `overdue` | `src/services/modules/workflows/workflow.types.ts` |
| Add `executionStatus` field to `WorkflowMilestone` | `src/services/modules/workflows/workflow.types.ts` |
| Create closeout types (`CloseoutChecklist`, `CloseoutItem`, `CompletionCertificate`, `FinalAcceptance`) | New file: `src/services/modules/workflows/closeout.types.ts` |
| Create payment ledger types (`PaymentLedger`, `PaymentLedgerEntry`) | New file: `src/services/modules/workflows/payment.types.ts` |
| Create template types (`MilestoneTemplate`, `CloseoutTemplate`) | New file: `src/services/modules/workflows/template.types.ts` |
| Add new service methods to `workflowService` for all GAP APIs | `src/services/modules/workflows/workflow.service.ts` |
| Add new routes for all GAP endpoints | `src/services/modules/workflows/workflow.routes.ts` (GAP — file may need creation) |
| Update barrel exports | `src/services/modules/workflows/index.ts` |

### Phase 2 — Milestone Execution End-to-End

**Duration:** 2 weeks

| Task | Files |
|------|-------|
| Create `ProgressUpdateForm` component | New: `src/components/workflow/ProgressUpdateForm.tsx` |
| Create `MilestoneSubmissionForm` component | New: `src/components/workflow/MilestoneSubmissionForm.tsx` |
| Create `MilestoneProofViewer` component | New: `src/components/workflow/MilestoneProofViewer.tsx` |
| Create `MilestoneApprovalTrail` component | New: `src/components/workflow/MilestoneApprovalTrail.tsx` |
| Create `RejectionFeedback` component | New: `src/components/workflow/RejectionFeedback.tsx` |
| Enhance `MilestoneCard` with dual status + actions | `src/components/workflow/MilestoneCard.tsx` |
| Update `IndustryWorkflowDetails` with approve/reject actions | `src/pages/IndustryWorkflowDetails.tsx` |
| Update `VendorWorkflowDetails` with submit/resubmit actions | `src/pages/VendorWorkflowDetails.tsx` |
| Create React Query hooks for milestone operations | New: `src/hooks/useMilestoneActions.ts` |

### Phase 3 — Payments and Receipts

**Duration:** 1 week

| Task | Files |
|------|-------|
| Create `PaymentLedgerSummary` component | New: `src/components/workflow/PaymentLedgerSummary.tsx` |
| Enhance payment flow with receipt display | `src/pages/IndustryWorkflowDetails.tsx` |
| Add payment stats column to workflows list | `src/pages/IndustryWorkflows.tsx` |
| Create React Query hook for payment ledger | New: `src/hooks/usePaymentLedger.ts` |

### Phase 4 — Retention

**Duration:** 1 week

| Task | Files |
|------|-------|
| Enhance `RetentionPaymentCard` with release action | `src/components/industry/workflow/RetentionPaymentCard.tsx` |
| Add retention release flow (confirmation dialog + API call) | `src/pages/IndustryWorkflowDetails.tsx` |
| Add retention reconciliation to `PaymentLedgerSummary` | `src/components/workflow/PaymentLedgerSummary.tsx` |

### Phase 5 — Closeout Package

**Duration:** 2 weeks

| Task | Files |
|------|-------|
| Create `CloseoutChecklist` component | New: `src/components/workflow/CloseoutChecklist.tsx` |
| Create `CloseoutItemRow` component | New: `src/components/workflow/CloseoutItemRow.tsx` |
| Create `CompletionCertificateCard` component | New: `src/components/workflow/CompletionCertificateCard.tsx` |
| Create `FinalAcceptanceForm` component | New: `src/components/workflow/FinalAcceptanceForm.tsx` |
| Create `VendorCloseoutUploader` component | New: `src/components/workflow/VendorCloseoutUploader.tsx` |
| Integrate closeout section into `IndustryWorkflowDetails` | `src/pages/IndustryWorkflowDetails.tsx` |
| Integrate closeout uploads into `VendorWorkflowDetails` | `src/pages/VendorWorkflowDetails.tsx` |
| Enhance `WorkCompletionPayment` as closeout cockpit | `src/pages/WorkCompletionPayment.tsx` |
| Create React Query hooks for closeout operations | New: `src/hooks/useCloseout.ts` |

### Phase 6 — Full Closure

**Duration:** 1 week

| Task | Files |
|------|-------|
| Create `WorkflowClosureGate` component (prerequisite validator) | New: `src/components/workflow/WorkflowClosureGate.tsx` |
| Add "Close Workflow" flow to `IndustryWorkflowDetails` | `src/pages/IndustryWorkflowDetails.tsx` |
| Add "Close Requirement" trigger after workflow closure | `src/pages/IndustryWorkflowDetails.tsx` |
| Update status filters in `IndustryWorkflows` list | `src/pages/IndustryWorkflows.tsx` |
| Add closure events to timeline display | Existing event rendering components |

---

## 12) Approval & Emergency Workflow Correlation

### Existing Approval Infrastructure

| File | Purpose |
|------|---------|
| `src/contexts/ApprovalContext.tsx` | Approval state management |
| `src/services/modules/approval-matrix/approval-matrix.routes.ts` | Approval matrix CRUD endpoints |
| `src/types/approval.ts` | Approval types |

### How Milestone Approvals Integrate

- Milestone approval follows the same sequential level pattern as requirement approvals
- Each milestone approval can reference an approval matrix (if configured in PO template)
- Simple case: single-level approval (Industry Owner approves directly)
- Complex case: multi-level approval (Site Engineer → QA → Finance → Procurement Manager)
- The `approvalTrail[]` field on each milestone records the same structure as `approvalProgress` on requirements

### How Closeout Approval Integrates

- Final acceptance is a single-decision approval (accept/reject)
- Can optionally require approval matrix for high-value workflows
- Emergency workflow pattern (existing) can apply for urgent closures

---

## 13) Security / Compliance / Auditability

### Authentication & Authorization (Existing Patterns)

| Pattern | Evidence |
|---------|----------|
| Bearer token auth | All API calls via `apiService` (`src/services/core/`) |
| Role-based rendering | `PermissionGate` component + `usePermissions` hook |
| Module-level permissions | `permissionsV2` structure with read/write/edit/delete flags |

### Audit Trail (Existing Pattern)

- `WorkflowDetail.events[]` — immutable event log per workflow
- Each event: `type`, `description`, `performedBy` (name + email), `performedByRole`, `timestamp`, `metadata`
- All new actions MUST append events (no event = no action happened)

### Document Upload Security (Existing Pattern)

- File uploads via `FormData` through authenticated API calls
- File type/size validation on frontend (existing in PO upload components)
- Access control: documents visible only to workflow participants

### Data Retention

- Events are append-only (never deleted)
- Closed workflows become read-only (no further mutations except retention release)
- Completion certificates are immutable once issued

---

## 14) Gaps & Risks Register

### Missing Infrastructure (GAPs)

| GAP ID | Description | Priority | Recommended Action |
|--------|-------------|----------|-------------------|
| GAP-1 | No workflow routes file exists | High | Create `src/services/modules/workflows/workflow.routes.ts` following approval-matrix pattern |
| GAP-2 | No closeout types/components exist | High | Create during Phase 5 |
| GAP-3 | No template management system | Medium | Create types + selector UI; template CRUD can be Phase 7 |
| GAP-4 | No payment ledger aggregate endpoint | Medium | Backend must provide; frontend type ready in Phase 1 |
| GAP-5 | No milestone approve/reject endpoints | High | Backend must implement; frontend service methods ready in Phase 1 |
| GAP-6 | No requirement closure endpoint | Medium | Backend must implement; needed in Phase 6 |
| GAP-7 | Delivery tracking for product/logistics incomplete | Low | Extend in future phase |
| GAP-8 | Invoice management within workflow not yet integrated | Medium | Types exist in `purchase-order.ts`; UI integration in Phase 3 |
| GAP-9 | No dispute/hold workflow | Low | Mark as future enhancement |

### Integration Risks

| Risk | Mitigation |
|------|-----------|
| Backend APIs not ready when frontend implements | Use mock data + React Query `enabled: false` pattern until APIs available |
| Milestone status enum mismatch between frontend and backend | Freeze enum values in Phase 1 before any implementation |
| Payment reconciliation errors | Enforce `paid + withheld = total` invariant in PaymentLedgerSummary component |
| Approval matrix changes mid-execution | Snapshot approval matrix at workflow creation (existing pattern from requirements) |

### Data Consistency Risks

| Risk | Mitigation |
|------|-----------|
| Concurrent milestone submissions | Backend must enforce idempotency; frontend disables buttons during API calls |
| Stale workflow data after payment | Invalidate React Query cache after payment verification |
| Orphaned closeout items after template change | Template is applied once at creation; no retroactive changes |

---

## 15) Definition of Done

The Post-PO system is complete when:

1. ✅ A PO can progress through milestones with vendor submissions, approvals, evidence attachments, audit events
2. ✅ Payments can be performed per milestone with verified payment record, receipts, ledger reconciliation
3. ✅ Retention is withheld and released correctly
4. ✅ Closeout checklist is completed and verified
5. ✅ Completion certificate is issued
6. ✅ Workflow is closed and requirement is closed
7. ✅ All actions are permission-gated and auditable
8. ✅ All state transitions are reflected in events timeline

---

*End of Implementation Plan*
