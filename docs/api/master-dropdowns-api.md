# Master Dropdowns API Documentation

## Overview

This document defines the complete API specification for the Master Dropdowns system, enabling dynamic multi-select searchable dropdowns for signup forms and other areas of the application.

**Use Cases:**
- Professional signup: Multi-select "Area of Expertise"
- Vendor signup: Multi-select "Specialization" (varies by vendor type)
- Admin panel: CRUD operations for dropdown options
- Future: Industry types, categories, etc.

---

## MongoDB Collection Schema

### Collection: `master_dropdowns`

```json
{
  "_id": "ObjectId",
  "id": "string (UUID - e.g., 'opt_001')",
  "name": "string (Display Name - e.g., 'Mechanical Engineering')",
  "value": "string (Unique Slug - e.g., 'mechanical-engineering')",
  "module": "enum ['expert', 'serviceVendor', 'productVendor', 'logisticsVendor', 'industry']",
  "category": "string (e.g., 'expertise', 'specialization', 'industryType')",
  "parentCategory": "string | null (for dependent dropdowns - e.g., vendor category)",
  "description": "string | null (optional help text)",
  "isActive": "boolean (default: true)",
  "sortOrder": "number (for custom ordering, default: 0)",
  "metadata": "object | null (for additional properties)",
  "createdAt": "Date",
  "updatedAt": "Date",
  "createdBy": "ObjectId | null (admin user who created)"
}
```

### Indexes

```javascript
// Compound indexes for efficient querying
db.master_dropdowns.createIndex({ module: 1, category: 1, isActive: 1 });
db.master_dropdowns.createIndex({ value: 1, module: 1, category: 1 }, { unique: true });
db.master_dropdowns.createIndex({ name: "text" }); // For search functionality
```

### Example Documents

```json
// Expert expertise options
{
  "id": "opt_exp_001",
  "name": "Mechanical Engineering",
  "value": "mechanical-engineering",
  "module": "expert",
  "category": "expertise",
  "parentCategory": null,
  "description": "Design and manufacturing of mechanical systems",
  "isActive": true,
  "sortOrder": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}

// Service Vendor specialization
{
  "id": "opt_sv_001",
  "name": "Equipment Maintenance",
  "value": "equipment-maintenance",
  "module": "serviceVendor",
  "category": "specialization",
  "parentCategory": "maintenance-services",
  "description": "Preventive and corrective maintenance services",
  "isActive": true,
  "sortOrder": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}

// Product Vendor specialization
{
  "id": "opt_pv_001",
  "name": "Industrial Equipment",
  "value": "industrial-equipment",
  "module": "productVendor",
  "category": "specialization",
  "parentCategory": null,
  "isActive": true,
  "sortOrder": 0
}

// Logistics Vendor specialization
{
  "id": "opt_lv_001",
  "name": "Heavy Equipment Transport",
  "value": "heavy-equipment-transport",
  "module": "logisticsVendor",
  "category": "specialization",
  "parentCategory": null,
  "isActive": true,
  "sortOrder": 0
}
```

---

## API Endpoints

### 1. Public Endpoints (No Authentication Required)

These endpoints are used by signup forms and don't require authentication.

---

#### GET `/api/v1/public/dropdown-options`

Fetch dropdown options for a specific module and category.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `module` | string | Yes | `expert`, `serviceVendor`, `productVendor`, `logisticsVendor`, `industry` |
| `category` | string | Yes | `expertise`, `specialization`, `industryType` |
| `parentCategory` | string | No | Filter by parent category (for dependent dropdowns) |
| `search` | string | No | Search term for filtering by name |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "options": [
      {
        "id": "opt_exp_001",
        "label": "Automation & Controls",
        "value": "automation-controls",
        "description": "Industrial automation and control systems"
      },
      {
        "id": "opt_exp_002",
        "label": "Chemical Engineering",
        "value": "chemical-engineering",
        "description": "Chemical process design and optimization"
      },
      {
        "id": "opt_exp_003",
        "label": "Electrical Engineering",
        "value": "electrical-engineering",
        "description": "Power systems and electrical installations"
      }
    ],
    "total": 20
  },
  "message": "Options fetched successfully"
}
```

**Notes:**
- Results are sorted alphabetically by `name` (A-Z)
- Only returns options where `isActive: true`
- No authentication required (public endpoint)

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Invalid module or category parameter",
  "errors": [
    { "field": "module", "message": "Module must be one of: expert, serviceVendor, productVendor, logisticsVendor, industry" }
  ]
}
```

