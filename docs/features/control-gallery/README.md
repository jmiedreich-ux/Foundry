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
| M3 | Buttons, selection controls, search, and feedback | in progress; Button packets and Checkbox accepted; CG-M3-03 not yet started |
| M4 | Overlays and navigation controls | planned |
| M5 | Cross-control acceptance, accessibility, and release handoff | planned |

Each milestone is independently mergeable and uses the sequence: contracts/tokens → component behavior → gallery integration → browser specifications → independent review.

## Records

- [Decisions](decisions.md)
- [Question register](question-register.md)
- [Path coverage](path-coverage.md)
- [Milestones](milestones.md)
- [Advance assignment map](assignments.md)
- [Milestone performance reports](performance-reports.md)
- [Work packets](work-packets/README.md)
- [Done ledger](done-ledger.md)
