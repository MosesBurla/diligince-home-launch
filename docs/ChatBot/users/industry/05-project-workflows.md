# Industry Project Workflows Module

## Overview
The Project Workflows module enables Industry users to track and manage projects derived from purchase orders. It provides project timelines, task management, progress tracking, and collaboration tools.

## Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| All Projects | `/dashboard/industry-workflows` | Overview of all projects |
| Active Projects | `/dashboard/workflows/active` | Currently active projects |
| Project Details | `/dashboard/industry-project-workflow/:id` | Detailed project view |
| Workflow Details | `/dashboard/workflow-details/:id` | Workflow-specific details |

## Key Features
- **Project Tracking** — Monitor project progress and completion percentage
- **Task Management** — Create, assign, and track tasks within projects
- **Timeline Visualization** — Gantt-style timeline view of project milestones
- **AI-Powered Search** — Search across project listings
- **Collaboration** — Team updates, comments, and notifications
- **Document Management** — Upload and manage project documents

## How To: View Active Projects
### Steps
1. Navigate to [Active Projects](/dashboard/workflows/active)
2. Browse the list of active projects
3. Use the AI Search Bar to find specific projects
4. Click any project to view its details at [Project Details](/dashboard/industry-project-workflow/:id)

## How To: Track Project Progress
### Steps
1. Open a project from [All Projects](/dashboard/industry-workflows)
2. View the Overview tab for overall progress percentage
3. Check the Tasks tab for individual task completion
4. Review the Timeline tab for milestone tracking
5. Check the Updates tab for recent activity

## Page Details

### All Projects
**Route:** `/dashboard/industry-workflows`
**Description:** Master list of all projects with status filters.
**Available Actions:**
- Search using AI Search Bar
- Filter by status, vendor, date range
- Sort by progress, due date
- Click any project for details

### Project Details
**Route:** `/dashboard/industry-project-workflow/:id`
**Description:** Full project view with tabs for Overview, Tasks, Timeline, Documents, and Updates.
**Available Actions:**
- View and update task statuses
- Post project updates
- Upload documents
- Track milestone completion
- Communicate with vendor

## Common Questions

**Q:** Where can I see all my projects?
**A:** Go to [All Projects](/dashboard/industry-workflows) or [Active Projects](/dashboard/workflows/active).

**Q:** How are projects created?
**A:** Projects are automatically created when a purchase order is accepted by the vendor, or can be created manually.

**Q:** How do I track progress?
**A:** Open any project from [All Projects](/dashboard/industry-workflows) and view the progress indicators on the detail page.

**Q:** Can I communicate with the vendor about a project?
**A:** Yes, use the Updates tab on the project detail page or go to [Messages](/dashboard/industry-messages).
