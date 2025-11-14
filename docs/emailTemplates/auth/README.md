# Authentication & Account Management Email Templates

This folder contains all email templates related to user authentication, account security, and account management.

## 📧 Templates Overview

### 1. **welcome-email.html**
**Purpose:** Welcome new users after successful registration  
**Trigger:** User completes sign-up process  
**Variables:**
- `{{user_name}}` - User's full name
- `{{dashboard_url}}` - Link to user dashboard
- `{{help_center_url}}` - Link to help documentation
- `{{app_url}}` - Main application URL
- `{{privacy_url}}` - Privacy policy URL
- `{{terms_url}}` - Terms of service URL
- `{{current_year}}` - Current year

---

### 2. **email-verification.html**
**Purpose:** Email address verification for new accounts  
**Trigger:** User signs up and needs to verify email  
**Variables:**
- `{{user_name}}` - User's full name
- `{{verification_url}}` - One-click verification link
- `{{verification_code}}` - 6-digit verification code
- `{{app_url}}` - Main application URL
- `{{privacy_url}}` - Privacy policy URL
- `{{terms_url}}` - Terms of service URL
- `{{current_year}}` - Current year

**Expiration:** Verification link expires in 24 hours

---

### 3. **password-reset.html**
**Purpose:** Password reset request  
**Trigger:** User clicks "Forgot Password"  
**Variables:**
- `{{user_name}}` - User's full name
- `{{reset_password_url}}` - Password reset link
- `{{reset_code}}` - 6-digit reset code (alternative method)
- `{{app_url}}` - Main application URL
- `{{privacy_url}}` - Privacy policy URL
- `{{terms_url}}` - Terms of service URL
- `{{current_year}}` - Current year

**Expiration:** Reset link expires in 1 hour

---

### 4. **password-changed.html**
**Purpose:** Confirmation of successful password change  
**Trigger:** User successfully changes their password  
**Variables:**
- `{{user_name}}` - User's full name
- `{{change_date}}` - Date and time of password change
- `{{ip_address}}` - IP address from which change was made
- `{{location}}` - Approximate geographic location
- `{{dashboard_url}}` - Link to user dashboard
- `{{reset_password_url}}` - Emergency password reset link
- `{{app_url}}` - Main application URL
- `{{privacy_url}}` - Privacy policy URL
- `{{terms_url}}` - Terms of service URL
- `{{current_year}}` - Current year

**Security Note:** User is logged out of all devices after password change

---

### 5. **login-alert.html**
**Purpose:** Suspicious login notification  
**Trigger:** Login from unrecognized device/location  
**Variables:**
- `{{user_name}}` - User's full name
- `{{login_date}}` - Date and time of login
- `{{ip_address}}` - Login IP address
- `{{location}}` - Approximate geographic location
- `{{device}}` - Device type (Desktop, Mobile, Tablet)
- `{{browser}}` - Browser name and version
- `{{secure_account_url}}` - Link to secure account (change password)
- `{{view_activity_url}}` - Link to view account activity
- `{{security_settings_url}}` - Link to security settings
- `{{app_url}}` - Main application URL
- `{{privacy_url}}` - Privacy policy URL
- `{{terms_url}}` - Terms of service URL
- `{{current_year}}` - Current year

---

### 6. **account-deactivated.html**
**Purpose:** Account deactivation confirmation  
**Trigger:** User requests account deactivation  
**Variables:**
- `{{user_name}}` - User's full name
- `{{deactivation_date}}` - Date of deactivation
- `{{deletion_date}}` - Date when data will be permanently deleted (30 days)
- `{{deactivation_reason}}` - User-provided reason
- `{{reactivate_url}}` - Link to reactivate account
- `{{app_url}}` - Main application URL
- `{{privacy_url}}` - Privacy policy URL
- `{{support_url}}` - Support contact URL
- `{{current_year}}` - Current year

**Data Retention:** User data preserved for 30 days before permanent deletion

---

### 7. **account-reactivated.html**
**Purpose:** Account reactivation confirmation  
**Trigger:** User reactivates a deactivated account  
**Variables:**
- `{{user_name}}` - User's full name
- `{{reactivation_date}}` - Date of reactivation
- `{{dashboard_url}}` - Link to user dashboard
- `{{whats_new_url}}` - Link to changelog/what's new page
- `{{help_center_url}}` - Link to help documentation
- `{{app_url}}` - Main application URL
- `{{privacy_url}}` - Privacy policy URL
- `{{terms_url}}` - Terms of service URL
- `{{current_year}}` - Current year

---

