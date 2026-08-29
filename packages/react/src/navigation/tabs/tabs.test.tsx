// @vitest-environment jsdom
import { act, useState, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import {
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTrigger,
  type TabsListProps,
  type TabsPanelProps,
  type TabsRootProps,
  type TabsTriggerProps
} from './tabs.js';

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

function Tabs({ controlled, disabled = false }: { controlled?: { value: string; onValueChange: (value: string) => void }; disabled?: boolean }) {
  const content = <>
    <TabsList label="Sections" data-testid="list">
      <TabsTrigger value="one" data-testid="one">One</TabsTrigger>
      <TabsTrigger value="two" disabled={disabled} data-testid="two">Two</TabsTrigger>
      <TabsTrigger value="three" data-testid="three">Three</TabsTrigger>
    </TabsList>
    <TabsPanel value="one" data-testid="panel-one">Panel one</TabsPanel>
    <TabsPanel value="two" data-testid="panel-two">Panel two</TabsPanel>
    <TabsPanel value="three" data-testid="panel-three">Panel three</TabsPanel>
  </>;
  return controlled ? <TabsRoot {...controlled}>{content}</TabsRoot> : <TabsRoot defaultValue="one">{content}</TabsRoot>;
}

async function key(node: HTMLElement, value: string) {
  await act(async () => node.dispatchEvent(new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: value
  })));
}

function selected(host: HTMLElement) {
  return host.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')!;
}

