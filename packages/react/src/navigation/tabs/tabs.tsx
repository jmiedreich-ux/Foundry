import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  type ReactNode,
  type Ref
} from 'react';
import {
  moveTabSelection,
  validateTabsComposition,
  type TabTrigger
} from './tab-model.js';

type TabsMode =
  | { value: string; defaultValue?: never; onValueChange: (value: string) => void }
  | { value?: never; defaultValue: string; onValueChange?: (value: string) => void };
type TabKey = 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End';

interface TabsContextValue {
  selectedValue: string;
  triggers: readonly TabTrigger[];
  select: (value: string) => void;
  move: (currentValue: string, key: TabKey) => void;
  triggerId: (value: string) => string;
  panelId: (value: string) => string;
  setTriggerRef: (value: string, node: HTMLButtonElement | null) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);
let tabsTriggerComponent: unknown;
let tabsPanelComponent: unknown;
let tabsListComponent: unknown;

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs parts require a TabsRoot ancestor.');
  return context;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

function collectComposition(children: ReactNode) {
  const triggers: TabTrigger[] = [];
  const panelValues: string[] = [];
  let lists = 0;

  function visit(nodes: ReactNode) {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return;
      const props = child.props as { children?: ReactNode; disabled?: boolean; value?: unknown };
      if (child.type === tabsTriggerComponent) {
        triggers.push({ value: typeof props.value === 'string' ? props.value : '', disabled: props.disabled });
      }
      if (child.type === tabsPanelComponent) {
        panelValues.push(typeof props.value === 'string' ? props.value : '');
      }
      if (child.type === tabsListComponent) lists += 1;
      visit(props.children);
    });
  }

  visit(children);
  return { triggers, panelValues, lists };
}

function stripRuntimeEscapes(props: Record<string, unknown>, extraForbidden: readonly string[]) {
  return Object.fromEntries(Object.entries(props).filter(([name]) => (
    !name.startsWith('aria-')
    && !['className', 'role', 'style', ...extraForbidden].includes(name)
  )));
}

export type TabsRootProps = PropsWithChildren<TabsMode>;

export function TabsRoot({ children, defaultValue, onValueChange, value }: TabsRootProps) {
  const controlled = value !== undefined;
  if (controlled && defaultValue !== undefined) throw new Error('TabsRoot accepts either value or defaultValue, not both.');
  if (controlled && typeof value !== 'string') throw new Error('TabsRoot value must be a string.');
  if (controlled && typeof onValueChange !== 'function') throw new Error('TabsRoot requires onValueChange when value is provided.');
  if (!controlled && (typeof defaultValue !== 'string' || defaultValue.length === 0)) {
    throw new Error('TabsRoot requires a non-empty defaultValue when uncontrolled.');
  }

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const selectedValue = controlled ? value : uncontrolledValue;
  const { triggers, panelValues, lists } = collectComposition(children);
  if (lists !== 1) throw new Error('TabsRoot requires exactly one TabsList.');
  validateTabsComposition(triggers, panelValues, selectedValue);

  const baseId = useId().replaceAll(':', '');
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<string | null>(null);
  const select = useCallback((nextValue: string) => {
    const next = triggers.find((trigger) => trigger.value === nextValue);
    if (!next || next.disabled) return;
    pendingFocus.current = null;
    if (!controlled) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  }, [controlled, onValueChange, triggers]);
  const setTriggerRef = useCallback((tabValue: string, node: HTMLButtonElement | null) => {
    if (node) triggerRefs.current.set(tabValue, node);
    else triggerRefs.current.delete(tabValue);
  }, []);
  useLayoutEffect(() => {
    if (pendingFocus.current !== selectedValue) return;
    triggerRefs.current.get(selectedValue)?.focus({ preventScroll: true });
    pendingFocus.current = null;
  }, [selectedValue]);
  const move = useCallback((currentValue: string, key: TabKey) => {
    const nextValue = moveTabSelection(triggers, currentValue, key);
    select(nextValue);
    pendingFocus.current = nextValue;
  }, [select, triggers]);
  const idIndex = useCallback((tabValue: string) => triggers.findIndex((trigger) => trigger.value === tabValue), [triggers]);
  const triggerId = useCallback((tabValue: string) => `${baseId}-tab-${idIndex(tabValue)}`, [baseId, idIndex]);
  const panelId = useCallback((tabValue: string) => `${baseId}-panel-${idIndex(tabValue)}`, [baseId, idIndex]);

  return <TabsContext.Provider value={{ selectedValue, triggers, select, move, triggerId, panelId, setTriggerRef }}>{children}</TabsContext.Provider>;
}

