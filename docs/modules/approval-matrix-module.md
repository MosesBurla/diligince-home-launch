# Approval Matrix Module - Understanding Document

## Overview

The Approval Matrix module is a critical component of the procurement workflow system that enables organizations to define and manage approval hierarchies for requirement publishing. It provides a flexible framework for creating multi-level approval processes with configurable approvers at each stage.

---

## Purpose

### Business Objectives
1. **Standardize Approval Processes**: Create consistent approval workflows across the organization
2. **Ensure Compliance**: Maintain audit trails and enforce approval policies
3. **Flexibility**: Support multiple approval scenarios based on requirement type, value, or department
4. **Accountability**: Define clear responsibility chains with mandatory and optional approvers
5. **Efficiency**: Reduce bottlenecks by defining backup approvers and parallel approval paths

---

## Core Concepts

### 1. Approval Matrix
An approval matrix is a named template that defines:
- Sequential approval levels
- Approvers assigned to each level
- Whether each approver is mandatory or optional
- Time limits for each approval stage
- Priority and default settings

### 2. Approval Levels
Each matrix consists of one or more levels:
- **Order**: Sequential number (1, 2, 3, etc.)
- **Name**: Descriptive level name (e.g., "Department Head Approval")
- **Description**: Purpose of this approval stage
- **Max Time**: Maximum hours allowed for approval
- **Required**: Whether this level must be completed
- **Approvers**: Team members who can approve at this level

### 3. Level Approvers
Each level has one or more assigned approvers:
- **Member**: Reference to a company team member
- **Mandatory**: Whether this specific approver must approve
- **Optional**: If false, any approver in the level can approve
- **Sequence**: Order of preference for approvers

---

## How It Works

### Matrix Creation Workflow

1. **Define Basic Info**
   - Create matrix name (e.g., "Standard Procurement Approval")
   - Add description explaining when to use this matrix
   - Set priority (determines default selection order)
   - Mark as default if applicable

2. **Configure Levels**
   - Add approval levels in sequential order
   - Define level name and description
   - Set maximum approval time (in hours)
   - Mark level as required or optional

3. **Assign Approvers**
   - Select team members for each level
   - Mark each approver as mandatory or optional
   - Define sequence/preference order
   - Members can be assigned to multiple levels

4. **Activate Matrix**
   - Review complete configuration
   - Activate matrix for use
   - Can be set as default matrix

### Matrix Usage in Requirement Publishing

```
Requirement Created → Matrix Selected → Workflow Initiated
                                              ↓
                                         Level 1 Approvers Notified
                                              ↓
                                    Mandatory Approvers Must Approve
                                    Optional Approvers Can Approve
                                              ↓
                                    All Mandatory Approvals Received
                                              ↓
                                         Level 2 Approvers Notified
                                              ↓
                                            (Repeat)
                                              ↓
                                    All Levels Completed → Requirement Published
```

### Approval Logic

**For Each Level:**
1. All **mandatory approvers** must approve
2. At least one **optional approver** should approve (if any exist)
3. If time limit exceeded, escalation occurs
4. Once level completes, move to next level
5. If any approver rejects, entire workflow fails

**Parallel Approvals:**
- Within a level, approvers work in parallel
- No need to wait for sequence unless specified
- First to approve moves the workflow forward (if optional)

---

## Key Features

### 1. Multiple Matrices
- Create different matrices for different scenarios
- Example matrices:
  - "Quick Approval" (1 level for low-value items)
  - "Standard Approval" (2-3 levels for regular procurement)
  - "Executive Approval" (4+ levels for high-value items)

### 2. Default Matrix
- One matrix can be marked as default
- Automatically suggested when publishing requirements
- Can be overridden by user

### 3. Priority System
- Lower number = higher priority
- Used to suggest matrices in order
- Helps users select appropriate matrix

### 4. Matrix Status
- **Active**: Available for use in workflows
- **Inactive**: Cannot be selected for new workflows
- Existing workflows using inactive matrices continue

### 5. Statistics Tracking
- Total workflows using this matrix
- Completed vs. active workflows
- Average approval time
- Approver performance metrics

---

## User Roles & Permissions

### Industry Admin
- Create, edit, delete matrices
- Assign any company member as approver
- Toggle matrix status
- Export matrix data
- View all statistics

### Department Managers
- View matrices
- Suggest changes (if permission granted)
- View statistics for their department

### Team Members
- View matrices they're assigned to
- Receive notifications when assigned as approver
- Cannot modify matrices

---

## Business Rules

