# Core v1 control contracts

This is the canonical public and migration boundary for Core v1. It defines observable Foundry behavior. `@base-ui/react` 1.8.0 is the selected internal interaction foundation. No dependency part, prop, event, ref, or data attribute is public Foundry API.

## Shared invariants

- Controlled and uncontrolled props are mutually exclusive in TypeScript and at runtime. A controlled value requires its change callback. `TextField` and `SearchField` may instead declare `readOnly`; no other controlled control has that exception.
- Controlled props remain authoritative. One user request invokes one state callback once. A parent may decline without DOM-state drift or focus rollback. Initial render, prop synchronization, form reset, and recovery do not emit state callbacks unless a control-specific recovery rule below explicitly says otherwise.
- An uncontrolled default is read once at mount and again only after a keyed remount. Native form reset restores the mounted default without a callback. Controlled controls ignore form reset until their parent supplies a new value.
- Disabled controls refuse pointer, keyboard, and imperative requests without callbacks. Read-only text remains focusable and selectable but refuses edits and clear actions.
- Public refs target the element named below. Internal refs are merged; no public ref exposes a foundation instance.
- Foundry owns element type, roles, required relationships, state semantics, reserved `data-control`, `data-part`, `data-size`, and presence-only state hooks. The public hooks are `data-disabled`, `data-readonly`, `data-invalid`, `data-loading`, `data-checked`, `data-selected`, and `data-open` where applicable. Foundation attributes are not skin or test contracts.
- `className`, `style`, `dangerouslySetInnerHTML`, element polymorphism, role replacement, owned ARIA, and reserved Foundry hooks are absent from public types and rejected at runtime when they arrive through an untyped boundary. Props are never accepted and silently ignored.
- Surface titles are trimmed non-empty strings. `HeadingLevel` is `2 | 3 | 4 | 5 | 6 | "none"`, defaults to `2`, and changes markup without changing the accessible-name relationship.
- Direction comes from the nearest `dir` attribute, then the nearest provider fallback. Locale, labels, direction, and skin updates apply without remount and remain available through portals.
- System-label, composition, and state errors name the component, invalid prop or part, received state, and permitted recovery. Production may use a compact message with a stable error code; development includes the full explanation.

## Exact Core v1 exports

The root has explicit named exports and no wildcard foundation export.

### Runtime values