---

### 2. Admin Endpoints (Authentication Required)

These endpoints are used by the admin panel to manage dropdown options.

**Required Headers:**
```
Authorization: Bearer <admin_access_token>
Content-Type: application/json
```

**Required Permission:** `admin-master-data` module with appropriate action (read/write/edit/delete)

---

#### GET `/api/v1/admin/dropdown-options`

List all dropdown options with filtering and pagination.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `module` | string | No | Filter by module |
| `category` | string | No | Filter by category |
| `isActive` | boolean | No | Filter by active status |
| `search` | string | No | Search by name |
| `sortBy` | string | No | Sort field (default: 'name') |
| `sortOrder` | string | No | 'asc' or 'desc' (default: 'asc') |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "options": [
      {
        "id": "opt_exp_001",
        "name": "Mechanical Engineering",
        "value": "mechanical-engineering",
        "module": "expert",
        "category": "expertise",
        "parentCategory": null,
        "description": "Design and manufacturing of mechanical systems",
        "isActive": true,
        "sortOrder": 0,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "createdBy": {
          "id": "admin_001",
          "name": "System Admin"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 95,
      "itemsPerPage": 20
    },
    "statistics": {
      "total": 95,
      "active": 90,
      "inactive": 5,
      "byModule": {
        "expert": 20,
        "serviceVendor": 25,
        "productVendor": 20,
        "logisticsVendor": 15,
        "industry": 15
      }
    }
  },
  "message": "Options fetched successfully"
}
```

---

#### GET `/api/v1/admin/dropdown-options/:id`

Get a single dropdown option by ID.

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "opt_exp_001",
    "name": "Mechanical Engineering",
    "value": "mechanical-engineering",
    "module": "expert",
    "category": "expertise",
    "parentCategory": null,
    "description": "Design and manufacturing of mechanical systems",
    "isActive": true,
    "sortOrder": 0,
    "metadata": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "createdBy": {
      "id": "admin_001",
      "name": "System Admin"
    }
  },
  "message": "Option fetched successfully"
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Dropdown option not found"
}
```

---

#### POST `/api/v1/admin/dropdown-options`

Create a new dropdown option.

**Request Body:**

