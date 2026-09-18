# Base UI production integration

## Purpose

This document defines how Foundry uses `@base-ui/react` 1.8.0 without exposing Base UI to an application. It is the production integration authority for the controls named below. The public API and behavior remain governed by [Core v1 control contracts](control-contracts.md).

Base UI supplies tested interaction mechanics. Foundry supplies the public components, state rules, validation, localization, visual system, recovery behavior, package, and evidence. An application imports only `@foundry/react`.

## Dependency boundary

The initial production dependency is exactly `@base-ui/react` 1.8.0. The reviewed npm artifact has MIT license, registry integrity `sha512-P0/1sxo6SBVZOklKMIedvTWqw2s2IQzi9x5bIVsXu980cuSOD4NeuRSs+/L7LZQfDkZP/uRZyGPyfFl/B1oH+Q==`, and source tag `v1.8.0` at `5af893738de5c4513f8a315ffc54b979c165d1b5`.

- `@base-ui/react` is an exact direct runtime dependency of `@foundry/react`, not a peer dependency.
- React and React DOM remain Foundry peer dependencies. Base UI types never appear in Foundry declarations.
- Production code imports only the public subpaths named here: `dialog`, `direction-provider`, `menu`, `popover`, `tabs`, and `toast`.
- Root-package imports, Base UI internal paths, direct Floating UI imports, vendored source, runtime monkey-patches, and dependency patching are prohibited.
- Base UI supplies no CSS. Foundry state hooks and skin recipes are the only consumer-visible styling contract.
- An upgrade is a reviewed shared-foundation change. It must update the exact version and lockfile, inspect the release notes and affected declarations, and rerun every shared-foundation gate.

The Base UI imports live behind private Foundry adapters. Public family modules may consume those adapters but must not re-export them. Gallery code, examples, and application tests never import Base UI.

## Responsibility boundary

| Concern | Foundry owns | Base UI owns |
| --- | --- | --- |
| Public API | Export names, props, callback shapes, refs, errors, and declarations | Nothing public |
| State | Controlled and uncontrolled rules, request count, decline, stale requests, reset, dynamic recovery, and disabled refusal | Internal interaction state after a Foundry-approved request |
| Semantics | Required topology, visible names, headings, system labels, stable Foundry IDs and relationships | Primitive roles, focus guards, collection registration, and generated internal IDs used only within a Base-backed adapter |
| Overlays | Modal or non-modal policy, portal destination, restoration order, dismissal policy, and layer result | Focus containment, inertness, scroll lock, outside-interaction detection, nested Escape handling, and presence |
| Floating controls | Public placement fields, defaults, anchor-loss result, and Foundry sizing hooks | Measurement, flip, shift, collision data, and scroll, resize, and layout tracking |
| Collections | Allowed parts, values, disabled policy, selection requests, dynamic fallback, and public events | Roving focus, item registration, arrow movement, typeahead mechanics, and ARIA wiring |
| Toast | Public manager, queue limits, deduplication, timers, announcements, and multi-viewport cycling | Toast part semantics, focus guards, keyboard entry, close mechanics, and transition state |
| Visual system | Every class, token, part hook, state hook, size, layer, motion value, and rendered appearance | Internal state only; its classes and data attributes are not used by consumers |

## Shared adapter rules

### State requests

Every Base-backed root receives an explicit Foundry effective state, even when the public Foundry root is uncontrolled. The adapter owns the public uncontrolled value and passes that value to Base UI as controlled state.

For each Base UI change request the adapter:

1. reads the Base UI reason and native event;
2. refuses an unsupported, duplicate, disabled, or stale request without a public callback;
3. records the trigger and focus policy needed if the request is accepted;
4. updates Foundry's uncontrolled state or calls the controlled callback exactly once; and
5. cancels Base UI's immediate commit so the next Foundry effective state is the single authority.

An accepted request reaches Base UI through the next effective-state render. A declined controlled request leaves Base UI and the DOM at the prior state. A parent prop update is synchronization, not a request, and emits no callback.

Consumer click handlers run before Foundry behavior. When `preventDefault()` cancels a Foundry action, the adapter calls Base UI's documented `preventBaseUIHandler()` method so the dependency cannot perform the canceled action.

