import {
  forwardRef,
  type ComponentPropsWithoutRef
} from 'react';
import {
  controlStateAttributes,
  resolveControlBase,
  type ControlSize
} from '../../foundation/control-base.js';
import { useGroup } from '../../foundation/providers.js';

function validateLines(lines: number): void {
  if (!Number.isInteger(lines) || lines < 1 || lines > 6) {
    throw new RangeError(
      `LoadingSkeleton lines must be an integer from 1 through 6, got: ${lines}`
    );
  }
}

type StrippedDivProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'role'
  | 'className'
  | 'style'
  | 'tabIndex'
  | 'autoFocus'
  | 'contentEditable'
  | 'aria-busy'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-live'
  | 'aria-valuemax'
  | 'aria-valuemin'
  | 'aria-valuenow'
  | 'aria-valuetext'
>;

export interface LoadingSkeletonProps extends StrippedDivProps {
  label: string;
  lines?: number;
  size?: ControlSize;
  role?: never;
  className?: never;
  style?: never;
  tabIndex?: never;
  autoFocus?: never;
  contentEditable?: never;
  'aria-busy'?: never;
  'aria-hidden'?: never;
  'aria-label'?: never;
  'aria-live'?: never;
  'aria-valuemax'?: never;
  'aria-valuemin'?: never;
  'aria-valuenow'?: never;
  'aria-valuetext'?: never;
  'data-skeleton-bar'?: never;
}

export const LoadingSkeleton = forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  function LoadingSkeleton({ label, lines = 3, size, ...rest }, ref) {
    validateLines(lines);
    const group = useGroup();
    const state = resolveControlBase(
      { size },
      { disabled: false, size: group.size ?? 'md' }
    );

    const unsafeProps = rest as ComponentPropsWithoutRef<'div'> & {
      'data-control'?: unknown;
      'data-disabled'?: unknown;
      'data-loading'?: unknown;
      'data-open'?: unknown;
      'data-skeleton-bar'?: unknown;
      'data-size'?: unknown;
    };
    const {
      role: _role,
      className: _className,
      style: _style,
      tabIndex: _tabIndex,
      autoFocus: _autoFocus,
      contentEditable: _contentEditable,
      'aria-busy': _ariaBusy,
      'aria-hidden': _ariaHidden,
      'aria-label': _ariaLabel,
      'aria-live': _ariaLive,
      'aria-valuemax': _ariaValueMax,
      'aria-valuemin': _ariaValueMin,
      'aria-valuenow': _ariaValueNow,
      'aria-valuetext': _ariaValueText,
      'data-control': _dataControl,
      'data-disabled': _dataDisabled,
      'data-loading': _dataLoading,
      'data-open': _dataOpen,
      'data-skeleton-bar': _dataSkeletonBar,
      'data-size': _dataSize,
      ...safeProps
    } = unsafeProps;

    const barElements = Array.from({ length: lines }, (_, i) => (
      <span key={String(i)} data-skeleton-bar aria-hidden="true" />
    ));

    return (
      <div
        {...safeProps}
        ref={ref}
        role="status"
        aria-busy="true"
        aria-label={label}
        data-control="loading-skeleton"
        data-size={state.size}
        {...controlStateAttributes({ loading: true })}
      >
        {barElements}
      </div>
    );
  }
);
