import { expect, test, type Page } from '@playwright/test';

const longLabel =
  'Add New Project Category With All Required Fields Including Name Description Priority and Associated Metadata Tags';

function example(page: Page, title: string) {
  return page
    .getByRole('heading', { level: 3, name: title, exact: true })
    .locator('..');
}

test.describe('M3 Button gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-actions');
  });

  test('activates every approved variant with its observable outcome', async ({ page }) => {
    const variants = example(page, 'Button Variants');
    const status = variants.getByRole('status');
    const expectedOutcomes = [
      ['Open', 'primary', 'primary clicked'],
      ['Edit', 'secondary', 'secondary clicked'],
      ['Delete', 'destructive', 'destructive clicked'],
      ['Back', 'link', 'link clicked'],
    ] as const;

    await expect(variants.getByRole('button')).toHaveCount(4);
    for (const [label, variant, outcome] of expectedOutcomes) {
      const button = variants.getByRole('button', { name: label, exact: true });
      await expect(button).toHaveAttribute('data-variant', variant);
      await button.click();
      await expect(status).toHaveText(`Status: ${outcome}`);
    }
  });

  test('allows enabled Save activation, refuses disabled/loading activation, and recovers on reload', async ({
    page,
  }) => {
    let saveStates = example(page, 'Save Button States');
    let saves = saveStates.getByRole('button', { name: 'Save', exact: true });
    let status = saveStates.getByRole('status');

    await expect(saves).toHaveCount(3);
    await expect(status).toHaveText('Save handler invoked: 0 times');
    await saves.nth(0).click();
    await saves.nth(0).click();
    await expect(status).toHaveText('Save handler invoked: 2 times');
    await expect(saves.nth(1)).toBeDisabled();
    await expect(saves.nth(2)).toBeDisabled();
    await expect(saves.nth(2)).toHaveAttribute('aria-busy', 'true');
    await expect(saves.nth(2)).toHaveAttribute('data-loading', '');

    await page.reload();
    saveStates = example(page, 'Save Button States');
    saves = saveStates.getByRole('button', { name: 'Save', exact: true });
    status = saveStates.getByRole('status');
    await expect(saves.nth(0)).toBeEnabled();
    await expect(status).toHaveText('Save handler invoked: 0 times');
  });

  test('keeps the long custom label visible and announces its activation', async ({ page }) => {
    const custom = example(page, 'Custom Label');
    const button = custom.getByRole('button', { name: longLabel, exact: true });

    await expect(button).toBeVisible();
    await expect(custom.getByRole('status')).toHaveText('inactive');
    await button.click();
    await expect(custom.getByRole('status')).toHaveText(`activated: ${longLabel}`);
  });

  test('real Tab traversal gives an enabled Button the Foundry focus treatment', async ({ page }) => {
    const open = example(page, 'Button Variants').getByRole('button', {
      name: 'Open',
      exact: true,
    });

    for (let tab = 0; tab < 12; tab += 1) {
      await page.keyboard.press('Tab');
      if (await open.evaluate((element) => element === document.activeElement)) break;
    }

    await expect(open).toBeFocused();
    const focusStyle = await open.evaluate((element) => {
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

  test('retains the long custom Button without horizontal overflow at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-actions');

    await expect(
      example(page, 'Custom Label').getByRole('button', { name: longLabel, exact: true }),
    ).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
