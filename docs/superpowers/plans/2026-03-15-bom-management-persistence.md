# BOM Management Persistence Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current demo and in-memory runtime behavior with real Prisma/PostgreSQL persistence while keeping demo login and making the current CRUD flows fully functional.

**Architecture:** Keep the existing Next.js App Router structure and demo-login cookie flow, but move all application reads and writes to a Prisma-backed service layer. Server actions become the write boundary with server-side validation and permission checks, and BOM writes trigger purchasing regeneration inside the same database-backed flow.

**Tech Stack:** Next.js, React, TypeScript, PostgreSQL, Prisma, Zod, Vitest, Testing Library, Playwright

---

## File Structure

- `package.json`
  - Add validation dependency and any missing scripts needed for Prisma-backed verification
- `prisma/schema.prisma`
  - Confirm the current schema supports project CRUD, module CRUD, BOM CRUD, purchasing workflow persistence, and owner-only announcements and users
- `prisma/seed.ts`
  - Keep demo accounts and sample data aligned with the runtime database-backed flow
- `src/lib/db.ts`
  - Prisma client singleton
- `src/lib/auth/session.ts`
  - Keep demo cookie behavior, but resolve sessions against persisted users
- `src/lib/auth/current-user.ts`
  - Central current-user lookup and auth assertion helpers
- `src/lib/permissions.ts`
  - Shared role and assignment checks, expanded where needed for announcements, modules, and projects
- `src/lib/validators/auth.ts`
  - Demo login input validation
- `src/lib/validators/users.ts`
  - Owner-only user create/update validation
- `src/lib/validators/announcements.ts`
  - Announcement CRUD validation
- `src/lib/validators/projects.ts`
  - Project and module validation
- `src/lib/validators/bom.ts`
  - BOM create/update validation
- `src/lib/validators/purchasing.ts`
  - Purchasing workflow validation
- `src/lib/data/users.ts`
  - Prisma-backed user queries and mutations
- `src/lib/data/announcements.ts`
  - Prisma-backed announcement queries and mutations
- `src/lib/data/projects.ts`
  - Prisma-backed project, module, and project-detail reads
- `src/lib/data/bom.ts`
  - Prisma-backed BOM item queries and mutations
- `src/lib/data/purchasing.ts`
  - Prisma-backed purchasing reads and workflow updates
- `src/lib/purchasing/aggregate.ts`
  - Existing aggregation logic, updated to work cleanly with Prisma-backed inputs
- `src/lib/purchasing/sync.ts`
  - Database-backed regeneration and workflow preservation logic
- `src/server/actions/auth.ts`
  - Validate demo login and persist a session cookie for a real user record
- `src/server/actions/users.ts`
  - Owner-only user CRUD
- `src/server/actions/announcements.ts`
  - Owner-only announcement CRUD
- `src/server/actions/projects.ts`
  - Project and module CRUD plus role-based reads
- `src/server/actions/bom.ts`
  - BOM CRUD with purchasing regeneration
- `src/server/actions/purchasing.ts`
  - Purchasing workflow updates and purchasing list reads
- `src/app/(app)/dashboard/page.tsx`
  - Replace any demo-derived summaries with persisted queries
- `src/app/(app)/announcements/page.tsx`
  - Use async database reads and wire owner-only form actions
- `src/app/(app)/projects/page.tsx`
  - Load visible projects from the database
- `src/app/(app)/projects/[projectId]/page.tsx`
  - Load real project/team data with assignment-aware access checks
- `src/app/(app)/projects/[projectId]/bom/page.tsx`
  - Load real modules and BOM items and wire CRUD UI
- `src/app/(app)/projects/[projectId]/purchasing/page.tsx`
  - Load real purchasing rows and wire workflow updates
- `src/app/(app)/users/page.tsx`
  - Load real users and wire owner-only create/edit/delete behavior
- `src/components/announcements/announcement-form.tsx`
  - Replace placeholder button with working create/edit form
- `src/components/announcements/announcement-list.tsx`
  - Render real records and owner-only edit/delete controls
- `src/components/users/user-form.tsx`
  - Replace placeholder button with working owner-only form
- `src/components/users/user-table.tsx`
  - Add owner-only edit/delete controls and real persisted rows
- `src/components/projects/projects-table.tsx`
  - Support persisted project data and management actions as needed
- `src/components/projects/project-overview.tsx`
  - Render persisted metadata and owner/admin project actions
