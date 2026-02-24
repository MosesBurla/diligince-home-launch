# Diligince.ai — Post-PO: Work Progress, Milestones, Payments & Closure

## Production-Grade Implementation Plan

**Version:** 1.0  
**Date:** 2026-02-24  
**Stack:** Lovable.dev (React/Vite/Tailwind) + Google Antigravity (Node/Express + MongoDB)  
**Reference Specs:** Execution Implementation Pack Rev2, Hybrid Master Rev2, PostPO Work Tracking Spec v1

---

## 1. Executive Summary

### 1.1 What Exists Today (Repo Evidence)

The Diligince.ai codebase has a **substantially complete** pre-PO lifecycle and a **partial** post-PO execution layer:

| Layer | What Exists | Evidence |
|-------|-------------|----------|
| **Requirement → RFQ → Quotes → Evaluation → PO** | Fully implemented with multi-level approval workflows, status-based list pages, creation wizards, and vendor response flows | `src/pages/IndustryRequirements.tsx`, `src/pages/IndustryQuotes.tsx`, `src/pages/IndustryPurchaseOrders.tsx`, `src/pages/CreateEditPurchaseOrder.tsx` |
| **Project Workflow List (Industry)** | List page with filters, search, status tabs | `src/pages/IndustryWorkflows.tsx` → route `/dashboard/industry-workflows` |
| **Project Workflow Details (Industry)** | Milestone cards, Razorpay payment integration, document upload, receipt download | `src/pages/IndustryWorkflowDetails.tsx` → route `/dashboard/workflow-details/:id`, `src/pages/WorkflowDetailsPage.tsx` → route `/dashboard/industry-project-workflow/:id` |
| **Vendor Workflow List** | Project list page with status tabs | `src/pages/ServiceVendorProjects.tsx` → route `/dashboard/service-vendor-projects` |
| **Vendor Workflow Details** | Milestone cards, mark-complete, document upload | `src/pages/VendorWorkflowDetails.tsx` → route `/dashboard/vendor/projects/:id` |
| **Milestone Components** | `MilestoneCard.tsx` (dual-party completion), `MilestoneDetailsDialog.tsx` (document management), `PaymentMilestoneTracker.tsx` (ISO 9001 quality gates), `RetentionPaymentCard.tsx` (retention countdown + release) | `src/components/workflow/`, `src/components/industry/workflow/` |
| **Workflow Service Layer** | Industry + Vendor workflow CRUD, milestone payment (Razorpay), milestone completion, document upload/delete/view | `src/services/modules/workflows/workflow.service.ts`, `src/services/modules/workflows/workflow.types.ts` |
| **PO Service Layer** | Full PO CRUD + milestone operations + invoice CRUD + delivery tracking + activity log | `src/services/modules/purchase-orders/purchase-orders.service.ts`, `purchase-orders.routes.ts`, `purchase-orders.types.ts` |
| **Payment Service** | Razorpay integration (subscription payments + milestone payments) | `src/services/modules/payments/razorpay.service.ts`, `src/hooks/useRazorpay.ts` |
| **Approval Matrix** | Full CRUD for multi-level approval matrices | `src/services/modules/approval-matrix/` |
| **Work Completion Payment** | Standalone page for work completion flow | `src/pages/WorkCompletionPayment.tsx` → route `/dashboard/work-completion-payment/:id` |

### 1.2 What Remains (Gaps for Implementation)

| Gap Category | Description | Priority |
|-------------|-------------|----------|
| **Execution Project Model** | No `executionProjects` collection in MongoDB; current workflows are lightweight references to POs | Critical |
| **Progress Logs** | No progress log submission UI or API; vendor can only mark milestones complete, not submit periodic progress | Critical |
| **Progress Claims / Certification** | No claim submission, review, or certification workflow | Critical |
| **Payment Requests (Invoice Certification)** | PO service has invoice CRUD but lacks certification workflow, retention calculation, deductions, tax breakdown | Critical |
| **Retention Ledger** | `RetentionPaymentCard.tsx` exists as UI but no backend collection or API | High |
| **Closure Checklist** | No closeout checklist UI or backend; no closure state enforcement | High |
| **Audit Events (Append-Only)** | No dedicated audit event collection; activity logs exist per-PO but are not immutable | High |
| **Variation Orders** | No variation/change order model or UI | Medium |
| **Stakeholder-Specific Milestone Templates** | No template system for service/product/logistics/expert milestones | Medium |
| **Earned Value Metrics** | No PV/EV/AC tracking in progress updates | Low |

### 1.3 Non-Negotiables

- **Evidence-first:** No state transition without required evidence documents (configurable per policy)
- **Immutable audit:** Append-only event log for every state transition
- **Idempotent payments:** Payment initiation must use idempotency keys
- **RBAC + tenant isolation:** Every query scoped by tenant; vendors see only their projects
- **State machine enforcement:** Backend validates transitions; frontend never sets state directly
- **Money correctness:** All amounts stored in minor units (paise/cents); currency explicit

---

## 2. Evidence Inventory (Repo Map)

### 2.1 Frontend Routes & Pages

#### Industry User Routes

| Route | Page Component | File Path | Status |
|-------|---------------|-----------|--------|
| `/dashboard/industry-workflows` | `IndustryWorkflows` | `src/pages/IndustryWorkflows.tsx` | ✅ Exists |
| `/dashboard/industry-project-workflow/:id` | `WorkflowDetailsPage` | `src/pages/WorkflowDetailsPage.tsx` | ✅ Exists |
| `/dashboard/workflow-details/:id` | `IndustryWorkflowDetails` | `src/pages/IndustryWorkflowDetails.tsx` | ✅ Exists |
| `/dashboard/work-completion-payment/:id` | `WorkCompletionPayment` | `src/pages/WorkCompletionPayment.tsx` | ✅ Exists |
| `/dashboard/industry-purchase-orders` | `IndustryPurchaseOrders` | `src/pages/IndustryPurchaseOrders.tsx` | ✅ Exists |
| `/dashboard/create-purchase-order` | `CreateEditPurchaseOrder` | `src/pages/CreateEditPurchaseOrder.tsx` | ✅ Exists |
| `/dashboard/purchase-orders/:id` | PO Detail | Various | ✅ Exists |
| `/dashboard/execution/:id/progress` | Progress Log View | — | ❌ GAP |
| `/dashboard/execution/:id/claims` | Claims Management | — | ❌ GAP |
| `/dashboard/execution/:id/closeout` | Closure Checklist | — | ❌ GAP |

#### Service Vendor Routes

| Route | Page Component | File Path | Status |
|-------|---------------|-----------|--------|
| `/dashboard/service-vendor-projects` | `ServiceVendorProjects` | `src/pages/ServiceVendorProjects.tsx` | ✅ Exists |
| `/dashboard/service-vendor-projects/active` | `ServiceVendorProjects` | Same (filtered) | ✅ Exists |
| `/dashboard/service-vendor-projects/completed` | `ServiceVendorProjects` | Same (filtered) | ✅ Exists |
| `/dashboard/vendor/projects/:id` | `VendorWorkflowDetails` | `src/pages/VendorWorkflowDetails.tsx` | ✅ Exists |
| `/dashboard/vendor/projects/:id/progress` | Progress Submission | — | ❌ GAP |
| `/dashboard/vendor/projects/:id/claims` | Claim Submission | — | ❌ GAP |

### 2.2 Frontend Components