```json
{
  "name": "Robotics Engineering",
  "value": "robotics-engineering",
  "module": "expert",
  "category": "expertise",
  "parentCategory": null,
  "description": "Design and programming of robotic systems",
  "isActive": true,
  "sortOrder": 0,
  "metadata": null
}
```

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `name` | Required, string, 2-100 characters, trimmed |
| `value` | Required, string, 2-100 characters, lowercase, alphanumeric with hyphens only, unique per module+category |
| `module` | Required, enum: `expert`, `serviceVendor`, `productVendor`, `logisticsVendor`, `industry` |
| `category` | Required, string, 2-50 characters |
| `parentCategory` | Optional, string or null |
| `description` | Optional, string, max 500 characters |
| `isActive` | Optional, boolean, default: true |
| `sortOrder` | Optional, number, default: 0 |
| `metadata` | Optional, object or null |

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "opt_exp_021",
    "name": "Robotics Engineering",
    "value": "robotics-engineering",
    "module": "expert",
    "category": "expertise",
    "parentCategory": null,
    "description": "Design and programming of robotic systems",
    "isActive": true,
    "sortOrder": 0,
    "metadata": null,
    "createdAt": "2024-06-15T10:30:00.000Z",
    "updatedAt": "2024-06-15T10:30:00.000Z",
    "createdBy": {
      "id": "admin_001",
      "name": "System Admin"
    }
  },
  "message": "Dropdown option created successfully"
}
```

**Error Response (409 Conflict - Duplicate):**

```json
{
  "success": false,
  "message": "Dropdown option with this value already exists for this module and category",
  "errors": [
    { "field": "value", "message": "Value 'robotics-engineering' already exists for module 'expert' and category 'expertise'" }
  ]
}
```

---

#### PATCH `/api/v1/admin/dropdown-options/:id`

Update an existing dropdown option.

**Request Body (partial update allowed):**

```json
{
  "name": "Robotics & Automation Engineering",
  "description": "Advanced robotics and automation systems",
  "isActive": true,
  "sortOrder": 5
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "opt_exp_021",
    "name": "Robotics & Automation Engineering",
    "value": "robotics-engineering",
    "module": "expert",
    "category": "expertise",
    "parentCategory": null,
    "description": "Advanced robotics and automation systems",
    "isActive": true,
    "sortOrder": 5,
    "metadata": null,
    "createdAt": "2024-06-15T10:30:00.000Z",
    "updatedAt": "2024-06-15T11:00:00.000Z"
  },
  "message": "Dropdown option updated successfully"
}
```

---

#### DELETE `/api/v1/admin/dropdown-options/:id`

Soft delete a dropdown option (sets `isActive: false`).

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hard` | boolean | No | If true, permanently deletes the option |

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Dropdown option deactivated successfully"
}
```

**Hard Delete Response (200 OK):**

```json
{
  "success": true,
  "message": "Dropdown option permanently deleted"
}
```

---

#### POST `/api/v1/admin/dropdown-options/bulk`

Bulk create dropdown options (for seeding or import).

**Request Body:**

```json
{
  "options": [
    {
      "name": "Aerospace Engineering",
      "value": "aerospace-engineering",
      "module": "expert",
      "category": "expertise"
    },
    {
      "name": "Biomedical Engineering",
      "value": "biomedical-engineering",
      "module": "expert",
      "category": "expertise"
    }
  ],
  "skipDuplicates": true
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "created": 2,
    "skipped": 0,
    "errors": []
  },
  "message": "Bulk import completed"
}
```

---

## Frontend Implementation

### 1. Type Definitions

**File:** `src/services/modules/dropdowns/dropdown.types.ts`

```typescript
export interface DropdownOption {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface DropdownOptionsResponse {
  success: boolean;
  data: {
    options: DropdownOption[];
    total: number;
  };
  message: string;
}

export type DropdownModule = 'expert' | 'serviceVendor' | 'productVendor' | 'logisticsVendor' | 'industry';
export type DropdownCategory = 'expertise' | 'specialization' | 'industryType';

export interface GetDropdownOptionsParams {
  module: DropdownModule;
  category: DropdownCategory;
  parentCategory?: string;
  search?: string;
}
```

### 2. Service Layer

**File:** `src/services/modules/dropdowns/dropdown.service.ts`

```typescript
import { api } from '@/services/core/api.service';
import { DropdownOption, GetDropdownOptionsParams } from './dropdown.types';

export const dropdownService = {
  /**
   * Fetch dropdown options for signup forms (public endpoint)
   */
  async getOptions(params: GetDropdownOptionsParams): Promise<DropdownOption[]> {
    const queryParams = new URLSearchParams({
      module: params.module,
      category: params.category,
    });
    
    if (params.parentCategory) {
      queryParams.append('parentCategory', params.parentCategory);
    }
    if (params.search) {
      queryParams.append('search', params.search);
    }

    const response = await api.get<any>(`/public/dropdown-options?${queryParams.toString()}`);
    return response.data?.options || [];
  },
};

export default dropdownService;
```

### 3. React Query Hook

**File:** `src/hooks/useDropdownOptions.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { dropdownService } from '@/services/modules/dropdowns/dropdown.service';
import { DropdownModule, DropdownCategory } from '@/services/modules/dropdowns/dropdown.types';

export const useDropdownOptions = (
  module: DropdownModule,
  category: DropdownCategory,
  options?: {
    parentCategory?: string;
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ['dropdown-options', module, category, options?.parentCategory],
    queryFn: () => dropdownService.getOptions({
      module,
      category,
      parentCategory: options?.parentCategory,
    }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    enabled: options?.enabled !== false,
  });
};
```

### 4. Form Integration Examples

#### ProfessionalForm.tsx Updates

```typescript
// Schema change
const formSchema = z.object({
  // ... other fields
  expertise: z.array(z.string()).min(1, { message: "Please select at least one area of expertise" }),
  // ... other fields
});

// In component
const { data: expertiseOptions = [], isLoading: loadingExpertise } = useDropdownOptions('expert', 'expertise');

// Form field
<FormField
  control={form.control}
  name="expertise"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Area of Expertise <span className="text-destructive">*</span></FormLabel>
      <MultiSelect
        options={expertiseOptions.map(opt => ({ label: opt.label, value: opt.value }))}
        value={field.value}
        onChange={field.onChange}
        placeholder="Select your areas of expertise..."
        isLoading={loadingExpertise}
        searchable
      />
      <FormMessage />
    </FormItem>
  )}
