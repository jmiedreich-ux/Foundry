import { expect, test } from '@playwright/test';

function example(page: import('@playwright/test').Page, title: string) {
  return page
    .getByRole('heading', { level: 3, name: title, exact: true })
    .locator('..');
}

test.describe('M3 Checkbox gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-inputs');
  });

  test('controlled checkbox toggles checked state and updates status', async ({ page }) => {
    const frame = example(page, 'Controlled Checkbox');
    const checkbox = frame.getByRole('checkbox', { name: 'Controlled option', exact: true });
    const status = frame.getByRole('status');

    await expect(checkbox).not.toBeChecked();
    await expect(status).toHaveText('Checked: no');

    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await expect(checkbox).toHaveAttribute('data-checked', '');
    await expect(status).toHaveText('Checked: yes');

    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
    await expect(checkbox).not.toHaveAttribute('data-checked');
    await expect(status).toHaveText('Checked: no');
  });

  test('uncontrolled checkbox toggles then resets with incremented reset count', async ({ page }) => {
    const frame = example(page, 'Uncontrolled Checkbox with Reset');
    const checkbox = frame.getByRole('checkbox', { name: 'Uncontrolled option (initially checked)', exact: true });
    const status = frame.getByRole('status');

    await expect(checkbox).toBeChecked();
    await expect(status).toHaveText('Reset count: 0');

    await checkbox.click();
    await expect(checkbox).not.toBeChecked();

    await frame.getByRole('button', { name: 'Reset form', exact: true }).click();
    await expect(checkbox).toBeChecked();
    await expect(checkbox).toHaveAttribute('data-checked', '');
    await expect(status).toHaveText('Reset count: 1');
  });

  test('disabled checkbox is checked, disabled, and carries data-disabled', async ({ page }) => {
    const frame = example(page, 'Disabled Group Checkbox');
    const checkbox = frame.getByRole('checkbox', { name: 'Disabled option', exact: true });

    await expect(checkbox).toBeChecked();
    await expect(checkbox).toBeDisabled();
    await expect(checkbox).toHaveAttribute('data-disabled', '');
  });

  test('real Tab focus reveals Foundry outline with data-focus-visible', async ({ page }) => {
    const frame = example(page, 'Controlled Checkbox');
    const checkbox = frame.getByRole('checkbox', { name: 'Controlled option', exact: true });

    for (let tab = 0; tab < 40; tab += 1) {
      await page.keyboard.press('Tab');
      if (await checkbox.evaluate((element) => element === document.activeElement)) break;
    }

    await expect(checkbox).toBeFocused();
    await expect(checkbox).toHaveAttribute('data-focus-visible', '');
    const focusStyle = await checkbox.evaluate((element) => {
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

  test('320px viewport retains checkbox label visibility without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-inputs');

    await expect(
      example(page, 'Controlled Checkbox').getByRole('checkbox', {
        name: 'Controlled option',
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
