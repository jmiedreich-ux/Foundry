# Control Gallery — approved decisions

## Product boundaries

1. Foundry is a standalone repository and control library. It takes no code, components, tokens, styling, tests, compatibility layer, or migration behavior from Vennusign.
2. Vennusign adoption is a separate, later feature. It is not a dependency of any Control Gallery milestone.
3. The gallery is an executable acceptance surface, not a screenshot or documentation-only catalog.

## Control contract

1. Core v1 covers foundations; actions and inputs; containers and navigation; and feedback and status, as listed in `docs/implementation-plan.md`.
2. Buttons have four variants: Primary, Secondary, Destructive, and Link.
3. Every control extends the Control Base: `id`, `disabled`, `size` (`sm`, `md`, or `lg`), `invalid`, `loading` where meaningful, a forwarded ref, and pass-through `data-*` attributes have identical meanings everywhere. Explicit child values override inherited container values.
4. Control roots expose applicable `data-disabled`, `data-invalid`, `data-loading`, `data-open`, `data-checked`, `data-selected`, `data-focus-visible`, and `data-readonly` states. The default skin defines shared focus, invalid, and disabled treatments once.
5. Consumers do not pass `className` or `style` to Foundry controls. Literal visual values are allowed only in the token skin; consumer spacing belongs to layout. A documented skin-level override is the escape hatch.
6. Form controls support label, help/error text, controlled and uncontrolled usage where applicable, native form participation, and reset behavior. `Field` owns labelling and description/error wiring; `Group` supplies shared disabled, size, selection, and roving-focus context where applicable.
7. Overlay controls use compound root/trigger/content APIs, support their applicable Escape/outside dismissal behavior, and return focus to the trigger when they close.
8. Buttons separate variant, label category, and domain state. The initial label categories are `cancel`, `save`, `delete`, `add`, `back`, `retry`, `dismiss`, `reorder`, `edit`, `open`, `done`, `duplicate`, and `rename`; only `add` and `back` permit a supplied label override.
9. `LocaleProvider` and the English label catalog are Core v1. A control never owns a hardcoded locked-category label; a future locale is a catalog addition, not an API rewrite.
10. The gallery has a reduced-motion mode and stays usable at narrow and wide widths.
11. M2's field contract is `<Field label description error required><TextField /></Field>`. `Field` generates the control ID when absent, renders the label/help/error primitives, owns `aria-labelledby`, `aria-describedby`, and invalid-state context, and never owns the control's entered value. An error is announced and does not clear the value being corrected.
12. `Group` is a semantic fieldset for related controls. It supplies inherited `disabled` and `size` state through the existing group context; an explicit child value wins. M2 validation returns a stable valid/invalid result with an optional message, beginning with required-value validation.
13. M3 Search is a labelled native `<input type="search">`, not a combobox, popup, autocomplete, remote-data client, or typeahead. It supports controlled or uncontrolled query state, native form reset, a clear action, and Field wiring. Search-result matching and the empty/match/no-match presentation are owned by the consuming gallery/example, which must expose its result summary through one polite, atomic status message.
14. M3 feedback controls use a small common tone vocabulary: `neutral`, `success`, `warning`, and `danger`. `StatusChip` is advisory `status` text; Banner is persistent, dismissible contextual content with a recovery action slot; Toast is one polite, manually dismissed transient message. A Banner never uses ARIA's global `banner` role, and neither Banner nor Toast uses an assertive `alert` around interactive controls. Critical, blocking interaction remains a later Dialog/alert-dialog concern.
15. M3 EmptyState is a labelled semantic section with recovery content. LoadingSkeleton is indeterminate presentation plus a labelled busy status; it never claims a percentage or renders a fake progress bar. Skeleton motion is CSS-only and disabled by the existing reduced-motion setting and `prefers-reduced-motion`.
16. M3 does not receive final owner acceptance until its gallery presentation passes a project-neutral visual-completion gate: documented hierarchy, rhythm, grouping, density, scanability, and state-treatment rules; rendered evidence at the required viewports; independent visual review; and any bounded correction required by that review. This gate may change only the gallery shell and default skin. It does not authorize Front of House adoption, a token-contract expansion, M4 work, public API change, or product-specific styling.
17. M4 begins with an internal overlay foundation: `OverlayRoot` owns a last-in-first-out registry of active layers, and `useOverlayLayer` captures the invoking element and registers only while a layer is open. On removal of the top layer, it attempts to restore focus only to its captured trigger when that element remains connected, enabled, and outside an inert ancestor; otherwise it leaves focus unchanged and reports that no restoration occurred. The foundation provides focusable-descendant discovery, initial-focus, and Tab-cycle helpers, but it does not render a layer, move focus on open by itself, trap focus by default, create a portal/backdrop, choose dialog semantics, or decide Escape/outside dismissal. Dialog, Drawer, Popover, and Menu own those choices in their later packets. The foundation is internal until CG-M4-14 publishes a reviewed public API.
18. M4 Dialog is an internal compound control until CG-M4-14: `DialogRoot` owns controlled `open` or uncontrolled `defaultOpen` state (never both) and `onOpenChange`; `DialogTrigger` is one native button that captures itself before requesting open; `DialogContent` is a named native `<dialog>` whose visible `title` supplies its accessible name; and `DialogClose` is the catalogue-labelled native close button. Open content calls the native `showModal()` API, receives initial focus from the platform, cycles Tab/Shift+Tab with the shared helper as a fallback, closes on Escape through `onOpenChange(false)`, refuses outside-pointer dismissal, and relies on M4-01 to restore a valid trigger after close. The component does not add portals, custom backdrops, alert-dialog semantics, a timeout, a consumer `className`/`style`/role escape, or a public export. CG-M4-16 owns real Chromium proof.
19. M4 Drawer is an internal compound modal panel until CG-M4-14. It follows Dialog's controlled/uncontrolled, native-modal, Escape, explicit-close, focus-containment, valid-trigger restoration, and runtime-refusal boundaries, but exposes `data-control="drawer"` and a required `side` of `start` or `end` (default `end`) for the future skin. The Drawer source consumes M4-01 only; it neither changes Dialog nor introduces a portal, custom backdrop, outside dismissal, animation, public export, or gallery work. CG-M4-17 owns real Chromium proof.

