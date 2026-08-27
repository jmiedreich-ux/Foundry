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
} from '../../foundation/control-base.js';
import { useField } from '../../foundation/field.js';
import { useFocusVisible } from '../../foundation/focus-visible.js';

type NativeSearchProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  | 'id'
  | 'type'
  | 'disabled'
  | 'size'
  | 'required'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'role'
  | 'className'
  | 'style'
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-labelledby'
  | 'aria-required'
>;

type SearchModeProps =
  | {
      value: string;
      defaultValue?: never;
    }
  | {
      value?: never;
      defaultValue?: string;
    };

export type SearchProps = NativeSearchProps & SearchModeProps & {
  id?: string;
  disabled?: boolean;
  size?: ControlSize;
  invalid?: ControlInvalidState;
  required?: boolean;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  role?: never;
  className?: never;
  style?: never;
};

interface ClearableSearchInput {
  value: string;
  focus: () => void;
}

export function clearUncontrolledSearch(
  input: ClearableSearchInput,
  onValueChange?: (value: string) => void,
  onClear?: () => void
) {
  input.value = '';
  onValueChange?.('');
  onClear?.();
  input.focus();
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    id,
    disabled,
    size,
    invalid,
    required,
    value,
    defaultValue,
    onValueChange,
    onClear,
    onFocus,
    onBlur,
    readOnly,
    ...passedNativeProps
  },
  ref
) {
  const unsafeNativeProps = passedNativeProps as ComponentPropsWithoutRef<'input'> & {
    'data-search-clear'?: unknown;
  };
  const {
    type: _type,
    role: _role,
    className: _className,
    style: _style,
    'data-search-clear': _consumerClearHook,
    ...nativeProps
  } = unsafeNativeProps;
  const generatedId = useId().replaceAll(':', '');
  const field = useField();
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const resolvedSize = size ?? field?.size ?? 'md';
  const resolvedInvalid = invalid ?? field?.invalidMessage ?? field?.invalid ?? false;
  const resolvedRequired = required ?? field?.required ?? false;
  const resolvedReadOnly = readOnly ?? false;
  const controlId = id ?? field?.controlId ?? `foundry-search-${generatedId}`;
  const focus = useFocusVisible<HTMLInputElement>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isControlled = typeof value === 'string';
  const [uncontrolledValue, setUncontrolledValue] = useState(() => defaultValue ?? '');
  const currentValue = isControlled ? value : uncontrolledValue;
  const isEmpty = currentValue.length === 0;

  useEffect(() => {
    const form = inputRef.current?.form;

    if (!form || isControlled) {
      return;
    }

    const handleReset = () => {
      setUncontrolledValue(defaultValue ?? '');
    };

    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, [defaultValue, isControlled]);

  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <>
      <input
        type="search"
        {...nativeProps}
        ref={setInputRef}
        id={controlId}
        disabled={resolvedDisabled}
        readOnly={resolvedReadOnly}
        required={resolvedRequired}
        value={isControlled ? value : undefined}
        defaultValue={isControlled ? undefined : defaultValue}
        onChange={(event) => {
          if (resolvedDisabled || resolvedReadOnly) {
            return;
          }

          const nextValue = event.currentTarget.value;

          if (!isControlled) {
            setUncontrolledValue(nextValue);
          }

          onValueChange?.(nextValue);
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
        aria-required={resolvedRequired || undefined}
        {...controlStateAttributes({
          disabled: resolvedDisabled,
          size: resolvedSize,
          invalid: Boolean(resolvedInvalid),
          readOnly: resolvedReadOnly,
          focusVisible: focus.focusVisible
        })}
        data-control="search"
        data-empty={isEmpty ? '' : undefined}
      />
      {!isEmpty && !resolvedDisabled && !resolvedReadOnly ? (
        <button
          type="button"
          data-search-clear
          onClick={() => {
            if (!isControlled) {
              setUncontrolledValue('');
              if (inputRef.current) {
                clearUncontrolledSearch(inputRef.current, onValueChange, onClear);
                return;
              }
            }

            onValueChange?.('');
            onClear?.();
            inputRef.current?.focus();
          }}
        >
          Clear search
        </button>
      ) : null}
    </>
  );
});
