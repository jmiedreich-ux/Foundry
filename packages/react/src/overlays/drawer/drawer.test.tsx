// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OverlayRoot } from '../foundation/overlay-root.js';
import { DrawerClose, DrawerContent, DrawerRoot, DrawerTrigger, type DrawerCloseProps, type DrawerRootProps, type DrawerTriggerProps } from './drawer.js';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() { this.open = true; };
}

const mounted: Array<{ root: Root; container: HTMLDivElement }> = [];

async function mount(node: ReactNode) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mounted.push({ root, container });
  await act(async () => { root.render(node); });
  return container;
}

afterEach(async () => {
  await act(async () => {
    mounted.splice(0).forEach(({ root, container }) => { root.unmount(); container.remove(); });
  });
});

function Harness({ defaultOpen = false, children, onOpenChange, side }: { defaultOpen?: boolean; children?: ReactNode; onOpenChange?: (next: boolean) => void; side?: 'start' | 'end' }) {
  return <OverlayRoot><DrawerRoot defaultOpen={defaultOpen} onOpenChange={onOpenChange} side={side}>
    <DrawerTrigger data-testid="trigger">Open drawer</DrawerTrigger>
    <DrawerContent data-testid="drawer" title="Drawer">{children}<DrawerClose data-testid="close" /></DrawerContent>
  </DrawerRoot></OverlayRoot>;
}