type RefusedAriaProps = { [attribute in `aria-${string}`]?: never };
type RefusedStateProps = { 'data-selected'?: never };
type ListNativeProps = Omit<ComponentPropsWithoutRef<'div'>, 'aria-label' | 'className' | 'role' | 'style'>;
export type TabsListProps = ListNativeProps & RefusedAriaProps & { label: string; className?: never; role?: never; style?: never };

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList({ children, label, ...rest }, ref) {
  useTabs();
  if (typeof label !== 'string' || label.length === 0) throw new Error('TabsList requires a non-empty label.');
  const safeProps = stripRuntimeEscapes(rest as Record<string, unknown>, []) as ComponentPropsWithoutRef<'div'>;
  return <div {...safeProps} ref={ref} role="tablist" aria-label={label}>{children}</div>;
});
tabsListComponent = TabsList;

type TriggerNativeProps = Omit<ComponentPropsWithoutRef<'button'>, 'aria-controls' | 'aria-selected' | 'className' | 'disabled' | 'id' | 'onClick' | 'onKeyDown' | 'role' | 'style' | 'tabIndex' | 'type'>;
export type TabsTriggerProps = TriggerNativeProps & RefusedAriaProps & RefusedStateProps & { value: string; disabled?: boolean; className?: never; role?: never; style?: never };

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger({ children, disabled, value, ...rest }, forwardedRef) {
  const { move, panelId, select, selectedValue, setTriggerRef, triggerId } = useTabs();
  const setRef = useCallback((node: HTMLButtonElement | null) => {
    setTriggerRef(value, node);
    assignRef(forwardedRef, node);
  }, [forwardedRef, setTriggerRef, value]);
  const safeProps = stripRuntimeEscapes(rest as Record<string, unknown>, ['data-selected', 'id', 'onClick', 'onKeyDown', 'tabIndex', 'type']) as ComponentPropsWithoutRef<'button'>;
  const selected = selectedValue === value;

  return <button
    {...safeProps}
    ref={setRef}
    id={triggerId(value)}
    type="button"
    role="tab"
    disabled={disabled}
    aria-controls={panelId(value)}
    aria-selected={selected}
    tabIndex={selected && !disabled ? 0 : -1}
    data-selected={selected ? '' : undefined}
    onClick={() => select(value)}
    onKeyDown={(event) => {
      if (disabled || !(['ArrowLeft', 'ArrowRight', 'Home', 'End'] as const).includes(event.key as TabKey)) return;
      event.preventDefault();
      move(value, event.key as TabKey);
    }}
  >{children}</button>;
});

type PanelNativeProps = Omit<ComponentPropsWithoutRef<'div'>, 'aria-labelledby' | 'className' | 'hidden' | 'id' | 'role' | 'style'>;
export type TabsPanelProps = PanelNativeProps & RefusedAriaProps & RefusedStateProps & { value: string; className?: never; role?: never; style?: never };

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel({ children, value, ...rest }, ref) {
  const { panelId, selectedValue, triggerId } = useTabs();
  const selected = selectedValue === value;
  const safeProps = stripRuntimeEscapes(rest as Record<string, unknown>, ['data-selected', 'hidden', 'id']) as ComponentPropsWithoutRef<'div'>;
  return <div
    {...safeProps}
    ref={ref}
    id={panelId(value)}
    role="tabpanel"
    aria-labelledby={triggerId(value)}
    hidden={!selected}
    data-selected={selected ? '' : undefined}
  >{children}</div>;
});

tabsTriggerComponent = TabsTrigger;
tabsPanelComponent = TabsPanel;
