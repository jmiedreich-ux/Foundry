import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  type ReactNode,
  type Ref
} from 'react';
import { useOverlayLayer } from '../foundation/overlay-root.js';
import { resolveLabel } from '../../foundation/labels.js';
import { useLocale } from '../../foundation/providers.js';

type PopoverModeProps =
  | { open: boolean; defaultOpen?: never }
  | { open?: never; defaultOpen?: boolean };

interface PopoverContextValue {
  contentId: string;
  open: boolean;
  isControlled: boolean;
  requestOpen: (next: boolean) => void;
  captureTrigger: (trigger: HTMLElement | null) => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const value = useContext(PopoverContext);
  if (!value) {
    throw new Error('Popover parts require a PopoverRoot ancestor.');
  }
  return value;
}

export type PopoverRootProps = PropsWithChildren<PopoverModeProps & {
  onOpenChange?: (next: boolean) => void;
}>;

export function PopoverRoot({ children, defaultOpen, onOpenChange, open }: PopoverRootProps) {
  if (typeof open === 'boolean' && typeof defaultOpen === 'boolean') {
    throw new Error('PopoverRoot accepts either open or defaultOpen, not both.');
  }

  const isControlled = open !== undefined;

  if (isControlled && typeof onOpenChange !== 'function') {
    throw new Error('PopoverRoot requires onOpenChange when open is provided.');
  }

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const effectiveOpen = isControlled ? (open as boolean) : uncontrolledOpen;
  const contentId = `${useId().replaceAll(':', '')}-popover`;
  const { captureTrigger } = useOverlayLayer({ id: contentId, open: effectiveOpen });

  const requestOpen = useCallback((next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  return (
    <PopoverContext.Provider value={{ contentId, open: effectiveOpen, isControlled, requestOpen, captureTrigger }}>
      {children}
    </PopoverContext.Provider>
  );
}

// ── Trigger ──────────────────────────────────────────────────────────

type NativeTriggerProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-controls' | 'aria-expanded' | 'className' | 'onClick' | 'role' | 'style'
>;

export type PopoverTriggerProps = NativeTriggerProps & {
  onClick?: ComponentPropsWithoutRef<'button'>['onClick'];
  className?: never;
  role?: never;
  style?: never;
};

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(function PopoverTrigger(
  { disabled, onClick, ...rest },
  ref
) {
  const { captureTrigger, contentId, open, requestOpen } = usePopoverContext();
  const unsafeProps = rest as ComponentPropsWithoutRef<'button'>;
  const { className: _className, role: _role, style: _style, ...safeProps } = unsafeProps;

  return (
    <button
      {...safeProps}
      ref={ref}
      type="button"
      disabled={disabled}
      aria-controls={contentId}
      aria-expanded={open}
      onClick={(event) => {
        onClick?.(event);
        if (disabled || event.defaultPrevented) {
          return;
        }
        captureTrigger(event.currentTarget);
        requestOpen(true);
      }}
    />
  );
});

// ── Content ──────────────────────────────────────────────────────────

interface PopoverContentNativeProps {
  title: ReactNode;
}

export type PopoverContentProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'aria-labelledby' | 'className' | 'onToggle' | 'role' | 'style'
> & PopoverContentNativeProps & {
  className?: never;
  role?: never;
  style?: never;
};

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  { children, title, ...rest },
  forwardedRef
) {
  const { contentId, open, isControlled, requestOpen } = usePopoverContext();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const titleId = `${useId().replaceAll(':', '')}-popover-title`;
  const controlledOpenRef = useRef(open);
  controlledOpenRef.current = open;

  const setContentRef = useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    assignRef(forwardedRef, node);
  }, [forwardedRef]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || !open) {
      return;
    }
    if (typeof el.showPopover === 'function') {
      el.showPopover();
    }
  }, [open]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) {
      return;
    }

    function onToggle(e: Event) {
      const newState = (e as { newState?: string }).newState;
      if (newState !== 'closed') {
        return;
      }
      requestOpen(false);

      if (isControlled && controlledOpenRef.current) {
        Promise.resolve().then(() => {
          const current = contentRef.current;
          if (current && current.isConnected) {
            if (typeof current.showPopover === 'function') {
              current.showPopover();
            }
          }
        });
      }
    }

    el.addEventListener('toggle', onToggle);
    return () => el.removeEventListener('toggle', onToggle);
  }, [open, requestOpen, isControlled]);

  if (!open) {
    return null;
  }

  const unsafeProps = rest as ComponentPropsWithoutRef<'div'> & {
    'aria-modal'?: unknown;
    'data-control'?: unknown;
    'data-open'?: unknown;
    popover?: unknown;
  };
  const {
    'aria-labelledby': _ariaLabelledby,
    'aria-modal': _ariaModal,
    className: _className,
    role: _role,
    style: _style,
    'data-control': _dataControl,
    'data-open': _dataOpen,
    popover: _popover,
    ...safeProps
  } = unsafeProps;

  return (
    <div
      {...safeProps}
      ref={setContentRef}
      id={contentId}
      popover="auto"
      role="dialog"
      aria-labelledby={titleId}
      data-control="popover"
      data-open=""
    >
      <h2 id={titleId}>{title}</h2>
      {children}
    </div>
  );
});

// ── Close ────────────────────────────────────────────────────────────

type NativeCloseProps = Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'onClick' | 'role' | 'style' | 'type'>;

export type PopoverCloseProps = NativeCloseProps & {
  onClick?: ComponentPropsWithoutRef<'button'>['onClick'];
  className?: never;
  role?: never;
  style?: never;
};

export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(function PopoverClose(
  { onClick, ...rest },
  ref
) {
  const { requestOpen } = usePopoverContext();
  const { labels } = useLocale();
  const unsafeProps = rest as ComponentPropsWithoutRef<'button'>;
  const { className: _className, role: _role, style: _style, ...safeProps } = unsafeProps;

  return (
    <button
      {...safeProps}
      ref={ref}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          requestOpen(false);
        }
      }}
    >
      {resolveLabel('dismiss', undefined, labels)}
    </button>
  );
});