## Skins and catalog governance

1. `@foundry/tokens` owns one repository-backed default skin, implemented as CSS custom properties under `packages/tokens/src/skins/default.css`. It is the only shipping source of token values; the exploratory image is not authority.
2. A skin change follows: proposal → review → edit the repository skin → exercise the real gallery → validate required/unknown token keys → merge. No parallel maintained token copy is permitted.
3. Core v1 is limited to M1–M5. Post-Core roadmap candidates are Accordion, Grid, Timeline, data lookup, Tree, calendar/date-range picker, drag-reorder list, Stepper/Wizard, Kanban, Chart, and ColorPicker. Custom controls require a separately scoped feature and also extend Control Base.
4. Validation rejects a control outside the declared catalog, an undocumented style extension, a missing skin/label entry, or a forbidden consumer styling escape hatch.

## Implementation and process

1. The intended library target is React and TypeScript. The existing dependency-free gallery is a behavioral prototype, not the final package architecture.
2. Shared contracts, package configuration, test harnesses, status, tracker, and handoff are coordinator-owned.
3. Work is divided into bounded, non-overlapping packets. Every contributor follows `AGENTS.md`; packets do not create an exception to it.
4. Browser verification and integration checks are serialized after implementation packets complete.
5. After the initial M1-03 local-agent attempt returned no acceptable change, CG-M1-03 is divided into sequential, exact-path sub-packets. The coordinator accepts each returned diff before dispatching its successor. The completed integrated M1-03 diff receives one independent review before merge; a commit after that review requires a new review.
6. Beginning with M3, local-agent routing is measured by accepted code-bearing line share, not task-count share. A milestone plans a 60–70% local share of changed implementation and test lines where its work is suitable for local execution. Code-bearing lines exclude controlled records, generated output, lockfiles, and runtime logs. Actual attribution follows the accepted commit author; coordinator takeovers and coordinator amendments count as cloud-authored lines.
7. A local code packet has one behavior responsibility, exact non-overlapping paths, a stated estimated code-bearing line range (normally 40–140 changed lines), a preflighted dependency/browser target where applicable, three to five observable acceptance assertions, one required commit, and at most one correction. An estimate above that range is split or receives an owner-approved exception. Shared contracts, public exports, gallery integration, test-server configuration, controlled records, and final review remain explicit coordinator packets. A packet that needs a coordinator-owned edit is split before dispatch rather than relying on an implicit handoff.
8. CG-M3-04.1 records the conservative Search and feedback contracts before source work. CG-M3-04.2 owns the resulting shared default-skin selectors. The ordinary controls, examples, exports, integration, and browser checks remain their existing M3 packets; no new public family, data service, overlay primitive, or animation system is introduced.

## Explicit non-goals

- Vennusign conversion or compatibility.
- A skin/theme editor in Core v1.
- Hosted-agent orchestration, polling, or autonomous process changes.
- Shipping a control merely because it looks right without exercising its behavior.