| Component | File Path | Purpose | Reusable? |
|-----------|-----------|---------|-----------|
| `MilestoneCard` | `src/components/workflow/MilestoneCard.tsx` | Milestone display with pay/complete/download actions, dual-party completion status | ✅ Yes — extend for claim status |
| `MilestoneDetailsDialog` | `src/components/workflow/MilestoneDetailsDialog.tsx` | Document upload/view/delete per milestone, industry + vendor sides | ✅ Yes — extend for evidence packs |
| `PaymentMilestoneTracker` | `src/components/industry/workflow/PaymentMilestoneTracker.tsx` | ISO 9001 quality gate progress tracker | ✅ Yes — extend for certification status |
| `RetentionPaymentCard` | `src/components/industry/workflow/RetentionPaymentCard.tsx` | Retention countdown, release confirmation dialog, rating | ✅ Yes — connect to retention API |
| `WorkTimeline` | `src/components/industry/workflow/WorkTimeline.tsx` | Event timeline with compliance checkpoints | ✅ Yes — extend for audit events |
| `POMilestonesTab` | `src/components/purchase-order/POMilestonesTab.tsx` | PO milestone list (view mode) | ✅ Yes |
| `POInvoicesTab` | `src/components/purchase-order/POInvoicesTab.tsx` | PO invoice list | ✅ Yes — extend for certification workflow |
| `POActivityTab` | `src/components/purchase-order/POActivityTab.tsx` | Activity log display | ✅ Yes |
| `POFormMilestones` | `src/components/purchase-order/forms/POFormMilestones.tsx` | Milestone creation form (percentage validation) | ✅ Yes |
| `PermissionGate` | `src/components/shared/PermissionGate.tsx` | RBAC conditional rendering | ✅ Yes — use for all new screens |

### 2.3 Service Layer

| Service | File Path | Key Methods |
|---------|-----------|-------------|
| Workflow Service | `src/services/modules/workflows/workflow.service.ts` | `getIndustryWorkflows`, `getIndustryWorkflowDetails`, `initiateMilestonePayment`, `verifyMilestonePayment`, `uploadPaymentReceipt`, `downloadPaymentReceipt`, `getVendorWorkflows`, `getVendorWorkflowDetails`, `markMilestoneComplete`, `openRazorpayCheckout` |
| Workflow Types | `src/services/modules/workflows/workflow.types.ts` | `ProjectWorkflow`, `WorkflowMilestone`, `WorkflowDetail`, `InitiatePaymentResponse`, `VerifyPaymentResponse`, `MarkMilestoneCompleteResponse` |
| PO Service | `src/services/modules/purchase-orders/purchase-orders.service.ts` | `getMilestones`, `updateMilestone`, `markMilestoneComplete`, `uploadMilestoneProof`, `getInvoices`, `createInvoice`, `markInvoicePaid`, `getDeliveryTracking`, `getActivityLog` |
| PO Types | `src/services/modules/purchase-orders/purchase-orders.types.ts` | `PurchaseOrderDetail`, `PaymentMilestone`, `Invoice`, `DeliveryTracking`, `ActivityLog`, `ApprovalWorkflow` |
| PO Routes | `src/services/modules/purchase-orders/purchase-orders.routes.ts` | Full CRUD routes for milestones, invoices, delivery, activity, documents — includes vendor and professional sub-routes |
| Approval Matrix | `src/services/modules/approval-matrix/` | Full CRUD, duplicate, toggle, export, available members |
| Razorpay | `src/services/modules/payments/razorpay.service.ts` | `createOrder`, `initiatePayment`, `verifyPayment`, `loadRazorpayScript` |
| Vendor PO Service | `src/services/modules/vendors/purchase-orders.service.ts` | `getMyPurchaseOrders`, `getPODetails`, `respondToPO`, `submitMilestoneCompletion`, `submitInvoice` |

### 2.4 Type Definitions

| Type File | Key Types | Status |
|-----------|-----------|--------|
| `src/types/workflow.ts` | `VendorQuote`, `PurchaseOrder`, `PaymentMilestone`, `RetentionPayment`, `WorkflowEvent`, `ProjectWorkflow` | ✅ Legacy types — used by industry workflow components |
| `src/types/purchase-order.ts` | `PurchaseOrder`, `Deliverable`, `Milestone`, `AcceptanceCriteria`, `Invoice`, `PurchaseOrderDetail` | ✅ Alternate PO types |
| `src/types/purchaseOrder.ts` | `FormValues` (PO creation form) | ✅ Form schema |
| `src/services/modules/workflows/workflow.types.ts` | `WorkflowMilestone`, `WorkflowDetail`, payment types | ✅ Primary workflow types |
| `src/services/modules/purchase-orders/purchase-orders.types.ts` | Comprehensive PO + milestone + invoice + delivery types | ✅ Most complete type set |

### 2.5 Backend API Endpoints (Currently Defined in Frontend Routes)

#### Industry Workflow APIs (from `workflow.service.ts`)

| Method | Endpoint | Purpose | Evidence |
|--------|----------|---------|----------|
| GET | `/api/v1/industry/project-workflows` | List workflows | `workflow.service.ts:24` |
| GET | `/api/v1/industry/workflows/dashboard/stats` | Dashboard stats | `workflow.service.ts:76` |
| GET | `/api/v1/industry/workflows/search` | Search workflows | `workflow.service.ts:122` |
| GET | `/api/v1/industry/requirements/:id/workflow-tracking` | Requirement tracking | `workflow.service.ts:155` |
| GET | `/api/v1/industry/project-workflows/:id` | Workflow details | `workflow.service.ts:164` |
| POST | `/api/v1/industry/project-workflows/:wfId/milestones/:msId/pay` | Initiate payment | `workflow.service.ts:176` |
| POST | `/api/v1/industry/milestone-payments/verify` | Verify payment | `workflow.service.ts:188` |
| POST | `/api/v1/industry/milestone-payments/:payId/upload-receipt` | Upload receipt | `workflow.service.ts:203` |
| GET | `/api/v1/industry/milestone-payments/:payId/receipt` | Download receipt | `workflow.service.ts:217` |

#### Vendor Workflow APIs (from `workflow.service.ts`)

| Method | Endpoint | Purpose | Evidence |
|--------|----------|---------|----------|
| GET | `/api/v1/vendors/workflows` | List vendor workflows | `workflow.service.ts:237` |
| GET | `/api/v1/vendors/workflows/:id` | Workflow details | `workflow.service.ts:245` |
| POST | `/api/v1/vendors/workflows/:wfId/milestones/:msId/complete` | Mark complete | `workflow.service.ts:258` |

#### PO APIs (from `purchase-orders.routes.ts`)

| Method | Route Pattern | Purpose |
|--------|---------------|---------|
| GET | `/api/v1/industry/purchase-orders/active\|pending\|in-progress\|completed` | Status-filtered PO lists |
| POST | `/api/v1/industry/purchase-orders` | Create PO |
| POST | `/api/v1/industry/purchase-orders/:id/send` | Send to vendor |
| POST | `/api/v1/industry/purchase-orders/:id/approve\|reject` | Approval workflow |
| GET/PUT | `/api/v1/industry/purchase-orders/:id/milestones/:msId` | Milestone CRUD |
| POST | `/api/v1/industry/purchase-orders/:id/milestones/:msId/mark-complete` | Mark milestone complete |
| POST | `/api/v1/industry/purchase-orders/:id/milestones/:msId/upload-proof` | Upload proof |
| GET/POST | `/api/v1/industry/purchase-orders/:id/invoices` | Invoice CRUD |
| POST | `/api/v1/industry/purchase-orders/:id/invoices/:invId/mark-paid` | Mark paid |
| GET | `/api/v1/industry/purchase-orders/:id/activity` | Activity log |
| GET | `/api/v1/industry/purchase-orders/:id/delivery` | Delivery tracking |
| POST | `/api/v1/vendors/purchase-orders/:id/respond` | Vendor accept/reject/negotiate |
| POST | `/api/v1/vendors/purchase-orders/:id/milestones/:msId/complete` | Vendor milestone submission |
| POST | `/api/v1/vendors/purchase-orders/:id/invoices` | Vendor invoice submission |

---

## 3. Current Lifecycle (As Implemented Today)

### 3.1 Requirement → RFQ → Quotes → Evaluation → PO/SOW

```
REQUIREMENT LIFECYCLE:
  Draft → Pending Approval → Approved → Published → [Quotes Received] → [Quote Accepted] → PO Generated

PO LIFECYCLE:
  Draft → Pending Approval → Approved → Sent to Vendor → [Vendor Accepts] → In Progress → Completed
```

**Source evidence:**