### Matrix Validation
1. **Name Uniqueness**: No two matrices can have the same name
2. **Minimum Levels**: At least one level required
3. **Mandatory Approvers**: Each level needs at least one mandatory approver
4. **Sequential Ordering**: Levels must be numbered sequentially (1, 2, 3...)
5. **Time Limits**: Must be between 1 hour and 30 days
6. **Member Status**: Only active members can be assigned

### Matrix Lifecycle
1. **Creation**: Matrix created in inactive state
2. **Activation**: Admin activates after review
3. **Usage**: Used in requirement workflows
4. **Modification**: Can be edited if no active workflows
5. **Deactivation**: Can be deactivated if no active workflows
6. **Deletion**: Can be deleted if no workflows (active or historical)

### Default Matrix Rules
1. Only one matrix can be default at a time
2. Setting a matrix as default removes default from others
3. Default matrix must be active
4. Cannot deactivate the default matrix without setting another

---

## Integration Points

### With Team Members Module
- Pulls list of active company members
- Displays member role, department, designation
- Validates member status before assignment
- Updates when member status changes

### With Requirements Module
- Matrix selected during requirement creation
- Initiates approval workflow when requirement submitted
- Tracks approval progress through levels
- Notifies approvers at each stage

### With Role Management Module
- Respects permission system
- Only authorized users can manage matrices
- Audit logs track all changes
- Role-based access to features

### With Analytics Module
- Tracks matrix usage statistics
- Reports on approval times
- Identifies bottlenecks
- Approver performance metrics

---

## Common Scenarios

### Scenario 1: Simple Two-Level Approval
```
Level 1: Department Head (Mandatory)
Level 2: Finance Manager (Mandatory)
```
**Use Case**: Standard procurement under $10,000

### Scenario 2: Multi-Approver Level
```
Level 1: Any Department Manager (At least 1 required)
  - Approver A (Optional)
  - Approver B (Optional)
  - Approver C (Optional)
Level 2: Finance Head (Mandatory)
```
**Use Case**: Department has multiple managers, any can approve

### Scenario 3: Executive Approval Chain
```
Level 1: Department Head (Mandatory)
Level 2: Procurement Manager (Mandatory)
Level 3: Finance Manager (Mandatory)
Level 4: CFO (Optional)
Level 5: CEO (Mandatory if amount > $100,000)
```
**Use Case**: High-value procurement with executive oversight

---

## Best Practices

### Matrix Design
1. **Keep It Simple**: Don't create unnecessarily complex matrices
2. **Clear Names**: Use descriptive names that indicate purpose
3. **Reasonable Time Limits**: Allow enough time but maintain urgency
4. **Backup Approvers**: Include optional approvers for redundancy
5. **Regular Review**: Periodically review and update matrices

### Approver Assignment
1. **Avoid Single Points of Failure**: Have backup approvers
2. **Balance Workload**: Don't overload specific members
3. **Consider Availability**: Account for holidays, leaves
4. **Authority Alignment**: Assign appropriate authority levels
5. **Cross-Training**: Ensure knowledge transfer

### Usage Guidelines
1. **Select Appropriate Matrix**: Choose based on requirement type/value
2. **Monitor Progress**: Track workflows for delays
3. **Escalate When Needed**: Don't wait indefinitely
4. **Document Decisions**: Keep audit trails
5. **Continuous Improvement**: Learn from workflow data

---

## Technical Notes

### Data Storage
- Matrices stored in MongoDB collections
- Versioning enabled for audit trails
- Soft delete for historical reference
- Indexes on name, priority, isDefault

### Performance Considerations
- Cache active matrices in memory
- Lazy load approver details
- Paginate large approver lists
- Optimize queries with proper indexes

### Security
- Permission checks on all operations
- Validate member assignments
- Prevent privilege escalation
- Audit all changes

---

## Future Enhancements

1. **Conditional Logic**: Rules-based matrix selection
2. **Auto-Escalation**: Automatic escalation after time limit
3. **Delegation**: Temporary delegation of approval authority
4. **Templates**: Industry-specific matrix templates
5. **AI Suggestions**: Suggest optimal matrix based on requirement
6. **Mobile Support**: Approve from mobile devices
7. **Integration**: Connect with external approval systems

---

## Support & Troubleshooting

### Common Issues

**Issue**: Cannot delete matrix
- **Cause**: Active or historical workflows exist
- **Solution**: Archive workflows or mark matrix as inactive

**Issue**: Approver not receiving notifications
- **Cause**: Member status inactive or email unverified
- **Solution**: Verify member status and email verification

**Issue**: Workflow stuck at level
- **Cause**: All approvers unavailable
- **Solution**: Add backup approvers or enable delegation

**Issue**: Cannot set as default
- **Cause**: Another matrix already default
- **Solution**: Remove default from other matrix first
