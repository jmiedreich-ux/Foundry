import { expect, test, type Page } from '@playwright/test';

function example(page: Page, title: string) {
  return page
    .getByRole('heading', { level: 3, name: title, exact: true })
    .locator('..');
}

test.describe('CG-M3-29 Banner gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-feedback');
  });

  test('initially renders one warning banner with correct data attributes and visible content', async ({
    page,
  }) => {
    const frame = example(page, 'Controlled Banner');
    const banner = frame.getByRole('region', { name: 'Warning', exact: true });

    await expect(banner).toBeVisible();
    await expect(banner).toHaveCount(1);
    await expect(banner).toHaveAttribute('data-control', 'banner');
    await expect(banner).toHaveAttribute('data-tone', 'warning');
    await expect(banner).toHaveAttribute('data-open', '');
    await expect(banner).toHaveAttribute('data-size', 'md');

    await expect(frame.getByRole('heading', { level: 2, name: 'Warning', exact: true })).toBeVisible();
    await expect(frame.getByRole('button', { name: 'Dismiss', exact: true })).toBeVisible();
    await expect(frame.getByRole('button', { name: 'Recovery action', exact: true })).toBeVisible();

    await expect(banner.locator('p')).toBeVisible();
    await expect(banner.locator('p')).toHaveText(
      'This Banner is controlled by external React state. Clicking Dismiss will close it. You can reopen it using the restore button below.',
    );
  });

  test('recovery action keeps exactly one banner present and updates status', async ({ page }) => {
    const frame = example(page, 'Controlled Banner');
    const banner = frame.locator('[data-control="banner"]');
    const recovery = frame.getByRole('button', { name: 'Recovery action', exact: true });
    const status = frame.getByRole('status');

    await recovery.click();
    await expect(banner).toHaveCount(1);
    await expect(banner).toBeVisible();
    await expect(status).toHaveText('Recovery action invoked');
  });

  test('dismiss removes banner, shows restore button, reports dismissed status, and does not move focus', async ({
    page,
  }) => {
    const frame = example(page, 'Controlled Banner');
    const dismiss = frame.getByRole('button', { name: 'Dismiss', exact: true });
    const status = frame.getByRole('status');

    const previousActive = await page.evaluate(() => document.activeElement);
    await dismiss.click();

    await expect(
      frame.locator('[data-control="banner"]'),
    ).not.toBeVisible();
    await expect(
      frame.getByRole('button', { name: 'Restore Banner', exact: true }),
    ).toHaveCount(1);
    await expect(status).toHaveText('Banner was dismissed');

    const currentActive = await page.evaluate(() => document.activeElement);
    expect(previousActive).toBe(currentActive);
  });

  test('restore returns exactly one warning banner with the same hooks and removes restore button', async ({
    page,
  }) => {
    const frame = example(page, 'Controlled Banner');
    const status = frame.getByRole('status');

    await frame.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(frame.locator('[data-control="banner"]')).not.toBeVisible();

    await frame.getByRole('button', { name: 'Restore Banner', exact: true }).click();

    const banner = frame.locator('[data-control="banner"]');
    await expect(banner).toHaveCount(1);
    await expect(banner).toBeVisible();
    await expect(banner).toHaveAttribute('data-control', 'banner');
    await expect(banner).toHaveAttribute('data-size', 'md');
    await expect(banner).toHaveAttribute('data-tone', 'warning');
    await expect(banner).toHaveAttribute('data-open', '');
    await expect(frame.getByRole('button', { name: 'Dismiss', exact: true })).toBeVisible();
    await expect(frame.getByRole('button', { name: 'Recovery action', exact: true })).toBeVisible();
    await expect(
      frame.getByRole('button', { name: 'Restore Banner', exact: true }),
    ).not.toBeVisible();
    await expect(status).toHaveText('Banner was restored');
  });

  test('real Tab reaches Dismiss with Foundry focus outline', async ({ page }) => {
    const frame = example(page, 'Controlled Banner');

    for (let tab = 0; tab < 50; tab += 1) {
      await page.keyboard.press('Tab');
      const dismissed = await page.evaluate(
        'document.activeElement?.getAttribute("aria-label") === "Dismiss"'
      );
      if (dismissed) break;
    }

    const dismiss = frame.getByRole('button', { name: 'Dismiss', exact: true });
    await expect(dismiss).toBeFocused();
    const focusStyle = await dismiss.evaluate((element) => {
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

  test('narrow viewport at 320px shows banner content without horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-feedback');

    const frame = example(page, 'Controlled Banner');
    const banner = frame.locator('[data-control="banner"]');

    await expect(frame).toBeVisible();
    await expect(banner).toBeVisible();
    await expect(frame.locator('[data-control="banner"] p')).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
