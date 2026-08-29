// @vitest-environment jsdom
import { act, useState, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OverlayRoot } from '../foundation/overlay-root.js';
import {
  MenuClose,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  type MenuContentProps,
  type MenuRootProps,
  type MenuTriggerProps
} from './menu.js';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const mounted: Array<{ root: Root; node: HTMLDivElement }> = [];
async function mount(node: ReactNode) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  mounted.push({ root, node: host });
  await act(async () => root.render(node));
  return host;
}

afterEach(async () => {
  await act(async () => mounted.splice(0).forEach(({ root, node }) => {
    root.unmount();
    node.remove();
  }));
});

function Harness({ onOpenChange = vi.fn() }: { onOpenChange?: (open: boolean) => void }) {
  return <OverlayRoot><MenuRoot onOpenChange={onOpenChange}>
    <MenuTrigger data-testid="trigger">Actions</MenuTrigger>
    <MenuContent data-testid="menu">
      <MenuItem data-testid="first">First</MenuItem>
      <MenuItem data-testid="disabled" disabled>Disabled</MenuItem>
      <MenuItem data-testid="last">Last</MenuItem>
      <MenuClose data-testid="close" />
    </MenuContent>
  </MenuRoot></OverlayRoot>;
}

async function key(node: HTMLElement, value: string) {
  await act(async () => node.dispatchEvent(new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: value
  })));
}

