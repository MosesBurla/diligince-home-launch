# Industry Dashboard API Documentation

## Overview

This document provides comprehensive API documentation for the Industry Dashboard module. The Industry Dashboard provides real-time insights into procurement activities, budget utilization, vendor performance, and approval workflows for industrial enterprises.

## Base URL

```
https://your-api-domain.com/api/v1
```

## Authentication

All API endpoints require JWT Bearer token authentication.

**Headers Required:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## Data Models

### DashboardStats

```typescript
interface DashboardStats {
  totalProcurementSpend: MetricData;
  activePurchaseOrders: MetricData;
  budgetUtilization: MetricData;
  costSavings: MetricData;
}

interface MetricData {
  value: number;
  formatted: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'healthy' | 'moderate' | 'high';
}
```

### ProcurementAnalytics

```typescript
interface ProcurementAnalytics {
  totalSpend: number;
  avgMonthlySpend: number;
  peakMonthSpend: number;
  categories: CategorySpend[];
  monthlyTrend: MonthlySpend[];
}

interface CategorySpend {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface MonthlySpend {
  month: string;
  spend: number;
}
```

### BudgetData

```typescript
interface BudgetOverview {
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  overallPercentage: number;
  status: 'healthy' | 'moderate' | 'high';
  categories: BudgetCategory[];
}

interface BudgetCategory {
  category: string;
  allocated: number;
  spent: number;
  percentage: number;
  remaining: number;
  status: 'healthy' | 'moderate' | 'high';
}
```

### VendorPerformance

```typescript
interface VendorPerformance {
  rank: number;
  id: string;
  name: string;
  initials: string;
  category: string;
  rating: number;
  orders: number;
  onTimeDelivery: number;
  avatar?: string;
}
```

### Requirement

```typescript
interface Requirement {
  id: string;
  title: string;
  category: 'Product' | 'Service' | 'Expert' | 'Logistics';
  status: 'Active' | 'Pending' | 'Completed' | 'Approved' | 'Rejected';
  date: string;
  budget: number;
  applicants: number;
  description?: string;
  deadline?: string;
}
```

### PurchaseOrder

```typescript
interface PurchaseOrder {
  id: string;
  title: string;
  vendor: string;
  vendorId: string;
  summary: string;
  status: 'In Progress' | 'Delivered' | 'Pending' | 'Cancelled';
  progress: number;
  amount: number;
  requirementId: string;
  items?: number;
  deliveryDate?: string;
  createdDate: string;
}
```

### PendingApproval

```typescript
interface PendingApproval {
  id: string;
  requirementId: string;
  requirementTitle: string;
  budget: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  category: 'Product' | 'Service' | 'Expert' | 'Logistics';
  deadline: string;
  requestedDate: string;
  requestedBy: {
    id: string;
    name: string;
    department: string;
  };
  approverRole: string;
  approvalLevel: number;
  isUrgent: boolean;
  attachments?: string[];
}
```

---

## API Endpoints

### 1. Get Dashboard Statistics

Returns aggregated statistics for the dashboard overview.

**Endpoint:** `GET /api/v1/industry/dashboard/stats`

**Query Parameters:**
- `period` (optional): Time period filter - `30d`, `quarter`, `year`, `custom`
- `startDate` (optional): Start date for custom period (ISO 8601 format)
- `endDate` (optional): End date for custom period (ISO 8601 format)

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/dashboard/stats?period=quarter" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

```javascript
// Using Axios
import axios from 'axios';

const response = await axios.get('/api/v1/industry/dashboard/stats', {
  params: { period: 'quarter' },
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": {
    "totalProcurementSpend": {
      "value": 1250000,
      "formatted": "$1.25M",
      "change": 12.5,
      "trend": "up"
    },
    "activePurchaseOrders": {
      "value": 24,
      "formatted": "24",
      "change": 8.3,
      "trend": "up"
    },
    "budgetUtilization": {
      "value": 68,
      "formatted": "68%",
      "change": 5.2,
      "trend": "up",
      "status": "healthy"
    },
    "costSavings": {
      "value": 180000,
      "formatted": "$180K",
      "change": 15.2,
      "trend": "up"
    }
  },
  "metadata": {
    "period": "quarter",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-03-31T23:59:59Z",
    "generatedAt": "2024-03-31T10:30:00Z",
    "currency": "USD"
  }
}
```

