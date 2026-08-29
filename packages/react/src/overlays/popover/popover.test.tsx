// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OverlayRoot } from '../foundation/overlay-root.js';
import {
  PopoverClose,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
  type PopoverCloseProps,
  type PopoverContentProps,
  type PopoverRootProps,
  type PopoverTriggerProps
} from './popover.js';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

/* ── jsdom popover shim ─────────────────────────────────────────── */

interface PopoverToggleEvent extends Event {
  newState: 'open' | 'closed';
}

function dispatchToggle(el: HTMLElement, newState: 'open' | 'closed') {
  const event = new Event('toggle', { bubbles: true, cancelable: false });
  Object.defineProperty(event, 'newState', { value: newState, enumerable: true });
  el.dispatchEvent(event);
}

(function initPopoverShim() {
  // @ts-expect-error jsdom does not define showPopover
  if (HTMLElement.prototype.showPopover) {
    return;
  }

  HTMLElement.prototype.showPopover = function () {
    this.setAttribute('popover', 'auto');
    this.hidden = false;
    dispatchToggle(this, 'open');
  };

  HTMLElement.prototype.hidePopover = function () {
    dispatchToggle(this, 'closed');
    this.hidden = true;
  };
})();

const mounted: Array<{ root: Root; container: HTMLDivElement }> = [];

async function mount(node: ReactNode) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  mounted.push({ root, container });
  await act(async () => { root.render(node); });
  return container;
}

async function unmountAll() {
  await act(async () => {
    mounted.splice(0).forEach(({ root, container }) => { root.unmount(); container.remove(); });
  });
}

afterEach(unmountAll);

function Harness({ defaultOpen = false, children, onOpenChange }: {
  defaultOpen?: boolean;
  children?: ReactNode;
  onOpenChange?: (next: boolean) => void;
}) {
  return (
    <OverlayRoot>
      <PopoverRoot defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger data-testid="trigger">Open popover</PopoverTrigger>
        <PopoverContent data-testid="popover" title="Popover">{children}</PopoverContent>
      </PopoverRoot>
    </OverlayRoot>
  );
}

/* ── Tests ──────────────────────────────────────────────────────── */

