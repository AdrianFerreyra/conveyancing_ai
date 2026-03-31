import { test, expect } from '@playwright/test'

test('displays task graph for the case', async ({ page }) => {
  await page.goto('/case/CASE-2024-0847')
  await expect(page.locator('.task-graph')).toBeVisible()
  await expect(page.locator('[data-testid="task-node"]')).toHaveCount(17)
})

test('shows task details popover on hover', async ({ page }) => {
  await page.goto('/case/CASE-2024-0847')
  await page.locator('[data-testid="task-node"]').first().hover()
  await expect(page.locator('.task-popover')).toBeVisible()
  await expect(page.locator('.task-popover')).toContainText('Client onboarding')
})
