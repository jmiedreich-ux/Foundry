import { expect, test } from '@playwright/test';

function example(page: import('@playwright/test').Page, title: string) {
  return page
    .getByRole('heading', { level: 3, name: title, exact: true })
    .locator('..');
}

test.describe('M3 Switch gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-inputs');
  });

  test('controlled switch toggles checked state and updates status', async ({ page }) => {
    const frame = example(page, 'Controlled Switch');
    const switch_ = frame.getByRole('switch', { name: 'Controlled switch', exact: true });
    const status = frame.getByRole('status');

    await expect(switch_).not.toBeChecked();
    await expect(status).toHaveText('State: off');

    await switch_.click();
    await expect(switch_).toBeChecked();
    await expect(switch_).toHaveAttribute('data-checked', '');
    await expect(status).toHaveText('State: on');

    await switch_.click();
    await expect(switch_).not.toBeChecked();
    await expect(switch_).not.toHaveAttribute('data-checked');
    await expect(status).toHaveText('State: off');
  });

  test('uncontrolled switch toggles then resets with incremented reset count', async ({ page }) => {
    const frame = example(page, 'Uncontrolled Switch with Reset');
    const switch_ = frame.getByRole('switch', { name: 'Uncontrolled switch (initially on)', exact: true });
    const status = frame.getByRole('status');

    await expect(switch_).toBeChecked();
    await expect(switch_).toHaveAttribute('data-checked', '');

    await switch_.click();
    await expect(switch_).not.toBeChecked();
    await expect(switch_).not.toHaveAttribute('data-checked');

    await frame.getByRole('button', { name: 'Reset form', exact: true }).click();
    await expect(switch_).toBeChecked();
    await expect(switch_).toHaveAttribute('data-checked', '');
    await expect(status).toHaveText('Reset count: 1');
  });

  test('disabled switch is checked, disabled, and carries data-disabled', async ({ page }) => {
    const frame = example(page, 'Disabled Group Switch');
    const switch_ = frame.getByRole('switch', { name: 'Disabled switch', exact: true });

    await expect(switch_).toBeChecked();
    await expect(switch_).toBeDisabled();
    await expect(switch_).toHaveAttribute('data-disabled', '');
  });

  test('real Tab focus reveals Foundry outline with data-focus-visible', async ({ page }) => {
    const frame = example(page, 'Controlled Switch');
    const switch_ = frame.getByRole('switch', { name: 'Controlled switch', exact: true });

    for (let tab = 0; tab < 40; tab += 1) {
      await page.keyboard.press('Tab');
      if (await switch_.evaluate((element) => element === document.activeElement)) break;
    }

    await expect(switch_).toBeFocused();
    await expect(switch_).toHaveAttribute('data-focus-visible', '');
    const focusStyle = await switch_.evaluate((element) => {
      const style = window.getComputedStyle(element);
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
  });

  test('320px viewport retains switch label visibility without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-inputs');

    await expect(
      example(page, 'Controlled Switch').getByRole('switch', {
        name: 'Controlled switch',
        exact: true,
      }),
    ).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
