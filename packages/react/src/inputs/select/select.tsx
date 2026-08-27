import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';
import {
  controlStateAttributes,
  type ControlInvalidState,
  type ControlSize
} from '../../foundation/control-base.js';
import { useField } from '../../foundation/field.js';
import { useFocusVisible } from '../../foundation/focus-visible.js';

type NativeSelectProps = Omit<
  ComponentPropsWithoutRef<'select'>,
  | 'id'
  | 'disabled'
  | 'size'
  | 'required'
  | 'className'
  | 'style'
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-labelledby'
  | 'aria-required'
>;

export interface SelectProps extends NativeSelectProps {
  id?: string;
  disabled?: boolean;
  size?: ControlSize;
  invalid?: ControlInvalidState;
  required?: boolean;
  className?: never;
  style?: never;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id, disabled, size, invalid, required, onFocus, onBlur, ...nativeProps },
  ref
) {
  const generatedId = useId().replaceAll(':', '');
  const field = useField();
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const resolvedSize = size ?? field?.size ?? 'md';
  const resolvedInvalid = invalid ?? field?.invalidMessage ?? field?.invalid ?? false;
  const resolvedRequired = required ?? field?.required ?? false;
  const controlId = id ?? field?.controlId ?? `foundry-select-${generatedId}`;
  const focus = useFocusVisible<HTMLSelectElement>();

  return (
    <select
      {...nativeProps}
      ref={ref}
      id={controlId}
      disabled={resolvedDisabled}
      required={resolvedRequired}
      onFocus={(event) => {
        focus.onFocus(event);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        focus.onBlur(event);
        onBlur?.(event);
      }}
      aria-labelledby={field?.labelId}
      aria-describedby={field?.describedBy}
      aria-invalid={Boolean(resolvedInvalid) || undefined}
      aria-required={resolvedRequired || undefined}
      {...controlStateAttributes({
        disabled: resolvedDisabled,
        size: resolvedSize,
        invalid: Boolean(resolvedInvalid),
        focusVisible: focus.focusVisible
      })}
    />
  );
});
