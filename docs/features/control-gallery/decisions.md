# Control Gallery architecture

## Purpose and boundary

Foundry is an independent React and TypeScript control library. The gallery is its executable acceptance surface: it demonstrates real behavior before a product adopts a control. Foundry does not inherit code, styles, tokens, tests, or compatibility behavior from Vennusign.

Core v1 includes fields, actions, selection, search, feedback, overlays, navigation, and the default skin. Product adoption, a theme editor, and new control families remain outside this scope.

## Shared control rules

Every control has a predictable public boundary: a stable ID, meaningful disabled and loading behavior, inherited size where applicable, a forwarded ref, safe data attributes, and fixed semantic/state hooks owned by the control. An explicit child value overrides an inherited container value.

Consumers compose layout around controls. They do not supply arbitrary classes, inline styles, roles, ARIA state, or handlers that would override control-owned behavior. Visual values belong in the default skin and future approved skins.

Controls that support controlled and uncontrolled state reject conflicting modes. A controlled control must report state-change requests to its parent. Disabled or loading controls do not perform their action.

## Fields, actions, and feedback

`Field` owns labels, descriptions, errors, and relationships; it never owns the entered value. Validation identifies the problem without discarding a value that the user must correct. `Group` provides semantic grouping and applicable shared state.

Buttons have Primary, Secondary, Destructive, and Link variants. The English label catalog is owned by `LocaleProvider`; locked control labels come from that catalog.

Search is a native search field with controlled or uncontrolled query state, reset support, a clear action, and a consumer-owned results view. Feedback controls use neutral, success, warning, and danger tones. Status text is advisory; Banner is persistent and dismissible; Toast is polite, manual, and singular; EmptyState offers recovery content; LoadingSkeleton is indeterminate and respects reduced motion.

## Overlay and navigation behavior

Dialog and Drawer are named native modal interactions. They contain focus, close through Escape and an explicit close action, reject outside dismissal, and restore focus to a valid trigger.

Popover and Menu are non-modal. They document their own native or pointer dismissal behavior, do not trap focus, and do not steal focus from an outside interaction or Tab navigation. Menu provides labelled command semantics, roving item focus, disabled-item refusal, and ordered selection.

Tabs have one labelled list, one selected enabled tab, and one visible associated panel. Pointer and keyboard selection move focus and selection together. Card is a non-interactive labelled article that accepts optional description and any number of children.

## Skin and catalog

The repository default skin is the single source of token values. A skin change is proposed, reviewed, exercised in the real gallery, validated for required keys, and merged. Controls outside the declared catalog and undocumented styling extensions are rejected.

## Delivery and verification

Work is divided into bounded, non-overlapping changes. Shared contracts, package configuration, integration, and final review remain coordinator-owned. A change is accepted only with scoped verification and independent review. Browser evidence runs against the real gallery.

## Core v1 quality contract

Core v1 is a styled, installable library, not a gallery-only collection of source files. It must provide compiled JavaScript, declarations, public export maps, React peer dependencies, explicit skin imports, a packed-consumer smoke check, onboarding documentation, and a release license. Release quality includes exceptional visual polish and a low-friction developer experience: a developer must be able to discover, install, compose, theme, validate, and recover from misuse without reverse-engineering Foundry internals.

### Architecture layers

1. Native elements provide the base semantics for ordinary fields and actions.
2. A proven headless interaction foundation provides focus, dismissal, collection navigation, and positioning for complex controls. Foundry keeps its own public API and does not expose the dependency's API.
3. Foundry adapters own public types, state transitions, localized labels, refs, and stable `data-*` hooks.
4. The token package defines semantic values and component recipes. A skin supplies all visual values.
5. The gallery consumes the packed public package and skin in the same way as an application.

No new custom overlay, collection-navigation, focus-scope, or floating-positioning mechanism is added while the internal foundation is being selected. The current hand-built overlay and Tabs internals are evidence of required behavior, not release architecture that must be preserved.

### Public API and state

- Controlled and uncontrolled forms are mutually exclusive in public types and at runtime. A controlled value requires its change callback; a controlled read-only field is the documented exception.
- A user request calls its callback once. A parent may accept or decline the request. Declined and stale requests do not change internal state, restore old focus, or steal current focus.
- Fixed roles, relationships, state hooks, and element types are control-owned. Props are not accepted and then silently ignored.
- Impossible state or composition is rejected with a descriptive error. Safe consumer metadata is forwarded; `dangerouslySetInnerHTML`, semantic overrides, and styling escapes are refused consistently.
- Visible domain labels are consumer content. Control-owned actions such as clear and dismiss come from `LocaleProvider`. Button supports ordinary text and icon composition; its Link appearance remains an action, while navigation uses a separate Link control.
- Pending actions remain focusable, refuse repeat activation, retain their accessible name, and announce progress. Disabled actions use native disabled behavior where it is semantically correct.
- A public ref targets the documented interactive or semantic root. Server rendering and hydration must not depend on a browser global during render.

### Accessibility and interaction