- **Requirement states:** `src/pages/RequirementsDrafts.tsx`, `RequirementsPending.tsx`, `RequirementsApproved.tsx`, `RequirementsPublished.tsx`
- **Approval workflow:** `src/services/modules/approvals/approvals.service.ts`, `src/contexts/ApprovalContext.tsx`
- **PO status enum:** `src/services/modules/purchase-orders/purchase-orders.types.ts:4-10` → `draft | pending_approval | approved | in_progress | completed | cancelled`
- **PO creation from quotation:** `src/hooks/usePOFromQuotation.ts`, `src/pages/CreateEditPurchaseOrder.tsx`
- **PO approval:** `purchaseOrdersRoutes.approve()`, `purchaseOrdersRoutes.reject()`
- **PO send to vendor:** `purchaseOrdersRoutes.send()`
- **Vendor response:** `purchaseOrdersRoutes.vendor.respond()` → accept/reject/negotiate

### 3.2 Post-PO Workflow (Currently Implemented)

```
PO Accepted → Workflow Created (auto) → Milestones Tracked →
  Industry: Initiate Razorpay Payment per milestone → Verify → Upload Receipt
  Vendor: Mark Milestone Complete → Upload Documents
  Both: Dual-party completion confirmation → Milestone marked 'completed'
```

**Source evidence:**

- **Workflow creation:** Triggered when PO is accepted; workflow linked to PO via `poNumber` (`workflow.types.ts:10`)
- **Milestone statuses:** `pending | payment_pending | paid | completed` (`workflow.types.ts:4`)
- **Dual completion:** `MilestoneCard.tsx:16-29` → `completionStatus.industryMarkedComplete` + `vendorMarkedComplete` → `fullyCompleted`
- **Razorpay flow:** `workflow.service.ts:171-180` → creates Razorpay order → `workflow.service.ts:185-189` → verifies payment
- **Document management:** `MilestoneDetailsDialog.tsx` → upload/view/delete documents per milestone per side (industry/vendor)

### 3.3 What Stops Here (Gap Boundary)

The current implementation ends after:
- ✅ Milestones can be paid (Razorpay) and marked complete (dual-party)
- ❌ No progress logging between milestones
- ❌ No formal claim/certification workflow
- ❌ No retention ledger backend (UI exists but no API)
- ❌ No closure/closeout checklist
- ❌ No immutable audit trail (activity log exists but is not append-only)
- ❌ No variation order management
- ❌ No earned value tracking
- ❌ No stakeholder-specific milestone templates

---

## 4. Target Lifecycle Extension (Post-PO)

### 4.1 Work Progress Tracking

#### State Machine: Execution Project

```
PO_ISSUED → EXECUTION_ACTIVE → PARTIALLY_COMPLETED → COMPLETED → CLOSED
                                                                   ↑
                                                          SUSPENDED ←→ (can resume)
                                                          CANCELLED (terminal)
```

**Source:** PDF Spec — Hybrid Master Rev2, Section 2

#### User Actions Required

| Actor | Action | Current Support | Gap? |
|-------|--------|----------------|------|
| **Industry** | Create execution workspace from accepted PO | Workflow auto-created on PO accept | Partial — need `executionProject` collection |
| **Vendor** | Submit periodic progress update (weekly) | ❌ Not implemented | GAP — need progress log submission form + API |
| **Vendor** | Attach evidence (photos, reports, delivery challans) | ✅ Document upload exists per milestone (`MilestoneDetailsDialog`) | Extend to progress logs |
| **Industry** | Review progress updates | ❌ Not implemented | GAP — need progress review UI |
| **Industry** | Track overall % complete and EV metrics | ❌ Not implemented | GAP — need dashboard widgets |
| **Both** | View progress timeline | ✅ `WorkTimeline.tsx` exists | Extend for progress events |

#### Screens Required

| Screen | Extends Existing? | Evidence |
|--------|-------------------|----------|
| Progress Updates Tab (Industry) | Extend `IndustryWorkflowDetails.tsx` with new tab | Add to existing tabbed layout |
| Progress Submission Form (Vendor) | Extend `VendorWorkflowDetails.tsx` with new tab/modal | Add to existing page |
| Progress Review Screen (Industry) | New component within workflow details | GAP — new component needed |

#### API Calls Needed

| Endpoint | Exists? | Gap Action |
|----------|---------|------------|
| `POST /api/v1/vendors/workflows/:wfId/progress` | ❌ GAP | Add to `workflow.service.ts` |
| `GET /api/v1/industry/project-workflows/:wfId/progress` | ❌ GAP | Add to `workflow.service.ts` |
| `POST /api/v1/industry/project-workflows/:wfId/progress/:logId/review` | ❌ GAP | Add to `workflow.service.ts` |

#### MongoDB Updates Required

| Collection | Exists? | Gap Action |
|------------|---------|------------|
| `executionProjects` | ❌ GAP | New collection — fields per PDF Spec Section 2.1 |
| `progressLogs` | ❌ GAP | New collection — fields per PDF Spec Section 2.3 |

### 4.2 Milestones & Payments (Production-Grade)

#### Milestone Lifecycle (Target)

```
PLANNED → IN_PROGRESS → CLAIMED → UNDER_REVIEW → CERTIFIED → PAYABLE → PAID → CLOSED
                              ↘ INFO_REQUESTED → RESUBMITTED ↗
                              ↘ REJECTED → (back to IN_PROGRESS with punch list)
                              ↘ DISPUTED
```

**Source:** PDF Spec — Implementation Pack Rev2, Section 2.2

#### Current vs Target Milestone Status Comparison

| Current (`workflow.types.ts:4`) | Target (from PDF Spec) | Action |
|------|--------|--------|
| `pending` | `PLANNED` | Rename/map |
| — | `IN_PROGRESS` | GAP — add |
| — | `CLAIMED` | GAP — add |
| — | `UNDER_REVIEW` | GAP — add |
| — | `CERTIFIED` | GAP — add |
| `payment_pending` | `PAYABLE` | Rename/map |
| `paid` | `PAID` | ✅ Exists |
| `completed` | `CLOSED` | Rename/map |
| — | `REJECTED` | GAP — add |
| — | `DISPUTED` | GAP — add |
| — | `INFO_REQUESTED` | GAP — add |

#### Certification (Claims) Workflow

| Step | Actor | Action | Exists? |
|------|-------|--------|---------|
| 1 | Vendor | Submit claim with evidence | ❌ GAP |
| 2 | Industry (Technical) | Review claim, request info or approve/reject | ❌ GAP |
| 3 | Industry (Manager) | Validate and forward | ❌ GAP — leverage existing approval matrix |
| 4 | Industry (Finance) | Create/approve payment request | ❌ GAP |

**Source evidence for approval matrix reuse:** `src/services/modules/approval-matrix/approval-matrix.service.ts` — full CRUD exists; same multi-level pattern can apply to milestone certification.

#### Payment Calculation (Per PDF Spec Section 2.5)

```
NetPayable = BaseAmount − Retention − Deductions + Tax
```

- **Retention:** Default 5%, configurable per contract
- **Deductions:** LD (Liquidated Damages), penalties, contra charges
- **Tax:** GST/VAT breakdown with rate in basis points
- **Idempotency:** Required via `idempotencyKey` field

#### Retention & Tax Handling

| Feature | Current Codebase | Gap? |
|---------|-----------------|------|
| Retention UI | ✅ `RetentionPaymentCard.tsx` — countdown timer, release confirmation, percentage display | Connect to backend |
| Retention data model | ✅ `RetentionPayment` type in `src/types/workflow.ts:40-46` — `amount`, `percentage`, `releaseDate`, `status`, `delayPeriodDays` | Extend for ledger entries |
| Retention backend collection | ❌ GAP | New `retentionLedger` collection per PDF Spec Section 2.6 |
| Tax breakdown | ❌ GAP | Add `taxBreakdown` array to payment request model |
| Deductions | ❌ GAP | Add `deductions` array to payment request model |
| Release plan (staged) | ❌ GAP | Add `releasePlan` array — 50% at completion, 50% after defects period |

#### Dispute/Hold Scenarios

| Scenario | Exists? | Gap Action |
|----------|---------|------------|
| Claim dispute | ❌ GAP | Add `dispute` field to claims (`isDisputed`, `reason`) |
| Retention hold | ❌ GAP | Add `holdReason` to retention ledger |
| Payment failure | ❌ GAP | Add `FAILED` status to payment request state machine |

### 4.3 Work Completion & Closure

#### Closure Checklist (Per PDF Spec Section 2.7)