/>
```

#### VendorFormEnhanced.tsx Updates

```typescript
// Schema change
const formSchema = z.object({
  // ... other fields
  specialization: z.array(z.string()).min(1, { message: "Please select at least one specialization" }),
  // ... other fields
});

// In component - dynamic based on vendor category
const getVendorModule = (category: string): DropdownModule => {
  switch (category) {
    case 'Service Provider': return 'serviceVendor';
    case 'Product Supplier': return 'productVendor';
    case 'Logistics Provider': return 'logisticsVendor';
    default: return 'serviceVendor';
  }
};

const vendorModule = getVendorModule(selectedCategory);
const { data: specializationOptions = [], isLoading } = useDropdownOptions(
  vendorModule,
  'specialization',
  { enabled: !!selectedCategory }
);
```

---

## Backend Implementation Notes

### 1. Users Collection Schema Update

```javascript
// Migration: Update users collection for professionals
db.users.updateMany(
  { userType: 'professional', expertise: { $type: 'string' } },
  [{ $set: { expertise: { $cond: [{ $eq: ['$expertise', ''] }, [], ['$expertise']] } } }]
);

// Schema validation update
{
  expertise: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v);
      },
      message: 'Expertise must be an array'
    }
  }
}
```

### 2. Vendors Collection Schema Update

```javascript
// Migration: Update vendors collection
db.vendors.updateMany(
  { specialization: { $type: 'string' } },
  [{ $set: { specialization: { $cond: [{ $eq: ['$specialization', ''] }, [], ['$specialization']] } } }]
);

// Schema validation update
{
  specialization: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v);
      },
      message: 'Specialization must be an array'
    }
  }
}
```

### 3. Registration Endpoint Update

**File:** `routes/auth.routes.js` (or equivalent)

Update `/api/v1/auth/register` to accept:

```javascript
// For Professional registration
{
  // ... existing fields
  expertise: ['mechanical-engineering', 'automation-controls'], // Array of values
}

