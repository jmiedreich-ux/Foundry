import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Group } from '../../foundation/field.js';
import * as fs from 'fs';
import * as path from 'path';
import { LoadingSkeleton, type LoadingSkeletonProps } from './loading-skeleton.js';

describe('LoadingSkeleton', () => {
  /* ---- accessible busy status and label ---- */

  it('renders a busy status root with role, aria-busy, and label', () => {
    const markup = renderToStaticMarkup(
      <LoadingSkeleton label="Loading content" />
    );

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toMatch(/aria-label="[^"]*loading[^"]*"/i);
    expect(markup).toContain('data-control="loading-skeleton"');
    expect(markup).toContain('data-loading=""');
  });

  /* ---- default 3 lines and each valid bar count ---- */

  it('renders exactly 3 bars by default', () => {
    const markup = renderToStaticMarkup(
      <LoadingSkeleton label="Default lines" />
    );
    const bars = markup.match(/<span[^>]+data-skeleton-bar/g);
    expect(bars).toHaveLength(3);
  });

  it('renders exactly 1 line when lines is 1', () => {
    const markup = renderToStaticMarkup(
      <LoadingSkeleton label="One line" lines={1} />
    );
    const bars = markup.match(/<span[^>]+data-skeleton-bar/g);
    expect(bars).toHaveLength(1);
  });

  it('renders exactly 6 lines when lines is 6', () => {
    const markup = renderToStaticMarkup(
      <LoadingSkeleton label="Six lines" lines={6} />
    );
    const bars = markup.match(/<span[^>]+data-skeleton-bar/g);
    expect(bars).toHaveLength(6);
  });

  it('all bars are aria-hidden', () => {
    for (const count of [1, 3, 6]) {
      const markup = renderToStaticMarkup(
        <LoadingSkeleton label="Test" lines={count} />
      );
      const bars = markup.match(/<span[^>]+data-skeleton-bar[^>]*>/g);
      expect(bars).toHaveLength(count);
      for (const bar of bars ?? []) {
        expect(bar).toContain('aria-hidden="true"');
      }
    }
  });

  /* ---- invalid line counts throw before rendering ---- */

  it('throws for lines below 1', () => {
    expect(() => {
      renderToStaticMarkup(
        <LoadingSkeleton label="Invalid" lines={0} />
      );
    }).toThrow();
  });

  it('throws for lines above 6', () => {
    expect(() => {
      renderToStaticMarkup(
        <LoadingSkeleton label="Invalid" lines={7} />
      );
    }).toThrow();
  });

  it('throws for non-integer lines', () => {
    expect(() => {
      renderToStaticMarkup(
        <LoadingSkeleton label="Invalid" lines={2.5} />
      );
    }).toThrow();
  });

  /* ---- Group size and explicit size override ---- */

  it('inherits Group lg size and explicit sm wins', () => {
    const inheritedMarkup = renderToStaticMarkup(
      <Group size="lg">
        <LoadingSkeleton label="Inherited" />
      </Group>
    );
    const explicitMarkup = renderToStaticMarkup(
      <Group size="lg">
        <LoadingSkeleton label="Override" size="sm" />
      </Group>
    );

    expect(inheritedMarkup).toContain('data-size="lg"');
    expect(explicitMarkup).toContain('data-size="sm"');
  });

  /* ---- ref forwarding ---- */

  it('forwards ref to the status root', () => {
    expectTypeOf(LoadingSkeleton).toMatchTypeOf<
      React.ForwardRefExoticComponent<LoadingSkeletonProps>
    >();
  });

  /* ---- runtime refusal of consumer escapes ---- */

  it('refuses role, aria-busy, aria-label, className, style, data-control, data-loading, data-size at runtime', () => {
    const markup = renderToStaticMarkup(
      <LoadingSkeleton
        {...({
          label: 'Safe label',
          role: 'progressbar',
          'aria-busy': 'false',
          'aria-hidden': true,
          'aria-label': 'consumer-label',
          'aria-live': 'assertive',
          'aria-valuenow': 50,
          className: 'consumer-skeleton',
          style: { color: 'red' },
          autoFocus: true,
          contentEditable: true,
          'data-control': 'not-skeleton',
          'data-disabled': 'evil',
          'data-loading': 'evil',
          'data-open': 'evil',
          'data-skeleton-bar': 'evil',
          'data-size': 'evil'
        } as unknown as LoadingSkeletonProps)}
      />
    );

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('aria-label="Safe label"');
    expect(markup).toContain('data-control="loading-skeleton"');
    expect(markup).toContain('data-loading=""');
    expect(markup).toContain('data-size="md"');
    expect(markup).not.toContain('role="progressbar"');
    expect(markup).not.toContain('consumer-skeleton');
    expect(markup).not.toContain('color');
    expect(markup).not.toContain('not-skeleton');
    expect(markup).not.toContain('aria-live');
    expect(markup).not.toContain('aria-valuenow');
    expect(markup).not.toContain('data-disabled');
    expect(markup).not.toContain('data-open');
    expect(markup).not.toMatch(/<div[^>]*data-skeleton-bar/);
    expect(markup).not.toMatch(/<div[^>]*aria-hidden/);
    expect(markup).not.toMatch(/<div[^>]*contenteditable/i);
    expect(markup).not.toMatch(/<div[^>]*autofocus/i);
  });

  /* ---- type boundary refusal ---- */

  it('refuses consumer role, aria-busy, aria-label, className, style at the type boundary', () => {
    expectTypeOf<LoadingSkeletonProps>().toMatchTypeOf<{
      role?: never;
      className?: never;
      style?: never;
      autoFocus?: never;
      contentEditable?: never;
      'aria-busy'?: never;
      'aria-hidden'?: never;
      'aria-label'?: never;
      'aria-live'?: never;
      'aria-valuenow'?: never;
      'data-skeleton-bar'?: never;
    }>();
  });

  /* ---- no progress, timer, or false loading state ---- */

  it('does not introduce progressbar, timer, percentage, or false loading state', () => {
    const markup = renderToStaticMarkup(
      <LoadingSkeleton label="Stable loading" />
    );
    expect(markup).not.toContain('progressbar');
    expect(markup).not.toContain('aria-valuenow');
    expect(markup).not.toContain('aria-valuemin');
    expect(markup).not.toContain('aria-valuemax');
    expect(markup).not.toContain('setInterval');
    expect(markup).not.toContain('setTimeout');
    expect(markup).not.toContain('%');
    expect(markup).not.toContain('fetch');
    expect(markup).not.toContain('aria-live');
  });

  /* ---- safe adjacent attributes ---- */

  it('keeps safe native div attributes', () => {
    const markup = renderToStaticMarkup(
      <LoadingSkeleton
        label="Safe"
        id="my-skeleton"
        data-info="custom"
      />
    );
    expect(markup).toContain('id="my-skeleton"');
    expect(markup).toContain('data-info="custom"');
  });

  /* ---- reduced-motion selector exists in default skin ---- */

  it('default.css includes the LoadingSkeleton reduced-motion selector', () => {
    const cssPath = path.resolve(
      __dirname,
      '../../../../tokens/src/skins/default.css'
    );
    const css = fs.readFileSync(cssPath, 'utf-8');
    expect(css).toContain('loading-skeleton');
    expect(css).toContain('skeleton-bar');
    expect(css).toContain('prefers-reduced-motion');
  });
});
