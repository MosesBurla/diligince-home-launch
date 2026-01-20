# Vendor Services API Documentation

This document describes the API endpoints for managing vendor services and skills.

## Base URL
```
/api/v1/vendor-profile/services
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header.

---

## Endpoints

### 1. List All Services
**GET** `/api/v1/vendor-profile/services`

Retrieves all services for the authenticated vendor.

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Industrial Automation Solutions",
      "description": "Implementation of advanced automation systems...",
      "pricingModel": "Fixed Price + Materials",
      "tags": ["Automation", "PLC", "SCADA"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### Error Response (404 - No services found)
```json
{
  "success": false,
  "message": "No services found"
}
```

---

### 2. Create Service
**POST** `/api/v1/vendor-profile/services`

Creates a new service for the vendor.

#### Request Body
```json
{
  "name": "Industrial Automation Solutions",
  "description": "Implementation of advanced automation systems for manufacturing plants, including PLC programming, SCADA integration, and industrial robotics.",
  "pricingModel": "Fixed Price + Materials",
  "tags": ["Automation", "PLC", "SCADA", "Robotics"]
}
```

#### Validation Rules
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | Min 2 characters |
| description | string | Yes | Min 10 characters |
| pricingModel | string | Yes | Must be one of: "Hourly Rate", "Fixed Price", "Fixed Price + Materials", "Annual Contract", "Performance-based", "Time & Materials", "Retainer", "Subscription" |
| tags | string[] | Yes | At least 1 tag required |

#### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Industrial Automation Solutions",
    "description": "Implementation of advanced automation systems...",
    "pricingModel": "Fixed Price + Materials",
    "tags": ["Automation", "PLC", "SCADA", "Robotics"],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### 3. Update Service
**PUT** `/api/v1/vendor-profile/services/:id`

Updates an existing service.

#### URL Parameters
| Parameter | Description |
|-----------|-------------|
| id | The unique identifier of the service |

#### Request Body
```json
{
  "name": "Updated Service Name",
  "description": "Updated description...",
  "pricingModel": "Annual Contract",
  "tags": ["Tag1", "Tag2"]
}
```

All fields are optional - only include fields you want to update.

#### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Service Name",
    "description": "Updated description...",
    "pricingModel": "Annual Contract",
    "tags": ["Tag1", "Tag2"],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-16T14:30:00Z"
  }
}
```

#### Error Response (404 - Service not found)
```json
{
  "success": false,
  "message": "Service not found"
}
```

---

### 4. Delete Service
**DELETE** `/api/v1/vendor-profile/services/:id`

Deletes a vendor service.

#### URL Parameters
| Parameter | Description |
|-----------|-------------|
| id | The unique identifier of the service |

#### Response
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

#### Error Response (404 - Service not found)
```json
{
  "success": false,
  "message": "Service not found"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "Service name must be at least 2 characters"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden (Profile Locked)
```json
{
  "success": false,
  "message": "Profile is locked for verification. Services cannot be modified."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An unexpected error occurred"
}
```

---

## Pricing Model Options

The following pricing models are supported:

| Value | Description |
|-------|-------------|
| Hourly Rate | Charged per hour of work |
| Fixed Price | Fixed cost for the entire project |
| Fixed Price + Materials | Fixed labor cost plus material costs |
| Annual Contract | Yearly recurring contract |
| Performance-based | Payment based on achieved results |
| Time & Materials | Hourly rate plus material costs |
| Retainer | Monthly/quarterly retainer fee |
| Subscription | Recurring subscription model |

---

## Notes

1. **Profile Lock**: When a vendor profile is pending verification or approved, services cannot be created, updated, or deleted. The API will return a 403 error.

2. **Service Visibility**: Services are only visible when the vendor profile is in "approved" status.

3. **Tag Limit**: While there's no hard limit on tags, it's recommended to use 3-8 tags per service for optimal searchability.
