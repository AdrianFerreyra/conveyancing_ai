import { test, expect } from '@playwright/test';

test('displays tasks for a case as a graph', async ({ page }) => {
  await page.goto('/case/CASE-2024-0847');

  await expect(page.locator('.task-graph')).toBeVisible();
  await expect(page.locator('[data-testid="task-node"]').first()).toContainText('TASK-001');
});
