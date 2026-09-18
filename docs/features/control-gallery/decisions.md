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

## Quality baseline and delivery direction

Core v1 ships an installable Foundry package. It includes compiled JavaScript, type declarations, public export maps, React peer-dependency guidance, a packed-consumer smoke check, onboarding documentation, and a license before release.

Foundry follows the outcome standards of mature control libraries without copying their APIs or visual systems: accessible defaults, native semantics where available, predictable keyboard and focus behavior, stable public contracts, and a token-based visual system. The default skin must make size, state, density, typography, spacing, motion, and focus visibly coherent at narrow and wide widths.

The next architecture work is ordered as follows:

1. Establish release gates: canonical unit and browser commands, supported Node and browser versions, pull-request checks, package output, and a packed-consumer check.
2. Repair cross-control contract failures: size output, focus contrast, controlled callbacks, Tabs focus recovery, overlay titles, localization, close-label ownership, and trigger-property ownership.
3. Complete remaining overlay and navigation browser coverage, then run cross-control acceptance against the real gallery.
4. Compare planned controls against mature-library outcomes and add only the missing capabilities that serve Foundry’s documented users.

This direction is informed by the accessibility and focus-management approach documented by [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/accessibility) and the token, theme, and package-consumer patterns documented by [Material UI](https://mui.com/material-ui/customization/theming/). These sources are reference evidence, not design authority.

## Decisions still required

The independent repository review identified unresolved architecture decisions. No correction is authorized until these are decided and assigned:

- the visible meaning and token treatment of small, medium, and large control sizes;
- a focus treatment that meets contrast requirements on every supported adjacent surface;
- one controlled-state callback rule for every state-bearing control;
- when a controlled Tabs keyboard-focus request is consumed or cancelled;
- the required visible-title boundary for overlays;
- required CI, canonical unit/browser commands, and supported toolchain versions;
- ownership of localized Search clear text;
- whether close controls use a fixed catalog label or a bounded consumer label API;
- one trigger-prop ownership policy for overlays; and
- the release license for the distributable package.
