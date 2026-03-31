import { test, expect } from '@playwright/test';

test('displays a chat section with a case explanation', async ({ page }) => {
  await page.goto('/case/CASE-2024-0847');

  const chat = page.locator('.case-chat');
  await expect(chat).toBeVisible();
  await expect(chat).toContainText('your case');
});
