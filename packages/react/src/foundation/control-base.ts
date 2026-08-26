export const controlSizes = ['sm', 'md', 'lg'] as const;
export type ControlSize = (typeof controlSizes)[number];

export type ControlInvalidState = boolean | string;

export interface ControlBaseProps {
  id?: string;
  disabled?: boolean;
  size?: ControlSize;
  invalid?: ControlInvalidState;
  loading?: boolean;
  readOnly?: boolean;
  'data-testid'?: string;
  [dataAttribute: `data-${string}`]: string | boolean | undefined;
}

export interface ResolvedControlBase {
  disabled: boolean;
  size: ControlSize;
  invalid: boolean;
  invalidMessage?: string;
  loading: boolean;
  readOnly: boolean;
}

export interface ControlStateOptions extends Partial<ResolvedControlBase> {
  open?: boolean;
  checked?: boolean;
  selected?: boolean;
  focusVisible?: boolean;
}

export function resolveControlBase(
  props: ControlBaseProps,
  inherited: Pick<ResolvedControlBase, 'disabled' | 'size'> = { disabled: false, size: 'md' }
): ResolvedControlBase {
  const invalidMessage = typeof props.invalid === 'string' ? props.invalid : undefined;
  return {
    disabled: props.disabled ?? inherited.disabled,
    size: props.size ?? inherited.size,
    invalid: Boolean(props.invalid),
    invalidMessage,
    loading: props.loading ?? false,
    readOnly: props.readOnly ?? false
  };
}

export function controlStateAttributes(options: ControlStateOptions): Record<string, '' | undefined> {
  return {
    'data-disabled': options.disabled ? '' : undefined,
    'data-invalid': options.invalid ? '' : undefined,
    'data-loading': options.loading ? '' : undefined,
    'data-open': options.open ? '' : undefined,
    'data-checked': options.checked ? '' : undefined,
    'data-selected': options.selected ? '' : undefined,
    'data-focus-visible': options.focusVisible ? '' : undefined,
    'data-readonly': options.readOnly ? '' : undefined
  };
}
