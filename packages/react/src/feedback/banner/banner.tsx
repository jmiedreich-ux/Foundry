import { forwardRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { resolveLabel } from '../../foundation/labels.js';
import { useLocale } from '../../foundation/providers.js';

export const bannerTones = ['neutral', 'success', 'warning', 'danger'] as const;
export type BannerTone = (typeof bannerTones)[number];

type NativeSectionProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  'role' | 'className' | 'style' | 'title'
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

  const unsafeProps = rest as ComponentPropsWithoutRef<'section'> & {
    'data-control'?: unknown;
    'data-tone'?: unknown;
    'data-open'?: unknown;
  };
  const {
    role: _role,
    className: _className,
    style: _style,
    'data-control': _dataControl,
    'data-tone': _dataTone,
    'data-open': _dataOpen,
    ...safeProps
  } = unsafeProps;

  if (!effectiveOpen) {
    return null;
  }

  return (
    <section
      {...safeProps}
      ref={ref}
      data-control="banner"
      data-tone={tone}
      data-open=""
    >
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <div className="banner-action">{action}</div> : null}
      {onOpenChange ? (
        <button
          type="button"
          aria-label={resolveLabel('dismiss', undefined, labels)}
          onClick={() => {
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
