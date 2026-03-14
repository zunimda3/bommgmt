# Column Header Filters Design

## Overview

This document defines the approved UI update for BOM and purchasing tables so filtering happens directly at the top of each column instead of through a separate search field. The goal is to give designers and purchasers a more useful table workflow without changing the underlying BOM or purchasing data models.

This is a table interaction change only. It does not change permissions, persistence, routing, or purchasing aggregation logic.

## Goals

- Remove the standalone BOM `Filter items` field
- Add one filter control per table column in both BOM and purchasing tables
- Use dropdown filters for enum-like columns
- Keep filtering behavior consistent for designer and purchaser views
- Keep filtering local to the current page data

## Non-Goals

- Server-side filtering
- URL-synced filter state
- Changes to BOM or purchasing database schema
- New permissions or role behavior
- Cross-module filtering for BOM across the whole page

## Approved Approach

Filtering will be implemented as client-side table behavior inside the existing table components.

Each table will render:
- the existing label header row
- a second header row containing filter controls
- a body containing only rows that match all active column filters

## BOM Table Design

Each module table filters only its own rows.

Columns and filter controls:
- `ID`: text input
- `Part number`: text input
- `Part description`: text input
- `Vendor`: text input
- `Part category`: dropdown
- `Quantity`: text input
- `Price`: text input

The current top-right `Filter items` field will be removed entirely.

## Purchasing Table Design

Columns and filter controls:
- `Part number`: text input
- `Description`: text input
- `Vendor`: text input
- `Category`: dropdown
- `Total quantity`: text input
- `Status`: dropdown
- `Supplier selected`: text input
- `Quoted price`: text input
- `PO number`: text input
- `Notes`: text input

## Matching Rules

### Text Inputs

Text filter behavior is case-insensitive partial matching against the displayed cell value.

Examples:
- typing `acme` in `Vendor` matches `Acme Metals`
- typing `152` in `Quoted price` matches `$152.75`

### Dropdowns

Dropdown filters match exact values.

Examples:
- `Part category = fabrication`
- `Status = ordered`

An empty dropdown means no filter is applied for that column.

### Combined Filters

All active filters combine with `AND` behavior.

A row remains visible only if it matches every active column filter.

## Component Boundaries

The filtering behavior should live inside the table components so it stays local and reusable:
- the BOM module table owns its own module filter state
- the purchasing table owns its own purchasing filter state

This avoids pushing transient UI-only state up into the page components.

## Permissions

No permission changes are introduced.

- designers still edit BOM only
- purchasers still edit purchasing workflow only
- owner and admin keep their current access

Filtering is purely a view feature and should be available to any role that can see the table.

## Testing

This change should be covered by:
- a BOM table test proving header filters hide and show rows correctly
- a purchasing table test proving both text and dropdown filters work
- a browser test proving a user can filter a table through header controls in the real app

## Success Criteria

The change is complete when:
- the BOM standalone filter field is removed
- both BOM and purchasing tables render header filters for every column
- enum columns use dropdown filters
- filtering works immediately without page reload
- designer and purchaser views both use the same column-filter interaction pattern
