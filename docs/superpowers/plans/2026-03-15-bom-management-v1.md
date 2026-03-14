# BOM Management V1 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working version of a proprietary BOM management web app with a landing page, demo login, role-based access control, project views, BOM editing, derived purchasing lists, announcements, and owner-only user management.

**Architecture:** Use a single Next.js App Router application with TypeScript, PostgreSQL, and Prisma. Keep authentication simple for v1 by using seeded demo users and cookie-backed sessions, while enforcing authorization on the server for every protected read and write.

**Tech Stack:** Next.js, React, TypeScript, PostgreSQL, Prisma, Vitest, Testing Library, Playwright, Tailwind CSS

---

## File Structure

Create the app with focused units. Do not collapse everything into a small number of oversized files.

- `package.json`
  - Dependencies, scripts, package manager metadata
- `next.config.ts`
  - Next.js configuration
- `tsconfig.json`
  - TypeScript settings
- `postcss.config.js`
  - Tailwind/PostCSS setup
- `tailwind.config.ts`
  - Design tokens and Tailwind config
- `prisma/schema.prisma`
  - Database schema for users, sessions, projects, modules, BOM items, purchasing items, announcements
- `prisma/seed.ts`
  - Seed demo users, demo announcements, and sample projects
- `src/lib/db.ts`
  - Prisma client singleton
- `src/lib/auth/session.ts`
  - Cookie session helpers
- `src/lib/auth/current-user.ts`
  - Current user lookup and access assertions
- `src/lib/permissions.ts`
  - Central role and project-scope authorization rules
- `src/lib/purchasing/aggregate.ts`
  - BOM-to-purchasing aggregation logic
- `src/lib/purchasing/sync.ts`
  - Persistence layer for regeneration while preserving purchaser workflow fields
- `src/lib/validators/*.ts`
  - Zod schemas for forms and server actions
- `src/app/layout.tsx`
  - Root shell
- `src/app/page.tsx`
  - Landing page
- `src/app/login/page.tsx`
  - Demo login UI
- `src/app/(app)/layout.tsx`
  - Authenticated app layout and nav
- `src/app/(app)/dashboard/page.tsx`
  - Dashboard
- `src/app/(app)/announcements/page.tsx`
  - Announcement list
- `src/app/(app)/projects/page.tsx`
  - Project list
- `src/app/(app)/projects/[projectId]/page.tsx`
  - Project detail
- `src/app/(app)/projects/[projectId]/bom/page.tsx`
  - BOM list page
- `src/app/(app)/projects/[projectId]/purchasing/page.tsx`
  - Purchasing list page
- `src/app/(app)/users/page.tsx`
  - Owner-only user management
- `src/components/marketing/*`
  - Landing page sections
- `src/components/app-shell/*`
  - Shared authenticated shell/nav/header
- `src/components/projects/*`
  - Project list/detail sections
- `src/components/bom/*`
  - BOM module tables and forms
- `src/components/purchasing/*`
  - Purchasing master list and workflow edit controls
- `src/components/users/*`
  - User management form/table
- `src/components/ui/*`
  - Reusable internal UI primitives only as needed
- `src/server/actions/*.ts`
  - Server actions for login, logout, projects, BOM, purchasing, announcements, users
- `tests/unit/permissions.test.ts`
  - Permission behavior
- `tests/unit/purchasing-aggregate.test.ts`
  - Aggregation rules
- `tests/unit/purchasing-sync.test.ts`
  - Workflow preservation during regeneration
- `tests/integration/auth.test.tsx`
  - Login/session behavior
- `tests/integration/projects.test.tsx`
  - Role-based project visibility
- `tests/integration/bom-actions.test.ts`
  - BOM CRUD authorization and sync behavior
- `tests/integration/purchasing-actions.test.ts`
  - Purchasing workflow authorization
- `tests/integration/users.test.ts`
  - Owner-only user management behavior
