# BOM Management System Design

## Overview

This document defines the approved v1 design for a proprietary, single-company BOM management web application. The system centralizes project material requirements so teams can see what must be purchased for each project, while enforcing role-based access for owners, admins, designers, and purchasers.

The first release includes:
- A public landing page
- A demo login page
- An authenticated internal web app
- Owner/admin project management
- Designer-managed BOM lists
- Purchaser-managed purchasing workflow on an auto-generated purchasing master list

The design is intentionally scoped for a fast, disciplined v1 that can later evolve into real authentication and multi-company support without replacing the core data model.

## Goals

- Centralize BOM and purchasing visibility for all active projects
- Give each role the correct scope of read/write access
- Make BOM the source of truth for required project items
- Generate a project purchasing master list from BOM data
- Keep the first implementation operationally simple

## Non-Goals For V1

- Multi-company or tenant support
- Real authentication or SSO
- Advanced audit history
- External ERP or procurement integrations
- Full lifecycle purchasing workflows beyond core workflow fields

## Product Scope

### Public Pages

#### Landing Page

The landing page explains the purpose of the BOM management platform, highlights the role-based workflow, and acts as the public entry point to the product. It should describe:
- Centralized project material planning
- BOM ownership by design teams
- Purchasing ownership by procurement teams
- Cross-team visibility for project execution

The page includes a clear CTA button that routes users to the login page.

#### Login Page

The login page supports demo authentication for v1. Users log in as seeded accounts rather than using production auth. Successful login routes the user into the authenticated application.

### Authenticated Application Pages

#### Dashboard

The dashboard is the default landing page after login. It surfaces:
- Current owner announcement
- Quick summary of projects relevant to the current user
- Shortcuts into project workflows

#### Announcements

The announcements section shows owner-published updates visible to all authenticated users. In v1, owner authorship is the primary content model.

#### Projects Page

The projects page lists projects visible to the current user:
- Owner sees all projects
- Admin sees all projects
- Designer sees only assigned projects
- Purchaser sees only assigned projects

Each project row links to the project detail page.

#### Project Detail

The project detail page is the central workspace entry point for a single project. It contains:
- Team list
- Project overview
- BOM section summary with navigation to the full BOM list page
- Purchasing section summary with navigation to the full purchasing list page

#### BOM List Page

The BOM page contains multiple tables, with one table per project module. Each table supports filtering. Designers can create, edit, and delete BOM items for assigned projects. Purchasers have read-only access. Owner and admin can fully manage the page.

#### Purchasing List Page

The purchasing page shows a generated master list for the project. It combines BOM data into aggregated purchasing rows. Purchasers can edit purchasing workflow fields. Designers have read-only access. Owner and admin can fully manage the page.

#### User Management

The user management page is owner-only in v1. It supports:
- Create user
- Assign role
- Assign project responsibility

This is intentionally minimal and excludes more advanced administrative controls such as password resets, audit logs, or deactivation workflows beyond a basic active flag.

## Roles And Permissions

### Owner

Owner has full access across the application:
- Manage users
- Manage announcements
- Manage projects
- Manage BOM data
- Manage purchasing workflow
- View all projects and data

Owner is the only role with access to user management in v1.

### Admin

Admin has broad operational access for project execution:
- Create, edit, and delete projects
- Assign designer and purchaser to projects
- Manage project details
- Read and write BOM data
- Read and write purchasing workflow data
- View all projects

Admin does not receive owner-only user management access in v1.

### Designer

Designer is scoped to assigned projects only:
- Read assigned projects
- Read and write BOM data for assigned projects
- Read purchasing data for assigned projects

Designer cannot edit purchasing workflow data.

### Purchaser

Purchaser is scoped to assigned projects only:
- Read assigned projects
- Read BOM data for assigned projects
- Read and write purchasing workflow data for assigned projects

Purchaser cannot edit BOM data.

## Information Architecture

### Navigation

Recommended primary navigation for v1:
- Dashboard
- Announcements
- Projects
- Users (owner only)

### User Flow

1. User lands on the landing page
2. User clicks CTA to go to login
3. User signs in using a seeded demo account
4. User enters the dashboard
5. User navigates to projects
6. User opens an available project
7. User moves into either BOM or Purchasing based on role and task

## Domain Model

### User

Fields:
- id
- name
- email
- role: owner, admin, designer, purchaser
- active status
- created at
- updated at

### Announcement

