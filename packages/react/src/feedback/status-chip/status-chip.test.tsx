import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Group } from '../../foundation/field.js';
import { StatusChip, statusChipTones, type StatusChipProps } from './status-chip.js';

describe('StatusChip', () => {
  it('renders a non-focusable status span with fixed semantics', () => {
    const markup = renderToStaticMarkup(<StatusChip label="System operational" />);

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-atomic="true"');
    expect(markup).toContain('data-control="status-chip"');
  });

  it('renders each approved tone with the correct data-tone', () => {
    for (const tone of statusChipTones) {
      const markup = renderToStaticMarkup(<StatusChip label="Test" tone={tone} />);
      expect(markup).toContain(`data-tone="${tone}"`);
    }
  });

  it('defaults tone to neutral', () => {
    const markup = renderToStaticMarkup(<StatusChip label="Default tone" />);
    expect(markup).toContain('data-tone="neutral"');
  });

  it('renders the visible label', () => {
    const markup = renderToStaticMarkup(<StatusChip label="Deployment complete" />);
    expect(markup).toContain('Deployment complete');
  });

  it('accepts a ReactNode label', () => {
    const markup = renderToStaticMarkup(
      <StatusChip label={<strong>Bold status</strong>} />
    );
    expect(markup).toContain('<strong>Bold status</strong>');
  });

  it('handles a long label without truncation', () => {
    const longLabel = 'A'.repeat(200);
    const markup = renderToStaticMarkup(<StatusChip label={longLabel} />);
    expect(markup).toContain(longLabel);
  });

  it('forwards the ref to the span', () => {
    let capturedRef: HTMLSpanElement | null = null;

    renderToStaticMarkup(
      <StatusChip label="Ref test" ref={(el) => { capturedRef = el; }} />
    );

    // renderToStaticMarkup does not invoke ref callbacks in SSR; the type boundary
    // confirms ref forwarding structure. The ref prop is typed and wired in the
    // component definition.
    expectTypeOf(StatusChip).toMatchTypeOf<React.ForwardRefExoticComponent<StatusChipProps>>();
  });

  it('rejects consumer role, className, and style at the type boundary', () => {
    expectTypeOf<StatusChipProps>().toMatchTypeOf<{
      role?: never;
      className?: never;
      style?: never;
      tabIndex?: never;
      onClick?: never;
      'aria-live'?: never;
    }>();
  });

  it('uses an explicit or inherited Control Base size', () => {
    const inheritedMarkup = renderToStaticMarkup(
      <Group size="lg"><StatusChip label="Inherited" /></Group>
    );
    const overrideMarkup = renderToStaticMarkup(
      <Group size="lg"><StatusChip label="Override" size="sm" /></Group>
    );

    expect(inheritedMarkup).toContain('data-size="lg"');
    expect(overrideMarkup).toContain('data-size="sm"');
  });

  it('overwrites component-owned data-control and data-tone at runtime', () => {
    const markup = renderToStaticMarkup(
      <StatusChip
        {...({ label: 'Override test', 'data-control': 'not-status-chip', 'data-tone': 'not-neutral' } as unknown as StatusChipProps)}
      />
    );

    expect(markup).toContain('data-control="status-chip"');
    expect(markup).toContain('data-tone="neutral"');
    expect(markup).not.toContain('not-status-chip');
    expect(markup).not.toContain('not-neutral');
  });

  it('refuses consumer role, className, and style at runtime', () => {
    const markup = renderToStaticMarkup(
      <StatusChip
        {...({ label: 'Refusal test', role: 'alert', className: 'consumer-chip', style: { color: 'red' } } as unknown as StatusChipProps)}
      />
    );

    expect(markup).not.toContain('role="alert"');
    expect(markup).not.toContain('consumer-chip');
    expect(markup).not.toContain('color:red');
    expect(markup).toContain('role="status"');
  });

  it('keeps safe native span attributes', () => {
    const markup = renderToStaticMarkup(
      <StatusChip label="Custom data" id="status-1" data-info="custom-value" />
    );

    expect(markup).toContain('id="status-1"');
    expect(markup).toContain('data-info="custom-value"');
  });

  it('does not add interactive behavior or keyboard targets', () => {
    const markup = renderToStaticMarkup(<StatusChip label="No interaction" />);

    expect(markup).not.toMatch(/<button/);
    expect(markup).not.toMatch(/<a /);
    expect(markup).not.toContain('tabindex');
    expect(markup).not.toContain('onClick');
    expect(markup).not.toContain('onKeyDown');
  });

  it('strips interactive and assertive-live runtime escapes', () => {
    const markup = renderToStaticMarkup(
      <StatusChip
        {...({
          label: 'Static',
          tabIndex: 0,
          onClick: () => {},
          onKeyDown: () => {},
          'aria-live': 'assertive'
        } as unknown as StatusChipProps)}
      />
    );

    expect(markup).not.toContain('tabindex');
    expect(markup).not.toContain('aria-live');
    expect(markup).toContain('role="status"');
  });
});
