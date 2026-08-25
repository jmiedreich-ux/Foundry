# Control Gallery — approved decisions

## Product boundaries

1. Foundry is a standalone repository and control library. It takes no code, components, tokens, styling, tests, compatibility layer, or migration behavior from Vennusign.
2. Vennusign adoption is a separate, later feature. It is not a dependency of any Control Gallery milestone.
3. The gallery is an executable acceptance surface, not a screenshot or documentation-only catalog.

## Control contract

1. Core v1 covers foundations; actions and inputs; containers and navigation; and feedback and status, as listed in `docs/implementation-plan.md`.
2. Buttons have four variants: Primary, Secondary, Destructive, and Link.
3. Every control exposes relevant default, disabled, invalid, loading, selected/checked/open, focus-visible, and keyboard states.
4. Form controls support label, help/error text, controlled and uncontrolled usage where applicable, and reset behavior.
5. Overlay controls support their applicable Escape/outside dismissal behavior and return focus to the trigger when they close.
6. The gallery has a reduced-motion mode and stays usable at narrow and wide widths.

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
