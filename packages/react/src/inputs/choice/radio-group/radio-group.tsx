import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import {
  controlStateAttributes,
  type ControlInvalidState,
  type ControlSize
} from '../../../foundation/control-base.js';
import { useField } from '../../../foundation/field.js';

export interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

type RadioGroupModeProps =
  | { value: string; defaultValue?: never }
  | { value?: never; defaultValue?: string };

export type RadioGroupProps = RadioGroupModeProps & {
  id?: string;
  name: string;
  options: readonly RadioOption[];
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: ControlSize;
  invalid?: ControlInvalidState;
  required?: boolean;
  className?: never;
  style?: never;
  role?: never;
  'data-testid'?: string;
  [dataAttribute: `data-${string}`]: string | boolean | undefined;
};

function ensureUniqueOptions(options: readonly RadioOption[]) {
  const values = new Set<string>();
  for (const option of options) {
    if (values.has(option.value)) {
      throw new Error(`RadioGroup option value "${option.value}" must be unique.`);
    }
    values.add(option.value);
  }
}

export function resolveInitialRadioValue(
  options: readonly RadioOption[],
  required: boolean,
  defaultValue: string | undefined,
  disabled = false
) {
  const enabledOptions = options.filter((option) => !disabled && !option.disabled);

  if (!required) {
    return enabledOptions.some((option) => option.value === defaultValue) ? defaultValue : undefined;
  }

  if (enabledOptions.length === 0) {
    throw new Error('A required RadioGroup needs an enabled option.');
  }

  if (defaultValue === undefined) {
    return enabledOptions[0]?.value;
  }

  if (!enabledOptions.some((option) => option.value === defaultValue)) {
    throw new Error('A required RadioGroup defaultValue must identify an enabled option.');
  }

  return defaultValue;
}

export function getNextEnabledRadioIndex(
  options: readonly RadioOption[],
  disabled: boolean,
  currentIndex: number,
  direction: 'next' | 'previous' | 'first' | 'last'
) {
  const enabledIndexes = options
    .map((option, index) => (!disabled && !option.disabled ? index : -1))
    .filter((index) => index >= 0);
  if (enabledIndexes.length === 0) return undefined;
  if (direction === 'first') return enabledIndexes[0];
  if (direction === 'last') return enabledIndexes.at(-1);

  const currentEnabledIndex = Math.max(0, enabledIndexes.indexOf(currentIndex));
  const offset = direction === 'next' ? 1 : -1;
  return enabledIndexes[(currentEnabledIndex + offset + enabledIndexes.length) % enabledIndexes.length];
}

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  {
    id,
    name,
    options,
    value,
    defaultValue,
    onValueChange,
    disabled,
    size,
    invalid,
    required,
    role: _role,
    className: _className,
    style: _style,
    ...dataProps
  },
  ref
) {
  ensureUniqueOptions(options);

  const generatedId = useId().replaceAll(':', '');
  const field = useField();
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const resolvedSize = size ?? field?.size ?? 'md';
  const resolvedInvalid = invalid ?? field?.invalidMessage ?? field?.invalid ?? false;
  const resolvedRequired = required ?? field?.required ?? false;
  const controlId = id ?? field?.controlId ?? `foundry-radio-group-${generatedId}`;
  const isControlled = value !== undefined;
  const enabledOptions = options.filter((option) => !resolvedDisabled && !option.disabled);

  if (resolvedRequired && isControlled && !enabledOptions.some((option) => option.value === value)) {
    throw new Error('A required RadioGroup value must identify an enabled option.');
  }

  const initialValue = resolveInitialRadioValue(options, resolvedRequired, defaultValue, resolvedDisabled);
  const [uncontrolledValue, setUncontrolledValue] = useState(initialValue);
  const selectedValue = isControlled && enabledOptions.some((option) => option.value === value)
    ? value
    : isControlled
      ? undefined
      : uncontrolledValue;
  const fieldsetRef = useRef<HTMLFieldSetElement | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [focusVisibleIndex, setFocusVisibleIndex] = useState<number | null>(null);
  const firstEnabledIndex = options.findIndex((option) => !resolvedDisabled && !option.disabled);

  useEffect(() => {
    const form = inputRefs.current.find(Boolean)?.form;
    if (!form || isControlled) return;

    const handleReset = () => setUncontrolledValue(resolveInitialRadioValue(options, resolvedRequired, defaultValue, resolvedDisabled));
    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, [defaultValue, isControlled, options, resolvedDisabled, resolvedRequired]);

  const choose = (nextValue: string) => {
    if (!enabledOptions.some((option) => option.value === nextValue)) return;
    if (!isControlled) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  const move = (currentIndex: number, direction: 'next' | 'previous' | 'first' | 'last') => {
    const nextIndex = getNextEnabledRadioIndex(options, resolvedDisabled, currentIndex, direction);
    if (nextIndex === undefined) return;

    const nextOption = options[nextIndex] as RadioOption;
    choose(nextOption.value);
    inputRefs.current[nextIndex]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 'next'
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? 'previous'
      : event.key === 'Home' ? 'first'
      : event.key === 'End' ? 'last'
      : null;
    if (!direction) return;
    event.preventDefault();
    move(index, direction);
  };

  return (
    <fieldset
      {...dataProps}
      ref={(node) => {
        fieldsetRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      id={controlId}
      disabled={resolvedDisabled}
      aria-labelledby={field?.labelId}
      aria-describedby={field?.describedBy}
      aria-invalid={Boolean(resolvedInvalid) || undefined}
      aria-required={resolvedRequired || undefined}
      {...controlStateAttributes({
        disabled: resolvedDisabled,
        size: resolvedSize,
        invalid: Boolean(resolvedInvalid),
        selected: selectedValue !== undefined
      })}
    >
      {options.map((option, index) => {
        const optionDisabled = resolvedDisabled || Boolean(option.disabled);
        const checked = selectedValue === option.value;
        return (
          <label key={option.value}>
            <input
              ref={(node) => { inputRefs.current[index] = node; }}
              id={`${controlId}-${index}`}
              type="radio"
              name={name}
              value={option.value}
              disabled={optionDisabled}
              required={resolvedRequired && index === firstEnabledIndex}
              aria-required={resolvedRequired && index === firstEnabledIndex || undefined}
              checked={checked}
              onChange={() => choose(option.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              onFocus={(event) => setFocusVisibleIndex(event.currentTarget.matches(':focus-visible') ? index : null)}
              onBlur={() => setFocusVisibleIndex(null)}
              {...controlStateAttributes({ disabled: optionDisabled, checked, focusVisible: focusVisibleIndex === index })}
            />
            {option.label}
          </label>
        );
      })}
    </fieldset>
  );
});
