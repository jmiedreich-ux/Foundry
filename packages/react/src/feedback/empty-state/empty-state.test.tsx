import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Group } from '../../foundation/field.js';
import { EmptyState, type EmptyStateProps } from './empty-state.js';

describe('EmptyState', () => {
  /* ---- semantic title / description linkage ---- */

  it('renders title and description visibly with aria-labelledby pointing at title', () => {
    const markup = renderToStaticMarkup(
      <EmptyState title="No records" description="There are no matching results." />
    );

    const titleId = markup.match(/<h2 id="([^"]+)">No records<\/h2>/)?.[1];
    expect(titleId).toBeTruthy();
    expect(markup).toContain(`aria-labelledby="${titleId}"`);
    expect(markup).toContain('No records');
    expect(markup).toContain('There are no matching results.');
  });

  /* ---- zero and one action ---- */

  it('renders zero actions when none is supplied', () => {
    const markup = renderToStaticMarkup(
      <EmptyState title="Empty" description="Nothing here." />
    );
    expect(markup).not.toMatch(/<button/);
    expect(markup).not.toContain('empty-state-action');
  });

  it('renders one supplied action and no extra action', () => {
    const markup = renderToStaticMarkup(
      <EmptyState
        title="Empty"
        description="Nothing here."
        action={<button type="button">Add record</button>}
      />
    );
    expect(markup).toContain('Add record');
    expect(markup).toContain('empty-state-action');
    /* Only the one action button is present */
    const buttonMatches = markup.match(/<button/g);
    expect(buttonMatches).not.toBeNull();
    expect(buttonMatches!.length).toBe(1);
  });

  /* ---- Group size inheritance and explicit override ---- */

  it('inherits Group lg size and explicit sm wins', () => {
    const inherited = renderToStaticMarkup(
      <Group size="lg">
        <EmptyState title="Inherited" description="Group inherited size." />
      </Group>
    );
    const overridden = renderToStaticMarkup(
      <Group size="lg">
        <EmptyState title="Override" description="Explicit size." size="sm" />
      </Group>
    );

    expect(inherited).toContain('data-size="lg"');
    expect(overridden).toContain('data-size="sm"');
  });

  /* ---- runtime/type consumer escape refusal ---- */

  it('refuses consumer semantic, styling, component-hook, and disabled overrides at runtime', () => {
    const markup = renderToStaticMarkup(
      <EmptyState
        {...({
          title: 'Fixed',
          description: 'Cannot escape.',
          role: 'alert',
          className: 'consumer-class',
          style: { color: 'red' },
          'aria-labelledby': 'consumer-id',
          'data-control': 'not-empty-state',
          'data-disabled': 'evil',
          'data-size': 'evil'
        } as unknown as EmptyStateProps)}
      />
    );

    expect(markup).toContain('data-control="empty-state"');
    expect(markup).not.toContain('role="alert"');
    expect(markup).not.toContain('consumer-class');
    expect(markup).not.toContain('color');
    expect(markup).not.toContain('consumer-id');
    expect(markup).not.toContain('not-empty-state');
    expect(markup).not.toContain('data-disabled');
    expect(markup).not.toContain('disabled');
  });

  it('refuses role, className, style, and aria-labelledby at the type boundary', () => {
    expectTypeOf<EmptyStateProps>().toMatchTypeOf<{
      role?: never;
      className?: never;
      style?: never;
      'aria-labelledby'?: never;
    }>();
  });

  /* ---- long content and ref ---- */

  it('retains long title and description without truncation', () => {
    const longTitle = 'A'.repeat(300);
    const longDescription = 'B'.repeat(500);
    const markup = renderToStaticMarkup(
      <EmptyState title={longTitle} description={longDescription} />
    );
    expect(markup).toContain(longTitle);
    expect(markup).toContain(longDescription);
  });

  it('forwards the ref to the section element', () => {
    expectTypeOf(EmptyState).toMatchTypeOf<
      React.ForwardRefExoticComponent<EmptyStateProps>
    >();
  });

  /* ---- stable presentation ---- */

  it('does not introduce status, live region, timer, dismiss, or loading behaviour', () => {
    const markup = renderToStaticMarkup(
      <EmptyState title="Stable" description="No transitions." />
    );
    expect(markup).not.toContain('role="status"');
    expect(markup).not.toContain('aria-live');
    expect(markup).not.toMatch(/setInterval/i);
    expect(markup).not.toMatch(/setTimeout/i);
    expect(markup).not.toContain('Dismiss');
    expect(markup).not.toContain('data-loading');
    expect(markup).not.toContain('data-open');
  });

  /* ---- safe adjacent attributes ---- */

  it('keeps safe native section attributes', () => {
    const markup = renderToStaticMarkup(
      <EmptyState
        title="Safe"
        description="Attrs"
        id="my-empty"
        data-info="custom"
      />
    );
    expect(markup).toContain('id="my-empty"');
    expect(markup).toContain('data-info="custom"');
    expect(markup).toContain('data-control="empty-state"');
  });
});