Base UI change reasons and event-detail objects stay private. An unknown reason is an internal contract error, not a new public behavior.

### Elements, refs, and state hooks

Each public ref is merged with the applicable Base UI part and resolves to the element named in the public contract. No handle, store, action object, or dependency instance is returned.

Base UI parts use their default semantic element unless the mapping below names a Foundry renderer. Private renderers must forward the Base UI props and ref. They may remove or translate dependency state attributes, but they may not change the public element or role.

Only Foundry attributes are stable: `data-control`, `data-part`, `data-size`, and the approved presence-only state hooks. Base UI attributes and CSS variables may be consumed inside a private adapter or skin recipe, but they are not declaration, test, or consumer contracts.

### Topology

Foundry validates its required compound topology during render before a Base UI portal or document listener is created. Private registration then maintains dynamic part identity and recovery. Base UI's more permissive compositions do not widen Foundry's public topology.

Generated IDs are stable across the server and client. A Base UI-generated ID is private; a relationship exposed on a public Foundry element uses a Foundry-owned stable ID.

## Provider, direction, and portals

`FoundryProvider` remains DOM-free. Internally it composes the Foundry configuration contexts, Base UI `DirectionProvider`, the default Toast boundary, and one private portal boundary.

Direction is resolved from the nearest mounted `dir` attribute, then the nearest provider value, then the document, with `ltr` as the final fallback. Each Base-backed family receives a private `DirectionProvider` with that resolved value. Changes to the relevant `dir` attribute or provider value update the family without remounting it.

The portal boundary resolves `portalContainer` only after mount. It accepts a same-document connected element; a function is called after mount and again when its returned target becomes invalid. Null or disconnected results fall back to that document's body. A cross-document result reports a Foundry contract error and also falls back to the control's document body.

Dialog, Drawer, Popover, Menu, and Toast pass the resolved element to their Base UI `Portal`. A target change preserves Foundry state and IDs and emits no state callback. Modal focus uses the documented fallback when the old focused node disconnects; non-modal controls do not move the document's new focus.

Portals and Toast viewports are absent from server output and the first hydration render. Private trigger renderers omit `aria-controls` until their controlled content exists. After the boundary becomes ready, an initially open control mounts once, attaches its relationships, and runs its focus rule without emitting an open request.

Nested `FoundryProvider` instances have independent portal, direction-fallback, layer, ID, and Toast boundaries.

## Exact primitive mappings

| Foundry area | Base UI public parts | Foundry adaptation |
| --- | --- | --- |
| `FoundryProvider` | `DirectionProvider`; Toast boundary below | Resolves direction, portals, labels, skin, and nested ownership. |
| `Field`, `Group`, and native controls | None | Native labels, descriptions, errors, `fieldset`, `legend`, `button`, `input`, and `select` behavior remains Foundry-owned. |
| Dialog | `Dialog.Root`, `Trigger`, `Portal`, `Backdrop`, `Viewport`, `Popup`, `Title`, `Description`, `Close` | Enforces modal policy, visible heading, system close, focus targets, and Foundry hooks. |
| Drawer | The same Dialog parts | Adds logical side placement and motion; Base UI Drawer gestures and snap points are not used. |
| Popover | `Popover.Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, `Title`, `Description`, `Close` | Forces non-modal focus policy and exact placement and anchor-loss behavior. |
| Menu | `Menu.Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, `Group`, `GroupLabel`, `Item`, `Separator` | Forces non-modal behavior, Foundry selection events, exact composition, and placement defaults. |
| Tabs | `Tabs.Root`, `List`, `Tab`, `Panel` | Keeps the public root DOM-free, owns value recovery, and uses Base UI collection focus and relationships. |
| Toast | `Toast.Provider`, `Portal`, `Viewport`, `Root`, `Content`, `Title`, `Description`, `Action`, `Close`, `useToastManager` | Adds Foundry queueing, timers, deduplication, announcements, action rules, and multi-viewport F6 routing. |

## Native fields and actions

