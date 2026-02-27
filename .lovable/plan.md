

# Service Vendor: Certifications & Portfolio Pages + Hide Services Menu

## Problem
1. Certifications (`/dashboard/service-vendor-profile/certifications`) and Projects & Portfolio (`/dashboard/service-vendor-profile/portfolio`) pages are empty/blank because their routes are missing from `App.tsx`
2. The "Services" sidebar menu item should be hidden since its features are covered under Certifications and Projects & Portfolio
3. Backend API documentation is needed for these modules

## Solution

### 1. Add Missing Routes to App.tsx

Add two routes after the existing `service-vendor-profile/payment` route (around line 578):

```
service-vendor-profile/certifications -> VendorCertifications
service-vendor-profile/portfolio -> VendorProjectsPortfolio
```

Both components (`VendorCertifications.tsx` - 789 lines, `VendorProjectsPortfolio.tsx` - 943 lines) are already built with corporate navy theme, proper UI, and full functionality. They just need route registration.

### 2. Hide Services Menu Item

**File:** `src/config/menuConfig.ts` (lines 453-468)

Comment out or remove the "Services" menu entry from the `service-vendor` menu configuration. This hides:
- Service Catalog (`/dashboard/service-vendor-services/catalog`)
- Skills & Expertise (`/dashboard/service-vendor-services/skills`)

### 3. Update Chatbot Documentation

**File:** `docs/ChatBot/users/service-vendor/08-settings.md`

Add detailed sections for Certifications and Projects & Portfolio pages with:
- Page descriptions and routes
- How-To guides
- Common Q&A with clickable links

### 4. Create Backend API Specification

**File:** `docs/api/vendor/vendor-certifications-portfolio-api.md`

Document the following endpoints:

**Certifications Endpoints:**
- `GET /api/v1/vendors/certifications` - List all certifications
- `POST /api/v1/vendors/certifications` - Add a certification
- `PUT /api/v1/vendors/certifications/:id` - Update a certification
- `DELETE /api/v1/vendors/certifications/:id` - Delete a certification
- `POST /api/v1/vendors/certifications/:id/document` - Upload certificate document
- `DELETE /api/v1/vendors/certifications/:id/document` - Delete certificate document

**Portfolio/Projects Endpoints:**
- `GET /api/v1/vendors/portfolio/projects` - List all projects
- `POST /api/v1/vendors/portfolio/projects` - Add a project
- `PUT /api/v1/vendors/portfolio/projects/:id` - Update a project
- `DELETE /api/v1/vendors/portfolio/projects/:id` - Delete a project
- `POST /api/v1/vendors/portfolio/projects/:id/image` - Upload project image
- `DELETE /api/v1/vendors/portfolio/projects/:id/image` - Delete project image

### 5. Create Frontend API Service Files

**File:** `src/services/modules/vendor-certifications/vendor-certifications.routes.ts`
**File:** `src/services/modules/vendor-certifications/vendor-certifications.service.ts`
**File:** `src/services/modules/vendor-certifications/vendor-certifications.types.ts`
**File:** `src/services/modules/vendor-certifications/index.ts`

**File:** `src/services/modules/vendor-portfolio/vendor-portfolio.routes.ts`
**File:** `src/services/modules/vendor-portfolio/vendor-portfolio.service.ts`
**File:** `src/services/modules/vendor-portfolio/vendor-portfolio.types.ts`
**File:** `src/services/modules/vendor-portfolio/index.ts`

These will follow the same pattern as the existing `vendor-profile` service module with proper TypeScript types, route definitions, and service class methods.

## Files Summary

| # | File | Action |
|---|------|--------|
| 1 | `src/App.tsx` | Add 2 routes for certifications and portfolio |
| 2 | `src/config/menuConfig.ts` | Remove/hide "Services" menu item |
| 3 | `src/services/modules/vendor-certifications/vendor-certifications.routes.ts` | Create - API route definitions |
| 4 | `src/services/modules/vendor-certifications/vendor-certifications.types.ts` | Create - TypeScript types |
| 5 | `src/services/modules/vendor-certifications/vendor-certifications.service.ts` | Create - API service class |
| 6 | `src/services/modules/vendor-certifications/index.ts` | Create - barrel export |
| 7 | `src/services/modules/vendor-portfolio/vendor-portfolio.routes.ts` | Create - API route definitions |
| 8 | `src/services/modules/vendor-portfolio/vendor-portfolio.types.ts` | Create - TypeScript types |
| 9 | `src/services/modules/vendor-portfolio/vendor-portfolio.service.ts` | Create - API service class |
| 10 | `src/services/modules/vendor-portfolio/index.ts` | Create - barrel export |
| 11 | `docs/api/vendor/vendor-certifications-portfolio-api.md` | Create - Backend API spec document |
| 12 | `docs/ChatBot/users/service-vendor/08-settings.md` | Update - Add certifications and portfolio details |