- `src/components/projects/team-list.tsx`
  - Render assigned users from persisted records
- `src/components/bom/bom-item-form.tsx`
  - Replace placeholder button with working BOM create/edit form
- `src/components/bom/module-table.tsx`
  - Render real rows, filter them, and expose module/item actions for allowed roles
- `src/components/purchasing/purchasing-workflow-form.tsx`
  - Replace placeholder button with working workflow update form
- `src/components/purchasing/purchasing-table.tsx`
  - Render persisted purchasing rows and editable workflow fields where allowed
- `tests/helpers/db.ts`
  - Test helper to reseed/reset the Prisma database between integration tests
- `tests/unit/permissions.test.ts`
  - Expand permissions for the new action boundaries
- `tests/unit/purchasing-aggregate.test.ts`
  - Keep aggregate behavior stable
- `tests/unit/purchasing-sync.test.ts`
  - Cover preservation/removal behavior against persisted row shapes
- `tests/integration/auth.test.tsx`
  - Verify demo login resolves persisted users
- `tests/integration/projects.test.tsx`
  - Verify database-backed project visibility and project detail behavior
- `tests/integration/bom-actions.test.ts`
  - Verify BOM CRUD and purchasing regeneration against the database
- `tests/integration/purchasing-actions.test.ts`
  - Verify purchaser/admin/owner workflow updates against persisted rows
- `tests/integration/users.test.ts`
  - Verify owner-only user CRUD
- `tests/integration/announcements-actions.test.ts`
  - Verify owner-only announcement CRUD
- `tests/integration/project-detail.test.tsx`
  - Verify detail pages render persisted team/module data
- `tests/e2e/app.spec.ts`
  - Update or extend the end-to-end flow for persisted CRUD

## Chunk 1: Persistence Foundation And Test Harness

### Task 1: Add Validation And Prisma Test Utilities

**Files:**
- Modify: `package.json`
- Create: `src/lib/validators/auth.ts`
- Create: `src/lib/validators/users.ts`
- Create: `src/lib/validators/announcements.ts`
- Create: `src/lib/validators/projects.ts`
- Create: `src/lib/validators/bom.ts`
- Create: `src/lib/validators/purchasing.ts`
- Create: `tests/helpers/db.ts`
- Modify: `vitest.setup.ts`
- Test: `tests/integration/seed-data.test.ts`

- [ ] **Step 1: Write the failing tests for validation and test reset helpers**

```ts
import { userInputSchema } from '@/lib/validators/users';
import { resetDatabaseForTest } from '@/../tests/helpers/db';

test('user validator rejects an invalid role', () => {
  expect(() =>
    userInputSchema.parse({
      email: 'demo@local',
      name: 'Bad Role',
      role: 'not-a-role',
    }),
  ).toThrow();
});

test('database reset helper reseeds demo users', async () => {
  const state = await resetDatabaseForTest();
  expect(state.userEmails).toContain('owner@demo.local');
});
```

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run: `pnpm vitest tests/integration/seed-data.test.ts`
Expected: FAIL because validator modules and the reset helper do not exist yet

- [ ] **Step 3: Add the minimal persistence foundation**

Implement:
- add `zod` to `package.json`
- create focused validator modules for auth, users, announcements, projects, BOM, and purchasing
- create `tests/helpers/db.ts` with a helper that clears and reseeds Prisma data using the existing seed entrypoint
- load the reset helper from `vitest.setup.ts` only where it will not break pure UI tests

- [ ] **Step 4: Run the targeted tests again**

Run: `pnpm vitest tests/integration/seed-data.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json vitest.setup.ts src/lib/validators tests/helpers/db.ts tests/integration/seed-data.test.ts
git commit -m "test: add prisma-backed validation and test helpers"
```

### Task 2: Move Demo Session Resolution To Persisted Users

**Files:**
- Modify: `src/lib/auth/session.ts`
- Modify: `src/lib/auth/current-user.ts`
- Modify: `src/server/actions/auth.ts`
- Create: `src/lib/data/users.ts`
- Test: `tests/integration/auth.test.tsx`

- [ ] **Step 1: Write the failing persisted-auth tests**

