import { describe, expect, expectTypeOf, it } from 'vitest';
import { controlStateAttributes, resolveControlBase } from './control-base.js';
import { englishLabelCatalog, labelCategories, resolveLabel } from './labels.js';
import { defineControl } from './registry.js';
import type { ControlBaseProps } from './control-base.js';

describe('Control Base', () => {
  it('inherits group disabled and size unless explicitly overridden', () => {
    expect(resolveControlBase({}, { disabled: true, size: 'sm' })).toMatchObject({ disabled: true, size: 'sm' });
    expect(resolveControlBase({ disabled: false, size: 'lg' }, { disabled: true, size: 'sm' })).toMatchObject({ disabled: false, size: 'lg' });
  });

  it('maps the approved state vocabulary to root attributes', () => {
    expect(controlStateAttributes({ disabled: true, invalid: true, loading: true, open: true, checked: true, selected: true, focusVisible: true, readOnly: true })).toEqual({
      'data-disabled': '', 'data-invalid': '', 'data-loading': '', 'data-open': '', 'data-checked': '', 'data-selected': '', 'data-focus-visible': '', 'data-readonly': ''
    });
  });

  it('permits label overrides only for approved categories', () => {
    expect(resolveLabel('add', 'Add item')).toBe('Add item');
    expect(resolveLabel('save', 'Persist')).toBe('Save');
    expect(labelCategories.every((category) => englishLabelCatalog[category].value.length > 0)).toBe(true);
    expect(labelCategories.filter((category) => englishLabelCatalog[category].allowOverride)).toEqual(['add', 'back']);
  });

  it('makes a ref available and rejects consumer styling escapes at the type boundary', () => {
    expectTypeOf<ControlBaseProps>().toHaveProperty('ref');
    expectTypeOf<ControlBaseProps>().toMatchTypeOf<{ className?: never; style?: never }>();
  });

  it('requires a stable registry name', () => {
    expect(() => defineControl({ name: ' ', catalog: 'core', states: [] })).toThrow('stable name');
    expect(defineControl({ name: 'Button', catalog: 'core', states: ['disabled'] })).toMatchObject({ name: 'Button' });
  });
});
