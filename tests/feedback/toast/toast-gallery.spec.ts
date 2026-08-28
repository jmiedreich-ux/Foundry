import { expect, test, type Page } from '@playwright/test';

function example(page: Page) {
  return page
    .getByRole('heading', { level: 3, name: 'Controlled Toast', exact: true })
    .locator('..');
}

test.describe('CG-M3-30 Controlled Toast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#family-feedback');
  });

  test('initially renders exactly one success toast region with status and description', async ({
    page,
  }) => {
    const frame = example(page);
    const toast = getByRoleRegion(frame, 'Operation Complete');

    await expect(toast).toBeVisible();
    await expect(toast).toHaveCount(1);
    await expect(toast).toHaveAttribute('data-control', 'toast');
    await expect(toast).toHaveAttribute('data-tone', 'success');
    await expect(toast).toHaveAttribute('data-open', '');
    await expect(toast).toHaveAttribute('data-size', 'md');

    const status = toast.getByRole('status');
    await expect(status).toHaveCount(1);
    await expect(status).toHaveAttribute('aria-atomic', 'true');
    await expect(status.locator('p')).toHaveText(
      'Your changes have been saved successfully and are now available to everyone with access to this workspace, including the selected reviewers and project collaborators.',
    );

    const dismiss = toast.getByRole('button', { name: 'Dismiss', exact: true });
    await expect(dismiss).toBeVisible();
    await expect(status.locator('button')).toHaveCount(0);
  });

  test('dismissing removes toast, shows restore button and status, without programmatic focus', async ({
    page,
  }) => {
    const frame = example(page);
    const dismiss = frame.getByRole('button', { name: 'Dismiss', exact: true });

    const previousActive = await page.evaluate(() => document.activeElement);
    await dismiss.click();

    await expect(frame.locator('[data-control="toast"]')).toHaveCount(0);

    const restoreButton = frame.getByRole('button', { name: 'Restore Toast', exact: true });
    await expect(restoreButton).toHaveCount(1);
    await expect(restoreButton).toBeVisible();

    const statusText = frame.locator('p');
    await expect(statusText.last()).toHaveText('Toast was dismissed');

    const currentActive = await page.evaluate(() => document.activeElement);
    expect(previousActive).toBe(currentActive);
  });

  test('restoring returns exactly one toast with same hooks, removes restore button, and repeat toggle never duplicates', async ({
    page,
  }) => {
    const frame = example(page);

    await frame.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(frame.locator('[data-control="toast"]')).toHaveCount(0);

    await frame.getByRole('button', { name: 'Restore Toast', exact: true }).click();

    const toast = frame.locator('[data-control="toast"]');
    await expect(toast).toHaveCount(1);
    await expect(toast).toBeVisible();
    await expect(toast).toHaveAttribute('data-tone', 'success');
    await expect(toast).toHaveAttribute('data-size', 'md');
    await expect(toast).toHaveAttribute('data-open', '');
    await expect(frame.getByRole('button', { name: 'Dismiss', exact: true })).toBeVisible();
    await expect(
      frame.getByRole('button', { name: 'Restore Toast', exact: true }),
    ).toHaveCount(0);
    await expect(frame.locator('p').last()).toHaveText('Toast was restored');

    await frame.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(frame.locator('[data-control="toast"]')).toHaveCount(0);

    await frame.getByRole('button', { name: 'Restore Toast', exact: true }).click();
    await expect(frame.locator('[data-control="toast"]')).toHaveCount(1);
  });

  test('real Tab reaches Dismiss with Foundry focus outline and no programmatic focus', async ({
    page,
  }) => {
    const frame = example(page);
    const dismiss = frame.getByRole('button', { name: 'Dismiss', exact: true });

    for (let tab = 0; tab < 80; tab += 1) {
      await page.keyboard.press('Tab');
      const isDismiss = await dismiss.evaluate((element) => element === document.activeElement);
      if (isDismiss) break;
    }

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

  test('narrow viewport at 320px shows frame, toast, and description without document overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/#family-feedback');

    const frame = example(page);
    const toast = frame.locator('[data-control="toast"]');

    await expect(frame).toBeVisible();
    await expect(toast).toBeVisible();
    await expect(toast.locator('p')).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});

function getByRoleRegion(locator: import('@playwright/test').Locator, name: string) {
  return locator.getByRole('region', { name, exact: true });
}