Field, Group, Button, TextField, NativeSelect, Checkbox, Switch, RadioGroup, and SearchField do not use Base UI. Their native elements, relationships, values, form behavior, autofill, and reset behavior remain Foundry-owned. Shared-provider and portal changes must still run their existing regression evidence because provider nesting, direction, and public export changes can affect them.

## Dialog and Drawer

The internal structure is Root → Portal → Backdrop + Viewport → Popup → Title, optional Description, consumer content, consumer close parts, and one system close. Drawer uses the same structure and adds its Foundry side hook.

- Root is controlled by the shared state bridge with `modal={true}` and `disablePointerDismissal={true}`.
- Trigger and close parts render native buttons. A prevented close click calls `preventBaseUIHandler()` and produces no close request.
- Popup renders the public `div[role="dialog"][aria-modal="true"]` and public `HTMLDivElement` ref.
- Popup `initialFocus` resolves the public target only when it is connected, enabled, non-inert, and inside the popup. Otherwise it returns the popup itself, which receives `tabIndex=-1`.
- Popup `finalFocus` uses the Foundry order: explicit target, opening trigger, pre-open focus, lower modal content, then no forced focus.
- Base UI performs containment, inertness, scroll lock, nested Escape ordering, and removal-time restoration. Foundry filters reasons so only trigger, Escape, and close requests reach the public callback. Outside and focus-out requests are canceled without a callback.
- The system close uses the localized Foundry label. It is present even when the consumer renders no close part.
- Drawer maps logical start/end to the resolved direction in Foundry's skin. It does not import Base UI Drawer.

## Popover

The internal structure is Root → Trigger + Portal → Positioner → Popup → Title, optional Description, content, and close parts.

- Root is controlled by the shared state bridge with `modal={false}`. Hover and focus opening are disabled.
- Popup sets `initialFocus={false}` so opening leaves focus on the trigger.
- Trigger, Escape, close, outside press, and focus-out are the only accepted Base UI reasons. The adapter records whether final focus may be restored before forwarding a close request.
- Escape and an explicit close restore a valid trigger only when focus was inside. Outside press and Tab/focus-out never restore. A declined close never moves focus.
- Positioner receives the public side, align, offsets, and collision padding. It fixes `positionMethod="absolute"`, the clipping-ancestor boundary, anchor tracking enabled, non-sticky behavior, and collision avoidance `{ side: "flip", align: "shift", fallbackAxisSide: "none" }`.
- Available width and height from Base UI are consumed only by a private Foundry size cap. The popup cannot exceed its clipping boundary or viewport margin.
- A private positioner renderer observes Base UI anchor state and the trigger's connection. One disconnected-anchor episode requests close once. If a controlled parent declines, the positioner is hidden and inert until the trigger reconnects; reconnection restores positioning without another callback.

## Menu

The internal structure is Root → Trigger + Portal → Positioner → Popup containing Item, Group → optional GroupLabel + Items, and Separator.

- Root is controlled by the shared state bridge with `modal={false}`, vertical orientation, looping focus, hover opening disabled, and the public disabled state.
- Trigger keyboard entry and Base UI collection navigation supply first/last entry, arrows, Home/End, disabled-item focus, and the 500 ms typeahead buffer.
- Typeahead uses Base UI's case-insensitive Unicode prefix matching over `label`, populated from Foundry `textValue` or plain text. It is intentionally not locale-specific in Core v1.
- Disabled items remain focusable within menu navigation but never select. When every item is disabled, the first item receives focus and every activation is refused.
- Item maps `textValue` to Base UI `label`. Base UI `itemPress` details identify the selected registered Foundry item and its native `MouseEvent`, `PointerEvent`, or `KeyboardEvent`.
- The adapter calls that item's `onSelect` before the root close callback. Preventing the Foundry selection event cancels Base UI's change details, so the menu stays open and focused. Otherwise the root receives one close request.
- Escape restores focus only after an accepted close. Outside press and Tab/focus-out preserve destination focus. Controlled decline preserves the Base UI focus result and does not force focus back.
- Placement uses the same fixed positioner policy as Popover.

## Tabs

The adapter always supplies Base UI `Tabs.Root` with Foundry's effective value. A private documented `render` callback returns the compound children without a root host, preserving the public DOM-free root.