---

### 2. Get Pending Approvals

Returns a list of requirements pending approval for the current user.

**Endpoint:** `GET /api/v1/industry/approvals/pending`

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `role` (optional): Filter by approver role
- `priority` (optional): Filter by priority - `low`, `medium`, `high`, `critical`
- `category` (optional): Filter by category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/approvals/pending?role=Department%20Head&page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "approval-001",
      "requirementId": "REQ-001",
      "requirementTitle": "Industrial Valve Procurement",
      "budget": 25000,
      "priority": "high",
      "description": "Procurement of industrial valves for manufacturing line upgrade. Requires immediate approval for production continuity.",
      "category": "Product",
      "deadline": "2024-01-25T23:59:59Z",
      "requestedDate": "2024-01-10T09:00:00Z",
      "requestedBy": {
        "id": "user-123",
        "name": "John Smith",
        "department": "Manufacturing"
      },
      "approverRole": "Department Head",
      "approvalLevel": 1,
      "isUrgent": false,
      "attachments": [
        "https://storage.example.com/docs/valve-specs.pdf",
        "https://storage.example.com/docs/vendor-quote.pdf"
      ]
    },
    {
      "id": "approval-002",
      "requirementId": "REQ-005",
      "requirementTitle": "Emergency Chemical Transport",
      "budget": 150000,
      "priority": "critical",
      "description": "Urgent chemical transportation services for production continuity. Immediate approval required.",
      "category": "Logistics",
      "deadline": "2024-01-18T23:59:59Z",
      "requestedDate": "2024-01-15T14:30:00Z",
      "requestedBy": {
        "id": "user-456",
        "name": "Sarah Johnson",
        "department": "Logistics"
      },
      "approverRole": "Department Head",
      "approvalLevel": 1,
      "isUrgent": true,
      "attachments": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "metadata": {
    "generatedAt": "2024-01-16T10:30:00Z"
  }
}
```

---

### 3. Approve Requirement

Approve a pending requirement.

**Endpoint:** `POST /api/v1/industry/approvals/:approvalId/approve`

**Path Parameters:**
- `approvalId`: The ID of the approval

**Request Body:**

```typescript
{
  comments: string;
  conditions?: string[];
}
```

**Request Example:**

```bash
curl -X POST "https://your-api-domain.com/api/v1/industry/approvals/approval-001/approve" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Approved for immediate procurement. Please proceed with vendor selection.",
    "conditions": ["Budget cap at $25,000", "Delivery within 30 days"]
  }'
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "approval-001",
    "requirementId": "REQ-001",
    "status": "approved",
    "approvedBy": {
      "id": "user-789",
      "name": "Michael Brown",
      "role": "Department Head"
    },
    "approvedAt": "2024-01-16T11:00:00Z",
    "comments": "Approved for immediate procurement. Please proceed with vendor selection.",
    "conditions": ["Budget cap at $25,000", "Delivery within 30 days"],
    "nextApprovalLevel": 2,
    "requiresAdditionalApproval": false
  },
  "message": "Requirement approved successfully"
}
```

---

### 4. Reject Requirement

Reject a pending requirement.

**Endpoint:** `POST /api/v1/industry/approvals/:approvalId/reject`

**Path Parameters:**
- `approvalId`: The ID of the approval

**Request Body:**

```typescript
{
  comments: string;
  reason: string;
  suggestions?: string;
}
```

**Request Example:**

```bash
curl -X POST "https://your-api-domain.com/api/v1/industry/approvals/approval-001/reject" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Budget exceeds departmental allocation.",
    "reason": "BUDGET_EXCEEDED",
    "suggestions": "Please revise budget to align with Q1 allocations or seek additional funding approval."
  }'
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "approval-001",
    "requirementId": "REQ-001",
    "status": "rejected",
    "rejectedBy": {
      "id": "user-789",
      "name": "Michael Brown",
      "role": "Department Head"
    },
    "rejectedAt": "2024-01-16T11:00:00Z",
    "comments": "Budget exceeds departmental allocation.",
    "reason": "BUDGET_EXCEEDED",
    "suggestions": "Please revise budget to align with Q1 allocations or seek additional funding approval."
  },
  "message": "Requirement rejected"
}
```

---

### 5. Get Procurement Analytics

Returns procurement analytics data including spend by category and monthly trends.

**Endpoint:** `GET /api/v1/industry/analytics/procurement`

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601 format)
- `endDate` (optional): End date (ISO 8601 format)
- `groupBy` (optional): Grouping option - `category`, `vendor`, `department`

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/analytics/procurement?startDate=2023-10-01&endDate=2024-03-31" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": {
    "totalSpend": 875000,
    "avgMonthlySpend": 145833,
    "peakMonthSpend": 165000,
    "peakMonth": "December 2023",
    "categories": [
      {
        "name": "Products",
        "amount": 350000,
        "percentage": 40,
        "color": "#8b5cf6"
      },
      {
        "name": "Services",
        "amount": 262500,
        "percentage": 30,
        "color": "#3b82f6"
      },
      {
        "name": "Logistics",
        "amount": 175000,
        "percentage": 20,
        "color": "#f59e0b"
      },
      {
        "name": "Expert Consultation",
        "amount": 87500,
        "percentage": 10,
        "color": "#10b981"
      }
    ],
    "monthlyTrend": [
      {
        "month": "Oct 2023",
        "spend": 125000
      },
      {
        "month": "Nov 2023",
        "spend": 142000
      },
      {
        "month": "Dec 2023",
        "spend": 165000
      },
      {
        "month": "Jan 2024",
        "spend": 138000
      },
      {
        "month": "Feb 2024",
        "spend": 155000
      },
      {
        "month": "Mar 2024",
        "spend": 150000
      }
    ]
  },
  "metadata": {
    "startDate": "2023-10-01T00:00:00Z",
    "endDate": "2024-03-31T23:59:59Z",
    "generatedAt": "2024-03-31T10:30:00Z",
    "currency": "USD"
  }
}
```

