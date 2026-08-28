import { forwardRef, useId, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import {
  controlStateAttributes,
  resolveControlBase,
  type ControlSize
} from '../../foundation/control-base.js';
import { resolveLabel } from '../../foundation/labels.js';
import { useGroup, useLocale } from '../../foundation/providers.js';

export const toastTones = ['neutral', 'success', 'warning'] as const;
export type ToastTone = (typeof toastTones)[number];

type NativeSectionProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  | 'aria-labelledby'
  | 'aria-live'
  | 'className'
  | 'disabled'
  | 'role'
  | 'size'
  | 'style'
  | 'title'
>;

type ToastModeProps =
  | {
      open: boolean;
      defaultOpen?: never;
    }
  | {
      open?: never;
      defaultOpen?: boolean;
    };

export type ToastProps = NativeSectionProps & ToastModeProps & {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  onOpenChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: ControlSize;
  'aria-labelledby'?: never;
  'aria-live'?: never;
  role?: never;
  className?: never;
  style?: never;
};

export const Toast = forwardRef<HTMLElement, ToastProps>(function Toast(
  {
    title,
    description,
    tone = 'neutral',
    onOpenChange,
    open,
    defaultOpen,
    disabled,
    size,
    ...rest
  },
  ref
) {
  const isControlled = typeof open === 'boolean';
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    typeof defaultOpen === 'boolean' ? defaultOpen : true
  );
  const effectiveOpen = isControlled ? open : uncontrolledOpen;
  const group = useGroup();
  const state = resolveControlBase(
    { disabled, size },
    { disabled: group.disabled ?? false, size: group.size ?? 'md' }
  );
  const { labels } = useLocale();
  const titleId = `${useId().replaceAll(':', '')}-toast-title`;

  const unsafeProps = rest as ComponentPropsWithoutRef<'section'> & {
    'data-control'?: unknown;
    'data-disabled'?: unknown;
    'data-open'?: unknown;
    'data-size'?: unknown;
    'data-tone'?: unknown;
  };
  const {
    'aria-labelledby': _ariaLabelledby,
    'aria-live': _ariaLive,
    className: _className,
    role: _role,
    style: _style,
    'data-control': _dataControl,
    'data-disabled': _dataDisabled,
    'data-open': _dataOpen,
    'data-size': _dataSize,
    'data-tone': _dataTone,
    ...safeProps
  } = unsafeProps;

  if (!effectiveOpen) {
    return null;
  }

  return (
    <section
      {...safeProps}
      ref={ref}
      aria-labelledby={titleId}
      data-control="toast"
      data-tone={tone}
      data-size={state.size}
      {...controlStateAttributes({ disabled: state.disabled, open: true })}
    >
      <div role="status" aria-atomic="true">
        <h2 id={titleId}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {onOpenChange ? (
        <button
          type="button"
          disabled={state.disabled}
          aria-label={resolveLabel('dismiss', undefined, labels)}
          onClick={() => {
            if (state.disabled) {
              return;
            }

            if (isControlled) {
              onOpenChange(false);
            } else {
              setUncontrolledOpen(false);
              onOpenChange(false);
            }
          }}
        >
          {resolveLabel('dismiss', undefined, labels)}
        </button>
      ) : null}
    </section>
  );
});
