import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Field, Group } from '../../foundation/field.js';
import { TextField, type TextFieldProps } from './text-field.js';

describe('TextField', () => {
  it('uses Field-owned label and description relationships without duplicating field text', () => {
    const markup = renderToStaticMarkup(
      <Field label="Venue name" description="Shown on receipts" error="Enter a venue name." required>
        <TextField type="email" name="venue" defaultValue="The Atrium" data-example="venue" />
      </Field>
    );

    const id = markup.match(/<input[^>]* id="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(markup).toContain(`for="${id}"`);
    expect(markup).toContain(`aria-labelledby="${id}-label"`);
    expect(markup).toContain(`aria-describedby="${id}-description ${id}-error"`);
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-required="true"');
    expect(markup).toContain('name="venue"');
    expect(markup).toContain('type="email"');
    expect(markup).toContain('value="The Atrium"');
    expect(markup).toContain('data-example="venue"');
  });

  it('preserves explicit values and allows a child to override inherited disabled state', () => {
    const markup = renderToStaticMarkup(
      <Group disabled>
        <Field label="Venue name">
          <TextField id="venue-name" disabled={false} value="Current value" onChange={() => {}} />
        </Field>
      </Group>
    );

    expect(markup).toContain('id="venue-name"');
    expect(markup).toContain('for="venue-name"');
    expect(markup).toContain('value="Current value"');
    expect(markup).not.toMatch(/<input[^>]*disabled=""/);
  });

  it('exposes native readonly and the shared state attributes', () => {
    const markup = renderToStaticMarkup(<TextField readOnly invalid data-testid="read-only-field" />);

    expect(markup).toContain('readonly=""');
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('data-readonly=""');
    expect(markup).toContain('data-invalid=""');
    expect(markup).toContain('data-testid="read-only-field"');
  });

  it('forwards a native input ref and rejects consumer styling escapes at the type boundary', () => {
    expectTypeOf(TextField).toMatchTypeOf<React.ForwardRefExoticComponent<TextFieldProps>>();
    expectTypeOf<TextFieldProps>().toMatchTypeOf<{ className?: never; style?: never }>();
  });
});
