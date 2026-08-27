import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Field, Group, useField } from './field.js';

function Probe({ disabled }: { disabled?: boolean }) {
  const field = useField();
  if (!field) throw new Error('Probe must be inside Field.');
  return (
    <input
      id={field.controlId}
      aria-labelledby={field.labelId}
      aria-describedby={field.describedBy}
      aria-invalid={field.invalid || undefined}
      aria-required={field.required || undefined}
      disabled={disabled ?? field.disabled}
    />
  );
}

describe('Field', () => {
  it('owns generated IDs and connects label, description, error, required, and invalid state', () => {
    const markup = renderToStaticMarkup(
      <Field label="Venue name" description="Shown on receipts" error="Enter a venue name." required>
        <Probe />
      </Field>
    );

    const id = markup.match(/<input id="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(markup).toContain(`<label id="${id}-label" for="${id}">Venue name`);
    expect(markup).toContain(`aria-describedby="${id}-description ${id}-error"`);
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-required="true"');
    expect(markup).toContain(`id="${id}-error" role="alert">Enter a venue name.`);
  });

  it('does not render absent description or error relationships', () => {
    const markup = renderToStaticMarkup(<Field label="Name"><Probe /></Field>);
    expect(markup).not.toContain('aria-describedby');
    expect(markup).not.toContain('role="alert"');
  });

  it('uses a direct child control ID so the label does not target a stale generated ID', () => {
    const markup = renderToStaticMarkup(
      <Field label="Venue name"><input id="venue-name" /></Field>
    );

    expect(markup).toContain('for="venue-name"');
  });
});

describe('Group', () => {
  it('provides disabled state while allowing an explicit child override', () => {
    const inherited = renderToStaticMarkup(<Group disabled><Field label="Name"><Probe /></Field></Group>);
    const overridden = renderToStaticMarkup(<Group disabled><Field label="Name"><Probe disabled={false} /></Field></Group>);

    expect(inherited).toContain('aria-disabled="true"');
    expect(inherited).toMatch(/<input[^>]*disabled=""/);
    expect(overridden).not.toMatch(/<input[^>]*disabled=""/);
  });
});
