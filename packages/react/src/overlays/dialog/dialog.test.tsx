// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OverlayRoot } from '../foundation/overlay-root.js';
import { DialogClose, DialogContent, DialogRoot, DialogTrigger, type DialogRootProps } from './dialog.js';

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

function Harness({ defaultOpen = false, children, onOpenChange }: { defaultOpen?: boolean; children?: ReactNode; onOpenChange?: (next: boolean) => void }) {
  return <OverlayRoot><DialogRoot defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <DialogTrigger data-testid="trigger">Open details</DialogTrigger>
    <DialogContent data-testid="dialog" title="Details">{children}<DialogClose data-testid="close" /></DialogContent>
  </DialogRoot></OverlayRoot>;
}

describe('Dialog', () => {
  it('opens a named native modal dialog, moves initial focus, and reports state', async () => {
    const onOpenChange = vi.fn();
    const container = await mount(<Harness onOpenChange={onOpenChange}><button>First action</button></Harness>);
    const trigger = container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
    await act(async () => { trigger.click(); });
    const dialog = container.querySelector<HTMLDialogElement>('[data-testid="dialog"]')!;
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(dialog.open).toBe(true);
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    expect(document.activeElement?.textContent).toBe('First action');
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('closes on Escape, restores its valid trigger, and refuses an outside click', async () => {
    const onOpenChange = vi.fn();
    const container = await mount(<Harness defaultOpen onOpenChange={onOpenChange} />);
    const dialog = container.querySelector<HTMLDialogElement>('[data-testid="dialog"]')!;
    await act(async () => { dialog.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    expect(container.querySelector('[data-testid="dialog"]')).toBe(dialog);
    const trigger = container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
    trigger.focus();
    await act(async () => { trigger.click(); });
    const opened = container.querySelector<HTMLDialogElement>('[data-testid="dialog"]')!;
    await act(async () => { opened.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true })); });
    expect(container.querySelector('[data-testid="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('cycles keyboard focus and keeps a no-action dialog focusable', async () => {
    const container = await mount(<Harness defaultOpen><button data-testid="first">First</button><button data-testid="last">Last</button></Harness>);
    const dialog = container.querySelector<HTMLDialogElement>('[data-testid="dialog"]')!;
    const close = container.querySelector<HTMLButtonElement>('[data-testid="close"]')!;
    close.focus();
    await act(async () => { close.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' })); });
    expect(document.activeElement?.getAttribute('data-testid')).toBe('first');

    const empty = await mount(<OverlayRoot><DialogRoot defaultOpen><DialogContent data-testid="empty" title="Empty" /></DialogRoot></OverlayRoot>);
    const emptyDialog = empty.querySelector<HTMLDialogElement>('[data-testid="empty"]')!;
    expect(document.activeElement).toBe(emptyDialog);
    await act(async () => { emptyDialog.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' })); });
    expect(document.activeElement).toBe(emptyDialog);
  });

  it('supports controlled recovery and refuses mixed state modes', async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return <OverlayRoot><DialogRoot open={open} onOpenChange={setOpen}><DialogTrigger data-testid="controlled-trigger">Open</DialogTrigger><DialogContent data-testid="controlled-dialog" title="Controlled"><DialogClose data-testid="controlled-close" /></DialogContent></DialogRoot></OverlayRoot>;
    }
    const container = await mount(<Controlled />);
    await act(async () => { container.querySelector<HTMLButtonElement>('[data-testid="controlled-trigger"]')!.click(); });
    expect(container.querySelector('[data-testid="controlled-dialog"]')).toBeTruthy();
    await act(async () => { container.querySelector<HTMLButtonElement>('[data-testid="controlled-close"]')!.click(); });
    expect(container.querySelector('[data-testid="controlled-dialog"]')).toBeNull();
    const invalidProps = { open: true, defaultOpen: false } as unknown as DialogRootProps;
    await expect(mount(<OverlayRoot><DialogRoot {...invalidProps} /></OverlayRoot>)).rejects.toThrow('either open or defaultOpen');
  });
});
