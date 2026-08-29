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
  type Ref
} from 'react';
import { useOverlayLayer } from '../foundation/overlay-root.js';
import { resolveLabel } from '../../foundation/labels.js';
import { useLocale } from '../../foundation/providers.js';

type MenuMode = { open: boolean; defaultOpen?: never } | { open?: never; defaultOpen?: boolean };
type Entry = 'first' | 'last';

interface MenuContextValue {
  contentId: string;
  triggerId: string;
  open: boolean;
  entry: Entry;
  requestOpen: (next: boolean) => void;
  close: (restore: boolean) => void;
  captureTrigger: (trigger: HTMLElement | null) => void;
  setEntry: (entry: Entry) => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenu() {
  const value = useContext(MenuContext);
  if (!value) throw new Error('Menu parts require a MenuRoot ancestor.');
  return value;
}

export type MenuRootProps = PropsWithChildren<MenuMode & { onOpenChange?: (open: boolean) => void }>;

export function MenuRoot({ children, defaultOpen, onOpenChange, open }: MenuRootProps) {
  if (typeof open === 'boolean' && typeof defaultOpen === 'boolean') throw new Error('MenuRoot accepts either open or defaultOpen, not both.');
  const controlled = typeof open === 'boolean';
  if (controlled && !onOpenChange) throw new Error('MenuRoot requires onOpenChange when open is provided.');
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const [entry, setEntry] = useState<Entry>('first');
  const effectiveOpen = controlled ? open : uncontrolledOpen;
  const baseId = useId().replaceAll(':', '');
  const contentId = `${baseId}-menu`;
  const triggerId = `${baseId}-menu-trigger`;
  const { captureTrigger } = useOverlayLayer({ id: contentId, open: effectiveOpen });
  const requestOpen = useCallback((next: boolean) => {
    if (!controlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }, [controlled, onOpenChange]);
  const close = useCallback((restore: boolean) => {
    if (!restore) captureTrigger(null);
    requestOpen(false);
  }, [captureTrigger, requestOpen]);
  return <MenuContext.Provider value={{ contentId, triggerId, open: effectiveOpen, entry, requestOpen, close, captureTrigger, setEntry }}>{children}</MenuContext.Provider>;
}

type TriggerNativeProps = Omit<ComponentPropsWithoutRef<'button'>, 'aria-controls' | 'aria-expanded' | 'aria-haspopup' | 'className' | 'id' | 'onClick' | 'onKeyDown' | 'role' | 'style' | 'type'>;
export type MenuTriggerProps = TriggerNativeProps & { className?: never; role?: never; style?: never };

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(function MenuTrigger({ disabled, ...rest }, ref) {
  const { captureTrigger, contentId, triggerId, open, requestOpen, close, setEntry } = useMenu();
  const unsafe = rest as ComponentPropsWithoutRef<'button'>;
  const { className: _className, role: _role, style: _style, ...safe } = unsafe;
  const openMenu = (trigger: HTMLButtonElement, entry: Entry) => { if (!disabled) { captureTrigger(trigger); setEntry(entry); requestOpen(true); } };
  return <button {...safe} ref={ref} id={triggerId} type="button" disabled={disabled} aria-haspopup="menu" aria-controls={contentId} aria-expanded={open}
    onClick={(event) => { if (open) close(false); else openMenu(event.currentTarget, 'first'); }}
    onKeyDown={(event) => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); openMenu(event.currentTarget, event.key === 'ArrowUp' ? 'last' : 'first'); } }} />;
});

type ContentNativeProps = Omit<ComponentPropsWithoutRef<'div'>, 'aria-labelledby' | 'className' | 'onKeyDown' | 'role' | 'style'>;
export type MenuContentProps = ContentNativeProps & { className?: never; role?: never; style?: never };

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) { if (typeof ref === 'function') ref(value); else if (ref) ref.current = value; }
function itemsFor(menu: HTMLElement) { return Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')); }
function focusItem(items: HTMLButtonElement[], index: number) { items.forEach((item, itemIndex) => { item.tabIndex = itemIndex === index ? 0 : -1; }); items[index]?.focus({ preventScroll: true }); }

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(function MenuContent({ children, ...rest }, forwardedRef) {
  const { contentId, triggerId, open, entry, close } = useMenu();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback((node: HTMLDivElement | null) => { menuRef.current = node; assignRef(forwardedRef, node); }, [forwardedRef]);
  useEffect(() => { if (!open || !menuRef.current) return; const items = itemsFor(menuRef.current); focusItem(items, entry === 'last' ? items.length - 1 : 0); }, [entry, open]);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => { if (menuRef.current && !menuRef.current.contains(event.target as Node)) close(false); };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [close, open]);
  if (!open) return null;
  const unsafe = rest as ComponentPropsWithoutRef<'div'> & { 'data-control'?: unknown; 'data-open'?: unknown };
  const { className: _className, onKeyDown: _onKeyDown, role: _role, style: _style, 'data-control': _dataControl, 'data-open': _dataOpen, ...safe } = unsafe;
  return <div {...safe} ref={setRef} id={contentId} role="menu" aria-labelledby={triggerId} data-control="menu" data-open=""
    onKeyDown={(event) => {
      const menu = event.currentTarget; const items = itemsFor(menu); const current = items.indexOf(document.activeElement as HTMLButtonElement);
      if (event.key === 'Tab') { close(false); return; }
      if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
      const next = event.key === 'ArrowDown' ? (current + 1 + items.length) % items.length : event.key === 'ArrowUp' ? (current - 1 + items.length) % items.length : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : -1;
      if (next >= 0) { event.preventDefault(); focusItem(items, next); return; }
      if ((event.key === 'Enter' || event.key === ' ') && current >= 0) { event.preventDefault(); items[current].click(); }
    }}>{children}</div>;
});

type ItemNativeProps = Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'disabled' | 'onClick' | 'role' | 'style' | 'tabIndex' | 'type'>;
export type MenuItemProps = ItemNativeProps & { disabled?: boolean; onClick?: ComponentPropsWithoutRef<'button'>['onClick']; onSelect?: () => void; className?: never; role?: never; style?: never };
export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem({ disabled, onClick, onSelect, ...rest }, ref) {
  const { close } = useMenu(); const unsafe = rest as ComponentPropsWithoutRef<'button'>; const { className: _className, role: _role, style: _style, ...safe } = unsafe;
  return <button {...safe} ref={ref} type="button" role="menuitem" tabIndex={-1} aria-disabled={disabled || undefined} onClick={(event) => { if (disabled) { event.preventDefault(); return; } onClick?.(event); if (!event.defaultPrevented) { onSelect?.(); close(true); } }} />;
});

export const MenuClose = forwardRef<HTMLButtonElement, Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'className' | 'onClick' | 'role' | 'style' | 'type'> & { className?: never; role?: never; style?: never }>(function MenuClose(rest, ref) {
  const { close } = useMenu(); const { labels } = useLocale(); const unsafe = rest as ComponentPropsWithoutRef<'button'>; const { className: _className, role: _role, style: _style, ...safe } = unsafe;
  return <button {...safe} ref={ref} type="button" onClick={(event) => { if (!event.defaultPrevented) close(true); }}>{resolveLabel('dismiss', undefined, labels)}</button>;
});
