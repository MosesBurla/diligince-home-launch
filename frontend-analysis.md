
# Diligince.ai Frontend Analysis Document
## Complete Technical Specification for Backend Development

---

## Table of Contents
1. [Project Overview & Architecture](#project-overview--architecture)
2. [User Type Analysis](#user-type-analysis)
3. [Cross-Cutting Concerns](#cross-cutting-concerns)
4. [Backend API Requirements](#backend-api-requirements)
5. [Data Models & Relationships](#data-models--relationships)
6. [Authentication & Authorization](#authentication--authorization)
7. [Integration Requirements](#integration-requirements)
8. [Public Pages & Marketing](#public-pages--marketing)
9. [Admin & Management Features](#admin--management-features)
10. [Performance & Security](#performance--security)
11. [Complete Component Library](#complete-component-library)
12. [Real-time Features](#real-time-features)
13. [File Management System](#file-management-system)
14. [Notification System](#notification-system)
15. [Calendar System](#calendar-system)
16. [Missing Pages Analysis](#missing-pages-analysis)

---

## Project Overview & Architecture

### Technology Stack
- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens and HSL color system
- **UI Library**: Radix UI components with shadcn/ui
- **Form Management**: React Hook Form with Zod validation
- **Routing**: React Router DOM v6 with protected routes
- **State Management**: React Context API + Custom Hooks
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icon library
- **Notifications**: Sonner (Toast notifications) with custom notification system
- **Date Handling**: date-fns for date manipulation
- **Query Management**: TanStack React Query for server state
- **Phone Validation**: libphonenumber-js for international phone numbers
- **Error Handling**: React Error Boundary with comprehensive error recovery
- **Theme Management**: Next Themes with system preference detection
- **SEO**: React Helmet for meta management
- **File Upload**: Multi-file drag & drop with progress tracking
- **Real-time**: WebSocket integration for live updates
- **Performance**: Code splitting, lazy loading, performance monitoring

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── industry/       # Industry user components
│   ├── professional/   # Professional user components
│   ├── vendor/         # Vendor components (service, product, logistics)
│   ├── shared/         # Cross-cutting components
│   ├── ui/            # Base UI component library
│   └── purchase-order/ # Purchase order specific components
├── contexts/           # React Context providers
├── hooks/             # Custom React hooks
├── pages/             # Route components
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── lib/               # Library configurations
└── assets/            # Static assets and images
```

### Key Architecture Patterns
- **Component Composition**: Modular, reusable components with clear separation of concerns
- **Custom Hooks**: Business logic separation with reusable state management
- **Context-based State**: Global state management with optimized re-renders
- **Type Safety**: Comprehensive TypeScript usage with strict type checking
- **Form Validation**: Zod schemas with React Hook Form integration
- **Error Boundaries**: Robust error handling with fallback UI
- **Performance Optimization**: Code splitting, lazy loading, memoization
- **Responsive Design**: Mobile-first approach with breakpoint system
- **Accessibility**: ARIA compliant components with keyboard navigation
- **Theme System**: Comprehensive theming with HSL color tokens

---

## Complete Component Library

### Notification System Components
- **NotificationBell**: Real-time notification indicator with badge count
  - Purpose: Display notification count and provide access to notification panel
  - Features: Badge count, real-time updates, click to open panel, unread indicator
  - Integration: WebSocket for real-time notifications, context for state management

- **NotificationPanel**: Expandable notification list with actions
  - Purpose: Display list of notifications with mark as read/unread functionality
  - Features: Scrollable list, mark all as read, individual actions, filter by type
  - Types: System alerts, project updates, message notifications, approval requests

- **NotificationPreview**: Individual notification display component
  - Purpose: Display single notification with actions and metadata
  - Features: Timestamp display, read/unread status, action buttons, avatar display
  - Actions: Mark as read, delete, view details, quick actions

- **ApprovalNotificationCenter**: Specialized approval notification system
  - Purpose: Handle approval-specific notifications and workflows
  - Features: Approval queue, priority indicators, batch approval actions
  - Integration: ApprovalContext, role-based access control

### Calendar System Components
- **AvailabilityCalendar**: Basic availability display and management
  - Purpose: Show and manage professional availability
  - Features: Month view, day selection, availability slots, booking indicators

- **EnhancedAvailabilityCalendar**: Advanced calendar with full feature set
  - Purpose: Comprehensive calendar management with multiple view modes
  - Features: Month/week/day views, drag-and-drop, recurring slots, time zone support
  - Integration: External calendar sync, conflict detection, automated booking

- **DayView**: Single day detailed schedule view
  - Purpose: Detailed daily schedule management with hourly slots
  - Features: Hourly breakdown, drag-and-drop scheduling, conflict resolution
  - Components: Time slots, booking details, availability gaps

- **WeekView**: Weekly schedule overview with multi-day selection
  - Purpose: Weekly schedule management with pattern recognition
  - Features: Multi-day selection, recurring patterns, bulk operations
  - Integration: Template application, availability optimization

- **CalendarSyncModal**: External calendar integration interface
  - Purpose: Sync with Google Calendar, Outlook, and other external calendars
  - Features: OAuth integration, two-way sync, conflict resolution, sync settings
  - Providers: Google Calendar, Microsoft Outlook, CalDAV, Apple Calendar

- **BulkAvailabilityModal**: Bulk schedule management interface
  - Purpose: Set availability for multiple days/weeks with patterns
  - Features: Recurring patterns, template application, exception handling
  - Patterns: Weekly recurring, custom ranges, holiday exclusions

- **CalendarTemplatesModal**: Pre-defined schedule template management
  - Purpose: Create and manage reusable schedule templates
  - Features: Template creation, modification, application, sharing
  - Types: Full-time, part-time, project-based, seasonal patterns

- **DayDetailsModal**: Detailed daily schedule management
  - Purpose: Manage specific day details with granular control
  - Features: Hourly slots, break management, special instructions, booking limits

- **FilterModal**: Calendar view filtering and customization
  - Purpose: Filter calendar views by various criteria
  - Features: Date ranges, booking types, availability status, client filters

### Purchase Order & Workflow Components
- **PurchaseOrderHeader**: Header component for PO pages
  - Purpose: Navigation and context for purchase order workflows
  - Features: Breadcrumb navigation, status indicators, action buttons

- **PurchaseOrderStepIndicator**: Multi-step process visualization
  - Purpose: Show progress through PO creation workflow
  - Features: Step completion indicators, navigation between steps, validation status

- **PODetailsModal**: Purchase order details view and editing
  - Purpose: Display and edit complete purchase order information
  - Features: Full PO details, edit capabilities, document attachments, approval workflow

- **POReviewStep**: Purchase order review and approval interface
  - Purpose: Final review before PO submission with compliance checks
  - Features: Summary view, compliance verification, approval routing, digital signatures

- **QuickPOModal**: Rapid purchase order creation interface
  - Purpose: Fast PO creation for standard orders
  - Features: Template-based creation, auto-fill from previous orders, simplified workflow

- **ManualPOUploadModal**: Manual PO document upload interface
  - Purpose: Upload existing PO documents with data extraction
  - Features: File upload, data extraction, validation, integration with workflow

- **POTriggerCard**: Purchase order trigger mechanism display
  - Purpose: Show conditions that trigger PO creation
  - Features: Trigger conditions, automated workflows, manual overrides

- **POTypeSelectionModal**: Purchase order type selection interface
  - Purpose: Select appropriate PO type based on requirements
  - Features: PO type recommendations, template selection, workflow routing

### Vendor Specialized Components
- **ServiceVendorSidebar**: Service vendor specific navigation
  - Purpose: Navigation tailored for service providers
  - Features: Service-specific menu items, project tracking, proposal management

- **ProductVendorSidebar**: Product vendor specific navigation
  - Purpose: Navigation for product suppliers
  - Features: Inventory management, catalog access, order processing

- **LogisticsVendorSidebar**: Logistics vendor navigation
  - Purpose: Transportation and logistics specific navigation
  - Features: Fleet management, delivery tracking, route optimization

- **LogisticsVendorCustomSidebar**: Enhanced logistics navigation with specialization
  - Purpose: Specialized navigation based on logistics vendor type
  - Features: Equipment-specific features, specialization-based menus, dynamic adaptation
  - Integration: VendorSpecializationContext for feature adaptation

- **SpecializationFeatures**: Dynamic feature adaptation for vendor specializations
  - Purpose: Adapt UI features based on vendor specialization type
  - Features: Equipment-specific modals, specialized workflows, contextual tools
  - Specializations: Heavy equipment, crane services, transportation, warehouse

### Authentication & User Management Components
- **AuthLayout**: Authentication page wrapper with branding
  - Purpose: Consistent layout for all authentication pages
  - Features: Branding, responsive design, form containers, navigation

- **SignInForm**: User login interface with validation
  - Purpose: Secure user authentication with role-based redirect
  - Features: Email/password login, remember me, forgot password link, role detection
  - Validation: Zod schema validation, error handling, loading states

- **IndustrySignUpForm**: Industry user registration with company verification
  - Purpose: Multi-step registration for manufacturing companies
  - Features: Company verification, team setup, compliance requirements
  - Workflow: Company details → Team members → Verification → Approval

### Shared Layout Components
- **GenericHeader**: Configurable header for all user types
  - Purpose: Unified header component with role-based customization
  - Features: Navigation menus, user profiles, notifications, search
  - Customization: Role-based menu items, branding, action buttons

- **BaseSidebar**: Base sidebar component for vendors
  - Purpose: Common sidebar functionality with specialization support
  - Features: Collapsible navigation, profile display, progress indicators

- **BaseVendorLayout**: Layout wrapper for vendor pages
  - Purpose: Consistent layout for all vendor types with header and sidebar
  - Features: Responsive layout, sidebar toggle, content area management

### Stakeholder Management Components
- **InviteStakeholderModal**: Stakeholder invitation interface
  - Purpose: Invite vendors, experts, and team members to projects
  - Features: Role selection, project assignment, permission settings, bulk invites

- **StakeholderStatusBadge**: Status indicator for stakeholders
  - Purpose: Visual status representation with color coding
  - Statuses: Active, pending, invited, suspended, verified

- **ExpertDetailsModal**: Expert consultant detailed information
  - Purpose: Display expert profiles with skills and availability
  - Features: Skills matrix, availability calendar, performance metrics, ratings

- **VendorDetailsModal**: Vendor profile details and capabilities
  - Purpose: Comprehensive vendor information for selection
  - Features: Capabilities, certifications, past projects, performance data

- **ProjectSelectionModal**: Project assignment interface for stakeholders
  - Purpose: Assign stakeholders to specific projects with role definition
  - Features: Project selection, role assignment, permission setting, timeline

### Industry Specific Components
- **RequirementHeader**: Header for requirement management pages
  - Purpose: Navigation and context for requirement workflows
  - Features: Breadcrumbs, status indicators, action buttons, progress tracking

- **RequirementStepIndicator**: Multi-step requirement creation progress
  - Purpose: Visual progress indicator for requirement creation workflow
  - Features: Step completion, validation status, navigation, error indicators

- **SuccessScreen**: Completion confirmation for workflows
  - Purpose: Success confirmation with next steps
  - Features: Success message, summary, next actions, navigation options

- **EnterpriseTeamMembers**: Enterprise team management interface
  - Purpose: Manage team members with roles and permissions
  - Features: Member list, role assignment, permission matrix, invitation system

- **AddVendorModal**: Vendor addition and selection interface
  - Purpose: Add vendors to stakeholder list with verification
  - Features: Vendor search, verification status, capability matching, invitation

- **AddExpertModal**: Expert consultant addition interface
  - Purpose: Add expert consultants with skill matching
  - Features: Expert search, skill verification, availability check, project assignment

- **SendRFQModal**: RFQ distribution interface
  - Purpose: Send RFQs to selected stakeholders with customization
  - Features: Stakeholder selection, RFQ customization, deadline setting, batch operations

### Workflow & Project Components
- **WorkTimeline**: Project timeline visualization with milestones
  - Purpose: Visual project progress with milestone tracking
  - Features: Timeline view, milestone markers, progress indicators, interactive elements

- **PaymentMilestoneTracker**: Financial milestone tracking interface
  - Purpose: Track payment milestones and completion status
  - Features: Payment schedule, completion status, invoice generation, approval workflow

- **QuoteComparisonCard**: Vendor quote comparison interface
  - Purpose: Side-by-side comparison of vendor quotes
  - Features: Comparison matrix, scoring system, recommendation engine, selection tools

- **QuoteReviewTable**: Tabular quote review with filtering
  - Purpose: Comprehensive quote review with sorting and filtering
  - Features: Sortable columns, filtering options, bulk operations, export functionality

- **QuoteStatusTracker**: Real-time quote status monitoring
  - Purpose: Track quote status changes with notifications
  - Features: Status updates, notification system, timeline view, automated alerts

- **RetentionPaymentCard**: Payment retention management
  - Purpose: Manage payment retention policies and releases
  - Features: Retention schedules, release conditions, approval workflows, compliance tracking

- **AIEvaluationPanel**: AI-powered quote evaluation system
  - Purpose: Automated quote analysis with recommendations
  - Features: AI scoring, risk assessment, recommendation engine, comparison metrics

- **ISO9001TermsSection**: Compliance management for ISO standards
  - Purpose: Ensure ISO 9001 compliance in workflows
  - Features: Compliance checklist, documentation requirements, audit trails, verification

---

## Missing Pages Analysis

### Industry User Pages (Manufacturing Companies)
- **WorkCompletionPayment** (`/work-completion-payment`)
  - Purpose: Payment processing interface for completed work milestones
  - Features: Payment verification, milestone completion tracking, invoice generation, approval workflows
  - Components: PaymentMilestoneTracker, RetentionPaymentCard, approval interface
  - API Requirements: Payment processing, milestone updates, invoice generation

- **RequirementDetails** (`/requirement/:id`)
  - Purpose: Detailed view of individual requirements with full lifecycle
  - Features: Requirement specifications, RFQ history, quote analysis, project progression
  - Components: Requirement display, RFQ timeline, quote comparison, status tracking
  - API Requirements: Requirement data, RFQ history, quote management, status updates

- **IndustryDocuments** (`/industry-documents`)
  - Purpose: Comprehensive document management system for industries
  - Features: Document upload, version control, access permissions, search functionality
  - Components: Document library, upload interface, permission management, search tools
  - API Requirements: File upload, document metadata, access control, search indexing

- **IndustryMessages** (`/industry-messages`)
  - Purpose: Communication hub for industry users with vendors and experts
  - Features: Message threads, vendor communication, expert consultation, file sharing
  - Components: Message interface, thread management, file attachments, contact lists
  - API Requirements: Messaging system, file attachments, thread management, notifications

- **IndustryWorkflows** (`/industry-workflows`)
  - Purpose: Workflow management and automation for industry processes
  - Features: Workflow templates, process automation, status tracking, performance analytics
  - Components: Workflow designer, template library, status dashboard, analytics panel
  - API Requirements: Workflow engine, template management, status tracking, analytics

### Professional User Pages (Consultants/Specialists)
- **ProfessionalDetails** (`/professional/:id`)
  - Purpose: Public profile pages for professional consultants
  - Features: Skills showcase, portfolio display, availability calendar, client reviews
  - Components: Profile display, portfolio gallery, availability widget, review system
  - API Requirements: Profile data, portfolio management, availability sync, review system

- **ProfessionalMessages** (`/professional-messages`)
  - Purpose: Communication interface for professionals with clients
  - Features: Client communication, project discussions, consultation booking, file sharing
  - Components: Message interface, booking system, file management, client directory
  - API Requirements: Messaging system, booking management, file storage, client management

### Admin & Management Pages
- **ApprovalDashboard** (`/approval-dashboard`)
  - Purpose: Centralized approval management for administrators
  - Features: Pending approvals, workflow management, user verification, system oversight
  - Components: Approval queue, workflow controls, user management, system monitoring
  - API Requirements: Approval workflows, user management, system administration, audit logs

- **PendingApproval** (`/pending-approval`)
  - Purpose: User approval and verification interface
  - Features: User verification, document review, approval workflows, compliance checking
  - Components: User verification interface, document viewer, approval controls, compliance tools
  - API Requirements: User verification, document management, approval processing, compliance tracking

### Public & Marketing Pages
- **About** (`/about`)
  - Purpose: Company information and mission statement
  - Features: Company story, team information, values, contact information
  - Components: Company overview, team profiles, value proposition, contact forms
  - Content: Static content with dynamic team information

- **Blog** (`/blog`)
  - Purpose: Company blog with industry insights and updates
  - Features: Article listing, search functionality, categories, pagination
  - Components: Article cards, search interface, category filters, pagination controls
  - API Requirements: Article management, search functionality, content categorization

- **BlogArticle** (`/blog/:slug`)
  - Purpose: Individual blog post pages with full content
  - Features: Article content, social sharing, related articles, comments
  - Components: Article renderer, sharing buttons, related content, comment system
  - API Requirements: Article content, metadata, related content, engagement tracking

- **Careers** (`/careers`)
  - Purpose: Job listings and career information
  - Features: Job postings, application forms, company culture, benefits information
  - Components: Job listings, application interface, company culture showcase
  - API Requirements: Job management, application processing, candidate tracking

- **Contact** (`/contact`)
  - Purpose: Contact information and inquiry forms
  - Features: Contact forms, office locations, support channels, FAQ
  - Components: Contact forms, location maps, support information, FAQ section
  - API Requirements: Form submission, inquiry management, support ticketing

- **Legal** (`/legal`)
  - Purpose: Legal information and compliance documentation
  - Features: Legal documents, compliance information, regulatory updates
  - Components: Document display, legal navigation, compliance status
  - Content: Legal documentation with version control

- **VendorDetails** (`/vendor/:id`)
  - Purpose: Public vendor profile pages
  - Features: Vendor capabilities, certifications, past projects, contact information
  - Components: Vendor profile, capability showcase, project portfolio, contact forms
  - API Requirements: Vendor data, capability management, project history, contact processing

### Authentication & Onboarding Pages
- **ForgotPassword** (`/forgot-password`)
  - Purpose: Password reset request interface
  - Features: Email verification, security questions, reset token generation
  - Components: Reset form, verification interface, security controls
  - API Requirements: Password reset, email verification, token management

- **ResetPassword** (`/reset-password`)
  - Purpose: Password reset form with token verification
  - Features: New password entry, strength validation, confirmation
  - Components: Password form, strength indicator, validation feedback
  - API Requirements: Token verification, password update, security logging

- **StakeholderOnboarding** (`/stakeholder-onboarding`)
  - Purpose: Stakeholder invitation and onboarding workflow
  - Features: Invitation acceptance, profile completion, role assignment
  - Components: Onboarding wizard, profile forms, role selection, completion tracking
  - API Requirements: Invitation management, profile creation, role assignment

- **ProfileCompletion** (`/profile-completion`)
  - Purpose: Profile completion wizard for new users
  - Features: Step-by-step profile setup, progress tracking, validation
  - Components: Completion wizard, progress indicators, form validation, file upload
  - API Requirements: Profile management, progress tracking, file upload, validation

### Error & Utility Pages
- **NotFound** (`/404`)
  - Purpose: 404 error page with navigation options
  - Features: Error message, navigation suggestions, search functionality
  - Components: Error display, navigation menu, search interface
  - Features: Helpful navigation, search, contact options

- **TestPage** (`/test`)
  - Purpose: Development testing page for component testing
  - Features: Component showcase, testing utilities, development tools
  - Components: Test components, debugging tools, performance monitors
  - Usage: Development and testing environment only

---

## Real-time Features

### WebSocket Integration
- **Connection Management**: Automatic connection handling with reconnection logic
- **Event Types**: Notifications, project updates, delivery tracking, messaging
- **Authentication**: JWT token-based WebSocket authentication
- **Scalability**: Connection pooling and load balancing support

### Live Update Components
- **LiveTrackingModal**: Real-time vehicle and delivery tracking
  - Purpose: GPS tracking with live map updates
  - Features: Real-time location, route visualization, ETA calculations
  - Integration: GPS data, mapping services, notification system

- **VehicleTrackingModal**: Vehicle fleet tracking interface
  - Purpose: Multi-vehicle tracking with status monitoring
  - Features: Fleet overview, individual vehicle status, route optimization
  - Data: GPS coordinates, vehicle status, driver information, cargo details

### Real-time Notifications
- **Instant Delivery**: WebSocket-based instant notification delivery
- **Queue Management**: Notification queuing for offline users
- **Priority System**: Priority-based notification handling
- **Batch Processing**: Efficient batch notification processing

---

## File Management System

### Upload Components
- **Multi-file Upload**: Drag and drop interface with progress tracking
- **Document Versioning**: Version control for uploaded documents
- **File Preview**: In-browser preview for common file types
- **Access Control**: Role-based file access permissions

### Storage Integration
- **Cloud Storage**: Integration with AWS S3, Google Cloud Storage
- **CDN Integration**: Content delivery network for fast file access
- **Backup System**: Automated backup and recovery
- **Compression**: Automatic file compression and optimization

### Document Management
- **Metadata Management**: File metadata and tagging system
- **Search Functionality**: Full-text search across documents
- **Audit Trail**: Complete file access and modification history
- **Compliance**: Document retention and compliance management

---

## Notification System

### Notification Types
- **System Notifications**: System alerts, maintenance, updates
- **Project Updates**: Milestone completion, status changes, approvals
- **Message Notifications**: New messages, mentions, replies
- **Approval Requests**: Pending approvals, workflow notifications
- **Delivery Updates**: Shipment tracking, delivery confirmations
- **Calendar Events**: Appointment reminders, schedule changes

### Delivery Channels
- **In-App Notifications**: Real-time in-application notifications
- **Email Notifications**: Configurable email notifications
- **SMS Notifications**: Critical alert SMS delivery
- **Push Notifications**: Browser push notifications
- **Webhook Notifications**: Third-party integration notifications

### Notification Management
- **Preference Settings**: User-configurable notification preferences
- **Batch Operations**: Mark all as read, bulk delete operations
- **Filtering**: Filter by type, date, priority, read status
- **Archive System**: Notification archiving and retention policies

---

## Calendar System

### Calendar Features
- **Multiple Views**: Month, week, day, agenda views
- **Time Zone Support**: Multi-timezone scheduling and display
- **Recurring Events**: Flexible recurring event patterns
- **Conflict Detection**: Automatic scheduling conflict detection
- **Availability Management**: Professional availability scheduling

### External Integration
- **Google Calendar**: Two-way synchronization with Google Calendar
- **Microsoft Outlook**: Outlook calendar integration
- **CalDAV Support**: Standard calendar protocol support
- **iCal Import/Export**: Calendar data import and export

### Booking System
- **Availability Slots**: Configurable availability time slots
- **Booking Confirmation**: Automated booking confirmations
- **Reminder System**: Automated appointment reminders
- **Cancellation Management**: Booking cancellation and rescheduling

---

## Authentication & Authorization

### Authentication System
- **Multi-Role Authentication**: Support for all user types with role detection
- **JWT Tokens**: Secure JWT-based authentication with refresh tokens
- **Session Management**: Secure session handling with timeout policies
- **Multi-Factor Authentication**: Optional MFA for enhanced security
- **Social Login**: Integration with Google, LinkedIn, Microsoft accounts

### Authorization Matrix
```typescript
const ROLE_PERMISSIONS = {
  industry: {
    requirements: ['create', 'read', 'update', 'delete'],
    rfqs: ['create', 'read', 'update'],
    purchase_orders: ['create', 'read', 'update', 'approve'],
    projects: ['read', 'update', 'monitor'],
    stakeholders: ['create', 'read', 'update', 'delete', 'invite'],
    approval_workflows: ['create', 'read', 'update', 'configure'],
    documents: ['upload', 'read', 'share', 'version'],
    analytics: ['read', 'export']
  },
  professional: {
    profile: ['read', 'update'],
    opportunities: ['read', 'apply'],
    projects: ['read', 'update', 'deliver'],
    calendar: ['create', 'read', 'update', 'delete', 'sync'],
    earnings: ['read'],
    certifications: ['create', 'read', 'update', 'verify']
  },
  service_vendor: {
    profile: ['read', 'update'],
    services: ['create', 'read', 'update', 'delete'],
    rfqs: ['read', 'respond'],
    proposals: ['create', 'read', 'update', 'submit'],
    projects: ['read', 'update', 'deliver'],
    team: ['create', 'read', 'update', 'delete']
  },
  product_vendor: {
    profile: ['read', 'update'],
    catalog: ['create', 'read', 'update', 'delete'],
    inventory: ['read', 'update', 'track'],
    orders: ['read', 'update', 'fulfill', 'ship'],
    quotes: ['create', 'read', 'update', 'submit']
  },
  logistics_vendor: {
    profile: ['read', 'update'],
    fleet: ['create', 'read', 'update', 'delete'],
    requests: ['read', 'accept', 'quote'],
    deliveries: ['track', 'update', 'complete'],
    routes: ['optimize', 'plan', 'execute']
  }
};
```

### User Approval Workflow
1. **Registration**: Multi-step registration with email verification
2. **Profile Completion**: Role-specific profile completion requirements
3. **Document Verification**: Upload and verification of required documents
4. **Admin Review**: Manual review and approval process
5. **Account Activation**: Final account activation and access provisioning
6. **Onboarding**: Role-specific onboarding and training

---

## Backend API Requirements

### Authentication APIs
```typescript
// User Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
POST /api/auth/resend-verification
POST /api/auth/change-password
GET /api/auth/me
PUT /api/auth/profile

// Multi-Factor Authentication
POST /api/auth/mfa/enable
POST /api/auth/mfa/disable
POST /api/auth/mfa/verify
POST /api/auth/mfa/backup-codes

// Social Authentication
GET /api/auth/google
GET /api/auth/linkedin
GET /api/auth/microsoft
POST /api/auth/social/callback

// Role Management
GET /api/auth/roles
PUT /api/auth/role
POST /api/auth/role-request
GET /api/auth/permissions
```

### File Management APIs
```typescript
// File Upload & Management
POST /api/files/upload
POST /api/files/multipart-upload
GET /api/files/:id
DELETE /api/files/:id
PUT /api/files/:id/metadata
GET /api/files/:id/download
POST /api/files/:id/share
GET /api/files/shared/:token

// Document Management
GET /api/documents
POST /api/documents
PUT /api/documents/:id
DELETE /api/documents/:id
POST /api/documents/:id/version
GET /api/documents/:id/versions
GET /api/documents/:id/history
POST /api/documents/:id/approve
GET /api/documents/search

// File Processing
POST /api/files/:id/process
GET /api/files/:id/preview
POST /api/files/:id/convert
GET /api/files/:id/thumbnail
```

### Real-time Communication APIs
```typescript
// WebSocket Events
WS /api/ws/connect
WS /api/ws/notifications
WS /api/ws/messages
WS /api/ws/tracking
WS /api/ws/project-updates
WS /api/ws/system-events

// Messaging System
GET /api/messages
POST /api/messages
PUT /api/messages/:id
DELETE /api/messages/:id
GET /api/messages/conversations
POST /api/messages/conversation
PUT /api/messages/conversation/:id
GET /api/messages/search
POST /api/messages/broadcast

// Notification System
GET /api/notifications
POST /api/notifications
PUT /api/notifications/:id/read
PUT /api/notifications/mark-all-read
DELETE /api/notifications/:id
GET /api/notifications/settings
PUT /api/notifications/settings
POST /api/notifications/subscribe
DELETE /api/notifications/unsubscribe
```

### Business Logic APIs
```typescript
// Industry User APIs
GET /api/industry/dashboard
GET /api/industry/requirements
POST /api/industry/requirements
PUT /api/industry/requirements/:id
DELETE /api/industry/requirements/:id
POST /api/industry/requirements/:id/approve
GET /api/industry/stakeholders
POST /api/industry/stakeholders/invite
GET /api/industry/workflows
POST /api/industry/workflows
GET /api/industry/documents
POST /api/industry/documents/upload

// Professional APIs
GET /api/professionals/dashboard
GET /api/professionals/opportunities
POST /api/professionals/opportunities/:id/apply
GET /api/professionals/calendar
POST /api/professionals/availability
GET /api/professionals/earnings
GET /api/professionals/certifications
POST /api/professionals/certifications

// Vendor APIs (Service)
GET /api/service-vendors/dashboard
GET /api/service-vendors/rfqs
POST /api/service-vendors/proposals
GET /api/service-vendors/projects
GET /api/service-vendors/team
POST /api/service-vendors/services

// Vendor APIs (Product)
GET /api/product-vendors/dashboard
GET /api/product-vendors/catalog
POST /api/product-vendors/products
GET /api/product-vendors/orders
PUT /api/product-vendors/orders/:id/status
GET /api/product-vendors/inventory

// Vendor APIs (Logistics)
GET /api/logistics-vendors/dashboard
GET /api/logistics-vendors/requests
GET /api/logistics-vendors/fleet
POST /api/logistics-vendors/vehicles
GET /api/logistics-vendors/deliveries
PUT /api/logistics-vendors/deliveries/:id/status
POST /api/logistics-vendors/routes/optimize
```

### Analytics & Reporting APIs
```typescript
// Dashboard Analytics
GET /api/analytics/dashboard/:role
GET /api/analytics/kpis
GET /api/analytics/trends
GET /api/analytics/performance

// Business Intelligence
GET /api/reports/revenue
GET /api/reports/projects
GET /api/reports/vendor-performance
GET /api/reports/user-activity
POST /api/reports/custom
GET /api/reports/export/:id

// System Monitoring
GET /api/monitoring/health
GET /api/monitoring/performance
GET /api/monitoring/errors
GET /api/monitoring/usage
```

---

## Data Models & Relationships

### Core User Models
```typescript
interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  companyId?: string;
  vendorCategory?: VendorCategory;
  specialization?: string[];
  location: Address;
  timezone: string;
  language: string;
}

interface Company {
  id: string;
  name: string;
  type: CompanyType;
  registrationNumber?: string;
  taxId?: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  description?: string;
  address: Address;
  certifications: Certification[];
  isVerified: boolean;
  verificationDocuments: Document[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Business Process Models
```typescript
interface Requirement {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  budget: BudgetRange;
  timeline: Timeline;
  specifications: Specification[];
  attachments: Document[];
  approvalWorkflow: ApprovalWorkflow;
  status: RequirementStatus;
  createdBy: string;
  assignedTo: string[];
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  completedAt?: Date;
}

interface RFQ {
  id: string;
  requirementId: string;
  title: string;
  description: string;
  specifications: Specification[];
  terms: Terms;
  deadline: Date;
  vendors: string[];
  responses: RFQResponse[];
  evaluationCriteria: EvaluationCriteria[];
  status: RFQStatus;
  issuedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  requirementId: string;
  vendorId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  milestones: Milestone[];
  payments: Payment[];
  documents: Document[];
  communications: Message[];
  timeline: ProjectTimeline;
  budget: ProjectBudget;
  team: TeamMember[];
  risks: Risk[];
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  endDate?: Date;
  completedDate?: Date;
}
```

### Specialized Vendor Models
```typescript
interface LogisticsVendor extends Vendor {
  specialization: LogisticsSpecialization;
  fleet: Vehicle[];
  drivers: Driver[];
  serviceAreas: ServiceArea[];
  equipment: Equipment[];
  certifications: LogisticsCertification[];
}

interface Vehicle {
  id: string;
  vendorId: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: VehicleCapacity;
  currentLocation?: Location;
  status: VehicleStatus;
  assignedDriver?: string;
  maintenance: MaintenanceRecord[];
  documents: VehicleDocument[];
  tracking: TrackingData[];
}

interface ServiceVendor extends Vendor {
  services: Service[];
  team: TeamMember[];
  portfolio: Project[];
  capabilities: Capability[];
  certifications: ServiceCertification[];
}

interface ProductVendor extends Vendor {
  catalog: Product[];
  inventory: InventoryItem[];
  brands: Brand[];
  partnerships: Partnership[];
  warehouses: Warehouse[];
}
```

---

## Integration Requirements

### External Service Integrations
```typescript
interface ExternalIntegrations {
  // Communication Services
  email: {
    provider: 'SendGrid' | 'AWS SES' | 'Mailgun';
    apiKey: string;
    templates: EmailTemplate[];
    webhooks: EmailWebhook[];
  };
  
  sms: {
    provider: 'Twilio' | 'AWS SNS' | 'MessageBird';
    credentials: SMSCredentials;
    templates: SMSTemplate[];
  };
  
  // Storage & CDN
  storage: {
    provider: 'AWS S3' | 'Google Cloud' | 'Azure Blob';
    buckets: StorageBucket[];
    cdn: CDNConfig;
    encryption: EncryptionConfig;
  };
  
  // Payment Processing
  payment: {
    provider: 'Stripe' | 'PayPal' | 'Razorpay';
    webhooks: PaymentWebhook[];
    currencies: SupportedCurrency[];
  };
  
  // Mapping & Location
  maps: {
    provider: 'Google Maps' | 'Mapbox' | 'HERE';
    features: MapFeature[];
    geocoding: GeocodingConfig;
  };
  
  // Calendar Integration
  calendar: {
    providers: CalendarProvider[];
    syncSettings: CalendarSyncConfig;
    webhooks: CalendarWebhook[];
  };
}
```

### API Integration Specifications
```typescript
// Payment Gateway Integration
interface PaymentIntegration {
  processPayment: (paymentData: PaymentRequest) => Promise<PaymentResponse>;
  verifyPayment: (paymentId: string) => Promise<PaymentStatus>;
  handleWebhook: (webhookData: WebhookPayload) => Promise<void>;
  refundPayment: (paymentId: string, amount?: number) => Promise<RefundResponse>;
}

// Shipping Integration
interface ShippingIntegration {
  createShipment: (shipmentData: ShipmentRequest) => Promise<ShipmentResponse>;
  trackShipment: (trackingNumber: string) => Promise<TrackingData>;
  calculateRates: (rateRequest: RateRequest) => Promise<ShippingRate[]>;
  validateAddress: (address: Address) => Promise<AddressValidation>;
}

// Document Verification
interface DocumentVerificationIntegration {
  verifyDocument: (document: Document) => Promise<VerificationResult>;
  extractData: (document: Document) => Promise<ExtractedData>;
  validateIdentity: (identityData: IdentityRequest) => Promise<IdentityVerification>;
}
```

---

## Performance & Security

### Performance Optimization
```typescript
interface PerformanceConfig {
  // Caching Strategy
  cache: {
    redis: RedisConfig;
    memoryCache: MemoryCacheConfig;
    cdnCache: CDNCacheConfig;
    databaseCache: DatabaseCacheConfig;
  };
  
  // Database Optimization
  database: {
    indexing: IndexStrategy[];
    partitioning: PartitionStrategy[];
    replication: ReplicationConfig;
    sharding: ShardingConfig;
  };
  
  // API Optimization
  api: {
    rateLimit: RateLimitConfig;
    compression: CompressionConfig;
    pagination: PaginationConfig;
    queryOptimization: QueryOptimizationConfig;
  };
}
```

### Security Implementation
```typescript
interface SecurityConfig {
  // Authentication Security
  auth: {
    passwordPolicy: PasswordPolicy;
    sessionSecurity: SessionSecurityConfig;
    mfaSettings: MFAConfig;
    tokenSecurity: TokenSecurityConfig;
  };
  
  // Data Protection
  dataProtection: {
    encryption: EncryptionConfig;
    dataClassification: DataClassificationConfig;
    backupSecurity: BackupSecurityConfig;
    auditLogging: AuditLoggingConfig;
  };
  
  // API Security
  apiSecurity: {
    cors: CORSConfig;
    rateLimiting: RateLimitConfig;
    inputValidation: ValidationConfig;
    outputSanitization: SanitizationConfig;
  };
}
```

---

## Technical Architecture Summary

This comprehensive frontend analysis provides a complete blueprint for developing a robust Node.js backend with Express.js and MongoDB that supports all aspects of the Diligince.ai platform. The analysis covers:

### Complete Coverage Statistics
- **50+ Pages** across all user types, public areas, and admin functions
- **150+ Components** including modals, forms, specialized features, and shared utilities
- **20+ Contexts** for comprehensive state management and data flow
- **25+ Custom Hooks** for business logic and performance optimization
- **Comprehensive Type System** with 200+ TypeScript interfaces and types
- **Complete API Requirements** for all user operations and system functions
- **Real-time Features** with WebSocket integration and live updates
- **Security & Performance** considerations throughout all layers
- **External Integrations** for complete platform functionality

### Backend Development Priorities
1. **Authentication & Authorization System** (Weeks 1-2)
   - Multi-role authentication with JWT tokens
   - Role-based access control with comprehensive permissions
   - User approval workflows with admin oversight
   - Multi-factor authentication and security features

2. **Core Business Logic Implementation** (Weeks 3-6)
   - Requirements and RFQ management with approval workflows
   - Project lifecycle management with milestone tracking
   - Vendor management with specialization support
   - Purchase order workflows with compliance features

3. **Real-time Communication System** (Weeks 7-8)
   - WebSocket implementation for live updates
   - Messaging system with multi-party support
   - Notification system with multiple delivery channels
   - Live tracking for logistics and project updates

4. **File Management & Document System** (Weeks 9-10)
   - Multi-file upload with progress tracking
   - Document versioning and access control
   - Integration with cloud storage providers
   - Document processing and preview capabilities

5. **Integration Layer Development** (Weeks 11-12)
   - Payment gateway integration for transactions
   - Shipping and logistics provider integration
   - Calendar synchronization with external providers
   - Email and SMS communication services

6. **Analytics & Reporting System** (Weeks 13-14)
   - Dashboard analytics for all user types
   - Business intelligence and performance metrics
   - Custom reporting with export capabilities
   - System monitoring and health checks

7. **Performance Optimization & Security** (Weeks 15-16)
   - Database optimization with indexing and caching
   - API performance optimization with rate limiting
   - Security implementation with encryption and audit trails
   - Comprehensive testing and deployment pipeline

### Database Schema Requirements
- **User Management**: Users, profiles, companies, roles, permissions
- **Business Processes**: Requirements, RFQs, quotes, projects, milestones
- **Communication**: Messages, notifications, conversations, threads
- **File Management**: Documents, versions, access logs, metadata
- **Specialized Data**: Vehicles, drivers, products, services, inventory
- **Analytics**: Activity logs, performance metrics, audit trails

This analysis ensures that the backend development will fully support all frontend functionality while maintaining high standards of security, performance, and scalability suitable for enterprise-level deployment.