- `Tabs.List` maps `activation="automatic"` to `activateOnFocus={true}` and manual to `false`; looping remains enabled.
- `Tabs.Tab` uses the string public value and Base UI's focus and relationship registration. Disabled tabs remain arrow-focusable and refuse pointer, Enter, Space, and selection requests.
- Arrow navigation follows Base UI direction and orientation. Home, End, and arrows wrap across all triggers, including disabled triggers. Automatic mode requests selection only for an enabled focused trigger; manual mode waits for Enter or Space.
- Foundry's private composition registry validates one list, unique non-empty values, and one panel per trigger. It owns uncontrolled initial selection and the same-index/later/earlier dynamic fallback. Base UI therefore never chooses an automatic fallback.
- A controlled missing or disabled value remains authoritative, displays no panel, and emits no fabricated change. The roving focus position remains independent of the declined or invalid selection.
- With no enabled trigger, selection is `null`, no panel renders, and the first disabled trigger remains the collection's focusable discovery point.
- `Tabs.Panel` uses `keepMounted={false}`. A private panel renderer supplies `tabIndex=0` only when its mounted content has no focusable descendant; otherwise it removes the panel from the Tab sequence.

## Toast

Foundry uses Base UI Toast parts but not Base UI's timeout, urgency, visible-limit, or global-F6 policy as its public manager.

The private Foundry queue owns all records and opaque IDs. Only visible records are mirrored into the nearest Base UI manager, always with Base UI timeout `0`, low priority, and swipe disabled. Waiting records have no Base UI record, timer, DOM, or announcement. Promotion creates the Base UI record with the existing Foundry ID.

- Foundry enforces visible and waiting limits before mutation, FIFO promotion, terminal-ID refusal, deduplication in place, update rules, and first-terminal-action wins.
- Foundry timers use remaining time and pause independently while the corresponding toast has hover or focus and while its document is hidden. Promotion starts a fresh full duration. Reduced motion changes transition time only.
- Base UI `Root`, `Title`, `Description`, `Action`, and `Close` provide the focusable toast structure. `swipeDirection={[]}` disables uncontracted swipe dismissal.
- The Base UI viewport's live attributes are disabled privately. One Foundry-owned polite atomic announcer inside the viewport receives only a newly visible title and description; updates and dismissals do not rewrite the announcement.
- Action invokes the Foundry callback first. Prevention leaves the toast open. A thrown callback also leaves it open and propagates. An unprevented action begins the same terminal close path as dismiss or timeout.
- Escape is left to Base UI and dismisses only the focused toast. The close button uses the localized Foundry dismiss label.
- One document-level capture listener owned by Foundry intercepts `F6` and `Shift+F6` before Base UI's per-viewport listener. It cycles registered mounted Foundry viewports in document order and records the valid return target. Leaving the viewport restores that target once.
- Provider unmount clears its queue and timers without public callbacks, unregisters its viewport, invalidates its IDs, and restores focus only when focus was inside that queue.

## Production sequence

The integration is delivered in this dependency order after the remaining token, skin, package, and command contracts are approved:

1. Add the exact dependency, private adapter boundary, state bridge, direction resolver, provider, and portal lifecycle.
2. Rebase Dialog and Drawer on the shared modal adapter.
3. Add the shared positioner policy, then rebase Popover and Menu.
4. Rebase Tabs with the private composition and recovery registry.
5. Replace the static Toast with the Foundry queue over Base UI Toast parts.
6. Build the packed package, move the gallery to packed public imports, and run the complete cross-family release evidence.

Each step is independently mergeable and independently reviewed. A later step cannot bypass a failed shared dependency. Existing hand-built focus, dismissal, collection, or positioning mechanisms are removed when their replacement is accepted; they do not run beside Base UI.

## Required evidence

The package and executable-gate contract will bind these outcomes to canonical commands. Until those commands exist and run, operational results are `UNTESTED`.

