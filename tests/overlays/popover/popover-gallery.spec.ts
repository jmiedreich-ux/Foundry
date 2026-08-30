import { expect, test, type Locator, type Page } from '@playwright/test';

function example(page: Page, title: string): Locator {
  return page.getByRole('heading', { level: 3, name: title, exact: true }).locator('..');
}

function popoverIn(frame: Locator, name: string): Locator {
  return frame.getByRole('dialog', { name, exact: true });
}

test.describe('CG-M4-18 Popover gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-overlays');
  });

  test('uncontrolled trigger opens one named native auto Popover with the fixed public state', async ({ page }) => {
    const frame = example(page, 'Uncontrolled Popover');
    const trigger = frame.getByRole('button', { name: 'Open popover', exact: true });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    const popover = popoverIn(frame, 'Popover details');
    await expect(popover).toHaveCount(1);
    await expect(popover).toBeVisible();
    await expect(popover).toHaveAttribute('popover', 'auto');
    await expect(popover).toHaveAttribute('data-control', 'popover');
    await expect(popover).toHaveAttribute('data-open', '');
    await expect(popover).toHaveAttribute('role', 'dialog');
    await expect(popover).not.toHaveAttribute('aria-modal');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const contentId = await popover.getAttribute('id');
    expect(contentId).not.toBeNull();
    await expect(trigger).toHaveAttribute('aria-controls', contentId!);
    await expect(frame.getByRole('status')).toHaveText('Popover is open');
  });

  test('Popover is non-modal: opening keeps trigger focus and Tab can leave its content', async ({ page }) => {
    const frame = example(page, 'Uncontrolled Popover');
    const trigger = frame.getByRole('button', { name: 'Open popover', exact: true });
    await trigger.click();
    const popover = popoverIn(frame, 'Popover details');
    await expect(trigger).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(popover.getByRole('button', { name: 'Dismiss', exact: true })).toBeFocused();
    for (let count = 0; count < 10; count += 1) {
      await page.keyboard.press('Tab');
      if (!(await page.evaluate(() => document.activeElement?.closest('[data-control="popover"]')))) break;
    }
    await expect.poll(() => page.evaluate(() => Boolean(document.activeElement?.closest('[data-control="popover"]')))).toBe(false);
  });

  test('Escape and real light dismissal close uncontrolled Popover and restore its trigger', async ({ page }) => {
    const frame = example(page, 'Uncontrolled Popover');
    const trigger = frame.getByRole('button', { name: 'Open popover', exact: true });
    await trigger.click();
    await page.keyboard.press('Escape');
    await expect(popoverIn(frame, 'Popover details')).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(frame.getByRole('status')).toHaveText('Popover is closed');

    await trigger.click();
    await page.mouse.click(0, 0);
    await expect(popoverIn(frame, 'Popover details')).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(frame.getByRole('status')).toHaveText('Popover is closed');
  });

  test('explicit close reopens, and controlled native dismissal removes rather than hides the Popover', async ({ page }) => {
    const uncontrolled = example(page, 'Uncontrolled Popover');
    const trigger = uncontrolled.getByRole('button', { name: 'Open popover', exact: true });
    await trigger.click();
    await popoverIn(uncontrolled, 'Popover details').getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(popoverIn(uncontrolled, 'Popover details')).toHaveCount(0);
    await trigger.click();
    await expect(popoverIn(uncontrolled, 'Popover details')).toBeVisible();
    await page.keyboard.press('Escape');

    const controlled = example(page, 'Controlled Popover');
    const controlledTrigger = controlled.getByRole('button', { name: 'Open controlled popover', exact: true });
    await controlledTrigger.click();
    await expect(controlled.getByRole('status')).toHaveText('Last requested: open');
    await page.mouse.click(0, 0);
    await expect(popoverIn(controlled, 'Controlled popover')).toHaveCount(0);
    await expect(controlled.getByRole('status')).toHaveText('Last requested: closed');
    await expect(controlledTrigger).toBeFocused();
  });

  test('narrow viewport keeps open Popover content visible without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-overlays');
    const frame = example(page, 'Uncontrolled Popover');
    await frame.getByRole('button', { name: 'Open popover', exact: true }).click();
    await expect(popoverIn(frame, 'Popover details')).toBeVisible();
    const size = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(size[0]).toBeLessThanOrEqual(size[1]);
  });
});
