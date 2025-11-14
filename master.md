
# Diligince.ai Codebase Documentation

## Project Overview
Diligince.ai is a comprehensive B2B platform connecting industries, professionals, and vendors for industrial services, procurement, and logistics. The platform facilitates requirement creation, vendor discovery, professional expertise, purchase orders, and payment processing.

## Tech Stack
- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM v6
- **Data Management**: TanStack Query v5 (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Toast Notifications**: Sonner and shadcn/ui Toaster
- **State Management**: React Context + TanStack Query

## Architecture Overview

### 1. User Types & Core Flow
The platform serves three primary user types with distinct workflows:

**Industries** (Manufacturing companies)
- Create requirements and purchase orders
- Manage vendor relationships and projects
- Track workflows and payments
- Color scheme: Blue theme

**Professionals** (Expert consultants)
- Manage availability and expertise profiles
- Apply for opportunities and projects
- Handle client communications
- Color scheme: Green theme

**Vendors** (Service, Product, Logistics providers)
- **Service Vendors**: Orange theme
- **Product Vendors**: Yellow theme  
- **Logistics Vendors**: Pink theme
- Respond to RFQs and manage orders
- Track projects and deliveries

### 2. Application Architecture

#### Component Organization (`/src/components`)
```
components/
├── ui/                     # Shadcn/ui base components
├── shared/                 # Cross-cutting components
│   ├── dashboard/         # Generic dashboard widgets
│   ├── layout/            # Layout and navigation
│   ├── loading/           # Loading states
│   ├── messages/          # Message center
│   ├── modals/            # Reusable modals
│   └── notifications/     # Notification system
├── industry/              # Industry-specific components
├── professional/          # Professional-specific components
├── vendor/                # Vendor-specific components
│   ├── service/          # Service vendor components
│   ├── product/          # Product vendor components
│   ├── logistics/        # Logistics vendor components
│   └── shared/           # Common vendor components
├── signup/               # Registration flows
├── requirement/          # Requirement creation wizard
└── purchase-order/       # Purchase order workflows
```

#### Page Structure (`/src/pages`)
- **Public Pages**: Index, About, Contact, Blog, Careers, Pricing, Terms, Privacy
- **Authentication**: SignUp, SignIn, ProfileCompletion
- **Industry Pages**: Dashboard, Profile, Messages, Documents, ProjectWorkflow
- **Professional Pages**: Dashboard, Profile, Calendar, Opportunities, Messages
- **Vendor Pages**: Dashboard, Profile, RFQs, Services/Catalog, Projects/Orders, Messages
- **Functional Pages**: CreateRequirement, CreatePurchaseOrder, WorkCompletionPayment

#### State Management (`/src/contexts`)
- **UserContext**: Authentication and user profile management
- **ThemeContext**: Application theming and user-type colors
- **RequirementContext**: Multi-step requirement creation state
- **VendorSpecializationContext**: Vendor matching and categorization
- **NotificationContext**: Application-wide notifications

#### Type System (`/src/types`)
- **Domain Types**: User, Industry, Professional, Vendor, Workflow
- **Business Logic**: ProjectWorkflow, VendorQuote, PurchaseOrder, PaymentMilestone
- **UI Types**: Dashboard metrics, notifications, sidebar configurations

### 3. Key Features & Workflows

#### Multi-Step Form Wizards
- **Requirement Creation**: 6-step wizard (BasicInfo → Details → Documents → Preview → Publish → Success)
- **Purchase Order Creation**: Multi-step PO generation with vendor selection
- **Profile Completion**: User-type specific onboarding flows

#### Project Workflow Management
- **Quote Management**: Vendor quotes, evaluation, and acceptance
- **Purchase Orders**: PO generation, tracking, and management
- **Payment Milestones**: Milestone-based payment release system
- **Work Completion**: Verification and payment processing

#### Vendor Discovery & Matching
- **Specialization Mapping**: Service/Product/Logistics categorization
- **Capability Matching**: Skills and expertise alignment
- **Geographic Filtering**: Location-based vendor discovery
- **Rating & Review System**: Vendor performance tracking

### 4. Design System

#### Color Schemes by User Type
- **Industry**: Blue (`bg-blue-600`, `text-blue-600`)
- **Professional**: Green (`bg-green-600`, `text-green-600`)
- **Service Vendor**: Orange (`bg-orange-600`, `text-orange-600`)
- **Product Vendor**: Yellow (`bg-yellow-600`, `text-yellow-600`)
- **Logistics Vendor**: Pink (`bg-pink-600`, `text-pink-600`)

#### Component Patterns
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Consistent Layout**: Header + Main content + Footer structure  
- **Loading States**: Skeleton loading and spinner components
- **Error Handling**: Error boundaries and user-friendly error messages
- **Accessibility**: WCAG 2.1 AA compliance with proper ARIA labels

### 5. Performance Optimizations

#### Code Splitting & Lazy Loading
- Route-based code splitting with React.lazy()
- Lazy loading for heavy components and images
- Bundle optimization with Vite

#### Caching & State Management
- TanStack Query for server state caching
- Optimistic updates for better UX
- Background refetching and synchronization

#### Memoization Patterns
- React.memo for expensive components
- useMemo for heavy calculations
- useCallback for stable function references

### 6. Development Standards

#### File Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useUserData.ts`)
- **Utilities**: camelCase (`dateHelpers.ts`)
- **Types**: camelCase (`user.ts`)

#### Code Organization
- Single responsibility principle for components
- Custom hooks for reusable logic
- Utility functions in `/lib` and `/utils`
- Consistent import/export patterns

#### Error Handling
- ErrorBoundary components for fault tolerance
- Toast notifications for user feedback
- Comprehensive form validation with Zod
- Loading states for all async operations

### 7. Planned Integrations

#### Backend Integration (Supabase)
- PostgreSQL database for data persistence
- Real-time subscriptions for live updates
- Authentication with role-based access control
- Edge functions for business logic

#### Testing Infrastructure
- Unit tests with Jest and React Testing Library
- Integration tests for complex workflows
- End-to-end tests with Cypress/Playwright
- Visual regression testing

#### Monitoring & Analytics
- Performance monitoring and optimization
- Error tracking and reporting
- User behavior analytics
- Business metrics dashboard

## Key Business Workflows

### 1. Requirement to Purchase Order Flow
1. **Industry User** creates requirement via multi-step wizard
2. **System** matches requirements with relevant vendors
3. **Vendors** submit quotes and proposals
4. **Industry User** evaluates and accepts quotes
5. **System** generates purchase orders automatically
6. **Workflow Management** tracks project progress
7. **Payment Processing** handles milestone-based payments

### 2. Vendor Onboarding & Discovery
1. **Vendor Registration** with type-specific forms
2. **Profile Completion** with capabilities and certifications
3. **Specialization Mapping** for accurate matching
4. **Verification Process** for quality assurance
5. **Directory Listing** for industry discovery

### 3. Professional Services Flow
1. **Professional Registration** with expertise areas
2. **Availability Management** via calendar system
3. **Opportunity Discovery** and application process
4. **Client Engagement** and project delivery
5. **Performance Tracking** and ratings

## Future Development Roadmap

### Phase 1: Documentation & Standards ✅
- Comprehensive README files for all directories
- Coding standards and best practices documentation
- Architectural decision records (ADRs)

### Phase 2: Testing Infrastructure (Planned)
- Unit and integration test implementation
- End-to-end testing setup
- Visual regression testing
- Automated testing in CI/CD pipeline

### Phase 3: Performance & Monitoring (Planned)
- Performance monitoring implementation
- Analytics and user behavior tracking
- Error tracking and reporting
- Optimization and caching strategies

### Phase 4: Backend Integration (Planned)
- Supabase authentication implementation
- Database schema design and migration
- Real-time features and subscriptions
- API development and integration

### Phase 5: Advanced Features (Planned)
- Advanced search and filtering
- Real-time messaging and notifications
- Document management and collaboration
- Mobile app development

## Technical Debt & Maintenance

### Current Technical Debt
- Mock data used throughout application
- Authentication system not implemented
- No automated testing coverage
- Performance monitoring not implemented

### Maintenance Priorities
1. Implement comprehensive testing
2. Add performance monitoring
3. Optimize bundle sizes and loading
4. Enhance error handling and logging
5. Improve accessibility compliance

## Development Environment

### Prerequisites
- Node.js 18+ with npm/yarn
- Modern browser with ES2020+ support
- Git for version control

### Development Commands
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Code Quality Tools
- **ESLint**: Code linting and consistency
- **Prettier**: Code formatting
- **TypeScript**: Type checking and safety
- **Husky**: Pre-commit hooks (planned)

This documentation provides a comprehensive overview of the Diligince.ai codebase architecture, design decisions, and development standards. The codebase is well-structured for scalability and maintainability, with clear separation of concerns and established patterns for future development.
