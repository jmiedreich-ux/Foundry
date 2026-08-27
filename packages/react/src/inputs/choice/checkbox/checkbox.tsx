import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef
} from 'react';
import {
  controlStateAttributes,
  type ControlInvalidState,
  type ControlSize
} from '../../../foundation/control-base.js';
import { useField } from '../../../foundation/field.js';
import { useFocusVisible } from '../../../foundation/focus-visible.js';

type NativeCheckboxProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  | 'id'
  | 'disabled'
  | 'size'
  | 'type'
  | 'className'
  | 'style'
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-labelledby'
>;

export interface CheckboxProps extends NativeCheckboxProps {
  id?: string;
  disabled?: boolean;
  size?: ControlSize;
  invalid?: ControlInvalidState;
  checked?: boolean;
  defaultChecked?: boolean;
  className?: never;
  style?: never;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, disabled, size, invalid, checked, defaultChecked, onFocus, onBlur, ...nativeProps },
  ref
) {
  const generatedId = useId().replaceAll(':', '');
  const field = useField();
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const _resolvedSize = size ?? field?.size ?? 'md';
  const resolvedInvalid = invalid ?? field?.invalidMessage ?? field?.invalid ?? false;
  const controlId = id ?? field?.controlId ?? `foundry-checkbox-${generatedId}`;
  const focus = useFocusVisible<HTMLInputElement>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = typeof checked === 'boolean';
  const [uncontrolledChecked, setUncontrolledChecked] = useState(() => Boolean(defaultChecked));
  const isChecked = isControlled ? checked : uncontrolledChecked;

  useEffect(() => {
    const form = inputRef.current?.form;

    if (!form || isControlled) {
      return;
    }

    const handleReset = () => {
      setUncontrolledChecked(Boolean(defaultChecked));
    };

    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, [defaultChecked, isControlled]);

  return (
    <input
      type="checkbox"
      {...nativeProps}
      ref={(node) => {
        inputRef.current = node;

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      id={controlId}
      disabled={resolvedDisabled}
      checked={isControlled ? checked : undefined}
      defaultChecked={defaultChecked}
      onChange={(event) => {
        if (!isControlled) {
          setUncontrolledChecked(event.currentTarget.checked);
        }
        nativeProps.onChange?.(event);
      }}
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
      {...controlStateAttributes({
        disabled: resolvedDisabled,
        invalid: Boolean(resolvedInvalid),
        checked: isChecked,
        focusVisible: focus.focusVisible
      })}
    />
  );
});
