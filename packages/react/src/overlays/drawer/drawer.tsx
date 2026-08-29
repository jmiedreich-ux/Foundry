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
import {
  cycleFocusWithin,
  focusFirstDescendant,
  useOverlayLayer
} from '../foundation/overlay-root.js';
import { resolveLabel } from '../../foundation/labels.js';
import { useLocale } from '../../foundation/providers.js';

type DrawerModeProps =
  | { open: boolean; defaultOpen?: never }
  | { open?: never; defaultOpen?: boolean };

interface DrawerContextValue {
  contentId: string;
  open: boolean;
  requestOpen: (next: boolean) => void;
  captureTrigger: (trigger: HTMLElement | null) => void;
  side: 'start' | 'end';
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const value = useContext(DrawerContext);
  if (!value) {
    throw new Error('Drawer parts require a DrawerRoot ancestor.');
  }

  return value;
}

export type DrawerRootProps = PropsWithChildren<DrawerModeProps & {
  onOpenChange?: (next: boolean) => void;
  side?: 'start' | 'end';
}>;

export function DrawerRoot({ children, defaultOpen, onOpenChange, open, side = 'end' }: DrawerRootProps) {
  if (typeof open === 'boolean' && typeof defaultOpen === 'boolean') {
    throw new Error('DrawerRoot accepts either open or defaultOpen, not both.');
  }

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const isControlled = typeof open === 'boolean';
  const effectiveOpen = isControlled ? open : uncontrolledOpen;
  const contentId = `${useId().replaceAll(':', '')}-drawer`;
  const { captureTrigger } = useOverlayLayer({ id: contentId, open: effectiveOpen });
  const requestOpen = useCallback((next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  return (
    <DrawerContext.Provider value={{ contentId, open: effectiveOpen, requestOpen, captureTrigger, side }}>
      {children}
    </DrawerContext.Provider>
  );
}

type NativeTriggerProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-controls' | 'aria-expanded' | 'aria-haspopup' | 'className' | 'onClick' | 'role' | 'style' | 'type'
>;

export type DrawerTriggerProps = NativeTriggerProps & {
  onClick?: ComponentPropsWithoutRef<'button'>['onClick'];
  className?: never;
  role?: never;
  style?: never;
};

export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(function DrawerTrigger(
  { disabled, onClick, ...rest },
  ref
) {
  const { captureTrigger, contentId, open, requestOpen } = useDrawerContext();
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
      aria-haspopup="dialog"
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

type NativeDialogProps = Omit<
  ComponentPropsWithoutRef<'dialog'>,
  'aria-labelledby' | 'className' | 'onCancel' | 'onClose' | 'onKeyDown' | 'open' | 'role' | 'style' | 'title'
>;

export type DrawerContentProps = NativeDialogProps & {
  title: ReactNode;
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

export const DrawerContent = forwardRef<HTMLDialogElement, DrawerContentProps>(function DrawerContent(
  { children, title, ...rest },
  forwardedRef
) {
  const { contentId, open, requestOpen, side } = useDrawerContext();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = `${useId().replaceAll(':', '')}-drawer-title`;

  const setDialogRef = useCallback((node: HTMLDialogElement | null) => {
    dialogRef.current = node;
    assignRef(forwardedRef, node);
  }, [forwardedRef]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) {
      return;
    }

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }

    if (!focusFirstDescendant(dialog)) {
      dialog.focus({ preventScroll: true });
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const unsafeProps = rest as ComponentPropsWithoutRef<'dialog'> & {
    'data-control'?: unknown;
    'data-open'?: unknown;
  };
  const {
    'aria-labelledby': _ariaLabelledby,
    className: _className,
    onCancel: _onCancel,
    onClose: _onClose,
    onKeyDown: _onKeyDown,
    open: _open,
    role: _role,
    style: _style,
    'data-control': _dataControl,
    'data-open': _dataOpen,
    ...safeProps
  } = unsafeProps;

  return (
    <dialog
      {...safeProps}
      ref={setDialogRef}
      id={contentId}
      tabIndex={-1}
      aria-labelledby={titleId}
      data-control="drawer"
      data-open=""
      data-drawer-side={side}
      onCancel={(event) => {
        event.preventDefault();
        requestOpen(false);
      }}
      onClose={() => requestOpen(false)}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') {
          return;
        }
        if (!cycleFocusWithin(event, event.currentTarget)) {
          event.preventDefault();
          event.currentTarget.focus({ preventScroll: true });
        }
      }}
    >
      <h2 id={titleId}>{title}</h2>
      {children}
    </dialog>
  );
});

type NativeCloseProps = Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'onClick' | 'role' | 'style' | 'type'>;

export type DrawerCloseProps = NativeCloseProps & {
  onClick?: ComponentPropsWithoutRef<'button'>['onClick'];
  className?: never;
  role?: never;
  style?: never;
};

export const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(function DrawerClose(
  { onClick, ...rest },
  ref
) {
  const { requestOpen } = useDrawerContext();
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
