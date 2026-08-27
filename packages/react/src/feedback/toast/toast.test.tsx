// @vitest-environment jsdom

import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Group } from '../../foundation/field.js';
import { Toast, toastTones, type ToastProps } from './toast.js';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

async function mountToast(node: ReactNode) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(node);
  });

  return { container, root };
}

async function unmountToast(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

describe('Toast', () => {
  it('renders each approved tone, title, and optional description', () => {
    for (const tone of toastTones) {
      const markup = renderToStaticMarkup(
        <Toast title="Deployment complete" description="All systems nominal." tone={tone} />
      );

      expect(markup).toContain(`data-tone="${tone}"`);
      expect(markup).toContain('Deployment complete');
      expect(markup).toContain('All systems nominal.');
    }

    const withoutDescription = renderToStaticMarkup(<Toast title="No description" />);
    expect(withoutDescription).not.toContain('<p>');
  });

  it('renders one labelled section with one polite atomic message and an external close action', () => {
    const markup = renderToStaticMarkup(
      <Toast title="Complete" description="Saved" onOpenChange={() => {}} />
    );
    const titleId = markup.match(/<h2 id="([^"]+)">Complete<\/h2>/)?.[1];

    expect(titleId).toBeTruthy();
    expect(markup).toContain(`aria-labelledby="${titleId}"`);
    expect(markup).toContain('data-control="toast"');
    expect(markup).toContain('data-open=""');
    expect((markup.match(/role="status"/g) ?? []).length).toBe(1);
    expect(markup).toContain('aria-atomic="true"');
    expect(markup).toMatch(/<\/div><button[^>]*type="button"/);
  });

  it('defaults uncontrolled Toast open and refuses closed controlled or uncontrolled instances', () => {
    expect(renderToStaticMarkup(<Toast title="Default" />)).toContain('data-open=""');
    expect(renderToStaticMarkup(<Toast title="Closed" open={false} />)).toBe('');
    expect(renderToStaticMarkup(<Toast title="Closed" defaultOpen={false} />)).toBe('');
  });

  it('keeps open and defaultOpen mutually exclusive at the type boundary', () => {
    expectTypeOf<ToastProps>().not.toMatchTypeOf<{
      open: boolean;
      defaultOpen: boolean;
    }>();
  });

  it('renders no close action without a callback and uses the catalogued dismiss label with one', () => {
    const withoutCallback = renderToStaticMarkup(<Toast title="Read only" />);
    const withCallback = renderToStaticMarkup(<Toast title="Dismissible" onOpenChange={() => {}} />);

    expect(withoutCallback).not.toMatch(/<button/);
    expect(withCallback).toMatch(/<button[^>]*type="button"/);
    expect(withCallback).toContain('Dismiss');
  });

  it('dismisses an uncontrolled Toast once and keeps it closed for the mounted instance', async () => {
    const onOpenChange = vi.fn();
    const { container, root } = await mountToast(
      <Toast title="Dismiss" onOpenChange={onOpenChange} />
    );

    await act(async () => {
      container.querySelector<HTMLButtonElement>('button')?.click();
    });

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(container.querySelector('section')).toBeNull();
    await unmountToast(root, container);
  });

  it('reports controlled close while the parent controls close and restore', async () => {
    const onOpenChange = vi.fn();
    const { container, root } = await mountToast(
      <Toast title="Controlled" open onOpenChange={onOpenChange} />
    );

    await act(async () => {
      container.querySelector<HTMLButtonElement>('button')?.click();
    });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(container.querySelector('section')).not.toBeNull();

    await act(async () => {
      root.render(<Toast title="Controlled" open={false} onOpenChange={onOpenChange} />);
    });
    expect(container.querySelector('section')).toBeNull();

    await act(async () => {
      root.render(<Toast title="Restored" open onOpenChange={onOpenChange} />);
    });
    expect(container.querySelector('section')?.textContent).toContain('Restored');
    await unmountToast(root, container);
  });

  it('inherits Group size and disabled state, permits explicit overrides, and refuses disabled close', async () => {
    const inherited = renderToStaticMarkup(
      <Group disabled size="lg"><Toast title="Inherited" onOpenChange={() => {}} /></Group>
    );
    const overridden = renderToStaticMarkup(
      <Group disabled size="lg"><Toast title="Override" disabled={false} size="sm" onOpenChange={() => {}} /></Group>
    );
    const onOpenChange = vi.fn();
    const { container, root } = await mountToast(
      <Toast title="Disabled" disabled onOpenChange={onOpenChange} />
    );

    expect(inherited).toContain('data-size="lg"');
    expect(inherited).toMatch(/<button[^>]*disabled=""/);
    expect(overridden).toContain('data-size="sm"');
    expect(overridden).not.toMatch(/<section[^>]*data-disabled=""/);
    expect(overridden).not.toMatch(/<button[^>]*disabled=""/);
    expect(container.querySelector<HTMLButtonElement>('button')?.disabled).toBe(true);
    await act(async () => {
      container.querySelector<HTMLButtonElement>('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onOpenChange).not.toHaveBeenCalled();
    await unmountToast(root, container);
  });

  it('refuses consumer semantic, styling, live-region, and component-hook overrides', () => {
    const markup = renderToStaticMarkup(
      <Toast
        {...({
          title: 'Fixed',
          role: 'alert',
          className: 'consumer-toast',
          style: { color: 'red' },
          'aria-labelledby': 'consumer-title',
          'aria-live': 'assertive',
          'data-control': 'not-toast',
          'data-disabled': 'not-disabled',
          'data-open': 'not-open',
          'data-size': 'not-size',
          'data-tone': 'not-tone'
        } as unknown as ToastProps)}
      />
    );

    expect(markup).toContain('data-control="toast"');
    expect(markup).toContain('role="status"');
    expect(markup).not.toContain('alert');
    expect(markup).not.toContain('assertive');
    expect(markup).not.toContain('consumer-toast');
    expect(markup).not.toContain('consumer-title');
    expect(markup).not.toContain('not-toast');
    expect(markup).not.toContain('not-disabled');
    expect(markup).not.toContain('not-open');
    expect(markup).not.toContain('not-size');
    expect(markup).not.toContain('not-tone');
    expectTypeOf<ToastProps>().toMatchTypeOf<{
      role?: never;
      className?: never;
      style?: never;
      'aria-labelledby'?: never;
      'aria-live'?: never;
    }>();
  });

  it('handles long content, forwards a section ref, and has no automatic lifecycle', () => {
    const title = 'T'.repeat(300);
    const description = 'D'.repeat(500);
    const markup = renderToStaticMarkup(<Toast title={title} description={description} />);

    expect(markup).toContain(title);
    expect(markup).toContain(description);
    expect(markup).not.toMatch(/setInterval|setTimeout/i);
    expectTypeOf(Toast).toMatchTypeOf<React.ForwardRefExoticComponent<ToastProps>>();
  });
});
