# Service Vendor Team Management Module

## Overview
The Team module lets Service Vendors manage their team members, assign roles, and configure role-based access control (RBAC) for their organization.

## Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| Team Members | `/dashboard/team/members` | List and manage team members |
| Role Management | `/dashboard/team/roles` | Manage roles and permissions |
| Create Role | `/dashboard/team/roles/create` | Create a new custom role |
| View Role | `/dashboard/team/roles/:id` | View role details and permissions |
| Edit Role | `/dashboard/team/roles/:id/edit` | Edit role permissions |

## Key Features
- **Team Member Management** — Add, activate, deactivate team members
- **Role-Based Access Control** — Define custom roles with specific permissions
- **AI-Powered Search** — Search team member listings
- **Role Assignment** — Assign roles to team members
- **Permission Granularity** — Control access per module (view, create, edit, delete)

## How To: Add a Team Member
### Steps
1. Navigate to [Team Members](/dashboard/team/members)
2. Click "Add Member" or "Invite"
3. Enter the member's email and select a role
4. Send the invitation
5. The member appears in the team list once they accept

## How To: Create a Custom Role
### Steps
1. Go to [Role Management](/dashboard/team/roles)
2. Click "Create Role" to go to [Create Role](/dashboard/team/roles/create)
3. Enter role name and description
4. Set permissions for each module
5. Save the role

## Common Questions

**Q:** How do I manage my team?
**A:** Go to [Team Members](/dashboard/team/members) to add and manage team members.

**Q:** How do I create roles with specific permissions?
**A:** Go to [Role Management](/dashboard/team/roles) and click "Create Role."

**Q:** Can I restrict what team members can see?
**A:** Yes, use [Role Management](/dashboard/team/roles) to define granular permissions per module.
