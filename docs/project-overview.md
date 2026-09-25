# Foundry — Project Overview

## Project identity

| Field | Value |
|---|---|
| Project name | Foundry |
| Repository | https://github.com/jmiedreich-ux/Foundry |
| Responsible architect | Foundry owner, with the Codex coordinator acting as delegated technical architect where recorded |
| Document version | 1 |

## Purpose

Foundry is an independent React and TypeScript control library with a working gallery. It gives design-system authors, product engineers, and quality reviewers reusable controls whose documented behavior can be exercised before adoption by a product.

## Overall scope

| Boundary | Description |
|---|---|
| Included | Core v1 foundations, fields, actions, selection controls, search, feedback, overlays, navigation, the default skin, the executable Control Gallery, installable-package preparation, and release acceptance evidence. |
| Excluded | Product-specific adoption, a theme editor, unplanned control families, and all Vennusign code, components, styles, tokens, tests, migration layers, and compatibility behavior. The proposed Front of House skin remains post-Core work. |

## Current state

| Capability or area | Current condition | Evidence level | Evidence or authoritative source | Known missing prerequisites |
|---|---|---|---|---|
| Gallery foundation and test harness | Complete. The React gallery starts, exposes reachable control families, supports reduced motion, and runs against a real browser harness. | Verified in operation | `docs/features/control-gallery/milestones/gallery-foundation.md`; `docs/features/control-gallery/done-ledger.md#M1` | None for the accepted milestone. |
| Foundations and field controls | Complete. Label, validation, controlled and uncontrolled state, reset, focus, disabled, invalid, long-label, and narrow-width paths have accepted evidence. | Verified in operation | `docs/features/control-gallery/milestones/field-controls.md`; `docs/features/control-gallery/done-ledger.md#M2` | None for the accepted milestone. |
| Actions, selection, search, and feedback | Complete with accepted gallery, browser, visual-review, independent-review, and owner-acceptance evidence. | Verified in operation | `docs/features/control-gallery/milestones/interactions-and-feedback.md`; `docs/features/control-gallery/done-ledger.md#M3` | None for the accepted milestone. |
| Overlay and navigation controls | Partially complete through accepted Popover browser coverage. Menu, Tabs, and Card browser checks remain, and Menu work is paused by the owner. | Verified in operation for the completed portion | `docs/features/control-gallery/milestones/overlays-and-navigation.md`; GitHub issue `#6` | Resolve the architecture dispositions, lift the owner pause, complete the remaining browser checks, and obtain independent review and owner acceptance. |
| Core v1 quality architecture | The default branch establishes that Core v1 is an installable package and identifies release-gate and cross-control correction work. A more detailed architecture is published in draft pull request `#59` but is not part of this `main` snapshot. | Supported by source inspection | `docs/features/control-gallery/decisions.md#quality-baseline-and-delivery-direction`; draft pull request `#59` | Reconcile or merge the draft architecture; resolve its remaining token-and-skin completeness finding; define and review the package and executable-gate contract. |
| Cross-control acceptance and release | Not started. The intended outcome is recorded, but its final evidence plan depends on the unfinished architecture and overlay/navigation work. | Not applicable for unbuilt work | `docs/features/control-gallery/milestones/acceptance-and-release.md`; GitHub issue `#7` | Complete all preceding stages; finalize acceptance coverage, packaging, CI, packed-consumer proof, browser and assistive-technology evidence, onboarding documentation, and the release license. |

The default branch and draft pull request `#59` describe different architecture maturity. Registration assessment must use one exact revision and must not treat the draft-only contracts as approved `main` content until they are reconciled or merged.

## Authoritative sources

| Source type | Subject or designation | Repository-relative location |
|---|---|---|
| Product definition | Foundry purpose, users, scope, and principles | `PRODUCT.md` |
| Architecture | Control Gallery architecture and current quality direction | `docs/features/control-gallery/decisions.md` |
| Milestone declaration | M1 — Gallery foundation and test harness | `docs/features/control-gallery/milestones/gallery-foundation.md` |
| Milestone declaration | M2 — Foundations and field controls | `docs/features/control-gallery/milestones/field-controls.md` |
| Milestone declaration | M3 — Actions, selection, search, and feedback | `docs/features/control-gallery/milestones/interactions-and-feedback.md` |
| Milestone declaration | M4 — Overlay and navigation controls | `docs/features/control-gallery/milestones/overlays-and-navigation.md` |
| Milestone declaration | M5 — Cross-control acceptance and release handoff | `docs/features/control-gallery/milestones/acceptance-and-release.md` |

## Unresolved information

| Missing or conflicting information | Affected source or capability | Clarification needed |
|---|---|---|
| Draft pull request `#59` is 21 commits ahead of `main` and contains architecture contracts and delivery changes that are absent from this default-branch snapshot. | Architecture authority and registration source revision | Merge, replace, or otherwise reconcile the draft, then freeze one exact revision for registration assessment. |
| The token-and-skin recipe inventory in draft pull request `#59` retains a blocking completeness finding. | Default skin, token generation, and bounded implementation preparation | Decide whether to authorize one further bounded correction and targeted recheck or explicitly accept the material limitation. |
| Artifact layout, exports, dependency placement, supported environments, canonical commands, pass criteria, and retained evidence are not fixed in an approved package and executable-gate contract. | Installable Core v1, CI, consumer proof, and release handoff | Define and independently review the manifest matrix and command-to-gate table before package or workflow implementation begins. |
| Menu, Tabs, and Card browser checks are incomplete, and Menu work remains owner-paused. | Overlay and navigation milestone | Complete the architecture prerequisites, obtain owner direction to resume, then finish and review the remaining browser evidence. |
| Cross-control acceptance is not yet planned against the final architecture. | Acceptance and release milestone | Reconcile the existing issue checklist with the approved control, skin, package, browser, assistive-technology, and packed-consumer gates. |
| No release license has been selected and published. | Package publication and consumer adoption | The Foundry owner must choose the license and align the repository license file and package metadata. |
