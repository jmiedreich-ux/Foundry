# Core v1 control contracts

This is the canonical public-boundary and migration matrix for Core v1. It defines what a consumer can rely on; internal Base UI parts, attributes, events, and refs are not public Foundry API.

## Shared contract

- Controlled and uncontrolled props are mutually exclusive in TypeScript and at runtime. A controlled value requires its change callback. `TextField` and `SearchField` may instead declare `readOnly`; no other control has a controlled-without-callback exception.
- Controlled props are authoritative on every render. A user request invokes one callback once; a parent may decline it without DOM state drift or focus rollback. Prop changes, initial render, and recovery do not emit change callbacks.
- An uncontrolled default is read only at mount. A keyed remount reads it again. Native form reset restores the mounted default without a callback; controlled controls ignore form reset until their parent changes the value.
- Disabled controls refuse pointer, keyboard, and imperative user requests without callbacks. Read-only text remains focusable and selectable but refuses edits and clear actions.
- Public refs target the semantic root named below. Internal foundation refs are merged and never replace the consumer ref. No public ref exposes a Base UI instance.
- Foundry owns the rendered element, required role and ARIA relationships, reserved `data-control`, `data-part`, `data-size`, and state hooks, and any handler that maintains the control contract. Safe native attributes and events listed below are forwarded. A consumer event runs before the Foundry default where cancellation is meaningful; `preventDefault()` cancels that default.
- `className`, `style`, `dangerouslySetInnerHTML`, element polymorphism, role replacement, owned ARIA, and reserved Foundry data hooks are refused in types and at runtime. Other `data-*`, `aria-describedby`, test IDs, and safe identity/form attributes are accepted where the matrix permits them.
- State hooks are presence attributes: `data-disabled`, `data-readonly`, `data-invalid`, `data-loading`, `data-checked`, `data-selected`, and `data-open`. Base UI attributes may exist internally but are not skin or test contracts.
- Surface titles are trimmed non-empty strings. `headingLevel` is `2 | 3 | 4 | 5 | 6 | "none"`, defaults to `2`, and changes markup without changing the accessible-name relationship.
- Direction comes from the nearest `dir` attribute, then the provider. Locale and direction updates apply without remount and propagate through portals.
- Components render on the server with stable IDs and no browser-global access during render. Hydration preserves state, relationships, focus ownership, and portal identity.

## Public foundation exports

| Export | Core v1 decision |
| --- | --- |
| `FoundryProvider` | New public, DOM-free provider for `skin`, `locale`, partial system `labels`, direction fallback, portal destination, and the Toast viewport. Components and portaled parts receive the selected skin hook directly. |
| `LocaleProvider` | Public for a nested locale/label boundary. It merges partial labels over its parent, then English. Missing, empty, or whitespace system labels refuse at runtime. |
| `Group` / `GroupProps` | Retain as a semantic `fieldset` with a visible `legend`; use only for related native fields, not as a generic layout wrapper. Ref targets the fieldset. |
| `Field` / `FieldProps` | Retain for exactly one labelable field. It owns label, description, error, required marker, and ID relationships. `error` implies invalid but is descriptive, not automatically live. |
| `ControlSize`, `controlSizes` | Retain small (`sm`), medium (`md`), and large (`lg`); each value has the observable recipe defined by the skin contract. |
| `LabelCatalog`, `LabelCategory`, `labelCategories`, `englishLabelCatalog` | Retain after narrowing categories to system text: `clearSearch`, `closeDialog`, `closeDrawer`, `closePopover`, `dismiss`, and `loading`. Domain actions such as Save and Delete are consumer content. |
| `SkinProvider`, `OverlayRoot`, `GroupProvider` | Replace with `FoundryProvider`; remove from the Core v1 root export. |
| `ControlBaseProps`, `ControlInvalidState`, `ResolvedControlBase`, `ControlStateOptions`, `resolveControlBase`, `controlStateAttributes` | Internal implementation contracts; remove from the root export. Public controls expose their own exact props. |
| `FieldContextValue`, `useField`, `SkinContextValue`, `LocaleContextValue`, `GroupContextValue`, `useSkin`, `useLocale`, `useGroup`, `useFocusVisible` | Internal hooks and context shapes; remove from the root export. |
| `resolveLabel` | Internal system-label resolver; remove from the root export. |
| `ControlCatalog`, `controlCatalogs`, `ControlRegistryEntry`, `defineControl`, `ExampleState` | Gallery tooling, not runtime library API; move out of `@foundry/react`. |

