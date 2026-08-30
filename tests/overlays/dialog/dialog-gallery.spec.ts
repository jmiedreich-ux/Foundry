import { expect, test, type Locator, type Page } from '@playwright/test';

function example(page: Page, title: string): Locator {
  return page
    .getByRole('heading', { level: 3, name: title, exact: true })
    .locator('..');
}

function dialogIn(frame: Locator, name: string): Locator {
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

test.describe('CG-M4-16 Dialog gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-overlays');
  });

  test('uncontrolled trigger opens one named native modal Dialog with initial focus and state', async ({
    page,
  }) => {
    const frame = example(page, 'Uncontrolled Dialog');
    const trigger = frame.getByRole('button', { name: 'Open dialog', exact: true });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.click();

    const dialog = dialogIn(frame, 'Confirmation');
    const close = dialog.getByRole('button', { name: 'Dismiss', exact: true });
    await expect(dialog).toHaveCount(1);
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('data-control', 'dialog');
    await expect(dialog).toHaveAttribute('data-open', '');
    await expect(dialog).toHaveAttribute('open', '');
    await expect(
      dialog.evaluate((element) => element.tagName === 'DIALOG' && element.matches(':modal')),
    ).resolves.toBe(true);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(close).toBeFocused();
    await expect(frame.getByRole('status')).toHaveText('Dialog is open');
  });

  test('Tab and Shift+Tab remain in the Dialog, Escape closes it, and focus returns to its trigger', async ({
    page,
  }) => {
    const frame = example(page, 'Uncontrolled Dialog');
    const trigger = frame.getByRole('button', { name: 'Open dialog', exact: true });
    await trigger.click();

    const dialog = dialogIn(frame, 'Confirmation');
    const close = dialog.getByRole('button', { name: 'Dismiss', exact: true });
    await expect(close).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    await expectFoundryFocus(close);

    await page.keyboard.press('Shift+Tab');
    await expect(close).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(frame.getByRole('status')).toHaveText('Dialog is closed');
  });

  test('outside pointer does not dismiss an uncontrolled Dialog, while explicit close recovers it', async ({
    page,
  }) => {
    const frame = example(page, 'Uncontrolled Dialog');
    const trigger = frame.getByRole('button', { name: 'Open dialog', exact: true });
    await trigger.click();

    const dialog = dialogIn(frame, 'Confirmation');
    await page.mouse.click(0, 0);
    await expect(dialog).toBeVisible();
    await expect(frame.getByRole('status')).toHaveText('Dialog is open');

    await dialog.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(frame.getByRole('status')).toHaveText('Dialog is closed');

    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect(frame.getByRole('status')).toHaveText('Dialog is open');
  });

  test('controlled trigger and close report each requested state and restore the valid trigger', async ({
    page,
  }) => {
    const frame = example(page, 'Controlled Dialog');
    const trigger = frame.getByRole('button', { name: 'Open controlled dialog', exact: true });

    await trigger.click();
    const dialog = dialogIn(frame, 'Controlled dialog');
    await expect(dialog).toBeVisible();
    await expect(frame.getByRole('status')).toHaveText('Last requested: open');

    await dialog.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(frame.getByRole('status')).toHaveText('Last requested: closed');
  });

  test('narrow viewport keeps the open Dialog and its content visible without document overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-overlays');

    const frame = example(page, 'Uncontrolled Dialog');
    await frame.getByRole('button', { name: 'Open dialog', exact: true }).click();
    const dialog = dialogIn(frame, 'Confirmation');

    await expect(dialog).toBeVisible();
    await expect(dialog.locator('p')).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