describe('Popover', () => {
  it('opens one named auto-popover with fixed hooks and trigger state', async () => {
    const onOpenChange = vi.fn();
    const container = await mount(<Harness onOpenChange={onOpenChange} />);
    const trigger = container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;

    await act(async () => { trigger.click(); });

    const popover = container.querySelector<HTMLDivElement>('[data-testid="popover"]')!;
    const titleEl = popover.querySelector('h2');

    expect(trigger.getAttribute('aria-controls')).toBe(popover.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    expect(popover.getAttribute('role')).toBe('dialog');
    expect(popover.getAttribute('aria-modal')).toBeNull();
    expect(popover.getAttribute('popover')).toBe('auto');
    expect(popover.getAttribute('data-control')).toBe('popover');
    expect(popover.getAttribute('data-open')).toBe('');
    expect(popover.getAttribute('aria-labelledby')).toBe(titleEl!.id);
    expect(titleEl?.textContent).toBe('Popover');

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('explicit PopoverClose requests false once', async () => {
    const onOpenChange = vi.fn();
    const container = await mount(
      <OverlayRoot>
        <PopoverRoot onOpenChange={onOpenChange}>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
          <PopoverContent data-testid="popover" title="Pop"><PopoverClose data-testid="close" /></PopoverContent>
        </PopoverRoot>
      </OverlayRoot>
    );

    await act(async () => { container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!.click(); });
    expect(container.querySelector('[data-testid="popover"]')).toBeTruthy();

    await act(async () => { container.querySelector<HTMLButtonElement>('[data-testid="close"]')!.click(); });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(container.querySelector('[data-testid="popover"]')).toBeNull();
  });

  it('closed native toggle requests false once', async () => {
    const onOpenChange = vi.fn();
    const container = await mount(<Harness onOpenChange={onOpenChange} />);
    const trigger = container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;

    await act(async () => { trigger.click(); });
    const popover = container.querySelector<HTMLDivElement>('[data-testid="popover"]')!;

    await act(async () => { dispatchToggle(popover, 'closed'); });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('controlled open re-shows content after native dismissal when parent keeps open=true', async () => {
    function ControlledReShow() {
      const [open] = useState(true);
      return (
        <OverlayRoot>
          <PopoverRoot open={open} onOpenChange={() => {}}>
            <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
            <PopoverContent data-testid="popover" title="ReShow" />
          </PopoverRoot>
        </OverlayRoot>
      );
    }

    const container = await mount(<ControlledReShow />);
    const popover = container.querySelector<HTMLDivElement>('[data-testid="popover"]')!;
    const showPopover = vi.spyOn(popover, 'showPopover');

    expect(popover).toBeTruthy();

    await act(async () => { dispatchToggle(popover, 'closed'); });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.querySelector('[data-testid="popover"]')).toBeTruthy();
    expect(showPopover).toHaveBeenCalledOnce();
  });

  it('controlled and uncontrolled entry/recovery', async () => {
    const ucContainer = await mount(<Harness defaultOpen />);
    expect(ucContainer.querySelector('[data-testid="popover"]')).toBeTruthy();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <OverlayRoot>
          <PopoverRoot open={open} onOpenChange={setOpen}>
            <PopoverTrigger data-testid="c-trigger">Open</PopoverTrigger>
            <PopoverContent data-testid="c-popover" title="Controlled"><PopoverClose data-testid="c-close" /></PopoverContent>
          </PopoverRoot>
        </OverlayRoot>
      );
    }
    const cContainer = await mount(<Controlled />);
    expect(cContainer.querySelector('[data-testid="c-popover"]')).toBeNull();

    await act(async () => { cContainer.querySelector<HTMLButtonElement>('[data-testid="c-trigger"]')!.click(); });
    expect(cContainer.querySelector('[data-testid="c-popover"]')).toBeTruthy();

    await act(async () => { cContainer.querySelector<HTMLButtonElement>('[data-testid="c-close"]')!.click(); });
    expect(cContainer.querySelector('[data-testid="c-popover"]')).toBeNull();
  });

  it('controlled-without-callback and mixed-state refuse', async () => {
    await expect(
      mount(
        <OverlayRoot>
          <PopoverRoot open={true}>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent title="Bad" />
          </PopoverRoot>
        </OverlayRoot>
      )
    ).rejects.toThrow('onOpenChange');

    await expect(
      mount(
        <OverlayRoot>
          {/* @ts-expect-error deliberate mixed-state for runtime refusal test */}
          <PopoverRoot open={true} onOpenChange={() => {}} defaultOpen={false}>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent title="Bad" />
          </PopoverRoot>
        </OverlayRoot>
      )
    ).rejects.toThrow('either open or defaultOpen');
  });

  it('does not move focus on open and does not trap Tab', async () => {
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    const tabEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' });

    const container = await mount(
      <Harness defaultOpen>
        <button data-testid="inside">Inside action</button>
      </Harness>
    );

    /* Tab is not prevented — popover does not trap keyboard */
    const inside = container.querySelector<HTMLButtonElement>('[data-testid="inside"]')!;
    expect(document.activeElement).toBe(outside);
    inside.dispatchEvent(tabEvent);
    expect(tabEvent.defaultPrevented).toBe(false);
    outside.remove();
  });

  it('valid/stale/no-capture recovery', async () => {
    const validContainer = await mount(<Harness><PopoverClose data-testid="valid-close" /></Harness>);
    const validTrigger = validContainer.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;
    await act(async () => { validTrigger.click(); });
    await act(async () => { validContainer.querySelector<HTMLButtonElement>('[data-testid="valid-close"]')!.click(); });
    expect(document.activeElement).toBe(validTrigger);

    function StaleHarness() {
      const [showTrigger, setShowTrigger] = useState(true);
      return (
        <OverlayRoot>
          <PopoverRoot>
            {showTrigger ? <PopoverTrigger data-testid="s-trigger">Open</PopoverTrigger> : null}
            <button data-testid="remove-trigger" onClick={() => setShowTrigger(false)}>Remove</button>
            <button data-testid="other-focus" tabIndex={0}>Other</button>
            <PopoverContent data-testid="s-popover" title="Stale"><PopoverClose data-testid="s-close" /></PopoverContent>
          </PopoverRoot>
        </OverlayRoot>
      );
    }

    const container = await mount(<StaleHarness />);
    const trigger = container.querySelector<HTMLButtonElement>('[data-testid="s-trigger"]')!;
    trigger.focus();

    await act(async () => { trigger.click(); });
    const otherFocus = container.querySelector<HTMLButtonElement>('[data-testid="other-focus"]')!;
    otherFocus.focus();

    await act(async () => { container.querySelector<HTMLButtonElement>('[data-testid="remove-trigger"]')!.click(); });

    await act(async () => { container.querySelector<HTMLButtonElement>('[data-testid="s-close"]')!.click(); });
    expect(document.activeElement).toBe(otherFocus);

    const ncContainer = await mount(
      <OverlayRoot>
        <PopoverRoot defaultOpen>
          <PopoverTrigger data-testid="nc-trigger">Not clicked</PopoverTrigger>
          <PopoverContent data-testid="nc-popover" title="NoCapture" />
        </PopoverRoot>
      </OverlayRoot>
    );
    const ncPopover = ncContainer.querySelector<HTMLDivElement>('[data-testid="nc-popover"]')!;
    await act(async () => { dispatchToggle(ncPopover, 'closed'); });
    expect(ncContainer.querySelector('[data-testid="nc-popover"]')).toBeNull();
  });

  it('runtime refuses consumer escapes on trigger, content, and close', async () => {
    const unsafeTrigger = {
      role: 'link',
      className: 'escape',
      style: { color: 'red' }
    } as unknown as PopoverTriggerProps;

    const unsafeContent = {
      role: 'alert',
      className: 'escape',
      style: { color: 'red' },
      'aria-modal': true,
      popover: 'manual',
      'aria-labelledby': 'override-id',
      'data-control': 'override',
      'data-open': 'false'
    } as unknown as PopoverContentProps;

    const unsafeClose = {
      role: 'link',
      className: 'escape',
      style: { color: 'red' }
    } as unknown as PopoverCloseProps;

    const container = await mount(
      <OverlayRoot>
        <PopoverRoot defaultOpen>
          <PopoverTrigger {...unsafeTrigger} data-testid="unsafe-trigger">Unsafe</PopoverTrigger>
          <PopoverContent
            {...unsafeContent}
            data-testid="unsafe-popover"
            title="Unsafe"
          >
            <PopoverClose {...unsafeClose} data-testid="unsafe-close" />
          </PopoverContent>
        </PopoverRoot>
      </OverlayRoot>
    );

    const t = container.querySelector<HTMLButtonElement>('[data-testid="unsafe-trigger"]')!;
    expect(t.getAttribute('class')).toBeNull();
    expect(t.getAttribute('role')).toBeNull();
    expect(t.getAttribute('style')).toBeNull();

    const c = container.querySelector<HTMLDivElement>('[data-testid="unsafe-popover"]')!;
    expect(c.getAttribute('class')).toBeNull();
    expect(c.getAttribute('role')).toBe('dialog');
    expect(c.getAttribute('style')).toBeNull();
    expect(c.getAttribute('aria-modal')).toBeNull();
    expect(c.getAttribute('popover')).toBe('auto');
    expect(c.getAttribute('data-control')).toBe('popover');
    expect(c.getAttribute('data-open')).toBe('');

    const cl = container.querySelector<HTMLButtonElement>('[data-testid="unsafe-close"]')!;
    expect(cl.getAttribute('class')).toBeNull();
    expect(cl.getAttribute('role')).toBeNull();
    expect(cl.getAttribute('style')).toBeNull();
  });

  it('native auto-popover toggle fires and requests close for light dismiss', async () => {
    const onOpenChange = vi.fn();
    const container = await mount(<Harness onOpenChange={onOpenChange} />);
    const trigger = container.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!;

    await act(async () => { trigger.click(); });
    const popover = container.querySelector<HTMLDivElement>('[data-testid="popover"]')!;
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await act(async () => { dispatchToggle(popover, 'closed'); });

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });
});
