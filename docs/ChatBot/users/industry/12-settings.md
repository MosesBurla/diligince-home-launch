# Industry Settings Module

## Overview
The Settings module allows Industry admins to configure company profile, manage team members, define roles and permissions (RBAC), set up approval matrices, and configure notification preferences.

## Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| Company Profile | `/dashboard/industry-settings` | Company information and profile settings |
| Team Members | `/dashboard/industry-team` | Manage team members |
| Role Management | `/dashboard/role-management` | Define roles and permissions |
| Create Role | `/dashboard/role-management/create` | Create a new role |
| View Role | `/dashboard/role-management/:roleId` | View role details |
| Edit Role | `/dashboard/role-management/:roleId/edit` | Edit role permissions |
| Approval Matrix | `/dashboard/industry-approval-matrix` | Approval workflow configuration |
| Notifications | `/dashboard/industry-notifications` | Notification preferences |
| Account Settings | `/settings/account-settings` | Personal account settings |

## Key Features
- **Company Profile** — Update company name, logo, address, and details
- **Team Management** — Invite, activate, deactivate team members
- **Role-Based Access Control (RBAC)** — Create custom roles with granular permissions
- **Approval Matrix** — Configure multi-level approval workflows
- **Notification Settings** — Set email and in-app notification preferences
- **AI-Powered Search** — Search team member listings

## How To: Add a Team Member
### Steps
1. Navigate to [Team Members](/dashboard/industry-team)
2. Click "Add Member" or "Invite"
3. Enter the member's email address
4. Select a role from the dropdown
5. Assign department if applicable
6. Click "Send Invitation"
7. The member receives an email invite to join

## How To: Create a Custom Role
### Steps
1. Go to [Role Management](/dashboard/role-management)
2. Click "Create Role" to go to [Create Role](/dashboard/role-management/create)
3. Enter the role name and description
4. Configure permissions for each module (view, create, edit, delete, approve)
5. Save the role
6. The role is now available for assignment to team members

## How To: Update Company Profile
### Steps
1. Navigate to [Company Profile](/dashboard/industry-settings)
2. Update company name, logo, description, and contact information
3. Update address and industry details
4. Click "Save" to apply changes

## Page Details

### Team Members
**Route:** `/dashboard/industry-team`
**Description:** List of all team members with roles, status, and actions.
**Available Actions:**
- Search using AI Search Bar
- Filter by role, department, status
- Add new members
- Activate/deactivate members
- Change member roles

### Role Management
**Route:** `/dashboard/role-management`
**Description:** Manage custom roles and their permissions.
**Available Actions:**
- View all roles
- Create new roles
- Edit role permissions
- Delete custom roles

## Common Questions

**Q:** How do I add team members?
**A:** Go to [Team Members](/dashboard/industry-team) and click "Add Member."

**Q:** How do I create custom roles?
**A:** Go to [Role Management](/dashboard/role-management) and click "Create Role" to define permissions.

**Q:** Where do I update company information?
**A:** Visit [Company Profile](/dashboard/industry-settings) to update your company details.

**Q:** How do I change notification settings?
**A:** Go to [Notifications](/dashboard/industry-notifications) to configure your preferences.

**Q:** Where are my personal account settings?
**A:** Go to [Account Settings](/settings/account-settings) for personal profile, password, and security settings.
