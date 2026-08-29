// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import {
  OverlayRoot,
  cycleFocusWithin,
  focusFirstDescendant,
  getFocusableDescendants,
  restoreFocusToTrigger,
  useOverlayLayer
} from './overlay-root.js';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const mountedRoots: Array<{ container: HTMLDivElement; root: Root }> = [];

async function mount(node: React.ReactNode) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mountedRoots.push({ container, root });

  await act(async () => {
    root.render(node);
  });

  return container;
}

afterEach(async () => {
  await act(async () => {
    mountedRoots.splice(0).forEach(({ container, root }) => {
      root.unmount();
      container.remove();
    });
  });
});

function Layer({ id, open, onClose }: { id: string; open: boolean; onClose: () => void }) {
  const { captureTrigger, isTopLayer } = useOverlayLayer({ id, open });

  return (
    <>
      <button data-testid={`${id}-trigger`} onClick={(event) => captureTrigger(event.currentTarget)}>
        Open {id}
      </button>
      {open ? (
        <section data-testid={`${id}-layer`} data-top={isTopLayer ? '' : undefined}>
          <button data-testid={`${id}-inside`}>Inside {id}</button>
          <button data-testid={`${id}-clear-trigger`} onClick={() => captureTrigger(null)}>Clear {id} trigger</button>
          <button data-testid={`${id}-close`} onClick={onClose}>Close {id}</button>
        </section>
      ) : null}
    </>
  );
}

function LayerHarness({ firstOpen, secondOpen, closeFirst, closeSecond }: {
  firstOpen: boolean;
  secondOpen: boolean;
  closeFirst: () => void;
  closeSecond: () => void;
}) {
  return (
    <OverlayRoot>
      <Layer id="first" open={firstOpen} onClose={closeFirst} />
      <Layer id="second" open={secondOpen} onClose={closeSecond} />
    </OverlayRoot>
  );
}

