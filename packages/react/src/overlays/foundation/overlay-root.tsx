import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren
} from 'react';

export interface OverlayLayerRecord {
  id: string;
  trigger: HTMLElement | null;
}

interface OverlayRootValue {
  layers: readonly OverlayLayerRecord[];
  registerLayer: (layer: OverlayLayerRecord) => () => void;
}

const OverlayRootContext = createContext<OverlayRootValue | null>(null);

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'iframe',
  '[contenteditable="true"]',
  '[tabindex]'
].join(',');

function hasUnavailableAncestor(element: HTMLElement) {
  return Boolean(element.closest('[hidden], [inert], [aria-hidden="true"]'));
}

function isFocusable(element: HTMLElement) {
  if (element.matches('[disabled], [aria-disabled="true"], [hidden], [tabindex="-1"]')) {
    return false;
  }

  if (hasUnavailableAncestor(element)) {
    return false;
  }

  return element.matches(focusableSelector) && element.tabIndex >= 0;
}

function focusElement(element: HTMLElement) {
  try {
    element.focus({ preventScroll: true });
  } catch {
    return false;
  }

  return element.ownerDocument.activeElement === element;
}

export function getFocusableDescendants(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(isFocusable);
}

export function focusFirstDescendant(container: HTMLElement) {
  const [first] = getFocusableDescendants(container);
  return first ? focusElement(first) : false;
}

export interface OverlayKeyboardEvent {
  key: string;
  shiftKey: boolean;
  target: EventTarget | null;
  preventDefault: () => void;
}

export function cycleFocusWithin(event: OverlayKeyboardEvent, container: HTMLElement) {
  if (event.key !== 'Tab') {
    return false;
  }

  const focusable = getFocusableDescendants(container);
  if (focusable.length === 0) {
    return false;
  }

  const activeElement = container.ownerDocument.activeElement as HTMLElement | null;
  const currentIndex = activeElement ? focusable.indexOf(activeElement) : -1;
  const nextIndex = event.shiftKey
    ? currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1
    : currentIndex === focusable.length - 1 ? 0 : currentIndex + 1;

  event.preventDefault();
  return focusElement(focusable[nextIndex]);
}

export function restoreFocusToTrigger(trigger: HTMLElement | null) {
  if (!trigger || !trigger.isConnected || !isFocusable(trigger)) {
    return false;
  }

  return focusElement(trigger);
}

export function OverlayRoot({ children }: PropsWithChildren) {
  const layersRef = useRef<OverlayLayerRecord[]>([]);
  const [layers, setLayers] = useState<OverlayLayerRecord[]>([]);

  const registerLayer = useCallback((layer: OverlayLayerRecord) => {
    if (layersRef.current.some((entry) => entry.id === layer.id)) {
      throw new Error(`Overlay layer "${layer.id}" is already registered.`);
    }

    const registeredLayer = { ...layer };
    const nextLayers = [...layersRef.current, registeredLayer];
    layersRef.current = nextLayers;
    setLayers(nextLayers);

    return () => {
      const index = layersRef.current.findIndex((entry) => entry.id === registeredLayer.id);
      if (index === -1) {
        return;
      }

      const wasTopLayer = index === layersRef.current.length - 1;
      const remainingLayers = layersRef.current.filter((entry) => entry.id !== registeredLayer.id);
      layersRef.current = remainingLayers;
      setLayers(remainingLayers);

      if (wasTopLayer) {
        restoreFocusToTrigger(registeredLayer.trigger);
      }
    };
  }, []);

  const value = useMemo(() => ({ layers, registerLayer }), [layers, registerLayer]);
  return <OverlayRootContext.Provider value={value}>{children}</OverlayRootContext.Provider>;
}

function useOverlayRoot() {
  const value = useContext(OverlayRootContext);
  if (!value) {
    throw new Error('Overlay layers require an OverlayRoot ancestor.');
  }

  return value;
}

function activeElementFor(document: Document | undefined) {
  const activeElement = document?.activeElement;
  return activeElement instanceof HTMLElement ? activeElement : null;
}

export interface UseOverlayLayerOptions {
  open: boolean;
  id?: string;
  trigger?: HTMLElement | null;
}

export function useOverlayLayer({ open, id: suppliedId, trigger }: UseOverlayLayerOptions) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const { layers, registerLayer } = useOverlayRoot();
  const capturedTrigger = useRef<HTMLElement | null>(trigger ?? null);

  const captureTrigger = useCallback((nextTrigger: HTMLElement | null) => {
    capturedTrigger.current = nextTrigger;
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!capturedTrigger.current) {
      capturedTrigger.current = trigger ?? activeElementFor(globalThis.document);
    }

    return registerLayer({ id, trigger: capturedTrigger.current });
  }, [id, open, registerLayer]);

  return {
    id,
    isTopLayer: layers.at(-1)?.id === id,
    captureTrigger
  };
}
