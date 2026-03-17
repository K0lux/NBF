import { test, expect } from '@playwright/test';

test.describe('Scheduling System', () => {
  test('should load the admin master schedule page', async ({ page }) => {
    await page.goto('/admin/schedule');
    await expect(page.getByRole('heading', { name: /master schedule/i })).toBeVisible();
  });

  test('should load the trainee schedule page', async ({ page }) => {
    await page.goto('/my-schedule');
    await expect(page.getByRole('heading', { name: /my schedule/i })).toBeVisible();
  });
});
