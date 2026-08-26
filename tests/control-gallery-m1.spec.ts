import { test, expect } from '@playwright/test';

test('gallery direct load exposes structure', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#root')).toHaveCount(1);
  await expect(page.locator('main[aria-label="Gallery application"]')).toBeVisible();
  await expect(page.locator('h1').filter({ hasText: 'Control Gallery' })).toBeVisible();

  const expectedSections = [
    'family-actions',
    'family-inputs',
    'family-overlays',
    'family-navigation',
    'family-feedback',
  ];
  for (const id of expectedSections) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test('family navigation has five links and hash updates', async ({ page }) => {
  await page.goto('/');

  const nav = page.locator('nav[aria-label="Gallery control-family navigation"]');
  const links = nav.locator('a');
  await expect(links).toHaveCount(5);

  const hrefs = [
    '#family-actions',
    '#family-inputs',
    '#family-overlays',
    '#family-navigation',
    '#family-feedback',
  ];
  for (let i = 0; i < 5; i++) {
    await expect(links.nth(i)).toHaveAttribute('href', hrefs[i]);
  }

  await links.nth(0).click();
  await expect(page).toHaveURL(/#family-actions/);
  await expect(page.locator('main[aria-label="Gallery application"]')).toBeVisible();
});

test('keyboard focus on reduced-motion button shows visible outline', async ({ page }) => {
  await page.goto('/');

  const btn = page.locator('button[aria-pressed]');
  await page.keyboard.press('Tab');
  await expect(btn).toBeFocused();

  const outline = await btn.evaluate((el) =>
    window.getComputedStyle(el).getPropertyValue('outline'),
  );
  expect(outline).not.toBe('none');
});

test('narrow viewport does not produce horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.goto('/');

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test('reduced motion toggle toggles body class, aria-pressed, and label', async ({
  page,
}) => {
  await page.goto('/');

  const btn = page.locator('button[aria-pressed]');
  const sections = page.locator('section[id^="family-"]');

  await btn.click();

  await expect(page.locator('body')).toHaveClass(/reduce-motion/);
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  await expect(btn).toContainText('Motion reduced');

  await expect(sections).toHaveCount(5);

  await btn.click();

  await expect(page.locator('body')).not.toHaveClass(/reduce-motion/);
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
  await expect(btn).toContainText('Reduce motion');
});
