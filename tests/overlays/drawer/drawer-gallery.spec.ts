import { expect, test, type Locator, type Page } from '@playwright/test';

function example(page: Page, title: string): Locator {
  return page
    .getByRole('heading', { level: 3, name: title, exact: true })
    .locator('..');
}

function drawerIn(frame: Locator, name: string): Locator {
  return frame.getByRole('dialog', { name, exact: true });
}

async function expectFoundryFocus(element: Locator) {
  const focusStyle = await element.evaluate((node) => {
    const style = window.getComputedStyle(node);
    return {
      outlineColor: style.outlineColor,
      outlineOffset: style.outlineOffset,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
    };
  });

  expect(focusStyle).toEqual({
    outlineColor: 'rgb(147, 197, 253)',
    outlineOffset: '4px',
    outlineStyle: 'solid',
    outlineWidth: '3px',
  });
}

test.describe('CG-M4-17 Drawer gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-overlays');
  });

  test('uncontrolled trigger opens one named native modal Drawer with end-side state and initial focus', async ({
    page,
  }) => {
    const frame = example(page, 'Uncontrolled Drawer');
    const trigger = frame.getByRole('button', { name: 'Open drawer', exact: true });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.click();

    const drawer = drawerIn(frame, 'Drawer content');
    const close = drawer.getByRole('button', { name: 'Dismiss', exact: true });
    await expect(drawer).toHaveCount(1);
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute('data-control', 'drawer');
    await expect(drawer).toHaveAttribute('data-open', '');
    await expect(drawer).toHaveAttribute('data-drawer-side', 'end');
    await expect(drawer).toHaveAttribute('open', '');
    await expect(
      drawer.evaluate((element) => element.tagName === 'DIALOG' && element.matches(':modal')),
    ).resolves.toBe(true);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(close).toBeFocused();
    await expect(frame.getByRole('status')).toHaveText('Drawer is open');
  });

  test('Tab and Shift+Tab remain in the Drawer, Escape closes it, and focus returns to its trigger', async ({
    page,
  }) => {
    const frame = example(page, 'Uncontrolled Drawer');
    const trigger = frame.getByRole('button', { name: 'Open drawer', exact: true });
    await trigger.click();

    const drawer = drawerIn(frame, 'Drawer content');
    const close = drawer.getByRole('button', { name: 'Dismiss', exact: true });
    await expect(close).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    await expectFoundryFocus(close);

    await page.keyboard.press('Shift+Tab');
    await expect(close).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(drawer).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(frame.getByRole('status')).toHaveText('Drawer is closed');
  });

  test('outside pointer does not dismiss an uncontrolled Drawer, while explicit close reopens cleanly', async ({
    page,
  }) => {
    const frame = example(page, 'Uncontrolled Drawer');
    const trigger = frame.getByRole('button', { name: 'Open drawer', exact: true });
    await trigger.click();

    const drawer = drawerIn(frame, 'Drawer content');
    await page.mouse.click(0, 0);
    await expect(drawer).toBeVisible();
    await expect(frame.getByRole('status')).toHaveText('Drawer is open');

    await drawer.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(drawer).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(frame.getByRole('status')).toHaveText('Drawer is closed');

    await trigger.click();
    await expect(drawer).toBeVisible();
    await expect(frame.getByRole('status')).toHaveText('Drawer is open');
  });

  test('controlled trigger and close report each requested state, restore focus, and expose start-side state', async ({
    page,
  }) => {
    const frame = example(page, 'Controlled Drawer');
    const trigger = frame.getByRole('button', { name: 'Open controlled drawer', exact: true });

    await trigger.click();
    const drawer = drawerIn(frame, 'Controlled drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute('data-drawer-side', 'start');
    await expect(frame.getByRole('status')).toHaveText('Last requested: open');

    await drawer.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(drawer).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(frame.getByRole('status')).toHaveText('Last requested: closed');
  });

  test('narrow viewport keeps the open Drawer and its content visible without document overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-overlays');

    const frame = example(page, 'Uncontrolled Drawer');
    await frame.getByRole('button', { name: 'Open drawer', exact: true }).click();
    const drawer = drawerIn(frame, 'Drawer content');

    await expect(drawer).toBeVisible();
    await expect(drawer.locator('p')).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