`FoundryProvider` defaults to the default skin, English labels, inherited document direction, `document.body` as the post-hydration portal destination, and one bottom-end Toast viewport. A supplied portal destination is resolved after mount, must belong to the same document, and receives locale, direction, and skin context. Provider nesting creates an independent Toast queue and portal boundary.

The Core v1 root runtime exports are exactly `FoundryProvider`, `LocaleProvider`, `Group`, `Field`, `Button`, `TextField`, `NativeSelect`, `Checkbox`, `Switch`, `RadioGroup`, `SearchField`, `StatusChip`, `Banner`, `ToastProvider`, `useToast`, `EmptyState`, `LoadingSkeleton`, `DialogRoot`, `DialogTrigger`, `DialogContent`, `DialogClose`, `DrawerRoot`, `DrawerTrigger`, `DrawerContent`, `DrawerClose`, `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `PopoverClose`, `MenuRoot`, `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuGroup`, `MenuSeparator`, `TabsRoot`, `TabsList`, `TabsTrigger`, `TabsPanel`, and `Card`. Each component exports its named props type. Public supporting types are `ControlSize`, `HeadingLevel`, provider and label types, control option/state types, Toast manager/options/ID types, and the documented variant/tone unions. The matching readonly value arrays remain public for gallery and schema generation. No wildcard foundation export remains.

## Fields and actions

The safe native set for this table is `id`, `name`, relevant form attributes, `aria-label` or `aria-labelledby` when no `Field` owns the label, additive `aria-describedby`, non-reserved `data-*`, and native focus/input events that do not replace the state callback. A `Field` relationship wins over a conflicting accessible-name prop and reports the conflict rather than silently overwriting it.

| Export | Element and ref | Public state and callbacks | Content, forwarding, and refusal | Migration disposition |
| --- | --- | --- | --- | --- |
| `Button` | Native `button`; `HTMLButtonElement` | `disabled`, `loading`, `size`, `variant`; `loading` remains focusable with `aria-disabled` and `aria-busy` and refuses repeat activation | Ordinary `children`; icon-only use requires `aria-label`. Forwards native button/form props and `onClick`. Owns `type` default `button`, loading/disabled semantics, hooks, and variant. | Retain name; remove `category`/domain label catalog dependency and accept content. |
| `TextField` | Native `input`; `HTMLInputElement` | `value` + required native `onChange`, or `defaultValue`; controlled `readOnly` exception. `type` is text, email, password, tel, or url. | Uses the safe native set and browser autofill. Refuses non-text input types, owned field relationships, and styling escapes. | Retain and add the missing controlled-state union/runtime checks. |
| `NativeSelect` | Native single `select`; `HTMLSelectElement` | `value` + required native `onChange`, or `defaultValue`; `disabled`, `required`, `invalid`, `size` | Consumer supplies `option`/`optgroup` children. Forwards single-select form props. Refuses `multiple`, native row-count `size`, owned relationships, and styling escapes. | Rename current `Select`; reserve `Select` for the future styled listbox control. |
| `Checkbox` | Native checkbox input; `HTMLInputElement` | `checked` is boolean or `"mixed"` with required `onCheckedChange`, or uses `defaultChecked`; also supports `required`, `disabled`, `invalid`, and `size` | Label comes from `Field` or accessible-name props. Native `onChange` may observe after `onCheckedChange` but is not the state callback. Mixed maps to `indeterminate` and `aria-checked="mixed"`. | Retain; make size observable, add mixed state, and require the controlled callback. |
| `Switch` | Native checkbox input with `role="switch"`; `HTMLInputElement` | Boolean `checked` + required `onCheckedChange`, or `defaultChecked`; `required`, `disabled`, `invalid`, `size` | Same labeling and form rules as Checkbox; mixed is refused. | Retain; make size observable and require the controlled callback. |
| `RadioGroup` | `fieldset` with native radio inputs; ref targets `HTMLFieldSetElement` | Controlled `value` is a string or null and requires `onValueChange`; uncontrolled `defaultValue` is optional. Required may begin empty; form reset restores the default. | Requires non-empty `name`, visible `label`, unique non-empty option values, and at least one option. Options accept label, optional description, and disabled. Arrow/Home/End follow APG and direction. | Retain data-driven API; stop auto-selecting the first required option and add complete empty/reset recovery. |
| `SearchField` | Fragment with native search input and conditional clear button; ref targets `HTMLInputElement` | `value` + required `onValueChange`, or `defaultValue`; controlled `readOnly` exception; `onClear` is optional observation | Uses the safe input set. Clear is system-labeled, requests `""` once, calls `onClear` after the value request, and preserves input focus whether accepted or declined. | Rename current `Search`; remove hard-coded clear text and formalize callback order. |

`Button` variants remain Primary, Secondary, Destructive, and Link. Link is visual treatment for an action; it never accepts `href`. Navigation uses the future `Link` control.

## Feedback and content surfaces

| Export | Element and ref | Public contract | Migration disposition |
| --- | --- | --- | --- |
| `StatusChip` | Non-interactive `span`; `HTMLSpanElement` | Non-empty `label`, tone, size. No live-region role by default. Forwards identity and descriptive attributes but refuses interaction, focusability, and semantic replacement. | Retain; remove the unconditional `status` live role. |
| `Banner` | Labelled `section`; `HTMLElement` | Non-empty title, description, tone, action, heading level, size, optional announcement (`none`, `polite`, or `assertive`), and explicit `dismissible`. Dismissible form uses controlled/uncontrolled `open`; controlled open requires `onOpenChange`. The system dismiss action is present only when dismissible. | Retain; add heading/announcement contracts and require controlled callbacks. |
| `ToastProvider` / `useToast` | Provider is DOM-free; viewport is portaled and keyboard reachable | Replaces direct Toast state. `show` accepts title, description, tone, action, duration, and dedupe key; returns an ID. Manager supports update and dismiss. Timers pause for hover, focus, page inactivity, and reduced-motion transitions; limit defaults to three. | Replace the static `Toast` export with a queued Base UI adapter. Existing single-toast examples become manager calls. |
| `EmptyState` | Labelled `section`; `HTMLElement` | Non-empty title and description, optional action, heading level, size. It is static and never a live region. | Retain; add heading composition and string-title refusal. |
| `LoadingSkeleton` | Labelled `div` with status/busy semantics; `HTMLDivElement` | Non-empty loading label, integer lines 1–6, size. Bars are hidden from assistive technology and animation stops under reduced motion. | Retain; replace literal styling with the skin recipe. |
| `Card` | Inert `article`; `HTMLElement` | Non-empty title, optional description/content, heading level, size. Interactive descendants are allowed, but the article itself cannot become interactive, draggable, hidden, or a popup. | Retain; add heading composition and keep the strict inert-root boundary. |

Toast keyboard access follows the selected foundation: `F6` moves to the viewport, Escape dismisses only the focused toast, action and close controls remain in normal tab order, and focus returns to its prior valid target when the viewport is left. Assertive application errors use Banner or the future AlertDialog, not an assertive Toast queue.

## Overlay and navigation controls

All compound parts require their matching root and refuse use in a different family. A root rejects duplicate required parts and invalid controlled/uncontrolled combinations before attaching document listeners. Portaled content remains inside the provider's locale, direction, skin, and layer boundary.

| Export | Element and ref | Public contract | Migration disposition |
| --- | --- | --- | --- |
| `DialogRoot` | No DOM/ref | `open` + required `onOpenChange`, or `defaultOpen`; default closed. Requests include trigger, Escape, and explicit close internally but public callback remains `(open)`. | Rebase on Base UI Dialog. |
| `DialogTrigger` | Native button; `HTMLButtonElement` | Ordinary children and safe button props. Owns dialog relationships and refuses activation while disabled. | Retain public shape; replace internals. |
| `DialogContent` | Portaled dialog popup; `HTMLElement` | Non-empty title, optional description, heading level, `initialFocus` and `finalFocus` element resolver. Modal, traps focus, locks scroll, inerts outside interaction, refuses outside dismissal, closes on Escape, and always renders a locale-labelled close action. | Ref changes from native dialog to semantic HTMLElement; observable behavior is preserved and completed. |
| `DialogClose` | Native button; `HTMLButtonElement` | Optional children; absent children use `closeDialog`. Consumer click may cancel closing. | Retain and stop discarding children. |
| `DrawerRoot` / `DrawerTrigger` / `DrawerContent` / `DrawerClose` | Same roots, buttons, popup, and refs as Dialog | Dialog behavior plus logical side (`start` or `end`); side changes placement and motion. No gesture or snap-point API in Core v1. | Rebase on Base UI Dialog mechanics and Foundry Drawer recipe. |
| `PopoverRoot` | No DOM/ref | `open` + required callback, or `defaultOpen`; default closed; non-modal. | Rebase on Base UI Popover. |
| `PopoverTrigger` | Native button; `HTMLButtonElement` | Same trigger policy; Foundry owns all popup relationships including `type="button"`. | Retain and remove trigger-prop inconsistency. |
| `PopoverContent` | Portaled non-modal dialog popup; `HTMLElement` | Non-empty title, optional description, heading level, placement/align/offset bounded to Foundry choices. Anchored with flip/shift/size updates. Escape and outside press close; Tab follows document order and does not trap. | Retain public purpose; replace native-popover recovery and add positioning. |
| `PopoverClose` | Native button; `HTMLButtonElement` | Optional children; absent children use `closePopover`. Consumer click may cancel closing. | Retain and stop discarding children. |
| `MenuRoot` | No DOM/ref | Controlled/uncontrolled open contract; default closed. | Rebase on Base UI Menu. |
| `MenuTrigger` | Native button; `HTMLButtonElement` | Safe button props; ArrowDown/ArrowUp opens at first/last enabled item. | Retain. |
| `MenuContent` | Portaled `menu`; `HTMLElement` | Placement choices, labelled from trigger, roving focus, wrap, Home/End, printable-character typeahead, logical direction, nested-layer Escape, outside and Tab dismissal. Empty menus refuse. | Retain purpose and replace internals. |
| `MenuItem` | `menuitem`; `HTMLElement` | Non-empty content, disabled state, and `onSelect(event)`. Disabled items may receive roving focus but never activate. Preventing the select event keeps the menu open; otherwise selection closes once and restores focus. | Retain name; do not promise a button ref. |
| `MenuGroup`, `MenuSeparator` | APG group and separator semantic elements | Group has an optional visible label; separator orientation matches the menu. Neither is focusable. | New Core v1 parts needed for the already-approved menu content model. |
| `MenuClose` | Removed | An arbitrary close button is not a valid menu child. Use a MenuItem command when a visible dismiss choice is required. | Remove before Core v1. |
| `TabsRoot` | No DOM/ref | `value` + required `onValueChange`, or required `defaultValue`; orientation, automatic/manual activation, and inherited direction. Selection and roving focus are distinct. | Rebase on Base UI Tabs. |
| `TabsList` | `tablist`; `HTMLElement` | Requires a non-empty accessible label and exactly one list per root. Owns orientation. | Retain. |
| `TabsTrigger` | `tab`; `HTMLElement` | Unique non-empty value, ordinary content, disabled state. Arrows/Home/End move focus immediately; automatic mode requests selection without rolling focus back when a parent declines. | Retain purpose; do not promise a native button ref. |
| `TabsPanel` | `tabpanel`; `HTMLElement` | Value must match one trigger. Selected panel is rendered and gains `tabIndex=0` only when it contains no focusable child; inactive-panel mounting is a later explicit option, not implicit Core behavior. | Retain and add focus fallback, nested-root isolation, removal recovery, orientation, and direction. |

When an uncontrolled selected tab is removed, Tabs selects and focuses the nearest enabled sibling, then the preceding sibling, then the first enabled tab, and emits one change callback. A controlled root keeps the parent value authoritative, moves focus to the same fallback without emitting a fabricated selection, and renders no mismatched panel until the parent supplies a valid value. Removing the focused trigger never restores focus to an earlier stale keyboard request.

## Migration order

1. Introduce the provider and internalize accidental foundation exports without changing control behavior.
2. Correct native field/action contracts and names, including Button content, `NativeSelect`, `SearchField`, controlled callbacks, RadioGroup empty-required behavior, and system labels.
3. Replace Toast with its provider/manager boundary and correct feedback heading/live-region semantics.
4. Rebase Dialog, Drawer, Popover, Menu, and Tabs behind the unchanged Foundry family names; remove `MenuClose` and add the approved structural menu parts.
5. Rebuild the gallery against packed public exports and keep temporary compatibility aliases only within a single migration milestone. No deprecated alias ships in Core v1.

Each migration packet must cite its row, list every current consumer found by search, prove controlled and uncontrolled entry/change/recovery, and add runtime refusal plus public-type assertions before the old contract is removed.
