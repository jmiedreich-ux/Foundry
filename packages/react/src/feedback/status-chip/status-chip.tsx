import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

export const statusChipTones = ['neutral', 'success', 'warning', 'danger'] as const;
export type StatusChipTone = (typeof statusChipTones)[number];

type StrippedSpanProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  | 'role'
  | 'className'
  | 'style'
>;

export interface StatusChipProps extends StrippedSpanProps {
  label: ReactNode;
  tone?: StatusChipTone;
  role?: never;
  className?: never;
  style?: never;
}

export const StatusChip = forwardRef<HTMLSpanElement, StatusChipProps>(function StatusChip(
  { label, tone = 'neutral', ...rest },
  ref
) {
  const unsafeProps = rest as ComponentPropsWithoutRef<'span'> & {
    'data-control'?: unknown;
    'data-tone'?: unknown;
  };
  const {
    role: _role,
    className: _className,
    style: _style,
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
    >
      {label}
    </span>
  );
});
