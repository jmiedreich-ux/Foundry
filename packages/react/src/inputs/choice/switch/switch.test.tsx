import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Field, Group } from '../../../foundation/field.js';
import { Switch, type SwitchProps } from './switch.js';

describe('Switch', () => {
  it('renders a native switch with role=switch and Field-owned label, description, and error relationships', () => {
    const markup = renderToStaticMarkup(
      <Field label="Enable notifications" description="Receive push updates" error="Selection required." required>
        <Switch name="notifications" defaultChecked data-example="notifications" />
      </Field>
    );

    const id = markup.match(/<input[^>]* id="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(markup).toContain(`for="${id}"`);
    expect(markup).toContain(`aria-labelledby="${id}-label"`);
    expect(markup).toContain(`aria-describedby="${id}-description ${id}-error"`);
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('required=""');
    expect(markup).toContain('aria-required="true"');
    expect(markup).toContain('role="switch"');
    expect(markup).toContain('name="notifications"');
    expect(markup).toContain('data-example="notifications"');
  });

  it('supports controlled checked state', () => {
    const markup = renderToStaticMarkup(
      <Switch name="controlled" checked={true} onChange={() => {}} />
    );

    expect(markup).toContain('checked=""');
    expect(markup).toContain('data-checked=""');
  });

  it('makes controlled and uncontrolled props mutually exclusive', () => {
    expectTypeOf<SwitchProps>().not.toMatchTypeOf<{
      checked: boolean;
      defaultChecked: boolean;
    }>();
  });

  it('does not permit consumers to override the Switch role', () => {
    expectTypeOf<SwitchProps>().toMatchTypeOf<{ role?: never }>();
  });

  it('supports controlled unchecked state', () => {
    const markup = renderToStaticMarkup(
      <Switch name="controlled" checked={false} onChange={() => {}} />
    );

    expect(markup).not.toContain('checked=""');
    expect(markup).not.toContain('data-checked');
  });

  it('supports uncontrolled with defaultChecked', () => {
    const markup = renderToStaticMarkup(
      <Switch name="uncontrolled" defaultChecked />
    );

    expect(markup).toContain('role="switch"');
    expect(markup).toContain('name="uncontrolled"');
    expect(markup).toContain('checked=""');
    expect(markup).toContain('data-checked=""');
  });

  it('supports uncontrolled without defaultChecked', () => {
    const markup = renderToStaticMarkup(
      <Switch name="unchecked" />
    );

    expect(markup).not.toContain('defaultchecked');
    expect(markup).not.toContain('checked=""');
    expect(markup).not.toContain('data-checked');
  });

  it('inherits disabled from Group and allows explicit disabled=false override', () => {
    const inheritedMarkup = renderToStaticMarkup(
      <Group disabled>
        <Field label="Notifications">
          <Switch name="inherited-disabled" />
        </Field>
      </Group>
    );

    expect(inheritedMarkup).toMatch(/<input[^>]*disabled=""/);
    expect(inheritedMarkup).toMatch(/<input[^>]*data-disabled=""/);

    const overrideMarkup = renderToStaticMarkup(
      <Group disabled>
        <Field label="Notifications">
          <Switch id="override" name="override-enabled" disabled={false} />
        </Field>
      </Group>
    );

    expect(overrideMarkup).toContain('id="override"');
    expect(overrideMarkup).not.toMatch(/<input[^>]*disabled=""/);
    expect(overrideMarkup).not.toMatch(/<input[^>]*data-disabled=""/);
  });

  it('exposes disabled, invalid, checked, and focus-visible state attributes', () => {
    const markup = renderToStaticMarkup(
      <Switch disabled invalid checked={true} data-testid="state-switch" onChange={() => {}} />
    );

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('data-disabled=""');
    expect(markup).toContain('data-invalid=""');
    expect(markup).toContain('data-checked=""');
    expect(markup).toContain('data-testid="state-switch"');
  });

  it('forwards a native input ref and rejects consumer styling escapes at the type boundary', () => {
    expectTypeOf(Switch).toMatchTypeOf<React.ForwardRefExoticComponent<SwitchProps>>();
    expectTypeOf<SwitchProps>().toMatchTypeOf<{ className?: never; style?: never }>();
  });
});