| Gate | Required evidence and pass boundary |
| --- | --- |
| Dependency and source boundary | Lockfile resolves the exact artifact and integrity above; no Base UI root/internal imports, direct Floating UI imports, patches, or second interaction foundation; MIT notice is retained. |
| Public package boundary | Built declarations contain no `@base-ui` import or Base UI type; packed consumers import only Foundry; importing JavaScript has no CSS side effect. |
| React support | The packed package passes the same component and hydration fixtures with React/React DOM 18.3.1 and 19.3.0 in Strict Mode, with no console or hydration warnings. |
| Provider and portal lifecycle | Closed and initially open server renders, first hydration render, delayed body attachment, custom/missing/replaced/cross-document targets, live direction changes, nested providers, and cleanup all match the public contract. |
| State bridge | Controlled and uncontrolled entry, accepted and declined requests, parent synchronization, duplicate and stale requests, keyed remount, disabled refusal, and callback counts pass for every Base-backed root. |
| Native-control regression | Text, search, select, checkbox, switch, and radio prove labels, descriptions, errors, required/disabled state, autofill observation, native form reset, and unchanged value callback counts after provider and package changes. |
| Dialog and Drawer | Chromium, Firefox, and WebKit prove focus fallback, Tab containment, explicit and Escape close, outside refusal, controlled decline, nested Escape, trigger removal, restoration order, inertness, scroll lock, side/direction, and listener cleanup. |
| Popover | All three browsers prove no open-time focus move, Tab/outside/Escape/explicit close policies, controlled decline, collision flip/shift, scroll and resize tracking, clipping caps, target migration, anchor disconnect/reconnect, and cleanup. |
| Menu | All three browsers prove keyboard entry, arrows/Home/End, direction, wrapping, disabled and all-disabled behavior, text and non-text typeahead, 500 ms reset and repeated-character cycling, selection prevention, controlled decline, outside/Tab/Escape focus results, placement, and cleanup. |
| Tabs | Component and browser evidence proves automatic/manual activation, horizontal/vertical and left-to-right/right-to-left arrows, disabled discovery/refusal, controlled decline, initial and dynamic recovery, invalid values, removal while focused, nested roots, exact panel mounting, and panel Tab fallback. |
| Toast | Component and browser evidence proves FIFO limits, overflow refusal, waiting promotion, dedupe/update, terminal races, timer pause/resume and document visibility, silent updates, action prevention/errors, dismiss/Escape, F6/Shift+F6 across nested queues, unmount recovery, reduced motion, and timer/listener cleanup. |
| Accessibility and layout | Real accessibility-tree checks cover names, roles, relationships, live output, and hidden/inert state; packed gallery checks cover 320 px, 400% zoom, forced colors, reduced motion, long content, and smallest/largest supported widths. |
| Resource cleanup | Repeated mount/open/close/unmount leaves no Foundry-created portal, focus guard, scroll lock, inert marker, observer, document listener, queue record, or timer. Shared browser checks fail on console errors or leaked resources. |

The browser matrix uses the repository-pinned Playwright release and its matching Chromium, Firefox, and WebKit installations. Evidence records the exact Node, npm, TypeScript, React, React DOM, Base UI, Playwright, and browser revisions used.

## Failure and escalation

A family stops before merge when the public contract requires a private Base UI import, a dependency patch, a second interaction foundation, duplicated focus/dismissal/positioning machinery, a leaked Base UI type, or a skipped required browser or hydration path.

A defect in Foundry's adapter is corrected within the normal bounded Maestro review process. A demonstrated Base UI limitation is recorded with the smallest failing real fixture and returned to architecture. An upstream contribution may be proposed. Forking, vendoring, patching, weakening the Foundry contract, or switching foundations requires a new explicit architecture decision.

Unexecuted evidence remains `UNTESTED`; package inspection and documentation review do not prove runtime behavior.

## Primary evidence

This contract was prepared from the exact 1.8.0 npm artifact and the official Base UI documentation for [Dialog](https://base-ui.com/react/components/dialog), [Popover](https://base-ui.com/react/components/popover), [Menu](https://base-ui.com/react/components/menu), [Tabs](https://base-ui.com/react/components/tabs), [Toast](https://base-ui.com/react/components/toast), and [customization](https://base-ui.com/react/handbook/customization). Foundry's approved public contract remains controlling where Base UI offers additional behavior.