| Checklist Item | Applies To | Evidence Required |
|---------------|------------|-------------------|
| All milestones certified and paid (except retention) | All | Milestone + invoice status |
| Punch list resolved / accepted | Service/Logistics/Product | Punch list closure report |
| As-built / final docs uploaded | Service/Product | As-built drawings, manuals |
| Warranty / guarantee docs | Product/Service | Warranty certificates |
| Final acceptance certificate | All | Signed acceptance PDF |
| Final invoice and tax invoice uploaded | All | Invoice PDF |
| Retention release eligibility computed | All | Retention ledger state |

#### Closure Rules

- Block closure unless: all milestones CERTIFIED AND payments processed OR retention scheduled
- Block if open disputes exist
- Final acceptance requires signed document upload
- Post-closure: project becomes immutable (read-only)

#### Current Codebase Support

| Feature | Exists? | Evidence |
|---------|---------|----------|
| Completion page | ✅ Partial | `src/pages/WorkCompletionPayment.tsx` — route `/dashboard/work-completion-payment/:id` |
| Closure checklist UI | ❌ GAP | Need new component |
| Closure API | ❌ GAP | Need `POST /api/execution/:projectId/close` |
| Closure MongoDB collection | ❌ GAP | Need `closureChecklists` collection |
| Audit events | ❌ GAP | Need `auditEvents` collection |
| Post-closure immutability | ❌ GAP | Backend must enforce read-only after CLOSED status |

---

## 5. Frontend Implementation Plan (NO CODE)

### 5.1 Extend: IndustryWorkflowDetails Page

**File:** `src/pages/IndustryWorkflowDetails.tsx`  
**Current:** Displays milestones, payment flow, document management  
**Extension:**

- Add **Progress Updates Tab** — list progress logs submitted by vendor with review actions
  - Reuse: `WorkTimeline.tsx` component pattern for event display
  - Fields: periodStart, periodEnd, narrative, percentComplete, evidence attachments, EV metrics (PV/EV/AC)
  - Actions: Approve/Request Info/Flag
  - Permission: `PermissionGate` with industry write access

- Add **Claims Tab** — list claims per milestone with certification workflow
  - Reuse: `POMilestonesTab.tsx` card pattern
  - Fields: milestoneId, claimType, claimedAmount, evidence, status, reviewNotes
  - Actions: Review (approve/reject/dispute/request-info)
  - Permission: Role-specific (Technical → Manager → Finance per approval matrix)

- Add **Closeout Tab** — checklist with required document uploads + final acceptance
  - Reuse: `MilestoneDetailsDialog.tsx` document upload pattern
  - Fields: checklist items (checkbox + file upload per item), finalAcceptanceDate, finalAcceptanceCertificate
  - Actions: Complete checklist items, upload docs, close project
  - Permission: Industry admin/manager

- Add **Retention Summary Section** — within existing overview
  - Reuse: `RetentionPaymentCard.tsx` — already fully built
  - Connect to retention ledger API (GAP)

- Add **Audit Trail Tab** — immutable event log
  - Reuse: `POActivityTab.tsx` display pattern
  - Data from `auditEvents` collection (GAP)

### 5.2 Extend: VendorWorkflowDetails Page

**File:** `src/pages/VendorWorkflowDetails.tsx`  
**Current:** Milestone list, mark complete, document upload  
**Extension:**

- Add **Progress Submission Form** (new modal/tab)
  - Fields: periodStart, periodEnd, narrative, percentComplete, evidence upload (multi-file with docType), EV metrics (optional)
  - Reuse: `useDropzone` pattern from `MilestoneDetailsDialog.tsx`
  - API: `POST /api/v1/vendors/workflows/:wfId/progress` (GAP)

- Add **Claim Submission Form** (per milestone)
  - Fields: milestoneId, claimType (FULL/PARTIAL/FINAL), claimPercent, evidence pack
  - Reuse: `MilestoneDetailsDialog.tsx` upload pattern
  - API: `POST /api/v1/vendors/workflows/:wfId/claims` (GAP)

- Add **Invoice Submission** (from approved milestone)
  - Reuse existing: `vendorPurchaseOrdersService.submitInvoice()` from `src/services/modules/vendors/purchase-orders.service.ts:109`
  - Extend for: retention calculation display, deductions display, tax breakdown

### 5.3 New Components Required

| Component | Purpose | Reuse From | GAP? |
|-----------|---------|------------|------|
| `ProgressLogForm` | Vendor submits periodic progress | `MilestoneDetailsDialog` (upload pattern) | ❌ GAP |
| `ProgressLogList` | Industry views progress logs | `WorkTimeline.tsx` (timeline pattern) | ❌ GAP |
| `ClaimSubmissionForm` | Vendor submits milestone claim | `MilestoneDetailsDialog` | ❌ GAP |
| `ClaimReviewCard` | Industry reviews claim (approve/reject/dispute) | `MilestoneCard` (action pattern) | ❌ GAP |
| `ClosureChecklist` | Industry completes closeout checklist | Custom — checklist + file upload | ❌ GAP |
| `PaymentCertificationCard` | Shows netPayable breakdown (base − retention − deductions + tax) | `PaymentMilestoneTracker` | ❌ GAP |
| `RetentionLedgerTable` | Shows retention entries and release schedule | Custom table | ❌ GAP |
| `AuditTrailViewer` | Immutable audit event list | `POActivityTab` | ❌ GAP |
| `VariationOrderForm` | Create/approve variation orders | Custom form | ❌ GAP (Medium priority) |
| `MilestoneTemplateSelector` | Select stakeholder-specific milestone templates | `ApprovalMatrixSelector` pattern | ❌ GAP (Medium priority) |

### 5.4 Role Permissions

| Screen/Action | Industry Admin | Industry Manager | Industry Finance | Vendor | Expert |
|--------------|---------------|-----------------|-----------------|--------|--------|
| View progress logs | ✅ | ✅ | ✅ | ✅ (own) | ✅ (own) |
| Submit progress log | ❌ | ❌ | ❌ | ✅ | ✅ |
| Review progress | ✅ | ✅ | ❌ | ❌ | ❌ |
| Submit claim | ❌ | ❌ | ❌ | ✅ | ✅ |
| Review claim (Technical) | ✅ | ✅ | ❌ | ❌ | ❌ |
| Review claim (Finance) | ❌ | ❌ | ✅ | ❌ | ❌ |
| Approve payment | ❌ | ❌ | ✅ | ❌ | ❌ |
| Release retention | ❌ | ✅ | ✅ | ❌ | ❌ |
| Close project | ✅ | ✅ | ❌ | ❌ | ❌ |
| View audit trail | ✅ | ✅ | ✅ | ❌ | ❌ |

**Implementation:** Use `PermissionGate` component (`src/components/shared/PermissionGate.tsx`) with appropriate `moduleId` and `action` values.

### 5.5 API Integration Points

| Frontend Action | Hook/Service to Create | Existing Hook/Service to Reuse |
|-----------------|----------------------|-------------------------------|
| Fetch progress logs | GAP: `useProgressLogs(workflowId)` | Pattern: `useQuery` from `IndustryWorkflowDetails.tsx` |
| Submit progress | GAP: `useSubmitProgress(workflowId)` | Pattern: `useMutation` from `MilestoneDetailsDialog.tsx` |
| Submit claim | GAP: `useSubmitClaim(workflowId)` | Pattern: `useMutation` |
| Review claim | GAP: `useReviewClaim(claimId)` | Pattern: approval hooks from `src/hooks/useRequirementDraft.ts` |
| Fetch retention ledger | GAP: `useRetentionLedger(projectId)` | Pattern: `useQuery` |
| Close project | GAP: `useCloseProject(projectId)` | Pattern: `useMutation` |
| Fetch audit events | GAP: `useAuditEvents(entityId)` | Pattern: `useQuery` |

---

## 6. Backend Implementation Plan (NO CODE)

### 6.1 Existing Endpoints to Reuse

| Current Endpoint | Reuse For |
|-----------------|-----------|
| `POST /api/v1/industry/project-workflows/:wfId/milestones/:msId/pay` | Extend for certified payment requests (add deductions/retention/tax) |
| `POST /api/v1/industry/milestone-payments/verify` | Keep as-is for Razorpay verification |
| `POST /api/v1/vendors/workflows/:wfId/milestones/:msId/complete` | Extend for formal claim submission |
| `GET /api/v1/industry/purchase-orders/:id/activity` | Extend for audit events |
| `POST /api/v1/industry/purchase-orders/:id/invoices` | Extend for certification workflow |
| All approval matrix endpoints | Reuse for milestone/claim approval routing |

