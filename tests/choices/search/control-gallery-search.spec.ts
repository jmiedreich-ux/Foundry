import { expect, test } from '@playwright/test';

function example(page: import('@playwright/test').Page, title: string) {
  return page
    .getByRole('heading', { level: 3, name: title, exact: true })
    .locator('..');
}

test.describe('M3 Search gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-inputs');
  });

  test('empty state shows initial attributes, text, and status', async ({ page }) => {
    const frame = example(page, 'Controlled Search');
    const input = frame.getByLabel('Filter categories');
    const status = frame.getByRole('status');

    await expect(input).toBeEmpty();
    await expect(input).toHaveAttribute('data-control', 'search');
    await expect(input).toHaveAttribute('data-empty', '');

    await expect(frame.getByText('No filter applied. 10 categories available.')).toBeVisible();
    await expect(status).toHaveText('Showing all 10 categories.');
  });

  test('filling act filters to Actions and updates status', async ({ page }) => {
    const frame = example(page, 'Controlled Search');
    const input = frame.getByLabel('Filter categories');
    const status = frame.getByRole('status');

    await input.fill('act');

    const items = frame.getByRole('listitem');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText('Actions');
    await expect(status).toHaveText('1 of 10 match "act".');
    await expect(input).not.toHaveAttribute('data-empty');
  });

  test('filling zzz shows no-results message and matching status', async ({ page }) => {
    const frame = example(page, 'Controlled Search');
    const input = frame.getByLabel('Filter categories');
    const status = frame.getByRole('status');

    await input.fill('zzz');

    await expect(frame.getByRole('paragraph').filter({ hasText: 'No results match "zzz"' })).toBeVisible();
    await expect(status).toHaveText(/zzz/);
  });

  test('Clear search button restores empty state and focuses input', async ({ page }) => {
    const frame = example(page, 'Controlled Search');
    const input = frame.getByLabel('Filter categories');
    const status = frame.getByRole('status');

    await input.fill('act');
    await expect(frame.getByRole('button', { name: 'Clear search' })).toBeVisible();
    await frame.getByRole('button', { name: 'Clear search' }).click();

    await expect(input).toBeEmpty();
    await expect(input).toHaveAttribute('data-empty', '');
    await expect(status).toHaveText('Showing all 10 categories.');
    await expect(frame.getByText('No filter applied. 10 categories available.')).toBeVisible();
    await expect(input).toBeFocused();
  });

  test('real Tab focus reveals Foundry outline with data-focus-visible', async ({ page }) => {
    const frame = example(page, 'Controlled Search');
    const input = frame.getByLabel('Filter categories');

    for (let tab = 0; tab < 40; tab += 1) {
      await page.keyboard.press('Tab');
      if (await input.evaluate((element) => element === document.activeElement)) break;
    }

    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('data-focus-visible', '');
    const focusStyle = await input.evaluate((element) => {
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

  test('320px viewport retains input and label visibility without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-inputs');

    const frame = example(page, 'Controlled Search');
    await expect(frame.getByLabel('Filter categories')).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
