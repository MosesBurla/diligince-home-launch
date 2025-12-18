# Requirement Multi-Category & Specialization API Documentation

## Overview

This document outlines the backend changes required to support:
1. Multi-category selection in Create Requirement (category is now an array)
2. Combined specialization dropdown fetching options from multiple modules

## Frontend Changes (Implemented)

1. **Type Updates**: 
   - `category` field changed from `string` to `string[]`
   - `specialization` field remains `string[]`

2. **UI Updates**: 
   - CategorySelector now supports multi-select (toggle behavior)
   - Specialization MultiSelect fetches combined options from all selected categories

3. **API Integration**: 
   - New `useSpecializationOptions` hook sends comma-separated modules
   - Example: `GET /api/v1/public/dropdown-options?module=expert,serviceVendor,productVendor`

---

## Backend Changes Required

### 1. Update Requirements Schema

**Collection:** `requirements`

```javascript
// Change category from string to array:
category: { 
  type: [String], 
  enum: ['expert', 'product', 'service', 'logistics'],
  default: [] 
}

// Specialization remains array:
specialization: { 
  type: [String], 
  default: [] 
}
```

### 2. Migration Script

```javascript
// Convert existing category string to array
db.requirements.updateMany(
  { category: { $exists: true, $type: "string" } },
  [
    {
      $set: {
        category: {
          $cond: {
            if: { $or: [{ $eq: ["$category", ""] }, { $eq: ["$category", null] }] },
            then: [],
            else: ["$category"]
          }
        }
      }
    }
  ]
);

// Set empty array for missing category
db.requirements.updateMany(
  { category: { $exists: false } },
  { $set: { category: [] } }
);

// Convert existing specialization string to array (if not already)
db.requirements.updateMany(
  { specialization: { $exists: true, $type: "string" } },
  [
    {
      $set: {
        specialization: {
          $cond: {
            if: { $or: [{ $eq: ["$specialization", ""] }, { $eq: ["$specialization", null] }] },
            then: [],
            else: ["$specialization"]
          }
        }
      }
    }
  ]
);
```

### 3. Update Dropdown Options Endpoint

**Endpoint:** `GET /api/v1/public/dropdown-options`

**New Parameter Format:**
- `module`: Now accepts comma-separated values (e.g., `expert,serviceVendor,productVendor`)
- `category`: Optional - defaults to `specialization` when modules are vendor types

**Backend Logic:**
```javascript
// Parse comma-separated modules
const modules = req.query.module.split(',').map(m => m.trim());

// Query master_dropdowns
const options = await MasterDropdowns.find({
  module: { $in: modules },
  category: req.query.category || 'specialization',
  isActive: true
}).sort({ label: 1 });

// Return combined, de-duplicated options
return { success: true, data: { options, total: options.length } };
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "options": [
      { "id": "1", "label": "Mechanical Engineering", "value": "mechanical-engineering", "module": "expert" },
      { "id": "2", "label": "Maintenance Services", "value": "maintenance-services", "module": "serviceVendor" },
      { "id": "3", "label": "Industrial Equipment", "value": "industrial-equipment", "module": "productVendor" }
    ],
    "total": 3
  }
}
```

### 4. API Validation Updates

**Joi Schema:**
```javascript
category: Joi.array().items(
  Joi.string().valid('expert', 'product', 'service', 'logistics')
).default([]),

specialization: Joi.array().items(Joi.string()).default([])
```

---

## Category to Module Mapping

| Category Selection | Module(s) for API |
|-------------------|-------------------|
| Expert only | `expert` |
| Product only | `productVendor` |
| Service only | `serviceVendor` |
| Logistics only | `logisticsVendor` |
| Expert + Product | `expert,productVendor` |
| All four | `expert,productVendor,serviceVendor,logisticsVendor` |

---

## Estimated Backend Effort

| Task | Hours |
|------|-------|
| Schema update | 1h |
| Migration script | 1.5h |
| Dropdown endpoint update (comma-separated) | 1h |
| Validation updates | 0.5h |
| Seed data (if missing) | 1h |
| Testing | 2h |
| **Total** | **7h** |