```ts
import { createDemoSession } from '@/lib/auth/session';
import { resetDatabaseForTest } from '@/../tests/helpers/db';

test('demo login resolves a persisted user by email', async () => {
  await resetDatabaseForTest();

  const session = await createDemoSession({ email: 'designer@demo.local' });

  expect(session.userEmail).toBe('designer@demo.local');
  expect(session.role).toBe('designer');
  expect(session.userId).toBeTruthy();
});
```

- [ ] **Step 2: Run the auth tests to verify they fail**

Run: `pnpm vitest tests/integration/auth.test.tsx`
Expected: FAIL because session creation still depends on in-memory demo users

- [ ] **Step 3: Implement the minimal persisted session lookup**

Implement:
- Prisma-backed user lookup helpers in `src/lib/data/users.ts`
- `createDemoSession` should read the selected user from the database by email
- `getCurrentUser` and `requireCurrentUser` should resolve a persisted user shape, not a hardcoded demo record
- keep the cookie model unchanged, but validate that the cookie refers to an existing active user

- [ ] **Step 4: Run the auth tests again**

Run: `pnpm vitest tests/integration/auth.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth/session.ts src/lib/auth/current-user.ts src/server/actions/auth.ts src/lib/data/users.ts tests/integration/auth.test.tsx
git commit -m "feat: resolve demo sessions against persisted users"
```

## Chunk 2: Replace Demo Reads With Prisma-Backed Reads

### Task 3: Replace Announcement, User, And Project Reads

**Files:**
- Create: `src/lib/data/announcements.ts`
- Create: `src/lib/data/projects.ts`
- Modify: `src/server/actions/announcements.ts`
- Modify: `src/server/actions/users.ts`
- Modify: `src/server/actions/projects.ts`
- Modify: `src/app/(app)/dashboard/page.tsx`
- Modify: `src/app/(app)/announcements/page.tsx`
- Modify: `src/app/(app)/projects/page.tsx`
- Modify: `src/app/(app)/projects/[projectId]/page.tsx`
- Modify: `src/app/(app)/users/page.tsx`
- Test: `tests/integration/projects.test.tsx`
- Test: `tests/integration/project-detail.test.tsx`
- Test: `tests/integration/dashboard.test.tsx`

- [ ] **Step 1: Write the failing read-path tests**

```ts
import { visibleProjectsForUser } from '@/server/actions/projects';
import { resetDatabaseForTest } from '@/../tests/helpers/db';

test('designer sees only assigned persisted projects', async () => {
  await resetDatabaseForTest();

  const projects = await visibleProjectsForUser({
    user: { id: 'designer-seeded-at-runtime', role: 'designer' },
  });

  expect(projects).toHaveLength(1);
  expect(projects[0]?.code).toBe('PRJ-1001');
});
```

- [ ] **Step 2: Run the project and page tests to verify they fail**

Run: `pnpm vitest tests/integration/projects.test.tsx tests/integration/project-detail.test.tsx tests/integration/dashboard.test.tsx`
Expected: FAIL because reads still come from `DEMO_*` modules and hardcoded names

- [ ] **Step 3: Implement the minimal Prisma-backed read layer**

Implement:
- `src/lib/data/announcements.ts` for announcement list reads
- `src/lib/data/projects.ts` for visible project queries, project detail queries, assigned-user lookups, and dashboard summary reads
- update action files so read helpers call the new data layer
- update pages to await async reads and pass real team names and project/module data to components

- [ ] **Step 4: Run the project and page tests again**

Run: `pnpm vitest tests/integration/projects.test.tsx tests/integration/project-detail.test.tsx tests/integration/dashboard.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/announcements.ts src/lib/data/projects.ts src/server/actions/announcements.ts src/server/actions/users.ts src/server/actions/projects.ts src/app/(app)/dashboard/page.tsx src/app/(app)/announcements/page.tsx src/app/(app)/projects/page.tsx src/app/(app)/projects/[projectId]/page.tsx src/app/(app)/users/page.tsx tests/integration/projects.test.tsx tests/integration/project-detail.test.tsx tests/integration/dashboard.test.tsx
git commit -m "feat: load app reads from prisma"
```

### Task 4: Replace BOM And Purchasing Reads

