import { test, expect } from '@playwright/test';

test.describe('Admin Trainee Management', () => {
  test('should load the admin trainees page and show the title', async ({ page }) => {
    // In a real scenario, we'd need to bypass Clerk authentication for E2E tests
    // using a testing token or a mock Clerk environment.
    // For now, we'll check if the page structure is correct.
    
    await page.goto('/admin/trainees');
    
    // Check if the heading exists
    const heading = page.getByRole('heading', { name: /administration/i });
    await expect(heading).toBeVisible();
    
    // Check if the widget title is present
    await expect(page.getByText(/trainee management/i)).toBeVisible();
  });
});
