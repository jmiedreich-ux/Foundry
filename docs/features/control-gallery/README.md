# Control Gallery feature

## Purpose

The Control Gallery is Foundry's living acceptance surface. It demonstrates real behavior for every Core v1 control, so a developer or reviewer can exercise the contract before a product adopts it.

## Authority

`decisions.md` is the approved authority for this feature. This package and [`AGENTS.md`](../../../AGENTS.md) govern all milestone work.

## Delivery sequence

| Milestone | Outcome | Status |
| --- | --- | --- |
| M1 | Runnable gallery foundation and testing harness | completed |
| M2 | Foundational contracts and field controls | accepted and closed |
| M3 | Buttons, selection controls, search, and feedback | accepted and closed; behavior merged through PR #27 and visual follow-up through PR #31 |
| M4 | Overlays and navigation controls | CG-M4-01 in progress |
| M5 | Cross-control acceptance, accessibility, and release handoff | planned |

Each milestone is independently mergeable and uses the sequence: contracts/tokens → component behavior → gallery integration → browser specifications → independent review.

## Records

- [Decisions](decisions.md)
- [Question register](question-register.md)
- [Path coverage](path-coverage.md)
- [Milestones](milestones.md)
- [Advance assignment map](assignments.md)
- [Milestone performance reports](performance-reports.md)
- [Per-task reports](performance-reports.md#m3-packet-reports)
- [Work packets](work-packets/README.md)
- [Done ledger](done-ledger.md)
