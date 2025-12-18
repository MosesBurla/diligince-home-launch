# Troubleshooting Guide

Common issues and solutions for the Diligince.ai platform.

---

## Login Issues

### "Account not found"
**Problem**: Your email doesn't match any registered account.

**Solutions**:
1. Check for typos in email address
2. Try alternate email addresses you may have used
3. Contact your organization's admin to confirm your account
4. If new, your account may not be created yet

### "Email not verified"
**Problem**: You need to verify your email before logging in.

**Solutions**:
1. Check inbox (and spam/junk folder) for verification email
2. Click the verification link in the email
3. If link expired, click "Resend Verification" on login page
4. If you don't receive email, contact support

### "Phone not verified"
**Problem**: Phone verification is required.

**Solutions**:
1. Enter the OTP sent to your registered phone
2. If OTP not received, click "Resend Code"
3. Check if phone number is correct
4. Try again after a few minutes (network delay)

### "Invalid credentials"
**Problem**: Password doesn't match.

**Solutions**:
1. Check caps lock and keyboard language
2. Try reset password via "Forgot Password"
3. Ensure you're using the correct email

### "Account suspended"
**Problem**: Your account has been temporarily blocked.

**Solutions**:
1. Contact your organization's admin
2. Ask them to reactivate your account
3. Clarify reason for suspension

### Two-Factor Authentication not working
**Problem**: 2FA code not accepted.

**Solutions**:
1. Wait a few seconds for new code (codes expire quickly)
2. Check you're entering the most recent code
3. Ensure phone/email is accessible
4. Use a recovery code if you have one saved
5. Contact admin to reset 2FA

---

## Navigation Issues

### "Module not visible in sidebar"
**Problem**: You can't see certain modules.

**Cause**: Your role doesn't have read permission for that module.

**Solutions**:
1. Ask your admin about your role permissions
2. Request access to needed modules
3. Some modules may be disabled organization-wide

### "Page not loading"
**Problem**: Page shows blank or spinner.

**Solutions**:
1. Refresh the page (Ctrl/Cmd + R)
2. Clear browser cache
3. Try incognito/private mode
4. Try different browser
5. Check internet connection
6. Wait a few minutes and try again

### "Error 404 - Page not found"
**Problem**: The requested page doesn't exist.

**Solutions**:
1. Check URL for typos
2. Use navigation menu instead of direct URL
3. The page may have been moved or removed
4. Contact support if issue persists

---

## Requirement Issues

### "Cannot submit requirement"
**Problem**: Submit button is disabled or gives error.

**Causes & Solutions**:
1. **Required fields missing**: Fill all fields marked with *
2. **Validation error**: Check for red error messages on fields
3. **No approval matrix selected**: Select an approval matrix in Step 4
4. **Session expired**: Refresh and try again

### "Draft not saving"
**Problem**: Auto-save not working.

**Solutions**:
1. Click "Save Draft" button manually
2. Check internet connection
3. Fill at least 3 fields (auto-save triggers after 3 fields)
4. Refresh page and check Drafts section

### "Approval taking too long"
**Problem**: Requirement stuck in pending approval.

**Solutions**:
1. Check who needs to approve (view approval progress)
2. Contact the pending approver directly
3. Ask admin about approval time limits
4. Check if approver is available (not on leave)

### "Cannot edit submitted requirement"
**Problem**: Need to change requirement after submission.

**Solution**: Requirements can't be edited after submission. Ask an approver to reject it with feedback. Then edit and resubmit.

---

## Quotation Issues

### "No quotations received"
**Problem**: Requirement is published but no vendors responded.

**Solutions**:
1. Check if requirement is visible (Published status)
2. Invite specific vendors using "Invite to Quote"
3. Review requirement clarity - is it detailed enough?
4. Extend deadline if too short
5. Check category is appropriate

### "Cannot approve quotation"
**Problem**: Approve button not working or missing.

**Causes**:
1. You don't have approval permission
2. Quotation has expired
3. Quotation already processed
4. System error

**Solutions**:
1. Check your role permissions
2. Ask vendor to resubmit if expired
3. Refresh page and try again
4. Contact admin for permission issues

### "Quotation expired"
**Problem**: Quotation validity period ended.

**Solution**: Contact vendor and ask them to submit a new quotation with extended validity.

---

## Purchase Order Issues

### "Cannot create PO"
**Problem**: Unable to create PO from approved quotation.

**Causes**:
1. Quotation not fully approved
2. PO already exists for this quotation
3. Permission issues

**Solutions**:
1. Verify quotation status is "Approved"
2. Check if PO already created (search PO list)
3. Verify you have PO creation permission

### "Vendor not responding to PO"
**Problem**: PO sent but vendor hasn't accepted.

**Solutions**:
1. Follow up via Messages
2. Call vendor directly
3. Set a response deadline
4. Consider canceling and approaching another vendor

### "Milestone not updating"
**Problem**: Can't mark milestone complete.

**Causes**:
1. Previous milestone not complete
2. Proof required but not uploaded
3. Permission issues

**Solutions**:
1. Complete milestones in order
2. Upload required proof documents
3. Check with admin about permissions

---

## Document Issues

### "Document upload failed"
**Problem**: File won't upload.

**Causes**:
1. File too large (>10MB)
2. Unsupported format
3. Too many files (>5 limit)
4. Network issue

**Solutions**:
1. Compress file or reduce size
2. Convert to supported format (PDF, DOC, XLSX, PNG, JPG)
3. Remove some files and try again
4. Check internet connection

### "Document won't download"
**Problem**: Can't download attached files.

**Solutions**:
1. Check browser popup settings (allow popups)
2. Try right-click → Save As
3. Clear browser cache
4. Try different browser

---

## Performance Issues

### "Platform running slowly"
**Problem**: Pages take long to load.

**Solutions**:
1. Close unnecessary browser tabs
2. Clear browser cache and cookies
3. Disable browser extensions temporarily
4. Check internet speed
5. Try during off-peak hours

### "Session timeout"
**Problem**: Logged out unexpectedly.

**Cause**: Sessions expire after inactivity.

**Solutions**:
1. Log in again
2. Save work frequently
3. Keep browser tab active

---

## Notification Issues

### "Not receiving notifications"
**Problem**: Missing important alerts.

**Solutions**:
1. Check notification settings (Account Settings → Notifications)
2. Ensure the notification type is enabled
3. Check email spam folder
4. Verify phone number for SMS
5. Check quiet hours settings

### "Too many notifications"
**Problem**: Overwhelmed by alerts.

**Solutions**:
1. Adjust notification settings
2. Switch to daily digest mode
3. Disable non-essential notifications
4. Set quiet hours

---

## Data Issues

### "Data seems outdated"
**Problem**: Information not reflecting recent changes.

**Solutions**:
1. Refresh the page
2. Clear browser cache
3. Log out and log in again
4. Check with team if changes were saved

### "Export not working"
**Problem**: Cannot download reports.

**Solutions**:
1. Check popup blocker settings
2. Try different export format
3. Reduce data range (smaller dataset)
4. Try different browser

---

## Getting More Help

### Contact Support
- Email: support@diligince.ai
- Provide: User email, screenshot, steps to reproduce

### Contact Your Admin
For issues related to:
- Permissions
- Role changes
- Account status
- Organization settings

### Check Documentation
- [FAQ](./13-faq.md) - Common questions
- [Glossary](./14-glossary.md) - Term definitions
- Module-specific guides

---

## Related Documentation

- [Getting Started](./02-getting-started.md)
- [FAQ](./13-faq.md)
- [User Account Settings](./12-user-account-settings.md)
