import { expect, test, type Page } from '@playwright/test';

function example(page: Page, title: string) {
  return page
    .getByRole('heading', { level: 3, name: title, exact: true })
    .locator('..');
}

test.describe('CG-M3-32 LoadingSkeleton gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-feedback');
  });

  test('default three-line skeleton has correct status root attributes and exactly 3 aria-hidden bars', async ({
    page,
  }) => {
    const frame = example(page, 'Default Three-line Skeleton');
    const root = frame.locator('[data-control="loading-skeleton"]');

    await expect(root).toBeVisible();
    await expect(root).toHaveAttribute('role', 'status');
    await expect(root).toHaveAttribute('aria-busy', 'true');
    await expect(root).toHaveAttribute('aria-label', 'Loading content');
    await expect(root).toHaveAttribute('data-size', 'md');
    await expect(root).toHaveAttribute('data-loading', '');

    await expect(root).not.toHaveAttribute('aria-live');
    await expect(root).not.toHaveAttribute('aria-valuenow');
    await expect(root).not.toHaveAttribute('aria-valuemin');
    await expect(root).not.toHaveAttribute('aria-valuemax');
    await expect(root).not.toHaveAttribute('aria-valuetext');

    const bars = root.locator('[data-skeleton-bar]');
    await expect(bars).toHaveCount(3);

    for (let i = 0; i < 3; i += 1) {
      const bar = bars.nth(i);
      const tag = await bar.evaluate((el: Element) => el.tagName.toLowerCase());
      expect(tag).toBe('span');
      await expect(bar).toHaveAttribute('aria-hidden', 'true');
    }

    const forbidden = root.locator(
      'progress, [role="progressbar"], [aria-live], [aria-valuenow], [aria-valuemin], [aria-valuemax], button, a, input, [tabindex]',
    );
    await expect(forbidden).toHaveCount(0);
  });

  test('extended six-line skeleton has correct long label and exactly 6 aria-hidden bars', async ({
    page,
  }) => {
    const frame = example(page, 'Extended Six-line Skeleton');
    const root = frame.locator('[data-control="loading-skeleton"]');

    await expect(root).toBeVisible();
    await expect(root).toHaveAttribute('role', 'status');
    await expect(root).toHaveAttribute('aria-busy', 'true');
    await expect(root).toHaveAttribute(
      'aria-label',
      'Loading extended content: multiple sections are being fetched and will be displayed shortly',
    );
    await expect(root).toHaveAttribute('data-size', 'md');
    await expect(root).toHaveAttribute('data-loading', '');

    await expect(root).not.toHaveAttribute('aria-live');
    await expect(root).not.toHaveAttribute('aria-valuenow');
    await expect(root).not.toHaveAttribute('aria-valuemin');
    await expect(root).not.toHaveAttribute('aria-valuemax');
    await expect(root).not.toHaveAttribute('aria-valuetext');

    const bars = root.locator('[data-skeleton-bar]');
    await expect(bars).toHaveCount(6);

    for (let i = 0; i < 6; i += 1) {
      const bar = bars.nth(i);
      const tag = await bar.evaluate((el: Element) => el.tagName.toLowerCase());
      expect(tag).toBe('span');
      await expect(bar).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('real Tab traversal never focuses the skeleton root or any bar', async ({ page }) => {
    const roots = page.locator('[data-control="loading-skeleton"]');
    const allBars = page.locator('[data-skeleton-bar]');
    const rootCount = await roots.count();
    const barCount = await allBars.count();

    for (let step = 0; step < 50; step += 1) {
      await page.keyboard.press('Tab');
      for (let r = 0; r < rootCount; r += 1) {
        await expect(roots.nth(r)).not.toBeFocused();
      }
      for (let b = 0; b < barCount; b += 1) {
        await expect(allBars.nth(b)).not.toBeFocused();
      }
    }
  });

  test('reduced-motion media query kills shimmer animation on bars', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#family-feedback');

    const defaultFrame = example(page, 'Default Three-line Skeleton');
    const bars = defaultFrame.locator('[data-skeleton-bar]');

    await expect(bars).toHaveCount(3);

    const animationName = await bars.first().evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).animationName;
    });
    expect(animationName).toBe('none');
  });

  test('at 320px both skeleton frames are visible with no document overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-feedback');

    const defaultFrame = example(page, 'Default Three-line Skeleton');
    const extendedFrame = example(page, 'Extended Six-line Skeleton');

    await expect(defaultFrame).toBeVisible();
    await expect(extendedFrame).toBeVisible();

    await expect(defaultFrame.locator('[data-control="loading-skeleton"]')).toBeVisible();
    await expect(extendedFrame.locator('[data-control="loading-skeleton"]')).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
