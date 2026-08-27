import {
  createContext,
  isValidElement,
  useContext,
  useId,
  type PropsWithChildren,
  type ReactNode
} from 'react';
import {
  controlStateAttributes,
  resolveControlBase,
  type ControlSize
} from './control-base.js';
import { GroupProvider, useGroup } from './providers.js';

export interface FieldContextValue {
  controlId: string;
  labelId: string;
  descriptionId?: string;
  errorId?: string;
  describedBy?: string;
  invalid: boolean;
  invalidMessage?: string;
  required: boolean;
  disabled: boolean;
  size: ControlSize;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps {
  id?: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  size?: ControlSize;
  children: ReactNode;
}

export function Field({
  id,
  label,
  description,
  error,
  required = false,
  disabled,
  size,
  children
}: FieldProps) {
  const generatedId = useId().replaceAll(':', '');
  const childId = isValidElement<{ id?: string }>(children) ? children.props.id : undefined;
  const group = useGroup();
  const inherited = { disabled: group.disabled ?? false, size: group.size ?? 'md' } as const;
  const resolved = resolveControlBase(
    { id, disabled, size, invalid: typeof error === 'string' ? error : Boolean(error) },
    inherited
  );
  const controlId = childId ?? id ?? `foundry-field-${generatedId}`;
  const labelId = `${controlId}-label`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const value: FieldContextValue = {
    controlId,
    labelId,
    descriptionId,
    errorId,
    describedBy,
    invalid: resolved.invalid,
    invalidMessage: resolved.invalidMessage,
    required,
    disabled: resolved.disabled,
    size: resolved.size
  };

  return (
    <FieldContext.Provider value={value}>
      <div {...controlStateAttributes(resolved)}>
        <label id={labelId} htmlFor={controlId}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
        {description ? <p id={descriptionId}>{description}</p> : null}
        {children}
        {error ? <p id={errorId} role="alert">{error}</p> : null}
      </div>
    </FieldContext.Provider>
  );
}

export const useField = () => useContext(FieldContext);

export interface GroupProps extends PropsWithChildren {
  label?: ReactNode;
  disabled?: boolean;
  size?: ControlSize;
}

export function Group({ label, disabled, size, children }: GroupProps) {
  const group = useGroup();
  const inherited = { disabled: group.disabled ?? false, size: group.size ?? 'md' } as const;
  const resolved = resolveControlBase({ disabled, size }, inherited);

  return (
    <GroupProvider value={{ disabled: resolved.disabled, size: resolved.size }}>
      <fieldset
        aria-disabled={resolved.disabled || undefined}
        {...controlStateAttributes(resolved)}
      >
        {label ? <legend>{label}</legend> : null}
        {children}
      </fieldset>
    </GroupProvider>
  );
}
