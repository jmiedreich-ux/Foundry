import { expect, test, type Locator, type Page } from '@playwright/test';

function example(page: Page, title: string): Locator {
  return page
    .getByRole('heading', { level: 3, name: title, exact: true })
    .locator('..');
}

function menuIn(frame: Locator): Locator {
  return frame.getByRole('menu');
}

test.describe('CG-M4-19 Menu gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-overlays');
  });

  test('uncontrolled trigger opens a labelled menu with roving tabIndex and focus on first item', async ({ page }) => {
    const frame = example(page, 'Uncontrolled Menu');
    const trigger = frame.getByRole('button', { name: 'Menu actions', exact: true });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');

    await trigger.click();

    const menu = menuIn(frame);
    await expect(menu).toHaveCount(1);
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('data-control', 'menu');
    await expect(menu).toHaveAttribute('data-open', '');

    const contentId = await menu.getAttribute('id');
    expect(contentId).not.toBeNull();
    await expect(trigger).toHaveAttribute('aria-controls', contentId!);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const triggerId = await trigger.getAttribute('id');
    expect(triggerId).not.toBeNull();
    await expect(menu).toHaveAttribute('aria-labelledby', triggerId!);

    const itemCount = await menu.getByRole('menuitem').count();
    expect(itemCount).toBeGreaterThanOrEqual(3);

    const tabIndexes = await menu.evaluate((el) => {
      return [...el.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')]
        .map((item) => item.tabIndex);
    });
    expect(tabIndexes[0]).toBe(0);
    for (let i = 1; i < tabIndexes.length; i++) {
      expect(tabIndexes[i]).toBe(-1);
    }

    await expect(menu.getByRole('menuitem', { name: 'Copy', exact: true })).toBeFocused();
    await expect(frame.getByRole('status')).toHaveText('Menu is open');
  });

  test('Arrow, Home, End navigate items; Enter/Space activates enabled items; disabled item never activates', async ({ page }) => {
    const frame = example(page, 'Uncontrolled Menu');
    await frame.getByRole('button', { name: 'Menu actions', exact: true }).click();

    const menu = menuIn(frame);
    await expect(menu.getByRole('menuitem', { name: 'Copy', exact: true })).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitem', { name: 'Paste', exact: true })).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitem', { name: 'Delete', exact: true })).toBeFocused();

    await page.keyboard.press('Home');
    await expect(menu.getByRole('menuitem', { name: 'Copy', exact: true })).toBeFocused();

    await page.keyboard.press('End');
    await expect(menu.getByRole('menuitem', { name: 'Delete', exact: true })).toBeFocused();

    const disabledItem = menu.getByRole('menuitem', { name: 'Delete', exact: true });
    await expect(disabledItem).toHaveAttribute('aria-disabled', 'true');

    await page.keyboard.press('Enter');
    await expect(menu).toBeVisible();

    await page.keyboard.press(' ');
    await expect(menu).toBeVisible();

    await page.keyboard.press('Home');
    await expect(menu.getByRole('menuitem', { name: 'Copy', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveCount(0);
    await expect(frame.getByRole('status')).toContainText('Copy selected');
  });

  test('ArrowUp on trigger enters last item; Escape and explicit close restore focus to trigger', async ({ page }) => {
    const frame = example(page, 'Uncontrolled Menu');
    const trigger = frame.getByRole('button', { name: 'Menu actions', exact: true });

    await trigger.focus();
    await page.keyboard.press('ArrowUp');
    const menu = menuIn(frame);
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Delete', exact: true })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(frame.getByRole('status')).toHaveText('Menu is closed');

    await trigger.click();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await trigger.click();
    await menuIn(frame).getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('outside pointer dismissal closes menu without moving focus; Tab is not prevented', async ({ page }) => {
    const frame = example(page, 'Uncontrolled Menu');
    const trigger = frame.getByRole('button', { name: 'Menu actions', exact: true });
    await trigger.click();

    await page.mouse.click(0, 0);
    const menu = menuIn(frame);
    await expect(menu).toHaveCount(0);
    await expect(frame.getByRole('status')).toHaveText('Menu is closed');

    await trigger.click();
    await page.evaluate(() => {
      (window as Record<string, boolean>).__tabPrevented = false;
      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Tab') (window as Record<string, boolean>).__tabPrevented = e.defaultPrevented;
      }, true);
    });
    await page.keyboard.press('Tab');
    const tabNotPrevented = await page.evaluate(() => (window as Record<string, boolean>).__tabPrevented);
    expect(tabNotPrevented).toBe(false);
    await expect(menu).toHaveCount(0);
  });

  test('controlled menu opens, closes, and reports state changes', async ({ page }) => {
    const frame = example(page, 'Controlled Menu');
    const trigger = frame.getByRole('button', { name: 'Controlled menu', exact: true });

    await expect(frame.getByRole('status')).toHaveText('No state change yet');

    await trigger.click();
    const menu = menuIn(frame);
    await expect(menu).toBeVisible();
    await expect(frame.getByRole('status')).toHaveText('Last requested: open');

    await menu.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(menu).toHaveCount(0);
    await expect(frame.getByRole('status')).toHaveText('Last requested: closed');
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(menuIn(frame)).toBeVisible();
  });

  test('narrow viewport keeps open Menu content visible without horizontal document overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-overlays');

    const frame = example(page, 'Uncontrolled Menu');
    await frame.getByRole('button', { name: 'Menu actions', exact: true }).click();
    const menu = menuIn(frame);

    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Copy', exact: true })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
