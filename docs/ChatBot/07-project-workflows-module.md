# Project Workflows Module

## What is the Project Workflows Module?

The Project Workflows Module helps you track and manage ongoing projects that result from purchase orders. It provides visibility into project progress, tasks, timelines, and team collaboration.

## Key Features

- **Project Tracking**: Monitor project progress
- **Task Management**: Create and assign tasks
- **Timeline View**: Gantt-style project timeline
- **Team Collaboration**: Coordinate with stakeholders
- **Document Management**: Store project documents
- **Status Updates**: Regular progress reporting

---

## Project Statuses

| Status | Description |
|--------|-------------|
| **Planning** | Project setup in progress |
| **Active** | Work ongoing |
| **On Hold** | Temporarily paused |
| **Completed** | Project finished |
| **Cancelled** | Project terminated |

---

## How to View Projects

### Navigating to Projects
1. Click "Project Workflows" in the sidebar
2. View the projects list
3. Filter by status, vendor, date range

### Project List View
Each project shows:
- Project name
- Linked PO
- Vendor
- Status
- Progress %
- Due date

### Filtering Projects
- Status (Planning, Active, etc.)
- Vendor
- Date range
- Priority

---

## How to View Project Details

1. Click on a project in the list
2. Details page shows:

### Overview Tab
- Project name and description
- Linked PO and requirement
- Vendor information
- Timeline (start, end dates)
- Overall progress

### Tasks Tab
- List of project tasks
- Task status (To Do, In Progress, Done)
- Assignees
- Due dates

### Timeline Tab
- Visual timeline/Gantt view
- Milestone markers
- Dependencies

### Documents Tab
- Project documents
- Upload new files
- Version history

### Updates Tab
- Progress updates
- Team comments
- Activity feed

---

## How to Create a Project

### Automatic Creation
Projects are typically created automatically when:
- A PO is accepted by vendor
- Work is scheduled to begin

### Manual Creation
If you have permission:
1. Click "Create Project" button
2. Enter project details:
   - Name
   - Description
   - Link to PO (if applicable)
   - Start date
   - Expected end date
3. Add team members
4. Save

---

## How to Manage Tasks

### Viewing Tasks
1. Open project details
2. Go to Tasks tab
3. View all tasks

### Creating a Task
1. Click "Add Task"
2. Enter details:
   - Task name
   - Description
   - Assignee
   - Due date
   - Priority
3. Save

### Updating Task Status
1. Find the task
2. Change status:
   - To Do → In Progress → Done
3. Or drag-drop in Kanban view

### Task Views
- **List View**: Traditional list
- **Board View**: Kanban-style columns
- **Calendar View**: Date-based display

---

## How to Track Progress

### Progress Indicators
- **Overall Progress**: Percentage complete
- **Task Completion**: X of Y tasks done
- **Milestone Status**: Key milestones achieved

### Updating Progress
1. Update individual task statuses
2. Or set overall progress manually
3. Add progress notes

### Progress Reports
1. Click "Generate Report"
2. Select report type
3. Choose date range
4. Export as PDF or Excel

---

## How to Add Project Updates

### Posting an Update
1. Open project details
2. Go to Updates tab
3. Click "Add Update"
4. Enter your update:
   - Title
   - Description
   - Attachments (optional)
5. Post

### Update Types
- **Progress Update**: Regular status update
- **Issue Report**: Problem encountered
- **Resolution**: Issue resolved
- **Announcement**: Important notice

---

## How to Manage Documents

### Uploading Documents
1. Go to Documents tab
2. Click "Upload"
3. Select files
4. Add description
5. Upload

### Document Organization
- Create folders
- Tag documents
- Version control

### Document Types
- Project plans
- Design documents
- Meeting notes
- Deliverables
- Reports

---

## How to Collaborate with Team

### Team Members
View assigned team members:
- Project manager
- Vendor contacts
- Internal stakeholders

### Communication
- Post updates
- Comment on tasks
- Tag team members (@mention)
- Receive notifications

### Notifications
You're notified when:
- Task assigned to you
- Due date approaching
- Update posted
- Document uploaded
- Status changed

---

## Common Questions

**Q: How are projects linked to POs?**
A: When a PO is created and accepted, a project can be auto-generated or manually linked. The project inherits key details from the PO.

**Q: Can I create a project without a PO?**
A: Depends on your permissions. Some organizations require a PO link; others allow standalone projects.

**Q: Who can access project details?**
A: Team members assigned to the project, project managers, and admins. Vendors see their project view.

**Q: How do I know if a project is behind schedule?**
A: Check the timeline view. Tasks and milestones past due date are highlighted. Overall progress vs expected progress is shown.

**Q: Can I export project data?**
A: Yes, go to project details and use the Export option to download as PDF or Excel.

**Q: How do I close a project?**
A: Once all tasks are complete and deliverables accepted, change status to "Completed". This archives the project.

---

## Related Modules

- [Purchase Orders Module](./06-purchase-orders-module.md) - Source of projects
- [Messages Module](./08-messages-module.md) - Communication
- [Analytics Module](./09-analytics-module.md) - Project analytics