---

### 6. Get Spend by Category

Returns detailed spend breakdown by category.

**Endpoint:** `GET /api/v1/industry/analytics/spend-by-category`

**Query Parameters:**
- `period` (optional): Time period - `30d`, `quarter`, `year`, `custom`
- `startDate` (optional): Start date for custom period
- `endDate` (optional): End date for custom period

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/analytics/spend-by-category?period=quarter" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "Products",
        "amount": 350000,
        "percentage": 40,
        "color": "#8b5cf6",
        "change": 8.5,
        "trend": "up",
        "topVendors": ["TechValve Solutions", "Industrial Supply Co", "ProTools Inc"]
      },
      {
        "name": "Services",
        "amount": 262500,
        "percentage": 30,
        "color": "#3b82f6",
        "change": -2.3,
        "trend": "down",
        "topVendors": ["Service Pro Maintenance", "ConsultPro", "TechServe"]
      },
      {
        "name": "Logistics",
        "amount": 175000,
        "percentage": 20,
        "color": "#f59e0b",
        "change": 12.1,
        "trend": "up",
        "topVendors": ["FastTrack Logistics", "Global Transport", "SpeedShip"]
      },
      {
        "name": "Expert Consultation",
        "amount": 87500,
        "percentage": 10,
        "color": "#10b981",
        "change": 5.7,
        "trend": "up",
        "topVendors": ["EngiConsult Group", "TechExperts", "IndustryPros"]
      }
    ],
    "totalSpend": 875000
  },
  "metadata": {
    "period": "quarter",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-03-31T23:59:59Z",
    "generatedAt": "2024-03-31T10:30:00Z"
  }
}
```

---

### 7. Get Monthly Spend Trend

Returns monthly spend trend data.

**Endpoint:** `GET /api/v1/industry/analytics/monthly-trend`

**Query Parameters:**
- `months` (optional): Number of months to include (default: 6, max: 24)
- `category` (optional): Filter by specific category

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/analytics/monthly-trend?months=6" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": {
    "monthlyTrend": [
      {
        "month": "Oct 2023",
        "spend": 125000,
        "orders": 18,
        "avgOrderValue": 6944
      },
      {
        "month": "Nov 2023",
        "spend": 142000,
        "orders": 22,
        "avgOrderValue": 6455
      },
      {
        "month": "Dec 2023",
        "spend": 165000,
        "orders": 25,
        "avgOrderValue": 6600
      },
      {
        "month": "Jan 2024",
        "spend": 138000,
        "orders": 20,
        "avgOrderValue": 6900
      },
      {
        "month": "Feb 2024",
        "spend": 155000,
        "orders": 23,
        "avgOrderValue": 6739
      },
      {
        "month": "Mar 2024",
        "spend": 150000,
        "orders": 24,
        "avgOrderValue": 6250
      }
    ],
    "summary": {
      "totalSpend": 875000,
      "avgMonthlySpend": 145833,
      "peakMonth": "Dec 2023",
      "peakMonthSpend": 165000,
      "lowestMonth": "Oct 2023",
      "lowestMonthSpend": 125000
    }
  },
  "metadata": {
    "months": 6,
    "generatedAt": "2024-03-31T10:30:00Z"
  }
}
```

