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

## Explicit non-goals

- Vennusign conversion or compatibility.
- A skin/theme editor in Core v1.
- Hosted-agent orchestration, polling, or autonomous process changes.
- Shipping a control merely because it looks right without exercising its behavior.