- `tests/e2e/app.spec.ts`
  - End-to-end path through landing, login, projects, BOM, purchasing

## Chunk 1: Bootstrap The Application

### Task 1: Scaffold Next.js And Tooling

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Test: `tests/integration/smoke.test.tsx`

- [ ] **Step 1: Write the failing smoke test**

```tsx
import { render, screen } from '@testing-library/react';
import RootLayout from '@/app/layout';

test('root layout renders app children', () => {
  render(
    <RootLayout>
      <div>child content</div>
    </RootLayout>,
  );

  expect(screen.getByText('child content')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/smoke.test.tsx`
Expected: FAIL because the app scaffold and test config do not exist yet

- [ ] **Step 3: Create the minimal project scaffold**

Implement:
- `package.json` scripts for `dev`, `build`, `lint`, `test`, `test:e2e`, `db:seed`
- Next.js App Router baseline files
- Vitest config and module alias setup
- Tailwind base styling setup

- [ ] **Step 4: Run the smoke test to verify it passes**

Run: `pnpm vitest tests/integration/smoke.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.js tailwind.config.ts src/app tests/integration/smoke.test.tsx
git commit -m "chore: scaffold nextjs app foundation"
```

### Task 2: Add Shared Design Tokens And Internal App Shell Base

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/app-shell/app-shell.tsx`
- Create: `src/components/app-shell/nav.tsx`
- Test: `tests/integration/app-shell.test.tsx`

- [ ] **Step 1: Write the failing app shell test**

```tsx
import { render, screen } from '@testing-library/react';
import { AppShell } from '@/components/app-shell/app-shell';

