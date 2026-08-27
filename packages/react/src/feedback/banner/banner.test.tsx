import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Group } from '../../foundation/field.js';
import { Banner, bannerTones, type BannerProps } from './banner.js';

describe('Banner', () => {
  /* ---- tones / title / description / action ---- */

  it('renders each approved tone with the correct data-tone', () => {
    for (const tone of bannerTones) {
      const markup = renderToStaticMarkup(
        <Banner title="Tone test" description="Describing" tone={tone} />
      );
      expect(markup).toContain(`data-tone="${tone}"`);
    }
  });

  it('defaults tone to neutral', () => {
    const markup = renderToStaticMarkup(
      <Banner title="Default" description="Default tone" />
    );
    expect(markup).toContain('data-tone="neutral"');
  });

  it('renders the required title and description', () => {
    const markup = renderToStaticMarkup(
      <Banner title="Deployment complete" description="All systems nominal." />
    );
    expect(markup).toContain('Deployment complete');
    expect(markup).toContain('All systems nominal.');
  });

  it('accepts ReactNode title and description', () => {
    const markup = renderToStaticMarkup(
      <Banner title={<strong>Bold</strong>} description={<em>Italic</em>} />
    );
    expect(markup).toContain('<strong>Bold</strong>');
    expect(markup).toContain('<em>Italic</em>');
  });

  it('renders the optional action', () => {
    const markup = renderToStaticMarkup(
      <Banner
        title="Error"
        description="Something failed."
        action={<button type="button">Retry</button>}
      />
    );
    expect(markup).toContain('Retry');
  });

  /* ---- open modes ---- */

  it('renders the section when open (controlled)', () => {
    const markup = renderToStaticMarkup(
      <Banner {...({ title: 'Open', description: 'Visible', open: true } as unknown as BannerProps)} />
    );
    expect(markup).toMatch(/<section/);
    expect(markup).toContain('data-open=""');
  });

  it('returns null when closed (controlled)', () => {
    const markup = renderToStaticMarkup(
      <Banner {...({ title: 'Closed', description: 'Hidden', open: false } as unknown as BannerProps)} />
    );
    expect(markup).toBe('');
  });

  it('returns null when closed (uncontrolled)', () => {
    const uncontrolledMarkup = renderToStaticMarkup(
      <Banner {...({ title: 'Closed', description: 'Hidden', defaultOpen: false } as unknown as BannerProps)} />
    );
    expect(uncontrolledMarkup).toBe('');
  });

  it('defaults uncontrolled open to true', () => {
    const markup = renderToStaticMarkup(
      <Banner title="Default" description="Visible" />
    );
    expect(markup).toContain('data-open=""');
  });

  /* ---- conflict type ---- */

  it('makes open and defaultOpen mutually exclusive at the type level', () => {
    expectTypeOf<BannerProps>().not.toMatchTypeOf<{
      open: boolean;
      defaultOpen: boolean;
    }>();
  });

  /* ---- dismiss ---- */

  it('renders a dismiss button only when onOpenChange is provided', () => {
    const withoutCallback = renderToStaticMarkup(
      <Banner title="No dismiss" description="Read only" />
    );
    expect(withoutCallback).not.toMatch(/<button/);
    expect(withoutCallback).not.toContain('Dismiss');

    const withCallback = renderToStaticMarkup(
      <Banner title="Dismiss" description="Can close" onOpenChange={() => {}} />
    );
    expect(withoutCallback).not.toMatch(/<button/);
  });

  it('renders a native dismiss button with type button when onOpenChange exists', () => {
    const markup = renderToStaticMarkup(
      <Banner title="Dismiss" description="Has callback" onOpenChange={() => {}} />
    );
    expect(markup).toMatch(/<button[^>]*type="button"/);
    expect(markup).toContain('Dismiss');
    /* Interactive dismissal and onOpenChange call verified by browser test M3-29 */
  });

  /* ---- fixed semantics ---- */

  it('renders a labelled semantic section with fixed data-control', () => {
    const markup = renderToStaticMarkup(
      <Banner title="Semantic" description="Section" />
    );
    const titleId = markup.match(/<h2 id="([^"]+)">Semantic<\/h2>/)?.[1];

    expect(markup).toMatch(/<section/);
    expect(titleId).toBeTruthy();
    expect(markup).toContain(`aria-labelledby="${titleId}"`);
    expect(markup).toContain('data-control="banner"');
    expect(markup).toContain('<p>Section</p>');
  });

  it('inherits Group size and disabled state while explicit Banner values win', () => {
    const inherited = renderToStaticMarkup(
      <Group disabled size="lg">
        <Banner title="Inherited" description="Group values" onOpenChange={() => {}} />
      </Group>
    );
    const overridden = renderToStaticMarkup(
      <Group disabled size="lg">
        <Banner
          title="Override"
          description="Banner values"
          disabled={false}
          size="sm"
          onOpenChange={() => {}}
        />
      </Group>
    );

    expect(inherited).toContain('data-size="lg"');
    expect(inherited).toContain('data-disabled=""');
    expect(inherited).toMatch(/<button[^>]*disabled=""/);
    expect(overridden).toContain('data-size="sm"');
    expect(overridden).not.toMatch(/<section[^>]*data-disabled=""/);
    expect(overridden).not.toMatch(/<button[^>]*disabled=""/);
  });

  it('does not use ARIA banner or alert', () => {
    const markup = renderToStaticMarkup(
      <Banner title="No alert" description="No banner" />
    );
    expect(markup).not.toContain('role="banner"');
    expect(markup).not.toContain('role="alert"');
  });

  /* ---- runtime hook and semantic refusal ---- */

  it('overwrites consumer data-control, data-tone, data-open, data-size, and data-disabled hooks at runtime', () => {
    const markup = renderToStaticMarkup(
      <Banner
        {...({
          title: 'Hook test',
          description: 'Hooks',
          'data-control': 'not-banner',
          'data-disabled': 'not-disabled',
          'data-tone': 'not-neutral',
          'data-open': 'evil',
          'data-size': 'not-size',
        } as unknown as BannerProps)}
      />
    );
    expect(markup).toContain('data-control="banner"');
    expect(markup).toContain('data-tone="neutral"');
    expect(markup).not.toContain('not-banner');
    expect(markup).not.toContain('not-disabled');
    expect(markup).not.toContain('not-neutral');
    expect(markup).not.toContain('not-size');
  });

  it('refuses consumer role, className, and style at runtime', () => {
    const markup = renderToStaticMarkup(
      <Banner
        {...({
          title: 'Refusal',
          description: 'Refused',
          role: 'alert',
          className: 'consumer-class',
          style: { color: 'red' },
        } as unknown as BannerProps)}
      />
    );
    expect(markup).not.toContain('role="alert"');
    expect(markup).not.toContain('consumer-class');
    expect(markup).not.toContain('color');
  });

  it('refuses role, className, style, and consumer section labelling at the type boundary', () => {
    expectTypeOf<BannerProps>().toMatchTypeOf<{
      role?: never;
      className?: never;
      style?: never;
      'aria-labelledby'?: never;
    }>();
  });

  /* ---- long content ---- */

  it('handles long title and description without truncation', () => {
    const longTitle = 'A'.repeat(300);
    const longDescription = 'B'.repeat(500);
    const markup = renderToStaticMarkup(
      <Banner title={longTitle} description={longDescription} />
    );
    expect(markup).toContain(longTitle);
    expect(markup).toContain(longDescription);
  });

  /* ---- ref ---- */

  it('forwards the ref to the section element', () => {
    expectTypeOf(Banner).toMatchTypeOf<
      React.ForwardRefExoticComponent<BannerProps>
    >();
  });

  /* ---- safe adjacent attributes ---- */

  it('keeps safe native section attributes', () => {
    const markup = renderToStaticMarkup(
      <Banner title="Safe" description="Attrs" id="my-banner" data-info="custom" />
    );
    expect(markup).toContain('id="my-banner"');
    expect(markup).toContain('data-info="custom"');
    expect(markup).toContain('data-control="banner"');
  });

  /* ---- no auto-dismiss ---- */

  it('does not introduce a timer or auto-dismiss mechanism', () => {
    const markup = renderToStaticMarkup(
      <Banner title="Stable" description="Persistent" onOpenChange={() => {}} />
    );
    expect(markup).not.toMatch(/setInterval/i);
    expect(markup).not.toMatch(/setTimeout/i);
  });
});
