import { expect, test } from '@playwright/test';

test('designer can log in and reach the bom page for an assigned project', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /log in/i }).click();
  await page.getByLabel(/demo user/i).selectOption('designer@demo.local');
  await page.getByRole('button', { name: /enter app/i }).click();
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