---

### 8. Get Budget Overview

Returns overall budget allocation and utilization.

**Endpoint:** `GET /api/v1/industry/budget/overview`

**Query Parameters:**
- `fiscalYear` (optional): Fiscal year (default: current year)

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/budget/overview?fiscalYear=2024" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": {
    "totalAllocated": 1500000,
    "totalSpent": 1020000,
    "totalRemaining": 480000,
    "overallPercentage": 68,
    "status": "healthy",
    "categories": [
      {
        "category": "Products",
        "allocated": 600000,
        "spent": 450000,
        "percentage": 75,
        "remaining": 150000,
        "status": "moderate"
      },
      {
        "category": "Services",
        "allocated": 450000,
        "spent": 315000,
        "percentage": 70,
        "remaining": 135000,
        "status": "healthy"
      },
      {
        "category": "Logistics",
        "allocated": 300000,
        "spent": 180000,
        "percentage": 60,
        "remaining": 120000,
        "status": "healthy"
      },
      {
        "category": "Expert Consultation",
        "allocated": 150000,
        "spent": 75000,
        "percentage": 50,
        "remaining": 75000,
        "status": "healthy"
      }
    ]
  },
  "metadata": {
    "fiscalYear": "2024",
    "quarter": "Q1",
    "generatedAt": "2024-03-31T10:30:00Z",
    "currency": "USD"
  }
}
```

---

### 9. Get Budget Categories

Returns budget breakdown by categories.

**Endpoint:** `GET /api/v1/industry/budget/categories`

**Query Parameters:**
- `fiscalYear` (optional): Fiscal year

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/budget/categories" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "category": "Products",
      "allocated": 600000,
      "spent": 450000,
      "percentage": 75,
      "remaining": 150000,
      "status": "moderate",
      "monthlyBurn": 75000,
      "projectedUtilization": 82,
      "subcategories": [
        {
          "name": "Industrial Equipment",
          "allocated": 300000,
          "spent": 225000
        },
        {
          "name": "Raw Materials",
          "allocated": 200000,
          "spent": 150000
        },
        {
          "name": "Safety Equipment",
          "allocated": 100000,
          "spent": 75000
        }
      ]
    },
    {
      "category": "Services",
      "allocated": 450000,
      "spent": 315000,
      "percentage": 70,
      "remaining": 135000,
      "status": "healthy",
      "monthlyBurn": 52500,
      "projectedUtilization": 75,
      "subcategories": [
        {
          "name": "Maintenance",
          "allocated": 225000,
          "spent": 157500
        },
        {
          "name": "Consulting",
          "allocated": 150000,
          "spent": 105000
        },
        {
          "name": "Training",
          "allocated": 75000,
          "spent": 52500
        }
      ]
    },
    {
      "category": "Logistics",
      "allocated": 300000,
      "spent": 180000,
      "percentage": 60,
      "remaining": 120000,
      "status": "healthy",
      "monthlyBurn": 30000,
      "projectedUtilization": 65,
      "subcategories": [
        {
          "name": "Domestic Shipping",
          "allocated": 150000,
          "spent": 90000
        },
        {
          "name": "International Freight",
          "allocated": 100000,
          "spent": 60000
        },
        {
          "name": "Warehousing",
          "allocated": 50000,
          "spent": 30000
        }
      ]
    },
    {
      "category": "Expert Consultation",
      "allocated": 150000,
      "spent": 75000,
      "percentage": 50,
      "remaining": 75000,
      "status": "healthy",
      "monthlyBurn": 12500,
      "projectedUtilization": 55,
      "subcategories": [
        {
          "name": "Technical Experts",
          "allocated": 90000,
          "spent": 45000
        },
        {
          "name": "Safety Consultants",
          "allocated": 40000,
          "spent": 20000
        },
        {
          "name": "Compliance Auditors",
          "allocated": 20000,
          "spent": 10000
        }
      ]
    }
  ],
  "metadata": {
    "fiscalYear": "2024",
    "generatedAt": "2024-03-31T10:30:00Z"
  }
}
```

