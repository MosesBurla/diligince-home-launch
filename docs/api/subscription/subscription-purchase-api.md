# Subscription Purchase API Documentation

## Backend Implementation Guide

This document provides complete specifications for implementing the subscription purchase system with Razorpay integration.

---

## Table of Contents

1. [Environment Configuration](#1-environment-configuration)
2. [MongoDB Collections](#2-mongodb-collections)
3. [API Endpoints](#3-api-endpoints)
4. [Razorpay Integration](#4-razorpay-integration)
5. [Webhook Handling](#5-webhook-handling)
6. [Email Integration](#6-email-integration)
7. [Error Codes](#7-error-codes)
8. [Security Considerations](#8-security-considerations)

---

## 1. Environment Configuration

### Required Environment Variables

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxx

# Payment Settings
RAZORPAY_MODE=test                    # 'test' | 'live'
RAZORPAY_AUTO_CAPTURE=true            # Auto-capture payments
RAZORPAY_CURRENCY=INR                 # Default currency

# Order Settings
ORDER_EXPIRY_MINUTES=30               # Razorpay order expiry
SELECTION_EXPIRY_DAYS=7               # Pricing selection expiry

# GST Configuration
GST_RATE=18                           # GST percentage

# App URLs
APP_URL=https://app.diligince.ai
API_URL=https://api.diligince.ai
WEBHOOK_URL=https://api.diligince.ai/api/v1/webhooks/razorpay
```

### Razorpay SDK Setup

```javascript
// config/razorpay.js
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = razorpay;
```

---

## 2. MongoDB Collections

### 2.1 subscription_orders

Stores all order attempts (successful and failed).

```javascript
// models/SubscriptionOrder.js
const subscriptionOrderSchema = new mongoose.Schema({
  // Identifiers
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  razorpayOrderId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  
  // User & Company Context
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',  // Or VendorProfile - always holds ProfileId
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userType: {
    type: String,
    enum: ['industry', 'service_vendor', 'product_vendor', 'logistics', 'professional'],
    required: true
  },
  
  // Plan Details
  plan: {
    code: { type: String, required: true },
    name: { type: String, required: true },
    tier: { 
      type: String, 
      enum: ['free', 'plus', 'pro', 'enterprise'],
      required: true 
    },
    price: { type: Number, required: true },
    priceRange: {
      min: Number,
      max: Number
    },
    billingCycle: { 
      type: String, 
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    },
    selectedPrice: { type: Number, required: true }
  },
  
  // Add-ons
  addOns: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['subscription', 'usage'] },
    price: { type: Number, required: true }
  }],
  
  // Pricing Breakdown
  pricing: {
    planAmount: { type: Number, required: true },
    addOnsAmount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    gstRate: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },  // In paise
    currency: { type: String, default: 'INR' }
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['created', 'attempted', 'paid', 'failed', 'expired', 'refunded'],
    default: 'created',
    index: true
  },
  
  // Payment Details (populated after payment)
  payment: {
    razorpayPaymentId: String,
    razorpaySignature: String,
    method: { 
      type: String, 
      enum: ['card', 'upi', 'netbanking', 'wallet'] 
    },
    bank: String,
    wallet: String,
    vpa: String,
    cardNetwork: String,
    cardLast4: String,
    capturedAt: Date,
    failureReason: String
  },
  
  // Source & Metadata
  source: {
    type: String,
    enum: ['pricing_page', 'subscription_dashboard', 'upgrade'],
    default: 'subscription_dashboard'
  },
  ipAddress: String,
  userAgent: String,
  
  // Timestamps
  expiresAt: {
    type: Date,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
subscriptionOrderSchema.index({ companyId: 1, status: 1 });
subscriptionOrderSchema.index({ status: 1, createdAt: -1 });
subscriptionOrderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 }); // Cleanup after 24h

// Generate unique order ID
subscriptionOrderSchema.statics.generateOrderId = function() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${date}-${random}`;
};

module.exports = mongoose.model('SubscriptionOrder', subscriptionOrderSchema);
```

### 2.2 subscriptions

Active subscription records.

```javascript
// models/Subscription.js
const subscriptionSchema = new mongoose.Schema({
  // Identifiers
  subscriptionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // User & Company Context (one subscription per company)
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['industry', 'service_vendor', 'product_vendor', 'logistics', 'professional'],
    required: true
  },
  
  // Current Plan
  plan: {
    code: { type: String, required: true },
    name: { type: String, required: true },
    tier: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: { type: String, default: 'monthly' }
  },
  
  // Active Add-ons
  addOns: [{
    code: String,
    name: String,
    type: { type: String, enum: ['subscription', 'usage'] },
    price: Number,
    credits: Number,
    creditsUsed: { type: Number, default: 0 },
    activatedAt: Date,
    expiresAt: Date
  }],
  
  // Billing Information
  billing: {
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    nextBillingDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'past_due', 'cancelled', 'expired', 'suspended'],
    default: 'active',
    index: true
  },
  
  // Cancellation Details
  cancellation: {
    requestedAt: Date,
    requestedBy: mongoose.Schema.Types.ObjectId,
    reason: String,
    feedback: String,
    effectiveDate: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed', 'not_applicable']
    }
  },
  
  // Plan Change History
  planHistory: [{
    plan: {
      code: String,
      name: String,
      tier: String,
      price: Number
    },
    changedAt: Date,
    changedBy: mongoose.Schema.Types.ObjectId,
    changeType: {
      type: String,
      enum: ['initial', 'upgrade', 'downgrade', 'renewal']
    },
    orderId: mongoose.Schema.Types.ObjectId
  }],
  
  // Activation
  activatedAt: Date,
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ 'billing.nextBillingDate': 1 });

// Generate unique subscription ID
subscriptionSchema.statics.generateSubscriptionId = function() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SUB-${date}-${random}`;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
```

### 2.3 subscription_transactions

All financial transactions.

```javascript
// models/SubscriptionTransaction.js
const transactionSchema = new mongoose.Schema({
  // Identifiers
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // References
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionOrder',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  
  // Transaction Details
  type: {
    type: String,
    enum: ['purchase', 'renewal', 'upgrade', 'refund', 'addon'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  
  // Amounts
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  gstAmount: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  
  // Payment Gateway
  gateway: { type: String, default: 'razorpay' },
  gatewayTransactionId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  gatewayOrderId: String,
  
  // Items
  items: [{
    type: { type: String, enum: ['plan', 'addon'] },
    code: String,
    name: String,
    amount: Number
  }],
  
  // Completion
  completedAt: Date,
  
  // Metadata
  metadata: {
    invoiceId: String,
    invoiceNumber: String,
    receiptUrl: String,
    refundReason: String,
    refundId: String
  }
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ companyId: 1, createdAt: -1 });
transactionSchema.index({ subscriptionId: 1 });

// Generate unique transaction ID
transactionSchema.statics.generateTransactionId = function() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `TXN-${date}-${random}`;
};

module.exports = mongoose.model('SubscriptionTransaction', transactionSchema);
```

---

## 3. API Endpoints

### 3.1 POST /api/v1/subscription/orders

Create a new subscription order.

**Authentication:** Required (JWT)

**Authorization:** Profile must be verified

**Request Body:**
```json
{
  "planCode": "INDUSTRY_GROWTH",
  "selectedPrice": 15000,
  "addOnCodes": ["DILIGIENCE_HUB", "AI_RECOMMENDATION_PACK"],
  "source": "subscription_dashboard"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-20250114-A1B2C",
    "razorpayOrderId": "order_NxxxxYYYYY",
    "amount": 1770000,
    "currency": "INR",
    "razorpayKeyId": "rzp_test_xxxxx",
    "prefill": {
      "name": "John Doe",
      "email": "john@company.com",
      "contact": "+919876543210"
    },
    "notes": {
      "orderId": "ORD-20250114-A1B2C",
      "planCode": "INDUSTRY_GROWTH",
      "companyId": "507f1f77bcf86cd799439011"
    },
    "expiresAt": "2025-01-14T11:30:00.000Z"
  }
}
```

**Implementation:**
```javascript
// controllers/subscriptionController.js
exports.createOrder = async (req, res, next) => {
  try {
    const { planCode, selectedPrice, addOnCodes = [], source } = req.body;
    const userId = req.user._id;
    const companyId = req.user.companyId || req.user.vendorProfileId;
    const userType = req.user.userType;

    // 1. Check verification status
    const profile = await getProfileByType(companyId, userType);
    if (profile.verificationStatus !== 'approved') {
      throw new ApiError(403, 'PROFILE_NOT_VERIFIED', 
        'Profile must be verified to purchase subscription');
    }

    // 2. Check for existing pending orders
    const existingOrder = await SubscriptionOrder.findOne({
      companyId,
      status: 'created',
      expiresAt: { $gt: new Date() }
    });
    if (existingOrder) {
      throw new ApiError(409, 'ORDER_EXISTS', 
        'An order is already pending', 
        { orderId: existingOrder.orderId });
    }

    // 3. Fetch and validate plan
    const plan = await SubscriptionPlan.findOne({ code: planCode, status: 'active' });
    if (!plan) {
      throw new ApiError(400, 'INVALID_PLAN', 'Plan not found or inactive');
    }

    // 4. Validate selected price (for range plans)
    const finalPrice = selectedPrice || plan.price;
    if (plan.priceRange) {
      if (finalPrice < plan.priceRange.min || finalPrice > plan.priceRange.max) {
        throw new ApiError(400, 'INVALID_PRICE', 'Selected price out of range');
      }
    }

    // 5. Fetch and validate add-ons
    const addOns = await SubscriptionAddOn.find({ 
      code: { $in: addOnCodes },
      status: 'active'
    });

    // 6. Calculate pricing
    const pricing = calculatePricing(finalPrice, addOns.map(a => a.price));

    // 7. Create Razorpay order
    const orderId = SubscriptionOrder.generateOrderId();
    const razorpayOrder = await razorpay.orders.create({
      amount: pricing.totalAmount,
      currency: pricing.currency,
      receipt: orderId,
      payment_capture: process.env.RAZORPAY_AUTO_CAPTURE === 'true' ? 1 : 0,
      notes: {
        orderId,
        planCode: plan.code,
        companyId: companyId.toString(),
        userId: userId.toString()
      }
    });

    // 8. Save order to database
    const order = await SubscriptionOrder.create({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      companyId,
      userId,
      userType,
      plan: {
        code: plan.code,
        name: plan.name,
        tier: plan.tier,
        price: plan.price,
        priceRange: plan.priceRange,
        billingCycle: plan.billingCycle,
        selectedPrice: finalPrice
      },
      addOns: addOns.map(a => ({
        code: a.code,
        name: a.name,
        type: a.type,
        price: a.price
      })),
      pricing,
      status: 'created',
      source,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // 9. Get user details for prefill
    const user = await User.findById(userId);

    res.status(201).json({
      success: true,
      data: {
        orderId: order.orderId,
        razorpayOrderId: razorpayOrder.id,
        amount: pricing.totalAmount,
        currency: pricing.currency,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile
        },
        notes: razorpayOrder.notes,
        expiresAt: order.expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};

function calculatePricing(planPrice, addOnPrices) {
  const gstRate = parseInt(process.env.GST_RATE) || 18;
  const planAmount = planPrice;
  const addOnsAmount = addOnPrices.reduce((sum, p) => sum + p, 0);
  const subtotal = planAmount + addOnsAmount;
  const gstAmount = Math.round(subtotal * gstRate / 100);
  const totalAmount = (subtotal + gstAmount) * 100; // Convert to paise

  return {
    planAmount,
    addOnsAmount,
    subtotal,
    gstRate,
    gstAmount,
    totalAmount,
    currency: 'INR'
  };
}
```

---

### 3.2 POST /api/v1/subscription/payments/verify

Verify payment and activate subscription.

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "razorpayOrderId": "order_NxxxxYYYYY",
  "razorpayPaymentId": "pay_NxxxxZZZZZ",
  "razorpaySignature": "xxxxxxxxxxxxxxxxxxxxxx"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "SUB-20250114-X1Y2Z",
    "status": "active",
    "plan": {
      "code": "INDUSTRY_GROWTH",
      "name": "Industry Growth"
    },
    "billing": {
      "nextBillingDate": "2025-02-14T00:00:00.000Z",
      "amount": 1770000
    },
    "transaction": {
      "transactionId": "TXN-20250114-P1Q2R",
      "receiptUrl": "https://api.diligince.ai/invoices/INV-20250114-001.pdf"
    }
  }
}
```

**Implementation:**
```javascript
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // 1. Find order
    const order = await SubscriptionOrder.findOne({ razorpayOrderId });
    if (!order) {
      throw new ApiError(404, 'ORDER_NOT_FOUND', 'Order not found');
    }

    // 2. Verify signature
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      await markOrderFailed(order, 'Invalid payment signature');
      throw new ApiError(400, 'INVALID_SIGNATURE', 'Payment verification failed');
    }

    // 3. Fetch payment details from Razorpay
    const paymentDetails = await razorpay.payments.fetch(razorpayPaymentId);

    // 4. Update order
    order.status = 'paid';
    order.payment = {
      razorpayPaymentId,
      razorpaySignature,
      method: paymentDetails.method,
      bank: paymentDetails.bank,
      wallet: paymentDetails.wallet,
      vpa: paymentDetails.vpa,
      cardNetwork: paymentDetails.card?.network,
      cardLast4: paymentDetails.card?.last4,
      capturedAt: new Date()
    };
    await order.save();

    // 5. Create or update subscription
    const subscription = await activateSubscription(order);

    // 6. Create transaction record
    const transaction = await createTransaction(order, subscription);

    // 7. Generate invoice
    const invoiceUrl = await generateInvoice(order, transaction);
    transaction.metadata.receiptUrl = invoiceUrl;
    await transaction.save();

    // 8. Send success email
    await sendPaymentSuccessEmail(order, subscription, transaction);

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.subscriptionId,
        status: subscription.status,
        plan: {
          code: subscription.plan.code,
          name: subscription.plan.name
        },
        billing: {
          nextBillingDate: subscription.billing.nextBillingDate,
          amount: order.pricing.totalAmount
        },
        transaction: {
          transactionId: transaction.transactionId,
          receiptUrl: invoiceUrl
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

async function activateSubscription(order) {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1); // Monthly billing

  // Check if subscription exists
  let subscription = await Subscription.findOne({ companyId: order.companyId });

  if (subscription) {
    // Upgrade/renewal - add to history
    subscription.planHistory.push({
      plan: subscription.plan,
      changedAt: now,
      changedBy: order.userId,
      changeType: 'upgrade',
      orderId: order._id
    });
    
    subscription.plan = order.plan;
    subscription.addOns = order.addOns.map(a => ({
      ...a,
      activatedAt: now,
      expiresAt: periodEnd
    }));
    subscription.billing = {
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      nextBillingDate: periodEnd,
      amount: order.pricing.totalAmount,
      currency: order.pricing.currency
    };
    subscription.status = 'active';
  } else {
    // New subscription
    subscription = new Subscription({
      subscriptionId: Subscription.generateSubscriptionId(),
      companyId: order.companyId,
      userId: order.userId,
      userType: order.userType,
      plan: order.plan,
      addOns: order.addOns.map(a => ({
        ...a,
        activatedAt: now,
        expiresAt: periodEnd
      })),
      billing: {
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        nextBillingDate: periodEnd,
        amount: order.pricing.totalAmount,
        currency: order.pricing.currency
      },
      status: 'active',
      activatedAt: now,
      planHistory: [{
        plan: order.plan,
        changedAt: now,
        changedBy: order.userId,
        changeType: 'initial',
        orderId: order._id
      }]
    });
  }

  await subscription.save();
  return subscription;
}
```

---

### 3.3 POST /api/v1/subscription/cancel

Cancel subscription.

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "reason": "Switching to competitor",
  "feedback": "Optional detailed feedback",
  "immediateCancel": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "SUB-20250114-X1Y2Z",
    "status": "cancelled",
    "effectiveDate": "2025-02-14T00:00:00.000Z",
    "refund": {
      "eligible": false,
      "reason": "Cancellation at end of billing period - no refund applicable"
    }
  }
}
```

---

### 3.4 GET /api/v1/subscription/current

Get current subscription.

**Authentication:** Required (JWT)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "SUB-20250114-X1Y2Z",
    "plan": {
      "code": "INDUSTRY_GROWTH",
      "name": "Industry Growth",
      "tier": "plus"
    },
    "addOns": [...],
    "billing": {...},
    "status": "active"
  }
}
```

---

### 3.5 GET /api/v1/subscription/transactions

Get transaction history.

**Authentication:** Required (JWT)

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 50)
- `type` (string: purchase, renewal, refund, addon)
- `status` (string: pending, success, failed, refunded)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

## 4. Razorpay Integration

### 4.1 Test Mode Configuration

```javascript
// Test credentials
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

// Test cards
// Success: 4111 1111 1111 1111 (any future expiry, any CVV)
// Failure: 4000 0000 0000 0002

// Test UPI
// Success: success@razorpay
// Failure: failure@razorpay
```

### 4.2 Order Creation

```javascript
const razorpayOrder = await razorpay.orders.create({
  amount: 1770000,           // Amount in paise
  currency: 'INR',
  receipt: 'ORD-20250114-ABC',
  payment_capture: 1,        // Auto-capture
  notes: {
    orderId: 'ORD-20250114-ABC',
    planCode: 'INDUSTRY_GROWTH',
    companyId: '507f1f77bcf86cd799439011'
  }
});
```

---

## 5. Webhook Handling

### 5.1 Webhook Endpoint

**POST /api/v1/webhooks/razorpay**

```javascript
// controllers/webhookController.js
const crypto = require('crypto');

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    // 1. Verify webhook signature
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('[Webhook] Invalid signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // 2. Process event
    const { event, payload } = req.body;
    console.log(`[Webhook] Received event: ${event}`);

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      case 'order.paid':
        await handleOrderPaid(payload.order.entity);
        break;
      case 'refund.created':
        await handleRefundCreated(payload.refund.entity);
        break;
      case 'refund.processed':
        await handleRefundProcessed(payload.refund.entity);
        break;
      default:
        console.log(`[Webhook] Unhandled event: ${event}`);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
```

### 5.2 Event Handlers

```javascript
async function handlePaymentCaptured(payment) {
  const order = await SubscriptionOrder.findOne({
    razorpayOrderId: payment.order_id
  });

  if (!order) {
    console.error(`[Webhook] Order not found: ${payment.order_id}`);
    return;
  }

  // Idempotency check
  if (order.status === 'paid') {
    console.log(`[Webhook] Order already processed: ${order.orderId}`);
    return;
  }

  // Update order if not already updated via verify endpoint
  order.status = 'paid';
  order.payment = {
    razorpayPaymentId: payment.id,
    method: payment.method,
    capturedAt: new Date(payment.created_at * 1000)
  };
  await order.save();

  // Activate subscription if not done
  const existingSub = await Subscription.findOne({
    companyId: order.companyId,
    'planHistory.orderId': order._id
  });

  if (!existingSub) {
    await activateSubscription(order);
  }
}

async function handlePaymentFailed(payment) {
  const order = await SubscriptionOrder.findOne({
    razorpayOrderId: payment.order_id
  });

  if (order && order.status !== 'paid') {
    order.status = 'failed';
    order.payment = {
      razorpayPaymentId: payment.id,
      failureReason: payment.error_description || 'Payment failed'
    };
    await order.save();

    // Send failure email
    await sendPaymentFailedEmail(order, payment.error_description);
  }
}
```

---

## 6. Email Integration

### 6.1 Sending Emails

```javascript
// services/emailService.js
async function sendPaymentSuccessEmail(order, subscription, transaction) {
  const user = await User.findById(order.userId);
  
  await emailService.send({
    template: 'subscription/payment-success',
    to: user.email,
    subject: `Payment Successful - Your ${subscription.plan.name} subscription is active`,
    variables: {
      user_name: user.name,
      plan_name: subscription.plan.name,
      plan_tier: subscription.plan.tier,
      amount: formatCurrency(order.pricing.totalAmount / 100),
      currency: order.pricing.currency,
      transaction_id: transaction.transactionId,
      payment_method: order.payment.method,
      card_last4: order.payment.cardLast4,
      billing_period_start: formatDate(subscription.billing.currentPeriodStart),
      billing_period_end: formatDate(subscription.billing.currentPeriodEnd),
      next_billing_date: formatDate(subscription.billing.nextBillingDate),
      invoice_url: transaction.metadata.receiptUrl,
      subscription_url: `${process.env.APP_URL}/dashboard/subscription/plans`,
      dashboard_url: `${process.env.APP_URL}/dashboard`
    }
  });
}
```

---

## 7. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `PROFILE_NOT_VERIFIED` | 403 | User profile not verified |
| `ORDER_EXISTS` | 409 | Pending order already exists |
| `INVALID_PLAN` | 400 | Plan not found or inactive |
| `INVALID_PRICE` | 400 | Selected price out of allowed range |
| `INVALID_ADDON` | 400 | Add-on not found or incompatible |
| `ORDER_NOT_FOUND` | 404 | Order not found |
| `INVALID_SIGNATURE` | 400 | Payment signature verification failed |
| `ORDER_EXPIRED` | 400 | Order has expired |
| `SUBSCRIPTION_NOT_FOUND` | 404 | No active subscription |
| `ALREADY_CANCELLED` | 400 | Subscription already cancelled |
| `RAZORPAY_ERROR` | 502 | Razorpay API error |

---

## 8. Security Considerations

1. **Never expose `RAZORPAY_KEY_SECRET`** - Only use on backend
2. **Always verify webhook signatures** - Prevent spoofed webhooks
3. **Validate amounts server-side** - Don't trust frontend calculations
4. **Use HTTPS** - Required for Razorpay
5. **Implement idempotency** - Handle duplicate webhooks
6. **Log all payment events** - For audit trail
7. **Rate limit API endpoints** - Prevent abuse
8. **Verify user ownership** - Check companyId matches

---

## Route Registration

```javascript
// routes/subscription.routes.js
const router = express.Router();
const { authenticate, verifyProfile } = require('../middleware/auth');
const subscriptionController = require('../controllers/subscriptionController');

// Order & Payment
router.post('/orders', authenticate, verifyProfile, subscriptionController.createOrder);
router.post('/payments/verify', authenticate, subscriptionController.verifyPayment);

// Subscription Management
router.get('/current', authenticate, subscriptionController.getSubscription);
router.post('/cancel', authenticate, subscriptionController.cancelSubscription);

// Transactions
router.get('/transactions', authenticate, subscriptionController.getTransactions);
router.get('/transactions/:id/invoice', authenticate, subscriptionController.downloadInvoice);

module.exports = router;

// routes/webhook.routes.js
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/razorpay', express.raw({ type: 'application/json' }), webhookController.handleRazorpayWebhook);

module.exports = router;
```