**Files:**
- Create: `src/lib/data/bom.ts`
- Create: `src/lib/data/purchasing.ts`
- Modify: `src/lib/purchasing/aggregate.ts`
- Modify: `src/server/actions/projects.ts`
- Modify: `src/server/actions/purchasing.ts`
- Modify: `src/app/(app)/projects/[projectId]/bom/page.tsx`
- Modify: `src/app/(app)/projects/[projectId]/purchasing/page.tsx`
- Modify: `src/components/bom/module-table.tsx`
- Modify: `src/components/purchasing/purchasing-table.tsx`
- Test: `tests/integration/project-detail.test.tsx`
- Test: `tests/integration/purchasing-actions.test.ts`

- [ ] **Step 1: Write the failing persisted read tests for BOM and purchasing**

```ts
import { getProjectPurchasingRows } from '@/server/actions/projects';
import { resetDatabaseForTest } from '@/../tests/helpers/db';

test('purchasing rows are derived from persisted bom items', async () => {
  await resetDatabaseForTest();

  const rows = await getProjectPurchasingRows('seeded-project-id');

  expect(rows[0]?.partNumber).toBe('CF-100');
});
```

- [ ] **Step 2: Run the BOM and purchasing tests to verify they fail**

Run: `pnpm vitest tests/integration/project-detail.test.tsx tests/integration/purchasing-actions.test.ts`
Expected: FAIL because BOM and purchasing pages still rely on demo project shapes

- [ ] **Step 3: Implement the minimal persisted BOM and purchasing reads**

Implement:
- Prisma-backed BOM module/item reads in `src/lib/data/bom.ts`
- Prisma-backed purchasing list reads in `src/lib/data/purchasing.ts`
- adapt aggregate helpers to accept Prisma-derived row inputs cleanly
- update BOM and purchasing pages/components to render persisted records, including real module filtering input state

- [ ] **Step 4: Run the BOM and purchasing tests again**

Run: `pnpm vitest tests/integration/project-detail.test.tsx tests/integration/purchasing-actions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/bom.ts src/lib/data/purchasing.ts src/lib/purchasing/aggregate.ts src/server/actions/projects.ts src/server/actions/purchasing.ts src/app/(app)/projects/[projectId]/bom/page.tsx src/app/(app)/projects/[projectId]/purchasing/page.tsx src/components/bom/module-table.tsx src/components/purchasing/purchasing-table.tsx tests/integration/project-detail.test.tsx tests/integration/purchasing-actions.test.ts
git commit -m "feat: load bom and purchasing data from prisma"
```

## Chunk 3: Implement Persisted Write Workflows

### Task 5: Implement Owner-Only User And Announcement CRUD

**Files:**
- Modify: `src/lib/permissions.ts`
- Modify: `src/lib/data/users.ts`
- Modify: `src/lib/data/announcements.ts`
- Modify: `src/server/actions/users.ts`
- Modify: `src/server/actions/announcements.ts`
- Modify: `src/components/users/user-form.tsx`
- Modify: `src/components/users/user-table.tsx`
- Modify: `src/components/announcements/announcement-form.tsx`
- Modify: `src/components/announcements/announcement-list.tsx`
- Test: `tests/integration/users.test.ts`
- Test: `tests/integration/announcements-actions.test.ts`

- [ ] **Step 1: Write the failing owner-only CRUD tests**

```ts
import { createUser } from '@/server/actions/users';
import { createAnnouncement } from '@/server/actions/announcements';

test('owner can create a persisted user', async () => {
  const user = await createUser({
    actor: { id: 'owner-id', role: 'owner' },
    input: { name: 'New Designer', email: 'new-designer@demo.local', role: 'designer' },
  });

  expect(user.email).toBe('new-designer@demo.local');
});

test('admin cannot create announcements', async () => {
  await expect(
    createAnnouncement({
      actor: { id: 'admin-id', role: 'admin' },
      input: { title: 'Blocked', body: 'Blocked' },
    }),
  ).rejects.toThrow(/authorized/i);
});
```

- [ ] **Step 2: Run the user and announcement tests to verify they fail**

Run: `pnpm vitest tests/integration/users.test.ts tests/integration/announcements-actions.test.ts`
Expected: FAIL because writes still mutate in-memory arrays and UI forms are placeholders

- [ ] **Step 3: Implement the minimal persisted owner-only CRUD**

Implement:
- owner-only create, update, and delete actions for users and announcements
- unique email validation and real persisted list refresh
- working forms and row-level controls in the users and announcements screens
- keep owner-only UI hidden or disabled for non-owners

- [ ] **Step 4: Run the user and announcement tests again**