// For Vendor registration
{
  // ... existing fields
  vendorCategory: 'Service Provider',
  specialization: ['equipment-maintenance', 'industrial-cleaning'], // Array of values
}
```

### 4. Seed Data

**File:** `seeders/master-dropdowns.seeder.js`

```javascript
const expertExpertiseOptions = [
  { name: 'Automation & Controls', value: 'automation-controls', module: 'expert', category: 'expertise' },
  { name: 'Chemical Engineering', value: 'chemical-engineering', module: 'expert', category: 'expertise' },
  { name: 'Civil Engineering', value: 'civil-engineering', module: 'expert', category: 'expertise' },
  { name: 'Electrical Engineering', value: 'electrical-engineering', module: 'expert', category: 'expertise' },
  { name: 'Environmental Engineering', value: 'environmental-engineering', module: 'expert', category: 'expertise' },
  { name: 'Industrial Engineering', value: 'industrial-engineering', module: 'expert', category: 'expertise' },
  { name: 'Manufacturing Engineering', value: 'manufacturing-engineering', module: 'expert', category: 'expertise' },
  { name: 'Mechanical Engineering', value: 'mechanical-engineering', module: 'expert', category: 'expertise' },
  { name: 'Process Engineering', value: 'process-engineering', module: 'expert', category: 'expertise' },
  { name: 'Project Management', value: 'project-management', module: 'expert', category: 'expertise' },
  { name: 'Quality Assurance', value: 'quality-assurance', module: 'expert', category: 'expertise' },
  { name: 'Safety Engineering', value: 'safety-engineering', module: 'expert', category: 'expertise' },
  { name: 'Structural Engineering', value: 'structural-engineering', module: 'expert', category: 'expertise' },
  { name: 'Supply Chain', value: 'supply-chain', module: 'expert', category: 'expertise' },
  { name: 'Technical Consulting', value: 'technical-consulting', module: 'expert', category: 'expertise' },
];

const serviceVendorSpecializations = [
  { name: 'Equipment Maintenance', value: 'equipment-maintenance', module: 'serviceVendor', category: 'specialization' },
  { name: 'Industrial Cleaning', value: 'industrial-cleaning', module: 'serviceVendor', category: 'specialization' },
  { name: 'Technical Support', value: 'technical-support', module: 'serviceVendor', category: 'specialization' },
  { name: 'Installation Services', value: 'installation-services', module: 'serviceVendor', category: 'specialization' },
  { name: 'Calibration Services', value: 'calibration-services', module: 'serviceVendor', category: 'specialization' },
  { name: 'Repair Services', value: 'repair-services', module: 'serviceVendor', category: 'specialization' },
  { name: 'Inspection Services', value: 'inspection-services', module: 'serviceVendor', category: 'specialization' },
  { name: 'Training Services', value: 'training-services', module: 'serviceVendor', category: 'specialization' },
  { name: 'Consulting Services', value: 'consulting-services', module: 'serviceVendor', category: 'specialization' },
  { name: 'Waste Management', value: 'waste-management', module: 'serviceVendor', category: 'specialization' },
];

const productVendorSpecializations = [
  { name: 'Industrial Equipment', value: 'industrial-equipment', module: 'productVendor', category: 'specialization' },
  { name: 'Safety Equipment', value: 'safety-equipment', module: 'productVendor', category: 'specialization' },
  { name: 'Electrical Components', value: 'electrical-components', module: 'productVendor', category: 'specialization' },
  { name: 'Mechanical Parts', value: 'mechanical-parts', module: 'productVendor', category: 'specialization' },
  { name: 'Raw Materials', value: 'raw-materials', module: 'productVendor', category: 'specialization' },
  { name: 'Chemicals & Lubricants', value: 'chemicals-lubricants', module: 'productVendor', category: 'specialization' },
  { name: 'Tools & Instruments', value: 'tools-instruments', module: 'productVendor', category: 'specialization' },
  { name: 'Packaging Materials', value: 'packaging-materials', module: 'productVendor', category: 'specialization' },
  { name: 'IT Hardware', value: 'it-hardware', module: 'productVendor', category: 'specialization' },
  { name: 'Office Supplies', value: 'office-supplies', module: 'productVendor', category: 'specialization' },
];

