# Column Header Filters Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the standalone BOM search field with per-column header filters and add the same header-filter pattern to the purchasing table.

**Architecture:** Keep filtering entirely client-side inside the table components so no route, database, or server action changes are needed. Add a small reusable filtering helper for consistent matching rules, then update the BOM module table and purchasing table to render a second header row with text inputs or dropdowns per column.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library, Playwright

---

## Chunk 1: Shared Filter Rules

### Task 1: Add a failing unit test for table filter matching

**Files:**
- Create: `src/lib/table-filters.ts`
- Create: `tests/unit/table-filters.test.ts`

- [ ] **Step 1: Write the failing test**

Add tests covering:
- case-insensitive partial matching for text filters
- exact matching for dropdown filters
- `AND` behavior when multiple filters are active
- empty filter values behaving as no filter

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/table-filters.test.ts`
Expected: FAIL because the helper does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/table-filters.ts` with a small helper that:
- normalizes cell values to strings
- performs case-insensitive partial text matching
- performs exact dropdown matching
- evaluates all active filters together

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/unit/table-filters.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/table-filters.ts tests/unit/table-filters.test.ts
git commit -m "test: cover table filter matching rules"
```

## Chunk 2: BOM Module Table Header Filters

### Task 2: Add a failing BOM table test for header filters

**Files:**
- Modify: `src/components/bom/module-table.tsx`
- Create: `tests/unit/module-table.test.tsx`

- [ ] **Step 1: Write the failing test**

Add a test that renders `ModuleTable` with multiple BOM rows and asserts that:
- the old standalone `Filter items` field is gone
- a filter control exists under each column heading
- typing into a text filter narrows rows
- selecting `Part category` from a dropdown narrows rows

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/module-table.test.tsx`
Expected: FAIL because the table still uses the old single filter field and has no header filters.

- [ ] **Step 3: Write minimal implementation**

Update `src/components/bom/module-table.tsx` so it:
- becomes a client component
- removes the standalone top-right filter input
- renders a second `<thead>` row of filter controls
- uses text inputs for `ID`, `Part number`, `Part description`, `Vendor`, `Quantity`, and `Price`
- uses a dropdown for `Part category`
- filters only that module’s rows using the shared helper

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/unit/module-table.test.tsx tests/unit/table-filters.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/bom/module-table.tsx tests/unit/module-table.test.tsx
git commit -m "feat: add bom header filters"
```

## Chunk 3: Purchasing Table Header Filters

### Task 3: Add a failing purchasing table test for header filters

**Files:**
- Modify: `src/components/purchasing/purchasing-table.tsx`
- Modify: `tests/unit/purchasing-table.test.tsx`

- [ ] **Step 1: Write the failing test**

Extend the existing purchasing table test to assert that:
- a filter control exists for every column
- `Category` and `Status` are dropdowns
- text filters hide non-matching rows
- dropdown filters hide non-matching rows

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/purchasing-table.test.tsx`
Expected: FAIL because the current table has no header filters.

- [ ] **Step 3: Write minimal implementation**

Update `src/components/purchasing/purchasing-table.tsx` so it:
- becomes a client component
- renders a second header row of per-column filters
- uses text inputs for text/number columns
- uses dropdowns for `Category` and `Status`
- filters the rendered rows with the shared helper while preserving the visible workflow columns

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/unit/purchasing-table.test.tsx tests/unit/table-filters.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/purchasing/purchasing-table.tsx tests/unit/purchasing-table.test.tsx
git commit -m "feat: add purchasing header filters"
```

## Chunk 4: Browser Verification

### Task 4: Add and verify an end-to-end filter workflow

**Files:**
- Modify: `tests/e2e/app.spec.ts`

- [ ] **Step 1: Write the failing browser test**

Add an end-to-end test that:
- logs in as a user who can reach the BOM table
- applies a BOM header filter and verifies only matching rows remain
- navigates to purchasing
- applies a purchasing header filter and verifies only matching rows remain

- [ ] **Step 2: Run test to verify it fails**

Run: `DATABASE_URL='postgresql://naim@localhost:5433/bommgmt?schema=public' SHADOW_DATABASE_URL='postgresql://naim@localhost:5433/bommgmt_shadow?schema=public' pnpm playwright test tests/e2e/app.spec.ts --grep "header filters"`
Expected: FAIL because the real UI does not yet expose those controls.

- [ ] **Step 3: Write minimal implementation adjustments if needed**

If the component work already satisfies the browser test, keep this step to any small selector or label adjustments needed for stable e2e coverage.

- [ ] **Step 4: Run targeted verification**

Run:
- `pnpm vitest run tests/unit/table-filters.test.ts tests/unit/module-table.test.tsx tests/unit/purchasing-table.test.tsx`
- `DATABASE_URL='postgresql://naim@localhost:5433/bommgmt?schema=public' SHADOW_DATABASE_URL='postgresql://naim@localhost:5433/bommgmt_shadow?schema=public' pnpm playwright test tests/e2e/app.spec.ts --grep "header filters"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/app.spec.ts
git commit -m "test: cover bom and purchasing header filters"
```

## Chunk 5: Final Verification

### Task 5: Run regression checks for the filter change

**Files:**
- Modify: `docs/superpowers/plans/2026-03-15-column-header-filters.md`

- [ ] **Step 1: Run unit tests**

Run:
- `pnpm vitest run tests/unit/table-filters.test.ts tests/unit/module-table.test.tsx tests/unit/purchasing-table.test.tsx tests/unit/purchasing-sync.test.ts`

Expected: PASS

- [ ] **Step 2: Run browser tests**

Run:
- `DATABASE_URL='postgresql://naim@localhost:5433/bommgmt?schema=public' SHADOW_DATABASE_URL='postgresql://naim@localhost:5433/bommgmt_shadow?schema=public' pnpm playwright test tests/e2e/app.spec.ts`

Expected: PASS

- [ ] **Step 3: Run production build**

Run:
- `DATABASE_URL='postgresql://naim@localhost:5433/bommgmt?schema=public' SHADOW_DATABASE_URL='postgresql://naim@localhost:5433/bommgmt_shadow?schema=public' pnpm build`

Expected: PASS when run separately from Playwright.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/plans/2026-03-15-column-header-filters.md
git commit -m "docs: mark column header filters verified"
```
