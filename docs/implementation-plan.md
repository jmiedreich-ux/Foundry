# Foundry — Standalone Control Library Implementation Plan

## Scope

Build Foundry as an independent React control library. It does not adopt Vennusign code, styling, tokens, tests, or workflows. A future, separate conversion plan may evaluate adoption only after Foundry Core v1 is complete.

Every Foundry change follows the mandatory engineering process in [`AGENTS.md`](../AGENTS.md), which carries over the general Vennusign development discipline while excluding Vennusign-specific code and infrastructure.

## Core v1

- Foundations: `SkinProvider`, `LocaleProvider`, `Field`, `Group`, overlay root, and control registry.
- Actions and inputs: `Button`, `TextField`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, and `Search`.
- Containers and navigation: `Dialog`, `Drawer`, `Popover`, `Menu`, `Tabs`, and `Card`.
- Feedback and status: `StatusChip`, `Banner`, `Toast`, `EmptyState`, and `LoadingSkeleton`.

## First delivery: Control Gallery

The gallery is the acceptance surface. Each control must have working examples for relevant default, disabled, invalid, loading, selected, checked, open, and focus-visible states. It will include controlled and uncontrolled examples, form reset, keyboard interaction, validation, overlay dismissal and focus restoration, and reduced-motion-safe transitions.

Implementation packets for local agents are defined in [local-agent-work-plan.md](local-agent-work-plan.md). They intentionally reuse only the bounded-work, file-ownership, and serialized-verification practices of the earlier Maestro framework.

## Project layout

```text
foundry/
  apps/lab/          # interactive control gallery
  packages/react/    # future library package
  packages/tokens/   # future token package
  packages/validation/
  docs/
  tests/
```

## Deferred

Any Vennusign conversion, compatibility layer, or migration work is deliberately deferred to a later plan.
