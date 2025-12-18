# Dashboard Module

## What is the Dashboard?

The Dashboard is your command center in Diligince.ai. It provides a real-time overview of your procurement activities, key metrics, pending actions, and quick access to common tasks.

## Key Features

- **KPI Cards**: Quick view of important numbers
- **Procurement Analytics**: Visual charts and trends
- **Budget Overview**: Track spending against budget
- **Pending Approvals**: Items awaiting your action
- **Active Requirements**: Current procurement activities
- **Active Purchase Orders**: Ongoing POs
- **Vendor Performance**: Top performing vendors
- **Quick Actions**: Shortcuts to common tasks

---

## Dashboard Sections

### 1. Statistics Cards (KPIs)

Located at the top, showing:
- **Total Requirements**: All requirements created
- **Active Requirements**: Currently in progress
- **Pending Quotations**: Quotes awaiting review
- **Active POs**: Purchase orders in progress
- **Total Spend**: Amount spent this period
- **Budget Remaining**: Available budget

### 2. Procurement Analytics

Visual charts showing:
- Requirements by status (pie chart)
- Monthly procurement trends (line chart)
- Category-wise distribution (bar chart)
- Vendor response rates

### 3. Budget Overview

- Total allocated budget
- Amount spent
- Amount committed (in POs)
- Remaining budget
- Budget utilization percentage

### 4. Pending Approvals

Table showing items you need to act on:
- Requirement approvals
- Quotation approvals
- PO approvals
- Payment approvals

Each item shows:
- Item name/title
- Type
- Submitted by
- Submitted date
- Quick approve/reject actions

### 5. Active Requirements

List of current requirements showing:
- Requirement ID
- Title
- Category
- Status
- Created date
- Quotations received count

### 6. Active Purchase Orders

Current POs showing:
- PO number
- Vendor name
- Amount
- Status
- Progress percentage
- Due date

### 7. Top Vendors

Performance rankings showing:
- Vendor name
- Rating/score
- On-time delivery rate
- Quality rating
- Total orders completed

---

## How to Use the Dashboard

### Viewing Detailed Statistics
1. Each stat card is clickable
2. Click to navigate to the relevant module
3. Example: Click "Pending Quotations" to go to Quotations module

### Filtering Dashboard Data
1. Use the date range picker (top-right)
2. Select period: This Week, This Month, This Quarter, Custom
3. Dashboard updates to show data for selected period

### Accessing Pending Approvals
1. Find the "Pending Approvals" section
2. Click on any item to view details
3. Use quick actions to approve/reject
4. Or click to open full details page

### Refreshing Dashboard
1. Data auto-refreshes periodically
2. Click refresh icon to manually refresh
3. Last updated timestamp shown

---

## Dashboard Actions

### Quick Create Requirement
1. Click "Create Requirement" button
2. Opens the requirement creation wizard
3. Follow the 6-step process

### View All Requirements
1. Click "View All" in Active Requirements section
2. Goes to Requirements listing page
3. See all requirements with filters

### View All POs
1. Click "View All" in Active POs section
2. Goes to Purchase Orders listing page
3. See all POs with filters

### Export Dashboard Report
1. Click export icon (top-right)
2. Select format (PDF, Excel)
3. Report downloads with current data

---

## Understanding Status Colors

| Color | Meaning |
|-------|---------|
| 🟢 Green | Healthy / On Track / Completed |
| 🟡 Yellow | Needs Attention / In Progress |
| 🔴 Red | Critical / Overdue / Rejected |
| 🔵 Blue | Informational / Pending |
| ⚪ Gray | Inactive / Draft |

---

## Dashboard Metrics Explained

### Total Requirements
Count of all requirements created by your organization, regardless of status.

### Active Requirements
Requirements that are:
- Published and accepting quotes
- In evaluation phase
- Pending approval

Does NOT include: Drafts, Archived, Completed

### Pending Quotations
Quotations received from vendors that:
- Haven't been reviewed yet
- Are awaiting approval decision
- Need comparison/evaluation

### Active POs
Purchase orders that are:
- Issued but not complete
- In progress (work ongoing)
- Pending delivery/payment

### Total Spend
Sum of all payments made for completed/approved items in the selected period.

### Budget Utilization
Formula: (Amount Spent + Amount Committed) / Total Budget × 100%

---

## Common Questions

**Q: Why are my stats showing zero?**
A: This could be because:
- No data exists for the selected period
- Your role doesn't have permission to view certain data
- Data is still loading (wait a moment)

**Q: How often does the dashboard update?**
A: The dashboard auto-refreshes every 5 minutes. You can manually refresh anytime.

**Q: Can I customize what appears on my dashboard?**
A: The dashboard layout is standardized, but you can filter data by date range.

**Q: Why can't I see pending approvals?**
A: You may not have approval permissions. Contact your admin to check your role.

**Q: How do I export dashboard data?**
A: Click the export button (download icon) in the top-right corner and select your preferred format.

**Q: What does the trend arrow mean?**
A: Arrows show comparison to previous period:
- ↑ Green: Improved from last period
- ↓ Red: Declined from last period
- → Gray: No significant change

---

## Related Modules

- [Requirements Module](./04-requirements-module.md) - Manage requirements
- [Quotations Module](./05-quotations-module.md) - Handle quotations
- [Purchase Orders Module](./06-purchase-orders-module.md) - Track POs
- [Analytics Module](./09-analytics-module.md) - Detailed reports