describe('Tabs', () => {
  it('renders one labelled tablist with fixed generated relationships and one visible panel', async () => {
    const host = await mount(<Tabs />);
    const list = host.querySelector<HTMLElement>('[data-testid="list"]')!;
    const triggers = [...host.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = [...host.querySelectorAll<HTMLElement>('[role="tabpanel"]')];

    expect(list.getAttribute('role')).toBe('tablist');
    expect(list.getAttribute('aria-label')).toBe('Sections');
    expect(triggers.map((trigger) => trigger.tabIndex)).toEqual([0, -1, -1]);
    expect(triggers.map((trigger) => trigger.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
    expect(triggers.map((trigger) => trigger.getAttribute('aria-controls'))).toEqual(panels.map((panel) => panel.id));
    expect(panels.map((panel) => panel.getAttribute('aria-labelledby'))).toEqual(triggers.map((trigger) => trigger.id));
    expect(panels.map((panel) => panel.hidden)).toEqual([false, true, true]);
    expect(selected(host).getAttribute('data-selected')).toBe('');
  });

  it('moves focus and selection together for pointer, arrows, Home, and End while skipping disabled tabs', async () => {
    const host = await mount(<Tabs disabled />);
    const one = host.querySelector<HTMLButtonElement>('[data-testid="one"]')!;
    const two = host.querySelector<HTMLButtonElement>('[data-testid="two"]')!;
    const three = host.querySelector<HTMLButtonElement>('[data-testid="three"]')!;

    await act(async () => three.click());
    expect(selected(host)).toBe(three);
    expect(host.querySelector<HTMLElement>('[data-testid="panel-three"]')!.hidden).toBe(false);

    three.focus();
    await key(three, 'ArrowRight');
    expect(selected(host)).toBe(one);
    expect(document.activeElement).toBe(one);
    await key(one, 'End');
    expect(selected(host)).toBe(three);
    await key(three, 'Home');
    expect(selected(host)).toBe(one);
    await key(one, 'ArrowLeft');
    expect(selected(host)).toBe(three);
    await act(async () => two.click());
    expect(selected(host)).toBe(three);
    expect(two.disabled).toBe(true);
  });

  it('supports uncontrolled reset-by-remount and controlled change requests', async () => {
    const uncontrolled = await mount(<Tabs />);
    const three = uncontrolled.querySelector<HTMLButtonElement>('[data-testid="three"]')!;
    await act(async () => three.click());
    expect(selected(uncontrolled)).toBe(three);
    const remounted = await mount(<Tabs />);
    expect(selected(remounted).textContent).toBe('One');

    const requests = vi.fn();
    function ControlledTabs() {
      const [value, setValue] = useState('one');
      return <Tabs controlled={{ value, onValueChange: (nextValue) => { requests(nextValue); setValue(nextValue); } }} />;
    }
    const controlled = await mount(<ControlledTabs />);
    const controlledThree = controlled.querySelector<HTMLButtonElement>('[data-testid="three"]')!;
    await act(async () => controlledThree.click());
    expect(requests).toHaveBeenCalledTimes(1);
    expect(requests).toHaveBeenCalledWith('three');
    expect(selected(controlled)).toBe(controlledThree);
  });

  it('keeps focus on the committed controlled selection when a parent declines a keyboard request', async () => {
    const requests = vi.fn();
    const host = await mount(<Tabs controlled={{ value: 'one', onValueChange: requests }} />);
    const one = host.querySelector<HTMLButtonElement>('[data-testid="one"]')!;
    one.focus();

    await key(one, 'ArrowRight');

    expect(requests).toHaveBeenCalledWith('two');
    expect(selected(host)).toBe(one);
    expect(document.activeElement).toBe(one);
  });

  it('refuses invalid root modes and invalid tab compositions', async () => {
    const mixed = { value: 'one', defaultValue: 'one', onValueChange: () => {} } as unknown as TabsRootProps;
    const missingCallback = { value: 'one' } as unknown as TabsRootProps;
    const nonFunctionCallback = { value: 'one', onValueChange: true } as unknown as TabsRootProps;
    await expect(mount(<TabsRoot {...mixed} />)).rejects.toThrow('either value or defaultValue');
    await expect(mount(<TabsRoot {...missingCallback} />)).rejects.toThrow('requires onValueChange');
    await expect(mount(<TabsRoot {...nonFunctionCallback} />)).rejects.toThrow('requires onValueChange');
    await expect(mount(<TabsRoot defaultValue="" />)).rejects.toThrow('non-empty defaultValue');
    await expect(mount(<TabsRoot defaultValue="two"><TabsList label="Sections"><TabsTrigger value="one">One</TabsTrigger><TabsTrigger value="two" disabled>Two</TabsTrigger></TabsList><TabsPanel value="one">One</TabsPanel><TabsPanel value="two">Two</TabsPanel></TabsRoot>)).rejects.toThrow('selected value is disabled');
    await expect(mount(<TabsRoot defaultValue="one"><TabsList label="Sections"><TabsTrigger value="one">One</TabsTrigger></TabsList><TabsPanel value="two">Two</TabsPanel></TabsRoot>)).rejects.toThrow('matching panel');
    await expect(mount(<TabsRoot defaultValue="one"><TabsTrigger value="one">One</TabsTrigger><TabsPanel value="one">One</TabsPanel></TabsRoot>)).rejects.toThrow('exactly one TabsList');
    await expect(mount(<TabsRoot defaultValue="one"><TabsList label="First"><TabsTrigger value="one">One</TabsTrigger></TabsList><TabsList label="Second"><TabsPanel value="one">One</TabsPanel></TabsList></TabsRoot>)).rejects.toThrow('exactly one TabsList');
  });

  it('refuses runtime semantic, ARIA, state, and styling overrides', async () => {
    expectTypeOf<TabsTriggerProps>().toMatchTypeOf<{ className?: never; role?: never; style?: never }>();
    expectTypeOf<TabsTriggerProps>().not.toMatchTypeOf<{ 'aria-label': string }>();
    expectTypeOf<TabsTriggerProps>().not.toMatchTypeOf<{ 'data-selected': string }>();
    expectTypeOf<TabsPanelProps>().not.toMatchTypeOf<{ 'aria-label': string }>();
    expectTypeOf<TabsPanelProps>().not.toMatchTypeOf<{ 'data-selected': string }>();
    expectTypeOf<TabsListProps>().not.toMatchTypeOf<{ 'aria-label': string }>();
    const unsafeList = { role: 'presentation', 'aria-label': 'Wrong', className: 'bad', style: { color: 'red' } } as unknown as TabsListProps;
    const unsafeTrigger = { role: 'switch', 'aria-controls': 'wrong', 'aria-selected': false, 'data-selected': 'wrong', className: 'bad', style: { color: 'red' } } as unknown as TabsTriggerProps;
    const unsafePanel = { role: 'dialog', 'aria-labelledby': 'wrong', hidden: false, 'data-selected': 'wrong', className: 'bad', style: { color: 'red' } } as unknown as TabsPanelProps;
    const host = await mount(<TabsRoot defaultValue="one">
      <TabsList {...unsafeList} label="Sections" data-testid="list"><TabsTrigger {...unsafeTrigger} value="one" data-testid="trigger">One</TabsTrigger></TabsList>
      <TabsPanel {...unsafePanel} value="one" data-testid="panel">Panel one</TabsPanel>
    </TabsRoot>);
    const list = host.querySelector<HTMLElement>('[data-testid="list"]')!;
    const trigger = host.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
    const panel = host.querySelector<HTMLElement>('[data-testid="panel"]')!;

    expect(list.getAttribute('role')).toBe('tablist');
    expect(list.getAttribute('aria-label')).toBe('Sections');
    expect(list.className).toBe('');
    expect(trigger.getAttribute('role')).toBe('tab');
    expect(trigger.getAttribute('aria-selected')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(trigger.getAttribute('data-selected')).toBe('');
    expect(trigger.className).toBe('');
    expect(panel.getAttribute('role')).toBe('tabpanel');
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(panel.hidden).toBe(false);
    expect(panel.className).toBe('');
  });

  it('requires a named TabsList and preserves unselected panels in the DOM', async () => {
    await expect(mount(<TabsRoot defaultValue="one"><TabsList label=""><TabsTrigger value="one">One</TabsTrigger></TabsList><TabsPanel value="one">One</TabsPanel></TabsRoot>)).rejects.toThrow('non-empty label');
    const host = await mount(<Tabs />);
    expect(host.querySelector('[data-testid="panel-two"]')).not.toBeNull();
    expect(host.querySelector<HTMLElement>('[data-testid="panel-two"]')!.hidden).toBe(true);
  });
});