Run: `pnpm vitest tests/integration/users.test.ts tests/integration/announcements-actions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/permissions.ts src/lib/data/users.ts src/lib/data/announcements.ts src/server/actions/users.ts src/server/actions/announcements.ts src/components/users/user-form.tsx src/components/users/user-table.tsx src/components/announcements/announcement-form.tsx src/components/announcements/announcement-list.tsx tests/integration/users.test.ts tests/integration/announcements-actions.test.ts
git commit -m "feat: add persisted user and announcement crud"
```

### Task 6: Implement Project And Module CRUD

**Files:**
- Modify: `src/lib/permissions.ts`
- Modify: `src/lib/data/projects.ts`
- Modify: `src/server/actions/projects.ts`
- Modify: `src/components/projects/projects-table.tsx`
- Modify: `src/components/projects/project-overview.tsx`
- Modify: `src/components/projects/team-list.tsx`
- Test: `tests/integration/projects.test.tsx`
- Test: `tests/integration/project-detail.test.tsx`

- [ ] **Step 1: Write the failing project/module CRUD tests**

```ts
import { createProject, createProjectModule } from '@/server/actions/projects';

test('admin can create a project with assignments', async () => {
  const project = await createProject({
    actor: { id: 'admin-id', role: 'admin' },
    input: {
      code: 'PRJ-2001',
      name: 'New Line',
      description: 'New line build',
      status: 'active',
      designerId: 'designer-id',
      purchaserId: 'purchaser-id',
    },
  });

  expect(project.code).toBe('PRJ-2001');
});

test('designer can create a module inside an assigned project', async () => {
  const module = await createProjectModule({
    actor: { id: 'designer-id', role: 'designer' },
    projectId: 'assigned-project-id',
    input: { name: 'Guarding' },
  });

  expect(module.name).toBe('Guarding');
});
```

- [ ] **Step 2: Run the project tests to verify they fail**

Run: `pnpm vitest tests/integration/projects.test.tsx tests/integration/project-detail.test.tsx`
Expected: FAIL because project/module writes are not implemented yet

- [ ] **Step 3: Implement the minimal persisted project/module CRUD**

Implement:
- owner/admin create, update, and delete project actions
- owner/admin assignment updates for designer and purchaser
- owner/admin/designer module create, rename, and delete actions with unique-name validation inside a project
- UI controls on project list/detail pages for the allowed roles

- [ ] **Step 4: Run the project tests again**

Run: `pnpm vitest tests/integration/projects.test.tsx tests/integration/project-detail.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/permissions.ts src/lib/data/projects.ts src/server/actions/projects.ts src/components/projects/projects-table.tsx src/components/projects/project-overview.tsx src/components/projects/team-list.tsx tests/integration/projects.test.tsx tests/integration/project-detail.test.tsx
git commit -m "feat: add persisted project and module crud"
```

### Task 7: Implement BOM CRUD And Purchasing Regeneration

**Files:**
- Modify: `src/lib/data/bom.ts`
- Modify: `src/lib/data/purchasing.ts`
- Modify: `src/lib/purchasing/sync.ts`
- Modify: `src/server/actions/bom.ts`
- Modify: `src/server/actions/purchasing.ts`
- Modify: `src/components/bom/bom-item-form.tsx`
- Modify: `src/components/bom/module-table.tsx`
- Modify: `src/components/purchasing/purchasing-workflow-form.tsx`
- Modify: `src/components/purchasing/purchasing-table.tsx`
- Test: `tests/unit/purchasing-sync.test.ts`
- Test: `tests/integration/bom-actions.test.ts`
- Test: `tests/integration/purchasing-actions.test.ts`

- [ ] **Step 1: Write the failing BOM/purchasing write tests**

```ts
import { createBomItem, updateBomItem, deleteBomItem } from '@/server/actions/bom';
import { updatePurchasingWorkflow } from '@/server/actions/purchasing';

test('designer creates a bom item and purchasing totals regenerate', async () => {
  const item = await createBomItem({
    actor: { id: 'designer-id', role: 'designer' },
    projectId: 'assigned-project-id',
    moduleId: 'module-id',
    input: {
      partNumber: 'CF-100',
      partDescription: 'Frame rail',
      vendor: 'Acme Metals',
      partCategory: 'fabrication',
      quantity: 3,
      price: 140,
    },
  });

  expect(item.partNumber).toBe('CF-100');
});

test('purchaser updates workflow fields on a persisted purchasing row', async () => {
  const row = await updatePurchasingWorkflow({
    actor: { id: 'purchaser-id', role: 'purchaser' },
    projectId: 'assigned-project-id',
    purchasingItemId: 'persisted-purchasing-id',
    input: {
      status: 'quoted',
      supplierSelected: 'Acme Metals',
      quotedPrice: 133.5,
      poNumber: 'PO-1001',
      notes: 'Ready for approval',
    },
  });

  expect(row.status).toBe('quoted');
});
```

