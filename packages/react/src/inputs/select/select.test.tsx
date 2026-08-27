import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Field, Group } from '../../foundation/field.js';
import { Select, type SelectProps } from './select.js';

describe('Select', () => {
  it('uses Field-owned label, help, error, required, and invalid semantics', () => {
    const markup = renderToStaticMarkup(
      <Field label="Venue type" description="Used for reporting" error="Choose a type." required>
        <Select name="venue-type" defaultValue="indoor" data-example="venue-type">
          <option value="">Choose one</option>
          <option value="indoor">Indoor</option>
        </Select>
      </Field>
    );

    const id = markup.match(/<select[^>]* id="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(markup).toContain(`for="${id}"`);
    expect(markup).toContain(`aria-labelledby="${id}-label"`);
    expect(markup).toContain(`aria-describedby="${id}-description ${id}-error"`);
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-required="true"');
    expect(markup).toContain('name="venue-type"');
    expect(markup).toContain('<option value="indoor" selected="">Indoor</option>');
  });

  it('supports controlled values and an explicit enabled child in a disabled group', () => {
    const markup = renderToStaticMarkup(
      <Group disabled>
        <Field label="Venue type">
          <Select id="venue-type" disabled={false} value="outdoor" onChange={() => {}}>
            <option value="outdoor">Outdoor</option>
          </Select>
        </Field>
      </Group>
    );

    expect(markup).toContain('id="venue-type"');
    expect(markup).toContain('for="venue-type"');
    expect(markup).toContain('<option value="outdoor" selected="">Outdoor</option>');
    expect(markup).not.toMatch(/<select[^>]*disabled=""/);
  });

  it('exposes disabled and invalid state attributes', () => {
    const markup = renderToStaticMarkup(<Select disabled invalid data-testid="venue-select"><option>Venue</option></Select>);

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-invalid=""');
    expect(markup).toContain('data-testid="venue-select"');
  });

  it('forwards a native select ref and rejects consumer styling escapes at the type boundary', () => {
    expectTypeOf(Select).toMatchTypeOf<React.ForwardRefExoticComponent<SelectProps>>();
    expectTypeOf<SelectProps>().toMatchTypeOf<{ className?: never; style?: never }>();
  });
});
