import { test, expect } from '@playwright/test';

test('displays case details in a card', async ({ page }) => {
  await page.goto('/case/CASE-2024-0847');

  const card = page.locator('.case-card');
  await expect(card).toBeVisible();
  await expect(card).toContainText('42 Willowmere Drive');
  await expect(card).toContainText('Sarah Mitchell');
});