const logisticsVendorSpecializations = [
  { name: 'Heavy Equipment Transport', value: 'heavy-equipment-transport', module: 'logisticsVendor', category: 'specialization' },
  { name: 'Warehousing', value: 'warehousing', module: 'logisticsVendor', category: 'specialization' },
  { name: 'Cold Chain Logistics', value: 'cold-chain-logistics', module: 'logisticsVendor', category: 'specialization' },
  { name: 'Hazmat Transport', value: 'hazmat-transport', module: 'logisticsVendor', category: 'specialization' },
  { name: 'Express Delivery', value: 'express-delivery', module: 'logisticsVendor', category: 'specialization' },
  { name: 'Freight Forwarding', value: 'freight-forwarding', module: 'logisticsVendor', category: 'specialization' },
  { name: 'Last Mile Delivery', value: 'last-mile-delivery', module: 'logisticsVendor', category: 'specialization' },
  { name: 'Container Services', value: 'container-services', module: 'logisticsVendor', category: 'specialization' },
  { name: 'Bulk Transport', value: 'bulk-transport', module: 'logisticsVendor', category: 'specialization' },
  { name: 'Customs Brokerage', value: 'customs-brokerage', module: 'logisticsVendor', category: 'specialization' },
];
```

---

## Implementation Checklist

### Backend Tasks

| Task | Effort | Priority |
|------|--------|----------|
| Create `master_dropdowns` collection with indexes | 2h | High |
| Implement `GET /api/v1/public/dropdown-options` endpoint | 2h | High |
| Implement admin CRUD endpoints | 4h | Medium |
| Create seeder with initial dropdown options | 2h | High |
| Update users collection schema (expertise → array) | 1h | High |
| Update vendors collection schema (specialization → array) | 1h | High |
| Update `/api/v1/auth/register` to accept arrays | 2h | High |
| Write migration script for existing data | 2h | Medium |
| **Total Backend** | **16h** | |

### Frontend Tasks

| Task | Effort | Priority |
|------|--------|----------|
| Create `dropdown.service.ts` and `dropdown.types.ts` | 1h | High |
| Create `useDropdownOptions.ts` hook | 1h | High |
| Move/enhance MultiSelect component to `src/components/ui/` | 2h | High |
| Update `ProfessionalForm.tsx` with MultiSelect + API | 2h | High |
| Update `VendorFormEnhanced.tsx` with MultiSelect + API | 2h | High |
| Update type definitions (`professional.ts`, `vendor.ts`, `auth.types.ts`) | 1h | Medium |
| Update any other components using expertise/specialization | 2h | Medium |
| **Total Frontend** | **11h** | |

### Testing Tasks

| Task | Effort |
|------|--------|
| Test signup forms with new multi-select | 2h |
| Test API endpoint responses | 1h |
| Test data migration | 1h |
| E2E testing | 2h |
| **Total Testing** | **6h** |

---

## Error Handling

### API Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_MODULE` | 400 | Invalid module parameter |
| `INVALID_CATEGORY` | 400 | Invalid category parameter |
| `OPTION_NOT_FOUND` | 404 | Dropdown option not found |
| `DUPLICATE_VALUE` | 409 | Value already exists for module+category |
| `VALIDATION_ERROR` | 422 | Request body validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-16 | Initial specification |
| 1.1.0 | 2024-12-16 | Added Backend Requirements from Frontend section |

---

## Backend Requirements from Frontend (CRITICAL)

This section documents exactly what the frontend expects from the backend API. **Frontend implementation is complete** - backend team must implement these endpoints to match.

### ✅ Frontend Implementation Status

| Component | Status | Location |
|-----------|--------|----------|
| Service Layer | ✅ Complete | `src/services/modules/dropdowns/dropdown.service.ts` |
| Type Definitions | ✅ Complete | `src/services/modules/dropdowns/dropdown.types.ts` |
| React Query Hook | ✅ Complete | `src/hooks/useDropdownOptions.ts` |
| MultiSelect Component | ✅ Complete | `src/components/ui/multi-select.tsx` |
| ProfessionalForm | ✅ Updated | `src/components/signup/ProfessionalForm.tsx` |
| VendorFormEnhanced | ✅ Updated | `src/components/signup/VendorFormEnhanced.tsx` |
| Type: ProfessionalProfile | ✅ Updated | `src/types/professional.ts` (expertise: string[]) |
| Type: RegisterRequest | ✅ Updated | `src/services/modules/auth/auth.types.ts` |

---

### 1. Public Dropdown Options Endpoint (REQUIRED)

**Endpoint:** `GET /api/v1/public/dropdown-options`

**Frontend Calls This With:**