test('app shell renders title and navigation slots', () => {
  render(<AppShell title="Dashboard">content</AppShell>);

  expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  expect(screen.getByText('content')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/app-shell.test.tsx`
Expected: FAIL because the shell component does not exist yet

- [ ] **Step 3: Implement the minimal shell and tokenized styling**

Implement:
- CSS variables for brand colors, spacing, surfaces, and typography
- A reusable authenticated shell with title region and nav region
- A navigation component shaped for `Dashboard`, `Announcements`, `Projects`, and conditional `Users`

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/app-shell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/components/app-shell tests/integration/app-shell.test.tsx
git commit -m "feat: add shared app shell foundation"
```

## Chunk 2: Database, Seed Data, And Demo Auth

### Task 3: Model The Core Database Schema

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Test: `tests/unit/schema-shape.test.ts`

- [ ] **Step 1: Write the failing schema shape test**

```ts
import { readFileSync } from 'node:fs';

test('schema defines the required core models', () => {
  const schema = readFileSync('prisma/schema.prisma', 'utf8');

  expect(schema).toContain('model User');
  expect(schema).toContain('model Project');
  expect(schema).toContain('model ProjectModule');
  expect(schema).toContain('model BomItem');
  expect(schema).toContain('model PurchasingItem');
  expect(schema).toContain('model Announcement');
  expect(schema).toContain('model Session');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/unit/schema-shape.test.ts`
Expected: FAIL because the schema file does not exist yet

- [ ] **Step 3: Write the minimal schema and Prisma client wrapper**

Implement models and relations for:
- `User`
- `Session`
- `Announcement`
- `Project`
- `ProjectModule`
- `BomItem`
- `PurchasingItem`

Add enum types for:
- `Role`
- `PartCategory`
- `ProjectStatus`
- `PurchasingStatus`

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/unit/schema-shape.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma src/lib/db.ts tests/unit/schema-shape.test.ts
git commit -m "feat: define core prisma schema"
```

### Task 4: Seed Demo Users And Sample Project Data

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json`
- Test: `tests/integration/seed-data.test.ts`

- [ ] **Step 1: Write the failing seed test**

```ts
import { getSeedUserEmails } from '@/../prisma/seed';

test('seed exposes the demo users for each role', () => {
  expect(getSeedUserEmails()).toEqual([
    'owner@demo.local',
    'admin@demo.local',
    'designer@demo.local',
    'purchaser@demo.local',
  ]);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/seed-data.test.ts`
Expected: FAIL because the seed module does not exist yet

- [ ] **Step 3: Implement minimal seed data**

Implement:
- Four demo users, one per role
- One active announcement
- Two sample projects
- Modules and BOM items for at least one sample project
- Export small pure helpers from the seed module so unit tests can run without a live DB

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/seed-data.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add prisma/seed.ts package.json tests/integration/seed-data.test.ts
git commit -m "feat: add demo seed data"
```

### Task 5: Implement Demo Login And Session Helpers

**Files:**
- Create: `src/lib/auth/session.ts`
- Create: `src/lib/auth/current-user.ts`
- Create: `src/server/actions/auth.ts`
- Create: `src/app/login/page.tsx`
- Test: `tests/integration/auth.test.tsx`

- [ ] **Step 1: Write the failing auth test**

```tsx
import { createDemoSession } from '@/lib/auth/session';

test('createDemoSession returns a session payload for a seeded user', async () => {
  const session = await createDemoSession({ email: 'owner@demo.local' });

  expect(session.userEmail).toBe('owner@demo.local');
  expect(session.role).toBe('owner');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/auth.test.tsx`
Expected: FAIL because auth helpers do not exist yet

- [ ] **Step 3: Implement minimal demo auth**

Implement:
- Session table usage or signed cookie storage
- `createDemoSession`, `clearSession`, and `getSession`
- Current-user resolver backed by the session
- Login page with a demo user picker or email-driven selection
- Login server action and logout action

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/auth.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth src/server/actions/auth.ts src/app/login/page.tsx tests/integration/auth.test.tsx
git commit -m "feat: add demo auth flow"
```

## Chunk 3: Authorization And Derived Purchasing Logic

### Task 6: Centralize Role And Project-Scope Permissions

**Files:**
- Create: `src/lib/permissions.ts`
- Test: `tests/unit/permissions.test.ts`

- [ ] **Step 1: Write the failing permissions test**

```ts
import { canEditBom, canEditPurchasing, canManageUsers } from '@/lib/permissions';

test('designer can edit bom but not purchasing', () => {
  expect(canEditBom({ role: 'designer', isAssigned: true })).toBe(true);
  expect(canEditPurchasing({ role: 'designer', isAssigned: true })).toBe(false);
});

test('purchaser can edit purchasing but not bom', () => {
  expect(canEditBom({ role: 'purchaser', isAssigned: true })).toBe(false);
  expect(canEditPurchasing({ role: 'purchaser', isAssigned: true })).toBe(true);
});

test('only owner can manage users', () => {
  expect(canManageUsers('owner')).toBe(true);
  expect(canManageUsers('admin')).toBe(false);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/unit/permissions.test.ts`
Expected: FAIL because the permission module does not exist yet

- [ ] **Step 3: Implement minimal permission helpers**

Implement:
- Global access predicates for each role
- Project-assignment checks
- Helper assertions for owner-only and assigned-project access

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/unit/permissions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/permissions.ts tests/unit/permissions.test.ts
git commit -m "feat: add centralized permission rules"
```

### Task 7: Implement BOM Aggregation Into Purchasing Rows

**Files:**
- Create: `src/lib/purchasing/aggregate.ts`
- Test: `tests/unit/purchasing-aggregate.test.ts`

- [ ] **Step 1: Write the failing aggregation test**

```ts
import { aggregateBomItems } from '@/lib/purchasing/aggregate';

test('groups bom items into project purchasing rows by shared key', () => {
  const rows = aggregateBomItems([
    {
      projectId: 'p1',
      partNumber: 'PN-100',
      partDescription: 'Linear rail',
      vendor: 'Acme',
      partCategory: 'standard_part',
      quantity: 2,
    },
    {
      projectId: 'p1',
      partNumber: 'PN-100',
      partDescription: 'Linear rail',
      vendor: 'Acme',
      partCategory: 'standard_part',
      quantity: 3,
    },
  ]);

  expect(rows).toHaveLength(1);
  expect(rows[0].totalQuantity).toBe(5);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/unit/purchasing-aggregate.test.ts`
Expected: FAIL because the aggregation module does not exist yet

- [ ] **Step 3: Implement the minimal aggregation function**

Implement:
- Grouping by `projectId + partNumber + partDescription + vendor + partCategory`
- `totalQuantity` sum
- Stable deterministic ordering for rendering and sync

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/unit/purchasing-aggregate.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/purchasing/aggregate.ts tests/unit/purchasing-aggregate.test.ts
git commit -m "feat: add bom purchasing aggregation"
```

### Task 8: Preserve Purchaser Workflow Fields During Sync

**Files:**
- Create: `src/lib/purchasing/sync.ts`
- Test: `tests/unit/purchasing-sync.test.ts`

- [ ] **Step 1: Write the failing sync test**

```ts
import { mergeWorkflowFields } from '@/lib/purchasing/sync';

test('preserves purchaser workflow values when aggregated key still exists', () => {
  const merged = mergeWorkflowFields({
    existing: [
      {
        aggregateKey: 'p1|PN-100|Linear rail|Acme|standard_part',
        status: 'quoted',
        supplierSelected: 'Acme',
        quotedPrice: 125,
        poNumber: 'PO-9',
        notes: 'approved',
      },
    ],
    next: [
      {
        aggregateKey: 'p1|PN-100|Linear rail|Acme|standard_part',
        totalQuantity: 6,
      },
    ],
  });

  expect(merged[0].status).toBe('quoted');
  expect(merged[0].poNumber).toBe('PO-9');
  expect(merged[0].totalQuantity).toBe(6);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/unit/purchasing-sync.test.ts`
Expected: FAIL because the sync module does not exist yet

- [ ] **Step 3: Implement the minimal sync merge behavior**

Implement:
- Matching by aggregate key
- Carry forward purchaser workflow fields on key match
- Leave unmatched new rows with empty workflow defaults

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/unit/purchasing-sync.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/purchasing/sync.ts tests/unit/purchasing-sync.test.ts
git commit -m "feat: preserve purchasing workflow on bom sync"
```

## Chunk 4: Public Pages And App Routing

### Task 9: Build The Landing Page

**Files:**
- Create: `src/components/marketing/hero.tsx`
- Create: `src/components/marketing/feature-grid.tsx`
- Create: `src/components/marketing/role-strip.tsx`
- Create: `src/app/page.tsx`
- Test: `tests/integration/landing-page.test.tsx`

- [ ] **Step 1: Write the failing landing page test**

```tsx
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

test('landing page shows feature messaging and login cta', () => {
  render(<HomePage />);

  expect(screen.getByRole('heading', { name: /centralized bom management/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute('href', '/login');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/landing-page.test.tsx`
Expected: FAIL because the landing page content does not exist yet

- [ ] **Step 3: Implement the minimal landing experience**

Implement:
- Product positioning copy
- Feature summary
- Role-based workflow explanation
- CTA to `/login`

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/landing-page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing src/app/page.tsx tests/integration/landing-page.test.tsx
git commit -m "feat: add landing page"
```

### Task 10: Add Authenticated Route Layout And Dashboard

**Files:**
- Create: `src/app/(app)/layout.tsx`
- Create: `src/app/(app)/dashboard/page.tsx`
- Create: `src/components/dashboard/dashboard-overview.tsx`
- Test: `tests/integration/dashboard.test.tsx`

- [ ] **Step 1: Write the failing dashboard test**

```tsx
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/(app)/dashboard/page';

test('dashboard renders the owner announcement area', () => {
  render(<DashboardPage />);

  expect(screen.getByText(/announcement/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/dashboard.test.tsx`
Expected: FAIL because the authenticated dashboard does not exist yet

- [ ] **Step 3: Implement the minimal authenticated shell and dashboard**

Implement:
- Auth guard in `(app)` layout
- Role-aware nav
- Dashboard overview section with announcement placeholder and project summary cards

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/dashboard.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(app)' src/components/dashboard tests/integration/dashboard.test.tsx
git commit -m "feat: add authenticated dashboard"
```

### Task 11: Add Announcements Read View

**Files:**
- Create: `src/app/(app)/announcements/page.tsx`
- Create: `src/components/announcements/announcement-list.tsx`
- Test: `tests/integration/announcements.test.tsx`

- [ ] **Step 1: Write the failing announcements test**

```tsx
import { render, screen } from '@testing-library/react';
import AnnouncementsPage from '@/app/(app)/announcements/page';

test('announcements page lists announcement titles', () => {
  render(<AnnouncementsPage />);

  expect(screen.getByRole('heading', { name: /announcements/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/announcements.test.tsx`
Expected: FAIL because the page and components do not exist yet

- [ ] **Step 3: Implement the minimal announcements page**

Implement:
- Read view for announcements
- Empty state and basic list styling

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/announcements.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(app)/announcements/page.tsx' src/components/announcements tests/integration/announcements.test.tsx
git commit -m "feat: add announcements page"
```

## Chunk 5: Projects, Project Detail, And BOM Editing

### Task 12: Build Role-Filtered Projects Listing

**Files:**
- Create: `src/app/(app)/projects/page.tsx`
- Create: `src/components/projects/projects-table.tsx`
- Create: `src/server/actions/projects.ts`
- Test: `tests/integration/projects.test.tsx`

- [ ] **Step 1: Write the failing projects visibility test**

```tsx
import { visibleProjectsForUser } from '@/server/actions/projects';

test('designer only receives assigned projects', async () => {
  const projects = await visibleProjectsForUser({
    user: { id: 'designer-1', role: 'designer' },
  });

  expect(projects.every((project) => project.designerId === 'designer-1')).toBe(true);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/projects.test.tsx`
Expected: FAIL because the projects action does not exist yet

- [ ] **Step 3: Implement minimal project listing logic and page**

Implement:
- Role-filtered query helper
- Projects table for list view
- Links into project detail pages

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/projects.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(app)/projects/page.tsx' src/components/projects/projects-table.tsx src/server/actions/projects.ts tests/integration/projects.test.tsx
git commit -m "feat: add role filtered project list"
```

### Task 13: Build The Project Detail Workspace

**Files:**
- Create: `src/app/(app)/projects/[projectId]/page.tsx`
- Create: `src/components/projects/project-overview.tsx`
- Create: `src/components/projects/team-list.tsx`
- Test: `tests/integration/project-detail.test.tsx`

- [ ] **Step 1: Write the failing project detail test**

```tsx
import { render, screen } from '@testing-library/react';
import ProjectDetailPage from '@/app/(app)/projects/[projectId]/page';

test('project detail page shows team list and section links', () => {
  render(<ProjectDetailPage params={{ projectId: 'project-1' }} />);

  expect(screen.getByText(/team list/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /bom/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /purchasing/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/project-detail.test.tsx`
Expected: FAIL because the detail page does not exist yet

- [ ] **Step 3: Implement the minimal project detail page**

Implement:
- Project header
- Team list section
- Project overview section
- BOM and Purchasing summary cards with links

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/project-detail.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(app)/projects/[projectId]/page.tsx' src/components/projects/project-overview.tsx src/components/projects/team-list.tsx tests/integration/project-detail.test.tsx
git commit -m "feat: add project detail workspace"
```

### Task 14: Implement BOM Module Tables And Designer CRUD

**Files:**
- Create: `src/app/(app)/projects/[projectId]/bom/page.tsx`
- Create: `src/components/bom/module-table.tsx`
- Create: `src/components/bom/bom-item-form.tsx`
- Modify: `src/server/actions/projects.ts`
- Create: `src/server/actions/bom.ts`
- Test: `tests/integration/bom-actions.test.ts`

- [ ] **Step 1: Write the failing BOM permissions test**

```ts
import { createBomItem } from '@/server/actions/bom';

test('purchaser cannot create bom items', async () => {
  await expect(
    createBomItem({
      actor: { role: 'purchaser', id: 'purchaser-1' },
      projectId: 'project-1',
      moduleId: 'module-1',
      input: {
        partNumber: 'PN-1',
        partDescription: 'Bracket',
        vendor: 'Acme',
        partCategory: 'fabrication',
        quantity: 1,
        price: 10,
      },
    }),
  ).rejects.toThrow(/not authorized/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/bom-actions.test.ts`
Expected: FAIL because the BOM action module does not exist yet

- [ ] **Step 3: Implement minimal BOM CRUD and page rendering**

Implement:
- BOM list page grouped by module
- Module table with filter inputs
- Server actions for create, update, delete
- Authorization checks for designer assignment and owner/admin overrides
- Trigger purchasing sync after every BOM mutation

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/bom-actions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(app)/projects/[projectId]/bom/page.tsx' src/components/bom src/server/actions/bom.ts src/server/actions/projects.ts tests/integration/bom-actions.test.ts
git commit -m "feat: add bom module management"
```

## Chunk 6: Purchasing Workflow And Owner User Management

### Task 15: Build The Purchasing Master List Page

**Files:**
- Create: `src/app/(app)/projects/[projectId]/purchasing/page.tsx`
- Create: `src/components/purchasing/purchasing-table.tsx`
- Create: `src/components/purchasing/purchasing-workflow-form.tsx`
- Create: `src/server/actions/purchasing.ts`
- Test: `tests/integration/purchasing-actions.test.ts`

- [ ] **Step 1: Write the failing purchasing permissions test**

```ts
import { updatePurchasingWorkflow } from '@/server/actions/purchasing';

test('designer cannot update purchasing workflow', async () => {
  await expect(
    updatePurchasingWorkflow({
      actor: { role: 'designer', id: 'designer-1' },
      projectId: 'project-1',
      purchasingItemId: 'pi-1',
      input: {
        status: 'quoted',
        supplierSelected: 'Acme',
        quotedPrice: 125,
        poNumber: 'PO-1',
        notes: 'ready',
      },
    }),
  ).rejects.toThrow(/not authorized/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/purchasing-actions.test.ts`
Expected: FAIL because the purchasing action module does not exist yet

- [ ] **Step 3: Implement minimal purchasing workflow page and actions**

Implement:
- Purchasing master list page
- Empty state when no aggregated items exist
- Workflow edit form for purchaser, owner, and admin
- Read-only rendering for designer

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/purchasing-actions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(app)/projects/[projectId]/purchasing/page.tsx' src/components/purchasing src/server/actions/purchasing.ts tests/integration/purchasing-actions.test.ts
git commit -m "feat: add purchasing workflow management"
```

### Task 16: Add Owner-Only User Management

**Files:**
- Create: `src/app/(app)/users/page.tsx`
- Create: `src/components/users/user-table.tsx`
- Create: `src/components/users/user-form.tsx`
- Create: `src/server/actions/users.ts`
- Test: `tests/integration/users.test.ts`

- [ ] **Step 1: Write the failing user management access test**

```ts
import { createUser } from '@/server/actions/users';

test('admin cannot create users', async () => {
  await expect(
    createUser({
      actor: { role: 'admin', id: 'admin-1' },
      input: {
        name: 'New Purchaser',
        email: 'new.purchaser@demo.local',
        role: 'purchaser',
      },
    }),
  ).rejects.toThrow(/owner only/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/users.test.ts`
Expected: FAIL because the users action module does not exist yet

- [ ] **Step 3: Implement minimal owner user management**

Implement:
- User list page gated to owner
- Create-user server action
- Project assignment controls for designer and purchaser
- Role-based nav visibility for the Users page

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/users.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(app)/users/page.tsx' src/components/users src/server/actions/users.ts tests/integration/users.test.ts
git commit -m "feat: add owner user management"
```

### Task 17: Add Owner Announcement Management

**Files:**
- Modify: `src/app/(app)/announcements/page.tsx`
- Create: `src/components/announcements/announcement-form.tsx`
- Create: `src/server/actions/announcements.ts`
- Test: `tests/integration/announcements-actions.test.ts`

- [ ] **Step 1: Write the failing announcement permissions test**

```ts
import { createAnnouncement } from '@/server/actions/announcements';

test('designer cannot create announcements', async () => {
  await expect(
    createAnnouncement({
      actor: { role: 'designer', id: 'designer-1' },
      input: { title: 'Notice', body: 'Body' },
    }),
  ).rejects.toThrow(/not authorized/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest tests/integration/announcements-actions.test.ts`
Expected: FAIL because the announcement action module does not exist yet

- [ ] **Step 3: Implement minimal owner announcement creation**

Implement:
- Read view for all roles
- Owner-only create form
- Basic empty-state and newest-first ordering

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest tests/integration/announcements-actions.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(app)/announcements/page.tsx' src/components/announcements/announcement-form.tsx src/server/actions/announcements.ts tests/integration/announcements-actions.test.ts
git commit -m "feat: add owner announcement management"
```

## Chunk 7: Verification, E2E Coverage, And Delivery

### Task 18: Add End-To-End Coverage For The Core Workflow

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/app.spec.ts`

- [ ] **Step 1: Write the failing e2e spec**

```ts
import { test, expect } from '@playwright/test';

test('designer can log in and reach the bom page for an assigned project', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /log in/i }).click();
  await page.getByLabel(/demo user/i).selectOption('designer@demo.local');
  await page.getByRole('button', { name: /enter app/i }).click();
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
```

- [ ] **Step 2: Run the spec to verify it fails**

Run: `pnpm playwright test tests/e2e/app.spec.ts`
Expected: FAIL because Playwright config and the complete UI flow are not ready yet

- [ ] **Step 3: Implement the minimal Playwright setup and missing selectors**

Implement:
- Playwright config
- Stable labels and roles in login and app navigation
- Seed/bootstrap flow suitable for local e2e runs

- [ ] **Step 4: Run the spec to verify it passes**

Run: `pnpm playwright test tests/e2e/app.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e/app.spec.ts
git commit -m "test: add e2e coverage for primary workflow"
```

### Task 19: Run Final Verification And Fix Regressions

**Files:**
- Modify: files touched by failing checks only

- [ ] **Step 1: Run the full unit and integration suite**

Run: `pnpm vitest run`
Expected: PASS

- [ ] **Step 2: Run end-to-end coverage**

Run: `pnpm playwright test`
Expected: PASS

- [ ] **Step 3: Run production validation**

Run: `pnpm build`
Expected: PASS

- [ ] **Step 4: Fix any failures and re-run only the affected checks first**

Run the smallest failing command first, then re-run the full verification set.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: finalize bom management v1"
```

## Notes For Execution

- Prefer Prisma migrations once the schema stabilizes, but do not delay early implementation on migration naming perfection.
- Keep authorization in server actions and reusable helpers. Do not rely on component-level hiding alone.
- Do not denormalize BOM and purchasing ownership rules. BOM is the source of truth; purchasing workflow extends derived rows.
- Keep UI components focused. If a table component becomes hard to reason about, split row rendering and form state into smaller files.
