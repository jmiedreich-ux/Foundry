import { forwardRef, useId, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import {
  controlStateAttributes,
  resolveControlBase,
  type ControlSize
} from '../../foundation/control-base.js';
import { resolveLabel } from '../../foundation/labels.js';
import { useGroup, useLocale } from '../../foundation/providers.js';

export const bannerTones = ['neutral', 'success', 'warning', 'danger'] as const;
export type BannerTone = (typeof bannerTones)[number];

type NativeSectionProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  | 'aria-labelledby'
  | 'className'
  | 'disabled'
  | 'role'
  | 'size'
  | 'style'
  | 'title'
>;

type BannerModeProps =
  | {
      open: boolean;
      defaultOpen?: never;
    }
  | {
      open?: never;
      defaultOpen?: boolean;
    };

export type BannerProps = NativeSectionProps & BannerModeProps & {
  title: ReactNode;
  description: ReactNode;
  tone?: BannerTone;
  action?: ReactNode;
  onOpenChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: ControlSize;
  'aria-labelledby'?: never;
  role?: never;
  className?: never;
  style?: never;
};

export const Banner = forwardRef<HTMLElement, BannerProps>(function Banner(
  {
    title,
    description,
    tone = 'neutral',
    action,
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
  const { labels } = useLocale();
  const group = useGroup();
  const state = resolveControlBase(
    { disabled, size },
    { disabled: group.disabled ?? false, size: group.size ?? 'md' }
  );
  const titleId = `${useId().replaceAll(':', '')}-banner-title`;

  const unsafeProps = rest as ComponentPropsWithoutRef<'section'> & {
    'data-control'?: unknown;
    'data-disabled'?: unknown;
    'data-tone'?: unknown;
    'data-open'?: unknown;
    'data-size'?: unknown;
  };
  const {
    'aria-labelledby': _ariaLabelledby,
    role: _role,
    className: _className,
    style: _style,
    'data-control': _dataControl,
    'data-disabled': _dataDisabled,
    'data-tone': _dataTone,
    'data-open': _dataOpen,
    'data-size': _dataSize,
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
      data-control="banner"
      data-tone={tone}
      data-open=""
      data-size={state.size}
      {...controlStateAttributes({ disabled: state.disabled, open: true })}
    >
      <h2 id={titleId}>{title}</h2>
      <p>{description}</p>
      {action ? <div className="banner-action">{action}</div> : null}
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
