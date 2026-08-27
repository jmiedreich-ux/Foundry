import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Field, Group } from '../../../foundation/field.js';
import { Checkbox, type CheckboxProps } from './checkbox.js';

describe('Checkbox', () => {
  it('renders a native checkbox with Field-owned label, description, and error relationships', () => {
    const markup = renderToStaticMarkup(
      <Field label="Accept terms" description="Required to continue" error="You must accept terms." required>
        <Checkbox name="terms" defaultChecked data-example="terms" />
      </Field>
    );

    const id = markup.match(/<input[^>]* id="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(markup).toContain(`for="${id}"`);
    expect(markup).toContain(`aria-labelledby="${id}-label"`);
    expect(markup).toContain(`aria-describedby="${id}-description ${id}-error"`);
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('name="terms"');
    expect(markup).toContain('data-example="terms"');
  });

  it('supports controlled checked state', () => {
    const markup = renderToStaticMarkup(
      <Checkbox name="controlled" checked={true} onChange={() => {}} />
    );

    expect(markup).toContain('checked=""');
    expect(markup).toContain('data-checked=""');
  });

  it('supports controlled unchecked state', () => {
    const markup = renderToStaticMarkup(
      <Checkbox name="controlled" checked={false} onChange={() => {}} />
    );

    expect(markup).not.toContain('checked=""');
    expect(markup).not.toContain('data-checked');
  });

  it('supports uncontrolled with defaultChecked', () => {
    const markup = renderToStaticMarkup(
      <Checkbox name="uncontrolled" defaultChecked />
    );

    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('name="uncontrolled"');
  });

  it('supports uncontrolled without defaultChecked', () => {
    const markup = renderToStaticMarkup(
      <Checkbox name="unchecked" />
    );

    expect(markup).not.toContain('defaultchecked');
    expect(markup).not.toContain('checked=""');
  });

  it('inherits disabled from Group and allows explicit disabled=false override', () => {
    const inheritedMarkup = renderToStaticMarkup(
      <Group disabled>
        <Field label="Terms">
          <Checkbox name="inherited-disabled" />
        </Field>
      </Group>
    );

    expect(inheritedMarkup).toMatch(/<input[^>]*disabled=""/);
    expect(inheritedMarkup).toMatch(/<input[^>]*data-disabled=""/);

    const overrideMarkup = renderToStaticMarkup(
      <Group disabled>
        <Field label="Terms">
          <Checkbox id="override" name="override-enabled" disabled={false} />
        </Field>
      </Group>
    );

    expect(overrideMarkup).toContain('id="override"');
    expect(overrideMarkup).not.toMatch(/<input[^>]*disabled=""/);
    expect(overrideMarkup).not.toMatch(/<input[^>]*data-disabled=""/);
  });

  it('exposes disabled and invalid state attributes', () => {
    const markup = renderToStaticMarkup(
      <Checkbox disabled invalid data-testid="state-checkbox" />
    );

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-invalid=""');
    expect(markup).toContain('data-testid="state-checkbox"');
  });

  it('forwards a native input ref and rejects consumer styling escapes at the type boundary', () => {
    expectTypeOf(Checkbox).toMatchTypeOf<React.ForwardRefExoticComponent<CheckboxProps>>();
    expectTypeOf<CheckboxProps>().toMatchTypeOf<{ className?: never; style?: never }>();
  });
});