### 6.2 New Endpoints Required (GAP)

#### Execution Workspace

| Method | Route | Purpose | Request Fields | Response | Auth/Role |
|--------|-------|---------|---------------|----------|-----------|
| POST | `/api/v1/execution/start` | Create execution project from accepted PO | `{ poId }` | `{ projectId, status: "EXECUTION_ACTIVE" }` | Industry only |
| GET | `/api/v1/execution/:projectId` | Full execution workspace (project + milestones + claims + payments + retention + closure) | — | `{ executionProject, milestones, latestProgressLogs, openClaims, paymentLedger, retentionSummary, closureChecklist }` | Industry (tenant-scoped), Vendor (own project) |

#### Progress Logs

| Method | Route | Purpose | Request Fields | Response | Auth/Role |
|--------|-------|---------|---------------|----------|-----------|
| POST | `/api/v1/execution/:projectId/progress` | Submit progress update | `{ milestoneId?, periodStart, periodEnd, vendorNote, progressPercent, files: [{fileId, docType, hash}] }` | `{ progressLogId, status: "SUBMITTED" }` | Vendor only |
| GET | `/api/v1/execution/:projectId/progress` | List progress logs | Query: `page`, `limit`, `milestoneId` | Paginated list of progress logs | Industry + Vendor (own) |
| POST | `/api/v1/execution/:projectId/progress/:logId/review` | Review progress log | `{ decision: "ACKNOWLEDGE\|FLAG", notes }` | Updated log | Industry only |

#### Claims & Certification

| Method | Route | Purpose | Request Fields | Response | Auth/Role |
|--------|-------|---------|---------------|----------|-----------|
| POST | `/api/v1/execution/:projectId/claims` | Submit claim | `{ milestoneId, claimType, claimPercent, claimedAmountMinor, evidence: [{fileId, docType, hash, url}] }` | `{ claimId, status: "SUBMITTED" }` | Vendor only |
| POST | `/api/v1/claims/:claimId/request-info` | Request additional info | `{ message, requiredDocTypes }` | `{ status: "INFO_REQUESTED" }` | Industry (Technical/Manager) |
| POST | `/api/v1/claims/:claimId/resubmit` | Resubmit with more evidence | `{ evidence, note }` | `{ status: "RESUBMITTED" }` | Vendor only |
| POST | `/api/v1/claims/:claimId/review` | Certification decision | `{ decision: "APPROVE\|REJECT\|DISPUTE", notes, deductions?: [{type, amountMinor, notes}] }` | `{ claimStatus, milestoneStatus, nextAction }` | Industry (per approval level) |

#### Payment Requests

| Method | Route | Purpose | Request Fields | Response | Auth/Role |
|--------|-------|---------|---------------|----------|-----------|
| POST | `/api/v1/payment-requests/:payreqId/approve` | Finance approval | `{ }` | `{ status: "FINANCE_APPROVED" }` | Finance only |
| POST | `/api/v1/payment-requests/:payreqId/initiate` | Idempotent payment initiation | `{ idempotencyKey }` + Razorpay integration | `{ status: "SENT_TO_ERP\|PAID" }` | Finance only |

#### Retention Release

| Method | Route | Purpose | Request Fields | Response | Auth/Role |
|--------|-------|---------|---------------|----------|-----------|
| POST | `/api/v1/retention/:retId/release` | Release retention | `{ stage: "COMPLETION\|DEFECT_PERIOD_END\|MANUAL", amountMinor, notes }` | Updated retention entry | Industry Manager/Finance |
| GET | `/api/v1/execution/:projectId/retention` | Retention summary | — | `{ totalRetained, released, pending, entries[] }` | Industry + Vendor |

#### Closure

| Method | Route | Purpose | Request Fields | Response | Auth/Role |
|--------|-------|---------|---------------|----------|-----------|
| GET | `/api/v1/execution/:projectId/closure-checklist` | Get checklist | — | `{ items: [{key, label, required, completed, fileId}] }` | Industry |
| PUT | `/api/v1/execution/:projectId/closure-checklist` | Update checklist items | `{ items: [{key, completed, fileId}] }` | Updated checklist | Industry |
| POST | `/api/v1/execution/:projectId/close` | Close project | `{ finalAcceptanceDate, finalAcceptanceFileId, notes }` | `{ status: "CLOSED" }` | Industry (Manager/Admin) — blocks if open disputes or uncertified milestones |

#### Audit Events

| Method | Route | Purpose | Auth/Role |
|--------|-------|---------|-----------|
| GET | `/api/v1/execution/:projectId/audit-events` | List audit trail | Industry Admin only |

### 6.3 Auth/Role Pattern (Reference Existing)

- **Middleware:** Follow existing pattern from `src/services/core/api.service.ts` — JWT token from `localStorage`, auto-refresh on 401
- **Tenant scoping:** Derive `tenantId` from auth token; never trust frontend-provided
- **Role checks:** Use same role constants as permission module (`src/types/roleManagement.ts`)
- **Validation:** Follow existing Zod schemas pattern (`src/schemas/purchase-order-form.schema.ts`)

### 6.4 Idempotency Pattern

- Payment initiation endpoints must accept `Idempotency-Key` header
- Backend checks if key already processed; returns existing result if found
- Prevents double payments on retry/network failure

### 6.5 Audit Logging Pattern

- Every state transition writes to `auditEvents` collection
- Fields: `tenantId`, `actorId`, `actorRole`, `entityType`, `entityId`, `action`, `fromState`, `toState`, `payload`, `createdAt`
- Collection is append-only (no updates or deletes)
- Index on `(entityId, createdAt)` and `(tenantId, createdAt)`

---

## 7. MongoDB Data Plan (NO CODE)

### 7.1 New Collections Required

#### `executionProjects` — GAP

| Field | Type | Purpose |
|-------|------|---------|
| `_id` | String/ObjectId | Primary key |
| `tenantId` | String | Tenant isolation |
| `requirementId` | String | Links to requirements collection |
| `poId` | String | Links to purchase orders collection |
| `sowId` | String (optional) | Separate SOW reference |
| `vendorId` | String | Vendor organization |
| `stakeholderType` | Enum: `service\|product\|logistics\|expert` | Determines milestone templates |
| `emergencyFlag` | Boolean | Emergency workflow bypass |
| `status` | Enum: `PO_ISSUED\|EXECUTION_ACTIVE\|PARTIALLY_COMPLETED\|COMPLETED\|CLOSED\|SUSPENDED\|CANCELLED` | State machine |
| `startDate`, `endDate` | Date | Project timeline |
| `currency` | String | e.g., "INR" |
| `totalValueMinor` | Number | Total in minor units (paise/cents) |
| `retentionPercent` | Number | Default per policy (e.g., 5) |
| `retentionCapPercent` | Number | Optional cap |
| `defectsLiabilityDays` | Number | Optional by contract (e.g., 90) |
| `kpis` | Object | `{ percentComplete, lastProgressAt, nextMilestoneDueAt }` |
| `createdAt`, `updatedAt`, `createdBy`, `updatedBy` | Audit timestamps | Standard |
| `version` | Number | Optimistic concurrency |

**Indexes:**
- `(tenantId, status)` — filter by status per tenant
- `(tenantId, vendorId)` — vendor lookup
- `(poId)` — unique, link from PO

#### `progressLogs` — GAP

| Field | Type | Purpose |
|-------|------|---------|
| `_id` | String | Primary key |
| `tenantId` | String | Tenant isolation |
| `projectId` | String | Ref: `executionProjects` |
| `milestoneId` | String (optional) | Ref: `milestones` |
| `periodStart`, `periodEnd` | Date | Reporting period |
| `vendorNote` | String | Narrative |
| `progressPercent` | Number | 0-100 |
| `attachments` | Array of `{ fileId, docType, hash, url }` | Evidence |
| `evMetrics` | Object (optional) | `{ PV, EV, AC }` — earned value |
| `status` | Enum: `SUBMITTED\|ACKNOWLEDGED\|FLAGGED` | Review status |
| `createdBy`, `createdAt` | Audit | Standard |

