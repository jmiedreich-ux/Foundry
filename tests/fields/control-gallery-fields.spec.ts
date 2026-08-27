import { expect, test } from '@playwright/test';

const longLabel = 'This is an exceptionally long field label that demonstrates how the control remains programmatically connected despite label length';

function example(page: import('@playwright/test').Page, title: string) {
  return page
    .locator('#family-inputs > section')
    .filter({ has: page.getByRole('heading', { level: 3, name: title }) });
}

test.describe('M2 field controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-inputs');
  });

  test('renders all field examples with programmatic labels and required semantics', async ({ page }) => {
    await expect(page.locator('#family-inputs > section')).toHaveCount(5);

    const controlled = page.getByRole('textbox', { name: 'Controlled input' });
    const required = page.getByRole('textbox', { name: 'Required field' });
    const longLabelInput = page.getByRole('textbox', { name: longLabel });

    await expect(controlled).toBeVisible();
    await expect(controlled).toHaveAttribute('aria-labelledby');
    await expect(required).toHaveAttribute('required', '');
    await expect(required).toHaveAttribute('aria-required', 'true');
    await expect(longLabelInput).toHaveAttribute('aria-labelledby');
  });

  test('controlled input updates its observable value', async ({ page }) => {
    const controlled = page.getByRole('textbox', { name: 'Controlled input' });
    const output = example(page, 'Controlled TextField').locator('output');

    await expect(output).toContainText('Current value: (empty)');
    await controlled.fill('hello world');
    await expect(output).toContainText('Current value: hello world');
  });

  test('required validation announces, preserves a correction, and reports success', async ({ page }) => {
    const requiredExample = example(page, 'Required Controlled Field');
    const input = requiredExample.getByRole('textbox', { name: 'Required field' });
    const submit = requiredExample.getByRole('button', { name: 'Submit' });

    await submit.click();
    const alert = requiredExample.getByRole('alert');
    await expect(alert).toHaveText('This field is required.');

    const errorId = await alert.getAttribute('id');
    expect(errorId).toBeTruthy();
    await expect(input).toHaveAttribute('aria-describedby', new RegExp(`(^|\\s)${errorId}(\\s|$)`));

    await input.fill('recovery text');
    await expect(input).toHaveValue('recovery text');
    await submit.click();

    await expect(alert).toHaveCount(0);
    await expect(requiredExample.getByRole('status')).toHaveText('Submitted: recovery text');
  });

  test('native reset restores uncontrolled text and select defaults', async ({ page }) => {
    const uncontrolled = example(page, 'Uncontrolled Form with Reset');
    const text = page.getByRole('textbox', { name: 'Text field (initial: hello)' });
    const select = page.getByRole('combobox', { name: 'Select (initial: alpha)' });

    await text.fill('goodbye');
    await select.selectOption('gamma');
    await expect(text).toHaveValue('goodbye');
    await expect(select).toHaveValue('gamma');

    await uncontrolled.getByRole('button', { name: 'Reset to initial values' }).click();
    await expect(text).toHaveValue('hello');
    await expect(select).toHaveValue('alpha');
  });

  test('disabled group disables its field control', async ({ page }) => {
    const disabled = example(page, 'Disabled Group');

    await expect(disabled.locator('fieldset')).toHaveAttribute('aria-disabled', 'true');
    await expect(disabled.getByRole('textbox', { name: 'Disabled field' })).toBeDisabled();
  });

  test('real Tab traversal reaches a field control with Foundry focus treatment', async ({ page }) => {
    const controlled = page.getByRole('textbox', { name: 'Controlled input' });

    for (let tab = 0; tab < 16; tab += 1) {
      await page.keyboard.press('Tab');
      if (await controlled.evaluate((element) => element === document.activeElement)) break;
    }

    await expect(controlled).toBeFocused();
    const focusStyle = await controlled.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        outlineColor: style.outlineColor,
        outlineOffset: style.outlineOffset,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth
      };
    });
    expect(focusStyle).toEqual({
      outlineColor: 'rgb(147, 197, 253)',
      outlineOffset: '4px',
      outlineStyle: 'solid',
      outlineWidth: '3px'
    });
  });

  test('narrow layout retains the long label relationship without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-inputs');

    await expect(page.getByRole('textbox', { name: longLabel })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
