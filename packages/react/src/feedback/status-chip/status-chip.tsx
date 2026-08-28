import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { resolveControlBase, type ControlSize } from '../../foundation/control-base.js';
import { useGroup } from '../../foundation/providers.js';

export const statusChipTones = ['neutral', 'success', 'warning', 'danger'] as const;
export type StatusChipTone = (typeof statusChipTones)[number];

type StrippedSpanProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  | 'role'
  | 'className'
  | 'style'
  | 'tabIndex'
  | 'onClick'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onKeyPress'
  | 'aria-live'
>;

export interface StatusChipProps extends StrippedSpanProps {
  label: ReactNode;
  tone?: StatusChipTone;
  size?: ControlSize;
  role?: never;
  className?: never;
  style?: never;
  tabIndex?: never;
  onClick?: never;
  onKeyDown?: never;
  onKeyUp?: never;
  onKeyPress?: never;
  'aria-live'?: never;
}

export const StatusChip = forwardRef<HTMLSpanElement, StatusChipProps>(function StatusChip(
  { label, tone = 'neutral', size, ...rest },
  ref
) {
  const group = useGroup();
  const state = resolveControlBase(
    { size },
    { disabled: group.disabled ?? false, size: group.size ?? 'md' }
  );
  const unsafeProps = rest as ComponentPropsWithoutRef<'span'> & {
    'data-control'?: unknown;
    'data-tone'?: unknown;
  };
  const {
    role: _role,
    className: _className,
    style: _style,
    tabIndex: _tabIndex,
    onClick: _onClick,
    onKeyDown: _onKeyDown,
    onKeyUp: _onKeyUp,
    onKeyPress: _onKeyPress,
    'aria-live': _ariaLive,
    'data-control': _dataControl,
    'data-tone': _dataTone,
    ...safeProps
  } = unsafeProps;

  return (
    <span
      {...safeProps}
      ref={ref}
      role="status"
      aria-atomic="true"
      data-control="status-chip"
      data-tone={tone}
      data-size={state.size}
    >
      {label}
    </span>
  );
});