function menuItems(host: HTMLElement) {
  return [...host.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')];
}

describe('Menu', () => {
  it('opens a labelled menu and enters first or last item from its trigger', async () => {
    const host = await mount(<Harness />);
    const trigger = host.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;

    await act(async () => trigger.click());
    const menu = host.querySelector<HTMLElement>('[data-testid="menu"]')!;
    const items = menuItems(menu);

    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
    expect(menu.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.getAttribute('data-control')).toBe('menu');
    expect(menu.getAttribute('data-open')).toBe('');
    expect(items.map((item) => item.tabIndex)).toEqual([0, -1, -1]);
    expect(document.activeElement?.textContent).toBe('First');

    await act(async () => trigger.click());
    await key(trigger, 'ArrowUp');
    expect(document.activeElement?.textContent).toBe('Last');
  });
  it('uses roving focus including disabled items and activates only enabled items', async () => {
    const select = vi.fn();
    const host = await mount(<OverlayRoot><MenuRoot>
      <MenuTrigger data-testid="trigger">Actions</MenuTrigger>
      <MenuContent>
        <MenuItem data-testid="one" onSelect={select}>One</MenuItem>
        <MenuItem data-testid="off" disabled>Off</MenuItem>
        <MenuItem data-testid="two">Two</MenuItem>
      </MenuContent>
    </MenuRoot></OverlayRoot>);
    const trigger = host.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
    await act(async () => trigger.click());
    const one = host.querySelector<HTMLButtonElement>('[data-testid="one"]')!;
    const off = host.querySelector<HTMLButtonElement>('[data-testid="off"]')!;
    const items = menuItems(host);

    await key(one, 'ArrowDown');
    expect(document.activeElement).toBe(off);
    expect(off.getAttribute('aria-disabled')).toBe('true');
    expect(items.map((item) => item.tabIndex)).toEqual([-1, 0, -1]);
    await key(off, 'Enter');
    expect(select).not.toHaveBeenCalled();
    await key(off, 'Home');
    expect(document.activeElement).toBe(one);
    expect(items.map((item) => item.tabIndex)).toEqual([0, -1, -1]);
    await key(one, 'End');
    expect(document.activeElement?.textContent).toBe('Two');
    expect(items.map((item) => item.tabIndex)).toEqual([-1, -1, 0]);
    await key(one, 'Home');
    await key(one, 'Enter');
    expect(select).toHaveBeenCalledTimes(1);

    await act(async () => trigger.click());
    await key(host.querySelector<HTMLButtonElement>('[data-testid="one"]')!, ' ');
    expect(select).toHaveBeenCalledTimes(2);
  });
  it('runs consumer click before selection and refuses a prevented activation', async () => {
    const calls: string[] = [];
    const host = await mount(<OverlayRoot><MenuRoot>
      <MenuTrigger data-testid="trigger">Actions</MenuTrigger>
      <MenuContent>
        <MenuItem data-testid="prevented" onClick={(event) => { calls.push('click'); event.preventDefault(); }} onSelect={() => calls.push('select')}>Prevented</MenuItem>
        <MenuItem data-testid="accepted" onClick={() => calls.push('click')} onSelect={() => calls.push('select')}>Accepted</MenuItem>
      </MenuContent>
    </MenuRoot></OverlayRoot>);
    const trigger = host.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;

    await act(async () => trigger.click());
    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="prevented"]')!.click());
    expect(calls).toEqual(['click']);
    expect(host.querySelector('[role="menu"]')).not.toBeNull();

    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="accepted"]')!.click());
    expect(calls).toEqual(['click', 'click', 'select']);
    expect(host.querySelector('[role="menu"]')).toBeNull();
  });
  it('distinguishes restore and non-restore close paths', async () => {
    const host = await mount(<Harness />);
    const trigger = host.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;

    await act(async () => trigger.click());
    const menu = host.querySelector<HTMLElement>('[data-testid="menu"]')!;
    await key(menu, 'Escape');
    expect(document.activeElement).toBe(trigger);

    await act(async () => trigger.click());
    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="close"]')!.click());
    expect(document.activeElement).toBe(trigger);

    await act(async () => trigger.click());
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    await act(async () => outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
    expect(document.activeElement).toBe(outside);
    expect(host.querySelector('[role="menu"]')).toBeNull();
    outside.remove();
  });
  it('does not prevent Tab and refuses invalid root modes', async () => {
    const host = await mount(<Harness />);
    const trigger = host.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
    await act(async () => trigger.click());
    const menu = host.querySelector<HTMLElement>('[data-testid="menu"]')!;
    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' });
    await act(async () => menu.dispatchEvent(event));
    expect(event.defaultPrevented).toBe(false);
    expect(host.querySelector('[role="menu"]')).toBeNull();

    const invalid = { open: true, defaultOpen: false, onOpenChange: () => {} } as unknown as MenuRootProps;
    await expect(mount(<OverlayRoot><MenuRoot {...invalid} /></OverlayRoot>)).rejects.toThrow('either open or defaultOpen');
    await expect(mount(<OverlayRoot><MenuRoot open /></OverlayRoot>)).rejects.toThrow('requires onOpenChange');
    const nonFunctionCallback = { open: true, onOpenChange: true } as unknown as MenuRootProps;
    await expect(mount(<OverlayRoot><MenuRoot {...nonFunctionCallback} /></OverlayRoot>)).rejects.toThrow('requires onOpenChange');
  });
  it('keeps controlled state with its parent and strips consumer semantic and styling escapes', async () => {
    const requests = vi.fn();
    const host = await mount(<OverlayRoot><MenuRoot open onOpenChange={requests}>
      <MenuTrigger data-testid="trigger" {...{ role: 'switch', className: 'bad', style: { color: 'red' } } as unknown as MenuTriggerProps}>Open</MenuTrigger>
      <MenuContent data-testid="menu" {...{ role: 'dialog', className: 'bad', style: { color: 'red' }, 'data-control': 'bad', 'data-open': 'bad' } as unknown as MenuContentProps}>
        <MenuClose data-testid="close" />
      </MenuContent>
    </MenuRoot></OverlayRoot>);
    const trigger = host.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
    const menu = host.querySelector<HTMLElement>('[data-testid="menu"]')!;
    expect(trigger.getAttribute('role')).toBeNull();
    expect(trigger.className).toBe('');
    expect(trigger.style.color).toBe('');
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.className).toBe('');
    expect(menu.style.color).toBe('');
    expect(menu.getAttribute('data-control')).toBe('menu');
    expect(menu.getAttribute('data-open')).toBe('');

    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="close"]')!.click());
    expect(requests).toHaveBeenCalledWith(false);
    expect(host.querySelector('[data-testid="menu"]')).not.toBeNull();
  });
  it('does not invent a focus target when it opened without a trigger', async () => {
    const host = await mount(<OverlayRoot><MenuRoot defaultOpen>
      <MenuContent><MenuClose data-testid="close" /></MenuContent>
    </MenuRoot></OverlayRoot>);
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();

    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="close"]')!.click());
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });
  it('does not restore a disconnected captured trigger', async () => {
    function StaleTriggerHarness() {
      const [showTrigger, setShowTrigger] = useState(true);
      return <OverlayRoot><MenuRoot>
        <button type="button" data-testid="detach" onClick={() => setShowTrigger(false)}>Detach trigger</button>
        {showTrigger && <MenuTrigger data-testid="trigger">Actions</MenuTrigger>}
        <MenuContent><MenuClose data-testid="close" /></MenuContent>
      </MenuRoot></OverlayRoot>;
    }

    const host = await mount(<StaleTriggerHarness />);
    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!.click());
    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="detach"]')!.click());
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();

    await act(async () => host.querySelector<HTMLButtonElement>('[data-testid="close"]')!.click());
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });
});
