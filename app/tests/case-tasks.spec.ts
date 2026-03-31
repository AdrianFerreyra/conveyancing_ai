import { test, expect } from '@playwright/test';

test('displays tasks for a case in JSON format', async ({ page }) => {
  await page.goto('/case/CASE-2024-0847');

  const body = await page.locator('body');
  await expect(body).toContainText('CASE-2024-0847');
  await expect(body).toContainText('TASK-001');
});