- Native semantics are preferred. Custom widgets follow the applicable WAI-ARIA Authoring Practices pattern and document any deliberate difference.
- Every interactive control has a non-empty accessible name. Dialog-like content has a visible non-empty title and a governed description relationship.
- Browser `:focus-visible` is the focus-visibility authority. Any public focus data hook mirrors the browser result; per-control document-level modality listeners are not used.
- The default skin uses a two-color focus treatment. Its qualifying perimeter is at least two CSS pixels and has at least 3:1 contrast against both the adjacent surface and the unfocused pixels on every supported control state.
- Modal controls move focus to an intentional target, contain the tab sequence, provide an explicit close action, and restore a valid logical target. Non-modal controls do not trap or unexpectedly restore focus.
- Menus contain menu items, groups, and separators only. Tabs provide a focusable panel fallback when panel content does not begin with a focusable element. Direction, orientation, disabled items, typeahead where applicable, reduced motion, and high-contrast modes are part of the control contract.

### Skin and visual ownership

- Importing `@foundry/react` has no CSS side effect. A consumer opts into a skin through its documented CSS export.
- Skin variables and selectors are scoped to a Foundry skin root or a portaled Foundry part. Foundry never styles an unowned native `button`, `input`, `select`, `fieldset`, `legend`, or `label`.
- Every owned part has a stable control/part hook. Component state selectors use those hooks rather than element-wide selectors.
- Small, medium, and large are observable contracts. The size recipe changes control block size, inline padding, content gap, and applicable text/icon scale; text-entry text remains at least 16 CSS pixels. Surface controls use the same density scale for internal spacing. Exact token values require rendered approval before implementation.
- Each interactive recipe defines default, hover, active, focus-visible, disabled, loading, invalid, read-only, checked, selected, and open treatments where applicable. Color is not the only state signal.
- Overlay recipes include backdrop, elevation, viewport margin, maximum size, overflow, stacking, and motion. Drawer side changes placement and motion. Popover and Menu remain anchored during scroll/resize and avoid viewport and clipping-boundary collisions.
- Typography, spacing, color, borders, radii, elevation, motion, control sizes, and layer values are semantic tokens. Component CSS does not introduce unexplained literal visual values.

### Support and release gates

- The supported runtime is React 18.3 through React 19. The build toolchain remains Node 22 and npm 10 until a separately reviewed upgrade.
- Pull requests run formatting/lint, TypeScript, complete unit/component tests, package build, packed-consumer checks, and Chromium browser checks. Firefox and WebKit run before release and for shared interaction-foundation changes.
- Browser evidence covers keyboard, pointer, focus, accessible names, controlled and uncontrolled recovery, disabled/refusal paths, form reset, 320px reflow, 400% zoom, reduced motion, forced colors, long content, and applicable right-to-left behavior. Gallery and packed-consumer review also evaluate API discoverability, error clarity, first-use effort, and the visual coherence of complete control families.
- Each complex family receives an assistive-technology smoke check on at least one Windows browser/screen-reader pair and one Safari/VoiceOver pair before Core v1 release. Automated checks supplement but do not replace those results.
- Release artifacts contain only supported runtime files, declarations, CSS, package metadata, README, changelog, and license. A clean temporary consumer installs the packed artifacts and proves imports, types, CSS opt-in, browser build, and server rendering.

## Current architecture disposition

| Area | Direction |
| --- | --- |
| Gallery and native semantics | Retain the working journeys and tests as evidence; make the gallery a packed-package consumer. |
| Control Base, fields, choices, Search, and feedback | Amend for one state model, owned hooks, label composition, heading composition, focus behavior, and complete size recipes. |
| Dialog, Drawer, Popover, Menu, and Tabs | Preserve accepted observable behavior, then rebase the internals on the selected headless foundation instead of extending duplicated custom mechanisms. |
| Default skin | Rebuild as an explicitly imported, fully scoped token skin with complete recipes for every Core v1 control. |
| Packaging and verification | Add canonical commands, product CI, multi-browser release gates, declarations, peer dependencies, and packed-consumer proof. |

The internal headless foundation will be selected by architecture evaluation of Radix Primitives, React Aria Components, and Base UI. The evaluation uses the same Dialog, Menu, Tabs, Field, and Toast journeys and compares accessibility behavior, controlled-state fidelity, positioning, SSR/hydration, React support, bundle boundaries, maintenance, and the ability to keep Foundry's public API stable. This is an architect decision and does not require an owner preference unless the result changes product scope.

## Capability path

Core v1 remains limited to the existing catalog until its quality contract passes. Outcome comparison with mature libraries identifies the next coherent additions, without promising exact catalog parity:

1. Essential composition: Link, TextArea, Tooltip, Disclosure/Accordion, Separator, Progress/Meter, and AlertDialog.
2. Input depth: NumberField, styled Select/Listbox, Combobox/Autocomplete, Slider, Toggle, and ToggleGroup.
3. Application navigation and data display: Breadcrumbs, Pagination, Avatar/Badge, and Table foundations.

Each addition needs a documented user journey, accessibility pattern, skin recipe, package export, and gallery acceptance evidence before it enters the delivery plan.

This direction is informed by the official [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/), [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction), [React Aria](https://react-aria.adobe.com/), [Base UI](https://base-ui.com/react/overview/about), and [Material UI](https://mui.com/material-ui/all-components/). They are comparison evidence, not Foundry design authority.

## Owner decision still required

The release license remains reserved for the Foundry owner. Technical architecture and implementation preparation may continue, but a package cannot be released until the license is chosen and published.