- [ ] **Step 2: Run the BOM and purchasing action tests to verify they fail**

Run: `pnpm vitest tests/unit/purchasing-sync.test.ts tests/integration/bom-actions.test.ts tests/integration/purchasing-actions.test.ts`
Expected: FAIL because writes still mutate arrays/maps and do not persist or regenerate through Prisma

- [ ] **Step 3: Implement the minimal persisted BOM and purchasing writes**

Implement:
- BOM create, update, and delete actions with assignment-aware authorization
- automatic purchasing regeneration after each BOM write
- workflow preservation for matching aggregate keys in `src/lib/purchasing/sync.ts`
- persisted purchaser/admin/owner workflow updates on generated rows
- working BOM and purchasing forms plus row-level actions for allowed roles

- [ ] **Step 4: Run the BOM and purchasing action tests again**

Run: `pnpm vitest tests/unit/purchasing-sync.test.ts tests/integration/bom-actions.test.ts tests/integration/purchasing-actions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/bom.ts src/lib/data/purchasing.ts src/lib/purchasing/sync.ts src/server/actions/bom.ts src/server/actions/purchasing.ts src/components/bom/bom-item-form.tsx src/components/bom/module-table.tsx src/components/purchasing/purchasing-workflow-form.tsx src/components/purchasing/purchasing-table.tsx tests/unit/purchasing-sync.test.ts tests/integration/bom-actions.test.ts tests/integration/purchasing-actions.test.ts
git commit -m "feat: add persisted bom and purchasing workflows"
```

## Chunk 4: End-To-End Wiring And Final Verification

### Task 8: Update End-To-End Coverage For Persisted CRUD

**Files:**
- Modify: `tests/e2e/app.spec.ts`
- Modify: `playwright.config.ts`
- Test: `tests/e2e/app.spec.ts`

- [ ] **Step 1: Write the failing end-to-end expectations**

```ts
test('owner can log in, create an announcement, and see it persist in the app', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /login/i }).click();
  await page.getByLabel(/demo user/i).selectOption('owner@demo.local');
  await page.getByRole('button', { name: /continue/i }).click();
  await page.getByRole('button', { name: /create announcement/i }).click();
  await page.getByLabel(/title/i).fill('Database-backed update');
  await page.getByLabel(/body/i).fill('This announcement should come from postgres.');
  await page.getByRole('button', { name: /save announcement/i }).click();
  await expect(page.getByText('Database-backed update')).toBeVisible();
});
```

- [ ] **Step 2: Run Playwright to verify it fails**

Run: `pnpm playwright test tests/e2e/app.spec.ts`
Expected: FAIL because the current forms are placeholders and the flow is not persisted yet

- [ ] **Step 3: Finish the browser wiring**

Implement:
- ensure the seeded database is available before Playwright starts
- update the end-to-end spec to cover at least one real persisted create flow and one role-restricted flow
- make any final UI wiring adjustments needed so the browser path matches the implemented server actions

- [ ] **Step 4: Run Playwright again**

Run: `pnpm playwright test tests/e2e/app.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/app.spec.ts playwright.config.ts
git commit -m "test: cover persisted app workflows end to end"
```

### Task 9: Full Verification Before Merge

**Files:**
- Modify: any files needed from prior tasks
- Test: full test and build suite

- [ ] **Step 1: Run the unit and integration suite**

Run: `pnpm vitest run`
Expected: PASS

- [ ] **Step 2: Run the end-to-end suite**

Run: `pnpm playwright test`
Expected: PASS

- [ ] **Step 3: Run the production build**

Run: `pnpm build`
Expected: PASS

- [ ] **Step 4: Review git diff and clean up any leftover placeholders**

Run: `git status --short` and `git diff --stat`
Expected: only intentional files remain modified

- [ ] **Step 5: Commit the final cleanup if needed**

```bash
git add .
git commit -m "chore: finalize persistence pass"
```

