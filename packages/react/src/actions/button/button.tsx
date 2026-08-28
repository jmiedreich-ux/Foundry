import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import {
  controlStateAttributes,
  resolveControlBase,
  type ControlInvalidState,
  type ControlSize
} from '../../foundation/control-base.js';
import { resolveLabel, type LabelCategory } from '../../foundation/labels.js';
import { useGroup, useLocale } from '../../foundation/providers.js';

export const buttonVariants = ['primary', 'secondary', 'destructive', 'link'] as const;
export type ButtonVariant = (typeof buttonVariants)[number];

type NativeButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'className' | 'disabled' | 'id' | 'style'
>;

export interface ButtonProps extends NativeButtonProps {
  category: LabelCategory;
  label?: string;
  variant?: ButtonVariant;
  id?: string;
  disabled?: boolean;
  size?: ControlSize;
  invalid?: ControlInvalidState;
  loading?: boolean;
  className?: never;
  style?: never;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { category, label, variant = 'primary', id, disabled, size, invalid, loading, type = 'button', ...nativeProps },
  ref
) {
  const { labels } = useLocale();
  const group = useGroup();
  const resolved = resolveControlBase(
    { disabled, size, invalid, loading },
    { disabled: group.disabled ?? false, size: group.size ?? 'md' }
  );
  const actionBlocked = resolved.disabled || resolved.loading;

  return (
    <button
      {...nativeProps}
      ref={ref}
      id={id}
      type={type}
      disabled={actionBlocked}
      aria-busy={resolved.loading || undefined}
      data-variant={variant}
      {...controlStateAttributes({ ...resolved, disabled: actionBlocked })}
    >
      {resolveLabel(category, label, labels)}
    </button>
  );
});
