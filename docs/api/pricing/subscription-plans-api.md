# Subscription Plans API Specification

## Overview

API endpoints for fetching subscription plans, add-ons, and pricing configuration dynamically.

**Base URL:** `/api/v1`

---

## Endpoints

### 1. GET /subscription-plans

Fetch all subscription plans grouped by user type.

#### Request

```http
GET /api/v1/subscription-plans
Authorization: Bearer <optional_token>
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userType` | string | No | Filter by user type (industry, service_vendor, product_vendor, logistics, professional) |
| `includeCustom` | boolean | No | Include custom/enterprise pricing plans (default: true) |

#### Response

```json
{
  "success": true,
  "data": {
    "industry": [
      {
        "code": "INDUSTRY_STARTER",
        "name": "Starter",
        "tier": "plus",
        "price": 3999,
        "priceRange": null,
        "currency": "INR",
        "billingCycle": "monthly",
        "description": "Perfect for small manufacturing units...",
        "shortDescription": "Start your digital procurement journey",
        "highlights": [
          "Team of 3 members",
          "10 requirements/month",
          "30 RFQs/month",
          "10 POs/month",
          "Basic AI search",
          "Diligince Bot (Helper)",
          "30-day advanced analytics trial"
        ],
        "isPopular": false,
        "isCustomPricing": false,
        "ctaLabel": "Get Started",
        "ctaAction": "signup"
      },
      {
        "code": "INDUSTRY_GROWTH",
        "name": "Growth",
        "tier": "pro",
        "price": null,
        "priceRange": {
          "min": 12000,
          "max": 20000
        },
        "currency": "INR",
        "billingCycle": "monthly",
        "description": "Scale your procurement operations...",
        "shortDescription": "Scale with advanced AI & analytics",
        "highlights": [
          "Team of 10-25 members",
          "50-100 requirements/month",
          "150-300 RFQs/month",
          "50-100 POs/month",
          "Advanced AI search",
          "Bot V2 included",
          "Advanced analytics"
        ],
        "isPopular": true,
        "isCustomPricing": false,
        "ctaLabel": "Contact Sales",
        "ctaAction": "contact"
      },
      {
        "code": "INDUSTRY_ENTERPRISE",
        "name": "Enterprise",
        "tier": "enterprise",
        "price": null,
        "priceRange": null,
        "currency": "INR",
        "billingCycle": "monthly",
        "description": "Enterprise-grade procurement platform...",
        "shortDescription": "Custom enterprise solution",
        "highlights": ["..."],
        "isPopular": false,
        "isCustomPricing": true,
        "ctaLabel": "Contact Sales",
        "ctaAction": "contact"
      }
    ],
    "service_vendor": [...],
    "product_vendor": [...],
    "logistics": [...],
    "professional": [...]
  },
  "metadata": {
    "lastUpdated": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

---

### 2. GET /add-ons

Fetch all available add-ons.

#### Request

```http
GET /api/v1/add-ons
Authorization: Bearer <optional_token>
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userType` | string | No | Filter add-ons compatible with specific user type |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "code": "DILIGIENCE_HUB",
      "name": "Diligince Hub",
      "type": "subscription",
      "price": 999,
      "currency": "INR",
      "billingCycle": "monthly",
      "icon": "network",
      "description": "Connect, network, and collaborate...",
      "shortDescription": "Networking & collaboration platform",
      "featureList": [
        "Industry-vendor networking",
        "Professional connections",
        "Verified profiles directory",
        "Enhanced messaging"
      ],
      "compatibleUserTypes": ["industry", "service_vendor", "product_vendor", "logistics", "professional"],
      "limits": null
    },
    {
      "code": "AI_RECOMMENDATION_PACK",
      "name": "AI Recommendation Pack",
      "type": "usage",
      "price": 499,
      "currency": "INR",
      "billingCycle": null,
      "icon": "sparkles",
      "description": "Get 20 AI-powered vendor and product recommendations...",
      "shortDescription": "20 AI vendor recommendations",
      "featureList": [
        "20 AI recommendation credits",
        "Smart vendor matching",
        "Requirement analysis",
        "Valid for 90 days"
      ],
      "compatibleUserTypes": ["industry"],
      "limits": {
        "credits": 20,
        "validityDays": 90
      }
    }
  ]
}
```