**Indexes:**
- `(projectId, createdAt)` — chronological per project

#### `progressClaims` — GAP

| Field | Type | Purpose |
|-------|------|---------|
| `_id` | String | Primary key |
| `tenantId` | String | Tenant isolation |
| `projectId` | String | Ref |
| `milestoneId` | String | Ref |
| `claimType` | Enum: `FULL\|PARTIAL\|FINAL` | Claim type |
| `claimPercent` | Number | 0-100 |
| `claimedAmountMinor` | Number | In minor units |
| `evidence` | Array of `{ fileId, docType, hash, url }` | Required evidence |
| `status` | Enum: `DRAFT\|SUBMITTED\|UNDER_REVIEW\|INFO_REQUESTED\|RESUBMITTED\|APPROVED\|REJECTED\|DISPUTED` | State machine |
| `submittedAt` | Date | Submission timestamp |
| `lastReviewedAt` | Date | Last review |
| `dispute` | Object | `{ isDisputed, reason }` |
| `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `version` | Audit | Standard |

**Indexes:**
- `(projectId, status, submittedAt)`

#### `paymentRequests` — GAP

| Field | Type | Purpose |
|-------|------|---------|
| `_id` | String | Primary key |
| `tenantId` | String | Tenant isolation |
| `projectId` | String | Ref |
| `milestoneId` | String | Ref |
| `claimId` | String | Ref |
| `invoice` | Object | `{ invoiceNo, invoiceDate, supplierGSTIN, buyerGSTIN, invoicePdfFileId, invoiceHash }` |
| `baseAmountMinor` | Number | Base amount |
| `retentionPercent` | Number | Retention rate |
| `retentionAmountMinor` | Number | Retained amount |
| `deductions` | Array of `{ type, amountMinor, notes, approvedBy }` | LD, penalties |
| `taxBreakdown` | Array of `{ type, rateBps, amountMinor }` | GST/VAT |
| `netPayableMinor` | Number | Computed: base − retention − deductions + tax |
| `status` | Enum: `PENDING\|FINANCE_REVIEW\|FINANCE_APPROVED\|SENT_TO_ERP\|PAID\|FAILED\|CANCELLED` | State machine |
| `idempotencyKey` | String | Unique, required for payment initiation |
| `erpReference` | String (optional) | External ERP reference |
| `payment` | Object | `{ method, utr, paidAt }` |
| `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `version` | Audit | Standard |

**Indexes:**
- `(tenantId, projectId, "invoice.invoiceNo")` — unique, blocks duplicate invoices
- `(idempotencyKey)` — unique globally
- `(projectId, status, createdAt)`

#### `retentionLedger` — GAP

| Field | Type | Purpose |
|-------|------|---------|
| `_id` | String | Primary key |
| `tenantId` | String | Tenant isolation |
| `projectId` | String | Ref |
| `milestoneId` | String | Ref |
| `payreqId` | String | Ref |
| `retainedAmountMinor` | Number | Amount withheld |
| `releasedAmountMinor` | Number | Amount released |
| `releasePlan` | Array | `[{ stage: "COMPLETION\|DEFECT_PERIOD_END", percent, eligibleOn, releasedOn, status: "SCHEDULED\|RELEASED" }]` |
| `status` | Enum: `HELD\|PARTIALLY_RELEASED\|RELEASED\|ON_HOLD` | Current state |
| `holdReason` | String (optional) | Why on hold |
| `createdAt`, `updatedAt` | Audit | Standard |

#### `closureChecklists` — GAP

| Field | Type | Purpose |
|-------|------|---------|
| `_id` | String | Primary key |
| `tenantId` | String | Tenant isolation |
| `projectId` | String | Ref: executionProjects (unique) |
| `items` | Array | `[{ key, label, required, completed, fileId }]` |
| `finalAcceptanceAt` | Date (optional) | When accepted |
| `closedAt` | Date (optional) | When closed |
| `status` | Enum: `IN_PROGRESS\|READY_TO_CLOSE\|CLOSED` | Closure status |

#### `auditEvents` — GAP (Append-Only)

| Field | Type | Purpose |
|-------|------|---------|
| `_id` | String | Primary key |
| `tenantId` | String | Tenant isolation |
| `actorId` | String | User who performed action |
| `actorRole` | Enum | `INDUSTRY_TECH\|INDUSTRY_MANAGER\|FINANCE\|VENDOR\|EXPERT\|SYSTEM` |
| `entityType` | Enum | `executionProject\|milestone\|claim\|paymentRequest\|retention\|closure` |
| `entityId` | String | Which entity |
| `action` | Enum | `STATE_TRANSITION\|APPROVAL\|REJECTION\|UPLOAD\|DEDUCTION_APPLIED\|RETENTION_RELEASED\|CLOSE` |
| `fromState` | String | Previous state |
| `toState` | String | New state |
| `payload` | Object | Minimal context (no PII) |
| `createdAt` | Date | Immutable timestamp |

**Indexes:**
- `(entityId, createdAt)`
- `(tenantId, createdAt)`
- **No update/delete operations allowed**

### 7.2 Existing Collections to Extend

| Collection | Current Fields | Additional Fields (GAP) |
|------------|---------------|------------------------|
| `purchaseOrders` (existing) | `status`, `milestones`, `invoices`, `deliverables` | Add `executionProjectId` reference |
| `requirements` (existing) | `status`, `isSentForApproval`, `approvalProgress` | Add `closedAt`, `closureStatus` fields |

---

## 8. Approval & Emergency Workflow Correlation

### 8.1 Existing Approval Matrix (Evidence)

- **Service:** `src/services/modules/approval-matrix/approval-matrix.service.ts`
- **Types:** `src/services/modules/approval-matrix/approval-matrix.types.ts`
- **Routes:** `src/services/modules/approval-matrix/approval-matrix.routes.ts`
- **Pattern:** Multi-level sequential approval (Level 1 → Level 2 → Level 3), with mandatory/optional approvers per level
- **UI:** `src/components/requirement/ApprovalMatrixSelector.tsx` — dynamic matrix selection
- **Context:** `src/contexts/ApprovalContext.tsx` — approval state management

### 8.2 How Milestone/Claim Approvals Follow the Same Pattern

| Approval Use Case | Current (Requirements) | Extension for Claims |
|-------------------|----------------------|---------------------|
| Matrix selection | User selects matrix during requirement creation | Industry selects matrix during PO/SOW creation (or inherits from requirement) |
| Level progression | Level 1 (Dept Head) → Level 2 (Manager) → Level 3 (CFO) | Level 1 (Technical Review) → Level 2 (Manager Validation) → Level 3 (Finance Certification) |
| Approver notification | Email at each level activation | Same — email when claim enters approver's queue |
| Rejection handling | Returns to draft with rejection reason; resubmission allowed/disallowed | Returns claim to IN_PROGRESS with punch list; vendor can resubmit |
| Emergency bypass | `emergencyFlag` allows bypassing pre-approvals, creates post-facto tasks | Same — emergency claims can be fast-tracked with mandatory post-facto audit tasks |

### 8.3 Files to Extend for Claim Approval

| File | Current Purpose | Extension |
|------|----------------|-----------|
| `src/services/modules/approval-matrix/approval-matrix.service.ts` | CRUD for approval matrices | Add `getMatrixForModule('claims')` support |
| `src/services/modules/approvals/approvals.service.ts` | Pending approvals, approve/reject requirements | Add claim approval methods following same mock data + API pattern |
| `src/contexts/ApprovalContext.tsx` | Approval state for requirements | Extend or create parallel context for claim approvals |
| `src/components/requirement/ApprovalMatrixSelector.tsx` | Matrix selection during requirement creation | Reuse during PO/SOW creation for claim approval routing |

### 8.4 Emergency Workflow (Post-PO)

Per PDF Spec Section 4.3:
- Emergency flag on PO and/or milestone → allows start without full mobilization approvals
- Auto-create mandatory post-facto tasks: safety compliance upload, technical acceptance report, budget ratification
- Payment gating: emergency can pay up to 'Emergency Cap %' without full acceptance; final settlement requires standard acceptance
- **Implementation:** Check `executionProject.emergencyFlag` in transition service; if true, skip approval level but write auditEvent with `action: "EMERGENCY_BYPASS"` and create follow-up tasks

