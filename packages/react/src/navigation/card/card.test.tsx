// @vitest-environment jsdom

import { act, createRef, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Group } from '../../foundation/field.js';
import { Card, type CardProps } from './card.js';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const mounted: Array<{ root: Root; container: HTMLDivElement }> = [];
async function mount(node: ReactNode) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mounted.push({ root, container });
  await act(async () => { root.render(node); });
  return container;
}
afterEach(async () => {
  await act(async () => { mounted.splice(0).forEach(({ root, container }) => { root.unmount(); container.remove(); }); });
});

describe('Card', () => {
  it('requires a non-empty title and labels its article from the generated heading', () => {
    expect(() => renderToStaticMarkup(<Card title="" />)).toThrow('non-empty title');
    expect(() => renderToStaticMarkup(<Card title="   " />)).toThrow('non-empty title');
    const markup = renderToStaticMarkup(<Card title="Summary" />);
    const titleId = markup.match(/<h2 id="([^"]+)">Summary<\/h2>/)?.[1];
    expect(titleId).toBeTruthy();
    expect(markup).toContain(`<article aria-labelledby="${titleId}"`);
  });

  it('only links a non-empty description', () => {
    const described = renderToStaticMarkup(<Card title="Summary" description="Details" />);
    const descriptionId = described.match(/aria-describedby="([^"]+)"/)?.[1];
    expect(descriptionId).toBeTruthy();
    expect(described).toContain(`<p id="${descriptionId}">Details</p>`);
    expect(renderToStaticMarkup(<Card title="Summary" description="" />)).not.toContain('aria-describedby');
    expect(renderToStaticMarkup(<Card title="Summary" description="   " />)).not.toContain('aria-describedby');
    expect(renderToStaticMarkup(<Card title="Summary" description={null} />)).not.toContain('aria-describedby');
  });

  it('keeps zero, one, and many children without inventing actions or EmptyState behavior', () => {
    expect(renderToStaticMarkup(<Card title="Empty" />)).not.toMatch(/button|empty-state|recovery/i);
    expect(renderToStaticMarkup(<Card title="One"><p>One child</p></Card>)).toContain('One child');
    const many = renderToStaticMarkup(<Card title="Many"><p>First</p><p>Second</p></Card>);
    expect(many).toContain('First');
    expect(many).toContain('Second');
  });

  it('inherits Group size and lets explicit size win', () => {
    expect(renderToStaticMarkup(<Group size="lg"><Card title="Inherited" /></Group>)).toContain('data-size="lg"');
    expect(renderToStaticMarkup(<Group size="lg"><Card title="Explicit" size="sm" /></Group>)).toContain('data-size="sm"');
  });

  it('refuses semantic, state, interaction, focus, and fixed-hook escapes at runtime', () => {
    const markup = renderToStaticMarkup(
      <Card {...({
        title: 'Fixed', className: 'consumer-class', style: { color: 'red' }, role: 'button',
        'aria-live': 'polite', 'data-control': 'wrong', 'data-size': 'wrong', disabled: true,
        invalid: true, loading: true, readOnly: true, hidden: true, autoFocus: true, tabIndex: 0,
        contentEditable: true, 'data-disabled': 'wrong', 'data-invalid': 'wrong', 'data-loading': 'wrong',
        'data-open': 'wrong', 'data-selected': 'wrong', 'data-readonly': 'wrong',
        onClick: () => {}, onKeyDown: () => {}, onMouseEnter: () => {}, onPointerDown: () => {}
      } as unknown as CardProps)} />
    );
    expect(markup).toContain('data-control="card"');
    expect(markup).toContain('data-size="md"');
    for (const refused of ['consumer-class', 'color', 'role="button"', 'aria-live', 'wrong', 'hidden', 'autofocus', 'tabindex', 'contenteditable']) {
      expect(markup).not.toContain(refused);
    }
  });

  it('does not install refused event handlers and forwards its ref to the rendered article', async () => {
    const onClick = vi.fn();
    const onPointerDown = vi.fn();
    const ref = createRef<HTMLElement>();
    const container = await mount(<Card {...({ title: 'Inert', onClick, onPointerDown } as unknown as CardProps)} ref={ref} />);
    const article = container.querySelector('article')!;
    await act(async () => { article.click(); article.dispatchEvent(new Event('pointerdown', { bubbles: true })); });
    expect(onClick).not.toHaveBeenCalled();
    expect(onPointerDown).not.toHaveBeenCalled();
    expect(ref.current).toBe(article);
  });

  it('preserves safe id and ordinary data attributes, long content, and an article ref type', () => {
    const long = 'L'.repeat(300);
    const markup = renderToStaticMarkup(<Card title={long} description={long} id="card-1" data-note="safe" />);
    expect(markup).toContain('id="card-1"');
    expect(markup).toContain('data-note="safe"');
    expect(markup).toContain(long);
    expectTypeOf(Card).toMatchTypeOf<React.ForwardRefExoticComponent<CardProps & { ref?: React.Ref<HTMLElement> }>>();
  });

  it('refuses Card-owned and inert-only props at the type boundary', () => {
    expectTypeOf<CardProps['aria-live']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['autoFocus']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['className']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['contentEditable']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['data-disabled']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['disabled']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['hidden']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['invalid']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['loading']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['onClick']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['onKeyDown']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['onMouseEnter']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['onPointerDown']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['readOnly']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['role']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['style']>().toEqualTypeOf<never | undefined>();
    expectTypeOf<CardProps['tabIndex']>().toEqualTypeOf<never | undefined>();
  });
});
