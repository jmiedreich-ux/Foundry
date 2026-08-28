import { expect, test, type Page } from '@playwright/test';

function example(page: Page) {
  return page
    .getByRole('heading', { level: 3, name: 'Empty State Recovery', exact: true })
    .locator('..');
}

function getByRoleRegion(locator: import('@playwright/test').Locator, name: string) {
  return locator.getByRole('region', { name, exact: true });
}

test.describe('CG-M3-31 Empty State Recovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-feedback');
  });

  test('renders exactly one EmptyState region with correct attributes and no forbidden semantics', async ({
    page,
  }) => {
    const frame = example(page);
    const emptyState = getByRoleRegion(frame, 'No Results Found');

    await expect(emptyState).toBeVisible();
    await expect(emptyState).toHaveCount(1);
    await expect(emptyState).toHaveAttribute('data-control', 'empty-state');
    await expect(emptyState).toHaveAttribute('data-size', 'md');

    await expect(emptyState).not.toHaveAttribute('role', 'status');
    await expect(emptyState).not.toHaveAttribute('aria-live');
    await expect(emptyState).not.toHaveAttribute('aria-busy');
    await expect(emptyState).not.toHaveAttribute('data-loading');
    await expect(emptyState).not.toHaveAttribute('data-open');

    await expect(
      frame.getByRole('button', { name: 'Dismiss', exact: true }),
    ).toHaveCount(0);
  });

  test('exposes the long recovery description visibly', async ({ page }) => {
    const frame = example(page);
    const emptyState = getByRoleRegion(frame, 'No Results Found');

    const description = emptyState.locator('p');
    await expect(description).toBeVisible();
    await expect(description).toHaveText(
      'Your current filters have returned no matching results. To find what you are looking for, try broadening your search criteria, removing specific filter constraints, or checking for alternate spellings. You can also clear all applied filters to see the complete set of available items and begin narrowing from there.',
    );
  });

  test('contains exactly one Clear All Filters button as the only interactive element', async ({
    page,
  }) => {
    const frame = example(page);
    const emptyState = getByRoleRegion(frame, 'No Results Found');

    const clearButton = emptyState.getByRole('button', {
      name: 'Clear All Filters',
      exact: true,
    });
    await expect(clearButton).toBeVisible();
    await expect(clearButton).toHaveCount(1);

    const allButtons = emptyState.getByRole('button');
    await expect(allButtons).toHaveCount(1);
  });

  test('clicking Clear All Filters retains one EmptyState and shows visible cleared message', async ({
    page,
  }) => {
    const frame = example(page);
    const emptyState = getByRoleRegion(frame, 'No Results Found');

    await emptyState
      .getByRole('button', { name: 'Clear All Filters', exact: true })
      .click();

    await expect(
      frame.locator('[data-control="empty-state"]'),
    ).toHaveCount(1);
    await expect(emptyState).toBeVisible();

    const outcome = frame.locator('p').last();
    await expect(outcome).toBeVisible();
    await expect(outcome).toContainText('All filters cleared');
  });

  test('real Tab reaches Clear All Filters with Foundry outline and no programmatic focus', async ({
    page,
  }) => {
    const frame = example(page);
    const emptyState = getByRoleRegion(frame, 'No Results Found');
    const clearButton = emptyState.getByRole('button', {
      name: 'Clear All Filters',
      exact: true,
    });

    for (let tab = 0; tab < 80; tab += 1) {
      await page.keyboard.press('Tab');
      const isTarget = await clearButton.evaluate(
        (el) => el === document.activeElement,
      );
      if (isTarget) break;
    }

    await expect(clearButton).toBeFocused();

    const focusStyle = await clearButton.evaluate((element) => {
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

  test('narrow viewport at 320px shows frame, region, and description without overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-feedback');

    const frame = example(page);
    const emptyState = getByRoleRegion(frame, 'No Results Found');

    await expect(frame).toBeVisible();
    await expect(emptyState).toBeVisible();
    await expect(emptyState.locator('p')).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
