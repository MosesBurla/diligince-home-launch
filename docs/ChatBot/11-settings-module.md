# Settings Module

## What is the Settings Module?

The Settings Module is the configuration center for your organization on Diligince.ai. Here, administrators manage company profile, team members, roles, approval workflows, and payment settings.

## Key Features

- **Company Profile**: Organization information
- **Team Members**: Manage employees and roles
- **Role Management**: Define permissions
- **Approval Matrix**: Configure approval workflows
- **Payment Settings**: Bank account details

---

## Settings Sections

### 1. Company Profile
Basic company information and configuration.

### 2. Team Members
Add, manage, and remove team members.

### 3. Role Management
Create and configure roles with permissions.

### 4. Approval Matrix
Set up approval hierarchies.

### 5. Payment Settings
Configure bank account for payments.

---

## Company Profile

### What's in Company Profile
- **Company Name**: Your organization's legal name
- **Industry**: Business sector
- **Address**: Registered and operational addresses
- **Contact Details**: Phone, email
- **Logo**: Company logo for branding
- **Tax Information**: GST/VAT numbers
- **Description**: Company overview

### How to Edit Company Profile
1. Go to Settings → Company Profile
2. Click "Edit" button
3. Update fields as needed
4. Save changes

### Profile Visibility
Your profile is visible to:
- Vendors you engage with
- On published requirements
- In your company branding throughout platform

---

## Team Members

### What is Team Management
Manage people who can access your organization's account:
- Add new team members
- Assign roles
- Update permissions
- Remove access

### How to Add a Team Member
1. Go to Settings → Team Members
2. Click "Add Member"
3. Fill in details:
   - First Name, Last Name
   - Email (required)
   - Phone
   - Department
   - Designation
4. Select role to assign
5. Click "Create"
6. Invitation sent to new member

### What Happens After Adding
1. Member receives email invitation
2. They verify email
3. They verify phone
4. They set password
5. They can now log in

### How to Edit a Team Member
1. Find the member in the list
2. Click Actions (⋮) menu
3. Select "Edit"
4. Update information:
   - Basic info (name, department)
   - Role assignment
5. Save changes

### How to Change Member's Role
1. Find the member
2. Click Actions → Edit
3. Change role selection
4. Add reason for change (optional)
5. Save
6. Member's permissions update immediately

### How to Remove a Team Member
1. Find the member
2. Click Actions → Remove
3. Confirm removal
4. Member loses access immediately

### Team Member Statuses
| Status | Description |
|--------|-------------|
| **Active** | Full access, can log in |
| **Pending** | Invited, not yet verified |
| **Suspended** | Temporarily blocked |
| **Inactive** | Access removed |

### How to Suspend/Activate a Member
1. Find the member
2. Click Actions → Suspend (or Activate)
3. Confirm
4. Status changes immediately

---

## Role Management

### What are Roles?
Roles define what users can do on the platform. Each role has specific permissions for each module.

### Default Roles
| Role | Description |
|------|-------------|
| **Industry Admin** | Full access to everything |
| **Procurement Manager** | Manage requirements, quotes, POs |
| **Finance Manager** | View financials, approve payments |
| **Department Viewer** | View-only access |

### How to Create a Role
1. Go to Settings → Role Management
2. Click "Create Role"
3. Enter role details:
   - Role Name
   - Description
4. Configure permissions for each module:
   - Dashboard: Read ✓
   - Requirements: Read ✓, Write ✓, Edit ✓
   - Quotations: Read ✓, Write ✓
   - ... etc
5. Save role

### Permission Types
| Permission | What it allows |
|------------|----------------|
| **Read** | View content |
| **Write** | Create new items |
| **Edit** | Modify existing items |
| **Delete** | Remove items |
| **Download** | Export/download data |

### How to Edit a Role
1. Find the role
2. Click "Edit"
3. Modify permissions as needed
4. Save changes
5. All users with this role are affected

### How to Delete a Role
1. Only custom roles can be deleted
2. Reassign users first
3. Click "Delete" on the role
4. Confirm
5. Role removed

### How to Duplicate a Role
1. Find the role to copy
2. Click "Duplicate"
3. New role created with same permissions
4. Edit and customize
5. Save with new name

---

## Approval Matrix

### What is Approval Matrix?
Approval matrices define who approves requirements before publishing. They create hierarchical approval chains.

### Why Use Approval Matrix
- Ensure proper review of requirements
- Multi-level oversight
- Compliance and governance
- Audit trail

### Components
**Matrix**: Named configuration with multiple levels

**Level**: A tier in the approval chain (Level 1, Level 2, etc.)

**Approver**: Person assigned to approve at a level

### How to Create Approval Matrix
1. Go to Settings → Approval Matrix
2. Click "Create Matrix"
3. Enter name and description
4. Add levels:
   - Level 1: Department Manager
   - Level 2: Procurement Head
   - Level 3: CFO
5. For each level:
   - Add approvers
   - Mark mandatory/optional
   - Set max approval time
6. Save

### How Approval Works
```
Requirement Submitted
       ↓
   Level 1 Review → Approve → Level 2 Review → Approve → Level 3 Review → Approve
       ↓               ↓              ↓              ↓             ↓
    Reject          Reject         Reject         Reject        Reject
       ↓               ↓              ↓              ↓             ↓
   Back to Creator (with feedback)
```

### How to Edit Approval Matrix
1. Find the matrix
2. Click "Edit"
3. Modify levels and approvers
4. Save

### How to Delete/Deactivate Matrix
1. Only unused matrices can be deleted
2. Or toggle to "Inactive" status
3. Inactive matrices can't be selected for new requirements

---

## Payment Settings

### What are Payment Settings?
Configure your bank account for receiving payments and financial transactions.

### Information Stored
- Bank Name
- Account Holder Name
- Account Number
- IFSC Code
- Account Type (Savings/Current)
- Branch Name
- UPI ID (optional)
- UPI QR Code (optional)

### How to Configure Payment Settings
1. Go to Settings → Payment Settings
2. Click "Add Bank Account" or "Edit"
3. Enter bank details
4. Verify account (if required)
5. Save

### Bank Account Verification
- System may verify via micro-deposit
- Enter verification code to confirm
- Verified accounts show badge
- Verified accounts are locked (need unlock to edit)

### Editing Verified Account
1. Click "Unlock" on verified account
2. Provide reason
3. Make changes
4. Re-verify if required

---

## Common Questions

**Q: Who can access Settings?**
A: Only users with Settings module permissions, typically Industry Admins.

**Q: Can I have multiple admins?**
A: Yes, assign the Industry Admin role to multiple people.

**Q: What happens if I delete a role with users?**
A: You must reassign users to another role before deleting.

**Q: Can I have different approval matrices for different categories?**
A: Yes, create multiple matrices and select the appropriate one when creating requirements.

**Q: Is my bank information secure?**
A: Yes, financial information is encrypted and stored securely. Only authorized personnel can view.

**Q: Can team members see each other's data?**
A: Depends on role permissions. Some data is shared; some is individual.

**Q: How do I know what role a person has?**
A: View the Team Members list; role is shown for each member.

---

## Related Documentation

- [User Account Settings](./12-user-account-settings.md) - Personal settings
- [Getting Started](./02-getting-started.md) - Initial setup
- [FAQ](./13-faq.md) - Common questions
