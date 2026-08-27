import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';
import {
  controlStateAttributes,
  type ControlInvalidState,
  type ControlSize
} from '../../foundation/control-base.js';
import { useField } from '../../foundation/field.js';
import { useFocusVisible } from '../../foundation/focus-visible.js';

type NativeTextFieldProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  | 'id'
  | 'disabled'
  | 'size'
  | 'required'
  | 'readOnly'
  | 'className'
  | 'style'
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-labelledby'
  | 'aria-required'
>;

export interface TextFieldProps extends NativeTextFieldProps {
  id?: string;
  disabled?: boolean;
  size?: ControlSize;
  invalid?: ControlInvalidState;
  readOnly?: boolean;
  required?: boolean;
  className?: never;
  style?: never;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, disabled, size, invalid, readOnly, required, onFocus, onBlur, ...nativeProps },
  ref
) {
  const generatedId = useId().replaceAll(':', '');
  const field = useField();
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const resolvedSize = size ?? field?.size ?? 'md';
  const resolvedInvalid = invalid ?? field?.invalidMessage ?? field?.invalid ?? false;
  const resolvedReadOnly = readOnly ?? false;
  const resolvedRequired = required ?? field?.required ?? false;
  const controlId = id ?? field?.controlId ?? `foundry-text-field-${generatedId}`;
  const focus = useFocusVisible<HTMLInputElement>();

  return (
    <input
      type="text"
      {...nativeProps}
      ref={ref}
      id={controlId}
      disabled={resolvedDisabled}
      readOnly={resolvedReadOnly}
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
        readOnly: resolvedReadOnly,
        focusVisible: focus.focusVisible
      })}
    />
  );
});
