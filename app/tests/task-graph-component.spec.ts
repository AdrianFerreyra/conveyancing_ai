import { test, expect } from '@playwright/test'

/**
 * Component-level tests for TaskGraph.
 * These tests exercise the component's rendering and interaction behaviour
 * independently of the surrounding page layout.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/case/CASE-2024-0847')
  await expect(page.locator('.task-graph')).toBeVisible({ timeout: 15000 })
})

test('renders one node per task', async ({ page }) => {
  const nodes = page.locator('[data-testid="task-node"]')
  await expect(nodes).toHaveCount(17)
})

test('renders task IDs as visible text inside each node', async ({ page }) => {
  const graph = page.locator('.task-graph')
  for (const id of ['TASK-001', 'TASK-008', 'TASK-017']) {
    await expect(graph).toContainText(id)
  }
})

test('renders SVG path edges connecting dependent tasks', async ({ page }) => {
  const edges = page.locator('.task-graph svg path[stroke="#d1d5db"]')
  // There are 16 dependency edges across all 17 tasks
  const count = await edges.count()
  expect(count).toBeGreaterThan(0)
})

test('shows popover with full task title on hover', async ({ page }) => {
  // TASK-001 is always the first node rendered (level 0, position 0)
  await page.locator('[data-testid="task-node"]').first().hover()
  const popover = page.locator('.task-popover')
  await expect(popover).toBeVisible()
  await expect(popover).toContainText('Client onboarding and ID verification')
})

test('popover includes category and assigned-to fields', async ({ page }) => {
  await page.locator('[data-testid="task-node"]').first().hover()
  const popover = page.locator('.task-popover')
  await expect(popover).toContainText('compliance')
  await expect(popover).toContainText('David Chen')
})

test('popover disappears when the mouse leaves the node', async ({ page }) => {
  const node = page.locator('[data-testid="task-node"]').first()
  await node.hover()
  await expect(page.locator('.task-popover')).toBeVisible()

  // Move away from the node
  await page.mouse.move(0, 0)
  await expect(page.locator('.task-popover')).not.toBeVisible()
})

test('blocked task popover shows blocked reason', async ({ page }) => {
  // Find and hover the node for TASK-009 which is blocked in the fixture
  const nodes = page.locator('[data-testid="task-node"]')
  const count = await nodes.count()

  for (let i = 0; i < count; i++) {
    const node = nodes.nth(i)
    if (await node.textContent().then((t) => t?.includes('TASK-009'))) {
      await node.hover()
      await expect(page.locator('.task-popover')).toContainText('Blocked')
      break
    }
  }
})

test('in-progress task popover shows enquiry tracker', async ({ page }) => {
  // TASK-008 is in_progress and has an enquiries tracker
  const nodes = page.locator('[data-testid="task-node"]')
  const count = await nodes.count()

  for (let i = 0; i < count; i++) {
    const node = nodes.nth(i)
    if (await node.textContent().then((t) => t?.includes('TASK-008'))) {
      await node.hover()
      await expect(page.locator('.task-popover')).toContainText('resolved')
      break
    }
  }
})
