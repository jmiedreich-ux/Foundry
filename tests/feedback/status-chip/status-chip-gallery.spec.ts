import { expect, test, type Page } from '@playwright/test';

function example(page: Page, title: string) {
  return page
    .getByRole('heading', { level: 3, name: title, exact: true })
    .locator('..');
}

test.describe('CG-M3-28 StatusChip gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-feedback');
  });

  test('exposes exactly four tones with correct labels, data-tone values, and non-focusable status semantics', async ({
    page,
  }) => {
    const frame = example(page, 'StatusChip Tones');
    const chips = frame.locator('[data-control="status-chip"]');

    await expect(chips).toHaveCount(4);

    const spec = [
      ['Draft not yet submitted', 'neutral'],
      ['Changes saved successfully', 'success'],
      ['Review overdue by 3 days', 'warning'],
      ['Deployment failed: connection timeout', 'danger'],
    ] as const;

    for (let i = 0; i < spec.length; i += 1) {
      const [label, tone] = spec[i];
      const chip = chips.nth(i);
      await expect(chip).toBeVisible();
      await expect(chip).toHaveAttribute('data-tone', tone);
      await expect(chip).toHaveAttribute('role', 'status');
      await expect(chip).toHaveAttribute('aria-atomic', 'true');
      await expect(chip).toHaveAttribute('data-control', 'status-chip');
      await expect(chip).toHaveText(label);
    }
  });

  test('each chip is a non-focusable span, not a button or interactive role', async ({
    page,
  }) => {
    const frame = example(page, 'StatusChip Tones');
    const chips = frame.locator('[data-control="status-chip"]');

    await expect(chips).toHaveCount(4);

    for (let i = 0; i < 4; i += 1) {
      const chip = chips.nth(i);
      const tag = await chip.evaluate((el: HTMLElement) => el.tagName.toLowerCase());
      expect(tag).toBe('span');
      await expect(chip).not.toBeFocused();
    }
  });

  test('real Tab traversal skips StatusChip elements entirely', async ({ page }) => {
    const frame = example(page, 'StatusChip Tones');
    const chips = frame.locator('[data-control="status-chip"]');

    await expect(chips).toHaveCount(4);

    await page.keyboard.press('Tab');

    for (let i = 0; i < 4; i += 1) {
      const chip = chips.nth(i);
      await expect(chip).not.toBeFocused();
    }
  });

  test('long danger label overflows gracefully with no horizontal overflow at 320px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-feedback');

    const frame = example(page, 'Long Label Overflow');
    const chip = frame.locator('[data-control="status-chip"]');

    await expect(chip).toBeVisible();
    await expect(frame).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });

  test('long-label chip has danger tone and visible text content', async ({ page }) => {
    const frame = example(page, 'Long Label Overflow');
    const chip = frame.locator('[data-control="status-chip"]');

    await expect(chip).toBeVisible();
    await expect(chip).toHaveAttribute('data-tone', 'danger');
    await expect(chip).toHaveText(
      'Deployment pipeline stage seven of twelve encountered an unrecoverable resource contention error requiring manual intervention',
    );
  });
});