---

## 9. Security / Compliance / Auditability (Repo-Aligned)

### 9.1 AuthN/AuthZ Patterns (Existing)

| Pattern | Evidence | Apply To |
|---------|----------|----------|
| JWT Bearer token | `src/services/core/api.service.ts:88` — auto-refresh on 401 | All new endpoints |
| Role-based permission checks | `src/components/shared/PermissionGate.tsx`, `src/hooks/usePermissions.ts` | All new UI components |
| Tenant isolation | Memory: `features/approval-workflow-backend-requirements` — `companyId` in every query | All new MongoDB queries |

### 9.2 Audit Trail (Existing + Extension)

| Current | Evidence | Extension |
|---------|----------|-----------|
| PO Activity Log | `src/services/modules/purchase-orders/purchase-orders.routes.ts:86` — `GET /:id/activity` | Extend with auditEvents collection (append-only) |
| Workflow Events | `src/services/modules/workflows/workflow.types.ts:112-122` — events with performedBy, timestamp, metadata | Feed into auditEvents collection |
| Approval Progress | `src/services/modules/approvals/approvals.service.ts:40` — level-by-level tracking | Same pattern for claim certification progress |

### 9.3 Document Upload Security (Existing)

| Pattern | Evidence | Apply To |
|---------|----------|----------|
| FormData upload with file size limits | `MilestoneDetailsDialog.tsx:159` — maxSize: 20MB | All new evidence uploads |
| Side-restricted uploads (industry/vendor) | `MilestoneDetailsDialog.tsx:129-131` — `canUploadToSide()` | Progress logs and claims |
| Pre-signed URLs for viewing | `MilestoneDetailsDialog.tsx:254-280` — `getIndustryDocumentViewUrl()` | All document access |
| File hash verification | PDF Spec — `sha256` hash stored with each file | GAP — add to upload handlers |

### 9.4 Data Retention

| Current Pattern | Extension |
|----------------|-----------|
| Documents stored in object storage (S3/GCS) with metadata in MongoDB | Same for all evidence files |
| `createdAt`/`updatedAt` on all documents | Add `retentionPolicyDays` field to files collection |
| `auditEvents` collection — append-only, no deletes | Partition by month if needed later |

---

## 10. Step-by-Step Implementation Sequence (Developer Runbook)

### Phase 1: Data Foundation (Week 1-2)

| # | Task | Frontend File(s) | Backend File(s) | MongoDB | Validation |
|---|------|-----------------|-----------------|---------|------------|
| 1.1 | Create `executionProjects` collection schema | — | `models/executionProject.model.js` (GAP) | New collection with indexes | Verify indexes created; test tenant isolation |
| 1.2 | Create `progressLogs` collection schema | — | `models/progressLog.model.js` (GAP) | New collection with indexes | Verify CRUD operations |
| 1.3 | Create `progressClaims` collection schema | — | `models/progressClaim.model.js` (GAP) | New collection with indexes | Verify state transitions |
| 1.4 | Create `paymentRequests` collection schema | — | `models/paymentRequest.model.js` (GAP) | New collection with indexes; unique on `idempotencyKey` | Verify idempotency uniqueness |
| 1.5 | Create `retentionLedger` collection schema | — | `models/retentionLedger.model.js` (GAP) | New collection | Verify retention calculation |
| 1.6 | Create `closureChecklists` collection schema | — | `models/closureChecklist.model.js` (GAP) | New collection; unique on `projectId` | Verify one checklist per project |
| 1.7 | Create `auditEvents` collection (append-only) | — | `models/auditEvent.model.js` (GAP) | New collection; no update/delete operations | Verify append-only enforcement |
| 1.8 | Add `executionProjectId` to existing PO model | — | `models/purchaseOrder.model.js` (existing) | Add field | Verify backward compatibility |

### Phase 2: State Machine & Core APIs (Week 2-3)

| # | Task | Frontend File(s) | Backend File(s) | Validation |
|---|------|-----------------|-----------------|------------|
| 2.1 | Implement state transition service | — | `services/stateTransition.service.js` (GAP) | Test every allowed transition succeeds; every forbidden fails |
| 2.2 | Implement `POST /execution/start` | — | `routes/execution.routes.js` (GAP) | Create execution project from accepted PO |
| 2.3 | Implement `GET /execution/:projectId` | — | Same | Return composite workspace data |
| 2.4 | Implement progress log CRUD endpoints | — | `routes/progressLog.routes.js` (GAP) | Submit, list, review |
| 2.5 | Implement claims CRUD endpoints | — | `routes/claims.routes.js` (GAP) | Submit, request-info, resubmit, review |
| 2.6 | Implement payment request endpoints | — | `routes/paymentRequest.routes.js` (GAP) | Finance approval, idempotent initiation |
| 2.7 | Implement retention endpoints | — | `routes/retention.routes.js` (GAP) | Release with stage validation |
| 2.8 | Implement closure endpoints | — | `routes/closure.routes.js` (GAP) | Checklist CRUD, close with enforcement |
| 2.9 | Connect approval matrix to claims | — | Extend existing approval middleware | Claims follow same approval level pattern |

### Phase 3: Frontend Service Layer (Week 3-4)

| # | Task | Frontend File(s) | Validation |
|---|------|-----------------|------------|
| 3.1 | Create execution service module | `src/services/modules/execution/execution.routes.ts`, `execution.service.ts`, `execution.types.ts`, `index.ts` (all GAP) | TypeScript compilation |
| 3.2 | Extend workflow types | `src/services/modules/workflows/workflow.types.ts` — add progress log, claim, retention, closure types | Type compatibility |
| 3.3 | Extend workflow service | `src/services/modules/workflows/workflow.service.ts` — add progress, claim, retention, closure methods | API call verification |
| 3.4 | Create React Query hooks | `src/hooks/useProgressLogs.ts`, `useSubmitClaim.ts`, `useRetentionLedger.ts`, `useClosureChecklist.ts` (all GAP) | Hook functionality |

### Phase 4: Frontend UI Components (Week 4-6)

| # | Task | Frontend File(s) | Validation |
|---|------|-----------------|------------|
| 4.1 | Create `ProgressLogForm` component | `src/components/workflow/ProgressLogForm.tsx` (GAP) | Form submission, file upload |
| 4.2 | Create `ProgressLogList` component | `src/components/workflow/ProgressLogList.tsx` (GAP) | List rendering, review actions |
| 4.3 | Create `ClaimSubmissionForm` component | `src/components/workflow/ClaimSubmissionForm.tsx` (GAP) | Evidence pack validation |
| 4.4 | Create `ClaimReviewCard` component | `src/components/workflow/ClaimReviewCard.tsx` (GAP) | Approve/reject/dispute actions |
| 4.5 | Create `ClosureChecklist` component | `src/components/workflow/ClosureChecklist.tsx` (GAP) | Checklist item completion, file upload |
| 4.6 | Create `PaymentCertificationCard` component | `src/components/workflow/PaymentCertificationCard.tsx` (GAP) | NetPayable breakdown display |
| 4.7 | Create `RetentionLedgerTable` component | `src/components/workflow/RetentionLedgerTable.tsx` (GAP) | Ledger entries, release actions |
| 4.8 | Create `AuditTrailViewer` component | `src/components/workflow/AuditTrailViewer.tsx` (GAP) | Immutable event list |

### Phase 5: Page Integration (Week 6-7)

| # | Task | Frontend File(s) | Validation |
|---|------|-----------------|------------|
| 5.1 | Add Progress/Claims/Closeout tabs to `IndustryWorkflowDetails` | `src/pages/IndustryWorkflowDetails.tsx` | Tab navigation, data loading |
| 5.2 | Add Progress/Claim submission to `VendorWorkflowDetails` | `src/pages/VendorWorkflowDetails.tsx` | Form submission, evidence upload |
| 5.3 | Connect `RetentionPaymentCard` to retention API | `src/components/industry/workflow/RetentionPaymentCard.tsx` | API data rendering, release action |
| 5.4 | Update `WorkCompletionPayment` for closure flow | `src/pages/WorkCompletionPayment.tsx` | Closure checklist integration |
| 5.5 | Add execution workspace route (if new page needed) | `src/App.tsx` — add route | Route renders correctly |
| 5.6 | Update chatbot knowledge base | `docs/ChatBot/users/industry/05-project-workflows.md`, `docs/ChatBot/users/service-vendor/04-projects.md` | Documentation accuracy |

