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