---

### 10. Get Top Performing Vendors

Returns top performing vendors based on ratings and metrics.

**Endpoint:** `GET /api/v1/industry/vendors/top-performers`

**Query Parameters:**
- `limit` (optional): Number of vendors to return (default: 5, max: 20)
- `sortBy` (optional): Sort criteria - `rating`, `orders`, `onTimeDelivery` (default: `rating`)
- `category` (optional): Filter by vendor category

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/vendors/top-performers?limit=5&sortBy=rating" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "id": "vendor-001",
      "name": "EngiConsult Group",
      "initials": "EG",
      "category": "Expert",
      "rating": 4.9,
      "orders": 45,
      "onTimeDelivery": 98,
      "avatar": "https://storage.example.com/avatars/vendor-001.jpg",
      "totalRevenue": 225000,
      "averageOrderValue": 5000,
      "responseTime": "2 hours"
    },
    {
      "rank": 2,
      "id": "vendor-002",
      "name": "TechValve Solutions",
      "initials": "TV",
      "category": "Product Vendor",
      "rating": 4.8,
      "orders": 28,
      "onTimeDelivery": 96,
      "avatar": null,
      "totalRevenue": 420000,
      "averageOrderValue": 15000,
      "responseTime": "4 hours"
    },
    {
      "rank": 3,
      "id": "vendor-003",
      "name": "Service Pro Maintenance",
      "initials": "SP",
      "category": "Service Vendor",
      "rating": 4.7,
      "orders": 32,
      "onTimeDelivery": 94,
      "avatar": null,
      "totalRevenue": 288000,
      "averageOrderValue": 9000,
      "responseTime": "3 hours"
    },
    {
      "rank": 4,
      "id": "vendor-004",
      "name": "FastTrack Logistics",
      "initials": "FL",
      "category": "Logistics",
      "rating": 4.6,
      "orders": 67,
      "onTimeDelivery": 92,
      "avatar": null,
      "totalRevenue": 335000,
      "averageOrderValue": 5000,
      "responseTime": "1 hour"
    },
    {
      "rank": 5,
      "id": "vendor-005",
      "name": "Industrial Supply Co",
      "initials": "IS",
      "category": "Product Vendor",
      "rating": 4.5,
      "orders": 38,
      "onTimeDelivery": 90,
      "avatar": null,
      "totalRevenue": 380000,
      "averageOrderValue": 10000,
      "responseTime": "5 hours"
    }
  ],
  "metadata": {
    "limit": 5,
    "sortBy": "rating",
    "totalVendors": 142,
    "generatedAt": "2024-03-31T10:30:00Z"
  }
}
```

---

### 11. Get Vendor Performance Details

Returns detailed performance metrics for a specific vendor.

**Endpoint:** `GET /api/v1/industry/vendors/:vendorId/performance`

**Path Parameters:**
- `vendorId`: The ID of the vendor

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/vendors/vendor-001/performance" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": {
    "vendor": {
      "id": "vendor-001",
      "name": "EngiConsult Group",
      "category": "Expert",
      "rating": 4.9,
      "joinedDate": "2022-03-15T00:00:00Z"
    },
    "performance": {
      "totalOrders": 45,
      "completedOrders": 43,
      "activeOrders": 2,
      "cancelledOrders": 0,
      "onTimeDelivery": 98,
      "averageRating": 4.9,
      "totalRevenue": 225000,
      "averageOrderValue": 5000,
      "responseTime": "2 hours",
      "qualityScore": 96
    },
    "trends": {
      "ordersThisMonth": 6,
      "ordersLastMonth": 5,
      "revenueGrowth": 12.5,
      "ratingTrend": "stable"
    },
    "recentOrders": [
      {
        "orderId": "PO-2024-015",
        "date": "2024-03-25T00:00:00Z",
        "amount": 8000,
        "status": "completed",
        "rating": 5.0
      },
      {
        "orderId": "PO-2024-012",
        "date": "2024-03-18T00:00:00Z",
        "amount": 6500,
        "status": "completed",
        "rating": 4.8
      },
      {
        "orderId": "PO-2024-009",
        "date": "2024-03-10T00:00:00Z",
        "amount": 5200,
        "status": "in_progress",
        "rating": null
      }
    ]
  },
  "metadata": {
    "generatedAt": "2024-03-31T10:30:00Z"
  }
}
```