describe('Drawer', () => {
  it('opens a named native modal drawer and exposes expanded/controls state', async () => {
    const onOpenChange = vi.fn();
    const container = await mount(<Harness onOpenChange={onOpenChange}><button>First action</button></Harness>);
    const trigger = container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
    await act(async () => { trigger.click(); });
    const drawer = container.querySelector<HTMLDialogElement>('[data-testid="drawer"]')!;
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(drawer.open).toBe(true);
    expect(drawer.getAttribute('aria-labelledby')).toBeTruthy();
    expect(drawer.getAttribute('data-control')).toBe('drawer');
    expect(drawer.getAttribute('data-open')).toBe('');
    expect(document.activeElement?.textContent).toBe('First action');
    expect(onOpenChange).toHaveBeenCalledWith(true);
    await act(async () => { container.querySelector<HTMLButtonElement>('[data-testid="close"]')!.click(); });
    expect(container.querySelector('[data-testid="drawer"]')).toBeNull();
    await act(async () => { trigger.click(); });
    expect(document.activeElement?.textContent).toBe('First action');
    await act(async () => { container.querySelector<HTMLDialogElement>('[data-testid="drawer"]')!.dispatchEvent(new Event('close', { bubbles: true })); });
    expect(container.querySelector('[data-testid="drawer"]')).toBeNull();
  });

  it('closes on Escape, restores valid trigger, and refuses outside click', async () => {
    const onOpenChange = vi.fn();
    const container = await mount(<Harness onOpenChange={onOpenChange} />);
    const trigger = container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
    trigger.focus();
    await act(async () => { trigger.click(); });
    const drawer = container.querySelector<HTMLDialogElement>('[data-testid="drawer"]')!;
    await act(async () => { drawer.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    expect(container.querySelector('[data-testid="drawer"]')).toBe(drawer);
    await act(async () => { drawer.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true })); });
    expect(container.querySelector('[data-testid="drawer"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('cycles Tab and Shift+Tab inside, including no-action content', async () => {
    const container = await mount(<Harness defaultOpen><button data-testid="first">First</button><button data-testid="last">Last</button></Harness>);
    const drawer = container.querySelector<HTMLDialogElement>('[data-testid="drawer"]')!;
    const close = container.querySelector<HTMLButtonElement>('[data-testid="close"]')!;
    close.focus();
    await act(async () => { close.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' })); });
    expect(document.activeElement?.getAttribute('data-testid')).toBe('first');
    const first = container.querySelector<HTMLButtonElement>('[data-testid="first"]')!;
    first.focus();
    await act(async () => { first.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab', shiftKey: true })); });
    expect(document.activeElement).toBe(close);

    const empty = await mount(<OverlayRoot><DrawerRoot defaultOpen><DrawerContent data-testid="empty" title="Empty" /></DrawerRoot></OverlayRoot>);
    const emptyDrawer = empty.querySelector<HTMLDialogElement>('[data-testid="empty"]')!;
    expect(document.activeElement).toBe(emptyDrawer);
    await act(async () => { emptyDrawer.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' })); });
    expect(document.activeElement).toBe(emptyDrawer);
  });

  it('supports controlled recovery and refuses mixed state modes', async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return <OverlayRoot><DrawerRoot open={open} onOpenChange={setOpen}><DrawerTrigger data-testid="controlled-trigger">Open</DrawerTrigger><DrawerContent data-testid="controlled-drawer" title="Controlled"><DrawerClose data-testid="controlled-close" /></DrawerContent></DrawerRoot></OverlayRoot>;
    }
    const container = await mount(<Controlled />);
    await act(async () => { container.querySelector<HTMLButtonElement>('[data-testid="controlled-trigger"]')!.click(); });
    expect(container.querySelector('[data-testid="controlled-drawer"]')).toBeTruthy();
    await act(async () => { container.querySelector<HTMLButtonElement>('[data-testid="controlled-close"]')!.click(); });
    expect(container.querySelector('[data-testid="controlled-drawer"]')).toBeNull();
    const invalidProps = { open: true, defaultOpen: false } as unknown as DrawerRootProps;
    await expect(mount(<OverlayRoot><DrawerRoot {...invalidProps} /></OverlayRoot>)).rejects.toThrow('either open or defaultOpen');
  });

  it('does not invent a focus fallback for a stale trigger and strips runtime escapes', async () => {
    function StaleTriggerHarness() {
      const [showTrigger, setShowTrigger] = useState(true);
      return <OverlayRoot><DrawerRoot>{showTrigger ? <DrawerTrigger data-testid="stale-trigger">Open</DrawerTrigger> : null}<button data-testid="remove" onClick={() => setShowTrigger(false)}>Remove trigger</button><button data-testid="outside">Outside</button><DrawerContent data-testid="stale-drawer" title="Stale"><DrawerClose data-testid="stale-close" /></DrawerContent></DrawerRoot></OverlayRoot>;
    }
    const unsafeProps = { role: 'link', className: 'escape', style: { color: 'red' } } as unknown as DrawerTriggerProps & DrawerCloseProps;
    const container = await mount(<StaleTriggerHarness />);
    const trigger = container.querySelector<HTMLButtonElement>('[data-testid="stale-trigger"]')!;
    trigger.focus();
    await act(async () => { trigger.click(); });
    const outside = container.querySelector<HTMLButtonElement>('[data-testid="outside"]')!;
    await act(async () => { container.querySelector<HTMLButtonElement>('[data-testid="remove"]')!.click(); });
    outside.focus();
    await act(async () => { container.querySelector<HTMLDialogElement>('[data-testid="stale-drawer"]')!.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true })); });
    expect(document.activeElement).toBe(outside);
    const safe = await mount(<OverlayRoot><DrawerRoot defaultOpen><DrawerTrigger {...unsafeProps} data-testid="unsafe-trigger">Unsafe trigger</DrawerTrigger><DrawerContent title="Unsafe"><DrawerClose {...unsafeProps} data-testid="unsafe-close" /></DrawerContent></DrawerRoot></OverlayRoot>);
    const unsafeTrigger = safe.querySelector<HTMLButtonElement>('[data-testid="unsafe-trigger"]')!;
    const unsafeClose = safe.querySelector<HTMLButtonElement>('[data-testid="unsafe-close"]')!;
    expect(unsafeTrigger.getAttribute('class')).toBeNull();
    expect(unsafeTrigger.getAttribute('role')).toBeNull();
    expect(unsafeTrigger.getAttribute('style')).toBeNull();
    expect(unsafeClose.getAttribute('class')).toBeNull();
    expect(unsafeClose.getAttribute('role')).toBeNull();
    expect(unsafeClose.getAttribute('style')).toBeNull();
  });

  it('exposes side attribute and controlled/uncontrolled conflict', async () => {
    const container = await mount(<OverlayRoot><DrawerRoot defaultOpen side="start"><DrawerTrigger>Open</DrawerTrigger><DrawerContent data-testid="drawer" title="Side" /></DrawerRoot></OverlayRoot>);
    expect(container.querySelector<HTMLDialogElement>('[data-testid="drawer"]')?.getAttribute('data-drawer-side')).toBe('start');
    expect(container.querySelector<HTMLDialogElement>('[data-testid="drawer"]')?.getAttribute('data-control')).toBe('drawer');
  });
});
