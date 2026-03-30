import { test, expect } from '@playwright/test';

test('renders the app', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Conveyancing AI' })).toBeVisible();
});