| Category | Exact exports |
| --- | --- |
| Foundation | `FoundryProvider`, `LocaleProvider`, `Group`, `Field`, `controlSizes`, `labelCategories`, `englishLabelCatalog` |
| Fields and actions | `Button`, `buttonVariants`, `TextField`, `NativeSelect`, `Checkbox`, `Switch`, `RadioGroup`, `SearchField` |
| Feedback and surfaces | `StatusChip`, `statusChipTones`, `Banner`, `bannerTones`, `ToastProvider`, `useToast`, `toastTones`, `EmptyState`, `LoadingSkeleton`, `Card` |
| Overlays | `DialogRoot`, `DialogTrigger`, `DialogContent`, `DialogClose`, `DrawerRoot`, `DrawerTrigger`, `DrawerContent`, `DrawerClose`, `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `PopoverClose`, `MenuRoot`, `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuGroup`, `MenuSeparator` |
| Navigation | `TabsRoot`, `TabsList`, `TabsTrigger`, `TabsPanel` |

The readonly arrays are exact schema values: `controlSizes = ["sm", "md", "lg"]`; `buttonVariants = ["primary", "secondary", "destructive", "link"]`; each tone array is `["neutral", "success", "warning", "danger"]`; and `labelCategories = ["clearSearch", "closeDialog", "closeDrawer", "closePopover", "dismiss", "loading"]`.

### Public types

The exact type exports are:

- foundation: `FoundryProviderProps`, `LocaleProviderProps`, `GroupProps`, `FieldProps`, `ControlSize`, `HeadingLevel`, `SkinName`, `Direction`, `PortalContainer`, `LabelCategory`, and `LabelCatalog`;
- fields and actions: `ButtonProps`, `ButtonVariant`, `TextFieldProps`, `NativeSelectProps`, `CheckboxProps`, `CheckboxState`, `SwitchProps`, `RadioGroupProps`, `RadioOption`, and `SearchFieldProps`;
- feedback and surfaces: `StatusChipProps`, `StatusChipTone`, `BannerProps`, `BannerTone`, `Announcement`, `ToastProviderProps`, `ToastProviderConfig`, `ToastOptions`, `ToastUpdate`, `ToastAction`, `ToastActionEvent`, `ToastId`, `ToastManager`, `ToastTone`, `EmptyStateProps`, `LoadingSkeletonProps`, and `CardProps`;
- overlays: `DialogRootProps`, `DialogTriggerProps`, `DialogContentProps`, `DialogCloseProps`, `DrawerRootProps`, `DrawerTriggerProps`, `DrawerContentProps`, `DrawerCloseProps`, `PopoverRootProps`, `PopoverTriggerProps`, `PopoverContentProps`, `PopoverCloseProps`, `MenuRootProps`, `MenuTriggerProps`, `MenuContentProps`, `MenuItemProps`, `MenuGroupProps`, `MenuSeparatorProps`, `FocusTarget`, `PlacementSide`, `PlacementAlign`, and `MenuSelectEvent`; and
- navigation: `TabsRootProps`, `TabsListProps`, `TabsTriggerProps`, `TabsPanelProps`, `TabsOrientation`, and `TabsActivationMode`.

`SkinName` is a non-empty string, `Direction` is `"ltr" | "rtl"`, and `LabelCatalog` is `Record<LabelCategory, string>`; partial label inputs are `Partial<LabelCatalog>`. Component prop types consist only of the fields stated in this document plus their named forwarding profile.

The exact current-name dispositions are:

- runtime `Select`, `Search`, and `Toast` become `NativeSelect`, `SearchField`, and the Toast manager; `MenuClose` is removed;
- `SelectProps`, `SearchProps`, `ToastProps`, and `MenuCloseProps` are replaced by the corresponding new types; object-valued `LabelDefinition` is removed;
- `SkinProvider`, `OverlayRoot`, `GroupProvider`, `ControlBaseProps`, `ControlInvalidState`, `ResolvedControlBase`, `ControlStateOptions`, `resolveControlBase`, `controlStateAttributes`, `FieldContextValue`, `useField`, `SkinContextValue`, `LocaleContextValue`, `GroupContextValue`, `useSkin`, `useLocale`, `useGroup`, `useFocusVisible`, and `resolveLabel` become internal implementation details; and
- `ControlCatalog`, `controlCatalogs`, `ControlRegistryEntry`, `defineControl`, and `ExampleState` move to gallery tooling and leave `@foundry/react`.

Every controlled/uncontrolled root uses this exact public union: controlled `{ open: boolean; onOpenChange(next: boolean): void; defaultOpen?: never }`, or uncontrolled `{ defaultOpen?: boolean; onOpenChange?(next: boolean): void; open?: never }`. Value controls use the equivalent union with the value and callback names documented for that control. Callbacks return `void`; dependency reason/event objects are never forwarded.

## Provider, portals, server rendering, and hydration

`FoundryProviderProps` contains `children`, `skin?: SkinName`, `locale?: string`, `labels?: Partial<LabelCatalog>`, `dir?: Direction`, `portalContainer?: PortalContainer`, and `toast?: ToastProviderConfig`. `PortalContainer` is `Element | (() => Element | null)`. The provider renders no wrapper and has no ref. Defaults are the default skin, locale `en`, English system labels, inherited document direction with `ltr` fallback, `document.body` after hydration, and one bottom-end Toast viewport.

`LocaleProviderProps` contains `children`, `locale?: string`, and `labels?: Partial<LabelCatalog>`. It merges labels over its nearest provider, then English. Locale identifiers and every resolved system label must be non-empty. `FoundryProvider` creates a portal boundary and composes one Toast queue. A nested `FoundryProvider` creates an independent portal and Toast boundary. `ToastProvider` is also public for an intentionally independent nested queue without changing skin, locale, or portal configuration; `useToast` resolves the nearest queue and throws a descriptive error outside either provider.

A portal target is resolved after mount. It must belong to the control's document. A null, disconnected, or cross-document target falls back to that document's body; cross-document input also reports a contract error. Replacing or removing a live target migrates Foundry-managed content after the current event, preserves logical open state, generated relationships, and layer order, emits no state callback, and keeps focus when the focused node remains connected. Otherwise modal content takes its focus fallback; non-modal content leaves the document's current focus unchanged.

Native controls and non-portaled surfaces render fully on the server with stable IDs. Portaled content and Toast viewports are deliberately absent from server output and the first hydration render. An initially open root renders its trigger with `aria-expanded="true"` but omits `aria-controls` until the client content exists. After hydration, the target resolves, content mounts once, relationships attach, and initial-focus behavior runs; this is not an open-state request and emits no callback. Nested providers retain independent generated-ID and layer namespaces.

Server and client provider inputs must agree. A mismatch is a consumer error: development reports it; production preserves the hydrated state, applies client provider values as an ordinary provider update, and emits no control-state callback. The proof gate must verify closed and initially open server output, hydration without mismatch warnings, delayed portal attachment, missing and replaced targets, and nested providers.

## Forwarding profiles

| Profile | Accepted | Foundry-owned or refused |
| --- | --- | --- |
| No host | `children` and the exact configuration/state props named for the export | Native attributes, refs, and DOM events; the component renders no owned element. |
| Identity | `id`, non-reserved `data-*`, test IDs, and additive `aria-describedby` | Role, element replacement, reserved data hooks, owned IDs, and owned ARIA relationships. |
| Action button | Identity; `aria-label`/`aria-labelledby`; `type?: "button" | "submit" | "reset"` default `button`; `name`, `value`, `form`, `formAction`, `formMethod`, `formNoValidate`, `formTarget`, `autoFocus`; focus/blur; `onClick` | Element and role; type validation/default; disabled/loading semantics; state hooks. |
| Control button | Identity; `aria-label`/`aria-labelledby` when visible content is insufficient; focus/blur; `onClick`; documented `disabled` | Element, role, `type="button"`, relationships, keyboard behavior, and state hooks; form submission attributes are refused. |
| Text input | Identity; accessible-name props when no `Field` owns them; `name`, `form`, `autoComplete`, `inputMode`, `maxLength`, `minLength`, `pattern`, `placeholder`, `spellCheck`; focus/blur; native input/change observation | Element, supported `type`, value transition, Field-owned label/error relationships, and state hooks. |
| Select | Identity; accessible-name props when no `Field` owns them; `name`, `form`, `autoComplete`; focus/blur; native change observation | Element, single-selection transition, `multiple`, native row-count `size`, Field-owned relationships, and state hooks. |
| Checkable input | Identity; accessible-name props when no `Field` owns them; `name`, `value`, `form`; focus/blur; native change observation | Element, `type="checkbox"`, checked transition, `indeterminate`, role where applicable, Field-owned relationships, and state hooks. |
| Radio group | Identity; `form`; focus/blur on the fieldset | Fieldset/legend and input markup, input names/values, selection handlers, relationships, roving keys, and state hooks. |
| Static surface | Identity and additive descriptive ARIA | Focusability, drag/drop, root interaction handlers, hidden/popup state, element/role replacement, owned name relationships, and state hooks. |
| Popup surface | Identity and additive descriptive ARIA | Portal/positioner props, element/role, modal state, title/description relationships, tab index, positioning internals, keyboard/dismissal handlers, and state hooks. |
| Collection container | Identity and additive descriptive ARIA | Element/role, accessible-name and item relationships, tab index, keyboard/typeahead handlers, orientation semantics, and state hooks. |
| Collection item | Identity plus its specifically documented selection event | Element/role, tab index, keyboard/pointer activation, collection value/position, relationships, and state hooks. |

When consumer cancellation is meaningful, the consumer event runs first and `preventDefault()` cancels the Foundry default. Native observation handlers run after the Foundry state request and cannot replace its callback.

Every component has exactly one profile:

| Profile | Components |
| --- | --- |
| No host | `FoundryProvider`, `LocaleProvider`, `ToastProvider`, `DialogRoot`, `DrawerRoot`, `PopoverRoot`, `MenuRoot`, `TabsRoot`; `useToast` is a hook and has no forwarding surface. |
| Identity | `Field`, `Group`, `MenuGroup`, `MenuSeparator` |
| Action button | `Button` |
| Control button | `DialogTrigger`, `DialogClose`, `DrawerTrigger`, `DrawerClose`, `PopoverTrigger`, `PopoverClose`, `MenuTrigger`, `TabsTrigger` |
| Text input | `TextField`; `SearchField` forwards this profile to its search input and exposes no forwarding surface for its internal clear button. |
| Select | `NativeSelect` |
| Checkable input | `Checkbox`, `Switch` |
| Radio group | `RadioGroup` |
| Static surface | `StatusChip`, `Banner`, `EmptyState`, `LoadingSkeleton`, `Card`, `TabsPanel` |
| Popup surface | `DialogContent`, `DrawerContent`, `PopoverContent` |
| Collection container | `MenuContent`, `TabsList` |
| Collection item | `MenuItem` |

The readonly schema arrays and all public types have no DOM forwarding surface.

## Foundation, fields, and actions

`Field` renders a `div`, forwards an `HTMLDivElement` ref, uses the Identity profile, and accepts `label: ReactNode`, `description?: ReactNode`, `error?: ReactNode`, `required?: boolean`, `disabled?: boolean`, `size?: ControlSize` defaulting to `md`, and exactly one labelable React element as `children`. It owns label, description, error, marker, and generated relationships. A child accessible-name or error relationship that conflicts with `Field` is rejected. `error` produces invalid semantics but is not live by default. It never owns the entered value.

`Group` renders `fieldset` and visible `legend`, forwards `HTMLFieldSetElement`, uses the Identity profile, and accepts `label: ReactNode`, `disabled?: boolean`, `size?: ControlSize` defaulting to `md`, and one or more related native fields as `children`. Group `disabled=true` dominates every descendant and cannot be escaped by a child. An explicit child size overrides group size. Unsupported descendants and nested grouping used only for layout are rejected.

| Export | Element/ref and profile | Exact public state/form/size props and behavior | Migration |
| --- | --- | --- | --- |
| `Button` | `button`; `HTMLButtonElement`; Action button | `children: ReactNode`; `variant?: ButtonVariant` default `primary`; `size?: ControlSize` default `md`; `disabled?: boolean` default false; `loading?: boolean` default false. Icon-only use requires an accessible-name prop. Disabled uses native refusal. Loading remains focusable, sets `aria-disabled` and `aria-busy`, refuses repeat activation, preserves its accessible name, and announces localized `loading` once on each false-to-true transition through a transient visually hidden polite status sibling with no layout wrapper. | Retain name; remove domain-label categories. |
| `TextField` | text-like `input`; `HTMLInputElement`; Text input | Controlled `{ value: string; onChange(event: ChangeEvent<HTMLInputElement>): void }` or uncontrolled `{ defaultValue?: string; onChange?(event: ChangeEvent<HTMLInputElement>): void }`; a controlled value may omit `onChange` only with `readOnly: true`. Also `type?: "text" | "email" | "password" | "tel" | "url"` default `text`; `disabled?`, `required?`, `readOnly?` default false; `invalid?: boolean | string` default false; `size?: ControlSize` default `md`. Browser autofill and native form reset remain operative. | Retain; add type/runtime state union. |
| `NativeSelect` | single `select`; `HTMLSelectElement`; Select | `children` are one or more `option`/`optgroup` elements; controlled `{ value: string; onChange(event: ChangeEvent<HTMLSelectElement>): void }` or uncontrolled `{ defaultValue?: string; onChange?(event: ChangeEvent<HTMLSelectElement>): void }`; `disabled?`, `required?` default false; `invalid?: boolean | string` default false; `size?: ControlSize` default `md`. Empty string is a permitted consumer-owned value. | Rename current `Select`; reserve `Select` for a styled listbox. |
| `Checkbox` | checkbox `input`; `HTMLInputElement`; Checkable input | Controlled `{ checked: CheckboxState; onCheckedChange(next: CheckboxState): void }` or uncontrolled `{ defaultChecked?: CheckboxState; onCheckedChange?(next: CheckboxState): void }`, default false; `name?`, `value?: string` default `"on"`, `form?`; `required?`, `disabled?` default false; `invalid?: boolean | string` default false; `size?: ControlSize` default `md`. Mixed sets DOM `indeterminate` and `aria-checked="mixed"`; next user activation requests `true`. Native reset restores the mounted default. | Retain; add mixed state, size, and callback requirement. |
| `Switch` | checkbox `input` with `role="switch"`; `HTMLInputElement`; Checkable input | Controlled `{ checked: boolean; onCheckedChange(next: boolean): void }` or uncontrolled `{ defaultChecked?: boolean; onCheckedChange?(next: boolean): void }`, default false; `name?`, `value?: string` default `"on"`, `form?`; `required?`, `disabled?` default false; `invalid?: boolean | string` default false; `size?: ControlSize` default `md`. Mixed is refused; native reset restores the mounted default. | Retain; add size and callback requirement. |
| `RadioGroup` | `fieldset` and radio inputs; `HTMLFieldSetElement`; Radio group | `name: string`, `label: ReactNode`, `options: RadioOption[]`, `form?`; controlled `{ value: string | null; onValueChange }` or uncontrolled `{ defaultValue?: string | null; onValueChange? }`; `required?`, `disabled?` default false; `invalid?: boolean | string` default false; `size?: ControlSize` default `md`. `RadioOption` is `{ value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }`; at least one unique non-empty value is required. Required may begin empty. Right/Down select next, Left/Up previous, Home/End first/last, horizontal keys follow direction, and each move requests once. | Retain data API; remove required auto-selection. |
| `SearchField` | fragment containing search `input` and conditional clear `button`; ref `HTMLInputElement`; Text input applies to the input | Controlled `{ value: string; onValueChange(next: string): void }` or uncontrolled `{ defaultValue?: string; onValueChange?(next: string): void }`; a controlled value may omit `onValueChange` only with `readOnly: true`. Also `name?`, `form?`, `disabled?`, `required?`, `readOnly?` default false; `invalid?: boolean | string` default false; `size?: ControlSize` default `md`; `onClear?(): void`. Clear requests `""` once, then calls `onClear`; focus is preserved whether accepted or declined. Empty, disabled, or read-only state has no clear button. | Rename `Search`; localize clear and fix callback order. |

## Feedback and content surfaces

`StatusChip` is a non-interactive `span` with `HTMLSpanElement` ref, non-empty `label`, tone, and size. It has no live role by default and refuses focus and root interaction.

`Banner` is a labelled `section` with `HTMLElement` ref. It requires non-empty title and description and accepts tone, `action?: ReactElement`, heading level, size, and `announcement?: "none" | "polite" | "assertive"` with default `none`. `dismissible` defaults false. A non-dismissible Banner refuses open-state props. A dismissible Banner defaults open, supports controlled `open`/`onOpenChange` or `defaultOpen`, renders the localized dismiss action, and renders nothing after an accepted close. Decline keeps it rendered and focused state unchanged. Keyed remount restores the default. Initial display and accepted reopen announce according to `announcement`; dismissal does not.

`EmptyState` is a labelled static `section` with `HTMLElement` ref, required non-empty title and description, optional `action?: ReactElement`, heading level, and size. It is never a live region. `LoadingSkeleton` is a labelled `div` with `HTMLDivElement` ref, status/busy semantics, non-empty label, integer `lines` from one through six, and size; bars are hidden from assistive technology and animation stops under reduced motion. `Card` is an inert labelled `article` with `HTMLElement` ref, non-empty title, optional description and children, heading level, and size. Its descendants may be interactive; its root may not.

### Toast queue

`ToastProviderConfig` is `{ duration?: number; visibleLimit?: number; queueLimit?: number }`; defaults are 5000 ms, three visible, and 100 waiting. Zero duration means persistent. Limits must be positive integers. `ToastProviderProps` adds `children`. `FoundryProvider` uses the same configuration through its `toast` prop.

`ToastOptions` is `{ title: string; description?: string; tone?: ToastTone; action?: ToastAction; duration?: number; dedupeKey?: string }`. Title, action label, and any dedupe key are trimmed non-empty strings. `ToastAction` is `{ label: string; onAction(event: ToastActionEvent): void }`. The event exposes `preventDefault()` and readonly `defaultPrevented`. `ToastUpdate` is the optional mutable subset of Toast options except `dedupeKey`. `ToastId` is an opaque string. `ToastManager` is `{ show(options): ToastId; update(id, update): boolean; dismiss(id): boolean; dismissAll(): void }`.

The first `visibleLimit` records are visible FIFO; later records wait FIFO without a timer or announcement. A dismissal promotes exactly one waiting record. Showing past `visibleLimit + queueLimit` throws before mutation. A matching dedupe key updates the existing visible or waiting record in place, returns its ID, preserves its queue position, and restarts a visible timer only when duration or announced text changed. Unknown or already terminal IDs return false. The first action, dismiss, or timeout to begin closing wins; later races are stale and do nothing.

The viewport is one polite, atomic notification region; tone never changes urgency. A toast announces title and description once when it becomes visible. Updates are silent. Timers pause while that toast has hover or focus and while the document is hidden; reduced motion removes transition delay but does not change duration. An action closes after its callback unless prevented; a thrown callback leaves it open and propagates the error. Escape dismisses only the focused toast.

`F6` cycles mounted Toast viewports in document order; `Shift+F6` cycles backward. Entry focuses the viewport landmark, then normal Tab order reaches visible action and close buttons. Leaving returns to the valid element focused before entry. Provider unmount invalidates all IDs, removes its queue without callbacks, and restores focus to that element when focus was inside; otherwise it does not move focus. Nested queues participate as distinct viewports. Assertive errors use Banner or the future AlertDialog, not Toast.

## Compound topology

Parts must belong to their nearest matching root; cross-family or orphan parts throw before document listeners attach.

| Family | Required topology |
| --- | --- |
| Dialog/Drawer | One root; zero or one trigger; exactly one content declaration; zero or more explicit close parts inside content. Content always also renders one system-labelled close action. Trigger may be absent only for externally controlled opening. |
| Popover | One root; exactly one trigger and one content; zero or more close parts inside content. |
| Menu | One root, one trigger, one content, and at least one item. Content may contain items directly or through non-nested groups, with separators between item/group runs. No arbitrary interactive children or submenu in Core v1. |
| Tabs | One root, exactly one list, one or more triggers in that list, and exactly one panel with the same unique value for every trigger. No unmatched or duplicate values. |

Duplicate required parts, invalid cardinality, empty Menu, and missing Tabs pairs are composition errors. A dynamically removed part follows the recovery rules below and then the remaining composition is validated again.

Compound `children` and non-state props are exact:

| Export | Required public composition props |
| --- | --- |
| `DialogRoot` | `children: ReactNode` plus the exact open-state union. |
| `DrawerRoot` | Dialog root props plus `side?: "start" | "end"`, default `end`. |
| `PopoverRoot` | `children: ReactNode` plus the exact open-state union. |
| `MenuRoot` | `children: ReactNode`, `disabled?: boolean` default false, plus the exact open-state union. |
| `TabsRoot` | `children: ReactNode`, `orientation?: TabsOrientation` default `horizontal`, `activation?: TabsActivationMode` default `automatic`, plus the documented value-state union. |
| Dialog/Drawer/Popover triggers | `children: ReactNode`, `disabled?: boolean`; Control button profile. |
| Dialog/Drawer/Popover closes | `children?: ReactNode`, `disabled?: boolean`; Control button profile. Missing children render the applicable localized close label. |
| `DialogContent`, `DrawerContent` | `children?: ReactNode`, `title: string`, `description?: string`, `headingLevel?: HeadingLevel`, `initialFocus?: FocusTarget`, `finalFocus?: FocusTarget`; Popup surface profile. |
| `PopoverContent` | `children?: ReactNode`, `title: string`, `description?: string`, `headingLevel?: HeadingLevel`, and the placement props below; Popup surface profile. |
| `MenuTrigger` | `children: ReactNode`, `disabled?: boolean`; Control button profile. |
| `MenuContent` | One or more allowed menu-part children and the placement props below; Collection container profile. |
| `MenuItem` | `children: ReactNode`, `textValue?: string`, `disabled?: boolean`, `onSelect?(event: MenuSelectEvent): void`; Collection item profile. |
| `MenuGroup` | One or more `MenuItem` children and `label?: ReactNode`; Identity profile. Groups cannot nest. |
| `MenuSeparator` | No children; Identity profile. |
| `TabsList` | One or more `TabsTrigger` children and `label: string`; Collection container profile. |
| `TabsTrigger` | `children: ReactNode`, `value: string`, `disabled?: boolean`; Control button profile. |
| `TabsPanel` | `children?: ReactNode`, `value: string`; Static surface profile. |

`FocusTarget` is `HTMLElement | RefObject<HTMLElement | null> | (() => HTMLElement | null)`. `PlacementSide` is `"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"`; `PlacementAlign` is `"start" | "center" | "end"`. Floating content defaults to side `bottom`, align `center`, side offset 8 CSS pixels, align offset 0, and collision padding 8. It flips on the side axis, shifts on alignment, tracks scroll/resize/layout changes, and is capped to the available viewport or clipping boundary.

The exact public placement fields are `side?: PlacementSide`, `align?: PlacementAlign`, `sideOffset?: number`, `alignOffset?: number`, and `collisionPadding?: number`. Offsets and padding must be finite and non-negative. Consumers cannot replace the anchor, positioner, collision boundary, positioning method, or tracking behavior in Core v1.

## Dialog and Drawer

Roots are DOM-free and default closed. Controlled `open` requires `onOpenChange`; uncontrolled state uses `defaultOpen`. Public callbacks receive only the requested boolean. Foundry translates dependency reasons internally.

Trigger and close parts are native buttons with `HTMLButtonElement` refs and the Control button profile. Content is a portaled `div` with `role="dialog"`, `aria-modal="true"`, `HTMLDivElement` ref, Popup surface profile, required visible title, optional description, heading level, and optional `initialFocus` and `finalFocus`. It is modal: outside content is inert, document scroll is locked, Tab is contained, outside pointer dismissal is refused without a callback, and only the topmost modal handles Escape. Content is not a native `HTMLDialogElement`.

| Request or transition | Callback and state | Focus result |
| --- | --- | --- |
| Enabled trigger | Requests open once. Decline leaves closed. | Accepted open uses a valid `initialFocus`; otherwise content itself receives `tabIndex=-1` focus. |
| Escape or close part | Requests close once; a consumer close click may prevent the request. | Controlled decline keeps focus contained. Accepted close restores once after removal. |
| Outside pointer | No close request. | Pointer/focus cannot leave the modal. |
| Parent changes `open` | No callback. | Opening uses the same initial fallback; closing uses final restoration. |
| Trigger disappears while open | State remains open. | Close restoration skips it. |
| Focus target is missing, disconnected, disabled, inert, or outside content for initial focus | No state callback. | Initial falls back to content; final falls through the restoration order. |

Final restoration order is a valid explicit `finalFocus`, the connected enabled opening trigger, the connected element focused before open, the next lower modal's content, then no forced move. Nested Escape affects only the topmost layer. When a controlled close is declined, no restoration runs. Drawer uses the same contract plus logical `side?: "start" | "end"`, default `end`; direction maps the logical side, and side changes placement and motion. Gestures and snap points are not Core v1.

## Popover

`PopoverRoot` is DOM-free, non-modal, default closed, and uses the same exact open-state union. Trigger and close are native buttons with the Control button profile. Content is a portaled `div` with `role="dialog"`, no `aria-modal`, an `HTMLDivElement` ref, the Popup surface profile, required title, optional description, heading level, and the exact placement props.

Opening leaves focus on the trigger. Escape or an explicit close requests close and, when accepted while focus is inside, restores the valid trigger. Outside pointer requests close but preserves the pointer target's focus. Tab follows document order; after focus leaves the popup it requests close without restoration. A declined controlled close leaves the popup open and never steals focus back.

If the anchor disconnects, Foundry issues one close request for that loss episode. Uncontrolled content closes without restoration. If a controlled parent declines, logical `data-open` remains, but the positioner is hidden and its subtree is made unfocusable until the anchor returns; the last coordinates are never presented as current. Reconnection restores positioning without another callback. A missing trigger at accepted close means no restoration.

## Menu

`MenuRootProps` is the exact controlled/uncontrolled open union plus `children` and `disabled?`; default is closed. A disabled closed root refuses all requests. Becoming disabled while uncontrolled and open closes without a callback and restores a valid trigger; controlled `open=true` with `disabled=true` is a conflicting state and is rejected. Menu is non-modal.

Trigger is a native button with the Control button profile. Enter/Space opens at the first enabled item; ArrowDown opens at first and ArrowUp at last. Content is a portaled `div` with `role="menu"`, `HTMLDivElement` ref, Collection container profile, exact placement props, and trigger labelling. Item is a `div` with `role="menuitem"`, `HTMLDivElement` ref, Collection item profile, non-empty content, optional `textValue`, `disabled`, and `onSelect(event: MenuSelectEvent)`. `MenuSelectEvent` exposes the originating `KeyboardEvent | PointerEvent`, `preventDefault()`, and readonly `defaultPrevented`. Non-text item content requires a non-empty `textValue`.

Arrow navigation wraps and may focus disabled items; activation of a disabled item is refused without selection or close. Home/End move to the first/last item. Typeahead uses locale-aware, case-insensitive prefix matching over `textValue` or plain text, a 500 ms buffer, repeated-character cycling, and includes disabled matches for focus while preserving activation refusal. An all-disabled menu opens with the content itself focused; selection is unavailable. Empty menus are composition errors.

An unprevented enabled selection invokes `onSelect` once, then requests close once. Accepted close restores the trigger. Preventing selection keeps the menu open and focused on the item. Escape requests close and restores only after acceptance. Outside pointer and Tab request close while preserving the destination focus. If any controlled close is declined, the menu stays open: focus remains on the item for selection/Escape and remains on the outside destination for pointer/Tab. Only the topmost nested layer handles Escape; submenus themselves are outside Core v1. `MenuGroup` has an optional visible label; `MenuSeparator` is non-focusable and vertical.

## Tabs

`TabsOrientation` is `"horizontal" | "vertical"`; `TabsActivationMode` is `"automatic" | "manual"`. `TabsRoot` is DOM-free and accepts controlled `{ value: string | null; onValueChange(next: string | null): void; defaultValue?: never }` or uncontrolled `{ defaultValue?: string | null; onValueChange?(next: string | null): void; value?: never }`, plus the composition props above. Omitted uncontrolled default selects the first enabled tab without a callback. `TabsList` is one labelled `div` with `role="tablist"`, `HTMLDivElement` ref, and Collection container profile. `TabsTrigger` is a native button with `HTMLButtonElement` ref and Control button profile. `TabsPanel` is a `div` with `HTMLDivElement` ref, Static surface profile, and matching value.

Horizontal arrows follow logical direction; vertical uses Up/Down. Home/End and arrow navigation wrap among enabled triggers. Focus moves immediately. Automatic mode then requests selection once; manual mode waits for Enter/Space. A declined controlled selection never rolls focus back. Pointer activation focuses and requests selection once in either mode.

An invalid or disabled controlled value renders no selected panel and emits no callback; roving focus starts at the deterministic fallback. An invalid uncontrolled default falls back to the first enabled tab without a callback. If the selected uncontrolled trigger is removed or becomes disabled, fallback is the enabled trigger at the same former index, then later indices, then earlier indices in reverse, then `null`; this recovery emits one `onValueChange`. Controlled recovery keeps the parent value, renders no mismatched panel, and emits no fabricated change. Focus moves to the fallback only when the removed/disabled trigger owned focus; otherwise recovery does not steal focus. With no enabled triggers, selection is null, no panel is shown, and the widget contributes no internal Tab stop.

Only the selected panel is mounted. It receives `tabIndex=0` when it has no focusable descendant and otherwise is not a Tab stop. Removing or omitting the selected panel is a composition error, not permission to show another panel. Nested roots register only their own parts.

## Migration and validation

1. Introduce the provider, explicit root exports, and internalize accidental foundation exports without changing consumer-visible control behavior.
2. Correct native fields/actions and names, including Button content, `NativeSelect`, `SearchField`, state unions, reset recovery, and system labels.
3. Replace static Toast with the queue boundary and correct feedback heading/live semantics.
4. Rebase complex families on Base UI through the reviewed production integration contract; remove `MenuClose` and add the approved structure.
5. Rebuild the gallery against packed public exports. Compatibility aliases may exist only inside one migration branch; none ship in Core v1.

Each packet cites its contract section, searches every current consumer, and maps its assertions to the following gates. A path without an executed gate is `UNTESTED`.

| Contract path | Required automated evidence |
| --- | --- |
| Public export, prop, ref, and refusal boundary | declaration fixture, compile-pass and compile-fail consumer cases, runtime invalid-input tests, packed-consumer import |
| Controlled/uncontrolled entry, acceptance, decline, stale request, reset/remount, disabled/read-only | live renderer transition tests with callback count and DOM/focus assertions |
| Compound topology and dynamic removal | live composition/refusal tests plus listener-cleanup assertion |
| Keyboard, focus, dismissal, placement, direction, and recovery | real-browser Chromium plus Firefox/WebKit for shared-foundation changes |
| SSR, hydration, portal target, and provider nesting | real `renderToString` and hydrate target with console, DOM identity, relationship, state, and focus assertions |
| Accessible name, roles, live behavior, and forced colors | accessibility-tree/browser assertions; release assistive-technology smoke where required |
| Long content, zero/one/many, 320 px, 400% zoom, reduced motion | real packed-gallery browser cases and rendered visual review |

The default skin and package/gate authorities add their own exact acceptance evidence before any production packet is eligible.