---

### 3. GET /gst-rate

Fetch current GST rate and configuration.

#### Request

```http
GET /api/v1/gst-rate
```

#### Response

```json
{
  "success": true,
  "data": {
    "rate": 18,
    "rateDecimal": 0.18,
    "effectiveFrom": "2024-01-01",
    "description": "Goods and Services Tax applicable in India"
  }
}
```

---

### 4. GET /subscription-plans/:code

Fetch a specific plan by its code.

#### Request

```http
GET /api/v1/subscription-plans/INDUSTRY_GROWTH
```

#### Response

```json
{
  "success": true,
  "data": {
    "code": "INDUSTRY_GROWTH",
    "name": "Growth",
    "tier": "pro",
    "priceRange": {
      "min": 12000,
      "max": 20000
    },
    "currency": "INR",
    "billingCycle": "monthly",
    "description": "Scale your procurement operations with advanced AI capabilities...",
    "shortDescription": "Scale with advanced AI & analytics",
    "highlights": [...],
    "isPopular": true,
    "isCustomPricing": false,
    "ctaLabel": "Contact Sales",
    "ctaAction": "contact",
    "features": {
      "teamSize": { "min": 10, "max": 25 },
      "requirementsPerMonth": { "min": 50, "max": 100 },
      "rfqsPerMonth": { "min": 150, "max": 300 },
      "posPerMonth": { "min": 50, "max": 100 },
      "aiSearch": "advanced",
      "botVersion": "v2",
      "analytics": "advanced"
    }
  }
}
```

---

## Data Types

### Plan Object

| Field | Type | Description |
|-------|------|-------------|
| `code` | string | Unique plan identifier (e.g., "INDUSTRY_GROWTH") |
| `name` | string | Display name of the plan |
| `tier` | string | Plan tier: "free", "plus", "pro", "enterprise" |
| `price` | number \| null | Fixed price (null if range or custom) |
| `priceRange` | object \| null | Min/max price range for variable pricing |
| `currency` | string | Currency code (e.g., "INR") |
| `billingCycle` | string | Billing frequency ("monthly", "yearly") |
| `description` | string | Full plan description |
| `shortDescription` | string | Brief description for cards |
| `highlights` | string[] | Key features list |
| `isPopular` | boolean | Whether to show "Most Popular" badge |
| `isCustomPricing` | boolean | Whether pricing is custom/contact sales |
| `ctaLabel` | string | Call-to-action button text |
| `ctaAction` | string | Action type: "signup", "subscribe", "contact" |

### AddOn Object

| Field | Type | Description |
|-------|------|-------------|
| `code` | string | Unique add-on identifier |
| `name` | string | Display name |
| `type` | string | "subscription" (monthly) or "usage" (one-time) |
| `price` | number | Price amount |
| `currency` | string | Currency code |
| `billingCycle` | string \| null | Billing cycle for subscriptions |
| `icon` | string | Icon identifier for UI |
| `description` | string | Full description |
| `shortDescription` | string | Brief description |
| `featureList` | string[] | Features included |
| `compatibleUserTypes` | string[] | User types that can use this add-on |
| `limits` | object \| null | Usage limits (credits, validity, etc.) |

---

## Error Responses

```json
{
  "success": false,
  "error": {
    "code": "PLAN_NOT_FOUND",
    "message": "The requested plan does not exist",
    "details": {
      "planCode": "INVALID_PLAN"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `PLAN_NOT_FOUND` | 404 | Plan code does not exist |
| `INVALID_USER_TYPE` | 400 | Invalid user type parameter |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Caching

- Plans and add-ons can be cached for **1 hour**
- GST rate can be cached for **24 hours**
- Use `Cache-Control` headers from response for cache duration