---

### 12. Get Active Requirements

Returns a list of active requirements.

**Endpoint:** `GET /api/v1/industry/requirements/active`

**Query Parameters:**
- `status` (optional): Filter by status
- `category` (optional): Filter by category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `sortBy` (optional): Sort field - `date`, `budget`, `applicants`
- `order` (optional): Sort order - `asc`, `desc` (default: `desc`)

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/requirements/active?category=Product&page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "REQ-001",
      "title": "Industrial Valve Procurement",
      "category": "Product",
      "status": "Active",
      "date": "2024-03-29T10:00:00Z",
      "budget": 25000,
      "applicants": 8,
      "description": "Procurement of high-pressure industrial valves for manufacturing line upgrade",
      "deadline": "2024-04-15T23:59:59Z",
      "createdBy": {
        "id": "user-123",
        "name": "John Smith",
        "department": "Manufacturing"
      }
    },
    {
      "id": "REQ-003",
      "title": "Chemical Engineering Consultant",
      "category": "Expert",
      "status": "Active",
      "date": "2024-03-28T14:30:00Z",
      "budget": 15000,
      "applicants": 5,
      "description": "Seeking experienced chemical engineer for process optimization project",
      "deadline": "2024-04-10T23:59:59Z",
      "createdBy": {
        "id": "user-456",
        "name": "Sarah Johnson",
        "department": "R&D"
      }
    },
    {
      "id": "REQ-005",
      "title": "Safety Audit Services",
      "category": "Service",
      "status": "Active",
      "date": "2024-03-26T09:15:00Z",
      "budget": 12000,
      "applicants": 7,
      "description": "Comprehensive safety audit and compliance review for manufacturing facility",
      "deadline": "2024-04-20T23:59:59Z",
      "createdBy": {
        "id": "user-789",
        "name": "Michael Brown",
        "department": "Safety & Compliance"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "metadata": {
    "generatedAt": "2024-03-31T10:30:00Z"
  }
}
```

---

### 13. Get Active Purchase Orders

Returns a list of active purchase orders.

**Endpoint:** `GET /api/v1/industry/purchase-orders/active`

**Query Parameters:**
- `status` (optional): Filter by status - `In Progress`, `Delivered`, `Pending`
- `vendorId` (optional): Filter by vendor ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `sortBy` (optional): Sort field - `date`, `amount`, `progress`
- `order` (optional): Sort order - `asc`, `desc` (default: `desc`)

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/purchase-orders/active?status=In%20Progress&page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "PO-2023-042",
      "title": "Industrial Valve Set",
      "vendor": "TechValve Solutions",
      "vendorId": "vendor-002",
      "summary": "3 items",
      "status": "In Progress",
      "progress": 65,
      "amount": 25000,
      "requirementId": "REQ-001",
      "items": 3,
      "deliveryDate": "2024-04-15T00:00:00Z",
      "createdDate": "2024-03-10T00:00:00Z",
      "milestones": [
        {
          "name": "Order Confirmed",
          "status": "completed",
          "date": "2024-03-10T10:00:00Z"
        },
        {
          "name": "Manufacturing",
          "status": "in_progress",
          "date": null
        },
        {
          "name": "Quality Check",
          "status": "pending",
          "date": null
        },
        {
          "name": "Delivery",
          "status": "pending",
          "date": null
        }
      ]
    },
    {
      "id": "PO-2023-036",
      "title": "Consulting Services",
      "vendor": "EngiConsult Group",
      "vendorId": "vendor-001",
      "summary": "1 service",
      "status": "In Progress",
      "progress": 40,
      "amount": 35000,
      "requirementId": "REQ-002",
      "items": 1,
      "deliveryDate": "2024-05-01T00:00:00Z",
      "createdDate": "2024-02-20T00:00:00Z",
      "milestones": [
        {
          "name": "Kick-off Meeting",
          "status": "completed",
          "date": "2024-02-22T09:00:00Z"
        },
        {
          "name": "Phase 1 Analysis",
          "status": "completed",
          "date": "2024-03-15T00:00:00Z"
        },
        {
          "name": "Phase 2 Implementation",
          "status": "in_progress",
          "date": null
        },
        {
          "name": "Final Report",
          "status": "pending",
          "date": null
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "metadata": {
    "generatedAt": "2024-03-31T10:30:00Z"
  }
}
```

---

### 14. Get Purchase Order by ID

Returns detailed information for a specific purchase order.

**Endpoint:** `GET /api/v1/industry/purchase-orders/:orderId`

**Path Parameters:**
- `orderId`: The ID of the purchase order

**Request Example:**

```bash
curl -X GET "https://your-api-domain.com/api/v1/industry/purchase-orders/PO-2023-042" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response Example (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "PO-2023-042",
    "title": "Industrial Valve Set",
    "vendor": {
      "id": "vendor-002",
      "name": "TechValve Solutions",
      "rating": 4.8,
      "contact": {
        "email": "sales@techvalve.com",
        "phone": "+1-555-0123"
      }
    },
    "summary": "3 items",
    "status": "In Progress",
    "progress": 65,
    "amount": 25000,
    "requirementId": "REQ-001",
    "items": [
      {
        "id": "item-001",
        "name": "High-Pressure Control Valve",
        "quantity": 10,
        "unitPrice": 1500,
        "totalPrice": 15000,
        "specifications": "DN100, PN40, Stainless Steel 316"
      },
      {
        "id": "item-002",
        "name": "Safety Relief Valve",
        "quantity": 5,
        "unitPrice": 1200,
        "totalPrice": 6000,
        "specifications": "DN50, PN25, Carbon Steel"
      },
      {
        "id": "item-003",
        "name": "Ball Valve",
        "quantity": 20,
        "unitPrice": 200,
        "totalPrice": 4000,
        "specifications": "DN25, PN16, Brass"
      }
    ],
    "deliveryDate": "2024-04-15T00:00:00Z",
    "createdDate": "2024-03-10T00:00:00Z",
    "deliveryAddress": {
      "street": "123 Industrial Park",
      "city": "Manufacturing City",
      "state": "TX",
      "zipCode": "75001",
      "country": "USA"
    },
    "milestones": [
      {
        "name": "Order Confirmed",
        "status": "completed",
        "date": "2024-03-10T10:00:00Z",
        "completedBy": "System"
      },
      {
        "name": "Manufacturing",
        "status": "in_progress",
        "date": null,
        "estimatedCompletion": "2024-04-05T00:00:00Z"
      },
      {
        "name": "Quality Check",
        "status": "pending",
        "date": null,
        "estimatedCompletion": "2024-04-10T00:00:00Z"
      },
      {
        "name": "Delivery",
        "status": "pending",
        "date": null,
        "estimatedCompletion": "2024-04-15T00:00:00Z"
      }
    ],
    "paymentTerms": {
      "method": "Net 30",
      "advancePayment": 7500,
      "advancePaymentDate": "2024-03-12T00:00:00Z",
      "balancePayment": 17500,
      "balancePaymentDue": "2024-05-15T00:00:00Z"
    },
    "documents": [
      {
        "id": "doc-001",
        "name": "Purchase Order.pdf",
        "url": "https://storage.example.com/docs/PO-2023-042.pdf",
        "uploadedAt": "2024-03-10T10:30:00Z"
      },
      {
        "id": "doc-002",
        "name": "Technical Specifications.pdf",
        "url": "https://storage.example.com/docs/specs-042.pdf",
        "uploadedAt": "2024-03-10T10:35:00Z"
      }
    ]
  },
  "metadata": {
    "generatedAt": "2024-03-31T10:30:00Z"
  }
}
```

---

## Error Responses

### Standard Error Format

All errors follow this consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "statusCode": 400,
    "details": {}
  }
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | BAD_REQUEST | Invalid request parameters |
| 401 | UNAUTHORIZED | Invalid or expired token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource conflict |
| 422 | VALIDATION_ERROR | Request validation failed |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

