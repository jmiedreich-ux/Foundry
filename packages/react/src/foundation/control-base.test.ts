import { describe, expect, it } from 'vitest';
import { controlStateAttributes, resolveControlBase } from './control-base.js';
import { resolveLabel } from './labels.js';

describe('Control Base', () => {
  it('inherits group disabled and size unless explicitly overridden', () => {
    expect(resolveControlBase({}, { disabled: true, size: 'sm' })).toMatchObject({ disabled: true, size: 'sm' });
    expect(resolveControlBase({ disabled: false, size: 'lg' }, { disabled: true, size: 'sm' })).toMatchObject({ disabled: false, size: 'lg' });
  });

  it('maps the approved state vocabulary to root attributes', () => {
    expect(controlStateAttributes({ disabled: true, open: true, focusVisible: true })).toMatchObject({ 'data-disabled': '', 'data-open': '', 'data-focus-visible': '' });
  });

  it('permits label overrides only for approved categories', () => {
    expect(resolveLabel('add', 'Add item')).toBe('Add item');
    expect(resolveLabel('save', 'Persist')).toBe('Save');
  });
});
