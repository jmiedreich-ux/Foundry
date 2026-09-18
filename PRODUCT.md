# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: React, TypeScript, and Vite for a small, independently runnable control-library workspace.

## Users

Design-system authors, product engineers, and quality reviewers who need to inspect and exercise reusable UI controls before they are adopted by a product.

## Product Purpose

Foundry is an independent control library and its working gallery. It makes each supported control exceptionally polished, discoverable, testable, and easy to compose without inheriting a host product's visual system.

## Positioning

Foundry pairs its control contract with a live gallery: every documented state can be exercised in the browser rather than only viewed as a static specimen.

## Operating Context

The gallery is used while building and reviewing forms, actions, navigation, feedback, and overlays. It is the acceptance surface for component behavior, keyboard access, validation, and state changes.

## Capabilities and Constraints

- Core v1 begins with foundational primitives, inputs and actions, navigation and overlay containers, and feedback/status controls.
- The gallery must demonstrate real interaction: validation, disabled and loading states, selection, focus, keyboard behavior, overlays, dismissal, and form reset.
- The project is standalone. Vennusign code, visual tokens, components, and migration work are out of scope.
- Primary button variants are Primary, Secondary, Destructive, and Link.

## Brand Commitments

The project name is Foundry. Its presentation should be neutral and tool-like so future skins can vary without changing the control behavior.

## Evidence on Hand

The supplied Foundry architecture, design-to-skin, and usage-guide documents define the initial control vocabulary and behavioral expectations. No product screenshots, customer claims, or external brand assets are in scope.

## Product Principles

1. Behavior is part of the specification.
2. Controls are accessible by default and predictable under keyboard use.
3. Visual skins stay separate from control contracts.
4. The gallery makes states and constraints easy to verify.

## Current State

The gallery and the initial control catalog exist, but Core v1 is not release-ready. Source inspection found cross-control API, styling, accessibility, packaging, and browser-support gaps. Implementation is paused while the architecture completes the quality foundation for rebasing complex interaction internals on Base UI behind the Foundry API.

## Authoritative Sources

- Control behavior and library architecture: `docs/features/control-gallery/decisions.md`
- Per-export public and migration contract: `docs/features/control-gallery/control-contracts.md`
- Base UI production mappings and adapter boundary: `docs/features/control-gallery/base-ui-integration.md`
- Delivery order and outcomes: `docs/features/control-gallery/milestones.md`
- Owner decisions still required: `docs/features/control-gallery/question-register.md`
- Workshop state and exact next action: `docs/planning/workshop-state.json`

Authoritative documentation is versioned and published through GitHub. A local checkout is working state, not a separate documentation authority. Source may exist both locally during active work and in GitHub.

## Accessibility & Inclusion

Keyboard operation, visible focus, semantic labeling, error recovery, overlay focus management, and reduced-motion support are required for the initial gallery.