### 8. **two-factor-enabled.html**
**Purpose:** Two-factor authentication (2FA) activation confirmation  
**Trigger:** User enables 2FA on their account  
**Variables:**
- `{{user_name}}` - User's full name
- `{{enabled_date}}` - Date 2FA was enabled
- `{{auth_method}}` - Authentication method (Authenticator App, SMS, Email)
- `{{backup_codes_count}}` - Number of backup codes generated
- `{{security_settings_url}}` - Link to security settings
- `{{secure_account_url}}` - Link to secure account if unauthorized
- `{{help_2fa_url}}` - Link to 2FA help guide
- `{{app_url}}` - Main application URL
- `{{privacy_url}}` - Privacy policy URL
- `{{terms_url}}` - Terms of service URL
- `{{current_year}}` - Current year

---

## 🎨 Design Specifications

### Header
- Background: `#153b60` (Dark Blue)
- Logo: "Diligince AI" text-based logo
- Padding: 30px 40px

### Body
- Background: `#ffffff` (White)
- Max Width: 600px
- Padding: 50px 40px
- Font: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)

### CTA Buttons
- Primary Color: `#153b60` (Dark Blue)
- Border Radius: 8px
- Padding: 16px 40px
- Font Weight: 600

### Footer
- Background: `#f9fafb` (Light Gray)
- Links: `#153b60` (Dark Blue)
- Copyright: `#9ca3af` (Gray)

---

## 🔗 Deep Link Patterns

All email templates support deep linking to specific app sections:

- **Dashboard:** `https://app.Diligince.ai/dashboard`
- **Security Settings:** `https://app.Diligince.ai/settings/security`
- **Account Activity:** `https://app.Diligince.ai/account/activity`
- **Help Center:** `https://help.Diligince.ai`

Alternative app protocol: `Diligince://settings/security`

---

## 📱 Responsive Design

All templates are optimized for:
- Desktop email clients (Outlook, Thunderbird)
- Webmail (Gmail, Yahoo, Outlook.com)
- Mobile devices (iOS Mail, Gmail app, Samsung Mail)

Tables are used for maximum compatibility across email clients.

---

## 🔒 Security Considerations

1. **Links:** All links should use HTTPS protocol
2. **Tokens:** Include expiration times for security links
3. **IP Tracking:** Log IP addresses for security alerts
4. **Device Info:** Capture user agent for login notifications
5. **One-time Codes:** Verification codes should be single-use only

---

## 📊 Usage Examples

### Backend Implementation (Node.js)

```javascript
const sendWelcomeEmail = async (user) => {
  const template = fs.readFileSync('./auth/welcome-email.html', 'utf8');
  
  const emailContent = template
    .replace('{{user_name}}', user.name)
    .replace('{{dashboard_url}}', `https://app.Diligince.ai/dashboard`)
    .replace('{{help_center_url}}', `https://help.Diligince.ai`)
    .replace('{{current_year}}', new Date().getFullYear());
  
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Diligince AI',
    html: emailContent
  });
};
```

### Backend Implementation (Python)

```python
def send_password_reset_email(user, reset_token):
    with open('./auth/password-reset.html', 'r') as file:
        template = file.read()
    
    reset_url = f"https://app.Diligince.ai/reset-password?token={reset_token}"
    
    email_content = template.replace('{{user_name}}', user.name)
    email_content = email_content.replace('{{reset_password_url}}', reset_url)
    email_content = email_content.replace('{{reset_code}}', generate_reset_code())
    
    send_email(
        to=user.email,
        subject='Reset Your Password - Diligince AI',
        html=email_content
    )
```

---

## 🧪 Testing Checklist

Before deploying templates to production:

- [ ] Test all variable replacements
- [ ] Verify links and CTAs work correctly
- [ ] Check rendering in major email clients
- [ ] Test mobile responsiveness
- [ ] Validate HTML (no broken tags)
- [ ] Check spam score (tools like Mail Tester)
- [ ] Test with and without images enabled
- [ ] Verify fallback text for emojis
- [ ] Test expiration logic for time-sensitive emails
- [ ] Verify proper encoding (UTF-8)

---

## 📝 Version History

- **v1.0.0** (2025-01-08): Initial release with 8 authentication templates
  - welcome-email.html
  - email-verification.html
  - password-reset.html
  - password-changed.html
  - login-alert.html
  - account-deactivated.html
  - account-reactivated.html
  - two-factor-enabled.html

---

## 🤝 Support

For questions or issues with these templates:
- Email: support@Diligince.ai
- Documentation: https://docs.Diligince.ai/email-templates
- GitHub Issues: https://github.com/Diligince-ai/templates/issues

---

**Phase 1 Complete ✅**  
*Next Phase: Requirements Workflow Templates*