import { expect, test } from '@playwright/test';

function example(page: import('@playwright/test').Page, title: string) {
  return page
    .getByRole('heading', { level: 3, name: title, exact: true })
    .locator('..');
}

test.describe('M3 RadioGroup gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-inputs');
  });

  test('controlled pointer selects Enterprise and status updates', async ({ page }) => {
    const frame = example(page, 'Controlled RadioGroup');
    const basicRadio = frame.getByRole('radio', { name: 'Basic', exact: true });
    const enterpriseRadio = frame.getByRole('radio', { name: 'Enterprise', exact: true });
    const status = frame.getByRole('status');

    await expect(basicRadio).toBeChecked();
    await expect(status).toHaveText('Selected: Basic');

    await enterpriseRadio.click();
    await expect(enterpriseRadio).toBeChecked();
    await expect(enterpriseRadio).toHaveAttribute('data-checked', '');
    await expect(status).toHaveText('Selected: Enterprise');
  });

  test('keyboard ArrowRight and ArrowDown navigate next, ArrowLeft and ArrowUp navigate previous', async ({ page }) => {
    const frame = example(page, 'Controlled RadioGroup');
    const basicRadio = frame.getByRole('radio', { name: 'Basic', exact: true });
    const proRadio = frame.getByRole('radio', { name: 'Pro', exact: true });

    await basicRadio.focus();
    await expect(basicRadio).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(proRadio).toBeChecked();
    await expect(proRadio).toBeFocused();
    await expect(proRadio).toHaveAttribute('data-checked', '');

    await page.keyboard.press('ArrowDown');
    const enterpriseRadio = frame.getByRole('radio', { name: 'Enterprise', exact: true });
    await expect(enterpriseRadio).toBeChecked();
    await expect(enterpriseRadio).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(proRadio).toBeChecked();
    await expect(proRadio).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(basicRadio).toBeChecked();
    await expect(basicRadio).toBeFocused();
  });

  test('keyboard Home selects first, End selects last, next from last wraps to first', async ({ page }) => {
    const frame = example(page, 'Controlled RadioGroup');
    const basicRadio = frame.getByRole('radio', { name: 'Basic', exact: true });
    const proRadio = frame.getByRole('radio', { name: 'Pro', exact: true });
    const enterpriseRadio = frame.getByRole('radio', { name: 'Enterprise', exact: true });
    const status = frame.getByRole('status');

    await proRadio.focus();

    await page.keyboard.press('Home');
    await expect(basicRadio).toBeChecked();
    await expect(basicRadio).toBeFocused();
    await expect(status).toHaveText('Selected: Basic');

    await page.keyboard.press('End');
    await expect(enterpriseRadio).toBeChecked();
    await expect(enterpriseRadio).toBeFocused();
    await expect(status).toHaveText('Selected: Enterprise');

    await page.keyboard.press('ArrowRight');
    await expect(basicRadio).toBeChecked();
    await expect(basicRadio).toBeFocused();
    await expect(status).toHaveText('Selected: Basic');
  });

  test('uncontrolled select Basic then native Reset restores Pro with data-checked and reset count', async ({ page }) => {
    const frame = example(page, 'Uncontrolled RadioGroup with Reset');
    const proRadio = frame.getByRole('radio', { name: 'Pro', exact: true });
    const basicRadio = frame.getByRole('radio', { name: 'Basic', exact: true });
    const status = frame.getByRole('status');

    await expect(proRadio).toBeChecked();
    await expect(proRadio).toHaveAttribute('data-checked', '');
    await expect(status).toHaveText('Reset count: 0');

    await expect(basicRadio).toHaveAttribute('required', '');
    await expect(basicRadio).toHaveAttribute('aria-required', 'true');

    await basicRadio.click();
    await expect(basicRadio).toBeChecked();
    await expect(basicRadio).toHaveAttribute('data-checked', '');
    await expect(proRadio).not.toBeChecked();

    await frame.getByRole('button', { name: 'Reset form', exact: true }).click();
    await expect(proRadio).toBeChecked();
    await expect(proRadio).toHaveAttribute('data-checked', '');
    await expect(status).toHaveText('Reset count: 1');
  });

  test('disabled group radios are disabled with data-disabled', async ({ page }) => {
    const frame = example(page, 'Disabled Group RadioGroup');
    const basicRadio = frame.getByRole('radio', { name: 'Basic', exact: true });
    const proRadio = frame.getByRole('radio', { name: 'Pro', exact: true });
    const enterpriseRadio = frame.getByRole('radio', { name: 'Enterprise', exact: true });

    await expect(basicRadio).toBeDisabled();
    await expect(basicRadio).toHaveAttribute('data-disabled', '');

    await expect(proRadio).toBeDisabled();
    await expect(proRadio).toHaveAttribute('data-disabled', '');

    await expect(enterpriseRadio).toBeDisabled();
    await expect(enterpriseRadio).toHaveAttribute('data-disabled', '');

    await expect(basicRadio).not.toBeChecked();
    await expect(proRadio).not.toBeChecked();
    await expect(enterpriseRadio).not.toBeChecked();
  });

  test('real Tab focus reveals outline with data-focus-visible and computed style', async ({ page }) => {
    const frame = example(page, 'Controlled RadioGroup');
    const basicRadio = frame.getByRole('radio', { name: 'Basic', exact: true });

    for (let tab = 0; tab < 40; tab += 1) {
      await page.keyboard.press('Tab');
      if (await basicRadio.evaluate((element) => element === document.activeElement)) break;
    }

    await expect(basicRadio).toBeFocused();
    await expect(basicRadio).toHaveAttribute('data-focus-visible', '');
    const focusStyle = await basicRadio.evaluate((element) => {
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

  test('320px viewport retains Plan selection visibility without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-inputs');

    await expect(
      example(page, 'Controlled RadioGroup').getByRole('radio', {
        name: 'Basic',
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
