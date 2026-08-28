import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import {
  resolveControlBase,
  type ControlSize
} from '../../foundation/control-base.js';
import { useGroup } from '../../foundation/providers.js';

type NativeSectionProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  | 'aria-busy'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-live'
  | 'className'
  | 'disabled'
  | 'role'
  | 'size'
  | 'style'
  | 'title'
>;

export type EmptyStateProps = NativeSectionProps & {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  size?: ControlSize;
  'aria-busy'?: never;
  'aria-label'?: never;
  'aria-labelledby'?: never;
  'aria-live'?: never;
  role?: never;
  className?: never;
  style?: never;
};

export const EmptyState = forwardRef<HTMLElement, EmptyStateProps>(function EmptyState(
  {
    title,
    description,
    action,
    size,
    ...rest
  },
  ref
) {
  const group = useGroup();
  const state = resolveControlBase(
    { size },
    { disabled: false, size: group.size ?? 'md' }
  );
  const titleId = `${useId().replaceAll(':', '')}-empty-title`;

  const unsafeProps = rest as ComponentPropsWithoutRef<'section'> & {
    'data-control'?: unknown;
    'data-disabled'?: unknown;
    'data-loading'?: unknown;
    'data-open'?: unknown;
    'data-size'?: unknown;
  };
  const {
    'aria-busy': _ariaBusy,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledby,
    'aria-live': _ariaLive,
    role: _role,
    className: _className,
    style: _style,
    'data-control': _dataControl,
    'data-disabled': _dataDisabled,
    'data-loading': _dataLoading,
    'data-open': _dataOpen,
    'data-size': _dataSize,
    ...safeProps
  } = unsafeProps;

  return (
    <section
      {...safeProps}
      ref={ref}
      aria-labelledby={titleId}
      data-control="empty-state"
      data-size={state.size}
    >
      <h2 id={titleId}>{title}</h2>
      <p>{description}</p>
      {action ? <div className="empty-state-action">{action}</div> : null}
    </section>
  );
});
