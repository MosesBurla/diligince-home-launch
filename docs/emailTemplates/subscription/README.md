# Subscription Email Templates

This directory contains email templates for subscription-related notifications.

## Template Variables

All templates have access to these common variables:
- `{{user_name}}` - User's full name
- `{{user_email}}` - User's email address
- `{{company_name}}` - Company name
- `{{support_email}}` - Support email address
- `{{dashboard_url}}` - Link to user dashboard
- `{{current_year}}` - Current year for footer

---

## Templates

### 1. payment-success.html

**Trigger:** Payment successfully captured and verified

**Variables:**
```
{{plan_name}}        - Name of the subscription plan
{{plan_tier}}        - Tier level (Plus, Pro, Enterprise)
{{amount}}           - Total amount paid (formatted with currency)
{{currency}}         - Currency code (INR)
{{transaction_id}}   - Unique transaction identifier
{{payment_method}}   - Payment method used (Card, UPI, Net Banking)
{{card_last4}}       - Last 4 digits of card (if card payment)
{{billing_period_start}} - Start date of billing period
{{billing_period_end}}   - End date of billing period
{{next_billing_date}}    - Next automatic billing date
{{invoice_url}}      - Link to download invoice PDF
{{subscription_url}} - Link to subscription dashboard
```

---

### 2. payment-failed.html

**Trigger:** Payment attempt failed

**Variables:**
```
{{plan_name}}        - Name of the plan user tried to purchase
{{amount}}           - Amount that failed to charge
{{failure_reason}}   - Human-readable failure reason
{{failure_code}}     - Technical error code
{{retry_url}}        - Link to retry payment
{{support_url}}      - Link to contact support
{{attempt_date}}     - Date and time of failed attempt
{{order_id}}         - Order ID for reference
```

---

### 3. subscription-activated.html

**Trigger:** First-time subscription activation (new customer)

**Variables:**
```
{{plan_name}}        - Name of the subscription plan
{{plan_tier}}        - Tier level
{{plan_features}}    - HTML list of plan features
{{billing_cycle}}    - Monthly or Yearly
{{amount}}           - Subscription amount
{{activated_at}}     - Activation timestamp
{{expires_at}}       - Subscription expiry date
{{getting_started_url}} - Link to getting started guide
{{team_invite_url}}  - Link to invite team members
```

---

### 4. subscription-renewed.html

**Trigger:** Successful auto-renewal of subscription

**Variables:**
```
{{plan_name}}        - Name of the subscription plan
{{amount}}           - Renewal amount charged
{{previous_period_end}} - Previous billing period end date
{{new_period_start}}    - New billing period start date
{{new_period_end}}      - New billing period end date
{{next_billing_date}}   - Next renewal date
{{transaction_id}}      - Transaction ID
{{invoice_url}}         - Link to invoice
{{manage_subscription_url}} - Link to manage subscription
```

---

### 5. subscription-cancelled.html

**Trigger:** User initiates subscription cancellation

**Variables:**
```
{{plan_name}}        - Name of the cancelled plan
{{effective_date}}   - When cancellation takes effect
{{access_until}}     - Last day of access
{{reason}}           - Cancellation reason (if provided)
{{refund_eligible}}  - Boolean - whether refund is applicable
{{refund_amount}}    - Refund amount (if applicable)
{{refund_status}}    - Refund processing status
{{reactivate_url}}   - Link to reactivate subscription
{{feedback_url}}     - Link to provide feedback
```

---

### 6. subscription-expiring.html

**Trigger:** 7 days before subscription expires (renewal reminder)

**Variables:**
```
{{plan_name}}        - Current plan name
{{expires_at}}       - Expiration date
{{days_remaining}}   - Number of days until expiry
{{renewal_amount}}   - Amount for renewal
{{auto_renew}}       - Boolean - whether auto-renew is enabled
{{payment_method}}   - Current payment method on file
{{renew_url}}        - Link to renew manually
{{update_payment_url}} - Link to update payment method
```

---

### 7. subscription-expired.html

**Trigger:** Subscription has expired

**Variables:**
```
{{plan_name}}        - Expired plan name
{{expired_at}}       - Expiration date
{{features_lost}}    - HTML list of features no longer available
{{data_retention_days}} - Days until data is archived
{{reactivate_url}}   - Link to reactivate
{{plans_url}}        - Link to view available plans
{{export_data_url}}  - Link to export data before deletion
```

---

### 8. upgrade-success.html

**Trigger:** User upgrades to a higher tier plan

**Variables:**
```
{{old_plan_name}}    - Previous plan name
{{new_plan_name}}    - New upgraded plan name
{{new_plan_tier}}    - New tier level
{{prorated_amount}}  - Prorated charge for upgrade
{{new_features}}     - HTML list of new features gained
{{effective_date}}   - When upgrade takes effect
{{next_billing_amount}} - New billing amount
{{next_billing_date}}   - Next billing date
```

---

### 9. downgrade-scheduled.html

**Trigger:** User schedules a downgrade (takes effect at period end)

**Variables:**
```
{{current_plan_name}} - Current plan name
{{new_plan_name}}     - Plan user is downgrading to
{{effective_date}}    - When downgrade takes effect
{{features_losing}}   - HTML list of features being lost
{{current_period_end}} - End of current billing period
{{cancel_downgrade_url}} - Link to cancel the scheduled downgrade
```

---

### 10. refund-processed.html

**Trigger:** Refund has been processed

**Variables:**
```
{{refund_amount}}    - Amount refunded
{{original_amount}}  - Original payment amount
{{refund_type}}      - Full or Partial
{{refund_reason}}    - Reason for refund
{{refund_id}}        - Refund transaction ID
{{payment_method}}   - Refund destination (original payment method)
{{processing_time}}  - Expected time for refund to reflect
{{original_transaction_id}} - Original payment transaction ID
```

---

## Email Template Structure

Each template should follow this structure:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{email_subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <!-- Header with logo -->
  <div style="background: #153b60; padding: 20px; text-align: center;">
    <img src="{{logo_url}}" alt="Diligince" height="40">
  </div>
  
  <!-- Main content -->
  <div style="max-width: 600px; margin: 0 auto; padding: 30px;">
    <h1 style="color: #153b60;">{{heading}}</h1>
    
    <!-- Template-specific content -->
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{cta_url}}" style="background: #153b60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
        {{cta_text}}
      </a>
    </div>
  </div>
  
  <!-- Footer -->
  <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>© {{current_year}} Diligince. All rights reserved.</p>
    <p>
      <a href="{{privacy_url}}">Privacy Policy</a> | 
      <a href="{{terms_url}}">Terms of Service</a> |
      <a href="{{unsubscribe_url}}">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
```

---

## Backend Integration

### Email Service Call

```javascript
// Example usage in subscription service
await emailService.send({
  template: 'subscription/payment-success',
  to: user.email,
  subject: 'Payment Successful - Your subscription is active',
  variables: {
    user_name: user.name,
    plan_name: subscription.plan.name,
    amount: formatCurrency(transaction.amount),
    transaction_id: transaction.transactionId,
    // ... other variables
  }
});
```

### Seeder Update

Add to email template seeder:

```javascript
const subscriptionTemplates = [
  {
    name: 'payment-success',
    category: 'subscription',
    subject: 'Payment Successful - Your {{plan_name}} subscription is active',
    path: 'subscription/payment-success.html'
  },
  {
    name: 'payment-failed',
    category: 'subscription',
    subject: 'Payment Failed - Action Required',
    path: 'subscription/payment-failed.html'
  },
  // ... add all 10 templates
];
```