```
GET /api/v1/public/dropdown-options?module=expert&category=expertise
GET /api/v1/public/dropdown-options?module=serviceVendor&category=specialization
GET /api/v1/public/dropdown-options?module=productVendor&category=specialization
GET /api/v1/public/dropdown-options?module=logisticsVendor&category=specialization
```

**Expected Response Structure (MUST MATCH EXACTLY):**

```json
{
  "success": true,
  "data": {
    "options": [
      {
        "id": "opt_001",
        "label": "Mechanical Engineering",
        "value": "mechanical-engineering",
        "description": "Optional description"
      },
      {
        "id": "opt_002",
        "label": "Electrical Engineering", 
        "value": "electrical-engineering"
      }
    ],
    "total": 15
  },
  "message": "Options fetched successfully"
}
```

**Critical Requirements:**

| Requirement | Details |
|-------------|---------|
| Response field `label` | Frontend displays this in dropdown (NOT `name`) |
| Response field `value` | Frontend sends this in form submission |
| Sort Order | MUST be sorted alphabetically by `label` (A-Z) |
| Active Filter | MUST only return `isActive: true` options |
| No Auth | This is a PUBLIC endpoint - no token required |
| Empty Array | Return `{ options: [], total: 0 }` if no matches |

---

### 2. Registration Endpoint Update (REQUIRED)

**Endpoint:** `POST /api/v1/auth/register`

**Frontend Now Sends Arrays:**

#### Professional Registration Payload:

```json
{
  "email": "professional@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210",
  "userType": "Professional",
  "firstName": "Rajesh",
  "lastName": "Kumar",
  "expertise": ["mechanical-engineering", "process-engineering", "quality-assurance"],
  "termsAccepted": true,
  "privacyAccepted": true
}
```

#### Vendor Registration Payload:

```json
{
  "email": "vendor@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210",
  "userType": "Vendor",
  "userSubType": "ServiceVendor",
  "firstName": "Priya",
  "lastName": "Sharma",
  "businessName": "Sharma Industrial Services",
  "vendorCategory": "Service Vendor",
  "specialization": ["equipment-maintenance", "calibration-services", "repair-services"],
  "termsAccepted": true,
  "privacyAccepted": true
}
```

**Backend Must:**

1. Accept `expertise` as `string[]` for Professional users
2. Accept `specialization` as `string[]` for Vendor users
3. Store these as arrays in the database
4. Validate each value exists in `master_dropdowns` collection (optional but recommended)

---

### 3. Database Schema Updates (REQUIRED)

#### Users Collection (Professionals):

```javascript
// BEFORE (old schema)
{
  expertise: "Mechanical Engineering"  // Single string
}

// AFTER (new schema)
{
  expertise: ["mechanical-engineering", "process-engineering"]  // Array of values
}
```

#### Vendors Collection:

```javascript
// BEFORE (old schema)
{
  specialization: "Equipment Maintenance"  // Single string
}

// AFTER (new schema)
{
  specialization: ["equipment-maintenance", "calibration-services"]  // Array of values
}
```

---

### 4. Data Migration Script (REQUIRED)

**Run this migration to convert existing string fields to arrays:**

```javascript
// Migration for users collection (professionals)
db.users.updateMany(
  { 
    userType: 'Professional',
    expertise: { $type: 'string' }
  },
  [
    {
      $set: {
        expertise: {
          $cond: {
            if: { $eq: ['$expertise', ''] },
            then: [],
            else: ['$expertise']
          }
        }
      }
    }
  ]
);

// Migration for vendors collection
db.vendors.updateMany(
  { 
    specialization: { $type: 'string' }
  },
  [
    {
      $set: {
        specialization: {
          $cond: {
            if: { $eq: ['$specialization', ''] },
            then: [],
            else: ['$specialization']
          }
        }
      }
    }
  ]
);
```

---

### 5. Seed Data (REQUIRED)

Backend must seed the `master_dropdowns` collection with initial options.

**Minimum Required Data:**

