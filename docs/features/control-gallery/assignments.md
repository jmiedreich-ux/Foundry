# Control Gallery — advance assignment map

This is the complete planned labor allocation. **Local** means a bounded packet intended for a local coding agent after its dependencies are met. It is not an exception to `AGENTS.md`, and every returned change still receives the required verification and independent review.

| Milestone | Packet | Assigned role | Intended agent type | Local | Labor boundary |
| --- | --- | --- | --- | --- | --- |
| M1 | CG-M1-01 | Coordinator | Premium cloud coordinator | No | Workspace, package manifests, lockfile, build/test configuration. |
| M1 | CG-M1-02 | Coordinator / foundation specialist | Premium cloud coordinator | No | Shared Control Base, tokens, default skin, providers, English catalog, registry, and example-state contracts. |
| M1 | CG-M1-03 | Gallery agent | Local 24B–35B coding agent | Yes | React gallery shell and reusable example frame. |
| M1 | CG-M1-04 | Test agent | Local 9B–24B coding agent | Yes | Real-browser smoke specifications. |
| M2 | CG-M2-01 | Coordinator / foundation specialist | Premium cloud coordinator | No | Shared Field, Group, and validation contracts. |
| M2 | CG-M2-02 | Input-controls agent | Local 24B–35B coding agent | Yes | TextField and Select only. |
| M2 | CG-M2-03 | Gallery agent | Local 9B–24B coding agent | Yes | Field examples only. |
| M2 | CG-M2-04 | Test agent | Local 9B–24B coding agent | Yes | Field behavior tests only. |
| M3 | CG-M3-01 | Action-controls agent | Local 24B coding agent | Yes | Button variants and disabled/loading behavior. |
| M3 | CG-M3-02 | Choice-controls agent | Local 27B–35B coding agent | Yes | Checkbox, RadioGroup, Switch, and Search. |
| M3 | CG-M3-03 | Feedback-controls agent | Local 24B–35B coding agent | Yes | StatusChip, Banner, Toast, EmptyState, and LoadingSkeleton. |
| M3 | CG-M3-04 | Gallery agent | Local 24B coding agent | Yes | Action, choice, and feedback examples. |
| M3 | CG-M3-05 | Test agent | Local 24B coding agent | Yes | Action, choice, and feedback tests. |
| M4 | CG-M4-01 | Coordinator / overlay specialist | Premium cloud coordinator | No | Overlay root and shared focus/layer behavior; Dialog, Drawer, Popover, and Menu. |
| M4 | CG-M4-02 | Navigation agent | Local 24B coding agent | Yes | Tabs and Card. |
| M4 | CG-M4-03 | Gallery agent | Local 24B coding agent | Yes | Overlay and navigation examples. |
| M4 | CG-M4-04 | Test agent | Local 24B coding agent | Yes | Focus, Escape, dismissal, and keyboard tests. |
| M5 | CG-M5-01 | Test agent | Local 24B–35B coding agent | Yes | Cross-control browser path coverage. |
| M5 | CG-M5-02 | Accessibility audit agent | Local 9B–24B audit agent | Yes, audit only | Accessibility, responsive, overflow, and reduced-motion findings; implementation fixes are assigned to the owning area. |
| M5 | CG-M5-03 | Documentation agent | Local 9B coding agent | Yes | API/example documentation and explicit risk record. |
| M5 | CG-M5-04 | Coordinator + independent reviewer | Premium cloud coordinator + separate cloud reviewer | No | Final integration, review decision, ledger, and owner acceptance workbook. |

## Local-agent total

**15 of 21 packets** are intended for local agents. The remaining six stay with the coordinator or a stronger specialist because they own shared contracts, project configuration, cross-control focus/layer rules, or final acceptance.

## Execution limits

- Milestones remain sequential.
- Within a milestone, local packets may run concurrently only after dependencies complete and only when their owned paths do not overlap.
- Builds, browser tests, integration, review, tracker/status updates, and handoff are serialized by the coordinator.
- The intended agent type is a routing hypothesis. The performance report records the actual model/agent used and informs later owner-approved routing changes.