### Error Examples

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired authentication token",
    "statusCode": 401
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource",
    "statusCode": 403,
    "details": {
      "requiredRole": "Department Head",
      "currentRole": "Team Member"
    }
  }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Purchase order not found",
    "statusCode": 404,
    "details": {
      "orderId": "PO-2023-999"
    }
  }
}
```

**422 Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "statusCode": 422,
    "details": {
      "fields": {
        "budget": "Budget must be greater than 0",
        "deadline": "Deadline must be in the future"
      }
    }
  }
}
```

**429 Rate Limit:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "statusCode": 429,
    "details": {
      "retryAfter": 60,
      "limit": 100,
      "remaining": 0
    }
  }
}
```

---

## Rate Limiting

API requests are rate limited to ensure fair usage:

- **Per User:** 100 requests per minute
- **Per Organization:** 1000 requests per hour
- **Burst Limit:** 20 requests per 10 seconds

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704124800
```

---

## Pagination

All list endpoints support pagination using `page` and `limit` query parameters.

**Default Values:**
- `page`: 1
- `limit`: 10
- Maximum `limit`: 100

**Pagination Response:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Filtering and Sorting

Most list endpoints support filtering and sorting:

**Filtering:**
- Use query parameters matching field names
- Example: `?status=Active&category=Product`

