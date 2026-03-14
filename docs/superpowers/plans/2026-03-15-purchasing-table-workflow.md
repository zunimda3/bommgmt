# Purchasing Table Workflow Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make purchasing workflow data visible in the purchasing table and keep the workflow form aligned with the currently selected saved row.

**Architecture:** Keep the existing purchasing page structure and persistence logic. Expand the view model used by the purchasing page so the table renders workflow fields and the form initializes from the selected row's existing values.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Prisma, Vitest, Playwright

---

## Chunk 1: Test And View Model Update

### Task 1: Add a failing component test for workflow column visibility

**Files:**
- Modify: `src/components/purchasing/purchasing-table.tsx`
- Create: `tests/unit/purchasing-table.test.tsx`

- [ ] **Step 1: Write the failing test**

Add a test that renders the purchasing table with a row containing saved workflow fields and asserts that:
- workflow column headers render
- row cells render `status`, `supplier selected`, `quoted price`, `PO number`, and `notes`
- empty values render a visible placeholder

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/purchasing-table.test.tsx`
Expected: FAIL because the current table only renders aggregate fields.

- [ ] **Step 3: Write minimal implementation**

Update `src/components/purchasing/purchasing-table.tsx` so it accepts the merged purchasing view row shape and renders workflow columns directly in the table.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/unit/purchasing-table.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/purchasing/purchasing-table.tsx tests/unit/purchasing-table.test.tsx
git commit -m "test: cover purchasing workflow table visibility"
```

## Chunk 2: Form Prefill And Page Wiring

### Task 2: Add a failing browser test for visible post-save workflow values

**Files:**
- Modify: `src/app/(app)/projects/[projectId]/purchasing/page.tsx`
- Modify: `src/components/purchasing/purchasing-workflow-form.tsx`
- Modify: `tests/e2e/app.spec.ts`

- [ ] **Step 1: Write the failing test**

Extend the existing purchaser flow so it:
- logs in as purchaser
- opens an assigned project's purchasing page
- saves workflow data for a purchasing row
- verifies the refreshed table shows the saved workflow values

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm playwright test tests/e2e/app.spec.ts --grep "purchasing workflow"`
Expected: FAIL because the current page does not render workflow values in the table and the form does not prefill from the selected row.

- [ ] **Step 3: Write minimal implementation**

Update the purchasing page and workflow form so:
- the page passes full merged purchasing rows into both the table and form
- the form uses the selected row's current saved values as initial field values
- the form still works for rows without existing workflow values

- [ ] **Step 4: Run targeted tests to verify they pass**

Run:
- `pnpm vitest run tests/unit/purchasing-table.test.tsx`
- `pnpm playwright test tests/e2e/app.spec.ts --grep "purchasing workflow"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/'(app)'/projects/[projectId]/purchasing/page.tsx src/components/purchasing/purchasing-workflow-form.tsx tests/e2e/app.spec.ts
git commit -m "feat: surface purchasing workflow in table"
```

## Chunk 3: Final Verification

### Task 3: Run regression verification for the purchasing flow

**Files:**
- Modify: `docs/superpowers/plans/2026-03-15-purchasing-table-workflow.md`

- [ ] **Step 1: Run unit coverage**

Run: `pnpm vitest run tests/unit/purchasing-table.test.tsx tests/unit/purchasing-sync.test.ts`
Expected: PASS

- [ ] **Step 2: Run end-to-end coverage**

Run: `pnpm playwright test tests/e2e/app.spec.ts`
Expected: PASS

- [ ] **Step 3: Run build verification**

Run: `pnpm build`
Expected: PASS when run separately from Playwright

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/plans/2026-03-15-purchasing-table-workflow.md
git commit -m "docs: mark purchasing workflow fix verified"
```