Fields:
- id
- title
- body
- created by user id
- created at
- updated at

### Project

Fields:
- id
- project code
- project name
- description
- status
- designer user id
- purchaser user id
- created by user id
- created at
- updated at

### Project Module

Fields:
- id
- project id
- module name
- display order

Each project can have many modules. BOM items belong to modules.

### BOM Item

Fields:
- id
- project module id
- item code or system-generated item id
- part number
- part description
- vendor
- part category
- quantity
- price
- created at
- updated at

Allowed part category values in v1:
- fabrication
- standard part
- modifications

### Purchasing Item

This entity represents the project purchasing master list generated from BOM data and extended with purchaser-owned workflow fields.

Base columns:
- id
- project id
- part number
- part description
- vendor
- part category
- total quantity

Purchaser workflow fields:
- status
- supplier selected
- quoted price
- PO number
- notes

Metadata:
- created at
- updated at

## Purchasing Generation Rules

### Source Of Truth

BOM items are the source of truth for required project items. Purchasing records are derived from BOM data rather than entered independently.

### Aggregation Rule

For each project, purchasing rows are generated by grouping BOM items using the following fields:
- part number
- part description
- vendor
- part category

The purchasing row total quantity is the sum of BOM quantities for rows that share the same grouping key.

### Workflow Preservation Rule

When BOM changes trigger regeneration:
- Aggregated purchasing totals are recalculated
- Purchaser workflow fields remain attached to purchasing rows that still match the same grouping key

If the grouping key changes, the system creates a new purchasing row. Workflow values from the old key are not automatically migrated in v1.

## Page Behavior

### Dashboard Behavior

- Show the current announcement feed or latest owner announcement
- Show role-relevant project summary
- Provide links to assigned or managed projects

### Projects Page Behavior

- Filter project visibility by role
- Support opening project detail from the list
- For owner and admin, include project management actions

### Project Detail Behavior

- Show assigned team members
- Show project overview content
- Show BOM summary and entry button
- Show purchasing summary and entry button

### BOM Behavior

- Multiple module tables per project
- Filtering support within module tables
- Auto-generated item IDs
- Designer can add, edit, and delete items in assigned projects
- Purchaser can view only
- Owner and admin can fully manage

### Purchasing Behavior

- Single project master list
- Generated from BOM aggregation
- Purchaser can update workflow fields only
- Designer can view only
- Owner and admin can fully manage

### User Management Behavior

- Owner creates users
- Owner assigns one of the four roles
- Owner assigns project responsibility to designer or purchaser as needed

## Edge Cases

- If a project has no assigned designer or purchaser, only owner and admin can actively manage it
- If a designer or purchaser is not assigned to a project, that project does not appear in their list
- If a project has no BOM items, the purchasing page shows a clear empty state
- If BOM regrouping changes a purchasing row key, prior purchasing workflow values do not follow automatically in v1

## Technical Recommendation

### Architecture

Use a single full-stack monolithic web application. This is the best fit for v1 because:
- The app is permission-heavy
- The workflows are primarily internal CRUD and data visibility
- Landing page and application can share one deployment target
- It keeps implementation and operations simpler than splitting frontend and backend early

### Recommended Stack

- Next.js with TypeScript
- PostgreSQL
- Prisma
- Seeded demo users for initial authentication

This stack supports fast UI development, strict typing, strong relational modeling, and a clean path to future production auth.

## Security And Authorization

V1 uses demo authentication, but authorization must still be enforced server-side. UI-level hiding is not enough. Every protected data read and write must be validated against the current user role and project assignment rules.

## Testing Strategy

### Unit Tests

- Permission evaluation by role
- Project visibility filtering
- BOM to purchasing aggregation
- Preservation of purchaser workflow fields during BOM regeneration

### Integration Tests

- Demo login flow
- Owner-only user management access
- Admin project creation and editing
- Designer BOM editing for assigned projects
- Purchaser purchasing workflow updates for assigned projects
- Read-only behavior for disallowed actions

### Page-Level Coverage

Include baseline coverage for:
- Landing page
- Login page
- Dashboard
- Projects page
- Project detail page
- BOM list page
- Purchasing list page

## Future Expansion

The design should leave room for:
- Multi-company support
- Real authentication and SSO
- Deeper purchasing lifecycle fields
- Audit history
- Procurement or ERP integrations

These are not part of the first implementation plan and should not expand v1 scope.