describe('overlay foundation', () => {
  it('registers open layers in order and restores the top layer trigger when it closes', async () => {
    let firstOpen = false;
    let secondOpen = false;
    const closeFirst = () => { firstOpen = false; };
    const closeSecond = () => { secondOpen = false; };
    const container = await mount(<LayerHarness firstOpen={firstOpen} secondOpen={secondOpen} closeFirst={closeFirst} closeSecond={closeSecond} />);
    const firstTrigger = container.querySelector<HTMLButtonElement>('[data-testid="first-trigger"]')!;
    const secondTrigger = container.querySelector<HTMLButtonElement>('[data-testid="second-trigger"]')!;

    firstTrigger.focus();
    firstTrigger.click();
    firstOpen = true;
    await act(async () => {
      mountedRoots[0].root.render(<LayerHarness firstOpen={firstOpen} secondOpen={secondOpen} closeFirst={closeFirst} closeSecond={closeSecond} />);
    });

    secondTrigger.focus();
    secondTrigger.click();
    secondOpen = true;
    await act(async () => {
      mountedRoots[0].root.render(<LayerHarness firstOpen={firstOpen} secondOpen={secondOpen} closeFirst={closeFirst} closeSecond={closeSecond} />);
    });

    expect(container.querySelector('[data-testid="second-layer"]')?.getAttribute('data-top')).toBe('');
    container.querySelector<HTMLButtonElement>('[data-testid="second-inside"]')!.focus();
    secondOpen = false;
    await act(async () => {
      mountedRoots[0].root.render(<LayerHarness firstOpen={firstOpen} secondOpen={secondOpen} closeFirst={closeFirst} closeSecond={closeSecond} />);
    });
    expect(document.activeElement).toBe(secondTrigger);
  });

  it('does not steal focus when a non-top layer closes', async () => {
    const close = () => {};
    const container = await mount(<LayerHarness firstOpen secondOpen closeFirst={close} closeSecond={close} />);
    const secondInside = container.querySelector<HTMLButtonElement>('[data-testid="second-inside"]')!;
    secondInside.focus();

    await act(async () => {
      mountedRoots[0].root.render(<LayerHarness firstOpen={false} secondOpen closeFirst={close} closeSecond={close} />);
    });

    expect(document.activeElement).toBe(secondInside);
  });

  it('does not infer a trigger from the active element when an overlay opens without capture', async () => {
    const close = () => {};
    const inferredTrigger = document.createElement('button');
    const currentFocus = document.createElement('button');
    document.body.append(inferredTrigger, currentFocus);
    inferredTrigger.focus();
    const container = await mount(<LayerHarness firstOpen secondOpen={false} closeFirst={close} closeSecond={close} />);
    currentFocus.focus();

    await act(async () => {
      mountedRoots[0].root.render(<LayerHarness firstOpen={false} secondOpen={false} closeFirst={close} closeSecond={close} />);
    });

    expect(document.activeElement).toBe(currentFocus);
    inferredTrigger.remove();
    currentFocus.remove();
  });

  it('allows an open layer to clear restoration without changing focus', async () => {
    const close = () => {};
    const container = await mount(<LayerHarness firstOpen={false} secondOpen={false} closeFirst={close} closeSecond={close} />);
    const trigger = container.querySelector<HTMLButtonElement>('[data-testid="first-trigger"]')!;
    trigger.click();
    await act(async () => {
      mountedRoots[0].root.render(<LayerHarness firstOpen secondOpen={false} closeFirst={close} closeSecond={close} />);
    });
    const outside = document.createElement('button');
    document.body.append(outside);
    await act(async () => { container.querySelector<HTMLButtonElement>('[data-testid="first-clear-trigger"]')!.click(); });
    outside.focus();
    await act(async () => {
      mountedRoots[0].root.render(<LayerHarness firstOpen={false} secondOpen={false} closeFirst={close} closeSecond={close} />);
    });
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });

  it('restores only connected, enabled, non-inert triggers', () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    expect(restoreFocusToTrigger(trigger)).toBe(true);
    trigger.disabled = true;
    expect(restoreFocusToTrigger(trigger)).toBe(false);
    trigger.disabled = false;
    trigger.setAttribute('inert', '');
    expect(restoreFocusToTrigger(trigger)).toBe(false);
    trigger.removeAttribute('inert');
    trigger.remove();
    expect(restoreFocusToTrigger(trigger)).toBe(false);
  });

  it('filters unavailable descendants and focuses the first remaining control', () => {
    const container = document.createElement('div');
    container.innerHTML = '<button disabled>Disabled</button><fieldset disabled><button>Inherited disabled</button></fieldset><button hidden>Hidden</button><span inert><button>Inert</button></span><button>Ready</button>';
    document.body.append(container);

    expect(getFocusableDescendants(container).map((element) => element.textContent)).toEqual(['Ready']);
    expect(focusFirstDescendant(container)).toBe(true);
    expect(document.activeElement?.textContent).toBe('Ready');
    container.remove();
  });

  it('cycles Tab and Shift+Tab within the available descendants and reports no target', () => {
    const container = document.createElement('div');
    container.innerHTML = '<button>First</button><button disabled>Unavailable</button><button>Last</button>';
    document.body.append(container);
    const [first, last] = getFocusableDescendants(container);
    last.focus();
    const forward = { key: 'Tab', shiftKey: false, target: last, preventDefault: () => {} };
    expect(cycleFocusWithin(forward, container)).toBe(true);
    expect(document.activeElement).toBe(first);
    const backward = { key: 'Tab', shiftKey: true, target: first, preventDefault: () => {} };
    expect(cycleFocusWithin(backward, container)).toBe(true);
    expect(document.activeElement).toBe(last);
    container.remove();
    expect(focusFirstDescendant(container)).toBe(false);
  });

  it('refuses registration without an OverlayRoot ancestor', async () => {
    function MissingRoot() {
      useOverlayLayer({ id: 'missing', open: true });
      return null;
    }

    await expect(mount(<MissingRoot />)).rejects.toThrow('OverlayRoot ancestor');
  });
});
