import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Field, Group } from '../../../foundation/field.js';
import {
  getNextEnabledRadioIndex,
  RadioGroup,
  resolveInitialRadioValue,
  type RadioGroupProps
} from './radio-group.js';

const options = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma', disabled: true }
] as const;

describe('RadioGroup', () => {
  it('renders same-name native radios with Field relationships and required state', () => {
    const markup = renderToStaticMarkup(
      <Field label="Plan" description="Choose one" error="Required" required>
        <RadioGroup name="plan" options={options} defaultValue="beta" />
      </Field>
    );
    expect(markup).toContain('<fieldset');
    expect(markup).toContain('aria-labelledby=');
    expect(markup).toContain('aria-describedby=');
    expect(markup).toContain('aria-required="true"');
    expect(markup).toContain('name="plan"');
    expect(markup).toMatch(/<input[^>]*required=""[^>]*value="alpha"/);
    expect(markup).toMatch(/<input[^>]*checked=""[^>]*value="beta"/);
    expect(markup).toMatch(/<input[^>]*disabled=""[^>]*value="gamma"/);
  });

  it('selects the first enabled option for required uncontrolled state with no default', () => {
    const markup = renderToStaticMarkup(<RadioGroup name="plan" options={options} required />);
    expect(markup).toMatch(/<input[^>]*required=""[^>]*checked=""[^>]*value="alpha"/);
  });

  it('supports controlled selection and rejects controlled/default conflict at the type boundary', () => {
    const markup = renderToStaticMarkup(<RadioGroup name="plan" options={options} value="beta" onValueChange={() => {}} />);
    expect(markup).toMatch(/<input[^>]*checked=""[^>]*value="beta"/);
    expectTypeOf<RadioGroupProps>().not.toMatchTypeOf<{ value: string; defaultValue: string }>();
  });

  it('does not select disabled or missing controlled values', () => {
    const disabledMarkup = renderToStaticMarkup(<RadioGroup name="plan" options={options} value="gamma" onValueChange={() => {}} />);
    const missingMarkup = renderToStaticMarkup(<RadioGroup name="plan" options={options} value="missing" onValueChange={() => {}} />);
    expect(disabledMarkup).not.toContain('checked=""');
    expect(disabledMarkup).not.toContain('data-selected');
    expect(missingMarkup).not.toContain('checked=""');
    expect(missingMarkup).not.toContain('data-selected');
  });

  it('allows RadioGroup disabled=false to override Group disabled', () => {
    const markup = renderToStaticMarkup(<Group disabled><Field label="Plan"><RadioGroup name="plan" options={options.slice(0, 2)} disabled={false} /></Field></Group>);
    expect(markup).not.toMatch(/<input[^>]*disabled=""/);
  });

  it('renders non-required empty and missing-value groups without selection', () => {
    expect(renderToStaticMarkup(<RadioGroup name="empty" options={[]} />)).toContain('<fieldset');
    const markup = renderToStaticMarkup(<RadioGroup name="plan" options={options} defaultValue="missing" />);
    expect(markup).not.toContain('checked=""');
  });

  it('refuses ambiguous or impossible required configurations', () => {
    expect(() => renderToStaticMarkup(<RadioGroup name="duplicate" options={[{ value: 'a', label: 'A' }, { value: 'a', label: 'Again' }]} />)).toThrow('unique');
    expect(() => renderToStaticMarkup(<RadioGroup name="empty" options={[]} required />)).toThrow('enabled option');
    expect(() => renderToStaticMarkup(<RadioGroup name="plan" options={options} required defaultValue="gamma" />)).toThrow('defaultValue');
    expect(() => renderToStaticMarkup(<RadioGroup name="plan" options={options} required value="missing" onValueChange={() => {}} />)).toThrow('value');
  });

  it('calculates native reset values and roving keyboard targets deterministically', () => {
    expect(resolveInitialRadioValue(options, true, undefined)).toBe('alpha');
    expect(resolveInitialRadioValue(options, false, 'gamma')).toBeUndefined();
    expect(getNextEnabledRadioIndex(options, false, 0, 'next')).toBe(1);
    expect(getNextEnabledRadioIndex(options, false, 1, 'next')).toBe(0);
    expect(getNextEnabledRadioIndex(options, false, 0, 'previous')).toBe(1);
    expect(getNextEnabledRadioIndex(options, false, 1, 'first')).toBe(0);
    expect(getNextEnabledRadioIndex(options, false, 0, 'last')).toBe(1);
    expect(getNextEnabledRadioIndex(options, true, 0, 'next')).toBeUndefined();
  });

  it('forwards a fieldset ref and refuses consumer role and styling overrides', () => {
    expectTypeOf(RadioGroup).toMatchTypeOf<React.ForwardRefExoticComponent<RadioGroupProps>>();
    expectTypeOf<RadioGroupProps>().toMatchTypeOf<{ role?: never; className?: never; style?: never }>();
    const unsafeProps = { role: 'presentation', className: 'escape' } as unknown as Pick<RadioGroupProps, 'role' | 'className'>;
    const markup = renderToStaticMarkup(<RadioGroup name="plan" options={options} {...unsafeProps} />);
    expect(markup).not.toContain('role="presentation"');
    expect(markup).not.toContain('class="escape"');
  });
});