### Phase 6: Testing & Validation (Week 7-8)

| # | Test Category | Scope |
|---|--------------|-------|
| 6.1 | State machine tests | Every allowed transition succeeds; every forbidden fails with correct error |
| 6.2 | Money tests | NetPayable calculation, retention, deductions, tax rounding, partial payments |
| 6.3 | RBAC tests | Vendor cannot see other vendor projects; finance-only endpoints blocked for others |
| 6.4 | Idempotency tests | Payment endpoint called twice with same key → single PAID record |
| 6.5 | Evidence gating tests | Missing required docs blocks certification; emergency bypass creates post-facto tasks |
| 6.6 | Closure tests | Closure blocked with open disputes or unpaid certified milestones; retention scheduling works |
| 6.7 | E2E flow | Requirement → PO → Accept → Progress → Claim → Certify → Pay → Close |

---

## 11. Gaps & Risks Register

### 11.1 Missing Components (All GAP)

| Gap ID | Category | Description | Priority | Suggested Addition |
|--------|----------|-------------|----------|-------------------|
| G-01 | MongoDB | `executionProjects` collection | Critical | New collection per Section 7.1 |
| G-02 | MongoDB | `progressLogs` collection | Critical | New collection per Section 7.1 |
| G-03 | MongoDB | `progressClaims` collection | Critical | New collection per Section 7.1 |
| G-04 | MongoDB | `paymentRequests` collection | Critical | New collection per Section 7.1 |
| G-05 | MongoDB | `retentionLedger` collection | High | New collection per Section 7.1 |
| G-06 | MongoDB | `closureChecklists` collection | High | New collection per Section 7.1 |
| G-07 | MongoDB | `auditEvents` collection | High | Append-only collection per Section 7.1 |
| G-08 | Backend | State transition service | Critical | Central validation service per Section 6.2 |
| G-09 | Backend | All execution/progress/claims/payment/retention/closure endpoints | Critical | Per Section 6.2 |
| G-10 | Frontend | Progress log form + list components | Critical | Per Section 5.3 |
| G-11 | Frontend | Claim submission + review components | Critical | Per Section 5.3 |
| G-12 | Frontend | Closure checklist component | High | Per Section 5.3 |
| G-13 | Frontend | Payment certification card | High | Per Section 5.3 |
| G-14 | Frontend | Retention ledger table | High | Per Section 5.3 |
| G-15 | Frontend | Audit trail viewer | High | Per Section 5.3 |
| G-16 | Backend | Variation order model + endpoints | Medium | Separate spec recommended |
| G-17 | Frontend | Milestone template selector per stakeholder type | Medium | Reuse ApprovalMatrixSelector pattern |
| G-18 | Backend | Earned value metrics calculation | Low | Add PV/EV/AC to progress logs |
| G-19 | Backend | File hash verification on upload | Medium | Add sha256 validation middleware |
| G-20 | Frontend | Execution service module (`src/services/modules/execution/`) | Critical | New module with routes, types, service |

### 11.2 Integration Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Razorpay milestone payment already works independently of claim certification | Payment may bypass certification workflow | Gate Razorpay initiation behind `PAYABLE` status; refactor existing pay flow to require claim certification |
| Two parallel PO/workflow type systems (`src/types/workflow.ts` vs `src/services/modules/workflows/workflow.types.ts` vs `src/services/modules/purchase-orders/purchase-orders.types.ts`) | Type confusion, inconsistent data shapes | Consolidate on `workflow.types.ts` for execution; deprecate legacy `src/types/workflow.ts` |
| `IndustryWorkflowDetails.tsx` and `WorkflowDetailsPage.tsx` both render workflow details at different routes | Unclear which to extend | Primary: `IndustryWorkflowDetails.tsx` at `/dashboard/workflow-details/:id`; consider deprecating `WorkflowDetailsPage.tsx` |
| Existing milestone statuses (`pending\|payment_pending\|paid\|completed`) don't map cleanly to target statuses | Status migration needed | Add mapping layer in service; support both during transition |
| Approval matrix currently only supports requirements | Claim certification needs same pattern | Extend matrix `applicableModules` to include `claims` |

### 11.3 Data Consistency Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Milestone weight percentages must sum to 100 | Over/under-payment | Backend validation on project activation; existing `POFormMilestones.tsx:22` validates on frontend |
| `claimedAmountMinor` must not exceed `milestone.baseAmountMinor` | Overpayment | Backend validation in claim submission endpoint |
| Retention release must not exceed retained amount | Over-release | Backend validation with transaction lock |
| Closure must not proceed with open disputes | Premature closure | Backend enforcement check before status transition |
| Concurrent claim submissions on same milestone | Race condition | MongoDB transaction + optimistic concurrency via `version` field |
| Duplicate invoices per project | Double payment | Unique index on `(tenantId, projectId, invoice.invoiceNo)` |

---

## Appendix A: Stakeholder-Specific Milestone Templates

Per PDF Spec Section 5, milestone templates serve as starting points (editable by Industry):

### Service Vendor (EPC/Contractor)

| Milestone | % | Acceptance Criteria | Required Evidence |
|-----------|---|--------------------|--------------------|
| Mobilization & HSE plan approved | 10 | Site induction complete; method statement approved | HSE plan, method statement, mobilization report |
| Work package 1 completed | 25 | Inspection passed; test results within limits | Inspection report, test certificates, photos |
| Work package 2 completed | 25 | As-built drawings updated; QA/QC checks complete | QA/QC checklist, as-built draft, photos |
| Pre-commissioning / functional checks | 20 | Functional tests passed; punch-list ≤ threshold | Functional test report, punch list |
| Final handover & documentation | 20 | Handover signed; O&M docs delivered | Handover certificate, O&M pack, training record |

### Product Vendor (OEM/Spares)

| Milestone | % | Acceptance Criteria | Required Evidence |
|-----------|---|--------------------|--------------------|
| PO acknowledgement & dispatch plan | 5 | Confirmed delivery dates; packing list shared | Acknowledgement, dispatch plan |
| Delivery to site/warehouse | 65 | Quantity matches; no damage; GRN created | Invoice, packing list, POD, GRN |
| Incoming inspection accepted | 20 | Inspection passed; NCRs resolved | Inspection report, CoC/CoA, test certs |
| Documentation & warranty activation | 10 | Warranty registered; manuals provided | Warranty cert, manuals, serial list |

### Logistics Vendor (Transport/Crane)

| Milestone | % | Acceptance Criteria | Required Evidence |
|-----------|---|--------------------|--------------------|
| Pickup confirmed | 10 | Vehicle assigned; safety docs valid | Vehicle details, driver ID, permits |
| Transit & route compliance | 30 | Geo/time proof acceptable; incident-free | GPS log snapshot, trip sheet |
| Delivery & unloading complete | 50 | POD signed; unloading completed | POD, unloading photos, damage report |
| Closeout docs | 10 | Final invoice; tolls/receipts | Receipts, invoice, incident report |

### Expert Professional (Consulting/Inspection)

| Milestone | % | Acceptance Criteria | Required Evidence |
|-----------|---|--------------------|--------------------|
| Kickoff & diagnosis plan | 15 | Scope and timeline agreed | Kickoff notes, plan |
| Interim findings | 35 | Findings reviewed; action items issued | Interim report, meeting minutes |
| Final deliverable submitted | 40 | Deliverable meets acceptance checklist | Final report, datasets/attachments |
| Knowledge transfer / closure | 10 | Handover call done; Q&A completed | Recording/minutes, sign-off |

---

## Appendix B: Transaction Strategy (MongoDB)

Use multi-document transactions for any action affecting money or state across collections:

- **Certify claim:** Update `claim.status` + `milestone.status` + create/modify `paymentRequest` draft + append `auditEvent` (single transaction)
- **Mark paid:** Update `paymentRequest.status` + create `retentionLedger` entry + update `milestone.status` + append `auditEvent`
- **Close project:** Update `closureChecklist` + `executionProject.status` + append `auditEvent`

---

*End of Implementation Plan*
