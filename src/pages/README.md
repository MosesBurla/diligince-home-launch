
# Pages Directory

## Overview
This directory contains all main application pages and routes. Pages represent complete views that users navigate to and are organized by user type and functionality.

## Structure

### Public Pages
Marketing and informational pages accessible to all users:

- `Index.tsx` - Homepage with hero section and key features
- `About.tsx` - Company information and mission
- `Contact.tsx` - Contact information and form
- `Blog.tsx` - Blog posts and content
- `Careers.tsx` - Career opportunities
- `Pricing.tsx` - Service pricing and plans
- `Privacy.tsx` - Privacy policy
- `Terms.tsx` - Terms of service
- `NotFound.tsx` - 404 error page

### Authentication Pages
User registration and login flows:

- `SignUp.tsx` - Multi-type user registration
- `SignIn.tsx` - User authentication
- `ProfileCompletion.tsx` - Post-registration profile setup

### User Type-Specific Dashboards

#### Industry User Pages
For manufacturing companies and businesses:
- `IndustryDashboard.tsx` - Main dashboard with metrics and quick actions
- `IndustryProfile.tsx` - Company profile management
- `IndustryMessages.tsx` - Communication hub
- `IndustryDocuments.tsx` - Document management
- `IndustryProjectWorkflow.tsx` - Project tracking and workflow management

#### Professional Pages
For expert consultants and professionals:
- `ProfessionalDashboard.tsx` - Professional overview and opportunities
- `ProfessionalProfile.tsx` - Professional profile and skills
- `ProfessionalCalendar.tsx` - Availability and scheduling management
- `ProfessionalOpportunities.tsx` - Job opportunities and applications
- `ProfessionalMessages.tsx` - Client communication

#### Service Vendor Pages
For service providers:
- `ServiceVendorDashboard.tsx` - Service vendor overview
- `ServiceVendorProfile.tsx` - Company profile and capabilities
- `ServiceVendorRFQs.tsx` - RFQ management and responses
- `ServiceVendorServices.tsx` - Service catalog management
- `ServiceVendorProjects.tsx` - Active project tracking
- `ServiceVendorMessages.tsx` - Client communication

#### Product Vendor Pages
For product suppliers:
- `ProductVendorDashboard.tsx` - Product vendor overview
- `ProductVendorProfile.tsx` - Company and product information
- `ProductVendorRFQs.tsx` - Quote requests and responses
- `ProductVendorCatalog.tsx` - Product catalog management
- `ProductVendorOrders.tsx` - Order processing and fulfillment
- `ProductVendorMessages.tsx` - Customer communication

#### Logistics Vendor Pages
For logistics and transportation providers:
- `LogisticsVendorDashboard.tsx` - Logistics overview and metrics
- `LogisticsVendorProfile.tsx` - Fleet and service capabilities
- `LogisticsVendorRequests.tsx` - Transportation request management
- `LogisticsVendorFleet.tsx` - Vehicle and equipment management
- `LogisticsVendorDeliveries.tsx` - Active delivery tracking
- `LogisticsVendorMessages.tsx` - Client communication

### Functional Pages
Core business functionality pages:

- `CreateRequirement.tsx` - Multi-step requirement creation wizard
- `CreatePurchaseOrder.tsx` - Purchase order generation flow
- `WorkCompletionPayment.tsx` - Work verification and payment processing
- `Vendors.tsx` - Vendor directory and discovery
- `Experts.tsx` - Professional directory and search
- `VendorProfile.tsx` - Generic vendor profile viewing

## Page Architecture

### Standard Page Structure
```typescript
import React from "react";
import { Helmet } from "react-helmet";
import UserTypeHeader from "@/components/usertype/UserTypeHeader";

const PageName = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Page Title | Diligince.ai</title>
      </Helmet>
      
      <UserTypeHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-20">
        {/* Page content */}
      </main>
    </div>
  );
};

export default PageName;
```

### Key Patterns

#### Layout Consistency
- Consistent header navigation per user type
- Standardized spacing and container usage
- Responsive design across all pages

#### SEO and Meta
- Helmet integration for page titles and meta tags
- Descriptive titles following pattern: "Page Name | Diligince.ai"

#### Error Handling
- RouteErrorBoundary wrapping in App.tsx
- Proper loading states for data-dependent pages
- User-friendly error messages

#### Navigation Integration
- React Router Link components for internal navigation
- Breadcrumb navigation where appropriate
- Active state indicators in navigation

## Data Flow

### State Management
- Page-level state for local data
- Context providers for shared state across pages
- React Query for server data and caching

### User Type Detection
- Context-based user type detection
- Conditional rendering based on user permissions
- Type-safe navigation between user-specific pages

### Route Protection
- Authentication guards for protected routes
- User type-based access control
- Redirect logic for unauthorized access

## Routing Configuration
All pages are registered in `App.tsx` with:
- Lazy loading for performance optimization
- Error boundary wrapping for fault tolerance
- Suspense fallback for loading states

## Performance Considerations
- Code splitting with React.lazy()
- Optimized bundle loading
- Efficient re-rendering patterns
- Proper cleanup in useEffect hooks

## Contributing Guidelines
1. Follow established naming conventions
2. Implement consistent layout patterns
3. Add proper TypeScript types
4. Include SEO meta tags with Helmet
5. Ensure responsive design
6. Test cross-browser compatibility
7. Add loading and error states