**Sorting:**
- `sortBy`: Field to sort by
- `order`: `asc` or `desc`
- Example: `?sortBy=date&order=desc`

---

## Date Formats

All dates use ISO 8601 format:

- **Full datetime:** `2024-03-31T10:30:00Z`
- **Date only:** `2024-03-31`

Timezone: All times are in UTC unless specified otherwise.

---

## Caching Strategy

Recommended cache durations:

| Endpoint Type | Cache Duration |
|--------------|----------------|
| Dashboard Stats | 5 minutes |
| Analytics Data | 15 minutes |
| Vendor Performance | 30 minutes |
| Requirements List | 2 minutes |
| Purchase Orders | 2 minutes |
| Pending Approvals | 1 minute |

Use `Cache-Control` headers for optimal performance:

```http
Cache-Control: public, max-age=300
```

---

## Best Practices

### 1. Authentication
- Always include Bearer token in Authorization header
- Refresh tokens before expiry
- Store tokens securely

### 2. Error Handling
- Check `success` field in response
- Handle all HTTP status codes appropriately
- Display user-friendly error messages

### 3. Performance
- Use pagination for large datasets
- Implement caching for frequently accessed data
- Batch requests when possible

### 4. Data Validation
- Validate input on client-side before API calls
- Handle validation errors gracefully
- Provide clear error messages to users

### 5. Monitoring
- Track API response times
- Monitor error rates
- Log failed requests for debugging

---

## ISO Standards Compliance

### ISO 9001 (Quality Management)
- Document approval workflows
- Track quality metrics
- Maintain audit trails

### ISO 27001 (Information Security)
- Secure authentication
- Data encryption in transit
- Access control and authorization

### ISO 14001 (Environmental Management)
- Track vendor environmental compliance
- Monitor sustainability metrics
- Document environmental certifications

---

## Support

For API support:
- **Email:** api-support@Diligince.ai
- **Documentation:** https://docs.Diligince.ai
- **Status Page:** https://status.Diligince.ai

---

## Changelog

### Version 1.0.0 (2024-03-31)
- Initial API documentation
- Core endpoints for Industry Dashboard
- Authentication and error handling standards

---

*Last Updated: March 31, 2024*
