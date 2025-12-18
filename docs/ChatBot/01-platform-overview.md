# Platform Overview

## What is Diligince.ai?

Diligince.ai is a comprehensive B2B procurement platform developed by Thinkvate Solutions. It streamlines the entire procurement lifecycle from requirement creation to vendor payment, providing a digital marketplace where industries can find, evaluate, and work with vendors and professionals.

## Who Uses Diligince.ai?

### Industry Users (Buyers)
Companies and organizations that need to procure:
- Professional services (consulting, legal, accounting)
- Expert services (engineering, architecture, design)
- Product supplies and equipment
- Specialized solutions

### Vendors
Service providers and suppliers who:
- Respond to procurement requirements
- Submit quotations
- Fulfill purchase orders
- Deliver services/products

### Professionals
Individual experts who:
- Offer specialized skills
- Work on project-based assignments
- Provide consulting services

## Key Features

### For Industry Users
- **Requirement Management**: Create detailed procurement requirements with multi-step wizard
- **Vendor Discovery**: Find and evaluate vendors through Diligince HUB
- **Quotation Management**: Receive, compare, and approve vendor quotes
- **Purchase Order Tracking**: Issue and track POs with milestone management
- **Analytics & Reporting**: Get insights into procurement performance
- **Team Collaboration**: Manage team members with role-based access

### For Vendors
- **Opportunity Discovery**: Find relevant procurement opportunities
- **Quote Submission**: Submit competitive quotations
- **Order Management**: Receive and fulfill purchase orders
- **Payment Tracking**: Track payment milestones

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DILIGINCE.AI PLATFORM                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   INDUSTRY   │    │   VENDORS    │    │ PROFESSIONALS │  │
│  │   (Buyers)   │◄──►│  (Sellers)   │◄──►│   (Experts)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                   │           │
│         ▼                   ▼                   ▼           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PROCUREMENT WORKFLOW                    │   │
│  │  Requirements → Quotations → POs → Delivery → Pay   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Procurement Lifecycle

### Step 1: Requirement Creation
Industry users create detailed procurement requirements specifying:
- What they need (products/services)
- Technical specifications
- Budget range
- Timeline
- Evaluation criteria

### Step 2: Vendor Response
Vendors receive requirements and submit quotations with:
- Pricing details
- Delivery timeline
- Technical proposals
- Supporting documents

### Step 3: Evaluation & Approval
Industry users:
- Compare multiple quotations
- Evaluate based on criteria
- Request clarifications
- Approve the best quote

### Step 4: Purchase Order
Upon approval:
- PO is generated automatically
- Terms and milestones defined
- Vendor accepts/negotiates
- Work begins

### Step 5: Delivery & Payment
- Track deliverables and milestones
- Verify completion
- Process payments per milestones
- Close the order

## User Roles in Industry

| Role | Access Level | Responsibilities |
|------|--------------|------------------|
| Industry Admin | Full Access | Manage company settings, team, roles, all features |
| Procurement Manager | High Access | Create requirements, approve quotes, issue POs |
| Finance Manager | Financial Access | Budget oversight, payment approvals |
| Department Viewer | Limited Access | View requirements and their status |

## Security Features

- **Role-Based Access Control (RBAC)**: Granular permissions per module
- **Two-Factor Authentication**: Optional 2FA for enhanced security
- **Approval Workflows**: Multi-level approval for requirements and payments
- **Audit Trails**: Complete activity logging
- **Data Encryption**: Secure data transmission and storage

## Common Questions

**Q: Who can access the Industry platform?**
A: Only registered company members with verified email and phone can access the platform. The Industry Admin invites team members and assigns roles.

**Q: Can I use Diligince.ai as both buyer and vendor?**
A: Yes, but you need separate accounts. A company can register as Industry (buyer) and also as Vendor (seller) with different login credentials.

**Q: Is there a mobile app?**
A: The platform is fully responsive and works on mobile browsers. Native mobile apps are planned for future releases.

**Q: What industries does Diligince.ai support?**
A: The platform supports all industries requiring B2B procurement, including manufacturing, construction, IT, healthcare, retail, and more.

## Related Documentation

- [Getting Started Guide](./02-getting-started.md)
- [Dashboard Module](./03-dashboard-module.md)
- [FAQ](./13-faq.md)
