import { expect, test } from '@playwright/test';

test('owner can create an announcement and see it persist in the app', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /log in/i }).click();
  await page.getByLabel(/demo user/i).selectOption('owner@demo.local');
  await page.getByRole('button', { name: /enter app/i }).click();
  await page.getByRole('link', { name: /announcements/i }).click();
  await page.getByLabel(/announcement title/i).fill('Database-backed update');
  await page.getByLabel(/announcement body/i).fill('This announcement should come from postgres.');
  await page.getByRole('button', { name: /save announcement/i }).click();
  await expect(page.getByRole('heading', { name: /database-backed update/i }).first()).toBeVisible();
  await page.getByRole('link', { name: /dashboard/i }).click();
  await page.getByRole('link', { name: /announcements/i }).click();
  await expect(page.getByRole('heading', { name: /database-backed update/i }).first()).toBeVisible();
});

test('designer can read announcements but cannot create them', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /log in/i }).click();
  await page.getByLabel(/demo user/i).selectOption('designer@demo.local');
  await page.getByRole('button', { name: /enter app/i }).click();
  await page.getByRole('link', { name: /announcements/i }).click();
  await expect(page.getByRole('heading', { name: /quarter kickoff/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /create announcement/i })).toHaveCount(0);
});

test('purchaser can save purchasing workflow and see it in the table', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /log in/i }).click();
  await page.getByLabel(/demo user/i).selectOption('purchaser@demo.local');
  await page.getByRole('button', { name: /enter app/i }).click();
  await page.getByRole('link', { name: /projects/i }).click();
  await page.getByRole('link', { name: /open project/i }).click();
  await page.getByRole('link', { name: /^purchasing$/i }).click();

  await page.getByLabel(/purchasing item/i).selectOption({ label: 'CF-100' });
  await page.getByLabel(/purchasing status/i).selectOption('ordered');
  await page.getByLabel(/^Supplier selected$/i).fill('North Supply');
  await page.getByLabel(/^Quoted price$/i).fill('152.75');
  await page.getByLabel(/^PO number$/i).fill('PO-2026-9');
  await page.getByLabel(/^Purchasing notes$/i).fill('Expedite for week 18');
  await page.getByRole('button', { name: /save purchasing workflow/i }).click();

  await expect(page.getByRole('cell', { name: 'ordered' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'North Supply' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '$152.75' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'PO-2026-9' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Expedite for week 18' })).toBeVisible();

  await expect(page.getByLabel(/purchasing status/i)).toHaveValue('ordered');
  await expect(page.getByLabel(/^Supplier selected$/i)).toHaveValue('North Supply');
  await expect(page.getByLabel(/^Quoted price$/i)).toHaveValue('152.75');
  await expect(page.getByLabel(/^PO number$/i)).toHaveValue('PO-2026-9');
  await expect(page.getByLabel(/^Purchasing notes$/i)).toHaveValue('Expedite for week 18');
});

test('header filters narrow rows in bom and purchasing tables', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /log in/i }).click();
  await page.getByLabel(/demo user/i).selectOption('designer@demo.local');
  await page.getByRole('button', { name: /enter app/i }).click();
  await page.getByRole('link', { name: /projects/i }).click();
  await page.getByRole('link', { name: /open project/i }).click();
  await page.getByRole('link', { name: /^bom$/i }).click();
  await page.waitForTimeout(1500);

  await page.getByLabel(/conveyor frame part category filter/i).evaluate((element) => {
    const select = element as HTMLSelectElement;
    select.value = 'standard_part';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.getByText('CF-200')).toBeVisible();
  await expect(page.getByText('Leveling foot')).toBeVisible();
  await expect(page.getByText('CF-100')).toHaveCount(0);

  await page.goto(page.url().replace(/\/bom$/, '/purchasing'));
  await page.waitForTimeout(1500);
  await page.getByLabel(/category filter/i).evaluate((element) => {
    const select = element as HTMLSelectElement;
    select.value = 'standard_part';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.getByText('CF-200')).toBeVisible();
  await expect(page.getByText('Leveling foot')).toBeVisible();
  await expect(page.getByText('CF-100')).toHaveCount(0);
});