| Module | Category | Minimum Options |
|--------|----------|-----------------|
| `expert` | `expertise` | 15-20 options |
| `serviceVendor` | `specialization` | 10-15 options |
| `productVendor` | `specialization` | 10-15 options |
| `logisticsVendor` | `specialization` | 10-15 options |

**Sample Seed Document:**

```javascript
{
  id: "opt_exp_001",
  name: "Mechanical Engineering",  // Store as 'name' in DB
  value: "mechanical-engineering",
  module: "expert",
  category: "expertise",
  description: "Design and manufacturing of mechanical systems",
  isActive: true,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}
```

**NOTE:** Store as `name` in DB, but return as `label` in API response.

---

### 6. Testing Checklist for Backend

| Test Case | Expected Result |
|-----------|-----------------|
| `GET /api/v1/public/dropdown-options?module=expert&category=expertise` | Returns array of expertise options sorted A-Z |
| `GET /api/v1/public/dropdown-options?module=serviceVendor&category=specialization` | Returns service vendor specializations |
| `GET /api/v1/public/dropdown-options?module=productVendor&category=specialization` | Returns product vendor specializations |
| `GET /api/v1/public/dropdown-options?module=logisticsVendor&category=specialization` | Returns logistics vendor specializations |
| `GET /api/v1/public/dropdown-options?module=invalid&category=expertise` | Returns 400 error with validation message |
| `POST /api/v1/auth/register` with `expertise: ["value1", "value2"]` | Creates professional with array stored |
| `POST /api/v1/auth/register` with `specialization: ["value1"]` | Creates vendor with array stored |

---

### 7. Implementation Priority Order

```
┌──────────────────────────────────────────────────────────────────┐
│ STEP 1: Create master_dropdowns collection + indexes (2h)        │
│ - Create collection with proper schema                           │
│ - Add compound indexes for efficient querying                    │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 2: Seed initial dropdown options (2h)                       │
│ - Add 15-20 expert expertise options                             │
│ - Add 10-15 specializations per vendor type                      │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 3: Implement GET /api/v1/public/dropdown-options (2h)       │
│ - Query by module + category                                     │
│ - Sort alphabetically by name/label                              │
│ - Return only isActive: true                                     │
│ - Map 'name' → 'label' in response                               │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 4: Update registration endpoint (2h)                        │
│ - Accept expertise as string[]                                   │
│ - Accept specialization as string[]                              │
│ - Update Joi/validation schema                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 5: Run data migration (1h)                                  │
│ - Convert existing string expertise to array                     │
│ - Convert existing string specialization to array                │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 6: Update schema validators (1h)                            │
│ - Update Mongoose/MongoDB validators                             │
│ - Ensure arrays are stored correctly                             │
└──────────────────────────────────────────────────────────────────┘
```

**Total Backend Effort: ~10 hours**

---

### 8. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Frontend shows "Loading options..." forever | Check API returns proper response structure with `success: true` |
| Dropdown shows empty | Verify `data.options` is an array, not null |
| Options not sorted | Add `.sort({ name: 1 })` to MongoDB query |
| 404 error on endpoint | Ensure route is registered under `/api/v1/public/` |
| Registration fails with array | Update Joi schema to accept `expertise: Joi.array().items(Joi.string())` |

---

### 9. Response Field Mapping

**Important:** The database stores `name` but the API must return `label`:

```javascript
// MongoDB Document
{
  name: "Mechanical Engineering",
  value: "mechanical-engineering"
}

// API Response (frontend expects this)
{
  label: "Mechanical Engineering",  // Mapped from 'name'
  value: "mechanical-engineering"
}
```

**Controller Code Example:**

```javascript
const options = await MasterDropdown.find({ 
  module, 
  category, 
  isActive: true 
}).sort({ name: 1 });

const mappedOptions = options.map(opt => ({
  id: opt.id,
  label: opt.name,  // Map name → label
  value: opt.value,
  description: opt.description
}));

res.json({
  success: true,
  data: {
    options: mappedOptions,
    total: mappedOptions.length
  },
  message: 'Options fetched successfully'
});
```
