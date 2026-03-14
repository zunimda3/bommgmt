# Purchasing Table Workflow Visibility Design

## Overview

This document defines the approved fix for the purchasing page gap where workflow fields are saved but not shown back to the user in the purchasing table. The goal of this pass is to make saved purchasing workflow data visible and editable in a way that matches user expectations without changing the underlying purchasing aggregation model.

The current database model, permissions, and BOM-to-purchasing derivation stay the same. This is a focused UI and data-flow completion pass.

## Goals

- Show purchasing workflow fields directly in the purchasing table
- Make the saved workflow state visible immediately after form submission
- Pre-fill the purchasing workflow form with the selected row's current saved values
- Keep the existing role boundaries and purchasing persistence logic intact

## Non-Goals

- Redesigning the purchasing page layout
- Changing the purchasing database schema
- Converting the workflow form into inline row editing
- Changing how aggregate purchasing rows are generated from BOM

## Approved Approach

The purchasing page will continue to show:
- a read-only purchasing table for all allowed viewers
- a separate workflow form for users who can edit purchasing

The purchasing table will be expanded to include these workflow columns:
- status
- supplier selected
- quoted price
- PO number
- notes

Empty workflow values will render as a clear placeholder such as `Not set`.

## Data Flow

The page already loads the merged purchasing view, which combines:
- aggregate item data derived from BOM
- persisted purchasing workflow fields stored in the database

This pass will ensure the full merged row shape is passed through to:
- the purchasing table, so saved workflow fields are visible
- the purchasing workflow form, so the selected row's current values are used as defaults

After a successful save, the existing revalidation of the purchasing route remains the mechanism that refreshes the page and shows the updated workflow values.

## Interaction Design

### Table

Each purchasing row will show:
- part number
- description
- vendor
- category
- total quantity
- status
- supplier selected
- quoted price
- PO number
- notes

### Form

The purchaser-facing form remains the editor for workflow fields.

When the user selects a purchasing item:
- the form fields should reflect the currently saved values for that row
- new rows without saved values should fall back to the current defaults

This removes the current mismatch where the form always appears blank or reset even when workflow data already exists.

## Permissions

No permission changes are introduced.

- owner, admin, and purchaser can edit purchasing workflow when otherwise authorized
- designer remains read-only
- all allowed viewers can see workflow values in the table

## Testing

This fix should be covered by:
- a component or page-level test verifying workflow columns render current saved data
- a browser test verifying a purchaser can save workflow data and see it appear in the table after refresh

## Success Criteria

The fix is complete when:
- saved workflow values are visible in the purchasing table
- the purchasing form reflects existing saved values for the selected row
- saving workflow data produces an obvious visible change on the page
- existing role behavior remains unchanged
